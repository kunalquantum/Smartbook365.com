import { useState } from 'react'
import { GROUP14, CARBON_ALLOTROPES } from './helpers/groupData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const SILICATES = [
    { name: 'Orthosilicate', formula: 'SiO₄⁴⁻', unit: 'Isolated tetrahedra', nSi: 1, example: 'Zircon, olivine', color: '#EF9F27' },
    { name: 'Pyrosilicate', formula: 'Si₂O₇⁶⁻', unit: '2 tetrahedra (corner)', nSi: 2, example: 'Thortveitite', color: '#1D9E75' },
    { name: 'Cyclosilicate', formula: '(SiO₃)ₙⁿ⁻', unit: 'Ring structure', nSi: 3, example: 'Beryl (Be₃Al₂Si₆O₁₈)', color: '#7F77DD' },
    { name: 'Chain silicate', formula: '(SiO₃²⁻)ₙ', unit: 'Infinite chain', nSi: '∞', example: 'Pyroxenes', color: '#D85A30' },
    { name: 'Sheet silicate', formula: '(Si₂O₅²⁻)ₙ', unit: '2D sheet', nSi: '∞', example: 'Micas, talc, clay', color: '#378ADD' },
    { name: '3D silicate', formula: '(SiO₂)ₙ', unit: '3D network', nSi: '∞', example: 'Quartz, feldspar', color: '#888780' },
]

