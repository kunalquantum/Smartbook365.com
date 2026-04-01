import { useState, useEffect, useRef, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const COIL_X = 280, COIL_Y = H / 2
const COIL_W = 80, COIL_H = 100

export default function FaradayInduction() {
    const [magX, setMagX] = useState(80)
    const [N, setN] = useState(200)
    const [B, setB] = useState(0.5)
    const [dragging, setDragging] = useState(false)
    const prevMagX = useRef(80)
    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)
    const [, forceUpdate] = useState(0)

    // Track velocity of magnet
    const velRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt
            forceUpdate(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    // Flux through coil based on magnet position
    // Simplified: flux ∝ 1/distance² from coil centre
    const coilCX = COIL_X
    const dist = Math.abs(magX - coilCX)
    const flux = dist < 10 ? B * 0.1 : B * (1 / (1 + (dist / 60) ** 2))
    const A_coil = 0.01    // m²
    const Phi = N * B * A_coil * Math.exp(-dist / 80)

    // EMF = -N dΦ/dt ≈ -N ΔΦ/Δx × velocity
    const dPhiDx = -N * B * A_coil * Math.exp(-dist / 80) / 80
    const emf = -dPhiDx * velRef.current * 60  // scaled

    // Lenz direction
    const lenzDir = emf > 0 ? 'counterclockwise' : emf < 0 ? 'clockwise' : 'none'
    const emfColor = Math.abs(emf) > 0.5 ? '#EF9F27' : Math.abs(emf) > 0.1 ? '#1D9E75' : 'rgba(160,176,200,0.3)'

    // EMF history for mini-graph
    const histRef = useRef(Array(120).fill(0))
    const emfClamped = Math.max(-5, Math.min(5, emf))
    useEffect(() => {
        histRef.current = [...histRef.current.slice(1), emfClamped]
    })

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    // Graph
    const GRAPH_X = 20, GRAPH_Y = H - 70, GRAPH_W = W - 40, GRAPH_H = 60

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Coil turns N" unit="" value={N} min={10} max={1000} step={10} onChange={setN} />
                <SimSlider label="B strength" unit=" T" value={B} min={0.1} max={2} step={0.05} onChange={setB} />
            </div>

            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                Drag the magnet toward / away from the coil
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{
                    display: 'block', marginBottom: 8, background: 'rgba(0,0,0,0.15)', borderRadius: 8,
                    cursor: dragging ? 'grabbing' : 'default'
                }}
                onMouseMove={e => {
                    if (!dragging) return
                    const rect = e.currentTarget.getBoundingClientRect()
                    const newX = Math.max(20, Math.min(COIL_X - 30, e.clientX - rect.left))
                    velRef.current = newX - prevMagX.current
                    prevMagX.current = magX
                    setMagX(newX)
                }}
                onMouseUp={() => { setDragging(false); velRef.current = 0 }}
                onMouseLeave={() => { setDragging(false); velRef.current = 0 }}>

                <defs>
                    {arrowDef('fi1', '#EF9F27')}
                    {arrowDef('fi2', 'rgba(29,158,117,0.7)')}
                </defs>

                {/* Flux field lines from magnet */}
                {Array.from({ length: 5 }, (_, i) => {
                    const offset = (i - 2) * 18
                    const fieldX = magX + 30
                    const opacity = Math.max(0, 0.4 - dist / 300)
                    return (
                        <line key={i}
                            x1={fieldX} y1={COIL_Y + offset}
                            x2={Math.min(COIL_X - COIL_W / 2, fieldX + 60)} y2={COIL_Y + offset}
                            stroke={`rgba(239,159,39,${opacity})`}
                            strokeWidth={1} markerEnd="url(#fi1)" />
                    )
                })}

                {/* Coil windings */}
                {Array.from({ length: 8 }, (_, i) => {
                    const cx = COIL_X - COIL_W / 2 + 4 + i * 10
                    const glowColor = Math.abs(emf) > 0.5
                        ? `rgba(29,158,117,${Math.min(0.8, Math.abs(emf) / 3)})`
                        : 'rgba(55,138,221,0.4)'
                    return (
                        <g key={i}>
                            <ellipse cx={cx} cy={COIL_Y} rx={4} ry={COIL_H / 2}
                                fill="none" stroke={glowColor} strokeWidth={2} />
                        </g>
                    )
                })}

                {/* Coil box outline */}
                <rect x={COIL_X - COIL_W / 2} y={COIL_Y - COIL_H / 2}
                    width={COIL_W} height={COIL_H}
                    rx={4} fill="none"
                    stroke="rgba(55,138,221,0.25)" strokeWidth={1} strokeDasharray="4 3" />

                {/* N label on coil */}
                <text x={COIL_X + COIL_W / 2 + 8} y={COIL_Y + 4}
                    style={{ fontSize: 10, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>
                    N={N}
                </text>

                {/* Lenz current direction */}
                {Math.abs(emf) > 0.05 && (
                    <>
                        <text x={COIL_X} y={COIL_Y - COIL_H / 2 - 12} textAnchor="middle"
                            style={{ fontSize: 10, fill: emfColor, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            {lenzDir !== 'none' ? `Induced I: ${lenzDir}` : ''}
                        </text>
                        {/* Current arrow on coil */}
                        {lenzDir === 'counterclockwise' ? (
                            <path d={`M ${COIL_X} ${COIL_Y - COIL_H / 2 + 4} A 20 8 0 1 0 ${COIL_X + 1} ${COIL_Y - COIL_H / 2 + 4}`}
                                fill="none" stroke={emfColor} strokeWidth={1.5}
                                markerEnd="url(#fi2)" />
                        ) : (
                            <path d={`M ${COIL_X} ${COIL_Y - COIL_H / 2 + 4} A 20 8 0 1 1 ${COIL_X + 1} ${COIL_Y - COIL_H / 2 + 4}`}
                                fill="none" stroke={emfColor} strokeWidth={1.5}
                                markerEnd="url(#fi2)" />
                        )}
                    </>
                )}

                {/* Magnet (draggable) */}
                <g onMouseDown={() => setDragging(true)} style={{ cursor: 'grab' }}>
                    {/* S pole */}
                    <rect x={magX - 30} y={COIL_Y - 14} width={30} height={28}
                        rx={4} fill="rgba(55,138,221,0.3)" stroke="#378ADD" strokeWidth={1.5} />
                    <text x={magX - 15} y={COIL_Y + 5} textAnchor="middle"
                        style={{ fontSize: 13, fill: '#378ADD', fontFamily: 'var(--mono)', fontWeight: 700, pointerEvents: 'none' }}>S</text>
                    {/* N pole */}
                    <rect x={magX} y={COIL_Y - 14} width={30} height={28}
                        rx={4} fill="rgba(216,90,48,0.3)" stroke="#D85A30" strokeWidth={1.5} />
                    <text x={magX + 15} y={COIL_Y + 5} textAnchor="middle"
                        style={{ fontSize: 13, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 700, pointerEvents: 'none' }}>N</text>
                </g>

                {/* Distance label */}
                <line x1={magX + 30} y1={COIL_Y + 22} x2={COIL_X - COIL_W / 2} y2={COIL_Y + 22}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                <text x={(magX + 30 + COIL_X - COIL_W / 2) / 2} y={COIL_Y + 34} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                    d = {Math.max(0, dist - 10).toFixed(0)}px
                </text>

                {/* EMF graph */}
                <rect x={GRAPH_X} y={GRAPH_Y} width={GRAPH_W} height={GRAPH_H}
                    rx={4} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                <line x1={GRAPH_X} y1={GRAPH_Y + GRAPH_H / 2}
                    x2={GRAPH_X + GRAPH_W} y2={GRAPH_Y + GRAPH_H / 2}
                    stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />
                {histRef.current.map((v, i) => {
                    if (i === 0) return null
                    const x1 = GRAPH_X + (i - 1) / 120 * GRAPH_W
                    const x2 = GRAPH_X + i / 120 * GRAPH_W
                    const y1 = GRAPH_Y + GRAPH_H / 2 - histRef.current[i - 1] / 5 * GRAPH_H / 2
                    const y2 = GRAPH_Y + GRAPH_H / 2 - v / 5 * GRAPH_H / 2
                    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                        stroke={emfColor} strokeWidth={1.2} />
                })}
                <text x={GRAPH_X + 4} y={GRAPH_Y + 12}
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>EMF (t)</text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Flux Φ = NBAe⁻ᵈ', val: `${Phi.toFixed(5)} Wb`, color: 'var(--teal)' },
                    { label: 'Induced EMF ε', val: `${emf.toFixed(4)} V`, color: emfColor },
                    { label: "Lenz's law", val: lenzDir === 'none' ? 'No motion' : 'Opposes flux change', color: 'var(--amber)' },
                    { label: 'ε = −N dΦ/dt', val: 'Move magnet faster → bigger ε', color: 'var(--text3)' },
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