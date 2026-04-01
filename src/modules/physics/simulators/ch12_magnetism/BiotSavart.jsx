import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const CX = W / 2, CY = H / 2
const MU0 = 4 * Math.PI * 1e-7

export default function BiotSavart() {
    const [mode, setMode] = useState('wire')     // wire | loop | solenoid
    const [I, setI] = useState(5)          // Amperes
    const [r, setR] = useState(0.05)       // m distance / loop radius
    const [n, setN] = useState(500)        // turns/m for solenoid
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const tRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current

    // Compute B
    let B = 0, formula = ''
    if (mode === 'wire') {
        B = (MU0 * I) / (2 * Math.PI * r)
        formula = `B = μ₀I/2πr = ${B.toExponential(3)} T`
    } else if (mode === 'loop') {
        B = (MU0 * I) / (2 * r)
        formula = `B = μ₀I/2R = ${B.toExponential(3)} T  (at centre)`
    } else {
        B = MU0 * n * I
        formula = `B = μ₀nI = ${B.toExponential(3)} T`
    }

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    // Current direction animation phase
    const phase = (t * 60) % 100

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { key: 'wire', label: 'Straight wire' },
                    { key: 'loop', label: 'Circular loop' },
                    { key: 'solenoid', label: 'Solenoid' },
                ].map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m.key ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m.label}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Current I" unit=" A" value={I} min={0.1} max={20} step={0.1} onChange={setI} />
                {mode !== 'solenoid' && (
                    <SimSlider label={mode === 'wire' ? 'Distance r' : 'Loop radius R'} unit=" cm"
                        value={r * 100} min={1} max={20} step={0.5} onChange={v => setR(v / 100)} />
                )}
                {mode === 'solenoid' && (
                    <SimSlider label="Turns/metre n" unit="/m" value={n} min={50} max={2000} step={50} onChange={setN} />
                )}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('bs1', 'rgba(239,159,39,0.7)')}
                    {arrowDef('bs2', 'rgba(29,158,117,0.8)')}
                    {arrowDef('bscurr', '#EF9F27')}
                </defs>

                {/* ── STRAIGHT WIRE ── */}
                {mode === 'wire' && (
                    <g>
                        {/* Wire */}
                        <line x1={CX} y1={20} x2={CX} y2={H - 20}
                            stroke="#EF9F27" strokeWidth={3} strokeLinecap="round" />

                        {/* Current direction dots moving downward */}
                        {Array.from({ length: 6 }, (_, i) => {
                            const y = 30 + ((i * 40 + phase * 2) % (H - 60))
                            return <circle key={i} cx={CX} cy={y} r={3}
                                fill="#EF9F27" opacity={0.7} />
                        })}
                        <text x={CX + 8} y={24}
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>I↓</text>

                        {/* Concentric circular field lines */}
                        {[1, 2, 3, 4].map(ring => {
                            const rad = ring * 35
                            const opacity = Math.max(0.1, 0.55 - ring * 0.1)
                            return (
                                <g key={ring}>
                                    <circle cx={CX} cy={CY} r={rad}
                                        fill="none"
                                        stroke={`rgba(55,138,221,${opacity})`}
                                        strokeWidth={1.2} />
                                    {/* Arrow on circle */}
                                    {(() => {
                                        const angle = t * 0.5 + ring * 0.8
                                        const ax = CX + rad * Math.cos(angle)
                                        const ay = CY + rad * Math.sin(angle)
                                        const tx = CX + rad * Math.cos(angle + 0.15)
                                        const ty = CY + rad * Math.sin(angle + 0.15)
                                        return (
                                            <line x1={ax} y1={ay} x2={tx} y2={ty}
                                                stroke={`rgba(55,138,221,${opacity * 1.5})`}
                                                strokeWidth={1.5} markerEnd="url(#bs1)" />
                                        )
                                    })()}
                                </g>
                            )
                        })}

                        {/* r distance line */}
                        <line x1={CX} y1={CY} x2={CX + r * 1000} y2={CY}
                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} strokeDasharray="3 2" />
                        <text x={CX + r * 500} y={CY - 6} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>r={r * 100}cm</text>

                        {/* Right-hand rule label */}
                        <text x={W / 2} y={H - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            Right-hand rule: thumb=I direction, fingers=B direction
                        </text>
                    </g>
                )}

                {/* ── CIRCULAR LOOP ── */}
                {mode === 'loop' && (
                    <g>
                        {/* Loop (ellipse for 3D effect) */}
                        <ellipse cx={CX} cy={CY} rx={80} ry={22}
                            fill="none" stroke="#EF9F27" strokeWidth={2.5} />

                        {/* Current direction arrows on loop */}
                        {[0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].map((angle, i) => {
                            const ax = CX + 80 * Math.cos(angle)
                            const ay = CY + 22 * Math.sin(angle)
                            const tx = CX + 80 * Math.cos(angle + 0.25)
                            const ty = CY + 22 * Math.sin(angle + 0.25)
                            return (
                                <line key={i} x1={ax} y1={ay} x2={tx} y2={ty}
                                    stroke="#EF9F27" strokeWidth={2} markerEnd="url(#bscurr)" />
                            )
                        })}

                        {/* Axis */}
                        <line x1={CX - 120} y1={CY} x2={CX + 120} y2={CY}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="4 3" />

                        {/* B field lines along axis */}
                        {[-1, 1].map(dir => (
                            <g key={dir}>
                                <line x1={CX} y1={CY}
                                    x2={CX + dir * 100} y2={CY}
                                    stroke="rgba(29,158,117,0.6)" strokeWidth={2}
                                    markerEnd="url(#bs2)" />
                            </g>
                        ))}

                        {/* Field lines curving around loop */}
                        {[30, 55, 78].map((rad, i) => {
                            const opacity = 0.3 - i * 0.07
                            return (
                                <ellipse key={i} cx={CX} cy={CY} rx={rad} ry={rad * 0.6}
                                    fill="none"
                                    stroke={`rgba(29,158,117,${opacity})`}
                                    strokeWidth={1} strokeDasharray="4 3" />
                            )
                        })}

                        {/* Centre B label */}
                        <text x={CX} y={CY - 30} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                            B (centre) = {B.toExponential(3)} T
                        </text>

                        {/* Loop radius label */}
                        <line x1={CX} y1={CY} x2={CX + 80} y2={CY}
                            stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
                        <text x={CX + 40} y={CY + 14}
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>R={r * 100}cm</text>
                    </g>
                )}

                {/* ── SOLENOID ── */}
                {mode === 'solenoid' && (
                    <g>
                        {/* Solenoid turns (coil drawing) */}
                        {Array.from({ length: 10 }, (_, i) => {
                            const x = 60 + i * 34
                            return (
                                <g key={i}>
                                    {/* Front semi-ellipse */}
                                    <path d={`M ${x} ${CY - 20} A 8 20 0 0 1 ${x} ${CY + 20}`}
                                        fill="none" stroke="#EF9F27" strokeWidth={2} />
                                    {/* Back semi-ellipse (dashed) */}
                                    <path d={`M ${x} ${CY - 20} A 8 20 0 0 0 ${x} ${CY + 20}`}
                                        fill="none" stroke="#EF9F27" strokeWidth={1}
                                        strokeDasharray="3 2" opacity={0.4} />
                                    {/* Connecting wire */}
                                    {i < 9 && (
                                        <line x1={x} y1={CY + 20} x2={x + 34} y2={CY + 20}
                                            stroke="#EF9F27" strokeWidth={2} />
                                    )}
                                </g>
                            )
                        })}

                        {/* Current direction */}
                        {Array.from({ length: 5 }, (_, i) => {
                            const x = 77 + i * 68
                            const y = ((phase * 1.5 + i * 20) % 40) - 20
                            return (
                                <circle key={i} cx={x} cy={CY + 20 - Math.abs(y)}
                                    r={2.5} fill="#EF9F27" opacity={0.6} />
                            )
                        })}

                        {/* Uniform B field inside */}
                        {Array.from({ length: 5 }, (_, i) => {
                            const y = CY - 14 + i * 7
                            return (
                                <line key={i} x1={70} y1={y} x2={W - 70} y2={y}
                                    stroke="rgba(29,158,117,0.5)" strokeWidth={1.5}
                                    markerEnd="url(#bs2)" />
                            )
                        })}

                        {/* External field lines (fringe) */}
                        {[-1, 1].map(dir => (
                            <g key={dir}>
                                <path d={`M ${W - 70} ${CY} Q ${W - 30} ${CY} ${W - 30} ${CY + dir * 60} Q ${W - 30} ${CY + dir * 90} ${W / 2} ${CY + dir * 90} Q 30 ${CY + dir * 90} 30 ${CY + dir * 60} Q 30 ${CY} 70 ${CY}`}
                                    fill="none" stroke="rgba(29,158,117,0.15)"
                                    strokeWidth={1} strokeDasharray="4 3" />
                            </g>
                        ))}

                        {/* Labels */}
                        <text x={W / 2} y={CY - 32} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            B = μ₀nI = {B.toExponential(3)} T (uniform inside)
                        </text>
                        <text x={W / 2} y={H - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            n = {n} turns/m  ·  B ≈ 0 outside
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Magnetic field B', val: B > 1 ? `${B.toFixed(3)} T` : B > 1e-3 ? `${(B * 1000).toFixed(3)} mT` : `${(B * 1e6).toFixed(3)} μT`, color: 'var(--teal)' },
                    { label: 'Formula', val: mode === 'wire' ? 'μ₀I/2πr' : mode === 'loop' ? 'μ₀I/2R' : 'μ₀nI', color: 'var(--amber)' },
                    { label: 'μ₀', val: '4π×10⁻⁷ T·m/A', color: 'var(--text3)' },
                    { label: 'Field direction', val: mode === 'wire' ? 'Circular (RHR)' : mode === 'loop' ? 'Along axis' : 'Along axis (uniform)', color: 'var(--coral)' },
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