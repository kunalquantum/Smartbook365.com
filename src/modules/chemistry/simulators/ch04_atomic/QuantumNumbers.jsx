import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const SHAPES = {
    s: { desc: 'Spherical — no angular nodes', color: '#EF9F27' },
    p: { desc: 'Dumbbell — 1 angular node (nodal plane)', color: '#1D9E75' },
    d: { desc: 'Four-lobed (mostly) — 2 angular nodes', color: '#7F77DD' },
    f: { desc: 'Complex multi-lobed — 3 angular nodes', color: '#D85A30' },
}

const SUB_LABELS = ['s', 'p', 'd', 'f']

function OrbitalShape({ l, ml, size = 120 }) {
    const CX = size / 2, CY = size / 2
    const R = size * 0.36
    const r = size * 0.18

    if (l === 0) {
        // s: sphere with inner shells
        return (
            <svg viewBox={`0 0 ${size} ${size}`} width="100%">
                <circle cx={CX} cy={CY} r={R} fill="rgba(239,159,39,0.12)" stroke="#EF9F27" strokeWidth={1.5} />
                <circle cx={CX} cy={CY} r={R * 0.6} fill="rgba(239,159,39,0.08)" stroke="rgba(239,159,39,0.3)" strokeWidth={0.8} strokeDasharray="3 3" />
                <circle cx={CX} cy={CY} r={4} fill="rgba(216,90,48,0.6)" stroke="var(--coral)" strokeWidth={1} />
                <text x={CX} y={size - 6} textAnchor="middle" style={{ fontSize: 8, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>s orbital</text>
            </svg>
        )
    }

    if (l === 1) {
        // p: dumbbell — orientation depends on ml
        const isX = ml === -1, isY = ml === 1, isZ = ml === 0
        const color = '#1D9E75'
        return (
            <svg viewBox={`0 0 ${size} ${size}`} width="100%">
                {/* Top lobe */}
                <ellipse cx={CX} cy={CY - R * 0.55} rx={r * 0.7} ry={R * 0.5}
                    fill={`rgba(29,158,117,0.18)`} stroke={color} strokeWidth={1.5} />
                {/* Bottom lobe */}
                <ellipse cx={CX} cy={CY + R * 0.55} rx={r * 0.7} ry={R * 0.5}
                    fill={`rgba(55,138,221,0.15)`} stroke="#378ADD" strokeWidth={1.5} />
                {/* Nodal plane */}
                <line x1={CX - R * 1.1} y1={CY} x2={CX + R * 1.1} y2={CY}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4 3" />
                {/* + / - labels */}
                <text x={CX} y={CY - R * 0.45} textAnchor="middle" style={{ fontSize: 11, fill: color, fontFamily: 'var(--mono)' }}>+</text>
                <text x={CX} y={CY + R * 0.55} textAnchor="middle" style={{ fontSize: 11, fill: '#378ADD', fontFamily: 'var(--mono)' }}>−</text>
                {/* Nucleus */}
                <circle cx={CX} cy={CY} r={4} fill="rgba(216,90,48,0.5)" stroke="var(--coral)" strokeWidth={1} />
                {/* Orientation label */}
                <text x={CX} y={size - 6} textAnchor="middle" style={{ fontSize: 8, fill: `${color}80`, fontFamily: 'var(--mono)' }}>
                    p{ml === 0 ? 'z' : ml === -1 ? 'x' : 'y'} orbital (mₗ={ml})
                </text>
            </svg>
        )
    }

    if (l === 2) {
        const color = '#7F77DD'
        return (
            <svg viewBox={`0 0 ${size} ${size}`} width="100%">
                {/* Four lobes in + shape */}
                {[0, 1, 2, 3].map(i => {
                    const ang = i * Math.PI / 2 + (ml === 2 ? Math.PI / 4 : 0)
                    const lx = CX + R * 0.55 * Math.cos(ang)
                    const ly = CY + R * 0.55 * Math.sin(ang)
                    const alt = i % 2 === 0 ? color : '#378ADD'
                    return (
                        <ellipse key={i} cx={lx} cy={ly} rx={r * 0.55} ry={r * 1.0}
                            fill={`${alt}15`} stroke={alt} strokeWidth={1.5}
                            transform={`rotate(${i * 90 + (ml === 2 ? 45 : 0)},${lx},${ly})`} />
                    )
                })}
                {/* Nodal planes */}
                <line x1={CX - R * 1.1} y1={CY} x2={CX + R * 1.1} y2={CY} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} strokeDasharray="3 3" />
                <line x1={CX} y1={CY - R * 1.1} x2={CX} y2={CY + R * 1.1} stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} strokeDasharray="3 3" />
                <circle cx={CX} cy={CY} r={4} fill="rgba(216,90,48,0.5)" stroke="var(--coral)" strokeWidth={1} />
                <text x={CX} y={size - 6} textAnchor="middle" style={{ fontSize: 8, fill: `${color}80`, fontFamily: 'var(--mono)' }}>
                    d orbital (mₗ={ml})
                </text>
            </svg>
        )
    }

    if (l === 3) {
        const color = '#D85A30'
        return (
            <svg viewBox={`0 0 ${size} ${size}`} width="100%">
                {[0, 1, 2, 3, 4, 5].map(i => {
                    const ang = i * Math.PI / 3
                    const lx = CX + R * 0.52 * Math.cos(ang)
                    const ly = CY + R * 0.52 * Math.sin(ang)
                    const cols = [color, '#378ADD', '#1D9E75', color, '#378ADD', '#1D9E75']
                    return (
                        <ellipse key={i} cx={lx} cy={ly} rx={r * 0.42} ry={r * 0.85}
                            fill={`${cols[i]}12`} stroke={cols[i]} strokeWidth={1.2}
                            transform={`rotate(${i * 60},${lx},${ly})`} />
                    )
                })}
                <circle cx={CX} cy={CY} r={4} fill="rgba(216,90,48,0.5)" stroke="var(--coral)" strokeWidth={1} />
                <text x={CX} y={size - 6} textAnchor="middle" style={{ fontSize: 8, fill: `${color}80`, fontFamily: 'var(--mono)' }}>
                    f orbital (mₗ={ml})
                </text>
            </svg>
        )
    }

    return null
}

