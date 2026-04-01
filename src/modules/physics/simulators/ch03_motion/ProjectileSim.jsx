import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 500, H = 280
const G = 9.8
const PAD = { l: 44, r: 16, t: 16, b: 32 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

export default function ProjectileSim() {
    const [u, setU] = useState(30)
    const [angle, setAngle] = useState(45)
    const [running, setRunning] = useState(false)
    const [t, setT] = useState(0)
    const rafRef = useRef(null)
    const t0Ref = useRef(null)

    const rad = angle * Math.PI / 180
    const ux = u * Math.cos(rad)
    const uy = u * Math.sin(rad)
    const T = (2 * uy) / G
    const R = ux * T
    const Hmax = (uy * uy) / (2 * G)

    // Scale: fit the trajectory in PW x PH
    const scaleX = PW / Math.max(R, 1)
    const scaleY = PH / Math.max(Hmax * 1.15, 1)
    const scale = Math.min(scaleX, scaleY)

    const toSVG = (x, y) => ({
        sx: PAD.l + x * scale,
        sy: PAD.t + PH - y * scale,
    })

    // Full trajectory path
    const N = 80
    const pathD = Array.from({ length: N + 1 }, (_, i) => {
        const ti = (i / N) * T
        const x = ux * ti
        const y = uy * ti - 0.5 * G * ti * ti
        const { sx, sy } = toSVG(x, y)
        return `${i === 0 ? 'M' : 'L'}${sx.toFixed(1)},${sy.toFixed(1)}`
    }).join(' ')

    // Ball position at time t
    const bx = ux * t
    const by = uy * t - 0.5 * G * t * t
    const { sx: bsx, sy: bsy } = toSVG(Math.max(0, bx), Math.max(0, by))

    // Velocity components at t
    const vx = ux
    const vy = uy - G * t
    const spd = Math.sqrt(vx * vx + vy * vy)

    const launch = () => {
        if (running) {
            cancelAnimationFrame(rafRef.current)
            setRunning(false); setT(0); return
        }
        setT(0); setRunning(true)
        t0Ref.current = null
        const step = (ts) => {
            if (!t0Ref.current) t0Ref.current = ts
            const elapsed = (ts - t0Ref.current) / 1000
            if (elapsed >= T) {
                setT(T); setRunning(false); return
            }
            setT(elapsed)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
    }

    useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

    // Velocity arrow scale
    const vs = 2.5
    const vArrowX = bsx + vx * vs
    const vArrowY = bsy - vy * vs

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Initial speed u" unit=" m/s" value={u} min={10} max={60} step={1} onChange={v => { setU(v); setT(0); setRunning(false) }} />
                <SimSlider label="Launch angle θ" unit="°" value={angle} min={5} max={85} step={1} onChange={v => { setAngle(v); setT(0); setRunning(false) }} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Ground */}
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={1} />

                {/* Grid lines */}
                {[0.25, 0.5, 0.75, 1].map(f => (
                    <line key={f}
                        x1={PAD.l} y1={PAD.t + PH - f * PH}
                        x2={W - PAD.r} y2={PAD.t + PH - f * PH}
                        stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                ))}

                {/* Trajectory ghost */}
                <path d={pathD} fill="none" stroke="rgba(239,159,39,0.2)" strokeWidth={1.5} strokeDasharray="5 3" />

                {/* Range arrow */}
                <defs>
                    <marker id="par" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(29,158,117,0.6)"
                            strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                    <marker id="pav" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#EF9F27"
                            strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                    <marker id="pvx" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#1D9E75"
                            strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                    <marker id="pvy" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#D85A30"
                            strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                </defs>

                {/* Max height dashed line */}
                {(() => {
                    const { sx, sy } = toSVG(R / 2, Hmax)
                    return (
                        <line x1={PAD.l} y1={sy} x2={sx} y2={sy}
                            stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="4 3" />
                    )
                })()}

                {/* Range line */}
                {t >= T * 0.98 && (
                    <line x1={PAD.l} y1={PAD.t + PH + 8} x2={PAD.l + R * scale} y2={PAD.t + PH + 8}
                        stroke="rgba(29,158,117,0.6)" strokeWidth={1} markerEnd="url(#par)" />
                )}

                {/* Velocity components at ball */}
                {running && (
                    <>
                        <line x1={bsx} y1={bsy} x2={bsx + vx * vs} y2={bsy}
                            stroke="#1D9E75" strokeWidth={1.5} markerEnd="url(#pvx)" />
                        <line x1={bsx} y1={bsy} x2={bsx} y2={bsy - vy * vs}
                            stroke="#D85A30" strokeWidth={1.5} markerEnd="url(#pvy)" />
                    </>
                )}

                {/* Resultant velocity arrow */}
                {running && (
                    <line x1={bsx} y1={bsy} x2={vArrowX} y2={vArrowY}
                        stroke="#EF9F27" strokeWidth={2} markerEnd="url(#pav)" />
                )}

                {/* Ball */}
                <circle cx={bsx} cy={bsy} r={7}
                    fill={running ? '#EF9F27' : '#FAC775'}
                    stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* Cannon */}
                <rect x={PAD.l - 10} y={PAD.t + PH - 6} width={20} height={12}
                    rx={4} fill="#1A3350" stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
                <line
                    x1={PAD.l} y1={PAD.t + PH}
                    x2={PAD.l + 18 * Math.cos(rad)} y2={PAD.t + PH - 18 * Math.sin(rad)}
                    stroke="#FAC775" strokeWidth={4} strokeLinecap="round" />

                {/* Axis labels */}
                <text x={PAD.l - 4} y={PAD.t + PH + 20} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>0</text>
                <text x={PAD.l + R * scale} y={PAD.t + PH + 20} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                    R={R.toFixed(1)}m
                </text>
                {(() => {
                    const { sx, sy } = toSVG(0, Hmax)
                    return (
                        <text x={PAD.l - 6} y={sy + 3} textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>
                            H={Hmax.toFixed(1)}
                        </text>
                    )
                })()}
            </svg>

            {/* Launch button */}
            <button onClick={launch} style={{
                padding: '8px 24px', borderRadius: 8, fontSize: 13,
                fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                background: running ? 'rgba(216,90,48,0.2)' : 'rgba(239,159,39,0.15)',
                color: running ? 'var(--coral)' : 'var(--amber)',
                border: `1px solid ${running ? 'rgba(216,90,48,0.4)' : 'rgba(239,159,39,0.35)'}`,
            }}>
                {running ? '■ Stop' : '▶ Launch'}
            </button>

            {/* Live readouts */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Range R', val: `${R.toFixed(2)} m`, color: 'var(--teal)' },
                    { label: 'Max height H', val: `${Hmax.toFixed(2)} m`, color: 'var(--amber)' },
                    { label: 'Time of flight', val: `${T.toFixed(2)} s`, color: 'var(--text2)' },
                    { label: 'Speed at t', val: `${spd.toFixed(1)} m/s`, color: 'var(--coral)' },
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
                ● green = Vx (constant)  ● red = Vy (decreasing)  ● orange = resultant velocity
            </div>
        </div>
    )
}