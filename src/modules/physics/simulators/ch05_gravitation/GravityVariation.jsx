import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 420, H = 300
const G_SURFACE = 9.8
const R_EARTH = 6.371e6   // m
const CX = W / 2, CY = H / 2
const EARTH_R = 100       // SVG pixels

export default function GravityVariation() {
    const [mode, setMode] = useState('above') // above | below | latitude
    const [value, setValue] = useState(0)
    const [lat, setLat] = useState(0)

    // Compute g
    let g = G_SURFACE
    let markerR = EARTH_R // distance from centre in SVG px

    if (mode === 'above') {
        const h = value * 1000  // km → m
        g = G_SURFACE * Math.pow(R_EARTH / (R_EARTH + h), 2)
        markerR = EARTH_R + (value / 1000) * EARTH_R * 0.8
    } else if (mode === 'below') {
        const d = value * 1000
        g = G_SURFACE * (1 - d / R_EARTH)
        markerR = EARTH_R - (value / 6371) * EARTH_R
    } else {
        const latRad = lat * Math.PI / 180
        g = G_SURFACE - (R_EARTH * 7.27e-5 * 7.27e-5 * Math.cos(latRad) * Math.cos(latRad))
    }

    g = Math.max(0, g)
    const pct = (g / G_SURFACE) * 100

    // Marker angle for latitude mode
    const latAngle = (90 - lat) * Math.PI / 180

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                    { key: 'above', label: 'Above surface' },
                    { key: 'below', label: 'Below surface' },
                    { key: 'latitude', label: 'By latitude' },
                ].map(m => (
                    <button key={m.key} onClick={() => { setMode(m.key); setValue(0) }} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === m.key ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m.label}</button>
                ))}
            </div>

            {mode === 'above' && <SimSlider label="Height h" unit=" km" value={value} min={0} max={1000} step={10} onChange={setValue} />}
            {mode === 'below' && <SimSlider label="Depth d" unit=" km" value={value} min={0} max={6370} step={50} onChange={setValue} />}
            {mode === 'latitude' && <SimSlider label="Latitude" unit="°" value={lat} min={0} max={90} step={1} onChange={setLat} />}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>

                {/* Earth layers */}
                <circle cx={CX} cy={CY} r={EARTH_R}
                    fill="#0B1929" stroke="rgba(55,138,221,0.5)" strokeWidth={1.5} />
                <circle cx={CX} cy={CY} r={EARTH_R * 0.55}
                    fill="none" stroke="rgba(55,138,221,0.15)" strokeWidth={0.5} strokeDasharray="3 3" />
                <circle cx={CX} cy={CY} r={EARTH_R * 0.25}
                    fill="none" stroke="rgba(55,138,221,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />

                {/* Layer labels */}
                <text x={CX + EARTH_R * 0.25 + 4} y={CY - 4}
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>core</text>
                <text x={CX + EARTH_R * 0.55 + 4} y={CY - 4}
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.2)', fontFamily: 'var(--mono)' }}>mantle</text>

                {/* Atmosphere ring */}
                <circle cx={CX} cy={CY} r={EARTH_R + 30}
                    fill="none" stroke="rgba(55,138,221,0.1)" strokeWidth={8} />

                {/* Marker dot */}
                {mode !== 'latitude' ? (
                    <>
                        <line x1={CX} y1={CY} x2={CX} y2={CY - markerR}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                        <circle cx={CX} cy={CY - markerR} r={7}
                            fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                        <text x={CX + 12} y={CY - markerR + 4}
                            style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                            g={g.toFixed(3)}
                        </text>
                    </>
                ) : (
                    <>
                        <line x1={CX} y1={CY}
                            x2={CX + EARTH_R * Math.sin(latAngle)}
                            y2={CY - EARTH_R * Math.cos(latAngle)}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                        <circle
                            cx={CX + EARTH_R * Math.sin(latAngle)}
                            cy={CY - EARTH_R * Math.cos(latAngle)}
                            r={7} fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                        <text x={CX + EARTH_R * Math.sin(latAngle) + 12}
                            y={CY - EARTH_R * Math.cos(latAngle) + 4}
                            style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                            {lat}° → g={g.toFixed(4)}
                        </text>
                    </>
                )}

                {/* g=0 label at centre */}
                <text x={CX} y={CY + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>g=0</text>

                {/* Surface label */}
                <text x={CX + EARTH_R + 5} y={CY + 4}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>surface</text>
                <text x={CX + EARTH_R + 5} y={CY + 15}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    g={G_SURFACE}
                </text>

                {/* g bar on right */}
                {(() => {
                    const barH = 160, barX = W - 28, barY = (H - barH) / 2
                    const fillH = (pct / 100) * barH
                    return (
                        <g>
                            <rect x={barX} y={barY} width={14} height={barH} rx={4}
                                fill="var(--bg3)" stroke="var(--border)" strokeWidth={0.5} />
                            <rect x={barX} y={barY + barH - fillH} width={14} height={fillH} rx={4}
                                fill={pct > 80 ? '#1D9E75' : pct > 40 ? '#EF9F27' : '#D85A30'} />
                            <text x={barX + 7} y={barY - 6} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>g%</text>
                            <text x={barX + 7} y={barY + barH + 14} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                {pct.toFixed(1)}%
                            </text>
                        </g>
                    )
                })()}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'g at location', val: `${g.toFixed(4)} m/s²`, color: 'var(--amber)' },
                    { label: 'g at surface', val: '9.8000 m/s²', color: 'var(--text3)' },
                    { label: 'Reduction', val: `${(G_SURFACE - g).toFixed(4)} m/s²`, color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
