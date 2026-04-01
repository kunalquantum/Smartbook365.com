import { useState, useEffect, useRef } from 'react'
import { DECAY_TYPES, DECAY_CHAIN_U238 } from './helpers/nuclearData'
import ValueCard from '../../components/ui/ValueCard'

// Animated nucleus — particles fly out on decay
function NucleusAnimation({ decayType, active, onDecay }) {
    const canvasRef = useRef(null)
    const stateRef = useRef({
        protons: Array.from({ length: 12 }, (_, i) => ({ x: 50 + Math.cos(i / 12 * 2 * Math.PI) * 20, y: 50 + Math.sin(i / 12 * 2 * Math.PI) * 20, vx: 0, vy: 0, type: 'p' })),
        neutrons: Array.from({ length: 12 }, (_, i) => ({ x: 50 + Math.cos(i / 12 * 2 * Math.PI) * 14, y: 50 + Math.sin(i / 12 * 2 * Math.PI) * 14, vx: 0, vy: 0, type: 'n' })),
        emitted: [],
        frame: 0,
    })
    const rafRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')

        const dt = DECAY_TYPES[decayType] || DECAY_TYPES['α']
        const col = dt.color

        const draw = () => {
            ctx.clearRect(0, 0, 100, 100)
            const s = stateRef.current

            s.frame++

            // Nucleus glow
            const grad = ctx.createRadialGradient(50, 50, 0, 50, 50, 28)
            grad.addColorStop(0, `${col}50`)
            grad.addColorStop(1, 'transparent')
            ctx.fillStyle = grad
            ctx.beginPath(); ctx.arc(50, 50, 28, 0, Math.PI * 2); ctx.fill()

            // Protons
            s.protons.forEach(p => {
                p.x += Math.sin(s.frame * 0.07 + p.x) * 0.25
                p.y += Math.cos(s.frame * 0.05 + p.y) * 0.25
                ctx.fillStyle = '#D85A30'
                ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2); ctx.fill()
            })

            // Neutrons
            s.neutrons.forEach(n => {
                n.x += Math.cos(s.frame * 0.06 + n.y) * 0.2
                n.y += Math.sin(s.frame * 0.08 + n.x) * 0.2
                ctx.fillStyle = '#888780'
                ctx.beginPath(); ctx.arc(n.x, n.y, 4, 0, Math.PI * 2); ctx.fill()
            })

            // Emitted particles flying out
            s.emitted = s.emitted.filter(e => {
                e.x += e.vx; e.y += e.vy
                e.alpha -= 0.015
                if (e.alpha <= 0) return false
                ctx.globalAlpha = e.alpha
                ctx.fillStyle = e.color
                ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill()
                ctx.globalAlpha = 1
                return true
            })

            // Trigger emission periodically
            if (active && s.frame % 90 === 0) {
                const angle = Math.random() * Math.PI * 2
                const speed = 1.2 + Math.random() * 0.8
                if (decayType === 'α') {
                    s.emitted.push({ x: 50, y: 50, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color: '#EF9F27', r: 6, alpha: 1 })
                    s.emitted.push({ x: 50, y: 50, vx: Math.cos(angle + 0.1) * speed * 0.9, vy: Math.sin(angle + 0.1) * speed * 0.9, color: '#EF9F27', r: 6, alpha: 1 })
                } else if (decayType === 'β' || decayType === 'β+γ') {
                    s.emitted.push({ x: 50, y: 50, vx: Math.cos(angle) * speed * 1.8, vy: Math.sin(angle) * speed * 1.8, color: '#1D9E75', r: 3, alpha: 1 })
                    if (decayType === 'β+γ') {
                        s.emitted.push({ x: 50, y: 50, vx: Math.cos(angle + Math.PI) * speed * 2.2, vy: Math.sin(angle + Math.PI) * speed * 2.2, color: '#378ADD', r: 2, alpha: 1 })
                    }
                } else if (decayType === 'γ') {
                    for (let i = 0; i < 4; i++) {
                        const a2 = angle + i * Math.PI / 2
                        s.emitted.push({ x: 50, y: 50, vx: Math.cos(a2) * speed * 2.5, vy: Math.sin(a2) * speed * 2.5, color: '#888780', r: 2, alpha: 1 })
                    }
                }
                onDecay && onDecay()
            }

            rafRef.current = requestAnimationFrame(draw)
        }
        rafRef.current = requestAnimationFrame(draw)
        return () => cancelAnimationFrame(rafRef.current)
    }, [decayType, active])

    return <canvas ref={canvasRef} width={100} height={100} style={{ display: 'block', width: '100%' }} />
}

