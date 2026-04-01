import { useState } from 'react'
import { ISOMERS } from './helpers/organicData'
import ValueCard from '../../components/ui/ValueCard'

// Molecule display using inline HTML — no broken coordinate SVG
function MoleculeCard({ isomer, color, selected, onClick }) {
    return (
        <button onClick={onClick} style={{
            flex: 1, padding: '14px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
            background: selected ? `${color}20` : 'var(--bg3)',
            border: `2px solid ${selected ? color : 'var(--border)'}`,
            transition: 'all 0.15s',
        }}>
            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color, marginBottom: 6 }}>
                {isomer.name}
            </div>
            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 6, lineHeight: 1.5 }}>
                {isomer.formula}
            </div>
            {isomer.bp !== null && (
                <div style={{
                    fontSize: 11, fontFamily: 'var(--mono)',
                    color: selected ? color : 'var(--text3)',
                    padding: '3px 10px', borderRadius: 20,
                    background: `${color}10`, border: `1px solid ${color}30`,
                    display: 'inline-block',
                }}>
                    bp = {isomer.bp}°C
                </div>
            )}
        </button>
    )
}

export default function Isomerism() {
    const [sel, setSel] = useState('C₄H₁₀ (butane)')
    const [selIso, setSelIso] = useState(0)
    const [mode, setMode] = useState('explore')   // explore | quiz

    const iso = ISOMERS[sel]
    const cur = iso.isomers[selIso]

    // Quiz mode
    const [quizAns, setQuizAns] = useState(null)
    const [quizQ, setQuizQ] = useState(0)

    const QUIZ = [
        { q: 'Which type of isomerism involves different carbon skeletons?', opts: ['Chain isomerism', 'Position isomerism', 'Functional group isomerism', 'Optical isomerism'], ans: 0 },
        { q: 'Cis-trans isomerism requires restricted rotation. Which bond causes this?', opts: ['C−C single bond', 'C=C double bond', 'C−H bond', 'C−O bond'], ans: 1 },
        { q: 'Optical isomers require a _____ centre.', opts: ['Chiral', 'Aromatic', 'sp hybridised', 'Ionic'], ans: 0 },
        { q: 'C₂H₆O can be ethanol OR dimethyl ether. This is:', opts: ['Chain isomerism', 'Position isomerism', 'Functional group isomerism', 'Optical isomerism'], ans: 2 },
        { q: 'Which isomers are non-superimposable mirror images?', opts: ['Chain isomers', 'Enantiomers', 'Position isomers', 'Diastereomers'], ans: 1 },
    ]
    const qObj = QUIZ[quizQ]

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'explore', l: 'Explore isomers' }, { k: 'types', l: 'Isomerism types' }, { k: 'quiz', l: 'Quick quiz' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--gold)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── EXPLORE ── */}
            {mode === 'explore' && (
                <div>
                    {/* Formula selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(ISOMERS).map(k => (
                            <button key={k} onClick={() => { setSel(k); setSelIso(0) }} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: sel === k ? ISOMERS[k].color : 'var(--bg3)',
                                color: sel === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${sel === k ? ISOMERS[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Isomer type badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <div style={{ padding: '5px 14px', borderRadius: 20, background: `${iso.color}20`, border: `1px solid ${iso.color}50`, fontSize: 11, fontFamily: 'var(--mono)', color: iso.color, fontWeight: 700 }}>
                            {iso.type.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            {iso.isomers.length} isomers of {sel}
                        </span>
                    </div>

                    {/* Side-by-side isomer cards */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                        {iso.isomers.map((im, i) => (
                            <MoleculeCard key={i} isomer={im} color={iso.color} selected={selIso === i} onClick={() => setSelIso(i)} />
                        ))}
                    </div>

                    {/* Selected isomer detail */}
                    <div style={{ padding: '12px 16px', background: `${iso.color}10`, border: `1px solid ${iso.color}30`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: iso.color, marginBottom: 6 }}>{cur.name}</div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', marginBottom: 4 }}>{cur.formula}</div>
                        {cur.bp !== null && (
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                Boiling point: <span style={{ color: iso.color, fontWeight: 700 }}>{cur.bp}°C</span>
                                {iso.isomers.length > 1 && iso.isomers[1 - selIso]?.bp !== null && (
                                    <span style={{ color: 'var(--text3)' }}>  vs  {iso.isomers[1 - selIso].name}: {iso.isomers[1 - selIso].bp}°C  (Δbp = {Math.abs(cur.bp - iso.isomers[1 - selIso].bp).toFixed(1)}°C)</span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Explanation */}
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        {iso.note}
                    </div>
                </div>
            )}

            {/* ── TYPES ── */}
            {mode === 'types' && (
                <div>
                    {[
                        {
                            type: 'Structural isomers', color: 'var(--teal)',
                            subtypes: [
                                { name: 'Chain isomers', desc: 'Same formula, different carbon skeleton (branching)', example: 'n-butane vs isobutane' },
                                { name: 'Position isomers', desc: 'Same skeleton and FG, different position of FG', example: '1-chloropropane vs 2-chloropropane' },
                                { name: 'Functional group isomers', desc: 'Same formula, different functional groups', example: 'ethanol vs dimethyl ether (C₂H₆O)' },
                            ]
                        },
                        {
                            type: 'Stereoisomers', color: 'var(--purple)',
                            subtypes: [
                                { name: 'Geometrical (cis-trans)', desc: 'Restricted rotation around C=C or ring; same connectivity but different arrangement in space', example: 'cis-2-butene vs trans-2-butene' },
                                { name: 'Optical isomers', desc: 'Non-superimposable mirror images; require chiral centre (C with 4 different groups)', example: 'D- and L-lactic acid' },
                            ]
                        },
                    ].map(cat => (
                        <div key={cat.type} style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: cat.color, marginBottom: 8, padding: '6px 12px', background: `${cat.color === 'var(--teal)' ? 'rgba(29,158,117' : 'rgba(127,119,221'}.1)`, borderRadius: 8 }}>
                                {cat.type}
                            </div>
                            {cat.subtypes.map(s => (
                                <div key={s.name} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6, marginLeft: 10 }}>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: cat.color, marginBottom: 3 }}>{s.name}</div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 4 }}>{s.desc}</div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>e.g. {s.example}</div>
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Chiral centre box */}
                    <div style={{ padding: '12px 16px', background: 'rgba(127,119,221,0.1)', border: '2px solid rgba(127,119,221,0.3)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)', marginBottom: 6 }}>
                            CHIRAL CENTRE — Required for optical isomerism
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, alignItems: 'center', margin: '10px 0' }}>
                            {['a', 'b', 'c', 'd'].map((g, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: `${['#EF9F27', '#D85A30', '#1D9E75', '#378ADD'][i]}25`,
                                    border: `2px solid ${['#EF9F27', '#D85A30', '#1D9E75', '#378ADD'][i]}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: ['#EF9F27', '#D85A30', '#1D9E75', '#378ADD'][i],
                                }}>{g}</div>
                            ))}
                        </div>
                        <div style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            Central carbon C* with 4 DIFFERENT groups → chiral centre → 2 non-superimposable mirror images
                        </div>
                    </div>
                </div>
            )}

            {/* ── QUIZ ── */}
            {mode === 'quiz' && (
                <div>
                    <div style={{ padding: '14px 16px', background: 'rgba(212,160,23,0.1)', border: '2px solid rgba(212,160,23,0.3)', borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 6 }}>
                            QUESTION {quizQ + 1} / {QUIZ.length}
                        </div>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text1)', lineHeight: 1.5 }}>
                            {qObj.q}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                        {qObj.opts.map((opt, i) => {
                            const isSelected = quizAns === i
                            const isCorrect = i === qObj.ans
                            const showResult = quizAns !== null
                            return (
                                <button key={i} onClick={() => quizAns === null && setQuizAns(i)} style={{
                                    padding: '10px 14px', borderRadius: 8, textAlign: 'left', cursor: quizAns === null ? 'pointer' : 'default',
                                    fontFamily: 'var(--mono)', fontSize: 12, fontWeight: isSelected ? 700 : 400,
                                    background: !showResult ? 'var(--bg3)' : isCorrect ? 'rgba(29,158,117,0.15)' : isSelected ? 'rgba(216,90,48,0.12)' : 'var(--bg3)',
                                    color: !showResult ? 'var(--text2)' : isCorrect ? 'var(--teal)' : isSelected ? 'var(--coral)' : 'var(--text3)',
                                    border: `2px solid ${!showResult ? 'var(--border)' : isCorrect ? 'rgba(29,158,117,0.4)' : isSelected ? 'rgba(216,90,48,0.3)' : 'var(--border)'}`,
                                    transition: 'all 0.15s',
                                }}>
                                    {showResult && isCorrect ? '✓ ' : showResult && isSelected && !isCorrect ? '✗ ' : `${String.fromCharCode(65 + i)}. `}
                                    {opt}
                                </button>
                            )
                        })}
                    </div>

                    {quizAns !== null && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{
                                flex: 1, padding: '10px 14px', borderRadius: 8,
                                background: quizAns === qObj.ans ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)',
                                border: `1px solid ${quizAns === qObj.ans ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                                fontSize: 12, fontFamily: 'var(--mono)',
                                color: quizAns === qObj.ans ? 'var(--teal)' : 'var(--coral)',
                            }}>
                                {quizAns === qObj.ans ? '✓ Correct!' : `✗ Correct answer: ${qObj.opts[qObj.ans]}`}
                            </div>
                            <button onClick={() => { setQuizQ(p => (p + 1) % QUIZ.length); setQuizAns(null) }} style={{
                                padding: '10px 16px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: 'rgba(212,160,23,0.12)', color: 'var(--gold)',
                                border: '1px solid rgba(212,160,23,0.3)',
                            }}>Next →</button>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Type" value={iso.type} color={iso.color} highlight />
                <ValueCard label="Isomers" value={`${iso.isomers.length} for ${sel}`} color={iso.color} />
                <ValueCard label="Selected" value={cur.name} color={iso.color} />
            </div>
        </div>
    )
}