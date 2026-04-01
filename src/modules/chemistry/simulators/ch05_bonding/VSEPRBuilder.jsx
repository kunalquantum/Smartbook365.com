import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const GEOMETRIES = {
    '2-0': { name: 'Linear', angle: '180°', color: '#EF9F27', desc: 'AX₂ — 2 bond pairs, 0 lone pairs' },
    '3-0': { name: 'Trigonal planar', angle: '120°', color: '#1D9E75', desc: 'AX₃ — 3 bond pairs, 0 lone pairs' },
    '3-1': { name: 'Bent (trigonal)', angle: '<120° (~117°)', color: '#D85A30', desc: 'AX₂E — 2 bond, 1 lone pair' },
    '4-0': { name: 'Tetrahedral', angle: '109.5°', color: '#7F77DD', desc: 'AX₄ — 4 bond pairs, 0 lone pairs' },
    '4-1': { name: 'Trigonal pyramidal', angle: '<109.5° (~107°)', color: '#378ADD', desc: 'AX₃E — 3 bond, 1 lone pair' },
    '4-2': { name: 'Bent (tetrahedral)', angle: '<107° (~104.5°)', color: '#EF9F27', desc: 'AX₂E₂ — 2 bond, 2 lone pairs' },
    '5-0': { name: 'Trigonal bipyramidal', angle: '90°/120°', color: '#D85A30', desc: 'AX₅ — 5 bond pairs, expanded octet' },
    '5-1': { name: 'See-saw', angle: '~177°/~102°', color: '#1D9E75', desc: 'AX₄E — 4 bond, 1 lone pair' },
    '5-2': { name: 'T-shaped', angle: '~180°/~90°', color: '#7F77DD', desc: 'AX₃E₂ — 3 bond, 2 lone pairs' },
    '6-0': { name: 'Octahedral', angle: '90°', color: '#FAC775', desc: 'AX₆ — 6 bond pairs, expanded octet' },
    '6-1': { name: 'Square pyramidal', angle: '~87°', color: '#D85A30', desc: 'AX₅E — 5 bond, 1 lone pair' },
    '6-2': { name: 'Square planar', angle: '90°', color: '#7F77DD', desc: 'AX₄E₂ — 4 bond, 2 lone pairs' },
}

const EXAMPLES = {
    '2-0': 'BeCl₂, CO₂, HCN',
    '3-0': 'BF₃, SO₃, AlCl₃',
    '3-1': 'SO₂, NO₂⁻, SnCl₂',
    '4-0': 'CH₄, CCl₄, SiH₄, NH₄⁺',
    '4-1': 'NH₃, PCl₃, H₃O⁺',
    '4-2': 'H₂O, OF₂, SCl₂',
    '5-0': 'PCl₅, AsF₅',
    '5-1': 'SF₄, XeO₂F₂',
    '5-2': 'ClF₃, XeOF₂',
    '6-0': 'SF₆, Mo(CO)₆',
    '6-1': 'IF₅, BrF₅',
    '6-2': 'XeF₄, ICl₄⁻',
}

