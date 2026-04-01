import { useState, useEffect, useRef } from 'react'
import { CLEANING_AGENTS } from './helpers/everydayData'
import ValueCard from '../../components/ui/ValueCard'

export default function CleaningAgents() {
    const [agent, setAgent] = useState('Soap')
    const [mode, setMode] = useState('mechanism')   // mechanism | compare | hardwater
    const [step, setStep] = useState(0)

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
    const ca = CLEANING_AGENTS[agent]

    const MECHANISM_STEPS = [
        { title: 'Soil/grease on fabric', desc: 'Greasy dirt adheres to fabric fibres — non-polar, insoluble in water alone', col: '#D85A30' },
        { title: 'Surfactant added', desc: `${agent} molecules surround grease — non-polar tail dissolves into grease, polar head faces water`, col: '#EF9F27' },
        { title: 'Micelle forms', desc: 'Multiple surfactant molecules encapsulate the grease droplet completely — tail inward, head outward', col: ca.color },
        { title: 'Micelle in solution', desc: 'Polar exterior is hydrophilic — micelle stays suspended in water as a colloidal dispersion', col: 'var(--teal)' },
        { title: 'Rinsed away', desc: 'Grease trapped in micelle is washed away with water — fabric cleaned!', col: 'var(--teal)' },
    ]

    return (
        <div>
            {/* Agent selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {Object.keys(CLEANING_AGENTS).map(k => (
                    <button key={k} onClick={() => { setAgent(k); setStep(0) }} style={{
                        flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                        background: agent === k ? `${CLEANING_AGENTS[k].color}25` : 'var(--bg3)',
                        border: `2px solid ${agent === k ? CLEANING_AGENTS[k].color : 'var(--border)'}`,
                        transition: 'all 0.15s',
                    }}>
                        <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: CLEANING_AGENTS[k].color }}>{k}</div>
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{CLEANING_AGENTS[k].type}</div>
                    </button>
                ))}
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'mechanism', l: 'Cleansing mechanism' }, { k: 'compare', l: 'Soap vs Detergent' }, { k: 'hardwater', l: 'Hard water problem' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? ca.color : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? ca.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── MECHANISM ── */}
            {mode === 'mechanism' && (
                <div>
                    {/* Animated micelle diagram */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${ca.color}25`, borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: ca.color, letterSpacing: 2, marginBottom: 8 }}>
                            ⚗ MICELLE FORMATION — {agent.toUpperCase()}
                        </div>
                        <svg viewBox="0 0 420 180" width="100%" style={{ display: 'block' }}>
                            {/* Water background */}
                            <rect x={0} y={0} width={420} height={180} fill="rgba(55,138,221,0.03)" />

                            {step >= 2 && (
                                <>
                                    {/* Grease core */}
                                    <circle cx={210} cy={90} r={38}
                                        fill="rgba(216,90,48,0.15)"
                                        stroke="rgba(216,90,48,0.25)" strokeWidth={1} strokeDasharray="3 3" />
                                    <text x={210} y={94} textAnchor="middle"
                                        style={{ fontSize: 10, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                        grease
                                    </text>

                                    {/* Surfactant molecules around micelle */}
                                    {Array.from({ length: 14 }, (_, i) => {
                                        const ang = (i / 14) * 2 * Math.PI + t * 0.2
                                        const tailX = 210 + Math.cos(ang) * 36
                                        const tailY = 90 + Math.sin(ang) * 36
                                        const headX = 210 + Math.cos(ang) * 60
                                        const headY = 90 + Math.sin(ang) * 60
                                        const bobble = Math.sin(t * 0.8 + i * 0.6) * 1.5
                                        return (
                                            <g key={i}>
                                                {/* Non-polar tail */}
                                                <line x1={tailX} y1={tailY}
                                                    x2={headX + Math.cos(ang) * bobble} y2={headY + Math.sin(ang) * bobble}
                                                    stroke={`${ca.color}60`} strokeWidth={2} strokeLinecap="round" />
                                                {/* Polar head */}
                                                <circle cx={headX + Math.cos(ang) * bobble} cy={headY + Math.sin(ang) * bobble} r={5.5}
                                                    fill={`${ca.color}70`} stroke={ca.color} strokeWidth={1.5} />
                                            </g>
                                        )
                                    })}
                                </>
                            )}

                            {step < 2 && (
                                <>
                                    {/* Scattered molecules */}
                                    {Array.from({ length: 10 }, (_, i) => {
                                        const bx = 40 + (i * 38), by = 40 + (i % 3) * 50
                                        const ang = (i * 47) * Math.PI / 180
                                        return (
                                            <g key={i}>
                                                <line x1={bx} y1={by} x2={bx + Math.cos(ang) * 20} y2={by + Math.sin(ang) * 20}
                                                    stroke={`${ca.color}50`} strokeWidth={2} strokeLinecap="round" />
                                                <circle cx={bx + Math.cos(ang) * 20} cy={by + Math.sin(ang) * 20} r={5}
                                                    fill={`${ca.color}60`} stroke={ca.color} strokeWidth={1.5} />
                                            </g>
                                        )
                                    })}
                                    {/* Grease blob */}
                                    <ellipse cx={210} cy={90} rx={40} ry={28}
                                        fill="rgba(216,90,48,0.2)" stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                                    <text x={210} y={94} textAnchor="middle"
                                        style={{ fontSize: 11, fill: 'rgba(216,90,48,0.8)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                        grease
                                    </text>
                                </>
                            )}

                            {/* Labels */}
                            <text x={12} y={16} style={{ fontSize: 9, fill: `${ca.color}70`, fontFamily: 'var(--mono)' }}>water</text>
                            {step >= 2 && (
                                <>
                                    <circle cx={360} cy={150} r={5} fill={`${ca.color}70`} stroke={ca.color} strokeWidth={1.5} />
                                    <text x={370} y={154} style={{ fontSize: 8, fill: ca.color, fontFamily: 'var(--mono)' }}>polar head (hydrophilic)</text>
                                    <line x1={340} y1={138} x2={360} y2={145} stroke={`${ca.color}50`} strokeWidth={2} strokeLinecap="round" />
                                    <text x={340} y={134} textAnchor="end" style={{ fontSize: 8, fill: `${ca.color}80`, fontFamily: 'var(--mono)' }}>non-polar tail</text>
                                </>
                            )}
                        </svg>
                    </div>

                    {/* Step navigator */}
                    <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                        {MECHANISM_STEPS.map((_, i) => (
                            <button key={i} onClick={() => setStep(i)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: step === i ? MECHANISM_STEPS[i].col : step > i ? `${MECHANISM_STEPS[i].col}25` : 'var(--bg3)',
                                color: step === i ? '#fff' : step > i ? MECHANISM_STEPS[i].col : 'var(--text3)',
                                border: `1px solid ${step >= i ? MECHANISM_STEPS[i].col + '50' : 'var(--border)'}`,
                            }}>{i + 1}</button>
                        ))}
                    </div>

                    {MECHANISM_STEPS.slice(0, step + 1).map((s, i) => (
                        <div key={i} style={{
                            padding: '8px 12px', marginBottom: 6,
                            background: i === step ? `${s.col}10` : 'var(--bg3)',
                            border: `1px solid ${i === step ? s.col + '40' : 'var(--border)'}`,
                            borderRadius: 8,
                        }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: s.col, letterSpacing: 1, marginBottom: 3 }}>
                                STEP {i + 1}: {s.title.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{s.desc}</div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', opacity: step === 0 ? 0.4 : 1 }}>←</button>
                        <button onClick={() => setStep(p => Math.min(MECHANISM_STEPS.length - 1, p + 1))} disabled={step >= MECHANISM_STEPS.length - 1} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: `${ca.color}15`, color: ca.color, border: `1px solid ${ca.color}40`, opacity: step >= MECHANISM_STEPS.length - 1 ? 0.4 : 1 }}>→</button>
                    </div>
                </div>
            )}

            {/* ── COMPARE ── */}
            {mode === 'compare' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {Object.entries(CLEANING_AGENTS).map(([k, v]) => (
                            <div key={k} style={{ padding: '14px', background: `${v.color}10`, border: `2px solid ${v.color}35`, borderRadius: 12 }}>
                                <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: v.color, marginBottom: 6 }}>{k}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>{v.formula}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 8, lineHeight: 1.5 }}>{v.make}</div>

                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', marginBottom: 3 }}>ADVANTAGES</div>
                                {v.pros.map((p, i) => (
                                    <div key={i} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 2 }}>✓ {p}</div>
                                ))}
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', marginTop: 6, marginBottom: 3 }}>LIMITATIONS</div>
                                {v.cons.map((c, i) => (
                                    <div key={i} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 2 }}>✗ {c}</div>
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* Key difference table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '1px', background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        {[['Feature', 'Soap', 'Detergent'],
                        ['Raw material', 'Natural fats/oils', 'Petroleum (synthetic)'],
                        ['Head group', '−COO⁻ (carboxylate)', '−SO₃⁻ (sulphonate)'],
                        ['Hard water', 'Scum forms', 'No scum — works well'],
                        ['Biodegradable', '✓ Yes', 'Older types: ✗ No'],
                        ['pH range', 'Alkaline only', 'Works at any pH'],
                        ].map((row, ri) =>
                            row.map((cell, ci) => (
                                <div key={`${ri}${ci}`} style={{
                                    padding: '6px 10px',
                                    background: ri === 0 ? 'rgba(0,0,0,0.3)' : ci === 0 ? 'var(--bg3)' : ci === 1 ? 'rgba(55,138,221,0.06)' : 'rgba(239,159,39,0.06)',
                                    fontSize: ri === 0 ? 10 : 11,
                                    fontFamily: 'var(--mono)',
                                    fontWeight: ri === 0 || ci === 0 ? 700 : 400,
                                    color: ri === 0 ? 'var(--text3)' : ci === 0 ? 'var(--text3)' : ci === 1 ? CLEANING_AGENTS['Soap'].color : CLEANING_AGENTS['Detergent'].color,
                                }}>{cell}</div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* ── HARD WATER ── */}
            {mode === 'hardwater' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--coral)' }}>Hard water</strong> contains dissolved Ca²⁺ and Mg²⁺ ions. Soap reacts with these ions to form insoluble scum — wasting soap and leaving deposits on fabric.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        {/* Soap + hard water */}
                        <div style={{ padding: '14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.3)', borderRadius: 10 }}>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: CLEANING_AGENTS['Soap'].color, marginBottom: 8 }}>
                                Soap in hard water
                            </div>
                            <div style={{ padding: '10px', background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.3)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--coral)', lineHeight: 1.7, marginBottom: 8 }}>
                                {CLEANING_AGENTS['Soap'].HardWater}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                                ✗ Insoluble calcium soap (scum) forms — soap wasted, fabric dirty
                            </div>
                        </div>

                        {/* Detergent + hard water */}
                        <div style={{ padding: '14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.3)', borderRadius: 10 }}>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: CLEANING_AGENTS['Detergent'].color, marginBottom: 8 }}>
                                Detergent in hard water
                            </div>
                            <div style={{ padding: '10px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)', lineHeight: 1.7, marginBottom: 8 }}>
                                {CLEANING_AGENTS['Detergent'].HardWater}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                                ✓ Calcium detergent stays soluble — no scum, effective cleaning
                            </div>
                        </div>
                    </div>

                    {/* Why? */}
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Why the difference?</strong> Calcium carboxylate (soap salt) is insoluble — it precipitates. Calcium sulphonate (detergent salt) is soluble — stays in solution and keeps cleaning.
                        <br />The C−SO₃⁻ group is larger and less polarising than C−COO⁻, so its calcium salt has too high a lattice energy penalty to precipitate.
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Agent" value={agent} color={ca.color} highlight />
                <ValueCard label="Type" value={ca.type} color={ca.color} />
                <ValueCard label="Formula" value={ca.formula.split(' ')[0]} color="var(--gold)" />
                <ValueCard label="Hard water" value={agent === 'Soap' ? 'Scum forms' : 'No scum'} color={agent === 'Soap' ? 'var(--coral)' : 'var(--teal)'} />
            </div>
        </div>
    )
}