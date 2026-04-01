import { useState, useEffect, useRef } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = [
    {
        name: 'Zn + CuSO₄',
        eq: 'Zn + Cu²⁺ → Zn²⁺ + Cu',
        oxidised: { species: 'Zn', ONbefore: 0, ONafter: +2, label: 'Zn', color: '#EF9F27', desc: 'Zinc loses 2 electrons' },
        reduced: { species: 'Cu²⁺', ONbefore: +2, ONafter: 0, label: 'Cu²⁺', color: '#D85A30', desc: 'Copper ion gains 2 electrons' },
        nE: 2,
        context: 'Classic displacement reaction. Zinc is the reducing agent; Cu²⁺ is the oxidising agent.',
    },
    {
        name: 'Fe + HCl',
        eq: 'Fe + 2H⁺ → Fe²⁺ + H₂',
        oxidised: { species: 'Fe', ONbefore: 0, ONafter: +2, label: 'Fe', color: '#D85A30', desc: 'Iron loses 2 electrons' },
        reduced: { species: 'H⁺', ONbefore: +1, ONafter: 0, label: 'H⁺', color: '#A8D8B9', desc: 'Hydrogen ions gain electrons' },
        nE: 2,
        context: 'Iron dissolves in acid. Iron is oxidised; H⁺ is reduced to H₂ gas.',
    },
    {
        name: 'Na + H₂O',
        eq: '2Na + 2H₂O → 2NaOH + H₂',
        oxidised: { species: 'Na', ONbefore: 0, ONafter: +1, label: 'Na', color: '#EF9F27', desc: 'Sodium loses 1 electron' },
        reduced: { species: 'H⁺', ONbefore: +1, ONafter: 0, label: 'H⁺', color: '#A8D8B9', desc: 'Hydrogen ions gain electrons' },
        nE: 1,
        context: 'Vigorous reaction. Sodium is a strong reducing agent; water acts as oxidising agent.',
    },
    {
        name: 'MnO₄⁻ + Fe²⁺',
        eq: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
        oxidised: { species: 'Fe²⁺', ONbefore: +2, ONafter: +3, label: 'Fe²⁺', color: '#D85A30', desc: 'Iron(II) loses 1 electron per ion' },
        reduced: { species: 'MnO₄⁻', ONbefore: +7, ONafter: +2, label: 'Mn', color: '#7F77DD', desc: 'Manganese gains 5 electrons' },
        nE: 5,
        context: 'Permanganate titration. Mn goes from +7 to +2 (purple → colourless).',
    },
    {
        name: 'Cl₂ + NaOH (disp.)',
        eq: 'Cl₂ + 2NaOH → NaCl + NaOCl + H₂O',
        oxidised: { species: 'Cl₂', ONbefore: 0, ONafter: +1, label: 'Cl(OCl)', color: '#1D9E75', desc: 'Half of Cl₂ is oxidised to +1' },
        reduced: { species: 'Cl₂', ONbefore: 0, ONafter: -1, label: 'Cl(NaCl)', color: '#378ADD', desc: 'Half of Cl₂ is reduced to −1' },
        nE: 1,
        context: 'Disproportionation — Cl₂ is both oxidised and reduced simultaneously.',
    },
]

