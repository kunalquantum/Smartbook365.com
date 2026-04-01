import { useState } from 'react'
import { ALKYNE_REACTIONS } from './helpers/hydrocarbonData'
import ValueCard from '../../components/ui/ValueCard'

const ALKYNE_ACIDITY = [
    { compound: 'HC≡CH (sp)', pKa: 25, color: '#EF9F27', hybridisation: 'sp', sChar: '50%', note: 'Most acidic — highest s-character means electrons held closer to nucleus' },
    { compound: 'H₂C=CH₂ (sp²)', pKa: 44, color: '#1D9E75', hybridisation: 'sp²', sChar: '33%', note: 'Less acidic than alkyne' },
    { compound: 'CH₃−CH₃ (sp³)', pKa: 50, color: '#888780', hybridisation: 'sp³', sChar: '25%', note: 'Least acidic — low s-character, electrons far from nucleus' },
]

const TESTS = {
    'Ammoniacal AgNO₃': {
        reacts: 'Terminal alkynes (HC≡C−) only',
        color: '#888780',
        product: 'Silver acetylide — white precipitate Ag−C≡C−R↓',
        eq: 'HC≡CH + 2[Ag(NH₃)₂]⁺ → AgC≡CAg↓ + 2NH₄⁺',
        note: 'Internal alkynes (R−C≡C−R) do NOT react. Used to distinguish terminal from internal.',
    },
    'Ammoniacal Cu₂Cl₂': {
        reacts: 'Terminal alkynes only',
        color: '#D85A30',
        product: 'Copper acetylide — red/brick precipitate Cu−C≡C−R↓',
        eq: 'HC≡CH + 2Cu(NH₃)₂⁺ → CuC≡CCu↓ + 2NH₄⁺',
        note: 'Red/brown precipitate is diagnostic for terminal alkyne. Internal alkynes are negative.',
    },
    'Br₂ / CCl₄': {
        reacts: 'Both terminal and internal alkynes',
        color: '#EF9F27',
        product: 'Decolourisation of brown Br₂ solution',
        eq: 'HC≡CH + 2Br₂ → CHBr₂CHBr₂',
        note: 'Two moles of Br₂ consumed. Same as alkene test but alkyne needs 2 moles.',
    },
    'KMnO₄ (Baeyer\'s)': {
        reacts: 'Both terminal and internal',
        color: '#7F77DD',
        product: 'Decolourises KMnO₄ (purple → colourless)',
        eq: 'HC≡CH + KMnO₄ → CO₂ + H₂O + MnO₂↓',
        note: 'Alkynes decolourise KMnO₄ same as alkenes. Does not distinguish between them.',
    },
}

