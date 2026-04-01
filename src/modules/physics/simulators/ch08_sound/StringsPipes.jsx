import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 200
const STRING_Y = H / 2
const STRING_X1 = 40, STRING_X2 = 420
const STRING_L = STRING_X2 - STRING_X1

export default function StringsPipes() {
    const [harmonic, setHarmonic] = useState(1)
    const [type, setType] = useState('string')   // string | open | closed
    const [tension, setTension] = useState(100)        // N
    const [mu, setMu] = useState(0.01)       // kg/m
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
    const v = Math.sqrt(tension / mu)   // wave speed on string

    // Max harmonics based on type
    const maxHarmonic = type === 'closed' ? 5 : 6

    // Frequency calculation
    const L = 1.0   // 1 metre string
    let fn
    if (type === 'string' || type === 'open') {
        fn = harmonic * v / (2 * L)
    } else {
        // closed pipe — only odd harmonics
        const oddN = 2 * harmonic - 1
        fn = oddN * v / (4 * L)
    }

    const lambda_n = type === 'closed'
        ? (4 * L) / (2 * harmonic - 1)
        : (2 * L) / harmonic

    // Standing wave: sum of two counter-propagating waves
    const N = 200
    const k = (2 * Math.PI) / lambda_n
    const omega = 2 * Math.PI * fn / 10  // slowed for visibility

    const pathD = Array.from({ length: N + 1 }, (_, i) => {
        const x = STRING_X1 + (i / N) * STRING_L
        const pos = (x - STRING_X1) / STRING_L   // 0..1
        const y = 55 * Math.sin(k * (x - STRING_X1)) * Math.cos(omega * t)
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${(STRING_Y - y).toFixed(1)}`
    }).join(' ')

    // Node positions (x values where standing wave = 0 always)
    const nNodes = harmonic + 1
    const nodes = Array.from({ length: nNodes }, (_, i) => {
        if (type === 'closed') {
            // Node at closed end (x=0), antinode at open end
            return STRING_X1 + (i / (harmonic * 2 - 1 + 0.5)) * STRING_L
        }
        return STRING_X1 + (i / harmonic) * STRING_L
    })

    // Antinode positions
    const nAntinodes = harmonic
    const antinodes = Array.from({ length: nAntinodes }, (_, i) => {
        if (type === 'closed') {
            return STRING_X1 + ((i * 2 + 1) / (2 * (harmonic * 2 - 1 + 0.5))) * STRING_L
        }
        return STRING_X1 + ((i + 0.5) / harmonic) * STRING_L
    })

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { key: 'string', label: 'String (fixed-fixed)' },
                    { key: 'open', label: 'Open pipe' },
                    { key: 'closed', label: 'Closed pipe' },
                ].map(m => (
                    <button key={m.key} onClick={() => { setType(m.key); setHarmonic(1) }} style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: type === m.key ? 'var(--amber)' : 'var(--bg3)',
                        color: type === m.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m.label}</button>
                ))}
            </div>

            {/* Harmonic buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Harmonic:</span>
                {Array.from({ length: maxHarmonic }, (_, i) => {
                    const n = i + 1
                    const label = type === 'closed' ? `n=${2 * n - 1}` : `n=${n}`
                    return (
                        <button key={n} onClick={() => setHarmonic(n)} style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: harmonic === n ? 'var(--teal)' : 'var(--bg3)',
                            color: harmonic === n ? '#fff' : 'var(--text2)',
                            border: '1px solid var(--border)',
                        }}>{label}</button>
                    )
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Tension T" unit=" N" value={tension} min={10} max={500} step={10} onChange={setTension} />
                <SimSlider label="Linear density μ" unit=" g/m" value={mu * 1000} min={1} max={50} step={1} onChange={v => setMu(v / 1000)} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.1)', borderRadius: 8 }}>

                {/* Fixed end markers */}
                <rect x={STRING_X1 - 8} y={STRING_Y - 30} width={8} height={60}
                    rx={2} fill="rgba(255,255,255,0.2)" />
                {type !== 'closed' && (
                    <rect x={STRING_X2} y={STRING_Y - 30} width={8} height={60}
                        rx={2} fill="rgba(255,255,255,0.2)" />
                )}
                {/* Open pipe end (free) */}
                {type === 'open' && (
                    <>
                        <line x1={STRING_X1 - 2} y1={STRING_Y - 32} x2={STRING_X2 + 2} y2={STRING_Y - 32}
                            stroke="rgba(55,138,221,0.3)" strokeWidth={1} />
                        <line x1={STRING_X1 - 2} y1={STRING_Y + 32} x2={STRING_X2 + 2} y2={STRING_Y + 32}
                            stroke="rgba(55,138,221,0.3)" strokeWidth={1} />
                    </>
                )}

                {/* Equilibrium line */}
                <line x1={STRING_X1} y1={STRING_Y} x2={STRING_X2} y2={STRING_Y}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 3" />

                {/* Standing wave shadow */}
                <path d={pathD} fill="none"
                    stroke="rgba(239,159,39,0.15)" strokeWidth={8} strokeLinecap="round" />
                {/* Standing wave */}
                <path d={pathD} fill="none"
                    stroke="#EF9F27" strokeWidth={2.5} strokeLinecap="round" />

                {/* Node markers */}
                {nodes.map((nx, i) => (
                    <g key={`n${i}`}>
                        <circle cx={nx} cy={STRING_Y} r={5}
                            fill="#1A3350" stroke="#D85A30" strokeWidth={1.5} />
                        <text x={nx} y={STRING_Y + 18} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>N</text>
                    </g>
                ))}

                {/* Antinode markers */}
                {antinodes.map((ax, i) => (
                    <g key={`a${i}`}>
                        <circle cx={ax} cy={STRING_Y} r={5}
                            fill="#1A3350" stroke="#1D9E75" strokeWidth={1.5} />
                        <text x={ax} y={STRING_Y + 18} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)' }}>A</text>
                    </g>
                ))}

                {/* Harmonic label */}
                <text x={W / 2} y={24} textAnchor="middle"
                    style={{ fontSize: 11, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {type === 'closed' ? `${2 * harmonic - 1}${harmonic === 1 ? 'st' : harmonic === 2 ? 'rd' : 'th'} harmonic` : `${harmonic}${harmonic === 1 ? 'st' : harmonic === 2 ? 'nd' : harmonic === 3 ? 'rd' : 'th'} harmonic`}
                    {' — '}
                    {nodes.length} node{nodes.length > 1 ? 's' : ''}, {antinodes.length} antinode{antinodes.length > 1 ? 's' : ''}
                </text>

                {/* λ/2 label */}
                <line x1={STRING_X1} y1={H - 20} x2={STRING_X1 + STRING_L / harmonic} y2={H - 20}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={STRING_X1 + STRING_L / (harmonic * 2)} y={H - 8} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>λ/2</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Wave speed v', val: `${v.toFixed(1)} m/s`, color: 'var(--teal)' },
                    { label: 'Frequency fₙ', val: `${fn.toFixed(2)} Hz`, color: 'var(--amber)' },
                    { label: 'Wavelength λ', val: `${lambda_n.toFixed(3)} m`, color: 'var(--coral)' },
                    { label: 'Nodes / Antinodes', val: `${nodes.length} / ${antinodes.length}`, color: 'var(--text2)' },
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