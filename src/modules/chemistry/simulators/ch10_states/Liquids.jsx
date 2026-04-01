import { useState, useEffect, useRef } from 'react'
import { LIQUIDS } from './helpers/gasData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

export default function Liquids() {
    const [liq, setLiq] = useState('Water')
    const [T, setT] = useState(25)
    const [mode, setMode] = useState('surface')  // surface | viscosity | vapour

    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const lq = LIQUIDS[liq]

    // Temperature effects — linear approximations
    const STatT = Math.max(10, lq.ST * (1 - (T - 25) * 0.002))
    const viscatT = Math.max(0.2, lq.viscosity * Math.exp(-0.02 * (T - 25)))
    const VPatT = lq.VP * Math.exp(0.04 * (T - 25))

    // Surface tension comparison bars
    const maxST = Math.max(...Object.values(LIQUIDS).map(l => l.ST))

    // Capillary rise — qualitative, r=0.5mm
    const capHeight = STatT / 100   // simplified, cm

    return (
        <div>
            {/* Liquid selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.entries(LIQUIDS).map(([k, v]) => (
                    <button key={k} onClick={() => setLiq(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: liq === k ? v.color : 'var(--bg3)',
                        color: liq === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${liq === k ? v.color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Mode */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'surface', l: 'Surface tension' }, { k: 'viscosity', l: 'Viscosity' }, { k: 'vapour', l: 'Vapour pressure' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? lq.color : 'var(--bg3)',
                        color: mode === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? lq.color : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <ChemSlider label="Temperature T" unit="°C" value={T} min={0} max={lq.BP - 5} step={1} onChange={setT} color={lq.color} />

            {/* ── SURFACE TENSION ── */}
            {mode === 'surface' && (
                <div>
                    <div style={{ padding: '10px 14px', background: `${lq.color}10`, border: `1px solid ${lq.color}25`, borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: lq.color }}>Surface tension:</strong> {lq.STnote}. At higher T, thermal energy disrupts surface cohesion → ST decreases.
                    </div>

                    {/* Animated surface */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <svg viewBox="0 0 380 120" width="100%">
                            {/* Liquid body */}
                            <rect x={20} y={60} width={340} height={50} rx={4}
                                fill={`${lq.color}20`} stroke={`${lq.color}30`} strokeWidth={1} />

                            {/* Animated surface molecules */}
                            {Array.from({ length: 12 }, (_, i) => {
                                const mx = 30 + i * 27
                                const my = 60
                                const jy = Math.sin(t * 2 + i * 0.7) * 2 * (1 - T / 100)
                                const isEdge = i === 0 || i === 11
                                return (
                                    <g key={i}>
                                        <circle cx={mx} cy={my + jy} r={7}
                                            fill={`${lq.color}40`}
                                            stroke={lq.color} strokeWidth={1.5} />
                                        {/* Cohesive force arrow (downward for surface molecules) */}
                                        {!isEdge && (
                                            <line x1={mx} y1={my + jy + 7}
                                                x2={mx} y2={my + jy + 18}
                                                stroke={`${lq.color}60`} strokeWidth={1} />
                                        )}
                                    </g>
                                )
                            })}

                            {/* Capillary tube */}
                            <rect x={165} y={20} width={16} height={60} rx={3}
                                fill="rgba(55,138,221,0.06)"
                                stroke="rgba(55,138,221,0.3)" strokeWidth={1} />
                            {/* Capillary meniscus */}
                            <path d={`M 165 ${60 - capHeight * 15} Q 173 ${58 - capHeight * 15} 181 ${60 - capHeight * 15}`}
                                fill={`${lq.color}30`}
                                stroke={lq.color} strokeWidth={1.5} />
                            <text x={185} y={55} style={{ fontSize: 9, fill: lq.color, fontFamily: 'var(--mono)' }}>
                                h ∝ ST/{T + 273}
                            </text>

                            {/* ST value */}
                            <text x={190} y={95}
                                style={{ fontSize: 12, fill: lq.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                ST = {STatT.toFixed(1)} mN/m at {T}°C
                            </text>
                        </svg>
                    </div>

                    {/* Comparison bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            SURFACE TENSION COMPARISON (at 25°C)
                        </div>
                        {Object.entries(LIQUIDS).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                onClick={() => setLiq(k)}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: v.color, minWidth: 60 }}>{k}</span>
                                <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(v.ST / maxST) * 100}%`, background: k === liq ? v.color : `${v.color}60`, borderRadius: 7 }} />
                                </div>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: v.color, minWidth: 60 }}>{v.ST} mN/m</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── VISCOSITY ── */}
            {mode === 'viscosity' && (
                <div>
                    <div style={{ padding: '10px 14px', background: `${lq.color}10`, border: `1px solid ${lq.color}25`, borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: lq.color }}>Viscosity:</strong> resistance to flow — caused by intermolecular friction. Viscosity decreases rapidly with temperature (Arrhenius-like). Units: mPa·s (or cP).
                    </div>

                    {/* Animated flow */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <svg viewBox="0 0 380 100" width="100%">
                            {/* Pipe */}
                            <rect x={20} y={20} width={340} height={60} rx={6}
                                fill={`${lq.color}08`} stroke={`${lq.color}25`} strokeWidth={1} />

                            {/* Flow particles with parabolic velocity profile */}
                            {Array.from({ length: 8 }, (_, i) => {
                                const y = 30 + i * 7
                                const r = Math.abs(y - 50) / 30  // 0 at centre, 1 at wall
                                const vel = (1 - r * r) * (0.8 / viscatT) * 40  // parabolic
                                const x = 20 + ((t * vel * 60) % 340)
                                const col = r < 0.3 ? lq.color : `${lq.color}70`
                                return (
                                    <g key={i}>
                                        <circle cx={x} cy={y} r={4}
                                            fill={col} opacity={0.8} />
                                    </g>
                                )
                            })}

                            {/* Velocity profile arrows */}
                            {[-20, -12, -4, 0, 4, 12, 20].map((dy, i) => {
                                const y = 50 + dy
                                const r = Math.abs(dy) / 20
                                const arrowL = (1 - r * r) * 50 * (0.5 / Math.max(0.3, viscatT))
                                const capped = Math.min(arrowL, 60)
                                return (
                                    <line key={i} x1={300} y1={y} x2={300 + capped} y2={y}
                                        stroke={lq.color} strokeWidth={1.5} opacity={0.6} />
                                )
                            })}
                            <text x={355} y={54} style={{ fontSize: 8, fill: `${lq.color}80`, fontFamily: 'var(--mono)' }}>v profile</text>

                            <text x={40} y={98}
                                style={{ fontSize: 11, fill: lq.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                η = {viscatT.toFixed(3)} mPa·s at {T}°C  (↓ as T increases)
                            </text>
                        </svg>
                    </div>

                    {/* All liquids comparison */}
                    <div>
                        {Object.entries(LIQUIDS).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: v.color, minWidth: 60 }}>{k}</span>
                                <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(v.viscosity / 2) * 100}%`, background: k === liq ? v.color : `${v.color}60`, borderRadius: 7 }} />
                                </div>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: v.color, minWidth: 60 }}>{v.viscosity} mPa·s</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── VAPOUR PRESSURE ── */}
            {mode === 'vapour' && (
                <div>
                    <div style={{ padding: '10px 14px', background: `${lq.color}10`, border: `1px solid ${lq.color}25`, borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: lq.color }}>Vapour pressure</strong> increases with temperature (Clausius-Clapeyron). Boiling occurs when VP = atmospheric pressure (101.3 kPa). At {lq.BP}°C, VP = 1 atm for {liq}.
                    </div>

                    {/* VP vs T curve for selected liquid */}
                    {(() => {
                        const W2 = 380, H2 = 140, GP2 = { l: 44, r: 16, t: 12, b: 28 }
                        const pts = Array.from({ length: 50 }, (_, i) => {
                            const Tc = 10 + i * (lq.BP + 20 - 10) / 49
                            return { T: Tc, VP: lq.VP * Math.exp(0.04 * (Tc - 25)) }
                        })
                        const PW2 = W2 - GP2.l - GP2.r, PH2 = H2 - GP2.t - GP2.b
                        const maxVP = Math.max(...pts.map(p => p.VP))
                        const tx = T => GP2.l + ((T - 10) / (lq.BP + 10)) * PW2
                        const ty = VP => GP2.t + PH2 - (VP / maxVP) * PH2
                        const curvePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${tx(p.T).toFixed(1)},${ty(p.VP).toFixed(1)}`).join(' ')
                        return (
                            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                                <svg viewBox={`0 0 ${W2} ${H2}`} width="100%">
                                    {/* 1 atm line */}
                                    <line x1={GP2.l} y1={ty(lq.VP * Math.exp(0.04 * (lq.BP - 25)))}
                                        x2={GP2.l + PW2} y2={ty(lq.VP * Math.exp(0.04 * (lq.BP - 25)))}
                                        stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="5 3" />
                                    <text x={GP2.l + 4} y={ty(lq.VP * Math.exp(0.04 * (lq.BP - 25))) - 4}
                                        style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>1 atm → BP</text>

                                    {/* Curve */}
                                    <path d={curvePath} fill="none" stroke={lq.color} strokeWidth={2.5} />

                                    {/* Current point */}
                                    <circle cx={tx(T)} cy={ty(VPatT)} r={5}
                                        fill={lq.color} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

                                    {/* Axes */}
                                    <line x1={GP2.l} y1={GP2.t} x2={GP2.l} y2={GP2.t + PH2} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                    <line x1={GP2.l} y1={GP2.t + PH2} x2={GP2.l + PW2} y2={GP2.t + PH2} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                    <text x={GP2.l + PW2} y={GP2.t + PH2 + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>T (°C)</text>
                                    <text x={GP2.l - 4} y={GP2.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>VP (kPa)</text>
                                </svg>
                            </div>
                        )
                    })()}

                    {/* BP comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {Object.entries(LIQUIDS).map(([k, v]) => (
                            <div key={k} style={{ padding: '8px 12px', background: 'var(--bg3)', border: `1px solid ${k === liq ? v.color : 'var(--border)'}`, borderRadius: 8, cursor: 'pointer' }}
                                onClick={() => setLiq(k)}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: v.color }}>{k}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginLeft: 8 }}>BP {v.BP}°C</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Liquid" value={liq} color={lq.color} highlight />
                <ValueCard label="ST at T" value={`${STatT.toFixed(1)} mN/m`} color="var(--teal)" />
                <ValueCard label="Viscosity" value={`${viscatT.toFixed(3)} mPa·s`} color="var(--purple)" />
                <ValueCard label="VP at T" value={`${VPatT.toFixed(2)} kPa`} color="var(--gold)" />
            </div>
        </div>
    )
}