import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'
import ChemSlider from '../../components/ui/ChemSlider'

// Standard reduction potentials E° (V) — the electrochemical series
const HALF_CELLS = [
    { id: 'Li', label: 'Li⁺/Li', E0: -3.04, eq: 'Li⁺ + e⁻ → Li', col: '#EF9F27' },
    { id: 'K', label: 'K⁺/K', E0: -2.92, eq: 'K⁺ + e⁻ → K', col: '#EF9F27' },
    { id: 'Ca', label: 'Ca²⁺/Ca', E0: -2.87, eq: 'Ca²⁺ + 2e⁻ → Ca', col: '#EF9F27' },
    { id: 'Na', label: 'Na⁺/Na', E0: -2.71, eq: 'Na⁺ + e⁻ → Na', col: '#EF9F27' },
    { id: 'Mg', label: 'Mg²⁺/Mg', E0: -2.37, eq: 'Mg²⁺ + 2e⁻ → Mg', col: '#1D9E75' },
    { id: 'Al', label: 'Al³⁺/Al', E0: -1.66, eq: 'Al³⁺ + 3e⁻ → Al', col: '#888780' },
    { id: 'Zn', label: 'Zn²⁺/Zn', E0: -0.76, eq: 'Zn²⁺ + 2e⁻ → Zn', col: '#378ADD' },
    { id: 'Fe', label: 'Fe²⁺/Fe', E0: -0.44, eq: 'Fe²⁺ + 2e⁻ → Fe', col: '#D85A30' },
    { id: 'Ni', label: 'Ni²⁺/Ni', E0: -0.25, eq: 'Ni²⁺ + 2e⁻ → Ni', col: '#1D9E75' },
    { id: 'Sn', label: 'Sn²⁺/Sn', E0: -0.14, eq: 'Sn²⁺ + 2e⁻ → Sn', col: '#888780' },
    { id: 'Pb', label: 'Pb²⁺/Pb', E0: -0.13, eq: 'Pb²⁺ + 2e⁻ → Pb', col: '#888780' },
    { id: 'H2', label: 'H⁺/H₂', E0: 0.00, eq: '2H⁺ + 2e⁻ → H₂', col: '#A8D8B9' },
    { id: 'Cu', label: 'Cu²⁺/Cu', E0: +0.34, eq: 'Cu²⁺ + 2e⁻ → Cu', col: '#D85A30' },
    { id: 'Ag', label: 'Ag⁺/Ag', E0: +0.80, eq: 'Ag⁺ + e⁻ → Ag', col: '#888780' },
    { id: 'Hg', label: 'Hg²⁺/Hg', E0: +0.85, eq: 'Hg²⁺ + 2e⁻ → Hg', col: '#888780' },
    { id: 'Cl2', label: 'Cl₂/Cl⁻', E0: +1.36, eq: 'Cl₂ + 2e⁻ → 2Cl⁻', col: '#1D9E75' },
    { id: 'MnO4', label: 'MnO₄⁻/Mn²⁺', E0: +1.51, eq: 'MnO₄⁻+8H⁺+5e⁻→Mn²⁺+4H₂O', col: '#7F77DD' },
    { id: 'F2', label: 'F₂/F⁻', E0: +2.87, eq: 'F₂ + 2e⁻ → 2F⁻', col: '#1D9E75' },
]

