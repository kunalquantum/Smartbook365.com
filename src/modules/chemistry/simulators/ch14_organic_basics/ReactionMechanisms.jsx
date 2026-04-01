import { useState } from 'react'
import { MECHANISMS } from './helpers/organicData'
import ValueCard from '../../components/ui/ValueCard'

// Arrow-pushing diagram rendered with HTML — clean and non-broken
function MechanismDiagram({ mechKey, step }) {
    const m = MECHANISMS[mechKey]
    const col = m.color

    if (mechKey === 'SN2') {
        return (
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: `1px solid ${col}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                    {/* Nucleophile */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>HO⁻</div>
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>nucleophile</div>
                    </div>
                    {/* Arrow showing attack */}
                    <div style={{ fontSize: 18, color: col, transform: 'rotate(0deg)' }}>→</div>
                    {/* Transition state */}
                    {step >= 1 && (
                        <div style={{ textAlign: 'center', padding: '8px 12px', background: `${col}15`, border: `2px dashed ${col}`, borderRadius: 8 }}>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>[HO···C···Br]‡</div>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>transition state</div>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: col }}>trigonal bipyramidal</div>
                        </div>
                    )}
                    {step >= 1 && <div style={{ fontSize: 18, color: col }}>→</div>}
                    {/* Products */}
                    {step >= 2 && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>CH₃OH + Br⁻</div>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>inverted product</div>
                        </div>
                    )}
                </div>
                {step >= 1 && (
                    <div style={{ marginTop: 10, fontSize: 11, fontFamily: 'var(--mono)', color: col, textAlign: 'center' }}>
                        Back-side attack → Walden inversion of configuration
                    </div>
                )}
            </div>
        )
    }

    if (mechKey === 'SN1') {
        return (
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: `1px solid ${col}30` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Step 1 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C−Br</div>
                        <div style={{ fontSize: 16, color: 'var(--text3)' }}>→</div>
                        {step >= 1 && (
                            <div style={{ padding: '6px 12px', background: `${col}15`, border: `2px solid ${col}`, borderRadius: 8 }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C⁺</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>carbocation (planar)</div>
                            </div>
                        )}
                        {step >= 1 && <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>+ Br⁻</div>}
                    </div>
                    {/* Slow label */}
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${col}80`, marginLeft: 10 }}>
                        Step 1: SLOW (rate-determining) — ionisation
                    </div>

                    {/* Step 2 */}
                    {step >= 2 && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C⁺ + H₂O</div>
                                <div style={{ fontSize: 16, color: 'var(--text3)' }}>→</div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃COH + H⁺</div>
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${col}80`, marginLeft: 10 }}>
                                Step 2: FAST — nucleophilic attack from both faces → racemic mixture
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }

    if (mechKey === 'E2') {
        return (
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: `1px solid ${col}30` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>B:⁻</div>
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>base</div>
                    </div>
                    <div style={{ fontSize: 16, color: 'var(--text3)' }}>+</div>
                    <div style={{ padding: '8px 12px', background: `${col}12`, border: `1px solid ${col}30`, borderRadius: 8, textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>H−Cβ−Cα−Br</div>
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>anti-periplanar (H and Br)</div>
                    </div>
                    {step >= 1 && (
                        <>
                            <div style={{ fontSize: 16, color: 'var(--text3)' }}>→</div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>C=C</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>alkene (E2)</div>
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>+ BH + Br⁻</div>
                        </>
                    )}
                </div>
                {step >= 1 && (
                    <div style={{ marginTop: 10, fontSize: 11, fontFamily: 'var(--mono)', color: col, textAlign: 'center' }}>
                        Concerted — H abstraction and Br departure happen simultaneously
                    </div>
                )}
            </div>
        )
    }

    if (mechKey === 'E1') {
        return (
            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: 12, border: `1px solid ${col}30` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C−Br</div>
                        <div style={{ fontSize: 16, color: 'var(--text3)' }}>→</div>
                        {step >= 1 && (
                            <div style={{ padding: '6px 12px', background: `${col}15`, border: `2px solid ${col}`, borderRadius: 8 }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C⁺</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>carbocation</div>
                            </div>
                        )}
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${col}80` }}>Step 1: SLOW — carbocation forms</div>
                    {step >= 2 && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₃C⁺</div>
                                <div style={{ fontSize: 16, color: 'var(--text3)' }}>→</div>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>(CH₃)₂C=CH₂ + H⁺</div>
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${col}80` }}>
                                Step 2: FAST — base removes β-H → Saytzeff product (most substituted alkene)
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
    return null
}

export default function ReactionMechanisms() {
    const [mech, setMech] = useState('SN2')
    const [step, setStep] = useState(0)
    const [mode, setMode] = useState('mechanism')   // mechanism | compare | predict

    const m = MECHANISMS[mech]

    // Predict: given substrate + conditions → SN1/SN2/E1/E2?
    const [substrate, setSubstrate] = useState('tertiary')
    const [nucleophile, setNucleophile] = useState('strong')
    const [temperature, setTemperature] = useState('room')
    const [solvent, setSolvent] = useState('polar_protic')

    const predictMechanism = () => {
        if (substrate === 'primary' && nucleophile === 'strong') return { mech: 'SN2', col: '#1D9E75' }
        if (substrate === 'tertiary' && nucleophile === 'weak' && temperature === 'high') return { mech: 'E1', col: '#D85A30' }
        if (substrate === 'tertiary' && nucleophile === 'weak') return { mech: 'SN1', col: '#EF9F27' }
        if (substrate === 'tertiary' && nucleophile === 'strong' && temperature === 'high') return { mech: 'E2', col: '#7F77DD' }
        if (substrate === 'tertiary' && nucleophile === 'strong') return { mech: 'SN1 + E1 (mixture)', col: '#EF9F27' }
        if (substrate === 'secondary' && nucleophile === 'strong' && temperature === 'room') return { mech: 'SN2', col: '#1D9E75' }
        if (substrate === 'secondary' && nucleophile === 'strong' && temperature === 'high') return { mech: 'E2', col: '#7F77DD' }
        if (substrate === 'secondary' && nucleophile === 'weak') return { mech: 'SN1 (slow)', col: '#EF9F27' }
        return { mech: 'SN2 (mostly)', col: '#1D9E75' }
    }
    const prediction = predictMechanism()

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'mechanism', l: 'Step-by-step' }, { k: 'compare', l: 'Compare SN/E' }, { k: 'predict', l: 'Predict product' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--purple)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--purple)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── STEP-BY-STEP MECHANISM ── */}
            {mode === 'mechanism' && (
                <div>
                    {/* Mechanism selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 14 }}>
                        {Object.keys(MECHANISMS).map(k => (
                            <button key={k} onClick={() => { setMech(k); setStep(0) }} style={{
                                padding: '8px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                background: mech === k ? `${MECHANISMS[k].color}25` : 'var(--bg3)',
                                border: `2px solid ${mech === k ? MECHANISMS[k].color : 'var(--border)'}`,
                            }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: MECHANISMS[k].color }}>{k}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{MECHANISMS[k].name.split('—')[1]?.trim()}</div>
                            </button>
                        ))}
                    </div>

                    {/* Example equation */}
                    <div style={{ padding: '8px 14px', background: `${m.color}12`, border: `1px solid ${m.color}35`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 13, color: m.color, fontWeight: 700 }}>
                        {m.example}
                    </div>

                    {/* Mechanism diagram */}
                    <MechanismDiagram mechKey={mech} step={step} />

                    {/* Steps */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14, marginBottom: 14 }}>
                        {m.steps.map((s, i) => (
                            <div key={i} style={{
                                padding: '8px 12px', borderRadius: 8,
                                background: step > i ? `${m.color}12` : step === i ? `${m.color}08` : 'var(--bg3)',
                                border: `1px solid ${step >= i ? m.color + '40' : 'var(--border)'}`,
                                opacity: step < i ? 0.4 : 1,
                                transition: 'all 0.2s',
                            }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: step >= i ? `${m.color}30` : 'var(--bg3)', border: `1.5px solid ${m.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: m.color, flexShrink: 0 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: step >= i ? 'var(--text1)' : 'var(--text3)', lineHeight: 1.5 }}>{s}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rate law + conditions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: '8px 12px', background: `${m.color}10`, border: `1px solid ${m.color}25`, borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>RATE LAW</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: m.color, fontWeight: 700 }}>{m.rate}</div>
                        </div>
                        <div style={{ padding: '8px 12px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>STEREOCHEMISTRY</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 700 }}>{m.stereo}</div>
                        </div>
                    </div>

                    {/* Prev/Next */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
                            opacity: step === 0 ? 0.4 : 1,
                        }}>← Back</button>
                        <button onClick={() => setStep(p => Math.min(m.steps.length, p + 1))} disabled={step >= m.steps.length} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}40`,
                            opacity: step >= m.steps.length ? 0.4 : 1,
                        }}>Next →</button>
                    </div>
                </div>
            )}

            {/* ── COMPARE ── */}
            {mode === 'compare' && (
                <div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
                            <thead>
                                <tr>
                                    {['', 'SN1', 'SN2', 'E1', 'E2'].map((h, i) => (
                                        <th key={h} style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.3)', color: i === 0 ? 'var(--text3)' : [, '#EF9F27', '#1D9E75', '#D85A30', '#7F77DD'][i], fontSize: i === 0 ? 9 : 12, textAlign: 'center', fontWeight: 700 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Order', '1st', '2nd', '1st', '2nd'],
                                    ['Substrate', '3° best', '1° best', '3° best', 'Any (anti-H)'],
                                    ['Nucleophile', 'Weak', 'Strong', 'Weak base', 'Strong bulky base'],
                                    ['Solvent', 'Polar protic', 'Polar aprotic', 'Polar protic', 'Any'],
                                    ['Temp', 'Room', 'Room', 'High', 'High (favours)'],
                                    ['Intermediate', 'Carbocation', 'None (TS)', 'Carbocation', 'None (TS)'],
                                    ['Stereo', 'Racemic', 'Inversion', 'Mixed', 'Stereospecific (anti)'],
                                    ['Saytzeff', '—', '—', '✓ Yes', '✓ Yes'],
                                ].map((row, ri) => (
                                    <tr key={ri} style={{ background: ri % 2 === 0 ? 'var(--bg3)' : 'transparent' }}>
                                        {row.map((cell, ci) => (
                                            <td key={ci} style={{ padding: '6px 10px', color: ci === 0 ? 'var(--text3)' : [, '#EF9F27', '#1D9E75', '#D85A30', '#7F77DD'][ci] || 'var(--text2)', textAlign: ci === 0 ? 'left' : 'center', fontSize: 11 }}>
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── PREDICT ── */}
            {mode === 'predict' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Adjust the reaction conditions below — the predicted mechanism updates live.
                    </div>

                    {[
                        { label: 'Substrate', state: substrate, setter: setSubstrate, opts: [{ v: 'primary', l: 'Primary (CH₃Br)' }, { v: 'secondary', l: 'Secondary (CH₃CHBrCH₃)' }, { v: 'tertiary', l: 'Tertiary ((CH₃)₃CBr)' }] },
                        { label: 'Nucleophile', state: nucleophile, setter: setNucleophile, opts: [{ v: 'strong', l: 'Strong (OH⁻, CN⁻)' }, { v: 'weak', l: 'Weak (H₂O, ROH)' }] },
                        { label: 'Temperature', state: temperature, setter: setTemperature, opts: [{ v: 'room', l: 'Room temp' }, { v: 'high', l: 'High temperature (heating)' }] },
                        { label: 'Solvent', state: solvent, setter: setSolvent, opts: [{ v: 'polar_protic', l: 'Polar protic (H₂O, ROH)' }, { v: 'polar_aprotic', l: 'Polar aprotic (DMSO, acetone)' }] },
                    ].map(row => (
                        <div key={row.label} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>{row.label.toUpperCase()}</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {row.opts.map(opt => (
                                    <button key={opt.v} onClick={() => row.setter(opt.v)} style={{
                                        padding: '5px 12px', borderRadius: 20, fontSize: 11,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: row.state === opt.v ? 'var(--purple)' : 'var(--bg3)',
                                        color: row.state === opt.v ? '#fff' : 'var(--text2)',
                                        border: `1px solid ${row.state === opt.v ? 'var(--purple)' : 'var(--border)'}`,
                                    }}>{opt.l}</button>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Prediction */}
                    <div style={{
                        padding: '16px 20px', borderRadius: 12, textAlign: 'center',
                        background: `${prediction.col}18`, border: `2px solid ${prediction.col}50`,
                    }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>PREDICTED MECHANISM</div>
                        <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700, color: prediction.col }}>
                            {prediction.mech}
                        </div>
                        {MECHANISMS[prediction.mech.split(' ')[0]] && (
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginTop: 6 }}>
                                {MECHANISMS[prediction.mech.split(' ')[0]]?.favoured}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Mechanism" value={m.name.split('—')[0].trim()} color={m.color} highlight />
                <ValueCard label="Rate law" value={m.rate.split('←')[0].trim()} color="var(--gold)" />
                <ValueCard label="Stereo" value={m.stereo.split(' ')[0]} color="var(--purple)" />
            </div>
        </div>
    )
}