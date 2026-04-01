import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 240
const PAD = { l: 52, r: 20, t: 20, b: 36 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

const MATERIALS = {
    'Copper': { rho0: 1.68e-8, alpha: 3.9e-3, color: '#EF9F27', type: 'metal' },
    'Aluminum': { rho0: 2.65e-8, alpha: 4.3e-3, color: '#378ADD', type: 'metal' },
    'Tungsten': { rho0: 5.60e-8, alpha: 4.5e-3, color: '#D85A30', type: 'metal' },
    'Nichrome': { rho0: 1.00e-6, alpha: 0.4e-3, color: '#7F77DD', type: 'metal' },
    'Silicon': { rho0: 6.40e2, alpha: -70e-3, color: '#1D9E75', type: 'semi' },
    'Carbon': { rho0: 3.50e-5, alpha: -0.5e-3, color: '#888780', type: 'semi' },
}

export default function OhmsLaw() {
    const [mat, setMat] = useState('Copper')
    const [L, setL] = useState(1.0)    // m
    const [A, setA] = useState(1.0)    // mm²
    const [T, setT] = useState(20)     // °C
    const [V, setV] = useState(5)      // Volts

    const m = MATERIALS[mat]
    const rhoT = m.rho0 * (1 + m.alpha * (T - 20))
    const R = (rhoT * L) / (A * 1e-6)
    const I = V / R
    const P = V * I

    // I-V curve points (0 to 2V)
    const maxV_plot = 20
    const ivPoints = useMemo(() => Array.from({ length: 60 }, (_, i) => {
        const vi = (i / 59) * maxV_plot
        return [vi, vi / R]
    }), [R])

    const maxI = maxV_plot / R
    const toSX = v => PAD.l + (v / maxV_plot) * PW
    const toSY = i => PAD.t + PH - (i / maxI) * PH

    const pathD = ivPoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSX(p[0]).toFixed(1)},${toSY(p[1]).toFixed(1)}`
    ).join(' ')

    const cpX = toSX(V), cpY = toSY(I)

    return (
        <div>
            {/* Material selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MATERIALS).map(k => (
                    <button key={k} onClick={() => setMat(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mat === k ? MATERIALS[k].color : 'var(--bg3)',
                        color: mat === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mat === k ? MATERIALS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <SimSlider label="Length L" unit=" m" value={L} min={0.1} max={10} step={0.1} onChange={setL} />
                <SimSlider label="Area A" unit=" mm²" value={A} min={0.1} max={10} step={0.1} onChange={setA} />
                <SimSlider label="Temperature T" unit=" °C" value={T} min={-50} max={500} step={5} onChange={setT} />
                <SimSlider label="Voltage V" unit=" V" value={V} min={0} max={20} step={0.5} onChange={setV} />
            </div>

            {/* Resistivity change note */}
            <div style={{
                fontSize: 11, fontFamily: 'var(--mono)',
                color: m.type === 'semi' ? 'var(--teal)' : 'var(--text3)',
                marginBottom: 12,
            }}>
                {m.type === 'semi'
                    ? `↓ Semiconductor: ρ decreases with T (α = ${(m.alpha * 1000).toFixed(1)}×10⁻³)`
                    : `↑ Metal: ρ increases with T (α = ${(m.alpha * 1000).toFixed(2)}×10⁻³)`}
            </div>

            {/* I-V graph */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Area under */}
                <path d={`${pathD} L${toSX(maxV_plot)},${PAD.t + PH} L${PAD.l},${PAD.t + PH} Z`}
                    fill={m.color} opacity={0.07} />

                {/* I-V line */}
                <path d={pathD} fill="none" stroke={m.color} strokeWidth={2.5} />

                {/* Current point */}
                <circle cx={cpX} cy={cpY} r={7}
                    fill={m.color} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* Dashed to axes */}
                <line x1={cpX} y1={cpY} x2={cpX} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                <line x1={PAD.l} y1={cpY} x2={cpX} y2={cpY}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />

                {/* Slope = 1/R label */}
                <text x={cpX + 10} y={cpY - 8}
                    style={{ fontSize: 10, fill: m.color, fontFamily: 'var(--mono)' }}>
                    ({V}V, {I < 1 ? (I * 1000).toFixed(2) + 'mA' : I.toFixed(4) + 'A'})
                </text>

                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={W - PAD.r} y={PAD.t + PH + 16}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>V (volts)</text>
                <text x={PAD.l - 8} y={PAD.t + PH / 2} textAnchor="middle"
                    transform={`rotate(-90,${PAD.l - 8},${PAD.t + PH / 2})`}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>I (A)</text>

                {/* Slope label */}
                <text x={PAD.l + PW * 0.5} y={PAD.t + PH * 0.3}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    slope = 1/R = {(1 / R).toExponential(2)} A/V
                </text>

                {/* Tick values */}
                {[0, 5, 10, 15, 20].map(v => (
                    <text key={v} x={toSX(v)} y={PAD.t + PH + 14} textAnchor="middle"
                        style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>{v}</text>
                ))}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Resistivity ρ(T)', val: rhoT < 1e-5 ? `${(rhoT * 1e8).toFixed(2)}×10⁻⁸ Ωm` : `${rhoT.toExponential(2)} Ωm`, color: m.color },
                    { label: 'Resistance R', val: R < 0.001 ? `${(R * 1e6).toFixed(2)} μΩ` : R < 1 ? `${(R * 1000).toFixed(3)} mΩ` : `${R.toFixed(4)} Ω`, color: 'var(--amber)' },
                    { label: 'Current I = V/R', val: I < 0.001 ? `${(I * 1e6).toFixed(2)} μA` : I < 1 ? `${(I * 1000).toFixed(2)} mA` : `${I.toFixed(4)} A`, color: 'var(--teal)' },
                    { label: 'Power P = VI', val: P < 0.001 ? `${(P * 1000).toFixed(4)} mW` : `${P.toFixed(4)} W`, color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}