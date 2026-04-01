import { useState, useEffect, useRef, useMemo } from 'react'
import { ISOTOPES } from './helpers/nuclearData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const ln2 = Math.LN2

export default function DecayKinetics() {
    const [iso, setIso] = useState('C-14')
    const [N0, setN0] = useState(1000)
    const [tab, setTab] = useState('curve')   // curve | simulate | activity
    const [simTime, setSimTime] = useState(0)
    const [running, setRunning] = useState(false)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    const isotope = ISOTOPES[iso]
    const lambda = ln2 / isotope.t_half   // decay constant in per unit time

    // Units for time axis
    const TIME_UNITS = {
        'yr': { label: 'years', tMax: isotope.t_half * 5 },
        'days': { label: 'days', tMax: isotope.t_half * 5 },
        'hr': { label: 'hours', tMax: isotope.t_half * 5 },
    }
    const tu = TIME_UNITS[isotope.unit] || TIME_UNITS['yr']
    const tMax = tu.tMax

    // N(t) = N0 * e^(-λt)
    const Nat = t => N0 * Math.exp(-lambda * t)

    // Decay curve
    const curve = useMemo(() =>
        Array.from({ length: 80 }, (_, i) => {
            const t = (i / 79) * tMax
            return { t, N: Nat(t) }
        }), [iso, N0])

    // Current values
    const N_now = Nat(simTime)
    const decayed = N0 - N_now
    const activity = lambda * N_now   // in per unit time

    // Half-life marker positions
    const halfLives = [1, 2, 3, 4, 5].map(n => ({
        n, t: n * isotope.t_half, N: N0 / Math.pow(2, n)
    })).filter(p => p.t <= tMax)

    // Simulation animation
    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt * tMax * 0.05
            setSimTime(Math.min(tMax, tRef.current))
            if (tRef.current >= tMax) { setRunning(false); return }
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, tMax])

    const resetSim = () => {
        setSimTime(0); setRunning(false)
        tRef.current = 0; lastRef.current = null
    }

    // Graph
    const W = 360, H = 140, GP = { l: 44, r: 12, t: 12, b: 28 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const toX = t => GP.l + (t / tMax) * PW
    const toY = N => GP.t + PH - (N / N0) * PH
    const curvePath = curve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t).toFixed(1)},${toY(p.N).toFixed(1)}`).join(' ')

    // Atom grid for simulation
    const GRID_N = 20 * 20
    const nActive = Math.round(N_now / N0 * GRID_N)

    return (
        <div>
            {/* Isotope selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.entries(ISOTOPES).filter(([, v]) => !v.stable).map(([k, v]) => (
                    <button key={k} onClick={() => { setIso(k); resetSim() }} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: iso === k ? v.color : 'var(--bg3)',
                        color: iso === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${iso === k ? v.color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Info bar */}
            <div style={{ display: 'flex', gap: 10, padding: '8px 14px', background: `${isotope.color}10`, border: `1px solid ${isotope.color}30`, borderRadius: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: isotope.color, fontWeight: 700 }}>{iso}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>t½ = {isotope.t_half.toLocaleString()} {isotope.unit}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>decay: {isotope.decay}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>daughter: {isotope.daughter}</span>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'curve', l: 'Decay curve' }, { k: 'simulate', l: 'Atom simulation' }, { k: 'activity', l: 'Activity & λ' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? isotope.color : 'var(--bg3)',
                        color: tab === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? isotope.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            <ChemSlider label={`N₀ (initial atoms)`} unit="" value={N0} min={100} max={5000} step={100} onChange={v => { setN0(v); resetSim() }} color={isotope.color} />

            {/* ── DECAY CURVE ── */}
            {tab === 'curve' && (
                <div>
                    {/* Slider for time */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                Time = {simTime.toFixed(1)} {isotope.unit}
                            </span>
                            <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: isotope.color }}>
                                N(t) = {N_now.toFixed(0)} atoms remaining
                            </span>
                        </div>
                        <input type="range" min={0} max={tMax} step={tMax / 200}
                            value={simTime} onChange={e => setSimTime(Number(e.target.value))}
                            style={{ width: '100%', accentColor: isotope.color }} />
                    </div>

                    {/* Graph */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: isotope.color, letterSpacing: 2, marginBottom: 8 }}>
                            N(t) = N₀ · e^(−λt)  ·  λ = {lambda.toExponential(3)} / {isotope.unit}
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {/* Half-life grid lines */}
                            {halfLives.map(p => (
                                <g key={p.n}>
                                    <line x1={toX(p.t)} y1={GP.t} x2={toX(p.t)} y2={GP.t + PH}
                                        stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
                                    <line x1={GP.l} y1={toY(p.N)} x2={GP.l + PW} y2={toY(p.N)}
                                        stroke="rgba(255,255,255,0.05)" strokeWidth={0.8} />
                                    <text x={toX(p.t)} y={GP.t + PH + 14} textAnchor="middle"
                                        style={{ fontSize: 7, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                        t½×{p.n}
                                    </text>
                                    <text x={GP.l - 3} y={toY(p.N) + 3} textAnchor="end"
                                        style={{ fontSize: 7, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                        N₀/{Math.pow(2, p.n)}
                                    </text>
                                </g>
                            ))}

                            {/* Area under curve (decayed portion) */}
                            <path d={`${curvePath} L${toX(tMax)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                fill={isotope.color} opacity={0.06} />

                            {/* Curve */}
                            <path d={curvePath} fill="none" stroke={isotope.color} strokeWidth={2.5} />

                            {/* Current point */}
                            <circle cx={toX(simTime)} cy={toY(N_now)} r={6}
                                fill={isotope.color} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />

                            {/* Crosshairs */}
                            <line x1={toX(simTime)} y1={GP.t} x2={toX(simTime)} y2={GP.t + PH}
                                stroke={`${isotope.color}50`} strokeWidth={1} strokeDasharray="3 3" />
                            <line x1={GP.l} y1={toY(N_now)} x2={GP.l + PW} y2={toY(N_now)}
                                stroke={`${isotope.color}50`} strokeWidth={1} strokeDasharray="3 3" />

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>t ({isotope.unit})</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>N(t)</text>
                        </svg>
                    </div>

                    {/* Remaining/decayed */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ padding: '10px 14px', background: `${isotope.color}12`, border: `1px solid ${isotope.color}30`, borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>Remaining</div>
                            <div style={{ height: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
                                <div style={{ height: '100%', width: `${(N_now / N0) * 100}%`, background: isotope.color, borderRadius: 6, transition: 'width 0.1s' }} />
                            </div>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: isotope.color }}>
                                {N_now.toFixed(0)} atoms ({((N_now / N0) * 100).toFixed(1)}%)
                            </div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>Decayed</div>
                            <div style={{ height: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
                                <div style={{ height: '100%', width: `${(decayed / N0) * 100}%`, background: 'rgba(216,90,48,0.7)', borderRadius: 6, transition: 'width 0.1s' }} />
                            </div>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)' }}>
                                {decayed.toFixed(0)} atoms ({((decayed / N0) * 100).toFixed(1)}%)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ATOM SIMULATION ── */}
            {tab === 'simulate' && (
                <div>
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${isotope.color}30`, borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: isotope.color, letterSpacing: 2 }}>
                                ATOM GRID — each dot = {Math.ceil(N0 / GRID_N)} atoms
                            </span>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: isotope.color }}>
                                {nActive} / {GRID_N} active
                            </span>
                        </div>

                        {/* 20×20 grid of atoms */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20,1fr)', gap: 2 }}>
                            {Array.from({ length: GRID_N }, (_, i) => {
                                const active2 = i < nActive
                                return (
                                    <div key={i} style={{
                                        aspectRatio: '1',
                                        borderRadius: '50%',
                                        background: active2 ? isotope.color : 'rgba(216,90,48,0.2)',
                                        border: `0.5px solid ${active2 ? `${isotope.color}80` : 'rgba(216,90,48,0.1)'}`,
                                        transition: 'background 0.1s, border 0.1s',
                                    }} />
                                )
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 10, fontFamily: 'var(--mono)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: isotope.color }} />
                                <span style={{ color: isotope.color }}>Active {iso}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'rgba(216,90,48,0.3)' }} />
                                <span style={{ color: 'var(--coral)' }}>Decayed → {isotope.daughter}</span>
                            </div>
                        </div>
                    </div>

                    {/* Time display + controls */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Elapsed time</span>
                            <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: isotope.color }}>
                                {simTime.toFixed(1)} {isotope.unit}  ({(simTime / isotope.t_half).toFixed(2)} t½)
                            </span>
                        </div>
                        <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
                            <div style={{ height: '100%', width: `${(simTime / tMax) * 100}%`, background: isotope.color, borderRadius: 4, transition: 'width 0.1s' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => { setRunning(p => !p) }} style={{
                                flex: 1, padding: '7px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: running ? `${isotope.color}20` : `${isotope.color}12`,
                                color: isotope.color, border: `1px solid ${isotope.color}40`,
                            }}>{running ? '⏸ Pause' : simTime === 0 ? '▶ Start decay' : '▶ Resume'}</button>
                            <button onClick={resetSim} style={{
                                flex: 1, padding: '7px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                            }}>↺ Reset</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ACTIVITY ── */}
            {tab === 'activity' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.8 }}>
                        Activity A = λN = (ln2/t½) × N(t)  ·  Unit: Becquerel (Bq) = 1 decay/s
                        <br />Curie: 1 Ci = 3.7 × 10¹⁰ Bq (activity of 1g Ra-226)
                    </div>

                    {/* Activity vs time curve */}
                    {(() => {
                        const actCurve = curve.map(p => ({ t: p.t, A: lambda * p.N }))
                        const maxA = lambda * N0
                        const toYa = A => GP.t + PH - (A / maxA) * PH
                        const actPath = actCurve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t).toFixed(1)},${toYa(p.A).toFixed(1)}`).join(' ')

                        return (
                            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 2, marginBottom: 8 }}>
                                    ACTIVITY vs TIME
                                </div>
                                <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                                    <path d={`${actPath} L${toX(tMax)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                        fill="var(--gold)" opacity={0.07} />
                                    <path d={actPath} fill="none" stroke="var(--gold)" strokeWidth={2.5} />
                                    <circle cx={toX(simTime)} cy={toYa(activity)} r={6}
                                        fill="var(--gold)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                                    <line x1={toX(simTime)} y1={GP.t} x2={toX(simTime)} y2={GP.t + PH}
                                        stroke="rgba(212,160,23,0.5)" strokeWidth={1} strokeDasharray="3 3" />
                                    <line x1={GP.l} y1={toYa(activity)} x2={GP.l + PW} y2={toYa(activity)}
                                        stroke="rgba(212,160,23,0.5)" strokeWidth={1} strokeDasharray="3 3" />
                                    <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                                    <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                                    <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>t ({isotope.unit})</text>
                                    <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>A</text>
                                </svg>
                            </div>
                        )
                    })()}

                    {/* Drag time slider */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>t = {simTime.toFixed(1)} {isotope.unit}</span>
                            <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>A = {activity.toExponential(3)} / {isotope.unit}</span>
                        </div>
                        <input type="range" min={0} max={tMax} step={tMax / 200}
                            value={simTime} onChange={e => setSimTime(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--gold)' }} />
                    </div>

                    {/* λ calculation breakdown */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.9 }}>
                        λ = ln2 / t½ = 0.693 / {isotope.t_half.toLocaleString()} {isotope.unit} = <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{lambda.toExponential(4)} /{isotope.unit}</span>
                        <br />N(t) = {N0} × e^(−{lambda.toExponential(3)}×{simTime.toFixed(1)}) = <span style={{ color: isotope.color, fontWeight: 700 }}>{N_now.toFixed(2)}</span>
                        <br />A(t) = λN = {lambda.toExponential(3)} × {N_now.toFixed(2)} = <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{activity.toExponential(3)} /{isotope.unit}</span>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Isotope" value={iso} color={isotope.color} highlight />
                <ValueCard label="t½" value={`${isotope.t_half.toLocaleString()} ${isotope.unit}`} color={isotope.color} />
                <ValueCard label="N(t)" value={`${N_now.toFixed(0)} atoms`} color="var(--teal)" />
                <ValueCard label="Activity" value={activity.toExponential(3)} color="var(--gold)" />
            </div>
        </div>
    )
}