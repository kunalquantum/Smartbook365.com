import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const ENTRY_X = 60, ENTRY_Y = H / 2

export default function LorentzForce() {
    const [B, setB] = useState(1.0)    // Tesla (into page)
    const [v, setV] = useState(3e6)    // m/s
    const [q, setQ] = useState(1)      // charge sign (+1 or -1)
    const [mass, setMass] = useState(1)      // relative mass (proton=1, electron~0.0005)
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

    // Physics: r = mv/qB
    const m_kg = mass * 1.67e-27   // proton mass units
    const q_C = Math.abs(q) * 1.6e-19
    const r = (m_kg * v) / (q_C * B)
    const r_px = Math.min(180, Math.max(20, r * 1e-6))  // scale to SVG

    // Angular velocity: ω = v/r = qB/m
    const omega = v / r
    const omega_vis = Math.min(omega * 1e-7, 4)  // slowed for visibility

    // Particle position — circular motion
    // Enters at ENTRY_X, ENTRY_Y moving right (+x)
    // For +q in B into page: F = qv×B, curves upward
    // Centre of circle: ENTRY_X, ENTRY_Y - r_px (for +q)
    const centerY = ENTRY_Y + q * r_px
    const angle0 = -Math.PI / 2 * q    // starting angle
    const theta = angle0 + q * omega_vis * t

    const px = ENTRY_X + r_px * Math.cos(theta)
    const py = centerY - r_px * Math.sin(theta)

    // Clamp to canvas
    const inBounds = px > 10 && px < W - 10 && py > 10 && py < H - 10

    // Trail
    const trailLen = 80
    const trail = Array.from({ length: trailLen }, (_, i) => {
        const th = angle0 + q * omega_vis * (t - i * 0.02)
        return {
            x: ENTRY_X + r_px * Math.cos(th),
            y: centerY - r_px * Math.sin(th),
        }
    }).filter(p => p.x > 5 && p.x < W - 5 && p.y > 5 && p.y < H - 5)

    // Velocity direction (tangent)
    const vx_dir = -Math.sin(theta) * q
    const vy_dir = -Math.cos(theta) * q
    const vScale = 36

    // Force direction (centripetal = toward centre)
    const fx_dir = (centerY === py ? 0 : (ENTRY_X - px)) / r_px
    const fy_dir = (centerY - py) / r_px
    const fScale = 28

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="B field" unit=" T" value={B} min={0.1} max={5} step={0.1} onChange={setB} />
                <SimSlider label="Speed v" unit=" ×10⁶m/s" value={v / 1e6} min={0.5} max={10} step={0.5} onChange={v => setV(v * 1e6)} />
                <SimSlider label="Mass (×mp)" unit="" value={mass} min={0.001} max={10} step={0.001} onChange={setMass} />
            </div>

            {/* Charge selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ v: 1, l: 'Positive charge (+q)' }, { v: -1, l: 'Negative charge (−q)' }].map(opt => (
                    <button key={opt.v} onClick={() => setQ(opt.v)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: q === opt.v ? (opt.v > 0 ? 'rgba(216,90,48,0.2)' : 'rgba(55,138,221,0.2)') : 'var(--bg3)',
                        color: q === opt.v ? (opt.v > 0 ? '#D85A30' : '#378ADD') : 'var(--text2)',
                        border: `1px solid ${q === opt.v ? (opt.v > 0 ? 'rgba(216,90,48,0.4)' : 'rgba(55,138,221,0.4)') : 'var(--border)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('lv', '#1D9E75')}
                    {arrowDef('lf', '#D85A30')}
                    {arrowDef('le', '#EF9F27')}
                </defs>

                {/* B field crosses (into page) */}
                {Array.from({ length: 6 }, (_, row) =>
                    Array.from({ length: 8 }, (_, col) => {
                        const x = 40 + col * 56, y = 30 + row * 48
                        return (
                            <g key={`${row}_${col}`} opacity={0.2}>
                                <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} stroke="#7F77DD" strokeWidth={1} />
                                <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} stroke="#7F77DD" strokeWidth={1} />
                            </g>
                        )
                    })
                )}
                <text x={W - 14} y={18} textAnchor="end"
                    style={{ fontSize: 10, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>
                    B ⊗ (into page) = {B}T
                </text>

                {/* Entry arrow */}
                <line x1={20} y1={ENTRY_Y} x2={ENTRY_X - 4} y2={ENTRY_Y}
                    stroke="#EF9F27" strokeWidth={1.5} markerEnd="url(#le)" />
                <text x={14} y={ENTRY_Y - 8}
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>v→</text>

                {/* Orbit ghost circle */}
                <circle cx={ENTRY_X} cy={centerY} r={r_px}
                    fill="none" stroke="rgba(255,255,255,0.05)"
                    strokeWidth={1} strokeDasharray="4 4" />

                {/* Trail */}
                {trail.length > 1 && (
                    <path
                        d={trail.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                        fill="none"
                        stroke={q > 0 ? 'rgba(216,90,48,0.4)' : 'rgba(55,138,221,0.4)'}
                        strokeWidth={2} />
                )}

                {/* Velocity arrow */}
                {inBounds && (
                    <line x1={px} y1={py}
                        x2={px + vx_dir * vScale} y2={py + vy_dir * vScale}
                        stroke="#1D9E75" strokeWidth={2} markerEnd="url(#lv)" />
                )}

                {/* Force arrow (centripetal) */}
                {inBounds && (
                    <line x1={px} y1={py}
                        x2={px + fx_dir * fScale} y2={py + fy_dir * fScale}
                        stroke="#D85A30" strokeWidth={2} markerEnd="url(#lf)" />
                )}

                {/* Particle */}
                {inBounds && (
                    <g>
                        <circle cx={px} cy={py} r={9}
                            fill={q > 0 ? 'rgba(216,90,48,0.35)' : 'rgba(55,138,221,0.35)'}
                            stroke={q > 0 ? '#D85A30' : '#378ADD'} strokeWidth={2} />
                        <text x={px} y={py + 4} textAnchor="middle"
                            style={{ fontSize: 11, fill: q > 0 ? '#D85A30' : '#378ADD', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {q > 0 ? '+' : '−'}
                        </text>
                    </g>
                )}

                {/* r label */}
                {inBounds && (
                    <line x1={ENTRY_X} y1={centerY} x2={px} y2={py}
                        stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 2" />
                )}

                {/* Legend */}
                <text x={14} y={H - 24}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>→ v (velocity)</text>
                <text x={14} y={H - 12}
                    style={{ fontSize: 9, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>→ F (Lorentz force)</text>
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
                {[
                    { label: 'Radius r = mv/qB', val: `${(r * 100).toFixed(2)} cm`, color: 'var(--amber)' },
                    { label: 'ω = qB/m', val: `${(omega).toExponential(2)} rad/s`, color: 'var(--teal)' },
                    { label: 'F = qvB', val: `${(q_C * v * B).toExponential(3)} N`, color: 'var(--coral)' },
                    { label: 'Curves', val: q > 0 ? 'Upward (+q)' : 'Downward (−q)', color: q > 0 ? 'var(--coral)' : 'var(--teal)' },
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