import { useState, useEffect, useRef } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const NA = 6.022e23

const SUBSTANCES = {
    'H₂O': { M: 18.015, state: 'liquid' },
    'NaCl': { M: 58.44, state: 'solid' },
    'CO₂ (g)': { M: 44.01, state: 'gas' },
    'Fe': { M: 55.845, state: 'solid' },
    'O₂ (g)': { M: 32.00, state: 'gas' },
    'CaCO₃': { M: 100.09, state: 'solid' },
    'Glucose': { M: 180.16, state: 'solid' },
    'NH₃ (g)': { M: 17.031, state: 'gas' },
}

const STATE_COLORS = { gas: '#1D9E75', liquid: '#378ADD', solid: '#7F77DD' }

export default function MoleConcept() {
    const [sub, setSub] = useState('H₂O')
    const [moles, setMoles] = useState(1)
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const t = tRef.current
    const data = SUBSTANCES[sub]
    const M = data.M

    const mass = moles * M
    const particles = moles * NA
    const volume = moles * 22.4

    const sColor = STATE_COLORS[data.state]

    // Particle dots — capped at 60 for clean layout
    const nDots = Math.min(60, Math.max(1, Math.round(moles * 12)))
    const dots = Array.from({ length: nDots }, (_, i) => {
        const angle = (i / nDots) * 2 * Math.PI
        const r = 34 + 22 * ((i * 0.618) % 1)
        return {
            x: 68 + r * Math.cos(angle + t * 0.15),
            y: 68 + r * Math.sin(angle + t * 0.15),
        }
    })

    return (
        <div>
            {/* Substance selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(SUBSTANCES).map(k => (
                    <button key={k} onClick={() => setSub(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: sub === k ? sColor : 'var(--bg3)',
                        color: sub === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${sub === k ? sColor : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            <ChemSlider label="Number of moles" unit=" mol" value={moles} min={0.1} max={10} step={0.1}
                onChange={setMoles} color={sColor} precision={2} />

            {/* Two-column layout: particle cloud | conversion chain */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16, marginBottom: 16 }}>

                {/* Left: animated particle cloud */}
                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                    <svg viewBox="0 0 136 136" width="100%">
                        {/* Outer ring */}
                        <circle cx={68} cy={68} r={60}
                            fill="none"
                            stroke={`${sColor}20`} strokeWidth={1} strokeDasharray="4 4" />
                        {/* Dots */}
                        {dots.map((d, i) => (
                            <circle key={i} cx={d.x} cy={d.y} r={3.5}
                                fill={sColor} opacity={0.75} />
                        ))}
                        {/* Centre label */}
                        <text x={68} y={65} textAnchor="middle"
                            style={{ fontSize: 12, fill: 'var(--text1)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {moles.toFixed(1)}
                        </text>
                        <text x={68} y={78} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                            mol
                        </text>
                    </svg>
                    <div style={{ textAlign: 'center', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', paddingBottom: 8 }}>
                        {nDots} dots shown
                    </div>
                </div>

                {/* Right: conversion chain */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 0 }}>
                    {[
                        { val: `${mass.toFixed(4)} g`, label: 'mass  m = n × M', color: 'var(--gold)', border: true },
                        { val: `÷ ${M.toFixed(3)} g/mol`, label: 'molar mass M', color: 'var(--text3)', border: false, small: true },
                        { val: `${moles.toFixed(4)} mol`, label: 'moles  n = m / M', color: sColor, border: true },
                        { val: `× 6.022 × 10²³`, label: "Avogadro's number", color: 'var(--text3)', border: false, small: true },
                        { val: `${particles.toExponential(3)}`, label: 'particles  N = n × Nₐ', color: 'var(--purple)', border: true },
                        ...(data.state === 'gas' ? [
                            { val: `× 22.4 L/mol`, label: 'molar volume (STP)', color: 'var(--text3)', border: false, small: true },
                            { val: `${volume.toFixed(3)} L`, label: 'volume at STP', color: '#378ADD', border: true },
                        ] : []),
                    ].map((row, i) => (
                        <div key={i} style={{
                            padding: row.small ? '2px 12px' : '8px 12px',
                            background: row.border ? 'var(--bg3)' : 'transparent',
                            border: row.border ? '1px solid var(--border)' : 'none',
                            borderRadius: row.border ? 8 : 0,
                            marginBottom: row.border ? 4 : 0,
                        }}>
                            <div style={{
                                fontSize: row.small ? 10 : 13,
                                fontFamily: 'var(--mono)',
                                color: row.color,
                                fontWeight: row.border ? 700 : 400,
                            }}>
                                {row.val}
                            </div>
                            {!row.small && (
                                <div style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 1 }}>
                                    {row.label}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* State badge */}
            <div style={{ marginBottom: 14 }}>
                <span style={{
                    fontSize: 11, fontFamily: 'var(--mono)', color: sColor,
                    background: `${sColor}15`, border: `1px solid ${sColor}40`,
                    padding: '4px 12px', borderRadius: 20,
                }}>
                    State: {data.state}  ·  M = {M} g/mol
                    {data.state === 'gas' ? '  ·  22.4 L/mol at STP' : ''}
                </span>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Mass  m = nM" value={mass.toFixed(4)} unit=" g" color="var(--gold)" highlight />
                <ValueCard label="Moles  n = m/M" value={moles.toFixed(4)} unit=" mol" color={sColor} />
                <ValueCard label="Particles  N = nNₐ" value={particles.toExponential(3)} color="var(--purple)" />
                {data.state === 'gas' && (
                    <ValueCard label="Volume (STP)" value={volume.toFixed(3)} unit=" L" color="#378ADD" />
                )}
            </div>
        </div>
    )
}