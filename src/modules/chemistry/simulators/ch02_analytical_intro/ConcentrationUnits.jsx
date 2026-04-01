import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'
import ChemSlider from '../../components/ui/ChemSlider'

// Common solvents for molality context
const SOLUTES = {
    'NaCl  (58.44)': { M: 58.44, color: '#1D9E75' },
    'HCl   (36.46)': { M: 36.46, color: '#D85A30' },
    'NaOH  (40.00)': { M: 40.00, color: '#EF9F27' },
    'H₂SO₄ (98.08)': { M: 98.08, color: '#7F77DD' },
    'Glucose (180.16)': { M: 180.16, color: '#378ADD' },
    'CaCO₃ (100.09)': { M: 100.09, color: '#888780' },
    'Urea  (60.06)': { M: 60.06, color: '#1D9E75' },
}

const SOLVENTS = {
    'Water (18.015)': { M: 18.015, density: 1.00 },
    'Ethanol (46.07)': { M: 46.07, density: 0.789 },
    'Benzene (78.11)': { M: 78.11, density: 0.879 },
    'CCl₄ (153.82)': { M: 153.82, density: 1.594 },
}

export default function ConcentrationUnits() {
    const [solute, setSolute] = useState('NaCl  (58.44)')
    const [solvent, setSolvent] = useState('Water (18.015)')
    const [gSolute, setGSolute] = useState(5.85)     // grams of solute
    const [mLSol, setMLSol] = useState(100)       // mL of solution
    const [gSolvent, setGSolvent] = useState(100)       // g of solvent
    const [fromUnit, setFromUnit] = useState('molarity')// which unit is input

    const slt = SOLUTES[solute]
    const slv = SOLVENTS[solvent]

    // Derived from grams + volume + mass_solvent
    const nMoles = gSolute / slt.M
    const Vsol_L = mLSol / 1000
    const msol_kg = gSolvent / 1000
    const totalMol = nMoles + gSolvent / slv.M

    // Concentration units
    const molarity = nMoles / Vsol_L                       // mol/L
    const molality = nMoles / msol_kg                       // mol/kg
    const moleFrac = nMoles / totalMol                      // dimensionless
    const massFrac = gSolute / (gSolute + gSolvent)         // dimensionless
    const ppm_mml = (gSolute / (gSolute + gSolvent)) * 1e6 // mg/kg
    const normality = molarity   // approximate for 1-equiv solutes

    // Parts per million (mass/volume) for very dilute:
    const ppm_mv = (gSolute / (mLSol * (slv.density || 1))) * 1e6  // mg/L if density≈1

    // Bar chart data for visual comparison
    const bars = [
        { label: 'Molarity M', val: molarity, unit: 'mol/L', color: 'var(--gold)', max: 10 },
        { label: 'Molality m', val: molality, unit: 'mol/kg', color: 'var(--teal)', max: 10 },
        { label: 'Mole fraction χ', val: moleFrac, unit: '', color: 'var(--purple)', max: 1 },
        { label: 'Mass fraction', val: massFrac, unit: '', color: '#378ADD', max: 1 },
        { label: 'Normality N', val: normality, unit: 'N', color: 'var(--coral)', max: 10 },
    ]

    return (
        <div>
            {/* Solute + solvent pickers */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 6, letterSpacing: 1 }}>SOLUTE</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {Object.keys(SOLUTES).map(k => (
                            <button key={k} onClick={() => setSolute(k)} style={{
                                padding: '3px 8px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: solute === k ? SOLUTES[k].color + '40' : 'var(--bg3)',
                                color: solute === k ? SOLUTES[k].color : 'var(--text2)',
                                border: `1px solid ${solute === k ? SOLUTES[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 6, letterSpacing: 1 }}>SOLVENT</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {Object.keys(SOLVENTS).map(k => (
                            <button key={k} onClick={() => setSolvent(k)} style={{
                                padding: '3px 8px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: solvent === k ? 'var(--teal)' : 'var(--bg3)',
                                color: solvent === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${solvent === k ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quantity sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                <ChemSlider label="Mass of solute" unit=" g"
                    value={gSolute} min={0.01} max={100} step={0.01}
                    onChange={setGSolute} color={slt.color} precision={2} />
                <ChemSlider label="Volume of solution" unit=" mL"
                    value={mLSol} min={1} max={1000} step={1}
                    onChange={setMLSol} color="var(--gold)" />
                <ChemSlider label="Mass of solvent" unit=" g"
                    value={gSolvent} min={1} max={1000} step={1}
                    onChange={setGSolvent} color="var(--teal)" />
            </div>

            {/* Visual solution beaker */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
                {/* Beaker SVG */}
                <svg width={80} height={130} viewBox="0 0 80 130" style={{ flexShrink: 0 }}>
                    {/* Beaker outline */}
                    <path d="M 14 20 L 8 110 Q 8 122 20 122 L 60 122 Q 72 122 72 110 L 66 20 Z"
                        fill="rgba(55,138,221,0.05)" stroke="rgba(160,176,200,0.35)" strokeWidth={1.5} />
                    {/* Liquid */}
                    {(() => {
                        const fillH = 80 * Math.min(1, mLSol / 500)
                        const y0 = 122 - fillH
                        return (
                            <path d={`M 12 ${y0} Q 40 ${y0 - 4} 68 ${y0} L 72 110 Q 72 122 60 122 L 20 122 Q 8 122 8 110 Z`}
                                fill={`${slt.color}30`} stroke={`${slt.color}50`} strokeWidth={0.5} />
                        )
                    })()}
                    {/* Solute particles */}
                    {Array.from({ length: Math.min(12, Math.round(nMoles * 10)) }, (_, i) => {
                        const px = 18 + (i % 4) * 14
                        const py = 90 + Math.floor(i / 4) * 12
                        return <circle key={i} cx={px} cy={py} r={3} fill={slt.color} opacity={0.7} />
                    })}
                    {/* mL markings */}
                    {[25, 50, 75].map(ml => {
                        const y = 122 - 80 * (ml / 500)
                        return <text key={ml} x={5} y={y + 3} textAnchor="end"
                            style={{ fontSize: 7, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>{ml}</text>
                    })}
                </svg>

                {/* Concentration bars */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                        ALL CONCENTRATION UNITS — same solution
                    </div>
                    {bars.map(b => {
                        const pct = Math.min(100, (b.val / b.max) * 100)
                        return (
                            <div key={b.label} style={{ marginBottom: 9 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: b.color, fontWeight: 600 }}>
                                        {b.label}
                                    </span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                                        {b.val < 0.001 ? b.val.toExponential(3) : b.val.toFixed(4)} {b.unit}
                                    </span>
                                </div>
                                <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: b.color, borderRadius: 3, transition: 'width 0.3s' }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Formula reference */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                    { label: 'Molarity M', formula: 'n(solute) / V(solution, L)', note: 'Changes with temperature (volume changes)' },
                    { label: 'Molality m', formula: 'n(solute) / m(solvent, kg)', note: 'Temperature-independent — use in colligative props' },
                    { label: 'Mole fraction χ', formula: 'n₁ / (n₁ + n₂ + ...)', note: 'Σ of all mole fractions = 1' },
                    { label: 'ppm (mass/mass)', formula: '(m_solute / m_solution) × 10⁶', note: 'Used for trace concentrations (pollution, biology)' },
                ].map(f => (
                    <div key={f.label} style={{ padding: '10px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>{f.label}</div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)', marginBottom: 4 }}>{f.formula}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', lineHeight: 1.5 }}>{f.note}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Molarity M" value={molarity.toFixed(4)} unit=" mol/L" color="var(--gold)" highlight />
                <ValueCard label="Molality m" value={molality.toFixed(4)} unit=" mol/kg" color="var(--teal)" />
                <ValueCard label="Mole fraction χ" value={moleFrac.toFixed(5)} color="var(--purple)" />
                <ValueCard label="ppm (mass)" value={ppm_mml.toFixed(2)} unit=" mg/kg" color="var(--coral)" />
            </div>
        </div>
    )
}