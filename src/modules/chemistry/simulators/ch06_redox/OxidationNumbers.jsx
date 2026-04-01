import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const COMPOUNDS = {
    // Formula: array of {sym, count, ON (null = to calculate)}
    'H₂O': { atoms: [{ sym: 'H', n: 2, ON: +1 }, { sym: 'O', n: 1, ON: -2 }], charge: 0 },
    'CO₂': { atoms: [{ sym: 'C', n: 1, ON: null }, { sym: 'O', n: 2, ON: -2 }], charge: 0, known: 'C' },
    'H₂SO₄': { atoms: [{ sym: 'H', n: 2, ON: +1 }, { sym: 'S', n: 1, ON: null }, { sym: 'O', n: 4, ON: -2 }], charge: 0, known: 'S' },
    'KMnO₄': { atoms: [{ sym: 'K', n: 1, ON: +1 }, { sym: 'Mn', n: 1, ON: null }, { sym: 'O', n: 4, ON: -2 }], charge: 0, known: 'Mn' },
    'K₂Cr₂O₇': { atoms: [{ sym: 'K', n: 2, ON: +1 }, { sym: 'Cr', n: 2, ON: null }, { sym: 'O', n: 7, ON: -2 }], charge: 0, known: 'Cr' },
    'NO₃⁻': { atoms: [{ sym: 'N', n: 1, ON: null }, { sym: 'O', n: 3, ON: -2 }], charge: -1, known: 'N' },
    'SO₄²⁻': { atoms: [{ sym: 'S', n: 1, ON: null }, { sym: 'O', n: 4, ON: -2 }], charge: -2, known: 'S' },
    'NH₃': { atoms: [{ sym: 'N', n: 1, ON: null }, { sym: 'H', n: 3, ON: +1 }], charge: 0, known: 'N' },
    'Fe₃O₄': { atoms: [{ sym: 'Fe', n: 3, ON: null }, { sym: 'O', n: 4, ON: -2 }], charge: 0, known: 'Fe', mixed: true },
    'Na₂O₂': { atoms: [{ sym: 'Na', n: 2, ON: +1 }, { sym: 'O', n: 2, ON: -1 }], charge: 0 },
    'HNO₃': { atoms: [{ sym: 'H', n: 1, ON: +1 }, { sym: 'N', n: 1, ON: null }, { sym: 'O', n: 3, ON: -2 }], charge: 0, known: 'N' },
    'Cr₂O₃': { atoms: [{ sym: 'Cr', n: 2, ON: null }, { sym: 'O', n: 3, ON: -2 }], charge: 0, known: 'Cr' },
}

const ELEMENT_COLORS = {
    H: '#A8D8B9', O: '#D85A30', C: '#888780', N: '#378ADD',
    S: '#FAC775', K: '#EF9F27', Mn: '#7F77DD', Cr: '#D85A30',
    Na: '#EF9F27', Fe: '#D85A30', Cl: '#1D9E75', Ca: '#EF9F27',
}

const RULES = [
    { id: 'elem', text: 'Free element = 0', example: 'Na(s), O₂, Cl₂ → ON = 0' },
    { id: 'mono', text: 'Monatomic ion = its charge', example: 'Na⁺ → +1, Cl⁻ → −1, Ca²⁺ → +2' },
    { id: 'O', text: 'O = −2 (except peroxides −1, OF₂ +2)', example: 'H₂O → O is −2' },
    { id: 'H', text: 'H = +1 (except metal hydrides −1)', example: 'HCl → H is +1, NaH → H is −1' },
    { id: 'F', text: 'F = −1 always (most electronegative)', example: 'HF → F is −1' },
    { id: 'sum', text: 'Sum of ON = 0 (neutral) or = ionic charge', example: 'H₂O: 2(+1) + (−2) = 0 ✓' },
]

