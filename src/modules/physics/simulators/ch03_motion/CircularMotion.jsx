import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 360, H = 300, CX = 180, CY = 150

export default function CircularMotion() {
    const [r, setR] = useState(80)
    const [omega, setOmega] = useState(1.5)
    const [running, setRunning] = useState(true)
    const [theta, setTheta] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)

    useEffect(() => {
        if (!running) return
        const step = (ts) => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTheta(p => p + omega * dt)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, omega])

    const v = r * omega              // speed m/s
    const ac = v * v / r              // centripetal acc
    const T = (2 * Math.PI) / omega  // period
    const f = 1 / T                  // frequency

    // Ball position
    const bx = CX + r * Math.cos(theta)
    const by = CY - r * Math.sin(theta)

    // Velocity direction: tangent = perpendicular to radius
    const vs = Math.min(v * 1.8, 70)
    const vx = -Math.sin(theta)
    const vy = Math.cos(theta)
    const vex = bx + vx * vs
    const vey = by - vy * vs   // flip y

    // Centripetal: points to centre
    const cs = Math.min(ac * 2, 55)
    const cex = bx + (CX - bx) / r * cs
    const cey = by + (CY - by) / r * cs

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
                <SimSlider label="Radius r" unit=" m" value={r} min={40} max={110} step={5} onChange={setR} />
                <SimSlider label="Angular vel ω" unit=" rad/s" value={omega} min={0.3} max={4} step={0.1} onChange={setOmega} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                <defs>
                    {arrowDef('cv', '#1D9E75')}
                    {arrowDef('cc', '#D85A30')}
                </defs>

                {/* Orbit circle */}
                <circle cx={CX} cy={CY} r={r}
                    fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="6 4" />

                {/* Radius line */}
                <line x1={CX} y1={CY} x2={bx} y2={by}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

                {/* Centre dot */}
                <circle cx={CX} cy={CY} r={4}
                    fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />

                {/* Centripetal force arrow */}
                <line x1={bx} y1={by} x2={cex} y2={cey}
                    stroke="#D85A30" strokeWidth={2} markerEnd="url(#cc)" />
                <text x={cex - 10} y={cey - 8}
                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>Fc</text>

                {/* Velocity arrow */}
                <line x1={bx} y1={by} x2={vex} y2={vey}
                    stroke="#1D9E75" strokeWidth={2.5} markerEnd="url(#cv)" />
                <text x={vex + 6} y={vey}
                    style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>v</text>

                {/* 90° indicator */}
                {(() => {
                    const px = bx + vx * 12
                    const py = by - vy * 12
                    const qx = bx + (CX - bx) / r * 12
                    const qy = by + (CY - by) / r * 12
                    return (
                        <path d={`M ${px} ${py} L ${px + (CX - bx) / r * 12} ${py + (CY - by) / r * 12} L ${qx} ${qy}`}
                            fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={0.8} />
                    )
                })()}

                {/* Ball */}
                <circle cx={bx} cy={by} r={9}
                    fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* r label */}
                <text x={(CX + bx) / 2 + 6} y={(CY + by) / 2 - 6}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>r</text>

                {/* Angle arc */}
                <path d={`M ${CX + 22} ${CY} A 22 22 0 ${theta % (2 * Math.PI) > Math.PI ? 1 : 0} 0 ${CX + 22 * Math.cos(theta)} ${CY - 22 * Math.sin(theta)}`}
                    fill="none" stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                <text x={CX + 30 * Math.cos(theta / 2)} y={CY - 30 * Math.sin(theta / 2)}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>θ</text>
            </svg>

            {/* Play/pause */}
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
                    { label: 'Speed v', val: `${v.toFixed(2)} m/s`, color: 'var(--teal)' },
                    { label: 'Centripetal ac', val: `${ac.toFixed(2)} m/s²`, color: 'var(--coral)' },
                    { label: 'Period T', val: `${T.toFixed(2)} s`, color: 'var(--amber)' },
                    { label: 'Frequency f', val: `${f.toFixed(2)} Hz`, color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                ● green = velocity (always tangent)  ● red = centripetal force (always inward)  ● 90° between them always
            </div>
        </div>
    )
}