// Draw 2D projection of geometry
function GeometryDiagram({ bp, lp, color, size = 220 }) {
    const CX = size / 2, CY = size / 2, R = size * 0.34, r = size * 0.22
    const key = `${bp + lp}-${lp}`
    const geo = GEOMETRIES[`${bp + lp}-${lp}`] || GEOMETRIES[`${bp}-${lp}`] || null

    const totalPairs = bp + lp
    // Positions of all pairs (bond + lone)
    const pairAngles = []
    if (totalPairs === 2) pairAngles.push(0, 180)
    else if (totalPairs === 3) pairAngles.push(90, 210, 330)
    else if (totalPairs === 4) pairAngles.push(70, 160, 250, 340)
    else if (totalPairs === 5) pairAngles.push(90, 162, 234, 306, 18)
    else if (totalPairs === 6) pairAngles.push(0, 60, 120, 180, 240, 300)
    else pairAngles.push(0)

    // First bp angles are bond pairs, rest are lone pairs
    const bondAngles = pairAngles.slice(0, bp)
    const loneAngles = pairAngles.slice(bp)

    return (
        <svg viewBox={`0 0 ${size} ${size}`} width="100%">
            {/* Central atom */}
            <circle cx={CX} cy={CY} r={18}
                fill={`${color}25`} stroke={color} strokeWidth={2} />
            <text x={CX} y={CY + 5} textAnchor="middle"
                style={{ fontSize: 11, fill: color, fontFamily: 'var(--mono)', fontWeight: 700 }}>A</text>

            {/* Bond pairs */}
            {bondAngles.map((ang, i) => {
                const rad = ang * Math.PI / 180
                const bx = CX + R * Math.cos(rad)
                const by = CY + R * Math.sin(rad)
                return (
                    <g key={`b${i}`}>
                        <line x1={CX + 18 * Math.cos(rad)} y1={CY + 18 * Math.sin(rad)}
                            x2={bx - 14 * Math.cos(rad)} y2={by - 14 * Math.sin(rad)}
                            stroke={`${color}60`} strokeWidth={2.5} strokeLinecap="round" />
                        <circle cx={bx} cy={by} r={14}
                            fill={`${color}20`} stroke={color} strokeWidth={1.8} />
                        <text x={bx} y={by + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: color, fontFamily: 'var(--mono)', fontWeight: 700 }}>X</text>
                        {/* Bond angle arc */}
                        {i > 0 && (
                            <path
                                d={`M ${CX + 30 * Math.cos(bondAngles[0] * Math.PI / 180)} ${CY + 30 * Math.sin(bondAngles[0] * Math.PI / 180)}
                    A 30 30 0 0 1
                    ${CX + 30 * Math.cos(rad)} ${CY + 30 * Math.sin(rad)}`}
                                fill="none"
                                stroke={`${color}25`} strokeWidth={1}
                            />
                        )}
                    </g>
                )
            })}

            {/* Lone pairs */}
            {loneAngles.map((ang, i) => {
                const rad = ang * Math.PI / 180
                const lx = CX + r * Math.cos(rad)
                const ly = CY + r * Math.sin(rad)
                return (
                    <g key={`lp${i}`}>
                        <line x1={CX + 18 * Math.cos(rad)} y1={CY + 18 * Math.sin(rad)}
                            x2={lx - 8 * Math.cos(rad)} y2={ly - 8 * Math.sin(rad)}
                            stroke="rgba(239,159,39,0.2)" strokeWidth={1} strokeDasharray="3 3" />
                        <ellipse cx={lx} cy={ly} rx={14} ry={9}
                            transform={`rotate(${ang},${lx},${ly})`}
                            fill="rgba(239,159,39,0.1)"
                            stroke="rgba(239,159,39,0.5)" strokeWidth={1.5} strokeDasharray="4 2" />
                        <text x={lx} y={ly + 4} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>LP</text>
                    </g>
                )
            })}

            {/* Geometry label */}
            <text x={CX} y={size - 6} textAnchor="middle"
                style={{ fontSize: 10, fill: color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                {geo?.name || '?'}
            </text>
        </svg>
    )
}

export default function VSEPRBuilder() {
    const [bp, setBP] = useState(2)  // bond pairs
    const [lp, setLP] = useState(0)  // lone pairs

    const total = bp + lp
    const key = `${total}-${lp}`
    const altKey = `${bp}-${lp}`
    const geo = GEOMETRIES[key] || GEOMETRIES[altKey]

    // Repulsion order explanation
    const repulsions = ['LP-LP > LP-BP > BP-BP']
    const actualAngle = geo?.angle || '?'
    const ideal = total === 2 ? 180 : total === 3 ? 120 : total === 4 ? 109.5 : total === 5 ? 90 : 90

    return (
        <div>
            {/* VSEPR intro */}
            <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700 }}>VSEPR:</span> Electron pairs (bonding + lone) arrange themselves to minimise repulsion. Lone pairs repel more strongly than bonding pairs — they compress bond angles below ideal values.
            </div>

            {/* Bond pair selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 120 }}>
                    Bond pairs (X):
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4, 5, 6].map(v => (
                        <button key={v} onClick={() => setBP(v)} style={{
                            width: 36, height: 36, borderRadius: 6, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: bp === v ? geo?.color || 'var(--teal)' : 'var(--bg3)',
                            color: bp === v ? '#000' : 'var(--text2)',
                            border: `1px solid ${bp === v ? geo?.color || 'var(--teal)' : 'var(--border)'}`,
                        }}>{v}</button>
                    ))}
                </div>
            </div>

            {/* Lone pair selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 120 }}>
                    Lone pairs (E):
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[0, 1, 2, 3].map(v => (
                        <button key={v} onClick={() => setLP(v)} style={{
                            width: 36, height: 36, borderRadius: 6, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: lp === v ? 'rgba(239,159,39,0.4)' : 'var(--bg3)',
                            color: lp === v ? '#000' : 'var(--text2)',
                            border: `1px solid ${lp === v ? 'var(--gold)' : 'var(--border)'}`,
                        }}>{v}</button>
                    ))}
                </div>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                    ({bp + lp} total electron pairs)
                </span>
            </div>

            {/* Main layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 14 }}>

                {/* Geometry diagram */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${geo?.color || 'var(--border)'}30`, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: geo?.color || 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ VSEPR SHAPE
                    </div>
                    {geo
                        ? <GeometryDiagram bp={bp} lp={lp} color={geo.color} size={176} />
                        : (
                            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                                Select bond and lone pairs
                            </div>
                        )
                    }
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                    {geo ? (
                        <>
                            {/* Shape name */}
                            <div style={{ padding: '12px 16px', background: `${geo.color}12`, border: `1px solid ${geo.color}35`, borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: geo.color, letterSpacing: 1.5, marginBottom: 6 }}>
                                    MOLECULAR GEOMETRY
                                </div>
                                <div style={{ fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700, color: geo.color }}>{geo.name}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>{geo.desc}</div>
                            </div>

                            {/* Bond angle */}
                            <div style={{ padding: '12px 16px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 4 }}>
                                    BOND ANGLE
                                </div>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>{geo.angle}</div>
                                {lp > 0 && (
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                        Ideal would be {ideal}° but lone pair(s) compress the angle
                                    </div>
                                )}
                            </div>

                            {/* Examples */}
                            <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                                    EXAMPLES
                                </div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', fontWeight: 600 }}>
                                    {EXAMPLES[key] || EXAMPLES[altKey] || 'No examples listed'}
                                </div>
                            </div>

                            {/* Repulsion hierarchy */}
                            <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                                    REPULSION ORDER
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {['LP−LP', '>', 'LP−BP', '>', 'BP−BP'].map((s, i) => (
                                        <span key={i} style={{
                                            fontSize: 12, fontFamily: 'var(--mono)',
                                            color: s === '>' ? 'var(--text3)' : i === 0 ? 'var(--coral)' : i === 2 ? 'var(--gold)' : 'var(--teal)',
                                            fontWeight: s !== '>' ? 700 : 400,
                                        }}>{s}</span>
                                    ))}
                                </div>
                                {lp > 0 && (
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 6, lineHeight: 1.6 }}>
                                        {lp} lone pair{lp > 1 ? 's' : ''} exert{lp === 1 ? 's' : ''} extra repulsion → angle compressed below {ideal}°
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ padding: 24, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                            Choose bond pairs and lone pairs to see the geometry
                        </div>
                    )}
                </div>
            </div>

            {/* All geometries quick reference */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, letterSpacing: 1 }}>
                    QUICK REFERENCE — ALL VSEPR GEOMETRIES
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {Object.entries(GEOMETRIES).map(([k, g]) => (
                        <button key={k} onClick={() => { const [tp, lps] = k.split('-').map(Number); setBP(tp - lps); setLP(lps) }} style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 10,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: key === k || altKey === k ? g.color : 'var(--bg3)',
                            color: key === k || altKey === k ? '#000' : 'var(--text2)',
                            border: `1px solid ${key === k || altKey === k ? g.color : 'var(--border)'}`,
                        }}>{g.name}</button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Geometry" value={geo?.name || '?'} color={geo?.color || 'var(--text3)'} highlight />
                <ValueCard label="Bond angle" value={geo?.angle || '?'} color="var(--gold)" />
                <ValueCard label="Formula type" value={`AX${bp}${lp > 0 ? 'E' + lp : ''}`} color="var(--teal)" />
                <ValueCard label="Total pairs" value={`${total}`} color="var(--text2)" />
            </div>
        </div>
    )
}