export default function Radioactivity() {
    const [mode, setMode] = useState('types')   // types | penetration | chain
    const [decay, setDecay] = useState('α')
    const [active, setActive] = useState(false)
    const [counts, setCounts] = useState(0)

    const dt = DECAY_TYPES[decay]

    const handleDecay = () => setCounts(p => p + 1)

    const PENETRATION_LAYERS = [
        { label: 'Paper', stops: ['α'], col: '#FAC775', thickness: 4 },
        { label: 'Skin (5mm)', stops: ['α'], col: '#D85A30', thickness: 8 },
        { label: 'Al foil (3mm)', stops: ['α', 'β', 'β+γ'], col: '#888780', thickness: 14 },
        { label: 'Lead (5cm)', stops: ['α', 'β', 'β+γ', 'γ'], col: '#444441', thickness: 22 },
    ]

    return (
        <div>
            {/* Mode selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'types', l: 'Decay types' }, { k: 'penetration', l: 'Penetration power' }, { k: 'chain', l: 'Decay chain' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--coral)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── DECAY TYPES ── */}
            {mode === 'types' && (
                <div>
                    {/* Decay type selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.keys(DECAY_TYPES).map(k => (
                            <button key={k} onClick={() => { setDecay(k); setCounts(0); setActive(false) }} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 14,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: decay === k ? DECAY_TYPES[k].color : 'var(--bg3)',
                                color: decay === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${decay === k ? DECAY_TYPES[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, marginBottom: 14 }}>
                        {/* Animated nucleus */}
                        <div style={{ background: 'rgba(0,0,0,0.3)', border: `2px solid ${dt.color}40`, borderRadius: 12, padding: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: dt.color, letterSpacing: 2, marginBottom: 6, textAlign: 'center' }}>
                                NUCLEUS
                            </div>
                            <NucleusAnimation decayType={decay} active={active} onDecay={handleDecay} />
                            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                <button onClick={() => setActive(p => !p)} style={{
                                    flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: active ? `${dt.color}20` : 'var(--bg3)',
                                    color: active ? dt.color : 'var(--text3)',
                                    border: `1px solid ${active ? dt.color : 'var(--border)'}`,
                                }}>{active ? '⏸' : '▶'}</button>
                                <button onClick={() => setCounts(0)} style={{
                                    flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                                    fontFamily: 'var(--mono)', cursor: 'pointer',
                                    background: 'var(--bg3)', color: 'var(--text3)',
                                    border: '1px solid var(--border)',
                                }}>↺</button>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: 6, fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: dt.color }}>
                                {counts} decays
                            </div>
                        </div>

                        {/* Properties */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <div style={{ padding: '10px 14px', background: `${dt.color}12`, border: `1px solid ${dt.color}35`, borderRadius: 10 }}>
                                <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: dt.color, marginBottom: 4 }}>{dt.name}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>{dt.desc}</div>
                            </div>

                            {[
                                { label: 'Particle emitted', val: dt.particle, col: dt.color },
                                { label: 'ΔZ', val: dt.chargeChange >= 0 ? `+${dt.chargeChange}` : `${dt.chargeChange}`, col: dt.chargeChange > 0 ? 'var(--teal)' : dt.chargeChange < 0 ? 'var(--coral)' : 'var(--text3)' },
                                { label: 'ΔA', val: dt.massChange, col: 'var(--text2)' },
                                { label: 'Stopped by', val: dt.stoppedBy, col: 'var(--gold)' },
                                { label: 'Example', val: dt.example, col: dt.color },
                                { label: 'Biological risk', val: dt.biology, col: 'var(--coral)' },
                            ].map(p => (
                                <div key={p.label} style={{ display: 'flex', gap: 8, padding: '6px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 100, flexShrink: 0 }}>{p.label}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: p.col, lineHeight: 1.4 }}>{p.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── PENETRATION ── */}
            {mode === 'penetration' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        Radiation penetrating power: <strong style={{ color: 'var(--text1)' }}>γ &gt;&gt; β &gt; α</strong>. Ionising power is the reverse: <strong style={{ color: 'var(--text1)' }}>α &gt;&gt; β &gt; γ</strong>. Select a radiation type and see which barriers stop it.
                    </div>

                    {/* Type selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.keys(DECAY_TYPES).map(k => (
                            <button key={k} onClick={() => setDecay(k)} style={{
                                flex: 1, padding: '7px', borderRadius: 8, fontSize: 13,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: decay === k ? DECAY_TYPES[k].color : 'var(--bg3)',
                                color: decay === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${decay === k ? DECAY_TYPES[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Penetration diagram — horizontal beam + barriers */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <svg viewBox="0 0 420 130" width="100%" style={{ display: 'block' }}>
                            {/* Source */}
                            <rect x={8} y={50} width={30} height={36} rx={6}
                                fill={`${dt.color}25`} stroke={dt.color} strokeWidth={1.5} />
                            <text x={23} y={71} textAnchor="middle"
                                style={{ fontSize: 9, fill: dt.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>src</text>
                            <text x={23} y={95} textAnchor="middle"
                                style={{ fontSize: 11, fill: dt.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>{decay}</text>

                            {/* Beam and barriers */}
                            {(() => {
                                let x = 40
                                let blocked = false
                                const elements = []

                                PENETRATION_LAYERS.forEach((layer, i) => {
                                    const bx = x + 10
                                    const isBlocking = layer.stops.includes(decay)

                                    // Beam before this barrier
                                    if (!blocked) {
                                        elements.push(
                                            <line key={`beam${i}`} x1={x} y1={68} x2={bx} y2={68}
                                                stroke={dt.color} strokeWidth={3}
                                                opacity={0.7} />
                                        )
                                    }

                                    // Barrier
                                    elements.push(
                                        <rect key={`bar${i}`} x={bx} y={30} width={layer.thickness} height={76} rx={2}
                                            fill={isBlocking && !blocked ? `${layer.col}50` : `${layer.col}20`}
                                            stroke={layer.col} strokeWidth={1.5} />
                                    )
                                    elements.push(
                                        <text key={`lbl${i}`} x={bx + layer.thickness / 2} y={122} textAnchor="middle"
                                            style={{ fontSize: 7, fill: layer.col, fontFamily: 'var(--mono)' }}>
                                            {layer.label.split('(')[0].trim()}
                                        </text>
                                    )

                                    // Stop marker
                                    if (isBlocking && !blocked) {
                                        elements.push(
                                            <text key={`stop${i}`} x={bx + layer.thickness / 2} y={20} textAnchor="middle"
                                                style={{ fontSize: 10, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                                STOPPED
                                            </text>
                                        )
                                        elements.push(
                                            <line key={`stop_line${i}`} x1={bx + layer.thickness / 2} y1={24} x2={bx + layer.thickness / 2} y2={34}
                                                stroke="var(--coral)" strokeWidth={1.5} />
                                        )
                                        blocked = true
                                    }

                                    x = bx + layer.thickness + 8
                                })

                                // Beam after all barriers (if not blocked)
                                if (!blocked) {
                                    elements.push(
                                        <g key="passthrough">
                                            <line x1={x} y1={68} x2={400} y2={68}
                                                stroke={dt.color} strokeWidth={3} opacity={0.7} />
                                            <text x={400} y={62} textAnchor="end"
                                                style={{ fontSize: 9, fill: dt.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                                passes through!
                                            </text>
                                        </g>
                                    )
                                }

                                return elements
                            })()}
                        </svg>
                    </div>

                    {/* Penetrating power comparison bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            PENETRATING POWER (relative)
                        </div>
                        {[
                            { k: 'α', pow: 1, ion: 100, col: '#EF9F27' },
                            { k: 'β', pow: 20, ion: 20, col: '#1D9E75' },
                            { k: 'β+γ', pow: 50, ion: 15, col: '#378ADD' },
                            { k: 'γ', pow: 100, ion: 1, col: '#888780' },
                        ].map(row => (
                            <div key={row.k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col, minWidth: 28 }}>{row.k}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>Penetrating ↑</div>
                                    <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden', marginBottom: 3 }}>
                                        <div style={{ height: '100%', width: `${row.pow}%`, background: row.col, borderRadius: 5 }} />
                                    </div>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>Ionising ↑</div>
                                    <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${row.ion}%`, background: `${row.col}80`, borderRadius: 5 }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── DECAY CHAIN ── */}
            {mode === 'chain' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Uranium-238 decay chain</strong> — 8 alpha and 6 beta decays ending at stable <strong style={{ color: '#A8D8B9' }}>Pb-206</strong>.
                        Total energy released over 4.47 billion years.
                    </div>

                    {/* Chain diagram — Z vs A plot */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14, overflowX: 'auto' }}>
                        <svg viewBox="0 0 420 200" width="100%" style={{ display: 'block' }}>
                            {/* Axes */}
                            <line x1={40} y1={10} x2={40} y2={175} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <line x1={40} y1={175} x2={410} y2={175} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <text x={36} y={14} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Z↑</text>
                            <text x={410} y={185} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>A→</text>

                            {/* Grid lines */}
                            {[82, 84, 86, 88, 90, 92].map(z => {
                                const y = 175 - ((z - 80) / 14) * 160
                                return (
                                    <g key={z}>
                                        <line x1={40} y1={y} x2={410} y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
                                        <text x={36} y={y + 3} textAnchor="end" style={{ fontSize: 8, fill: 'rgba(160,176,200,0.25)', fontFamily: 'var(--mono)' }}>{z}</text>
                                    </g>
                                )
                            })}

                            {(() => {
                                const chain = DECAY_CHAIN_U238
                                const A_MIN = 200, A_MAX = 240, Z_MIN = 80, Z_MAX = 94
                                const toX = A => 44 + ((A - A_MIN) / (A_MAX - A_MIN)) * 360
                                const toY = Z => 175 - ((Z - Z_MIN) / (Z_MAX - Z_MIN)) * 160

                                return (
                                    <g>
                                        {/* Decay arrows */}
                                        {chain.slice(0, -1).map((iso, i) => {
                                            const next = chain[i + 1]
                                            const x1 = toX(iso.A), y1 = toY(iso.Z)
                                            const x2 = toX(next.A), y2 = toY(next.Z)
                                            const isAlpha = iso.type === 'α'
                                            return (
                                                <g key={i}>
                                                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                                                        stroke={iso.col} strokeWidth={1.5}
                                                        strokeDasharray={isAlpha ? 'none' : '4 3'}
                                                        markerEnd="url(#arrow)" />
                                                    <text x={(x1 + x2) / 2 + (isAlpha ? 4 : -4)} y={(y1 + y2) / 2}
                                                        style={{ fontSize: 8, fill: iso.col, fontFamily: 'var(--mono)' }}>
                                                        {iso.type}
                                                    </text>
                                                </g>
                                            )
                                        })}

                                        {/* Isotope dots */}
                                        {chain.map((iso, i) => (
                                            <g key={iso.iso}>
                                                <circle cx={toX(iso.A)} cy={toY(iso.Z)} r={iso.iso === 'Pb-206' ? 7 : 6}
                                                    fill={`${iso.col}30`} stroke={iso.col} strokeWidth={1.5} />
                                                <text x={toX(iso.A)} y={toY(iso.Z) - 9} textAnchor="middle"
                                                    style={{ fontSize: 8, fill: iso.col, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                                    {iso.iso.split('-')[0]}
                                                </text>
                                            </g>
                                        ))}

                                        <defs>
                                            <marker id="arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={4} markerHeight={4} orient="auto">
                                                <path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth={2} />
                                            </marker>
                                        </defs>
                                    </g>
                                )
                            })()}
                        </svg>
                    </div>

                    {/* Chain table */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {DECAY_CHAIN_U238.map((iso, i) => (
                            <div key={iso.iso} style={{
                                display: 'flex', alignItems: 'center', gap: 10, padding: '6px 12px',
                                background: iso.iso === 'Pb-206' ? 'rgba(168,216,185,0.08)' : 'var(--bg3)',
                                border: `1px solid ${iso.iso === 'Pb-206' ? 'rgba(168,216,185,0.3)' : 'var(--border)'}`,
                                borderRadius: 8,
                            }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${iso.col}25`, border: `1.5px solid ${iso.col}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: iso.col }}>
                                    {i + 1}
                                </div>
                                <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: iso.col, minWidth: 60 }}>{iso.iso}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 40 }}>Z={iso.Z}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 40 }}>A={iso.A}</span>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', flex: 1 }}>t½ = {iso.t}</span>
                                {iso.type !== '—' && (
                                    <span style={{
                                        fontSize: 10, fontFamily: 'var(--mono)', padding: '1px 8px', borderRadius: 20,
                                        background: `${iso.col}20`, color: iso.col,
                                        border: `1px solid ${iso.col}40`,
                                    }}>{iso.type}</span>
                                )}
                                {iso.iso === 'Pb-206' && (
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', fontWeight: 700 }}>STABLE</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Decay type" value={dt?.name} color={dt?.color} highlight />
                <ValueCard label="Particle" value={dt?.particle} color={dt?.color} />
                <ValueCard label="ΔZ" value={dt?.chargeChange >= 0 ? `+${dt?.chargeChange}` : `${dt?.chargeChange}`} color="var(--gold)" />
                <ValueCard label="Stopped by" value={dt?.stoppedBy} color="var(--teal)" />
            </div>
        </div>
    )
}