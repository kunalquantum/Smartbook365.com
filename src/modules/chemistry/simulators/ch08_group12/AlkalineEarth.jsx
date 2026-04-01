import { useState } from 'react'
import { GROUP2 } from './helpers/elementData'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = {
    water: {
        label: 'With Water',
        data: {
            Be: { eq: 'No reaction (protected by oxide layer)', intensity: 0 },
            Mg: { eq: 'Mg + H₂O(steam) → MgO + H₂↑', intensity: 0.3 },
            Ca: { eq: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑  (steady)', intensity: 0.55 },
            Sr: { eq: 'Sr + 2H₂O → Sr(OH)₂ + H₂↑  (rapid)', intensity: 0.75 },
            Ba: { eq: 'Ba + 2H₂O → Ba(OH)₂ + H₂↑  (rapid)', intensity: 0.88 },
        },
    },
    acid: {
        label: 'With HCl',
        data: {
            Be: { eq: 'Be + 2HCl → BeCl₂ + H₂↑  (slow — covalent BeCl₂)', intensity: 0.35 },
            Mg: { eq: 'Mg + 2HCl → MgCl₂ + H₂↑  (vigorous)', intensity: 0.7 },
            Ca: { eq: 'Ca + 2HCl → CaCl₂ + H₂↑  (vigorous)', intensity: 0.85 },
            Sr: { eq: 'Sr + 2HCl → SrCl₂ + H₂↑  (very vigorous)', intensity: 0.92 },
            Ba: { eq: 'Ba + 2HCl → BaCl₂ + H₂↑  (very vigorous)', intensity: 0.97 },
        },
    },
}

const SOL_COLORS = { soluble: '#1D9E75', slightly: '#EF9F27', insoluble: '#D85A30' }

export default function AlkalineEarth() {
    const [selEl, setSelEl] = useState('Ca')
    const [rxn, setRxn] = useState('water')
    const [mode, setMode] = useState('reactivity')   // reactivity | solubility | trends

    const el = GROUP2.find(e => e.sym === selEl)
    const rx = REACTIONS[rxn]

    const TREND_PROPS = [
        { label: 'Atomic radius (pm)', vals: GROUP2.map(e => ({ sym: e.sym, v: e.AR })) },
        { label: 'IE₁ (kJ/mol)', vals: GROUP2.map(e => ({ sym: e.sym, v: e.IE1 })) },
        { label: 'Melting point (°C)', vals: GROUP2.map(e => ({ sym: e.sym, v: e.mp })) },
        { label: 'Density (g/cm³)', vals: GROUP2.map(e => ({ sym: e.sym, v: e.density })) },
    ]
    const [trendIdx, setTrendIdx] = useState(0)
    const tp = TREND_PROPS[trendIdx]
    const maxV = Math.max(...tp.vals.map(v => v.v))

    const COLORS = ['#EF9F27', '#1D9E75', '#7F77DD', '#D85A30', '#378ADD']

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'reactivity', l: 'Reactivity' }, { k: 'solubility', l: 'Solubility trends' }, { k: 'trends', l: 'Periodic trends' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Element selector */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {GROUP2.map((e, i) => (
                    <button key={e.sym} onClick={() => setSelEl(e.sym)} style={{
                        flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: selEl === e.sym ? COLORS[i] : 'var(--bg3)',
                        color: selEl === e.sym ? '#000' : 'var(--text2)',
                        border: `1px solid ${selEl === e.sym ? COLORS[i] : 'var(--border)'}`,
                    }}>{e.sym}</button>
                ))}
            </div>

            {/* ── REACTIVITY ── */}
            {mode === 'reactivity' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {Object.entries(REACTIONS).map(([k, r]) => (
                            <button key={k} onClick={() => setRxn(k)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: rxn === k ? 'var(--coral)' : 'var(--bg3)',
                                color: rxn === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${rxn === k ? 'var(--coral)' : 'var(--border)'}`,
                            }}>{r.label}</button>
                        ))}
                    </div>

                    <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold2)', letterSpacing: 0.3 }}>
                        {rx.data[selEl].eq}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <div style={{ height: 18, background: 'var(--bg3)', borderRadius: 9, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div style={{
                                height: '100%', borderRadius: 9,
                                width: `${rx.data[selEl].intensity * 100}%`,
                                background: rx.data[selEl].intensity > 0.7 ? 'var(--coral)' : rx.data[selEl].intensity > 0.3 ? 'var(--gold)' : rx.data[selEl].intensity === 0 ? 'var(--bg3)' : 'var(--teal)',
                                transition: 'width 0.4s',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>
                            <span>no reaction</span><span>moderate</span><span>vigorous</span>
                        </div>
                    </div>

                    {GROUP2.map((e, i) => (
                        <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                            onClick={() => setSelEl(e.sym)}>
                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: COLORS[i], minWidth: 24 }}>{e.sym}</span>
                            <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${rx.data[e.sym].intensity * 100}%`, background: e.sym === selEl ? COLORS[i] : `${COLORS[i]}60`, borderRadius: 7, transition: 'width 0.3s' }} />
                            </div>
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 60, textAlign: 'right' }}>
                                {e.rxnWater}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── SOLUBILITY TRENDS ── */}
            {mode === 'solubility' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        Group 2 solubility shows <strong style={{ color: 'var(--gold)' }}>opposite trends</strong> for hydroxides vs sulphates — a classic exam point.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        {/* Hydroxides */}
                        <div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>
                                HYDROXIDES M(OH)₂ — solubility ↑ down group
                            </div>
                            {GROUP2.map((e, i) => (
                                <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}
                                    onClick={() => setSelEl(e.sym)}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: COLORS[i], minWidth: 24 }}>{e.sym}(OH)₂</span>
                                    <span style={{
                                        fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 8px', borderRadius: 20,
                                        background: `${SOL_COLORS[e.hydroxideSol]}20`,
                                        color: SOL_COLORS[e.hydroxideSol],
                                        border: `1px solid ${SOL_COLORS[e.hydroxideSol]}40`,
                                    }}>{e.hydroxideSol}</span>
                                </div>
                            ))}
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 8 }}>
                                Be(OH)₂ → Ba(OH)₂: insoluble → soluble
                            </div>
                        </div>

                        {/* Sulphates */}
                        <div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)', marginBottom: 8 }}>
                                SULPHATES MSO₄ — solubility ↓ down group
                            </div>
                            {GROUP2.map((e, i) => (
                                <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}
                                    onClick={() => setSelEl(e.sym)}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: COLORS[i], minWidth: 24 }}>{e.sym}SO₄</span>
                                    <span style={{
                                        fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 8px', borderRadius: 20,
                                        background: `${SOL_COLORS[e.sulfateSol]}20`,
                                        color: SOL_COLORS[e.sulfateSol],
                                        border: `1px solid ${SOL_COLORS[e.sulfateSol]}40`,
                                    }}>{e.sulfateSol}</span>
                                </div>
                            ))}
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 8 }}>
                                BeSO₄ → BaSO₄: soluble → insoluble (BaSO₄ used in X-ray barium meal)
                            </div>
                        </div>
                    </div>

                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Why opposite trends?</strong> Hydroxides: lattice energy decreases faster than hydration energy → more soluble. Sulphates: lattice energy decreases slower → less soluble.
                    </div>
                </div>
            )}

            {/* ── TRENDS ── */}
            {mode === 'trends' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {TREND_PROPS.map((p, i) => (
                            <button key={i} onClick={() => setTrendIdx(i)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: trendIdx === i ? 'var(--teal)' : 'var(--bg3)',
                                color: trendIdx === i ? '#fff' : 'var(--text2)',
                                border: `1px solid ${trendIdx === i ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{p.label}</button>
                        ))}
                    </div>

                    {tp.vals.map(({ sym, v }, i) => (
                        <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                            onClick={() => setSelEl(sym)}>
                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: COLORS[i], minWidth: 24 }}>{sym}</span>
                            <div style={{ flex: 1, height: 20, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${(v / maxV) * 100}%`,
                                    background: sym === selEl ? COLORS[i] : `${COLORS[i]}60`,
                                    borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8,
                                }}>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>{v}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Element" value={`${el.name} (${el.sym})`} color={COLORS[GROUP2.findIndex(e => e.sym === selEl)]} highlight />
                <ValueCard label="IE₁" value={`${el.IE1} kJ/mol`} color="var(--coral)" />
                <ValueCard label="Rxn water" value={el.rxnWater} color="var(--teal)" />
                <ValueCard label="Melting pt" value={`${el.mp}°C`} color="var(--gold)" />
            </div>
        </div>
    )
}