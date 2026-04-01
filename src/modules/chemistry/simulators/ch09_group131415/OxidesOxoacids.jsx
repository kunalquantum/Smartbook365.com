import { useState } from 'react'
import { N_OXIDES, P_OXOACIDS } from './helpers/groupData'
import ValueCard from '../../components/ui/ValueCard'

const PERIOD3_OXIDES = [
    { formula: 'Na₂O', element: 'Na', ON: +1, basic: true, acidic: false, ampho: false, col: '#EF9F27', eq: 'Na₂O + H₂O → 2NaOH' },
    { formula: 'MgO', element: 'Mg', ON: +2, basic: true, acidic: false, ampho: false, col: '#1D9E75', eq: 'MgO + H₂SO₄ → MgSO₄ + H₂O' },
    { formula: 'Al₂O₃', element: 'Al', ON: +3, basic: false, acidic: false, ampho: true, col: '#888780', eq: 'Al₂O₃ + H₂SO₄ → Al₂(SO₄)₃ + H₂O  AND  Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O' },
    { formula: 'SiO₂', element: 'Si', ON: +4, basic: false, acidic: true, ampho: false, col: '#7F77DD', eq: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O' },
    { formula: 'P₂O₅', element: 'P', ON: +5, basic: false, acidic: true, ampho: false, col: '#D85A30', eq: 'P₂O₅ + 3H₂O → 2H₃PO₄' },
    { formula: 'SO₃', element: 'S', ON: +6, basic: false, acidic: true, ampho: false, col: '#FAC775', eq: 'SO₃ + H₂O → H₂SO₄' },
    { formula: 'Cl₂O₇', element: 'Cl', ON: +7, basic: false, acidic: true, ampho: false, col: '#378ADD', eq: 'Cl₂O₇ + H₂O → 2HClO₄' },
]

const P_STRUCTURES = {
    'H₃PO₄': {
        atoms: [
            { sym: 'P', x: 100, y: 80, col: '#EF9F27', r: 14 },
            { sym: '=O', x: 100, y: 20, col: '#D85A30', r: 12, dbl: true },
            { sym: 'OH', x: 40, y: 100, col: '#D85A30', r: 13 },
            { sym: 'OH', x: 100, y: 140, col: '#D85A30', r: 13 },
            { sym: 'OH', x: 160, y: 100, col: '#D85A30', r: 13 },
        ],
        ionisable: 3, pHbonds: 0,
        note: '3 OH groups all ionisable. No P−H bonds.',
    },
    'H₃PO₃': {
        atoms: [
            { sym: 'P', x: 100, y: 80, col: '#1D9E75', r: 14 },
            { sym: '=O', x: 100, y: 20, col: '#D85A30', r: 12, dbl: true },
            { sym: 'OH', x: 40, y: 100, col: '#D85A30', r: 13 },
            { sym: 'OH', x: 160, y: 100, col: '#D85A30', r: 13 },
            { sym: 'H', x: 100, y: 148, col: '#A8D8B9', r: 10, pHbond: true },
        ],
        ionisable: 2, pHbonds: 1,
        note: '2 OH groups ionisable. 1 P−H bond (not ionisable).',
    },
    'H₃PO₂': {
        atoms: [
            { sym: 'P', x: 100, y: 80, col: '#378ADD', r: 14 },
            { sym: '=O', x: 100, y: 20, col: '#D85A30', r: 12, dbl: true },
            { sym: 'OH', x: 40, y: 100, col: '#D85A30', r: 13 },
            { sym: 'H', x: 100, y: 148, col: '#A8D8B9', r: 10, pHbond: true },
            { sym: 'H', x: 164, y: 90, col: '#A8D8B9', r: 10, pHbond: true },
        ],
        ionisable: 1, pHbonds: 2,
        note: '1 OH group ionisable. 2 P−H bonds (not ionisable).',
    },
}

export default function OxidesOxoacids() {
    const [mode, setMode] = useState('period3')
    const [selOx, setSelOx] = useState(3)   // index of period 3 oxide
    const [selNOx, setSelNOx] = useState(1)   // N oxide index
    const [selPAcid, setSelPAcid] = useState('H₃PO₄')

    const curOx = PERIOD3_OXIDES[selOx]
    const curNOx = N_OXIDES[selNOx]
    const pStr = P_STRUCTURES[selPAcid]
    const pAcid = P_OXOACIDS.find(p => p.formula === selPAcid)

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'period3', l: 'Period 3 oxide trend' },
                    { k: 'nitrogen', l: 'Oxides of N' },
                    { k: 'phosphorus', l: 'Oxoacids of P' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--coral)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--coral)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── PERIOD 3 OXIDES ── */}
            {mode === 'period3' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        Across Period 3: oxides change from <strong style={{ color: 'var(--teal)' }}>basic</strong> (metal oxides) → <strong style={{ color: '#888780' }}>amphoteric</strong> (Al₂O₃) → <strong style={{ color: 'var(--coral)' }}>acidic</strong> (non-metal oxides).
                    </div>

                    {/* Interactive oxide bar */}
                    <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                        {PERIOD3_OXIDES.map((ox, i) => (
                            <button key={ox.formula} onClick={() => setSelOx(i)} style={{
                                flex: 1, padding: '10px 4px', borderRadius: 8, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selOx === i ? ox.col : `${ox.col}20`,
                                color: selOx === i ? '#000' : ox.col,
                                border: `2px solid ${ox.col}`,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 11, marginBottom: 2 }}>{ox.formula}</div>
                                <div style={{ fontSize: 9, opacity: 0.7 }}>
                                    {ox.ampho ? 'amphoteric' : ox.basic ? 'basic' : 'acidic'}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Colour gradient band */}
                    <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                        {['#1D9E75', '#1D9E75', '#888780', '#D85A30', '#D85A30', '#D85A30', '#D85A30'].map((c, i) => (
                            <div key={i} style={{ flex: 1, background: c, opacity: 0.7 }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 14 }}>
                        <span style={{ color: 'var(--teal)' }}>← Basic</span>
                        <span style={{ color: '#888780' }}>Amphoteric</span>
                        <span style={{ color: 'var(--coral)' }}>Acidic →</span>
                    </div>

                    {/* Selected oxide info */}
                    <div style={{ padding: '14px 16px', background: `${curOx.col}12`, border: `1px solid ${curOx.col}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                            <div>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: curOx.col }}>{curOx.formula}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Oxidation state of {curOx.element}: {curOx.ON >= 0 ? '+' : ''}{curOx.ON}</div>
                            </div>
                            <div style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700,
                                background: curOx.ampho ? '#88878020' : curOx.basic ? 'rgba(29,158,117,0.15)' : 'rgba(216,90,48,0.15)',
                                color: curOx.ampho ? '#888780' : curOx.basic ? 'var(--teal)' : 'var(--coral)',
                                border: `1px solid ${curOx.ampho ? '#88878050' : curOx.basic ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                            }}>
                                {curOx.ampho ? 'Amphoteric' : curOx.basic ? 'Basic oxide' : 'Acidic oxide'}
                            </div>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.6 }}>{curOx.eq}</div>
                    </div>

                    {/* Oxidation state trend bar */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>OXIDATION STATE OF ELEMENT IN OXIDE</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden', padding: '0 4px' }}>
                            {PERIOD3_OXIDES.map((ox, i) => (
                                <div key={ox.formula} style={{
                                    height: 10, flex: ox.ON, borderRadius: 5,
                                    background: i === selOx ? ox.col : `${ox.col}60`,
                                    transition: 'all 0.3s', cursor: 'pointer',
                                }} onClick={() => setSelOx(i)} />
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            {PERIOD3_OXIDES.map(ox => (
                                <span key={ox.formula} style={{ color: ox.col }}>+{ox.ON}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── NITROGEN OXIDES ── */}
            {mode === 'nitrogen' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {N_OXIDES.map((ox, i) => (
                            <button key={ox.formula} onClick={() => setSelNOx(i)} style={{
                                flex: 1, padding: '6px', borderRadius: 8, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selNOx === i ? ox.col : `${ox.col}15`,
                                color: selNOx === i ? '#000' : ox.col,
                                border: `1px solid ${ox.col}`,
                            }}>{ox.formula}</button>
                        ))}
                    </div>

                    <div style={{ padding: '14px 16px', background: `${curNOx.col}12`, border: `1px solid ${curNOx.col}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                            <div>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: curNOx.col }}>{curNOx.formula}</div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{curNOx.name}</div>
                            </div>
                            <div style={{
                                padding: '4px 14px', borderRadius: 20, fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700,
                                background: curNOx.acid ? 'rgba(216,90,48,0.15)' : 'var(--bg3)',
                                color: curNOx.acid ? 'var(--coral)' : 'var(--text3)',
                                border: `1px solid ${curNOx.acid ? 'rgba(216,90,48,0.3)' : 'var(--border)'}`,
                                alignSelf: 'flex-start',
                            }}>
                                {curNOx.acid ? 'Acidic' : 'Neutral'}  ·  N = {curNOx.ON >= 0 ? '+' : ''}{curNOx.ON}
                            </div>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.6 }}>{curNOx.desc}</div>
                    </div>

                    {/* ON trend bar */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            OXIDATION STATE OF N — higher ON = more acidic
                        </div>
                        {N_OXIDES.map((ox, i) => (
                            <div key={ox.formula} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                onClick={() => setSelNOx(i)}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: ox.col, minWidth: 44 }}>{ox.formula}</span>
                                <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(ox.ON / 5) * 100}%`, background: i === selNOx ? ox.col : `${ox.col}60`, borderRadius: 7, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.8)', fontWeight: 700 }}>N = +{ox.ON}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: ox.acid ? 'var(--coral)' : 'var(--text3)', minWidth: 50 }}>
                                    {ox.acid ? 'acidic' : 'neutral'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── P OXOACIDS ── */}
            {mode === 'phosphorus' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Key rule:</strong> Basicity of P oxoacids = number of <strong>OH groups</strong> (not total H atoms). P−H bonds are <strong>NOT ionisable</strong>. Count only O−H groups for basicity.
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {P_OXOACIDS.map(p => (
                            <button key={p.formula} onClick={() => setSelPAcid(p.formula)} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 13,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selPAcid === p.formula ? p.color : `${p.color}15`,
                                color: selPAcid === p.formula ? '#000' : p.color,
                                border: `1px solid ${p.color}`,
                            }}>{p.formula}</button>
                        ))}
                    </div>

                    {pAcid && pStr && (
                        <div>
                            {/* Structure visual using HTML — no SVG coordinate pain */}
                            <div style={{ padding: '14px 16px', background: `${pAcid.color}10`, border: `1px solid ${pAcid.color}30`, borderRadius: 10, marginBottom: 14 }}>
                                <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: pAcid.color, marginBottom: 6 }}>{pAcid.formula} — {pAcid.name}</div>

                                {/* Central P with bonds shown */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                                    {/* =O above */}
                                    <div style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: '#D85A30', background: 'rgba(216,90,48,0.12)', border: '1px solid rgba(216,90,48,0.3)' }}>
                                        ‖O (P=O double bond)
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>|</div>
                                    {/* P centre */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {/* OH groups */}
                                        {Array.from({ length: pStr.ionisable }, (_, i) => (
                                            <div key={i} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', background: 'rgba(29,158,117,0.12)', border: '1px solid rgba(29,158,117,0.3)' }}>
                                                OH ✓
                                            </div>
                                        ))}
                                        <div style={{ padding: '4px 14px', borderRadius: 20, fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: pAcid.color, background: `${pAcid.color}20`, border: `2px solid ${pAcid.color}` }}>
                                            P
                                        </div>
                                        {/* P-H bonds */}
                                        {Array.from({ length: pStr.pHbonds }, (_, i) => (
                                            <div key={i} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', textDecoration: 'line-through' }}>
                                                H ✗
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', textAlign: 'center', lineHeight: 1.6 }}>
                                    {pStr.note}
                                </div>
                            </div>

                            {/* Basicity comparison */}
                            <div style={{ marginBottom: 14 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                                    BASICITY = IONISABLE OH GROUPS
                                </div>
                                {P_OXOACIDS.map(p => (
                                    <div key={p.formula} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                        onClick={() => setSelPAcid(p.formula)}>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.color, minWidth: 60 }}>{p.formula}</span>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            {Array.from({ length: 3 }, (_, i) => {
                                                const isOH = i < p.basicity
                                                const isPH = i >= p.basicity && i < 3
                                                return (
                                                    <div key={i} style={{
                                                        width: 32, height: 24, borderRadius: 6,
                                                        fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        background: isOH ? 'rgba(29,158,117,0.15)' : 'var(--bg3)',
                                                        color: isOH ? 'var(--teal)' : 'var(--text3)',
                                                        border: `1px solid ${isOH ? 'rgba(29,158,117,0.4)' : 'var(--border)'}`,
                                                    }}>
                                                        {isOH ? 'OH' : 'PH'}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.color }}>
                                            {p.basicity}-protic
                                        </span>
                                        {p.pBonds > 0 && (
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                                ({p.pBonds} P−H bond{p.pBonds > 1 ? 's' : ''} — not ionisable)
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Period 3 trend" value="Basic → Amphoteric → Acidic" color="var(--coral)" highlight />
                <ValueCard label="N oxides" value="+1 to +5 (all known)" color="#378ADD" />
                <ValueCard label="P oxoacid rule" value="Basicity = OH count (not total H)" color="var(--gold)" />
            </div>
        </div>
    )
}