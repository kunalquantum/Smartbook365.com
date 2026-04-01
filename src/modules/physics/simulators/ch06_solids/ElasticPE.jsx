import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 260
const PAD = { l: 52, r: 20, t: 20, b: 36 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

const PRESETS = {
    'Steel wire': { k: 50000, maxX: 0.01 },
    'Spring': { k: 200, maxX: 0.30 },
    'Rubber band': { k: 50, maxX: 0.60 },
}

export default function ElasticPE() {
    const [x, setX] = useState(0.005)   // extension m
    const [k, setK] = useState(50000)    // N/m
    const [preset, setPreset] = useState('Steel wire')

    const applyPreset = name => {
        const p = PRESETS[name]
        setK(p.k); setX(p.maxX * 0.4); setPreset(name)
    }

    const F = k * x
    const U = 0.5 * k * x * x
    const maxX = PRESETS[preset]?.maxX || 0.30
    const maxF = k * maxX
    const maxU = 0.5 * k * maxX * maxX

    // Graph: F vs x (linear line from origin)
    const xPx = xVal => PAD.l + (xVal / maxX) * PW
    const fPy = fVal => PAD.t + PH - (fVal / maxF) * PH

    // Current extension SVG x
    const curX = xPx(x)
    const curY = fPy(F)

    // Triangle fill (area = energy)
    const trianglePath = `M${PAD.l},${PAD.t + PH} L${curX},${PAD.t + PH} L${curX},${curY} Z`

    // Full line
    const lineX2 = xPx(maxX)
    const lineY2 = fPy(maxF)

    // Wire drawing
    const WIRE_Y = 28
    const WIRE_X = 180
    const WIRE_NAT = 80   // natural length px
    const WIRE_EXT = WIRE_NAT + Math.round((x / maxX) * 60)
    const COILS = 8

    return (
        <div>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {Object.keys(PRESETS).map(p => (
                    <button key={p} onClick={() => applyPreset(p)} style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: preset === p ? 'var(--teal)' : 'var(--bg3)',
                        color: preset === p ? '#fff' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>{p}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Spring constant k" unit=" N/m" value={k} min={10} max={100000} step={100}
                    onChange={v => { setK(v); setPreset('') }} />
                <SimSlider label="Extension x" unit=" m" value={x} min={0} max={maxX} step={maxX / 100}
                    onChange={setX} />
            </div>

            {/* Spring / wire visual */}
            <div style={{
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 20px', marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
                <svg viewBox={`0 0 ${WIRE_X + WIRE_EXT + 60} 60`}
                    width={Math.min(300, WIRE_X + WIRE_EXT + 60)}
                    style={{ flexShrink: 0 }}>
                    {/* Ceiling */}
                    <rect x={WIRE_X - 10} y={0} width={20} height={8}
                        rx={2} fill="rgba(255,255,255,0.2)" />
                    {/* Spring coils */}
                    {Array.from({ length: COILS }, (_, i) => {
                        const segLen = WIRE_EXT / COILS
                        const x1 = WIRE_X + i * segLen
                        const x2 = WIRE_X + (i + 0.5) * segLen
                        const x3 = WIRE_X + (i + 1) * segLen
                        return (
                            <polyline key={i}
                                points={`${x1},30 ${x2},${i % 2 === 0 ? 15 : 45} ${x3},30`}
                                fill="none" stroke="rgba(55,138,221,0.7)" strokeWidth={1.5}
                                strokeLinecap="round" strokeLinejoin="round" />
                        )
                    })}
                    {/* Top mount */}
                    <line x1={WIRE_X} y1={8} x2={WIRE_X} y2={30}
                        stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                    {/* Weight block */}
                    <rect x={WIRE_X + WIRE_EXT - 12} y={38} width={24} height={16}
                        rx={3} fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
                    <text x={WIRE_X + WIRE_EXT} y={48} textAnchor="middle"
                        style={{ fontSize: 8, fill: '#000', fontFamily: 'var(--mono)' }}>F</text>
                    {/* Extension arrow */}
                    <line x1={WIRE_X + WIRE_NAT} y1={54} x2={WIRE_X + WIRE_EXT} y2={54}
                        stroke="rgba(29,158,117,0.6)" strokeWidth={1} />
                    <text x={WIRE_X + WIRE_NAT + (WIRE_EXT - WIRE_NAT) / 2} y={60} textAnchor="middle"
                        style={{ fontSize: 8, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>x</text>
                </svg>

                <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
                    <div>k = <span style={{ color: 'var(--amber)' }}>{k.toLocaleString()} N/m</span></div>
                    <div>x = <span style={{ color: 'var(--teal)' }}>{x.toFixed(4)} m</span></div>
                    <div>F = kx = <span style={{ color: 'var(--coral)' }}>{F.toFixed(2)} N</span></div>
                </div>
            </div>

            {/* F-x graph */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Energy area fill */}
                <path d={trianglePath} fill="rgba(239,159,39,0.15)" />

                {/* F-x line */}
                <line x1={PAD.l} y1={PAD.t + PH} x2={lineX2} y2={lineY2}
                    stroke="rgba(55,138,221,0.7)" strokeWidth={2} />

                {/* Current point */}
                <circle cx={curX} cy={curY} r={6}
                    fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* Vertical & horizontal dashed to axes */}
                <line x1={curX} y1={curY} x2={curX} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                <line x1={PAD.l} y1={curY} x2={curX} y2={curY}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />

                {/* Energy label inside triangle */}
                <text x={(PAD.l + curX) / 2} y={(PAD.t + PH + curY) / 2 + 4} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.8)', fontFamily: 'var(--mono)' }}>
                    U = {U < 1 ? U.toFixed(4) : U.toFixed(2)} J
                </text>

                {/* Slope label */}
                <text x={(PAD.l + lineX2) / 2 - 14} y={(PAD.t + PH + lineY2) / 2 - 10}
                    style={{ fontSize: 10, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>
                    slope = k
                </text>

                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={W - PAD.r} y={PAD.t + PH + 16}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>x (m) →</text>
                <text x={PAD.l - 8} y={PAD.t + PH / 2} textAnchor="middle"
                    transform={`rotate(-90,${PAD.l - 8},${PAD.t + PH / 2})`}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>F (N) →</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Force F = kx', val: `${F.toFixed(3)} N`, color: 'var(--coral)' },
                    { label: 'Elastic PE U = ½kx²', val: U < 0.001 ? `${U.toExponential(3)} J` : `${U.toFixed(4)} J`, color: 'var(--amber)' },
                    { label: 'U = ½Fx', val: `${(0.5 * F * x).toFixed(4)} J`, color: 'var(--teal)' },
                    { label: 'Power (k doubled)', val: `${(0.5 * 2 * k * x * x).toFixed(4)} J`, color: 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}