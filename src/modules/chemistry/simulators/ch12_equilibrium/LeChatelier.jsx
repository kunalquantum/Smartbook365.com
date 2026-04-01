import { useState, useEffect, useRef } from 'react'
import { REACTIONS } from './helpers/equilData'
import ValueCard from '../../components/ui/ValueCard'

// Le Chatelier effects — for each reaction, for each disturbance
const EFFECTS = {
    'N₂O₄ ⇌ 2NO₂': {
        add_reactant: { dir: 'forward', why: 'More N₂O₄ added → Q < Kc → system shifts forward to consume it → more NO₂', color: 'var(--teal)' },
        add_product: { dir: 'reverse', why: 'More NO₂ added → Q > Kc → system shifts reverse to consume it → more N₂O₄', color: 'var(--coral)' },
        increase_T: { dir: 'forward', why: 'Endothermic reaction (ΔH=+57 kJ) → heating favours forward reaction → more NO₂ (darker brown)', color: 'var(--teal)' },
        decrease_T: { dir: 'reverse', why: 'Cooling disfavours endothermic direction → reverse favoured → more N₂O₄ (colourless)', color: 'var(--coral)' },
        increase_P: { dir: 'reverse', why: '1 mol → 2 mol gas: increase in P → system shifts to fewer moles of gas (reverse) → more N₂O₄', color: 'var(--coral)' },
        decrease_P: { dir: 'forward', why: 'Decrease in P → system shifts to more moles of gas (forward) → more NO₂', color: 'var(--teal)' },
    },
    'N₂ + 3H₂ ⇌ 2NH₃': {
        add_reactant: { dir: 'forward', why: 'More N₂ or H₂ → Q < Kc → forward reaction favoured → more NH₃ produced', color: 'var(--teal)' },
        add_product: { dir: 'reverse', why: 'More NH₃ → Q > Kc → reverse favoured → NH₃ decomposes', color: 'var(--coral)' },
        increase_T: { dir: 'reverse', why: 'Exothermic (ΔH=−92 kJ) → heating favours endothermic direction (reverse) → less NH₃', color: 'var(--coral)' },
        decrease_T: { dir: 'forward', why: 'Cooling favours exothermic direction (forward) → more NH₃', color: 'var(--teal)' },
        increase_P: { dir: 'forward', why: '4 mol → 2 mol gas: increase P → fewer moles favoured (forward) → more NH₃', color: 'var(--teal)' },
        decrease_P: { dir: 'reverse', why: 'Decrease P → more moles favoured (reverse) → less NH₃', color: 'var(--coral)' },
    },
    'H₂ + I₂ ⇌ 2HI': {
        add_reactant: { dir: 'forward', why: 'More H₂ or I₂ → Q < Kc → forward favoured → more HI', color: 'var(--teal)' },
        add_product: { dir: 'reverse', why: 'More HI → Q > Kc → reverse favoured', color: 'var(--coral)' },
        increase_T: { dir: 'forward', why: 'Mildly endothermic → heating shifts forward slightly', color: 'var(--teal)' },
        decrease_T: { dir: 'reverse', why: 'Cooling shifts reverse slightly', color: 'var(--coral)' },
        increase_P: { dir: 'none', why: '2 mol ⇌ 2 mol gas: equal moles on both sides → pressure has NO effect on position', color: 'var(--text3)' },
        decrease_P: { dir: 'none', why: 'Equal moles of gas both sides → pressure change has no effect', color: 'var(--text3)' },
    },
    'CO + H₂O ⇌ CO₂ + H₂': {
        add_reactant: { dir: 'forward', why: 'More CO or H₂O → Q < Kc → forward favoured → more CO₂ and H₂', color: 'var(--teal)' },
        add_product: { dir: 'reverse', why: 'More CO₂ or H₂ → Q > Kc → reverse favoured', color: 'var(--coral)' },
        increase_T: { dir: 'reverse', why: 'Exothermic (ΔH=−41 kJ) → heating favours reverse', color: 'var(--coral)' },
        decrease_T: { dir: 'forward', why: 'Cooling favours exothermic forward reaction', color: 'var(--teal)' },
        increase_P: { dir: 'none', why: '2 mol ⇌ 2 mol: equal gas moles → pressure change has no effect', color: 'var(--text3)' },
        decrease_P: { dir: 'none', why: 'Equal gas moles on both sides → no effect', color: 'var(--text3)' },
    },
}

