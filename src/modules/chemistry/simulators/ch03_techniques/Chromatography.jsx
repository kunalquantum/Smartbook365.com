import { useState, useEffect, useRef } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

// Each compound: affinity to stationary (0=low=moves fast, 1=high=moves slow)
const MIXTURES = {
    'Ink (3 dyes)': {
        compounds: [
            { name: 'Yellow dye', color: '#EF9F27', affinity: 0.2 },
            { name: 'Blue dye', color: '#378ADD', affinity: 0.55 },
            { name: 'Red dye', color: '#D85A30', affinity: 0.82 },
        ],
    },
    'Plant pigments': {
        compounds: [
            { name: 'β-carotene', color: '#EF9F27', affinity: 0.15 },
            { name: 'Chlorophyll b', color: '#1D9E75', affinity: 0.45 },
            { name: 'Chlorophyll a', color: '#639922', affinity: 0.60 },
            { name: 'Xanthophyll', color: '#FAC775', affinity: 0.78 },
        ],
    },
    'Amino acids': {
        compounds: [
            { name: 'Glycine', color: '#E8F5EF', affinity: 0.30 },
            { name: 'Alanine', color: '#1D9E75', affinity: 0.50 },
            { name: 'Leucine', color: '#7F77DD', affinity: 0.72 },
        ],
    },
}

const PLATE_H = 280   // SVG height of TLC plate
const PLATE_W = 80    // plate width px
const ORIGIN_Y = 240   // y of origin line (bottom)
const TOP_Y = 30    // top of plate

