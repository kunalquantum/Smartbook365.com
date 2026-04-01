import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 260
const SURFACE_Y = 160
const OBJ_H = 40, OBJ_W = 56

export default function NewtonSecond() {
    const [F, setF] = useState(20)    // N
    const [mass, setMass] = useState(4)     // kg
    const [running, setRunning] = useState(false)
    const [posX, setPosX] = useState(60)
    const [velX, setVelX] = useState(0)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    // History for graph
    const histV = useRef(Array(160).fill(0))
    const histA = useRef(Array(160).fill(0))

    const a = F / mass   // m/s²

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt

            setVelX(prev => {
                const newV = prev + a * dt
                histV.current = [...histV.current.slice(1), Math.min(newV, 15)]
                histA.current = [...histA.current.slice(1), a]
                return newV
            })
            setPosX(prev => {
                const newX = prev + velX * dt * 15
                if (newX > W - OBJ_W - 10) {
                    setRunning(false)
                    return W - OBJ_W - 10
                }
                return newX
            })

            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, velX, a])

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setRunning(false)
        setPosX(60)
        setVelX(0)
        tRef.current = 0
        histV.current = Array(160).fill(0)
        histA.current = Array(160).fill(0)
        lastRef.current = null
    }

    // Mini graph
    const GX = 14, GY = H - 58, GW = W - 28, GH = 48
    const maxV = 15

    const velPath = histV.current.map((v, i) => {
        const x = GX + (i / 160) * GW
        const y = GY + GH - (v / maxV) * GH
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${Math.max(GY, y).toFixed(1)}`
    }).join(' ')

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Force F" unit=" N" value={F} min={1} max={60} step={1} onChange={v => { setF(v); reset() }} />
                <SimSlider label="Mass m" unit=" kg" value={mass} min={1} max={20} step={0.5} onChange={v => { setMass(v); reset() }} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('ns2f', '#EF9F27')}
                    {arrowDef('ns2n', '#1D9E75')}
                    {arrowDef('ns2g', '#378ADD')}
                    {arrowDef('ns2v', '#D85A30')}
                </defs>

                {/* Surface */}
                <rect x={0} y={SURFACE_Y + OBJ_H} width={W} height={10}
                    fill="rgba(29,158,117,0.2)"
                    stroke="rgba(29,158,117,0.4)" strokeWidth={1} />

                {/* Object */}
                <rect x={posX} y={SURFACE_Y} width={OBJ_W} height={OBJ_H}
                    rx={6} fill="rgba(239,159,39,0.2)"
                    stroke="#EF9F27" strokeWidth={2} />
                <text x={posX + OBJ_W / 2} y={SURFACE_Y + OBJ_H / 2 + 5} textAnchor="middle"
                    style={{ fontSize: 11, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {mass}kg
                </text>

                {/* Force arrow */}
                <line x1={posX - 8} y1={SURFACE_Y + OBJ_H / 2}
                    x2={posX - 8 - Math.min(F * 1.2, 70)} y2={SURFACE_Y + OBJ_H / 2}
                    stroke="#EF9F27" strokeWidth={3}
                    markerEnd="url(#ns2f)" />
                <text x={posX - 8 - Math.min(F * 0.6, 35)} y={SURFACE_Y + OBJ_H / 2 - 10}
                    textAnchor="middle"
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    F={F}N
                </text>

                {/* Weight */}
                <line x1={posX + OBJ_W / 2} y1={SURFACE_Y + OBJ_H}
                    x2={posX + OBJ_W / 2} y2={SURFACE_Y + OBJ_H + 28}
                    stroke="#378ADD" strokeWidth={1.5}
                    markerEnd="url(#ns2g)" />

                {/* Normal */}
                <line x1={posX + OBJ_W / 2} y1={SURFACE_Y}
                    x2={posX + OBJ_W / 2} y2={SURFACE_Y - 30}
                    stroke="#1D9E75" strokeWidth={1.5}
                    markerEnd="url(#ns2n)" />

                {/* Velocity arrow */}
                {velX > 0.1 && (
                    <line x1={posX + OBJ_W} y1={SURFACE_Y + OBJ_H / 2}
                        x2={posX + OBJ_W + Math.min(velX * 8, 60)} y2={SURFACE_Y + OBJ_H / 2}
                        stroke="#D85A30" strokeWidth={2}
                        markerEnd="url(#ns2v)" />
                )}

                {/* a label */}
                <text x={W / 2} y={28} textAnchor="middle"
                    style={{ fontSize: 14, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    a = F/m = {F}/{mass} = {a.toFixed(3)} m/s²
                </text>
                <text x={W / 2} y={46} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    v = {velX.toFixed(2)} m/s  |  x = {((posX - 60) / 15).toFixed(2)} m  |  t = {tRef.current.toFixed(2)} s
                </text>

                {/* Velocity-time graph */}
                <rect x={GX} y={GY} width={GW} height={GH}
                    rx={3} fill="rgba(0,0,0,0.2)"
                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                <path d={velPath} fill="none" stroke="#D85A30" strokeWidth={1.5} />
                <text x={GX + 4} y={GY + 12}
                    style={{ fontSize: 8, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                    v(t) — slope = a = {a.toFixed(2)} m/s²
                </text>
                <line x1={GX} y1={GY + GH} x2={GX + GW} y2={GY + GH}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
            </svg>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50) }} style={{
                    padding: '7px 22px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(239,159,39,0.15)', color: 'var(--amber)',
                    border: '1px solid rgba(239,159,39,0.3)',
                }}>▶ Apply F</button>
                <button onClick={() => setRunning(p => !p)} disabled={posX >= W - OBJ_W - 10} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: running ? 'rgba(216,90,48,0.12)' : 'var(--bg3)',
                    color: running ? 'var(--coral)' : 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>
                    {running ? '⏸' : '▶'}
                </button>
                <button onClick={reset} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Acceleration a=F/m', val: `${a.toFixed(3)} m/s²`, color: 'var(--amber)' },
                    { label: 'Velocity v', val: `${velX.toFixed(3)} m/s`, color: 'var(--coral)' },
                    { label: 'Impulse J=FΔt', val: `${(F * tRef.current).toFixed(3)} N·s`, color: 'var(--teal)' },
                    { label: 'Momentum p=mv', val: `${(mass * velX).toFixed(3)} kg·m/s`, color: 'var(--text2)' },
                ].map(c => (
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