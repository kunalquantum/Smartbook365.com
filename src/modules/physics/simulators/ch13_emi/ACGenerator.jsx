import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const COIL_CX = 130, COIL_CY = H / 2
const GRAPH_X = 230, GRAPH_Y = 30
const GRAPH_W = W - GRAPH_X - 20
const GRAPH_H = H - 60

export default function ACGenerator() {
    const [V0, setV0] = useState(220)   // peak voltage
    const [freq, setFreq] = useState(50)    // Hz
    const [N, setN] = useState(100)   // turns
    const [B, setB] = useState(0.5)   // Tesla
    const [A, setA] = useState(0.05)  // m²
    const [running, setRunning] = useState(true)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    const t = tRef.current
    const omega = 2 * Math.PI * freq
    const theta = omega * t   // coil angle

    // EMF
    const emf0 = N * B * A * omega   // peak EMF from physics
    const emf_t = V0 * Math.sin(omega * t)
    const V_rms = V0 / Math.sqrt(2)
    const I_rms = V_rms / 100   // assume R=100Ω load
    const P_avg = V_rms * I_rms
    const period = 1 / freq

    // Coil rotation visual
    const coilAngle = theta % (2 * Math.PI)
    const coilWidth = 50 * Math.abs(Math.cos(coilAngle))  // foreshortening
    const coilHeight = 60

    // History for graph
    const histRef = useRef(Array(200).fill(0))
    histRef.current = [...histRef.current.slice(1), emf_t]

    // Graph path
    const graphPath = histRef.current.map((v, i) => {
        const x = GRAPH_X + (i / 200) * GRAPH_W
        const y = GRAPH_Y + GRAPH_H / 2 - (v / (V0 + 1)) * GRAPH_H * 0.45
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    // RMS line
    const rmsY_pos = GRAPH_Y + GRAPH_H / 2 - (V_rms / (V0 + 1)) * GRAPH_H * 0.45
    const rmsY_neg = GRAPH_Y + GRAPH_H / 2 + (V_rms / (V0 + 1)) * GRAPH_H * 0.45

    // B field dots (into page, left) and crosses (out of page, right)
    const fieldRows = 4, fieldCols = 3
    const fieldX1 = COIL_CX - 70, fieldX2 = COIL_CX + 70
    const fieldYs = Array.from({ length: fieldRows }, (_, i) => COIL_CY - 50 + i * 34)

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Peak voltage V₀" unit=" V" value={V0} min={10} max={400} step={5} onChange={setV0} />
                <SimSlider label="Frequency f" unit=" Hz" value={freq} min={1} max={100} step={1} onChange={setFreq} />
                <SimSlider label="Turns N" unit="" value={N} min={10} max={500} step={10} onChange={setN} />
                <SimSlider label="B field" unit=" T" value={B} min={0.1} max={2} step={0.05} onChange={setB} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* === B field === */}
                {/* Left side: × (into page) */}
                {fieldYs.map((fy, i) =>
                    Array.from({ length: 3 }, (_, j) => {
                        const fx = fieldX1 - 50 + j * 24
                        return (
                            <g key={`x${i}_${j}`} opacity={0.3}>
                                <line x1={fx - 5} y1={fy - 5} x2={fx + 5} y2={fy + 5} stroke="#7F77DD" strokeWidth={1.2} />
                                <line x1={fx + 5} y1={fy - 5} x2={fx - 5} y2={fy + 5} stroke="#7F77DD" strokeWidth={1.2} />
                            </g>
                        )
                    })
                )}
                {/* Right side: • (out of page) */}
                {fieldYs.map((fy, i) =>
                    Array.from({ length: 3 }, (_, j) => {
                        const fx = fieldX2 + 10 + j * 24
                        return (
                            <circle key={`d${i}_${j}`} cx={fx} cy={fy} r={3}
                                fill="#7F77DD" opacity={0.3} />
                        )
                    })
                )}

                {/* B field labels */}
                <text x={fieldX1 - 32} y={COIL_CY + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(127,119,221,0.5)', fontFamily: 'var(--mono)' }}>B⊗</text>
                <text x={fieldX2 + 42} y={COIL_CY + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(127,119,221,0.5)', fontFamily: 'var(--mono)' }}>B⊙</text>

                {/* Coil frame */}
                {/* Horizontal axis */}
                <line x1={COIL_CX - 70} y1={COIL_CY}
                    x2={COIL_CX + 70} y2={COIL_CY}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />

                {/* Rotating coil */}
                <ellipse cx={COIL_CX} cy={COIL_CY}
                    rx={coilWidth} ry={coilHeight}
                    fill={`rgba(239,159,39,0.1)`}
                    stroke="#EF9F27" strokeWidth={2.5} />

                {/* Coil sides (conductors moving through B) */}
                {[-1, 1].map(side => {
                    const sx = COIL_CX + side * coilWidth
                    return (
                        <line key={side}
                            x1={sx} y1={COIL_CY - coilHeight}
                            x2={sx} y2={COIL_CY + coilHeight}
                            stroke={side > 0 ? '#D85A30' : '#378ADD'}
                            strokeWidth={3} strokeLinecap="round" />
                    )
                })}

                {/* Rotation arrow */}
                <path d={`M ${COIL_CX + 35} ${COIL_CY - 20} A 35 35 0 0 1 ${COIL_CX + 20} ${COIL_CY - 35}`}
                    fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

                {/* Slip rings */}
                {[-1, 1].map(side => (
                    <g key={side}>
                        <circle cx={COIL_CX + side * 72} cy={COIL_CY} r={5}
                            fill="var(--bg3)"
                            stroke={side > 0 ? '#D85A30' : '#378ADD'} strokeWidth={1.5} />
                        <line x1={COIL_CX + side * 77} y1={COIL_CY}
                            x2={COIL_CX + side * 100} y2={COIL_CY}
                            stroke={side > 0 ? '#D85A30' : '#378ADD'} strokeWidth={1.5} />
                    </g>
                ))}

                {/* Angle & flux labels */}
                <text x={COIL_CX} y={COIL_CY + coilHeight + 20} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    θ = {((theta % (2 * Math.PI)) * 180 / Math.PI).toFixed(0)}°
                </text>
                <text x={COIL_CX} y={COIL_CY - coilHeight - 14} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    ε = {emf_t.toFixed(1)} V
                </text>

                {/* === EMF Graph === */}
                <rect x={GRAPH_X} y={GRAPH_Y} width={GRAPH_W} height={GRAPH_H}
                    rx={4} fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />

                {/* Centre line */}
                <line x1={GRAPH_X} y1={GRAPH_Y + GRAPH_H / 2}
                    x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + GRAPH_H / 2}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />

                {/* RMS lines */}
                <line x1={GRAPH_X} y1={rmsY_pos} x2={GRAPH_X + GRAPH_W} y2={rmsY_pos}
                    stroke="rgba(29,158,117,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                <line x1={GRAPH_X} y1={rmsY_neg} x2={GRAPH_X + GRAPH_W} y2={rmsY_neg}
                    stroke="rgba(29,158,117,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                <text x={GRAPH_X + GRAPH_W - 4} y={rmsY_pos - 4} textAnchor="end"
                    style={{ fontSize: 8, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>V_rms</text>

                {/* Peak lines */}
                <line x1={GRAPH_X} y1={GRAPH_Y + 10} x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + 10}
                    stroke="rgba(239,159,39,0.15)" strokeWidth={0.5} strokeDasharray="2 2" />

                {/* Waveform */}
                <path d={graphPath} fill="none" stroke="#EF9F27" strokeWidth={2} />

                {/* Current point */}
                {(() => {
                    const cx = GRAPH_X + GRAPH_W - 2
                    const cy = GRAPH_Y + GRAPH_H / 2 - (emf_t / (V0 + 1)) * GRAPH_H * 0.45
                    return <circle cx={cx} cy={cy} r={4} fill="#EF9F27" />
                })()}

                {/* Labels */}
                <text x={GRAPH_X + 6} y={GRAPH_Y + 14}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    V₀={V0}V
                </text>
                <text x={GRAPH_X + 6} y={GRAPH_Y + 26}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                    V_rms={V_rms.toFixed(1)}V
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
                    { label: 'Peak EMF ε₀=NBAω', val: `${emf0.toFixed(2)} V`, color: 'var(--amber)' },
                    { label: 'V_rms = V₀/√2', val: `${V_rms.toFixed(2)} V`, color: 'var(--teal)' },
                    { label: 'Period T = 1/f', val: `${period.toFixed(4)} s`, color: 'var(--text2)' },
                    { label: 'Avg power P_avg', val: `${P_avg.toFixed(3)} W`, color: 'var(--coral)' },
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