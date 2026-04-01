import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 240
const CY = 110

export default function NewtonThird() {
    const [m1, setM1] = useState(4)
    const [m2, setM2] = useState(2)
    const [mode, setMode] = useState('collision')  // collision | lift
    const [running, setRunning] = useState(false)
    const [x1, setX1] = useState(80)
    const [x2, setX2] = useState(320)
    const [v1, setV1] = useState(5)
    const [v2, setV2] = useState(-2)
    const [collided, setCollided] = useState(false)

    const tRef = useRef(0)
    const lastRef = useRef(null)
    const rafRef = useRef(null)

    // Elastic collision velocities
    const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2)
    const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2)

    // Lift mode
    const [liftA, setLiftA] = useState(2)  // m/s²
    const [liftDir, setLiftDir] = useState('up')
    const a_lift = liftDir === 'up' ? liftA : -liftA
    const W1_app = m1 * (9.8 + a_lift)   // apparent weight
    const N_lift = W1_app

    useEffect(() => {
        if (!running || mode === 'lift') return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            const dt = (ts - lastRef.current) / 1000
            lastRef.current = ts
            tRef.current += dt

            setX1(px1 => {
                setX2(px2 => {
                    const OW = 50
                    if (!collided && px1 + OW >= px2 - 4) {
                        setV1(v1f)
                        setV2(v2f)
                        setCollided(true)
                    }
                    const nx2 = px2 + v2 * dt * 30
                    if (nx2 > W - OW - 10 || nx2 < 10) { setV2(pv => -pv * 0.9) }
                    return Math.max(10, Math.min(W - OW - 10, nx2))
                })
                const nx1 = px1 + v1 * dt * 30
                if (nx1 < 10) { setV1(pv => -pv * 0.9) }
                return Math.max(10, nx1)
            })

            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [running, v1, v2, collided, mode])

    const reset = () => {
        cancelAnimationFrame(rafRef.current)
        setRunning(false)
        setX1(80); setX2(320)
        setV1(5); setV2(-2)
        setCollided(false)
        tRef.current = 0
        lastRef.current = null
    }

    const OBJ_W = 50, OBJ_H = 40
    const p_total_before = m1 * 5 + m2 * (-2)
    const p_total_after = m1 * v1 + m2 * v2

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
                {['collision', 'lift'].map(m => (
                    <button key={m} onClick={() => { setMode(m); reset() }} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'collision' ? 'Collision (action-reaction)' : 'Lift (apparent weight)'}</button>
                ))}
            </div>

            {mode === 'collision' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Mass m₁" unit=" kg" value={m1} min={1} max={15} step={0.5} onChange={v => { setM1(v); reset() }} />
                    <SimSlider label="Mass m₂" unit=" kg" value={m2} min={1} max={15} step={0.5} onChange={v => { setM2(v); reset() }} />
                </div>
            )}

            {mode === 'lift' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Mass m" unit=" kg" value={m1} min={1} max={20} step={0.5} onChange={setM1} />
                    <SimSlider label="Acceleration a" unit=" m/s²" value={liftA} min={0} max={9} step={0.5} onChange={setLiftA} />
                </div>
            )}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('nt3a', '#EF9F27')}
                    {arrowDef('nt3b', '#D85A30')}
                    {arrowDef('nt3n', '#1D9E75')}
                    {arrowDef('nt3g', '#378ADD')}
                </defs>

                {mode === 'collision' && (
                    <g>
                        {/* Surface */}
                        <line x1={0} y1={CY + OBJ_H + 2} x2={W} y2={CY + OBJ_H + 2}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />

                        {/* Object 1 */}
                        <rect x={x1} y={CY} width={OBJ_W} height={OBJ_H}
                            rx={5} fill="rgba(239,159,39,0.2)"
                            stroke="#EF9F27" strokeWidth={2} />
                        <text x={x1 + OBJ_W / 2} y={CY + OBJ_H / 2 + 5} textAnchor="middle"
                            style={{ fontSize: 11, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            m₁={m1}
                        </text>

                        {/* Object 2 */}
                        <rect x={x2} y={CY} width={OBJ_W} height={OBJ_H}
                            rx={5} fill="rgba(216,90,48,0.2)"
                            stroke="#D85A30" strokeWidth={2} />
                        <text x={x2 + OBJ_W / 2} y={CY + OBJ_H / 2 + 5} textAnchor="middle"
                            style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            m₂={m2}
                        </text>

                        {/* Velocity arrows */}
                        {Math.abs(v1) > 0.1 && (
                            <line x1={x1 + OBJ_W / 2} y1={CY - 14}
                                x2={x1 + OBJ_W / 2 + v1 * 10} y2={CY - 14}
                                stroke="#EF9F27" strokeWidth={2}
                                markerEnd="url(#nt3a)" />
                        )}
                        {Math.abs(v2) > 0.1 && (
                            <line x1={x2 + OBJ_W / 2} y1={CY - 14}
                                x2={x2 + OBJ_W / 2 + v2 * 10} y2={CY - 14}
                                stroke="#D85A30" strokeWidth={2}
                                markerEnd="url(#nt3b)" />
                        )}

                        {/* Action-reaction arrows at contact */}
                        {collided && (
                            <g>
                                <line x1={x1 + OBJ_W} y1={CY + OBJ_H / 2}
                                    x2={x1 + OBJ_W + 35} y2={CY + OBJ_H / 2}
                                    stroke="#D85A30" strokeWidth={2.5}
                                    markerEnd="url(#nt3b)" />
                                <line x1={x2} y1={CY + OBJ_H / 2}
                                    x2={x2 - 35} y2={CY + OBJ_H / 2}
                                    stroke="#EF9F27" strokeWidth={2.5}
                                    markerEnd="url(#nt3a)" />
                                <text x={(x1 + OBJ_W + x2) / 2} y={CY + OBJ_H / 2 - 12}
                                    textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                                    F₁₂ = −F₂₁
                                </text>
                            </g>
                        )}

                        {/* Momentum labels */}
                        <text x={W / 2} y={H - 34} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                            p_total = {p_total_after.toFixed(2)} kg·m/s
                            {collided ? '  (after collision)' : '  (before)'}
                        </text>
                        <text x={W / 2} y={H - 18} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                            Conservation: m₁v₁+m₂v₂ = {p_total_before.toFixed(2)} kg·m/s = constant ✓
                        </text>
                    </g>
                )}

                {mode === 'lift' && (
                    <g>
                        {/* Lift box */}
                        <rect x={W / 2 - 60} y={40} width={120} height={100}
                            rx={6} fill="rgba(55,138,221,0.08)"
                            stroke="rgba(55,138,221,0.3)" strokeWidth={1.5} />

                        {/* Cable */}
                        <line x1={W / 2} y1={0} x2={W / 2} y2={40}
                            stroke="rgba(255,255,255,0.3)" strokeWidth={2.5} />

                        {/* Person inside */}
                        <rect x={W / 2 - 18} y={80} width={36} height={52}
                            rx={4} fill="rgba(239,159,39,0.2)"
                            stroke="#EF9F27" strokeWidth={1.5} />
                        <circle cx={W / 2} cy={72} r={12}
                            fill="rgba(239,159,39,0.2)"
                            stroke="#EF9F27" strokeWidth={1.5} />
                        <text x={W / 2} y={108} textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                            {m1}kg
                        </text>

                        {/* Weight arrow (down) */}
                        <line x1={W / 2 + 36} y1={106} x2={W / 2 + 36} y2={136}
                            stroke="#378ADD" strokeWidth={2}
                            markerEnd="url(#nt3g)" />
                        <text x={W / 2 + 44} y={126}
                            style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>
                            mg={(m1 * 9.8).toFixed(0)}N
                        </text>

                        {/* Normal force (up) */}
                        <line x1={W / 2 - 36} y1={132} x2={W / 2 - 36} y2={80}
                            stroke="#1D9E75" strokeWidth={2.5}
                            markerEnd="url(#nt3n)" />
                        <text x={W / 2 - 44} y={106} textAnchor="end"
                            style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                            N={N_lift.toFixed(1)}N
                        </text>

                        {/* Acceleration arrow */}
                        <defs>
                            <marker id="lift_a" viewBox="0 0 10 10" refX={8} refY={5}
                                markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke="var(--amber)"
                                    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                        </defs>
                        <line x1={W / 2 + 70} y1={liftDir === 'up' ? 120 : 80}
                            x2={W / 2 + 70} y2={liftDir === 'up' ? 80 : 120}
                            stroke="var(--amber)" strokeWidth={2}
                            markerEnd="url(#lift_a)" />
                        <text x={W / 2 + 80} y={100}
                            style={{ fontSize: 10, fill: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            a={liftA}↑
                        </text>

                        {/* Direction buttons */}
                        <foreignObject x={W / 2 - 100} y={H - 44} width={200} height={34}>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {['up', 'down', 'free fall'].map(d => (
                                    <button key={d} onClick={() => setLiftDir(d)} style={{
                                        padding: '4px 8px', borderRadius: 4, fontSize: 10,
                                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                                        background: liftDir === d ? 'var(--amber)' : 'rgba(0,0,0,0.3)',
                                        color: liftDir === d ? '#000' : 'rgba(160,176,200,0.7)',
                                        border: `1px solid ${liftDir === d ? 'var(--amber)' : 'rgba(255,255,255,0.1)'}`,
                                    }}>{d}</button>
                                ))}
                            </div>
                        </foreignObject>
                    </g>
                )}
            </svg>

            {mode === 'collision' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50) }} style={{
                        padding: '7px 20px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: 'rgba(239,159,39,0.15)', color: 'var(--amber)',
                        border: '1px solid rgba(239,159,39,0.3)',
                    }}>▶ Launch</button>
                    <button onClick={reset} style={{
                        padding: '7px 14px', borderRadius: 8, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: 'var(--bg3)', color: 'var(--text3)',
                        border: '1px solid var(--border)',
                    }}>↺</button>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'collision' ? [
                    { label: 'v₁ after', val: `${v1.toFixed(2)} m/s`, color: 'var(--amber)' },
                    { label: 'v₂ after', val: `${v2.toFixed(2)} m/s`, color: 'var(--coral)' },
                    { label: 'p conserved', val: `${p_total_after.toFixed(2)} kg·m/s`, color: 'var(--teal)' },
                    { label: 'Action = Reaction', val: 'F₁₂ = −F₂₁ ✓', color: 'var(--text2)' },
                ] : [
                    { label: 'True weight', val: `${(m1 * 9.8).toFixed(1)} N`, color: 'var(--text2)' },
                    { label: 'Apparent weight N', val: `${N_lift.toFixed(2)} N`, color: 'var(--teal)' },
                    { label: 'N = m(g+a)', val: liftDir === 'free fall' ? 'N=0 (weightlessness)' : liftDir === 'up' ? 'N > mg' : 'N < mg', color: 'var(--amber)' },
                    { label: 'Feel', val: liftDir === 'up' ? 'Heavier' : liftDir === 'down' ? 'Lighter' : 'Weightless', color: 'var(--coral)' },
                ]).map(c => (
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