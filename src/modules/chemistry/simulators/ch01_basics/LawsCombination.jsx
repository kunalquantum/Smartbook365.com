import { useState } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const COMPOUNDS = {
    'Water (H₂O)': { atoms: { H: 2, O: 1 }, masses: { H: 1.008, O: 16.00 } },
    'CO₂': { atoms: { C: 1, O: 2 }, masses: { C: 12.01, O: 16.00 } },
    'Ammonia (NH₃)': { atoms: { N: 1, H: 3 }, masses: { N: 14.01, H: 1.008 } },
    'NaCl': { atoms: { Na: 1, Cl: 1 }, masses: { Na: 22.99, Cl: 35.45 } },
    'Glucose C₆H₁₂O₆': { atoms: { C: 6, H: 12, O: 6 }, masses: { C: 12.01, H: 1.008, O: 16.00 } },
}

const ATOM_COLORS = {
    H: '#A8D8B9', O: '#D85A30', C: '#888780',
    N: '#378ADD', Na: '#EF9F27', Cl: '#1D9E75',
}

export default function LawsCombination() {
    const [compound, setCompound] = useState('Water (H₂O)')
    const [moles, setMoles] = useState(2)
    const [law, setLaw] = useState('conservation')

    const cp = COMPOUNDS[compound]
    const elems = Object.keys(cp.atoms)

    const molMass = elems.reduce((s, el) => s + cp.atoms[el] * cp.masses[el], 0)
    const massSample = elems.reduce((acc, el) => { acc[el] = cp.atoms[el] * cp.masses[el] * moles; return acc }, {})
    const totalMass = Object.values(massSample).reduce((a, b) => a + b, 0)
    const massRatios = elems.reduce((acc, el) => { acc[el] = ((massSample[el] / totalMass) * 100).toFixed(2); return acc }, {})

    // Build flat atom list for molecule display
    const atomList = []
    elems.forEach(el => { for (let i = 0; i < cp.atoms[el]; i++) atomList.push(el) })
    const nAtoms = atomList.length

    return (
        <div>
            {/* Law tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'conservation', l: 'Conservation of Mass' },
                    { k: 'definite', l: 'Definite Proportions' },
                    { k: 'multiple', l: 'Multiple Proportions' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setLaw(opt.k)} style={{
                        padding: '5px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: law === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: law === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${law === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Compound picker */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(COMPOUNDS).map(k => (
                    <button key={k} onClick={() => setCompound(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: compound === k ? 'var(--teal)' : 'var(--bg3)',
                        color: compound === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${compound === k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <ChemSlider label="Moles of compound" unit=" mol" value={moles} min={1} max={10} step={0.5} onChange={setMoles} />

            {/* ── CONSERVATION ── */}
            {law === 'conservation' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 14 }}>
                        ⚗ CONSERVATION OF MASS
                    </div>

                    {/* Balance beam — pure HTML, no SVG coordinate math */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 0, marginBottom: 20, height: 100 }}>
                        {/* Left pan */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160 }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 6 }}>
                                {atomList.map((el, i) => (
                                    <div key={i} style={{
                                        width: 20, height: 20, borderRadius: '50%',
                                        background: `${ATOM_COLORS[el] || '#FAC775'}25`,
                                        border: `1.5px solid ${ATOM_COLORS[el] || '#FAC775'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 8, fontFamily: 'var(--mono)', color: ATOM_COLORS[el] || '#FAC775',
                                    }}>{el}</div>
                                ))}
                            </div>
                            <div style={{ width: 120, height: 8, background: 'rgba(216,90,48,0.3)', borderRadius: 3, border: '1px solid var(--coral)' }} />
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--coral)', marginTop: 6 }}>
                                Reactants: {totalMass.toFixed(3)} g
                            </div>
                        </div>

                        {/* Pivot */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 8px' }}>
                            <div style={{ width: 200, height: 4, background: 'rgba(212,160,23,0.6)', borderRadius: 2 }} />
                            <div style={{ width: 0, height: 0, borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '20px solid rgba(212,160,23,0.5)', marginTop: 0 }} />
                        </div>

                        {/* Right pan */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 160 }}>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 6 }}>
                                {atomList.map((el, i) => (
                                    <div key={i} style={{
                                        width: 20, height: 20, borderRadius: '50%',
                                        background: `${ATOM_COLORS[el] || '#FAC775'}25`,
                                        border: `1.5px solid ${ATOM_COLORS[el] || '#FAC775'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 8, fontFamily: 'var(--mono)', color: ATOM_COLORS[el] || '#FAC775',
                                    }}>{el}</div>
                                ))}
                            </div>
                            <div style={{ width: 120, height: 8, background: 'rgba(29,158,117,0.3)', borderRadius: 3, border: '1px solid var(--teal)' }} />
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)', marginTop: 6 }}>
                                Products: {totalMass.toFixed(3)} g
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 700 }}>
                        ✓ Mass conserved — {totalMass.toFixed(3)} g both sides
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                        Lavoisier's Law: mass of reactants = mass of products always
                    </div>
                </div>
            )}

            {/* ── DEFINITE PROPORTIONS ── */}
            {law === 'definite' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 14 }}>
                        ⚗ DEFINITE PROPORTIONS
                    </div>

                    {/* Stacked proportion bar */}
                    <div style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', height: 40, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border2)' }}>
                            {elems.map(el => (
                                <div key={el} style={{
                                    flex: massSample[el],
                                    background: `${ATOM_COLORS[el] || '#FAC775'}35`,
                                    borderRight: `1px solid ${ATOM_COLORS[el] || '#FAC775'}40`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: ATOM_COLORS[el] || '#FAC775',
                                    minWidth: 30,
                                }}>
                                    {el} {massRatios[el]}%
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Per-element bars */}
                    {elems.map(el => {
                        const col = ATOM_COLORS[el] || '#FAC775'
                        const pct = parseFloat(massRatios[el])
                        return (
                            <div key={el} style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--mono)', marginBottom: 4 }}>
                                    <span style={{ color: col, fontWeight: 700 }}>{el}</span>
                                    <span style={{ color: 'var(--text3)' }}>{massSample[el].toFixed(3)} g  ({massRatios[el]}%)</span>
                                </div>
                                <div style={{ height: 14, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 3, transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(212,160,23,0.08)', borderRadius: 8, border: '1px solid rgba(212,160,23,0.2)', fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                        Sample: {moles} mol × {molMass.toFixed(2)} g/mol = <strong>{totalMass.toFixed(3)} g</strong> — but ratios stay fixed at {elems.map(el => `${el}: ${massRatios[el]}%`).join(', ')}
                    </div>
                </div>
            )}

            {/* ── MULTIPLE PROPORTIONS ── */}
            {law === 'multiple' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 14 }}>
                        ⚗ MULTIPLE PROPORTIONS — Carbon + Oxygen
                    </div>

                    {[
                        { name: 'CO', oMass: 16.00, cMass: 12.01, desc: '1 oxygen per carbon' },
                        { name: 'CO₂', oMass: 32.00, cMass: 12.01, desc: '2 oxygens per carbon' },
                    ].map((cpd, ri) => {
                        const total = cpd.oMass + cpd.cMass
                        const cPct = (cpd.cMass / total) * 100
                        const oPct = (cpd.oMass / total) * 100
                        return (
                            <div key={cpd.name} style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                    <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text1)' }}>{cpd.name}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{cpd.desc}</span>
                                </div>
                                <div style={{ display: 'flex', height: 32, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border2)' }}>
                                    <div style={{
                                        width: `${cPct}%`,
                                        background: 'rgba(136,135,128,0.3)', borderRight: '1px solid #888780',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontFamily: 'var(--mono)', color: '#B4B2A9',
                                    }}>C: {cpd.cMass}</div>
                                    <div style={{
                                        flex: 1,
                                        background: 'rgba(216,90,48,0.3)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--coral)',
                                    }}>O: {cpd.oMass}</div>
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', borderRadius: 8, border: '1px solid rgba(212,160,23,0.2)', fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                        O in CO₂ : O in CO = 32 : 16 = <strong>2 : 1</strong> — a simple whole-number ratio (Dalton's Law)
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {elems.map(el => (
                    <ValueCard key={el} label={`Mass of ${el}`} value={massSample[el].toFixed(3)} unit=" g" color={ATOM_COLORS[el] || 'var(--gold)'} />
                ))}
                <ValueCard label="Total mass" value={totalMass.toFixed(3)} unit=" g" color="var(--gold)" highlight />
            </div>
        </div>
    )
}