import { useState } from 'react'
import { GROUP1 } from './helpers/elementData'
import FlameTest from './helpers/FlameTest'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = {
    water: {
        label: 'Reaction with Water',
        equations: {
            Li: '2Li + 2H₂O → 2LiOH + H₂↑  (slow, no ignition)',
            Na: '2Na + 2H₂O → 2NaOH + H₂↑  (vigorous, H₂ may ignite)',
            K: '2K  + 2H₂O → 2KOH  + H₂↑  (violent, lilac flame)',
            Rb: '2Rb + 2H₂O → 2RbOH + H₂↑  (very violent)',
            Cs: '2Cs + 2H₂O → 2CsOH + H₂↑  (explosive)',
        },
        intensity: { Li: 0.2, Na: 0.55, K: 0.78, Rb: 0.90, Cs: 1.0 },
    },
    oxygen: {
        label: 'Reaction with O₂',
        equations: {
            Li: '4Li + O₂ → 2Li₂O  (normal oxide)',
            Na: '2Na + O₂ → Na₂O₂  (peroxide — excess O₂)',
            K: 'K  + O₂ → KO₂    (superoxide)',
            Rb: 'Rb + O₂ → RbO₂   (superoxide)',
            Cs: 'Cs + O₂ → CsO₂   (superoxide)',
        },
        intensity: { Li: 0.3, Na: 0.5, K: 0.7, Rb: 0.85, Cs: 1.0 },
    },
    hydrogen: {
        label: 'Reaction with H₂',
        equations: {
            Li: '2Li + H₂ → 2LiH  (lithium hydride, stable)',
            Na: '2Na + H₂ → 2NaH  (sodium hydride, moderate)',
            K: '2K  + H₂ → 2KH   (requires pressure)',
            Rb: '2Rb + H₂ → 2RbH  (requires pressure)',
            Cs: '2Cs + H₂ → 2CsH  (decomposes easily)',
        },
        intensity: { Li: 0.8, Na: 0.55, K: 0.35, Rb: 0.2, Cs: 0.1 },
    },
}

