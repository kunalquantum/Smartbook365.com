import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const V_SOUND = 340
const CY = H / 2

export default function DopplerEffect() {
    const [vs, setVs] = useState(80)    // source speed m/s
    const [f0, setF0] = useState(440)   // source freq Hz
    const [running, setRunning] = useState(true)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)
    const srcXRef = useRef(60)

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            // Move source left→right, wrap around
            srcXRef.current = 60 + ((tRef.current * vs * 0.5) % (W - 120))
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, vs])

    const srcX = srcXRef.current
    const t = tRef.current

    // Doppler formulas
    const f_ahead = f0 * V_SOUND / (V_SOUND - vs)    // observer ahead
    const f_behind = f0 * V_SOUND / (V_SOUND + vs)    // observer behind
    const mach = vs / V_SOUND

    // Wavefronts — circles emitted at past positions
    const nWaves = 6
    const wavefronts = Array.from({ length: nWaves }, (_, i) => {
        const age = (i + 1) * 0.25            // seconds ago
        const emitX = srcX - vs * 0.5 * age    // where source was
        const radius = V_SOUND * 0.5 * age     // how big circle grew
        return { emitX, radius, age }
    })

    const observerAhead = W - 40
    const observerBehind = 40

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Source speed vₛ" unit=" m/s" value={vs} min={0} max={300} step={10} onChange={v => { setVs(v) }} />
                <SimSlider label="Source freq f₀" unit=" Hz" value={f0} min={100} max={1000} step={10} onChange={setF0} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>

                {/* Wavefront circles */}
                {wavefronts.map((wf, i) => {
                    const opacity = Math.max(0, 0.5 - i * 0.08)
                    const r = Math.min(wf.radius, W)
                    if (r < 2) return null
                    return (
                        <circle key={i}
                            cx={wf.emitX} cy={CY} r={r}
                            fill="none"
                            stroke={`rgba(239,159,39,${opacity})`}
                            strokeWidth={1.5} />
                    )
                })}

                {/* Ground line */}
                <line x1={0} y1={CY + 40} x2={W} y2={CY + 40}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />

                {/* Observer AHEAD (high frequency) */}
                <circle cx={observerAhead} cy={CY} r={10}
                    fill="rgba(29,158,117,0.2)" stroke="#1D9E75" strokeWidth={1.5} />
                <text x={observerAhead} y={CY - 16} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    f′={f_ahead.toFixed(0)}Hz
                </text>
                <text x={observerAhead} y={CY + 22} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>ahead</text>

                {/* Observer BEHIND (low frequency) */}
                <circle cx={observerBehind} cy={CY} r={10}
                    fill="rgba(216,90,48,0.2)" stroke="#D85A30" strokeWidth={1.5} />
                <text x={observerBehind} y={CY - 16} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                    f′={f_behind.toFixed(0)}Hz
                </text>
                <text x={observerBehind} y={CY + 22} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>behind</text>

                {/* Source */}
                <circle cx={srcX} cy={CY} r={12}
                    fill="rgba(239,159,39,0.3)" stroke="#EF9F27" strokeWidth={2} />
                {/* Direction arrow on source */}
                <defs>
                    <marker id="dop" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#EF9F27"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>
                <line x1={srcX + 12} y1={CY} x2={srcX + 32} y2={CY}
                    stroke="#EF9F27" strokeWidth={1.5} markerEnd="url(#dop)" />
                <text x={srcX} y={CY - 18} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                    source {f0}Hz
                </text>

                {/* Mach cone if supersonic */}
                {mach >= 1 && (() => {
                    const halfAngle = Math.asin(1 / mach)
                    const coneLen = 120
                    const tipX = srcX, tipY = CY
                    const x1 = tipX - coneLen
                    const y1 = tipY - coneLen * Math.tan(halfAngle)
                    const x2 = tipX - coneLen
                    const y2 = tipY + coneLen * Math.tan(halfAngle)
                    return (
                        <>
                            <line x1={tipX} y1={tipY} x2={x1} y2={y1}
                                stroke="rgba(216,90,48,0.5)" strokeWidth={1.5} />
                            <line x1={tipX} y1={tipY} x2={x2} y2={y2}
                                stroke="rgba(216,90,48,0.5)" strokeWidth={1.5} />
                            <text x={srcX - coneLen / 2} y={CY - coneLen * Math.tan(halfAngle) / 2 - 8}
                                style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                                Mach cone
                            </text>
                        </>
                    )
                })()}

                {/* Info labels */}
                <text x={W / 2} y={H - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    f′ = f₀ × v/(v∓vₛ)  — wavefronts compress ahead, spread behind
                </text>
            </svg>

            <button onClick={() => setRunning(p => !p)} style={{
                padding: '6px 20px', borderRadius: 8, fontSize: 12,
                fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                background: running ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.15)',
                color: running ? 'var(--coral)' : 'var(--teal)',
                border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
            }}>
                {running ? '⏸ Pause' : '▶ Resume'}
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'f₀ (source)', val: `${f0} Hz`, color: 'var(--amber)' },
                    { label: 'f′ ahead', val: `${f_ahead.toFixed(1)} Hz`, color: 'var(--teal)' },
                    { label: 'f′ behind', val: `${f_behind.toFixed(1)} Hz`, color: 'var(--coral)' },
                    { label: 'Mach number', val: mach.toFixed(2), color: mach >= 1 ? 'var(--coral)' : 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>

            {mach >= 1 && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.3)',
                    fontSize: 12, color: 'var(--coral)', fontFamily: 'var(--mono)',
                }}>
                    ⚡ Supersonic! Source outruns its own sound — Mach cone forms (sonic boom)
                </div>
            )}
        </div>
    )
}