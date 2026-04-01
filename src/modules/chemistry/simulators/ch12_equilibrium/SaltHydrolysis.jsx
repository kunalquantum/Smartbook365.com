import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'
import ChemSlider from '../../components/ui/ChemSlider'

const Kw = 1e-14

const SALTS = {
    'CH₃COONa (sodium acetate)': {
        type: 'weak acid + strong base',
        color: 'var(--teal)',
        Ka: 1.8e-5, Kb: null,
        hydrolysis: 'CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻',
        ion: 'CH₃COO⁻',
        nature: 'basic',
        Kh_formula: 'Kh = Kw/Ka',
        desc: 'Anion of weak acid hydrolyses to give basic solution. The cation Na⁺ does not hydrolyse.',
    },
    'NH₄Cl (ammonium chloride)': {
        type: 'strong acid + weak base',
        color: 'var(--purple)',
        Ka: null, Kb: 1.8e-5,
        hydrolysis: 'NH₄⁺ + H₂O ⇌ NH₃ + H₃O⁺',
        ion: 'NH₄⁺',
        nature: 'acidic',
        Kh_formula: 'Kh = Kw/Kb',
        desc: 'Cation of weak base hydrolyses to give acidic solution. The anion Cl⁻ does not hydrolyse.',
    },
    'CH₃COONH₄ (ammonium acetate)': {
        type: 'weak acid + weak base',
        color: 'var(--gold)',
        Ka: 1.8e-5, Kb: 1.8e-5,
        hydrolysis: 'Both CH₃COO⁻ and NH₄⁺ hydrolyse',
        ion: 'CH₃COO⁻ and NH₄⁺',
        nature: 'neutral',
        Kh_formula: 'pH = 7 + ½(pKa − pKb)',
        desc: 'Both ions hydrolyse. When Ka = Kb, solution is neutral (pH ≈ 7).',
    },
    'NaCl (sodium chloride)': {
        type: 'strong acid + strong base',
        color: '#888780',
        Ka: null, Kb: null,
        hydrolysis: 'No hydrolysis — neither ion hydrolyses',
        ion: 'Na⁺ and Cl⁻',
        nature: 'neutral',
        Kh_formula: 'pH = 7 always',
        desc: 'Salts of strong acids and strong bases do not undergo hydrolysis. Solution is always neutral.',
    },
    'AlCl₃ (aluminium chloride)': {
        type: 'strong acid + weak base (Al³⁺)',
        color: 'var(--coral)',
        Ka: null, Kb: 1e-9,
        hydrolysis: 'Al³⁺ + 3H₂O ⇌ Al(OH)₃ + 3H⁺',
        ion: 'Al³⁺',
        nature: 'acidic',
        Kh_formula: 'Kh = Kw/Kb',
        desc: 'Highly charged Al³⁺ undergoes extensive hydrolysis — solution is quite acidic.',
    },
}

function pHtoColor(pH) {
    if (pH < 5) return 'var(--coral)'
    if (pH < 6.5) return 'var(--gold)'
    if (pH < 7.5) return 'var(--teal)'
    if (pH < 9) return '#378ADD'
    return 'var(--purple)'
}

function calcPH(salt, C) {
    const s = SALTS[salt]
    if (s.nature === 'neutral') return 7
    if (s.type.includes('weak acid + strong base')) {
        const Kh = Kw / s.Ka
        const OH = Math.sqrt(Kh * C)
        return 14 + Math.log10(OH)
    }
    if (s.type.includes('strong acid + weak base')) {
        const Kh = Kw / s.Kb
        const H = Math.sqrt(Kh * C)
        return -Math.log10(H)
    }
    if (s.type === 'weak acid + weak base') {
        const pKa = -Math.log10(s.Ka)
        const pKb = -Math.log10(s.Kb)
        return 7 + 0.5 * (pKa - pKb)
    }
    return 7
}

