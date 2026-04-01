import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

// Diagonal relationship: Li resembles Mg more than Na
const LI = { sym: 'Li', AR: 152, IE1: 520, EN: 0.98, mp: 180, chargeR: 6.45 }
const NA = { sym: 'Na', AR: 186, IE1: 496, EN: 0.93, mp: 98, chargeR: 5.21 }
const MG = { sym: 'Mg', AR: 160, IE1: 738, EN: 1.31, mp: 650, chargeR: 13.1 }

const SIMILARITIES = [
    {
        property: 'Oxide formed with O₂',
        Li: 'Li₂O  (normal oxide)',
        Mg: 'MgO   (normal oxide)',
        Na: 'Na₂O₂ (peroxide — different!)',
        match: true,
        explanation: 'Both Li and Mg form the simple oxide. Na forms a peroxide due to its larger cation size.',
    },
    {
        property: 'Reaction with N₂',
        Li: '6Li + N₂ → 2Li₃N  (unique in group!)',
        Mg: '3Mg + N₂ → Mg₃N₂  (similar)',
        Na: 'Na does NOT react with N₂',
        match: true,
        explanation: 'Li and Mg both form stable nitrides by direct combination with N₂. No other Group 1 metal does this.',
    },
    {
        property: 'Carbonate stability',
        Li: 'Li₂CO₃ decomposes on heating',
        Mg: 'MgCO₃ decomposes on heating',
        Na: 'Na₂CO₃ is thermally stable',
        match: true,
        explanation: 'Small, highly polarising cations (Li⁺, Mg²⁺) destabilise the carbonate ion → easier decomposition.',
    },
    {
        property: 'Halide character',
        Li: 'LiCl — significant covalent character',
        Mg: 'MgCl₂ — significant covalent character',
        Na: 'NaCl — predominantly ionic',
        match: true,
        explanation: "Fajan's rules: small, high-charge cations polarise anions more → more covalent character.",
    },
    {
        property: 'Solubility of fluoride',
        Li: 'LiF — sparingly soluble',
        Mg: 'MgF₂ — sparingly soluble',
        Na: 'NaF — soluble',
        match: true,
        explanation: 'High lattice energy of LiF and MgF₂ (small cations → high charge density) makes them less soluble.',
    },
]

export default function LiAnomaly() {
    const [sel, setSel] = useState(0)

    const props = [
        { label: 'Charge density', li: LI.chargeR, na: NA.chargeR, mg: MG.chargeR, unit: 'charge/radius' },
        { label: 'Atomic radius (pm)', li: LI.AR, na: NA.AR, mg: MG.AR, unit: 'pm' },
        { label: 'IE₁ (kJ/mol)', li: LI.IE1, na: NA.IE1, mg: MG.IE1, unit: 'kJ/mol' },
        { label: 'EN (Pauling)', li: LI.EN, na: NA.EN, mg: MG.EN, unit: '' },
    ]

    const sim = SIMILARITIES[sel]

    return (
        <div>
            <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--purple)' }}>Diagonal relationship:</strong> Li (Group 1, Period 2) resembles Mg (Group 2, Period 3) more than it resembles Na (the element directly below it in Group 1). This is because similar <em>charge density</em> leads to similar polarising power.
            </div>

            {/* Diagonal visualisation — 3 element cards */}
            <div style={{ position: 'relative', marginBottom: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                        { el: LI, group: 'Group 1', period: 'Period 2', col: '#EF9F27' },
                        { el: MG, group: 'Group 2', period: 'Period 3', col: '#1D9E75' },
                        { el: NA, group: 'Group 1', period: 'Period 3', col: '#378ADD' },
                    ].map(({ el, group, period, col }) => (
                        <div key={el.sym} style={{ padding: '12px', background: `${col}12`, border: `1px solid ${col}40`, borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ fontSize: 28, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>{el.sym}</div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{group} · {period}</div>
                        </div>
                    ))}
                </div>

                {/* Diagonal arrow overlay */}
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--purple)' }}>
                    Li ↘ Mg: diagonal relationship (similar charge density)
                    <br />
                    <span style={{ color: 'rgba(55,138,221,0.5)' }}>Li ↓ Na: vertical (Group 1) — but LESS similar than diagonal</span>
                </div>
            </div>

            {/* Property comparison */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    KEY PROPERTY COMPARISON — click a property
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {props.map((p, i) => {
                        const maxV = Math.max(p.li, p.na, p.mg)
                        return (
                            <div key={p.label} style={{ padding: '10px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>{p.label}</div>
                                {[{ sym: 'Li', v: p.li, col: '#EF9F27' }, { sym: 'Na', v: p.na, col: '#378ADD' }, { sym: 'Mg', v: p.mg, col: '#1D9E75' }].map(row => (
                                    <div key={row.sym} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col, minWidth: 20 }}>{row.sym}</span>
                                        <div style={{ flex: 1, height: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 5, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(row.v / maxV) * 100}%`, background: row.col, borderRadius: 5 }} />
                                        </div>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: row.col, minWidth: 36, textAlign: 'right' }}>{row.v}</span>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Similarities navigator */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    CHEMICAL SIMILARITIES — Li resembles Mg
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {SIMILARITIES.map((s, i) => (
                        <button key={i} onClick={() => setSel(i)} style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 10,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: sel === i ? 'var(--purple)' : 'var(--bg3)',
                            color: sel === i ? '#fff' : 'var(--text2)',
                            border: `1px solid ${sel === i ? 'var(--purple)' : 'var(--border)'}`,
                        }}>S{i + 1}</button>
                    ))}
                </div>

                <div style={{ padding: '14px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)', marginBottom: 10 }}>{sim.property}</div>
                    {[{ sym: 'Li', v: sim.Li, col: '#EF9F27' }, { sym: 'Mg', v: sim.Mg, col: '#1D9E75' }, { sym: 'Na', v: sim.Na, col: '#378ADD' }].map(row => (
                        <div key={row.sym} style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col, minWidth: 24 }}>{row.sym}</span>
                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{row.v}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 10, padding: '8px 12px', background: `${sim.match ? 'rgba(29,158,117' : 'rgba(216,90,48'},.08)`, border: `1px solid ${sim.match ? 'rgba(29,158,117' : 'rgba(216,90,48'},.25)`, borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: sim.match ? 'var(--teal)' : 'var(--coral)', lineHeight: 1.6 }}>
                        {sim.explanation}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Diagonal pair" value="Li − Mg" color="var(--purple)" highlight />
                <ValueCard label="Reason" value="Similar charge density" color="var(--gold)" />
                <ValueCard label="Li charge density" value={`${LI.chargeR} vs Na ${NA.chargeR}`} color="#EF9F27" />
                <ValueCard label="Similarities" value={`${SIMILARITIES.length} key chemical similarities`} color="var(--teal)" />
            </div>
        </div>
    )
}