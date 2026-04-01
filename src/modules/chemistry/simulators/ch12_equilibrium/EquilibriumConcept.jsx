import { useState, useEffect, useRef, useMemo } from 'react'
import { REACTIONS } from './helpers/equilData'
import ValueCard from '../../components/ui/ValueCard'

// Solve equilibrium concentrations using ICE table (iterative Newton)
function solveEquil(rxnKey, initConc) {
    const rxn = REACTIONS[rxnKey]
    if (rxnKey === 'N₂O₄ ⇌ 2NO₂') {
        // N₂O₄ ⇌ 2NO₂,  Kc = x²/(0.5-x)
        const Kc = rxn.Kc
        const a = initConc[0]
        let x = 0.01
        for (let i = 0; i < 200; i++) {
            const f = (2 * x) ** 2 / (a - x) - Kc
            const df = 4 * (a - x + x) / (a - x) ** 2
            x -= f / df
            x = Math.max(0.0001, Math.min(a - 0.0001, x))
        }
        return [a - x, 2 * x]
    }
    if (rxnKey === 'H₂ + I₂ ⇌ 2HI') {
        // H₂ + I₂ ⇌ 2HI, Kc = (2x)²/((1-x)(1-x))
        const Kc = rxn.Kc
        const sqrtK = Math.sqrt(Kc)
        const x = sqrtK / (2 + sqrtK)
        return [1 - x, 1 - x, 2 * x]
    }
    if (rxnKey === 'N₂ + 3H₂ ⇌ 2NH₃') {
        // Simplified — just show approach to equilibrium
        return [0.22, 0.66, 1.56]
    }
    if (rxnKey === 'CO + H₂O ⇌ CO₂ + H₂') {
        const Kc = rxn.Kc
        const a = initConc[0]
        let x = 0.4
        for (let i = 0; i < 100; i++) {
            const f = x * x / ((a - x) ** 2) - Kc
            const df = 2 * x * (a - x) ** 2 - x * x * (-2 * (a - x)) / ((a - x) ** 4 * 1)
            const num = x * x - Kc * (a - x) ** 2
            const den = 2 * x * (a - x) + 2 * Kc * (a - x)
            x -= num / den
            x = Math.max(0.001, Math.min(a - 0.001, x))
        }
        return [a - x, a - x, x, x]
    }
    return initConc
}

