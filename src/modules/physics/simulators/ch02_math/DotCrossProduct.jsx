import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 340, H = 220, CX = 120, CY = 130, S = 12

export default function DotCrossProduct() {
    const [magA, setMagA] = useState(7)
    const [magB, setMagB] = useState(6)
    const [theta, setTheta] = useState(45)

    const rad = theta * Math.PI / 180
    const dot = +(magA * magB * Math.cos(rad)).toFixed(3)
    const cross = +(magA * magB * Math.sin(rad)).toFixed(3)
    const areaParallelogram = Math.abs(cross).toFixed(3)

    // Vector A along x-axis, Vector B at angle theta
    const ax2 = CX + magA * S, ay2 = CY
    const bx2 = CX + magB * S * Math.cos(rad)
    const by2 = CY - magB * S * Math.sin(rad)

    // Parallelogram fill points
    const px = `${CX},${CY} ${ax2},${ay2} ${ax2 + bx2 - CX},${ay2 + by2 - CY} ${bx2},${by2}`

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="|A|" unit=" units" value={magA} min={1} max={10} step={0.5} onChange={setMagA} />
                <SimSlider label="|B|" unit=" units" value={magB} min={1} max={10} step={0.5} onChange={setMagB} />
            </div>
            <SimSlider label="Angle θ between A and B" unit="°" value={theta} min={0} max={180} step={1} onChange={setTheta} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 14 }}>
                {/* Parallelogram area = |cross product| */}
                <polygon points={px} fill="rgba(239,159,39,0.12)" stroke="rgba(239,159,39,0.25)" strokeWidth={0.5} />

                {/* Area label */}
                <text x={(CX + ax2 + bx2) / 3} y={(CY + ay2 + by2) / 3}
                    textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    area = {areaParallelogram}
                </text>

                {/* Defs */}
                <defs>
                    <marker id="da" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#1D9E75" strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                    <marker id="db" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#D85A30" strokeWidth={1.5} strokeLinecap="round" />
                    </marker>
                </defs>

                {/* Vector A */}
                <line x1={CX} y1={CY} x2={ax2} y2={ay2}
                    stroke="#1D9E75" strokeWidth={2.5} markerEnd="url(#da)" />
                <text x={(CX + ax2) / 2} y={ay2 + 14} textAnchor="middle"
                    style={{ fontSize: 11, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>A={magA}</text>

                {/* Vector B */}
                <line x1={CX} y1={CY} x2={bx2} y2={by2}
                    stroke="#D85A30" strokeWidth={2.5} markerEnd="url(#db)" />
                <text x={bx2 + 10} y={by2}
                    style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)' }}>B={magB}</text>

                {/* Angle arc */}
                <path d={`M ${CX + 30} ${CY} A 30 30 0 ${theta > 180 ? 1 : 0} 0 ${CX + 30 * Math.cos(rad)} ${CY - 30 * Math.sin(rad)}`}
                    fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
                <text x={CX + 40} y={CY - 10}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.7)', fontFamily: 'var(--mono)' }}>{theta}°</text>

                {/* Cross product direction indicator */}
                {theta > 5 && theta < 175 && (
                    <g>
                        <circle cx={W - 38} cy={40} r={16} fill="none" stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                        <text x={W - 38} y={44} textAnchor="middle"
                            style={{ fontSize: 18, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            {theta < 180 ? '⊙' : '⊗'}
                        </text>
                        <text x={W - 38} y={64} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.6)', fontFamily: 'var(--mono)' }}>
                            A×B
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Dot product A·B', val: `${dot}`, sub: '= |A||B|cosθ  (scalar)', color: 'var(--teal)' },
                    { label: 'Cross |A×B|', val: `${cross}`, sub: '= |A||B|sinθ  (vector)', color: 'var(--amber)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)', flex: 1, minWidth: 160,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 4 }}>{c.sub}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 12, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                {theta === 0 && '→ Parallel vectors: dot product is maximum, cross product is zero'}
                {theta === 90 && '→ Perpendicular vectors: dot product is zero, cross product is maximum'}
                {theta === 180 && '→ Anti-parallel vectors: dot product is minimum (negative), cross product is zero'}
                {theta > 0 && theta < 90 && theta !== 90 && '→ Acute angle: dot product is positive'}
                {theta > 90 && theta < 180 && '→ Obtuse angle: dot product is negative'}
            </div>
        </div>
    )
}