import { useState } from 'react'
import { FUNCTIONAL_GROUPS } from './helpers/organicData'
import ValueCard from '../../components/ui/ValueCard'

// Draw a simple structural diagram using HTML flex — no broken SVG coordinates
function StructureDiagram({ group, color }) {
    const ATOMS = {
        'Alkane': [['C', 'C', 'C'], ['|', '|', '|'], ['H', 'H', 'H']],
        'Alkene': [['C', '=', 'C', '−', 'C']],
        'Alkyne': [['C', '≡', 'C', '−', 'C']],
        'Alcohol': [['C', '−', 'O', '−', 'H']],
        'Aldehyde': [['C', '−', 'C', '=', 'O'], ['', '', '', '', 'H']],
        'Ketone': [['C', '−', 'C', '−', 'C'], ['', '', '‖', '', ''], ['', '', 'O', '', '']],
        'Carboxylic acid': [['C', '−', 'C', '−', 'O', '−', 'H'], ['', '', '‖', '', '', '', ''], ['', '', 'O', '', '', '', '']],
        'Amine': [['C', '−', 'N', '−', 'H'], ['', '', '|', '', ''], ['', '', 'H', '', '']],
        'Ester': [['C', '−', 'C', '−', 'O', '−', 'C'], ['', '', '‖', '', '', '', ''], ['', '', 'O', '', '', '', '']],
    }

    return (
        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 10, border: `1px solid ${color}30` }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                STRUCTURAL FORMULA
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 16, fontWeight: 700, color, lineHeight: 1.8, letterSpacing: 2 }}>
                {group.formula}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                {group.example}
            </div>
        </div>
    )
}

