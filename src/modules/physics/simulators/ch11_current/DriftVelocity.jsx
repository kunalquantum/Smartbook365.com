import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 200
const WIRE_X1 = 40, WIRE_X2 = W - 40
const WIRE_Y = H / 2
const WIRE_H = 40
const N_ELECTRONS = 28

export default function DriftVelocity() {
    const [I, setI] = useState(2)     // Amperes
    const [A, setA] = useState(1)     // mm²
    const [n, setN] = useState(8.5)   // ×10²⁸ electrons/m³ (copper)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)

    // Electron positions — random y, uniform x spacing + drift offset
    const electronsRef = useRef(
        Array.from({ length: N_ELECTRONS }, (_, i) => ({
            x0: WIRE_X1 + (i / N_ELECTRONS) * (WIRE_X2 - WIRE_X1),
            y: WIRE_Y - 14 + Math.random() * 28,
            vx: -0.3 - Math.random() * 0.4,  // random thermal jitter (left mostly)
        }))
    )

    const e_C = 1.6e-19
    const A_m2 = A * 1e-6
    const n_m3 = n * 1e28
    const v_d = I / (n_m3 * A_m2 * e_C)   // m/s
    const J = I / A_m2                   // A/m²
    const sigma = n_m3 * e_C * 4.3e-3        // ~copper conductivity estimate

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const WIRE_LEN = WIRE_X2 - WIRE_X1

    // Drift speed visual: scale v_d for visibility
    const driftPx = v_d * 2e4   // exaggerated drift per second in px

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Current I" unit=" A" value={I} min={0.1} max={10} step={0.1} onChange={setI} />
                <SimSlider label="Area A" unit=" mm²" value={A} min={0.1} max={10} step={0.1} onChange={setA} />
                <SimSlider label="n (×10²⁸/m³)" unit="" value={n} min={1} max={20} step={0.5} onChange={setN} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* Wire body */}
                <rect x={WIRE_X1} y={WIRE_Y - WIRE_H / 2}
                    width={WIRE_X2 - WIRE_X1} height={WIRE_H}
                    rx={6} fill="rgba(55,138,221,0.1)"
                    stroke="rgba(55,138,221,0.35)" strokeWidth={1.5} />

                {/* Battery symbol on left */}
                <line x1={WIRE_X1 - 20} y1={WIRE_Y - 10} x2={WIRE_X1 - 20} y2={WIRE_Y + 10}
                    stroke="#EF9F27" strokeWidth={3} />
                <line x1={WIRE_X1 - 14} y1={WIRE_Y - 6} x2={WIRE_X1 - 14} y2={WIRE_Y + 6}
                    stroke="#EF9F27" strokeWidth={1.5} />
                <text x={WIRE_X1 - 30} y={WIRE_Y + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>+</text>

                {/* Current arrow */}
                <defs>
                    <marker id="curr" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#EF9F27"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>
                <line x1={WIRE_X1 + 20} y1={WIRE_Y - WIRE_H / 2 - 14}
                    x2={WIRE_X1 + 80} y2={WIRE_Y - WIRE_H / 2 - 14}
                    stroke="#EF9F27" strokeWidth={1.5} markerEnd="url(#curr)" />
                <text x={WIRE_X1 + 50} y={WIRE_Y - WIRE_H / 2 - 20} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>I = {I} A →</text>

                {/* Electrons drifting LEFT (conventional current right) */}
                {electronsRef.current.map((el, i) => {
                    // Drift: electrons move left, wrap around
                    const drift = (driftPx * t) % WIRE_LEN
                    const rawX = el.x0 - drift
                    // Thermal jitter
                    const jitterX = Math.sin(t * 8 + i * 1.3) * 3
                    const jitterY = Math.cos(t * 7 + i * 2.1) * 4
                    // Wrap
                    let x = ((rawX - WIRE_X1) % WIRE_LEN + WIRE_LEN) % WIRE_LEN + WIRE_X1
                    const y = el.y + jitterY

                    return (
                        <g key={i}>
                            <circle cx={x + jitterX} cy={y}
                                r={4} fill="rgba(55,138,221,0.8)"
                                stroke="rgba(55,138,221,0.4)" strokeWidth={0.5} />
                            <text x={x + jitterX} y={y + 3.5} textAnchor="middle"
                                style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)', pointerEvents: 'none' }}>
                                −
                            </text>
                        </g>
                    )
                })}

                {/* Drift velocity arrow */}
                <defs>
                    <marker id="vd" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#D85A30"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>
                <line x1={WIRE_X2 - 80} y1={WIRE_Y + WIRE_H / 2 + 14}
                    x2={WIRE_X2 - 20} y2={WIRE_Y + WIRE_H / 2 + 14}
                    stroke="#D85A30" strokeWidth={1.5} markerEnd="url(#vd)" />
                <text x={WIRE_X2 - 50} y={WIRE_Y + WIRE_H / 2 + 26} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>← e⁻ drift</text>

                {/* n label */}
                <text x={W / 2} y={H - 8} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    n = {n}×10²⁸ m⁻³  A = {A} mm²  electrons move ←  current →
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Drift velocity v_d', val: v_d < 1e-3 ? `${(v_d * 1000).toFixed(4)} mm/s` : `${v_d.toFixed(6)} m/s`, color: 'var(--coral)' },
                    { label: 'Current density J', val: `${(J / 1e6).toFixed(3)} MA/m²`, color: 'var(--amber)' },
                    { label: 'n × e × A', val: `${(n_m3 * e_C * A_m2).toExponential(3)}`, color: 'var(--teal)' },
                    { label: 'Thermal speed', val: '~10⁶ m/s  (>>v_d)', color: 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}