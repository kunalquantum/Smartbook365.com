import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const DATA = {
    // Period 2
    period2: [
        { sym: 'Li', Z: 3, AR: 167, IR_cat: 90, IR_an: null, group: 1 },
        { sym: 'Be', Z: 4, AR: 112, IR_cat: 59, IR_an: null, group: 2 },
        { sym: 'B', Z: 5, AR: 87, IR_cat: 41, IR_an: null, group: 13 },
        { sym: 'C', Z: 6, AR: 67, IR_cat: null, IR_an: null, group: 14 },
        { sym: 'N', Z: 7, AR: 56, IR_cat: null, IR_an: 146, group: 15 },
        { sym: 'O', Z: 8, AR: 48, IR_cat: null, IR_an: 126, group: 16 },
        { sym: 'F', Z: 9, AR: 42, IR_cat: null, IR_an: 119, group: 17 },
        { sym: 'Ne', Z: 10, AR: 38, IR_cat: null, IR_an: null, group: 18 },
    ],
    // Period 3
    period3: [
        { sym: 'Na', Z: 11, AR: 186, IR_cat: 116, IR_an: null, group: 1 },
        { sym: 'Mg', Z: 12, AR: 160, IR_cat: 86, IR_an: null, group: 2 },
        { sym: 'Al', Z: 13, AR: 143, IR_cat: 68, IR_an: null, group: 13 },
        { sym: 'Si', Z: 14, AR: 117, IR_cat: 54, IR_an: null, group: 14 },
        { sym: 'P', Z: 15, AR: 98, IR_cat: 58, IR_an: 212, group: 15 },
        { sym: 'S', Z: 16, AR: 88, IR_cat: null, IR_an: 170, group: 16 },
        { sym: 'Cl', Z: 17, AR: 79, IR_cat: null, IR_an: 167, group: 17 },
        { sym: 'Ar', Z: 18, AR: 71, IR_cat: null, IR_an: null, group: 18 },
    ],
    // Group 1
    group1: [
        { sym: 'Li', Z: 3, AR: 167, period: 2 },
        { sym: 'Na', Z: 11, AR: 186, period: 3 },
        { sym: 'K', Z: 19, AR: 227, period: 4 },
        { sym: 'Rb', Z: 37, AR: 248, period: 5 },
        { sym: 'Cs', Z: 55, AR: 265, period: 6 },
    ],
    // Group 17
    group17: [
        { sym: 'F', Z: 9, AR: 42, period: 2 },
        { sym: 'Cl', Z: 17, AR: 79, period: 3 },
        { sym: 'Br', Z: 35, AR: 114, period: 4 },
        { sym: 'I', Z: 53, AR: 133, period: 5 },
    ],
}

const ISOELECTRONIC = [
    { sym: 'N³⁻', e: 10, r: 146, col: '#378ADD' },
    { sym: 'O²⁻', e: 10, r: 126, col: '#D85A30' },
    { sym: 'F⁻', e: 10, r: 119, col: '#A8D8B9' },
    { sym: 'Ne', e: 10, r: 38, col: '#F5C4B3' },
    { sym: 'Na⁺', e: 10, r: 116, col: '#EF9F27' },
    { sym: 'Mg²⁺', e: 10, r: 86, col: '#FAC775' },
    { sym: 'Al³⁺', e: 10, r: 68, col: '#888780' },
]