const CO_CO2 = [
    {
        formula: 'CO', name: 'Carbon monoxide', ON: '+2', color: '#D85A30',
        prep: 'C + CO₂ → 2CO  (at high temp)',
        properties: ['Colourless, odourless, POISONOUS gas', 'Binds Hb 250× more strongly than O₂ → asphyxiation', 'Strong REDUCING agent', 'Ligand in transition metal carbonyls'],
        reactions: [
            { eq: 'CO + Hb → HbCO (carboxyhaemoglobin)', note: 'TOXIC — blocks O₂ transport' },
            { eq: 'CO + Cl₂ →(hν) COCl₂ (phosgene)', note: 'Highly toxic war gas' },
            { eq: 'CO + 3H₂ → CH₄ + H₂O', note: 'Methanation — Fischer-Tropsch' },
            { eq: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂', note: 'Reducing agent in blast furnace' },
        ],
    },
    {
        formula: 'CO₂', name: 'Carbon dioxide', ON: '+4', color: '#1D9E75',
        prep: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂  (lab method)',
        properties: ['Colourless gas, heavier than air', 'Non-toxic but asphyxiant in high concentration', 'Acidic oxide — dissolves in water', 'Solid CO₂ = dry ice (−78.5°C)'],
        reactions: [
            { eq: 'CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻', note: 'Weakly acidic solution — carbonic acid' },
            { eq: 'CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O', note: 'Limewater test — turns milky' },
            { eq: 'CO₂ + 2NaOH → Na₂CO₃ + H₂O', note: 'Absorbed by alkali' },
            { eq: 'CO₂ + C → 2CO  (Boudouard, ~1000°C)', note: 'Reduces to CO at high temperature' },
        ],
    },
]

export default function Group14Carbon() {
    const [mode, setMode] = useState('allotropes')
    const [selAllot, setSelAllot] = useState(0)
    const [selOxide, setSelOxide] = useState(0)
    const [selEl, setSelEl] = useState('C')
    const [trendProp, setTrendProp] = useState('AR')

    // Interactive Morph State (Graphite -> Diamond)
    const [pressure, setPressure] = useState(1) // 1 to 100
    
    // Interactive Silicate Builder State
    const [nUnits, setNUnits] = useState(1) // 1 to 4

    const TREND_DATA = {
        AR: { label: 'Atomic radius (pm)', vals: GROUP14.map(e => e.AR), max: 175 },
        IE1: { label: 'IE₁ (kJ/mol)', vals: GROUP14.map(e => e.IE1), max: 1086 },
        mp: { label: 'Melting point (°C)', vals: GROUP14.map(e => e.mp), max: 3550 },
    }
    const td = TREND_DATA[trendProp]
    const al = CARBON_ALLOTROPES[selAllot]
    const ox = CO_CO2[selOxide]
    const el = GROUP14.find(e => e.sym === selEl)

    // Mathematical Morphing Function for Allotropes
    const renderMorphingCarbon = () => {
        const f = (pressure - 1) / 99 // 0 to 1
        const lerp = (a, b) => a + (b - a) * f
        const pt = (a, b) => ({ x: lerp(a.x, b.x), y: lerp(a.y, b.y) })

        // 2D hex base
        const hex = (cx, cy, rx, ry) => [
            {x: cx, y: cy-ry}, {x: cx+rx, y: cy-ry/2}, {x: cx+rx, y: cy+ry/2},
            {x: cx, y: cy+ry}, {x: cx-rx, y: cy+ry/2}, {x: cx-rx, y: cy-ry/2}
        ]
        
        // Graphite geometry (f=0)
        const gTop = hex(200, 70, 70, 25)
        const gBot = hex(200, 160, 70, 25)
        
        // Diamond geometry (f=1)
        // Staggered chairs
        const dTop = gTop.map((p, i) => ({ x: p.x, y: i%2===0 ? 100 : 125 }))
        const dBot = gBot.map((p, i) => ({ x: p.x, y: i%2===0 ? 125 : 150 }))

        // Lerp
        const atomsTop = gTop.map((g, i) => pt(g, dTop[i]))
        const atomsBot = gBot.map((g, i) => pt(g, dBot[i]))
        const allAtoms = [...atomsTop, ...atomsBot]

        return (
            <svg viewBox="0 0 400 240" style={{ marginTop: 14 }}>
                {/* Pi electron clouds (Graphite only) */}
                {f < 1 && (
                    <g opacity={1 - Math.pow(f, 0.5)}>
                        <ellipse cx="200" cy={lerp(70, 110)} rx="85" ry="30" fill="rgba(55,138,221,0.15)" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 4" />
                        <ellipse cx="200" cy={lerp(160, 135)} rx="85" ry="30" fill="rgba(55,138,221,0.15)" stroke="var(--teal)" strokeWidth="1" strokeDasharray="4 4" />
                    </g>
                )}

                {/* Vertical Sigma Bonds (Fade in as Diamond forms) */}
                {f > 0 && atomsTop.map((t, i) => (
                    <line key={`v${i}`} x1={t.x} y1={t.y} x2={atomsBot[i].x} y2={atomsBot[i].y} stroke="var(--border2)" strokeWidth={3} strokeLinecap="round" opacity={f} />
                ))}

                {/* In-plane covalent bonds (Always visible) */}
                {atomsTop.map((t, i) => {
                    const next = atomsTop[(i+1)%6]
                    return <line key={`t${i}`} x1={t.x} y1={t.y} x2={next.x} y2={next.y} stroke="var(--border2)" strokeWidth={3} strokeLinecap="round" />
                })}
                {atomsBot.map((b, i) => {
                    const next = atomsBot[(i+1)%6]
                    return <line key={`b${i}`} x1={b.x} y1={b.y} x2={next.x} y2={next.y} stroke="var(--border2)" strokeWidth={3} strokeLinecap="round" />
                })}

                {/* Carbon Atoms */}
                {allAtoms.map((a, i) => (
                    <circle key={`atom${i}`} cx={a.x} cy={a.y} r={10} fill="rgba(136,135,128,0.2)" stroke="#888780" strokeWidth={2} />
                ))}

                <text x="200" y="30" textAnchor="middle" fill={f > 0.5 ? 'var(--coral)' : 'var(--teal)'} style={{ fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: 1 }}>
                    {f === 0 ? 'Graphite (sp² + delocalised π)' : f === 1 ? 'Diamond (sp³ rigid network)' : 'Applying immense pressure... π bonds breaking'}
                </text>
            </svg>
        )
    }

    // Mathematical Silicate Builder
    const renderSilicateBuilder = () => {
        // We draw nUnits of SiO4.
        const units = Array.from({ length: nUnits })
        const oxCol = '#D85A30'
        const siCol = '#888780'

        return (
            <svg viewBox="0 0 400 240" style={{ marginTop: 14 }}>
                {/* Bonds drawn first (behind atoms) */}
                {units.map((_, i) => {
                    const cx = 80 + i * 80; const cy = 120
                    const o1 = { x: cx - 40, y: cy + 30 }
                    const o2 = { x: cx + 40, y: cy + 30 }
                    const o3 = { x: cx, y: cy - 35 }
                    const o4 = { x: cx, y: cy + 10 }
                    return (
                        <g key={`bonds${i}`}>
                            <line x1={cx} y1={cy} x2={o1.x} y2={o1.y} stroke="var(--border2)" opacity="0.6" strokeWidth={3} />
                            <line x1={cx} y1={cy} x2={o2.x} y2={o2.y} stroke="var(--border2)" opacity="0.6" strokeWidth={3} />
                            <line x1={cx} y1={cy} x2={o3.x} y2={o3.y} stroke="var(--border2)" opacity="0.6" strokeWidth={3} />
                            <line x1={cx} y1={cy} x2={o4.x} y2={o4.y} stroke="var(--border2)" opacity="0.6" strokeWidth={3} />
                        </g>
                    )
                })}
                
                {/* O atoms */}
                {units.map((_, i) => {
                    const cx = 80 + i * 80; const cy = 120
                    const Ox = (x,y,r) => (
                        <g>
                            <circle cx={x} cy={y} r={r} fill={`${oxCol}20`} stroke={oxCol} strokeWidth={1.5} />
                            <text x={x} y={y+3} textAnchor="middle" fill={oxCol} style={{ fontSize: r*0.7, fontFamily: 'var(--mono)', fontWeight:700 }}>O</text>
                        </g>
                    )
                    return (
                        <g key={`oxy${i}`}>
                            {i === 0 && Ox(cx-40, cy+30, 12)}
                            {Ox(cx, cy-35, 12)}
                            {Ox(cx+40, cy+30, 12)}
                            {Ox(cx, cy+10, 14)}
                        </g>
                    )
                })}

                {/* Si atoms (in center of tetrahedron) */}
                {units.map((_, i) => {
                    const cx = 80 + i * 80; const cy = 120
                    return (
                        <g key={`si${i}`}>
                            <circle cx={cx} cy={cy} r={10} fill={`${siCol}30`} stroke={siCol} strokeWidth={2} />
                            <text x={cx} y={cy+3} textAnchor="middle" fill={siCol} style={{ fontSize: 9, fontFamily: 'var(--mono)', fontWeight:700 }}>Si</text>
                        </g>
                    )
                })}

                <text x="200" y="30" textAnchor="middle" fill={'var(--purple)'} style={{ fontSize: 13, fontFamily: 'var(--mono)', letterSpacing: 1 }}>
                    {nUnits === 1 ? 'Orthosilicate (SiO₄⁴⁻)' : nUnits === 2 ? 'Pyrosilicate (Si₂O₇⁶⁻)' : `Chain Silicate Segment (${nUnits} units)`}
                </text>
                <text x="200" y="48" textAnchor="middle" fill={'var(--text3)'} style={{ fontSize: 10, fontFamily: 'var(--mono)' }}>
                    Corner sharing of Oxygen atoms forms polymeric structures
                </text>
            </svg>
        )
    }

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {[{ k: 'allotropes', l: 'Allotropes of C' }, { k: 'oxides', l: 'CO vs CO₂' }, { k: 'silicates', l: 'Silicates' }, { k: 'trends', l: 'Group 14 trends' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '5px 6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── ALLOTROPES ── */}
            {mode === 'allotropes' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>High Pressure Synthesis:</strong> Graphite is the most thermodynamically stable form at SATP. However, applying immense constant pressure (~100,000 atm) at high temperature forces the sheets together, converting it to Diamond.
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <ChemSlider label="Apply Pressure (x10³ atm)" unit="k atm" value={pressure} min={1} max={100} step={1} onChange={setPressure} color="var(--gold)" />
                        {renderMorphingCarbon()}
                    </div>

                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {CARBON_ALLOTROPES.map((a, i) => (
                            <button key={a.name} onClick={() => setSelAllot(i)} style={{
                                flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selAllot === i ? a.color : 'var(--bg3)',
                                color: selAllot === i ? '#000' : 'var(--text2)',
                                border: `1px solid ${selAllot === i ? a.color : 'var(--border)'}`,
                            }}>{a.name}</button>
                        ))}
                    </div>

                    <div style={{ padding: '14px 16px', background: `${al.color}12`, border: `1px solid ${al.color}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: al.color, marginBottom: 4 }}>{al.name}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>{al.formula}  ·  {al.hybridisation}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>{al.structure}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {[
                            { label: 'Hardness', val: al.hardness, col: 'var(--coral)' },
                            { label: 'Conductivity', val: al.conduct, col: 'var(--teal)' },
                            { label: 'Density', val: al.density ? `${al.density} g/cm³` : 'Single layer', col: 'var(--gold)' },
                            { label: 'Key uses', val: al.uses, col: al.color },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>{p.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: p.col, lineHeight: 1.5 }}>{p.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── CO vs CO₂ ── */}
            {mode === 'oxides' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {CO_CO2.map((ox, i) => (
                            <button key={ox.formula} onClick={() => setSelOxide(i)} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 14,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selOxide === i ? ox.color : 'var(--bg3)',
                                color: selOxide === i ? '#fff' : 'var(--text2)',
                                border: `1px solid ${selOxide === i ? ox.color : 'var(--border2)'}`,
                            }}>{ox.formula}</button>
                        ))}
                    </div>

                    <div style={{ padding: '12px 16px', background: `${ox.color}10`, border: `1px solid ${ox.color}30`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: ox.color, marginBottom: 3 }}>{ox.name}</div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>Oxidation state of C: {ox.ON}</div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.5, marginBottom: 6 }}><strong style={{ color: ox.color }}>Preparation:</strong> {ox.prep}</div>
                        {ox.properties.map((p, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                                <span style={{ color: ox.color, fontSize: 12 }}>•</span>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{p}</span>
                            </div>
                        ))}
                    </div>

                    {ox.reactions.map((r, i) => (
                        <div key={i} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6 }}>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: ox.color }}>{r.eq}</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{r.note}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── SILICATES BUILDER ── */}
            {mode === 'silicates' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--purple)' }}>Interactive Silicate Builder:</strong> Silicates are built from SiO₄⁴⁻ tetrahedra sharing O corners. The degree of sharing determines the mineral structure. Click "Polymerize" to build a chain!
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                            <button onClick={() => setNUnits(Math.max(1, nUnits - 1))} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--bg3)', color: 'var(--coral)', border: '1px solid var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700, cursor: 'pointer' }}>
                                − Remove Unit
                            </button>
                            <button onClick={() => setNUnits(Math.min(4, nUnits + 1))} style={{ padding: '8px 16px', borderRadius: 8, background: 'var(--teal)', color: '#fff', border: '1px solid var(--teal)', fontFamily: 'var(--mono)', fontWeight: 700, cursor: 'pointer' }}>
                                + Polymerize (Add SiO₄)
                            </button>
                        </div>
                        {renderSilicateBuilder()}
                    </div>

                    <div style={{ padding: '12px 16px', background: `rgba(216,90,48,0.1)`, border: `1px solid rgba(216,90,48,0.3)`, borderRadius: 10 }}>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)', marginBottom: 8 }}>Common Structures:</div>
                        <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            <li><strong style={{color:'#EF9F27'}}>1 unit:</strong> Orthosilicate (Zircon) - 0 corners shared</li>
                            <li><strong style={{color:'#1D9E75'}}>2 units:</strong> Pyrosilicate (Thortveitite) - 1 corner shared</li>
                            <li><strong style={{color:'#D85A30'}}>Chain:</strong> Pyroxenes - 2 corners shared per internal unit</li>
                            <li><strong style={{color:'#378ADD'}}>Sheet:</strong> Micas / Clay - 3 corners shared (forms 2D plane)</li>
                            <li><strong style={{color:'#888780'}}>3D Network:</strong> Quartz - All 4 corners shared (SiO₂)</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ── TRENDS ── */}
            {mode === 'trends' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.entries(TREND_DATA).map(([k, v]) => (
                            <button key={k} onClick={() => setTrendProp(k)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: trendProp === k ? 'var(--teal)' : 'var(--bg3)',
                                color: trendProp === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${trendProp === k ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{v.label}</button>
                        ))}
                    </div>

                    {GROUP14.map((e, i) => {
                        const v = td.vals[i]
                        return (
                            <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                                onClick={() => setSelEl(e.sym)}>
                                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${e.color}20`, border: `1.5px solid ${e.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: e.color, flexShrink: 0 }}>
                                    {e.sym}
                                </div>
                                <div style={{ flex: 1, height: 20, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(v / td.max) * 100}%`, background: e.sym === selEl ? e.color : `${e.color}60`, borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>{v}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 60 }}>{e.type}</span>
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Focus" value={mode} color="var(--gold)" highlight />
                <ValueCard label="C allotropes" value="Diamond/Graphite/C₆₀/Graphene" color="var(--teal)" />
                <ValueCard label="Inert pair" value="Sn²⁺, Pb²⁺ stable (not +4)" color="var(--coral)" />
            </div>
        </div>
    )
}