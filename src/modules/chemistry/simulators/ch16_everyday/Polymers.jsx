import { useState } from 'react'
import { POLYMERS } from './helpers/everydayData'
import ValueCard from '../../components/ui/ValueCard'

export default function Polymers() {
    const [sel, setSel] = useState('Nylon-6,6')
    const [mode, setMode] = useState('explore')   // explore | compare | mechanism

    const p = POLYMERS[sel]

    // Filter by type for compare
    const [filterType, setFilterType] = useState('all')
    const filtered = Object.entries(POLYMERS).filter(([, v]) =>
        filterType === 'all' || v.type === filterType || (filterType === 'natural' && v.natural) || (filterType === 'synthetic' && !v.natural)
    )

    // Mechanism animation state
    const [mechStep, setMechStep] = useState(0)

    const ADDITION_STEPS = [
        { label: 'Initiation', eq: 'I• (initiator radical) formed from peroxide under heat/UV' },
        { label: 'Propagation', eq: 'I• + CH₂=CH₂ → I−CH₂−CH₂•  →  grows chain' },
        { label: 'Chain growth', eq: '−CH₂−CH₂• + CH₂=CH₂ → −CH₂−CH₂−CH₂−CH₂•' },
        { label: 'Termination', eq: '2 radicals combine → polymer chain ends' },
    ]

    const CONDENSATION_STEPS = [
        { label: 'Two monomers', eq: 'H₂N−R−NH₂  +  HOOC−R′−COOH (bifunctional)' },
        { label: 'First condensation', eq: 'H₂N−R−NH₂ + HOOC−R′−COOH → H₂N−R−NHOC−R′−COOH + H₂O' },
        { label: 'Chain grows', eq: 'Both ends reactive — chain extends from both ends' },
        { label: 'Long-chain polymer', eq: '−(HN−R−NHCO−R′−CO)ₙ− + nH₂O  (Nylon-type)' },
    ]

    const steps = p.type === 'addition' ? ADDITION_STEPS : CONDENSATION_STEPS

    // Property comparison bars
    const DENSITY_MAX = 2.2
    const TG_DATA = Object.entries(POLYMERS)
        .filter(([, v]) => v.Tg !== null)
        .sort(([, a], [, b]) => a.Tg - b.Tg)

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'explore', l: 'Explore polymers' }, { k: 'compare', l: 'Compare' }, { k: 'mechanism', l: 'Polymerisation' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── EXPLORE ── */}
            {mode === 'explore' && (
                <div>
                    {/* Polymer grid selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 5, marginBottom: 14 }}>
                        {Object.keys(POLYMERS).map(k => (
                            <button key={k} onClick={() => setSel(k)} style={{
                                padding: '6px 4px', borderRadius: 8, cursor: 'pointer', textAlign: 'center',
                                background: sel === k ? `${POLYMERS[k].color}25` : 'var(--bg3)',
                                border: `2px solid ${sel === k ? POLYMERS[k].color : 'var(--border)'}`,
                                transition: 'all 0.15s',
                            }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, color: POLYMERS[k].color }}>{k.split('(')[0].trim()}</div>
                                <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                    {POLYMERS[k].type}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Selected polymer detail */}
                    <div style={{ padding: '14px 16px', background: `${p.color}12`, border: `2px solid ${p.color}40`, borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 6 }}>
                            <div>
                                <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: p.color }}>{sel}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                    {p.type} polymerisation · {p.natural ? 'Natural' : 'Synthetic'}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '3px 10px', borderRadius: 20, background: p.natural ? 'rgba(29,158,117,0.15)' : 'rgba(55,138,221,0.15)', color: p.natural ? 'var(--teal)' : '#378ADD', border: `1px solid ${p.natural ? 'rgba(29,158,117,0.3)' : 'rgba(55,138,221,0.3)'}` }}>
                                    {p.natural ? 'Natural' : 'Synthetic'}
                                </span>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', padding: '3px 10px', borderRadius: 20, background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}40` }}>
                                    {p.type}
                                </span>
                            </div>
                        </div>

                        {/* Monomer and repeat unit */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>MONOMER</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: p.color, fontWeight: 700 }}>{p.monomer}</div>
                            </div>
                            <div style={{ padding: '8px 10px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>REPEAT UNIT</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: p.color, fontWeight: 700 }}>{p.repeat}</div>
                            </div>
                        </div>

                        {/* Reaction equation */}
                        <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, marginBottom: 8, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>
                            {p.reaction}
                        </div>

                        {/* Properties */}
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            {p.properties}
                        </div>
                    </div>

                    {/* Uses */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>APPLICATIONS</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {p.uses.map((u, i) => (
                                <div key={i} style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', background: `${p.color}12`, color: p.color, border: `1px solid ${p.color}30` }}>
                                    {u}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Physical properties */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {[
                            { label: 'Density', val: `${p.density} g/cm³`, col: p.color },
                            { label: 'Tg', val: p.Tg !== null ? `${p.Tg}°C` : 'N/A (thermoset)', col: 'var(--gold)' },
                            { label: 'Crystallinity', val: p.crystallinity, col: 'var(--teal)' },
                        ].map(pr => (
                            <div key={pr.label} style={{ padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>{pr.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: pr.col }}>{pr.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── COMPARE ── */}
            {mode === 'compare' && (
                <div>
                    {/* Type filter */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {[{ v: 'all', l: 'All' }, { v: 'addition', l: 'Addition' }, { v: 'condensation', l: 'Condensation' }, { v: 'natural', l: 'Natural' }, { v: 'synthetic', l: 'Synthetic' }].map(opt => (
                            <button key={opt.v} onClick={() => setFilterType(opt.v)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: filterType === opt.v ? 'var(--teal)' : 'var(--bg3)',
                                color: filterType === opt.v ? '#fff' : 'var(--text2)',
                                border: `1px solid ${filterType === opt.v ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{opt.l}</button>
                        ))}
                    </div>

                    {/* Comparison table */}
                    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
                            <thead>
                                <tr>
                                    {['Polymer', 'Type', 'Monomer', 'Density', 'Tg', 'Natural'].map(h => (
                                        <th key={h} style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.3)', color: 'var(--text3)', fontSize: 10, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(([k, v]) => (
                                    <tr key={k} style={{ cursor: 'pointer', background: sel === k ? `${v.color}10` : 'transparent' }}
                                        onClick={() => setSel(k)}>
                                        <td style={{ padding: '6px 10px', color: v.color, fontWeight: 700 }}>{k}</td>
                                        <td style={{ padding: '6px 10px', color: 'var(--text2)' }}>{v.type}</td>
                                        <td style={{ padding: '6px 10px', color: 'var(--text3)', fontSize: 10 }}>{v.monomer.split('(')[0].trim()}</td>
                                        <td style={{ padding: '6px 10px', color: 'var(--text2)', textAlign: 'center' }}>{v.density}</td>
                                        <td style={{ padding: '6px 10px', color: v.Tg !== null ? 'var(--gold)' : 'var(--text3)', textAlign: 'center' }}>{v.Tg !== null ? `${v.Tg}°C` : '—'}</td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', color: v.natural ? 'var(--teal)' : 'var(--text3)' }}>
                                            {v.natural ? '✓' : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Glass transition temperature bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            GLASS TRANSITION TEMPERATURE (Tg)
                        </div>
                        {TG_DATA.map(([k, v]) => {
                            const pct = ((v.Tg + 130) / 250) * 100
                            return (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5, cursor: 'pointer' }}
                                    onClick={() => setSel(k)}>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 110 }}>{k.split('(')[0].trim()}</span>
                                    <div style={{ flex: 1, height: 12, background: 'var(--bg3)', borderRadius: 6, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: k === sel ? v.color : `${v.color}60`, borderRadius: 6, transition: 'width 0.3s' }} />
                                    </div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 50 }}>{v.Tg}°C</span>
                                </div>
                            )
                        })}
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                            Below Tg: glassy/brittle  ·  Above Tg: rubbery/flexible
                        </div>
                    </div>
                </div>
            )}

            {/* ── MECHANISM ── */}
            {mode === 'mechanism' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {['addition', 'condensation'].map(t => (
                            <button key={t} onClick={() => { setSel(t === 'addition' ? 'Polyethylene (LDPE)' : 'Nylon-6,6'); setMechStep(0) }} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: p.type === t ? (t === 'addition' ? '#888780' : '#EF9F27') : 'var(--bg3)',
                                color: p.type === t ? '#fff' : 'var(--text2)',
                                border: `1px solid ${p.type === t ? (t === 'addition' ? '#888780' : '#EF9F27') : 'var(--border)'}`,
                            }}>{t.charAt(0).toUpperCase() + t.slice(1)} polymerisation</button>
                        ))}
                    </div>

                    {/* Step navigator */}
                    <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
                        {steps.map((_, i) => (
                            <button key={i} onClick={() => setMechStep(i)} style={{
                                flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: mechStep === i ? p.color : mechStep > i ? `${p.color}25` : 'var(--bg3)',
                                color: mechStep === i ? '#000' : mechStep > i ? p.color : 'var(--text3)',
                                border: `1px solid ${mechStep >= i ? p.color + '50' : 'var(--border)'}`,
                            }}>{i + 1}</button>
                        ))}
                    </div>

                    {/* Steps */}
                    {steps.slice(0, mechStep + 1).map((s, i) => (
                        <div key={i} style={{
                            padding: '12px 14px', marginBottom: 8,
                            background: i === mechStep ? `${p.color}12` : 'var(--bg3)',
                            border: `1px solid ${i === mechStep ? p.color + '40' : 'var(--border)'}`,
                            borderRadius: 8,
                        }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: p.color, letterSpacing: 1.5, marginBottom: 4 }}>
                                {s.label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: p.color }}>{s.eq}</div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setMechStep(x => Math.max(0, x - 1))} disabled={mechStep === 0} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', opacity: mechStep === 0 ? 0.4 : 1 }}>←</button>
                        <button onClick={() => setMechStep(x => Math.min(steps.length - 1, x + 1))} disabled={mechStep >= steps.length - 1} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: `${p.color}15`, color: p.color, border: `1px solid ${p.color}40`, opacity: mechStep >= steps.length - 1 ? 0.4 : 1 }}>→</button>
                    </div>

                    {/* Key difference table */}
                    <div style={{ marginTop: 14 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '1px', background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                            {[['Feature', 'Addition', 'Condensation'],
                            ['Monomers', 'One type (monounsaturated)', 'Two types (bifunctional)'],
                            ['Byproduct', 'None', 'Small molecule (H₂O, HCl)'],
                            ['Molecular weight', 'Very high', 'High'],
                            ['Example', 'Polyethylene, PVC', 'Nylon, Polyester, Bakelite'],
                            ['Bond type', 'C−C backbone', 'Ester/amide/ether linkages'],
                            ].map((row, ri) =>
                                row.map((cell, ci) => (
                                    <div key={`${ri}${ci}`} style={{
                                        padding: '6px 10px',
                                        background: ri === 0 ? 'rgba(0,0,0,0.3)' : ci === 0 ? 'var(--bg3)' : ci === 1 ? 'rgba(136,135,128,0.06)' : 'rgba(239,159,39,0.06)',
                                        fontSize: ri === 0 ? 10 : 11,
                                        fontFamily: 'var(--mono)',
                                        fontWeight: ri === 0 || ci === 0 ? 700 : 400,
                                        color: ri === 0 ? 'var(--text3)' : ci === 0 ? 'var(--text3)' : ci === 1 ? '#888780' : '#EF9F27',
                                    }}>{cell}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Polymer" value={sel} color={p.color} highlight />
                <ValueCard label="Type" value={p.type} color={p.color} />
                <ValueCard label="Natural" value={p.natural ? 'Yes' : 'Synthetic'} color={p.natural ? 'var(--teal)' : '#378ADD'} />
                <ValueCard label="Density" value={`${p.density} g/cm³`} color="var(--gold)" />
            </div>
        </div>
    )
}