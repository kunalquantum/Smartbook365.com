import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460
const ROW_H = 80
const PAD = { l: 16, r: 16 }
const PW = W - PAD.l - PAD.r
const N = 300

export default function Modulation() {
    const [mode, setMode] = useState('AM')
    const [fc, setFc] = useState(12)    // carrier freq (relative)
    const [fm, setFm] = useState(2)     // message freq (relative)
    const [ma, setMa] = useState(0.7)   // AM modulation index
    const [mf, setMf] = useState(2)     // FM deviation

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

    // Build waveform samples
    const build = (rowFn, rowY) => Array.from({ length: N + 1 }, (_, i) => {
        const x = PAD.l + (i / N) * PW
        const pos = i / N
        return { x, y: rowY + rowFn(pos) }
    })

    const pathOf = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

    const CY1 = ROW_H / 2      // message row centre
    const CY2 = ROW_H + ROW_H / 2   // carrier row centre
    const CY3 = ROW_H * 2 + ROW_H / 2 // modulated row centre
    const H = ROW_H * 3 + 32

    const AMP = 28
    const tShift = t * 0.5   // slow animation

    // Message signal
    const msgFn = pos => -Math.sin(2 * Math.PI * fm * pos - tShift) * AMP * 0.8
    // Carrier
    const carFn = pos => -Math.sin(2 * Math.PI * fc * pos - tShift * fc / fm * 0.5) * AMP * 0.7

    // AM: amplitude of carrier varies with message
    const amFn = pos => {
        const msg = Math.sin(2 * Math.PI * fm * pos - tShift)
        const car = Math.cos(2 * Math.PI * fc * pos - tShift * fc / fm * 0.5)
        return -(1 + ma * msg) * car * AMP * 0.55
    }

    // FM: frequency of carrier varies with message integral
    const fmFn = pos => {
        const phase = 2 * Math.PI * fc * pos - tShift * fc / fm * 0.5
            + mf * Math.sin(2 * Math.PI * fm * pos - tShift)
        return -Math.cos(phase) * AMP * 0.7
    }

    // AM envelope
    const envTopFn = pos => -(1 + ma * Math.sin(2 * Math.PI * fm * pos - tShift)) * AMP * 0.55
    const envBottomFn = pos => (1 + ma * Math.sin(2 * Math.PI * fm * pos - tShift)) * AMP * 0.55

    const msgPts = build(msgFn, CY1)
    const carPts = build(carFn, CY2)
    const modPts = build(mode === 'AM' ? amFn : fmFn, CY3)
    const envTop = build(envTopFn, CY3)
    const envBot = build(envBottomFn, CY3)

    // Bandwidth
    const BW_AM = 2 * fm
    const BW_FM = 2 * (mf * fm + fm)   // Carson's rule: 2(Δf + fm)

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['AM', 'FM'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '6px 28px', borderRadius: 6, fontSize: 13,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m} Modulation</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Message freq fm" unit="" value={fm} min={0.5} max={6} step={0.5} onChange={setFm} />
                <SimSlider label="Carrier freq fc" unit="" value={fc} min={6} max={20} step={1} onChange={setFc} />
                {mode === 'AM'
                    ? <SimSlider label="Mod index mₐ" unit="" value={ma} min={0} max={1.5} step={0.05} onChange={setMa} />
                    : <SimSlider label="FM deviation mf" unit="" value={mf} min={0.5} max={5} step={0.5} onChange={setMf} />
                }
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* Row backgrounds */}
                {[0, 1, 2].map(i => (
                    <rect key={i} x={PAD.l} y={i * ROW_H + 2} width={PW} height={ROW_H - 4}
                        rx={3} fill="rgba(0,0,0,0.15)" />
                ))}

                {/* Centre lines */}
                {[CY1, CY2, CY3].map((cy, i) => (
                    <line key={i} x1={PAD.l} y1={cy} x2={W - PAD.r} y2={cy}
                        stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                ))}

                {/* Message signal */}
                <path d={pathOf(msgPts)} fill="none" stroke="#1D9E75" strokeWidth={2} />
                <text x={PAD.l + 4} y={CY1 - AMP * 0.8 - 4}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>
                    Message  fm={fm}
                </text>

                {/* Carrier */}
                <path d={pathOf(carPts)} fill="none" stroke="rgba(55,138,221,0.6)" strokeWidth={1.5} />
                <text x={PAD.l + 4} y={CY2 - AMP * 0.7 - 4}
                    style={{ fontSize: 9, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>
                    Carrier  fc={fc}
                </text>

                {/* Modulated signal */}
                <path d={pathOf(modPts)} fill="none" stroke="#EF9F27" strokeWidth={2} />

                {/* AM envelope */}
                {mode === 'AM' && (
                    <>
                        <path d={pathOf(envTop)} fill="none"
                            stroke="rgba(29,158,117,0.35)" strokeWidth={1} strokeDasharray="4 3" />
                        <path d={pathOf(envBot)} fill="none"
                            stroke="rgba(29,158,117,0.35)" strokeWidth={1} strokeDasharray="4 3" />
                        {ma > 1 && (
                            <text x={W / 2} y={CY3 - AMP - 8} textAnchor="middle"
                                style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                                ⚠ Over-modulation! mₐ &gt; 1 → distortion
                            </text>
                        )}
                    </>
                )}

                <text x={PAD.l + 4} y={CY3 - AMP * 0.8}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>
                    {mode} signal  BW≈{mode === 'AM' ? BW_AM.toFixed(1) : BW_FM.toFixed(1)} units
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'AM' ? [
                    { label: 'Mod index mₐ=Am/Ac', val: ma.toFixed(2), color: ma > 1 ? 'var(--coral)' : 'var(--teal)' },
                    { label: 'Bandwidth BW', val: `2fm = ${BW_AM.toFixed(1)} units`, color: 'var(--amber)' },
                    { label: 'Sidebands', val: `fc±fm = ${(fc - fm).toFixed(1)}, ${(fc + fm).toFixed(1)}`, color: 'var(--text2)' },
                    { label: 'Status', val: ma < 1 ? 'Normal' : ma === 1 ? '100% mod' : 'Over-modulated!', color: ma > 1 ? 'var(--coral)' : 'var(--teal)' },
                ] : [
                    { label: 'Freq deviation Δf', val: `mf×fm = ${(mf * fm).toFixed(1)}`, color: 'var(--amber)' },
                    { label: "BW (Carson's rule)", val: `${BW_FM.toFixed(1)} units`, color: 'var(--teal)' },
                    { label: 'FM index mf', val: mf.toFixed(1), color: 'var(--teal)' },
                    { label: 'Noise immunity', val: 'FM >> AM', color: 'var(--teal)' },
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