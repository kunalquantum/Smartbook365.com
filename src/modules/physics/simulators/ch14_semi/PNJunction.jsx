import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const JX = W / 2      // junction centre x
const MAT_Y = 80, MAT_H = 100
const VT = 0.026      // thermal voltage 26mV at 300K
const I0 = 1e-12      // reverse saturation current

export default function PNJunction() {
    const [V, setV] = useState(0)       // bias voltage
    const [mode, setMode] = useState('junction') // junction | iv

    // Physics
    const I = I0 * (Math.exp(V / VT) - 1)
    const deplWidth = Math.max(4, 60 / (1 + Math.abs(V) * 2)) * (V < 0 ? 1 + Math.abs(V) * 0.5 : 1)
    const builtinV = 0.6    // Si built-in voltage
    const forwardBias = V > 0.1
    const reverseBias = V < -0.1
    const breakdown = V < -5
    const conducting = V > 0.5

    // I-V curve
    const ivPoints = useMemo(() => {
        const pts = []
        for (let v = -6; v <= 1; v += 0.05) {
            const i = I0 * (Math.exp(v / VT) - 1)
            pts.push({ v, i: Math.max(-5e-9, Math.min(1e-3, i)) })
        }
        return pts
    }, [])

    // Scale for I-V graph
    const GX = 30, GY = 30, GW = W - 60, GH = H - 60
    const V_MIN = -6, V_MAX = 1
    const I_MIN = -5e-9, I_MAX = 1e-3

    const toGX = v => GX + ((v - V_MIN) / (V_MAX - V_MIN)) * GW
    const toGY = i => GY + GH - ((Math.log10(Math.max(Math.abs(i), 1e-15)) - Math.log10(Math.abs(I_MIN))) /
        (Math.log10(I_MAX) - Math.log10(Math.abs(I_MIN)))) * GH

    // Junction SVG
    const P_W = JX - 20, N_W = W - JX - 20
    const depL = Math.min(deplWidth, P_W - 10)
    const depR = Math.min(deplWidth, N_W - 10)

    const nCarriers = Math.min(12, Math.round(Math.max(0, (V - 0.3) / 0.1) * 3))
    const nHoles = nCarriers

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
                {['junction', 'iv'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'junction' ? 'Junction view' : 'I-V curve'}</button>
                ))}
            </div>

            <SimSlider label="Bias voltage V" unit=" V" value={V} min={-6} max={0.8} step={0.05} onChange={setV} />

            {/* Bias type badge */}
            <div style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                marginBottom: 14, fontSize: 11, fontFamily: 'var(--mono)',
                background: breakdown ? 'rgba(216,90,48,0.15)' : conducting ? 'rgba(29,158,117,0.15)' : forwardBias ? 'rgba(239,159,39,0.15)' : reverseBias ? 'rgba(55,138,221,0.15)' : 'rgba(160,176,200,0.1)',
                color: breakdown ? '#D85A30' : conducting ? '#1D9E75' : forwardBias ? '#EF9F27' : reverseBias ? '#378ADD' : 'rgba(160,176,200,0.5)',
                border: `1px solid ${breakdown ? 'rgba(216,90,48,0.3)' : conducting ? 'rgba(29,158,117,0.3)' : forwardBias ? 'rgba(239,159,39,0.3)' : reverseBias ? 'rgba(55,138,221,0.3)' : 'rgba(160,176,200,0.15)'}`,
            }}>
                {breakdown ? '⚡ Breakdown (avalanche/Zener)'
                    : conducting ? '✓ Forward conducting'
                        : forwardBias ? '→ Forward bias (depletion shrinking)'
                            : reverseBias ? '← Reverse bias (depletion widening)'
                                : 'Equilibrium (no bias)'}
            </div>

            {mode === 'junction' ? (
                <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                    style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                    <defs>
                        {arrowDef('pn1', '#EF9F27')}
                        {arrowDef('pn2', 'rgba(160,176,200,0.5)')}
                    </defs>

                    {/* P region */}
                    <rect x={20} y={MAT_Y} width={JX - 20} height={MAT_H}
                        rx={4} fill="rgba(55,138,221,0.1)"
                        stroke="rgba(55,138,221,0.3)" strokeWidth={1} />
                    <text x={JX / 2} y={MAT_Y - 8} textAnchor="middle"
                        style={{ fontSize: 11, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)', fontWeight: 600 }}>p-type</text>
                    <text x={JX / 2} y={MAT_Y + MAT_H + 16} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>
                        majority: holes (+)
                    </text>

                    {/* N region */}
                    <rect x={JX} y={MAT_Y} width={W - JX - 20} height={MAT_H}
                        rx={4} fill="rgba(216,90,48,0.1)"
                        stroke="rgba(216,90,48,0.3)" strokeWidth={1} />
                    <text x={JX + (W - JX - 20) / 2} y={MAT_Y - 8} textAnchor="middle"
                        style={{ fontSize: 11, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)', fontWeight: 600 }}>n-type</text>
                    <text x={JX + (W - JX - 20) / 2} y={MAT_Y + MAT_H + 16} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(216,90,48,0.5)', fontFamily: 'var(--mono)' }}>
                        majority: electrons (−)
                    </text>

                    {/* Depletion region */}
                    <rect x={JX - depL} y={MAT_Y + 2}
                        width={depL + depR} height={MAT_H - 4}
                        rx={2}
                        fill={`rgba(127,119,221,${0.15 + Math.abs(V) * 0.05})`}
                        stroke="rgba(127,119,221,0.4)" strokeWidth={1} strokeDasharray="4 3" />
                    <text x={JX} y={MAT_Y + MAT_H / 2 + 4} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(127,119,221,0.7)', fontFamily: 'var(--mono)' }}>
                        depletion
                    </text>
                    <text x={JX} y={MAT_Y + MAT_H / 2 + 16} textAnchor="middle"
                        style={{ fontSize: 8, fill: 'rgba(127,119,221,0.5)', fontFamily: 'var(--mono)' }}>
                        {(deplWidth * 0.1).toFixed(2)} μm
                    </text>

                    {/* Fixed ions in depletion region */}
                    {Array.from({ length: 4 }, (_, i) => {
                        const x = JX - depL + 8 + i * (depL / 4)
                        return (
                            <text key={i} x={x} y={MAT_Y + 24}
                                style={{ fontSize: 10, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>−</text>
                        )
                    })}
                    {Array.from({ length: 4 }, (_, i) => {
                        const x = JX + 8 + i * (depR / 4)
                        return (
                            <text key={i} x={x} y={MAT_Y + 24}
                                style={{ fontSize: 10, fill: 'rgba(216,90,48,0.5)', fontFamily: 'var(--mono)' }}>+</text>
                        )
                    })}

                    {/* Built-in E field arrow */}
                    <defs>
                        <marker id="Efield" viewBox="0 0 10 10" refX={8} refY={5}
                            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                            <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(127,119,221,0.6)"
                                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                    </defs>
                    <line x1={JX + 10} y1={MAT_Y + MAT_H - 20}
                        x2={JX - 10} y2={MAT_Y + MAT_H - 20}
                        stroke="rgba(127,119,221,0.5)" strokeWidth={1.5}
                        markerEnd="url(#Efield)" />
                    <text x={JX} y={MAT_Y + MAT_H - 6} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(127,119,221,0.5)', fontFamily: 'var(--mono)' }}>E_builtin</text>

                    {/* Moving carriers (forward bias) */}
                    {conducting && Array.from({ length: nCarriers }, (_, i) => {
                        const cx = JX - 60 + (i % 4) * 24
                        const cy = MAT_Y + 30 + Math.floor(i / 4) * 20
                        return (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r={5}
                                    fill="rgba(55,138,221,0.7)" />
                                <text x={cx} y={cy + 3.5} textAnchor="middle"
                                    style={{ fontSize: 8, fill: '#fff', fontFamily: 'var(--mono)' }}>+</text>
                            </g>
                        )
                    })}
                    {conducting && Array.from({ length: nCarriers }, (_, i) => {
                        const cx = JX + 20 + (i % 4) * 24
                        const cy = MAT_Y + 30 + Math.floor(i / 4) * 20
                        return (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r={5}
                                    fill="rgba(216,90,48,0.7)" />
                                <text x={cx} y={cy + 3.5} textAnchor="middle"
                                    style={{ fontSize: 8, fill: '#fff', fontFamily: 'var(--mono)' }}>−</text>
                            </g>
                        )
                    })}

                    {/* Current arrow */}
                    {conducting && (
                        <line x1={80} y1={MAT_Y - 28} x2={W - 80} y2={MAT_Y - 28}
                            stroke="#EF9F27" strokeWidth={2} markerEnd="url(#pn1)" />
                    )}
                    {conducting && (
                        <text x={W / 2} y={MAT_Y - 32} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            I = {I > 1e-3 ? `${(I * 1000).toFixed(2)} mA` : `${(I * 1e6).toFixed(3)} μA`}
                        </text>
                    )}

                    {/* Energy diagram below */}
                    {(() => {
                        const EY = MAT_Y + MAT_H + 36
                        const EH = 40
                        const tilt = Math.max(-20, Math.min(20, -V * 14))
                        return (
                            <g>
                                <text x={20} y={EY - 4}
                                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                    Energy bands
                                </text>
                                {/* P side bands */}
                                <line x1={20} y1={EY} x2={JX - depL} y2={EY}
                                    stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                                <line x1={20} y1={EY + EH} x2={JX - depL} y2={EY + EH}
                                    stroke="rgba(55,138,221,0.4)" strokeWidth={1.5} />
                                {/* Tilt through depletion */}
                                <line x1={JX - depL} y1={EY}
                                    x2={JX + depR} y2={EY + tilt}
                                    stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                                <line x1={JX - depL} y1={EY + EH}
                                    x2={JX + depR} y2={EY + EH + tilt}
                                    stroke="rgba(55,138,221,0.4)" strokeWidth={1.5} />
                                {/* N side bands */}
                                <line x1={JX + depR} y1={EY + tilt}
                                    x2={W - 20} y2={EY + tilt}
                                    stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                                <line x1={JX + depR} y1={EY + EH + tilt}
                                    x2={W - 20} y2={EY + EH + tilt}
                                    stroke="rgba(55,138,221,0.4)" strokeWidth={1.5} />
                                {/* Fermi level */}
                                <line x1={20} y1={EY + EH * 0.6}
                                    x2={W - 20} y2={EY + EH * 0.6 + (forwardBias ? V * 10 : 0)}
                                    stroke="rgba(239,159,39,0.5)" strokeWidth={1} strokeDasharray="5 3" />
                            </g>
                        )
                    })()}
                </svg>
            ) : (
                /* I-V CURVE */
                <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                    style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                    {/* Grid */}
                    <line x1={GX} y1={GY} x2={GX} y2={GY + GH}
                        stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                    <line x1={GX} y1={GY + GH} x2={GX + GW} y2={GY + GH}
                        stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />

                    {/* Zero voltage line */}
                    {(() => {
                        const zx = toGX(0)
                        return (
                            <line x1={zx} y1={GY} x2={zx} y2={GY + GH}
                                stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 3" />
                        )
                    })()}

                    {/* I-V curve (log scale for I) */}
                    {ivPoints.map((pt, i) => {
                        if (i === 0) return null
                        const prev = ivPoints[i - 1]
                        if (pt.i <= 0 || prev.i <= 0) return null
                        const x1 = toGX(prev.v), y1 = toGY(prev.i)
                        const x2 = toGX(pt.v), y2 = toGY(pt.i)
                        if (!isFinite(y1) || !isFinite(y2)) return null
                        return (
                            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                stroke="#EF9F27" strokeWidth={1.8} />
                        )
                    })}

                    {/* Breakdown region */}
                    <rect x={GX} y={GY} width={toGX(-5) - GX} height={GH}
                        fill="rgba(216,90,48,0.05)" />
                    <text x={(GX + toGX(-5)) / 2} y={GY + 14} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(216,90,48,0.4)', fontFamily: 'var(--mono)' }}>
                        reverse (breakdown at −5V)
                    </text>

                    {/* Forward conducting region */}
                    <rect x={toGX(0.5)} y={GY} width={GX + GW - toGX(0.5)} height={GH}
                        fill="rgba(29,158,117,0.05)" />
                    <text x={(toGX(0.5) + GX + GW) / 2} y={GY + 14} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(29,158,117,0.4)', fontFamily: 'var(--mono)' }}>
                        forward conducting
                    </text>

                    {/* Current operating point */}
                    {I > 0 && isFinite(toGY(I)) && (
                        <circle cx={toGX(V)} cy={toGY(I)} r={6}
                            fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                    )}

                    {/* Threshold voltage marker */}
                    <line x1={toGX(0.6)} y1={GY} x2={toGX(0.6)} y2={GY + GH}
                        stroke="rgba(29,158,117,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                    <text x={toGX(0.6)} y={GY + GH + 14} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>0.6V</text>

                    {/* Axis labels */}
                    <text x={GX + GW} y={GY + GH + 14}
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>V (volts)</text>
                    <text x={GX - 4} y={GY + 8} textAnchor="end"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>I (log)</text>

                    {/* V tick labels */}
                    {[-5, -4, -3, -2, -1, 0, 0.5, 1].map(v => (
                        <text key={v} x={toGX(v)} y={GY + GH + 14} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>{v}</text>
                    ))}
                </svg>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Bias V', val: `${V.toFixed(2)} V`, color: 'var(--amber)' },
                    { label: 'Current I', val: Math.abs(I) < 1e-9 ? `${(I * 1e12).toFixed(2)} pA` : Math.abs(I) < 1e-6 ? `${(I * 1e9).toFixed(2)} nA` : Math.abs(I) < 1e-3 ? `${(I * 1e6).toFixed(2)} μA` : `${(I * 1000).toFixed(3)} mA`, color: conducting ? 'var(--teal)' : reverseBias ? 'var(--coral)' : 'var(--text2)' },
                    { label: 'Depletion width', val: `${(deplWidth * 0.1).toFixed(2)} μm`, color: '#7F77DD' },
                    { label: 'I = I₀(e^V/Vt−1)', val: `I₀=1pA, Vt=26mV`, color: 'var(--text3)' },
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