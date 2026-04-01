import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280

const CORE_LOSSES = {
    'Ideal (no loss)': 0,
    'Silicon steel': 2,
    'Cast iron': 8,
    'Air core': 15,
}

export default function TransformerSim() {
    const [Vp, setVp] = useState(230)    // Primary voltage V
    const [Np, setNp] = useState(500)    // Primary turns
    const [Ns, setNs] = useState(100)    // Secondary turns
    const [RL, setRL] = useState(10)     // Load resistance Ω
    const [core, setCore] = useState('Silicon steel')

    // Ideal transformer equations
    const ratio = Ns / Np
    const Vs = Vp * ratio              // Secondary voltage
    const Is = Vs / RL                 // Secondary current
    const Ip_ideal = Is * ratio              // Primary current (ideal)
    const P_out = Vs * Is                 // Output power
    const P_in_ideal = Vp * Ip_ideal         // Input power (ideal = P_out)

    // Losses
    const lossPercent = CORE_LOSSES[core]
    const P_loss = P_in_ideal * lossPercent / 100
    const P_in = P_in_ideal + P_loss
    const Ip = P_in / Vp
    const eta = (P_out / P_in) * 100    // efficiency %

    const isStepUp = Ns > Np

    // Core current direction animation (not needed — static visual)
    // SVG layout
    const CORE_X = 120, CORE_Y = 80
    const CORE_W = 220, CORE_H = 120
    const CORE_T = 22  // core thickness

    // Winding rects
    const WIND_W = 50
    const PRI_X = CORE_X - WIND_W + CORE_T
    const SEC_X = CORE_X + CORE_W - CORE_T

    const priTurns = Math.min(10, Math.max(2, Math.round(Np / 100)))
    const secTurns = Math.min(10, Math.max(2, Math.round(Ns / 100)))

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <SimSlider label="Primary V₁" unit=" V" value={Vp} min={10} max={500} step={5} onChange={setVp} />
                <SimSlider label="Primary N₁" unit="" value={Np} min={50} max={2000} step={50} onChange={setNp} />
                <SimSlider label="Secondary N₂" unit="" value={Ns} min={50} max={2000} step={50} onChange={setNs} />
                <SimSlider label="Load R_L" unit=" Ω" value={RL} min={1} max={1000} step={1} onChange={setRL} />
            </div>

            {/* Core selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(CORE_LOSSES).map(k => (
                    <button key={k} onClick={() => setCore(k)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: core === k ? 'var(--teal)' : 'var(--bg3)',
                        color: core === k ? '#fff' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>{k} ({CORE_LOSSES[k]}% loss)</button>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('tr1', '#EF9F27')}
                    {arrowDef('tr2', '#1D9E75')}
                    {arrowDef('trflux', 'rgba(127,119,221,0.7)')}
                </defs>

                {/* === Iron core (E-I shape) === */}
                {/* Top bar */}
                <rect x={CORE_X} y={CORE_Y} width={CORE_W} height={CORE_T}
                    rx={3} fill="rgba(160,176,200,0.2)"
                    stroke="rgba(160,176,200,0.35)" strokeWidth={1.5} />
                {/* Bottom bar */}
                <rect x={CORE_X} y={CORE_Y + CORE_H - CORE_T} width={CORE_W} height={CORE_T}
                    rx={3} fill="rgba(160,176,200,0.2)"
                    stroke="rgba(160,176,200,0.35)" strokeWidth={1.5} />
                {/* Left leg */}
                <rect x={CORE_X} y={CORE_Y} width={CORE_T} height={CORE_H}
                    rx={3} fill="rgba(160,176,200,0.2)"
                    stroke="rgba(160,176,200,0.35)" strokeWidth={1.5} />
                {/* Right leg */}
                <rect x={CORE_X + CORE_W - CORE_T} y={CORE_Y} width={CORE_T} height={CORE_H}
                    rx={3} fill="rgba(160,176,200,0.2)"
                    stroke="rgba(160,176,200,0.35)" strokeWidth={1.5} />
                {/* Centre leg */}
                <rect x={CORE_X + CORE_W / 2 - CORE_T / 2} y={CORE_Y} width={CORE_T} height={CORE_H}
                    rx={2} fill="rgba(160,176,200,0.15)"
                    stroke="rgba(160,176,200,0.2)" strokeWidth={1} />

                {/* Flux arrows in core */}
                {[-1, 1].map(dir => (
                    <g key={dir}>
                        <line x1={CORE_X + CORE_W / 2} y1={dir > 0 ? CORE_Y + 6 : CORE_Y + CORE_H - 6}
                            x2={dir > 0 ? CORE_X + 6 : CORE_X + CORE_W - 6}
                            y2={dir > 0 ? CORE_Y + 6 : CORE_Y + CORE_H - 6}
                            stroke="rgba(127,119,221,0.4)" strokeWidth={1}
                            markerEnd="url(#trflux)" />
                    </g>
                ))}

                {/* Primary winding */}
                {Array.from({ length: priTurns }, (_, i) => {
                    const cy = CORE_Y + CORE_T + 4 + i * ((CORE_H - CORE_T * 2 - 8) / priTurns)
                    return (
                        <ellipse key={i}
                            cx={CORE_X + CORE_T / 2} cy={cy}
                            rx={14} ry={6}
                            fill="none"
                            stroke="rgba(239,159,39,0.6)" strokeWidth={2} />
                    )
                })}
                {/* Primary label */}
                <text x={CORE_X - 14} y={CORE_Y + CORE_H / 2 + 4} textAnchor="end"
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                    N₁={Np}
                </text>

                {/* Secondary winding */}
                {Array.from({ length: secTurns }, (_, i) => {
                    const cy = CORE_Y + CORE_T + 4 + i * ((CORE_H - CORE_T * 2 - 8) / secTurns)
                    return (
                        <ellipse key={i}
                            cx={CORE_X + CORE_W - CORE_T / 2} cy={cy}
                            rx={14} ry={6}
                            fill="none"
                            stroke="rgba(29,158,117,0.6)" strokeWidth={2} />
                    )
                })}
                <text x={CORE_X + CORE_W + 14} y={CORE_Y + CORE_H / 2 + 4}
                    style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    N₂={Ns}
                </text>

                {/* Primary input wires + voltage */}
                <line x1={20} y1={CORE_Y + CORE_H / 2 - 16}
                    x2={CORE_X - 14} y2={CORE_Y + CORE_H / 2 - 16}
                    stroke="#EF9F27" strokeWidth={1.5} />
                <line x1={20} y1={CORE_Y + CORE_H / 2 + 16}
                    x2={CORE_X - 14} y2={CORE_Y + CORE_H / 2 + 16}
                    stroke="#EF9F27" strokeWidth={1.5} />
                {/* AC source */}
                <circle cx={20} cy={CORE_Y + CORE_H / 2} r={18}
                    fill="var(--bg3)" stroke="#EF9F27" strokeWidth={1.5} />
                <path d={`M 8 ${CORE_Y + CORE_H / 2} Q 14 ${CORE_Y + CORE_H / 2 - 10} 20 ${CORE_Y + CORE_H / 2} Q 26 ${CORE_Y + CORE_H / 2 + 10} 32 ${CORE_Y + CORE_H / 2}`}
                    fill="none" stroke="#EF9F27" strokeWidth={1.5} />

                <text x={20} y={CORE_Y + CORE_H / 2 + 34} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                    V₁={Vp}V
                </text>
                <text x={20} y={CORE_Y + CORE_H / 2 + 44} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>
                    I₁={Ip.toFixed(3)}A
                </text>

                {/* Secondary output wires + load */}
                <line x1={CORE_X + CORE_W + 14} y1={CORE_Y + CORE_H / 2 - 16}
                    x2={W - 40} y2={CORE_Y + CORE_H / 2 - 16}
                    stroke="#1D9E75" strokeWidth={1.5} />
                <line x1={CORE_X + CORE_W + 14} y1={CORE_Y + CORE_H / 2 + 16}
                    x2={W - 40} y2={CORE_Y + CORE_H / 2 + 16}
                    stroke="#1D9E75" strokeWidth={1.5} />
                {/* Load resistor */}
                <rect x={W - 40} y={CORE_Y + CORE_H / 2 - 24}
                    width={28} height={48} rx={4}
                    fill="var(--bg3)" stroke="#1D9E75" strokeWidth={1.5} />
                <text x={W - 26} y={CORE_Y + CORE_H / 2 + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    R_L
                </text>
                <text x={W - 26} y={CORE_Y + CORE_H / 2 + 16} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                    {RL}Ω
                </text>

                {/* V₂ label */}
                <text x={CORE_X + CORE_W + 60} y={CORE_Y + CORE_H / 2 - 22} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    V₂={Vs.toFixed(1)}V
                </text>
                <text x={CORE_X + CORE_W + 60} y={CORE_Y + CORE_H / 2 - 10} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                    I₂={Is.toFixed(3)}A
                </text>

                {/* Step-up / Step-down badge */}
                <text x={W / 2} y={CORE_Y - 12} textAnchor="middle"
                    style={{ fontSize: 11, fill: isStepUp ? 'var(--coral)' : 'var(--teal)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    {isStepUp ? '↑ Step-up transformer' : '↓ Step-down transformer'}
                    {'  N₂/N₁ = '}{ratio.toFixed(3)}
                </text>

                {/* Efficiency bar */}
                {(() => {
                    const barW = 200, barX = W / 2 - 100, barY = H - 36
                    const fillW = (eta / 100) * barW
                    const barColor = eta > 95 ? '#1D9E75' : eta > 80 ? '#EF9F27' : '#D85A30'
                    return (
                        <g>
                            <rect x={barX} y={barY} width={barW} height={12}
                                rx={4} fill="var(--bg3)"
                                stroke="var(--border)" strokeWidth={0.5} />
                            <rect x={barX} y={barY} width={fillW} height={12}
                                rx={4} fill={barColor} />
                            <text x={W / 2} y={barY + 24} textAnchor="middle"
                                style={{ fontSize: 9, fill: barColor, fontFamily: 'var(--mono)' }}>
                                η = {eta.toFixed(1)}%  |  P_out={P_out.toFixed(2)}W  |  P_loss={P_loss.toFixed(2)}W
                            </text>
                        </g>
                    )
                })()}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Turns ratio N₂/N₁', val: ratio.toFixed(4), color: 'var(--amber)' },
                    { label: 'V₂ = V₁×(N₂/N₁)', val: `${Vs.toFixed(2)} V`, color: 'var(--teal)' },
                    { label: 'Efficiency η', val: `${eta.toFixed(2)}%`, color: eta > 95 ? 'var(--teal)' : eta > 80 ? 'var(--amber)' : 'var(--coral)' },
                    { label: 'Power output', val: `${P_out.toFixed(3)} W`, color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}