import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 200
const ROD_Y = 80, ROD_H = 40

export default function StressStrain() {
    const [force, setForce] = useState(5000)    // N
    const [area, setArea] = useState(10)       // mm²
    const [length, setLength] = useState(1.0)      // m
    const [young, setYoung] = useState(200)      // GPa (steel default)
    const [type, setType] = useState('tensile')

    const A_m2 = area * 1e-6
    const Y_Pa = young * 1e9
    const stress = force / A_m2                  // Pa
    const strain = stress / Y_Pa                 // dimensionless
    const deltaL = strain * length * 1000        // mm
    const stressMPa = (stress / 1e6).toFixed(3)

    // Rod drawing
    const ROD_X = 80
    const ROD_W = 280
    const stretch = Math.min(deltaL * 400, 60)   // visual exaggeration

    const tensile = type === 'tensile'
    const compressive = type === 'compressive'
    const shear = type === 'shear'

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            {/* Type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['tensile', 'compressive', 'shear'].map(t => (
                    <button key={t} onClick={() => setType(t)} style={{
                        padding: '4px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: type === t ? 'var(--amber)' : 'var(--bg3)',
                        color: type === t ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{t}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Force F" unit=" N" value={force} min={100} max={50000} step={100} onChange={setForce} />
                <SimSlider label="Cross-section A" unit=" mm²" value={area} min={1} max={100} step={1} onChange={setArea} />
                <SimSlider label="Length L" unit=" m" value={length} min={0.1} max={5} step={0.1} onChange={setLength} />
                <SimSlider label="Young's E" unit=" GPa" value={young} min={1} max={400} step={1} onChange={setYoung} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                <defs>
                    {arrowDef('sf1', '#EF9F27')}
                    {arrowDef('sf2', '#EF9F27')}
                    {arrowDef('ssh', '#D85A30')}
                </defs>

                {/* === TENSILE === */}
                {tensile && (
                    <g>
                        {/* Original rod ghost */}
                        <rect x={ROD_X} y={ROD_Y} width={ROD_W} height={ROD_H}
                            rx={4} fill="none" stroke="rgba(255,255,255,0.07)"
                            strokeWidth={1} strokeDasharray="4 3" />
                        {/* Stretched rod */}
                        <rect x={ROD_X - stretch / 2} y={ROD_Y + 4}
                            width={ROD_W + stretch} height={ROD_H - 8}
                            rx={4} fill="rgba(55,138,221,0.15)"
                            stroke="rgba(55,138,221,0.5)" strokeWidth={1.5} />
                        {/* Force arrows pulling outward */}
                        <line x1={ROD_X - stretch / 2 - 8} y1={ROD_Y + ROD_H / 2}
                            x2={ROD_X - stretch / 2 - 40} y2={ROD_Y + ROD_H / 2}
                            stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#sf1)" />
                        <line x1={ROD_X + ROD_W + stretch / 2 + 8} y1={ROD_Y + ROD_H / 2}
                            x2={ROD_X + ROD_W + stretch / 2 + 40} y2={ROD_Y + ROD_H / 2}
                            stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#sf2)" />
                        <text x={ROD_X - stretch / 2 - 28} y={ROD_Y + ROD_H / 2 - 10} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>F</text>
                        <text x={ROD_X + ROD_W + stretch / 2 + 28} y={ROD_Y + ROD_H / 2 - 10} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>F</text>
                        {/* Extension label */}
                        <line x1={ROD_X} y1={ROD_Y + ROD_H + 18}
                            x2={ROD_X + ROD_W} y2={ROD_Y + ROD_H + 18}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                        <line x1={ROD_X - stretch / 2} y1={ROD_Y + ROD_H + 26}
                            x2={ROD_X + ROD_W + stretch / 2} y2={ROD_Y + ROD_H + 26}
                            stroke="rgba(29,158,117,0.5)" strokeWidth={1} />
                        <text x={ROD_X + ROD_W / 2} y={ROD_Y + ROD_H + 38} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                            ΔL = {deltaL.toFixed(4)} mm
                        </text>
                    </g>
                )}

                {/* === COMPRESSIVE === */}
                {compressive && (
                    <g>
                        <rect x={ROD_X + stretch / 2} y={ROD_Y}
                            width={ROD_W - stretch} height={ROD_H}
                            rx={4} fill="rgba(216,90,48,0.15)"
                            stroke="rgba(216,90,48,0.5)" strokeWidth={1.5} />
                        {/* Force arrows pushing inward */}
                        <line x1={ROD_X - 40} y1={ROD_Y + ROD_H / 2}
                            x2={ROD_X + stretch / 2} y2={ROD_Y + ROD_H / 2}
                            stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#sf1)" />
                        <line x1={ROD_X + ROD_W + 40} y1={ROD_Y + ROD_H / 2}
                            x2={ROD_X + ROD_W - stretch / 2} y2={ROD_Y + ROD_H / 2}
                            stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#sf2)" />
                        <text x={ROD_X + ROD_W / 2} y={ROD_Y + ROD_H + 30} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                            Compression ΔL = {deltaL.toFixed(4)} mm
                        </text>
                    </g>
                )}

                {/* === SHEAR === */}
                {shear && (
                    <g>
                        {/* Bottom face fixed */}
                        <rect x={ROD_X} y={ROD_Y + ROD_H - 6} width={ROD_W} height={6}
                            rx={2} fill="rgba(160,176,200,0.2)"
                            stroke="rgba(160,176,200,0.3)" strokeWidth={1} />
                        {/* Top face displaced */}
                        <rect x={ROD_X + stretch} y={ROD_Y} width={ROD_W} height={ROD_H - 6}
                            rx={2} fill="rgba(216,90,48,0.15)"
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                        {/* Shear force arrow */}
                        <line x1={ROD_X + ROD_W / 2} y1={ROD_Y - 10}
                            x2={ROD_X + ROD_W / 2 + stretch + 20} y2={ROD_Y - 10}
                            stroke="#D85A30" strokeWidth={2} markerEnd="url(#ssh)" />
                        <text x={ROD_X + ROD_W / 2 + stretch / 2 + 10} y={ROD_Y - 18}
                            style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>F (shear)</text>
                        {/* Shear angle */}
                        <line x1={ROD_X + ROD_W / 4} y1={ROD_Y + ROD_H - 6}
                            x2={ROD_X + ROD_W / 4 + stretch} y2={ROD_Y}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} strokeDasharray="3 3" />
                        <text x={ROD_X + ROD_W / 4 + stretch + 6} y={ROD_Y + ROD_H / 2}
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>φ</text>
                        <text x={ROD_X + ROD_W / 2} y={ROD_Y + ROD_H + 30} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            Shear strain tanφ = {strain.toFixed(5)}
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Stress σ', val: `${stressMPa} MPa`, color: 'var(--amber)' },
                    { label: 'Strain ε', val: strain.toExponential(3), color: 'var(--teal)' },
                    { label: 'Extension ΔL', val: `${deltaL.toFixed(5)} mm`, color: 'var(--coral)' },
                    { label: 'σ/ε = Y', val: `${young} GPa`, color: 'var(--text2)' },
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