import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const ATOM_COLORS = {
    C: '#888780', H: '#A8D8B9', O: '#D85A30', N: '#378ADD',
    S: '#FAC775', Cl: '#1D9E75', Na: '#EF9F27', P: '#D85A30',
}
const ATOM_MASSES = {
    C: 12.011, H: 1.008, O: 15.999, N: 14.007,
    S: 32.06, Cl: 35.45, Na: 22.990, P: 30.974,
}

const PRESETS = [
    { name: 'H₂O', comp: { H: 11.19, O: 88.81 }, M: 18.015 },
    { name: 'CO₂', comp: { C: 27.27, O: 72.73 }, M: 44.01 },
    { name: 'Glucose', comp: { C: 40.00, H: 6.71, O: 53.29 }, M: 180.16 },
    { name: 'Ethanol', comp: { C: 52.14, H: 13.13, O: 34.73 }, M: 46.07 },
    { name: 'Aspirin', comp: { C: 60.00, H: 4.48, O: 35.52 }, M: 180.16 },
    { name: 'Urea', comp: { C: 20.00, H: 6.71, N: 46.67, O: 26.67 }, M: 60.06 },
    { name: 'NaCl', comp: { Na: 39.34, Cl: 60.66 }, M: 58.44 },
]

export default function EmpiricalFormula() {
    const [preset, setPreset] = useState('Glucose')
    const [comp, setComp] = useState({ C: 40.00, H: 6.71, O: 53.29 })
    const [M, setM] = useState(180.16)
    const [step, setStep] = useState(4)

    const loadPreset = name => {
        const p = PRESETS.find(p => p.name === name)
        if (p) { setComp({ ...p.comp }); setM(p.M); setPreset(name); setStep(4) }
    }

    const calc = useMemo(() => {
        const elems = Object.keys(comp).filter(el => comp[el] > 0)
        const moles = elems.reduce((acc, el) => { acc[el] = comp[el] / ATOM_MASSES[el]; return acc }, {})
        const minMol = Math.min(...Object.values(moles))
        const ratios = elems.reduce((acc, el) => { acc[el] = moles[el] / minMol; return acc }, {})
        let mult = 1
        for (let m = 1; m <= 6; m++) {
            if (elems.every(el => Math.abs(ratios[el] * m - Math.round(ratios[el] * m)) < 0.1)) { mult = m; break }
        }
        const ef = elems.reduce((acc, el) => { acc[el] = Math.round(ratios[el] * mult); return acc }, {})
        const efM = elems.reduce((s, el) => s + ATOM_MASSES[el] * ef[el], 0)
        const n = Math.max(1, Math.round(M / efM))
        const mf = elems.reduce((acc, el) => { acc[el] = ef[el] * n; return acc }, {})
        return { elems, moles, minMol, ratios, ef, efM, n, mf }
    }, [comp, M])

    const { elems, moles, minMol, ratios, ef, efM, n, mf } = calc
    const efStr = elems.map(el => `${el}${ef[el] > 1 ? ef[el] : ''}`).join('')
    const mfStr = elems.map(el => `${el}${mf[el] > 1 ? mf[el] : ''}`).join('')
    const sumPct = elems.reduce((s, el) => s + comp[el], 0)

    const STEPS = [
        '% composition → grams (assume 100 g sample)',
        'Grams ÷ atomic mass → moles',
        'Divide all moles by smallest value',
        'Round to whole numbers → Empirical Formula',
        'Molecular Formula = n × Empirical Formula',
    ]

    return (
        <div>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {PRESETS.map(p => (
                    <button key={p.name} onClick={() => loadPreset(p.name)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: preset === p.name ? 'var(--purple)' : 'var(--bg3)',
                        color: preset === p.name ? '#fff' : 'var(--text2)',
                        border: `1px solid ${preset === p.name ? 'var(--purple)' : 'var(--border)'}`,
                    }}>{p.name}</button>
                ))}
            </div>

            {/* Composition inputs */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 10, letterSpacing: 1 }}>
                    % COMPOSITION BY MASS
                    <span style={{ marginLeft: 12, color: Math.abs(sumPct - 100) < 1 ? 'var(--teal)' : 'var(--coral)' }}>
                        (Σ = {sumPct.toFixed(2)}% — {Math.abs(sumPct - 100) < 1 ? 'valid ✓' : 'should sum to 100'})
                    </span>
                </div>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                    {elems.map(el => (
                        <div key={el} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: 6,
                                background: `${ATOM_COLORS[el] || '#FAC775'}20`,
                                border: `1.5px solid ${ATOM_COLORS[el] || '#FAC775'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                color: ATOM_COLORS[el] || '#FAC775', flexShrink: 0,
                            }}>{el}</div>
                            <input type="number" value={comp[el]} step={0.01} min={0} max={100}
                                onChange={e => setComp(p => ({ ...p, [el]: Number(e.target.value) }))}
                                style={{
                                    width: 70, background: 'var(--bg2)', border: `1px solid ${ATOM_COLORS[el] || '#FAC775'}40`,
                                    color: 'var(--text1)', borderRadius: 6, padding: '4px 8px',
                                    fontFamily: 'var(--mono)', fontSize: 12,
                                }} />
                            <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>%</span>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>Molecular mass M:</span>
                    <input type="number" value={M} step={0.01} min={1}
                        onChange={e => setM(Number(e.target.value))}
                        style={{
                            width: 90, background: 'var(--bg2)', border: '1px solid var(--gold)',
                            color: 'var(--text1)', borderRadius: 6, padding: '4px 8px',
                            fontFamily: 'var(--mono)', fontSize: 12,
                        }} />
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>g/mol</span>
                </div>
            </div>

            {/* Step navigator */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                {STEPS.map((_, i) => (
                    <button key={i} onClick={() => setStep(i)} style={{
                        flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer', textAlign: 'center',
                        background: step === i ? 'var(--gold)' : step > i ? 'rgba(212,160,23,0.12)' : 'var(--bg3)',
                        color: step === i ? '#000' : step > i ? 'var(--gold)' : 'var(--text3)',
                        border: `1px solid ${step >= i ? 'rgba(212,160,23,0.4)' : 'var(--border)'}`,
                    }}>S{i + 1}</button>
                ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'var(--mono)', marginBottom: 14, padding: '8px 12px', background: 'rgba(212,160,23,0.08)', borderRadius: 8, border: '1px solid rgba(212,160,23,0.2)' }}>
                Step {step + 1}: {STEPS[step]}
            </div>

            {/* Step table */}
            <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '6px 10px', textAlign: 'left', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>Elem</th>
                            {step >= 0 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>% (g)</th>}
                            {step >= 1 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>÷ At.M</th>}
                            {step >= 1 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--teal)', fontFamily: 'var(--mono)', fontWeight: 400 }}>mol</th>}
                            {step >= 2 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>ratio</th>}
                            {step >= 3 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--gold)', fontFamily: 'var(--mono)', fontWeight: 600 }}>EF</th>}
                            {step >= 4 && <th style={{ padding: '6px 10px', textAlign: 'right', fontSize: 10, color: 'var(--purple)', fontFamily: 'var(--mono)', fontWeight: 600 }}>MF (×{n})</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {elems.map(el => {
                            const col = ATOM_COLORS[el] || '#FAC775'
                            return (
                                <tr key={el} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '7px 10px' }}>
                                        <div style={{
                                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                            width: 26, height: 26, borderRadius: 5,
                                            background: `${col}18`, border: `1.5px solid ${col}`,
                                            fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: col,
                                        }}>{el}</div>
                                    </td>
                                    {step >= 0 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                                            {comp[el].toFixed(2)}
                                        </td>
                                    )}
                                    {step >= 1 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)' }}>
                                            {ATOM_MASSES[el]}
                                        </td>
                                    )}
                                    {step >= 1 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal)', fontWeight: 600 }}>
                                            {moles[el].toFixed(4)}
                                        </td>
                                    )}
                                    {step >= 2 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                                            {ratios[el].toFixed(3)}
                                        </td>
                                    )}
                                    {step >= 3 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--gold)' }}>
                                            {ef[el]}
                                        </td>
                                    )}
                                    {step >= 4 && (
                                        <td style={{ padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: 'var(--purple)' }}>
                                            {mf[el]}
                                        </td>
                                    )}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Divider line */}
            {step >= 2 && (
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, padding: '6px 10px', background: 'var(--bg3)', borderRadius: 6 }}>
                    Smallest mole value: {minMol.toFixed(4)} mol ({elems.find(el => Math.abs(moles[el] - minMol) < 0.001) || ''})
                </div>
            )}

            {/* Formula tiles */}
            {step >= 3 && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                        {step >= 4 ? 'MOLECULAR FORMULA ATOMS' : 'EMPIRICAL FORMULA ATOMS'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {elems.map(el =>
                            Array.from({ length: step >= 4 ? mf[el] : ef[el] }, (_, i) => (
                                <div key={`${el}${i}`} style={{
                                    width: 32, height: 32, borderRadius: 6,
                                    background: `${ATOM_COLORS[el] || '#FAC775'}18`,
                                    border: `1.5px solid ${ATOM_COLORS[el] || '#FAC775'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: ATOM_COLORS[el] || '#FAC775',
                                }}>{el}</div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* n calculation */}
            {step >= 4 && (
                <div style={{ marginBottom: 14, padding: '10px 14px', background: 'rgba(127,119,221,0.08)', borderRadius: 8, border: '1px solid rgba(127,119,221,0.25)', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                    n = M / EF mass = {M} / {efM.toFixed(2)} = <span style={{ color: 'var(--purple)', fontWeight: 700 }}>{n}</span>
                    {' '}→ MF = {n} × ({efStr}) = <span style={{ color: 'var(--purple)', fontWeight: 700 }}>{mfStr}</span>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Empirical Formula" value={efStr} color="var(--gold)" highlight />
                <ValueCard label="EF molar mass" value={`${efM.toFixed(2)} g/mol`} color="var(--text2)" />
                <ValueCard label="n = M / EF" value={`${n}`} color="var(--teal)" />
                <ValueCard label="Molecular Formula" value={mfStr} color="var(--purple)" highlight />
            </div>
        </div>
    )
}