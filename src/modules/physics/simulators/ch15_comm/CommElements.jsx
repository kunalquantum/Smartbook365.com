import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300

const STAGES = [
    { id: 'source', label: 'Source', x: 40, color: '#1D9E75', desc: 'Original information\n(voice, data, image)' },
    { id: 'trans', label: 'Transmitter', x: 140, color: '#EF9F27', desc: 'Converts to EM signal\n(modulator + amplifier)' },
    { id: 'channel', label: 'Channel', x: 250, color: '#378ADD', desc: 'Propagation medium\n(air, cable, fibre)' },
    { id: 'recv', label: 'Receiver', x: 360, color: '#7F77DD', desc: 'Recovers signal\n(demodulator + amplifier)' },
    { id: 'dest', label: 'Destination', x: 440, color: '#1D9E75', desc: 'User\n(speaker, screen)' },
]

export default function CommElements() {
    const [snr, setSNR] = useState(20)   // dB
    const [noise, setNoise] = useState(0.1)  // noise amplitude
    const [freq, setFreq] = useState(3)    // message freq Hz
    const [bw, setBW] = useState(10)   // bandwidth kHz
    const [active, setActive] = useState(null)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const snr_linear = Math.pow(10, snr / 10)
    const shannon_C = bw * Math.log2(1 + snr_linear)  // kbps

    // Waveform panels
    const PY = 180, PH = 90, PW = W - 40
    const N = 200

    const buildWave = (noiseAmp, ampMod, freqMod) => Array.from({ length: N + 1 }, (_, i) => {
        const x = 20 + (i / N) * PW
        const pos = i / N
        const sig = Math.sin(2 * Math.PI * freq * pos - t * 3) * 0.8
        const carrier = Math.sin(2 * Math.PI * (freq * 8) * pos - t * 20) * 0.4
        const ns = (Math.random() - 0.5) * noiseAmp * 2
        return {
            x,
            yClean: PY + PH / 2 - sig * (PH * 0.4),
            yNoisy: PY + PH / 2 - (sig + ns) * (PH * 0.4),
            yMod: PY + PH / 2 - (1 + sig * ampMod) * carrier * (PH * 0.3),
        }
    })

    const pts = buildWave(noise, 0.6, 0.6)
    const clean = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.yClean.toFixed(1)}`).join(' ')
    const noisy = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.yNoisy.toFixed(1)}`).join(' ')

    const arrowDef = (id, color) => (
        <marker key={id} id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="SNR" unit=" dB" value={snr} min={0} max={40} step={1} onChange={setSNR} />
                <SimSlider label="Noise amplitude" unit="" value={noise} min={0} max={1} step={0.05} onChange={setNoise} />
                <SimSlider label="Message freq" unit=" Hz" value={freq} min={0.5} max={8} step={0.5} onChange={setFreq} />
                <SimSlider label="Bandwidth" unit=" kHz" value={bw} min={1} max={50} step={1} onChange={setBW} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {STAGES.map(s => arrowDef(`arr_${s.id}`, s.color))}
                    {arrowDef('arr_noise', '#D85A30')}
                </defs>

                {/* Connecting lines between stages */}
                {STAGES.slice(0, -1).map((s, i) => {
                    const next = STAGES[i + 1]
                    return (
                        <line key={i}
                            x1={s.x + 36} y1={60}
                            x2={next.x - 36} y2={60}
                            stroke={s.color} strokeWidth={2}
                            markerEnd={`url(#arr_${s.id})`} />
                    )
                })}

                {/* Stage boxes */}
                {STAGES.map(s => (
                    <g key={s.id} onClick={() => setActive(active === s.id ? null : s.id)}
                        style={{ cursor: 'pointer' }}>
                        <rect x={s.x - 32} y={40} width={64} height={38}
                            rx={6}
                            fill={active === s.id ? `${s.color}30` : `${s.color}12`}
                            stroke={active === s.id ? s.color : `${s.color}60`}
                            strokeWidth={active === s.id ? 2 : 1} />
                        <text x={s.x} y={64} textAnchor="middle"
                            style={{ fontSize: 10, fill: s.color, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            {s.label}
                        </text>
                    </g>
                ))}

                {/* Noise injection arrow */}
                <line x1={250} y1={100} x2={250} y2={79}
                    stroke="#D85A30" strokeWidth={1.5}
                    markerEnd="url(#arr_noise)" strokeDasharray="4 3" />
                <text x={250} y={115} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>noise</text>

                {/* Active stage info */}
                {active && (() => {
                    const s = STAGES.find(st => st.id === active)
                    const lines = s.desc.split('\n')
                    return (
                        <g>
                            <rect x={s.x - 70} y={126} width={140} height={36}
                                rx={6} fill={`${s.color}15`}
                                stroke={`${s.color}40`} strokeWidth={1} />
                            {lines.map((l, i) => (
                                <text key={i} x={s.x} y={140 + i * 14} textAnchor="middle"
                                    style={{ fontSize: 9, fill: s.color, fontFamily: 'var(--mono)' }}>
                                    {l}
                                </text>
                            ))}
                        </g>
                    )
                })()}

                {/* Signal waveform panel */}
                <rect x={20} y={PY - 8} width={PW} height={PH + 16}
                    rx={4} fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                <line x1={20} y1={PY + PH / 2} x2={20 + PW} y2={PY + PH / 2}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />

                {/* Clean signal */}
                <path d={clean} fill="none" stroke="#1D9E75" strokeWidth={1.5} opacity={0.7} />
                {/* Noisy signal */}
                <path d={noisy} fill="none" stroke="#D85A30" strokeWidth={1} opacity={0.6} />

                {/* Labels */}
                <text x={24} y={PY + 12}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>clean</text>
                <text x={24} y={PY + 24}
                    style={{ fontSize: 9, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>+noise</text>

                {/* SNR label */}
                <text x={20 + PW - 4} y={PY + 12} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    SNR = {snr} dB
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'SNR (linear)', val: snr_linear > 1000 ? `${(snr_linear / 1000).toFixed(1)}k` : snr_linear.toFixed(1), color: 'var(--teal)' },
                    { label: 'Shannon capacity', val: `${shannon_C.toFixed(1)} kbps`, color: 'var(--amber)' },
                    { label: 'Bandwidth BW', val: `${bw} kHz`, color: 'var(--teal)' },
                    { label: 'C = B log₂(1+SNR)', val: 'Max channel rate', color: 'var(--text3)' },
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

            {!active && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                    Click any block to see its role in the communication chain
                </div>
            )}
        </div>
    )
}