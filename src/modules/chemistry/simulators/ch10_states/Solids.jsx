import { useState } from 'react'
import { UNIT_CELLS } from './helpers/gasData'
import ValueCard from '../../components/ui/ValueCard'

const DEFECTS = [
    {
        name: 'Schottky defect',
        color: '#EF9F27',
        desc: 'Equal numbers of cations and anions missing from lattice sites. Found in compounds with similar-sized ions (NaCl, KCl). Density decreases. Electrical neutrality maintained.',
        example: 'NaCl, KBr, AgBr',
        effect: '↓ Density, ↑ electrical conductivity (vacancy migration)',
        type: 'stoichiometric',
    },
    {
        name: 'Frenkel defect',
        color: '#1D9E75',
        desc: 'An ion leaves its lattice site and occupies an interstitial position. Common when cation is much smaller than anion (AgCl, ZnS). Density unchanged. No electrical neutrality issue.',
        example: 'AgCl, AgBr, ZnS',
        effect: 'No density change, ↑ electrical conductivity',
        type: 'stoichiometric',
    },
    {
        name: 'F-centre (colour centre)',
        color: '#7F77DD',
        desc: 'Anionic vacancy occupied by trapped electrons. Gives characteristic colour to normally colourless crystals. E.g. NaCl heated in Na vapour gives yellow colour.',
        example: 'NaCl (yellow), KCl (violet), LiF (pink)',
        effect: 'Crystal becomes coloured, ↑ electrical conductivity',
        type: 'non-stoichiometric',
    },
    {
        name: 'Metal excess defect',
        color: '#D85A30',
        desc: 'Extra cations in interstitial sites with trapped electrons for neutrality. OR extra anion vacancies with electrons. Results in non-stoichiometric compounds. Often semiconductors.',
        example: 'ZnO (heated — Zn excess), Fe₁₋ₓO',
        effect: 'Non-stoichiometry, semiconducting property',
        type: 'non-stoichiometric',
    },
]

// Simple 2D unit cell drawings using HTML
function SCCell({ col }) {
    return (
        <div style={{ position: 'relative', width: 80, height: 80 }}>
            {/* 4 corner atoms (each ¼ visible) */}
            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y], i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: x * 68 - 12, top: y * 68 - 12,
                    width: 24, height: 24, borderRadius: '50%',
                    background: `${col}30`, border: `2px solid ${col}`,
                }} />
            ))}
            {/* Cell boundary */}
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, border: `1.5px dashed ${col}50` }} />
            <div style={{ position: 'absolute', bottom: -18, left: 0, right: 0, textAlign: 'center', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                8 × ⅛ = 1 atom
            </div>
        </div>
    )
}

function BCCCell({ col }) {
    return (
        <div style={{ position: 'relative', width: 80, height: 80 }}>
            {/* 4 corner atoms */}
            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y], i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: x * 68 - 12, top: y * 68 - 12,
                    width: 24, height: 24, borderRadius: '50%',
                    background: `${col}25`, border: `2px solid ${col}70`,
                }} />
            ))}
            {/* Centre atom */}
            <div style={{
                position: 'absolute', left: 28, top: 28,
                width: 24, height: 24, borderRadius: '50%',
                background: `${col}50`, border: `2px solid ${col}`,
            }} />
            <div style={{ position: 'absolute', bottom: -18, left: 0, right: 0, textAlign: 'center', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                8×⅛ + 1 = 2 atoms
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, border: `1.5px dashed ${col}50` }} />
        </div>
    )
}

function FCCCell({ col }) {
    return (
        <div style={{ position: 'relative', width: 80, height: 80 }}>
            {/* 4 corner atoms */}
            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([x, y], i) => (
                <div key={i} style={{
                    position: 'absolute',
                    left: x * 68 - 12, top: y * 68 - 12,
                    width: 24, height: 24, borderRadius: '50%',
                    background: `${col}20`, border: `2px solid ${col}60`,
                }} />
            ))}
            {/* 4 face-centre atoms (each ½ visible) */}
            {[[0.5, 0], [0, 0.5], [1, 0.5], [0.5, 1]].map(([x, y], i) => (
                <div key={`f${i}`} style={{
                    position: 'absolute',
                    left: x * 68 - 10, top: y * 68 - 10,
                    width: 20, height: 20, borderRadius: '50%',
                    background: `${col}45`, border: `2px solid ${col}`,
                }} />
            ))}
            <div style={{ position: 'absolute', bottom: -18, left: 0, right: 0, textAlign: 'center', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                8×⅛ + 6×½ = 4 atoms
            </div>
            <div style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, border: `1.5px dashed ${col}50` }} />
        </div>
    )
}

