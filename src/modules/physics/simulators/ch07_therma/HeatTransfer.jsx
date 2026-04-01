import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 220

export default function HeatTransfer() {
    const [mode, setMode] = useState('conduction')
    const [deltaT, setDeltaT] = useState(80)
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null)
    const lastRef = useRef(null)

    // Animation tick
    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            if (ts - lastRef.current > 40) { setTick(p => p + 1); lastRef.current = ts }
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [])

    const intensity = deltaT / 100

    // Color ramp hot→cold
    const tempCol = (frac) => {
        const r = Math.round(216 * frac + 55 * (1 - frac))
        const g = Math.round(90 * frac + 138 * (1 - frac))
        const b = Math.round(48 * frac + 221 * (1 - frac))
        return `rgb(${r},${g},${b})`
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['conduction', 'convection', 'radiation'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m}</button>
                ))}
            </div>

            <SimSlider label="Temperature difference ΔT" unit=" °C" value={deltaT} min={10} max={200} step={5} onChange={setDeltaT} />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>

                {/* === CONDUCTION === */}
                {mode === 'conduction' && (() => {
                    const BAR_X = 40, BAR_Y = 70, BAR_W = 360, BAR_H = 60
                    const SEGS = 12
                    return (
                        <g>
                            {/* Rod segments with temperature gradient */}
                            {Array.from({ length: SEGS }, (_, i) => {
                                const frac = 1 - i / (SEGS - 1)
                                return (
                                    <rect key={i}
                                        x={BAR_X + i * (BAR_W / SEGS)} y={BAR_Y}
                                        width={BAR_W / SEGS + 1} height={BAR_H}
                                        fill={tempCol(frac)} opacity={0.8} />
                                )
                            })}
                            {/* Rod outline */}
                            <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H}
                                rx={6} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />

                            {/* Heat flow arrows */}
                            {Array.from({ length: 5 }, (_, i) => {
                                const progress = ((tick * 2 + i * 72) % 360) / 360
                                const ax = BAR_X + progress * BAR_W
                                return (
                                    <g key={i} opacity={intensity}>
                                        <circle cx={ax} cy={BAR_Y + BAR_H / 2} r={3}
                                            fill="#EF9F27" opacity={0.7} />
                                    </g>
                                )
                            })}

                            {/* Labels */}
                            <rect x={BAR_X - 2} y={BAR_Y - 2} width={40} height={BAR_H + 4}
                                rx={4} fill="none" stroke="#D85A30" strokeWidth={1.5} />
                            <text x={BAR_X + 20} y={BAR_Y - 8} textAnchor="middle"
                                style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                                T₁={100 + deltaT / 2}°C
                            </text>
                            <rect x={BAR_X + BAR_W - 38} y={BAR_Y - 2} width={40} height={BAR_H + 4}
                                rx={4} fill="none" stroke="#378ADD" strokeWidth={1.5} />
                            <text x={BAR_X + BAR_W - 18} y={BAR_Y - 8} textAnchor="middle"
                                style={{ fontSize: 10, fill: '#378ADD', fontFamily: 'var(--mono)' }}>
                                T₂={100 - deltaT / 2}°C
                            </text>
                            <text x={W / 2} y={BAR_Y + BAR_H + 24} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                Q/t = kA(T₁−T₂)/d — heat flows through solid by molecular collision
                            </text>
                        </g>
                    )
                })()}

                {/* === CONVECTION === */}
                {mode === 'convection' && (() => {
                    const BX = 80, BY = 20, BW = 280, BH = 160
                    const nCells = 4
                    return (
                        <g>
                            {/* Container */}
                            <rect x={BX} y={BY} width={BW} height={BH}
                                rx={6} fill="rgba(55,138,221,0.08)"
                                stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

                            {/* Hot bottom */}
                            <rect x={BX} y={BY + BH - 14} width={BW} height={14}
                                rx={3} fill="rgba(216,90,48,0.4)" />
                            <text x={BX + BW / 2} y={BY + BH + 14} textAnchor="middle"
                                style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                                HOT SOURCE  {deltaT}°C above ambient
                            </text>

                            {/* Cool top */}
                            <rect x={BX} y={BY} width={BW} height={12}
                                rx={3} fill="rgba(55,138,221,0.3)" />

                            {/* Convection cell arrows */}
                            {Array.from({ length: nCells }, (_, i) => {
                                const cx = BX + (i + 0.5) * (BW / nCells)
                                const ph = ((tick * 1.5 + i * 90) % 360) / 360
                                // Rising on left, sinking on right of each cell
                                const riseY = BY + BH - 18 - ph * (BH - 30)
                                const sinkY = BY + 14 + ph * (BH - 30)
                                return (
                                    <g key={i} opacity={0.7 * intensity}>
                                        {/* Rising hot particle */}
                                        <circle cx={cx - 14} cy={riseY} r={4}
                                            fill="#D85A30" opacity={0.8} />
                                        {/* Sinking cool particle */}
                                        <circle cx={cx + 14} cy={sinkY} r={4}
                                            fill="#378ADD" opacity={0.7} />
                                    </g>
                                )
                            })}

                            {/* Cell boundary lines */}
                            {Array.from({ length: nCells - 1 }, (_, i) => (
                                <line key={i}
                                    x1={BX + (i + 1) * (BW / nCells)} y1={BY + 12}
                                    x2={BX + (i + 1) * (BW / nCells)} y2={BY + BH - 14}
                                    stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} strokeDasharray="3 3" />
                            ))}
                        </g>
                    )
                })()}

                {/* === RADIATION === */}
                {mode === 'radiation' && (() => {
                    const SX = W / 2, SY = H / 2
                    const nRays = 12
                    return (
                        <g>
                            {/* Source */}
                            <circle cx={SX} cy={SY} r={22}
                                fill={`rgba(216,90,48,${0.4 + 0.3 * intensity})`}
                                stroke="#D85A30" strokeWidth={1.5} />
                            <text x={SX} y={SY + 5} textAnchor="middle"
                                style={{ fontSize: 10, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                                {100 + deltaT}°C
                            </text>

                            {/* Radiation rays */}
                            {Array.from({ length: nRays }, (_, i) => {
                                const angle = (i / nRays) * 2 * Math.PI
                                const phase = ((tick * 2) % 60) / 60
                                const r1 = 28 + phase * 60
                                const r2 = r1 + 20
                                const opacity = Math.max(0, 1 - phase) * intensity
                                const x1 = SX + r1 * Math.cos(angle)
                                const y1 = SY + r1 * Math.sin(angle)
                                const x2 = SX + r2 * Math.cos(angle)
                                const y2 = SY + r2 * Math.sin(angle)
                                return (
                                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke="#EF9F27" strokeWidth={1.5} opacity={opacity} />
                                )
                            })}

                            {/* Receiver objects */}
                            {[
                                { x: SX - 130, y: SY - 20, label: 'Dark surface\nabsorbs more', col: '#444441' },
                                { x: SX + 100, y: SY - 20, label: 'Light surface\nreflects more', col: '#D3D1C7' },
                            ].map((obj, i) => (
                                <g key={i}>
                                    <rect x={obj.x} y={obj.y} width={36} height={40}
                                        rx={3} fill={obj.col} stroke="rgba(255,255,255,0.2)" strokeWidth={0.5} />
                                    <text x={obj.x + 18} y={obj.y + 54} textAnchor="middle"
                                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                        {obj.label.split('\n')[0]}
                                    </text>
                                    <text x={obj.x + 18} y={obj.y + 64} textAnchor="middle"
                                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                        {obj.label.split('\n')[1]}
                                    </text>
                                </g>
                            ))}

                            <text x={W / 2} y={H - 8} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                                E = σT⁴ — no medium needed — energy as electromagnetic waves
                            </text>
                        </g>
                    )
                })()}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {mode === 'conduction' && [
                    { label: 'Rate ∝ ΔT', val: `${deltaT}°C`, color: 'var(--amber)' },
                    { label: 'Rate ∝ 1/d', val: 'Thinner = faster', color: 'var(--teal)' },
                    { label: 'Rate ∝ k', val: 'Metal > wood > air', color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
                {mode === 'convection' && [
                    { label: 'Mechanism', val: 'Bulk fluid motion', color: 'var(--amber)' },
                    { label: 'Hot fluid', val: 'Rises (less dense)', color: 'var(--coral)' },
                    { label: 'Cool fluid', val: 'Sinks (more dense)', color: 'var(--teal)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
                {mode === 'radiation' && [
                    { label: 'E = σT⁴', val: `T=${100 + deltaT}K → ${Math.round(5.67e-8 * (100 + deltaT) ** 4)} W/m²`, color: 'var(--amber)' },
                    { label: 'Medium', val: 'None needed (vacuum OK)', color: 'var(--teal)' },
                    { label: 'Type', val: 'Infrared EM waves', color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}