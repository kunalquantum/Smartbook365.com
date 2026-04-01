import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const K = 9e9
const GRID = 10   // field vector grid spacing

const CHARGE_PRESETS = [
    { label: 'Point charge', charges: [{ x: 230, y: 150, q: 4e-9 }] },
    { label: 'Dipole', charges: [{ x: 170, y: 150, q: 3e-9 }, { x: 290, y: 150, q: -3e-9 }] },
    { label: 'Two positive', charges: [{ x: 160, y: 150, q: 3e-9 }, { x: 300, y: 150, q: 3e-9 }] },
]

export default function EFieldPotential() {
    const [preset, setPreset] = useState(0)
    const [testX, setTestX] = useState(310)
    const [testY, setTestY] = useState(100)
    const [view, setView] = useState('field')  // field | potential
    const [dragging, setDragging] = useState(false)

    const charges = CHARGE_PRESETS[preset].charges

    // Compute E at point (px, py)
    const computeE = (px, py) => {
        let ex = 0, ey = 0
        charges.forEach(c => {
            const dx = px - c.x, dy = py - c.y
            const r2 = dx * dx + dy * dy
            if (r2 < 100) return
            const r = Math.sqrt(r2)
            const r_m = r / 50
            const E = K * Math.abs(c.q) / (r_m * r_m)
            const sign = c.q > 0 ? 1 : -1
            ex += sign * E * dx / r
            ey += sign * E * dy / r
        })
        return { ex, ey, mag: Math.sqrt(ex * ex + ey * ey) }
    }

    // Compute V at point
    const computeV = (px, py) => {
        let v = 0
        charges.forEach(c => {
            const dx = px - c.x, dy = py - c.y
            const r = Math.sqrt(dx * dx + dy * dy)
            if (r < 8) return
            const r_m = r / 50
            v += K * c.q / r_m
        })
        return v
    }

    // Field at test charge
    const { ex, ey, mag } = computeE(testX, testY)
    const V_test = computeV(testX, testY)

    // Grid of field vectors
    const gridVectors = useMemo(() => {
        const vecs = []
        for (let gx = GRID; gx < W; gx += GRID * 4) {
            for (let gy = GRID; gy < H; gy += GRID * 4) {
                const { ex, ey, mag } = computeE(gx, gy)
                if (mag === 0) continue
                const len = Math.min(14, Math.log10(mag + 1) * 3)
                const nx = ex / mag, ny = ey / mag
                const opacity = Math.min(0.6, Math.log10(mag + 1) / 8)
                vecs.push({ x: gx, y: gy, dx: nx * len, dy: ny * len, opacity })
            }
        }
        return vecs
    }, [preset])

    // Equipotential contours — sample potential on grid and draw level curves
    const equipotentials = useMemo(() => {
        const levels = [-3e4, -1e4, -3e3, 0, 3e3, 1e4, 3e4]
        const points = {}
        levels.forEach(lv => { points[lv] = [] })
        for (let gx = 5; gx < W; gx += 6) {
            for (let gy = 5; gy < H; gy += 6) {
                const v = computeV(gx, gy)
                levels.forEach(lv => {
                    const v2 = computeV(gx + 6, gy)
                    if ((v - lv) * (v2 - lv) < 0) {
                        const t = (lv - v) / (v2 - v)
                        points[lv].push({ x: gx + t * 6, y: gy })
                    }
                })
            }
        }
        return points
    }, [preset])

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    const chargeColor = q => q > 0 ? '#D85A30' : '#378ADD'

    return (
        <div>
            {/* Preset selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {CHARGE_PRESETS.map((p, i) => (
                    <button key={i} onClick={() => setPreset(i)} style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: preset === i ? 'var(--amber)' : 'var(--bg3)',
                        color: preset === i ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{p.label}</button>
                ))}
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {['field', 'potential'].map(v => (
                    <button key={v} onClick={() => setView(v)} style={{
                        padding: '4px 14px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: view === v ? 'var(--teal)' : 'var(--bg3)',
                        color: view === v ? '#fff' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>
                        {v === 'field' ? 'E-field vectors' : 'Equipotentials'}
                    </button>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8, cursor: dragging ? 'grabbing' : 'crosshair' }}
                onMouseMove={e => {
                    if (!dragging) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    setTestX(Math.max(10, Math.min(W - 10, e.clientX - rect.left)))
                    setTestY(Math.max(10, Math.min(H - 10, e.clientY - rect.top)))
                }}
                onMouseUp={() => setDragging(false)}
                onMouseLeave={() => setDragging(false)}>

                <defs>
                    {arrowDef('ef_arr', 'rgba(239,159,39,0.7)')}
                    {arrowDef('test_arr', '#1D9E75')}
                </defs>

                {/* Field vectors */}
                {view === 'field' && gridVectors.map((v, i) => (
                    <line key={i}
                        x1={v.x} y1={v.y}
                        x2={v.x + v.dx} y2={v.y + v.dy}
                        stroke={`rgba(239,159,39,${v.opacity})`}
                        strokeWidth={0.8}
                        markerEnd="url(#ef_arr)" />
                ))}

                {/* Equipotential dots */}
                {view === 'potential' && Object.entries(equipotentials).map(([lv, pts]) => {
                    const level = Number(lv)
                    const hue = level > 0 ? `rgba(216,90,48,0.5)` : level < 0 ? `rgba(55,138,221,0.5)` : `rgba(29,158,117,0.5)`
                    return pts.map((pt, i) => (
                        <circle key={`${lv}_${i}`} cx={pt.x} cy={pt.y} r={1}
                            fill={hue} />
                    ))
                })}

                {/* Source charges */}
                {charges.map((c, i) => (
                    <g key={i}>
                        {/* Glow */}
                        <circle cx={c.x} cy={c.y} r={28}
                            fill={`${chargeColor(c.q)}08`} />
                        <circle cx={c.x} cy={c.y} r={16}
                            fill={`${chargeColor(c.q)}18`}
                            stroke={chargeColor(c.q)} strokeWidth={1.5} />
                        <text x={c.x} y={c.y + 5} textAnchor="middle"
                            style={{ fontSize: 14, fill: chargeColor(c.q), fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {c.q > 0 ? '+' : '−'}
                        </text>
                    </g>
                ))}

                {/* Test charge (draggable) */}
                <g onMouseDown={() => setDragging(true)} style={{ cursor: 'grab' }}>
                    <circle cx={testX} cy={testY} r={10}
                        fill="rgba(29,158,117,0.25)"
                        stroke="#1D9E75" strokeWidth={2} />
                    <text x={testX} y={testY + 4} textAnchor="middle"
                        style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)', pointerEvents: 'none' }}>q</text>
                </g>

                {/* E arrow at test charge */}
                {mag > 0 && (() => {
                    const len = Math.min(50, Math.log10(mag + 1) * 10)
                    const nx = ex / mag, ny = ey / mag
                    return (
                        <line x1={testX} y1={testY}
                            x2={testX + nx * len} y2={testY + ny * len}
                            stroke="#1D9E75" strokeWidth={2}
                            markerEnd="url(#test_arr)" />
                    )
                })()}

                {/* Potential label at test */}
                <text x={testX + 14} y={testY - 10}
                    style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    V={V_test > 0 ? '+' : ''}{(V_test / 1000).toFixed(1)}kV
                </text>

                {/* Legend */}
                {view === 'potential' && (
                    <g>
                        <circle cx={14} cy={14} r={3} fill="rgba(216,90,48,0.7)" />
                        <text x={20} y={18} style={{ fontSize: 8, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>+V</text>
                        <circle cx={14} cy={26} r={3} fill="rgba(55,138,221,0.7)" />
                        <text x={20} y={30} style={{ fontSize: 8, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>−V</text>
                    </g>
                )}

                <text x={W - 10} y={H - 8} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                    drag green test charge
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'E at test charge', val: mag > 1e6 ? `${(mag / 1e6).toFixed(2)} MV/m` : mag > 1e3 ? `${(mag / 1e3).toFixed(2)} kV/m` : `${mag.toFixed(2)} V/m`, color: 'var(--amber)' },
                    { label: 'V at test charge', val: `${(V_test / 1000).toFixed(3)} kV`, color: V_test > 0 ? 'var(--coral)' : 'var(--teal)' },
                    { label: 'E direction', val: `(${(ex / mag).toFixed(2)}, ${(ey / mag).toFixed(2)})`, color: 'var(--text2)' },
                    { label: 'E = −dV/dr', val: 'Field ⊥ equipotential', color: 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}