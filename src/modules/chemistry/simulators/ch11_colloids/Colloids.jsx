import { useState, useEffect, useRef, useCallback } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const COLLOID_TYPES = [
    { name: 'Sol', dispersed: 'Solid', medium: 'Liquid', example: 'Gold sol, paint, ink', color: '#EF9F27' },
    { name: 'Gel', dispersed: 'Liquid', medium: 'Solid', example: 'Jelly, butter, cheese', color: '#1D9E75' },
    { name: 'Emulsion', dispersed: 'Liquid', medium: 'Liquid', example: 'Milk, mayo, cream', color: '#378ADD' },
    { name: 'Aerosol', dispersed: 'Solid', medium: 'Gas', example: 'Smoke, fog, clouds', color: '#888780' },
    { name: 'Foam', dispersed: 'Gas', medium: 'Solid', example: 'Pumice, foam rubber', color: '#7F77DD' },
    { name: 'Liquid foam', dispersed: 'Gas', medium: 'Liquid', example: 'Shaving foam, whipped cream', color: '#D85A30' },
]

// Physics-based Brownian motion using useRef for positions
function useBrownian(n, bounds, active) {
    const stateRef = useRef(
        Array.from({ length: n }, (_, i) => ({
            x: bounds.x + Math.random() * bounds.w,
            y: bounds.y + Math.random() * bounds.h,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            r: 4 + Math.random() * 5,
            hue: Math.random() * 360,
        }))
    )
    const [snapshot, setSnapshot] = useState(stateRef.current)
    const rafRef = useRef(null)
    const lastRef = useRef(null)

    useEffect(() => {
        if (!active) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            lastRef.current = ts

            stateRef.current = stateRef.current.map(p => {
                // Random kick (Brownian impulse)
                const kx = (Math.random() - 0.5) * 3
                const ky = (Math.random() - 0.5) * 3
                let vx = p.vx * 0.92 + kx
                let vy = p.vy * 0.92 + ky
                // Cap speed
                const speed = Math.sqrt(vx * vx + vy * vy)
                if (speed > 3) { vx = vx / speed * 3; vy = vy / speed * 3 }
                let x = p.x + vx
                let y = p.y + vy
                // Bounce off walls
                if (x < bounds.x + p.r || x > bounds.x + bounds.w - p.r) { vx *= -1; x = Math.max(bounds.x + p.r, Math.min(bounds.x + bounds.w - p.r, x)) }
                if (y < bounds.y + p.r || y > bounds.y + bounds.h - p.r) { vy *= -1; y = Math.max(bounds.y + p.r, Math.min(bounds.y + bounds.h - p.r, y)) }
                return { ...p, x, y, vx, vy }
            })
            setSnapshot([...stateRef.current])
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [active])

    return snapshot
}

export default function Colloids() {
    const [mode, setMode] = useState('brownian')
    const [selType, setSelType] = useState(0)
    const [lightOn, setLightOn] = useState(true)
    const [beaker, setBeaker] = useState('colloid')  // colloid | solution | suspension

    const particles = useBrownian(20, { x: 10, y: 10, w: 380, h: 200 }, mode === 'brownian')

    const ct = COLLOID_TYPES[selType]

    // Tyndall: scatter dots along beam for colloid
    const scatterDots = beaker === 'colloid' ? Array.from({ length: 18 }, (_, i) => ({
        x: 60 + i * 16,
        y: 95 + Math.sin(i * 0.9) * 14,
        size: 1.5 + Math.random() * 2,
    })) : []

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'brownian', l: 'Brownian motion' }, { k: 'tyndall', l: 'Tyndall effect' }, { k: 'types', l: 'Colloid types' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── BROWNIAN MOTION ── */}
            {mode === 'brownian' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--purple)' }}>Brownian motion:</strong> Colloidal particles are in continuous random motion due to unequal bombardment by much smaller solvent molecules. Watch the particles — no two take the same path. This is <em>real</em> physics, not fake animation.
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(127,119,221,0.3)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                        <div style={{ padding: '6px 12px', background: 'rgba(127,119,221,0.1)', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2 }}>
                            ⚗ LIVE — COLLOIDAL PARTICLES IN SOLVENT
                        </div>
                        <svg viewBox="0 0 400 220" width="100%" style={{ display: 'block' }}>
                            {/* Background solvent molecules (tiny, fast) */}
                            {Array.from({ length: 80 }, (_, i) => {
                                const bx = 15 + (i * 37 + 7) % 370
                                const by = 12 + (i * 29 + 3) % 196
                                return <circle key={i} cx={bx} cy={by} r={1.5}
                                    fill="rgba(160,176,200,0.12)" />
                            })}

                            {/* Colloidal particles — real Brownian motion */}
                            {particles.map((p, i) => (
                                <g key={i}>
                                    {/* Trail dots */}
                                    <circle cx={p.x - p.vx * 3} cy={p.y - p.vy * 3} r={p.r * 0.4}
                                        fill={`hsl(${p.hue},60%,65%)`} opacity={0.2} />
                                    <circle cx={p.x - p.vx * 6} cy={p.y - p.vy * 6} r={p.r * 0.25}
                                        fill={`hsl(${p.hue},60%,65%)`} opacity={0.1} />
                                    {/* Main particle */}
                                    <circle cx={p.x} cy={p.y} r={p.r}
                                        fill={`hsla(${p.hue},55%,55%,0.7)`}
                                        stroke={`hsl(${p.hue},70%,70%)`}
                                        strokeWidth={1.5} />
                                </g>
                            ))}

                            {/* Labels */}
                            <text x={200} y={215} textAnchor="middle"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                large colloidal particles (coloured) · tiny solvent molecules (grey dots)
                            </text>
                        </svg>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { label: 'Cause', val: 'Unequal solvent bombardment', col: 'var(--purple)' },
                            { label: 'Discoverer', val: 'Robert Brown, 1827', col: 'var(--gold)' },
                            { label: 'Effect', val: 'Prevents sedimentation', col: 'var(--teal)' },
                            { label: 'Kinetic proof', val: 'Confirms molecular motion theory', col: 'var(--text2)' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: p.col }}>{p.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TYNDALL ── */}
            {mode === 'tyndall' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Tyndall effect:</strong> Colloidal particles (1–1000 nm) scatter light — the beam becomes <em>visible</em>. True solution particles are too small. Switch between the three beakers to see the difference.
                    </div>

                    {/* Three beaker selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {[
                            { k: 'solution', label: 'True solution', subtitle: 'NaCl in water', scatters: false, opaque: false, col: '#A8D8B9' },
                            { k: 'colloid', label: 'Colloid', subtitle: 'Gold sol', scatters: true, opaque: false, col: '#EF9F27' },
                            { k: 'suspension', label: 'Suspension', subtitle: 'Muddy water', scatters: false, opaque: true, col: '#D85A30' },
                        ].map(b => (
                            <button key={b.k} onClick={() => setBeaker(b.k)} style={{
                                padding: '10px 6px', borderRadius: 10, cursor: 'pointer',
                                background: beaker === b.k ? `${b.col}20` : 'var(--bg3)',
                                border: `2px solid ${beaker === b.k ? b.col : 'var(--border)'}`,
                                textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: b.col }}>{b.label}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>{b.subtitle}</div>
                            </button>
                        ))}
                    </div>

                    {/* Light toggle */}
                    <button onClick={() => setLightOn(p => !p)} style={{
                        width: '100%', padding: '10px', borderRadius: 8, fontSize: 13,
                        fontFamily: 'var(--mono)', cursor: 'pointer', marginBottom: 14,
                        background: lightOn ? 'rgba(239,159,39,0.12)' : 'var(--bg3)',
                        color: lightOn ? 'var(--gold)' : 'var(--text3)',
                        border: `2px solid ${lightOn ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`,
                    }}>
                        {lightOn ? '💡 Torch ON — observe beam' : '○ Torch OFF — click to shine light'}
                    </button>

                    {/* The actual Tyndall visual */}
                    <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                        <svg viewBox="0 0 400 180" width="100%" style={{ display: 'block' }}>
                            {/* Beaker outline */}
                            <path d="M 80 30 L 75 155 L 325 155 L 320 30 Z"
                                fill={
                                    beaker === 'solution' ? 'rgba(168,216,185,0.06)' :
                                        beaker === 'colloid' ? 'rgba(239,159,39,0.08)' :
                                            'rgba(216,90,48,0.12)'
                                }
                                stroke={
                                    beaker === 'solution' ? 'rgba(168,216,185,0.3)' :
                                        beaker === 'colloid' ? 'rgba(239,159,39,0.3)' :
                                            'rgba(216,90,48,0.4)'
                                }
                                strokeWidth={1.5} />

                            {/* Particles inside */}
                            {beaker === 'colloid' && Array.from({ length: 30 }, (_, i) => ({
                                x: 90 + (i * 37) % 220, y: 50 + (i * 29) % 90,
                            })).map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r={3.5}
                                    fill="rgba(239,159,39,0.4)" stroke="rgba(239,159,39,0.7)" strokeWidth={0.8} />
                            ))}
                            {beaker === 'suspension' && Array.from({ length: 12 }, (_, i) => ({
                                x: 95 + (i * 40) % 210, y: 80 + (i * 26) % 60,
                            })).map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r={8}
                                    fill="rgba(216,90,48,0.3)" stroke="rgba(216,90,48,0.5)" strokeWidth={1} />
                            ))}

                            {/* Light source */}
                            {lightOn && (
                                <g>
                                    {/* Torch */}
                                    <rect x={4} y={80} width={22} height={20} rx={4}
                                        fill="rgba(239,159,39,0.3)" stroke="var(--gold)" strokeWidth={1.5} />
                                    <circle cx={26} cy={90} r={5}
                                        fill="rgba(239,159,39,0.8)" />

                                    {/* Beam through beaker */}
                                    {beaker === 'solution' && (
                                        // Beam passes through invisibly
                                        <line x1={31} y1={90} x2={380} y2={90}
                                            stroke="rgba(239,159,39,0.07)" strokeWidth={8} />
                                    )}
                                    {beaker === 'colloid' && (
                                        // Visible beam — Tyndall effect!
                                        <>
                                            <path d="M 31 84 L 80 78 L 320 84 L 80 96 L 31 90 Z"
                                                fill="rgba(239,159,39,0.18)" />
                                            <line x1={31} y1={90} x2={380} y2={90}
                                                stroke="rgba(239,159,39,0.25)" strokeWidth={10} />
                                            {/* Scatter dots */}
                                            {Array.from({ length: 25 }, (_, i) => ({
                                                x: 90 + i * 9.5,
                                                y: 90 + Math.sin(i * 0.8) * 10,
                                            })).map((d, i) => (
                                                <circle key={i} cx={d.x} cy={d.y} r={2}
                                                    fill="rgba(255,220,100,0.9)" opacity={0.8} />
                                            ))}
                                        </>
                                    )}
                                    {beaker === 'suspension' && (
                                        // Blocked immediately
                                        <line x1={31} y1={90} x2={85} y2={90}
                                            stroke="rgba(239,159,39,0.3)" strokeWidth={6} />
                                    )}
                                </g>
                            )}

                            {/* Result label */}
                            <text x={200} y={172} textAnchor="middle" style={{
                                fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                fill: beaker === 'colloid' && lightOn ? 'var(--gold)'
                                    : beaker === 'solution' && lightOn ? 'rgba(168,216,185,0.7)'
                                        : 'rgba(160,176,200,0.5)',
                            }}>
                                {!lightOn ? 'No light — click torch to demonstrate' :
                                    beaker === 'colloid' ? '✓ TYNDALL EFFECT — beam visible (colloidal particles scatter light)' :
                                        beaker === 'solution' ? 'No scattering — particles too small (<1nm)' :
                                            'Beam blocked — suspension is opaque'}
                            </text>
                        </svg>
                    </div>
                </div>
            )}

            {/* ── TYPES ── */}
            {mode === 'types' && (
                <div>
                    {/* Particle size ruler */}
                    <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>
                            PARTICLE SIZE — DISPERSED SYSTEMS
                        </div>
                        <div style={{ display: 'flex', height: 16, borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
                            <div style={{ flex: 1, background: 'rgba(168,216,185,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--mono)', color: '#A8D8B9' }}>True (&lt;1nm)</div>
                            <div style={{ flex: 2, background: 'rgba(239,159,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 700 }}>Colloidal (1−1000nm)</div>
                            <div style={{ flex: 1, background: 'rgba(216,90,48,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--coral)' }}>&gt;1000nm</div>
                        </div>
                    </div>

                    {/* Clickable type grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {COLLOID_TYPES.map((c, i) => (
                            <button key={c.name} onClick={() => setSelType(i)} style={{
                                padding: '12px 10px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                                background: selType === i ? `${c.color}20` : 'var(--bg3)',
                                border: `2px solid ${selType === i ? c.color : 'var(--border)'}`,
                                transition: 'all 0.15s',
                            }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: c.color }}>{c.name}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                    {c.dispersed} in {c.medium}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Detail for selected type */}
                    <div style={{ padding: '14px 16px', background: `${ct.color}10`, border: `2px solid ${ct.color}40`, borderRadius: 12 }}>
                        <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: ct.color, marginBottom: 8 }}>{ct.name}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                            <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>Dispersed phase</div>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: ct.color }}>{ct.dispersed}</div>
                            </div>
                            <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>Dispersion medium</div>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: ct.color }}>{ct.medium}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            <strong style={{ color: ct.color }}>Examples:</strong> {ct.example}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Mode" value={mode} color="var(--teal)" highlight />
                <ValueCard label="Particle size" value="1−1000 nm" color="var(--gold)" />
                <ValueCard label="Tyndall" value={beaker === 'colloid' && lightOn ? 'Visible beam' : '−'} color="var(--gold)" />
            </div>
        </div>
    )
}