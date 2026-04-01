import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const CX = W / 2, CY = H / 2
const MIRROR_H = 140

export default function ReflectionMirror() {
    const [u, setU] = useState(-30)  // object distance (negative = real)
    const [f, setF] = useState(-15)  // focal length (neg = concave)
    const [type, setType] = useState('concave')

    const fVal = type === 'concave' ? -Math.abs(f) : Math.abs(f)
    const uVal = -Math.abs(u)  // always negative (real object)
    const R = 2 * fVal

    // Mirror formula: 1/v = 1/f - 1/u
    const vVal = 1 / (1 / fVal - 1 / uVal)
    const m = -vVal / uVal
    const isReal = vVal < 0
    const isVirtual = vVal > 0
    const imageType = isReal ? 'Real, Inverted' : 'Virtual, Erect'

    // Scale: 1m → 5px
    const S = 4
    const POLE = CX   // mirror pole at centre

    // SVG positions (mirror on right, object on left)
    // Object x (in front of mirror = left side)
    const objX = POLE + uVal * S     // uVal is negative so objX < POLE
    const objH = 50
    const imgH = Math.abs(m) * objH
    const imgX = POLE + vVal * S

    // Principal axis
    // Focal point & centre
    const fX = POLE + fVal * S
    const cX = POLE + R * S

    // Mirror arc (concave curves left, convex curves right)
    const mirrorBulge = type === 'concave' ? -18 : 18
    const mirrorPath = `M ${POLE} ${CY - MIRROR_H / 2} Q ${POLE + mirrorBulge} ${CY} ${POLE} ${CY + MIRROR_H / 2}`

    // Ray 1: parallel → reflects through F (concave) or appears from F (convex)
    // Ray 2: through F → reflects parallel
    // Ray 3: through C → reflects back through C

    const rays = []

    // Ray 1: from object tip, parallel to axis → reflects
    const r1_startX = objX, r1_startY = CY - objH
    // hits mirror at same height
    const r1_mirX = POLE, r1_mirY = CY - objH
    // After reflection: concave → through F; convex → diverges as if from F
    const r1_slope = type === 'concave'
        ? (CY - r1_mirY) / (fX - r1_mirX)
        : (r1_mirY - CY) / (r1_mirX - fX)
    const r1_endX = type === 'concave' ? fX - 20 : fX + 60
    const r1_endY = type === 'concave'
        ? r1_mirY + r1_slope * (r1_endX - r1_mirX)
        : r1_mirY - r1_slope * 60

    // Ray 2: from object tip through F, reflects parallel
    const r2_startX = objX, r2_startY = CY - objH
    const r2_slope = (CY - r2_startY) / (fX - r2_startX)
    const r2_mirY = r2_startY + r2_slope * (POLE - r2_startX)
    const r2_endX = POLE - 80, r2_endY = r2_mirY   // parallel after

    rays.push(
        { x1: r1_startX, y1: r1_startY, x2: r1_mirX, y2: r1_mirY, color: '#1D9E75' },
        { x1: r1_mirX, y1: r1_mirY, x2: r1_endX, y2: r1_endY, color: '#1D9E75', dashed: isVirtual },
        { x1: r2_startX, y1: r2_startY, x2: POLE, y2: r2_mirY, color: '#D85A30' },
        { x1: POLE, y1: r2_mirY, x2: r2_endX, y2: r2_endY, color: '#D85A30' },
    )

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['concave', 'convex'].map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: type === t ? 'var(--amber)' : 'var(--bg3)',
                        color: type === t ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{t} mirror</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Object distance |u|" unit=" cm" value={Math.abs(u)} min={5} max={60} step={1} onChange={v => setU(-v)} />
                <SimSlider label="Focal length |f|" unit=" cm" value={Math.abs(f)} min={5} max={30} step={1} onChange={setF} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('rm1', '#1D9E75')} {arrowDef('rm2', '#D85A30')}
                    {arrowDef('rmobj', '#FAC775')} {arrowDef('rmimg', isReal ? '#D85A30' : '#7F77DD')}
                </defs>

                {/* Principal axis */}
                <line x1={20} y1={CY} x2={W - 10} y2={CY}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} />

                {/* Mirror */}
                <path d={mirrorPath} fill="none" stroke="#378ADD" strokeWidth={3} strokeLinecap="round" />
                {/* Mirror backing hatch */}
                {Array.from({ length: 8 }, (_, i) => {
                    const y = CY - MIRROR_H / 2 + i * (MIRROR_H / 7)
                    return <line key={i} x1={POLE} y1={y} x2={POLE + 10} y2={y + 10}
                        stroke="rgba(55,138,221,0.3)" strokeWidth={1} />
                })}

                {/* Focal point */}
                <circle cx={fX} cy={CY} r={4} fill="#EF9F27" />
                <text x={fX} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>F</text>

                {/* Centre of curvature */}
                {type === 'concave' && (
                    <>
                        <circle cx={cX} cy={CY} r={3} fill="rgba(239,159,39,0.4)" />
                        <text x={cX} y={CY + 14} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>C</text>
                    </>
                )}

                {/* Rays */}
                {rays.map((r, i) => (
                    <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
                        stroke={r.color} strokeWidth={1.5}
                        strokeDasharray={r.dashed ? '5 3' : undefined}
                        markerEnd={`url(#rm${i < 2 ? 1 : 2})`} />
                ))}

                {/* Object arrow */}
                {objX > 20 && objX < W - 10 && (
                    <line x1={objX} y1={CY} x2={objX} y2={CY - objH}
                        stroke="#FAC775" strokeWidth={2.5} markerEnd="url(#rmobj)" />
                )}
                <text x={objX} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#FAC775', fontFamily: 'var(--mono)' }}>O</text>

                {/* Image arrow */}
                {isFinite(imgX) && imgX > 10 && imgX < W - 10 && (
                    <>
                        <line x1={imgX} y1={CY} x2={imgX} y2={CY - (isReal ? imgH : -imgH)}
                            stroke={isReal ? '#D85A30' : '#7F77DD'} strokeWidth={2}
                            strokeDasharray={isVirtual ? '5 3' : undefined}
                            markerEnd="url(#rmimg)" />
                        <text x={imgX} y={CY + 14} textAnchor="middle"
                            style={{ fontSize: 9, fill: isReal ? '#D85A30' : '#7F77DD', fontFamily: 'var(--mono)' }}>I</text>
                    </>
                )}

                {/* Pole label */}
                <text x={POLE + 5} y={CY + 14}
                    style={{ fontSize: 9, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>P</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Image distance v', val: isFinite(vVal) ? `${vVal.toFixed(2)} cm` : '∞', color: isReal ? 'var(--coral)' : '#7F77DD' },
                    { label: 'Magnification m', val: isFinite(m) ? m.toFixed(3) : '∞', color: 'var(--amber)' },
                    { label: 'Image nature', val: imageType, color: isReal ? 'var(--coral)' : '#7F77DD' },
                    { label: '|m| > 1', val: Math.abs(m) > 1 ? 'Magnified' : 'Diminished', color: 'var(--text2)' },
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