import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const MU0 = 4 * Math.PI * 1e-7

export default function InductanceSim() {
    const [mode, setMode] = useState('self')    // self | mutual
    const [N1, setN1] = useState(500)
    const [N2, setN2] = useState(300)
    const [A, setA] = useState(10)        // cm²
    const [l, setL_] = useState(20)        // cm
    const [I, setI] = useState(2)         // A
    const [dIdt, setDIdt] = useState(10)        // A/s rate of change
    const [k, setK] = useState(0.8)       // coupling coefficient
    const [running, setRunning] = useState(true)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const t = tRef.current
    const A_m = A * 1e-4
    const l_m = l * 1e-2

    // Self inductance
    const L1 = MU0 * N1 * N1 * A_m / l_m
    const L2 = MU0 * N2 * N2 * A_m / l_m
    const M = k * Math.sqrt(L1 * L2)

    // Current waveform (sinusoidal)
    const omega = 2 * Math.PI * 2   // 2 Hz
    const I_t = I * Math.sin(omega * t)
    const dI_dt_t = I * omega * Math.cos(omega * t)

    // Self EMF: ε_L = −L dI/dt
    const emf_self = -L1 * dI_dt_t
    // Mutual EMF: ε_M = −M dI/dt
    const emf_mutual = -M * dI_dt_t

    // Energy stored
    const U = 0.5 * L1 * I_t * I_t

    // Graph dimensions
    const GW = W - 40, GH = 80
    const GX = 20, GY = H - GH - 20

    // History
    const histI = useRef(Array(200).fill(0))
    const histEMF = useRef(Array(200).fill(0))
    histI.current = [...histI.current.slice(1), I_t]
    histEMF.current = [...histEMF.current.slice(1), mode === 'self' ? emf_self : emf_mutual]

    const plotLine = (data, maxVal, color, GX, GY, GW, GH) => {
        if (maxVal === 0) return null
        const pts = data.map((v, i) =>
            `${GX + (i / 200) * GW},${GY + GH / 2 - (v / maxVal) * GH * 0.45}`
        ).join(' ')
        return <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    }

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    // Coil drawing helper
    const CoilWinding = ({ x, y, n, w, h, color, label, current }) => {
        const turns = Math.min(10, Math.max(3, Math.round(n / 100)))
        return (
            <g>
                {Array.from({ length: turns }, (_, i) => {
                    const cx = x + (i / turns) * w + w / (turns * 2)
                    const glowAlpha = Math.min(0.7, Math.abs(current) / (I + 0.1))
                    return (
                        <ellipse key={i} cx={cx} cy={y} rx={w / (turns * 2.2)} ry={h / 2}
                            fill="none"
                            stroke={`rgba(${color},${0.3 + glowAlpha * 0.5})`}
                            strokeWidth={2} />
                    )
                })}
                <rect x={x} y={y - h / 2} width={w} height={h}
                    rx={3} fill="none"
                    stroke={`rgba(${color},0.15)`} strokeWidth={1} strokeDasharray="3 2" />
                <text x={x + w / 2} y={y + h / 2 + 16} textAnchor="middle"
                    style={{ fontSize: 10, fill: `rgba(${color},0.8)`, fontFamily: 'var(--mono)' }}>
                    {label}
                </text>
            </g>
        )
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['self', 'mutual'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'self' ? 'Self Inductance' : 'Mutual Inductance'}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Turns N₁" unit="" value={N1} min={50} max={2000} step={50} onChange={setN1} />
                {mode === 'mutual' && <SimSlider label="Turns N₂" unit="" value={N2} min={50} max={2000} step={50} onChange={setN2} />}
                <SimSlider label="Area A" unit=" cm²" value={A} min={1} max={50} step={1} onChange={setA} />
                <SimSlider label="Length l" unit=" cm" value={l} min={5} max={100} step={1} onChange={setL_} />
                <SimSlider label="Peak I" unit=" A" value={I} min={0.1} max={10} step={0.1} onChange={setI} />
                {mode === 'mutual' && <SimSlider label="Coupling k" unit="" value={k} min={0.1} max={1} step={0.05} onChange={setK} />}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('ind1', '#EF9F27')}
                    {arrowDef('ind2', '#1D9E75')}
                </defs>

                {/* Coil 1 */}
                <CoilWinding x={mode === 'self' ? 150 : 80} y={100} n={N1} w={mode === 'self' ? 160 : 140}
                    h={70} color="239,159,39" label={`L₁=${(L1 * 1000).toFixed(2)}mH`}
                    current={I_t} />

                {mode === 'mutual' && (
                    <>
                        {/* Flux linkage arrow */}
                        <line x1={230} y1={100} x2={250} y2={100}
                            stroke={`rgba(239,159,39,${Math.abs(I_t / I) * 0.6})`}
                            strokeWidth={2} markerEnd="url(#ind1)" />

                        {/* Coil 2 */}
                        <CoilWinding x={260} y={100} n={N2} w={140} h={70}
                            color="29,158,117"
                            label={`L₂=${(L2 * 1000).toFixed(2)}mH  M=${(M * 1000).toFixed(2)}mH`}
                            current={emf_mutual * 10} />

                        {/* Coupling label */}
                        <text x={W / 2} y={40} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                            k = {k}  |  M = k√(L₁L₂) = {(M * 1000).toFixed(3)} mH
                        </text>
                    </>
                )}

                {/* Iron core */}
                <rect x={mode === 'self' ? 148 : 78} y={90}
                    width={mode === 'self' ? 164 : 324} height={8}
                    rx={2} fill="rgba(160,176,200,0.15)"
                    stroke="rgba(160,176,200,0.2)" strokeWidth={1} />

                {/* Current arrow */}
                <line x1={80} y1={160} x2={140} y2={160}
                    stroke={`rgba(239,159,39,${Math.abs(I_t / I) * 0.8})`}
                    strokeWidth={1.5} markerEnd="url(#ind1)" />
                <text x={110} y={174} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    I={I_t.toFixed(3)}A
                </text>

                {/* Back-EMF label */}
                <text x={mode === 'self' ? 230 : W / 2} y={175} textAnchor="middle"
                    style={{ fontSize: 10, fill: mode === 'self' ? '#EF9F27' : '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    ε = {mode === 'self' ? emf_self.toFixed(4) : emf_mutual.toFixed(4)} V
                </text>

                {/* Graphs */}
                <rect x={GX} y={GY} width={GW} height={GH}
                    rx={3} fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                <line x1={GX} y1={GY + GH / 2} x2={GX + GW} y2={GY + GH / 2}
                    stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} />

                {plotLine(histI.current, I + 0.01, 'rgba(239,159,39,0.6)', GX, GY, GW, GH)}
                {plotLine(histEMF.current,
                    Math.max(Math.abs(emf_self), Math.abs(emf_mutual), 0.001) * 1.2,
                    mode === 'self' ? 'rgba(216,90,48,0.7)' : 'rgba(29,158,117,0.7)',
                    GX, GY, GW, GH)}

                <text x={GX + 4} y={GY + 12}
                    style={{ fontSize: 8, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>I(t)</text>
                <text x={GX + 4} y={GY + 24}
                    style={{ fontSize: 8, fill: mode === 'self' ? 'rgba(216,90,48,0.5)' : 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>ε(t)</text>
            </svg>

            <button onClick={() => setRunning(p => !p)} style={{
                padding: '6px 20px', borderRadius: 8, fontSize: 12,
                fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                background: running ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.15)',
                color: running ? 'var(--coral)' : 'var(--teal)',
                border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
            }}>
                {running ? '⏸ Pause' : '▶ Resume'}
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'self' ? [
                    { label: 'L₁ = μ₀N²A/l', val: `${(L1 * 1000).toFixed(3)} mH`, color: 'var(--amber)' },
                    { label: 'ε = −L dI/dt', val: `${emf_self.toFixed(4)} V`, color: 'var(--coral)' },
                    { label: 'U = ½LI²', val: `${(U * 1e6).toFixed(3)} μJ`, color: 'var(--teal)' },
                    { label: 'dI/dt now', val: `${dI_dt_t.toFixed(3)} A/s`, color: 'var(--text2)' },
                ] : [
                    { label: 'L₁', val: `${(L1 * 1000).toFixed(3)} mH`, color: 'var(--amber)' },
                    { label: 'M = k√(L₁L₂)', val: `${(M * 1000).toFixed(3)} mH`, color: 'var(--teal)' },
                    { label: 'ε₂ = −M dI₁/dt', val: `${emf_mutual.toFixed(4)} V`, color: 'var(--coral)' },
                    { label: 'Coupling k', val: `${k} (1=perfect)`, color: 'var(--text2)' },
                ]).map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}