export default function OxidationReduction() {
    const [rxnIdx, setRxnIdx] = useState(0)
    const [phase, setPhase] = useState('before')  // before | transfer | after
    const [running, setRunning] = useState(false)
    const [ePos, setEPos] = useState(0)          // 0→1 electron transfer progress
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    const rxn = REACTIONS[rxnIdx]

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setEPos(p => {
                const next = p + 0.008
                if (next >= 1) {
                    setPhase('after'); setRunning(false)
                    return 1
                }
                return next
            })
            setTick(x => x + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const reset = () => {
        setPhase('before'); setEPos(0); setRunning(false)
        tRef.current = 0; lastRef.current = null
    }

    const ox = rxn.oxidised
    const red = rxn.reduced
    const W = 420, H = 200
    const OX_X = 80, OX_Y = H / 2
    const RE_X = 340, RE_Y = H / 2
    const nDots = Math.min(rxn.nE, 5)

    // Electron dot positions along path
    const electrons = Array.from({ length: nDots }, (_, i) => {
        const offset = i / nDots
        const p = Math.max(0, Math.min(1, ePos - offset * 0.4))
        return {
            x: OX_X + (RE_X - OX_X) * p,
            y: OX_Y + Math.sin(p * Math.PI) * -40,
            alpha: p > 0 && p < 1 ? 1 : 0,
        }
    })

    const afterOx = phase === 'after'
    const afterRed = phase === 'after'

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {REACTIONS.map((r, i) => (
                    <button key={i} onClick={() => { setRxnIdx(i); reset() }} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxnIdx === i ? 'var(--teal)' : 'var(--bg3)',
                        color: rxnIdx === i ? '#fff' : 'var(--text2)',
                        border: `1px solid ${rxnIdx === i ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{r.name}</button>
                ))}
            </div>

            {/* Equation */}
            <div style={{ padding: '10px 16px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--gold2)', textAlign: 'center', letterSpacing: 1 }}>
                {rxn.eq}
            </div>

            {/* OIL RIG banner */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                {[
                    { label: 'OIL — Oxidation Is Loss', sub: 'loses electrons, ON increases', col: 'var(--coral)', species: ox },
                    { label: 'RIG — Reduction Is Gain', sub: 'gains electrons, ON decreases', col: 'var(--teal)', species: red },
                ].map((b, i) => (
                    <div key={i} style={{ padding: '10px 14px', background: `${b.col}10`, border: `1px solid ${b.col}30`, borderRadius: 8 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: b.col, marginBottom: 2 }}>{b.label}</div>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>{b.sub}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: b.col }}>
                            {b.species.label}: {b.species.ONbefore >= 0 ? '+' : ''}{b.species.ONbefore} → {b.species.ONafter >= 0 ? '+' : ''}{b.species.ONafter}
                        </div>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{b.species.desc}</div>
                    </div>
                ))}
            </div>

            {/* Electron transfer visual */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                    ⚗ ELECTRON TRANSFER — {phase === 'before' ? 'BEFORE' : phase === 'transfer' ? 'TRANSFERRING…' : 'AFTER'}
                </div>

                <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                    {/* Path arc */}
                    <path d={`M ${OX_X} ${OX_Y} Q ${(OX_X + RE_X) / 2} ${OX_Y - 60} ${RE_X} ${RE_Y}`}
                        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="5 4" />

                    {/* Reducing agent (oxidised species) */}
                    <g>
                        <circle cx={OX_X} cy={OX_Y} r={28}
                            fill={`${ox.color}20`}
                            stroke={ox.color} strokeWidth={2.5} />
                        <text x={OX_X} y={OX_Y - 6} textAnchor="middle"
                            style={{ fontSize: 12, fill: ox.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {afterOx ? ox.species.replace(/[^A-Za-z0-9]/g, '') + '²⁺' : ox.label}
                        </text>
                        <text x={OX_X} y={OX_Y + 8} textAnchor="middle"
                            style={{ fontSize: 10, fill: ox.color, fontFamily: 'var(--mono)' }}>
                            ON:{afterOx ? (ox.ONafter >= 0 ? '+' : '') + ox.ONafter : (ox.ONbefore >= 0 ? '+' : '') + ox.ONbefore}
                        </text>
                        <text x={OX_X} y={OX_Y + 42} textAnchor="middle"
                            style={{ fontSize: 9, fill: `${ox.color}80`, fontFamily: 'var(--mono)' }}>
                            {afterOx ? '→ oxidised (reducing agent)' : 'reducing agent'}
                        </text>

                        {/* Electron cloud before */}
                        {!afterOx && Array.from({ length: rxn.nE }, (_, i) => {
                            const angle = (i / rxn.nE) * 2 * Math.PI
                            const ex = OX_X + Math.cos(angle) * 38
                            const ey = OX_Y + Math.sin(angle) * 24
                            return (
                                <g key={i}>
                                    <circle cx={ex} cy={ey} r={5}
                                        fill="rgba(55,138,221,0.7)"
                                        stroke="#378ADD" strokeWidth={1} />
                                    <text x={ex} y={ey + 3} textAnchor="middle"
                                        style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>e⁻</text>
                                </g>
                            )
                        })}
                    </g>

                    {/* Oxidising agent (reduced species) */}
                    <g>
                        <circle cx={RE_X} cy={RE_Y} r={28}
                            fill={`${red.color}20`}
                            stroke={red.color} strokeWidth={2.5} />
                        <text x={RE_X} y={RE_Y - 6} textAnchor="middle"
                            style={{ fontSize: 12, fill: red.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {afterRed ? red.species.replace(/[²⁺⁻]/g, '') : red.label}
                        </text>
                        <text x={RE_X} y={RE_Y + 8} textAnchor="middle"
                            style={{ fontSize: 10, fill: red.color, fontFamily: 'var(--mono)' }}>
                            ON:{afterRed ? (red.ONafter >= 0 ? '+' : '') + red.ONafter : (red.ONbefore >= 0 ? '+' : '') + red.ONbefore}
                        </text>
                        <text x={RE_X} y={RE_Y + 42} textAnchor="middle"
                            style={{ fontSize: 9, fill: `${red.color}80`, fontFamily: 'var(--mono)' }}>
                            {afterRed ? '→ reduced (oxidising agent)' : 'oxidising agent'}
                        </text>

                        {/* Electrons received after */}
                        {afterRed && Array.from({ length: rxn.nE }, (_, i) => {
                            const angle = (i / rxn.nE) * 2 * Math.PI
                            const ex = RE_X + Math.cos(angle) * 38
                            const ey = RE_Y + Math.sin(angle) * 24
                            return (
                                <g key={i}>
                                    <circle cx={ex} cy={ey} r={5}
                                        fill="rgba(55,138,221,0.7)"
                                        stroke="#378ADD" strokeWidth={1} />
                                    <text x={ex} y={ey + 3} textAnchor="middle"
                                        style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>e⁻</text>
                                </g>
                            )
                        })}
                    </g>

                    {/* Flying electrons */}
                    {electrons.map((e, i) => (
                        <g key={i} opacity={e.alpha}>
                            <circle cx={e.x} cy={e.y} r={6}
                                fill="rgba(55,138,221,0.85)"
                                stroke="#378ADD" strokeWidth={1.5} />
                            <text x={e.x} y={e.y + 3} textAnchor="middle"
                                style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)', fontWeight: 700 }}>e⁻</text>
                        </g>
                    ))}

                    {/* Centre label */}
                    <text x={W / 2} y={OX_Y - 68} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                        {rxn.nE} electron{rxn.nE > 1 ? 's' : ''} transferred
                    </text>

                    {/* ON change arrows */}
                    {phase === 'after' && (
                        <g>
                            <text x={OX_X} y={H - 8} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                ON: {ox.ONbefore >= 0 ? '+' : ''}{ox.ONbefore} → {ox.ONafter >= 0 ? '+' : ''}{ox.ONafter} ↑ oxidised
                            </text>
                            <text x={RE_X} y={H - 8} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'var(--teal)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                ON: {red.ONbefore >= 0 ? '+' : ''}{red.ONbefore} → {red.ONafter >= 0 ? '+' : ''}{red.ONafter} ↓ reduced
                            </text>
                        </g>
                    )}
                </svg>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => { setPhase('transfer'); setEPos(0); setRunning(true) }}
                    disabled={running || phase === 'after'} style={{
                        flex: 1, padding: '8px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: 'rgba(29,158,117,0.12)', color: 'var(--teal)',
                        border: '1px solid rgba(29,158,117,0.3)',
                        opacity: running || phase === 'after' ? 0.4 : 1,
                    }}>▶ Transfer electrons</button>
                <button onClick={reset} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            {/* Context note */}
            <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7, marginBottom: 14 }}>
                {rxn.context}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Reducing agent (oxidised)" value={ox.label} color="var(--coral)" highlight />
                <ValueCard label="Oxidising agent (reduced)" value={red.label} color="var(--teal)" highlight />
                <ValueCard label="Electrons transferred" value={`${rxn.nE}e⁻`} color="var(--purple)" />
                <ValueCard label="ON change (oxidised)" value={`${ox.ONbefore >= 0 ? '+' : ''}${ox.ONbefore} → ${ox.ONafter >= 0 ? '+' : ''}${ox.ONafter}`} color="var(--coral)" />
            </div>
        </div>
    )
}