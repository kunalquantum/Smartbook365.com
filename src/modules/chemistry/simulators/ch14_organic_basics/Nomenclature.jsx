import { useState } from 'react'
import { IUPAC_EXAMPLES } from './helpers/organicData'
import ValueCard from '../../components/ui/ValueCard'

const PREFIX = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct', 'non', 'dec']
const CHAIN_COLORS = ['#EF9F27', '#D85A30', '#7F77DD', '#1D9E75', '#378ADD', '#FAC775', '#888780', 'var(--coral)']

// Interactive IUPAC naming rules
const RULES = [
    { num: 1, title: 'Find longest carbon chain', desc: 'Identify the longest continuous chain of carbon atoms. This is the parent chain.' },
    { num: 2, title: 'Identify principal functional group', desc: 'The highest priority functional group determines the suffix and the numbering direction.' },
    { num: 3, title: 'Number the chain', desc: 'Number from the end closest to the principal functional group (or substituent if no FG).' },
    { num: 4, title: 'Name substituents', desc: 'List all substituents alphabetically with their position numbers as prefixes.' },
    { num: 5, title: 'Assemble the name', desc: 'Combine: [substituents + locants]-[parent chain + suffix]. Use di-, tri- for multiples.' },
]

const PRIORITY_ORDER = [
    '-COOH (acids)', '-CHO (aldehydes)', '-C=O (ketones)',
    '-OH (alcohols)', '-NH₂ (amines)', 'C=C (alkenes)', 'C≡C (alkynes)',
]

