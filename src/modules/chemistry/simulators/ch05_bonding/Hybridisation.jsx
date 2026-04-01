import { useState, useEffect, useRef } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const HYBRIDS = {
    'sp': {
        color: '#EF9F27',
        orbitals: ['s', 'p'],
        hybridOrbitals: 2,
        geometry: 'Linear',
        angle: '180°',
        pOrbitals: 2,   // unhybridised p orbitals (for π bonds)
        examples: ['BeCl₂', 'CO₂', 'C₂H₂', 'HCN'],
        desc: '1 s + 1 p orbital mix to form 2 sp hybrid orbitals. 2 unhybridised p orbitals remain for π bonding.',
        schar: '50% s, 50% p',
    },
    'sp²': {
        color: '#1D9E75',
        orbitals: ['s', 'p', 'p'],
        hybridOrbitals: 3,
        geometry: 'Trigonal planar',
        angle: '120°',
        pOrbitals: 1,
        examples: ['BF₃', 'C₂H₄', 'SO₃', 'NO₃⁻'],
        desc: '1 s + 2 p orbitals mix to form 3 sp² hybrid orbitals arranged in a plane. 1 unhybridised p orbital available for π bonding.',
        schar: '33% s, 67% p',
    },
    'sp³': {
        color: '#7F77DD',
        orbitals: ['s', 'p', 'p', 'p'],
        hybridOrbitals: 4,
        geometry: 'Tetrahedral',
        angle: '109.5°',
        pOrbitals: 0,
        examples: ['CH₄', 'NH₃', 'H₂O', 'CCl₄'],
        desc: '1 s + 3 p orbitals mix to form 4 equivalent sp³ hybrid orbitals pointing to corners of a tetrahedron.',
        schar: '25% s, 75% p',
    },
    'sp³d': {
        color: '#D85A30',
        orbitals: ['s', 'p', 'p', 'p', 'd'],
        hybridOrbitals: 5,
        geometry: 'Trigonal bipyramidal',
        angle: '90°/120°',
        pOrbitals: 0,
        examples: ['PCl₅', 'SF₄', 'ClF₃'],
        desc: '1 s + 3 p + 1 d orbital mix. Used for expanded octet (period 3+ elements). 5 hybrid orbitals formed.',
        schar: '20% s, 60% p, 20% d',
    },
    'sp³d²': {
        color: '#378ADD',
        orbitals: ['s', 'p', 'p', 'p', 'd', 'd'],
        hybridOrbitals: 6,
        geometry: 'Octahedral',
        angle: '90°',
        pOrbitals: 0,
        examples: ['SF₆', 'XeF₄', 'PCl₆⁻'],
        desc: '1 s + 3 p + 2 d orbitals mix to form 6 equivalent hybrid orbitals pointing to corners of an octahedron.',
        schar: '17% s, 50% p, 33% d',
    },
}

// Orbital positions for each hybridisation
const HYBRID_POSITIONS = {
    'sp': (i, R) => {
        const angles = [0, 180]
        const a = angles[i] * Math.PI / 180
        return { x: Math.cos(a) * R, y: Math.sin(a) * R * 0.3 }   // isometric-ish
    },
    'sp²': (i, R) => {
        const angles = [90, 210, 330]
        const a = angles[i] * Math.PI / 180
        return { x: Math.cos(a) * R, y: Math.sin(a) * R }
    },
    'sp³': (i, R) => {
        const positions = [[0, -1], [0.94, 0.33], [-0.47, 0.33 + 0.82], [-0.47, 0.33 - 0.82]]
        return { x: positions[i][0] * R, y: positions[i][1] * R * 0.7 }
    },
    'sp³d': (i, R) => {
        const positions = [[0, -1.1], [0.94, 0.3], [-0.94, 0.3], [0, 0.6], [-0.6, -0.3]]
        return { x: positions[Math.min(i, 4)][0] * R * 0.9, y: positions[Math.min(i, 4)][1] * R * 0.9 }
    },
    'sp³d²': (i, R) => {
        const positions = [[1, 0], [-1, 0], [0, -1], [0, 1], [0.7, -0.7], [0.7, 0.7]]
        return { x: positions[Math.min(i, 5)][0] * R * 0.85, y: positions[Math.min(i, 5)][1] * R * 0.85 }
    },
}

