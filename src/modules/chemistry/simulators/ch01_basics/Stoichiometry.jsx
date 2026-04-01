import { useState } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = [
    {
        name: 'H₂ + O₂ → H₂O', eq: '2H₂  +  O₂  →  2H₂O',
        reactants: [{ f: 'H₂', c: 2, M: 2.016, col: '#A8D8B9' }, { f: 'O₂', c: 1, M: 32.00, col: '#D85A30' }],
        products: [{ f: 'H₂O', c: 2, M: 18.015, col: '#378ADD' }],
    },
    {
        name: 'N₂ + H₂ → NH₃ (Haber)', eq: 'N₂  +  3H₂  →  2NH₃',
        reactants: [{ f: 'N₂', c: 1, M: 28.014, col: '#378ADD' }, { f: 'H₂', c: 3, M: 2.016, col: '#A8D8B9' }],
        products: [{ f: 'NH₃', c: 2, M: 17.031, col: '#1D9E75' }],
    },
    {
        name: 'CaCO₃ → CaO + CO₂', eq: 'CaCO₃  →  CaO  +  CO₂',
        reactants: [{ f: 'CaCO₃', c: 1, M: 100.09, col: '#888780' }],
        products: [{ f: 'CaO', c: 1, M: 56.077, col: '#EF9F27' }, { f: 'CO₂', c: 1, M: 44.01, col: '#D85A30' }],
    },
    {
        name: 'CH₄ + O₂ combustion', eq: 'CH₄  +  2O₂  →  CO₂  +  2H₂O',
        reactants: [{ f: 'CH₄', c: 1, M: 16.043, col: '#888780' }, { f: 'O₂', c: 2, M: 32.00, col: '#D85A30' }],
        products: [{ f: 'CO₂', c: 1, M: 44.01, col: '#D85A30' }, { f: 'H₂O', c: 2, M: 18.015, col: '#378ADD' }],
    },
]

