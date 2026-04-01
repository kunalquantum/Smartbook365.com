import { useState, useEffect, useRef, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460
const ROW = 90
const PAD = { l: 20, r: 20 }
const PW = W - PAD.l - PAD.r
const N = 300

export default function DigitalComm() {
    const [fSignal, setFSignal] = useState(3)    // signal frequency Hz
    const [fSample, setFSample] = useState(8)    // sampling rate Hz
    const [bits, setBits] = useState(4)    // bits per sample
    const [mode, setMode] = useState('sampling')  // sampling | fibre

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

    // Nyquist check
    const nyquist = 2 * fSignal
    const isAliasing = fSample < nyquist
    const fAlias = isAliasing ? Math.abs(fSample - fSignal) : null
    const bitRate = fSample * bits
    const quantLevels = Math.pow(2, bits)

    // Signal samples
    const H = mode === 'sampling' ? ROW * 3 + 20 : ROW * 2 + 20

    const sigFn = (pos) => Math.sin(2 * Math.PI * fSignal * pos - t * 2) * 0.75
    const recFn = (pos) => {
        // Reconstruct from samples — staircase
        const samplePeriod = 1 / fSample
        const sampleIdx = Math.floor(pos / samplePeriod)
        const samplePos = sampleIdx * samplePeriod
        return sigFn(samplePos)
    }
    const aliasFn = (pos) => Math.sin(2 * Math.PI * (fAlias || 0) * pos - t * 2) * 0.75

    const CY1 = ROW / 2
    const CY2 = ROW + ROW / 2
    const CY3 = ROW * 2 + ROW / 2
    const AMP = 32

    const buildPath = (fn, CY) => Array.from({ length: N + 1 }, (_, i) => {
        const x = PAD.l + (i / N) * PW
        const y = CY + fn(i / N) * AMP
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    // Sample markers
    const nSamplesVis = Math.min(fSample, 30)
    const samples = Array.from({ length: nSamplesVis }, (_, i) => {
        const pos = i / nSamplesVis
        const sv = sigFn(pos)
        const qv = Math.round(sv * (quantLevels / 2)) / (quantLevels / 2)
        return {
            x: PAD.l + pos * PW,
            y: CY1 + sv * AMP,
            yq: CY1 + qv * AMP,
        }
    })

    // Fibre mode
    const fiberPhase = (t * 2) % 1
    const nPulses = 8
    const bitPattern = [1, 0, 1, 1, 0, 1, 0, 0]

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['sampling', 'fibre'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'sampling' ? 'Sampling & Aliasing' : 'Optical Fibre'}</button>
                ))}
            </div>

            {mode === 'sampling' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <SimSlider label="Signal freq fs" unit=" Hz" value={fSignal} min={1} max={10} step={0.5} onChange={setFSignal} />
                        <SimSlider label="Sample rate" unit=" Hz" value={fSample} min={1} max={25} step={0.5} onChange={setFSample} />
                        <SimSlider label="Bits/sample" unit=" bits" value={bits} min={1} max={8} step={1} onChange={setBits} />
                    </div>

                    {/* Aliasing warning */}
                    <div style={{
                        fontSize: 11, fontFamily: 'var(--mono)',
                        padding: '7px 12px', borderRadius: 8, marginBottom: 12,
                        background: isAliasing ? 'rgba(216,90,48,0.12)' : 'rgba(29,158,117,0.1)',
                        border: `1px solid ${isAliasing ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
                        color: isAliasing ? '#D85A30' : '#1D9E75',
                    }}>
                        {isAliasing
                            ? `⚠ ALIASING! fs=${fSample}Hz < 2×fSignal=${nyquist}Hz  →  false frequency = ${fAlias?.toFixed(1)}Hz appears`
                            : `✓ Nyquist satisfied: fs=${fSample}Hz ≥ 2×fSignal=${nyquist}Hz — faithful reconstruction`}
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                        style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                        {/* Row backgrounds */}
                        {[CY1, CY2, CY3].map((cy, i) => (
                            <rect key={i} x={PAD.l} y={cy - ROW / 2 + 2} width={PW} height={ROW - 4}
                                rx={3} fill="rgba(0,0,0,0.12)" />
                        ))}

                        {/* Centre lines */}
                        {[CY1, CY2, CY3].map((cy, i) => (
                            <line key={i} x1={PAD.l} y1={cy} x2={W - PAD.r} y2={cy}
                                stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                        ))}

                        {/* Row 1: Original signal */}
                        <path d={buildPath(sigFn, CY1)} fill="none"
                            stroke="#1D9E75" strokeWidth={2} />
                        <text x={PAD.l + 4} y={CY1 - AMP - 4}
                            style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                            Original signal ({fSignal}Hz)
                        </text>

                        {/* Sample markers */}
                        {samples.map((s, i) => (
                            <g key={i}>
                                <line x1={s.x} y1={CY1} x2={s.x} y2={s.y}
                                    stroke="rgba(239,159,39,0.5)" strokeWidth={1} />
                                <circle cx={s.x} cy={s.yq} r={3}
                                    fill="#EF9F27" opacity={0.8} />
                            </g>
                        ))}

                        {/* Row 2: Reconstructed */}
                        <path d={buildPath(recFn, CY2)} fill="none"
                            stroke={isAliasing ? '#D85A30' : '#EF9F27'} strokeWidth={2} />
                        <text x={PAD.l + 4} y={CY2 - AMP - 4}
                            style={{ fontSize: 9, fill: isAliasing ? 'rgba(216,90,48,0.7)' : 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>
                            Reconstructed ({isAliasing ? 'ALIASED!' : '✓ correct'})
                        </text>

                        {/* Row 3: Alias frequency if aliasing */}
                        {isAliasing && fAlias !== null && (
                            <>
                                <path d={buildPath(aliasFn, CY3)} fill="none"
                                    stroke="#D85A30" strokeWidth={2} />
                                <text x={PAD.l + 4} y={CY3 - AMP - 4}
                                    style={{ fontSize: 9, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>
                                    Alias: {fAlias.toFixed(1)}Hz (false signal)
                                </text>
                            </>
                        )}
                        {!isAliasing && (
                            <text x={W / 2} y={CY3} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                                No aliasing — original faithfully reconstructed
                            </text>
                        )}
                    </svg>
                </>
            )}

            {mode === 'fibre' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <SimSlider label="Sample rate" unit=" Hz" value={fSample} min={1} max={25} step={0.5} onChange={setFSample} />
                        <SimSlider label="Bits/sample" unit=" bits" value={bits} min={1} max={8} step={1} onChange={setBits} />
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                        style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>

                        {/* Fibre cable */}
                        <rect x={60} y={H / 2 - 12} width={W - 120} height={24}
                            rx={12} fill="rgba(55,138,221,0.08)"
                            stroke="rgba(55,138,221,0.3)" strokeWidth={2} />

                        {/* Core */}
                        <rect x={60} y={H / 2 - 5} width={W - 120} height={10}
                            rx={5} fill="rgba(55,138,221,0.15)"
                            stroke="rgba(55,138,221,0.2)" strokeWidth={0.5} />

                        {/* Cladding label */}
                        <text x={W / 2} y={H / 2 - 16} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(55,138,221,0.4)', fontFamily: 'var(--mono)' }}>
                            optical fibre (cladding)
                        </text>
                        <text x={W / 2} y={H / 2 - 5} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>core</text>

                        {/* Light pulses (digital data) */}
                        {bitPattern.map((bit, i) => {
                            const baseX = 60 + ((i / nPulses + fiberPhase) % 1) * (W - 120)
                            const pulseW = (W - 120) / nPulses * 0.7
                            if (bit === 0) return null
                            if (baseX > W - 60 || baseX + pulseW > W - 60) return null
                            return (
                                <g key={i}>
                                    <rect x={baseX} y={H / 2 - 4} width={pulseW} height={8}
                                        rx={2} fill="#EF9F27" opacity={0.85} />
                                    {/* Glow */}
                                    <rect x={baseX - 2} y={H / 2 - 6} width={pulseW + 4} height={12}
                                        rx={4} fill="#EF9F27" opacity={0.12} />
                                </g>
                            )
                        })}

                        {/* TX end */}
                        <rect x={20} y={H / 2 - 28} width={40} height={56}
                            rx={6} fill="rgba(239,159,39,0.1)"
                            stroke="rgba(239,159,39,0.4)" strokeWidth={1.5} />
                        <text x={40} y={H / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>TX</text>
                        <text x={40} y={H / 2 + 16} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>laser</text>

                        {/* RX end */}
                        <rect x={W - 60} y={H / 2 - 28} width={40} height={56}
                            rx={6} fill="rgba(29,158,117,0.1)"
                            stroke="rgba(29,158,117,0.4)" strokeWidth={1.5} />
                        <text x={W - 40} y={H / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>RX</text>
                        <text x={W - 40} y={H / 2 + 16} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>photodiode</text>

                        {/* Binary bit pattern display */}
                        <text x={W / 2} y={32} textAnchor="middle"
                            style={{ fontSize: 11, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            {bitPattern.join(' ')}  →  light pulse = 1, dark = 0
                        </text>

                        {/* Specs */}
                        <text x={W / 2} y={H - 12} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                            Loss: ~0.2 dB/km  |  Bandwidth: THz range  |  No EM interference
                        </text>
                    </svg>
                </>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'sampling' ? [
                    { label: 'Nyquist rate', val: `${nyquist} Hz`, color: 'var(--amber)' },
                    { label: 'Sample rate', val: `${fSample} Hz ${isAliasing ? '⚠' : '✓'}`, color: isAliasing ? 'var(--coral)' : 'var(--teal)' },
                    { label: 'Bit rate', val: `${bitRate} bits/s`, color: 'var(--teal)' },
                    { label: 'Quant levels', val: `${quantLevels} (${bits} bits)`, color: 'var(--text2)' },
                ] : [
                    { label: 'Bit rate', val: `${bitRate} bps`, color: 'var(--amber)' },
                    { label: 'Quant levels', val: `${quantLevels}`, color: 'var(--teal)' },
                    { label: 'Medium', val: 'Optical fibre (TIR)', color: 'var(--teal)' },
                    { label: 'Advantage', val: 'Immune to EM noise', color: 'var(--text3)' },
                ]).map(c => (
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