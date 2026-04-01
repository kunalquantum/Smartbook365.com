import { useState, useEffect, useRef } from 'react'
import { GROUP15 } from './helpers/groupData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const OSTWALD_STEPS = [
    { n: 1, eq: '4NH₃ + 5O₂ → 4NO + 6H₂O', note: 'Catalytic oxidation — Pt/Rh gauze, 850°C', col: '#EF9F27' },
    { n: 2, eq: '2NO + O₂ → 2NO₂', note: 'Oxidation of NO by air (no catalyst needed)', col: '#D85A30' },
    { n: 3, eq: '3NO₂ + H₂O → 2HNO₃ + NO', note: 'Absorption in water → dilute HNO₃', col: '#7F77DD' },
]

const P_ALLOTROPES = [
    { name: 'White phosphorus', formula: 'P₄', color: '#FAC775', toxic: true, mp: 44, conduct: false, structure: 'Tetrahedral P₄ units — very reactive', desc: 'Glows in dark (chemiluminescence). Stored under water. Extremely toxic. Burns spontaneously in air.' },
    { name: 'Red phosphorus', formula: 'Pₙ', color: '#D85A30', toxic: false, mp: 590, conduct: false, structure: 'Polymeric chain of P₄ units — much less reactive', desc: 'Safer form. Used in match box striking surface. Formed by heating white P at 250°C without air.' },
    { name: 'Black phosphorus', formula: 'Pₙ', color: '#444441', toxic: false, mp: 610, conduct: true, structure: 'Layered structure — similar to graphite', desc: 'Most stable allotrope. Semiconductor. Formed at very high pressure. Analogue of graphene.' },
]

