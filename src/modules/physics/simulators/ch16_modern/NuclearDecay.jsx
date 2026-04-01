import { useState, useEffect, useRef, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const PAD = { l: 50, r: 20, t: 20, b: 36 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

const ISOTOPES = {
    'C-14  (β⁻)': { Z: 6, A: 14, T_half: 5730, type: 'beta', color: '#EF9F27', daughter: 'N-14' },
    'U-238 (α)': { Z: 92, A: 238, T_half: 4.47e9, type: 'alpha', color: '#D85A30', daughter: 'Th-234' },
    'Ra-226 (α)': { Z: 88, A: 226, T_half: 1600, type: 'alpha', color: '#7F77DD', daughter: 'Rn-222' },
    'I-131 (β⁻)': { Z: 53, A: 131, T_half: 8.02, type: 'beta', color: '#1D9E75', daughter: 'Xe-131' },
    'Co-60 (β⁻γ)': { Z: 27, A: 60, T_half: 5.27, type: 'gamma', color: '#378ADD', daughter: 'Ni-60' },
}

export default function NuclearDecay() {
    const [isotope, setIsotope] = useState('C-14  (β⁻)')
    const [N0, setN0] = useState(1000)
    const [tMax, setTMax] = useState(3)      // in half-lives
    const [running, setRunning] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    const iso = ISOTOPES[isotope]
    const lam = Math.LN2 / iso.T_half    // decay constant

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            // 1 second real = 0.3 half-lives simulated
            const simT = tRef.current * 0.3
            setElapsed(simT)
            if (simT >= tMax) { setRunning(false); return }
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, tMax])

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setRunning(false)
        tRef.current = 0
        setElapsed(0)
        lastRef.current = null
    }

    // Current N (in half-lives)
    const t_hl = elapsed    // time in half-lives
    const N_t = N0 * Math.pow(0.5, t_hl)
    const D_t = N0 - N_t   // daughter nuclei
    const A_t = lam * N_t  // activity (in units of 1/T_half)

    // Curve points
    const nPts = 100
    const curve = Array.from({ length: nPts + 1 }, (_, i) => {
        const th = (i / nPts) * tMax
        return { th, N: N0 * Math.pow(0.5, th) }
    })

    const toSX = th => PAD.l + (th / tMax) * PW
    const toSY = N => PAD.t + PH - (N / N0) * PH

    const pathD = curve.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSX(p.th).toFixed(1)},${toSY(p.N).toFixed(1)}`
    ).join(' ')

    // Half-life tick marks
    const halfLifeTicks = Array.from({ length: Math.floor(tMax) + 1 }, (_, i) => i)

    // Nucleus grid
    const nNucleiShow = Math.min(100, N0)
    const nRemaining = Math.round(nNucleiShow * N_t / N0)
    const gridCols = 10
    const nucSize = 7

    return (
        <div>
            {/* Isotope selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(ISOTOPES).map(k => (
                    <button key={k} onClick={() => { setIsotope(k); reset() }} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: isotope === k ? ISOTOPES[k].color : 'var(--bg3)',
                        color: isotope === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${isotope === k ? ISOTOPES[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="N₀ (initial)" unit="" value={N0} min={10} max={1000} step={10} onChange={v => { setN0(v); reset() }} />
                <SimSlider label="Time span" unit=" T½" value={tMax} min={1} max={6} step={0.5} onChange={v => { setTMax(v); reset() }} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* Decay curve */}
                <path d={pathD} fill="none" stroke={iso.color} strokeWidth={2.5} />

                {/* Area fill */}
                <path d={`${pathD} L${toSX(tMax)},${PAD.t + PH} L${PAD.l},${PAD.t + PH} Z`}
                    fill={iso.color} opacity={0.06} />

                {/* Half-life vertical dashes */}
                {halfLifeTicks.map(hl => (
                    <g key={hl}>
                        <line x1={toSX(hl)} y1={PAD.t} x2={toSX(hl)} y2={PAD.t + PH}
                            stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} strokeDasharray="3 3" />
                        <text x={toSX(hl)} y={PAD.t + PH + 14} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                            {hl}T½
                        </text>
                    </g>
                ))}

                {/* Current point */}
                <circle cx={toSX(t_hl)} cy={toSY(N_t)} r={7}
                    fill={iso.color} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* N/2 guideline */}
                <line x1={PAD.l} y1={toSY(N0 / 2)} x2={PAD.l + PW} y2={toSY(N0 / 2)}
                    stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={PAD.l - 4} y={toSY(N0 / 2) + 4} textAnchor="end"
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>N₀/2</text>

                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={PAD.l - 4} y={PAD.t + 8} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>N</text>

                {/* N0 label */}
                <text x={PAD.l - 4} y={PAD.t + PH} textAnchor="end"
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>0</text>

                {/* Daughter nuclei label */}
                <text x={PAD.l + PW - 4} y={PAD.t + 20} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    → {iso.daughter}
                </text>

                {/* Nucleus grid (right of graph if space, else below) */}
                {Array.from({ length: nNucleiShow }, (_, i) => {
                    const col = i % gridCols
                    const row = Math.floor(i / gridCols)
                    const nx = W - 110 + col * (nucSize + 2)
                    const ny = PAD.t + 10 + row * (nucSize + 2)
                    const alive = i < nRemaining
                    return (
                        <circle key={i} cx={nx} cy={ny} r={nucSize / 2}
                            fill={alive ? iso.color : 'rgba(160,176,200,0.08)'}
                            opacity={alive ? 0.8 : 0.3} />
                    )
                })}
                <text x={W - 55} y={PAD.t + PH - 6} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                    nuclei
                </text>
            </svg>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => {
                    if (elapsed >= tMax) reset()
                    setRunning(p => !p)
                }} style={{
                    padding: '7px 22px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: running ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.15)',
                    color: running ? 'var(--coral)' : 'var(--amber)',
                    border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
                }}>
                    {running ? '⏸ Pause' : elapsed > 0 ? '▶ Resume' : '▶ Start decay'}
                </button>
                <button onClick={reset} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'N(t) remaining', val: `${Math.round(N_t)}`, color: iso.color },
                    { label: 'Decayed → daughter', val: `${Math.round(D_t)}`, color: 'var(--teal)' },
                    { label: 'Activity A=λN', val: `${(A_t * N0).toExponential(2)}/T½`, color: 'var(--amber)' },
                    { label: 'Half-life T½', val: `${iso.T_half >= 1e6 ? (iso.T_half / 1e9).toFixed(2) + 'Gy' : iso.T_half >= 1000 ? (iso.T_half).toFixed(0) + 'y' : iso.T_half.toFixed(2) + 'y'}`, color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}