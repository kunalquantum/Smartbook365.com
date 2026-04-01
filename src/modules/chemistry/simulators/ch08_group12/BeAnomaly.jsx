import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const TESTS = [
    {
        id: 'amphoteric',
        label: 'Amphoteric oxide',
        title: 'BeO reacts with BOTH acid and base',
        reactions: [
            { eq: 'BeO + H₂SO₄ → BeSO₄ + H₂O', note: 'Acts as BASE (reacts with acid)', col: 'var(--coral)' },
            { eq: 'BeO + 2NaOH → Na₂BeO₂ + H₂O', note: 'Acts as ACID (reacts with base)', col: 'var(--teal)' },
        ],
        contrast: 'MgO only reacts with acids (basic oxide, not amphoteric)',
        explanation: 'Be²⁺ is so small and highly charged that BeO has significant covalent character, giving it amphoteric behaviour — unlike other Group 2 oxides.',
    },
    {
        id: 'covalent',
        label: 'Covalent BeCl₂',
        title: 'BeCl₂ is covalent, not ionic',
        reactions: [
            { eq: 'BeCl₂: linear molecule (sp hybridised)', note: "Be²⁺ is tiny → high charge density → polarises Cl⁻ strongly (Fajan's rules)", col: 'var(--purple)' },
            { eq: 'BeCl₂ dissolves in organic solvents', note: 'Covalent character → soluble in organic solvents unlike ionic chlorides', col: 'var(--purple)' },
        ],
        contrast: 'MgCl₂, CaCl₂ are ionic — do not dissolve in organic solvents',
        explanation: "Be²⁺ has very high charge/radius ratio → extreme polarising power → distorts electron cloud of Cl⁻ → covalent bond (Fajan's rules).",
    },
    {
        id: 'nowater',
        label: 'No reaction with H₂O',
        title: 'Be does NOT react with water',
        reactions: [
            { eq: 'Be + H₂O → No reaction', note: 'Protective BeO layer prevents attack — like Al passivation', col: 'var(--gold)' },
            { eq: 'Be + steam → No reaction (even at high temp)', note: 'Unlike Mg which reacts with steam', col: 'var(--gold)' },
        ],
        contrast: 'Mg reacts with steam; Ca/Sr/Ba react with cold water readily',
        explanation: 'Be is coated by a thin, adherent BeO layer that is insoluble and prevents water from reaching the metal surface.',
    },
    {
        id: 'diag',
        label: 'Diagonal Be−Al',
        title: 'Be resembles Al more than Mg',
        reactions: [
            { eq: 'Al₂O₃ + NaOH → NaAlO₂ + H₂O  (amphoteric)', note: 'Al and Be both form amphoteric oxides', col: '#888780' },
            { eq: 'AlCl₃: covalent, Lewis acid', note: 'Both BeCl₂ and AlCl₃ are electron-deficient Lewis acids', col: '#888780' },
        ],
        contrast: 'Mg oxide is basic (not amphoteric). MgCl₂ is ionic.',
        explanation: 'Be (Group 2, Period 2) and Al (Group 13, Period 3) have similar charge density → similar polarising power → similar chemistry.',
    },
]

export default function BeAnomaly() {
    const [sel, setSel] = useState('amphoteric')
    const cur = TESTS.find(t => t.id === sel)

    // Interactive amphoteric demo
    const [pH, setPH] = useState(7)
    const isAcid = pH < 7, isBase = pH > 7, isNeut = pH === 7
    const reacts = pH !== 7
    const rxnText = isAcid
        ? 'BeO + H₂SO₄ → BeSO₄ + H₂O  (basic behaviour)'
        : isBase
            ? 'BeO + 2NaOH → Na₂BeO₂ + H₂O  (acidic behaviour)'
            : 'BeO: neutral medium — no reaction'

    return (
        <div>
            {/* Test selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {TESTS.map(t => (
                    <button key={t.id} onClick={() => setSel(t.id)} style={{
                        padding: '5px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: sel === t.id ? 'var(--gold)' : 'var(--bg3)',
                        color: sel === t.id ? '#000' : 'var(--text2)',
                        border: `1px solid ${sel === t.id ? 'var(--gold)' : 'var(--border)'}`,
                    }}>{t.label}</button>
                ))}
            </div>

            <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>
                {cur.title}
            </div>

            {/* Amphoteric interactive slider */}
            {sel === 'amphoteric' && (
                <div style={{ padding: '14px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, letterSpacing: 1 }}>
                        DRAG TO CHANGE MEDIUM — WATCH BeO REACT
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--coral)' }}>Acid</span>
                        <input type="range" min={0} max={14} step={1} value={pH} onChange={e => setPH(Number(e.target.value))}
                            style={{ flex: 1, accentColor: isAcid ? 'var(--coral)' : isBase ? 'var(--teal)' : 'var(--text3)' }} />
                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)' }}>Base</span>
                    </div>
                    <div style={{ textAlign: 'center', marginBottom: 10 }}>
                        <span style={{
                            fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700,
                            color: isAcid ? 'var(--coral)' : isBase ? 'var(--teal)' : 'var(--text3)',
                        }}>
                            pH = {pH}  ·  {isAcid ? 'Acidic medium' : isBase ? 'Basic medium' : 'Neutral — no reaction'}
                        </span>
                    </div>
                    <div style={{
                        padding: '10px 14px', borderRadius: 8,
                        background: reacts ? (isAcid ? 'rgba(216,90,48,0.1)' : 'rgba(29,158,117,0.1)') : 'rgba(0,0,0,0.2)',
                        border: `1px solid ${reacts ? (isAcid ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)') : 'var(--border)'}`,
                        fontFamily: 'var(--mono)', fontSize: 12,
                        color: reacts ? (isAcid ? 'var(--coral)' : 'var(--teal)') : 'var(--text3)',
                        transition: 'all 0.2s',
                    }}>
                        {rxnText}
                    </div>
                </div>
            )}

            {/* Reactions */}
            <div style={{ marginBottom: 14 }}>
                {cur.reactions.map((r, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: `${r.col}10`, border: `1px solid ${r.col}30`, borderRadius: 8, marginBottom: 8 }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: r.col, marginBottom: 4 }}>{r.eq}</div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.note}</div>
                    </div>
                ))}
            </div>

            {/* Contrast with Mg/Al */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 6 }}>BE (ANOMALOUS)</div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.6 }}>{cur.explanation}</div>
                </div>
                <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 6 }}>CONTRAST WITH Mg</div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{cur.contrast}</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Be anomaly" value={cur.label} color="var(--gold)" highlight />
                <ValueCard label="Charge/radius" value="High (like Al)" color="var(--purple)" />
                <ValueCard label="BeO character" value="Amphoteric" color="var(--teal)" />
                <ValueCard label="Diagonal pair" value="Be − Al" color="var(--gold)" />
            </div>
        </div>
    )
}