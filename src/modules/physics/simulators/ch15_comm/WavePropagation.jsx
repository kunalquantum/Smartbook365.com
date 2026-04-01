import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300

const FREQ_BANDS = [
    { label: 'LF/MF (AM radio)', range: [0.1, 2], mode: 'ground', color: '#EF9F27', desc: 'Ground wave — follows Earth curvature' },
    { label: 'HF (shortwave)', range: [2, 30], mode: 'sky', color: '#7F77DD', desc: 'Sky wave — reflects off ionosphere' },
    { label: 'VHF (FM radio/TV)', range: [30, 300], mode: 'space', color: '#1D9E75', desc: 'Space wave — line of sight' },
    { label: 'UHF/Microwave', range: [300, 3000], mode: 'space', color: '#D85A30', desc: 'Space wave — satellite / LOS' },
    { label: 'Satellite (GHz)', range: [3000, 30000], mode: 'satellite', color: '#378ADD', desc: 'Passes ionosphere → satellite' },
]

export default function WavePropagation() {
    const [freqBand, setFreqBand] = useState(1)   // index into FREQ_BANDS
    const [txHeight, setTxHeight] = useState(100)  // m
    const [ionH, setIonH] = useState(300)   // km ionosphere height

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
    const band = FREQ_BANDS[freqBand]

    // Horizon distance
    const R_EARTH = 6371e3   // m
    const d_hor = Math.sqrt(2 * R_EARTH * txHeight)

    // Earth arc
    const CX = W / 2, CY = H + 120   // Earth centre way below
    const EARTH_R = 160               // SVG Earth radius

    // Ionosphere arc
    const ION_R = EARTH_R + (ionH / 6371) * EARTH_R * 8

    // Ground surface points
    const nSurf = 60
    const surfPts = Array.from({ length: nSurf + 1 }, (_, i) => {
        const a = -0.7 + (i / nSurf) * 1.4
        return { x: CX + EARTH_R * Math.sin(a), y: CY - EARTH_R * Math.cos(a) }
    })
    const surfPath = surfPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

    // Transmitter position (left of centre)
    const TX_A = -0.4
    const TX_X = CX + EARTH_R * Math.sin(TX_A)
    const TX_Y = CY - EARTH_R * Math.cos(TX_A)
    const TX_NX = Math.sin(TX_A)   // normal direction
    const TX_NY = -Math.cos(TX_A)

    // Antenna tip
    const ANT_H = 18
    const ANT_X = TX_X + TX_NX * ANT_H
    const ANT_Y = TX_Y + TX_NY * ANT_H

    // Wave animation phase
    const wPhase = (t * 1.5) % 1

    // Ground wave path — follows surface
    const groundWavePts = Array.from({ length: 30 }, (_, i) => {
        const prog = wPhase + i / 30
        if (prog > 1) return null
        const a = TX_A + prog * 0.9
        const r = EARTH_R + 6 * Math.sin(prog * Math.PI * 8)
        return { x: CX + r * Math.sin(a), y: CY - r * Math.cos(a) }
    }).filter(Boolean)

    // Sky wave path — goes up, reflects, comes down
    const skyWaveProgress = wPhase
    const SKY_PEAK_A = TX_A + 0.3
    const SKY_PEAK_X = CX + ION_R * Math.sin(SKY_PEAK_A)
    const SKY_PEAK_Y = CY - ION_R * Math.cos(SKY_PEAK_A)
    const LAND_A = TX_A + 0.6
    const LAND_X = CX + EARTH_R * Math.sin(LAND_A)
    const LAND_Y = CY - EARTH_R * Math.cos(LAND_A)

    const skyWaveX = skyWaveProgress < 0.5
        ? TX_X + (SKY_PEAK_X - TX_X) * skyWaveProgress * 2
        : SKY_PEAK_X + (LAND_X - SKY_PEAK_X) * (skyWaveProgress - 0.5) * 2
    const skyWaveY = skyWaveProgress < 0.5
        ? TX_Y + (SKY_PEAK_Y - TX_Y) * skyWaveProgress * 2
        : SKY_PEAK_Y + (LAND_Y - SKY_PEAK_Y) * (skyWaveProgress - 0.5) * 2

    // Space wave — straight line of sight
    const RECV_A = TX_A + 0.35
    const RECV_X = CX + EARTH_R * Math.sin(RECV_A)
    const RECV_Y = CY - EARTH_R * Math.cos(RECV_A)

    // Satellite
    const SAT_A = TX_A + 0.15
    const SAT_X = CX + (EARTH_R + 140) * Math.sin(SAT_A)
    const SAT_Y = CY - (EARTH_R + 140) * Math.cos(SAT_A)

    return (
        <div>
            {/* Frequency band selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {FREQ_BANDS.map((b, i) => (
                    <button key={i} onClick={() => setFreqBand(i)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: freqBand === i ? b.color : 'var(--bg3)',
                        color: freqBand === i ? '#000' : 'var(--text2)',
                        border: `1px solid ${freqBand === i ? b.color : 'var(--border)'}`,
                    }}>{b.label}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="TX antenna height" unit=" m" value={txHeight} min={10} max={500} step={10} onChange={setTxHeight} />
                <SimSlider label="Ionosphere height" unit=" km" value={ionH} min={60} max={400} step={10} onChange={setIonH} />
            </div>

            {/* Mode description */}
            <div style={{
                fontSize: 11, fontFamily: 'var(--mono)', color: band.color,
                marginBottom: 12, padding: '7px 12px',
                background: `${band.color}10`, borderRadius: 8,
                border: `1px solid ${band.color}30`,
            }}>
                {band.desc}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* Ionosphere arc */}
                {(band.mode === 'sky' || band.mode === 'satellite') && (
                    <g>
                        <path d={Array.from({ length: 61 }, (_, i) => {
                            const a = -0.7 + (i / 60) * 1.4
                            return `${i === 0 ? 'M' : 'L'}${(CX + ION_R * Math.sin(a)).toFixed(1)},${(CY - ION_R * Math.cos(a)).toFixed(1)}`
                        }).join(' ')} fill="none"
                            stroke="rgba(127,119,221,0.25)" strokeWidth={12} />
                        <text x={W / 2} y={20} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>
                            Ionosphere ({ionH} km)
                        </text>
                    </g>
                )}

                {/* Earth surface */}
                <path d={surfPath} fill="none" stroke="rgba(29,158,117,0.5)" strokeWidth={2} />
                <path d={surfPath + ` L${surfPts[surfPts.length - 1].x} ${H + 10} L${surfPts[0].x} ${H + 10} Z`}
                    fill="rgba(29,158,117,0.08)" />

                {/* Earth label */}
                <text x={W / 2} y={H - 6} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.4)', fontFamily: 'var(--mono)' }}>Earth surface</text>

                {/* Transmitter */}
                <circle cx={TX_X} cy={TX_Y} r={5}
                    fill="#EF9F27" stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                <line x1={TX_X} y1={TX_Y} x2={ANT_X} y2={ANT_Y}
                    stroke="#EF9F27" strokeWidth={2.5} />
                <text x={TX_X - 8} y={ANT_Y - 6}
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>TX</text>

                {/* === GROUND WAVE === */}
                {band.mode === 'ground' && (
                    <>
                        {groundWavePts.length > 1 && (
                            <path
                                d={groundWavePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                                fill="none" stroke="#EF9F27" strokeWidth={2} opacity={0.8} />
                        )}
                        {/* Receiver */}
                        <circle cx={CX + EARTH_R * Math.sin(TX_A + 0.6)} cy={CY - EARTH_R * Math.cos(TX_A + 0.6)} r={5}
                            fill="#1D9E75" stroke="rgba(29,158,117,0.4)" strokeWidth={1} />
                        <text x={CX + EARTH_R * Math.sin(TX_A + 0.6) + 8} y={CY - EARTH_R * Math.cos(TX_A + 0.6) - 4}
                            style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>RX</text>
                        <text x={W / 2} y={36} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            Ground wave — d_horizon = {(d_hor / 1000).toFixed(1)} km
                        </text>
                    </>
                )}

                {/* === SKY WAVE === */}
                {band.mode === 'sky' && (
                    <>
                        {/* Up path */}
                        <line x1={TX_X} y1={TX_Y} x2={SKY_PEAK_X} y2={SKY_PEAK_Y}
                            stroke="rgba(127,119,221,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                        {/* Down path */}
                        <line x1={SKY_PEAK_X} y1={SKY_PEAK_Y} x2={LAND_X} y2={LAND_Y}
                            stroke="rgba(127,119,221,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                        {/* Animated wave dot */}
                        <circle cx={skyWaveX} cy={skyWaveY} r={5}
                            fill="#7F77DD" opacity={0.9} />
                        {/* Reflection point */}
                        <circle cx={SKY_PEAK_X} cy={SKY_PEAK_Y} r={4}
                            fill="rgba(127,119,221,0.6)" stroke="rgba(127,119,221,0.4)" strokeWidth={1} />
                        <text x={SKY_PEAK_X + 8} y={SKY_PEAK_Y}
                            style={{ fontSize: 8, fill: 'rgba(127,119,221,0.6)', fontFamily: 'var(--mono)' }}>reflect</text>
                        {/* Skip distance label */}
                        <line x1={TX_X} y1={TX_Y + 14} x2={LAND_X} y2={LAND_Y + 14}
                            stroke="rgba(127,119,221,0.2)" strokeWidth={0.5} />
                        <text x={(TX_X + LAND_X) / 2} y={LAND_Y + 26} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(127,119,221,0.5)', fontFamily: 'var(--mono)' }}>
                            skip distance
                        </text>
                        {/* Receiver */}
                        <circle cx={LAND_X} cy={LAND_Y} r={5}
                            fill="#7F77DD" stroke="rgba(127,119,221,0.4)" strokeWidth={1} />
                        <text x={LAND_X + 8} y={LAND_Y - 4}
                            style={{ fontSize: 9, fill: '#7F77DD', fontFamily: 'var(--mono)' }}>RX</text>
                    </>
                )}

                {/* === SPACE WAVE === */}
                {band.mode === 'space' && (
                    <>
                        {/* Line of sight path */}
                        <line x1={ANT_X} y1={ANT_Y} x2={RECV_X} y2={RECV_Y - 16}
                            stroke={band.color} strokeWidth={1.5} />
                        {/* Animated dot */}
                        {(() => {
                            const px = ANT_X + (RECV_X - ANT_X) * wPhase
                            const py = ANT_Y + (RECV_Y - 16 - ANT_Y) * wPhase
                            return <circle cx={px} cy={py} r={5} fill={band.color} opacity={0.85} />
                        })()}
                        {/* Receiver tower */}
                        <circle cx={RECV_X} cy={RECV_Y} r={5}
                            fill={band.color} stroke={`${band.color}40`} strokeWidth={1} />
                        <line x1={RECV_X} y1={RECV_Y} x2={RECV_X} y2={RECV_Y - 18}
                            stroke={band.color} strokeWidth={2} />
                        <text x={RECV_X + 8} y={RECV_Y - 12}
                            style={{ fontSize: 9, fill: band.color, fontFamily: 'var(--mono)' }}>RX</text>
                        <text x={W / 2} y={36} textAnchor="middle"
                            style={{ fontSize: 10, fill: band.color, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            Line of sight — d = {(d_hor / 1000).toFixed(1)} km max
                        </text>
                    </>
                )}

                {/* === SATELLITE === */}
                {band.mode === 'satellite' && (
                    <>
                        {/* Up to satellite */}
                        <line x1={ANT_X} y1={ANT_Y} x2={SAT_X} y2={SAT_Y}
                            stroke={band.color} strokeWidth={1.5} strokeDasharray="4 3" />
                        {/* Satellite to receiver */}
                        <line x1={SAT_X} y1={SAT_Y} x2={RECV_X} y2={RECV_Y - 16}
                            stroke={band.color} strokeWidth={1.5} strokeDasharray="4 3" />
                        {/* Animated dot */}
                        {(() => {
                            const px = wPhase < 0.5
                                ? ANT_X + (SAT_X - ANT_X) * wPhase * 2
                                : SAT_X + (RECV_X - SAT_X) * (wPhase - 0.5) * 2
                            const py = wPhase < 0.5
                                ? ANT_Y + (SAT_Y - ANT_Y) * wPhase * 2
                                : SAT_Y + (RECV_Y - 16 - SAT_Y) * (wPhase - 0.5) * 2
                            return <circle cx={px} cy={py} r={5} fill={band.color} opacity={0.85} />
                        })()}
                        {/* Satellite icon */}
                        <rect x={SAT_X - 8} y={SAT_Y - 5} width={16} height={10}
                            rx={2} fill={`${band.color}30`} stroke={band.color} strokeWidth={1.5} />
                        <line x1={SAT_X - 16} y1={SAT_Y} x2={SAT_X - 8} y2={SAT_Y}
                            stroke={band.color} strokeWidth={2} />
                        <line x1={SAT_X + 8} y1={SAT_Y} x2={SAT_X + 16} y2={SAT_Y}
                            stroke={band.color} strokeWidth={2} />
                        {/* GEO label */}
                        <text x={SAT_X + 20} y={SAT_Y + 4}
                            style={{ fontSize: 9, fill: band.color, fontFamily: 'var(--mono)' }}>
                            {ionH > 200 ? 'GEO' : 'LEO'}
                        </text>
                        {/* Receiver */}
                        <circle cx={RECV_X} cy={RECV_Y} r={5}
                            fill={band.color} stroke={`${band.color}40`} strokeWidth={1} />
                        <text x={RECV_X + 8} y={RECV_Y - 4}
                            style={{ fontSize: 9, fill: band.color, fontFamily: 'var(--mono)' }}>RX</text>
                    </>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Frequency band', val: `${band.range[0]}–${band.range[1]} MHz`, color: band.color },
                    { label: 'Propagation mode', val: band.mode, color: band.color },
                    { label: 'LOS range', val: `${(d_hor / 1000).toFixed(1)} km`, color: 'var(--teal)' },
                    { label: 'Ionosphere ht', val: `${ionH} km`, color: '#7F77DD' },
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
        </div>
    )
}