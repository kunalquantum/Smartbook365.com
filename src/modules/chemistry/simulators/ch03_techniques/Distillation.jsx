import { useState, useEffect, useRef } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const MIXTURES = {
    'Water + Ethanol': {
        components: [
            { name: 'Ethanol', bp: 78.4, color: '#EF9F27', desc: 'More volatile — distils first' },
            { name: 'Water', bp: 100.0, color: '#378ADD', desc: 'Less volatile — distils second' },
        ],
        type: 'simple',
    },
    'Petroleum fractions': {
        components: [
            { name: 'LPG', bp: 30, color: '#1D9E75', desc: 'First fraction' },
            { name: 'Petrol', bp: 120, color: '#EF9F27', desc: 'Second fraction' },
            { name: 'Kerosene', bp: 200, color: '#D85A30', desc: 'Third fraction' },
            { name: 'Diesel', bp: 300, color: '#888780', desc: 'Last fraction' },
        ],
        type: 'fractional',
    },
    'Acetone + Water': {
        components: [
            { name: 'Acetone', bp: 56.1, color: '#7F77DD', desc: 'Low BP — first to distil' },
            { name: 'Water', bp: 100, color: '#378ADD', desc: 'Remains in flask' },
        ],
        type: 'simple',
    },
}

export default function Distillation() {
    const [mixture, setMixture] = useState('Water + Ethanol')
    const [heatT, setHeatT] = useState(20)
    const [running, setRunning] = useState(false)
    const [collected, setCollected] = useState({})

    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const tRef = useRef(0)
    const [tick, setTick] = useState(0)

    const mix = MIXTURES[mixture]

    useEffect(() => {
        setHeatT(20); setCollected({}); setRunning(false)
        tRef.current = 0; lastRef.current = null
    }, [mixture])

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setHeatT(t => {
                const next = Math.min(t + 0.4, mix.components[mix.components.length - 1].bp + 10)
                // collect component when T crosses its BP
                mix.components.forEach(c => {
                    if (next >= c.bp && t < c.bp) {
                        setCollected(prev => ({ ...prev, [c.name]: true }))
                    }
                })
                return next
            })
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, mix])

    // Current boiling component
    const boilingNow = mix.components.find(c => Math.abs(heatT - c.bp) < 8)
    const nCollected = Object.keys(collected).length

    // Flask fill — decreases as fractions distil
    const flaskFill = 1 - nCollected / mix.components.length

    // Vapour dots
    const vapDots = (boilingNow && running) ? Array.from({ length: 6 }, (_, i) => ({
        x: 160 + Math.sin(Date.now() / 400 + i * 1.1) * 6,
        y: 110 - i * 12,
        opacity: Math.max(0, 1 - i * 0.15),
    })) : []

    return (
        <div>
            {/* Mixture selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MIXTURES).map(k => (
                    <button key={k} onClick={() => setMixture(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mixture === k ? 'var(--coral)' : 'var(--bg3)',
                        color: mixture === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mixture === k ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Type badge */}
            <div style={{ marginBottom: 14 }}>
                <span style={{
                    fontSize: 10, fontFamily: 'var(--mono)', padding: '3px 10px', borderRadius: 20,
                    background: mix.type === 'fractional' ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.15)',
                    color: mix.type === 'fractional' ? 'var(--coral)' : 'var(--teal)',
                    border: `1px solid ${mix.type === 'fractional' ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
                }}>
                    {mix.type === 'fractional' ? 'Fractional distillation' : 'Simple distillation'}
                </span>
            </div>

            {/* Main apparatus */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* Distillation flask */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ DISTILLATION FLASK
                    </div>
                    <svg viewBox="0 0 160 180" width="100%">
                        {/* Flask body */}
                        <circle cx={80} cy={100} r={55}
                            fill="rgba(55,138,221,0.05)"
                            stroke="rgba(55,138,221,0.25)" strokeWidth={1.5} />

                        {/* Liquid fill */}
                        <clipPath id="flaskClip">
                            <circle cx={80} cy={100} r={53} />
                        </clipPath>
                        <rect x={27} y={100 + 53 * (1 - flaskFill) - 53}
                            width={106} height={53 * flaskFill + 53}
                            fill={`${mix.components[0].color}20`}
                            clipPath="url(#flaskClip)" />

                        {/* Component layers */}
                        {mix.components.map((c, i) => {
                            if (collected[c.name]) return null
                            const layerH = (53 * flaskFill * 2) / mix.components.filter(x => !collected[x.name]).length
                            const layerY = 100 + 53 * (1 - flaskFill) - 53 + i * layerH
                            return (
                                <rect key={c.name}
                                    x={28} y={Math.max(50, layerY)}
                                    width={104} height={Math.min(layerH, 40)}
                                    fill={`${c.color}25`}
                                    clipPath="url(#flaskClip)" />
                            )
                        })}

                        {/* Flask neck */}
                        <rect x={72} y={45} width={16} height={40}
                            fill="rgba(55,138,221,0.08)"
                            stroke="rgba(55,138,221,0.25)" strokeWidth={1.5} />

                        {/* Side arm */}
                        <line x1={88} y1={55} x2={130} y2={40}
                            stroke="rgba(55,138,221,0.4)" strokeWidth={2} />

                        {/* Vapour dots */}
                        {vapDots.map((d, i) => (
                            <circle key={i} cx={d.x} cy={d.y} r={3}
                                fill={boilingNow?.color || 'var(--teal)'}
                                opacity={d.opacity * 0.8} />
                        ))}

                        {/* Stopper */}
                        <rect x={70} y={42} width={20} height={6}
                            rx={2} fill="rgba(239,159,39,0.4)"
                            stroke="var(--gold)" strokeWidth={0.8} />

                        {/* Heat source */}
                        {running && (
                            <g>
                                {[0, 1, 2].map(i => (
                                    <path key={i}
                                        d={`M ${55 + i * 15} 165 Q ${57 + i * 15} 158 ${59 + i * 15} 165`}
                                        fill="none" stroke={i % 2 ? 'var(--coral)' : 'var(--gold)'}
                                        strokeWidth={2} strokeLinecap="round" />
                                ))}
                            </g>
                        )}

                        {/* Temperature */}
                        <text x={80} y={174} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {heatT.toFixed(0)}°C
                        </text>

                        {/* Boiling indicator */}
                        {boilingNow && (
                            <text x={80} y={100} textAnchor="middle"
                                style={{ fontSize: 8, fill: boilingNow.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                {boilingNow.name} boiling!
                            </text>
                        )}
                    </svg>
                </div>

                {/* Condenser + collection */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ CONDENSER & COLLECTION
                    </div>

                    {/* Collected fractions */}
                    <div style={{ marginBottom: 12 }}>
                        {mix.components.map((c, i) => (
                            <div key={c.name} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '8px 10px', marginBottom: 6,
                                background: `${c.color}${collected[c.name] ? '18' : '08'}`,
                                border: `1px solid ${c.color}${collected[c.name] ? '50' : '20'}`,
                                borderRadius: 8, transition: 'all 0.3s',
                            }}>
                                <div style={{
                                    width: 12, height: 12, borderRadius: '50%',
                                    background: collected[c.name] ? c.color : 'transparent',
                                    border: `2px solid ${c.color}`,
                                    flexShrink: 0,
                                }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: c.color }}>
                                        {c.name}
                                    </div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                        BP: {c.bp}°C  ·  {c.desc}
                                    </div>
                                </div>
                                {collected[c.name] && (
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: c.color }}>
                                        ✓ collected
                                    </span>
                                )}
                                {!collected[c.name] && heatT >= c.bp - 5 && (
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', animation: 'pulse 0.5s infinite' }}>
                                        distilling…
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Temperature gauge */}
                    <div style={{ marginTop: 8 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                            TEMPERATURE PROGRESS
                        </div>
                        <div style={{ position: 'relative', height: 16, background: 'var(--bg3)', borderRadius: 8, overflow: 'visible', marginBottom: 16 }}>
                            <div style={{
                                height: '100%', borderRadius: 8, transition: 'width 0.2s',
                                background: `linear-gradient(90deg, var(--teal), var(--gold), var(--coral))`,
                                width: `${Math.min(100, (heatT / (mix.components[mix.components.length - 1].bp + 10)) * 100)}%`,
                            }} />
                            {/* BP markers */}
                            {mix.components.map(c => {
                                const pct = (c.bp / (mix.components[mix.components.length - 1].bp + 10)) * 100
                                return (
                                    <div key={c.name} style={{
                                        position: 'absolute', top: -16, left: `${pct}%`,
                                        transform: 'translateX(-50%)',
                                        fontSize: 8, fontFamily: 'var(--mono)', color: c.color,
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {c.bp}°
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => setRunning(p => !p)} style={{
                    flex: 1, padding: '8px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: running ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.12)',
                    color: running ? 'var(--coral)' : 'var(--gold)',
                    border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(239,159,39,0.3)'}`,
                }}>{running ? '⏸ Stop heating' : '🔥 Start heating'}</button>
                <button onClick={() => { setHeatT(20); setCollected({}); setRunning(false); tRef.current = 0; lastRef.current = null }} style={{
                    padding: '8px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Temperature" value={`${heatT.toFixed(0)}°C`} color="var(--coral)" highlight />
                <ValueCard label="Fractions collected" value={`${nCollected}/${mix.components.length}`} color="var(--teal)" />
                <ValueCard label="Method" value={mix.type} color="var(--text2)" />
                {boilingNow && <ValueCard label="Currently distilling" value={boilingNow.name} color={boilingNow.color} />}
            </div>
        </div>
    )
}