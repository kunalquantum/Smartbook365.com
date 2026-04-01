import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 380, H = 280, CX = 90, CY = 200, S = 14

export default function VectorAddition() {
    const [magA, setMagA] = useState(6)
    const [magB, setMagB] = useState(5)
    const [angA, setAngA] = useState(0)
    const [angB, setAngB] = useState(55)
    const [mode, setMode] = useState('triangle') // triangle | parallelogram

    const toRad = d => d * Math.PI / 180
    const rA = toRad(angA), rB = toRad(angB)

    // Vector components
    const Ax = magA * Math.cos(rA), Ay = magA * Math.sin(rA)
    const Bx = magB * Math.cos(rB), By = magB * Math.sin(rB)
    const Rx = Ax + Bx, Ry = Ay + By
    const magR = Math.sqrt(Rx * Rx + Ry * Ry).toFixed(2)
    const angR = (Math.atan2(Ry, Rx) * 180 / Math.PI).toFixed(1)

    // SVG coords (flip y)
    const ax1 = CX, ay1 = CY
    const ax2 = CX + Ax * S, ay2 = CY - Ay * S
    // Triangle: B starts from tip of A
    const bx1_t = ax2, by1_t = ay2
    const bx2_t = ax2 + Bx * S, by2_t = ay2 - By * S
    // Parallelogram: B starts from origin
    const bx1_p = CX, by1_p = CY
    const bx2_p = CX + Bx * S, by2_p = CY - By * S
    // Resultant always from origin to R
    const rx2 = CX + Rx * S, ry2 = CY - Ry * S

    const Arrow = ({ x1, y1, x2, y2, color, id, dashed }) => (
        <g>
            <defs>
                <marker id={id} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </marker>
            </defs>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color} strokeWidth={2} markerEnd={`url(#${id})`}
                strokeDasharray={dashed ? '5 4' : undefined} />
        </g>
    )

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {['triangle', 'parallelogram'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m} law</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Vector A" unit=" units" value={magA} min={1} max={10} step={0.5} onChange={setMagA} />
                <SimSlider label="Angle A" unit="°" value={angA} min={0} max={180} step={5} onChange={setAngA} />
                <SimSlider label="Vector B" unit=" units" value={magB} min={1} max={10} step={0.5} onChange={setMagB} />
                <SimSlider label="Angle B" unit="°" value={angB} min={0} max={180} step={5} onChange={setAngB} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 14 }}>
                {/* Grid */}
                {Array.from({ length: 14 }, (_, i) => (
                    <g key={i}>
                        <line x1={i * S * 2} y1={0} x2={i * S * 2} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                        <line x1={0} y1={i * S * 2} x2={W} y2={i * S * 2} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                    </g>
                ))}

                {mode === 'triangle' ? (
                    <>
                        <Arrow x1={ax1} y1={ay1} x2={ax2} y2={ay2} color="#1D9E75" id="a1" />
                        <Arrow x1={bx1_t} y1={by1_t} x2={bx2_t} y2={by2_t} color="#D85A30" id="b1" />
                        <Arrow x1={ax1} y1={ay1} x2={bx2_t} y2={by2_t} color="#EF9F27" id="r1" dashed />
                    </>
                ) : (
                    <>
                        <Arrow x1={ax1} y1={ay1} x2={ax2} y2={ay2} color="#1D9E75" id="a2" />
                        <Arrow x1={bx1_p} y1={by1_p} x2={bx2_p} y2={by2_p} color="#D85A30" id="b2" />
                        {/* complete parallelogram sides */}
                        <line x1={ax2} y1={ay2} x2={rx2} y2={ry2} stroke="rgba(29,158,117,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                        <line x1={bx2_p} y1={by2_p} x2={rx2} y2={ry2} stroke="rgba(216,90,48,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                        <Arrow x1={ax1} y1={ay1} x2={rx2} y2={ry2} color="#EF9F27" id="r2" />
                    </>
                )}

                {/* Labels */}
                <text x={(ax1 + ax2) / 2 - 10} y={(ay1 + ay2) / 2 - 8}
                    style={{ fontSize: 11, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>A={magA}</text>
                <text x={mode === 'triangle' ? (bx1_t + bx2_t) / 2 + 6 : (bx1_p + bx2_p) / 2 + 6}
                    y={mode === 'triangle' ? (by1_t + by2_t) / 2 : (by1_p + by2_p) / 2}
                    style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)' }}>B={magB}</text>
                <text x={rx2 + 8} y={ry2}
                    style={{ fontSize: 12, fill: '#FAC775', fontFamily: 'var(--mono)', fontWeight: 600 }}>R={magR}</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: '|Resultant| R', val: `${magR} units`, color: 'var(--amber)' },
                    { label: 'Direction θ', val: `${angR}°`, color: 'var(--teal)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)',
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}