export default function Alkynes() {
    const [mode, setMode] = useState('reactions')
    const [selRxn, setSelRxn] = useState(0)
    const [selTest, setSelTest] = useState('Ammoniacal AgNO₃')
    const [showAcidity, setShowAcidity] = useState(true)

    const rxn = ALKYNE_REACTIONS[selRxn]
    const test = TESTS[selTest]

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'reactions', l: 'Addition reactions' }, { k: 'acidity', l: 'Acidity of alkynes' }, { k: 'tests', l: 'Chemical tests' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--gold)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── REACTIONS ── */}
            {mode === 'reactions' && (
                <div>
                    {/* Reaction list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                        {ALKYNE_REACTIONS.map((r, i) => (
                            <button key={i} onClick={() => setSelRxn(i)} style={{
                                padding: '8px 12px', borderRadius: 8, textAlign: 'left', cursor: 'pointer',
                                background: selRxn === i ? `${r.color}20` : 'var(--bg3)',
                                border: `2px solid ${selRxn === i ? r.color : 'var(--border)'}`,
                                transition: 'all 0.15s',
                            }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: r.color }}>{r.name}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{r.reagent}</div>
                            </button>
                        ))}
                    </div>

                    {/* Selected reaction detail */}
                    <div style={{ padding: '14px 16px', background: `${rxn.color}12`, border: `2px solid ${rxn.color}40`, borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: rxn.color, marginBottom: 6 }}>{rxn.name}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                            {[
                                { label: 'Reagent', val: rxn.reagent, col: rxn.color },
                                { label: 'Product', val: rxn.product, col: rxn.color },
                            ].map(p => (
                                <div key={p.label} style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.label}</div>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col }}>{p.val}</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{rxn.note}</div>
                    </div>
                </div>
            )}

            {/* ── ACIDITY ── */}
            {mode === 'acidity' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Why are terminal alkynes acidic?</strong> The sp carbon has 50% s-character — electrons are held closer to the nucleus. This makes the C−H bond more polar and the conjugate base (acetylide RC≡C⁻) more stable.
                    </div>

                    {/* Acidity comparison bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            pKa COMPARISON — lower pKa = stronger acid
                        </div>
                        {ALKYNE_ACIDITY.map(a => {
                            const pct = ((50 - a.pKa) / 25) * 100 + 10
                            return (
                                <div key={a.compound} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: a.color }}>{a.compound}</span>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: a.color }}>pKa = {a.pKa}</span>
                                    </div>
                                    <div style={{ height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.max(5, pct)}%`, background: a.color, borderRadius: 7 }} />
                                    </div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>
                                        {a.hybridisation} · {a.sChar} s-character · {a.note}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* s-character effect */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            s-CHARACTER vs ACIDITY
                        </div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                            {[{ hyb: 'sp³', sC: 25, col: '#888780' }, { hyb: 'sp²', sC: 33, col: '#1D9E75' }, { hyb: 'sp', sC: 50, col: '#EF9F27' }].map(h => (
                                <div key={h.hyb} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ height: `${h.sC * 2}px`, background: `${h.col}40`, border: `2px solid ${h.col}`, borderRadius: '4px 4px 0 0', marginBottom: 3 }} />
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: h.col }}>{h.hyb}</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{h.sC}% s</div>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', textAlign: 'center' }}>
                            Higher s-character → electrons closer to nucleus → more stable anion → more acidic
                        </div>
                    </div>

                    {/* Sodium acetylide */}
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Sodium acetylide:</strong> HC≡CH + NaNH₂ → NaC≡CH + NH₃
                        <br />Acetylide ion RC≡C⁻ is a powerful nucleophile — used to build longer carbon chains (synthesis).
                    </div>
                </div>
            )}

            {/* ── CHEMICAL TESTS ── */}
            {mode === 'tests' && (
                <div>
                    {/* Test selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(TESTS).map(k => (
                            <button key={k} onClick={() => setSelTest(k)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selTest === k ? TESTS[k].color : 'var(--bg3)',
                                color: selTest === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${selTest === k ? TESTS[k].color : 'var(--border)'}`,
                            }}>{k.split(' ')[0]}</button>
                        ))}
                    </div>

                    {/* Test detail */}
                    <div style={{ padding: '14px 16px', background: `${test.color}10`, border: `2px solid ${test.color}35`, borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: test.color, marginBottom: 4 }}>{selTest}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 8 }}>{test.eq}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>REACTS WITH</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: test.color }}>{test.reacts}</div>
                            </div>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>POSITIVE RESULT</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: test.color }}>{test.product}</div>
                            </div>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            ★ {test.note}
                        </div>
                    </div>

                    {/* Terminal vs internal comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Terminal (HC≡C−R)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>
                                • Acidic H → forms metal acetylides
                                <br />• Reacts with AgNO₃ and Cu₂Cl₂
                                <br />• pKa ≈ 25
                            </div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(136,135,128,0.08)', border: '1px solid rgba(136,135,128,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: '#888780', marginBottom: 4 }}>Internal (R−C≡C−R)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>
                                • No acidic H
                                <br />• Does NOT react with AgNO₃/Cu₂Cl₂
                                <br />• Still reacts with Br₂ and KMnO₄
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Alkynes" value="CₙH₂ₙ₋₂ — sp hybridised" color="var(--gold)" highlight />
                {mode === 'acidity' && <ValueCard label="pKa (HC≡CH)" value="25 (sp C)" color="var(--gold)" />}
                {mode === 'tests' && <ValueCard label="Test" value={selTest} color={test.color} />}
            </div>
        </div>
    )
}