export default function QuantumNumbers() {
    const [n, setN] = useState(2)
    const [l, setL] = useState(1)
    const [ml, setMl] = useState(0)
    const [ms, setMs] = useState(0.5)

    const lMax = n - 1
    const lSafe = Math.min(l, lMax)
    const mlRange = Array.from({ length: 2 * lSafe + 1 }, (_, i) => i - lSafe)
    const mlSafe = mlRange.includes(ml) ? ml : 0

    const subshell = SUB_LABELS[lSafe]
    const shape = SHAPES[subshell]
    const maxElec = 2 * (2 * lSafe + 1)
    const shell2n2 = 2 * n * n

    // Pauli check — each state must be unique
    const state = `(n=${n}, l=${lSafe}, mₗ=${mlSafe >= 0 ? '+' + mlSafe : mlSafe}, mₛ=${ms > 0 ? '+½' : '−½'})`

    return (
        <div>
            {/* n selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 100 }}>
                    Principal n:
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    {[1, 2, 3, 4].map(v => (
                        <button key={v} onClick={() => { setN(v); setL(Math.min(lSafe, v - 1)) }} style={{
                            width: 38, height: 38, borderRadius: 6, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: n === v ? 'var(--gold)' : 'var(--bg3)',
                            color: n === v ? '#000' : 'var(--text2)',
                            border: `1px solid ${n === v ? 'var(--gold)' : 'var(--border)'}`,
                        }}>n={v}</button>
                    ))}
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 8 }}>
                    Max 2n² = <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{shell2n2}</span> electrons
                </div>
            </div>

            {/* l selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 100 }}>
                    Azimuthal l:
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                    {Array.from({ length: lMax + 1 }, (_, v) => {
                        const sh = SHAPES[SUB_LABELS[v]]
                        return (
                            <button key={v} onClick={() => { setL(v); if (!mlRange.includes(ml)) setMl(0) }} style={{
                                padding: '4px 12px', height: 38, borderRadius: 6, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: lSafe === v ? sh.color : 'var(--bg3)',
                                color: lSafe === v ? '#000' : 'var(--text2)',
                                border: `1px solid ${lSafe === v ? sh.color : 'var(--border)'}`,
                            }}>l={v} ({SUB_LABELS[v]})</button>
                        )
                    })}
                </div>
            </div>

            {/* ml selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 100 }}>
                    Magnetic mₗ:
                </span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {mlRange.map(v => (
                        <button key={v} onClick={() => setMl(v)} style={{
                            width: 42, height: 34, borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: mlSafe === v ? shape.color : 'var(--bg3)',
                            color: mlSafe === v ? '#000' : 'var(--text2)',
                            border: `1px solid ${mlSafe === v ? shape.color : 'var(--border)'}`,
                        }}>{v >= 0 ? `+${v}` : v}</button>
                    ))}
                </div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                    ({2 * lSafe + 1} orientations)
                </div>
            </div>

            {/* ms selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', minWidth: 100 }}>
                    Spin mₛ:
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                    {[{ v: 0.5, l: '+½ ↑' }, { v: -0.5, l: '−½ ↓' }].map(opt => (
                        <button key={opt.v} onClick={() => setMs(opt.v)} style={{
                            padding: '6px 18px', borderRadius: 6, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: ms === opt.v ? 'var(--teal)' : 'var(--bg3)',
                            color: ms === opt.v ? '#fff' : 'var(--text2)',
                            border: `1px solid ${ms === opt.v ? 'var(--teal)' : 'var(--border)'}`,
                        }}>{opt.l}</button>
                    ))}
                </div>
            </div>

            {/* Main display */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, marginBottom: 14 }}>

                {/* Orbital shape */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${shape.color}30`, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: shape.color, letterSpacing: 1.5, marginBottom: 8 }}>
                        {n}{subshell} ORBITAL
                    </div>
                    <OrbitalShape l={lSafe} ml={mlSafe} size={134} />
                </div>

                {/* Quantum number summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                    {/* Current state */}
                    <div style={{ padding: '12px 14px', background: `${shape.color}10`, border: `1px solid ${shape.color}30`, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: shape.color, letterSpacing: 1.5, marginBottom: 8 }}>
                            COMPLETE QUANTUM STATE
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.8 }}>
                            {state}
                        </div>
                        <div style={{ marginTop: 8, padding: '6px 10px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)' }}>
                            ✓ Unique state — Pauli exclusion satisfied
                        </div>
                    </div>

                    {/* Rules reminder */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            ALLOWED VALUE RULES
                        </div>
                        {[
                            { rule: 'n', constraint: '1, 2, 3, 4...', current: `n = ${n}`, ok: true },
                            { rule: 'l', constraint: `0 to n−1 = 0 to ${n - 1}`, current: `l = ${lSafe}`, ok: lSafe <= n - 1 },
                            { rule: 'mₗ', constraint: `−l to +l = ${-lSafe} to +${lSafe}`, current: `mₗ = ${mlSafe}`, ok: Math.abs(mlSafe) <= lSafe },
                            { rule: 'mₛ', constraint: '±½ only', current: `mₛ = ${ms > 0 ? '+½' : '−½'}`, ok: true },
                        ].map(row => (
                            <div key={row.rule} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, padding: '6px 10px', background: row.ok ? 'rgba(29,158,117,0.06)' : 'rgba(216,90,48,0.1)', borderRadius: 6 }}>
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: shape.color, minWidth: 20 }}>{row.rule}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', flex: 1 }}>{row.constraint}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.ok ? 'var(--teal)' : 'var(--coral)', fontWeight: 700 }}>{row.current}</span>
                                <span style={{ fontSize: 11 }}>{row.ok ? '✓' : '✗'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Orbital" value={`${n}${subshell}`} color={shape.color} highlight />
                <ValueCard label="Shape" value={shape.desc.split('—')[0].trim()} color={shape.color} />
                <ValueCard label="Max e⁻ in subshell" value={`${maxElec} electrons`} color="var(--teal)" />
                <ValueCard label="Orientations" value={`${2 * lSafe + 1} (mₗ = ${-lSafe} to +${lSafe})`} color="var(--text2)" />
            </div>
        </div>
    )
}