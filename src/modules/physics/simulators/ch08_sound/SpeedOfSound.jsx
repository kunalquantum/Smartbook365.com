import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const MEDIA = {
    'Air (0°C)': { v: 331, rho: 1.29, B: 1.42e5, type: 'gas', color: '#378ADD' },
    'Air (25°C)': { v: 346, rho: 1.18, B: 1.42e5, type: 'gas', color: '#378ADD' },
    'Hydrogen': { v: 1270, rho: 0.089, B: 1.01e5, type: 'gas', color: '#7F77DD' },
    'Water (25°C)': { v: 1497, rho: 997, B: 2.2e9, type: 'liquid', color: '#1D9E75' },
    'Sea water': { v: 1530, rho: 1025, B: 2.34e9, type: 'liquid', color: '#1D9E75' },
    'Steel': { v: 5100, rho: 7800, B: 2.0e11, type: 'solid', color: '#EF9F27' },
    'Aluminum': { v: 6420, rho: 2700, B: 7.0e10, type: 'solid', color: '#EF9F27' },
    'Glass': { v: 5640, rho: 2500, B: 7.3e10, type: 'solid', color: '#D85A30' },
}

const W = 440, H = 240

export default function SpeedOfSound() {
    const [selected, setSelected] = useState('Air (25°C)')
    const [tempC, setTempC] = useState(25)

    const med = MEDIA[selected]
    const isAir = selected.includes('Air')
    const vFinal = isAir ? 331 + 0.6 * tempC : med.v
    const maxV = 6420

    return (
        <div>
            {/* Medium selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MEDIA).map(m => (
                    <button key={m} onClick={() => setSelected(m)} style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: selected === m ? MEDIA[m].color : 'var(--bg3)',
                        color: selected === m ? '#000' : 'var(--text2)',
                        border: `1px solid ${selected === m ? MEDIA[m].color : 'var(--border)'}`,
                    }}>{m}</button>
                ))}
            </div>

            {isAir && (
                <SimSlider label="Temperature" unit=" °C" value={tempC} min={-30} max={100} step={1} onChange={setTempC} />
            )}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>

                {/* All media bars */}
                {Object.entries(MEDIA).map(([name, props], i) => {
                    const barW = Math.max(4, (props.v / maxV) * (W - 140))
                    const y = 12 + i * 28
                    const isActive = name === selected
                    return (
                        <g key={name} style={{ cursor: 'pointer' }} onClick={() => setSelected(name)}>
                            {/* Bar */}
                            <rect x={100} y={y} width={barW} height={18} rx={3}
                                fill={props.color}
                                opacity={isActive ? 0.85 : 0.18} />
                            {/* Active border */}
                            {isActive && (
                                <rect x={100} y={y} width={barW} height={18} rx={3}
                                    fill="none" stroke={props.color} strokeWidth={1} />
                            )}
                            {/* Name label */}
                            <text x={96} y={y + 12} textAnchor="end"
                                style={{
                                    fontSize: 10, fontFamily: 'var(--mono)',
                                    fill: isActive ? props.color : 'rgba(160,176,200,0.4)',
                                    fontWeight: isActive ? 600 : 400,
                                }}>
                                {name}
                            </text>
                            {/* Speed label */}
                            <text x={100 + barW + 6} y={y + 12}
                                style={{
                                    fontSize: 10, fontFamily: 'var(--mono)',
                                    fill: isActive ? props.color : 'rgba(160,176,200,0.3)',
                                }}>
                                {isActive && isAir ? vFinal.toFixed(0) : props.v} m/s
                            </text>
                        </g>
                    )
                })}

                {/* Type legend */}
                {[
                    { col: '#378ADD', label: 'Gas' },
                    { col: '#1D9E75', label: 'Liquid' },
                    { col: '#EF9F27', label: 'Solid' },
                ].map((l, i) => (
                    <g key={l.label}>
                        <rect x={W - 80} y={12 + i * 18} width={10} height={10} rx={2} fill={l.col} opacity={0.7} />
                        <text x={W - 66} y={12 + i * 18 + 9}
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                            {l.label}
                        </text>
                    </g>
                ))}
            </svg>

            {/* Formula display */}
            <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border2)',
                borderRadius: 8, padding: '12px 16px', marginBottom: 14,
                fontFamily: 'var(--mono)', fontSize: 12,
            }}>
                <div style={{ color: 'var(--text3)', marginBottom: 6 }}>
                    {med.type === 'gas'
                        ? `v = √(γP/ρ) = √(B/ρ)  [Laplace adiabatic correction]`
                        : `v = √(E/ρ)  where E = elastic modulus, ρ = density`}
                </div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--teal)' }}>ρ = {med.rho} kg/m³</span>
                    <span style={{ color: 'var(--amber)' }}>B = {med.B.toExponential(2)} Pa</span>
                    <span style={{ color: med.color, fontWeight: 700 }}>
                        v = {isAir ? `${331} + 0.6×${tempC} = ${vFinal.toFixed(0)}` : med.v} m/s
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Speed in medium', val: `${vFinal.toFixed(0)} m/s`, color: med.color },
                    { label: 'vs Air (25°C)', val: `${(vFinal / 346).toFixed(1)}×`, color: 'var(--text2)' },
                    { label: 'Type', val: med.type, color: 'var(--text3)' },
                    { label: '0.6T rule (air)', val: isAir ? `+${(0.6 * tempC).toFixed(0)} m/s` : 'N/A', color: 'var(--amber)' },
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
        </div>
    )
}