export default function OxidationNumbers() {
    const [compound, setCompound] = useState('KMnO₄')
    const [step, setStep] = useState(3)
    const [custom, setCustom] = useState(false)

    const cp = COMPOUNDS[compound]

    // Calculate unknown ON
    const calc = () => {
        const knownSum = cp.atoms
            .filter(a => a.ON !== null)
            .reduce((s, a) => s + a.ON * a.n, 0)
        const unknownAtom = cp.atoms.find(a => a.ON === null)
        if (!unknownAtom) return {}
        const unknownON = (cp.charge - knownSum) / unknownAtom.n
        return { atom: unknownAtom.sym, ON: unknownON, knownSum }
    }

    const result = calc()

    // Build step-by-step solution
    const steps = [
        {
            title: 'Write the formula and identify all elements',
            content: cp.atoms.map(a => `${a.n > 1 ? a.n : ''}${a.sym}`).join(' + '),
            detail: `Total charge = ${cp.charge >= 0 ? '+' : ''}${cp.charge}`,
        },
        {
            title: 'Apply ON rules for known elements',
            content: cp.atoms.filter(a => a.ON !== null).map(a =>
                `${a.sym}: ON = ${a.ON >= 0 ? '+' : ''}${a.ON} (rule: ${a.sym === 'O' ? 'O = −2' :
                    a.sym === 'H' ? 'H = +1' :
                        a.sym === 'F' ? 'F = −1' :
                            a.sym === 'K' || a.sym === 'Na' ? 'alkali metal = +1' : 'given'
                })`
            ).join('\n'),
            detail: '',
        },
        {
            title: 'Set up the equation: Σ(ON × n) = charge',
            content: cp.atoms.map(a =>
                a.ON !== null
                    ? `${a.n}(${a.ON >= 0 ? '+' : ''}${a.ON})`
                    : `${a.n}(x)`
            ).join(' + ') + ` = ${cp.charge >= 0 ? '+' : ''}${cp.charge}`,
            detail: result.knownSum !== undefined
                ? `Known part: ${result.knownSum >= 0 ? '+' : ''}${result.knownSum}`
                : '',
        },
        {
            title: `Solve for unknown ON`,
            content: result.atom
                ? `x = (${cp.charge >= 0 ? '+' : ''}${cp.charge} − ${result.knownSum >= 0 ? '+' : ''}${result.knownSum}) ÷ ${cp.atoms.find(a => a.ON === null)?.n || 1}\n= ${result.ON >= 0 ? '+' : ''}${result.ON}`
                : 'All oxidation numbers are known from rules.',
            detail: result.atom ? `${result.atom} has ON = ${result.ON >= 0 ? '+' : ''}${result.ON}` : '',
        },
    ]

    const allAtoms = cp.atoms.map(a => ({
        ...a,
        resolvedON: a.ON !== null ? a.ON : (result.ON ?? '?'),
    }))

    const sumCheck = allAtoms.reduce((s, a) => s + (a.resolvedON !== '?' ? a.resolvedON * a.n : 0), 0)

    return (
        <div>
            {/* Compound selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(COMPOUNDS).map(k => (
                    <button key={k} onClick={() => { setCompound(k); setStep(3) }} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: compound === k ? 'var(--purple)' : 'var(--bg3)',
                        color: compound === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${compound === k ? 'var(--purple)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* Visual formula with ON labels */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2, marginBottom: 14 }}>
                        ⚗ OXIDATION NUMBER DISPLAY
                    </div>

                    {/* Formula visual */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 24 }}>
                        {allAtoms.map((a, i) => {
                            const col = ELEMENT_COLORS[a.sym] || '#FAC775'
                            const on = a.resolvedON
                            const onStr = on === '?' ? '?' : `${on >= 0 ? '+' : ''}${on}`
                            return (
                                <div key={i} style={{ textAlign: 'center', margin: '0 4px' }}>
                                    {/* ON above */}
                                    <div style={{
                                        fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700,
                                        color: step >= 3 ? (on === '?' ? 'var(--text3)' : col) : 'transparent',
                                        marginBottom: 2, minHeight: 18,
                                    }}>
                                        {step >= 3 ? onStr : ' '}
                                    </div>
                                    {/* Atom tile */}
                                    {Array.from({ length: Math.min(a.n, 4) }, (_, ni) => (
                                        <div key={ni} style={{
                                            display: 'inline-block',
                                            width: 38, height: 38, borderRadius: 8, margin: '0 2px',
                                            background: `${col}18`,
                                            border: `2px solid ${col}`,
                                            textAlign: 'center', lineHeight: '38px',
                                            fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: col,
                                        }}>
                                            {a.sym}
                                        </div>
                                    ))}
                                    {a.n > 4 && (
                                        <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginLeft: 2 }}>×{a.n}</span>
                                    )}
                                    {/* Count below */}
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                        ×{a.n}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Charge indicator */}
                    <div style={{ textAlign: 'center', marginBottom: 12 }}>
                        <span style={{
                            fontSize: 12, fontFamily: 'var(--mono)',
                            color: cp.charge === 0 ? 'var(--teal)' : 'var(--gold)',
                            background: cp.charge === 0 ? 'rgba(29,158,117,0.1)' : 'rgba(212,160,23,0.1)',
                            border: `1px solid ${cp.charge === 0 ? 'rgba(29,158,117,0.3)' : 'rgba(212,160,23,0.3)'}`,
                            padding: '4px 14px', borderRadius: 20,
                        }}>
                            {compound}: overall charge = {cp.charge >= 0 ? '+' : ''}{cp.charge}
                        </span>
                    </div>

                    {/* Sum check */}
                    {step >= 3 && (
                        <div style={{
                            textAlign: 'center', padding: '8px 14px',
                            background: Math.abs(sumCheck - cp.charge) < 0.1 ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)',
                            border: `1px solid ${Math.abs(sumCheck - cp.charge) < 0.1 ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                            borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)',
                            color: Math.abs(sumCheck - cp.charge) < 0.1 ? 'var(--teal)' : 'var(--coral)',
                        }}>
                            Σ ON = {sumCheck >= 0 ? '+' : ''}{sumCheck.toFixed(0)} {Math.abs(sumCheck - cp.charge) < 0.1 ? '= charge ✓' : '≠ charge ✗'}
                        </div>
                    )}
                </div>

                {/* Step-by-step solution */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1, marginBottom: 4 }}>
                        STEP-BY-STEP SOLUTION
                    </div>

                    {/* Step navigator */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setStep(i)} style={{
                                flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: step === i ? 'var(--purple)' : step > i ? 'rgba(127,119,221,0.15)' : 'var(--bg3)',
                                color: step === i ? '#fff' : step > i ? 'var(--purple)' : 'var(--text3)',
                                border: `1px solid ${step >= i ? 'rgba(127,119,221,0.4)' : 'var(--border)'}`,
                            }}>S{i + 1}</button>
                        ))}
                    </div>

                    {/* Steps */}
                    {steps.slice(0, step + 1).map((s, i) => (
                        <div key={i} style={{
                            padding: '10px 14px',
                            background: i === step ? 'rgba(127,119,221,0.1)' : 'var(--bg3)',
                            border: `1px solid ${i === step ? 'rgba(127,119,221,0.4)' : 'var(--border)'}`,
                            borderRadius: 8,
                        }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', marginBottom: 4, fontWeight: 700 }}>
                                Step {i + 1}: {s.title}
                            </div>
                            <pre style={{
                                fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)',
                                margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7,
                            }}>{s.content}</pre>
                            {s.detail && (
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)', marginTop: 4 }}>
                                    → {s.detail}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ON Rules reference */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    OXIDATION NUMBER RULES
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {RULES.map(r => (
                        <div key={r.id} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)', marginBottom: 2 }}>{r.text}</div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.example}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Compound" value={compound} color="var(--purple)" highlight />
                {result.atom && (
                    <ValueCard label={`ON of ${result.atom}`} value={`${result.ON >= 0 ? '+' : ''}${result.ON}`} color="var(--gold)" highlight />
                )}
                <ValueCard label="Charge" value={`${cp.charge >= 0 ? '+' : ''}${cp.charge}`} color="var(--teal)" />
                <ValueCard label="Σ ON check" value={`${sumCheck >= 0 ? '+' : ''}${sumCheck.toFixed(0)} = charge ${Math.abs(sumCheck - cp.charge) < 0.1 ? '✓' : '✗'}`} color={Math.abs(sumCheck - cp.charge) < 0.1 ? 'var(--teal)' : 'var(--coral)'} />
            </div>
        </div>
    )
}