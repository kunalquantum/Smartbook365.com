import { useState } from 'react'
import { DRUG_CLASSES } from './helpers/everydayData'
import ValueCard from '../../components/ui/ValueCard'

// Drug–receptor interaction visual
function ReceptorDiagram({ drugClass, color }) {
    const shapes = {
        'Analgesics': { receptor: 'Pain receptor', drug: 'Analgesic', blocks: true },
        'Antibiotics': { receptor: 'Bacterial enzyme', drug: 'Antibiotic', blocks: true },
        'Antiseptics': { receptor: 'Cell membrane', drug: 'Antiseptic', blocks: false },
        'Tranquilisers': { receptor: 'GABA-A receptor', drug: 'Tranquiliser', blocks: true },
        'Antacids': { receptor: 'HCl (stomach)', drug: 'Antacid', blocks: false },
        'Antihistamines': { receptor: 'H1 receptor', drug: 'Antihistamine', blocks: true },
    }
    const s = shapes[drugClass] || shapes['Analgesics']

    return (
        <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${color}25`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 12 }}>
                DRUG–RECEPTOR INTERACTION
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                {/* Drug molecule */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 44, height: 32, borderRadius: 8, background: `${color}25`, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color }}>💊</span>
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color }}>Drug</div>
                </div>

                {/* Interaction arrow */}
                <div style={{ fontSize: 20, color }}>→</div>

                {/* Receptor */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50% 50% 0 0',
                        background: 'rgba(160,176,200,0.1)', border: '2px solid rgba(160,176,200,0.4)',
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                        position: 'relative', margin: '0 auto 6px', paddingBottom: 4,
                    }}>
                        {/* Binding site notch */}
                        <div style={{ width: 16, height: 14, background: 'var(--bg)', borderRadius: '4px 4px 0 0', border: '1px solid rgba(160,176,200,0.3)', borderBottom: 'none' }} />
                        {/* Drug fitting into receptor */}
                        <div style={{ position: 'absolute', bottom: -2, left: '50%', transform: 'translateX(-50%)', width: 12, height: 10, borderRadius: 4, background: color, opacity: 0.8 }} />
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(160,176,200,0.7)' }}>{s.receptor}</div>
                </div>

                {/* Effect */}
                <div style={{ fontSize: 20, color }}>→</div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 44, height: 32, borderRadius: 8, background: 'rgba(29,158,117,0.15)', border: '2px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px' }}>
                        <span style={{ fontSize: 14 }}>✓</span>
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)' }}>Effect</div>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                {s.blocks
                    ? `Drug binds to ${s.receptor} → blocks signal → therapeutic effect`
                    : `Drug reacts with ${s.receptor} → neutralises → relief`}
            </div>
        </div>
    )
}

export default function Drugs() {
    const [selClass, setSelClass] = useState('Analgesics')
    const [selSub, setSelSub] = useState(0)
    const [mode, setMode] = useState('classes')   // classes | receptor | quiz

    const dc = DRUG_CLASSES[selClass]
    const sub = dc.subclasses[selSub]

    // Quiz
    const QUIZ = [
        { q: 'Which type of analgesic is highly addictive?', ans: 'Narcotic (opioids)', opts: ['NSAIDs', 'Narcotic (opioids)', 'Antibiotics', 'Antacids'] },
        { q: 'Penicillin kills bacteria by:', ans: 'Disrupting cell wall', opts: ['Disrupting cell wall', 'Blocking DNA replication', 'Neutralising acid', 'Binding opioid receptors'] },
        { q: 'What is the difference between antiseptic and disinfectant?', ans: 'Antiseptic is used on living tissue; disinfectant on surfaces', opts: ['Antiseptic kills fungi; disinfectant kills bacteria', 'Antiseptic is used on living tissue; disinfectant on surfaces', 'Antiseptic is stronger', 'No difference'] },
        { q: 'Which antacid can cause belching?', ans: 'NaHCO₃', opts: ['Mg(OH)₂', 'Al(OH)₃', 'NaHCO₃', 'CaCO₃'] },
        { q: 'Aspirin works by blocking which enzyme?', ans: 'COX enzyme', opts: ['GABA', 'Opioid receptor', 'COX enzyme', 'H1 receptor'] },
    ]
    const [qIdx, setQIdx] = useState(0)
    const [qAnswer, setQAnswer] = useState(null)

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'classes', l: 'Drug classes' }, { k: 'receptor', l: 'Receptor interaction' }, { k: 'quiz', l: 'Quick quiz' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--coral)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* Drug class selector — always visible */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
                {Object.keys(DRUG_CLASSES).map(k => (
                    <button key={k} onClick={() => { setSelClass(k); setSelSub(0) }} style={{
                        padding: '8px 6px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                        background: selClass === k ? `${DRUG_CLASSES[k].color}25` : 'var(--bg3)',
                        border: `2px solid ${selClass === k ? DRUG_CLASSES[k].color : 'var(--border)'}`,
                        transition: 'all 0.15s',
                    }}>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: DRUG_CLASSES[k].color }}>{k}</div>
                    </button>
                ))}
            </div>

            {/* ── CLASSES ── */}
            {mode === 'classes' && (
                <div>
                    {/* Class overview */}
                    <div style={{ padding: '10px 14px', background: `${dc.color}12`, border: `1px solid ${dc.color}35`, borderRadius: 8, marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: dc.color }}>{selClass}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', marginTop: 3 }}>{dc.desc}</div>
                    </div>

                    {/* Subclass tabs */}
                    {dc.subclasses.length > 1 && (
                        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                            {dc.subclasses.map((s, i) => (
                                <button key={i} onClick={() => setSelSub(i)} style={{
                                    flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: selSub === i ? dc.color : 'var(--bg3)',
                                    color: selSub === i ? '#000' : 'var(--text2)',
                                    border: `1px solid ${selSub === i ? dc.color : 'var(--border)'}`,
                                }}>{s.name}</button>
                            ))}
                        </div>
                    )}

                    {/* Subclass detail */}
                    <div style={{ padding: '14px 16px', background: `${dc.color}10`, border: `1px solid ${dc.color}30`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: dc.color, marginBottom: 8 }}>{sub.name}</div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>EXAMPLES</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: dc.color }}>{sub.examples}</div>
                            </div>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>ADDICTIVE?</div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: sub.addictive ? 'var(--coral)' : 'var(--teal)' }}>
                                    {sub.addictive ? '⚠ Yes — habit forming' : '✓ No'}
                                </div>
                            </div>
                        </div>

                        <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, marginBottom: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>MECHANISM OF ACTION</div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{sub.mechanism}</div>
                        </div>

                        <div style={{ padding: '8px 12px', background: 'rgba(216,90,48,0.06)', border: '1px solid rgba(216,90,48,0.15)', borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--coral)', marginBottom: 3 }}>SIDE EFFECTS</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{sub.sideEffect}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── RECEPTOR ── */}
            {mode === 'receptor' && (
                <div>
                    <ReceptorDiagram drugClass={selClass} color={dc.color} />

                    <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            KEY TERMS
                        </div>
                        {[
                            { term: 'Agonist', def: 'Drug that mimics the natural ligand — activates the receptor' },
                            { term: 'Antagonist', def: 'Drug that blocks the receptor — prevents natural ligand from binding' },
                            { term: 'Partial agonist', def: 'Activates receptor but with lower efficacy than full agonist' },
                            { term: 'Receptor', def: 'Specific protein site on cell surface or inside cell that binds drug' },
                            { term: 'Lock-and-key', def: 'Drug (key) fits precisely into receptor (lock) — specificity principle' },
                        ].map(r => (
                            <div key={r.term} style={{ display: 'flex', gap: 10, marginBottom: 6, padding: '6px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: dc.color, minWidth: 100 }}>{r.term}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{r.def}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── QUIZ ── */}
            {mode === 'quiz' && (
                <div>
                    <div style={{ padding: '14px 16px', background: 'rgba(216,90,48,0.1)', border: '2px solid rgba(216,90,48,0.3)', borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 6 }}>
                            Q {qIdx + 1} / {QUIZ.length}
                        </div>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text1)', lineHeight: 1.5 }}>
                            {QUIZ[qIdx].q}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                        {QUIZ[qIdx].opts.map((opt, i) => {
                            const sel = qAnswer === opt
                            const correct = opt === QUIZ[qIdx].ans
                            const show = qAnswer !== null
                            return (
                                <button key={i} onClick={() => qAnswer === null && setQAnswer(opt)} style={{
                                    padding: '10px 14px', borderRadius: 8, textAlign: 'left', cursor: qAnswer === null ? 'pointer' : 'default',
                                    fontFamily: 'var(--mono)', fontSize: 12, fontWeight: sel ? 700 : 400,
                                    background: !show ? 'var(--bg3)' : correct ? 'rgba(29,158,117,0.15)' : sel ? 'rgba(216,90,48,0.12)' : 'var(--bg3)',
                                    color: !show ? 'var(--text2)' : correct ? 'var(--teal)' : sel ? 'var(--coral)' : 'var(--text3)',
                                    border: `2px solid ${!show ? 'var(--border)' : correct ? 'rgba(29,158,117,0.4)' : sel ? 'rgba(216,90,48,0.3)' : 'var(--border)'}`,
                                    transition: 'all 0.15s',
                                }}>
                                    {show && correct ? '✓ ' : show && sel && !correct ? '✗ ' : `${String.fromCharCode(65 + i)}. `}{opt}
                                </button>
                            )
                        })}
                    </div>

                    {qAnswer && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <div style={{ flex: 1, padding: '10px 14px', borderRadius: 8, background: qAnswer === QUIZ[qIdx].ans ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)', border: `1px solid ${qAnswer === QUIZ[qIdx].ans ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`, fontSize: 12, fontFamily: 'var(--mono)', color: qAnswer === QUIZ[qIdx].ans ? 'var(--teal)' : 'var(--coral)' }}>
                                {qAnswer === QUIZ[qIdx].ans ? '✓ Correct!' : '✗ Incorrect — ' + QUIZ[qIdx].ans}
                            </div>
                            <button onClick={() => { setQIdx(p => (p + 1) % QUIZ.length); setQAnswer(null) }} style={{ padding: '10px 16px', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', cursor: 'pointer', background: 'rgba(216,90,48,0.12)', color: 'var(--coral)', border: '1px solid rgba(216,90,48,0.3)' }}>
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Drug class" value={selClass} color={dc.color} highlight />
                <ValueCard label="Type" value={sub.name} color={dc.color} />
                <ValueCard label="Addictive" value={sub.addictive ? 'Yes — controlled' : 'No'} color={sub.addictive ? 'var(--coral)' : 'var(--teal)'} />
                <ValueCard label="Examples" value={sub.examples.split(',')[0].trim()} color={dc.color} />
            </div>
        </div>
    )
}