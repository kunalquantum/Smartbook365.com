import { useState, useCallback } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const K = 9e9

export default function CoulombLaw() {
    const [charges, setCharges] = useState([
        { id: 0, x: 140, y: 150, q: 2e-9 },
        { id: 1, x: 320, y: 150, q: -2e-9 },
    ])
    const [dragging, setDragging] = useState(null)
    const [selected, setSelected] = useState(0)
    const [q1val, setQ1val] = useState(2)
    const [q2val, setQ2val] = useState(-2)

    // Update charges from sliders
    const updateQ = (idx, val) => {
        setCharges(prev => prev.map((c, i) => i === idx ? { ...c, q: val * 1e-9 } : c))
        if (idx === 0) setQ1val(val)
        else setQ2val(val)
    }

    const c0 = charges[0], c1 = charges[1]
    const dx = c1.x - c0.x, dy = c1.y - c0.y
    const r_px = Math.sqrt(dx * dx + dy * dy)
    const r_m = r_px / 50          // 50px = 1m
    const F = K * Math.abs(c0.q) * Math.abs(c1.q) / (r_m * r_m)
    const attract = (c0.q * c1.q) < 0

    // Unit vector
    const ux = dx / r_px, uy = dy / r_px

    // Force arrow length (scaled)
    const fScale = Math.min(60, F * 1e6)

    // Field lines from charge 0
    const nLines = 8
    const fieldLines = Array.from({ length: nLines }, (_, i) => {
        const angle = (i / nLines) * 2 * Math.PI
        const ex = c0.x + 80 * Math.cos(angle)
        const ey = c0.y + 80 * Math.sin(angle)
        return { x1: c0.x + 16 * Math.cos(angle), y1: c0.y + 16 * Math.sin(angle), x2: ex, y2: ey }
    })

    const onMouseDown = (e, idx) => {
        e.preventDefault()
        setDragging(idx)
        setSelected(idx)
    }

    const onMouseMove = useCallback((e) => {
        if (dragging === null) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.max(20, Math.min(W - 20, e.clientX - rect.left))
        const y = Math.max(20, Math.min(H - 20, e.clientY - rect.top))
        setCharges(prev => prev.map((c, i) => i === dragging ? { ...c, x, y } : c))
    }, [dragging])

    const onMouseUp = () => setDragging(null)

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    const chargeColor = q => q > 0 ? '#D85A30' : q < 0 ? '#378ADD' : '#888'

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Charge q₁" unit=" nC" value={q1val} min={-10} max={10} step={0.5} onChange={v => updateQ(0, v)} />
                <SimSlider label="Charge q₂" unit=" nC" value={q2val} min={-10} max={10} step={0.5} onChange={v => updateQ(1, v)} />
            </div>

            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                Drag the charges to reposition them
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8, cursor: dragging !== null ? 'grabbing' : 'default' }}
                onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}>
                <defs>
                    {arrowDef('cf0', chargeColor(c0.q))}
                    {arrowDef('cf1', chargeColor(c1.q))}
                    {arrowDef('cfl', 'rgba(239,159,39,0.5)')}
                </defs>

                {/* Field lines from q1 */}
                {fieldLines.map((l, i) => (
                    <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                        stroke={`rgba(${c0.q > 0 ? '216,90,48' : '55,138,221'},0.2)`}
                        strokeWidth={0.8} markerEnd="url(#cfl)" />
                ))}

                {/* Distance line */}
                <line x1={c0.x} y1={c0.y} x2={c1.x} y2={c1.y}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={(c0.x + c1.x) / 2} y={(c0.y + c1.y) / 2 - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    r = {r_m.toFixed(2)} m
                </text>

                {/* Force arrows */}
                {attract ? (
                    <>
                        <line x1={c0.x} y1={c0.y}
                            x2={c0.x + ux * fScale} y2={c0.y + uy * fScale}
                            stroke={chargeColor(c0.q)} strokeWidth={2.5} markerEnd="url(#cf0)" />
                        <line x1={c1.x} y1={c1.y}
                            x2={c1.x - ux * fScale} y2={c1.y - uy * fScale}
                            stroke={chargeColor(c1.q)} strokeWidth={2.5} markerEnd="url(#cf1)" />
                    </>
                ) : (
                    <>
                        <line x1={c0.x} y1={c0.y}
                            x2={c0.x - ux * fScale} y2={c0.y - uy * fScale}
                            stroke={chargeColor(c0.q)} strokeWidth={2.5} markerEnd="url(#cf0)" />
                        <line x1={c1.x} y1={c1.y}
                            x2={c1.x + ux * fScale} y2={c1.y + uy * fScale}
                            stroke={chargeColor(c1.q)} strokeWidth={2.5} markerEnd="url(#cf1)" />
                    </>
                )}

                {/* Charges */}
                {charges.map((c, i) => (
                    <g key={c.id}
                        onMouseDown={e => onMouseDown(e, i)}
                        style={{ cursor: 'grab' }}>
                        <circle cx={c.x} cy={c.y} r={18}
                            fill={`${chargeColor(c.q)}22`}
                            stroke={chargeColor(c.q)} strokeWidth={selected === i ? 2.5 : 1.5} />
                        <text x={c.x} y={c.y + 5} textAnchor="middle"
                            style={{ fontSize: 13, fill: chargeColor(c.q), fontFamily: 'var(--mono)', fontWeight: 700, pointerEvents: 'none' }}>
                            {c.q > 0 ? '+' : '−'}
                        </text>
                        <text x={c.x} y={c.y + 32} textAnchor="middle"
                            style={{ fontSize: 9, fill: chargeColor(c.q), fontFamily: 'var(--mono)', pointerEvents: 'none' }}>
                            {(c.q * 1e9).toFixed(1)}nC
                        </text>
                    </g>
                ))}

                {/* Interaction label */}
                <text x={W / 2} y={H - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: attract ? 'rgba(29,158,117,0.6)' : 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                    {attract ? '← ATTRACTION →' : '← REPULSION →'}
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Force F', val: F >= 1e-3 ? `${F.toFixed(4)} N` : `${(F * 1e6).toFixed(4)} μN`, color: 'var(--amber)' },
                    { label: 'Distance r', val: `${r_m.toFixed(3)} m`, color: 'var(--teal)' },
                    { label: 'Interaction', val: attract ? 'Attractive' : 'Repulsive', color: attract ? 'var(--teal)' : 'var(--coral)' },
                    { label: 'F at 2r', val: F >= 1e-3 ? `${(F / 4).toFixed(4)} N` : `${(F / 4 * 1e6).toFixed(4)} μN`, color: 'var(--text3)' },
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