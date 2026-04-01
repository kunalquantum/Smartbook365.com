import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const MATERIALS = {
    Diamagnetic: { chi: -1e-5, color: '#378ADD', muR: 0.99999, desc: 'Weakly repels B field — induced moments oppose B', domains: false },
    Paramagnetic: { chi: 1e-4, color: '#1D9E75', muR: 1.0001, desc: 'Weakly attracted — random moments align with B', domains: false },
    Ferromagnetic: { chi: 1000, color: '#EF9F27', muR: 1001, desc: 'Strongly magnetized — large aligned domains', domains: true },
}

// Hysteresis loop control points (normalised -1..1)
const LOOP_PTS = [
    [0, 0], [0.3, 0.5], [0.6, 0.85], [1, 1],
    [0.6, 0.95], [0.3, 0.8], [0, -0.1],
    [-0.3, -0.8], [-0.6, -0.95], [-1, -1],
    [-0.6, -0.85], [-0.3, -0.5], [0, 0.1], [0.3, 0.8], [0.6, 0.95], [1, 1],
]

const W_GRAPH = 280, H_GRAPH = 220
const GX = 130, GY = 40
const MID_X = GX + W_GRAPH / 2, MID_Y = GY + H_GRAPH / 2

export default function MagneticMatter() {
    const [mat, setMat] = useState('Ferromagnetic')
    const [H_ext, setHext] = useState(0)   // external H field -100..100
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const tRef = useRef(0)
    const [animating, setAnimating] = useState(false)

    useEffect(() => {
        if (!animating) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setHext(Math.round(Math.sin(tRef.current * 1.5) * 100))
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [animating])

    const m = MATERIALS[mat]

    // M from H (simplified hysteresis for ferro)
    const getM = (H) => {
        if (mat !== 'Ferromagnetic') return m.chi * H
        // Tanh-based hysteresis approximation
        const sat = 1e6
        return sat * Math.tanh(H / 30)
    }
    const M_val = getM(H_ext)
    const B_val = 4 * Math.PI * 1e-7 * (H_ext + M_val)

    // Hysteresis loop path in SVG
    const loopPath = LOOP_PTS.map((pt, i) => {
        const x = MID_X + pt[0] * W_GRAPH * 0.45
        const y = MID_Y - pt[1] * H_GRAPH * 0.45
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    // Current point on loop
    const h_norm = H_ext / 100
    const m_norm = Math.tanh(H_ext / 30)
    const cpX = MID_X + h_norm * W_GRAPH * 0.45
    const cpY = MID_Y - m_norm * H_GRAPH * 0.45

    // Domain arrows
    const nDomains = 16
    const domains = Array.from({ length: 4 }, (_, row) =>
        Array.from({ length: 4 }, (_, col) => {
            const baseAngle = mat === 'Ferromagnetic'
                ? (H_ext > 0 ? 0 : H_ext < 0 ? Math.PI : (row + col) % 2 * Math.PI)
                : Math.random() * 2 * Math.PI
            const alignedAngle = mat === 'Ferromagnetic'
                ? Math.atan2(Math.sin(baseAngle) * 0.2, Math.cos(baseAngle) * 0.8 + H_ext / 100)
                : baseAngle
            return { row, col, angle: alignedAngle }
        })
    ).flat()

    return (
        <div>
            {/* Material selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {Object.keys(MATERIALS).map(k => (
                    <button key={k} onClick={() => setMat(k)} style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mat === k ? MATERIALS[k].color : 'var(--bg3)',
                        color: mat === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mat === k ? MATERIALS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <div style={{
                fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)',
                marginBottom: 12, padding: '8px 12px',
                background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)',
            }}>
                {m.desc}
            </div>

            <SimSlider label="Applied H field" unit="" value={H_ext} min={-100} max={100} step={1} onChange={v => { setHext(v); setAnimating(false) }} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* === Hysteresis loop (right panel) === */}
                {mat === 'Ferromagnetic' && (
                    <g>
                        {/* Background */}
                        <rect x={GX} y={GY} width={W_GRAPH} height={H_GRAPH}
                            rx={6} fill="rgba(0,0,0,0.2)" />

                        {/* Grid */}
                        <line x1={MID_X} y1={GY + 4} x2={MID_X} y2={GY + H_GRAPH - 4}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                        <line x1={GX + 4} y1={MID_Y} x2={GX + W_GRAPH - 4} y2={MID_Y}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />

                        {/* Loop */}
                        <path d={loopPath} fill="none"
                            stroke="#EF9F27" strokeWidth={1.8}
                            strokeLinecap="round" strokeLinejoin="round" />

                        {/* Current point */}
                        <circle cx={cpX} cy={cpY} r={6}
                            fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                        {/* Labels */}
                        <text x={MID_X} y={GY - 4} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>M</text>
                        <text x={GX + W_GRAPH + 4} y={MID_Y + 4}
                            style={{ fontSize: 9, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>H</text>

                        {/* Saturation labels */}
                        <text x={GX + W_GRAPH - 4} y={GY + 16} textAnchor="end"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Mₛ</text>
                        <text x={GX + W_GRAPH - 4} y={MID_Y + H_GRAPH / 2 + 12} textAnchor="end"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>−Mₛ</text>

                        {/* Remanence label */}
                        <text x={MID_X + 4} y={GY + H_GRAPH * 0.12}
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>Bᵣ</text>

                        {/* Coercivity label */}
                        <text x={GX + W_GRAPH * 0.65} y={MID_Y + 14}
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>Hc</text>
                    </g>
                )}

                {/* === Domain visualization (left panel) === */}
                <g>
                    <text x={50} y={28} textAnchor="middle"
                        style={{ fontSize: 10, fill: m.color, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                        Domains
                    </text>

                    {domains.map((d, i) => {
                        const bx = 14 + d.col * 24
                        const by = 36 + d.row * 24
                        const ex = bx + 16 * Math.cos(d.angle)
                        const ey = by + 16 * Math.sin(d.angle)
                        return (
                            <g key={i}>
                                <rect x={bx - 1} y={by - 1} width={21} height={21}
                                    rx={2} fill={`${m.color}10`}
                                    stroke={`${m.color}20`} strokeWidth={0.5} />
                                <line x1={bx + 10} y1={by + 10} x2={ex} y2={ey}
                                    stroke={m.color} strokeWidth={1.5} opacity={0.7} />
                                <circle cx={ex} cy={ey} r={2.5}
                                    fill={m.color} opacity={0.8} />
                            </g>
                        )
                    })}

                    {/* External field arrow */}
                    {H_ext !== 0 && (
                        <>
                            <defs>
                                <marker id="mm_h" viewBox="0 0 10 10" refX={8} refY={5}
                                    markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                                    <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(255,255,255,0.4)"
                                        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                </marker>
                            </defs>
                            <line
                                x1={H_ext > 0 ? 10 : 108} y1={150}
                                x2={H_ext > 0 ? 108 : 10} y2={150}
                                stroke="rgba(255,255,255,0.35)" strokeWidth={1.5}
                                markerEnd="url(#mm_h)" />
                            <text x={59} y={166} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>
                                H={H_ext > 0 ? '+' : ''}{H_ext}
                            </text>
                        </>
                    )}
                </g>

                {/* χ and μr info */}
                <text x={W / 2} y={H - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    χ = {m.chi.toExponential(1)}  |  μᵣ = {m.muR.toFixed(m.muR > 10 ? 0 : 5)}
                </text>
            </svg>

            {/* Animate button */}
            <button onClick={() => { setAnimating(p => !p); if (!animating) { tRef.current = 0; lastRef.current = null } }} style={{
                padding: '6px 20px', borderRadius: 8, fontSize: 12,
                fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                background: animating ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.15)',
                color: animating ? 'var(--coral)' : 'var(--amber)',
                border: `1px solid ${animating ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
            }}>
                {animating ? '⏸ Stop cycle' : '▶ Cycle H field (hysteresis)'}
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Susceptibility χ', val: m.chi.toExponential(2), color: m.color },
                    { label: 'Relative μᵣ', val: m.muR > 10 ? `${m.muR.toFixed(0)}` : m.muR.toFixed(5), color: 'var(--amber)' },
                    { label: 'M (magnetization)', val: mat === 'Ferromagnetic' ? `${(M_val / 1e6).toFixed(3)} MA/m` : `${M_val.toFixed(6)} A/m`, color: 'var(--teal)' },
                    { label: 'Hysteresis loss', val: mat === 'Ferromagnetic' ? 'Area of loop = energy/cycle' : 'None', color: 'var(--text3)' },
                ].map(c => (
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