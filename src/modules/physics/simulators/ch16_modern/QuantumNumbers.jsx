import { useState } from 'react'

const W = 460, H = 280
const CX = W / 2, CY = H / 2

const ORBITALS = {
    's': { l: 0, desc: 'Spherical — no angular nodes', color: '#1D9E75' },
    'p': { l: 1, desc: 'Dumbbell — one angular node (plane)', color: '#EF9F27' },
    'd': { l: 2, desc: 'Four-lobed (mostly) — two nodes', color: '#7F77DD' },
    'f': { l: 3, desc: 'Complex multi-lobed — three nodes', color: '#D85A30' },
}

const ML_LABELS = {
    0: ['0'],
    1: ['-1', '0', '+1'],
    2: ['-2', '-1', '0', '+1', '+2'],
    3: ['-3', '-2', '-1', '0', '+1', '+2', '+3'],
}

export default function QuantumNumbers() {
    const [n, setN] = useState(2)
    const [l, setL] = useState(1)
    const [ml, setMl] = useState(0)
    const [ms, setMs] = useState(0.5)

    const lMax = n - 1
    const lSafe = Math.min(l, lMax)
    const mlMax = lSafe
    const mlSafe = Math.max(-mlMax, Math.min(mlMax, ml))

    const orbKey = ['s', 'p', 'd', 'f'][lSafe]
    const orb = ORBITALS[orbKey]

    // Max electrons in this subshell
    const maxElec = 2 * (2 * lSafe + 1)
    const shell2n2 = 2 * n * n

    // Draw orbital shape in SVG
    const drawOrbital = () => {
        const R = 70, r = 35
        switch (lSafe) {
            case 0: // s: sphere
                return (
                    <g>
                        <circle cx={CX} cy={CY} r={R}
                            fill={`${orb.color}15`}
                            stroke={orb.color} strokeWidth={1.5} />
                        <circle cx={CX} cy={CY} r={R * 0.6}
                            fill={`${orb.color}08`}
                            stroke={`${orb.color}40`} strokeWidth={0.8} strokeDasharray="3 3" />
                        <circle cx={CX} cy={CY} r={R * 0.3}
                            fill={`${orb.color}12`}
                            stroke={`${orb.color}30`} strokeWidth={0.5} />
                        <text x={CX} y={CY + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: `${orb.color}`, fontFamily: 'var(--mono)' }}>nucleus</text>
                    </g>
                )
            case 1: // p: two lobes along z (or x depending on ml)
                return (
                    <g>
                        {/* Top lobe */}
                        <ellipse cx={CX} cy={CY - R * 0.55} rx={r * 0.7} ry={R * 0.5}
                            fill={`${orb.color}20`} stroke={orb.color} strokeWidth={1.5} />
                        {/* Bottom lobe */}
                        <ellipse cx={CX} cy={CY + R * 0.55} rx={r * 0.7} ry={R * 0.5}
                            fill={`rgba(55,138,221,0.15)`} stroke="#378ADD" strokeWidth={1.5} />
                        {/* Nodal plane */}
                        <line x1={CX - 90} y1={CY} x2={CX + 90} y2={CY}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="5 3" />
                        <text x={CX + 95} y={CY + 4}
                            style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>node</text>
                        {/* +/- labels */}
                        <text x={CX} y={CY - R * 0.5} textAnchor="middle"
                            style={{ fontSize: 12, fill: orb.color, fontFamily: 'var(--mono)' }}>+</text>
                        <text x={CX} y={CY + R * 0.6} textAnchor="middle"
                            style={{ fontSize: 12, fill: '#378ADD', fontFamily: 'var(--mono)' }}>−</text>
                    </g>
                )
            case 2: // d: four lobes (dxy-like)
                return (
                    <g>
                        {[0, 1, 2, 3].map(i => {
                            const angle = (i * Math.PI / 2) + Math.PI / 4
                            const lx = CX + (R * 0.6) * Math.cos(angle)
                            const ly = CY - (R * 0.6) * Math.sin(angle)
                            const col = i % 2 === 0 ? orb.color : '#378ADD'
                            const rotDeg = i * 90 + 45
                            return (
                                <ellipse key={i}
                                    cx={lx} cy={ly}
                                    rx={r * 0.55} ry={r * 1.1}
                                    fill={`${col}15`} stroke={col} strokeWidth={1.5}
                                    transform={`rotate(${rotDeg},${lx},${ly})`} />
                            )
                        })}
                        {/* Nodal planes */}
                        <line x1={CX - 85} y1={CY} x2={CX + 85} y2={CY}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} strokeDasharray="3 3" />
                        <line x1={CX} y1={CY - 85} x2={CX} y2={CY + 85}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} strokeDasharray="3 3" />
                    </g>
                )
            case 3: // f: simplified complex shape
                return (
                    <g>
                        {[0, 1, 2, 3, 4, 5].map(i => {
                            const angle = (i * Math.PI / 3)
                            const lx = CX + (R * 0.55) * Math.cos(angle)
                            const ly = CY - (R * 0.55) * Math.sin(angle)
                            const colors = [orb.color, '#378ADD', '#1D9E75', orb.color, '#378ADD', '#1D9E75']
                            return (
                                <ellipse key={i}
                                    cx={lx} cy={ly}
                                    rx={r * 0.45} ry={r * 0.9}
                                    fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1.2}
                                    transform={`rotate(${i * 60},${lx},${ly})`} />
                            )
                        })}
                    </g>
                )
            default:
                return null
        }
    }

    return (
        <div>
            {/* n selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 120 }}>
                    Principal n:
                </span>
                {[1, 2, 3, 4].map(v => (
                    <button key={v} onClick={() => { setN(v); setL(Math.min(l, v - 1)) }} style={{
                        padding: '4px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: n === v ? 'var(--amber)' : 'var(--bg3)',
                        color: n === v ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>n={v}</button>
                ))}
            </div>

            {/* l selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 120 }}>
                    Azimuthal l:
                </span>
                {Array.from({ length: lMax + 1 }, (_, v) => (
                    <button key={v} onClick={() => { setL(v); setMl(Math.max(-v, Math.min(v, ml))) }} style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: lSafe === v ? ORBITALS[['s', 'p', 'd', 'f'][v]].color : 'var(--bg3)',
                        color: lSafe === v ? '#000' : 'var(--text2)',
                        border: `1px solid ${lSafe === v ? ORBITALS[['s', 'p', 'd', 'f'][v]].color : 'var(--border)'}`,
                    }}>l={v} ({['s', 'p', 'd', 'f'][v]})</button>
                ))}
            </div>

            {/* ml selector */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 120 }}>
                    Magnetic mₗ:
                </span>
                {ML_LABELS[lSafe].map(v => (
                    <button key={v} onClick={() => setMl(parseInt(v))} style={{
                        padding: '3px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mlSafe === parseInt(v) ? orb.color : 'var(--bg3)',
                        color: mlSafe === parseInt(v) ? '#000' : 'var(--text2)',
                        border: `1px solid ${mlSafe === parseInt(v) ? orb.color : 'var(--border)'}`,
                    }}>{v}</button>
                ))}
            </div>

            {/* ms selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 120 }}>
                    Spin mₛ:
                </span>
                {[{ v: 0.5, l: '+½ (↑)' }, { v: -0.5, l: '−½ (↓)' }].map(opt => (
                    <button key={opt.v} onClick={() => setMs(opt.v)} style={{
                        padding: '4px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: ms === opt.v ? 'var(--teal)' : 'var(--bg3)',
                        color: ms === opt.v ? '#fff' : 'var(--text2)',
                        border: `1px solid ${ms === opt.v ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                {/* Orbital shape */}
                {drawOrbital()}

                {/* Orbital notation */}
                <text x={CX} y={24} textAnchor="middle"
                    style={{ fontSize: 16, fill: orb.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    {n}{orbKey}  orbital
                </text>

                {/* Quantum state label */}
                <text x={CX} y={44} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    (n={n}, l={lSafe}, mₗ={mlSafe >= 0 ? '+' : ''}{mlSafe}, mₛ={ms > 0 ? '+½' : '−½'})
                </text>

                {/* Description */}
                <text x={CX} y={H - 14} textAnchor="middle"
                    style={{ fontSize: 10, fill: `${orb.color}80`, fontFamily: 'var(--mono)' }}>
                    {orb.desc}
                </text>

                {/* Pauli indicator (right) */}
                <g>
                    <rect x={W - 100} y={60} width={84} height={100}
                        rx={6} fill="rgba(0,0,0,0.2)"
                        stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
                    <text x={W - 58} y={78} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Pauli</text>

                    {/* 4 quantum number boxes */}
                    {[
                        { label: 'n', val: n, color: 'var(--amber)' },
                        { label: 'l', val: lSafe, color: orb.color },
                        { label: 'mₗ', val: mlSafe >= 0 ? `+${mlSafe}` : mlSafe, color: orb.color },
                        { label: 'mₛ', val: ms > 0 ? '+½' : '−½', color: 'var(--teal)' },
                    ].map((q, i) => (
                        <g key={q.label}>
                            <rect x={W - 96} y={84 + i * 20} width={76} height={16}
                                rx={3} fill={`${q.color}18`}
                                stroke={`${q.color}30`} strokeWidth={0.5} />
                            <text x={W - 88} y={96 + i * 20}
                                style={{ fontSize: 9, fill: q.color, fontFamily: 'var(--mono)' }}>
                                {q.label} =
                            </text>
                            <text x={W - 26} y={96 + i * 20} textAnchor="end"
                                style={{ fontSize: 9, fill: q.color, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                                {q.val}
                            </text>
                        </g>
                    ))}

                    <text x={W - 58} y={174} textAnchor="middle"
                        style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                        Unique state ✓
                    </text>
                </g>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Orbital', val: `${n}${orbKey}`, color: orb.color },
                    { label: 'Max e⁻ in subshell', val: `${maxElec} electrons`, color: 'var(--amber)' },
                    { label: 'Max e⁻ in shell n', val: `2n²= ${shell2n2}`, color: 'var(--teal)' },
                    { label: 'Angular nodes', val: `${lSafe} node${lSafe !== 1 ? 's' : ''}`, color: 'var(--text2)' },
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