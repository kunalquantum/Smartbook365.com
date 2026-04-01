import { useState } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const COMPOUNDS = {
    'NaOH': {
        name: 'Sodium hydroxide (caustic soda)',
        color: '#EF9F27',
        make: 'Chlor-alkali process: 2NaCl + 2H₂O → 2NaOH + Cl₂ + H₂ (electrolysis)',
        uses: ['Soap/detergent making (saponification)', 'Paper and pulp industry', 'Drain cleaners', 'Neutralising acids in industry'],
        reactions: [
            { eq: 'NaOH + HCl → NaCl + H₂O', type: 'neutralisation' },
            { eq: 'NaOH + CO₂ → Na₂CO₃ + H₂O', type: 'absorbs CO₂' },
            { eq: 'Al + NaOH + H₂O → NaAlO₂ + H₂↑', type: 'dissolves amphoteric metal' },
        ],
        hazard: 'Highly corrosive — causes severe burns. Handle with gloves.',
    },
    'Na₂CO₃': {
        name: 'Sodium carbonate (washing soda)',
        color: '#378ADD',
        make: 'Solvay process: NaCl + NH₃ + CO₂ + H₂O → NaHCO₃ → Na₂CO₃ (on heating)',
        uses: ['Water softening (removes Ca²⁺, Mg²⁺)', 'Glass making', 'Laundry detergent', 'Paper manufacturing'],
        reactions: [
            { eq: 'Na₂CO₃ + H₂SO₄ → Na₂SO₄ + H₂O + CO₂', type: 'with acid' },
            { eq: 'Na₂CO₃ + CaCl₂ → CaCO₃↓ + 2NaCl', type: 'water softening' },
            { eq: 'Na₂CO₃·10H₂O → Na₂CO₃ + 10H₂O', type: 'efflorescence' },
        ],
        hazard: 'Mildly alkaline. Eye irritant. Much safer than NaOH.',
    },
    'NaHCO₃': {
        name: 'Sodium hydrogen carbonate (baking soda)',
        color: '#1D9E75',
        make: 'Solvay process intermediate: NaCl + NH₃ + H₂O + CO₂ → NaHCO₃↓',
        uses: ['Baking (releases CO₂ to raise dough)', 'Antacid (neutralises stomach acid)', 'Fire extinguisher', 'Mild cleaning agent'],
        reactions: [
            { eq: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂', type: 'with acid — fizzes' },
            { eq: '2NaHCO₃ →(heat) Na₂CO₃ + H₂O + CO₂', type: 'thermal decomposition' },
            { eq: 'NaHCO₃ + NaOH → Na₂CO₃ + H₂O', type: 'with base' },
        ],
        hazard: 'Safe — food grade. Used as antacid.',
    },
    'CaO': {
        name: 'Calcium oxide (quicklime)',
        color: '#D85A30',
        make: 'CaCO₃ →(900°C) CaO + CO₂ (thermal decomposition of limestone)',
        uses: ['Making Ca(OH)₂ (slaked lime)', 'Steel industry (removes SiO₂)', 'Water treatment', 'Agriculture (reduces soil acidity)'],
        reactions: [
            { eq: 'CaO + H₂O → Ca(OH)₂ + heat (exothermic!)', type: 'slaking — vigorous, produces heat' },
            { eq: 'CaO + SiO₂ → CaSiO₃', type: 'slag formation in blast furnace' },
            { eq: 'CaO + CO₂ → CaCO₃', type: 'reversible — basis of lime kiln' },
        ],
        hazard: 'Reacts violently with water generating intense heat. Corrosive.',
    },
    'Ca(OH)₂': {
        name: 'Calcium hydroxide (slaked lime)',
        color: '#7F77DD',
        make: 'CaO + H₂O → Ca(OH)₂ (exothermic — called slaking of lime)',
        uses: ['Mortar and plaster', 'Water treatment (raises pH)', 'Whitewash', 'CO₂ detection (limewater test)'],
        reactions: [
            { eq: 'Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O (limewater test)', type: 'CO₂ detection — turns milky' },
            { eq: 'Ca(OH)₂ + 2HCl → CaCl₂ + 2H₂O', type: 'neutralisation' },
            { eq: 'Ca(OH)₂ + Na₂CO₃ → CaCO₃ + 2NaOH', type: 'causticisation' },
        ],
        hazard: 'Mildly corrosive. Irritant to skin and eyes.',
    },
    'Plaster of Paris': {
        name: 'Plaster of Paris (CaSO₄·½H₂O)',
        color: '#888780',
        make: 'CaSO₄·2H₂O →(120°C) CaSO₄·½H₂O + 3/2 H₂O (partial dehydration of gypsum)',
        uses: ['Orthopaedic casts', 'Moulding and sculptures', 'False ceilings', 'Dental work'],
        reactions: [
            { eq: 'CaSO₄·½H₂O + 3/2 H₂O → CaSO₄·2H₂O (setting)', type: 'sets hard in 15-20 min — exothermic' },
            { eq: 'CaSO₄·2H₂O →(>150°C) CaSO₄ (dead burnt)', type: 'over-heating destroys setting ability' },
        ],
        hazard: 'Dusty — respiratory irritant. Sets exothermically — can cause burns.',
        special: true,
    },
}

export default function Compounds() {
    const [sel, setSel] = useState('NaOH')
    const cp = COMPOUNDS[sel]

    // Interactive: CaO + H₂O slider
    const [water, setWater] = useState(0)
    const heat = sel === 'CaO' ? water * 65 : 0   // kJ/mol simulated

    return (
        <div>
            {/* Compound selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(COMPOUNDS).map(k => (
                    <button key={k} onClick={() => setSel(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: sel === k ? COMPOUNDS[k].color : 'var(--bg3)',
                        color: sel === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${sel === k ? COMPOUNDS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Header */}
            <div style={{ padding: '12px 16px', background: `${cp.color}12`, border: `1px solid ${cp.color}35`, borderRadius: 10, marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: cp.color, marginBottom: 4 }}>{sel}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{cp.name}</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.6 }}>
                    <strong style={{ color: cp.color }}>Preparation:</strong> {cp.make}
                </div>
            </div>

            {/* Interactive CaO slaking */}
            {sel === 'CaO' && (
                <div style={{ padding: '14px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 10 }}>
                        INTERACTIVE: SLAKING OF LIME — add water to CaO
                    </div>
                    <ChemSlider label="Water added" unit=" mL" value={water} min={0} max={1} step={0.05} onChange={setWater} color="var(--coral)" precision={2} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                        <div style={{ padding: '10px', background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.3)', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)' }}>
                                {(water * 100).toFixed(0)}%
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>conversion</div>
                        </div>
                        <div style={{ padding: '10px', background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.3)', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>
                                {heat.toFixed(0)} kJ
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>heat released</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                        CaO + H₂O → Ca(OH)₂  ΔH = −65 kJ/mol  (exothermic — lime gets very hot!)
                    </div>
                </div>
            )}

            {/* Reactions */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    KEY REACTIONS
                </div>
                {cp.reactions.map((r, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: cp.color }}>{r.eq}</div>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{r.type}</div>
                    </div>
                ))}
            </div>

            {/* Uses */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    INDUSTRIAL USES
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {cp.uses.map((u, i) => (
                        <div key={i} style={{ padding: '5px 12px', background: `${cp.color}12`, border: `1px solid ${cp.color}30`, borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', color: cp.color }}>
                            {u}
                        </div>
                    ))}
                </div>
            </div>

            {/* Hazard */}
            <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.06)', border: '1px solid rgba(216,90,48,0.2)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--coral)', lineHeight: 1.6 }}>
                ⚠ {cp.hazard}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Compound" value={sel} color={cp.color} highlight />
                <ValueCard label="Reactions" value={`${cp.reactions.length} key reactions`} color="var(--teal)" />
                <ValueCard label="Uses" value={`${cp.uses.length} industrial uses`} color="var(--gold)" />
            </div>
        </div>
    )
}