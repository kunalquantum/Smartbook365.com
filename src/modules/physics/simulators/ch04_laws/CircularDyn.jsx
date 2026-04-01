import { useState, useEffect, useRef } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300

export default function CircularDyn() {
    const [mode, setMode] = useState('banking')  // banking | pendulum
    const [v, setV] = useState(15)   // m/s (banking)
    const [R, setR] = useState(50)   // m (banking radius)
    const [mass, setMass] = useState(1000) // kg (car)
    const [L, setL] = useState(0.5)  // m string length
    const [omega, setOmega] = useState(3)    // rad/s (pendulum)

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
    const g = 9.8

    // ── BANKING ──
    const theta_opt = Math.atan(v * v / (R * g))   // optimal banking angle
    const theta_deg = theta_opt * 180 / Math.PI
    const N_bank = mass * g / Math.cos(theta_opt)
    const f_c_bank = mass * v * v / R

    // ── CONICAL PENDULUM ──
    const theta_pend = Math.acos(g / (L * omega * omega))  // half-angle
    const theta_pend_deg = isNaN(theta_pend) ? 0 : theta_pend * 180 / Math.PI
    const r_pend = isNaN(theta_pend) ? 0 : L * Math.sin(theta_pend)
    const T_tension = isNaN(theta_pend) ? mass * g : mass * g / Math.cos(theta_pend)
    const Fc_pend = isNaN(theta_pend) ? 0 : mass * omega * omega * r_pend
    const valid = !isNaN(theta_pend) && omega * omega > g / L

    // Pendulum animation
    const pendAngle = t * omega
    const PEND_CX = W * 0.7, PEND_CY = 60
    const PEND_R = Math.min(80, r_pend * 120)
    const ballX = PEND_CX + PEND_R * Math.cos(pendAngle)
    const ballY = PEND_CY + (valid ? L * 80 * Math.cos(theta_pend) : L * 80)
    const stringX = PEND_CX + PEND_R * Math.cos(pendAngle)
    const stringY = PEND_CY + (valid ? L * 80 * Math.cos(theta_pend) : L * 80)

    // Banking SVG
    const BANK_CX = W * 0.3, BANK_CY = H / 2
    const ROAD_W = 120, ROAD_H = 30
    const bank_rad = theta_opt

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
                {['banking', 'pendulum'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'banking' ? 'Banked road' : 'Conical pendulum'}</button>
                ))}
            </div>

            {mode === 'banking' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="Speed v" unit=" m/s" value={v} min={5} max={40} step={1} onChange={setV} />
                    <SimSlider label="Radius R" unit=" m" value={R} min={10} max={200} step={5} onChange={setR} />
                    <SimSlider label="Car mass" unit=" kg" value={mass} min={500} max={3000} step={100} onChange={setMass} />
                </div>
            )}

            {mode === 'pendulum' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                    <SimSlider label="String length L" unit=" m" value={L} min={0.1} max={2} step={0.05} onChange={setL} />
                    <SimSlider label="Angular speed ω" unit=" rad/s" value={omega} min={1} max={10} step={0.1} onChange={setOmega} />
                </div>
            )}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('cd_n', '#1D9E75')}
                    {arrowDef('cd_g', '#378ADD')}
                    {arrowDef('cd_f', '#EF9F27')}
                    {arrowDef('cd_t', '#D85A30')}
                </defs>

                {/* ── BANKING ── */}
                {mode === 'banking' && (
                    <g>
                        {/* Banked road cross-section */}
                        <g transform={`translate(${BANK_CX},${BANK_CY}) rotate(${-theta_deg})`}>
                            <rect x={-ROAD_W / 2} y={-ROAD_H / 2} width={ROAD_W} height={ROAD_H}
                                rx={4} fill="rgba(160,176,200,0.15)"
                                stroke="rgba(160,176,200,0.4)" strokeWidth={1.5} />
                            {/* Road markings */}
                            <line x1={-20} y1={-ROAD_H / 2} x2={20} y2={-ROAD_H / 2}
                                stroke="rgba(239,159,39,0.4)" strokeWidth={1.5} strokeDasharray="8 4" />

                            {/* Car on road */}
                            <rect x={-18} y={-ROAD_H / 2 - 22} width={36} height={20}
                                rx={4} fill="rgba(29,158,117,0.2)"
                                stroke="#1D9E75" strokeWidth={1.5} />
                            <text x={0} y={-ROAD_H / 2 - 8} textAnchor="middle"
                                style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>car</text>

                            {/* Normal force (perpendicular to banked road) */}
                            <line x1={0} y1={-ROAD_H / 2 - 22}
                                x2={0} y2={-ROAD_H / 2 - 70}
                                stroke="#1D9E75" strokeWidth={2}
                                markerEnd="url(#cd_n)" />
                            <text x={8} y={-ROAD_H / 2 - 50}
                                style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>N</text>
                        </g>

                        {/* Gravity (vertical) */}
                        <line x1={BANK_CX} y1={BANK_CY - ROAD_H / 2 - 22}
                            x2={BANK_CX} y2={BANK_CY - ROAD_H / 2 - 22 + 50}
                            stroke="#378ADD" strokeWidth={2}
                            markerEnd="url(#cd_g)" />
                        <text x={BANK_CX + 8} y={BANK_CY - ROAD_H / 2 - 22 + 38}
                            style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>mg</text>

                        {/* Centripetal (horizontal) */}
                        <line x1={BANK_CX} y1={BANK_CY}
                            x2={BANK_CX + 60} y2={BANK_CY}
                            stroke="#EF9F27" strokeWidth={2}
                            markerEnd="url(#cd_f)" />
                        <text x={BANK_CX + 30} y={BANK_CY - 8}
                            style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>Fc</text>

                        {/* Banking angle arc */}
                        <path d={`M ${BANK_CX + 40} ${BANK_CY}
              A 40 40 0 0 0
              ${BANK_CX + 40 * Math.cos(bank_rad + Math.PI / 2)}
              ${BANK_CY - 40 * Math.sin(bank_rad + Math.PI / 2)}`}
                            fill="none" stroke="rgba(239,159,39,0.3)" strokeWidth={1} />
                        <text x={BANK_CX + 50} y={BANK_CY - 20}
                            style={{ fontSize: 10, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>
                            θ={theta_deg.toFixed(1)}°
                        </text>

                        {/* Info panel */}
                        <rect x={W * 0.58} y={20} width={170} height={130}
                            rx={6} fill="rgba(0,0,0,0.2)"
                            stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                        <text x={W * 0.58 + 10} y={40}
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.7)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            Banking angle
                        </text>
                        {[
                            `θ = tan⁻¹(v²/Rg)`,
                            `  = tan⁻¹(${v}²/${R}×${g})`,
                            `  = ${theta_deg.toFixed(2)}°`,
                            ``,
                            `N = ${(N_bank / 1000).toFixed(2)} kN`,
                            `Fc = mv²/R = ${(f_c_bank / 1000).toFixed(2)} kN`,
                        ].map((line, i) => (
                            <text key={i} x={W * 0.58 + 10} y={56 + i * 14}
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                {line}
                            </text>
                        ))}

                        {/* Formula */}
                        <text x={W / 2} y={H - 12} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                            N sinθ = mv²/R (centripetal)  |  N cosθ = mg (vertical)
                        </text>
                    </g>
                )}

                {/* ── CONICAL PENDULUM ── */}
                {mode === 'pendulum' && (
                    <g>
                        {/* Pivot */}
                        <circle cx={PEND_CX} cy={PEND_CY} r={6}
                            fill="rgba(160,176,200,0.3)"
                            stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

                        {/* Orbit trace */}
                        <ellipse cx={PEND_CX} cy={ballY} rx={PEND_R} ry={PEND_R * 0.25}
                            fill="none" stroke="rgba(255,255,255,0.06)"
                            strokeWidth={1} strokeDasharray="4 3" />

                        {/* String */}
                        <line x1={PEND_CX} y1={PEND_CY}
                            x2={ballX} y2={ballY}
                            stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

                        {/* Vertical reference */}
                        <line x1={PEND_CX} y1={PEND_CY}
                            x2={PEND_CX} y2={PEND_CY + L * 80 + 20}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={0.8} strokeDasharray="3 3" />

                        {/* Ball */}
                        <circle cx={ballX} cy={ballY} r={10}
                            fill="rgba(239,159,39,0.4)"
                            stroke="#EF9F27" strokeWidth={2} />

                        {/* Tension arrow (along string) */}
                        {valid && (() => {
                            const dx = PEND_CX - ballX
                            const dy = PEND_CY - ballY
                            const len = Math.sqrt(dx * dx + dy * dy)
                            const tscale = 40
                            return (
                                <line x1={ballX} y1={ballY}
                                    x2={ballX + (dx / len) * tscale} y2={ballY + (dy / len) * tscale}
                                    stroke="#D85A30" strokeWidth={2}
                                    markerEnd="url(#cd_t)" />
                            )
                        })()}

                        {/* Weight (vertical down) */}
                        <line x1={ballX} y1={ballY}
                            x2={ballX} y2={ballY + 36}
                            stroke="#378ADD" strokeWidth={1.5}
                            markerEnd="url(#cd_g)" />
                        <text x={ballX + 8} y={ballY + 30}
                            style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>mg</text>

                        {/* Centripetal (horizontal toward axis) */}
                        {valid && (
                            <line x1={ballX} y1={ballY}
                                x2={PEND_CX} y2={ballY}
                                stroke="#EF9F27" strokeWidth={1.5}
                                markerEnd="url(#cd_f)" />
                        )}

                        {/* Theta angle label */}
                        {valid && (
                            <>
                                <path d={`M ${PEND_CX} ${PEND_CY + 30}
                  A 30 30 0 0 1
                  ${PEND_CX + 30 * Math.sin(theta_pend) * Math.cos(pendAngle)}
                  ${PEND_CY + 30 * Math.cos(theta_pend)}`}
                                    fill="none" stroke="rgba(239,159,39,0.3)" strokeWidth={1} />
                                <text x={PEND_CX + 18} y={PEND_CY + 42}
                                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                                    θ={theta_pend_deg.toFixed(1)}°
                                </text>
                            </>
                        )}

                        {/* Info panel */}
                        <rect x={14} y={20} width={200} height={140}
                            rx={6} fill="rgba(0,0,0,0.2)"
                            stroke="rgba(255,255,255,0.06)" strokeWidth={0.5} />
                        {[
                            `Conical pendulum`,
                            ``,
                            `L = ${L} m  |  ω = ${omega} rad/s`,
                            ``,
                            valid
                                ? `θ = ${theta_pend_deg.toFixed(2)}°`
                                : `ω too slow — hangs vertical`,
                            valid ? `r = ${r_pend.toFixed(3)} m` : '',
                            valid ? `T = ${T_tension.toFixed(3)} N` : '',
                            valid ? `Fc = ${Fc_pend.toFixed(3)} N` : '',
                        ].map((line, i) => (
                            <text key={i} x={24} y={36 + i * 14}
                                style={{
                                    fontSize: i === 0 ? 10 : 9,
                                    fill: i === 0 ? 'rgba(160,176,200,0.7)' : 'rgba(160,176,200,0.5)',
                                    fontFamily: 'var(--mono)',
                                    fontWeight: i === 0 ? 600 : 400,
                                }}>
                                {line}
                            </text>
                        ))}

                        {!valid && (
                            <text x={PEND_CX} y={PEND_CY + L * 80 + 40} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                                ω² &lt; g/L — string hangs straight
                            </text>
                        )}
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'banking' ? [
                    { label: 'Optimal θ = tan⁻¹(v²/Rg)', val: `${theta_deg.toFixed(3)}°`, color: 'var(--amber)' },
                    { label: 'Normal force N', val: `${(N_bank / 1000).toFixed(3)} kN`, color: 'var(--teal)' },
                    { label: 'Centripetal Fc=mv²/R', val: `${(f_c_bank / 1000).toFixed(3)} kN`, color: 'var(--coral)' },
                    { label: 'N sinθ = Fc ✓', val: `${(N_bank * Math.sin(theta_opt) / f_c_bank).toFixed(4)}`, color: 'var(--text2)' },
                ] : [
                    { label: 'Half-angle θ', val: valid ? `${theta_pend_deg.toFixed(2)}°` : '—', color: 'var(--amber)' },
                    { label: 'Orbit radius r', val: valid ? `${r_pend.toFixed(4)} m` : '—', color: 'var(--teal)' },
                    { label: 'Tension T', val: valid ? `${T_tension.toFixed(3)} N` : '—', color: 'var(--coral)' },
                    { label: 'Centripetal Fc', val: valid ? `${Fc_pend.toFixed(3)} N` : '—', color: 'var(--text2)' },
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