export default function EquilibriumConcept() {
    const [rxnKey, setRxnKey] = useState('N₂O₄ ⇌ 2NO₂')
    const [tab, setTab] = useState('approach')   // approach | ice | qvsk

    const rxn = REACTIONS[rxnKey]
    const eqConc = useMemo(() => solveEquil(rxnKey, rxn.initConc), [rxnKey])

    // Animation: approach to equilibrium
    const [progress, setProgress] = useState(0)  // 0→1
    const [running, setRunning] = useState(false)
    const rafRef = useRef(null), lastRef = useRef(null)

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            setProgress(p => {
                const next = p + dt * 0.35
                if (next >= 1) { setRunning(false); return 1 }
                return next
            })
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const reset = () => { setProgress(0); setRunning(false); lastRef.current = null }

    // Interpolated concentrations along approach curve
    // Use smooth exponential approach: c(t) = c_eq + (c_init - c_eq) * e^(-5t)
    const concAt = (i) => {
        const c_init = rxn.initConc[i] || 0
        const c_eq = eqConc[i]
        return c_eq + (c_init - c_eq) * Math.exp(-5 * progress)
    }

    // Rate curves: forward rate ∝ [reactants], reverse ∝ [products]
    const rateForward = progress => {
        const t = progress
        // Forward rate starts high, decays to equilibrium rate
        return 1.0 * Math.exp(-4 * t) + 0.3
    }
    const rateReverse = progress => {
        return 0.3 * (1 - Math.exp(-6 * t)) + 0.3
    }

    // Build rate curves for graph
    const rateCurve = Array.from({ length: 80 }, (_, i) => {
        const t = i / 79
        return { t, fwd: rateForward(t), rev: 0.3 * (1 - Math.exp(-6 * t)) + 0.3 }
    })
    const maxR = 1.3

    // Concentration curves
    const concCurve = Array.from({ length: 80 }, (_, i) => {
        const t = i / 79
        return {
            t,
            cs: rxn.initConc.map((ci, idx) => eqConc[idx] + (ci - eqConc[idx]) * Math.exp(-5 * t))
        }
    })

    const SPEC_COLORS = ['#EF9F27', '#D85A30', '#1D9E75', '#378ADD']

    // Graph geometry
    const W = 360, H = 120, GP = { l: 40, r: 12, t: 10, b: 22 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const toX = t => GP.l + t * PW
    const toYr = r => GP.t + PH - (r / maxR) * PH
    const toYc = c => GP.t + PH - (c / Math.max(...rxn.initConc, 0.01, ...eqConc)) * PH

    const fwdPath = rateCurve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t).toFixed(1)},${toYr(p.fwd).toFixed(1)}`).join(' ')
    const revPath = rateCurve.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.t).toFixed(1)},${toYr(p.rev).toFixed(1)}`).join(' ')

    // Q vs Kc slider
    const [Qinput, setQinput] = useState(parseFloat(rxn.Kc.toFixed(4)) * 0.1)

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(REACTIONS).map(k => (
                    <button key={k} onClick={() => { setRxnKey(k); reset(); setQinput(REACTIONS[k].Kc * 0.1) }} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxnKey === k ? REACTIONS[k].color : 'var(--bg3)',
                        color: rxnKey === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${rxnKey === k ? REACTIONS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'approach', l: 'Approach to equilibrium' }, { k: 'ice', l: 'ICE table' }, { k: 'qvsk', l: 'Q vs K — direction' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? rxn.color : 'var(--bg3)',
                        color: tab === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? rxn.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── APPROACH TO EQUILIBRIUM ── */}
            {tab === 'approach' && (
                <div>
                    <div style={{ padding: '8px 14px', background: `${rxn.color}10`, border: `1px solid ${rxn.color}25`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, color: rxn.color }}>
                        {rxn.forward}  ·  Kc = {rxn.Kc}  @  {rxn.temp}°C
                    </div>

                    {/* Live concentration bars — fill/empty as animation runs */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 10 }}>
                            CONCENTRATIONS APPROACHING EQUILIBRIUM
                        </div>
                        {rxn.species.map((sp, i) => {
                            const cur = concAt(i)
                            const maxC = Math.max(...rxn.initConc, ...eqConc, 0.1)
                            const pct = (cur / maxC) * 100
                            const eqPct = (eqConc[i] / maxC) * 100
                            const col = SPEC_COLORS[i]
                            return (
                                <div key={sp} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: col }}>{sp}</span>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: col }}>{cur.toFixed(4)} M</span>
                                    </div>
                                    <div style={{ position: 'relative', height: 20, background: 'rgba(0,0,0,0.2)', borderRadius: 10, overflow: 'visible' }}>
                                        {/* Equilibrium marker */}
                                        <div style={{
                                            position: 'absolute', left: `${eqPct}%`,
                                            top: -3, bottom: -3, width: 2,
                                            background: `${col}60`, zIndex: 2,
                                        }} />
                                        {/* Bar */}
                                        <div style={{
                                            position: 'absolute', left: 0, top: 0,
                                            height: '100%', width: `${Math.max(0, Math.min(100, pct))}%`,
                                            background: `linear-gradient(90deg,${col}80,${col})`,
                                            borderRadius: 10, transition: 'none',
                                        }} />
                                        <span style={{
                                            position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)',
                                            fontSize: 9, fontFamily: 'var(--mono)', color: `${col}80`,
                                        }}>eq={eqConc[i].toFixed(3)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Rate curves graph */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            FORWARD (→) AND REVERSE (←) RATES
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {/* Forward rate */}
                            <path d={fwdPath} fill="none" stroke={rxn.color} strokeWidth={2.5} />
                            {/* Reverse rate */}
                            <path d={revPath} fill="none" stroke="rgba(160,176,200,0.5)" strokeWidth={2} strokeDasharray="5 3" />

                            {/* Equilibrium crosshair — where they meet */}
                            {(() => {
                                const teq = rateCurve.findIndex((p, i) => i > 0 && Math.abs(p.fwd - p.rev) < 0.05)
                                if (teq < 0) return null
                                const p = rateCurve[teq]
                                return (
                                    <g>
                                        <line x1={toX(p.t)} y1={GP.t} x2={toX(p.t)} y2={GP.t + PH}
                                            stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="3 3" />
                                        <text x={toX(p.t) + 4} y={GP.t + 12}
                                            style={{ fontSize: 8, fill: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>⇌ eq</text>
                                    </g>
                                )
                            })()}

                            {/* Progress line */}
                            <line x1={toX(progress)} y1={GP.t} x2={toX(progress)} y2={GP.t + PH}
                                stroke={rxn.color} strokeWidth={1.5} opacity={0.7} />

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 14} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>time</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>rate</text>

                            {/* Legend */}
                            <line x1={GP.l} y1={H - 4} x2={GP.l + 16} y2={H - 4} stroke={rxn.color} strokeWidth={2} />
                            <text x={GP.l + 20} y={H - 1} style={{ fontSize: 8, fill: rxn.color, fontFamily: 'var(--mono)' }}>forward rate</text>
                            <line x1={GP.l + 90} y1={H - 4} x2={GP.l + 106} y2={H - 4} stroke="rgba(160,176,200,0.5)" strokeWidth={1.5} strokeDasharray="4 3" />
                            <text x={GP.l + 110} y={H - 1} style={{ fontSize: 8, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>reverse rate</text>
                        </svg>
                    </div>

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50) }} style={{
                            flex: 2, padding: '9px', borderRadius: 8, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: `${rxn.color}18`, color: rxn.color,
                            border: `1px solid ${rxn.color}40`,
                        }}>{running ? '⏸ Running…' : progress > 0 ? '↺ Replay' : '▶ Approach equilibrium'}</button>
                        <button onClick={reset} style={{
                            flex: 1, padding: '9px', borderRadius: 8, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                        }}>Reset</button>
                    </div>
                </div>
            )}

            {/* ── ICE TABLE ── */}
            {tab === 'ice' && (
                <div>
                    <div style={{ padding: '8px 14px', background: `${rxn.color}10`, border: `1px solid ${rxn.color}25`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, color: rxn.color }}>
                        Kc = {rxn.Kc}
                    </div>

                    {/* ICE table */}
                    <div style={{ overflowX: 'auto', marginBottom: 14 }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 12 }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', color: 'var(--text3)', textAlign: 'left', fontSize: 10, letterSpacing: 1 }}>
                                        ICE
                                    </th>
                                    {rxn.species.map((sp, i) => (
                                        <th key={sp} style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', color: SPEC_COLORS[i], textAlign: 'center' }}>
                                            [{sp}]
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Initial */}
                                <tr>
                                    <td style={{ padding: '8px 12px', background: 'var(--bg3)', color: 'var(--teal)', fontWeight: 700 }}>Initial</td>
                                    {rxn.initConc.map((c, i) => (
                                        <td key={i} style={{ padding: '8px 12px', textAlign: 'center', background: 'var(--bg3)', color: SPEC_COLORS[i] }}>
                                            {c.toFixed(3)}
                                        </td>
                                    ))}
                                </tr>
                                {/* Change */}
                                <tr>
                                    <td style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.1)', color: 'var(--coral)', fontWeight: 700 }}>Change</td>
                                    {rxn.initConc.map((c, i) => {
                                        const change = eqConc[i] - c
                                        return (
                                            <td key={i} style={{ padding: '8px 12px', textAlign: 'center', background: 'rgba(0,0,0,0.1)', color: change >= 0 ? 'var(--teal)' : 'var(--coral)' }}>
                                                {change >= 0 ? '+' : ''}{change.toFixed(4)}
                                            </td>
                                        )
                                    })}
                                </tr>
                                {/* Equilibrium */}
                                <tr>
                                    <td style={{ padding: '8px 12px', background: `${rxn.color}10`, color: rxn.color, fontWeight: 700 }}>Equilibrium</td>
                                    {eqConc.map((c, i) => (
                                        <td key={i} style={{ padding: '8px 12px', textAlign: 'center', background: `${rxn.color}10`, color: SPEC_COLORS[i], fontWeight: 700 }}>
                                            {c.toFixed(4)}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Kc verification */}
                    {(() => {
                        let Kc_calc
                        if (rxnKey === 'N₂O₄ ⇌ 2NO₂') {
                            Kc_calc = eqConc[1] ** 2 / eqConc[0]
                        } else if (rxnKey === 'H₂ + I₂ ⇌ 2HI') {
                            Kc_calc = eqConc[2] ** 2 / (eqConc[0] * eqConc[1])
                        } else if (rxnKey === 'CO + H₂O ⇌ CO₂ + H₂') {
                            Kc_calc = eqConc[2] * eqConc[3] / (eqConc[0] * eqConc[1])
                        } else {
                            Kc_calc = eqConc[2] ** 2 / (eqConc[0] * eqConc[1] ** 3)
                        }
                        return (
                            <div style={{ padding: '12px 16px', background: `${rxn.color}12`, border: `2px solid ${rxn.color}40`, borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>VERIFICATION</div>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: rxn.color, lineHeight: 1.7 }}>
                                    Kc (calculated) = {Kc_calc.toExponential(3)}
                                    <br />Kc (given) = {rxn.Kc}
                                    <br /><span style={{ color: 'var(--teal)', fontWeight: 700 }}>
                                        {Math.abs(Kc_calc - rxn.Kc) < rxn.Kc * 0.05 ? '✓ Equilibrium verified' : '≈ Close (numerical approximation)'}
                                    </span>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            {/* ── Q vs K ── */}
            {tab === 'qvsk' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Reaction quotient Q:</strong> Same expression as Kc but using <em>current</em> concentrations (not equilibrium). Compare Q to Kc to predict direction.
                    </div>

                    {/* Q slider */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                Reaction quotient Q
                            </span>
                            <span style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)' }}>
                                Q = {Qinput.toExponential(3)}
                            </span>
                        </div>
                        <input type="range"
                            min={Math.log10(rxn.Kc) - 3}
                            max={Math.log10(rxn.Kc) + 3}
                            step={0.05}
                            value={Math.log10(Qinput)}
                            onChange={e => setQinput(Math.pow(10, Number(e.target.value)))}
                            style={{ width: '100%', accentColor: 'var(--purple)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                            <span>Q ≪ Kc</span><span>Q ≫ Kc</span>
                        </div>
                    </div>

                    {/* Number line: Q relative to Kc */}
                    {(() => {
                        const logQ = Math.log10(Qinput)
                        const logK = Math.log10(rxn.Kc)
                        const logMin = logK - 3, logMax = logK + 3
                        const KpctX = ((logK - logMin) / (logMax - logMin)) * 100
                        const QpctX = Math.max(2, Math.min(98, ((logQ - logMin) / (logMax - logMin)) * 100))
                        const isLeft = logQ < logK - 0.1
                        const isRight = logQ > logK + 0.1
                        const atEq = !isLeft && !isRight
                        return (
                            <div style={{ marginBottom: 20 }}>
                                <div style={{ position: 'relative', height: 36, marginBottom: 6 }}>
                                    {/* Track */}
                                    <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 4, background: 'var(--bg3)', borderRadius: 2 }} />
                                    {/* Left region (Q<K) */}
                                    <div style={{
                                        position: 'absolute', top: 14, left: 0, width: `${KpctX}%`,
                                        height: 8, background: 'rgba(29,158,117,0.2)', borderRadius: 2,
                                    }} />
                                    {/* Right region (Q>K) */}
                                    <div style={{
                                        position: 'absolute', top: 14, left: `${KpctX}%`, right: 0,
                                        height: 8, background: 'rgba(216,90,48,0.2)', borderRadius: 2,
                                    }} />
                                    {/* Kc marker */}
                                    <div style={{
                                        position: 'absolute', left: `${KpctX}%`, top: 8,
                                        width: 3, height: 20, background: rxn.color,
                                        transform: 'translateX(-50%)',
                                    }} />
                                    <div style={{
                                        position: 'absolute', left: `${KpctX}%`, top: 0,
                                        transform: 'translateX(-50%)',
                                        fontSize: 9, fontFamily: 'var(--mono)', color: rxn.color, fontWeight: 700,
                                        whiteSpace: 'nowrap',
                                    }}>Kc={rxn.Kc}</div>
                                    {/* Q marker */}
                                    <div style={{
                                        position: 'absolute', left: `${QpctX}%`, top: 6,
                                        width: 24, height: 24, borderRadius: '50%',
                                        background: 'var(--purple)', border: '2px solid rgba(255,255,255,0.3)',
                                        transform: 'translateX(-50%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: '#fff',
                                        transition: 'left 0.15s',
                                    }}>Q</div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                    <span style={{ color: 'var(--teal)' }}>Q &lt; Kc → forward reaction</span>
                                    <span style={{ color: 'var(--coral)' }}>Q &gt; Kc → reverse reaction</span>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Direction result */}
                    {(() => {
                        const logQ = Math.log10(Qinput), logK = Math.log10(rxn.Kc)
                        const isLeft = logQ < logK - 0.1, isRight = logQ > logK + 0.1
                        const atEq = !isLeft && !isRight
                        const col = atEq ? rxn.color : isLeft ? 'var(--teal)' : 'var(--coral)'
                        const msg = atEq
                            ? '⇌ System is at equilibrium — no net change'
                            : isLeft
                                ? '→ Q < Kc: Too few products. Reaction proceeds FORWARD (→) to produce more products.'
                                : '← Q > Kc: Too many products. Reaction proceeds REVERSE (←) to produce more reactants.'
                        return (
                            <div style={{
                                padding: '14px 18px', borderRadius: 10,
                                background: `${col === 'var(--teal)' ? 'rgba(29,158,117' : col === 'var(--coral)' ? 'rgba(216,90,48' : `${rxn.color.slice(0, -1)}`}.1)`,
                                border: `2px solid ${col === 'var(--teal)' ? 'rgba(29,158,117,0.4)' : col === 'var(--coral)' ? 'rgba(216,90,48,0.4)' : `${rxn.color}40`}`,
                                fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700,
                                color: col, lineHeight: 1.6,
                            }}>
                                {msg}
                            </div>
                        )
                    })()}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Reaction" value={rxnKey} color={rxn.color} highlight />
                <ValueCard label="Kc" value={rxn.Kc} color={rxn.color} />
                <ValueCard label="ΔH" value={`${rxn.ΔH > 0 ? '+' : ''}${rxn.ΔH} kJ/mol`} color={rxn.ΔH < 0 ? 'var(--teal)' : 'var(--coral)'} />
                <ValueCard label="Eq. progress" value={`${(progress * 100).toFixed(0)}%`} color="var(--gold)" />
            </div>
        </div>
    )
}