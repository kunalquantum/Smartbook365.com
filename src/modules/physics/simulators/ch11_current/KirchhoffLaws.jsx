import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300

export default function KirchhoffLaws() {
    const [E1, setE1] = useState(12)   // V  battery 1
    const [E2, setE2] = useState(6)    // V  battery 2
    const [R1, setR1] = useState(4)    // Ω
    const [R2, setR2] = useState(2)    // Ω
    const [R3, setR3] = useState(3)    // Ω
    const [mode, setMode] = useState('kirchhoff')  // kirchhoff | wheatstone

    // ── Kirchhoff two-loop solver ──────────────────────────────
    // Circuit: E1 in loop1 (left), E2 in loop2 (right), R1 top, R2 middle, R3 bottom
    // I1 flows clockwise in loop1, I2 clockwise in loop2
    // KVL loop1: E1 - I1*R1 - (I1-I2)*R2 = 0
    // KVL loop2: E2 - I2*R3 - (I2-I1)*R2 = 0
    // => (R1+R2)*I1 - R2*I2 = E1
    //    -R2*I1 + (R2+R3)*I2 = E2

    const { I1, I2, I3, V_R1, V_R2, V_R3 } = useMemo(() => {
        const a = R1 + R2, b = -R2
        const c = -R2, d = R2 + R3
        const det = a * d - b * c
        if (Math.abs(det) < 1e-10) return { I1: 0, I2: 0, I3: 0, V_R1: 0, V_R2: 0, V_R3: 0 }
        const i1 = (E1 * d - E2 * b) / det
        const i2 = (a * E2 - c * E1) / det
        const i3 = i1 - i2
        return {
            I1: i1, I2: i2, I3: i3,
            V_R1: i1 * R1, V_R2: Math.abs(i3) * R2, V_R3: i2 * R3,
        }
    }, [E1, E2, R1, R2, R3])

    // ── Wheatstone bridge ──────────────────────────────────────
    const [P_w, setP_w] = useState(3)
    const [Q_w, setQ_w] = useState(3)
    const [R_w, setR_w] = useState(6)
    const [S_w, setS_w] = useState(6)
    const balanced = Math.abs(P_w * S_w - Q_w * R_w) < 0.5
    const R_unknown = (Q_w * R_w) / P_w

    // Circuit node positions
    const A = { x: 80, y: H / 2 }     // left node  (−)
    const B = { x: W / 2, y: 80 }     // top node
    const C = { x: W - 80, y: H / 2 }     // right node (+)
    const D = { x: W / 2, y: H - 80 }     // bottom node
    const MID = { x: W / 2, y: H / 2 }     // middle node (shared R2)

    const arrowDef = (id, color) => (
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
    )

    const Wire = ({ x1, y1, x2, y2, I, color = '#EF9F27', id }) => {
        const thick = Math.min(4, 1 + Math.abs(I) * 0.5)
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        return (
            <g>
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth={thick}
                    opacity={0.7} markerEnd={id ? `url(#${id})` : undefined} />
                <text x={mx} y={my - 8} textAnchor="middle"
                    style={{ fontSize: 9, fill: color, fontFamily: 'var(--mono)' }}>
                    {Math.abs(I).toFixed(3)}A
                </text>
            </g>
        )
    }

    const Resistor = ({ x1, y1, x2, y2, R, label }) => {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        const isVert = Math.abs(x2 - x1) < 10
        return (
            <g>
                <rect x={isVert ? mx - 10 : mx - 20} y={isVert ? my - 20 : my - 8}
                    width={isVert ? 20 : 40} height={isVert ? 40 : 16}
                    rx={3} fill="var(--bg3)"
                    stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                <text x={mx} y={my + 4} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'var(--text1)', fontFamily: 'var(--mono)' }}>
                    {R}Ω
                </text>
                {label && (
                    <text x={mx + (isVert ? 16 : 0)} y={my + (isVert ? 0 : -14)} textAnchor="middle"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                        {label}
                    </text>
                )}
            </g>
        )
    }

    const Battery = ({ x1, y1, x2, y2, E, label }) => {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        const isVert = Math.abs(x2 - x1) < 10
        return (
            <g>
                {/* Long + short lines */}
                <line x1={isVert ? mx - 14 : mx} y1={isVert ? my : my - 14}
                    x2={isVert ? mx + 14 : mx} y2={isVert ? my : my + 14}
                    stroke="#EF9F27" strokeWidth={2.5} />
                <line x1={isVert ? mx - 8 : mx + 8} y1={isVert ? my + 8 : my - 8}
                    x2={isVert ? mx + 8 : mx + 8} y2={isVert ? my + 8 : my + 8}
                    stroke="#EF9F27" strokeWidth={1.5} />
                <text x={mx + (isVert ? 18 : 0)} y={my + (isVert ? 4 : -18)} textAnchor="middle"
                    style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                    {E}V
                </text>
                {label && (
                    <text x={mx - (isVert ? 18 : 0)} y={my + 4} textAnchor="end"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                        {label}
                    </text>
                )}
            </g>
        )
    }

    // Node dot
    const Node = ({ x, y, label }) => (
        <g>
            <circle cx={x} cy={y} r={5} fill="#EF9F27" opacity={0.8} />
            {label && <text x={x - 10} y={y + 4} textAnchor="end"
                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>{label}</text>}
        </g>
    )

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['kirchhoff', 'wheatstone'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'kirchhoff' ? "Kirchhoff's Laws" : 'Wheatstone Bridge'}</button>
                ))}
            </div>

            {mode === 'kirchhoff' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <SimSlider label="E₁" unit=" V" value={E1} min={1} max={20} step={0.5} onChange={setE1} />
                        <SimSlider label="E₂" unit=" V" value={E2} min={1} max={20} step={0.5} onChange={setE2} />
                        <SimSlider label="R₁" unit=" Ω" value={R1} min={1} max={20} step={0.5} onChange={setR1} />
                        <SimSlider label="R₂" unit=" Ω" value={R2} min={1} max={20} step={0.5} onChange={setR2} />
                        <SimSlider label="R₃" unit=" Ω" value={R3} min={1} max={20} step={0.5} onChange={setR3} />
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                        style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                        <defs>
                            {arrowDef('kw1', '#1D9E75')}
                            {arrowDef('kw2', '#D85A30')}
                            {arrowDef('kw3', '#EF9F27')}
                        </defs>

                        {/* Loop 1: left rectangle */}
                        {/* Top wire: A→B (via top) */}
                        <line x1={A.x} y1={A.y} x2={A.x} y2={80}
                            stroke="rgba(29,158,117,0.6)" strokeWidth={1.5} />
                        <line x1={A.x} y1={80} x2={W / 2 - 20} y2={80}
                            stroke="rgba(29,158,117,0.6)" strokeWidth={1.5} />
                        {/* Bottom wire */}
                        <line x1={A.x} y1={A.y} x2={A.x} y2={H - 80}
                            stroke="rgba(29,158,117,0.4)" strokeWidth={1} />
                        <line x1={A.x} y1={H - 80} x2={W / 2 - 20} y2={H - 80}
                            stroke="rgba(29,158,117,0.4)" strokeWidth={1} />

                        {/* Loop 2: right rectangle */}
                        <line x1={C.x} y1={C.y} x2={C.x} y2={80}
                            stroke="rgba(216,90,48,0.6)" strokeWidth={1.5} />
                        <line x1={C.x} y1={80} x2={W / 2 + 20} y2={80}
                            stroke="rgba(216,90,48,0.6)" strokeWidth={1.5} />
                        <line x1={C.x} y1={C.y} x2={C.x} y2={H - 80}
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1} />
                        <line x1={C.x} y1={H - 80} x2={W / 2 + 20} y2={H - 80}
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1} />

                        {/* Middle wire (R2) */}
                        <line x1={W / 2} y1={80} x2={W / 2} y2={H - 80}
                            stroke="rgba(239,159,39,0.7)" strokeWidth={2} />

                        {/* Components */}
                        <Battery x1={A.x} y1={A.y - 30} x2={A.x} y2={A.y + 30} E={E1} label="E₁" />
                        <Battery x1={C.x} y1={C.y - 30} x2={C.x} y2={C.y + 30} E={E2} label="E₂" />
                        <Resistor x1={A.x + 10} y1={80} x2={W / 2 - 20} y2={80} R={R1} label="R₁" />
                        <Resistor x1={W / 2} y1={H / 2 - 20} x2={W / 2} y2={H / 2 + 20} R={R2} label="R₂" />
                        <Resistor x1={W / 2 + 20} y1={H - 80} x2={C.x - 10} y2={H - 80} R={R3} label="R₃" />

                        {/* Current labels */}
                        <text x={A.x + 40} y={100}
                            style={{ fontSize: 10, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                            I₁={I1.toFixed(3)}A
                        </text>
                        <text x={C.x - 50} y={H - 60}
                            style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            I₂={I2.toFixed(3)}A
                        </text>
                        <text x={W / 2 + 14} y={H / 2 + 4}
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>
                            I₃={I3.toFixed(3)}A
                        </text>

                        {/* KCL note */}
                        <text x={W / 2} y={H - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                            KCL: I₁ = I₂ + I₃  →  {I1.toFixed(3)} = {I2.toFixed(3)} + {I3.toFixed(3)}
                        </text>
                    </svg>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'I₁ (loop 1)', val: `${I1.toFixed(4)} A`, color: 'var(--teal)' },
                            { label: 'I₂ (loop 2)', val: `${I2.toFixed(4)} A`, color: 'var(--coral)' },
                            { label: 'I₃ (middle)', val: `${I3.toFixed(4)} A`, color: 'var(--amber)' },
                            { label: 'KCL check', val: Math.abs(I1 - I2 - I3) < 1e-9 ? '✓ I₁=I₂+I₃' : '✗', color: 'var(--teal)' },
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

                    {/* KVL verification */}
                    <div style={{
                        marginTop: 12, background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)',
                        fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)',
                    }}>
                        <div style={{ marginBottom: 4 }}>KVL Loop 1: E₁ − I₁R₁ − I₃R₂ = {(E1 - I1 * R1 - I3 * R2).toFixed(6)} ≈ 0 ✓</div>
                        <div>KVL Loop 2: E₂ − I₂R₃ + I₃R₂ = {(E2 - I2 * R3 + I3 * R2).toFixed(6)} ≈ 0 ✓</div>
                    </div>
                </>
            )}

            {mode === 'wheatstone' && (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <SimSlider label="P" unit=" Ω" value={P_w} min={1} max={20} step={0.5} onChange={setP_w} />
                        <SimSlider label="Q" unit=" Ω" value={Q_w} min={1} max={20} step={0.5} onChange={setQ_w} />
                        <SimSlider label="R (known)" unit=" Ω" value={R_w} min={1} max={20} step={0.5} onChange={setR_w} />
                        <SimSlider label="S (adjust)" unit=" Ω" value={S_w} min={1} max={20} step={0.5} onChange={setS_w} />
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                        style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                        {/* Diamond shape: A(left) B(top) C(right) D(bottom) */}
                        {/* Wires */}
                        {[
                            [A, B], [B, C], [A, D], [D, C]
                        ].map(([s, e], i) => (
                            <line key={i} x1={s.x} y1={s.y} x2={e.x} y2={e.y}
                                stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
                        ))}

                        {/* Galvanometer (bridge wire B→D) */}
                        <line x1={B.x} y1={B.y} x2={D.x} y2={D.y}
                            stroke={balanced ? '#1D9E75' : '#D85A30'} strokeWidth={1.5}
                            strokeDasharray={balanced ? undefined : '4 3'} />
                        <circle cx={(B.x + D.x) / 2} cy={(B.y + D.y) / 2} r={10}
                            fill="var(--bg3)"
                            stroke={balanced ? '#1D9E75' : '#D85A30'} strokeWidth={1.5} />
                        <text x={(B.x + D.x) / 2} y={(B.y + D.y) / 2 + 4} textAnchor="middle"
                            style={{ fontSize: 9, fill: balanced ? '#1D9E75' : '#D85A30', fontFamily: 'var(--mono)' }}>G</text>

                        {/* Battery at A */}
                        <text x={A.x - 16} y={A.y + 4} textAnchor="end"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>E</text>
                        <circle cx={A.x} cy={A.y} r={8}
                            fill="rgba(239,159,39,0.2)" stroke="#EF9F27" strokeWidth={1.5} />

                        {/* Resistor labels on arms */}
                        {[
                            { pos: { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 }, label: 'P', val: P_w },
                            { pos: { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 }, label: 'Q', val: Q_w },
                            { pos: { x: (A.x + D.x) / 2, y: (A.y + D.y) / 2 }, label: 'R', val: R_w },
                            { pos: { x: (D.x + C.x) / 2, y: (D.y + C.y) / 2 }, label: 'S', val: S_w },
                        ].map(arm => (
                            <g key={arm.label}>
                                <rect x={arm.pos.x - 20} y={arm.pos.y - 12} width={40} height={24}
                                    rx={4} fill="var(--bg3)"
                                    stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
                                <text x={arm.pos.x} y={arm.pos.y + 4} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'var(--text1)', fontFamily: 'var(--mono)' }}>
                                    {arm.label}={arm.val}Ω
                                </text>
                            </g>
                        ))}

                        {/* Nodes */}
                        {[A, B, C, D].map((nd, i) => (
                            <circle key={i} cx={nd.x} cy={nd.y} r={5}
                                fill="#EF9F27" opacity={0.7} />
                        ))}

                        {/* Balance condition */}
                        <text x={W / 2} y={H - 10} textAnchor="middle"
                            style={{ fontSize: 10, fill: balanced ? 'rgba(29,158,117,0.8)' : 'rgba(216,90,48,0.8)', fontFamily: 'var(--mono)' }}>
                            {balanced ? '✓ BALANCED: P/Q = R/S' : `✗ Unbalanced: P×S=${P_w * S_w}  Q×R=${Q_w * R_w}`}
                        </text>
                    </svg>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'P/Q', val: (P_w / Q_w).toFixed(3), color: 'var(--amber)' },
                            { label: 'R/S', val: (R_w / S_w).toFixed(3), color: 'var(--teal)' },
                            { label: 'Balance', val: balanced ? 'Yes — I_G = 0' : 'No — adjust S', color: balanced ? 'var(--teal)' : 'var(--coral)' },
                            { label: 'R_unknown = QR/P', val: `${R_unknown.toFixed(3)} Ω`, color: 'var(--text2)' },
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
                </>
            )}
        </div>
    )
}