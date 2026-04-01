import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const DATA = {
    group17: [
        { sym: 'F', Z: 9, EGE: -328, period: 2, col: '#1D9E75', anomaly: true, note: 'F is unexpectedly less negative than Cl due to extremely small 2p orbitals causing strong internal e⁻–e⁻ repulsion.' },
        { sym: 'Cl', Z: 17, EGE: -349, period: 3, col: '#1D9E75', note: 'Highest negative (most exothermic) EGE in the periodic table.' },
        { sym: 'Br', Z: 35, EGE: -325, period: 4, col: '#1D9E75' },
        { sym: 'I', Z: 53, EGE: -295, period: 5, col: '#1D9E75' },
    ],
    group16: [
        { sym: 'O', Z: 8, EGE: -141, period: 2, col: '#D85A30', anomaly: true, note: 'O is unexpectedly less negative than S due to its small size and high e⁻ density causing repulsion.' },
        { sym: 'S', Z: 16, EGE: -200, period: 3, col: '#D85A30' },
        { sym: 'Se', Z: 34, EGE: -195, period: 4, col: '#D85A30' },
        { sym: 'Te', Z: 52, EGE: -190, period: 5, col: '#D85A30' },
        { sym: 'Po', Z: 84, EGE: -174, period: 6, col: '#D85A30' },
    ],
    period3: [
        { sym: 'Na', Z: 11, group: '1', EGE: -53, col: '#EF9F27', note: 'Can gain 1e⁻ to form stable [Ne] core (Na⁻ is rare but exists).' },
        { sym: 'Mg', Z: 12, group: '2', EGE: 0, col: '#FAC775', note: 'Positive/nearly zero EGE. Added e⁻ must enter higher-energy 3p subshell (3s² is full).' },
        { sym: 'Al', Z: 13, group: '13', EGE: -43, col: '#B4B2A9' },
        { sym: 'Si', Z: 14, group: '14', EGE: -134, col: '#888780' },
        { sym: 'P', Z: 15, group: '15', EGE: -72, col: '#A8D8B9', note: 'Less negative than Si. Half-filled 3p³ is stable, so adding an e⁻ is less favourable.' },
        { sym: 'S', Z: 16, group: '16', EGE: -200, col: '#FAC775' },
        { sym: 'Cl', Z: 17, group: '17', EGE: -349, col: '#A8D8B9', note: 'Highest negative EGE. Only 1e⁻ away from stable noble gas core.' },
        { sym: 'Ar', Z: 18, group: '18', EGE: 96, POSITIVE: true, col: '#F5C4B3', note: 'Positive EGE (endothermic). Stable octet means added e⁻ must go to next principal shell (4s).' },
    ]
}