export default function Group15Nitrogen() {
    const [mode, setMode] = useState('haber')
    const [temp, setTemp] = useState(450)
    const [pressure, setPressure] = useState(200)
    const [selStep, setSelStep] = useState(0)
    const [selAllot, setSelAllot] = useState(0)
    const [selEl, setSelEl] = useState('N')

    // P Allotrope Interactive State
    const [polyStep, setPolyStep] = useState(0) // 0: White P, 1: Homolytic Cleavage, 2: Radicals, 3: Recombination, 4: Red P

    // Haber Process Yield Math
    // High pressure = high yield. High temp = low yield (but faster rate in reality).
    const yieldPct = Math.max(5, Math.min(60,
        30 * (200 / pressure) * (400 / temp) * (pressure / 200) * (pressure / 150)
    )).toFixed(1)

    // Live Flow Reactor for Haber
    const [particles, setParticles] = useState([])
    const yieldRef = useRef(yieldPct)
    yieldRef.current = yieldPct
    const modeRef = useRef(mode)
    modeRef.current = mode

    useEffect(() => {
        let frame
        const loop = () => {
            if (modeRef.current !== 'haber') {
                frame = requestAnimationFrame(loop)
                return
            }
            setParticles(pts => {
                let next = pts.map(p => ({ ...p, y: p.y + p.vy, a: p.a + (p.va || 0) })).filter(p => p.y < 240)
                
                // Spawn gases at top
                if (Math.random() > 0.8) {
                    next.push({ id: Math.random(), type: 'N2', x: 20 + Math.random()*360, y: -10, vy: 0.8 + Math.random(), a: Math.random()*360, va: Math.random()*5 })
                    next.push({ id: Math.random(), type: 'H2', x: 20 + Math.random()*360, y: -10, vy: 1.2 + Math.random(), a: Math.random()*360, va: Math.random()*8 })
                    next.push({ id: Math.random(), type: 'H2', x: 20 + Math.random()*360, y: -10, vy: 1.2 + Math.random(), a: Math.random()*360, va: Math.random()*8 })
                    next.push({ id: Math.random(), type: 'H2', x: 20 + Math.random()*360, y: -10, vy: 1.2 + Math.random(), a: Math.random()*360, va: Math.random()*8 })
                }

                // Catalyst reaction zone (y: 100 to 140)
                next.forEach(p => {
                    if (p.y > 100 && p.y < 130 && p.type !== 'NH3') {
                        // The chance of conversion depends on current yield %
                        if (Math.random() * 100 < yieldRef.current * 0.05) { 
                            p.type = 'NH3'
                            p.vy = 2.5 // Falls faster as heavier product
                        }
                    }
                })
                
                return next
            })
            frame = requestAnimationFrame(loop)
        }
        frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    }, [])

    const renderHaberReactor = () => (
        <svg viewBox="0 0 400 240" style={{ marginTop: 14, overflow: 'hidden' }}>
            <defs>
                <pattern id="catalyst" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="3" fill="var(--border)" />
                </pattern>
            </defs>
            
            <rect x="0" y="100" width="400" height="40" fill="rgba(0,0,0,0.2)" stroke="var(--border)" />
            <rect x="0" y="100" width="400" height="40" fill="url(#catalyst)" />
            <text x="200" y="125" textAnchor="middle" fill="var(--text2)" style={{ fontSize: 12, fontFamily: 'var(--mono)', letterSpacing: 2 }}>IRON CATALYST BED</text>

            <rect x="0" y="200" width="400" height="40" fill="rgba(29,158,117,0.1)" />
            <text x="200" y="225" textAnchor="middle" fill="var(--teal)" style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700 }}>LIQUID AMMONIA (NH₃) COLLECTION</text>

            {particles.map(p => (
                <g key={p.id} transform={`translate(${p.x}, ${p.y}) rotate(${p.a})`}>
                    {p.type === 'N2' && (
                        <g>
                            <circle cx="-5" cy="0" r="5" fill="#378ADD" />
                            <circle cx="5" cy="0" r="5" fill="#378ADD" />
                        </g>
                    )}
                    {p.type === 'H2' && (
                        <g>
                            <circle cx="-3" cy="0" r="3" fill="#aaa" />
                            <circle cx="3" cy="0" r="3" fill="#aaa" />
                        </g>
                    )}
                    {p.type === 'NH3' && (
                        <g>
                            <circle cx="0" cy="-4" r="5" fill="#378ADD" /> {/* N */}
                            <circle cx="-6" cy="4" r="3" fill="#aaa" /> {/* H */}
                            <circle cx="6" cy="4" r="3" fill="#aaa" /> {/* H */}
                            <circle cx="0" cy="8" r="3" fill="#aaa" /> {/* H */}
                        </g>
                    )}
                </g>
            ))}
        </svg>
    )

    const renderPhosphorusPolymerizer = () => {
        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <svg viewBox="0 0 400 200" style={{ marginTop: 14 }}>
                    <text x="200" y="30" textAnchor="middle" fill="var(--coral)" style={{ fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: 1 }}>
                        {polyStep === 0 ? 'P₄ White Phosphorus (Discrete, Strained)' : polyStep === 4 ? 'Pₙ Red Phosphorus (Polymeric Chain)' : 'Reaction Intermediate Phase'}
                    </text>
                    
                    {[0, 1, 2].map(i => {
                        // Draw 3 tetrahedrons
                        const cx = 100 + i * 100
                        const cy = 120
                        const p1 = { x: cx, y: cy-30 }
                        const p2 = { x: cx-25, y: cy+15 }
                        const p3 = { x: cx+25, y: cy+15 }
                        const p4 = { x: cx, y: cy+5 }

                        const bondCenter = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 }

                        return (
                            <g key={`p4_${i}`}>
                                {/* Static Bonds (Intact 3 bonds of the base) */}
                                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#EF9F27" strokeWidth="4" />
                                <line x1={p1.x} y1={p1.y} x2={p3.x} y2={p3.y} stroke="#EF9F27" strokeWidth="4" />
                                <line x1={p1.x} y1={p1.y} x2={p4.x} y2={p4.y} stroke="#EF9F27" strokeWidth="4" />
                                <line x1={p2.x} y1={p2.y} x2={p4.x} y2={p4.y} stroke="#EF9F27" strokeWidth="4" />
                                <line x1={p3.x} y1={p3.y} x2={p4.x} y2={p4.y} stroke="#EF9F27" strokeWidth="4" />

                                {/* Breaking Bond (p2 to p3) */}
                                {polyStep <= 1 && (
                                    <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#EF9F27" strokeWidth="4" strokeDasharray={polyStep === 1 ? "4 4" : ""} />
                                )}

                                {/* Formal Fishhook Arrows (Homolytic Cleavage) */}
                                {polyStep === 1 && (
                                    <g>
                                        {/* Left arrow to p2 */}
                                        <path d={`M ${bondCenter.x - 2} ${bondCenter.y - 4} Q ${p2.x + 10} ${p2.y - 15} ${p2.x} ${p2.y - 8}`} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} markerEnd="url(#fishhook)" strokeDasharray="3 3" />
                                        {/* Right arrow to p3 */}
                                        <path d={`M ${bondCenter.x + 2} ${bondCenter.y - 4} Q ${p3.x - 10} ${p3.y - 15} ${p3.x} ${p3.y - 8}`} fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} markerEnd="url(#fishhook)" strokeDasharray="3 3" />
                                    </g>
                                )}

                                {/* Radical Electron Dots */}
                                {(polyStep === 2 || polyStep === 3) && (
                                    <g>
                                        <circle cx={p2.x - 8} cy={p2.y} r={3} fill="#fff" />
                                        <circle cx={p3.x + 8} cy={p3.y} r={3} fill="#fff" />
                                    </g>
                                )}

                                {/* Recombination Arrows */}
                                {polyStep === 3 && i < 2 && (
                                    <path d={`M ${p3.x + 8} ${p3.y} Q ${p3.x + 40} ${p3.y - 20} ${cx + 100 - 25 - 8} ${cy + 15}`} fill="none" stroke="var(--gold)" strokeWidth={2} markerEnd="url(#curlyArrow)" />
                                )}
                                
                                {polyStep === 3 && i === 0 && (
                                    <path d={`M ${p2.x - 8} ${p2.y} Q ${p2.x - 20} ${p2.y - 15} ${p2.x - 30} ${p2.y - 10}`} fill="none" stroke="var(--gold)" strokeWidth={2} markerEnd="url(#curlyArrow)" />
                                )}

                                {/* Forming Polymeric Bond to next unit */}
                                {polyStep === 4 && i < 2 && (
                                    <line x1={p3.x} y1={p3.y} x2={cx + 100 - 25} y2={cy + 15} stroke="#D85A30" strokeWidth="4" />
                                )}
                                {/* Ends of the chain */}
                                {polyStep === 4 && i === 0 && <line x1={p2.x} y1={p2.y} x2={p2.x - 30} y2={p2.y} stroke="#D85A30" strokeWidth="4" strokeDasharray="6 4" />}
                                {polyStep === 4 && i === 2 && <line x1={p3.x} y1={p3.y} x2={p3.x + 30} y2={p3.y} stroke="#D85A30" strokeWidth="4" strokeDasharray="6 4" />}

                                {/* P Atoms */}
                                {(() => {
                                    const c1 = polyStep < 4 ? "#FAC775" : "#D85A30"
                                    const P = (x, y, r) => (
                                        <g>
                                            <circle cx={x} cy={y} r={r} fill={`${c1}20`} stroke={c1} strokeWidth="2" />
                                            <text x={x} y={y+3} textAnchor="middle" fill={c1} style={{ fontSize: r*0.6, fontFamily: 'var(--mono)', fontWeight: 700 }}>P</text>
                                        </g>
                                    )
                                    return (
                                        <g>
                                            {P(p1.x, p1.y, 12)}
                                            {P(p2.x, p2.y, 12)}
                                            {P(p3.x, p3.y, 12)}
                                            {P(p4.x, p4.y, 14)}
                                        </g>
                                    )
                                })()}
                            </g>
                        )
                    })}
                    
                    <defs>
                        {/* Half-headed fishhook arrow for homolytic cleavage */}
                        <marker id="fishhook" viewBox="0 0 10 10" refX="8" refY="3" markerWidth="6" markerHeight="6" orient="auto">
                            <path d="M 0 3 Q 4 0 8 3 L 8 4 Q 4 1.5 0 4 z" fill="rgba(255,255,255,0.8)" />
                        </marker>
                        {/* Standard curly arrow for bond formation */}
                        <marker id="curlyArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                            <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--gold)" />
                        </marker>
                    </defs>
                </svg>
                
                {/* Teaching UI Sequence Controls */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 8 }}>
                    {[
                        { s: 0, l: 'White P₄' },
                        { s: 1, l: 'Cleavage' },
                        { s: 2, l: 'Radicals' },
                        { s: 3, l: 'Combine' },
                        { s: 4, l: 'Red Polymer' }
                    ].map(st => (
                        <button key={st.s} onClick={() => setPolyStep(st.s)} style={{
                            padding: '6px 10px', borderRadius: 8, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 600,
                            background: polyStep === st.s ? 'var(--coral)' : 'var(--bg3)',
                            color: polyStep === st.s ? '#000' : 'var(--text2)',
                            border: `1px solid ${polyStep === st.s ? 'var(--coral)' : 'var(--border)'}`,
                        }}>
                            {st.s + 1}. {st.l}
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    const pa = P_ALLOTROPES[selAllot]
    const el = GROUP15.find(e => e.sym === selEl)

    const TREND_DATA = {
        AR: { label: 'Atomic radius (pm)', vals: GROUP15.map(e => e.AR), max: 143 },
        IE1: { label: 'IE₁ (kJ/mol)', vals: GROUP15.map(e => e.IE1), max: 1402 },
        EN: { label: 'Electronegativity', vals: GROUP15.map(e => e.EN), max: 3.04 },
    }
    const [trendProp, setTrendProp] = useState('AR')
    const td = TREND_DATA[trendProp]

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {[{ k: 'haber', l: 'Haber process' }, { k: 'ostwald', l: 'Ostwald process' }, { k: 'phosphorus', l: 'P allotropes' }, { k: 'trends', l: 'Group 15 trends' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── HABER PROCESS ── */}
            {mode === 'haber' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--teal)' }}>N₂ + 3H₂ ⇌ 2NH₃</strong>  ΔH = −92 kJ/mol (exothermic, fewer moles of gas)
                        <br />Le Chatelier: high pressure and low temperature favour products — but too low T slows rate. Compromise: 450°C, 200 atm, Fe catalyst.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <ChemSlider label="Temperature" unit="°C" value={temp} min={200} max={700} step={10} onChange={setTemp} color="var(--coral)" />
                        <ChemSlider label="Pressure" unit=" atm" value={pressure} min={50} max={400} step={10} onChange={setPressure} color="var(--teal)" />
                    </div>

                    {/* Yield indicator & Reactor */}
                    <div style={{ padding: '16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                                NH₃ Yield vs T & P (Catalyst limits rate drop)
                            </div>
                            <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: parseFloat(yieldPct) > 20 ? 'var(--teal)' : 'var(--gold)' }}>
                                ~{yieldPct}%
                            </div>
                        </div>
                        <div style={{ height: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 8,
                                width: `${yieldPct}%`,
                                background: parseFloat(yieldPct) > 20 ? 'var(--teal)' : parseFloat(yieldPct) > 10 ? 'var(--gold)' : 'var(--coral)',
                                transition: 'width 0.3s',
                            }} />
                        </div>
                        {renderHaberReactor()}
                    </div>

                    {/* Optimal conditions panel */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                        {[
                            { label: 'Temperature', val: '450°C', note: 'Compromise', col: 'var(--coral)' },
                            { label: 'Pressure', val: '200 atm', note: 'High pressure', col: 'var(--teal)' },
                            { label: 'Catalyst', val: 'Fe', note: '+ K₂O, Al₂O₃', col: '#888780' },
                            { label: 'Yield/pass', val: '~15%', note: 'Recycled', col: 'var(--gold)' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '10px', background: `${p.col}10`, border: `1px solid ${p.col}30`, borderRadius: 8, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>{p.label}</div>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col }}>{p.val}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{p.note}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── OSTWALD PROCESS ── */}
            {mode === 'ostwald' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--coral)' }}>Ostwald process</strong> converts NH₃ → HNO₃ in 3 steps. Starting material is ammonia (from Haber process).
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {OSTWALD_STEPS.map((s, i) => (
                            <button key={i} onClick={() => setSelStep(i)} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selStep === i ? s.col : 'var(--bg3)',
                                color: selStep === i ? '#fff' : 'var(--text2)',
                                border: `1px solid ${selStep === i ? s.col : 'var(--border)'}`,
                            }}>Step {s.n}</button>
                        ))}
                    </div>

                    {/* All steps — highlight selected */}
                    {OSTWALD_STEPS.map((s, i) => (
                        <div key={i} style={{
                            padding: '12px 16px', marginBottom: 8,
                            background: selStep === i ? `${s.col}15` : 'var(--bg3)',
                            border: `1px solid ${selStep === i ? s.col + '50' : 'var(--border)'}`,
                            borderRadius: 10, transition: 'all 0.2s', cursor: 'pointer',
                        }} onClick={() => setSelStep(i)}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: s.col, letterSpacing: 1.5, marginBottom: 5 }}>
                                STEP {s.n}
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: selStep === i ? s.col : 'var(--text2)', marginBottom: 5 }}>
                                {s.eq}
                            </div>
                            {selStep === i && (
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.6 }}>
                                    {s.note}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ── PHOSPHORUS ALLOTROPES ── */}
            {mode === 'phosphorus' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--coral)' }}>White to Red Phosphorus Polymerisation:</strong> Heating fragile, highly strained P₄ molecules to 573K breaks one P-P bond per tetrahedron, instantly polymerizing them into the much more stable, less reactive Red Phosphorus chain.
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        {renderPhosphorusPolymerizer()}
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {P_ALLOTROPES.map((a, i) => (
                            <button key={a.name} onClick={() => setSelAllot(i)} style={{
                                flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selAllot === i ? a.color : 'var(--bg3)',
                                color: selAllot === i ? '#000' : 'var(--text2)',
                                border: `1px solid ${selAllot === i ? a.color : 'var(--border)'}`,
                            }}>{a.name}</button>
                        ))}
                    </div>

                    <div style={{ padding: '14px 16px', background: `${pa.color}12`, border: `1px solid ${pa.color}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: pa.color, marginBottom: 3 }}>{pa.name}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>{pa.formula}  ·  MP {pa.mp}°C</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{pa.structure}</div>
                            </div>
                            {pa.toxic && (
                                <div style={{ padding: '4px 10px', background: 'rgba(216,90,48,0.15)', border: '1px solid rgba(216,90,48,0.4)', borderRadius: 20, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', flexShrink: 0, marginLeft: 10 }}>
                                    ⚠ TOXIC
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comparison table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                        {[{ label: 'Conductivity', fn: a => a.conduct ? 'Yes' : 'No' }, { label: 'Toxicity', fn: a => a.toxic ? 'Highly toxic' : 'Safe' }, { label: 'Melting pt', fn: a => `${a.mp}°C` }].map(row => (
                            <div key={row.label} style={{ padding: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>{row.label.toUpperCase()}</div>
                                {P_ALLOTROPES.map((a, i) => (
                                    <div key={a.name} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: selAllot === i ? a.color : 'var(--text3)', marginBottom: 3 }}>
                                        {a.name.split(' ')[0]}: {row.fn(a)}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TRENDS ── */}
            {mode === 'trends' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.entries(TREND_DATA).map(([k, v]) => (
                            <button key={k} onClick={() => setTrendProp(k)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: trendProp === k ? 'var(--blue,#378ADD)' : 'var(--bg3)',
                                color: trendProp === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${trendProp === k ? '#378ADD' : 'var(--border)'}`,
                            }}>{v.label}</button>
                        ))}
                    </div>

                    {GROUP15.map((e, i) => {
                        const v = td.vals[i]
                        const cols = ['#378ADD', '#EF9F27', '#7F77DD', '#7F77DD', '#888780']
                        return (
                            <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                                onClick={() => setSelEl(e.sym)}>
                                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${cols[i]}20`, border: `1.5px solid ${cols[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: cols[i], flexShrink: 0 }}>
                                    {e.sym}
                                </div>
                                <div style={{ flex: 1, height: 20, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(v / td.max) * 100}%`, background: e.sym === selEl ? cols[i] : `${cols[i]}60`, borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>{v}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 60 }}>{e.type}</span>
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="N₂ stability" value="Bond energy 945 kJ/mol" color="#378ADD" highlight />
                <ValueCard label="Haber yield" value={`~${yieldPct}% at ${temp}°C, ${pressure}atm`} color="var(--teal)" />
                <ValueCard label="P allotropes" value="White > Red > Black (reactivity)" color="var(--coral)" />
            </div>
        </div>
    )
}