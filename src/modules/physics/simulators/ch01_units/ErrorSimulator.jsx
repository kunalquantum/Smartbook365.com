import { useState, useEffect, useRef, useCallback } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 220
const TRUE_G = 9.807     // true value m/s²
const PAD = { l: 50, r: 20, t: 20, b: 32 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

export default function ErrorSimulator() {
    const [L, setL] = useState(1.0)     // pendulum length m
    const [sysErr, setSysErr] = useState(0)        // systematic error m
    const [randSd, setRandSd] = useState(0.02)    // random std dev s
    const [readings, setReadings] = useState([])
    const [swinging, setSwinging] = useState(false)
    const [angle, setAngle] = useState(0)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    const T_true = 2 * Math.PI * Math.sqrt((L + sysErr) / TRUE_G)

    // Pendulum animation
    useEffect(() => {
        if (!swinging) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setAngle(30 * Math.sin(2 * Math.PI * tRef.current / T_true))
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [swinging, T_true])

    const addReading = useCallback(() => {
        const noise = (Math.random() - 0.5) * randSd * 4
        const T_meas = T_true + noise
        const g_calc = 4 * Math.PI * Math.PI * L / (T_meas * T_meas)
        setReadings(p => [...p.slice(-11), parseFloat(g_calc.toFixed(4))])
    }, [T_true, L, randSd])

    const reset = () => setReadings([])

    // Stats
    const n = readings.length
    const mean = n ? readings.reduce((a, b) => a + b, 0) / n : 0
    const absErrs = readings.map(r => Math.abs(r - mean))
    const meanErr = n ? absErrs.reduce((a, b) => a + b, 0) / n : 0
    const relErr = mean ? (meanErr / mean) * 100 : 0

    // Graph: readings as dots on a number line
    const G_MIN = 9.0, G_MAX = 11.0
    const toGX = v => PAD.l + ((v - G_MIN) / (G_MAX - G_MIN)) * PW

    // Pendulum bob position
    const PIVOT_X = 100, PIVOT_Y = 30
    const ARM_L = 60
    const rad = angle * Math.PI / 180
    const bobX = PIVOT_X + ARM_L * Math.sin(rad)
    const bobY = PIVOT_Y + ARM_L * Math.cos(rad)

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Pendulum length L" unit=" m" value={L} min={0.2} max={2} step={0.05} onChange={setL} />
                <SimSlider label="Systematic error" unit=" m" value={sysErr} min={0} max={0.1} step={0.005} onChange={setSysErr} />
                <SimSlider label="Random scatter σ" unit=" s" value={randSd} min={0} max={0.1} step={0.005} onChange={setRandSd} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* === Pendulum (left) === */}
                {/* Ceiling */}
                <rect x={70} y={24} width={60} height={8} rx={2}
                    fill="rgba(160,176,200,0.3)" />
                {/* Arm */}
                <line x1={PIVOT_X} y1={PIVOT_Y + 4}
                    x2={bobX} y2={bobY}
                    stroke="rgba(160,176,200,0.5)" strokeWidth={1.5} />
                {/* Arc trace */}
                <path d={`M ${PIVOT_X - ARM_L * 0.6} ${PIVOT_Y + ARM_L * 0.8}
                  A ${ARM_L} ${ARM_L} 0 0 1
                  ${PIVOT_X + ARM_L * 0.6} ${PIVOT_Y + ARM_L * 0.8}`}
                    fill="none" stroke="rgba(255,255,255,0.04)"
                    strokeWidth={1} strokeDasharray="3 3" />
                {/* Bob */}
                <circle cx={bobX} cy={bobY} r={10}
                    fill="rgba(239,159,39,0.4)"
                    stroke="#EF9F27" strokeWidth={2} />
                {/* Length label */}
                <text x={PIVOT_X - 18} y={(PIVOT_Y + bobY) / 2 + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>L={L}m</text>
                {/* T label */}
                <text x={PIVOT_X + ARM_L + 14} y={PIVOT_Y + ARM_L * 0.6 + 4}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                    T={T_true.toFixed(3)}s
                </text>

                {/* Systematic error indicator */}
                {sysErr > 0 && (
                    <g>
                        <line x1={PIVOT_X} y1={PIVOT_Y + 4}
                            x2={PIVOT_X + 14} y2={PIVOT_Y + 4}
                            stroke="#D85A30" strokeWidth={2} />
                        <text x={PIVOT_X + 16} y={PIVOT_Y + 8}
                            style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            +{sysErr}m sys
                        </text>
                    </g>
                )}

                {/* === Dot plot (right) === */}
                <text x={PAD.l + PW / 2} y={PAD.t + 12} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    Calculated g (m/s²) per trial
                </text>

                {/* Axis */}
                <line x1={PAD.l} y1={PAD.t + PH * 0.6}
                    x2={PAD.l + PW} y2={PAD.t + PH * 0.6}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

                {/* True value line */}
                <line x1={toGX(TRUE_G)} y1={PAD.t + 20}
                    x2={toGX(TRUE_G)} y2={PAD.t + PH * 0.6 + 12}
                    stroke="rgba(29,158,117,0.5)" strokeWidth={1.5}
                    strokeDasharray="4 3" />
                <text x={toGX(TRUE_G)} y={PAD.t + 16} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                    true g
                </text>

                {/* Mean line */}
                {n > 0 && (
                    <>
                        <line x1={toGX(mean)} y1={PAD.t + 20}
                            x2={toGX(mean)} y2={PAD.t + PH * 0.6 + 12}
                            stroke="var(--amber)" strokeWidth={2} />
                        <text x={toGX(mean)} y={PAD.t + PH * 0.6 + 24} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            x̄={mean.toFixed(3)}
                        </text>
                    </>
                )}

                {/* Error bar */}
                {n > 1 && (
                    <rect x={toGX(mean - meanErr)} y={PAD.t + PH * 0.6 - 8}
                        width={Math.max(2, toGX(mean + meanErr) - toGX(mean - meanErr))}
                        height={16} rx={2}
                        fill="rgba(239,159,39,0.12)"
                        stroke="rgba(239,159,39,0.3)" strokeWidth={1} />
                )}

                {/* Reading dots */}
                {readings.map((r, i) => {
                    const isOutlier = Math.abs(r - mean) > meanErr * 2
                    const row = Math.floor(i / 12)
                    return (
                        <g key={i}>
                            <circle cx={toGX(r)} cy={PAD.t + PH * 0.6 - 18 - row * 14} r={5}
                                fill={isOutlier ? '#D85A30' : '#EF9F27'}
                                opacity={0.8} />
                        </g>
                    )
                })}

                {/* Tick marks */}
                {[9.0, 9.5, 9.807, 10.0, 10.5, 11.0].map(v => (
                    <g key={v}>
                        <line x1={toGX(v)} y1={PAD.t + PH * 0.6}
                            x2={toGX(v)} y2={PAD.t + PH * 0.6 + 6}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                        <text x={toGX(v)} y={PAD.t + PH * 0.6 + 16} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            {v}
                        </text>
                    </g>
                ))}

                {/* Instruction */}
                {n === 0 && (
                    <text x={PAD.l + PW / 2} y={PAD.t + PH * 0.6 - 20} textAnchor="middle"
                        style={{ fontSize: 10, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                        Click "Measure" to add readings
                    </text>
                )}
            </svg>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => setSwinging(p => !p)} style={{
                    padding: '7px 18px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: swinging ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.15)',
                    color: swinging ? 'var(--coral)' : 'var(--teal)',
                    border: `1px solid ${swinging ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
                }}>
                    {swinging ? '⏸ Stop' : '▶ Swing'}
                </button>
                <button onClick={addReading} style={{
                    padding: '7px 18px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(239,159,39,0.12)', color: 'var(--amber)',
                    border: '1px solid rgba(239,159,39,0.3)',
                }}>
                    + Measure (add reading)
                </button>
                <button onClick={reset} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Mean g', val: n ? `${mean.toFixed(4)} m/s²` : '—', color: 'var(--amber)' },
                    { label: 'Mean abs. error Δg', val: n > 1 ? `± ${meanErr.toFixed(4)}` : '—', color: 'var(--teal)' },
                    { label: 'Relative error', val: n > 1 ? `${relErr.toFixed(3)}%` : '—', color: 'var(--coral)' },
                    { label: 'Systematic bias', val: sysErr > 0 ? `${(mean - TRUE_G).toFixed(4)} m/s²` : 'None', color: sysErr > 0 ? 'var(--coral)' : 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}