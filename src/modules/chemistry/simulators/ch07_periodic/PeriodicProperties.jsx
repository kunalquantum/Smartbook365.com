import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const PERIOD3 = [
    {
        sym: 'Na', Z: 11, group: 1, block: 's',
        metallic: 'very high', oxide: 'Na₂O', oxideType: 'strongly basic',
        oxideColor: '#EF9F27', hydride: 'NaH',
        reaction: '2Na + 2H₂O → 2NaOH + H₂ (violent)',
        valency: 1, mp: 98, bp: 883, col: '#EF9F27',
        config: '[Ne] 3s¹',
    },
    {
        sym: 'Mg', Z: 12, group: 2, block: 's',
        metallic: 'high', oxide: 'MgO', oxideType: 'basic',
        oxideColor: '#FAC775', hydride: 'MgH₂',
        reaction: 'Mg + 2H₂O → Mg(OH)₂ + H₂ (slow, steam)',
        valency: 2, mp: 650, bp: 1090, col: '#FAC775',
        config: '[Ne] 3s²',
    },
    {
        sym: 'Al', Z: 13, group: 13, block: 'p',
        metallic: 'moderate', oxide: 'Al₂O₃', oxideType: 'amphoteric',
        oxideColor: '#888780', hydride: 'AlH₃',
        reaction: '2Al + 6HCl → 2AlCl₃ + 3H₂ (slow in HCl)',
        valency: 3, mp: 660, bp: 2519, col: '#B4B2A9',
        config: '[Ne] 3s²3p¹',
    },
    {
        sym: 'Si', Z: 14, group: 14, block: 'p',
        metallic: 'low (metalloid)', oxide: 'SiO₂', oxideType: 'weakly acidic',
        oxideColor: '#7F77DD', hydride: 'SiH₄',
        reaction: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O',
        valency: 4, mp: 1414, bp: 3265, col: '#888780',
        config: '[Ne] 3s²3p²',
    },
    {
        sym: 'P', Z: 15, group: 15, block: 'p',
        metallic: 'none (non-metal)', oxide: 'P₄O₁₀', oxideType: 'acidic',
        oxideColor: '#A8D8B9', hydride: 'PH₃',
        reaction: 'P₄O₁₀ + 6H₂O → 4H₃PO₄',
        valency: 3 / 5, mp: 44, bp: 280, col: '#A8D8B9',
        config: '[Ne] 3s²3p³',
    },
    {
        sym: 'S', Z: 16, group: 16, block: 'p',
        metallic: 'none', oxide: 'SO₃', oxideType: 'acidic',
        oxideColor: '#FAC775', hydride: 'H₂S',
        reaction: 'SO₃ + H₂O → H₂SO₄',
        valency: 2 / 4 / 6, mp: 113, bp: 445, col: '#FAC775',
        config: '[Ne] 3s²3p⁴',
    },
    {
        sym: 'Cl', Z: 17, group: 17, block: 'p',
        metallic: 'none', oxide: 'Cl₂O₇', oxideType: 'strongly acidic',
        oxideColor: '#D85A30', hydride: 'HCl',
        reaction: 'Cl₂O₇ + H₂O → 2HClO₄',
        valency: 1 / 3 / 5 / 7, mp: -101, bp: -34, col: '#A8D8B9',
        config: '[Ne] 3s²3p⁵',
    },
    {
        sym: 'Ar', Z: 18, group: 18, block: 'p',
        metallic: 'none', oxide: 'none', oxideType: 'none',
        oxideColor: '#888780', hydride: 'none',
        reaction: 'Inert — no reactions',
        valency: 0, mp: -189, bp: -186, col: '#F5C4B3',
        config: '[Ne] 3s²3p⁶',
    },
]

const OXIDE_ORDER = ['strongly basic', 'basic', 'amphoteric', 'weakly acidic', 'acidic', 'strongly acidic', 'none']
const OXIDE_COLORS = {
    'strongly basic': '#EF9F27',
    'basic': '#FAC775',
    'amphoteric': '#888780',
    'weakly acidic': '#7F77DD',
    'acidic': '#A8D8B9',
    'strongly acidic': '#D85A30',
    'none': 'rgba(160,176,200,0.2)',
}

