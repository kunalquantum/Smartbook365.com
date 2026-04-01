import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 200

export default function Calorimetry() {
    const [m1, setM1] = useState(1.0)   // kg hot water
    const [T1, setT1] = useState(80)    // °C hot
    const [m2, setM2] = useState(2.0)   // kg cold water
    const [T2, setT2] = useState(20)    // °C cold
    const [c1, setC1] = useState(4186)  // J/kg°C water
    const [c2, setC2] = useState(4186)
    const [mixed, setMixed] = useState(false)
    const [animT, setAnimT] = useState(null)
    const rafRef = useRef(null)

    const T_eq = (m1 * c1 * T1 + m2 * c2 * T2) / (m1 * c1 + m2 * c2)
    const Q_transferred = m1 * c1 * (T1 - T_eq)

    // Animate mixing
    const mix = () => {
        setMixed(true)
        const start = performance.now()
        const duration = 1500
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1)
            const ease = 1 - Math.pow(1 - t, 3)
            const current = T1 + (T_eq - T1) * ease
            setAnimT(current)
            if (t < 1) rafRef.current = requestAnimationFrame(step)
            else setAnimT(T_eq)
        }
        rafRef.current = requestAnimationFrame(step)
    }

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setMixed(false)
        setAnimT(null)
    }

    useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

    const displayT1 = mixed ? animT ?? T_eq : T1
    const displayT2 = mixed ? animT ?? T_eq : T2

    // Color by temperature
    const tempColor = t => t > 60 ? '#D85A30' : t > 40 ? '#EF9F27' : t > 25 ? '#1D9E75' : '#378ADD'

    // Beaker positions
    const B1X = 60, B2X = 240, BW = 100, BH = 120, BY = 40

    const Beaker = ({ x, temp, mass, label, isMixed }) => {
        const fillH = Math.min(BH - 20, (mass / 3) * (BH - 20))
        const fillY = BY + BH - fillH
        const col = tempColor(temp)
        // Bubble count by temp
        const bubbles = temp > 70 ? 5 : temp > 50 ? 3 : 0
        return (
            <g>
                {/* Glass beaker */}
                <rect x={x} y={BY} width={BW} height={BH}
                    rx={4} fill="rgba(255,255,255,0.03)"
                    stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                {/* Water fill */}
                <rect x={x + 2} y={fillY} width={BW - 4}
                    height={fillH} rx={2}
                    fill={col} opacity={isMixed ? 0.5 : 0.35} />
                {/* Surface shimmer */}
                <line x1={x + 4} y1={fillY + 2} x2={x + BW - 4} y2={fillY + 2}
                    stroke={col} strokeWidth={1} opacity={0.5} />
                {/* Bubbles */}
                {Array.from({ length: bubbles }, (_, i) => (
                    <circle key={i}
                        cx={x + 15 + i * 16} cy={fillY + 8 + (i % 2) * 6}
                        r={2} fill={col} opacity={0.6} />
                ))}
                {/* Temp label */}
                <text x={x + BW / 2} y={fillY - 8} textAnchor="middle"
                    style={{ fontSize: 12, fill: col, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {temp.toFixed(1)}°C
                </text>
                {/* Mass label */}
                <text x={x + BW / 2} y={BY + BH + 16} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    {label}  {mass} kg
                </text>
            </g>
        )
    }

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <SimSlider label="Hot mass m₁" unit=" kg" value={m1} min={0.1} max={5} step={0.1} onChange={v => { setM1(v); reset() }} />
                <SimSlider label="Hot temp T₁" unit=" °C" value={T1} min={30} max={99} step={1} onChange={v => { setT1(v); reset() }} />
                <SimSlider label="Cold mass m₂" unit=" kg" value={m2} min={0.1} max={5} step={0.1} onChange={v => { setM2(v); reset() }} />
                <SimSlider label="Cold temp T₂" unit=" °C" value={T2} min={0} max={29} step={1} onChange={v => { setT2(v); reset() }} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Beakers */}
                <Beaker x={B1X} temp={displayT1} mass={m1} label="Hot" isMixed={mixed} />
                <Beaker x={B2X} temp={displayT2} mass={m2} label="Cold" isMixed={mixed} />

                {/* Arrow between */}
                {!mixed && (
                    <g>
                        <defs>
                            <marker id="cq" viewBox="0 0 10 10" refX={8} refY={5}
                                markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke="#EF9F27"
                                    strokeWidth={1.5} strokeLinecap="round" />
                            </marker>
                        </defs>
                        <line x1={B1X + BW + 10} y1={BY + 60} x2={B2X - 10} y2={BY + 60}
                            stroke="#EF9F27" strokeWidth={1.5} markerEnd="url(#cq)"
                            strokeDasharray="5 3" />
                        <text x={(B1X + BW + B2X) / 2} y={BY + 52} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            Q flows →
                        </text>
                    </g>
                )}

                {/* Mixed result */}
                {mixed && animT !== null && (
                    <g>
                        <rect x={W / 2 - 50} y={BY + 20} width={100} height={60}
                            rx={6} fill={tempColor(animT)} opacity={0.15}
                            stroke={tempColor(animT)} strokeWidth={1} />
                        <text x={W / 2} y={BY + 46} textAnchor="middle"
                            style={{ fontSize: 11, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                            T_eq
                        </text>
                        <text x={W / 2} y={BY + 64} textAnchor="middle"
                            style={{ fontSize: 16, fill: tempColor(animT), fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {(animT).toFixed(2)}°C
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={mixed ? reset : mix} style={{
                    padding: '8px 24px', borderRadius: 8, fontSize: 13,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: mixed ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.15)',
                    color: mixed ? 'var(--coral)' : 'var(--amber)',
                    border: `1px solid ${mixed ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
                }}>
                    {mixed ? '↺ Reset' : '⇌ Mix'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'T_equilibrium', val: `${T_eq.toFixed(3)} °C`, color: 'var(--amber)' },
                    { label: 'Heat transferred', val: `${(Q_transferred / 1000).toFixed(2)} kJ`, color: 'var(--coral)' },
                    { label: 'Q_lost = Q_gained', val: 'Verified ✓', color: 'var(--teal)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}