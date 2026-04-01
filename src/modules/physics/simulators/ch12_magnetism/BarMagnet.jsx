import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const CX = W / 2, CY = H / 2
const MAG_W = 80, MAG_H = 26

export default function BarMagnet() {
    const [strength, setStrength] = useState(5)
    const [flipped, setFlipped] = useState(false)
    const [showEarth, setShowEarth] = useState(false)
    const [dip, setDip] = useState(20)   // degrees

    const sign = flipped ? -1 : 1

    // North pole (right when not flipped)
    const NX = CX + MAG_W / 2
    const SX = CX - MAG_W / 2

    // Field lines — compute from dipole model
    const nLines = 12
    const fieldLines = useMemo(() => {
        const lines = []
        for (let li = 0; li < nLines; li++) {
            const angle0 = (li / nLines) * 2 * Math.PI
            const pts = []
            let x = NX * sign + (sign > 0 ? 1 : -1) * 10 * Math.cos(angle0)
            let y = CY + 10 * Math.sin(angle0)

            for (let step = 0; step < 120; step++) {
                pts.push([x, y])
                // Field from two magnetic poles (dipole)
                const dx_n = x - NX * sign, dy_n = y - CY
                const dx_s = x - SX * sign, dy_s = y - CY
                const r_n = Math.sqrt(dx_n * dx_n + dy_n * dy_n) + 1
                const r_s = Math.sqrt(dx_s * dx_s + dy_s * dy_s) + 1
                const Bx = sign * strength * dx_n / (r_n ** 3) - sign * strength * dx_s / (r_s ** 3)
                const By = sign * strength * dy_n / (r_n ** 3) - sign * strength * dy_s / (r_s ** 3)
                const Bmag = Math.sqrt(Bx * Bx + By * By) + 1e-6
                x += (Bx / Bmag) * 3
                y += (By / Bmag) * 3
                if (x < 10 || x > W - 10 || y < 10 || y > H - 10) break
                // Stop if we reached S pole
                const dxS = x - SX * sign, dyS = y - CY
                if (Math.sqrt(dxS * dxS + dyS * dyS) < 12) break
            }
            if (pts.length > 4) lines.push(pts)
        }
        return lines
    }, [strength, flipped])

    // Earth field overlay arrow
    const dipRad = dip * Math.PI / 180
    const earthBx = Math.cos(dipRad) * 30
    const earthBy = Math.sin(dipRad) * 30

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Magnet strength" unit="" value={strength} min={1} max={10} step={0.5} onChange={setStrength} />
                {showEarth && (
                    <SimSlider label="Angle of dip" unit="°" value={dip} min={0} max={90} step={1} onChange={setDip} />
                )}
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => setFlipped(p => !p)} style={{
                    padding: '5px 16px', borderRadius: 6, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(239,159,39,0.12)', color: 'var(--amber)',
                    border: '1px solid rgba(239,159,39,0.3)',
                }}>⇄ Flip poles</button>
                <button onClick={() => setShowEarth(p => !p)} style={{
                    padding: '5px 16px', borderRadius: 6, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: showEarth ? 'rgba(29,158,117,0.2)' : 'var(--bg3)',
                    color: showEarth ? 'var(--teal)' : 'var(--text2)',
                    border: `1px solid ${showEarth ? 'rgba(29,158,117,0.4)' : 'var(--border)'}`,
                }}>🌍 Earth's field</button>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    <marker id="bm_arr" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.6)"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                    <marker id="earth_arr" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(29,158,117,0.8)"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>

                {/* Field lines */}
                {fieldLines.map((pts, li) => {
                    if (pts.length < 2) return null
                    const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
                    const mid = pts[Math.floor(pts.length / 2)]
                    return (
                        <g key={li}>
                            <path d={d} fill="none"
                                stroke={`rgba(239,159,39,0.35)`}
                                strokeWidth={1.2} />
                            {/* Arrow at midpoint */}
                            {pts.length > 8 && (() => {
                                const i = Math.floor(pts.length * 0.55)
                                const p0 = pts[i], p1 = pts[i + 1] || pts[i]
                                return (
                                    <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]}
                                        stroke="rgba(239,159,39,0.5)" strokeWidth={1}
                                        markerEnd="url(#bm_arr)" />
                                )
                            })()}
                        </g>
                    )
                })}

                {/* Magnet body */}
                {/* South half */}
                <rect x={CX - MAG_W / 2 * sign - (sign > 0 ? MAG_W : 0)}
                    y={CY - MAG_H / 2}
                    width={MAG_W} height={MAG_H}
                    rx={4}
                    fill="rgba(55,138,221,0.35)"
                    stroke="#378ADD" strokeWidth={1.5} />
                <text x={CX - MAG_W / 2 * sign - (sign > 0 ? MAG_W : 0) + MAG_W / 2}
                    y={CY + 5} textAnchor="middle"
                    style={{ fontSize: 13, fill: '#378ADD', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    S
                </text>

                {/* North half */}
                <rect x={CX + MAG_W / 2 * sign - (sign > 0 ? 0 : -MAG_W)}
                    y={CY - MAG_H / 2}
                    width={MAG_W} height={MAG_H}
                    rx={4}
                    fill="rgba(216,90,48,0.35)"
                    stroke="#D85A30" strokeWidth={1.5} />
                <text x={CX + MAG_W / 2 * sign - (sign > 0 ? 0 : -MAG_W) + MAG_W / 2}
                    y={CY + 5} textAnchor="middle"
                    style={{ fontSize: 13, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    N
                </text>

                {/* Earth's field overlay */}
                {showEarth && (
                    <g>
                        {/* Geographic north arrow */}
                        <line x1={W - 50} y1={H - 50}
                            x2={W - 50} y2={H - 90}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}
                            markerEnd="url(#earth_arr)" />
                        <text x={W - 50} y={H - 94} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>N</text>

                        {/* Dip angle arrow */}
                        <line x1={W - 50} y1={H - 50}
                            x2={W - 50 + earthBx} y2={H - 50 + earthBy}
                            stroke="#1D9E75" strokeWidth={2}
                            markerEnd="url(#earth_arr)" />
                        <text x={W - 30} y={H - 14}
                            style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                            B_earth (dip={dip}°)
                        </text>

                        {/* Compass */}
                        <circle cx={W - 50} cy={H - 50} r={16}
                            fill="var(--bg3)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                        <line x1={W - 50} y1={H - 50}
                            x2={W - 50 + 12 * Math.sin(dip * Math.PI / 180)}
                            y2={H - 50 - 12 * Math.cos(dip * Math.PI / 180)}
                            stroke="#D85A30" strokeWidth={2} />
                        <line x1={W - 50} y1={H - 50}
                            x2={W - 50 - 12 * Math.sin(dip * Math.PI / 180)}
                            y2={H - 50 + 12 * Math.cos(dip * Math.PI / 180)}
                            stroke="#378ADD" strokeWidth={2} />
                    </g>
                )}

                {/* Axial / Equatorial labels */}
                <text x={CX} y={22} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    Axial line (B = μ₀2M/4πr³) — stronger
                </text>
                <text x={16} y={CY + 4}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                    Equatorial
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Pole type', val: flipped ? 'S (left) — N (right)' : 'N (right) — S (left)', color: 'var(--amber)' },
                    { label: 'B axial ∝ 2M/r³', val: 'Stronger on axis', color: 'var(--coral)' },
                    { label: 'B equatorial ∝ M/r³', val: 'Half of axial', color: 'var(--teal)' },
                    { label: 'Field direction', val: 'N→S outside, S→N inside', color: 'var(--text3)' },
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