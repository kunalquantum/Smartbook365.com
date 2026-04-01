import { useState } from 'react'
import { ADDITION_REACTIONS } from './helpers/hydrocarbonData'
import ValueCard from '../../components/ui/ValueCard'

// Markovnikov's rule interactive demo
const SUBSTRATES = {
    'Propene (CH₂=CHCH₃)': {
        color: '#1D9E75',
        carbons: [
            { n: 1, H: 2, subst: 0, label: 'CH₂=' },
            { n: 2, H: 1, subst: 1, label: '=CH−' },
            { n: 3, H: 3, subst: 0, label: '−CH₃' },
        ],
        withHBr: {
            markov: '2-bromopropane (CH₃CHBrCH₃)',
            anti: '1-bromopropane (CH₃CH₂CH₂Br)',
            correct: 'markov',
            why: 'H adds to C1 (more H), Br adds to C2 (more substituted = more stable carbocation)',
        },
    },
    '2-Methylpropene ((CH₃)₂C=CH₂)': {
        color: '#EF9F27',
        carbons: [
            { n: 1, H: 2, subst: 0, label: 'CH₂=' },
            { n: 2, H: 0, subst: 2, label: '=C(CH₃)₂' },
        ],
        withHBr: {
            markov: '2-bromo-2-methylpropane (tertiary)', anti: '1-bromo-2-methylpropane (primary)',
            correct: 'markov',
            why: 'C2 bears 2 methyl groups — tertiary carbocation far more stable than primary',
        },
    },
    'But-2-ene (CH₃CH=CHCH₃)': {
        color: '#7F77DD',
        carbons: [
            { n: 1, H: 3, subst: 0, label: 'CH₃−' },
            { n: 2, H: 1, subst: 1, label: '−CH=' },
            { n: 3, H: 1, subst: 1, label: '=CH−' },
            { n: 4, H: 3, subst: 0, label: '−CH₃' },
        ],
        withHBr: {
            markov: '2-bromobutane (both C2 and C3 equivalent)', anti: '2-bromobutane',
            correct: 'markov',
            why: 'Both C2 and C3 are equally substituted — only one product formed',
        },
    },
}

