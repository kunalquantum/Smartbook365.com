import { useState, useMemo } from 'react'
import { ALKANES, CONFORMATIONS } from './helpers/hydrocarbonData'
import ValueCard from '../../components/ui/ValueCard'

// Newman projection — drawn with SVG, keeping it tight
function NewmanProjection({ angle, color }) {
    const CX = 70, CY = 70, R = 48
    // Front carbon bonds at fixed positions: up, lower-left, lower-right
    const frontAngles = [-90, 30, 150]   // degrees
    // Back carbon bonds rotated by 'angle'
    const backAngles = frontAngles.map(a => a + angle)

    const toRad = d => d * Math.PI / 180
    const pt = (a, r) => ({ x: CX + r * Math.cos(toRad(a)), y: CY + r * Math.sin(toRad(a)) })

    return (
        <svg viewBox="0 0 140 140" width="100%">
            {/* Back carbon bonds (dashed) */}
            {backAngles.map((a, i) => {
                const end = pt(a, R - 6)
                return (
                    <line key={`b${i}`}
                        x1={CX + Math.cos(toRad(a)) * 22}
                        y1={CY + Math.sin(toRad(a)) * 22}
                        x2={end.x} y2={end.y}
                        stroke={`${color}60`} strokeWidth={2.5}
                        strokeDasharray="4 3" />
                )
            })}
            {/* Back circle */}
            <circle cx={CX} cy={CY} r={22}
                fill="none" stroke={`${color}30`} strokeWidth={1.5} />
            {/* Front carbon bonds (solid) */}
            {frontAngles.map((a, i) => {
                const end = pt(a, R + 2)
                return (
                    <line key={`f${i}`}
                        x1={CX + Math.cos(toRad(a)) * 5}
                        y1={CY + Math.sin(toRad(a)) * 5}
                        x2={end.x} y2={end.y}
                        stroke={color} strokeWidth={3}
                        strokeLinecap="round" />
                )
            })}
            {/* Front dot */}
            <circle cx={CX} cy={CY} r={5}
                fill={color} />
            {/* Labels at end of back bonds */}
            {backAngles.map((a, i) => {
                const p = pt(a, R + 12)
                return (
                    <text key={`bl${i}`} x={p.x} y={p.y + 3} textAnchor="middle"
                        style={{ fontSize: 10, fill: `${color}80`, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                        H
                    </text>
                )
            })}
            {/* Labels at end of front bonds */}
            {frontAngles.map((a, i) => {
                const p = pt(a, R + 14)
                return (
                    <text key={`fl${i}`} x={p.x} y={p.y + 3} textAnchor="middle"
                        style={{ fontSize: 10, fill: color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                        H
                    </text>
                )
            })}
        </svg>
    )
}

export default function Alkanes() {
    const [mode, setMode] = useState('conformation')  // conformation | properties | halogenation
    const [selConf, setSelConf] = useState('Anti (180°)')
    const [angle, setAngle] = useState(180)
    const [halogen, setHalogen] = useState('Cl₂')
    const [step, setStep] = useState(0)

    const conf = CONFORMATIONS[selConf]

    // Energy vs dihedral angle curve
    const energyCurve = useMemo(() =>
        Array.from({ length: 72 }, (_, i) => {
            const a = i * 5
            const r = a * Math.PI / 180
            // 3-fold barrier: eclipsed at 0, 120, 240; staggered at 60, 180, 300
            const E = 4.2 * (Math.cos(3 * r) + 1) + 1.5 * (Math.cos(r) - 1)
            return { a, E: Math.max(0, E) }
        }), [])

    const maxE = Math.max(...energyCurve.map(p => p.E))

    // Graph
    const W = 360, H = 120, GP = { l: 36, r: 12, t: 12, b: 24 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const toX = a => GP.l + (a / 360) * PW
    const toY = E => GP.t + PH - (E / maxE) * PH
    const ePath = energyCurve.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.a).toFixed(1)},${toY(p.E).toFixed(1)}`
    ).join(' ')

    // Current energy at slider angle
    const curIdx = Math.round(angle / 5) % 72
    const curE = energyCurve[curIdx]?.E || 0

    // Free radical halogenation steps
    const HALOGEN_STEPS = {
        'Cl₂': [
            { phase: 'Initiation', eq: 'Cl₂ →(hν) 2 Cl•', note: 'UV light or heat — homolytic cleavage', col: '#EF9F27' },
            { phase: 'Propagation 1', eq: 'Cl• + CH₄ → HCl + •CH₃', note: 'H abstraction — forms methyl radical', col: '#1D9E75' },
            { phase: 'Propagation 2', eq: '•CH₃ + Cl₂ → CH₃Cl + Cl•', note: 'Cl• regenerated — chain continues', col: '#1D9E75' },
            { phase: 'Termination', eq: 'Cl• + Cl• → Cl₂  (or other combos)', note: 'Chain terminated when radicals meet', col: '#D85A30' },
        ],
        'Br₂': [
            { phase: 'Initiation', eq: 'Br₂ →(hν) 2 Br•', note: 'Homolytic cleavage — Br−Br weaker energy needed', col: '#EF9F27' },
            { phase: 'Propagation 1', eq: 'Br• + CH₄ → HBr + •CH₃', note: 'Selective — only 3° > 2° > 1° H abstracted', col: '#1D9E75' },
            { phase: 'Propagation 2', eq: '•CH₃ + Br₂ → CH₃Br + Br•', note: 'Br• regenerated', col: '#1D9E75' },
            { phase: 'Termination', eq: '2Br• → Br₂  (etc.)', note: 'Chain stops', col: '#D85A30' },
        ],
    }

    const steps = HALOGEN_STEPS[halogen]

    // Selectivity comparison
    const SELECTIVITY = [
        { radical: 'Cl•', primary: 1, secondary: 4.3, tertiary: 4.4, col: '#1D9E75', note: 'Low selectivity — fast, statistical' },
        { radical: 'Br•', primary: 1, secondary: 82, tertiary: 1700, col: '#D85A30', note: 'High selectivity — slow, thermodynamic control' },
    ]

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'conformation', l: 'Conformations' }, { k: 'properties', l: 'Physical properties' }, { k: 'halogenation', l: 'Free radical halogenation' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--gold)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── CONFORMATIONS ── */}
            {mode === 'conformation' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Rotation around C−C single bond in ethane — drag the angle slider to rotate. Newman projection shows front (solid) and back (dashed) carbon.
                    </div>

                    {/* Angle slider */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Dihedral angle</span>
                            <span style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)' }}>
                                {angle}°
                            </span>
                        </div>
                        <input type="range" min={0} max={360} step={5}
                            value={angle} onChange={e => setAngle(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--gold)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                            <span>0° (eclipsed)</span><span>180° (anti)</span><span>360°</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 14, marginBottom: 14 }}>
                        {/* Newman projection — updates with slider */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 10 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4, textAlign: 'center' }}>NEWMAN</div>
                            <NewmanProjection angle={angle} color={curE < 2 ? '#1D9E75' : curE < 6 ? '#EF9F27' : '#D85A30'} />
                            <div style={{ textAlign: 'center', fontSize: 10, fontFamily: 'var(--mono)', color: curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)' }}>
                                {angle === 180 || angle === 0 || angle === 360 ? (angle === 180 ? 'Anti' : 'Eclipsed') :
                                    angle === 60 || angle === 300 ? 'Gauche' :
                                        angle === 120 || angle === 240 ? 'Eclipsed' : `${angle}°`}
                            </div>
                        </div>

                        {/* Energy info */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>STRAIN ENERGY</div>
                                <div style={{ height: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
                                    <div style={{ height: '100%', width: `${(curE / maxE) * 100}%`, background: curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)', borderRadius: 6, transition: 'width 0.1s' }} />
                                </div>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)' }}>
                                    {curE.toFixed(1)} kJ/mol
                                </div>
                            </div>
                            <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>STABILITY</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>
                                    {angle === 180 ? 'Anti — most stable. Groups farthest apart. No torsional strain.' :
                                        (angle === 60 || angle === 300) ? 'Gauche — moderate strain. Small steric interaction.' :
                                            'Eclipsed — most unstable. Maximum torsional strain.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Energy vs angle graph */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            POTENTIAL ENERGY vs DIHEDRAL ANGLE
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            <path d={ePath} fill="none" stroke="var(--gold)" strokeWidth={2} />
                            {/* Current position */}
                            <circle cx={toX(angle)} cy={toY(curE)} r={6}
                                fill={curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)'}
                                stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                            <line x1={toX(angle)} y1={GP.t} x2={toX(angle)} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="3 3" />
                            {/* Labels */}
                            {[0, 60, 120, 180, 240, 300, 360].map(a => (
                                <text key={a} x={toX(a)} y={GP.t + PH + 16} textAnchor="middle"
                                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                    {a}°
                                </text>
                            ))}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>E</text>
                        </svg>
                    </div>
                </div>
            )}

            {/* ── PHYSICAL PROPERTIES ── */}
            {mode === 'properties' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        Alkane boiling points increase with chain length (more van der Waals contact area). Branching lowers BP (less surface area). All alkanes are non-polar — insoluble in water.
                    </div>

                    {/* BP vs chain length chart */}
                    {(() => {
                        const alkanes = Object.entries(ALKANES)
                        const minBP = Math.min(...alkanes.map(([, v]) => v.bp))
                        const maxBP = Math.max(...alkanes.map(([, v]) => v.bp))
                        const range = maxBP - minBP

                        return (
                            <div style={{ marginBottom: 14 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                                    BOILING POINT vs CHAIN LENGTH
                                </div>
                                {alkanes.map(([name, data]) => {
                                    const pct = ((data.bp - minBP) / range) * 100
                                    return (
                                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: data.color, minWidth: 60 }}>{name}</span>
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 40 }}>{data.formula}</span>
                                            <div style={{ flex: 1, height: 16, background: 'var(--bg3)', borderRadius: 8, overflow: 'hidden', position: 'relative' }}>
                                                {/* Zero line */}
                                                <div style={{ position: 'absolute', left: `${((0 - minBP) / range) * 100}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.2)' }} />
                                                {/* Bar */}
                                                <div style={{
                                                    position: 'absolute',
                                                    left: data.bp < 0 ? `${pct}%` : `${((0 - minBP) / range) * 100}%`,
                                                    width: `${Math.abs(((data.bp - (data.bp < 0 ? data.bp : 0)) / range)) * 100}%`,
                                                    height: '100%',
                                                    background: data.bp < 0 ? 'rgba(55,138,221,0.7)' : 'var(--coral)',
                                                    borderRadius: 8,
                                                    minWidth: 2,
                                                }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: data.bp < 0 ? '#378ADD' : 'var(--coral)', minWidth: 50, textAlign: 'right' }}>
                                                {data.bp}°C
                                            </span>
                                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 40 }}>{data.state}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })()}

                    {/* General trend info */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { label: '↑ Chain length', effect: '↑ Boiling point\n(more vdW contact)', col: 'var(--coral)' },
                            { label: '↑ Branching', effect: '↓ Boiling point\n(less surface area)', col: '#378ADD' },
                            { label: 'Solubility', effect: 'Insoluble in water\n(non-polar)', col: 'var(--text3)' },
                            { label: 'Combustion', effect: 'CₙH₂ₙ₊₂ + O₂ → CO₂ + H₂O\n(exothermic)', col: '#D85A30' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '10px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col, marginBottom: 3 }}>{p.label}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{p.effect}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── FREE RADICAL HALOGENATION ── */}
            {mode === 'halogenation' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {['Cl₂', 'Br₂'].map(h => (
                            <button key={h} onClick={() => { setHalogen(h); setStep(0) }} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 14,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: halogen === h ? (h === 'Cl₂' ? '#1D9E75' : '#D85A30') : 'var(--bg3)',
                                color: halogen === h ? '#fff' : 'var(--text2)',
                                border: `1px solid ${halogen === h ? (h === 'Cl₂' ? '#1D9E75' : '#D85A30') : 'var(--border)'}`,
                            }}>{h}</button>
                        ))}
                    </div>

                    {/* Steps */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {steps.map((s, i) => (
                            <button key={i} onClick={() => setStep(i)} style={{
                                flex: 1, padding: '6px 4px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: step === i ? s.col : step > i ? `${s.col}25` : 'var(--bg3)',
                                color: step === i ? '#fff' : step > i ? s.col : 'var(--text3)',
                                border: `1px solid ${step >= i ? s.col + '50' : 'var(--border)'}`,
                            }}>{s.phase.split(' ')[0]}</button>
                        ))}
                    </div>

                    {steps.slice(0, step + 1).map((s, i) => (
                        <div key={i} style={{
                            padding: '10px 14px', marginBottom: 8,
                            background: i === step ? `${s.col}12` : 'var(--bg3)',
                            border: `1px solid ${i === step ? s.col + '40' : 'var(--border)'}`,
                            borderRadius: 8, transition: 'all 0.2s',
                        }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: s.col, letterSpacing: 1.5, marginBottom: 4 }}>
                                {s.phase.toUpperCase()}
                            </div>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: s.col, marginBottom: 4 }}>{s.eq}</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{s.note}</div>
                        </div>
                    ))}

                    <div style={{ display: 'flex', gap: 8, marginTop: 4, marginBottom: 14 }}>
                        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)', opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
                        <button onClick={() => setStep(p => Math.min(steps.length - 1, p + 1))} disabled={step >= steps.length - 1} style={{ flex: 1, padding: '7px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', background: `${steps[step].col}15`, color: steps[step].col, border: `1px solid ${steps[step].col}40`, opacity: step >= steps.length - 1 ? 0.4 : 1 }}>Next →</button>
                    </div>

                    {/* Selectivity table */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            SELECTIVITY — RELATIVE RATES OF H ABSTRACTION
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 11 }}>
                                <thead>
                                    <tr>
                                        {['Radical', '1° H', '2° H', '3° H', 'Selectivity'].map(h => (
                                            <th key={h} style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.3)', color: 'var(--text3)', fontSize: 10, textAlign: 'center' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {SELECTIVITY.map(r => (
                                        <tr key={r.radical}>
                                            <td style={{ padding: '6px 10px', color: r.col, fontWeight: 700, textAlign: 'center' }}>{r.radical}</td>
                                            {[r.primary, r.secondary, r.tertiary].map((v, i) => (
                                                <td key={i} style={{ padding: '6px 10px', textAlign: 'center', color: r.col }}>
                                                    {v >= 100 ? v.toLocaleString() : v}
                                                </td>
                                            ))}
                                            <td style={{ padding: '6px 10px', textAlign: 'center', color: 'var(--text2)', fontSize: 10 }}>{r.note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {mode === 'conformation' && (
                    <>
                        <ValueCard label="Angle" value={`${angle}°`} color="var(--gold)" highlight />
                        <ValueCard label="Strain" value={`${curE.toFixed(1)} kJ/mol`} color={curE < 2 ? 'var(--teal)' : curE < 6 ? 'var(--gold)' : 'var(--coral)'} />
                        <ValueCard label="Type" value={angle === 180 ? 'Anti (most stable)' : angle % 120 === 0 ? 'Eclipsed (least stable)' : 'Gauche'} color="var(--text2)" />
                    </>
                )}
                {mode === 'properties' && <ValueCard label="Alkanes" value="CₙH₂ₙ₊₂ — saturated" color="var(--gold)" highlight />}
                {mode === 'halogenation' && <ValueCard label="Halogen" value={halogen} color={halogen === 'Cl₂' ? '#1D9E75' : '#D85A30'} highlight />}
            </div>
        </div>
    )
}