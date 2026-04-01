import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H_EACH = 80, H_SUM = 100
const H_TOTAL = H_EACH * 2 + H_SUM + 32
const PAD = 20
const PW = W - PAD * 2

export default function Superposition() {
    const [f1, setF1] = useState(3)
    const [f2, setF2] = useState(3.5)
    const [A1, setA1] = useState(40)
    const [A2, setA2] = useState(40)
    const [phi, setPhi] = useState(0)   // phase difference in degrees
    const [mode, setMode] = useState('beats')  // beats | phase
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

    const freq1 = mode === 'beats' ? f1 : 3
    const freq2 = mode === 'beats' ? f2 : 3
    const phiRad = (phi * Math.PI) / 180

    const N = 300
    const wave = (x, f, A, phaseOff = 0) => {
        const k = (2 * Math.PI * f) / PW
        const w = 2 * Math.PI * f
        return A * Math.sin(k * x - w * t + phaseOff)
    }

    const buildPath = (yFn, CY) => Array.from({ length: N + 1 }, (_, i) => {
        const x = PAD + (i / N) * PW
        const y = CY - yFn(x - PAD)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

    // 3 rows: wave1, wave2, sum
    const CY1 = H_EACH / 2
    const CY2 = H_EACH + 8 + H_EACH / 2
    const CY_S = H_EACH * 2 + 16 + H_SUM / 2

    const p1 = buildPath(x => wave(x, freq1, A1, 0), CY1)
    const p2 = buildPath(x => wave(x, freq2, A2, phiRad), CY2)
    const pS = buildPath(x => wave(x, freq1, A1, 0) + wave(x, freq2, A2, phiRad), CY_S)

    const beatFreq = Math.abs(freq1 - freq2).toFixed(2)
    const maxAmp = A1 + A2
    const isConstructive = phi === 0 || phi === 360
    const isDestructive = phi === 180

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { key: 'beats', label: 'Beat frequency' },
                    { key: 'phase', label: 'Phase interference' },
                ].map(m => (
                    <button key={m.key} onClick={() => setMode(m.key)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m.key ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m.label}</button>
                ))}
            </div>

            {mode === 'beats' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Freq f₁" unit=" Hz" value={f1} min={1} max={8} step={0.5} onChange={setF1} />
                    <SimSlider label="Freq f₂" unit=" Hz" value={f2} min={1} max={8} step={0.5} onChange={setF2} />
                </div>
            )}

            {mode === 'phase' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Amplitude A₁" unit=" px" value={A1} min={10} max={45} step={5} onChange={setA1} />
                    <SimSlider label="Amplitude A₂" unit=" px" value={A2} min={10} max={45} step={5} onChange={setA2} />
                    <SimSlider label="Phase diff Δφ" unit="°" value={phi} min={0} max={360} step={10} onChange={setPhi} />
                </div>
            )}

            <svg viewBox={`0 0 ${W} ${H_TOTAL}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* Row labels */}
                <text x={PAD} y={CY1 - 28}
                    style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>Wave 1</text>
                <text x={PAD} y={CY2 - 28}
                    style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>Wave 2</text>
                <text x={PAD} y={CY_S - 38}
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>Resultant (superposition)</text>

                {/* Dividers */}
                <line x1={0} y1={H_EACH + 4} x2={W} y2={H_EACH + 4}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                <line x1={0} y1={H_EACH * 2 + 10} x2={W} y2={H_EACH * 2 + 10}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />

                {/* Centre lines */}
                <line x1={PAD} y1={CY1} x2={W - PAD} y2={CY1}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                <line x1={PAD} y1={CY2} x2={W - PAD} y2={CY2}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />
                <line x1={PAD} y1={CY_S} x2={W - PAD} y2={CY_S}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

                {/* Waves */}
                <path d={p1} fill="none" stroke="#1D9E75" strokeWidth={1.8} />
                <path d={p2} fill="none" stroke="#D85A30" strokeWidth={1.8} />
                <path d={pS} fill="none" stroke="#EF9F27" strokeWidth={2.5} />

                {/* Beat envelope for beats mode */}
                {mode === 'beats' && (() => {
                    const envPath = Array.from({ length: N + 1 }, (_, i) => {
                        const x = PAD + (i / N) * PW
                        const env = (A1 + A2) * Math.abs(Math.cos(Math.PI * Math.abs(freq1 - freq2) * (x - PAD) / PW))
                        const y = CY_S - env
                        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
                    }).join(' ')
                    const envPath2 = Array.from({ length: N + 1 }, (_, i) => {
                        const x = PAD + (i / N) * PW
                        const env = (A1 + A2) * Math.abs(Math.cos(Math.PI * Math.abs(freq1 - freq2) * (x - PAD) / PW))
                        const y = CY_S + env
                        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
                    }).join(' ')
                    return (
                        <>
                            <path d={envPath} fill="none" stroke="rgba(239,159,39,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                            <path d={envPath2} fill="none" stroke="rgba(239,159,39,0.25)" strokeWidth={1} strokeDasharray="4 3" />
                        </>
                    )
                })()}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'beats' ? [
                    { label: 'f_beat = |f₁−f₂|', val: `${beatFreq} Hz`, color: 'var(--amber)' },
                    { label: 'Max amplitude', val: `${A1 + A2} px`, color: 'var(--teal)' },
                    { label: 'Beats/second', val: `${beatFreq}`, color: 'var(--coral)' },
                    { label: '|f₁−f₂| < 10 Hz', val: 'Audible beats', color: 'var(--text3)' },
                ] : [
                    { label: 'Phase diff Δφ', val: `${phi}°`, color: 'var(--amber)' },
                    { label: 'Resultant amp', val: isConstructive ? `${maxAmp}px max` : isDestructive ? '0px (cancel)' : `${Math.round(Math.sqrt(A1 ** 2 + A2 ** 2 + 2 * A1 * A2 * Math.cos(phiRad)))}px`, color: isConstructive ? 'var(--teal)' : isDestructive ? 'var(--coral)' : 'var(--amber)' },
                    { label: 'Interference', val: isConstructive ? 'Constructive' : isDestructive ? 'Destructive' : 'Partial', color: isConstructive ? 'var(--teal)' : isDestructive ? 'var(--coral)' : 'var(--text2)' },
                ]).map(c => (
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