export default function Solids() {
    const [selUC, setSelUC] = useState('Face-centred cubic (FCC/CCP)')
    const [selDef, setSelDef] = useState(0)
    const [mode, setMode] = useState('unitcells')   // unitcells | defects

    const uc = UNIT_CELLS[selUC]
    const df = DEFECTS[selDef]

    return (
        <div>
            {/* Mode */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'unitcells', l: 'Unit cells & packing' }, { k: 'defects', l: 'Crystal defects' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── UNIT CELLS ── */}
            {mode === 'unitcells' && (
                <div>
                    {/* Cell selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.keys(UNIT_CELLS).map(k => (
                            <button key={k} onClick={() => setSelUC(k)} style={{
                                flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selUC === k ? UNIT_CELLS[k].color : 'var(--bg3)',
                                color: selUC === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${selUC === k ? UNIT_CELLS[k].color : 'var(--border)'}`,
                            }}>{k.split(' ')[0]} {k.split(' ')[1]}</button>
                        ))}
                    </div>

                    {/* All three cells side by side */}
                    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 20 }}>
                        {Object.entries(UNIT_CELLS).map(([k, v]) => (
                            <div key={k} style={{ textAlign: 'center', cursor: 'pointer', opacity: selUC === k ? 1 : 0.4, transition: 'opacity 0.2s' }}
                                onClick={() => setSelUC(k)}>
                                {k.includes('Simple') && <SCCell col={v.color} />}
                                {k.includes('Body') && <BCCCell col={v.color} />}
                                {k.includes('Face') && <FCCCell col={v.color} />}
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, marginTop: 22, fontWeight: 700 }}>
                                    {k.split(' (')[0].split(' ').slice(-1)[0]}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected cell info */}
                    <div style={{ padding: '14px 16px', background: `${uc.color}12`, border: `1px solid ${uc.color}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: uc.color, marginBottom: 8 }}>{selUC}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            {[
                                { label: 'Atoms per unit cell', val: uc.atomsPerCell, note: uc.fraction },
                                { label: 'Coordination number', val: uc.CN, note: 'nearest neighbours' },
                                { label: 'Packing efficiency', val: `${uc.PE}%`, note: uc.packingDesc },
                                { label: 'Relation r to a', val: uc.r_a, note: 'r = atomic radius' },
                                { label: 'Example elements', val: uc.example, note: '' },
                            ].map(p => (
                                <div key={p.label} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.label}</div>
                                    <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: uc.color }}>{p.val}</div>
                                    {p.note && <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{p.note}</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Packing efficiency comparison */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            PACKING EFFICIENCY COMPARISON
                        </div>
                        {Object.entries(UNIT_CELLS).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                onClick={() => setSelUC(k)}>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 40 }}>
                                    {k.match(/\(([^)]+)\)/)?.[1] || k.split(' ')[0]}
                                </span>
                                <div style={{ flex: 1, height: 16, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${v.PE}%`, background: k === selUC ? v.color : `${v.color}60`, borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 6 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>{v.PE}%</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 50 }}>CN = {v.CN}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── DEFECTS ── */}
            {mode === 'defects' && (
                <div>
                    {/* Defect selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {DEFECTS.map((d, i) => (
                            <button key={d.name} onClick={() => setSelDef(i)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selDef === i ? d.color : 'var(--bg3)',
                                color: selDef === i ? '#000' : 'var(--text2)',
                                border: `1px solid ${selDef === i ? d.color : 'var(--border)'}`,
                            }}>{d.name}</button>
                        ))}
                    </div>

                    {/* Defect visual — HTML grid representation */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: df.color, letterSpacing: 2, marginBottom: 12 }}>
                            ⚗ {df.name.toUpperCase()} — CRYSTAL LATTICE
                        </div>

                        {/* 5×5 grid of lattice sites */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, maxWidth: 240, margin: '0 auto', marginBottom: 8 }}>
                            {Array.from({ length: 25 }, (_, i) => {
                                const row = Math.floor(i / 5), col = i % 5
                                const isVacancy = selDef === 0 && ((i === 7) || (i === 17))   // Schottky
                                const isInterst = selDef === 1 && i === 12               // Frenkel interstitial
                                const isFSource = selDef === 1 && i === 7                // Frenkel source (empty)
                                const isF_ctr = selDef === 2 && i === 12               // F-centre
                                const isExcess = selDef === 3 && i === 12               // Metal excess
                                const isCat = (row + col) % 2 === 0
                                const col2 = isCat ? '#EF9F27' : '#378ADD'
                                return (
                                    <div key={i} style={{
                                        width: 36, height: 36, borderRadius: 8,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: isInterst || isExcess ? 10 : 11,
                                        fontFamily: 'var(--mono)', fontWeight: 700,
                                        background: isVacancy || isFSource ? 'rgba(255,255,255,0.04)' :
                                            isInterst ? `${df.color}40` :
                                                isF_ctr ? `${df.color}40` :
                                                    isExcess ? `${df.color}40` :
                                                        `${col2}20`,
                                        border: isVacancy || isFSource ? `1.5px dashed ${df.color}60` :
                                            isInterst || isF_ctr || isExcess ? `2px solid ${df.color}` :
                                                `1.5px solid ${col2}40`,
                                        color: isVacancy || isFSource ? df.color :
                                            isInterst ? df.color :
                                                isF_ctr ? df.color :
                                                    isExcess ? df.color : col2,
                                        transition: 'all 0.2s',
                                    }}>
                                        {isVacancy ? '□' :
                                            isFSource ? '□' :
                                                isInterst ? df.color === DEFECTS[1].color ? 'Ag⁺' : ' ' :
                                                    isF_ctr ? 'e⁻' :
                                                        isExcess ? 'M⁺' :
                                                            isCat ? (selDef === 0 ? 'Na' : 'Na') : 'Cl'}
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ textAlign: 'center', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            {selDef === 0 ? 'Two ion pairs missing (Schottky)' :
                                selDef === 1 ? 'Ag⁺ moves to interstitial site (Frenkel)' :
                                    selDef === 2 ? 'Electron trapped in anion vacancy (F-centre)' :
                                        'Extra M⁺ in interstitial position (metal excess)'}
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ padding: '12px 16px', background: `${df.color}10`, border: `1px solid ${df.color}30`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: df.color, marginBottom: 6 }}>{df.name}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 8 }}>{df.desc}</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                <strong style={{ color: df.color }}>Examples:</strong> {df.example}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                <strong style={{ color: df.color }}>Effect:</strong> {df.effect}
                            </div>
                            <div style={{
                                fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 8px', borderRadius: 20,
                                background: df.type === 'stoichiometric' ? 'rgba(29,158,117,0.12)' : 'rgba(216,90,48,0.12)',
                                color: df.type === 'stoichiometric' ? 'var(--teal)' : 'var(--coral)',
                                border: `1px solid ${df.type === 'stoichiometric' ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                            }}>{df.type}</div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {mode === 'unitcells' ? (
                    <>
                        <ValueCard label="Unit cell" value={selUC.split(' (')[0]} color={uc.color} highlight />
                        <ValueCard label="Atoms/cell" value={uc.atomsPerCell} color="var(--gold)" />
                        <ValueCard label="Coordination" value={`CN = ${uc.CN}`} color="var(--teal)" />
                        <ValueCard label="Packing eff." value={`${uc.PE}%`} color="var(--purple)" />
                    </>
                ) : (
                    <>
                        <ValueCard label="Defect" value={df.name} color={df.color} highlight />
                        <ValueCard label="Type" value={df.type} color="var(--teal)" />
                        <ValueCard label="Example" value={df.example.split(',')[0]} color="var(--gold)" />
                    </>
                )}
            </div>
        </div>
    )
}