export default function Alkenes() {
    const [mode, setMode] = useState('addition')   // addition | markovnikov | baeyer
    const [rxn, setRxn] = useState('HBr addition')
    const [subs, setSubs] = useState('Propene (CH₂=CHCH₃)')
    const [guess, setGuess] = useState(null)         // user's Markovnikov guess
    const [baeyerT, setBaeyerT] = useState('alkene')     // alkene | alkane | arene

    const r = ADDITION_REACTIONS[rxn]
    const sb = SUBSTRATES[subs]

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'addition', l: 'Addition reactions' }, { k: 'markovnikov', l: "Markovnikov's rule" }, { k: 'baeyer', l: "Baeyer's test" }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── ADDITION REACTIONS ── */}
            {mode === 'addition' && (
                <div>
                    {/* Reaction selector */}
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(ADDITION_REACTIONS).map(k => (
                            <button key={k} onClick={() => setRxn(k)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: rxn === k ? ADDITION_REACTIONS[k].color : 'var(--bg3)',
                                color: rxn === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${rxn === k ? ADDITION_REACTIONS[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Main equation */}
                    <div style={{ padding: '14px 16px', background: `${r.color}12`, border: `2px solid ${r.color}40`, borderRadius: 12, marginBottom: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: r.color, letterSpacing: 0.5 }}>
                            {r.example}
                        </div>
                    </div>

                    {/* Details grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {[
                            { label: 'Reagent', val: r.reagent, col: r.color },
                            { label: 'Product', val: r.product, col: r.color },
                            { label: 'Mechanism', val: r.mechanism, col: 'var(--gold)' },
                            { label: 'Conditions', val: r.temp, col: 'var(--text2)' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '10px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>{p.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col, lineHeight: 1.4 }}>{p.val}</div>
                            </div>
                        ))}
                    </div>

                    {/* Markovnikov badge */}
                    {r.Markov && (
                        <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--teal)', lineHeight: 1.6 }}>
                            <strong>Markovnikov's rule applies:</strong> H adds to carbon with MORE hydrogens (carbocation formed on more substituted carbon).
                        </div>
                    )}
                </div>
            )}

            {/* ── MARKOVNIKOV ── */}
            {mode === 'markovnikov' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--teal)' }}>Markovnikov's rule:</strong> In the addition of HX to an unsymmetrical alkene, H adds to the carbon bearing MORE hydrogens (and X adds to the carbon bearing fewer H — i.e. the more substituted carbon).
                    </div>

                    {/* Substrate selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(SUBSTRATES).map(k => (
                            <button key={k} onClick={() => { setSubs(k); setGuess(null) }} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: subs === k ? SUBSTRATES[k].color : 'var(--bg3)',
                                color: subs === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${subs === k ? SUBSTRATES[k].color : 'var(--border)'}`,
                            }}>{k.split(' ')[0]}</button>
                        ))}
                    </div>

                    {/* Carbocation stability visual */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${sb.color}25`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: sb.color, letterSpacing: 1.5, marginBottom: 10 }}>
                            CARBOCATION FORMED DETERMINES PRODUCT
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                            {sb.carbons.map(c => (
                                <div key={c.n} style={{ textAlign: 'center', padding: '8px 12px', background: `${sb.color}12`, border: `1px solid ${sb.color}30`, borderRadius: 8 }}>
                                    <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: sb.color }}>{c.label}</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>C{c.n}: {c.H} H's</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                        {c.subst === 0 ? 'primary' : c.subst === 1 ? 'secondary' : 'tertiary'} site
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Predict product */}
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                WHERE DOES Br ADD? (click to guess)
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => setGuess('markov')} style={{
                                    flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                    background: guess === 'markov' ? `${sb.color}25` : 'var(--bg3)',
                                    border: `2px solid ${guess === 'markov' ? sb.color : 'var(--border)'}`,
                                }}>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: sb.color }}>Markovnikov</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{sb.withHBr.markov}</div>
                                </button>
                                <button onClick={() => setGuess('anti')} style={{
                                    flex: 1, padding: '10px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                    background: guess === 'anti' ? 'rgba(216,90,48,0.15)' : 'var(--bg3)',
                                    border: `2px solid ${guess === 'anti' ? 'var(--coral)' : 'var(--border)'}`,
                                }}>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)' }}>Anti-Markovnikov</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{sb.withHBr.anti}</div>
                                </button>
                            </div>
                        </div>

                        {/* Result */}
                        {guess && (
                            <div style={{
                                padding: '10px 14px', borderRadius: 8,
                                background: guess === sb.withHBr.correct ? 'rgba(29,158,117,0.12)' : 'rgba(216,90,48,0.1)',
                                border: `1px solid ${guess === sb.withHBr.correct ? 'rgba(29,158,117,0.4)' : 'rgba(216,90,48,0.3)'}`,
                                fontFamily: 'var(--mono)', fontSize: 12,
                                color: guess === sb.withHBr.correct ? 'var(--teal)' : 'var(--coral)',
                                lineHeight: 1.6,
                            }}>
                                {guess === sb.withHBr.correct ? '✓ Correct! ' : '✗ Incorrect. '}
                                {sb.withHBr.why}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── BAEYER'S TEST ── */}
            {mode === 'baeyer' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--purple)' }}>Baeyer's test:</strong> Cold dilute alkaline KMnO₄ (purple) is added to an unknown compound. Alkenes decolourise it (purple → colourless/brown MnO₂). Used to detect C=C.
                    </div>

                    {/* Interactive test */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {[{ k: 'alkene', l: 'Alkene' }, { k: 'alkane', l: 'Alkane' }, { k: 'arene', l: 'Benzene' }].map(t => (
                            <button key={t.k} onClick={() => setBaeyerT(t.k)} style={{
                                flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                                background: baeyerT === t.k ? 'rgba(127,119,221,0.2)' : 'var(--bg3)',
                                border: `2px solid ${baeyerT === t.k ? 'var(--purple)' : 'var(--border)'}`,
                            }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)' }}>{t.l}</div>
                            </button>
                        ))}
                    </div>

                    {/* Test tube visual */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                        {/* Before */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>BEFORE — KMnO₄ added</div>
                            <svg viewBox="0 0 100 160" width="100%" style={{ maxWidth: 120, display: 'block', margin: '0 auto' }}>
                                <path d="M 25 20 L 20 140 L 80 140 L 75 20 Z"
                                    fill="rgba(127,119,221,0.3)"
                                    stroke="rgba(127,119,221,0.5)" strokeWidth={1.5} />
                                <text x={50} y={90} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'var(--purple)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    purple
                                </text>
                                <text x={50} y={104} textAnchor="middle"
                                    style={{ fontSize: 8, fill: 'rgba(127,119,221,0.7)', fontFamily: 'var(--mono)' }}>
                                    KMnO₄
                                </text>
                            </svg>
                        </div>

                        {/* After */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>
                                AFTER — {baeyerT === 'alkene' ? 'POSITIVE TEST' : 'NEGATIVE TEST'}
                            </div>
                            <svg viewBox="0 0 100 160" width="100%" style={{ maxWidth: 120, display: 'block', margin: '0 auto' }}>
                                <path d="M 25 20 L 20 140 L 80 140 L 75 20 Z"
                                    fill={baeyerT === 'alkene' ? 'rgba(136,135,128,0.2)' : 'rgba(127,119,221,0.3)'}
                                    stroke={baeyerT === 'alkene' ? 'rgba(136,135,128,0.4)' : 'rgba(127,119,221,0.5)'}
                                    strokeWidth={1.5} />
                                {/* Brown precipitate for alkene */}
                                {baeyerT === 'alkene' && (
                                    <rect x={22} y={115} width={56} height={22} rx={2}
                                        fill="rgba(136,90,30,0.4)" stroke="rgba(136,90,30,0.6)" strokeWidth={1} />
                                )}
                                <text x={50} y={88} textAnchor="middle"
                                    style={{ fontSize: 10, fill: baeyerT === 'alkene' ? 'rgba(136,135,128,0.8)' : 'var(--purple)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    {baeyerT === 'alkene' ? 'colourless' : 'purple'}
                                </text>
                                {baeyerT === 'alkene' && (
                                    <text x={50} y={130} textAnchor="middle"
                                        style={{ fontSize: 8, fill: 'rgba(136,90,30,0.8)', fontFamily: 'var(--mono)' }}>MnO₂↓</text>
                                )}
                            </svg>
                        </div>
                    </div>

                    {/* Result explanation */}
                    <div style={{
                        padding: '12px 14px', borderRadius: 10,
                        background: baeyerT === 'alkene' ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.08)',
                        border: `1px solid ${baeyerT === 'alkene' ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.2)'}`,
                        fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7,
                        color: baeyerT === 'alkene' ? 'var(--teal)' : 'var(--coral)',
                    }}>
                        {baeyerT === 'alkene'
                            ? '✓ POSITIVE — KMnO₄ decolourised. C=C detected. Product: diol (HOCH₂CH₂OH). Brown MnO₂ precipitates.'
                            : baeyerT === 'alkane'
                                ? '✗ NEGATIVE — KMnO₄ stays purple. No C=C. Alkanes do not react with cold KMnO₄.'
                                : '✗ NEGATIVE — Benzene does not react with cold dilute KMnO₄ (aromatic stability). Distinguishes benzene from alkenes.'}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {mode === 'addition' && (
                    <>
                        <ValueCard label="Reagent" value={r.reagent.split('/')[0].trim()} color={r.color} highlight />
                        <ValueCard label="Product" value={r.product.split('(')[0].trim()} color={r.color} />
                        <ValueCard label="Mechanism" value={r.mechanism} color="var(--gold)" />
                        <ValueCard label="Markovnikov" value={r.Markov ? 'Applies' : 'Not applicable'} color={r.Markov ? 'var(--teal)' : 'var(--text3)'} />
                    </>
                )}
                {mode === 'markovnikov' && (
                    <ValueCard label="Rule" value="H → C with more H" color="var(--teal)" highlight />
                )}
                {mode === 'baeyer' && (
                    <ValueCard label="Test" value={baeyerT === 'alkene' ? 'Positive — decolourises KMnO₄' : 'Negative — KMnO₄ unchanged'} color={baeyerT === 'alkene' ? 'var(--teal)' : 'var(--coral)'} highlight />
                )}
            </div>
        </div>
    )
}