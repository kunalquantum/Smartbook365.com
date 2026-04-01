import { useState, useEffect, useRef } from 'react'

const W = 460, H = 320
const CX = 160, CY = H / 2

const BOHR_E = n => -13.6 / (n * n)   // eV
const BOHR_R = n => n * n * 0.529     // Å

const SERIES = {
    Lyman: { nf: 1, color: '#7F77DD', label: 'UV' },
    Balmer: { nf: 2, color: '#EF9F27', label: 'Visible' },
    Paschen: { nf: 3, color: '#D85A30', label: 'IR' },
}

const ORBIT_R = [0, 26, 46, 62, 76, 88, 98]  // SVG radii for n=1..6

function wavelengthColor(nm) {
    if (nm < 380) return '#7F77DD'
    if (nm < 450) return '#7F77DD'
    if (nm < 495) return '#378ADD'
    if (nm < 570) return '#1D9E75'
    if (nm < 620) return '#EF9F27'
    if (nm < 750) return '#D85A30'
    return '#888'
}

export default function BohrAtom() {
    const [ni, setNi] = useState(4)   // initial level
    const [nf, setNf] = useState(2)   // final level
    const [series, setSeries] = useState('Balmer')
    const [animating, setAnimating] = useState(false)
    const [photonPos, setPhotonPos] = useState(null)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [tick, setTick] = useState(0)

    // Electron orbital animation
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

    // Photon emission
    const dE = BOHR_E(nf) - BOHR_E(ni)   // negative = emission
    const E_photon = Math.abs(dE)
    const lambda = 1240 / E_photon            // nm
    const phColor = wavelengthColor(lambda)
    const isEmission = ni > nf
    const isAbsorption = ni < nf

    const triggerTransition = () => {
        if (ni === nf) return
        setAnimating(true)
        setPhotonPos(0)
        const start = performance.now()
        const dur = 1200
        const step = (now) => {
            const prog = Math.min((now - start) / dur, 1)
            setPhotonPos(prog)
            if (prog < 1) requestAnimationFrame(step)
            else { setAnimating(false); setPhotonPos(null) }
        }
        requestAnimationFrame(step)
    }

    // Electron position on selected orbit
    const elR = ORBIT_R[ni] || 26
    const elAngle = t * (3 / ni)   // faster in inner orbits
    const elX = CX + elR * Math.cos(elAngle)
    const elY = CY - elR * Math.sin(elAngle)

    // Photon trajectory (radially outward from atom)
    const photonAngle = Math.PI / 4
    const photonDist = photonPos !== null ? photonPos * 120 : 0
    const phX = CX + (elR + photonDist) * Math.cos(photonAngle)
    const phY = CY - (elR + photonDist) * Math.sin(photonAngle)

    // Energy level diagram (right panel)
    const EL_X = 300, EL_W = 140
    const EL_Y_BASE = H - 40
    const EL_SCALE = 10   // px per eV

    const levelY = n => EL_Y_BASE + BOHR_E(n) * EL_SCALE

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>
                        Initial level nᵢ
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {
                            [1, 2, 3, 4, 5, 6].map(n => (
                                <button key={n} onClick={() => setNi(n)} style={{
                                    padding: '4px 10px', borderRadius: 6, fontSize: 12,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: ni === n ? 'var(--amber)' : 'var(--bg3)',
                                    color: ni === n ? '#000' : 'var(--text2)',
                                    border: '1px solid var(--border)',
                                }}>n={n}</button>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>
                        Final level nf
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                        {
                            [1, 2, 3, 4, 5, 6].map(n => (
                                <button key={n} onClick={() => setNf(n)} disabled={n === ni} style={{
                                    padding: '4px 10px', borderRadius: 6, fontSize: 12,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: nf === n ? phColor : 'var(--bg3)',
                                    color: nf === n ? '#000' : n === ni ? 'var(--text3)' : 'var(--text2)',
                                    border: `1px solid ${nf === n ? phColor : 'var(--border)'}`,
                                    opacity: n === ni ? 0.3 : 1,
                                }}>n={n}</button>
                            ))
                        }
                    </div>
                </div>
            </div >

            {/* Series presets */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {
                    Object.entries(SERIES).map(([name, s]) => (
                        <button key={name} onClick={() => { setSeries(name); setNf(s.nf); setNi(s.nf + 2) }} style={{
                            padding: '4px 12px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                            background: series === name ? s.color : 'var(--bg3)',
                            color: series === name ? '#000' : 'var(--text2)',
                            border: `1px solid ${series === name ? s.color : 'var(--border)'}`,
                        }}>{name} ({s.label})</button>
                    ))
                }
            </div >

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                {/* === Bohr orbits === */}
                {[1, 2, 3, 4, 5, 6].map(n => (
                    <g key={n}>
                        <circle cx={CX} cy={CY} r={ORBIT_R[n]}
                            fill="none"
                            stroke={n === ni ? 'rgba(239,159,39,0.4)' : 'rgba(255,255,255,0.07)'}
                            strokeWidth={n === ni ? 1.5 : 0.8} />
                        <text x={CX + ORBIT_R[n] + 4} y={CY + 4}
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            n={n}
                        </text>
                    </g>
                ))}

                {/* Nucleus */}
                <circle cx={CX} cy={CY} r={10}
                    fill="rgba(216,90,48,0.3)" stroke="#D85A30" strokeWidth={2} />
                <text x={CX} y={CY + 4} textAnchor="middle"
                    style={{ fontSize: 8, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 600 }}>p⁺</text>

                {/* Electron */}
                <circle cx={elX} cy={elY} r={6}
                    fill="rgba(55,138,221,0.8)" stroke="#378ADD" strokeWidth={1.5} />
                <text x={elX} y={elY + 4} textAnchor="middle"
                    style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>e⁻</text>

                {/* Transition arrow */}
                {ni !== nf && (
                    <g>
                        <defs>
                            <marker id="tr_arr" viewBox="0 0 10 10" refX={8} refY={5}
                                markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke={phColor}
                                    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                        </defs>
                        <line
                            x1={CX + ORBIT_R[ni] * 0.7} y1={CY - ORBIT_R[ni] * 0.7}
                            x2={CX + ORBIT_R[nf] * 0.7} y2={CY - ORBIT_R[nf] * 0.7}
                            stroke={phColor} strokeWidth={1.5} strokeDasharray="4 3"
                            markerEnd="url(#tr_arr)" />
                    </g>
                )}

                {/* Photon dot */}
                {photonPos !== null && (
                    <g>
                        <circle cx={phX} cy={phY} r={7}
                            fill={phColor} opacity={1 - photonPos * 0.3} />
                        <circle cx={phX} cy={phY} r={14}
                            fill={phColor} opacity={0.15 * (1 - photonPos)} />
                        <text x={phX + 18} y={phY + 4}
                            style={{ fontSize: 9, fill: phColor, fontFamily: 'var(--mono)' }}>
                            γ {lambda.toFixed(0)}nm
                        </text>
                    </g>
                )}

                {/* === Energy level diagram === */}
                <rect x={EL_X - 10} y={20} width={EL_W + 20} height={H - 40}
                    rx={6} fill="rgba(0,0,0,0.2)" />

                <text x={EL_X + EL_W / 2} y={36} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    Energy levels (eV)
                </text>

                {[1, 2, 3, 4, 5, 6].map(n => {
                    const ly = levelY(n)
                    const E = BOHR_E(n)
                    const isNi = n === ni, isNf = n === nf
                    return (
                        <g key={n}>
                            <line x1={EL_X} y1={ly} x2={EL_X + EL_W} y2={ly}
                                stroke={isNi ? 'var(--amber)' : isNf ? phColor : 'rgba(255,255,255,0.15)'}
                                strokeWidth={isNi || isNf ? 2 : 1} />
                            <text x={EL_X - 4} y={ly + 4} textAnchor="end"
                                style={{
                                    fontSize: 9,
                                    fill: isNi ? 'var(--amber)' : isNf ? phColor : 'rgba(160,176,200,0.35)',
                                    fontFamily: 'var(--mono)',
                                }}>
                                n={n}
                            </text>
                            <text x={EL_X + EL_W + 4} y={ly + 4}
                                style={{
                                    fontSize: 8,
                                    fill: isNi ? 'var(--amber)' : isNf ? phColor : 'rgba(160,176,200,0.25)',
                                    fontFamily: 'var(--mono)',
                                }}>
                                {E.toFixed(2)}
                            </text>
                        </g>
                    )
                })}

                {/* Transition arrow on energy diagram */}
                {ni !== nf && (
                    <line
                        x1={EL_X + EL_W * 0.5} y1={levelY(ni)}
                        x2={EL_X + EL_W * 0.5} y2={levelY(nf)}
                        stroke={phColor} strokeWidth={2}
                        markerEnd="url(#tr_arr)" />
                )}

                {/* Photon energy label on diagram */}
                {ni !== nf && (
                    <text x={EL_X + EL_W * 0.5 + 8} y={(levelY(ni) + levelY(nf)) / 2 + 4}
                        style={{ fontSize: 9, fill: phColor, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                        {E_photon.toFixed(3)}eV
                    </text>
                )}
            </svg>

            {/* Trigger button */}
            <button onClick={triggerTransition} disabled={ni === nf || animating} style={{
                padding: '8px 24px', borderRadius: 8, fontSize: 13,
                fontFamily: 'var(--mono)', cursor: ni === nf || animating ? 'default' : 'pointer',
                marginBottom: 14,
                background: isEmission ? 'rgba(239,159,39,0.15)' : 'rgba(55,138,221,0.15)',
                color: isEmission ? 'var(--amber)' : '#378ADD',
                border: `1px solid ${isEmission ? 'rgba(239,159,39,0.35)' : 'rgba(55,138,221,0.35)'}`,
                opacity: ni === nf ? 0.4 : 1,
            }}>
                {isEmission ? `▶ Emit photon (n=${ni}→n=${nf})` : `▶ Absorb photon (n=${ni}→n=${nf})`}
            </button>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: `E(n=${ni})`, val: `${BOHR_E(ni).toFixed(3)} eV`, color: 'var(--amber)' },
                    { label: `E(n=${nf})`, val: `${BOHR_E(nf).toFixed(3)} eV`, color: phColor },
                    { label: 'ΔE = photon energy', val: `${E_photon.toFixed(4)} eV`, color: phColor },
                    { label: 'Wavelength λ', val: `${lambda.toFixed(1)} nm  (${lambda < 400 ? 'UV' : lambda < 700 ? 'visible' : 'IR'})`, color: phColor },
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
        </div >
    )
}