import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const MOLECULES = {
    'H₂O': {
        atoms: [
            { sym: 'O', x: 200, y: 120, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
            { sym: 'H', x: 120, y: 170, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 280, y: 170, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
        ],
        bonds: [[0, 1, 1], [0, 2, 1]],
        totalVE: 8, shape: 'Bent', angle: '104.5°',
        desc: 'Oxygen has 2 lone pairs and 2 bonding pairs.',
    },
    'CO₂': {
        atoms: [
            { sym: 'C', x: 200, y: 120, valence: 4, lone: 0, bonds: 4, color: '#888780', r: 16 },
            { sym: 'O', x: 110, y: 120, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
            { sym: 'O', x: 290, y: 120, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
        ],
        bonds: [[0, 1, 2], [0, 2, 2]],
        totalVE: 16, shape: 'Linear', angle: '180°',
        desc: 'Carbon forms 2 double bonds. All atoms satisfy octet.',
    },
    'NH₃': {
        atoms: [
            { sym: 'N', x: 200, y: 110, valence: 5, lone: 1, bonds: 3, color: '#378ADD', r: 16 },
            { sym: 'H', x: 130, y: 170, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 200, y: 188, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 270, y: 170, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
        ],
        bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]],
        totalVE: 8, shape: 'Trigonal pyramidal', angle: '107°',
        desc: 'N has 1 lone pair and 3 bonding pairs.',
    },
    'CH₄': {
        atoms: [
            { sym: 'C', x: 200, y: 130, valence: 4, lone: 0, bonds: 4, color: '#888780', r: 16 },
            { sym: 'H', x: 140, y: 80, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 260, y: 80, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 140, y: 180, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
            { sym: 'H', x: 260, y: 180, valence: 1, lone: 0, bonds: 1, color: '#A8D8B9', r: 12 },
        ],
        bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]],
        totalVE: 8, shape: 'Tetrahedral', angle: '109.5°',
        desc: 'Carbon has 4 bonding pairs, no lone pairs.',
    },
    'SO₂': {
        atoms: [
            { sym: 'S', x: 200, y: 120, valence: 6, lone: 1, bonds: 4, color: '#FAC775', r: 18 },
            { sym: 'O', x: 115, y: 155, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
            { sym: 'O', x: 285, y: 155, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
        ],
        bonds: [[0, 1, 2], [0, 2, 1]],
        totalVE: 18, shape: 'Bent (resonance)', angle: '119°',
        desc: 'SO₂ has 2 resonance structures — actual bond order = 1.5.',
        resonance: true,
    },
    'PCl₅': {
        atoms: [
            { sym: 'P', x: 200, y: 130, valence: 5, lone: 0, bonds: 5, color: '#D85A30', r: 17 },
            { sym: 'Cl', x: 130, y: 80, valence: 7, lone: 3, bonds: 1, color: '#1D9E75', r: 20 },
            { sym: 'Cl', x: 270, y: 80, valence: 7, lone: 3, bonds: 1, color: '#1D9E75', r: 20 },
            { sym: 'Cl', x: 90, y: 155, valence: 7, lone: 3, bonds: 1, color: '#1D9E75', r: 20 },
            { sym: 'Cl', x: 310, y: 155, valence: 7, lone: 3, bonds: 1, color: '#1D9E75', r: 20 },
            { sym: 'Cl', x: 200, y: 210, valence: 7, lone: 3, bonds: 1, color: '#1D9E75', r: 20 },
        ],
        bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [0, 5, 1]],
        totalVE: 40, shape: 'Trigonal bipyramidal', angle: '90°/120°',
        desc: 'P expands octet to accommodate 5 bond pairs.',
    },
    'O₃': {
        atoms: [
            { sym: 'O', x: 140, y: 120, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
            { sym: 'O', x: 220, y: 120, valence: 6, lone: 1, bonds: 3, color: '#D85A30', r: 18 },
            { sym: 'O', x: 300, y: 120, valence: 6, lone: 2, bonds: 2, color: '#D85A30', r: 18 },
        ],
        bonds: [[0, 1, 1], [1, 2, 2]],
        totalVE: 18, shape: 'Bent (resonance)', angle: '117°',
        desc: 'O₃ has 2 equivalent resonance structures. Bond order = 1.5.',
        resonance: true,
    },
}

function drawBond(x1, y1, x2, y2, order, color) {
    const dx = x2 - x1, dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const nx = -dy / len, ny = dx / len
    const lines = []
    const offsets = order === 1 ? [0] : order === 2 ? [-3, 3] : [-5, 0, 5]
    offsets.forEach((o, i) => {
        lines.push(
            <line key={i}
                x1={x1 + nx * o} y1={y1 + ny * o}
                x2={x2 + nx * o} y2={y2 + ny * o}
                stroke={color} strokeWidth={order === 1 ? 2 : 1.8}
                strokeLinecap="round" />
        )
    })
    return lines
}

function drawLonePairs(cx, cy, n, otherAtoms, color) {
    if (n === 0) return null
    // Find angles away from bonds
    const angles = [0, 90, 180, 270].slice(0, n * 2)
    return angles.filter((_, i) => i % 2 === 0).map((ang, i) => {
        const rad = (ang + 45) * Math.PI / 180
        const d = 28
        const lx = cx + Math.cos(rad) * d
        const ly = cy + Math.sin(rad) * d
        return (
            <g key={`lp${i}`}>
                <circle cx={lx - 3} cy={ly} r={2.5} fill={color} opacity={0.7} />
                <circle cx={lx + 3} cy={ly} r={2.5} fill={color} opacity={0.7} />
            </g>
        )
    })
}

export default function LewisStructures() {
    const [mol, setMol] = useState('H₂O')
    const [showLone, setShowLone] = useState(true)
    const [showFC, setShowFC] = useState(false)
    const [resonance, setResonance] = useState(false)

    const m = MOLECULES[mol]

    // Formal charge = V − L − B/2
    const formalCharges = m.atoms.map(a => {
        const lonePairE = a.lone * 2
        const bondE = a.bonds
        return a.valence - lonePairE - bondE
    })

    const sumFC = formalCharges.reduce((s, fc) => s + fc, 0)

    // Resonance structures — swap bond orders for SO₂/O₃
    const resBonds = m.resonance && resonance
        ? m.bonds.map(b => [b[0], b[1], b[2] === 2 ? 1 : b[2] === 1 ? 2 : b[2]])
        : m.bonds

    return (
        <div>
            {/* Molecule selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MOLECULES).map(k => (
                    <button key={k} onClick={() => { setMol(k); setResonance(false) }} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: mol === k ? 'var(--teal)' : 'var(--bg3)',
                        color: mol === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mol === k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                <button onClick={() => setShowLone(p => !p)} style={{
                    padding: '5px 14px', borderRadius: 6, fontSize: 11,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: showLone ? 'rgba(239,159,39,0.15)' : 'var(--bg3)',
                    color: showLone ? 'var(--gold)' : 'var(--text3)',
                    border: `1px solid ${showLone ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`,
                }}>Lone pairs {showLone ? '●' : '○'}</button>

                <button onClick={() => setShowFC(p => !p)} style={{
                    padding: '5px 14px', borderRadius: 6, fontSize: 11,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: showFC ? 'rgba(127,119,221,0.15)' : 'var(--bg3)',
                    color: showFC ? 'var(--purple)' : 'var(--text3)',
                    border: `1px solid ${showFC ? 'rgba(127,119,221,0.4)' : 'var(--border)'}`,
                }}>Formal charges {showFC ? '●' : '○'}</button>

                {m.resonance && (
                    <button onClick={() => setResonance(p => !p)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: resonance ? 'rgba(55,138,221,0.15)' : 'var(--bg3)',
                        color: resonance ? '#378ADD' : 'var(--text3)',
                        border: `1px solid ${resonance ? 'rgba(55,138,221,0.4)' : 'var(--border)'}`,
                    }}>Resonance structure {resonance ? 'II' : 'I'}</button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* Lewis structure SVG */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ LEWIS STRUCTURE
                    </div>
                    <svg viewBox="0 0 400 230" width="100%">
                        {/* Bonds */}
                        {resBonds.map((b, i) => {
                            const a1 = m.atoms[b[0]], a2 = m.atoms[b[1]]
                            const midColor = 'rgba(160,176,200,0.45)'
                            return (
                                <g key={i}>
                                    {drawBond(a1.x, a1.y, a2.x, a2.y, b[2], midColor)}
                                </g>
                            )
                        })}

                        {/* Atoms */}
                        {m.atoms.map((a, i) => (
                            <g key={i}>
                                {/* Lone pairs */}
                                {showLone && drawLonePairs(a.x, a.y, a.lone, [], `${a.color}CC`)}

                                {/* Atom circle */}
                                <circle cx={a.x} cy={a.y} r={a.r}
                                    fill={`${a.color}22`}
                                    stroke={a.color} strokeWidth={2} />
                                <text x={a.x} y={a.y + 4} textAnchor="middle"
                                    style={{ fontSize: 12, fill: a.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    {a.sym}
                                </text>

                                {/* Formal charge */}
                                {showFC && formalCharges[i] !== 0 && (
                                    <text
                                        x={a.x + a.r * 0.7}
                                        y={a.y - a.r * 0.7}
                                        textAnchor="middle"
                                        style={{ fontSize: 11, fill: 'var(--purple)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                        {formalCharges[i] > 0 ? '+' : ''}{formalCharges[i]}
                                    </text>
                                )}
                            </g>
                        ))}

                        {/* Resonance arrow */}
                        {m.resonance && (
                            <text x={200} y={215} textAnchor="middle"
                                style={{ fontSize: 11, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>
                                ←→ resonance structures
                            </text>
                        )}
                    </svg>
                </div>

                {/* Info panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Electron count */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            ELECTRON ACCOUNTING
                        </div>
                        {m.atoms.map((a, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: a.color }}>{a.sym}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                    {a.valence}V − {a.lone * 2}LP − {a.bonds}B = <span style={{ color: 'var(--purple)', fontWeight: 700 }}>FC {formalCharges[i] >= 0 ? '+' : ''}{formalCharges[i]}</span>
                                </span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 6, marginTop: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            Total VE: {m.totalVE} · Σ FC = {sumFC} {sumFC === 0 ? '✓ neutral' : '(net charge)'}
                        </div>
                    </div>

                    {/* Shape */}
                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 6 }}>
                            GEOMETRY
                        </div>
                        <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>{m.shape}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>Bond angle: {m.angle}</div>
                    </div>

                    {/* Description */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 6 }}>
                            ANALYSIS
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                            {m.desc}
                        </div>
                    </div>

                    {/* Octet check */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            OCTET CHECK
                        </div>
                        {m.atoms.map((a, i) => {
                            const totalE = a.lone * 2 + a.bonds
                            const ok = a.sym === 'H' ? totalE === 2 : totalE === 8 || totalE > 8
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: a.color }}>{a.sym}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: ok ? 'var(--teal)' : 'var(--coral)' }}>
                                        {totalE}e⁻ {ok ? '✓' : '✗'}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Molecule" value={mol} color="var(--teal)" highlight />
                <ValueCard label="Shape" value={m.shape} color="var(--gold)" />
                <ValueCard label="Bond angle" value={m.angle} color="var(--text2)" />
                <ValueCard label="Total VE" value={`${m.totalVE}`} color="var(--purple)" />
            </div>
        </div>
    )
}