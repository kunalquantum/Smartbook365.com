import { useState, useEffect, useRef } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const SOLUTES = {
    'KNO₃': { solAt20: 31.6, solAt80: 169, color: '#EF9F27' },
    'NaCl': { solAt20: 35.9, solAt80: 38.0, color: '#1D9E75' },
    'CuSO₄': { solAt20: 20.7, solAt80: 55.0, color: '#378ADD' },
    'KCl': { solAt20: 34.0, solAt80: 51.3, color: '#7F77DD' },
    'NaNO₃': { solAt20: 87.6, solAt80: 148, color: '#D85A30' },
}

export default function Filtration() {
    const [mode, setMode] = useState('filtration')  // filtration | crystallisation
    const [solute, setSolute] = useState('KNO₃')
    const [temp, setTemp] = useState(80)
    const [amount, setAmount] = useState(120)
    const [running, setRunning] = useState(false)
    const [phase, setPhase] = useState(0)  // 0=mixture, 1=filtering, 2=done
    const [coolT, setCoolT] = useState(80)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [tick, setTick] = useState(0)

    // Cooling animation
    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setCoolT(t => Math.max(20, t - 0.15))
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const t = tRef.current
    const data = SOLUTES[solute]

    // Solubility at current temp (linear interpolation)
    const solubility = (T) => {
        const t0 = 20, t1 = 80
        const s0 = data.solAt20, s1 = data.solAt80
        const clamped = Math.max(0, Math.min(100, T))
        return s0 + (s1 - s0) * ((clamped - t0) / (t1 - t0))
    }

    const solAtHot = solubility(temp)
    const solAtCool = solubility(coolT)
    const dissolved = Math.min(amount, solAtHot)
    const undissAt = Math.max(0, amount - solAtHot)

    // Crystals formed on cooling
    const crystals = Math.max(0, dissolved - solAtCool)
    const stillDiss = dissolved - crystals

    // Filtration state
    const [filtProgress, setFiltProgress] = useState(0)
    useEffect(() => {
        if (phase === 1) {
            let p = 0
            const iv = setInterval(() => {
                p += 0.02
                setFiltProgress(Math.min(1, p))
                if (p >= 1) { setPhase(2); clearInterval(iv) }
            }, 50)
            return () => clearInterval(iv)
        }
    }, [phase])

    // Solubility curve data
    const curvePoints = Array.from({ length: 81 }, (_, i) => ({
        T: 20 + i,
        S: solubility(20 + i),
    }))

    const CURVE_W = 300, CURVE_H = 140
    const CURVE_PAD = { l: 44, r: 16, t: 14, b: 30 }
    const CW = CURVE_W - CURVE_PAD.l - CURVE_PAD.r
    const CH = CURVE_H - CURVE_PAD.t - CURVE_PAD.b

    const maxS = Math.max(...curvePoints.map(p => p.S)) * 1.1
    const toX = T => CURVE_PAD.l + ((T - 20) / 80) * CW
    const toY = S => CURVE_PAD.t + CH - (S / maxS) * CH

    const curvePath = curvePoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.T).toFixed(1)},${toY(p.S).toFixed(1)}`
    ).join(' ')

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'filtration', l: 'Filtration' },
                    { k: 'crystallisation', l: 'Crystallisation' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px 10px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Solute selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(SOLUTES).map(k => (
                    <button key={k} onClick={() => setSolute(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: solute === k ? data.color : 'var(--bg3)',
                        color: solute === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${solute === k ? data.color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* ── FILTRATION MODE ── */}
            {mode === 'filtration' && (
                <>
                    <ChemSlider label="Temperature" unit=" °C" value={temp} min={20} max={100} step={1} onChange={setTemp} color="var(--coral)" />
                    <ChemSlider label="Amount of solute added" unit=" g / 100 g water" value={amount} min={5} max={200} step={5} onChange={setAmount} color={data.color} />

                    {/* Apparatus visual */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                        {/* Beaker + funnel */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 }}>
                                ⚗ BEAKER
                            </div>
                            <svg viewBox="0 0 140 160" width="100%">
                                {/* Beaker outline */}
                                <path d="M 25 20 L 20 140 L 120 140 L 115 20 Z"
                                    fill="rgba(55,138,221,0.06)"
                                    stroke="rgba(55,138,221,0.3)" strokeWidth={1.5} />

                                {/* Undissolved solid at bottom */}
                                {undissAt > 0 && (
                                    <rect x={22} y={130 - Math.min(30, undissAt / 5)} width={96} height={Math.min(30, undissAt / 5) + 10}
                                        rx={2} fill={`${data.color}40`} stroke={data.color} strokeWidth={0.5} />
                                )}

                                {/* Solution */}
                                <rect x={22} y={60} width={96} height={70}
                                    rx={2}
                                    fill={`${data.color}15`}
                                    stroke={`${data.color}25`} strokeWidth={0.5} />

                                {/* Undissolved label */}
                                {undissAt > 0 && (
                                    <text x={70} y={138} textAnchor="middle"
                                        style={{ fontSize: 8, fill: data.color, fontFamily: 'var(--mono)' }}>
                                        undissolved: {undissAt.toFixed(1)}g
                                    </text>
                                )}
                                <text x={70} y={95} textAnchor="middle"
                                    style={{ fontSize: 8, fill: `${data.color}90`, fontFamily: 'var(--mono)' }}>
                                    {dissolved.toFixed(1)}g dissolved
                                </text>
                                <text x={70} y={107} textAnchor="middle"
                                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                    in 100g H₂O
                                </text>

                                {/* Temperature indicator */}
                                <text x={70} y={18} textAnchor="middle"
                                    style={{ fontSize: 9, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                                    {temp}°C
                                </text>

                                {/* Thermometer */}
                                <line x1={112} y1={28} x2={112} y2={120}
                                    stroke="rgba(216,90,48,0.3)" strokeWidth={3} strokeLinecap="round" />
                                <line x1={112} y1={120} x2={112} y2={120 - (temp - 20) * 0.9}
                                    stroke="var(--coral)" strokeWidth={3} strokeLinecap="round" />
                            </svg>
                        </div>

                        {/* Filter funnel */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 }}>
                                ⚗ FILTER FUNNEL
                            </div>
                            <svg viewBox="0 0 140 160" width="100%">
                                {/* Filter paper cone */}
                                <path d="M 30 20 L 70 90 L 110 20 Z"
                                    fill="rgba(239,159,39,0.08)"
                                    stroke="rgba(239,159,39,0.4)" strokeWidth={1.5} />
                                {/* Fold lines */}
                                <line x1={70} y1={20} x2={70} y2={90}
                                    stroke="rgba(239,159,39,0.2)" strokeWidth={0.8} strokeDasharray="3 3" />

                                {/* Residue on filter (undissolved) */}
                                {undissAt > 0 && (
                                    <ellipse cx={70} cy={55} rx={20} ry={8}
                                        fill={`${data.color}40`}
                                        stroke={data.color} strokeWidth={1} />
                                )}
                                {undissAt > 0 && (
                                    <text x={70} y={58} textAnchor="middle"
                                        style={{ fontSize: 7, fill: data.color, fontFamily: 'var(--mono)' }}>
                                        residue
                                    </text>
                                )}

                                {/* Stem */}
                                <rect x={65} y={90} width={10} height={30}
                                    fill="rgba(55,138,221,0.15)"
                                    stroke="rgba(55,138,221,0.3)" strokeWidth={1} />

                                {/* Filtrate drops */}
                                {[0, 1, 2].map(i => (
                                    <circle key={i}
                                        cx={70} cy={130 + (i * 8)}
                                        r={3}
                                        fill={`${data.color}60`}
                                        opacity={0.8} />
                                ))}

                                {/* Conical flask */}
                                <path d="M 50 148 L 40 158 L 100 158 L 90 148 Z"
                                    fill={`${data.color}12`}
                                    stroke={`${data.color}30`} strokeWidth={1} />

                                <text x={70} y={156} textAnchor="middle"
                                    style={{ fontSize: 7, fill: `${data.color}80`, fontFamily: 'var(--mono)' }}>
                                    filtrate
                                </text>
                            </svg>
                        </div>
                    </div>

                    {/* Solubility insight */}
                    <div style={{
                        padding: '10px 14px', background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14,
                        fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)',
                    }}>
                        Solubility of {solute} at {temp}°C = <span style={{ color: data.color, fontWeight: 700 }}>{solubility(temp).toFixed(1)} g per 100 g water</span>
                        {undissAt > 0
                            ? <span style={{ color: 'var(--coral)' }}>  ·  {undissAt.toFixed(1)} g undissolved → caught by filter</span>
                            : <span style={{ color: 'var(--teal)' }}>  ·  fully dissolved — clear filtrate</span>}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Solubility at T" value={`${solubility(temp).toFixed(1)} g/100g`} color={data.color} highlight />
                        <ValueCard label="Dissolved" value={`${dissolved.toFixed(1)} g`} color="var(--teal)" />
                        <ValueCard label="Residue (filtered)" value={`${undissAt.toFixed(1)} g`} color="var(--coral)" />
                    </div>
                </>
            )}

            {/* ── CRYSTALLISATION MODE ── */}
            {mode === 'crystallisation' && (
                <>
                    <ChemSlider label="Initial temperature (hot)" unit=" °C" value={temp} min={40} max={100} step={5} onChange={setTemp} color="var(--coral)" />
                    <ChemSlider label="Solute dissolved at hot T" unit=" g/100g" value={amount} min={10} max={200} step={5} onChange={setAmount} color={data.color} />

                    {/* Two-panel: hot solution | cooling curve */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                        {/* Beaker cooling */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                                ⚗ COOLING BEAKER
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: 8 }}>
                                <span style={{
                                    fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: coolT > 60 ? 'var(--coral)' : coolT > 35 ? 'var(--gold)' : 'var(--blue,#378ADD)',
                                }}>
                                    {coolT.toFixed(1)}°C
                                </span>
                            </div>

                            {/* Beaker diagram */}
                            <svg viewBox="0 0 120 130" width="100%">
                                <path d="M 15 15 L 12 120 L 108 120 L 105 15 Z"
                                    fill="rgba(55,138,221,0.05)"
                                    stroke="rgba(55,138,221,0.3)" strokeWidth={1.5} />

                                {/* Solution fill level */}
                                <rect x={14} y={40} width={92} height={78}
                                    rx={2}
                                    fill={`${data.color}18`}
                                    stroke={`${data.color}20`} strokeWidth={0.5} />

                                {/* Crystal layer */}
                                {crystals > 0 && (
                                    <g>
                                        <rect x={14} y={120 - Math.min(50, crystals / 2)} width={92} height={Math.min(50, crystals / 2)}
                                            rx={2} fill={`${data.color}45`}
                                            stroke={data.color} strokeWidth={0.5} />
                                        {/* Crystal facets */}
                                        {Array.from({ length: Math.min(8, Math.floor(crystals / 8)) }, (_, i) => {
                                            const cx = 20 + i * 12
                                            const cy = 114
                                            return (
                                                <g key={i}>
                                                    <polygon
                                                        points={`${cx},${cy - 8} ${cx + 5},${cy} ${cx},${cy + 4} ${cx - 5},${cy}`}
                                                        fill={`${data.color}60`}
                                                        stroke={data.color} strokeWidth={0.8} />
                                                </g>
                                            )
                                        })}
                                        <text x={60} y={115} textAnchor="middle"
                                            style={{ fontSize: 8, fill: data.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                            {crystals.toFixed(1)}g crystals
                                        </text>
                                    </g>
                                )}

                                <text x={60} y={62} textAnchor="middle"
                                    style={{ fontSize: 8, fill: `${data.color}80`, fontFamily: 'var(--mono)' }}>
                                    {stillDiss.toFixed(1)}g in solution
                                </text>
                            </svg>

                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button onClick={() => { setRunning(p => !p) }} style={{
                                    flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: running ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.12)',
                                    color: running ? 'var(--coral)' : 'var(--gold)',
                                    border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
                                }}>{running ? '⏸ Pause' : '▶ Cool down'}</button>
                                <button onClick={() => { setCoolT(temp); setRunning(false) }} style={{
                                    padding: '6px 10px', borderRadius: 6, fontSize: 11,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                                }}>↺</button>
                            </div>
                        </div>

                        {/* Solubility curve */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                                SOLUBILITY CURVE
                            </div>
                            <svg viewBox={`0 0 ${CURVE_W} ${CURVE_H}`} width="100%">
                                {/* Curve */}
                                <path d={curvePath} fill="none" stroke={data.color} strokeWidth={2} />

                                {/* Area under curve */}
                                <path d={`${curvePath} L${toX(100)},${CURVE_PAD.t + CH} L${toX(20)},${CURVE_PAD.t + CH} Z`}
                                    fill={data.color} opacity={0.06} />

                                {/* Current point */}
                                <circle cx={toX(coolT)} cy={toY(solubility(coolT))} r={5}
                                    fill={data.color} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

                                {/* Amount line */}
                                {amount <= maxS && (
                                    <line x1={CURVE_PAD.l} y1={toY(amount)}
                                        x2={CURVE_PAD.l + CW} y2={toY(amount)}
                                        stroke="rgba(255,255,255,0.15)" strokeWidth={1}
                                        strokeDasharray="4 3" />
                                )}

                                {/* Axes */}
                                <line x1={CURVE_PAD.l} y1={CURVE_PAD.t} x2={CURVE_PAD.l} y2={CURVE_PAD.t + CH}
                                    stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                <line x1={CURVE_PAD.l} y1={CURVE_PAD.t + CH} x2={CURVE_PAD.l + CW} y2={CURVE_PAD.t + CH}
                                    stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />

                                {/* Axis labels */}
                                <text x={CURVE_PAD.l + CW} y={CURVE_PAD.t + CH + 16}
                                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>T °C</text>
                                <text x={CURVE_PAD.l - 4} y={CURVE_PAD.t + 8} textAnchor="end"
                                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>g/100g</text>

                                {/* Tick labels */}
                                {[20, 40, 60, 80, 100].map(T => (
                                    <text key={T} x={toX(T)} y={CURVE_PAD.t + CH + 12} textAnchor="middle"
                                        style={{ fontSize: 7, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                        {T}
                                    </text>
                                ))}

                                {/* Current T vertical line */}
                                <line x1={toX(coolT)} y1={CURVE_PAD.t} x2={toX(coolT)} y2={CURVE_PAD.t + CH}
                                    stroke={`${data.color}40`} strokeWidth={1} strokeDasharray="3 3" />
                            </svg>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Solubility at hot T" value={`${solubility(temp).toFixed(1)} g/100g`} color="var(--coral)" />
                        <ValueCard label={`Solubility at ${coolT.toFixed(0)}°C`} value={`${solAtCool.toFixed(1)} g/100g`} color="var(--blue,#378ADD)" />
                        <ValueCard label="Crystals formed" value={`${crystals.toFixed(2)} g`} color={data.color} highlight />
                        <ValueCard label="Still in solution" value={`${stillDiss.toFixed(2)} g`} color="var(--teal)" />
                    </div>
                </>
            )}
        </div>
    )
}