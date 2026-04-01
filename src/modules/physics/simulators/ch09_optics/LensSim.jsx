import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const CX = W / 2, CY = H / 2
const LENS_H = 130

export default function LensSim() {
    const [u, setU] = useState(-40)
    const [f, setF] = useState(15)
    const [type, setType] = useState('converging')

    const fVal = type === 'converging' ? Math.abs(f) : -Math.abs(f)
    const uVal = -Math.abs(u)

    // Lens formula: 1/v - 1/u = 1/f
    const vVal = 1 / (1 / fVal + 1 / uVal)
    const m = vVal / uVal
    const isReal = vVal > 0
    const imgType = isReal ? 'Real, Inverted' : 'Virtual, Erect'

    const S = 4
    const objX = CX + uVal * S
    const imgX = CX + vVal * S
    const fX1 = CX + fVal * S    // focal point (transmission side)
    const fX2 = CX - fVal * S    // focal point (incidence side)
    const objH = 50
    const imgH = Math.abs(m) * objH

    // Rays from object tip
    // Ray 1: parallel → bends through F1 (converging) or away from F1 (diverging)
    // Ray 2: through optical centre → straight
    // Ray 3: through F2 → emerges parallel

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    // Lens shape
    const lensPath = type === 'converging'
        ? `M ${CX} ${CY - LENS_H / 2} Q ${CX + 20} ${CY} ${CX} ${CY + LENS_H / 2} Q ${CX - 20} ${CY} ${CX} ${CY - LENS_H / 2} Z`
        : `M ${CX} ${CY - LENS_H / 2} Q ${CX - 10} ${CY} ${CX} ${CY + LENS_H / 2} Q ${CX + 10} ${CY} ${CX} ${CY - LENS_H / 2} Z`

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['converging', 'diverging'].map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: type === t ? 'var(--amber)' : 'var(--bg3)',
                        color: type === t ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{t} lens</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Object distance |u|" unit=" cm" value={Math.abs(u)} min={5} max={80} step={1} onChange={v => setU(-v)} />
                <SimSlider label="Focal length |f|" unit=" cm" value={Math.abs(f)} min={5} max={40} step={1} onChange={setF} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('lr1', '#1D9E75')} {arrowDef('lr2', '#D85A30')}
                    {arrowDef('lr3', '#7F77DD')} {arrowDef('lobj', '#FAC775')}
                    {arrowDef('limg', isReal ? '#D85A30' : '#7F77DD')}
                </defs>

                {/* Principal axis */}
                <line x1={10} y1={CY} x2={W - 10} y2={CY}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.8} />

                {/* Focal points */}
                <circle cx={fX1} cy={CY} r={4} fill="#EF9F27" />
                <text x={fX1} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>F₁</text>
                <circle cx={fX2} cy={CY} r={4} fill="#EF9F27" />
                <text x={fX2} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>F₂</text>

                {/* Lens */}
                <path d={lensPath}
                    fill={`rgba(55,138,221,${type === 'converging' ? '0.15' : '0.08'})`}
                    stroke="#378ADD" strokeWidth={2} />
                {/* Lens arrows */}
                {type === 'converging' && (
                    <>
                        <line x1={CX} y1={CY - LENS_H / 2 - 12} x2={CX} y2={CY - LENS_H / 2}
                            stroke="#378ADD" strokeWidth={2} markerEnd="url(#lr1)" />
                        <line x1={CX} y1={CY + LENS_H / 2 + 12} x2={CX} y2={CY + LENS_H / 2}
                            stroke="#378ADD" strokeWidth={2} markerEnd="url(#lr1)" />
                    </>
                )}
                {type === 'diverging' && (
                    <>
                        <line x1={CX} y1={CY - LENS_H / 2} x2={CX} y2={CY - LENS_H / 2 - 12}
                            stroke="#378ADD" strokeWidth={2} markerEnd="url(#lr2)" />
                        <line x1={CX} y1={CY + LENS_H / 2} x2={CX} y2={CY + LENS_H / 2 + 12}
                            stroke="#378ADD" strokeWidth={2} markerEnd="url(#lr2)" />
                    </>
                )}

                {/* Ray 1: parallel to axis → through/from F1 */}
                {(() => {
                    const r1y = CY - objH
                    // hits lens at same y
                    const afterSlope = (CY - r1y) / (fX1 - CX)
                    const r1EndX = type === 'converging' ? fX1 + 60 : fX1 - 60
                    const r1EndY = r1y + afterSlope * (r1EndX - CX)
                    return (
                        <>
                            <line x1={objX} y1={r1y} x2={CX} y2={r1y}
                                stroke="#1D9E75" strokeWidth={1.5} markerEnd="url(#lr1)" />
                            <line x1={CX} y1={r1y} x2={r1EndX} y2={r1EndY}
                                stroke="#1D9E75" strokeWidth={1.5}
                                strokeDasharray={!isReal ? '5 3' : undefined}
                                markerEnd="url(#lr1)" />
                        </>
                    )
                })()}

                {/* Ray 2: through optical centre — straight */}
                {(() => {
                    const slope = (CY - (CY - objH)) / (CX - objX)
                    const endX = isReal ? imgX + 20 : imgX - 20
                    const endY = (CY - objH) + slope * (endX - objX)
                    return (
                        <line x1={objX} y1={CY - objH} x2={endX} y2={endY}
                            stroke="#D85A30" strokeWidth={1.5}
                            strokeDasharray={!isReal ? '5 3' : undefined}
                            markerEnd="url(#lr2)" />
                    )
                })()}

                {/* Ray 3: through F2 → emerges parallel */}
                {(() => {
                    const slope = (CY - (CY - objH)) / (CX - fX2)
                    const atLens = (CY - objH) + slope * (CX - objX)
                    const endX = CX + 80
                    return (
                        <>
                            <line x1={objX} y1={CY - objH} x2={CX} y2={atLens}
                                stroke="#7F77DD" strokeWidth={1.5} markerEnd="url(#lr3)" />
                            <line x1={CX} y1={atLens} x2={endX} y2={atLens}
                                stroke="#7F77DD" strokeWidth={1.5}
                                strokeDasharray={!isReal ? '5 3' : undefined}
                                markerEnd="url(#lr3)" />
                        </>
                    )
                })()}

                {/* Object */}
                {objX > 10 && objX < W - 10 && (
                    <line x1={objX} y1={CY} x2={objX} y2={CY - objH}
                        stroke="#FAC775" strokeWidth={3} markerEnd="url(#lobj)" />
                )}
                <text x={objX} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#FAC775', fontFamily: 'var(--mono)' }}>O</text>

                {/* Image */}
                {isFinite(imgX) && imgX > 10 && imgX < W - 10 && (
                    <>
                        <line x1={imgX} y1={CY} x2={imgX} y2={CY - (isReal ? imgH : -imgH)}
                            stroke={isReal ? '#D85A30' : '#7F77DD'} strokeWidth={2.5}
                            strokeDasharray={!isReal ? '5 3' : undefined}
                            markerEnd="url(#limg)" />
                        <text x={imgX} y={CY + 14} textAnchor="middle"
                            style={{ fontSize: 9, fill: isReal ? '#D85A30' : '#7F77DD', fontFamily: 'var(--mono)' }}>I</text>
                    </>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Image dist v', val: isFinite(vVal) ? `${vVal.toFixed(2)} cm` : '∞', color: isReal ? 'var(--coral)' : '#7F77DD' },
                    { label: 'Magnification m', val: isFinite(m) ? m.toFixed(3) : '∞', color: 'var(--amber)' },
                    { label: 'Image nature', val: imgType, color: isReal ? 'var(--coral)' : '#7F77DD' },
                    { label: 'Power P', val: `${(100 / fVal).toFixed(2)} D`, color: 'var(--teal)' },
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