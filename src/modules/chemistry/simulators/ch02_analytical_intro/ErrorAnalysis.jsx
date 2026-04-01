import { useState, useCallback } from 'react'
import ValueCard from '../../components/ui/ValueCard'
import ChemSlider from '../../components/ui/ChemSlider'

const TRUE_VAL = 25.00  // true value (mL in a burette reading)

export default function ErrorAnalysis() {
    const [sysErr, setSysErr] = useState(0)       // systematic offset mL
    const [randSd, setRandSd] = useState(0.15)    // random std dev
    const [readings, setReadings] = useState([])
    const [mode, setMode] = useState('scatter') // scatter | bulls

    const addReading = useCallback(() => {
        const rand = (Math.random() - 0.5) * 2 * randSd * 1.7
        const val = parseFloat((TRUE_VAL + sysErr + rand).toFixed(3))
        setReadings(p => [...p.slice(-19), val])
    }, [sysErr, randSd])

    const addBatch = () => {
        const batch = Array.from({ length: 5 }, () => {
            const rand = (Math.random() - 0.5) * 2 * randSd * 1.7
            return parseFloat((TRUE_VAL + sysErr + rand).toFixed(3))
        })
        setReadings(p => [...p.slice(-19 + 5), ...batch].slice(-20))
    }

    const n = readings.length
    const mean = n ? readings.reduce((a, b) => a + b, 0) / n : 0
    const absErrs = readings.map(r => Math.abs(r - mean))
    const meanErr = n ? absErrs.reduce((a, b) => a + b, 0) / n : 0
    const relErr = mean ? (meanErr / mean) * 100 : 0
    const sysBias = mean - TRUE_VAL
    const variance = n > 1 ? readings.reduce((s, r) => s + (r - mean) ** 2, 0) / (n - 1) : 0
    const sd = Math.sqrt(variance)
    const accurate = Math.abs(sysBias) < 0.1
    const precise = sd < 0.12

    // Scatter plot
    const PLOT_W = 400, PLOT_H = 140
    const PAD = { l: 50, r: 20, t: 20, b: 30 }
    const PW = PLOT_W - PAD.l - PAD.r
    const PH = PLOT_H - PAD.t - PAD.b
    const xMin = TRUE_VAL - 1.2, xMax = TRUE_VAL + 1.2
    const toX = v => PAD.l + ((v - xMin) / (xMax - xMin)) * PW
    const toY = i => PAD.t + 10 + (i / (Math.max(n, 1) - 1 || 1)) * (PH - 20)

    // Bulls-eye target
    const TARGET_CX = 100, TARGET_CY = 100, TARGET_R = 80

    const dotToTarget = (val) => {
        const offset = val - TRUE_VAL      // signed offset from true
        const scaled = (offset / 1.2) * TARGET_R * 0.9
        const angle = Math.random() * 2 * Math.PI
        return {
            x: TARGET_CX + scaled * Math.cos(angle),
            y: TARGET_CY + scaled * Math.sin(angle),
        }
    }

    // Stable positions (seeded by index so they don't jump)
    const dotPositions = readings.map((val, i) => {
        const offset = val - TRUE_VAL
        const scaled = (offset / 1.2) * TARGET_R * 0.9
        const angle = ((i * 137.5) % 360) * Math.PI / 180
        return {
            x: TARGET_CX + scaled * Math.cos(angle),
            y: TARGET_CY + scaled * Math.sin(angle),
            val,
        }
    })

    // Accuracy/precision quadrant label
    const quadrant =
        accurate && precise ? 'Accurate AND Precise  ✓✓' :
            accurate && !precise ? 'Accurate, NOT Precise  ✓✗' :
                !accurate && precise ? 'Precise, NOT Accurate  ✗✓' :
                    'Neither Accurate nor Precise  ✗✗'

    return (
        <div>
            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <ChemSlider label="Systematic error (bias)" unit=" mL"
                    value={sysErr} min={-0.5} max={0.5} step={0.01}
                    onChange={setSysErr} color="var(--coral)" precision={2} />
                <ChemSlider label="Random scatter (σ)" unit=" mL"
                    value={randSd} min={0} max={0.5} step={0.01}
                    onChange={setRandSd} color="var(--teal)" precision={2} />
            </div>

            {/* View toggle */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['scatter', 'bulls'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--gold)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === m ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{m === 'scatter' ? 'Scatter Plot' : "Bull's-Eye Target"}</button>
                ))}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={addReading} style={{
                    padding: '7px 18px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(212,160,23,0.12)', color: 'var(--gold)',
                    border: '1px solid rgba(212,160,23,0.3)',
                }}>+ One Reading</button>
                <button onClick={addBatch} style={{
                    padding: '7px 18px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(29,158,117,0.1)', color: 'var(--teal)',
                    border: '1px solid rgba(29,158,117,0.25)',
                }}>+ 5 Readings</button>
                <button onClick={() => setReadings([])} style={{
                    padding: '7px 14px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺ Clear</button>
            </div>

            {/* ── SCATTER PLOT ── */}
            {mode === 'scatter' && (
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 8 }}>
                        SCATTER PLOT — each dot = one measurement
                    </div>
                    <svg viewBox={`0 0 ${PLOT_W} ${PLOT_H}`} width="100%">
                        {/* Axes */}
                        <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                        <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH}
                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />

                        {/* True value line */}
                        <line x1={toX(TRUE_VAL)} y1={PAD.t} x2={toX(TRUE_VAL)} y2={PAD.t + PH}
                            stroke="rgba(29,158,117,0.5)" strokeWidth={1.5} strokeDasharray="5 4" />
                        <text x={toX(TRUE_VAL)} y={PAD.t - 4} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                            true ({TRUE_VAL})
                        </text>

                        {/* Mean line */}
                        {n > 0 && (
                            <>
                                <line x1={toX(mean)} y1={PAD.t} x2={toX(mean)} y2={PAD.t + PH}
                                    stroke="rgba(212,160,23,0.7)" strokeWidth={2} />
                                <text x={toX(mean)} y={PAD.t + PH + 18} textAnchor="middle"
                                    style={{ fontSize: 9, fill: 'rgba(212,160,23,0.8)', fontFamily: 'var(--mono)' }}>
                                    x̄={mean.toFixed(3)}
                                </text>
                            </>
                        )}

                        {/* ±mean error shaded band */}
                        {n > 1 && (
                            <rect x={toX(mean - meanErr)} y={PAD.t}
                                width={Math.max(2, toX(mean + meanErr) - toX(mean - meanErr))}
                                height={PH}
                                fill="rgba(212,160,23,0.07)"
                                stroke="rgba(212,160,23,0.2)" strokeWidth={0.5} />
                        )}

                        {/* X-axis tick labels */}
                        {[-1, -0.5, 0, 0.5, 1].map(off => {
                            const v = TRUE_VAL + off
                            return (
                                <g key={off}>
                                    <line x1={toX(v)} y1={PAD.t + PH} x2={toX(v)} y2={PAD.t + PH + 5}
                                        stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                                    <text x={toX(v)} y={PAD.t + PH + 16} textAnchor="middle"
                                        style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                        {v.toFixed(1)}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Measurement dots */}
                        {readings.map((r, i) => {
                            const col = Math.abs(r - TRUE_VAL) > 0.5 ? '#D85A30' : '#EF9F27'
                            return (
                                <circle key={i}
                                    cx={toX(r)} cy={PAD.t + 10 + (i / (readings.length)) * (PH - 20)}
                                    r={5} fill={col} opacity={0.8} />
                            )
                        })}

                        {/* X label */}
                        <text x={PAD.l + PW} y={PAD.t + PH + 28} textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                            Reading value (mL)
                        </text>
                    </svg>
                </div>
            )}

            {/* ── BULL'S EYE ── */}
            {mode === 'bulls' && (
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, marginBottom: 14 }}>
                    {/* Target */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 8 }}>
                        <svg viewBox="0 0 200 200" width="100%">
                            {/* Concentric rings */}
                            {[TARGET_R, TARGET_R * 0.7, TARGET_R * 0.4, TARGET_R * 0.15].map((r, i) => (
                                <circle key={r} cx={TARGET_CX} cy={TARGET_CY} r={r}
                                    fill="none"
                                    stroke={i === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)'}
                                    strokeWidth={1} />
                            ))}
                            {/* Centre bull */}
                            <circle cx={TARGET_CX} cy={TARGET_CY} r={TARGET_R * 0.08}
                                fill="rgba(29,158,117,0.4)" stroke="var(--teal)" strokeWidth={1} />
                            {/* Crosshairs */}
                            <line x1={TARGET_CX - TARGET_R} y1={TARGET_CY} x2={TARGET_CX + TARGET_R} y2={TARGET_CY}
                                stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                            <line x1={TARGET_CX} y1={TARGET_CY - TARGET_R} x2={TARGET_CX} y2={TARGET_CY + TARGET_R}
                                stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                            {/* Dots */}
                            {dotPositions.map((d, i) => (
                                <circle key={i} cx={d.x} cy={d.y} r={5}
                                    fill="#EF9F27" opacity={0.75}
                                    clipPath="url(#target-clip)" />
                            ))}
                            <defs>
                                <clipPath id="target-clip">
                                    <circle cx={TARGET_CX} cy={TARGET_CY} r={TARGET_R + 4} />
                                </clipPath>
                            </defs>
                            {/* Mean dot */}
                            {n > 0 && (() => {
                                const mDot = dotPositions.reduce((acc, d, i, arr) => ({
                                    x: acc.x + d.x / arr.length,
                                    y: acc.y + d.y / arr.length,
                                }), { x: 0, y: 0 })
                                return <circle cx={mDot.x} cy={mDot.y} r={7}
                                    fill="none" stroke="var(--gold)" strokeWidth={2} />
                            })()}
                        </svg>
                    </div>

                    {/* Key */}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
                        <div style={{
                            padding: '10px 14px', borderRadius: 8,
                            background: accurate ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)',
                            border: `1px solid ${accurate ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                        }}>
                            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>ACCURACY</div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: accurate ? 'var(--teal)' : 'var(--coral)' }}>
                                {accurate ? '✓ Accurate' : '✗ Biased'} — bias = {sysBias > 0 ? '+' : ''}{sysBias.toFixed(3)} mL
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
                                {accurate ? 'Mean close to true value' : 'Systematic error shifting all readings'}
                            </div>
                        </div>

                        <div style={{
                            padding: '10px 14px', borderRadius: 8,
                            background: precise ? 'rgba(29,158,117,0.1)' : 'rgba(239,159,39,0.08)',
                            border: `1px solid ${precise ? 'rgba(29,158,117,0.3)' : 'rgba(239,159,39,0.25)'}`,
                        }}>
                            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>PRECISION</div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: precise ? 'var(--teal)' : 'var(--amber, #EF9F27)' }}>
                                {precise ? '✓ Precise' : '✗ Scattered'} — σ = {sd.toFixed(4)} mL
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>
                                {precise ? 'Readings tightly clustered' : 'High random scatter between readings'}
                            </div>
                        </div>

                        <div style={{
                            padding: '10px 14px', borderRadius: 8,
                            background: 'var(--bg3)', border: '1px solid var(--border)',
                            fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)',
                        }}>
                            {quadrant}
                        </div>
                    </div>
                </div>
            )}

            {/* Error type explanation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ padding: '12px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)', marginBottom: 6 }}>
                        Systematic Error (Bias)
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>
                        Consistent, reproducible offset in one direction. Caused by: faulty calibration, personal error (parallax), impure reagents. Affects <em>accuracy</em>. Can be corrected if identified.
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--coral)', marginTop: 6 }}>
                        Current bias: {sysBias > 0 ? '+' : ''}{sysBias.toFixed(3)} mL
                    </div>
                </div>
                <div style={{ padding: '12px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', marginBottom: 6 }}>
                        Random Error (Scatter)
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.6 }}>
                        Unpredictable fluctuations in both directions. Caused by: reading limitations, vibrations, temperature fluctuations. Affects <em>precision</em>. Reduced by taking more readings.
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)', marginTop: 6 }}>
                        Current σ: ±{sd.toFixed(4)} mL
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="n readings" value={n} color="var(--text2)" />
                <ValueCard label="Mean x̄" value={n ? mean.toFixed(4) : '—'} unit=" mL" color="var(--gold)" highlight />
                <ValueCard label="Mean abs error" value={n > 1 ? `±${meanErr.toFixed(4)}` : '—'} unit=" mL" color="var(--teal)" />
                <ValueCard label="Rel. error" value={n > 1 ? `${relErr.toFixed(3)}%` : '—'} color="var(--coral)" />
            </div>
        </div>
    )
}