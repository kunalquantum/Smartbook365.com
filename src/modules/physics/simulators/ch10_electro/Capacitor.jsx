import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const E0 = 8.85e-12

const DIELECTRICS = {
    'Vacuum': 1.0,
    'Air': 1.0006,
    'Paper': 3.5,
    'Glass': 7.0,
    'Mica': 6.0,
    'Water': 80,
    'Ceramic': 10000,
}

export default function Capacitor() {
    const [A, setA] = useState(0.01)   // m²
    const [d, setD] = useState(0.002)  // m
    const [V, setV] = useState(100)    // Volts
    const [diel, setDiel] = useState('Air')
    const [mode, setMode] = useState('plates') // plates | energy

    const kappa = DIELECTRICS[diel]
    const C = (kappa * E0 * A) / d          // Farads
    const Q = C * V                          // Coulombs
    const E_field = V / d                        // V/m
    const U = 0.5 * C * V * V               // Joules
    const sigma = Q / A                          // C/m²

    // Visual
    const PLATE_X1 = 80, PLATE_X2 = W - 80
    const PLATE_Y1 = 80, PLATE_Y2 = H - 80
    const PLATE_W = 24
    const GAP = PLATE_X2 - PLATE_X1 - PLATE_W * 2

    // Field line density by E
    const nLines = Math.max(3, Math.min(12, Math.round(E_field / 5000)))
    const lineSpacing = (PLATE_Y2 - PLATE_Y1) / (nLines + 1)

    // E-field color by strength
    const fieldColor = E_field > 1e6 ? '#D85A30' : E_field > 1e5 ? '#EF9F27' : '#1D9E75'

    // Charge density dots
    const nDots = Math.min(20, Math.round(Math.abs(sigma) * 1e6 + 3))

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['plates', 'energy'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'plates' ? 'Plate view' : 'Energy view'}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
                <SimSlider label="Area A" unit=" cm²" value={A * 1e4} min={1} max={100} step={1} onChange={v => setA(v / 1e4)} />
                <SimSlider label="Separation d" unit=" mm" value={d * 1000} min={0.5} max={10} step={0.5} onChange={v => setD(v / 1000)} />
                <SimSlider label="Voltage V" unit=" V" value={V} min={1} max={1000} step={5} onChange={setV} />
            </div>

            {/* Dielectric selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(DIELECTRICS).map(k => (
                    <button key={k} onClick={() => setDiel(k)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: diel === k ? 'var(--teal)' : 'var(--bg3)',
                        color: diel === k ? '#fff' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>κ={DIELECTRICS[k]} {k}</button>
                ))}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    <marker id="cap_e" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke={fieldColor}
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>

                {/* Dielectric fill */}
                {kappa > 1 && (
                    <rect x={PLATE_X1 + PLATE_W} y={PLATE_Y1}
                        width={GAP} height={PLATE_Y2 - PLATE_Y1}
                        fill={`rgba(127,119,221,${Math.min(0.25, kappa / 400 + 0.03)})`} />
                )}
                {kappa > 1 && (
                    <text x={PLATE_X1 + PLATE_W + GAP / 2} y={PLATE_Y1 + 14} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(127,119,221,0.7)', fontFamily: 'var(--mono)' }}>
                        κ={kappa}  {diel}
                    </text>
                )}

                {/* Left plate (positive) */}
                <rect x={PLATE_X1} y={PLATE_Y1} width={PLATE_W} height={PLATE_Y2 - PLATE_Y1}
                    rx={3} fill="rgba(216,90,48,0.25)" stroke="#D85A30" strokeWidth={1.5} />
                {/* Charge dots on positive plate */}
                {Array.from({ length: nDots }, (_, i) => (
                    <text key={i}
                        x={PLATE_X1 + PLATE_W / 2}
                        y={PLATE_Y1 + 10 + i * ((PLATE_Y2 - PLATE_Y1 - 20) / Math.max(nDots - 1, 1))}
                        textAnchor="middle"
                        style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>+</text>
                ))}
                <text x={PLATE_X1 + PLATE_W / 2} y={PLATE_Y1 - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>+V</text>

                {/* Right plate (negative) */}
                <rect x={PLATE_X2 - PLATE_W} y={PLATE_Y1} width={PLATE_W} height={PLATE_Y2 - PLATE_Y1}
                    rx={3} fill="rgba(55,138,221,0.25)" stroke="#378ADD" strokeWidth={1.5} />
                {Array.from({ length: nDots }, (_, i) => (
                    <text key={i}
                        x={PLATE_X2 - PLATE_W / 2}
                        y={PLATE_Y1 + 10 + i * ((PLATE_Y2 - PLATE_Y1 - 20) / Math.max(nDots - 1, 1))}
                        textAnchor="middle"
                        style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>−</text>
                ))}
                <text x={PLATE_X2 - PLATE_W / 2} y={PLATE_Y1 - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#378ADD', fontFamily: 'var(--mono)' }}>−V</text>

                {/* E-field lines */}
                {Array.from({ length: nLines }, (_, i) => {
                    const ly = PLATE_Y1 + lineSpacing * (i + 1)
                    return (
                        <line key={i}
                            x1={PLATE_X1 + PLATE_W + 4} y1={ly}
                            x2={PLATE_X2 - PLATE_W - 4} y2={ly}
                            stroke={fieldColor} strokeWidth={1.5}
                            opacity={0.7} markerEnd="url(#cap_e)" />
                    )
                })}

                {/* E field label */}
                <text x={(PLATE_X1 + PLATE_X2) / 2} y={H - 12} textAnchor="middle"
                    style={{ fontSize: 10, fill: fieldColor, fontFamily: 'var(--mono)' }}>
                    E = {E_field > 1e6 ? `${(E_field / 1e6).toFixed(2)}MV/m` : E_field > 1e3 ? `${(E_field / 1e3).toFixed(1)}kV/m` : `${E_field.toFixed(0)}V/m`}
                </text>

                {/* Voltage arrow */}
                <defs>
                    <marker id="cap_v" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.5)"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>
                <line x1={PLATE_X1 + PLATE_W} y1={PLATE_Y2 + 20}
                    x2={PLATE_X2 - PLATE_W} y2={PLATE_Y2 + 20}
                    stroke="rgba(239,159,39,0.4)" strokeWidth={1}
                    markerEnd="url(#cap_v)" />
                <text x={(PLATE_X1 + PLATE_X2) / 2} y={PLATE_Y2 + 35} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    V = {V} V
                </text>

                {/* Energy bar (mode = energy) */}
                {mode === 'energy' && (() => {
                    const barH = Math.min(100, U * 1e8)
                    const barX = W - 50
                    const barY0 = PLATE_Y2
                    return (
                        <g>
                            <rect x={barX} y={barY0 - barH} width={20} height={barH}
                                rx={3} fill="rgba(29,158,117,0.4)" stroke="#1D9E75" strokeWidth={1} />
                            <text x={barX + 10} y={barY0 - barH - 6} textAnchor="middle"
                                style={{ fontSize: 8, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>U</text>
                            <text x={barX + 10} y={barY0 + 12} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                                {U < 1e-6 ? `${(U * 1e9).toFixed(2)}nJ` : U < 1e-3 ? `${(U * 1e6).toFixed(2)}μJ` : `${(U * 1e3).toFixed(2)}mJ`}
                            </text>
                        </g>
                    )
                })()}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Capacitance C', val: C < 1e-9 ? `${(C * 1e12).toFixed(3)} pF` : `${(C * 1e9).toFixed(3)} nF`, color: 'var(--amber)' },
                    { label: 'Charge Q = CV', val: Q < 1e-6 ? `${(Q * 1e9).toFixed(4)} nC` : `${(Q * 1e6).toFixed(4)} μC`, color: 'var(--coral)' },
                    { label: 'Energy U = ½CV²', val: U < 1e-6 ? `${(U * 1e9).toFixed(3)} nJ` : U < 1e-3 ? `${(U * 1e6).toFixed(3)} μJ` : `${(U * 1e3).toFixed(3)} mJ`, color: 'var(--teal)' },
                    { label: 'κ multiplier', val: `C × ${kappa}`, color: 'var(--text2)' },
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