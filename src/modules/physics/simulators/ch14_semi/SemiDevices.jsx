import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280

const DEVICES = {
    LED: {
        color: '#EF9F27',
        desc: 'Forward-biased p-n junction — electrons recombine with holes, emitting photons',
        formula: 'E_photon = hf = E_g',
    },
    Photodiode: {
        color: '#378ADD',
        desc: 'Reverse-biased — incident photons generate electron-hole pairs → photocurrent',
        formula: 'I_photo ∝ light intensity',
    },
    'Solar Cell': {
        color: '#1D9E75',
        desc: 'Photovoltaic effect — photons create carriers, junction separates them → voltage',
        formula: 'P = V_oc × I_sc × FF',
    },
    'Zener Diode': {
        color: '#D85A30',
        desc: 'Heavily doped — operates in reverse breakdown as a precision voltage reference',
        formula: 'V_z = constant (reverse bias)',
    },
}

function wavelengthColor(nm) {
    if (nm < 450) return '#7F77DD'
    if (nm < 495) return '#378ADD'
    if (nm < 570) return '#1D9E75'
    if (nm < 620) return '#EF9F27'
    return '#D85A30'
}

export default function SemiDevices() {
    const [device, setDevice] = useState('LED')
    const [V, setV] = useState(2.0)    // forward voltage (LED) / light intensity (PD,SC) / reverse V (Z)
    const [Eg, setEg] = useState(1.8)    // band gap eV (LED color)
    const [lightIntensity, setLight] = useState(0.5)
    const [zenerV, setZenerV] = useState(5.0)

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

    const dev = DEVICES[device]

    // LED physics
    const ledOn = device === 'LED' && V > 1.5
    const photonLambda = ledOn ? Math.round(1240 / Eg) : 0   // nm
    const ledColor = ledOn ? wavelengthColor(photonLambda) : 'rgba(160,176,200,0.2)'
    const nPhotons = ledOn ? Math.min(12, Math.round((V - 1.5) * 6)) : 0

    // Photodiode / Solar cell
    const photoI = lightIntensity * 10     // mA
    const Voc = 0.026 * Math.log(photoI / 0.001 + 1)  // open circuit voltage

    // Zener
    const zenerCurrent = V > zenerV ? (V - zenerV) / 10 : 0

    // Photon positions (LED animation)
    const photons = Array.from({ length: nPhotons }, (_, i) => {
        const age = (t * 0.8 + i / nPhotons) % 1
        const angle = (i / nPhotons) * 2 * Math.PI + t * 0.3
        const r = age * 90
        return {
            x: W / 2 + r * Math.cos(angle),
            y: H / 2 + r * Math.sin(angle),
            opacity: Math.max(0, 1 - age * 1.2),
        }
    })

    // Light rays for photodiode / solar cell
    const lightRays = Array.from({ length: 6 }, (_, i) => ({
        x: 60 + i * 60,
        phase: (t * 1.5 + i * 0.4) % 1,
    }))

    return (
        <div>
            {/* Device selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {Object.keys(DEVICES).map(d => (
                    <button key={d} onClick={() => setDevice(d)} style={{
                        padding: '5px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: device === d ? DEVICES[d].color : 'var(--bg3)',
                        color: device === d ? '#000' : 'var(--text2)',
                        border: `1px solid ${device === d ? DEVICES[d].color : 'var(--border)'}`,
                    }}>{d}</button>
                ))}
            </div>

            {/* Description */}
            <div style={{
                fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)',
                marginBottom: 12, padding: '8px 12px',
                background: 'var(--bg3)', borderRadius: 8,
                border: `1px solid ${dev.color}33`,
            }}>
                {dev.desc}
            </div>

            {/* Controls per device */}
            {device === 'LED' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Forward voltage" unit=" V" value={V} min={0} max={3.5} step={0.05} onChange={setV} />
                    <SimSlider label="Band gap E_g" unit=" eV" value={Eg} min={1} max={3} step={0.05} onChange={setEg} />
                </div>
            )}
            {(device === 'Photodiode' || device === 'Solar Cell') && (
                <SimSlider label="Light intensity" unit="" value={lightIntensity} min={0} max={1} step={0.05} onChange={setLight} />
            )}
            {device === 'Zener Diode' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Reverse voltage" unit=" V" value={V} min={0} max={10} step={0.1} onChange={setV} />
                    <SimSlider label="Zener voltage V_z" unit=" V" value={zenerV} min={2} max={8} step={0.5} onChange={setZenerV} />
                </div>
            )}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.18)', borderRadius: 8 }}>

                {/* === LED === */}
                {device === 'LED' && (
                    <g>
                        {/* Diode symbol */}
                        <polygon points={`${W / 2 - 30},${H / 2 - 30} ${W / 2 + 30},${H / 2} ${W / 2 - 30},${H / 2 + 30}`}
                            fill={`${ledColor}40`} stroke={ledColor} strokeWidth={2} />
                        <line x1={W / 2 + 30} y1={H / 2 - 30} x2={W / 2 + 30} y2={H / 2 + 30}
                            stroke={ledColor} strokeWidth={2.5} />
                        <line x1={W / 2 - 60} y1={H / 2} x2={W / 2 - 30} y2={H / 2}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                        <line x1={W / 2 + 30} y1={H / 2} x2={W / 2 + 60} y2={H / 2}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

                        {/* Photons */}
                        {photons.map((ph, i) => (
                            <circle key={i} cx={ph.x} cy={ph.y} r={3}
                                fill={ledColor} opacity={ph.opacity} />
                        ))}

                        {/* LED glow */}
                        {ledOn && (
                            <circle cx={W / 2} cy={H / 2} r={nPhotons * 6}
                                fill={ledColor} opacity={0.05} />
                        )}

                        {/* Info */}
                        <text x={W / 2} y={40} textAnchor="middle"
                            style={{ fontSize: 12, fill: ledColor, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {ledOn ? `λ = ${photonLambda} nm  —  ${photonLambda < 450 ? 'violet' : photonLambda < 495 ? 'blue' : photonLambda < 570 ? 'green' : photonLambda < 620 ? 'yellow/orange' : 'red'} light` : 'V < threshold — no emission'}
                        </text>
                        <text x={W / 2} y={H - 14} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                            E_photon = {Eg} eV  |  λ = hc/E_g = {Math.round(1240 / Eg)} nm
                        </text>
                    </g>
                )}

                {/* === PHOTODIODE / SOLAR CELL === */}
                {(device === 'Photodiode' || device === 'Solar Cell') && (
                    <g>
                        {/* Incoming light rays */}
                        {lightRays.map((ray, i) => {
                            const y = 20 + ray.phase * (H / 2 - 40)
                            return (
                                <g key={i}>
                                    <line x1={ray.x} y1={20}
                                        x2={ray.x} y2={y}
                                        stroke="rgba(239,159,39,0.6)" strokeWidth={1.5} />
                                    <circle cx={ray.x} cy={y} r={3}
                                        fill="#EF9F27" opacity={lightIntensity * 0.8} />
                                </g>
                            )
                        })}

                        {/* p-n junction block */}
                        <rect x={80} y={H / 2 - 30} width={W - 160} height={60}
                            rx={6} fill="rgba(127,119,221,0.1)"
                            stroke="rgba(127,119,221,0.3)" strokeWidth={1.5} />
                        <line x1={W / 2} y1={H / 2 - 30} x2={W / 2} y2={H / 2 + 30}
                            stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 2" />
                        <text x={W / 4 + 40} y={H / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>p</text>
                        <text x={W / 2 + W / 4 - 40} y={H / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>n</text>

                        {/* Electron-hole generation */}
                        {Array.from({ length: Math.round(lightIntensity * 6) }, (_, i) => {
                            const gx = 100 + i * 44
                            return (
                                <g key={i}>
                                    <circle cx={gx} cy={H / 2 - 8} r={4}
                                        fill="rgba(216,90,48,0.8)" />
                                    <text x={gx} y={H / 2 - 5} textAnchor="middle"
                                        style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>−</text>
                                    <circle cx={gx} cy={H / 2 + 8} r={4}
                                        fill="none" stroke="rgba(55,138,221,0.8)" strokeWidth={1.5} />
                                    <text x={gx} y={H / 2 + 12} textAnchor="middle"
                                        style={{ fontSize: 8, fill: 'rgba(55,138,221,0.8)', fontFamily: 'var(--mono)' }}>+</text>
                                </g>
                            )
                        })}

                        {/* Output */}
                        <text x={W / 2} y={H - 30} textAnchor="middle"
                            style={{ fontSize: 12, fill: '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {device === 'Solar Cell'
                                ? `V_oc = ${Voc.toFixed(3)} V  |  I_sc = ${photoI.toFixed(1)} mA`
                                : `I_photo = ${photoI.toFixed(2)} mA`}
                        </text>
                        <text x={W / 2} y={H - 14} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                            {device === 'Solar Cell' ? 'P_max = V_mp × I_mp  (fill factor FF)' : 'Reverse biased — photocurrent ∝ light'}
                        </text>
                    </g>
                )}

                {/* === ZENER DIODE === */}
                {device === 'Zener Diode' && (
                    <g>
                        {/* Zener symbol */}
                        <polygon points={`${W / 2 + 30},${H / 2 - 30} ${W / 2 - 30},${H / 2} ${W / 2 + 30},${H / 2 + 30}`}
                            fill="rgba(216,90,48,0.15)" stroke="#D85A30" strokeWidth={2} />
                        {/* Zener bar (bent ends) */}
                        <line x1={W / 2 - 30} y1={H / 2 - 30} x2={W / 2 - 30} y2={H / 2 + 30}
                            stroke="#D85A30" strokeWidth={2.5} />
                        <line x1={W / 2 - 30} y1={H / 2 - 30} x2={W / 2 - 20} y2={H / 2 - 42}
                            stroke="#D85A30" strokeWidth={2} />
                        <line x1={W / 2 - 30} y1={H / 2 + 30} x2={W / 2 - 40} y2={H / 2 + 42}
                            stroke="#D85A30" strokeWidth={2} />

                        {/* Wires */}
                        <line x1={W / 2 + 80} y1={H / 2} x2={W / 2 + 30} y2={H / 2}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                        <line x1={W / 2 - 80} y1={H / 2} x2={W / 2 - 30} y2={H / 2}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

                        {/* Voltage source */}
                        <circle cx={W / 2 + 100} cy={H / 2} r={18}
                            fill="var(--bg3)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                        <text x={W / 2 + 100} y={H / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'var(--text2)', fontFamily: 'var(--mono)' }}>V</text>

                        {/* Zener voltage indicator */}
                        <line x1={W / 2 - 80} y1={H / 2 - 50} x2={W / 2 + 80} y2={H / 2 - 50}
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1} strokeDasharray="5 3" />
                        <text x={W / 2} y={H / 2 - 54} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>
                            V_z = {zenerV} V  (reference voltage)
                        </text>

                        {/* Status */}
                        <text x={W / 2} y={H / 2 + 70} textAnchor="middle"
                            style={{ fontSize: 12, fill: V >= zenerV ? '#D85A30' : 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {V >= zenerV
                                ? `⚡ Breakdown conducting  I_z = ${zenerCurrent.toFixed(3)} A`
                                : `Reverse biased V = ${V.toFixed(1)}V < V_z — no breakdown yet`}
                        </text>

                        {/* V_out = V_z flat line */}
                        {V >= zenerV && (
                            <g>
                                <line x1={100} y1={H / 2 + 90} x2={W - 100} y2={H / 2 + 90}
                                    stroke="rgba(216,90,48,0.4)" strokeWidth={1} />
                                <text x={W / 2} y={H / 2 + 103} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                                    V_out = {zenerV} V  (regulated — flat line)
                                </text>
                            </g>
                        )}

                        {/* Avalanche sparks */}
                        {V >= zenerV && Array.from({ length: 5 }, (_, i) => {
                            const sx = W / 2 - 20 + i * 10
                            const sy = H / 2 - 10 + Math.sin(t * 8 + i) * 8
                            return (
                                <text key={i} x={sx} y={sy} textAnchor="middle"
                                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)', opacity: 0.7 }}>
                                    ⚡
                                </text>
                            )
                        })}
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {device === 'LED' && [
                    { label: 'Forward V', val: `${V.toFixed(2)} V`, color: 'var(--amber)' },
                    { label: 'Photon wavelength', val: ledOn ? `${photonLambda} nm` : '—', color: ledColor },
                    { label: 'Photon energy', val: `${Eg} eV`, color: dev.color },
                    { label: 'Emission', val: ledOn ? 'Active' : 'Below threshold', color: ledOn ? 'var(--teal)' : 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
                {(device === 'Photodiode' || device === 'Solar Cell') && [
                    { label: 'Light intensity', val: `${(lightIntensity * 100).toFixed(0)}%`, color: 'var(--amber)' },
                    { label: 'Photocurrent', val: `${photoI.toFixed(2)} mA`, color: dev.color },
                    {
                        label: device === 'Solar Cell' ? 'V_oc' : 'Reverse bias',
                        val: device === 'Solar Cell' ? `${Voc.toFixed(3)} V` : '~5V', color: 'var(--teal)'
                    },
                    { label: 'Mechanism', val: 'hf > E_g → e-h pair', color: 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
                {device === 'Zener Diode' && [
                    { label: 'Applied V', val: `${V.toFixed(1)} V`, color: 'var(--amber)' },
                    { label: 'Zener V_z', val: `${zenerV} V`, color: 'var(--coral)' },
                    { label: 'I_z', val: `${zenerCurrent.toFixed(3)} A`, color: V >= zenerV ? 'var(--coral)' : 'var(--text3)' },
                    { label: 'V_out (regulated)', val: V >= zenerV ? `${zenerV} V (stable)` : '—', color: V >= zenerV ? 'var(--teal)' : 'var(--text3)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}