import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 220
const G = 6.674e-11
const CY = H / 2

export default function GravitationalForce() {
    const [m1, setM1] = useState(5.97e24)  // Earth mass default
    const [m2, setM2] = useState(7.34e22)  // Moon mass default
    const [dist, setDist] = useState(8)      // display units (×10⁸ m)

    const r = dist * 1e8
    const F = (G * m1 * m2) / (r * r)

    // Field line intensity — more lines = stronger field
    const fieldLines = Math.max(3, Math.round(12 / (dist * dist / 4)))

    // SVG positions
    const x1 = 80, x2 = W - 80
    const gap = x2 - x1

    // Force arrow lengths — scale to max 60px
    const Fmax = (G * m1 * m2) / (1e8 * 1e8)
    const arrowLen = Math.min(60, (F / Fmax) * 60)

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    const M1_DISPLAY = m1 >= 1e24
        ? `${(m1 / 1e24).toFixed(2)}×10²⁴`
        : `${(m1 / 1e22).toFixed(1)}×10²²`
    const M2_DISPLAY = m2 >= 1e24
        ? `${(m2 / 1e24).toFixed(2)}×10²⁴`
        : `${(m2 / 1e22).toFixed(1)}×10²²`

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Mass 1 (×10²² kg)" unit="" value={m1 / 1e22} min={1} max={700} step={1}
                    onChange={v => setM1(v * 1e22)} />
                <SimSlider label="Mass 2 (×10²² kg)" unit="" value={m2 / 1e22} min={1} max={700} step={1}
                    onChange={v => setM2(v * 1e22)} />
                <SimSlider label="Distance (×10⁸ m)" unit="" value={dist} min={1} max={20} step={0.5}
                    onChange={setDist} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                <defs>
                    {arrowDef('gf1', '#EF9F27')}
                    {arrowDef('gf2', '#EF9F27')}
                    {arrowDef('gfl', 'rgba(55,138,221,0.5)')}
                </defs>

                {/* Field lines between masses */}
                {Array.from({ length: fieldLines }, (_, i) => {
                    const offset = ((i - (fieldLines - 1) / 2) / Math.max(fieldLines - 1, 1)) * 40
                    const y = CY + offset
                    return (
                        <line key={i}
                            x1={x1 + 22} y1={y} x2={x2 - 22} y2={y}
                            stroke={`rgba(55,138,221,${0.06 + 0.04 * fieldLines})`}
                            strokeWidth={0.8}
                            strokeDasharray="4 4"
                        />
                    )
                })}

                {/* Distance line */}
                <line x1={x1} y1={CY + 50} x2={x2} y2={CY + 50}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                <text x={(x1 + x2) / 2} y={CY + 64} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    r = {dist}×10⁸ m
                </text>

                {/* Force arrows pointing inward */}
                <line x1={x1 + 22} y1={CY} x2={x1 + 22 + arrowLen} y2={CY}
                    stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#gf1)" />
                <line x1={x2 - 22} y1={CY} x2={x2 - 22 - arrowLen} y2={CY}
                    stroke="#EF9F27" strokeWidth={2.5} markerEnd="url(#gf2)" />

                {/* Mass 1 */}
                <circle cx={x1} cy={CY} r={22}
                    fill="#112236" stroke="rgba(55,138,221,0.6)" strokeWidth={1.5} />
                <text x={x1} y={CY - 4} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#378ADD', fontFamily: 'var(--mono)', fontWeight: 600 }}>M₁</text>
                <text x={x1} y={CY + 8} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.6)', fontFamily: 'var(--mono)' }}>
                    {M1_DISPLAY}
                </text>

                {/* Mass 2 */}
                <circle cx={x2} cy={CY} r={22}
                    fill="#112236" stroke="rgba(216,90,48,0.6)" strokeWidth={1.5} />
                <text x={x2} y={CY - 4} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 600 }}>M₂</text>
                <text x={x2} y={CY + 8} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.6)', fontFamily: 'var(--mono)' }}>
                    {M2_DISPLAY}
                </text>

                {/* F labels on arrows */}
                <text x={x1 + 22 + arrowLen / 2} y={CY - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>F</text>
                <text x={x2 - 22 - arrowLen / 2} y={CY - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>F</text>

                {/* Inverse square note */}
                <text x={W / 2} y={H - 8} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    F ∝ 1/r² — double distance → force ÷ 4
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Gravitational Force F', val: F >= 1e20 ? `${(F / 1e20).toFixed(2)}×10²⁰ N` : F >= 1e15 ? `${(F / 1e15).toFixed(2)}×10¹⁵ N` : `${F.toExponential(3)} N`, color: 'var(--amber)' },
                    { label: 'At 2× distance', val: F >= 1e20 ? `${(F / 4 / 1e20).toFixed(2)}×10²⁰ N` : `${(F / 4).toExponential(3)} N`, color: 'var(--text3)' },
                    { label: 'At 3× distance', val: F >= 1e20 ? `${(F / 9 / 1e20).toFixed(2)}×10²⁰ N` : `${(F / 9).toExponential(3)} N`, color: 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)', flex: 1, minWidth: 120,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}