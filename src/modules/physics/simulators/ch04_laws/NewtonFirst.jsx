import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 260
const SURFACE_Y = 170
const OBJ_H = 36, OBJ_W = 50

export default function NewtonFirst() {
    const [mass, setMass] = useState(5)      // kg
    const [surface, setSurface] = useState('frictionless') // frictionless | rough
    const [pushed, setPushed] = useState(false)
    const [velX, setVelX] = useState(0)
    const [posX, setPosX] = useState(80)
    const [running, setRunning] = useState(false)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    const mu_k = surface === 'rough' ? 0.35 : 0

    useEffect(() => {
        if (!running) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts

            setVelX(prev => {
                const friction = mu_k * 9.8 * Math.sign(prev)
                const newVel = Math.abs(prev) < 0.01 && surface === 'rough'
                    ? 0
                    : prev - friction * dt
                if (newVel === 0 && surface === 'rough') setRunning(false)
                return newVel
            })
            setPosX(prev => {
                const newX = prev + velX * dt * 40
                if (newX > W - OBJ_W - 20 || newX < 20) {
                    setVelX(v => -v * 0.8)
                    return Math.max(20, Math.min(W - OBJ_W - 20, newX))
                }
                return newX
            })

            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, velX, surface, mu_k])

    const push = () => {
        setVelX(6)
        setPushed(true)
        setRunning(true)
    }

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setRunning(false)
        setVelX(0)
        setPosX(80)
        setPushed(false)
        lastRef.current = null
    }

    // Momentum & inertia
    const p = (mass * Math.abs(velX)).toFixed(3)

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['frictionless', 'rough'].map(s => (
                    <button key={s} onClick={() => { setSurface(s); reset() }} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: surface === s ? 'var(--amber)' : 'var(--bg3)',
                        color: surface === s ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{s} surface</button>
                ))}
            </div>

            <SimSlider label="Mass m" unit=" kg" value={mass} min={1} max={20} step={0.5} onChange={v => { setMass(v); reset() }} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('n1v', '#EF9F27')}
                    {arrowDef('n1f', '#D85A30')}
                    {arrowDef('n1g', '#378ADD')}
                    {arrowDef('n1n', '#1D9E75')}
                </defs>

                {/* Surface */}
                <rect x={0} y={SURFACE_Y + OBJ_H} width={W} height={H - SURFACE_Y - OBJ_H}
                    rx={0} fill="rgba(29,158,117,0.08)"
                    stroke="rgba(29,158,117,0.3)" strokeWidth={1.5} />

                {/* Friction texture */}
                {surface === 'rough' && Array.from({ length: 20 }, (_, i) => (
                    <line key={i} x1={i * 24} y1={SURFACE_Y + OBJ_H}
                        x2={i * 24 + 10} y2={SURFACE_Y + OBJ_H + 8}
                        stroke="rgba(29,158,117,0.2)" strokeWidth={1} />
                ))}
                <text x={W / 2} y={SURFACE_Y + OBJ_H + 18} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.4)', fontFamily: 'var(--mono)' }}>
                    {surface === 'rough' ? `μk = ${mu_k}` : 'Frictionless — no net force → constant velocity'}
                </text>

                {/* Object */}
                <rect x={posX} y={SURFACE_Y} width={OBJ_W} height={OBJ_H}
                    rx={6} fill="rgba(239,159,39,0.2)"
                    stroke="#EF9F27" strokeWidth={2} />
                <text x={posX + OBJ_W / 2} y={SURFACE_Y + OBJ_H / 2 + 5} textAnchor="middle"
                    style={{ fontSize: 11, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {mass}kg
                </text>

                {/* Velocity arrow */}
                {Math.abs(velX) > 0.05 && (
                    <>
                        <line
                            x1={posX + OBJ_W / 2}
                            y1={SURFACE_Y - 12}
                            x2={posX + OBJ_W / 2 + velX * 18}
                            y2={SURFACE_Y - 12}
                            stroke="#EF9F27" strokeWidth={2.5}
                            markerEnd="url(#n1v)" />
                        <text x={posX + OBJ_W / 2 + velX * 9}
                            y={SURFACE_Y - 20} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                            v={velX.toFixed(2)}m/s
                        </text>
                    </>
                )}

                {/* Weight arrow */}
                <line x1={posX + OBJ_W / 2} y1={SURFACE_Y + OBJ_H}
                    x2={posX + OBJ_W / 2} y2={SURFACE_Y + OBJ_H + 30}
                    stroke="#378ADD" strokeWidth={2} markerEnd="url(#n1g)" />
                <text x={posX + OBJ_W / 2 + 6} y={SURFACE_Y + OBJ_H + 26}
                    style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>
                    mg={(mass * 9.8).toFixed(0)}N
                </text>

                {/* Normal arrow */}
                <line x1={posX + OBJ_W / 2} y1={SURFACE_Y}
                    x2={posX + OBJ_W / 2} y2={SURFACE_Y - 36}
                    stroke="#1D9E75" strokeWidth={2} markerEnd="url(#n1n)" />
                <text x={posX + OBJ_W / 2 + 6} y={SURFACE_Y - 18}
                    style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>N</text>

                {/* Friction arrow */}
                {surface === 'rough' && Math.abs(velX) > 0.1 && (
                    <>
                        <line
                            x1={posX + OBJ_W / 2}
                            y1={SURFACE_Y + OBJ_H / 2}
                            x2={posX + OBJ_W / 2 - Math.sign(velX) * 40}
                            y2={SURFACE_Y + OBJ_H / 2}
                            stroke="#D85A30" strokeWidth={2}
                            markerEnd="url(#n1f)" />
                        <text x={posX + OBJ_W / 2 - Math.sign(velX) * 20}
                            y={SURFACE_Y + OBJ_H / 2 - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            f={(mu_k * mass * 9.8).toFixed(1)}N
                        </text>
                    </>
                )}

                {/* State label */}
                <text x={W / 2} y={36} textAnchor="middle"
                    style={{ fontSize: 12, fill: 'var(--text2)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                    {!pushed ? 'Object at rest — inertia keeps it still'
                        : Math.abs(velX) < 0.05 ? 'Stopped by friction — inertia overcome'
                            : surface === 'frictionless' ? 'Moving at constant velocity — no net force!'
                                : 'Decelerating — friction opposes motion'}
                </text>

                {/* Momentum label */}
                <text x={W - 14} y={H - 10} textAnchor="end"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    p = mv = {p} kg·m/s
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button onClick={push} disabled={running && surface === 'frictionless'} style={{
                    padding: '7px 22px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'rgba(239,159,39,0.15)', color: 'var(--amber)',
                    border: '1px solid rgba(239,159,39,0.3)',
                }}>→ Apply push</button>
                <button onClick={reset} style={{
                    padding: '7px 16px', borderRadius: 8, fontSize: 12,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: 'var(--bg3)', color: 'var(--text3)',
                    border: '1px solid var(--border)',
                }}>↺ Reset</button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'State', val: Math.abs(velX) < 0.05 ? 'At rest / equilibrium' : 'Moving', color: Math.abs(velX) < 0.05 ? 'var(--teal)' : 'var(--amber)' },
                    { label: 'Velocity', val: `${velX.toFixed(3)} m/s`, color: 'var(--amber)' },
                    { label: 'Momentum p', val: `${p} kg·m/s`, color: 'var(--teal)' },
                    { label: 'Net force', val: surface === 'rough' && Math.abs(velX) > 0.05 ? `${(mu_k * mass * 9.8).toFixed(2)} N (friction)` : '0 N', color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}