export default function FunctionalGroups() {
    const [sel, setSel] = useState('Alkene')
    const [tab, setTab] = useState('properties')   // properties | reactions | compare

    const fg = FUNCTIONAL_GROUPS[sel]

    // Properties comparison across all groups
    const COMPARE_PROPS = Object.entries(FUNCTIONAL_GROUPS).map(([k, v]) => ({
        name: k, color: v.color,
        hBond: ['Alcohol', 'Carboxylic acid', 'Amine'].includes(k),
        polar: !['Alkane', 'Alkene', 'Alkyne'].includes(k),
        reactive: !['Alkane'].includes(k),
        acidic: ['Carboxylic acid', 'Alkyne'].includes(k),
    }))

    return (
        <div>
            {/* Functional group grid selector */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginBottom: 14 }}>
                {Object.keys(FUNCTIONAL_GROUPS).map(k => {
                    const v = FUNCTIONAL_GROUPS[k]
                    return (
                        <button key={k} onClick={() => setSel(k)} style={{
                            padding: '8px 6px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                            background: sel === k ? `${v.color}25` : 'var(--bg3)',
                            border: `2px solid ${sel === k ? v.color : 'var(--border)'}`,
                            transition: 'all 0.15s',
                        }}>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: v.color }}>{v.formula.split(' ')[0]}</div>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{k}</div>
                        </button>
                    )
                })}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'properties', l: 'Properties' }, { k: 'reactions', l: 'Reactions' }, { k: 'compare', l: 'Compare all' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? fg.color : 'var(--bg3)',
                        color: tab === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? fg.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── PROPERTIES ── */}
            {tab === 'properties' && (
                <div>
                    <StructureDiagram group={fg} color={fg.color} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
                        {[
                            { label: 'Suffix', val: fg.suffix, col: fg.color },
                            { label: 'Hybridisation', val: fg.hybridisation, col: 'var(--gold)' },
                            { label: 'Bond type', val: fg.bond, col: fg.color },
                            { label: 'Example', val: fg.exName, col: 'var(--text2)' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col }}>{p.val}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 10, padding: '10px 14px', background: `${fg.color}10`, border: `1px solid ${fg.color}25`, borderRadius: 8 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>PHYSICAL PROPERTIES</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>{fg.properties}</div>
                    </div>

                    {/* Property tiles */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'H-bonding', yes: ['Alcohol', 'Carboxylic acid', 'Amine'].includes(sel), col: '#378ADD' },
                            { label: 'Polar', yes: !['Alkane', 'Alkene', 'Alkyne'].includes(sel), col: 'var(--purple)' },
                            { label: 'Reactive', yes: sel !== 'Alkane', col: 'var(--coral)' },
                            { label: 'Acidic H', yes: ['Carboxylic acid', 'Alkyne'].includes(sel), col: '#D85A30' },
                        ].map(p => (
                            <div key={p.label} style={{
                                padding: '5px 12px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', fontWeight: 700,
                                background: p.yes ? `${p.col}20` : 'var(--bg3)',
                                color: p.yes ? p.col : 'var(--text3)',
                                border: `1px solid ${p.yes ? `${p.col}50` : 'var(--border)'}`,
                            }}>
                                {p.yes ? '✓' : '✗'} {p.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── REACTIONS ── */}
            {tab === 'reactions' && (
                <div>
                    <div style={{ padding: '10px 14px', background: `${fg.color}10`, border: `1px solid ${fg.color}30`, borderRadius: 8, marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: fg.color }}>
                            {sel} — key reactions
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {fg.reactions.map((rxn, i) => (
                            <div key={rxn} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: 'var(--bg3)', border: `1px solid ${fg.color}20`, borderRadius: 8, alignItems: 'center' }}>
                                <div style={{
                                    width: 26, height: 26, borderRadius: '50%',
                                    background: `${fg.color}25`, border: `1.5px solid ${fg.color}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: fg.color, flexShrink: 0,
                                }}>{i + 1}</div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', fontWeight: 600 }}>{rxn}</div>
                            </div>
                        ))}
                    </div>

                    {/* Specific reaction equations */}
                    {sel === 'Alkene' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { eq: 'CH₂=CH₂ + HBr → CH₃CH₂Br  (Markovnikov)', col: '#1D9E75' },
                                { eq: 'CH₂=CH₂ + H₂ →(Pt) CH₃CH₃  (hydrogenation)', col: '#EF9F27' },
                                { eq: 'CH₂=CH₂ + Br₂ → BrCH₂CH₂Br  (addition)', col: '#D85A30' },
                                { eq: 'nCH₂=CH₂ → −(CH₂CH₂)ₙ−  (polymerisation)', col: '#7F77DD' },
                            ].map(r => (
                                <div key={r.eq} style={{ padding: '8px 12px', background: `${r.col}10`, border: `1px solid ${r.col}25`, borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: r.col }}>
                                    {r.eq}
                                </div>
                            ))}
                        </div>
                    )}
                    {sel === 'Alcohol' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { eq: 'CH₃CH₂OH →(H₂SO₄,170°C) CH₂=CH₂ + H₂O  (dehydration)', col: '#378ADD' },
                                { eq: 'CH₃CH₂OH + CH₃COOH ⇌ CH₃COOC₂H₅ + H₂O  (esterification)', col: '#1D9E75' },
                                { eq: 'CH₃CH₂OH →(K₂Cr₂O₇) CH₃CHO →(oxidation) CH₃COOH', col: '#D85A30' },
                            ].map(r => (
                                <div key={r.eq} style={{ padding: '8px 12px', background: `${r.col}10`, border: `1px solid ${r.col}25`, borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: r.col }}>
                                    {r.eq}
                                </div>
                            ))}
                        </div>
                    )}
                    {sel === 'Carboxylic acid' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {[
                                { eq: 'RCOOH + NaOH → RCOONa + H₂O  (neutralisation)', col: 'var(--coral)' },
                                { eq: 'RCOOH + R\'OH ⇌ RCOOR\' + H₂O  (esterification)', col: '#1D9E75' },
                                { eq: 'RCOONa + NaOH →(CaO,heat) RH + Na₂CO₃  (decarboxylation)', col: '#EF9F27' },
                            ].map(r => (
                                <div key={r.eq} style={{ padding: '8px 12px', background: `${r.col === 'var(--coral)' ? 'rgba(216,90,48' : r.col.includes('1D9E75') ? 'rgba(29,158,117' : 'rgba(239,159,39'}.08)`, border: `1px solid ${r.col}25`, borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: r.col }}>
                                    {r.eq}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── COMPARE ALL ── */}
            {tab === 'compare' && (
                <div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
                            <thead>
                                <tr>
                                    {['Group', 'Formula', 'H-bond', 'Polar', 'Suffix', 'Hybridisation'].map(h => (
                                        <th key={h} style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.3)', color: 'var(--text3)', fontSize: 10, textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(FUNCTIONAL_GROUPS).map(([k, v]) => (
                                    <tr key={k} style={{ cursor: 'pointer', background: sel === k ? `${v.color}10` : 'transparent' }}
                                        onClick={() => setSel(k)}>
                                        <td style={{ padding: '6px 10px', color: v.color, fontWeight: 700 }}>{k}</td>
                                        <td style={{ padding: '6px 10px', color: 'var(--text2)' }}>{v.formula.split(' ')[0]}</td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', color: ['Alcohol', 'Carboxylic acid', 'Amine'].includes(k) ? 'var(--teal)' : 'var(--text3)' }}>
                                            {['Alcohol', 'Carboxylic acid', 'Amine'].includes(k) ? '✓' : '✗'}
                                        </td>
                                        <td style={{ padding: '6px 10px', textAlign: 'center', color: !['Alkane', 'Alkene', 'Alkyne'].includes(k) ? 'var(--purple)' : 'var(--text3)' }}>
                                            {!['Alkane', 'Alkene', 'Alkyne'].includes(k) ? '✓' : '✗'}
                                        </td>
                                        <td style={{ padding: '6px 10px', color: v.color }}>{v.suffix}</td>
                                        <td style={{ padding: '6px 10px', color: 'var(--text2)' }}>{v.hybridisation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Group" value={sel} color={fg.color} highlight />
                <ValueCard label="Suffix" value={fg.suffix} color={fg.color} />
                <ValueCard label="Hybridisation" value={fg.hybridisation} color="var(--gold)" />
                <ValueCard label="Reactions" value={`${fg.reactions.length} key reactions`} color="var(--teal)" />
            </div>
        </div>
    )
}