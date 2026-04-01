import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 400, H = 260
const RIVER_TOP = 50, RIVER_BOT = 210
const RH = RIVER_BOT - RIVER_TOP   // river height in SVG = width of river
const BANK_L = 60, BANK_R = 340

export default function RelativeVelocity() {
    const [vBoat, setVBoat] = useState(5)   // boat speed relative to water (across)
    const [vRiver, setVRiver] = useState(3)   // river current speed (along)
    const [width, setWidth] = useState(100) // river width in metres

    // Resultant velocity
    const vActual = Math.sqrt(vBoat * vBoat + vRiver * vRiver)
    const drift = (vRiver / vBoat) * width
    const timeCross = width / vBoat
    const angleDeg = (Math.atan2(vRiver, vBoat) * 180 / Math.PI).toFixed(1)

    // To go straight: aim upstream at angle α
    const canStraight = vBoat > vRiver
    const alphaRad = canStraight ? Math.asin(vRiver / vBoat) : null
    const alphaDeg = canStraight ? (alphaRad * 180 / Math.PI).toFixed(1) : '—'
    const vStraight = canStraight ? Math.sqrt(vBoat * vBoat - vRiver * vRiver).toFixed(2) : '—'

    // SVG coords
    const startX = BANK_L + 20
    const startY = RIVER_BOT - 10
    const scale = (BANK_R - BANK_L) / Math.max(width, 1) * 0.7

    // Actual path endpoint
    const endX = startX + drift * scale
    const endY = RIVER_TOP + 10

    // Straight path endpoint (directly across)
    const straightX = startX
    const straightY = RIVER_TOP + 10

    const Arrow = ({ x1, y1, x2, y2, color, id, label, dashed }) => (
        <g>
            <defs>
                <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </marker>
            </defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth={2} markerEnd={`url(#${id})`}
                strokeDasharray={dashed ? '5 4' : undefined} />
            {label && (
                <text x={(x1 + x2) / 2 + 6} y={(y1 + y2) / 2 - 6}
                    style={{ fontSize: 10, fill: color, fontFamily: 'var(--mono)' }}>{label}</text>
            )}
        </g>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Boat speed" unit=" m/s" value={vBoat} min={1} max={12} step={0.5} onChange={setVBoat} />
                <SimSlider label="River speed" unit=" m/s" value={vRiver} min={0} max={10} step={0.5} onChange={setVRiver} />
                <SimSlider label="River width" unit=" m" value={width} min={20} max={200} step={10} onChange={setWidth} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* River banks */}
                <rect x={0} y={RIVER_TOP} width={W} height={RH}
                    fill="rgba(55,138,221,0.08)" stroke="none" />
                <line x1={0} y1={RIVER_TOP} x2={W} y2={RIVER_TOP}
                    stroke="rgba(55,138,221,0.4)" strokeWidth={1.5} />
                <line x1={0} y1={RIVER_BOT} x2={W} y2={RIVER_BOT}
                    stroke="rgba(55,138,221,0.4)" strokeWidth={1.5} />

                {/* Bank labels */}
                <text x={12} y={RIVER_TOP - 8}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>Bank A</text>
                <text x={12} y={RIVER_BOT + 16}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>Bank B</text>

                {/* River current arrows */}
                {[0.25, 0.5, 0.75].map(f => {
                    const y = RIVER_TOP + f * RH
                    const len = Math.min(vRiver * 8, 50)
                    return (
                        <g key={f}>
                            <defs>
                                <marker id={`rc${f}`} viewBox="0 0 10 10" refX={8} refY={5}
                                    markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                                    <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(55,138,221,0.4)"
                                        strokeWidth={1.5} strokeLinecap="round" />
                                </marker>
                            </defs>
                            <line x1={100} y1={y} x2={100 + len} y2={y}
                                stroke="rgba(55,138,221,0.3)" strokeWidth={1}
                                markerEnd={`url(#rc${f})`} />
                        </g>
                    )
                })}

                {/* Width marker */}
                <line x1={startX - 18} y1={RIVER_TOP} x2={startX - 18} y2={RIVER_BOT}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} strokeDasharray="3 3" />
                <text x={startX - 28} y={(RIVER_TOP + RIVER_BOT) / 2 + 4}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}
                    transform={`rotate(-90,${startX - 28},${(RIVER_TOP + RIVER_BOT) / 2 + 4})`}>
                    {width}m
                </text>

                {/* Straight path (aimed upstream) */}
                {canStraight && (
                    <Arrow x1={startX} y1={startY}
                        x2={straightX} y2={straightY}
                        color="rgba(29,158,117,0.4)" id="str" dashed />
                )}

                {/* Actual path */}
                <Arrow x1={startX} y1={startY} x2={endX} y2={endY}
                    color="#EF9F27" id="act" label={`${vActual.toFixed(1)}m/s`} />

                {/* Drift arrow */}
                {drift > 2 && (
                    <>
                        <Arrow x1={straightX} y1={RIVER_TOP + 10}
                            x2={endX} y2={RIVER_TOP + 10}
                            color="rgba(216,90,48,0.7)" id="drift" />
                        <text x={(straightX + endX) / 2} y={RIVER_TOP - 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            drift={drift.toFixed(1)}m
                        </text>
                    </>
                )}

                {/* Boat icon */}
                <circle cx={startX} cy={startY} r={7}
                    fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* Legend */}
                <text x={W - 12} y={RIVER_TOP - 8} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.8)', fontFamily: 'var(--mono)' }}>
                    — actual path
                </text>
                {canStraight && (
                    <text x={W - 12} y={RIVER_TOP + 4} textAnchor="end"
                        style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                        ╌ straight path
                    </text>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Actual speed', val: `${vActual.toFixed(2)} m/s`, color: 'var(--amber)' },
                    { label: 'Drift', val: `${drift.toFixed(1)} m`, color: 'var(--coral)' },
                    { label: 'Time to cross', val: `${timeCross.toFixed(1)} s`, color: 'var(--text2)' },
                    { label: 'Aim angle α', val: canStraight ? `${alphaDeg}°` : 'impossible', color: canStraight ? 'var(--teal)' : 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 90,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>

            {!canStraight && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.25)',
                    fontSize: 12, color: 'var(--coral)', fontFamily: 'var(--mono)',
                }}>
                    ✗ Boat speed ({vBoat} m/s) &lt; River speed ({vRiver} m/s) — cannot go straight across
                </div>
            )}
            {canStraight && (
                <div style={{
                    marginTop: 12, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)',
                }}>
                    Aim {alphaDeg}° upstream → effective crossing speed = {vStraight} m/s → zero drift
                </div>
            )}
        </div>
    )
}