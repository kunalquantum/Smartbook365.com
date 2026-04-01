import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 340, H = 260, CX = 170, CY = 130, SCALE = 10

export default function VectorExplorer() {
    const [mag, setMag] = useState(8)
    const [angle, setAngle] = useState(35)

    const rad = (angle * Math.PI) / 180
    const ex = CX + mag * SCALE * Math.cos(rad)
    const ey = CY - mag * SCALE * Math.sin(rad)
    const ax = +(mag * Math.cos(rad)).toFixed(2)
    const ay = +(mag * Math.sin(rad)).toFixed(2)

    return (
        <div>
            <SimSlider label="Magnitude |A|" unit=" units" value={mag} min={1} max={12} step={0.5} onChange={setMag} />
            <SimSlider label="Angle θ" unit="°" value={angle} min={0} max={360} step={1} onChange={setAngle} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 14 }}>
                {/* Grid */}
                {Array.from({ length: 13 }, (_, i) => (
                    <g key={i}>
                        <line x1={CX + (i - 6) * SCALE * 2} y1={10} x2={CX + (i - 6) * SCALE * 2} y2={H - 10}
                            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                        <line x1={10} y1={CY + (i - 6) * SCALE * 2} x2={W - 10} y2={CY + (i - 6) * SCALE * 2}
                            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                    </g>
                ))}

                {/* Axes */}
                <line x1={10} y1={CY} x2={W - 10} y2={CY} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <line x1={CX} y1={10} x2={CX} y2={H - 10} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <text x={W - 14} y={CY - 5} style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>x</text>
                <text x={CX + 4} y={16} style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>y</text>

                {/* Angle arc */}
                <path
                    d={`M ${CX + 30} ${CY} A 30 30 0 ${angle > 180 ? 1 : 0} 0 
              ${CX + 30 * Math.cos(rad)} ${CY - 30 * Math.sin(rad)}`}
                    fill="none" stroke="rgba(239,159,39,0.4)" strokeWidth={1.5}
                />
                <text
                    x={CX + 38 * Math.cos(rad / 2)}
                    y={CY - 38 * Math.sin(rad / 2)}
                    style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}
                >{angle}°</text>

                {/* Component lines */}
                <line x1={CX} y1={CY} x2={ex} y2={CY}
                    stroke="rgba(29,158,117,0.5)" strokeWidth={1.5} strokeDasharray="4 3" />
                <line x1={ex} y1={CY} x2={ex} y2={ey}
                    stroke="rgba(216,90,48,0.5)" strokeWidth={1.5} strokeDasharray="4 3" />
                <text x={(CX + ex) / 2} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>Ax={ax}</text>
                <text x={ex + 18} y={(CY + ey) / 2} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>Ay={ay}</text>

                {/* Vector arrow */}
                <defs>
                    <marker id="vh" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={6} markerHeight={6} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#EF9F27"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>
                <line x1={CX} y1={CY} x2={ex} y2={ey}
                    stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#vh)" />

                {/* Label */}
                <text x={ex + 10} y={ey - 6}
                    style={{ fontSize: 12, fill: '#FAC775', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    A = {mag}
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Magnitude |A|', val: `${mag} units`, color: 'var(--amber)' },
                    { label: 'x-component', val: `${ax} units`, color: 'var(--teal)' },
                    { label: 'y-component', val: `${ay} units`, color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)',
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}