export default function SaltHydrolysis() {
    const [sel, setSel] = useState('CH₃COONa (sodium acetate)')
    const [C, setC] = useState(0.1)

    const s = SALTS[sel]
    const pH = calcPH(sel, C)
    const Kh = s.nature === 'neutral' ? 0 :
        s.type.includes('weak acid + strong base') ? Kw / s.Ka :
            s.type.includes('strong acid + weak base') ? Kw / s.Kb : 0

    const degHydrolysis = Kh > 0 ? Math.sqrt(Kh / C) * 100 : 0

    const pHBar = Array.from({ length: 14 }, (_, i) => {
        const cols = ['#D85A30', '#D85A30', '#EF9F27', '#EF9F27', '#FAC775', '#A8D8B9', '#A8D8B9', '#E8F5EF', '#A8D8B9', '#378ADD', '#378ADD', '#7F77DD', '#7F77DD', '#7F77DD']
        return cols[i]
    })

    // Comparison: pH of all salts at current C
    const allPH = Object.keys(SALTS).map(k => ({ k, pH: calcPH(k, C), col: SALTS[k].color }))

    return (
        <div>
            {/* Salt selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(SALTS).map(k => (
                    <button key={k} onClick={() => setSel(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: sel === k ? SALTS[k].color : 'var(--bg3)',
                        color: sel === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${sel === k ? SALTS[k].color : 'var(--border)'}`,
                    }}>{k.split(' ')[0]}</button>
                ))}
            </div>

            {/* Salt type badge */}
            <div style={{ padding: '10px 14px', background: `${s.color === 'var(--teal)' ? 'rgba(29,158,117' : s.color === 'var(--purple)' ? 'rgba(127,119,221' : s.color === 'var(--gold)' ? 'rgba(212,160,23' : s.color === 'var(--coral)' ? 'rgba(216,90,48' : 'rgba(136,135,128'}.08)`, border: `1px solid ${s.color}25`, borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: s.color }}>{sel.split(' ')[0]}</span>
                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', padding: '2px 10px', borderRadius: 20, background: `${s.color}25`, color: s.color, border: `1px solid ${s.color}50` }}>
                        {s.type}
                    </span>
                    <span style={{
                        fontSize: 11, fontFamily: 'var(--mono)', padding: '2px 10px', borderRadius: 20, fontWeight: 700,
                        background: s.nature === 'acidic' ? 'rgba(216,90,48,0.15)' : s.nature === 'basic' ? 'rgba(29,158,117,0.15)' : 'rgba(160,176,200,0.1)',
                        color: s.nature === 'acidic' ? 'var(--coral)' : s.nature === 'basic' ? 'var(--teal)' : 'var(--text3)',
                        border: `1px solid ${s.nature === 'acidic' ? 'rgba(216,90,48,0.3)' : s.nature === 'basic' ? 'rgba(29,158,117,0.3)' : 'rgba(160,176,200,0.2)'}`,
                    }}>
                        {s.nature} solution
                    </span>
                </div>
                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{s.desc}</div>
            </div>

            <ChemSlider label="Salt concentration C" unit=" M" value={C} min={0.001} max={1} step={0.001} onChange={setC} color={s.color} precision={3} />

            {/* pH meter */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5 }}>pH METER</span>
                    <span style={{ fontSize: 26, fontFamily: 'var(--mono)', fontWeight: 700, color: pHtoColor(pH) }}>
                        pH = {pH.toFixed(3)}
                    </span>
                </div>
                <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
                    {pHBar.map((col, i) => (
                        <div key={i} style={{ flex: 1, background: col, opacity: 0.5 }} />
                    ))}
                </div>
                <div style={{ position: 'relative', height: 8 }}>
                    <div style={{
                        position: 'absolute', left: `${(pH / 14) * 100}%`, transform: 'translateX(-50%)',
                        width: 14, height: 14, borderRadius: '50%',
                        background: pHtoColor(pH), border: '2px solid rgba(255,255,255,0.6)',
                        top: -3, transition: 'left 0.3s',
                    }} />
                </div>
            </div>

            {/* Hydrolysis equation + Kh */}
            <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.9 }}>
                <div style={{ fontWeight: 700, color: s.color, marginBottom: 6 }}>Hydrolysis equation:</div>
                <div style={{ fontSize: 13, color: 'var(--text1)', marginBottom: 8 }}>{s.hydrolysis}</div>
                {Kh > 0 && (
                    <div style={{ color: 'var(--text2)' }}>
                        {s.Kh_formula}
                        {s.type.includes('weak acid + strong base') && ` = ${Kw} / ${s.Ka.toExponential(2)}`}
                        {s.type.includes('strong acid + weak base') && ` = ${Kw} / ${s.Kb?.toExponential(2)}`}
                        {Kh > 0 && ` = ${Kh.toExponential(3)}`}
                        <br />Degree of hydrolysis h = √(Kh/C) = <span style={{ color: s.color, fontWeight: 700 }}>{degHydrolysis.toFixed(3)}%</span>
                    </div>
                )}
            </div>

            {/* All salts pH comparison at current C */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    pH COMPARISON — ALL SALTS AT C = {C.toFixed(3)} M
                </div>
                {allPH.map(row => (
                    <div key={row.k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                        onClick={() => setSel(row.k)}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', minWidth: 50, color: row.k === sel ? SALTS[row.k].color : 'var(--text3)' }}>
                            {row.k.split(' ')[0]}
                        </span>
                        <div style={{ position: 'relative', flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                            {/* Neutral marker at 7 */}
                            <div style={{ position: 'absolute', left: `${7 / 14 * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                            <div style={{ height: '100%', width: `${(row.pH / 14) * 100}%`, background: row.k === sel ? pHtoColor(row.pH) : `${pHtoColor(row.pH)}60`, borderRadius: 7, transition: 'width 0.3s' }} />
                        </div>
                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: row.k === sel ? 700 : 400, color: pHtoColor(row.pH), minWidth: 40 }}>
                            {row.pH.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Salt" value={sel.split(' ')[0]} color={s.color} highlight />
                <ValueCard label="pH" value={pH.toFixed(3)} color={pHtoColor(pH)} />
                <ValueCard label="Nature" value={s.nature} color={s.nature === 'acidic' ? 'var(--coral)' : s.nature === 'basic' ? 'var(--teal)' : 'var(--text3)'} />
                {Kh > 0 && <ValueCard label="Kh" value={Kh.toExponential(3)} color="var(--gold)" />}
            </div>
        </div>
    )
}