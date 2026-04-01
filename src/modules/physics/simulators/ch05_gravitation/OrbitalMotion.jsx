import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 400, H = 320
const CX = W / 2, CY = H / 2
const G = 6.674e-11
const M = 5.972e24   // Earth mass
const R_EARTH = 6.371e6

export default function OrbitalMotion() {
    const [altKm, setAltKm] = useState(400)   // ISS default
    const [running, setRunning] = useState(true)
    const [angle, setAngle] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)

    const r = R_EARTH + altKm * 1e3          // orbital radius m
    const v0 = Math.sqrt(G * M / r)            // orbital speed m/s
    const vEsc = Math.sqrt(2 * G * M / r)        // escape velocity m/s
    const T = 2 * Math.PI * Math.sqrt(r * r * r / (G * M)) // period s
    const T_hr = T / 3600

    // SVG orbit radius — scale so 400km alt → 60px, max 35786 (geo) → 130px
    const MAX_ALT = 42000
    const MIN_R_SVG = 55, MAX_R_SVG = 135
    const orbitR = MIN_R_SVG + ((altKm / MAX_ALT) * (MAX_R_SVG - MIN_R_SVG))

    // Angular speed scaled so animation feels good regardless of real period
    const omegaVis = (2 * Math.PI) / Math.max(4, Math.min(20, T_hr * 0.5))

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            setAngle(p => p + omegaVis * dt)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, omegaVis])

    const sx = CX + orbitR * Math.cos(angle)
    const sy = CY - orbitR * Math.sin(angle)

    // Velocity tangent arrow
    const vScale = 24
    const vx = -Math.sin(angle) * vScale
    const vy = Math.cos(angle) * vScale

    // GEO orbit radius in SVG
    const geoR = MIN_R_SVG + ((35786 / MAX_ALT) * (MAX_R_SVG - MIN_R_SVG))

    return (
        <div>
            <SimSlider
                label="Altitude"
                unit=" km"
                value={altKm}
                min={200} max={42000} step={100}
                onChange={v => { setAltKm(v); setAngle(0) }}
            />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                <defs>
                    <marker id="ov" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="#1D9E75"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                    <marker id="og" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.5)"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>

                {/* GEO reference orbit */}
                <circle cx={CX} cy={CY} r={geoR}
                    fill="none" stroke="rgba(239,159,39,0.12)"
                    strokeWidth={1} strokeDasharray="4 4" />
                <text x={CX + geoR + 4} y={CY + 3}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.4)', fontFamily: 'var(--mono)' }}>GEO</text>

                {/* Orbit path */}
                <circle cx={CX} cy={CY} r={orbitR}
                    fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

                {/* Earth */}
                <circle cx={CX} cy={CY} r={28}
                    fill="#0B1929" stroke="rgba(55,138,221,0.7)" strokeWidth={2} />
                <circle cx={CX} cy={CY} r={28}
                    fill="none" stroke="rgba(55,138,221,0.15)" strokeWidth={6} />
                <text x={CX} y={CY + 5} textAnchor="middle"
                    style={{ fontSize: 11, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>Earth</text>

                {/* Radius line */}
                <line x1={CX} y1={CY} x2={sx} y2={sy}
                    stroke="rgba(255,255,255,0.07)" strokeWidth={0.8} />

                {/* Velocity arrow */}
                <line x1={sx} y1={sy} x2={sx + vx} y2={sy - vy}
                    stroke="#1D9E75" strokeWidth={2} markerEnd="url(#ov)" />

                {/* Satellite */}
                <rect x={sx - 7} y={sy - 4} width={14} height={8}
                    rx={2} fill="#EF9F27" stroke="rgba(255,255,255,0.3)" strokeWidth={0.5} />
                {/* Solar panels */}
                <rect x={sx - 18} y={sy - 2} width={9} height={4} rx={1}
                    fill="rgba(55,138,221,0.7)" stroke="rgba(55,138,221,0.4)" strokeWidth={0.5} />
                <rect x={sx + 9} y={sy - 2} width={9} height={4} rx={1}
                    fill="rgba(55,138,221,0.7)" stroke="rgba(55,138,221,0.4)" strokeWidth={0.5} />

                {/* Altitude label */}
                <text x={CX + orbitR * 0.7 + 6} y={CY - orbitR * 0.7 - 6}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    {altKm >= 1000 ? `${(altKm / 1000).toFixed(1)}k km` : `${altKm} km`}
                </text>
            </svg>

            <button onClick={() => setRunning(p => !p)} style={{
                padding: '6px 20px', borderRadius: 8, fontSize: 12,
                fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                background: running ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.15)',
                color: running ? 'var(--coral)' : 'var(--teal)',
                border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
            }}>
                {running ? '⏸ Pause' : '▶ Resume'}
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Orbital speed v₀', val: `${(v0 / 1000).toFixed(2)} km/s`, color: 'var(--teal)' },
                    { label: 'Escape velocity', val: `${(vEsc / 1000).toFixed(2)} km/s`, color: 'var(--coral)' },
                    { label: 'Period T', val: T_hr < 24 ? `${T_hr.toFixed(2)} hr` : `${(T_hr / 24).toFixed(2)} days`, color: 'var(--amber)' },
                    { label: 'vₑsc / v₀', val: `${(vEsc / v0).toFixed(4)}  (=√2)`, color: 'var(--text2)' },
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

            {altKm >= 35000 && altKm <= 36500 && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(239,159,39,0.1)', border: '1px solid rgba(239,159,39,0.25)',
                    fontSize: 12, color: 'var(--amber)', fontFamily: 'var(--mono)',
                }}>
                    ★ Geostationary orbit — satellite appears stationary above Earth (T = 24 hr)
                </div>
            )}
        </div>
    )
}