export default function ElectrochemSeries() {
    const [cathodeId, setCathodeId] = useState('Cu')
    const [anodeId, setAnodeId] = useState('Zn')
    const [tab, setTab] = useState('series')   // series | cell | displacement

    const cathode = HALF_CELLS.find(h => h.id === cathodeId)
    const anode = HALF_CELLS.find(h => h.id === anodeId)

    const E_cell = cathode.E0 - anode.E0
    const spontaneous = E_cell > 0
    const deltaG = -(cathode.E0 - anode.E0 > 0 ? 'negative' : 'positive')  // qualitative

    // E° range for bar chart
    const E_MIN = -3.1, E_MAX = 3.0
    const barW = (E0) => ((E0 - E_MIN) / (E_MAX - E_MIN)) * 100

    // Displacement: can metal A displace metal B from solution?
    // Metal with lower E° displaces metal with higher E° from its salt
    const canDisplace = (metA, metBSalt) => {
        const a = HALF_CELLS.find(h => h.id === metA)
        const b = HALF_CELLS.find(h => h.id === metBSalt)
        if (!a || !b) return false
        return a.E0 < b.E0  // more negative E° = stronger reducing agent
    }

    const METALS = ['Mg', 'Al', 'Zn', 'Fe', 'Ni', 'Sn', 'Pb', 'H2', 'Cu', 'Ag']

    return (
        <div>
            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'series', l: 'Electrochemical series' },
                    { k: 'cell', l: 'Galvanic cell EMF' },
                    { k: 'displacement', l: 'Displacement predictor' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setTab(opt.k)} style={{
                        flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: tab === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── SERIES VIEW ── */}
            {tab === 'series' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Electrochemical series:</span> Half-reactions listed in order of increasing E° (standard reduction potential). More negative E° → stronger reducing agent (top). More positive E° → stronger oxidising agent (bottom).
                    </div>

                    {/* Series bar chart */}
                    <div style={{ maxHeight: 440, overflowY: 'auto', marginBottom: 14 }}>
                        {[...HALF_CELLS].sort((a, b) => a.E0 - b.E0).map(hc => {
                            const isCathode = hc.id === cathodeId
                            const isAnode = hc.id === anodeId
                            const pct = barW(hc.E0)
                            return (
                                <div key={hc.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                    padding: '5px 8px', marginBottom: 3,
                                    background: isCathode ? 'rgba(29,158,117,0.1)' : isAnode ? 'rgba(216,90,48,0.1)' : 'transparent',
                                    borderRadius: 6,
                                    border: isCathode || isAnode ? `1px solid ${isCathode ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}` : '1px solid transparent',
                                }}>
                                    {/* Select buttons */}
                                    <button onClick={() => setAnodeId(hc.id)} style={{
                                        width: 20, height: 20, borderRadius: 4, fontSize: 8,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: isAnode ? 'var(--coral)' : 'rgba(216,90,48,0.1)',
                                        color: isAnode ? '#fff' : 'var(--coral)',
                                        border: '1px solid rgba(216,90,48,0.3)',
                                        flexShrink: 0,
                                    }}>−</button>
                                    <button onClick={() => setCathodeId(hc.id)} style={{
                                        width: 20, height: 20, borderRadius: 4, fontSize: 8,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: isCathode ? 'var(--teal)' : 'rgba(29,158,117,0.1)',
                                        color: isCathode ? '#fff' : 'var(--teal)',
                                        border: '1px solid rgba(29,158,117,0.3)',
                                        flexShrink: 0,
                                    }}>+</button>

                                    {/* Label */}
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: hc.col, minWidth: 80 }}>
                                        {hc.label}
                                    </span>

                                    {/* Bar */}
                                    <div style={{ flex: 1, height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                                        {/* Zero line */}
                                        <div style={{ position: 'absolute', left: `${barW(0)}%`, top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.2)' }} />
                                        <div style={{
                                            position: 'absolute',
                                            left: hc.E0 < 0 ? `${pct}%` : `${barW(0)}%`,
                                            width: `${Math.abs(barW(hc.E0) - barW(0))}%`,
                                            height: '100%',
                                            background: hc.E0 < 0 ? 'var(--coral)' : 'var(--teal)',
                                            borderRadius: 5,
                                        }} />
                                    </div>

                                    {/* E° value */}
                                    <span style={{
                                        fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, minWidth: 52, textAlign: 'right',
                                        color: hc.E0 < 0 ? 'var(--coral)' : hc.E0 > 0 ? 'var(--teal)' : 'rgba(160,176,200,0.5)'
                                    }}>
                                        {hc.E0 >= 0 ? '+' : ''}{hc.E0.toFixed(2)} V
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', textAlign: 'center' }}>
                        Click − to set as anode  ·  Click + to set as cathode  ·  Then go to "Galvanic cell EMF" tab
                    </div>
                </div>
            )}

            {/* ── CELL EMF ── */}
            {tab === 'cell' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {/* Anode selector */}
                        <div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 8 }}>
                                ANODE (−) — oxidation
                            </div>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {HALF_CELLS.map(hc => (
                                    <button key={hc.id} onClick={() => setAnodeId(hc.id)} style={{
                                        padding: '3px 7px', borderRadius: 6, fontSize: 10,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: anodeId === hc.id ? 'var(--coral)' : `${hc.col}15`,
                                        color: anodeId === hc.id ? '#fff' : hc.col,
                                        border: `1px solid ${anodeId === hc.id ? 'var(--coral)' : hc.col + '40'}`,
                                    }}>{hc.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Cathode selector */}
                        <div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 8 }}>
                                CATHODE (+) — reduction
                            </div>
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {HALF_CELLS.map(hc => (
                                    <button key={hc.id} onClick={() => setCathodeId(hc.id)} style={{
                                        padding: '3px 7px', borderRadius: 6, fontSize: 10,
                                        fontFamily: 'var(--mono)', cursor: 'pointer',
                                        background: cathodeId === hc.id ? 'var(--teal)' : `${hc.col}15`,
                                        color: cathodeId === hc.id ? '#fff' : hc.col,
                                        border: `1px solid ${cathodeId === hc.id ? 'var(--teal)' : hc.col + '40'}`,
                                    }}>{hc.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cell diagram */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ GALVANIC CELL — {anode.label} | {cathode.label}
                        </div>

                        <svg viewBox="0 0 420 180" width="100%" style={{ display: 'block' }}>
                            {/* Anode half-cell */}
                            <rect x={20} y={40} width={140} height={110} rx={8}
                                fill="rgba(216,90,48,0.06)"
                                stroke="rgba(216,90,48,0.35)" strokeWidth={1.5} />
                            <text x={90} y={60} textAnchor="middle"
                                style={{ fontSize: 11, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                ANODE (−)
                            </text>
                            <text x={90} y={76} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'var(--coral)', fontFamily: 'var(--mono)' }}>
                                {anode.label}
                            </text>
                            {/* Electrode */}
                            <rect x={78} y={82} width={24} height={52} rx={4}
                                fill={`${anode.col}30`}
                                stroke={anode.col} strokeWidth={2} />
                            <text x={90} y={112} textAnchor="middle"
                                style={{ fontSize: 10, fill: anode.col, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                {anode.id.replace(/\d/g, '')}
                            </text>
                            {/* Solution */}
                            <text x={90} y={145} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                                E°={anode.E0 >= 0 ? '+' : ''}{anode.E0.toFixed(2)}V
                            </text>

                            {/* Cathode half-cell */}
                            <rect x={260} y={40} width={140} height={110} rx={8}
                                fill="rgba(29,158,117,0.06)"
                                stroke="rgba(29,158,117,0.35)" strokeWidth={1.5} />
                            <text x={330} y={60} textAnchor="middle"
                                style={{ fontSize: 11, fill: 'var(--teal)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                CATHODE (+)
                            </text>
                            <text x={330} y={76} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'var(--teal)', fontFamily: 'var(--mono)' }}>
                                {cathode.label}
                            </text>
                            <rect x={318} y={82} width={24} height={52} rx={4}
                                fill={`${cathode.col}30`}
                                stroke={cathode.col} strokeWidth={2} />
                            <text x={330} y={112} textAnchor="middle"
                                style={{ fontSize: 10, fill: cathode.col, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                {cathode.id.replace(/\d/g, '')}
                            </text>
                            <text x={330} y={145} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                                E°={cathode.E0 >= 0 ? '+' : ''}{cathode.E0.toFixed(2)}V
                            </text>

                            {/* External circuit wire */}
                            <path d="M 90 40 L 90 20 L 330 20 L 330 40"
                                fill="none"
                                stroke="rgba(160,176,200,0.4)" strokeWidth={2} />

                            {/* Electron flow direction */}
                            <defs>
                                <marker id="eArr" viewBox="0 0 10 10" refX={8} refY={5}
                                    markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                                    <path d="M2 1L8 5L2 9" fill="none" stroke="#378ADD" strokeWidth={1.5} strokeLinecap="round" />
                                </marker>
                            </defs>
                            <line x1={150} y1={20} x2={230} y2={20}
                                stroke="#378ADD" strokeWidth={2}
                                markerEnd="url(#eArr)" />
                            <text x={210} y={14} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>e⁻ flow</text>

                            {/* Salt bridge */}
                            <rect x={185} y={80} width={50} height={20} rx={4}
                                fill="rgba(160,176,200,0.1)"
                                stroke="rgba(160,176,200,0.3)" strokeWidth={1} />
                            <text x={210} y={94} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>salt bridge</text>

                            {/* Cell EMF */}
                            <text x={210} y={168} textAnchor="middle"
                                style={{ fontSize: 12, fill: spontaneous ? 'var(--teal)' : 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                E°cell = {E_cell >= 0 ? '+' : ''}{E_cell.toFixed(3)} V  {spontaneous ? '→ spontaneous' : '→ non-spontaneous'}
                            </text>
                        </svg>
                    </div>

                    {/* Calculation breakdown */}
                    <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.9 }}>
                        E°cell = E°cathode − E°anode
                        <br />= ({cathode.E0 >= 0 ? '+' : ''}{cathode.E0.toFixed(2)}) − ({anode.E0 >= 0 ? '+' : ''}{anode.E0.toFixed(2)})
                        <br />= <span style={{ color: spontaneous ? 'var(--teal)' : 'var(--coral)', fontWeight: 700, fontSize: 14 }}>
                            {E_cell >= 0 ? '+' : ''}{E_cell.toFixed(3)} V
                        </span>
                        <br />{spontaneous
                            ? '✓ E°cell > 0 → ΔG° < 0 → spontaneous (galvanic cell)'
                            : '✗ E°cell < 0 → ΔG° > 0 → non-spontaneous (requires energy input = electrolytic cell)'}
                    </div>

                    {/* Half reactions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 4 }}>ANODE (oxidation)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)' }}>
                                {anode.eq.replace('→', '← (reversed)')}
                            </div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 4 }}>CATHODE (reduction)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)' }}>{cathode.eq}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DISPLACEMENT PREDICTOR ── */}
            {tab === 'displacement' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Displacement rule:</span> A metal with lower E° (higher up in the series) will displace a metal with higher E° from its salt solution. More reactive metal = more negative E°.
                    </div>

                    {/* Grid */}
                    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                        <table style={{ borderCollapse: 'collapse', fontSize: 10, fontFamily: 'var(--mono)', minWidth: 420 }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '6px 10px', color: 'var(--text3)', fontWeight: 400, textAlign: 'left' }}>
                                        Metal A (added)
                                    </th>
                                    {METALS.map(id => {
                                        const hc = HALF_CELLS.find(h => h.id === id)
                                        return (
                                            <th key={id} style={{ padding: '6px 8px', color: hc.col, fontWeight: 700, textAlign: 'center' }}>
                                                {hc.label.split('/')[0]}²⁺
                                            </th>
                                        )
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {METALS.map(rowId => {
                                    const rowHC = HALF_CELLS.find(h => h.id === rowId)
                                    return (
                                        <tr key={rowId}>
                                            <td style={{ padding: '5px 10px', fontWeight: 700, color: rowHC.col }}>
                                                {rowHC.label.split('/')[1]}
                                            </td>
                                            {METALS.map(colId => {
                                                if (rowId === colId) return (
                                                    <td key={colId} style={{ padding: '5px 8px', textAlign: 'center', color: 'var(--text3)' }}>—</td>
                                                )
                                                const can = canDisplace(rowId, colId)
                                                return (
                                                    <td key={colId} style={{ padding: '5px 8px', textAlign: 'center' }}>
                                                        <div style={{
                                                            width: 24, height: 24, borderRadius: 5, margin: 'auto',
                                                            background: can ? 'rgba(29,158,117,0.25)' : 'rgba(216,90,48,0.1)',
                                                            border: `1px solid ${can ? 'rgba(29,158,117,0.5)' : 'rgba(216,90,48,0.2)'}`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 12, color: can ? 'var(--teal)' : 'var(--coral)',
                                                        }}>
                                                            {can ? '✓' : '✗'}
                                                        </div>
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', lineHeight: 1.7 }}>
                        ✓ = row metal displaces column metal from its solution  ·  ✗ = no reaction
                        <br />Example: Zn displaces Cu because E°(Zn) = −0.76V &lt; E°(Cu) = +0.34V
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Anode (−)" value={`${anode.label}  E°=${anode.E0 >= 0 ? '+' : ''}${anode.E0.toFixed(2)}V`} color="var(--coral)" highlight />
                <ValueCard label="Cathode (+)" value={`${cathode.label}  E°=${cathode.E0 >= 0 ? '+' : ''}${cathode.E0.toFixed(2)}V`} color="var(--teal)" highlight />
                <ValueCard label="E°cell" value={`${E_cell >= 0 ? '+' : ''}${E_cell.toFixed(3)} V`} color={spontaneous ? 'var(--teal)' : 'var(--coral)'} />
                <ValueCard label="Spontaneous" value={spontaneous ? 'Yes (ΔG° < 0)' : 'No (electrolytic)'} color={spontaneous ? 'var(--teal)' : 'var(--coral)'} />
            </div>
        </div>
    )
}