export default function Nomenclature() {
    const [selEx, setSelEx] = useState(0)
    const [step, setStep] = useState(0)
    const [mode, setMode] = useState('guided')   // guided | rules | builder

    // Builder state
    const [chainLen, setChainLen] = useState(4)
    const [doubleBond, setDoubleBond] = useState(-1)   // position, -1 = none
    const [tripleBond, setTripleBond] = useState(-1)
    const [groups, setGroups] = useState({})         // pos: groupType
    const [fgType, setFgType] = useState('none')

    const ex = IUPAC_EXAMPLES[selEx]

    // Build the IUPAC name from builder state
    const buildName = () => {
        const parent = PREFIX[chainLen] || `C${chainLen}`
        let suffix = 'ane'
        if (doubleBond >= 0) suffix = `${doubleBond > 0 ? '-' + doubleBond + '-' : '-'}ene`
        if (tripleBond >= 0) suffix = `${tripleBond > 0 ? '-' + tripleBond + '-' : '-'}yne`
        if (fgType === 'al') suffix = 'al'
        if (fgType === 'ol') suffix = `-${1}-ol`
        if (fgType === 'one') suffix = `-2-one`
        if (fgType === 'oic') suffix = 'oic acid'

        // Substituents
        const subs = Object.entries(groups).filter(([, v]) => v).map(([pos, v]) => `${pos}-${v}`)
        const subStr = subs.sort().join('-')

        return `${subStr ? subStr + '-' : ''}${parent}${suffix}`
    }

    // Chain builder visual
    const chainAtoms = Array.from({ length: chainLen }, (_, i) => ({
        n: i + 1,
        hasSub: !!groups[i + 1],
        isDouble: doubleBond === i + 1,
        isTriple: tripleBond === i + 1,
        hasFG: fgType !== 'none' && (i + 1 === 1 || (fgType === 'one' && i + 1 === 2)),
    }))

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'guided', l: 'Guided examples' }, { k: 'rules', l: 'IUPAC rules' }, { k: 'builder', l: 'Name builder' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── GUIDED EXAMPLES ── */}
            {mode === 'guided' && (
                <div>
                    {/* Example selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {IUPAC_EXAMPLES.map((e, i) => (
                            <button key={i} onClick={() => { setSelEx(i); setStep(0) }} style={{
                                flex: 1, padding: '6px 4px', borderRadius: 8, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selEx === i ? e.color : 'var(--bg3)',
                                color: selEx === i ? '#fff' : 'var(--text2)',
                                border: `1px solid ${selEx === i ? e.color : 'var(--border)'}`,
                            }}>{e.name}</button>
                        ))}
                    </div>

                    {/* Formula */}
                    <div style={{ padding: '10px 16px', background: `${ex.color}10`, border: `2px solid ${ex.color}40`, borderRadius: 10, marginBottom: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: ex.color }}>{ex.name}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>{ex.formula}</div>
                    </div>

                    {/* Step navigator */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {ex.steps.map((_, i) => (
                            <button key={i} onClick={() => setStep(i)} style={{
                                flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: step === i ? ex.color : step > i ? `${ex.color}25` : 'var(--bg3)',
                                color: step === i ? '#fff' : step > i ? ex.color : 'var(--text3)',
                                border: `1px solid ${step >= i ? ex.color + '60' : 'var(--border)'}`,
                            }}>S{i + 1}</button>
                        ))}
                    </div>

                    {/* Steps revealed progressively */}
                    {ex.steps.slice(0, step + 1).map((s, i) => (
                        <div key={i} style={{
                            padding: '10px 14px', marginBottom: 8,
                            background: i === step ? `${ex.color}12` : 'var(--bg3)',
                            border: `1px solid ${i === step ? ex.color + '40' : 'var(--border)'}`,
                            borderRadius: 8, transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: ex.color, letterSpacing: 1.5, marginBottom: 4 }}>STEP {i + 1}</div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)' }}>{s}</div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
                            opacity: step === 0 ? 0.4 : 1,
                        }}>← Prev</button>
                        <button onClick={() => setStep(p => Math.min(ex.steps.length - 1, p + 1))} disabled={step === ex.steps.length - 1} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: `${ex.color}15`, color: ex.color, border: `1px solid ${ex.color}40`,
                            opacity: step === ex.steps.length - 1 ? 0.4 : 1,
                        }}>Next →</button>
                    </div>
                </div>
            )}

            {/* ── IUPAC RULES ── */}
            {mode === 'rules' && (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {RULES.map(r => (
                            <div key={r.num} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: 12 }}>
                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(29,158,117,0.2)', border: '1.5px solid var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', flexShrink: 0 }}>
                                    {r.num}
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', marginBottom: 3 }}>{r.title}</div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{r.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Priority order */}
                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 8 }}>
                            PRINCIPAL GROUP PRIORITY (highest to lowest)
                        </div>
                        {PRIORITY_ORDER.map((p, i) => (
                            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(212,160,23,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── NAME BUILDER ── */}
            {mode === 'builder' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Build a molecule and watch the IUPAC name form automatically.
                    </div>

                    {/* Chain length */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                            CHAIN LENGTH — {chainLen} carbons ({PREFIX[chainLen]}-)
                        </div>
                        <div style={{ display: 'flex', gap: 5 }}>
                            {[2, 3, 4, 5, 6].map(n => (
                                <button key={n} onClick={() => { setChainLen(n); setDoubleBond(-1); setTripleBond(-1); setGroups({}); setFgType('none') }} style={{
                                    flex: 1, padding: '7px', borderRadius: 6, fontSize: 12,
                                    fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                    background: chainLen === n ? 'var(--purple)' : 'var(--bg3)',
                                    color: chainLen === n ? '#fff' : 'var(--text2)',
                                    border: `1px solid ${chainLen === n ? 'var(--purple)' : 'var(--border)'}`,
                                }}>{n}C</button>
                            ))}
                        </div>
                    </div>

                    {/* Chain visual */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10 }}>CARBON CHAIN — click bonds to add double/triple:</div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'nowrap', overflowX: 'auto' }}>
                            {chainAtoms.map((atom, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {/* Carbon atom */}
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                        background: atom.hasFG ? 'rgba(212,160,23,0.25)' : atom.hasSub ? 'rgba(29,158,117,0.2)' : 'rgba(127,119,221,0.15)',
                                        border: `2px solid ${atom.hasFG ? 'var(--gold)' : atom.hasSub ? 'var(--teal)' : 'var(--purple)'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)' }}>C</span>
                                        <span style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{atom.n}</span>
                                    </div>
                                    {/* Bond between atoms */}
                                    {i < chainLen - 1 && (
                                        <button onClick={() => {
                                            if (doubleBond === i + 1) setDoubleBond(-1)
                                            else if (tripleBond === i + 1) { setTripleBond(-1) }
                                            else if (doubleBond === -1) setDoubleBond(i + 1)
                                            else setTripleBond(i + 1)
                                        }} style={{
                                            width: 20, height: 20, borderRadius: 4,
                                            background: doubleBond === i + 1 ? 'rgba(29,158,117,0.2)' : tripleBond === i + 1 ? 'rgba(239,159,39,0.2)' : 'rgba(0,0,0,0.2)',
                                            border: `1px solid ${doubleBond === i + 1 ? 'var(--teal)' : tripleBond === i + 1 ? 'var(--gold)' : 'var(--border)'}`,
                                            cursor: 'pointer', flexShrink: 0, padding: 0,
                                            fontSize: 10, color: doubleBond === i + 1 ? 'var(--teal)' : tripleBond === i + 1 ? 'var(--gold)' : 'var(--text3)',
                                            fontFamily: 'var(--mono)', fontWeight: 700,
                                        }}>
                                            {doubleBond === i + 1 ? '=' : tripleBond === i + 1 ? '≡' : '−'}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Functional group */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>TERMINAL FUNCTIONAL GROUP</div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                            {[{ k: 'none', l: 'None (alkane/ene/yne)' }, { k: 'ol', l: '-OH (alcohol)' }, { k: 'al', l: '-CHO (aldehyde)' }, { k: 'oic', l: '-COOH (acid)' }, { k: 'one', l: 'C=O (ketone)' }].map(opt => (
                                <button key={opt.k} onClick={() => setFgType(opt.k)} style={{
                                    padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: fgType === opt.k ? 'var(--gold)' : 'var(--bg3)',
                                    color: fgType === opt.k ? '#000' : 'var(--text2)',
                                    border: `1px solid ${fgType === opt.k ? 'var(--gold)' : 'var(--border)'}`,
                                }}>{opt.l}</button>
                            ))}
                        </div>
                    </div>

                    {/* Generated name */}
                    <div style={{ padding: '16px 20px', background: 'rgba(127,119,221,0.12)', border: '2px solid rgba(127,119,221,0.4)', borderRadius: 12, textAlign: 'center' }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2, marginBottom: 6 }}>
                            IUPAC NAME
                        </div>
                        <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)' }}>
                            {buildName()}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Example" value={ex.name} color={ex.color} highlight />
                <ValueCard label="Formula" value={ex.formula.split('→')[0].trim()} color="var(--gold)" />
            </div>
        </div>
    )
}