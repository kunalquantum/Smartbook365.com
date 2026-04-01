import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 220
const WIRE_X1 = 60, WIRE_X2 = W - 60
const WIRE_Y = 110, WIRE_H = 28

export default function JouleHeating() {
    const [I, setI] = useState(3)      // A
    const [R, setR] = useState(5)      // Ω
    const [time, setTime] = useState(0)      // s
    const [running, setRunning] = useState(false)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    const P = I * I * R                    // Watts
    const V = I * R                        // Volts
    const H_t = P * time                     // Joules total
    const kWh = H_t / 3.6e6

    // Temperature rise (simplified: Q=mcΔT, assume copper wire 1g, c=385)
    const deltaT = H_t / (0.001 * 385)

    // Wire color — cool blue → orange → white hot
    const wireColor = () => {
        if (P < 5) return '#378ADD'
        if (P < 20) return '#EF9F27'
        if (P < 50) return '#D85A30'
        return '#FFFFFF'
    }

    const glowOpacity = Math.min(0.5, P / 100)
    const glowRadius = Math.min(30, P / 3 + 4)

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            setTime(tRef.current)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setRunning(false)
        tRef.current = 0
        setTime(0)
        lastRef.current = null
    }

    // Particle flow
    const tRef2 = useRef(0)
    const [tick, setTick] = useState(0)
    const rafRef2 = useRef(null)
    const lastRef2 = useRef(null)
    useEffect(() => {
        const step = ts => {
            if (!lastRef2.current) lastRef2.current = ts
            tRef2.current += (ts - lastRef2.current) / 1000
            lastRef2.current = ts
            setTick(p => p + 1)
            rafRef2.current = requestAnimationFrame(step)
        }
        rafRef2.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef2.current)
    }, [])

    const t2 = tRef2.current
    const nParticles = Math.min(12, Math.round(I * 2))
    const WIRE_LEN = WIRE_X2 - WIRE_X1
    const speed_px = I * 12   // visual speed

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Current I" unit=" A" value={I} min={0.1} max={10} step={0.1} onChange={setI} />
                <SimSlider label="Resistance R" unit=" Ω" value={R} min={0.1} max={50} step={0.1} onChange={setR} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                {/* Glow effect */}
                {P > 2 && (
                    <ellipse cx={(WIRE_X1 + WIRE_X2) / 2} cy={WIRE_Y}
                        rx={(WIRE_X2 - WIRE_X1) / 2 + 10} ry={glowRadius}
                        fill={wireColor()} opacity={glowOpacity} />
                )}

                {/* Wire body */}
                <rect x={WIRE_X1} y={WIRE_Y - WIRE_H / 2}
                    width={WIRE_LEN} height={WIRE_H}
                    rx={6}
                    fill={`rgba(${P > 50 ? '255,200,100' : P > 20 ? '216,90,48' : P > 5 ? '239,159,39' : '55,138,221'},0.2)`}
                    stroke={wireColor()} strokeWidth={2} />

                {/* Heat waves (wavy lines above wire when hot) */}
                {P > 10 && Array.from({ length: 5 }, (_, i) => {
                    const wx = WIRE_X1 + 60 + i * 70
                    const phase = t2 * 3 + i * 1.2
                    const amp = Math.min(12, P / 8)
                    return (
                        <path key={i}
                            d={`M ${wx} ${WIRE_Y - WIRE_H / 2 - 4}
                  Q ${wx + 8} ${WIRE_Y - WIRE_H / 2 - 4 - amp}
                    ${wx + 16} ${WIRE_Y - WIRE_H / 2 - 4}
                  Q ${wx + 24} ${WIRE_Y - WIRE_H / 2 - 4 + amp / 2}
                    ${wx + 32} ${WIRE_Y - WIRE_H / 2 - 4}`}
                            fill="none"
                            stroke={`rgba(239,159,39,${Math.min(0.6, P / 80)})`}
                            strokeWidth={1.5} />
                    )
                })}

                {/* Electrons moving through wire */}
                {Array.from({ length: nParticles }, (_, i) => {
                    const baseX = WIRE_X1 + (i / nParticles) * WIRE_LEN
                    const x = ((baseX - WIRE_X1 + speed_px * t2) % WIRE_LEN + WIRE_LEN) % WIRE_LEN + WIRE_X1
                    const y = WIRE_Y - 6 + (i % 3) * 6
                    return (
                        <circle key={i} cx={x} cy={y} r={3.5}
                            fill="rgba(255,255,255,0.8)"
                            opacity={0.7} />
                    )
                })}

                {/* R label on wire */}
                <text x={(WIRE_X1 + WIRE_X2) / 2} y={WIRE_Y + 4} textAnchor="middle"
                    style={{ fontSize: 11, fill: wireColor(), fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    R = {R} Ω
                </text>

                {/* Voltage label */}
                <text x={WIRE_X1 - 8} y={WIRE_Y + 4} textAnchor="end"
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>+{V.toFixed(1)}V</text>
                <text x={WIRE_X2 + 8} y={WIRE_Y + 4}
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>0V</text>

                {/* Power & time display */}
                <text x={W / 2} y={32} textAnchor="middle"
                    style={{ fontSize: 14, fill: wireColor(), fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    P = I²R = {P.toFixed(2)} W
                </text>

                {/* Energy meter bar */}
                {running && (
                    <g>
                        <rect x={WIRE_X1} y={H - 28} width={WIRE_LEN} height={10}
                            rx={3} fill="var(--bg3)" stroke="var(--border)" strokeWidth={0.5} />
                        <rect x={WIRE_X1} y={H - 28}
                            width={Math.min(WIRE_LEN, (H_t / Math.max(P * 30, 1)) * WIRE_LEN)}
                            height={10} rx={3} fill="var(--teal)" />
                        <text x={(WIRE_X1 + WIRE_X2) / 2} y={H - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                            H = {H_t.toFixed(2)} J  |  t = {time.toFixed(1)} s  |  ΔT ≈ {deltaT.toFixed(1)}°C
                        </text>
                    </g>
                )}

                {/* Temperature scale on right */}
                {(() => {
                    const barH = 120, barX = W - 24, barY = (H - barH) / 2
                    const fillH = Math.min(barH, (deltaT / 500) * barH)
                    const tColor = deltaT < 100 ? '#378ADD' : deltaT < 300 ? '#EF9F27' : '#D85A30'
                    return (
                        <g>
                            <rect x={barX} y={barY} width={14} height={barH}
                                rx={4} fill="var(--bg3)" stroke="var(--border)" strokeWidth={0.5} />
                            <rect x={barX} y={barY + barH - fillH} width={14} height={fillH}
                                rx={3} fill={tColor} />
                            <text x={barX + 7} y={barY - 6} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>ΔT</text>
                            <text x={barX + 7} y={barY + barH + 12} textAnchor="middle"
                                style={{ fontSize: 8, fill: tColor, fontFamily: 'var(--mono)' }}>
                                {deltaT.toFixed(0)}°
                            </text>
                        </g>
                    )
                })()}
            </svg>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => setRunning(p => !p)} style={{
                    padding: '8px 24px', borderRadius: 8, fontSize: 13,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: running ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.15)',
                    color: running ? 'var(--coral)' : 'var(--amber)',
                    border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
                }}>
                    {running ? '⏸ Pause' : '▶ Start heating'}
                </button>
                <button onClick={reset} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 13,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Power P = I²R', val: `${P.toFixed(3)} W`, color: wireColor() },
                    { label: 'Voltage V = IR', val: `${V.toFixed(3)} V`, color: 'var(--amber)' },
                    { label: 'Heat H = Pt', val: `${H_t.toFixed(2)} J`, color: 'var(--teal)' },
                    { label: 'Energy (kWh)', val: `${kWh.toExponential(3)} kWh`, color: 'var(--text2)' },
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

            {P > 50 && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.3)',
                    fontSize: 12, color: 'var(--coral)', fontFamily: 'var(--mono)',
                }}>
                    ⚠ High power — wire would overheat in real life (fuse would blow)
                </div>
            )}
        </div>
    )
}