const DISTURBANCES = [
    { k: 'add_reactant', l: 'Add reactant', icon: '+ reactant', col: '#EF9F27' },
    { k: 'add_product', l: 'Add product', icon: '+ product', col: '#D85A30' },
    { k: 'increase_T', l: '↑ Temperature', icon: '🔥', col: '#D85A30' },
    { k: 'decrease_T', l: '↓ Temperature', icon: '❄', col: '#378ADD' },
    { k: 'increase_P', l: '↑ Pressure', icon: '⬇ V', col: '#7F77DD' },
    { k: 'decrease_P', l: '↓ Pressure', icon: '⬆ V', col: '#888780' },
]

const SPEC_COLORS = ['#EF9F27', '#D85A30', '#1D9E75', '#378ADD']

export default function LeChatelier() {
    const [rxnKey, setRxnKey] = useState('N₂O₄ ⇌ 2NO₂')
    const [disturbance, setDist] = useState(null)
    const [animating, setAnim] = useState(false)
    const [phase, setPhase] = useState('before')  // before | disturbed | shifted

    const rxn = REACTIONS[rxnKey]
    const effect = disturbance ? EFFECTS[rxnKey][disturbance] : null

    // Baseline equilibrium concentrations (simplified)
    const baseConc = {
        'N₂O₄ ⇌ 2NO₂': [0.46, 0.09],
        'N₂ + 3H₂ ⇌ 2NH₃': [0.22, 0.66, 1.56],
        'H₂ + I₂ ⇌ 2HI': [0.22, 0.22, 1.56],
        'CO + H₂O ⇌ CO₂ + H₂': [0.38, 0.38, 0.62, 0.62],
    }[rxnKey]

    // After disturbance concentrations (qualitative)
    const disturbedConc = baseConc.map((c, i) => {
        if (!disturbance) return c
        if (disturbance === 'add_reactant') return i === 0 ? c + 0.3 : c
        if (disturbance === 'add_product') return i === baseConc.length - 1 ? c + 0.3 : c
        return c
    })

    // After shift (new equilibrium — approximate)
    const getShiftedConc = () => {
        if (!effect) return baseConc
        const d = effect.dir
        return baseConc.map((c, i) => {
            const isReactant = i < Math.ceil(rxn.species.length / 2)
            if (d === 'forward') return isReactant ? Math.max(0.05, c - 0.12) : c + 0.12
            if (d === 'reverse') return isReactant ? c + 0.12 : Math.max(0.05, c - 0.12)
            return c
        })
    }

    const displayConc = phase === 'before' ? baseConc :
        phase === 'disturbed' ? disturbedConc : getShiftedConc()

    const maxC = Math.max(...baseConc, ...getShiftedConc(), 0.1) + 0.4

    const applyDisturbance = (d) => {
        setDist(d)
        setPhase('disturbed')
        setAnim(true)
        setTimeout(() => { setPhase('shifted'); setAnim(false) }, 1200)
    }

    // Reaction arrow animation
    const [arrowDir, setArrowDir] = useState('both')
    useEffect(() => {
        if (!effect) { setArrowDir('both'); return }
        setArrowDir(effect.dir)
    }, [effect])

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(REACTIONS).map(k => (
                    <button key={k} onClick={() => { setRxnKey(k); setDist(null); setPhase('before') }} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxnKey === k ? REACTIONS[k].color : 'var(--bg3)',
                        color: rxnKey === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${rxnKey === k ? REACTIONS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Equilibrium display */}
            <div style={{ padding: '10px 16px', background: `${rxn.color}10`, border: `1px solid ${rxn.color}30`, borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {rxn.species.map((sp, i) => {
                        const isProduct = i >= Math.ceil(rxn.species.length / 2)
                        if (sp === '⇌') return null
                        return (
                            <div key={sp} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {i === Math.ceil(rxn.species.length / 2) && (
                                    <div style={{ fontSize: 20, color: rxn.color, fontWeight: 700 }}>⇌</div>
                                )}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: SPEC_COLORS[i] }}>{sp}</div>
                                    <div style={{
                                        fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: SPEC_COLORS[i],
                                        transition: 'all 0.4s',
                                        padding: '2px 8px', borderRadius: 6,
                                        background: `${SPEC_COLORS[i]}15`,
                                    }}>
                                        {displayConc[i].toFixed(3)} M
                                    </div>
                                </div>
                                {i < Math.ceil(rxn.species.length / 2) - 1 && (
                                    <span style={{ color: 'var(--text3)', fontSize: 14 }}>+</span>
                                )}
                                {isProduct && i < rxn.species.length - 1 && (
                                    <span style={{ color: 'var(--text3)', fontSize: 14 }}>+</span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Phase indicator */}
                <div style={{ textAlign: 'center', marginTop: 8, fontSize: 11, fontFamily: 'var(--mono)', color: rxn.color }}>
                    {phase === 'before' ? 'At equilibrium — apply a disturbance' :
                        phase === 'disturbed' ? '⚡ Disturbance applied — system responding…' :
                            '✓ New equilibrium reached'}
                </div>
            </div>

            {/* Concentration bars — change visually on disturbance */}
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                    CONCENTRATIONS — {phase === 'before' ? 'EQUILIBRIUM' : phase === 'disturbed' ? 'AFTER DISTURBANCE' : 'NEW EQUILIBRIUM'}
                </div>
                {rxn.species.map((sp, i) => {
                    const c = displayConc[i]
                    const base = baseConc[i]
                    const pct = (c / maxC) * 100
                    const col = SPEC_COLORS[i]
                    const changed = Math.abs(c - base) > 0.05
                    return (
                        <div key={sp} style={{ marginBottom: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>{sp}</span>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: col }}>
                                    {c.toFixed(3)} M
                                    {phase !== 'before' && changed && (
                                        <span style={{ marginLeft: 8, color: c > base ? 'var(--teal)' : 'var(--coral)', fontSize: 10 }}>
                                            {c > base ? '▲' : '▼'} {Math.abs(c - base).toFixed(3)}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div style={{ height: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`,
                                    background: `linear-gradient(90deg,${col}60,${col})`,
                                    borderRadius: 8,
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Disturbance buttons */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    APPLY A DISTURBANCE — watch the system respond
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                    {DISTURBANCES.map(d => {
                        const eff = EFFECTS[rxnKey][d.k]
                        return (
                            <button key={d.k} onClick={() => applyDisturbance(d.k)} style={{
                                padding: '10px 8px', borderRadius: 10, cursor: 'pointer', textAlign: 'center',
                                background: disturbance === d.k ? `${d.col}25` : 'var(--bg3)',
                                border: `2px solid ${disturbance === d.k ? d.col : 'var(--border)'}`,
                                transition: 'all 0.15s',
                            }}>
                                <div style={{ fontSize: 16, marginBottom: 4 }}>{d.icon}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: d.col }}>{d.l}</div>
                                {disturbance === d.k && (
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: eff.color, marginTop: 4, fontWeight: 700 }}>
                                        {eff.dir === 'forward' ? '→ shifts forward' : eff.dir === 'reverse' ? '← shifts reverse' : '↔ no shift'}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Effect explanation */}
            {effect && (
                <div style={{
                    padding: '12px 16px', borderRadius: 10,
                    background: effect.color === 'var(--teal)' ? 'rgba(29,158,117,0.1)' : effect.color === 'var(--coral)' ? 'rgba(216,90,48,0.1)' : 'rgba(160,176,200,0.07)',
                    border: `2px solid ${effect.color === 'var(--teal)' ? 'rgba(29,158,117,0.4)' : effect.color === 'var(--coral)' ? 'rgba(216,90,48,0.4)' : 'rgba(160,176,200,0.2)'}`,
                    fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7,
                }}>
                    <strong style={{ color: effect.color }}>
                        {effect.dir === 'forward' ? '→ Forward shift' : effect.dir === 'reverse' ? '← Reverse shift' : '↔ No shift (moles of gas equal on both sides)'}
                    </strong>
                    <br />{effect.why}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Reaction" value={rxnKey.split('⇌')[0].trim()} color={rxn.color} highlight />
                <ValueCard label="ΔH" value={`${rxn.ΔH > 0 ? '+' : ''}${rxn.ΔH} kJ/mol`} color={rxn.ΔH < 0 ? 'var(--teal)' : 'var(--coral)'} />
                <ValueCard label="Moles gas" value={`${rxn.nGas_reactants} → ${rxn.nGas_products}`} color="var(--gold)" />
                <ValueCard label="Shift" value={effect ? (effect.dir === 'none' ? 'No shift' : effect.dir) : '—'} color={effect?.color || 'var(--text3)'} />
            </div>
        </div>
    )
}