export default function AlkaliMetals() {
    const [selEl, setSelEl] = useState('Na')
    const [rxn, setRxn] = useState('water')
    const [mode, setMode] = useState('reactivity')   // reactivity | flame | trends

    const el = GROUP1.find(e => e.sym === selEl)
    const rx = REACTIONS[rxn]
    const inten = rx.intensity[selEl]

    // Trend property for bar chart
    const [trendProp, setTrendProp] = useState('Atomic radius (pm)')
    const TREND_VALS = {
        'Atomic radius (pm)': GROUP1.map(e => ({ sym: e.sym, v: e.AR })),
        'Ionisation energy': GROUP1.map(e => ({ sym: e.sym, v: e.IE1 })),
        'Melting point (°C)': GROUP1.map(e => ({ sym: e.sym, v: e.mp })),
        'Density (g/cm³)': GROUP1.map(e => ({ sym: e.sym, v: e.density })),
    }
    const tVals = TREND_VALS[trendProp]
    const maxV = Math.max(...tVals.map(v => v.v))

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'reactivity', l: 'Reactivity' },
                    { k: 'flame', l: 'Flame tests' },
                    { k: 'trends', l: 'Periodic trends' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Element selector — always visible */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {GROUP1.map(e => (
                    <button key={e.sym} onClick={() => setSelEl(e.sym)} style={{
                        flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: selEl === e.sym ? e.flameCol : 'var(--bg3)',
                        color: selEl === e.sym ? '#000' : 'var(--text2)',
                        border: `1px solid ${selEl === e.sym ? e.flameCol : 'var(--border)'}`,
                    }}>{e.sym}</button>
                ))}
            </div>

            {/* ── REACTIVITY ── */}
            {mode === 'reactivity' && (
                <div>
                    {/* Reaction selector */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {Object.entries(REACTIONS).map(([k, r]) => (
                            <button key={k} onClick={() => setRxn(k)} style={{
                                flex: 1, padding: '5px 8px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: rxn === k ? 'var(--teal)' : 'var(--bg3)',
                                color: rxn === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${rxn === k ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{r.label}</button>
                        ))}
                    </div>

                    {/* Equation display */}
                    <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--gold2)', letterSpacing: 0.5 }}>
                        {rx.equations[selEl]}
                    </div>

                    {/* Intensity meter */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>
                            REACTION INTENSITY — {selEl} with {rxn === 'hydrogen' ? 'H₂' : rxn === 'oxygen' ? 'O₂' : 'H₂O'}
                        </div>
                        <div style={{ height: 20, background: 'var(--bg3)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <div style={{
                                height: '100%', borderRadius: 10,
                                width: `${inten * 100}%`,
                                background: inten > 0.8 ? 'var(--coral)' : inten > 0.5 ? 'var(--gold)' : 'var(--teal)',
                                transition: 'width 0.4s',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            <span>mild</span><span>vigorous</span><span>explosive</span>
                        </div>
                    </div>

                    {/* All elements comparison bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            COMPARISON — ALL GROUP 1 ELEMENTS
                        </div>
                        {GROUP1.map(e => (
                            <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                onClick={() => setSelEl(e.sym)}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: e.flameCol, minWidth: 24 }}>{e.sym}</span>
                                <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', borderRadius: 7,
                                        width: `${rx.intensity[e.sym] * 100}%`,
                                        background: e.sym === selEl ? e.flameCol : `${e.flameCol}70`,
                                        transition: 'width 0.3s',
                                    }} />
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: e.sym === selEl ? e.flameCol : 'var(--text3)', minWidth: 60 }}>
                                    {e.rxnWater}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── FLAME TEST ── */}
            {mode === 'flame' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Alkali metals give characteristic <strong style={{ color: 'var(--gold)' }}>flame colours</strong> when their compounds are held in a flame — outer electrons get excited and emit light at specific wavelengths when they return to ground state.
                    </div>

                    {/* Flame animation row */}
                    <div style={{
                        display: 'flex', justifyContent: 'space-around', padding: '20px 10px', background: 'rgba(0,0,0,0.25)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 14 }}>
                        {
                            GROUP1.map(e => (
                                <div key={e.sym} style={{ textAlign: 'center', cursor: 'pointer' }}
                                    onClick={() => setSelEl(e.sym)}>
                                    <FlameTest color={e.flameCol} label={e.sym} active={selEl === e.sym} size={70} />
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                        {e.flameHex}
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                    {/* Selected element detail */}
                    <div style={{ padding: '14px 18px', background: `${el.flameCol}15`, border: `1px solid ${el.flameCol}40`, borderRadius: 10 }}>
                        <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: el.flameCol, marginBottom: 4 }}>
                            {el.name} — {el.flameHex}
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            Outer electron (ns¹) gets excited by flame energy → emits photon of specific wavelength when it returns to ground state.
                            <br />Used in <strong style={{ color: el.flameCol }}>flame photometry</strong> to detect and quantify alkali metals.
                        </div>
                    </div>
                </div>
            )}

            {/* ── TRENDS ── */}
            {mode === 'trends' && (
                <div>
                    {/* Property selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(TREND_VALS).map(p => (
                            <button key={p} onClick={() => setTrendProp(p)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: trendProp === p ? 'var(--teal)' : 'var(--bg3)',
                                color: trendProp === p ? '#fff' : 'var(--text2)',
                                border: `1px solid ${trendProp === p ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{p}</button>
                        ))}
                    </div>

                    {/* Interactive bar chart */}
                    <div style={{ marginBottom: 14 }}>
                        {tVals.map(({ sym, v }) => {
                            const e = GROUP1.find(x => x.sym === sym)
                            return (
                                <div key={sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                                    onClick={() => setSelEl(sym)}>
                                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: e.flameCol, minWidth: 24 }}>{sym}</span>
                                    <div style={{ flex: 1, height: 22, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', width: `${(v / maxV) * 100}%`,
                                            background: sym === selEl ? e.flameCol : `${e.flameCol}60`,
                                            borderRadius: 4, transition: 'width 0.3s',
                                            display: 'flex', alignItems: 'center', paddingLeft: 8,
                                        }}>
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>
                                                {v}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Group 1 trend — {trendProp}: {
                            ['Atomic radius (pm)', 'Density (g/cm³)'].includes(trendProp)
                                ? '↑ increases down the group'
                                : '↓ decreases down the group'
                        }
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Element" value={`${el.name} (${el.sym})`} color={el.flameCol} highlight />
                <ValueCard label="IE₁" value={`${el.IE1} kJ/mol`} color="var(--coral)" />
                <ValueCard label="Flame" value={el.flameHex} color={el.flameCol} />
                <ValueCard label="Density" value={`${el.density} g/cm³`} color="var(--teal)" />
            </div>
        </div>
    )
}