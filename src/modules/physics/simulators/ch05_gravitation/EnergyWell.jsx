import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 280
const G = 6.674e-11
const M = 5.972e24
const m = 1000          // 1 tonne object

const PAD = { l: 56, r: 16, t: 16, b: 36 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

const R_EARTH = 6.371    // Mm (megametres for display)
const R_MIN = R_EARTH
const R_MAX = 60       // Mm

export default function EnergyWell() {
    const [rMm, setRMm] = useState(10)   // distance in megametres

    const r = rMm * 1e6
    const RE = R_EARTH * 1e6

    const U = -(G * M * m) / r           // PE (negative)
    const v0 = Math.sqrt(G * M / r)        // orbital speed
    const KE = 0.5 * m * v0 * v0          // KE in orbit = GMm/2r
    const E_tot = U + KE                      // total = -GMm/2r

    const U_surface = -(G * M * m) / RE
    const U_inf = 0

    // Build well curve
    const N = 100
    const curvePoints = Array.from({ length: N }, (_, i) => {
        const ri = R_MIN + (i / (N - 1)) * (R_MAX - R_MIN)  // Mm
        const rSI = ri * 1e6
        const u = -(G * M * m) / rSI
        return { r: ri, u }
    })

    const uMin = -(G * M * m) / RE
    const uMax = 0
    const uRange = uMax - uMin

    const toSX = r => PAD.l + ((r - R_MIN) / (R_MAX - R_MIN)) * PW
    const toSY = u => PAD.t + PH - ((u - uMin) / uRange) * PH

    const pathD = curvePoints.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSX(p.r).toFixed(1)},${toSY(p.u).toFixed(1)}`
    ).join(' ')

    // Current point
    const cpX = toSX(rMm)
    const cpY = toSY(U / 1e9 < uMin / 1e9 ? uMin : U)   // clamp

    // Zero line
    const zeroY = toSY(0)

    // KE bar
    const KE_scaled = (KE / Math.abs(uMin)) * PH * 0.6
    const PE_scaled = (Math.abs(U) / Math.abs(uMin)) * PH * 0.6

    return (
        <div>
            <SimSlider label="Distance from Earth centre" unit=" Mm" value={rMm} min={R_EARTH + 0.2} max={R_MAX} step={0.2} onChange={setRMm} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {/* Zero energy line */}
                <line x1={PAD.l} y1={zeroY} x2={W - PAD.r} y2={zeroY}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="4 3" />
                <text x={PAD.l - 4} y={zeroY + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>0</text>

                {/* Area under curve fill */}
                <path d={`${pathD} L${toSX(R_MAX)},${zeroY} L${toSX(R_MIN)},${zeroY} Z`}
                    fill="rgba(55,138,221,0.06)" />

                {/* Potential well curve */}
                <path d={pathD} fill="none" stroke="#378ADD" strokeWidth={2} />

                {/* Earth surface line */}
                <line x1={toSX(R_EARTH)} y1={PAD.t} x2={toSX(R_EARTH)} y2={PAD.t + PH}
                    stroke="rgba(29,158,117,0.4)" strokeWidth={1} strokeDasharray="3 3" />
                <text x={toSX(R_EARTH) + 4} y={PAD.t + 12}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>surface</text>

                {/* Current position vertical */}
                <line x1={cpX} y1={zeroY} x2={cpX} y2={cpY}
                    stroke="rgba(239,159,39,0.3)" strokeWidth={1} strokeDasharray="3 3" />

                {/* Current point */}
                <circle cx={cpX} cy={cpY} r={6}
                    fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />

                {/* U label at point */}
                <text x={cpX + 10} y={cpY - 6}
                    style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                    U={U >= -1e12 ? `${(U / 1e9).toFixed(2)}GJ` : `${(U / 1e12).toFixed(3)}TJ`}
                </text>

                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />

                {/* Axis labels */}
                <text x={W - PAD.r} y={PAD.t + PH + 14}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>r (Mm)</text>

                {/* X tick labels */}
                {[10, 20, 30, 40, 50, 60].map(v => (
                    <text key={v} x={toSX(v)} y={PAD.t + PH + 14} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>{v}</text>
                ))}

                {/* Y axis label */}
                <text x={8} y={PAD.t + PH / 2} textAnchor="middle"
                    transform={`rotate(-90,8,${PAD.t + PH / 2})`}
                    style={{ fontSize: 9, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>
                    U (J)
                </text>

                {/* Infinity label */}
                <text x={W - PAD.r - 4} y={zeroY - 5} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>→ ∞: U=0</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Potential Energy U', val: `${(U / 1e9).toFixed(3)} GJ`, color: 'var(--blue, #378ADD)' },
                    { label: 'Kinetic Energy (orbit)', val: `${(KE / 1e9).toFixed(3)} GJ`, color: 'var(--teal)' },
                    { label: 'Total Energy E', val: `${(E_tot / 1e9).toFixed(3)} GJ`, color: 'var(--amber)' },
                    { label: 'Binding Energy', val: `${(-E_tot / 1e9).toFixed(3)} GJ`, color: 'var(--coral)' },
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

            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                U is always negative (bound system) · Total E = U/2 · Deeper well = more bound
            </div>
        </div>
    )
}