export default function ElectronGainEnthalpy() {
    const [tab, setTab] = useState('group17')
    const [selEl, setSelEl] = useState(null)

    const list = DATA[tab]
    const activeEl = selEl ? list.find(e => e.sym === selEl) : null

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'group17', l: 'Halogens (Group 17) anomaly' },
                    { k: 'group16', l: 'Chalcogens (Group 16) anomaly' },
                    { k: 'period3', l: 'Across Period 3' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => { setTab(opt.k); setSelEl(null) }} style={{
                        flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: tab === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Explanation box */}
            <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Electron Gain Enthalpy (ΔegH):</span> Energy change when an electron is added to a neutral gaseous atom. A more <strong style={{ color: '#378ADD' }}>negative</strong> value means the process is more exothermic (favourable).
            </div>

            {/* Main Visual */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 14 }}>
                    ⚗ ELECTRON GAIN ENTHALPY ΔegH (kJ/mol)
                </div>

                {tab.startsWith('group') ? (
                    // Group view — anomaly at top
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 16, height: 200, paddingBottom: 10 }}>
                            {list.map(el => {
                                const isPos = el.EGE > 0 || el.EGE === 0
                                const val = Math.abs(el.EGE)
                                const max = 350
                                const h = (val / max) * 150 + (isPos ? 10 : 0)
                                return (
                                    <div key={el.sym} onClick={() => setSelEl(el.sym === selEl ? null : el.sym)}
                                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                                        {/* Value label */}
                                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: isPos ? 'var(--coral)' : '#378ADD', fontWeight: 700, marginBottom: 4 }}>
                                            {isPos ? '+' : ''}{el.EGE}
                                        </div>
                                        {/* Bar */}
                                        <div style={{
                                            width: 44, height: h,
                                            background: isPos ? 'rgba(216,90,48,0.7)' : 'rgba(55,138,221,0.7)',
                                            border: `2px solid ${el.sym === selEl ? '#fff' : isPos ? 'var(--coral)' : '#378ADD'}`,
                                            borderRadius: '6px 6px 0 0',
                                            transition: 'all 0.2s', opacity: selEl && selEl !== el.sym ? 0.4 : 1,
                                            position: 'relative',
                                        }}>
                                            {el.anomaly && (
                                                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', fontSize: 14 }}>⚠️</div>
                                            )}
                                        </div>
                                        {/* X-axis label */}
                                        <div style={{ marginTop: 6, fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>
                                            {el.sym}
                                        </div>
                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                            Period {el.period}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // Period view
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {list.map(el => {
                                const isPos = el.EGE > 0 || el.EGE === 0
                                const val = Math.abs(el.EGE)
                                const max = 350
                                const w = (val / max) * 100
                                return (
                                    <div key={el.sym} onClick={() => setSelEl(el.sym === selEl ? null : el.sym)}
                                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: selEl && selEl !== el.sym ? 0.4 : 1 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 6,
                                            background: `${el.col}20`, border: `1.5px solid ${el.col}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col, flexShrink: 0
                                        }}>{el.sym}</div>

                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 26 }}>Gp {el.group}</div>

                                        <div style={{ flex: 1, position: 'relative', height: 16 }}>
                                            {/* Zero line */}
                                            <div style={{ position: 'absolute', left: '20%', top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />

                                            {/* Bar */}
                                            <div style={{
                                                position: 'absolute',
                                                top: 2, height: 12, borderRadius: 3,
                                                background: isPos ? 'var(--coral)' : '#378ADD',
                                                left: isPos ? '20%' : `calc(20% - ${w * 0.8}%)`,
                                                width: `${w * 0.8}%`,
                                            }} />
                                        </div>

                                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: isPos ? 'var(--coral)' : '#378ADD', minWidth: 40, textAlign: 'right' }}>
                                            {isPos ? '+' : ''}{el.EGE}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', textAlign: 'center', marginTop: 10 }}>Left = negative (exothermic), Right = positive (endothermic)</div>
                    </div>
                )}
            </div>

            {/* Selected Info Box */}
            {activeEl && (
                <div style={{ padding: '12px 16px', background: `${activeEl.col}12`, border: `1px solid ${activeEl.col}35`, borderRadius: 10, marginBottom: 14, minHeight: 60 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: activeEl.col }}>{activeEl.sym}</span>
                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: activeEl.EGE > 0 ? 'var(--coral)' : '#378ADD' }}>
                            ΔegH = {activeEl.EGE > 0 ? '+' : ''}{activeEl.EGE} kJ/mol
                        </span>
                    </div>
                    {activeEl.anomaly && (
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', background: 'rgba(216,90,48,0.1)', display: 'inline-block', padding: '2px 8px', borderRadius: 10, marginBottom: 6, border: '1px solid rgba(216,90,48,0.2)' }}>
                            ⚠️ ANOMALOUS VALUE
                        </div>
                    )}
                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        {activeEl.note}
                    </div>
                </div>
            )}

            {!activeEl && (
                <div style={{ padding: '16px', textAlign: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 14, fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    Click an element bar to see its detailed explanation
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Most negative ΔegH" value="Chlorine (−349 kJ/mol)" color="var(--teal)" highlight />
                <ValueCard label="Sign convention" value="Negative = Energy released" color="#378ADD" />
                <ValueCard label="Noble gases" value="Large positive values" color="var(--coral)" />
            </div>
        </div>
    )
}