export default function RadiusTrends() {
    const [tab, setTab] = useState('period')
    const [period, setPer] = useState('period3')
    const [group, setGrp] = useState('group1')
    const [showIon, setShowIon] = useState(false)

    // Period trend data
    const pData = DATA[period]
    const gData = DATA[group]
    const maxAR = Math.max(...pData.map(d => d.AR), ...gData.map(d => d.AR))

    // Bar chart helpers
    const BarRow = ({ sym, AR, IR, color, maxVal, isSelected, onClick }) => (
        <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}>
            <div style={{
                width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                background: `${color}20`, border: `1.5px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color,
            }}>{sym}</div>
            <div style={{ flex: 1 }}>
                {/* Atomic radius bar */}
                <div style={{ marginBottom: 3 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                        <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Atomic</span>
                        <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color }}>r = {AR} pm</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(AR / maxVal) * 100}%`, background: color, borderRadius: 4, transition: 'width 0.3s' }} />
                    </div>
                </div>
                {/* Ionic radius bar */}
                {showIon && IR && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                            <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Ionic</span>
                            <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: `${color}90` }}>r = {IR} pm</span>
                        </div>
                        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(IR / maxVal) * 100}%`, background: `${color}60`, borderRadius: 4 }} strokeDasharray="4 3" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

    const EL_COLORS = {
        H: '#A8D8B9', Li: '#EF9F27', Be: '#FAC775', B: '#888780',
        C: '#A8D8B9', N: '#378ADD', O: '#D85A30', F: '#A8D8B9', Ne: '#F5C4B3',
        Na: '#EF9F27', Mg: '#FAC775', Al: '#B4B2A9', Si: '#888780',
        P: '#A8D8B9', S: '#FAC775', Cl: '#A8D8B9', Ar: '#F5C4B3',
        K: '#EF9F27', Rb: '#EF9F27', Cs: '#EF9F27', Br: '#A8D8B9', I: '#7F77DD',
    }

    return (
        <div>
            {/* Tab */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'period', l: 'Across a period' },
                    { k: 'group', l: 'Down a group' },
                    { k: 'ionic', l: 'Ionic vs atomic' },
                    { k: 'iso', l: 'Isoelectronic series' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setTab(opt.k)} style={{
                        flex: 1, padding: '5px 6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: tab === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── PERIOD TREND ── */}
            {tab === 'period' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {['period2', 'period3'].map(p => (
                            <button key={p} onClick={() => setPer(p)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: period === p ? 'var(--teal)' : 'var(--bg3)',
                                color: period === p ? '#fff' : 'var(--text2)',
                                border: `1px solid ${period === p ? 'var(--teal)' : 'var(--border)'}`,
                            }}>Period {p.replace('period', '')}</button>
                        ))}
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Across a period → radius decreases.</span>
                        {' '}More protons added without new shells → stronger nuclear attraction pulls electrons closer.
                    </div>

                    {/* Visual atom size display */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ ATOM SIZE COMPARISON
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 8, height: 140 }}>
                            {pData.map(el => {
                                const maxR = Math.max(...pData.map(d => d.AR))
                                const r = (el.AR / maxR) * 56 + 8
                                const col = EL_COLORS[el.sym] || '#888'
                                return (
                                    <div key={el.sym} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                        <div style={{
                                            width: r * 2, height: r * 2, borderRadius: '50%',
                                            background: `${col}20`, border: `2px solid ${col}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: Math.max(8, r * 0.22), fontFamily: 'var(--mono)', fontWeight: 700, color: col,
                                        }}>{el.sym}</div>
                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{el.AR}pm</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Trend arrow */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8 }}>
                        <span style={{ fontSize: 13, color: 'var(--gold)' }}>←</span>
                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>Radius decreases →</span>
                        <div style={{ flex: 1, height: 4, background: 'linear-gradient(90deg, #EF9F27, #A8D8B9)', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>across period</span>
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        {pData.map(el => (
                            <BarRow key={el.sym} sym={el.sym}
                                AR={el.AR}
                                IR={el.IR_cat || el.IR_an}
                                color={EL_COLORS[el.sym] || '#888'}
                                maxVal={maxR => Math.max(...pData.map(d => d.AR))}
                                showIon={showIon} />
                        ))}
                    </div>
                </div>
            )}

            {/* ── GROUP TREND ── */}
            {tab === 'group' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {['group1', 'group17'].map(g => (
                            <button key={g} onClick={() => setGrp(g)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: group === g ? 'var(--amber,#EF9F27)' : 'var(--bg3)',
                                color: group === g ? '#000' : 'var(--text2)',
                                border: `1px solid ${group === g ? '#EF9F27' : 'var(--border)'}`,
                            }}>Group {g === 'group1' ? '1 (alkali metals)' : '17 (halogens)'}</button>
                        ))}
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Down a group → radius increases.</span>
                        {' '}Each new period adds a new electron shell → electrons farther from nucleus.
                    </div>

                    {/* Visual — stacked circles */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ SIZE INCREASES DOWN GROUP
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            {gData.map(el => {
                                const maxR = Math.max(...gData.map(d => d.AR))
                                const r = (el.AR / maxR) * 60 + 12
                                const col = EL_COLORS[el.sym] || '#888'
                                return (
                                    <div key={el.sym} style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: r * 2, height: r * 2, borderRadius: '50%',
                                            background: `${col}20`, border: `2px solid ${col}`,
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 6px',
                                            fontSize: Math.max(9, r * 0.18), fontFamily: 'var(--mono)', fontWeight: 700, color: col,
                                        }}>
                                            <div style={{ fontSize: 8, color: `${col}70` }}>P{el.period}</div>
                                            {el.sym}
                                        </div>
                                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{el.AR} pm</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Trend arrow (vertical) */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14, padding: '8px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>↓ Radius increases ↓</span>
                        <div style={{ flex: 1, height: 4, background: 'linear-gradient(90deg, #A8D8B9, #EF9F27)', borderRadius: 2 }} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>down group</span>
                    </div>

                    {gData.map(el => {
                        const maxR = Math.max(...gData.map(d => d.AR))
                        const col = EL_COLORS[el.sym] || '#888'
                        return (
                            <div key={el.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                                    background: `${col}20`, border: `1.5px solid ${col}`,
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: col,
                                }}>
                                    <div style={{ fontSize: 7, color: `${col}70` }}>P{el.period}</div>
                                    {el.sym}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: col }}>{el.AR} pm</span>
                                    </div>
                                    <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(el.AR / maxR) * 100}%`, background: col, borderRadius: 5 }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── IONIC vs ATOMIC ── */}
            {tab === 'ionic' && (
                <div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                        {/* Cations */}
                        <div style={{ padding: '14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 12 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 12 }}>
                                CATIONS — smaller than parent atom
                            </div>
                            {[
                                { sym: 'Na', AR: 186, IR: 116, col: '#EF9F27' },
                                { sym: 'Mg', AR: 160, IR: 86, col: '#FAC775' },
                                { sym: 'Al', AR: 143, IR: 68, col: '#B4B2A9' },
                                { sym: 'Fe', AR: 126, IR: 92, col: '#D85A30' },
                            ].map(el => {
                                const maxR = 200
                                return (
                                    <div key={el.sym} style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</span>
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>atom {el.AR}pm → ion {el.IR}pm</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            {/* Atom circle */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <div style={{
                                                    width: (el.AR / maxR) * 60 + 10, height: (el.AR / maxR) * 60 + 10,
                                                    borderRadius: '50%', background: `${el.col}20`, border: `2px solid ${el.col}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 9, fontFamily: 'var(--mono)', color: el.col, fontWeight: 700,
                                                }}>{el.sym}</div>
                                                <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>atom</div>
                                            </div>
                                            <span style={{ fontSize: 12, color: 'var(--text3)' }}>→</span>
                                            {/* Ion circle */}
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <div style={{
                                                    width: (el.IR / maxR) * 60 + 10, height: (el.IR / maxR) * 60 + 10,
                                                    borderRadius: '50%', background: `${el.col}15`, border: `2px dashed ${el.col}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 9, fontFamily: 'var(--mono)', color: el.col, fontWeight: 700,
                                                }}>{el.sym}⁺</div>
                                                <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>cation</div>
                                            </div>
                                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)' }}>
                                                −{el.AR - el.IR}pm
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.6, marginTop: 8 }}>
                                Losing electrons → fewer e⁻, same Z → electrons pulled closer → radius decreases
                            </div>
                        </div>

                        {/* Anions */}
                        <div style={{ padding: '14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.25)', borderRadius: 12 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 1.5, marginBottom: 12 }}>
                                ANIONS — larger than parent atom
                            </div>
                            {[
                                { sym: 'F', AR: 42, IR: 119, col: '#A8D8B9' },
                                { sym: 'Cl', AR: 79, IR: 167, col: '#1D9E75' },
                                { sym: 'O', AR: 48, IR: 126, col: '#D85A30' },
                                { sym: 'N', AR: 56, IR: 146, col: '#378ADD' },
                            ].map(el => {
                                const maxR = 180
                                return (
                                    <div key={el.sym} style={{ marginBottom: 12 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</span>
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>atom {el.AR}pm → ion {el.IR}pm</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <div style={{
                                                    width: (el.AR / maxR) * 60 + 10, height: (el.AR / maxR) * 60 + 10,
                                                    borderRadius: '50%', background: `${el.col}20`, border: `2px solid ${el.col}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 9, fontFamily: 'var(--mono)', color: el.col, fontWeight: 700,
                                                }}>{el.sym}</div>
                                                <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>atom</div>
                                            </div>
                                            <span style={{ fontSize: 12, color: 'var(--text3)' }}>→</span>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                                <div style={{
                                                    width: (el.IR / maxR) * 60 + 10, height: (el.IR / maxR) * 60 + 10,
                                                    borderRadius: '50%', background: `${el.col}10`, border: `2px dashed ${el.col}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: 9, fontFamily: 'var(--mono)', color: el.col, fontWeight: 700,
                                                }}>{el.sym}⁻</div>
                                                <div style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>anion</div>
                                            </div>
                                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD' }}>
                                                +{el.IR - el.AR}pm
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.6, marginTop: 8 }}>
                                Gaining electrons → more e⁻, same Z → weaker attraction per electron → radius increases
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── ISOELECTRONIC ── */}
            {tab === 'iso' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Isoelectronic series:</span> Species with the same number of electrons. All have 10 electrons here. As Z increases, nuclear attraction increases → radius decreases despite equal electron count.
                    </div>

                    {/* Circles visual */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ ALL HAVE 10 ELECTRONS — SIZE DECREASES AS Z INCREASES
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: 8 }}>
                            {ISOELECTRONIC.map(sp => {
                                const maxR = Math.max(...ISOELECTRONIC.map(s => s.r))
                                const r = (sp.r / maxR) * 50 + 12
                                return (
                                    <div key={sp.sym} style={{ textAlign: 'center' }}>
                                        <div style={{
                                            width: r * 2, height: r * 2, borderRadius: '50%',
                                            background: `${sp.col}20`, border: `2px solid ${sp.col}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 4px',
                                            fontSize: Math.max(9, r * 0.2), fontFamily: 'var(--mono)', fontWeight: 700, color: sp.col,
                                        }}>{sp.sym}</div>
                                        <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{sp.r} pm</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Bar chart */}
                    {ISOELECTRONIC.map((sp, i) => {
                        const maxR = Math.max(...ISOELECTRONIC.map(s => s.r))
                        return (
                            <div key={sp.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: sp.col, minWidth: 50 }}>{sp.sym}</span>
                                <div style={{ flex: 1, height: 12, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(sp.r / maxR) * 100}%`, background: sp.col, borderRadius: 4 }} />
                                </div>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: sp.col, minWidth: 54 }}>{sp.r} pm</span>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 60 }}>
                                    Z = {[7, 8, 9, 10, 11, 12, 13][i]}
                                </span>
                            </div>
                        )
                    })}

                    <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                        N³⁻ largest (Z=7, weakest pull) → Al³⁺ smallest (Z=13, strongest pull) — despite all having 10 electrons
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {tab === 'period' && [
                    { label: 'Trend', value: 'Decreases left → right', color: 'var(--teal)' },
                    { label: 'Reason', value: '↑ Z, same shell', color: 'var(--text2)' },
                    { label: 'Largest', value: `${pData[0].sym} (${pData[0].AR} pm)`, color: 'var(--gold)' },
                    { label: 'Smallest', value: `${pData[pData.length - 2].sym} (${pData[pData.length - 2].AR} pm)`, color: 'var(--coral)' },
                ].map(c => <ValueCard key={c.label} label={c.label} value={c.value} color={c.color} />)}
                {tab === 'group' && [
                    { label: 'Trend', value: 'Increases top → bottom', color: 'var(--gold)' },
                    { label: 'Reason', value: 'New shells added each period', color: 'var(--text2)' },
                    { label: 'Smallest', value: `${gData[0].sym} (${gData[0].AR} pm)`, color: 'var(--teal)' },
                    { label: 'Largest', value: `${gData[gData.length - 1].sym} (${gData[gData.length - 1].AR} pm)`, color: 'var(--coral)' },
                ].map(c => <ValueCard key={c.label} label={c.label} value={c.value} color={c.color} />)}
            </div>
        </div>
    )
}