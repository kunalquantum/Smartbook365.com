import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const IE_DATA = {
    period2: [
        { sym: 'Li', Z: 3, IE1: 520, IE2: 7298, IE3: 11815, col: '#EF9F27', anomaly: false, config: '[He] 2s¹' },
        { sym: 'Be', Z: 4, IE1: 899, IE2: 1757, IE3: 14848, col: '#FAC775', anomaly: false, config: '[He] 2s²' },
        {
            sym: 'B', Z: 5, IE1: 800, IE2: 2427, IE3: 3660, col: '#888780', anomaly: true, config: '[He] 2s²2p¹',
            note: 'IE₁(B) < IE₁(Be): B loses 2p¹ (easier) while Be loses 2s² (harder)'
        },
        { sym: 'C', Z: 6, IE1: 1086, IE2: 2352, IE3: 4620, col: '#A8D8B9', anomaly: false, config: '[He] 2s²2p²' },
        { sym: 'N', Z: 7, IE1: 1402, IE2: 2856, IE3: 4578, col: '#378ADD', anomaly: false, config: '[He] 2s²2p³' },
        {
            sym: 'O', Z: 8, IE1: 1314, IE2: 3388, IE3: 5300, col: '#D85A30', anomaly: true, config: '[He] 2s²2p⁴',
            note: 'IE₁(O) < IE₁(N): O has a paired 2p electron with extra repulsion → easier to remove'
        },
        { sym: 'F', Z: 9, IE1: 1681, IE2: 3374, IE3: 6050, col: '#A8D8B9', anomaly: false, config: '[He] 2s²2p⁵' },
        { sym: 'Ne', Z: 10, IE1: 2081, IE2: 3952, IE3: 6122, col: '#F5C4B3', anomaly: false, config: '[He] 2s²2p⁶' },
    ],
    period3: [
        { sym: 'Na', Z: 11, IE1: 496, IE2: 4562, IE3: 6912, col: '#EF9F27', anomaly: false, config: '[Ne] 3s¹' },
        { sym: 'Mg', Z: 12, IE1: 738, IE2: 1451, IE3: 7733, col: '#FAC775', anomaly: false, config: '[Ne] 3s²' },
        {
            sym: 'Al', Z: 13, IE1: 577, IE2: 1817, IE3: 2745, col: '#B4B2A9', anomaly: true, config: '[Ne] 3s²3p¹',
            note: 'IE₁(Al) < IE₁(Mg): Al loses 3p¹ (easier) while Mg loses from filled 3s² (stable)'
        },
        { sym: 'Si', Z: 14, IE1: 786, IE2: 1577, IE3: 3232, col: '#888780', anomaly: false, config: '[Ne] 3s²3p²' },
        { sym: 'P', Z: 15, IE1: 1012, IE2: 1907, IE3: 2914, col: '#A8D8B9', anomaly: false, config: '[Ne] 3s²3p³' },
        {
            sym: 'S', Z: 16, IE1: 1000, IE2: 2252, IE3: 3357, col: '#FAC775', anomaly: true, config: '[Ne] 3s²3p⁴',
            note: 'IE₁(S) < IE₁(P): S has a paired 3p electron with extra repulsion → easier to remove'
        },
        { sym: 'Cl', Z: 17, IE1: 1251, IE2: 2297, IE3: 3822, col: '#A8D8B9', anomaly: false, config: '[Ne] 3s²3p⁵' },
        { sym: 'Ar', Z: 18, IE1: 1521, IE2: 2666, IE3: 3931, col: '#F5C4B3', anomaly: false, config: '[Ne] 3s²3p⁶' },
    ],
}

const GROUP1_IE = [
    { sym: 'Li', IE1: 520, IE2: 7298, col: '#EF9F27' },
    { sym: 'Na', IE1: 496, IE2: 4562, col: '#EF9F27' },
    { sym: 'K', IE1: 419, IE2: 3051, col: '#EF9F27' },
    { sym: 'Rb', IE1: 403, IE2: 2633, col: '#EF9F27' },
    { sym: 'Cs', IE1: 376, IE2: 2234, col: '#EF9F27' },
]