export default function PeriodicProperties() {
    const [tab, setTab] = useState('oxide')
    const [selEl, setSelEl] = useState('Al')
    const [prop, setProp] = useState('metallic')

    const sel = PERIOD3.find(e => e.sym === selEl)

    return (
        <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'oxide', l: 'Oxide character' },
                    { k: 'metallic', l: 'Metallic character' },
                    { k: 'valency', l: 'Valency trends' },
                    { k: 'reactions', l: 'Reactions with H₂O' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setTab(opt.k)} style={{
                        flex: 1, padding: '5px 6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: tab === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── OXIDE CHARACTER ── */}
            {tab === 'oxide' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Across Period 3:</span> Oxide character shifts from <strong style={{ color: '#EF9F27' }}>strongly basic (Na₂O)</strong> → <strong style={{ color: '#888780' }}>amphoteric (Al₂O₃)</strong> → <strong style={{ color: '#D85A30' }}>strongly acidic (Cl₂O₇)</strong> as metallic character decreases and non-metallic character increases.
                    </div>

                    {/* Oxide spectrum bar */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ height: 28, borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 8 }}>
                            {PERIOD3.filter(e => e.oxideType !== 'none').map(el => (
                                <div key={el.sym} style={{
                                    flex: 1, background: OXIDE_COLORS[el.oxideType] || 'var(--bg3)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: 'rgba(0,0,0,0.7)',
                                    cursor: 'pointer',
                                    border: selEl === el.sym ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                                }} onClick={() => setSelEl(el.sym)}>
                                    {el.sym}
                                </div>
                            ))}
                        </div>
                        {/* Labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', padding: '0 4px' }}>
                            <span style={{ color: '#EF9F27' }}>← Strongly basic</span>
                            <span style={{ color: '#888780' }}>Amphoteric</span>
                            <span style={{ color: '#D85A30' }}>Strongly acidic →</span>
                        </div>
                    </div>

                    {/* Element cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                        {PERIOD3.map(el => (
                            <div key={el.sym}
                                onClick={() => setSelEl(el.sym)}
                                style={{
                                    padding: '10px', borderRadius: 10, cursor: 'pointer',
                                    background: selEl === el.sym ? `${OXIDE_COLORS[el.oxideType] || 'rgba(160,176,200,0.1)'}30` : 'var(--bg3)',
                                    border: `1.5px solid ${selEl === el.sym ? (OXIDE_COLORS[el.oxideType] || 'var(--border)') : 'var(--border)'}`,
                                    textAlign: 'center',
                                }}>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col }}>{el.sym}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: OXIDE_COLORS[el.oxideType] || 'var(--text3)', marginTop: 3 }}>
                                    {el.oxide}
                                </div>
                                <div style={{
                                    fontSize: 9, fontFamily: 'var(--mono)',
                                    color: 'rgba(255,255,255,0.7)',
                                    background: OXIDE_COLORS[el.oxideType] || 'rgba(160,176,200,0.15)',
                                    padding: '2px 5px', borderRadius: 20, marginTop: 4, display: 'inline-block',
                                }}>
                                    {el.oxideType || '—'}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected element detail */}
                    {sel && (
                        <div style={{ padding: '14px 16px', background: `${OXIDE_COLORS[sel.oxideType] || 'rgba(160,176,200,0.1)'}12`, border: `1.5px solid ${OXIDE_COLORS[sel.oxideType] || 'var(--border)'}40`, borderRadius: 12, marginBottom: 14 }}>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: sel.col, marginBottom: 8 }}>
                                {sel.sym} — Oxide: {sel.oxide} ({sel.oxideType})
                            </div>
                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                                {sel.reaction}
                            </div>
                            {sel.oxideType === 'amphoteric' && (
                                <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)', padding: '6px 10px', background: 'rgba(212,160,23,0.08)', borderRadius: 6 }}>
                                    Al₂O₃ + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂O  (reacts as base)
                                    <br />Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O  (reacts as acid)
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* ── METALLIC CHARACTER ── */}
            {tab === 'metallic' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Metallic character decreases across Period 3</span> — as nuclear charge increases, atoms hold electrons more tightly → tendency to lose electrons decreases → less metallic. Na is a reactive metal; Cl is a reactive non-metal.
                    </div>

                    {/* Metallic scale visual */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ METALLIC → NON-METALLIC ACROSS PERIOD 3
                        </div>

                        {/* Gradient bar */}
                        <div style={{ height: 16, borderRadius: 8, background: 'linear-gradient(90deg, #EF9F27, #FAC775, #B4B2A9, #888780, #A8D8B9, #FAC775, #1D9E75, #F5C4B3)', marginBottom: 16 }} />

                        {/* Properties grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 4 }}>
                            {PERIOD3.map(el => (
                                <div key={el.sym} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '100%', aspectRatio: '1',
                                        borderRadius: 6, marginBottom: 4,
                                        background: `${el.col}20`,
                                        border: `1.5px solid ${el.col}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col,
                                    }}>{el.sym}</div>
                                    <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.3 }}>
                                        {el.metallic}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Melting points */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            MELTING POINTS — reflect bonding type
                        </div>
                        {PERIOD3.map(el => {
                            const maxMP = 1414
                            const absMP = Math.abs(el.mp)
                            const isNeg = el.mp < 0
                            return (
                                <div key={el.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col, minWidth: 24 }}>{el.sym}</span>
                                    <div style={{ flex: 1, height: 10, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(absMP / maxMP) * 100}%`, background: isNeg ? 'rgba(55,138,221,0.5)' : el.col, borderRadius: 4 }} />
                                    </div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: el.col, minWidth: 60 }}>{el.mp}°C</span>
                                </div>
                            )
                        })}
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 8, lineHeight: 1.6 }}>
                            Na/Mg/Al: metallic bonding (variable MP). Si: giant covalent (highest MP). P/S/Cl/Ar: simple molecular (low MP) — only van der Waals forces between molecules.
                        </div>
                    </div>
                </div>
            )}

            {/* ── VALENCY ── */}
            {tab === 'valency' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Valency across Period 3</span> first increases from 1→4 (Na→Si), then the pattern reverses as non-metals form multiple valencies. Non-metals also have variable valency (P: 3,5; S: 2,4,6; Cl: 1,3,5,7) using d orbitals for expanded octets.
                    </div>

                    {/* Valency visual */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2, marginBottom: 14 }}>
                            ⚗ VALENCY ELECTRONS AND BONDING
                        </div>
                        {PERIOD3.map(el => {
                            const valelectrons = el.group <= 12 ? el.group : el.group - 10
                            const bonds = Math.min(valelectrons, 8 - valelectrons)
                            return (
                                <div key={el.sym} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: '8px 10px', background: `${el.col}08`, border: `1px solid ${el.col}20`, borderRadius: 8 }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                                        background: `${el.col}20`, border: `1.5px solid ${el.col}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col,
                                    }}>{el.sym}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)', fontWeight: 600 }}>
                                            {el.config}
                                        </div>
                                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                            Valency: {String(el.valency)}  ·  Hydride: {el.hydride}
                                        </div>
                                    </div>
                                    {/* Electron dot visualisation */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, maxWidth: 60 }}>
                                        {Array.from({ length: el.group > 12 ? el.group - 10 : el.group }, (_, i) => (
                                            <div key={i} style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: el.col, opacity: 0.7,
                                            }} />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── REACTIONS WITH H₂O ── */}
            {tab === 'reactions' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: '#378ADD', fontWeight: 700 }}>Reactivity with water</span> decreases across Period 3. Na and Mg react; Al is passivated by oxide layer; Si/P/S/Cl don't react with water directly but their oxides do.
                    </div>

                    {PERIOD3.map(el => {
                        const intensity = el.sym === 'Na' ? 1 : el.sym === 'Mg' ? 0.7 : el.sym === 'Al' ? 0.3 : 0.1
                        const reacts = el.sym === 'Na' || el.sym === 'Mg' || el.sym === 'Al'
                        return (
                            <div key={el.sym} style={{ marginBottom: 10, padding: '12px 14px', background: `${el.col}08`, border: `1px solid ${el.col}25`, borderRadius: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 5,
                                        background: `${el.col}20`, border: `1.5px solid ${el.col}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col,
                                        flexShrink: 0,
                                    }}>{el.sym}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: el.col, marginBottom: 2 }}>
                                            {el.reaction}
                                        </div>
                                    </div>
                                    {/* Reactivity intensity bar */}
                                    <div style={{ width: 60 }}>
                                        <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2, textAlign: 'right' }}>reactivity</div>
                                        <div style={{ height: 6, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${intensity * 100}%`, background: el.col, borderRadius: 3 }} />
                                        </div>
                                    </div>
                                </div>
                                {/* Product acidity */}
                                {reacts && (
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', paddingLeft: 42 }}>
                                        Product: {el.sym === 'Na' ? 'NaOH (strongly basic, pH≈14)' : el.sym === 'Mg' ? 'Mg(OH)₂ (weakly basic)' : 'Al(OH)₃ (amphoteric)'}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Period 3 trend" value="Na→Ar: metal→non-metal" color="var(--gold)" highlight />
                <ValueCard label="Oxide character" value="Basic → Amphoteric → Acidic" color="var(--teal)" />
                <ValueCard label="Amphoteric oxide" value="Al₂O₃ (reacts as acid+base)" color="#888780" />
                <ValueCard label="IE trend" value="Increases across period" color="var(--coral)" />
            </div>
        </div>
    )
}