import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const CX = W / 2, INTERFACE_Y = H / 2

const MEDIA = {
    'Air': 1.000,
    'Water': 1.333,
    'Glass (crown)': 1.523,
    'Glass (flint)': 1.720,
    'Diamond': 2.417,
}

export default function RefractionSnell() {
    const [theta1, setTheta1] = useState(40)
    const [med1, setMed1] = useState('Air')
    const [med2, setMed2] = useState('Glass (crown)')

    const n1 = MEDIA[med1], n2 = MEDIA[med2]
    const t1r = (theta1 * Math.PI) / 180
    const sinT2 = (n1 / n2) * Math.sin(t1r)
    const tir = sinT2 > 1
    const t2r = tir ? null : Math.asin(sinT2)
    const theta2 = tir ? null : (t2r * 180) / Math.PI

    // Critical angle
    const canTIR = n1 > n2
    const thetaC = canTIR ? (Math.asin(n2 / n1) * 180) / Math.PI : null

    // Ray length
    const L = 120

    // Incident ray
    const incX1 = CX - L * Math.sin(t1r), incY1 = INTERFACE_Y - L * Math.cos(t1r)
    const incX2 = CX, incY2 = INTERFACE_Y

    // Refracted ray
    const refX2 = tir ? null : CX + L * Math.sin(t2r), refY2 = tir ? null : INTERFACE_Y + L * Math.cos(t2r)

    // Reflected ray (TIR)
    const reflX2 = CX + L * Math.sin(t1r), reflY2 = INTERFACE_Y - L * Math.cos(t1r)

    // Normal line
    const normLen = 70

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    const sel = (val, fn, exclude) => (
        <select value={val} onChange={e => fn(e.target.value)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            color: 'var(--text1)', borderRadius: 6, padding: '5px 10px',
            fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer', width: '100%',
        }}>
            {Object.keys(MEDIA).filter(k => k !== exclude).map(k => (
                <option key={k}>{k}</option>
            ))}
        </select>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>Medium 1 (incident)</div>
                    {sel(med1, setMed1, med2)}
                </div>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>Medium 2 (refracted)</div>
                    {sel(med2, setMed2, med1)}
                </div>
            </div>

            <SimSlider label="Incident angle θ₁" unit="°" value={theta1} min={0} max={89} step={1} onChange={setTheta1} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('ri', '#EF9F27')}
                    {arrowDef('rr', '#1D9E75')}
                    {arrowDef('rtir', '#D85A30')}
                </defs>

                {/* Medium fills */}
                <rect x={0} y={0} width={W} height={INTERFACE_Y}
                    fill="rgba(55,138,221,0.05)" />
                <rect x={0} y={INTERFACE_Y} width={W} height={H - INTERFACE_Y}
                    fill={tir ? 'rgba(55,138,221,0.05)' : 'rgba(29,158,117,0.05)'} />

                {/* Interface line */}
                <line x1={0} y1={INTERFACE_Y} x2={W} y2={INTERFACE_Y}
                    stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="6 3" />

                {/* Medium labels */}
                <text x={14} y={24}
                    style={{ fontSize: 10, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>
                    {med1}  n₁={n1.toFixed(3)}
                </text>
                <text x={14} y={INTERFACE_Y + 18}
                    style={{ fontSize: 10, fill: tir ? 'rgba(55,138,221,0.7)' : 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                    {med2}  n₂={n2.toFixed(3)}
                </text>

                {/* Normal */}
                <line x1={CX} y1={INTERFACE_Y - normLen} x2={CX} y2={INTERFACE_Y + normLen}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="4 3" />

                {/* Incident angle arc */}
                <path d={`M ${CX} ${INTERFACE_Y - 36} A 36 36 0 0 0 ${CX - 36 * Math.sin(t1r)} ${INTERFACE_Y - 36 * Math.cos(t1r)}`}
                    fill="none" stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                <text x={CX - 22} y={INTERFACE_Y - 44}
                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>θ₁={theta1}°</text>

                {/* Refraction angle arc */}
                {!tir && t2r !== null && (
                    <>
                        <path d={`M ${CX} ${INTERFACE_Y + 36} A 36 36 0 0 1 ${CX + 36 * Math.sin(t2r)} ${INTERFACE_Y + 36 * Math.cos(t2r)}`}
                            fill="none" stroke="rgba(29,158,117,0.4)" strokeWidth={1} />
                        <text x={CX + 14} y={INTERFACE_Y + 52}
                            style={{ fontSize: 10, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                            θ₂={theta2.toFixed(1)}°
                        </text>
                    </>
                )}

                {/* Incident ray */}
                <line x1={incX1} y1={incY1} x2={incX2} y2={incY2}
                    stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#ri)" />

                {/* Refracted ray */}
                {!tir && refX2 && (
                    <line x1={CX} y1={INTERFACE_Y} x2={refX2} y2={refY2}
                        stroke="#1D9E75" strokeWidth={2.5} markerEnd="url(#rr)" />
                )}

                {/* TIR reflected ray */}
                {tir && (
                    <>
                        <line x1={CX} y1={INTERFACE_Y} x2={reflX2} y2={reflY2}
                            stroke="#D85A30" strokeWidth={2.5} markerEnd="url(#rtir)" />
                        <text x={CX + 30} y={INTERFACE_Y - 60}
                            style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            TIR!
                        </text>
                    </>
                )}

                {/* Critical angle indicator */}
                {canTIR && thetaC && (
                    <text x={W - 12} y={H - 10} textAnchor="end"
                        style={{ fontSize: 10, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                        θc = {thetaC.toFixed(1)}° (TIR if θ₁ &gt; θc)
                    </text>
                )}

                {/* Optical fibre hint */}
                {tir && (
                    <g>
                        {/* Mini fibre cross-section */}
                        {[0, 20, 40, 60, 80].map(x => (
                            <circle key={x} cx={80 + x} cy={H - 30} r={2}
                                fill="#1D9E75" opacity={0.6} />
                        ))}
                        <text x={80} y={H - 14}
                            style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                            TIR → optical fibre principle
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'n₁ sinθ₁', val: `${(n1 * Math.sin(t1r)).toFixed(4)}`, color: 'var(--amber)' },
                    { label: 'n₂ sinθ₂', val: tir ? 'TIR' : `${(n2 * Math.sin(t2r)).toFixed(4)}`, color: 'var(--teal)' },
                    { label: 'θ₂', val: tir ? '—' : `${theta2.toFixed(2)}°`, color: 'var(--teal)' },
                    { label: 'Critical angle', val: canTIR ? `${thetaC.toFixed(1)}°` : 'N/A', color: 'var(--coral)' },
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