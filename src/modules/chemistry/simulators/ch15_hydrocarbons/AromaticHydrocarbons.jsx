import { useState, useEffect, useRef } from 'react'
import { EAS_REACTIONS, DIRECTING_GROUPS } from './helpers/hydrocarbonData'
import ValueCard from '../../components/ui/ValueCard'

// Animated benzene ring
function BenzeneRing({ highlight, tick, color }) {
    const CX = 80, CY = 80, R = 48
    const atoms = Array.from({ length: 6 }, (_, i) => ({
        x: CX + R * Math.cos((i * 60 - 90) * Math.PI / 180),
        y: CY + R * Math.sin((i * 60 - 90) * Math.PI / 180),
        i,
    }))
    const isHighlit = (i) => highlight && highlight.includes(i)
    const t = tick * 0.02

    return (
        <svg viewBox="0 0 160 160" width="100%">
            {/* Delocalised electron cloud */}
            <circle cx={CX} cy={CY} r={28}
                fill={`${color}08`}
                stroke={`${color}30`} strokeWidth={1.5}
                strokeDasharray="4 3" />
            {/* Pulsing ring */}
            <circle cx={CX} cy={CY} r={28 + Math.sin(t * 2) * 1.5}
                fill="none"
                stroke={`${color}20`} strokeWidth={2} />

            {/* Bonds */}
            {atoms.map((a, i) => {
                const next = atoms[(i + 1) % 6]
                const hl = isHighlit(i) || isHighlit((i + 1) % 6)
                return (
                    <line key={i}
                        x1={a.x} y1={a.y} x2={next.x} y2={next.y}
                        stroke={hl ? color : 'rgba(160,176,200,0.35)'}
                        strokeWidth={hl ? 3 : 2} />
                )
            })}

            {/* Carbon atoms */}
            {atoms.map((a) => {
                const hl = isHighlit(a.i)
                return (
                    <g key={a.i}>
                        <circle cx={a.x} cy={a.y} r={hl ? 11 : 9}
                            fill={hl ? `${color}40` : 'rgba(136,135,128,0.2)'}
                            stroke={hl ? color : 'rgba(136,135,128,0.5)'}
                            strokeWidth={hl ? 2 : 1.5} />
                        <text x={a.x} y={a.y + 3} textAnchor="middle"
                            style={{ fontSize: 9, fill: hl ? color : 'rgba(160,176,200,0.6)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            C
                        </text>
                    </g>
                )
            })}
        </svg>
    )
}

export default function AromaticHydrocarbons() {
    const [mode, setMode] = useState('eas')         // eas | directing | structure
    const [selEAS, setSelEAS] = useState('Nitration')
    const [selDir, setSelDir] = useState('-OH')
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

    const eas = EAS_REACTIONS[selEAS]
    const dg = DIRECTING_GROUPS.find(g => g.group === selDir)

    const EAS_STEPS = [
        { title: 'Electrophile generation', desc: `${eas?.electrophile} formed from reagent and catalyst` },
        { title: 'Electrophilic attack', desc: `Electrophile attacks benzene ring — π electrons attack E⁺ → arenium ion (σ complex)` },
        { title: 'σ-complex formed', desc: `Ring loses aromaticity temporarily — positive charge delocalised over 3 carbons` },
        { title: 'Loss of H⁺', desc: `Base abstracts H⁺ → aromaticity restored — NET SUBSTITUTION, not addition` },
    ]

    // Directing group highlights (ortho: 1,3; meta: 2,4; para: 0)
    // positions 0-5 on ring; 0 = substituted carbon
    const getHighlight = (type) => {
        if (type.includes('ortho/para')) return [1, 3, 4]   // o=1,3 p=4
        if (type.includes('meta')) return [2, 4]       // m=2,4
        return []
    }

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'structure', l: 'Benzene structure' }, { k: 'eas', l: 'EAS reactions' }, { k: 'directing', l: 'Directing effects' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── STRUCTURE ── */}
            {mode === 'structure' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, marginBottom: 14 }}>
                        <BenzeneRing highlight={[]} tick={tick} color="var(--teal)" />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Formula', val: 'C₆H₆', col: 'var(--teal)' },
                                { label: 'Structure', val: 'Hexagonal planar ring', col: 'var(--teal)' },
                                { label: 'Hybridisation', val: 'sp² (all carbons)', col: 'var(--gold)' },
                                { label: 'C−C bond length', val: '1.40 Å (between 1.34 and 1.54)', col: 'var(--text2)' },
                                { label: 'Bond angles', val: '120° (regular hexagon)', col: 'var(--text2)' },
                                { label: 'π electrons', val: '6 (Hückel 4n+2, n=1)', col: '#7F77DD' },
                                { label: 'Resonance energy', val: '~150 kJ/mol (extra stability)', col: 'var(--coral)' },
                            ].map(p => (
                                <div key={p.label} style={{ display: 'flex', gap: 8 }}>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 110 }}>{p.label}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: p.col, fontWeight: p.col !== 'var(--text2)' ? 700 : 400 }}>{p.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Hückel's rule */}
                    <div style={{ padding: '12px 14px', background: 'rgba(127,119,221,0.1)', border: '1px solid rgba(127,119,221,0.3)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)', marginBottom: 6 }}>
                            Hückel's rule: Aromatic if 4n+2 π electrons (n = 0,1,2…)
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {[{ n: 0, e: 2, ex: 'cyclopentadienyl anion' }, { n: 1, e: 6, ex: 'benzene ✓' }, { n: 2, e: 10, ex: 'naphthalene' }, { n: 3, e: 14, ex: 'anthracene' }].map(r => (
                                <div key={r.n} style={{ padding: '6px 12px', background: 'var(--bg3)', borderRadius: 8, textAlign: 'center' }}>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--purple)', fontWeight: 700 }}>n={r.n}: {r.e}e</div>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.ex}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why EAS not addition */}
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Why substitution, not addition?</strong> Benzene undergoes EAS (not electrophilic addition) to preserve the aromatic system. Addition would destroy the delocalised π cloud and lose ~150 kJ/mol of resonance energy — thermodynamically unfavourable.
                    </div>
                </div>
            )}

            {/* ── EAS ── */}
            {mode === 'eas' && (
                <div>
                    {/* Reaction selector */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(EAS_REACTIONS).map(k => (
                            <button key={k} onClick={() => { setSelEAS(k); setStep(0) }} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selEAS === k ? EAS_REACTIONS[k].color : 'var(--bg3)',
                                color: selEAS === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${selEAS === k ? EAS_REACTIONS[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Equation */}
                    <div style={{ padding: '12px 16px', background: `${eas.color}12`, border: `2px solid ${eas.color}40`, borderRadius: 12, marginBottom: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: eas.color }}>{eas.eq}</div>
                    </div>

                    {/* EAS mechanism steps with benzene visual */}
                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12, marginBottom: 14 }}>
                        <BenzeneRing
                            highlight={step >= 1 ? [0, 1, 5] : step >= 2 ? [0, 2, 4] : []}
                            tick={tick} color={eas.color} />
                        <div>
                            {/* Step navigator */}
                            <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                                {EAS_STEPS.map((_, i) => (
                                    <button key={i} onClick={() => setStep(i)} style={{
                                        flex: 1, padding: '5px', borderRadius: 6, fontSize: 10,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: step === i ? eas.color : step > i ? `${eas.color}25` : 'var(--bg3)',
                                        color: step === i ? '#000' : step > i ? eas.color : 'var(--text3)',
                                        border: `1px solid ${step >= i ? eas.color + '50' : 'var(--border)'}`,
                                    }}>S{i + 1}</button>
                                ))}
                            </div>

                            {EAS_STEPS.slice(0, step + 1).map((s, i) => (
                                <div key={i} style={{
                                    padding: '8px 12px', marginBottom: 6,
                                    background: i === step ? `${eas.color}12` : 'var(--bg3)',
                                    border: `1px solid ${i === step ? eas.color + '40' : 'var(--border)'}`,
                                    borderRadius: 8,
                                }}>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: eas.color, marginBottom: 2, letterSpacing: 1 }}>STEP {i + 1}</div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: eas.color, marginBottom: 2 }}>{s.title}</div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{s.desc}</div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                                <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{ flex: 1, padding: '6px', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', opacity: step === 0 ? 0.4 : 1 }}>←</button>
                                <button onClick={() => setStep(p => Math.min(EAS_STEPS.length - 1, p + 1))} disabled={step >= EAS_STEPS.length - 1} style={{ flex: 1, padding: '6px', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: 11, cursor: 'pointer', background: `${eas.color}15`, color: eas.color, border: `1px solid ${eas.color}40`, opacity: step >= EAS_STEPS.length - 1 ? 0.4 : 1 }}>→</button>
                            </div>
                        </div>
                    </div>

                    {/* Conditions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>ELECTROPHILE</div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: eas.color }}>{eas.electrophile}</div>
                        </div>
                        <div style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>CONDITIONS</div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text2)' }}>{eas.conditions}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DIRECTING ── */}
            {mode === 'directing' && (
                <div>
                    {/* Group selector */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                        {DIRECTING_GROUPS.map(g => (
                            <button key={g.group} onClick={() => setSelDir(g.group)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selDir === g.group ? g.color : 'var(--bg3)',
                                color: selDir === g.group ? '#000' : 'var(--text2)',
                                border: `1px solid ${selDir === g.group ? g.color : 'var(--border)'}`,
                            }}>{g.group}</button>
                        ))}
                    </div>

                    {dg && (
                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 14, marginBottom: 14 }}>
                            {/* Benzene with highlighted positions */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${dg.color}25`, borderRadius: 10, padding: 10 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: dg.color, textAlign: 'center', marginBottom: 4 }}>
                                    {dg.type.includes('ortho') ? 'ORTHO/PARA' : 'META'} positions
                                </div>
                                <BenzeneRing highlight={getHighlight(dg.type)} tick={tick} color={dg.color} />
                            </div>

                            {/* Info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                <div style={{ padding: '10px 14px', background: `${dg.color}12`, border: `1px solid ${dg.color}35`, borderRadius: 10 }}>
                                    <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: dg.color, marginBottom: 3 }}>{dg.group}</div>
                                    <div style={{
                                        fontSize: 11, fontFamily: 'var(--mono)', padding: '3px 10px', borderRadius: 20, display: 'inline-block',
                                        background: dg.type.includes('activating') ? 'rgba(29,158,117,0.15)' : 'rgba(216,90,48,0.12)',
                                        color: dg.type.includes('activating') ? 'var(--teal)' : 'var(--coral)',
                                        border: `1px solid ${dg.type.includes('activating') ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                                        marginBottom: 6,
                                    }}>
                                        {dg.type}
                                    </div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>
                                        {dg.mechanism}<br />{dg.example}
                                    </div>
                                </div>

                                {/* Directing summary for all groups */}
                                <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>DIRECTING SUMMARY</div>
                                    {DIRECTING_GROUPS.map(g => (
                                        <div key={g.group} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, cursor: 'pointer' }}
                                            onClick={() => setSelDir(g.group)}>
                                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: g.color, minWidth: 40 }}>{g.group}</span>
                                            <span style={{
                                                fontSize: 9, fontFamily: 'var(--mono)', padding: '1px 6px', borderRadius: 20,
                                                background: g.type.includes('activating') ? 'rgba(29,158,117,0.12)' : 'rgba(216,90,48,0.1)',
                                                color: g.type.includes('activating') ? 'var(--teal)' : 'var(--coral)',
                                            }}>
                                                {g.type.split(' ')[0]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Benzene" value="6π — aromatic" color="var(--teal)" highlight />
                {mode === 'eas' && <ValueCard label="Reaction" value={selEAS} color={eas?.color} />}
                {mode === 'directing' && dg && <ValueCard label={dg.group} value={dg.type} color={dg.color} />}
            </div>
        </div>
    )
}