import { useState, useEffect, useRef, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const h = 4.136e-15   // eV·s (Planck's constant)
const c = 3e8         // m/s

const METALS = {
    'Caesium': { phi: 2.0, color: '#EF9F27' },
    'Potassium': { phi: 2.3, color: '#1D9E75' },
    'Sodium': { phi: 2.75, color: '#7F77DD' },
    'Zinc': { phi: 4.3, color: '#378ADD' },
    'Copper': { phi: 4.7, color: '#D85A30' },
    'Platinum': { phi: 5.65, color: '#888780' },
}

function freqColor(f_THz) {
    const nm = 3e8 / (f_THz * 1e12) * 1e9
    if (nm < 380) return '#9B30FF'
    if (nm < 450) return '#6A0DAD'
    if (nm < 495) return '#4169E1'
    if (nm < 570) return '#228B22'
    if (nm < 620) return '#FFD700'
    if (nm < 750) return '#FF4500'
    return '#8B0000'
}

export default function PhotoelectricEffect() {
    const [metal, setMetal] = useState('Caesium')
    const [freq, setFreq] = useState(1000)    // THz
    const [intens, setIntens] = useState(0.5)     // relative intensity
    const [mode, setMode] = useState('effect')  // effect | stopping

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [tick, setTick] = useState(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const met = METALS[metal]
    const phi = met.phi     // work function eV

    // Photon energy
    const lambda_nm = (c / (freq * 1e12)) * 1e9
    const E_photon = h * freq * 1e12   // eV
    const ejects = E_photon > phi
    const KE_max = Math.max(0, E_photon - phi)
    const V_stop = KE_max             // eV → stopping potential in V
    const threshold_freq = phi / h / 1e12   // THz

    // Electron positions (ejected)
    const nPhotons = Math.round(intens * 6)
    const nElec = ejects ? nPhotons : 0

    const photons = Array.from({ length: nPhotons }, (_, i) => {
        const phase = (t * 1.2 + i / nPhotons) % 1
        return {
            x: 60 + phase * (W / 2 - 80),
            y: H / 2 - 20 + (i % 3 - 1) * 24,
            phase,
        }
    })

    const electrons = Array.from({ length: nElec }, (_, i) => {
        const phase = ((t * 1.5 + i / nElec * 0.8) % 1)
        const speed = KE_max * 40
        return {
            x: W / 2 + phase * speed,
            y: H / 2 - 16 + (i % 3 - 1) * 22,
            phase,
            vy: (i - nElec / 2) * 8,
        }
    }).filter(e => e.x < W - 20)

    // I-V / stopping potential curve
    const ivPts = useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => {
            const V = -V_stop * 1.5 + i / 99 * (V_stop * 3)
            const I = ejects ? Math.max(0, Math.min(intens, (V + V_stop) * intens / (V_stop * 0.5))) : 0
            return { V, I }
        })
    }, [V_stop, intens, ejects])

    // Stopping potential graph
    const GP = { l: 50, r: 20, t: 20, b: 30 }
    const GW = W - GP.l - GP.r, GH = H - GP.t - GP.b
    const V_min = -V_stop * 1.5, V_max = V_stop * 2
    const I_max = intens
    const toGX = V => GP.l + ((V - V_min) / (V_max - V_min || 1)) * GW
    const toGY = I => GP.t + GH - (I / (I_max || 1)) * GH

    const ivPath = ivPts.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toGX(p.V).toFixed(1)},${toGY(p.I).toFixed(1)}`
    ).join(' ')

    const lightColor = freqColor(freq)

    return (
        <div>
            {/* Metal selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(METALS).map(k => (
                    <button key={k} onClick={() => setMetal(k)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: metal === k ? METALS[k].color : 'var(--bg3)',
                        color: metal === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${metal === k ? METALS[k].color : 'var(--border)'}`,
                    }}>{k} (φ={METALS[k].phi}eV)</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Light frequency" unit=" THz" value={freq} min={400} max={1500} step={10} onChange={setFreq} />
                <SimSlider label="Intensity" unit="" value={intens} min={0.1} max={1} step={0.05} onChange={setIntens} />
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {['effect', 'stopping'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '4px 14px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>{m === 'effect' ? 'Live effect' : 'Stopping potential curve'}</button>
                ))}
            </div>

            {mode === 'effect' ? (
                <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                    style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                    {/* Metal surface */}
                    <rect x={W / 2 - 10} y={20} width={60} height={H - 40}
                        rx={4} fill={`${met.color}18`}
                        stroke={met.color} strokeWidth={2} />
                    <text x={W / 2 + 20} y={36} textAnchor="middle"
                        style={{ fontSize: 10, fill: met.color, fontFamily: 'var(--mono)', fontWeight: 600 }}>{metal}</text>
                    <text x={W / 2 + 20} y={50} textAnchor="middle"
                        style={{ fontSize: 9, fill: `${met.color}80`, fontFamily: 'var(--mono)' }}>φ={phi}eV</text>

                    {/* Incoming photons */}
                    {photons.map((ph, i) => (
                        <g key={i}>
                            <circle cx={ph.x} cy={ph.y} r={6}
                                fill={lightColor} opacity={0.85} />
                            <text x={ph.x} y={ph.y + 3.5} textAnchor="middle"
                                style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>γ</text>
                        </g>
                    ))}

                    {/* Ejected electrons */}
                    {ejects && electrons.map((el, i) => (
                        <g key={i}>
                            <circle cx={el.x} cy={el.y + el.vy * el.phase} r={5}
                                fill="rgba(29,158,117,0.8)"
                                stroke="rgba(29,158,117,0.4)" strokeWidth={0.5} />
                            <text x={el.x} y={el.y + el.vy * el.phase + 3.5} textAnchor="middle"
                                style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>e⁻</text>
                        </g>
                    ))}

                    {/* No ejection message */}
                    {!ejects && (
                        <text x={W * 0.75} y={H / 2} textAnchor="middle"
                            style={{ fontSize: 11, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            No emission —
                        </text>
                    )}
                    {!ejects && (
                        <text x={W * 0.75} y={H / 2 + 16} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(216,90,48,0.5)', fontFamily: 'var(--mono)' }}>
                            hf={E_photon.toFixed(2)}eV &lt; φ={phi}eV
                        </text>
                    )}

                    {/* Arrows & labels */}
                    <defs>
                        <marker id="ph_arr" viewBox="0 0 10 10" refX={8} refY={5}
                            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                            <path d="M2 1L8 5L2 9" fill="none" stroke={lightColor}
                                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </marker>
                    </defs>
                    <line x1={20} y1={H / 2} x2={W / 2 - 12} y2={H / 2}
                        stroke={lightColor} strokeWidth={1.5}
                        markerEnd="url(#ph_arr)" />
                    <text x={24} y={H / 2 - 8}
                        style={{ fontSize: 9, fill: lightColor, fontFamily: 'var(--mono)' }}>
                        hf = {E_photon.toFixed(3)} eV
                    </text>
                    <text x={24} y={H / 2 + 18}
                        style={{ fontSize: 9, fill: lightColor, fontFamily: 'var(--mono)' }}>
                        λ = {lambda_nm.toFixed(0)} nm
                    </text>

                    {/* Threshold marker */}
                    <text x={24} y={H - 14}
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                        Threshold: f₀ = {threshold_freq.toFixed(0)} THz  |  {(3e8 / (threshold_freq * 1e12) * 1e9).toFixed(0)} nm
                    </text>

                    {/* KE label */}
                    {ejects && (
                        <text x={W - 14} y={H - 14} textAnchor="end"
                            style={{ fontSize: 10, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            KE_max = {KE_max.toFixed(3)} eV
                        </text>
                    )}
                </svg>
            ) : (
                /* Stopping potential I-V graph */
                <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                    style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                    {/* Axes */}
                    {(() => {
                        const zeroV_x = toGX(0)
                        return (
                            <>
                                <line x1={GP.l} y1={GP.t + GH} x2={GP.l + GW} y2={GP.t + GH}
                                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                                <line x1={zeroV_x} y1={GP.t} x2={zeroV_x} y2={GP.t + GH}
                                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                                <text x={GP.l + GW} y={GP.t + GH + 14}
                                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>V →</text>
                                <text x={GP.l - 4} y={GP.t + 8} textAnchor="end"
                                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>I</text>
                            </>
                        )
                    })()}

                    {/* I-V curve */}
                    {ejects && (
                        <path d={ivPath} fill="none" stroke={met.color} strokeWidth={2.5} />
                    )}

                    {/* Stopping potential marker */}
                    {ejects && (
                        <g>
                            <line x1={toGX(-V_stop)} y1={GP.t}
                                x2={toGX(-V_stop)} y2={GP.t + GH}
                                stroke="rgba(216,90,48,0.5)" strokeWidth={1.5}
                                strokeDasharray="5 3" />
                            <text x={toGX(-V_stop)} y={GP.t + GH + 14} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>
                                −V₀={V_stop.toFixed(3)}V
                            </text>
                            <text x={toGX(-V_stop) - 8} y={GP.t + 20} textAnchor="end"
                                style={{ fontSize: 9, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                                stopping potential
                            </text>
                        </g>
                    )}

                    {/* Saturation current label */}
                    {ejects && (
                        <text x={GP.l + GW - 4} y={GP.t + GH * 0.15} textAnchor="end"
                            style={{ fontSize: 9, fill: `${met.color}80`, fontFamily: 'var(--mono)' }}>
                            I_sat ∝ intensity
                        </text>
                    )}

                    {/* No emission */}
                    {!ejects && (
                        <text x={W / 2} y={H / 2} textAnchor="middle"
                            style={{ fontSize: 12, fill: 'rgba(216,90,48,0.5)', fontFamily: 'var(--mono)' }}>
                            No photoelectric effect — increase frequency
                        </text>
                    )}

                    {/* Einstein equation */}
                    <text x={W / 2} y={H - 10} textAnchor="middle"
                        style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                        eV₀ = KE_max = hf − φ  →  slope = h/e
                    </text>
                </svg>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Photon energy hf', val: `${E_photon.toFixed(4)} eV`, color: lightColor },
                    { label: 'Work function φ', val: `${phi} eV`, color: met.color },
                    { label: 'KE_max = hf − φ', val: ejects ? `${KE_max.toFixed(4)} eV` : '— (no emission)', color: ejects ? 'var(--teal)' : 'var(--coral)' },
                    { label: 'Stopping potential', val: ejects ? `${V_stop.toFixed(4)} V` : '—', color: ejects ? 'var(--amber)' : 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>

            {!ejects && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: 'rgba(216,90,48,0.1)', border: '1px solid rgba(216,90,48,0.3)',
                    fontSize: 11, color: 'var(--coral)', fontFamily: 'var(--mono)',
                }}>
                    hf={E_photon.toFixed(3)}eV &lt; φ={phi}eV — No matter how intense the light, electrons cannot be ejected below threshold frequency. This disproved the wave theory of light.
                </div>
            )}
        </div>
    )
}