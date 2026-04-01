import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const R = 8.314   // J/mol·K
const W = 440, H = 200
const PAD = { l: 48, r: 16, t: 16, b: 32 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

const LAWS = [
    { key: 'boyle', label: "Boyle's", locked: 'T', formula: 'PV = const  (T fixed)', color: '#1D9E75' },
    { key: 'charles', label: "Charles'", locked: 'P', formula: 'V/T = const  (P fixed)', color: '#EF9F27' },
    { key: 'gaylussac', label: "Gay-Lussac's", locked: 'V', formula: 'P/T = const  (V fixed)', color: '#D85A30' },
]

export default function IdealGasLaws() {
    const [law, setLaw] = useState('boyle')
    const [n, setN] = useState(1)      // moles
    const [T, setT] = useState(300)    // K
    const [P, setP] = useState(101325) // Pa
    const [V, setV] = useState(0.0245) // m³

    const active = LAWS.find(l => l.key === law)

    // Derived from PV=nRT
    const computeV = (p, t) => (n * R * t) / p
    const computeP = (v, t) => (n * R * t) / v
    const computeT = (p, v) => (p * v) / (n * R)

    // Current third variable
    const derivedV = computeV(P, T)
    const derivedP = computeP(V, T)
    const derivedT = computeT(P, V)

    const displayP = law === 'charles' ? P : law === 'boyle' ? P : derivedP
    const displayV = law === 'gaylussac' ? V : law === 'boyle' ? derivedV : V
    const displayT = law === 'gaylussac' ? derivedT : T

    // Curve points
    const curvePoints = useMemo(() => {
        const pts = []
        if (law === 'boyle') {
            // P vs V at const T: PV = nRT
            const PV = n * R * T
            for (let i = 1; i <= 60; i++) {
                const Vi = (i / 60) * 0.08
                const Pi = PV / Vi
                if (Pi < 600000) pts.push([Vi, Pi])
            }
        } else if (law === 'charles') {
            // V vs T at const P
            for (let i = 1; i <= 60; i++) {
                const Ti = 100 + (i / 60) * 600
                const Vi = (n * R * Ti) / P
                pts.push([Ti, Vi])
            }
        } else {
            // P vs T at const V
            for (let i = 1; i <= 60; i++) {
                const Ti = 100 + (i / 60) * 600
                const Pi = (n * R * Ti) / V
                pts.push([Ti, Pi])
            }
        }
        return pts
    }, [law, n, T, P, V])

    const xs = curvePoints.map(p => p[0])
    const ys = curvePoints.map(p => p[1])
    const xMin = Math.min(...xs), xMax = Math.max(...xs)
    const yMin = Math.min(...ys), yMax = Math.max(...ys)

    const toSX = x => PAD.l + ((x - xMin) / (xMax - xMin || 1)) * PW
    const toSY = y => PAD.t + PH - ((y - yMin) / (yMax - yMin || 1)) * PH

    const pathD = curvePoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSX(p[0]).toFixed(1)},${toSY(p[1]).toFixed(1)}`
    ).join(' ')

    // Current point on curve
    const curX = law === 'boyle' ? derivedV
        : law === 'charles' ? T
            : T
    const curY = law === 'boyle' ? P
        : law === 'charles' ? derivedV
            : derivedP
    const cpX = toSX(curX), cpY = toSY(curY)

    const xLabel = law === 'boyle' ? 'Volume (m³)' : 'Temperature (K)'
    const yLabel = law === 'charles' ? 'V (m³)' : 'P (Pa)'

    return (
        <div>
            {/* Law selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {LAWS.map(l => (
                    <button key={l.key} onClick={() => setLaw(l.key)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: law === l.key ? l.color : 'var(--bg3)',
                        color: law === l.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{l.label}</button>
                ))}
            </div>

            {/* Formula */}
            <div style={{
                background: 'var(--bg3)', border: `1px solid ${active.color}33`,
                borderRadius: 8, padding: '8px 16px', marginBottom: 14,
                fontFamily: 'var(--mono)', fontSize: 13, color: active.color,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
                <span>{active.formula}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)' }}>
                    {active.locked} is locked constant
                </span>
            </div>

            {/* Sliders — only show free variables */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Moles n" unit=" mol" value={n} min={0.1} max={5} step={0.1} onChange={setN} />
                {law !== 'gaylussac' && (
                    <SimSlider label="Temperature T" unit=" K" value={T} min={100} max={700} step={5} onChange={setT} />
                )}
                {law === 'charles' && (
                    <SimSlider label="Pressure P" unit=" kPa" value={P / 1000} min={50} max={500} step={5} onChange={v => setP(v * 1000)} />
                )}
                {(law === 'gaylussac') && (
                    <SimSlider label="Volume V" unit=" L" value={V * 1000} min={1} max={100} step={1} onChange={v => setV(v / 1000)} />
                )}
                {law === 'gaylussac' && (
                    <SimSlider label="Temperature T" unit=" K" value={T} min={100} max={700} step={5} onChange={setT} />
                )}
            </div>

            {/* Curve */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Curve */}
                <path d={pathD} fill="none" stroke={active.color} strokeWidth={2} />
                {/* Area under */}
                <path d={`${pathD} L${toSX(xMax)},${PAD.t + PH} L${toSX(xMin)},${PAD.t + PH} Z`}
                    fill={active.color} opacity={0.06} />
                {/* Current point */}
                <circle cx={cpX} cy={cpY} r={6}
                    fill={active.color} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                {/* Dashed lines to axes */}
                <line x1={cpX} y1={cpY} x2={cpX} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 3" />
                <line x1={PAD.l} y1={cpY} x2={cpX} y2={cpY}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 3" />
                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={W - PAD.r} y={PAD.t + PH + 14}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>{xLabel}</text>
                <text x={PAD.l - 6} y={PAD.t + PH / 2} textAnchor="middle"
                    transform={`rotate(-90,${PAD.l - 6},${PAD.t + PH / 2})`}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>{yLabel}</text>
                {/* Axis tick values */}
                <text x={toSX(xMin)} y={PAD.t + PH + 14} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                    {xMin.toFixed(3)}
                </text>
                <text x={toSX(xMax)} y={PAD.t + PH + 14} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                    {xMax.toFixed(3)}
                </text>
            </svg>

            {/* PVT readout */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Pressure P', val: `${(displayP / 1000).toFixed(2)} kPa`, color: '#D85A30' },
                    { label: 'Volume V', val: `${(displayV * 1000).toFixed(3)} L`, color: '#1D9E75' },
                    { label: 'Temperature T', val: `${displayT.toFixed(1)} K`, color: '#EF9F27' },
                    { label: 'PV/nRT', val: (displayP * displayV / (n * R * displayT)).toFixed(4), color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: `1px solid ${c.color}22`, flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                PV/nRT = {(displayP * displayV / (n * R * displayT)).toFixed(4)} ≈ 1.0000 confirms ideal gas behaviour
            </div>
        </div>
    )
}