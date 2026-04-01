import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const MATERIALS = {
    Steel: { alpha: 11e-6, color: '#378ADD' },
    Aluminum: { alpha: 23e-6, color: '#1D9E75' },
    Copper: { alpha: 17e-6, color: '#EF9F27' },
    Glass: { alpha: 9e-6, color: '#7F77DD' },
    Concrete: { alpha: 12e-6, color: '#888780' },
}

const MODES = ['Linear (rod)', 'Area (plate)', 'Volume (cube)']

export default function ThermalExpansion() {
    const [material, setMaterial] = useState('Steel')
    const [L0, setL0] = useState(1.0)    // m
    const [deltaT, setDeltaT] = useState(100)    // °C
    const [mode, setMode] = useState('Linear (rod)')

    const mat = MATERIALS[material]
    const alpha = mat.alpha
    const beta = 2 * alpha
    const gamma = 3 * alpha

    const dL = alpha * L0 * deltaT
    const dA = beta * L0 * L0 * deltaT
    const dV = gamma * L0 * L0 * L0 * deltaT

    const newL = L0 + dL
    const newA = L0 * L0 + dA
    const newV = L0 ** 3 + dV

    // SVG drawing
    const W = 440, H = 160
    const BASE_X = 60, BASE_Y = 60

    // Original dimensions in SVG px
    const SCALE = 140 / L0
    const origPx = L0 * SCALE
    const stretchPx = dL * SCALE * 60   // visual exaggeration ×60

    const isLinear = mode === 'Linear (rod)'
    const isArea = mode === 'Area (plate)'
    const isVol = mode === 'Volume (cube)'

    const tempColor = deltaT < 50
        ? `rgba(55,138,221,0.6)`
        : deltaT < 150
            ? `rgba(239,159,39,0.6)`
            : `rgba(216,90,48,0.7)`

    return (
        <div>
            {/* Material selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MATERIALS).map(m => (
                    <button key={m} onClick={() => setMaterial(m)} style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: material === m ? MATERIALS[m].color : 'var(--bg3)',
                        color: material === m ? '#000' : 'var(--text2)',
                        border: `1px solid ${material === m ? MATERIALS[m].color : 'var(--border)'}`,
                    }}>{m}</button>
                ))}
            </div>

            {/* Mode selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {MODES.map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '4px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Original length L₀" unit=" m" value={L0} min={0.1} max={5} step={0.1} onChange={setL0} />
                <SimSlider label="Temperature rise ΔT" unit=" °C" value={deltaT} min={0} max={500} step={5} onChange={setDeltaT} />
            </div>

            {/* Visual */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 14 }}>

                {/* Heat glow */}
                {deltaT > 0 && (
                    <rect x={BASE_X - 10} y={BASE_Y - 20} width={origPx + stretchPx * 2 + 20} height={80}
                        rx={12} fill={tempColor} opacity={0.08} />
                )}

                {isLinear && (
                    <g>
                        {/* Original ghost */}
                        <rect x={BASE_X} y={BASE_Y} width={origPx} height={32}
                            rx={4} fill="none" stroke="rgba(255,255,255,0.08)"
                            strokeWidth={1} strokeDasharray="4 3" />
                        {/* Expanded rod */}
                        <rect x={BASE_X} y={BASE_Y + 4} width={origPx + stretchPx} height={24}
                            rx={4} fill={mat.color} opacity={0.3}
                            stroke={mat.color} strokeWidth={1.5} />
                        {/* Extension highlight */}
                        <rect x={BASE_X + origPx} y={BASE_Y + 4} width={stretchPx} height={24}
                            rx={2} fill={mat.color} opacity={0.7} />
                        {/* Dimension arrows */}
                        <line x1={BASE_X} y1={BASE_Y + 44} x2={BASE_X + origPx + stretchPx} y2={BASE_Y + 44}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                        <text x={BASE_X + (origPx + stretchPx) / 2} y={BASE_Y + 57} textAnchor="middle"
                            style={{ fontSize: 10, fill: mat.color, fontFamily: 'var(--mono)' }}>
                            L = {newL.toFixed(6)} m
                        </text>
                        <text x={BASE_X + origPx + stretchPx / 2} y={BASE_Y - 6} textAnchor="middle"
                            style={{ fontSize: 10, fill: mat.color, fontFamily: 'var(--mono)' }}>
                            +{(dL * 1000).toFixed(4)} mm
                        </text>
                    </g>
                )}

                {isArea && (
                    <g>
                        {/* Original plate */}
                        <rect x={BASE_X} y={BASE_Y - 20} width={origPx} height={origPx * 0.4}
                            rx={3} fill="none" stroke="rgba(255,255,255,0.1)"
                            strokeWidth={1} strokeDasharray="4 3" />
                        {/* Expanded plate */}
                        <rect x={BASE_X} y={BASE_Y - 20}
                            width={origPx + stretchPx}
                            height={(origPx + stretchPx) * 0.4}
                            rx={3} fill={mat.color} opacity={0.2}
                            stroke={mat.color} strokeWidth={1.5} />
                        <text x={BASE_X + (origPx + stretchPx) / 2}
                            y={BASE_Y - 20 + (origPx + stretchPx) * 0.4 + 16}
                            textAnchor="middle"
                            style={{ fontSize: 10, fill: mat.color, fontFamily: 'var(--mono)' }}>
                            A = {newA.toFixed(4)} m²  (+{(dA * 1e4).toFixed(4)} cm²)
                        </text>
                    </g>
                )}

                {isVol && (
                    <g>
                        {/* Isometric cube — original */}
                        {(() => {
                            const s = origPx * 0.45
                            const es = s + stretchPx * 0.6
                            const cx = BASE_X + 60, cy = BASE_Y + 20
                            const iso = (x, y, z) => [cx + (x - z) * 0.7, cy + (x + z) * 0.35 - y * 0.7]
                            const v = (x, y, z) => iso(x * es, y * es, z * es)
                            const pts = (corners) => corners.map(([x, y, z]) => v(x, y, z).join(',')).join(' ')
                            return (
                                <g>
                                    <polygon points={pts([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]])}
                                        fill={mat.color} opacity={0.2} stroke={mat.color} strokeWidth={1} />
                                    <polygon points={pts([[1, 0, 0], [1, 0, 1], [1, 1, 1], [1, 1, 0]])}
                                        fill={mat.color} opacity={0.15} stroke={mat.color} strokeWidth={1} />
                                    <polygon points={pts([[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]])}
                                        fill={mat.color} opacity={0.25} stroke={mat.color} strokeWidth={1} />
                                    <text x={cx + es * 0.5} y={cy + es * 0.9}
                                        textAnchor="middle"
                                        style={{ fontSize: 10, fill: mat.color, fontFamily: 'var(--mono)' }}>
                                        V = {newV.toFixed(4)} m³
                                    </text>
                                </g>
                            )
                        })()}
                    </g>
                )}

                {/* α label */}
                <text x={W - 20} y={30} textAnchor="end"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    α = {(alpha * 1e6).toFixed(0)} × 10⁻⁶ /°C
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'ΔL = αL₀ΔT', val: `${(dL * 1000).toFixed(5)} mm`, color: mat.color },
                    { label: 'ΔA = βA₀ΔT', val: `${(dA * 1e4).toFixed(5)} cm²`, color: 'var(--teal)' },
                    { label: 'ΔV = γV₀ΔT', val: `${(dV * 1e6).toFixed(5)} cm³`, color: 'var(--amber)' },
                    { label: 'α (linear)', val: `${(alpha * 1e6).toFixed(0)}×10⁻⁶`, color: 'var(--text2)' },
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