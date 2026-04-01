import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 200
const CY = H / 2
const PAD = 20

export default function WaveMotion() {
    const [freq, setFreq] = useState(2)     // Hz
    const [amp, setAmp] = useState(50)    // px
    const [type, setType] = useState('transverse')
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const tRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const lambda = (W - PAD * 2) / freq   // wavelength in px (1 screen = freq cycles)
    const k = (2 * Math.PI) / lambda
    const omega = 2 * Math.PI * freq
    const N = 200

    // Transverse wave path
    const transPath = Array.from({ length: N + 1 }, (_, i) => {
        const x = PAD + (i / N) * (W - PAD * 2)
        const y = CY - amp * Math.sin(k * x - omega * t)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    // Longitudinal — dots showing compression/rarefaction
    const nDots = 28
    const dots = Array.from({ length: nDots }, (_, i) => {
        const x0 = PAD + (i / nDots) * (W - PAD * 2)
        const dx = amp * 0.3 * Math.sin(k * x0 - omega * t)
        const density = 1 - 0.6 * Math.cos(k * x0 - omega * t)
        return { x: x0 + dx, density }
    })

    const v_display = (freq * lambda).toFixed(0)
    const T_display = (1 / freq).toFixed(3)

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['transverse', 'longitudinal'].map(m => (
                    <button key={m} onClick={() => setType(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: type === m ? 'var(--amber)' : 'var(--bg3)',
                        color: type === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Frequency f" unit=" Hz" value={freq} min={0.5} max={5} step={0.5} onChange={setFreq} />
                <SimSlider label="Amplitude A" unit=" px" value={amp} min={10} max={80} step={5} onChange={setAmp} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>

                {/* Centre line */}
                <line x1={PAD} y1={CY} x2={W - PAD} y2={CY}
                    stroke="rgba(255,255,255,0.07)" strokeWidth={1} />

                {/* Amplitude guide lines */}
                <line x1={PAD} y1={CY - amp} x2={W - PAD} y2={CY - amp}
                    stroke="rgba(239,159,39,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                <line x1={PAD} y1={CY + amp} x2={W - PAD} y2={CY + amp}
                    stroke="rgba(239,159,39,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                <text x={PAD - 2} y={CY - amp + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.4)', fontFamily: 'var(--mono)' }}>+A</text>
                <text x={PAD - 2} y={CY + amp + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.4)', fontFamily: 'var(--mono)' }}>−A</text>

                {/* Wavelength marker */}
                <line x1={PAD} y1={CY + amp + 18} x2={PAD + lambda} y2={CY + amp + 18}
                    stroke="rgba(29,158,117,0.4)" strokeWidth={1} />
                <text x={PAD + lambda / 2} y={CY + amp + 30} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>λ</text>

                {type === 'transverse' && (
                    <>
                        {/* Wave shadow */}
                        <path d={transPath} fill="none"
                            stroke="rgba(239,159,39,0.15)" strokeWidth={6} />
                        {/* Wave */}
                        <path d={transPath} fill="none"
                            stroke="#EF9F27" strokeWidth={2} strokeLinecap="round" />

                        {/* Direction arrow */}
                        <defs>
                            <marker id="wd" viewBox="0 0 10 10" refX={8} refY={5}
                                markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.6)"
                                    strokeWidth={1.5} strokeLinecap="round" />
                            </marker>
                        </defs>
                        <line x1={W - PAD - 50} y1={CY - amp - 20}
                            x2={W - PAD - 10} y2={CY - amp - 20}
                            stroke="rgba(239,159,39,0.6)" strokeWidth={1}
                            markerEnd="url(#wd)" />
                        <text x={W - PAD - 55} y={CY - amp - 16}
                            textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>v →</text>
                    </>
                )}

                {type === 'longitudinal' && (
                    <>
                        {dots.map((d, i) => (
                            <circle key={i} cx={d.x} cy={CY} r={4}
                                fill={`rgba(239,159,39,${(d.density * 0.6).toFixed(2)})`}
                                stroke={`rgba(239,159,39,${(d.density * 0.3).toFixed(2)})`}
                                strokeWidth={0.5} />
                        ))}
                        {/* Compression label */}
                        {(() => {
                            const maxDotX = dots.reduce((mx, d) => d.density > mx.density ? d : mx, dots[0])
                            return (
                                <text x={maxDotX.x} y={CY - 20} textAnchor="middle"
                                    style={{ fontSize: 9, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>
                                    compression
                                </text>
                            )
                        })()}
                    </>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Frequency f', val: `${freq} Hz`, color: 'var(--amber)' },
                    { label: 'Wavelength λ', val: `${(lambda / 50).toFixed(2)} m`, color: 'var(--teal)' },
                    { label: 'Period T', val: `${T_display} s`, color: 'var(--text2)' },
                    { label: 'v = fλ', val: `${(freq * lambda / 50).toFixed(1)} m/s`, color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}