export default function Hybridisation() {
    const [hyb, setHyb] = useState('sp³')
    const [step, setStep] = useState(2)   // 0=atomic orbitals, 1=mixing, 2=hybrid
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    useEffect(() => {
        const s = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(s)
        }
        rafRef.current = requestAnimationFrame(s)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const h = HYBRIDS[hyb]
    const CX = 210, CY = 130, R = 80

    const getPos = HYBRID_POSITIONS[hyb] || HYBRID_POSITIONS['sp³']

    // Animation: step 1 = orbitals fly in, step 2 = fully formed
    const anim = step === 0 ? 0 : step === 1 ? Math.min(1, (t % 2)) : 1

    // Orbital color for atomic orbitals
    const ORB_COLORS = { s: '#EF9F27', p: '#1D9E75', d: '#378ADD' }

    return (
        <div>
            {/* Hybridisation selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(HYBRIDS).map(k => (
                    <button key={k} onClick={() => { setHyb(k); setStep(2) }} style={{
                        padding: '5px 14px', borderRadius: 20, fontSize: 13,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: hyb === k ? HYBRIDS[k].color : 'var(--bg3)',
                        color: hyb === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${hyb === k ? HYBRIDS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Step selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { v: 0, l: 'Atomic orbitals' },
                    { v: 1, l: 'Mixing animation' },
                    { v: 2, l: 'Hybrid orbitals' },
                ].map(opt => (
                    <button key={opt.v} onClick={() => setStep(opt.v)} style={{
                        flex: 1, padding: '5px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: step === opt.v ? h.color : 'var(--bg3)',
                        color: step === opt.v ? '#000' : 'var(--text2)',
                        border: `1px solid ${step === opt.v ? h.color : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* Main diagram */}
                <div style={{ background: 'rgba(0,0,0,0.22)', border: `1px solid ${h.color}30`, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: h.color, letterSpacing: 2, marginBottom: 8 }}>
                        {step === 0 ? 'ATOMIC ORBITALS' : step === 1 ? 'MIXING…' : 'HYBRID ORBITALS'}
                    </div>

                    <svg viewBox="0 0 420 260" width="100%">
                        {step === 0 && (
                            // Atomic orbitals — stacked horizontally
                            <g>
                                {h.orbitals.map((orb, i) => {
                                    const col = ORB_COLORS[orb]
                                    const ox = 40 + i * 70
                                    const oy = 130
                                    return (
                                        <g key={i}>
                                            {/* Orbital lobes */}
                                            <ellipse cx={ox} cy={oy - 30} rx={orb === 's' ? 20 : 14} ry={orb === 's' ? 20 : 28}
                                                fill={`${col}20`} stroke={col} strokeWidth={1.5} />
                                            {orb !== 's' && (
                                                <ellipse cx={ox} cy={oy + 30} rx={14} ry={28}
                                                    fill={`${col}10`} stroke={`${col}60`} strokeWidth={1}
                                                    strokeDasharray="3 2" />
                                            )}
                                            <text x={ox} y={oy + 70} textAnchor="middle"
                                                style={{ fontSize: 11, fill: col, fontFamily: 'var(--mono)', fontWeight: 700 }}>{orb}</text>
                                        </g>
                                    )
                                })}
                                <text x={210} y={240} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                    {h.orbitals.length} atomic orbitals → {h.hybridOrbitals} hybrid orbitals
                                </text>
                            </g>
                        )}

                        {step === 1 && (
                            // Mixing animation — orbitals converge to centre
                            <g>
                                {h.orbitals.map((orb, i) => {
                                    const col = ORB_COLORS[orb]
                                    const startX = 30 + i * 70
                                    const px = startX + (CX - startX) * anim
                                    const py = 130
                                    const alpha = 1 - anim * 0.7
                                    return (
                                        <ellipse key={i}
                                            cx={px} cy={py}
                                            rx={20 + anim * 10} ry={20 + anim * 10}
                                            fill={`${col}${Math.round(alpha * 40).toString(16).padStart(2, '0')}`}
                                            stroke={col} strokeWidth={1.5}
                                            opacity={alpha} />
                                    )
                                })}
                                {/* Emerging hybrid */}
                                {anim > 0.5 && (
                                    <g opacity={(anim - 0.5) * 2}>
                                        {Array.from({ length: h.hybridOrbitals }, (_, i) => {
                                            const pos = getPos(i, R * anim)
                                            const px = CX + pos.x
                                            const py = CY + pos.y
                                            return (
                                                <ellipse key={i} cx={px} cy={py} rx={18} ry={12}
                                                    transform={`rotate(${Math.atan2(pos.y, pos.x) * 180 / Math.PI},${px},${py})`}
                                                    fill={`${h.color}25`} stroke={h.color} strokeWidth={1.5} />
                                            )
                                        })}
                                    </g>
                                )}
                                <text x={CX} y={240} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                    Hybridisation in progress…
                                </text>
                            </g>
                        )}

                        {step === 2 && (
                            // Final hybrid orbitals
                            <g>
                                {/* Central atom */}
                                <circle cx={CX} cy={CY} r={10}
                                    fill={`${h.color}30`} stroke={h.color} strokeWidth={1.5} />

                                {/* Hybrid orbital lobes */}
                                {Array.from({ length: h.hybridOrbitals }, (_, i) => {
                                    const pos = getPos(i, R)
                                    const px = CX + pos.x
                                    const py = CY + pos.y
                                    const ang = Math.atan2(pos.y, pos.x) * 180 / Math.PI
                                    const bobble = Math.sin(t * 0.6 + i * 1.2) * 1.5
                                    return (
                                        <g key={i}>
                                            {/* Bond line */}
                                            <line x1={CX} y1={CY} x2={px + bobble * Math.cos(ang * Math.PI / 180)} y2={py + bobble * Math.sin(ang * Math.PI / 180)}
                                                stroke={`${h.color}30`} strokeWidth={1} strokeDasharray="3 3" />
                                            {/* Large lobe */}
                                            <ellipse
                                                cx={px + bobble * 0.5}
                                                cy={py + bobble * 0.3}
                                                rx={22} ry={13}
                                                transform={`rotate(${ang},${px + bobble * 0.5},${py + bobble * 0.3})`}
                                                fill={`${h.color}25`}
                                                stroke={h.color} strokeWidth={2} />
                                            {/* Small back lobe */}
                                            <ellipse
                                                cx={CX - pos.x * 0.25}
                                                cy={CY - pos.y * 0.25}
                                                rx={8} ry={5}
                                                transform={`rotate(${ang},${CX - pos.x * 0.25},${CY - pos.y * 0.25})`}
                                                fill={`${h.color}08`}
                                                stroke={`${h.color}30`} strokeWidth={0.8} />
                                            {/* Number label */}
                                            <text x={CX + pos.x * 1.45} y={CY + pos.y * 1.45 + 4} textAnchor="middle"
                                                style={{ fontSize: 9, fill: h.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                                {i + 1}
                                            </text>
                                        </g>
                                    )
                                })}

                                {/* Unhybridised p orbitals */}
                                {h.pOrbitals > 0 && (
                                    <g opacity={0.45}>
                                        <ellipse cx={CX} cy={CY - 48} rx={10} ry={40}
                                            fill="rgba(127,119,221,0.12)"
                                            stroke="#7F77DD" strokeWidth={1.2} strokeDasharray="4 3" />
                                        <ellipse cx={CX} cy={CY + 48} rx={10} ry={40}
                                            fill="rgba(127,119,221,0.08)"
                                            stroke="#7F77DD" strokeWidth={1.2} strokeDasharray="4 3" />
                                        <text x={CX + 16} y={CY - 56}
                                            style={{ fontSize: 8, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>
                                            p (π)
                                        </text>
                                    </g>
                                )}

                                <text x={CX} y={248} textAnchor="middle"
                                    style={{ fontSize: 10, fill: h.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    {hyb} — {h.geometry} ({h.angle})
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '12px 14px', background: `${h.color}10`, border: `1px solid ${h.color}30`, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: h.color, letterSpacing: 1.5, marginBottom: 6 }}>
                            {hyb} HYBRIDISATION
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                            {h.desc}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 8 }}>
                            ORBITAL COMPOSITION
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                            {h.orbitals.map((orb, i) => (
                                <div key={i} style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                    fontFamily: 'var(--mono)', fontWeight: 700,
                                    background: `${ORB_COLORS[orb]}20`,
                                    color: ORB_COLORS[orb],
                                    border: `1px solid ${ORB_COLORS[orb]}40`,
                                }}>{orb}</div>
                            ))}
                            <span style={{ fontSize: 14, color: 'var(--text3)', alignSelf: 'center' }}>→</span>
                            {Array.from({ length: h.hybridOrbitals }, (_, i) => (
                                <div key={i} style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                    fontFamily: 'var(--mono)', fontWeight: 700,
                                    background: `${h.color}25`, color: h.color,
                                    border: `1px solid ${h.color}50`,
                                }}>{hyb}</div>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            {h.schar}
                            {h.pOrbitals > 0 ? ` · ${h.pOrbitals} unhybridised p orbital${h.pOrbitals > 1 ? 's' : ''} for π bonds` : ''}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            EXAMPLES
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {h.examples.map(ex => (
                                <div key={ex} style={{
                                    padding: '4px 10px', borderRadius: 6, fontSize: 12,
                                    fontFamily: 'var(--mono)', fontWeight: 700,
                                    background: `${h.color}12`, color: h.color,
                                    border: `1px solid ${h.color}30`,
                                }}>{ex}</div>
                            ))}
                        </div>
                    </div>

                    {h.pOrbitals > 0 && (
                        <div style={{ padding: '12px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 10, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            <span style={{ color: 'var(--purple)', fontWeight: 700 }}>π bonding:</span> {h.pOrbitals} unhybridised p orbital{h.pOrbitals > 1 ? 's' : ''} remain perpendicular to the molecular plane — available for sideways overlap to form π bonds.
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Hybridisation" value={hyb} color={h.color} highlight />
                <ValueCard label="Geometry" value={h.geometry} color="var(--gold)" />
                <ValueCard label="Bond angle" value={h.angle} color="var(--teal)" />
                <ValueCard label="π bonds" value={h.pOrbitals > 0 ? `${h.pOrbitals} p orbital(s) free` : 'None'} color={h.pOrbitals > 0 ? 'var(--purple)' : 'var(--text3)'} />
            </div>
        </div>
    )
}