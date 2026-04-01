import { useState, useEffect, useRef } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const COMPOUNDS = [
    { name: 'NaCl', metal: 'Na', nonmetal: 'Cl', q1: '+1', q2: '−1', r: 283, E: 788, color: '#378ADD', desc: 'Typical ionic salt with moderate lattice energy.' },
    { name: 'LiF', metal: 'Li', nonmetal: 'F', q1: '+1', q2: '−1', r: 209, E: 1036, color: '#1D9E75', desc: 'Small ions (high charge density) lead to higher lattice energy than NaCl.' },
    { name: 'MgO', metal: 'Mg', nonmetal: 'O', q1: '+2', q2: '−2', r: 212, E: 3791, color: '#D85A30', desc: 'High charges (+2 and −2) lead to an enormous lattice energy, making it very hard and high-melting.' },
    { name: 'KBr', metal: 'K', nonmetal: 'Br', q1: '+1', q2: '−1', r: 331, E: 682, color: '#EF9F27', desc: 'Large ionic radii result in lower lattice energy.' },
]

export default function IonicBonding() {
    const [compIdx, setCompIdx] = useState(0)
    const [step, setStep] = useState(0) // 0: atoms, 1: transfer, 2: ions, 3: lattice
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    useEffect(() => {
        const tStep = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(tStep)
        }
        rafRef.current = requestAnimationFrame(tStep)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const cur = COMPOUNDS[compIdx]

    // Animation progress for electron transfer
    const transferProgress = step === 1 ? Math.min(1, (t % 2)) : step >= 2 ? 1 : 0

    // Properties derived from charges
    const metalIs2Plus = cur.q1 === '+2'
    const nonMetalIs2Minus = cur.q2 === '−2'
    const mCol = 'rgba(55,138,221'
    const xCol = 'rgba(29,158,117'

    return (
        <div>
            {/* Compound selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {COMPOUNDS.map((c, i) => (
                    <button key={c.name} onClick={() => { setCompIdx(i); setStep(0) }} style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 13,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: compIdx === i ? c.color : 'var(--bg3)',
                        color: compIdx === i ? '#fff' : 'var(--text2)',
                        border: `1px solid ${compIdx === i ? c.color : 'var(--border)'}`,
                    }}>{c.name}</button>
                ))}
            </div>

            {/* Animation sequence controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { v: 0, l: '1. Neutral Atoms' },
                    { v: 1, l: '2. Electron Transfer' },
                    { v: 2, l: '3. Ion Formation' },
                    { v: 3, l: '4. Crystal Lattice' },
                ].map(opt => (
                    <button key={opt.v} onClick={() => setStep(opt.v)} style={{
                        flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: step === opt.v ? cur.color : 'var(--bg3)',
                        color: step === opt.v ? '#fff' : 'var(--text2)',
                        border: `1px solid ${step === opt.v ? cur.color : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                
                {/* Visuals */}
                <div style={{ background: 'rgba(0,0,0,0.22)', border: `1px solid ${cur.color}30`, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: cur.color, letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ IONIC BOND FORMATION
                    </div>

                    <svg viewBox="0 0 400 240" width="100%">
                        {step < 3 ? (
                            // Electron transfer view
                            <g>
                                {/* Metal Atom */}
                                <circle cx={120} cy={120} r={step >= 2 ? 35 : 45} fill={`${mCol},0.15)`} stroke={`${mCol},0.8)`} strokeWidth={2} />
                                <text x={120} y={125} textAnchor="middle" style={{ fontSize: 16, fill: `${mCol},1)`, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    {cur.metal}
                                    {step >= 2 && <tspan dy="-10" fontSize="12">{cur.q1}</tspan>}
                                </text>
                                {/* Metal Valence Electron(s) */}
                                {(step < 2 || transferProgress < 1) && (
                                    <g>
                                        <circle cx={120 + 45 * Math.cos(t * 2)} cy={120 + 45 * Math.sin(t * 2)} r={5} fill={`${mCol},1)`} />
                                        {metalIs2Plus && (
                                            <circle cx={120 + 45 * Math.cos(t * 2 + Math.PI)} cy={120 + 45 * Math.sin(t * 2 + Math.PI)} r={5} fill={`${mCol},1)`} />
                                        )}
                                    </g>
                                )}

                                {/* Non-Metal Atom */}
                                <circle cx={280} cy={120} r={step >= 2 ? 45 : 35} fill={`${xCol},0.15)`} stroke={`${xCol},0.8)`} strokeWidth={2} />
                                <text x={280} y={125} textAnchor="middle" style={{ fontSize: 16, fill: `${xCol},1)`, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    {cur.nonmetal}
                                    {step >= 2 && <tspan dy="-10" fontSize="12">{cur.q2}</tspan>}
                                </text>
                                {/* Non-Metal Valence Electrons */}
                                {Array.from({ length: nonMetalIs2Minus ? 6 : 7 }).map((_, i) => {
                                    const ang = (i / (nonMetalIs2Minus ? 6 : 7)) * Math.PI * 2
                                    return <circle key={i} cx={280 + (step >= 2 ? 45 : 35) * Math.cos(ang)} cy={120 + (step >= 2 ? 45 : 35) * Math.sin(ang)} r={4} fill={`${xCol},0.6)`} />
                                })}

                                {/* Transfer animation with Formal Chemistry Curved Arrow */}
                                {step === 1 && transferProgress > 0 && transferProgress < 1 && (() => {
                                    // Sequence timings: Arrow draws (0 -> 0.4), Pauli pause (0.4->0.5), Electron moves (0.5 -> 0.9), Pause (0.9->1.0)
                                    const pDraw = Math.min(1, Math.max(0, transferProgress * 2.5));
                                    const pMove = Math.min(1, Math.max(0, (transferProgress - 0.5) * 2.5));

                                    // Path mathematically bridging metal valence to non-metal shell
                                    const pathD1 = `M 160 120 Q 200 50 240 100`;
                                    const pathD2 = metalIs2Plus ? `M 160 140 Q 200 190 240 140` : null;

                                    return (
                                        <g>
                                            {/* Formal Curved Arrow drawing */}
                                            {pDraw > 0 && (
                                                <g>
                                                    <path d={pathD1} fill="none" stroke="var(--gold)" strokeWidth={2} strokeDasharray="200" strokeDashoffset={200 - pDraw * 200} markerEnd={pDraw > 0.9 ? "url(#curlyArrow)" : ""} />
                                                    {metalIs2Plus && (
                                                        <path d={pathD2} fill="none" stroke="var(--gold)" strokeWidth={2} strokeDasharray="200" strokeDashoffset={200 - pDraw * 200} markerEnd={pDraw > 0.9 ? "url(#curlyArrow)" : ""} />
                                                    )}
                                                </g>
                                            )}

                                            {/* Electron movement along curve */}
                                            {pMove > 0 && (
                                                <g>
                                                    {/* We use parametric bezier math to keep the electron exactly on the arrow path */}
                                                    <circle cx={160 * Math.pow(1-pMove, 2) + 2 * 200 * (1-pMove) * pMove + 240 * Math.pow(pMove, 2)} 
                                                            cy={120 * Math.pow(1-pMove, 2) + 2 * 50 * (1-pMove) * pMove + 100 * Math.pow(pMove, 2)} 
                                                            r={6} fill={`${mCol},1)`} />
                                                    
                                                    {metalIs2Plus && (
                                                        <circle cx={160 * Math.pow(1-pMove, 2) + 2 * 200 * (1-pMove) * pMove + 240 * Math.pow(pMove, 2)} 
                                                                cy={140 * Math.pow(1-pMove, 2) + 2 * 190 * (1-pMove) * pMove + 140 * Math.pow(pMove, 2)} 
                                                                r={6} fill={`${mCol},1)`} />
                                                    )}
                                                </g>
                                            )}
                                        </g>
                                    )
                                })()}

                                {/* Arrived electrons in non-metal */}
                                {step >= 2 && (
                                    <g>
                                        <circle cx={280 + 45 * Math.cos(Math.PI/4)} cy={120 + 45 * Math.sin(Math.PI/4)} r={5} fill={`${mCol},1)`} />
                                        {metalIs2Plus && (
                                            <circle cx={280 + 45 * Math.cos(Math.PI/4 + 0.5)} cy={120 + 45 * Math.sin(Math.PI/4 + 0.5)} r={5} fill={`${mCol},1)`} />
                                        )}
                                    </g>
                                )}
                            </g>
                        ) : (
                            // Lattice View
                            <g>
                                {Array.from({ length: 9 }).map((_, i) => {
                                    const row = Math.floor(i / 3)
                                    const col = i % 3
                                    const isMetal = (row + col) % 2 === 0
                                    const cx = 130 + col * 60 + (Math.sin(t * 3 + i) * 2)
                                    const cy = 60 + row * 60 + (Math.cos(t * 3 + i) * 2)
                                    const colr = isMetal ? mCol : xCol
                                    const sym = isMetal ? cur.metal : cur.nonmetal
                                    const chg = isMetal ? cur.q1 : cur.q2
                                    return (
                                        <g key={i}>
                                            <circle cx={cx} cy={cy} r={22} fill={`${colr},0.2)`} stroke={`${colr},0.8)`} strokeWidth={2} />
                                            <text x={cx} y={cy + 4} textAnchor="middle" style={{ fontSize: 12, fill: `${colr},1)`, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                                {sym}<tspan dy="-6" fontSize="8">{chg}</tspan>
                                            </text>
                                        </g>
                                    )
                                })}
                                {/* Lattice energy label */}
                                <text x={200} y={230} textAnchor="middle" style={{ fontSize: 10, fill: 'var(--text2)', fontFamily: 'var(--mono)' }}>
                                    Lattice Energy released: <tspan fill="var(--coral)" fontWeight="700">{cur.E} kJ/mol</tspan>
                                </text>
                            </g>
                        )}

                        <defs>
                            {/* Chemistry curved arrow head marker */}
                            <marker id="curlyArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                                <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--gold)" />
                            </marker>
                        </defs>
                    </svg>
                </div>

                {/* Info Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Compound info */}
                    <div style={{ padding: '12px 14px', background: `${cur.color}10`, border: `1px solid ${cur.color}30`, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: cur.color, letterSpacing: 1.5, marginBottom: 6 }}>
                            COMPOUND ANALYSIS
                        </div>
                        <div style={{ fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text1)', marginBottom: 4 }}>{cur.name}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            {cur.desc}
                        </div>
                    </div>

                    {/* Born-Haber / Lattice Energy concept */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            LATTICE ENERGY (ΔH_lattice)
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 700, marginBottom: 6 }}>
                            {cur.E} kJ/mol required to separate ions
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            <span style={{ color: 'var(--teal)' }}>Lattice Energy ∝ |q⁺ × q⁻| / (r⁺ + r⁻)</span><br/><br/>
                            Higher charges (+2, -2) dramatically increase lattice energy (e.g. MgO). Smaller ionic radii also increase lattice energy (e.g. LiF &gt; NaCl).
                        </div>
                    </div>

                    {/* Step description */}
                    <div style={{ padding: '12px 14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 1.5, marginBottom: 6 }}>
                            MECHANISM
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            {step === 0 && `${cur.metal} has low ionisation enthalpy; ${cur.nonmetal} has high (negative) electron gain enthalpy.`}
                            {step === 1 && `Complete transfer of ${metalIs2Plus ? 'two electrons' : 'one electron'} from ${cur.metal} to ${cur.nonmetal}.`}
                            {step === 2 && `Formation of ${cur.metal}${cur.q1} cation and ${cur.nonmetal}${cur.q2} anion. Both achieve stable noble gas configurations.`}
                            {step === 3 && `Oppositely charged ions attract and pack closely together in a 3D crystal lattice, releasing enormous stability energy.`}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Cation" value={`${cur.metal}${cur.q1}`} color="#378ADD" highlight />
                <ValueCard label="Anion" value={`${cur.nonmetal}${cur.q2}`} color="#1D9E75" />
                <ValueCard label="Interionic Distance" value={`${cur.r} pm`} color="var(--text2)" />
                <ValueCard label="Lattice Energy" value={`${cur.E} kJ`} color="var(--coral)" />
            </div>
        </div>
    )
}