export default function IonisationEnthalpy() {
    const [period, setPeriod] = useState('period2')
    const [tab, setTab] = useState('bar')       // bar | successive | group | anomaly
    const [selected, setSelected] = useState(null)
    const [showIE2, setShowIE2] = useState(false)

    const data = IE_DATA[period]
    const selEl = selected ? data.find(d => d.sym === selected) : null
    const maxIE1 = Math.max(...data.map(d => d.IE1))
    const maxIE2 = Math.max(...data.map(d => d.IE2))

    return (
        <div>
            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'bar', l: 'IE₁ bar chart' },
                    { k: 'successive', l: 'Successive IEs' },
                    { k: 'group', l: 'Down Group 1' },
                    { k: 'anomaly', l: 'Anomaly explained' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setTab(opt.k)} style={{
                        flex: 1, padding: '5px 6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--coral)' : 'var(--bg3)',
                        color: tab === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--coral)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── BAR CHART ── */}
            {tab === 'bar' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {['period2', 'period3'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: period === p ? 'var(--coral)' : 'var(--bg3)',
                                color: period === p ? '#fff' : 'var(--text2)',
                                border: `1px solid ${period === p ? 'var(--coral)' : 'var(--border)'}`,
                            }}>Period {p.replace('period', '')}</button>
                        ))}
                        <button onClick={() => setShowIE2(p => !p)} style={{
                            padding: '5px 12px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: showIE2 ? 'rgba(127,119,221,0.2)' : 'var(--bg3)',
                            color: showIE2 ? 'var(--purple)' : 'var(--text2)',
                            border: `1px solid ${showIE2 ? 'rgba(127,119,221,0.4)' : 'var(--border)'}`,
                        }}>Show IE₂</button>
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--coral)', fontWeight: 700 }}>Generally increases across period</span> — more protons pull electrons tighter. But anomalies at B/Al (lose a p electron, easier than s) and O/S (paired p electron, extra repulsion).
                    </div>

                    {/* Bar chart */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 2, marginBottom: 14 }}>
                            ⚗ IE₁ (kJ/mol) ACROSS {period === 'period2' ? 'PERIOD 2' : 'PERIOD 3'}
                        </div>

                        {data.map((el, i) => {
                            const prev = i > 0 ? data[i - 1] : null
                            const isDrop = prev && el.IE1 < prev.IE1
                            return (
                                <div key={el.sym}
                                    onClick={() => setSelected(selected === el.sym ? null : el.sym)}
                                    style={{ marginBottom: 10, cursor: 'pointer' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</span>
                                            {el.anomaly && (
                                                <span style={{
                                                    fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--coral)',
                                                    background: 'rgba(216,90,48,0.15)', padding: '1px 6px', borderRadius: 20,
                                                    border: '1px solid rgba(216,90,48,0.3)',
                                                }}>⚠ anomaly</span>
                                            )}
                                            {isDrop && (
                                                <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>↓ drops here</span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: el.col, fontWeight: 700 }}>{el.IE1} kJ/mol</span>
                                    </div>
                                    {/* IE1 bar */}
                                    <div style={{ height: 12, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden', marginBottom: showIE2 ? 3 : 0 }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${(el.IE1 / maxIE1) * 100}%`,
                                            background: selected === el.sym ? el.col : `${el.col}70`,
                                            borderRadius: 4, transition: 'width 0.3s',
                                        }} />
                                    </div>
                                    {/* IE2 bar */}
                                    {showIE2 && (
                                        <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${(el.IE2 / Math.max(...data.map(d => d.IE2))) * 100}%`,
                                                background: `${el.col}35`,
                                                borderRadius: 4,
                                            }} />
                                        </div>
                                    )}
                                    {/* Anomaly note */}
                                    {selected === el.sym && el.anomaly && (
                                        <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                                            {el.note}
                                        </div>
                                    )}
                                    {/* Config */}
                                    {selected === el.sym && (
                                        <div style={{ marginTop: 4, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                            Config: {el.config}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── SUCCESSIVE IEs ── */}
            {tab === 'successive' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {data.map(el => (
                            <button key={el.sym} onClick={() => setSelected(el.sym)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selected === el.sym ? el.col : 'var(--bg3)',
                                color: selected === el.sym ? '#000' : 'var(--text2)',
                                border: `1px solid ${selected === el.sym ? el.col : 'var(--border)'}`,
                            }}>{el.sym}</button>
                        ))}
                    </div>

                    {selEl ? (
                        <div>
                            <div style={{ padding: '10px 14px', background: `${selEl.col}10`, border: `1px solid ${selEl.col}30`, borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                                <span style={{ color: selEl.col, fontWeight: 700 }}>{selEl.sym}</span>
                                {' '}({selEl.config}) — IE₁ = {selEl.IE1} · IE₂ = {selEl.IE2} · IE₃ = {selEl.IE3}
                            </div>

                            {[
                                { label: 'IE₁', val: selEl.IE1, col: 'var(--teal)' },
                                { label: 'IE₂', val: selEl.IE2, col: 'var(--gold)' },
                                { label: 'IE₃', val: selEl.IE3, col: 'var(--coral)' },
                            ].map((ie, i) => {
                                const maxV = selEl.IE3
                                const jump = i > 0
                                    ? ([selEl.IE1, selEl.IE2, selEl.IE3][i] / [selEl.IE1, selEl.IE2, selEl.IE3][i - 1])
                                    : 1
                                const bigJump = jump > 4
                                return (
                                    <div key={ie.label} style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: ie.col }}>{ie.label}</span>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                {bigJump && i > 0 && (
                                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', background: 'rgba(216,90,48,0.15)', padding: '1px 8px', borderRadius: 20, border: '1px solid rgba(216,90,48,0.3)' }}>
                                                        ×{jump.toFixed(1)} jump! — noble gas config broken
                                                    </span>
                                                )}
                                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: ie.col, fontWeight: 700 }}>{ie.val} kJ/mol</span>
                                            </div>
                                        </div>
                                        <div style={{ height: 14, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(ie.val / maxV) * 100}%`, background: ie.col, borderRadius: 5, transition: 'width 0.3s' }} />
                                        </div>
                                    </div>
                                )
                            })}

                            <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                                Successive IEs always increase. A very large jump between IEₙ and IEₙ₊₁ reveals the number of valence electrons (n). For {selEl.sym} (group {selEl.Z <= 10 ? (selEl.Z <= 4 ? selEl.Z - 2 : selEl.Z - 10) : selEl.Z - 10}) the jump comes after IE{selEl.Z <= 4 ? selEl.Z - 2 : (selEl.Z <= 10 ? selEl.Z - 10 : selEl.Z - 18)}.
                            </div>
                        </div>
                    ) : (
                        <div style={{ padding: 24, textAlign: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                            Select an element to see its successive ionisation enthalpies
                        </div>
                    )}
                </div>
            )}

            {/* ── DOWN GROUP 1 ── */}
            {tab === 'group' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Down Group 1 → IE₁ decreases.</span>
                        {' '}Outer electron in higher shell → farther from nucleus, better shielded → easier to remove. IE₂ &gt;&gt; IE₁ always (removes from noble gas configuration).
                    </div>

                    {GROUP1_IE.map(el => {
                        const max1 = Math.max(...GROUP1_IE.map(d => d.IE1))
                        const max2 = Math.max(...GROUP1_IE.map(d => d.IE2))
                        return (
                            <div key={el.sym} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                        IE₁={el.IE1}  IE₂={el.IE2} kJ/mol
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>IE₁</div>
                                        <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(el.IE1 / max1) * 100}%`, background: el.col, borderRadius: 4 }} />
                                        </div>
                                    </div>
                                    <div style={{ flex: 2 }}>
                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>IE₂ (always much larger)</div>
                                        <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(el.IE2 / max2) * 100}%`, background: `${el.col}50`, borderRadius: 4 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginTop: 10 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                            Note: IE₂/IE₁ ratio for all alkali metals is ~10–15× — removing the 2nd electron breaks into the noble gas core.
                        </div>
                    </div>
                </div>
            )}

            {/* ── ANOMALY ── */}
            {tab === 'anomaly' && (
                <div>
                    {[
                        {
                            title: 'Anomaly 1: IE₁(B) < IE₁(Be)  and  IE₁(Al) < IE₁(Mg)',
                            color: '#EF9F27',
                            explanation: `Be: [He] 2s² — full 2s subshell, extra stability\nB:  [He] 2s²2p¹ — lone 2p electron, poorly shielded by 2s²`,
                            energies: [{ sym: 'Be', IE: 899, col: '#FAC775' }, { sym: 'B', IE: 800, col: '#888780' }],
                            reason: 'B loses its 2p¹ electron which is higher energy (less tightly held) than Be\'s 2s² electrons. The 2p electron is also more effectively shielded by the inner 2s electrons.',
                        },
                        {
                            title: 'Anomaly 2: IE₁(O) < IE₁(N)  and  IE₁(S) < IE₁(P)',
                            color: '#D85A30',
                            explanation: `N: [He] 2s²2p³ — half-filled 2p (3 unpaired e⁻, extra stable)\nO: [He] 2s²2p⁴ — one paired 2p orbital, extra e⁻–e⁻ repulsion`,
                            energies: [{ sym: 'N', IE: 1402, col: '#378ADD' }, { sym: 'O', IE: 1314, col: '#D85A30' }],
                            reason: 'Oxygen has 4 electrons in 3 × 2p orbitals — one orbital must be doubly occupied. The paired electrons repel each other, making one easier to remove. Nitrogen\'s half-filled 2p is extra stable.',
                        },
                    ].map((anom, ai) => (
                        <div key={ai} style={{ marginBottom: 16, padding: '14px 16px', background: `${anom.color}08`, border: `1px solid ${anom.color}30`, borderRadius: 12 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: anom.color, marginBottom: 10 }}>
                                {anom.title}
                            </div>

                            {/* IE bars */}
                            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                                {anom.energies.map(el => (
                                    <div key={el.sym} style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</span>
                                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: el.col }}>{el.IE} kJ/mol</span>
                                        </div>
                                        <div style={{ height: 14, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(el.IE / 1500) * 100}%`, background: el.col, borderRadius: 5 }} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Configuration comparison */}
                            <pre style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 10, background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '8px 12px', whiteSpace: 'pre-wrap' }}>
                                {anom.explanation}
                            </pre>

                            {/* Orbital boxes */}
                            <div style={{ marginBottom: 10 }}>
                                {anom.energies.map(el => {
                                    const isN_or_Be = el.sym === 'N' || el.sym === 'Be'
                                    const nPaired = (el.sym === 'O' || el.sym === 'S') ? 1 : ((el.sym === 'B' || el.sym === 'Al') ? 0 : 0)
                                    const nBoxes = (el.sym === 'Be' || el.sym === 'Mg') ? 1 : ((el.sym === 'B' || el.sym === 'Al') ? 3 : 3)
                                    const nElec = el.sym === 'Be' ? 2 : (el.sym === 'B' ? 1 : (el.sym === 'N' ? 3 : 4))
                                    return (
                                        <div key={el.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col, minWidth: 24 }}>{el.sym}</span>
                                            <div style={{ display: 'flex', gap: 3 }}>
                                                {Array.from({ length: nBoxes }, (_, i) => {
                                                    const hasUp = i < nElec
                                                    const hasDown = el.sym === 'O' || el.sym === 'S' ? i === 0 : false
                                                    return (
                                                        <div key={i} style={{
                                                            width: 32, height: 32, borderRadius: 5,
                                                            background: `${el.col}12`, border: `1.5px solid ${el.col}40`,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: 13,
                                                        }}>
                                                            {hasUp ? <span style={{ color: el.col }}>↑</span> : null}
                                                            {hasDown ? <span style={{ color: `${el.col}60`, marginLeft: 2 }}>↓</span> : null}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {(el.sym === 'O' || el.sym === 'S') && (
                                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)' }}>← paired e⁻ repulsion</span>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7, padding: '8px 12px', background: 'rgba(0,0,0,0.15)', borderRadius: 6 }}>
                                {anom.reason}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="General trend" value="Increases across period" color="var(--coral)" />
                {tab === 'bar' && <ValueCard label="Anomaly 1" value="B<Be, Al<Mg (p < s)" color="var(--gold)" />}
                {tab === 'bar' && <ValueCard label="Anomaly 2" value="O<N, S<P (paired e⁻)" color="var(--coral)" />}
                <ValueCard label="Down group" value="IE₁ decreases" color="var(--teal)" />
            </div>
        </div>
    )
}