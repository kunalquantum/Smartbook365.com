import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 340, H = 300
const THERM_X = 60, THERM_W = 36
const BULB_CY = 258, BULB_R = 22
const TUBE_TOP = 40, TUBE_BOT = BULB_CY - BULB_R
const TUBE_H = TUBE_BOT - TUBE_TOP
const TUBE_MX = THERM_X + THERM_W / 2

const LANDMARKS = [
    { C: -273.15, label: 'Absolute zero' },
    { C: -40, label: '-40 (C=F)' },
    { C: 0, label: 'Water freezes' },
    { C: 20, label: 'Room temp' },
    { C: 37, label: 'Body temp' },
    { C: 100, label: 'Water boils' },
]

export default function TemperatureScales() {
    const [celsius, setCelsius] = useState(20)

    const fahrenheit = celsius * 9 / 5 + 32
    const kelvin = celsius + 273.15

    // Mercury fill: map -40..120 → 0..1
    const fillFrac = Math.max(0, Math.min(1, (celsius - (-40)) / 160))
    const mercuryTop = TUBE_BOT - fillFrac * TUBE_H
    const mercuryColor = celsius < 0 ? '#378ADD'
        : celsius < 37 ? `rgb(${Math.round(29 + (celsius / 100) * 200)},${Math.round(158 - celsius)},${Math.round(117 - celsius)})`
            : '#D85A30'

    return (
        <div>
            <SimSlider label="Temperature" unit=" °C" value={celsius} min={-40} max={150} step={0.5} onChange={setCelsius} />

            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                {/* Thermometer */}
                <svg viewBox={`0 0 ${W * 0.45} ${H}`} width={W * 0.45} style={{ flexShrink: 0 }}>
                    {/* Scale ticks on right */}
                    {[-40, -20, 0, 20, 40, 60, 80, 100, 120].map(c => {
                        const f = (c - (-40)) / 160
                        const y = TUBE_BOT - f * TUBE_H
                        const isMajor = c % 40 === 0
                        return (
                            <g key={c}>
                                <line x1={TUBE_MX + THERM_W / 2} y1={y}
                                    x2={TUBE_MX + THERM_W / 2 + (isMajor ? 12 : 6)} y2={y}
                                    stroke="rgba(160,176,200,0.4)" strokeWidth={isMajor ? 1 : 0.5} />
                                {isMajor && (
                                    <text x={TUBE_MX + THERM_W / 2 + 16} y={y + 4}
                                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                        {c}°
                                    </text>
                                )}
                            </g>
                        )
                    })}

                    {/* Tube background */}
                    <rect x={TUBE_MX - 6} y={TUBE_TOP} width={12} height={TUBE_H}
                        rx={6} fill="#0B1929" stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

                    {/* Mercury fill */}
                    <rect x={TUBE_MX - 5} y={mercuryTop} width={10}
                        height={TUBE_BOT - mercuryTop}
                        rx={4} fill={mercuryColor} />

                    {/* Bulb */}
                    <circle cx={TUBE_MX} cy={BULB_CY} r={BULB_R}
                        fill={mercuryColor} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                    <circle cx={TUBE_MX} cy={BULB_CY} r={BULB_R - 4}
                        fill={mercuryColor} opacity={0.6} />

                    {/* Glass tube outline */}
                    <rect x={TUBE_MX - 7} y={TUBE_TOP} width={14} height={TUBE_H}
                        rx={7} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />

                    {/* Current marker line */}
                    <line x1={TUBE_MX - 9} y1={mercuryTop}
                        x2={TUBE_MX - 20} y2={mercuryTop}
                        stroke={mercuryColor} strokeWidth={1.5} />
                    <text x={TUBE_MX - 22} y={mercuryTop + 4} textAnchor="end"
                        style={{ fontSize: 10, fill: mercuryColor, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                        {celsius.toFixed(1)}°C
                    </text>

                    {/* Landmark labels */}
                    {LANDMARKS.filter(l => l.C >= -40 && l.C <= 120).map(l => {
                        const f = (l.C - (-40)) / 160
                        const ly = TUBE_BOT - f * TUBE_H
                        return (
                            <g key={l.C}>
                                <line x1={TUBE_MX - 6} y1={ly} x2={TUBE_MX - 14} y2={ly}
                                    stroke="rgba(160,176,200,0.2)" strokeWidth={0.5} />
                                <text x={TUBE_MX - 16} y={ly + 3} textAnchor="end"
                                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                    {l.label}
                                </text>
                            </g>
                        )
                    })}
                </svg>

                {/* Scale readouts */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 20 }}>
                    {[
                        { label: 'Celsius', val: `${celsius.toFixed(2)}`, unit: '°C', color: '#EF9F27', desc: 'Water freezes at 0, boils at 100' },
                        { label: 'Fahrenheit', val: `${fahrenheit.toFixed(2)}`, unit: '°F', color: '#D85A30', desc: 'Body temp ≈ 98.6°F' },
                        { label: 'Kelvin', val: `${kelvin.toFixed(2)}`, unit: 'K', color: '#1D9E75', desc: '0K = absolute zero' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'var(--bg3)', borderRadius: 10,
                            padding: '12px 16px', border: `1px solid ${s.color}22`,
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{s.label}</span>
                                <span style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--mono)', color: s.color }}>
                                    {s.val}<span style={{ fontSize: 14, marginLeft: 4 }}>{s.unit}</span>
                                </span>
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 4 }}>{s.desc}</div>
                        </div>
                    ))}

                    {/* Special temperature note */}
                    {Math.abs(celsius - 0) < 1 && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(55,138,221,0.1)', border: '1px solid rgba(55,138,221,0.25)', fontSize: 11, color: '#378ADD', fontFamily: 'var(--mono)' }}>
                            ❄ Water freezes / ice melts
                        </div>
                    )}
                    {Math.abs(celsius - 100) < 1 && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.25)', fontSize: 11, color: '#D85A30', fontFamily: 'var(--mono)' }}>
                            ♨ Water boils at 1 atm
                        </div>
                    )}
                    {Math.abs(celsius - 37) < 0.6 && (
                        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.25)', fontSize: 11, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            ♥ Human body temperature
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}