export default function Chromatography() {
    const [mixture, setMixture] = useState('Ink (3 dyes)')
    const [polarity, setPolarity] = useState(5)   // mobile phase polarity 1-10
    const [running, setRunning] = useState(false)
    const [solventY, setSolventY] = useState(ORIGIN_Y)  // current solvent front y (decreasing = rising)

    const rafRef = useRef(null)
    const lastRef = useRef(null)
    const tRef = useRef(0)
    const [tick, setTick] = useState(0)

    const mix = MIXTURES[mixture]

    useEffect(() => {
        setSolventY(ORIGIN_Y); setRunning(false)
        tRef.current = 0; lastRef.current = null
    }, [mixture])

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setSolventY(y => {
                const next = y - 0.8
                if (next <= TOP_Y + 10) { setRunning(false); return TOP_Y + 10 }
                return next
            })
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running])

    // Distance solvent has travelled from origin
    const solventDist = ORIGIN_Y - solventY
    const totalDist = ORIGIN_Y - TOP_Y - 10

    // Spot position for each compound
    // Rf = distance_compound / distance_solvent
    // Higher polarity mobile phase → more polar compounds move faster (lower affinity in stationary)
    const spots = mix.compounds.map(c => {
        // Polarity factor: high polarity solvent elutes more strongly
        const polarityFactor = polarity / 10
        // Effective Rf: compounds with low affinity to stationary phase move faster
        const effectiveRf = (1 - c.affinity) * (0.5 + polarityFactor * 0.5)
        const spotY = ORIGIN_Y - solventDist * effectiveRf
        const finalRf = solventDist > 0 ? (ORIGIN_Y - spotY) / solventDist : 0

        return {
            ...c,
            effectiveRf,
            spotY: Math.max(TOP_Y + 8, spotY),
            displayRf: Math.min(0.99, Math.max(0.01, finalRf)),
        }
    })

    const PLATE_X_START = 80

    return (
        <div>
            {/* Mixture selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MIXTURES).map(k => (
                    <button key={k} onClick={() => setMixture(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mixture === k ? 'var(--teal)' : 'var(--bg3)',
                        color: mixture === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mixture === k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <ChemSlider label="Mobile phase polarity" unit="/10" value={polarity} min={1} max={10} step={0.5}
                onChange={v => { setPolarity(v); setSolventY(ORIGIN_Y); setRunning(false); tRef.current = 0; lastRef.current = null }}
                color="var(--purple)" />

            <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, marginBottom: 14 }}>

                {/* TLC plate SVG */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 8 }}>
                        TLC PLATE
                    </div>
                    <svg viewBox={`0 0 ${PLATE_W + 60} ${PLATE_H}`} width="100%">
                        {/* Solvent reservoir at bottom */}
                        <rect x={0} y={PLATE_H - 24} width={PLATE_W + 60} height={24}
                            rx={4} fill="rgba(127,119,221,0.15)"
                            stroke="rgba(127,119,221,0.35)" strokeWidth={1} />
                        <text x={(PLATE_W + 60) / 2} y={PLATE_H - 10} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>
                            solvent
                        </text>

                        {/* Silica plate */}
                        <rect x={PLATE_X_START - PLATE_W / 2} y={TOP_Y} width={PLATE_W} height={ORIGIN_Y - TOP_Y}
                            rx={3} fill="rgba(244,235,200,0.08)"
                            stroke="rgba(244,235,200,0.2)" strokeWidth={1} />

                        {/* Solvent front */}
                        {solventDist > 2 && (
                            <g>
                                <line
                                    x1={PLATE_X_START - PLATE_W / 2} y1={solventY}
                                    x2={PLATE_X_START + PLATE_W / 2} y2={solventY}
                                    stroke="rgba(127,119,221,0.7)" strokeWidth={1.5}
                                    strokeDasharray="4 3" />
                                <text x={PLATE_X_START + PLATE_W / 2 + 6} y={solventY + 3}
                                    style={{ fontSize: 8, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>
                                    SF
                                </text>
                            </g>
                        )}

                        {/* Origin line */}
                        <line
                            x1={PLATE_X_START - PLATE_W / 2} y1={ORIGIN_Y}
                            x2={PLATE_X_START + PLATE_W / 2} y2={ORIGIN_Y}
                            stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 2" />
                        <text x={PLATE_X_START + PLATE_W / 2 + 6} y={ORIGIN_Y + 3}
                            style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>
                            origin
                        </text>

                        {/* Compound spots */}
                        {spots.map((s, i) => {
                            const cx = PLATE_X_START - 20 + i * (PLATE_W / (spots.length + 1))
                            return (
                                <g key={s.name}>
                                    {/* Trail */}
                                    <line x1={cx} y1={ORIGIN_Y} x2={cx} y2={s.spotY}
                                        stroke={`${s.color}20`} strokeWidth={2} />
                                    {/* Spot */}
                                    <ellipse cx={cx} cy={s.spotY} rx={8} ry={5}
                                        fill={`${s.color}60`}
                                        stroke={s.color} strokeWidth={1.5} />
                                    {/* Starting spot (origin) */}
                                    <ellipse cx={cx} cy={ORIGIN_Y} rx={6} ry={4}
                                        fill={`${s.color}25`}
                                        stroke={`${s.color}50`} strokeWidth={0.8} />
                                </g>
                            )
                        })}

                        {/* Plate label */}
                        <text x={(PLATE_W + 60) / 2} y={TOP_Y - 6} textAnchor="middle"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                            silica gel (stationary)
                        </text>
                    </svg>

                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button onClick={() => setRunning(p => !p)} style={{
                            flex: 1, padding: '5px', borderRadius: 6, fontSize: 10,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: running ? 'rgba(216,90,48,0.15)' : 'rgba(29,158,117,0.12)',
                            color: running ? 'var(--coral)' : 'var(--teal)',
                            border: `1px solid ${running ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.3)'}`,
                        }}>{running ? '⏸' : '▶ Run'}</button>
                        <button onClick={() => { setSolventY(ORIGIN_Y); setRunning(false); tRef.current = 0; lastRef.current = null }} style={{
                            padding: '5px 8px', borderRadius: 6, fontSize: 10,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                        }}>↺</button>
                    </div>
                </div>

                {/* Rf table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 4 }}>
                        Rf VALUE ANALYSIS
                    </div>

                    {spots.map(s => {
                        const spotDist = Math.max(0, ORIGIN_Y - s.spotY)
                        return (
                            <div key={s.name} style={{
                                padding: '10px 14px',
                                background: `${s.color}10`,
                                border: `1px solid ${s.color}30`,
                                borderRadius: 8,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 12, height: 12, borderRadius: '50%',
                                            background: s.color, flexShrink: 0,
                                        }} />
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: s.color }}>
                                            {s.name}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: s.color }}>
                                        Rf = {s.displayRf.toFixed(3)}
                                    </span>
                                </div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                    Stationary phase affinity: {(s.affinity * 100).toFixed(0)}%
                                </div>
                                {/* Rf bar */}
                                <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', width: `${s.displayRf * 100}%`,
                                        background: s.color, borderRadius: 4,
                                        transition: 'width 0.1s',
                                    }} />
                                </div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>
                                    Spot: {spotDist.toFixed(0)}px  ·  Solvent: {solventDist.toFixed(0)}px
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ padding: '8px 12px', background: 'rgba(212,160,23,0.08)', borderRadius: 8, border: '1px solid rgba(212,160,23,0.2)', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                        Rf = distance of spot / distance of solvent front
                        <br />0 &lt; Rf &lt; 1 — unique for each compound in a given system
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Solvent front" value={`${solventDist.toFixed(0)}px`} color="var(--purple)" />
                <ValueCard label="Compounds" value={`${mix.compounds.length}`} color="var(--teal)" />
                <ValueCard label="Mobile phase polarity" value={`${polarity}/10`} color="var(--purple)" />
                <ValueCard label="Stationary phase" value="silica gel" color="var(--text3)" />
            </div>
        </div>
    )
}