export default function Stoichiometry() {
    const [rxnIdx, setRxnIdx] = useState(0)
    const [limitIdx, setLimitIdx] = useState(0)
    const [molesIn, setMolesIn] = useState(2)
    const [yieldPct, setYieldPct] = useState(85)

    const rxn = REACTIONS[rxnIdx]
    const limRct = rxn.reactants[limitIdx]
    const scaleF = molesIn / limRct.c

    const reactantRows = rxn.reactants.map(r => ({
        ...r, moles: r.c * scaleF, mass: r.c * scaleF * r.M,
    }))
    const productRows = rxn.products.map(p => ({
        ...p,
        molesT: p.c * scaleF,
        massT: p.c * scaleF * p.M,
        molesA: p.c * scaleF * (yieldPct / 100),
        massA: p.c * scaleF * p.M * (yieldPct / 100),
    }))

    const totalRMass = reactantRows.reduce((s, r) => s + r.mass, 0)
    const totalPMass = productRows.reduce((s, p) => s + p.massT, 0)

    // Bar chart — pure HTML bars avoid SVG coordinate headaches
    const allBars = [
        ...reactantRows.map(r => ({ label: r.f, mass: r.mass, col: r.col, side: 'R', moles: r.moles })),
        ...productRows.map(p => ({ label: p.f, mass: p.massA, massT: p.massT, col: p.col, side: 'P', moles: p.molesA })),
    ]
    const maxMass = Math.max(...allBars.map(b => b.massT || b.mass), 1)

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {REACTIONS.map((r, i) => (
                    <button key={i} onClick={() => { setRxnIdx(i); setLimitIdx(0) }} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxnIdx === i ? 'var(--coral)' : 'var(--bg3)',
                        color: rxnIdx === i ? '#fff' : 'var(--text2)',
                        border: `1px solid ${rxnIdx === i ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{r.name}</button>
                ))}
            </div>

            {/* Balanced equation */}
            <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10,
                padding: '10px 16px', marginBottom: 14,
                fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--gold2)',
                textAlign: 'center', letterSpacing: 1,
            }}>{rxn.eq}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <ChemSlider label="Moles of limiting reagent" unit=" mol"
                    value={molesIn} min={0.5} max={20} step={0.5} onChange={setMolesIn} />
                <ChemSlider label="% Yield" unit="%" value={yieldPct} min={10} max={100} step={1}
                    onChange={setYieldPct} color="var(--teal)" />
            </div>

            {/* Limiting reagent picker */}
            {rxn.reactants.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Limiting:</span>
                    {rxn.reactants.map((r, i) => (
                        <button key={i} onClick={() => setLimitIdx(i)} style={{
                            padding: '4px 12px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: limitIdx === i ? `${r.col}30` : 'var(--bg3)',
                            color: limitIdx === i ? r.col : 'var(--text2)',
                            border: `1px solid ${limitIdx === i ? r.col : 'var(--border)'}`,
                        }}>{r.f}</button>
                    ))}
                </div>
            )}

            {/* Bar chart — HTML-based, clean alignment */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 16px 0', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, marginBottom: 8 }}>
                    {/* Reactants */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flex: 1 }}>
                        {reactantRows.map((r, i) => {
                            const barH = Math.max(8, (r.mass / maxMass) * 130)
                            const isLim = i === limitIdx
                            return (
                                <div key={r.f} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    {isLim && (
                                        <div style={{
                                            fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--coral)',
                                            background: 'rgba(216,90,48,0.15)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap'
                                        }}>
                                            limiting
                                        </div>
                                    )}
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                                        <div style={{
                                            width: 48, height: barH,
                                            background: `${r.col}30`, border: `2px solid ${r.col}`,
                                            borderRadius: '4px 4px 0 0', transition: 'height 0.3s',
                                        }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Arrow divider */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 18, flexShrink: 0 }}>→</div>

                    {/* Products */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flex: 1 }}>
                        {productRows.map((p, i) => {
                            const barHT = Math.max(4, (p.massT / maxMass) * 130)
                            const barHA = Math.max(4, (p.massA / maxMass) * 130)
                            return (
                                <div key={p.f} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                    <div style={{
                                        fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--teal)',
                                        background: 'rgba(29,158,117,0.12)', padding: '2px 6px', borderRadius: 4, whiteSpace: 'nowrap'
                                    }}>
                                        product
                                    </div>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                                        {/* Theoretical (faint) */}
                                        <div style={{
                                            position: 'absolute', bottom: 0, width: 48, height: barHT,
                                            background: `${p.col}10`, border: `1px dashed ${p.col}40`,
                                            borderRadius: '4px 4px 0 0',
                                        }} />
                                        {/* Actual */}
                                        <div style={{
                                            position: 'relative', width: 48, height: barHA,
                                            background: `${p.col}35`, border: `2px solid ${p.col}`,
                                            borderRadius: '4px 4px 0 0', transition: 'height 0.3s',
                                        }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* X-axis labels row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 8, paddingBottom: 12 }}>
                    <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                        {reactantRows.map(r => (
                            <div key={r.f} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: r.col }}>{r.f}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.moles.toFixed(2)} mol</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${r.col}90` }}>{r.mass.toFixed(1)} g</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ width: 24 }} />
                    <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                        {productRows.map(p => (
                            <div key={p.f} style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col }}>{p.f}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{p.molesA.toFixed(2)} mol</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${p.col}90` }}>{p.massA.toFixed(1)} g</div>
                            </div>
                        ))}
                    </div>
                </div>

                {yieldPct < 100 && (
                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'rgba(160,176,200,0.4)', paddingBottom: 8, textAlign: 'center' }}>
                        dashed outline = theoretical  ·  solid bar = actual ({yieldPct}% yield)
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {productRows.map(p => (
                    <ValueCard key={p.f} label={`${p.f} actual`}
                        value={p.massA.toFixed(3)} unit=" g" color={p.col} highlight />
                ))}
                <ValueCard label="Theoretical" value={totalPMass.toFixed(3)} unit=" g" color="var(--text3)" />
                <ValueCard label="% Yield" value={`${yieldPct}%`} color="var(--teal)" />
                <ValueCard label="Mass balance" value={Math.abs(totalRMass - totalPMass) < 0.05 ? '✓ ok' : `Δ${(totalRMass - totalPMass).toFixed(2)}g`}
                    color={Math.abs(totalRMass - totalPMass) < 0.05 ? 'var(--teal)' : 'var(--coral)'} />
            </div>
        </div>
    )
}