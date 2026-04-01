import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280

export default function FrictionSim() {
    const [mass, setMass] = useState(5)      // kg
    const [mu_s, setMuS] = useState(0.5)   // static
    const [mu_k, setMuK] = useState(0.35)  // kinetic
    const [F, setF] = useState(15)    // applied force N
    const [angle, setAngle] = useState(0)     // incline angle degrees
    const [mode, setMode] = useState('flat') // flat | incline

    const g = 9.8
    const rad = angle * Math.PI / 180

    // Flat surface
    const N_flat = mass * g
    const f_s_max = mu_s * N_flat
    const f_k = mu_k * N_flat
    const isMovingF = F > f_s_max
    const f_actual_flat = isMovingF ? f_k : Math.min(F, f_s_max)
    const a_flat = isMovingF ? (F - f_k) / mass : 0
    const lambda_flat = Math.atan(mu_s) * 180 / Math.PI

    // Inclined surface
    const N_incl = mass * g * Math.cos(rad)
    const f_s_max_i = mu_s * N_incl
    const W_par = mass * g * Math.sin(rad)   // component along slope
    const isSliding = W_par > f_s_max_i
    const f_incl = isSliding ? mu_k * N_incl : Math.min(W_par, f_s_max_i)
    const a_incl = isSliding ? (W_par - mu_k * N_incl) / mass : 0
    const theta_rep = Math.atan(mu_s) * 180 / Math.PI   // angle of repose

    // SVG layout
    const SURF_Y = 160
    const OBJ_W = 52, OBJ_H = 38

    // Incline geometry
    const INC_X1 = 40, INC_Y1 = H - 40
    const INC_LEN = 280
    const INC_X2 = INC_X1 + INC_LEN * Math.cos(rad)
    const INC_Y2 = INC_Y1 - INC_LEN * Math.sin(rad)

    // Object on incline position
    const OBJ_POS = 0.5    // fraction along incline
    const OBJ_CX = INC_X1 + OBJ_POS * INC_LEN * Math.cos(rad)
    const OBJ_CY = INC_Y1 - OBJ_POS * INC_LEN * Math.sin(rad)

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
                {['flat', 'incline'].map(m => (
                    <button key={m} onClick={() => setMode(m)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: mode === m ? 'var(--amber)' : 'var(--bg3)',
                        color: mode === m ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{m === 'flat' ? 'Flat surface' : 'Inclined plane'}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                <SimSlider label="Mass m" unit=" kg" value={mass} min={1} max={20} step={0.5} onChange={setMass} />
                <SimSlider label="μₛ (static)" unit="" value={mu_s} min={0.1} max={1.0} step={0.05} onChange={setMuS} />
                <SimSlider label="μₖ (kinetic)" unit="" value={mu_k} min={0.05} max={mu_s} step={0.05} onChange={setMuK} />
                {mode === 'flat' && <SimSlider label="Applied F" unit=" N" value={F} min={0} max={100} step={1} onChange={setF} />}
                {mode === 'incline' && <SimSlider label="Angle θ" unit="°" value={angle} min={0} max={60} step={1} onChange={setAngle} />}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    {arrowDef('fri_f', '#EF9F27')}
                    {arrowDef('fri_fk', '#D85A30')}
                    {arrowDef('fri_n', '#1D9E75')}
                    {arrowDef('fri_g', '#378ADD')}
                    {arrowDef('fri_res', '#7F77DD')}
                </defs>

                {/* ── FLAT MODE ── */}
                {mode === 'flat' && (
                    <g>
                        {/* Surface */}
                        <rect x={0} y={SURF_Y} width={W} height={12}
                            fill="rgba(29,158,117,0.15)"
                            stroke="rgba(29,158,117,0.35)" strokeWidth={1.5} />

                        {/* Block */}
                        <rect x={W / 2 - OBJ_W / 2} y={SURF_Y - OBJ_H}
                            width={OBJ_W} height={OBJ_H}
                            rx={5} fill={isMovingF ? 'rgba(239,159,39,0.25)' : 'rgba(55,138,221,0.2)'}
                            stroke={isMovingF ? '#EF9F27' : '#378ADD'} strokeWidth={2} />
                        <text x={W / 2} y={SURF_Y - OBJ_H / 2 + 5} textAnchor="middle"
                            style={{ fontSize: 11, fill: isMovingF ? '#EF9F27' : '#378ADD', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            {mass}kg
                        </text>

                        {/* Applied force */}
                        <line x1={W / 2 - OBJ_W / 2 - 8} y1={SURF_Y - OBJ_H / 2}
                            x2={W / 2 - OBJ_W / 2 - 8 - Math.min(F * 1.5, 80)} y2={SURF_Y - OBJ_H / 2}
                            stroke="#EF9F27" strokeWidth={2.5}
                            markerEnd="url(#fri_f)" />
                        <text x={W / 2 - OBJ_W / 2 - 44} y={SURF_Y - OBJ_H / 2 - 10}
                            textAnchor="middle"
                            style={{ fontSize: 10, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>F={F}N</text>

                        {/* Friction force */}
                        <line x1={W / 2 + OBJ_W / 2 + 8} y1={SURF_Y - OBJ_H / 2}
                            x2={W / 2 + OBJ_W / 2 + 8 + Math.min(f_actual_flat * 1.2, 70)} y2={SURF_Y - OBJ_H / 2}
                            stroke="#D85A30" strokeWidth={2}
                            markerEnd="url(#fri_fk)" />
                        <text x={W / 2 + OBJ_W / 2 + 44} y={SURF_Y - OBJ_H / 2 - 10}
                            textAnchor="middle"
                            style={{ fontSize: 10, fill: '#D85A30', fontFamily: 'var(--mono)' }}>
                            f={f_actual_flat.toFixed(1)}N
                        </text>

                        {/* Normal */}
                        <line x1={W / 2} y1={SURF_Y - OBJ_H}
                            x2={W / 2} y2={SURF_Y - OBJ_H - 36}
                            stroke="#1D9E75" strokeWidth={1.5}
                            markerEnd="url(#fri_n)" />

                        {/* Weight */}
                        <line x1={W / 2} y1={SURF_Y}
                            x2={W / 2} y2={SURF_Y + 32}
                            stroke="#378ADD" strokeWidth={1.5}
                            markerEnd="url(#fri_g)" />

                        {/* Friction cone */}
                        {(() => {
                            const cx = W - 80, cy = SURF_Y - 50
                            const R = 40
                            const la = lambda_flat * Math.PI / 180
                            return (
                                <g>
                                    <circle cx={cx} cy={cy + R} r={4} fill="#888" />
                                    <line x1={cx} y1={cy + R} x2={cx + R * Math.sin(la)} y2={cy + R - R * Math.cos(la)}
                                        stroke="rgba(127,119,221,0.5)" strokeWidth={1.5} />
                                    <line x1={cx} y1={cy + R} x2={cx - R * Math.sin(la)} y2={cy + R - R * Math.cos(la)}
                                        stroke="rgba(127,119,221,0.5)" strokeWidth={1.5} />
                                    <line x1={cx} y1={cy + R} x2={cx} y2={cy}
                                        stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 2" />
                                    <text x={cx} y={cy - 6} textAnchor="middle"
                                        style={{ fontSize: 9, fill: 'rgba(127,119,221,0.7)', fontFamily: 'var(--mono)' }}>
                                        λ={lambda_flat.toFixed(1)}°
                                    </text>
                                </g>
                            )
                        })()}

                        {/* Status */}
                        <text x={W / 2} y={36} textAnchor="middle"
                            style={{ fontSize: 12, fill: isMovingF ? '#EF9F27' : '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {isMovingF
                                ? `SLIDING — a = ${a_flat.toFixed(2)} m/s²`
                                : `STATIC — object not moving (F < f_s_max=${f_s_max.toFixed(1)}N)`}
                        </text>
                    </g>
                )}

                {/* ── INCLINE MODE ── */}
                {mode === 'incline' && (
                    <g>
                        {/* Inclined surface */}
                        <polygon
                            points={`${INC_X1},${INC_Y1} ${INC_X2},${INC_Y2} ${INC_X2},${INC_Y1}`}
                            fill="rgba(29,158,117,0.1)"
                            stroke="rgba(29,158,117,0.4)" strokeWidth={1.5} />

                        {/* Angle arc */}
                        <path d={`M ${INC_X1 + 40} ${INC_Y1} A 40 40 0 0 0 ${INC_X1 + 40 * Math.cos(rad)} ${INC_Y1 - 40 * Math.sin(rad)}`}
                            fill="none" stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                        <text x={INC_X1 + 50} y={INC_Y1 - 10}
                            style={{ fontSize: 10, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>
                            θ={angle}°
                        </text>

                        {/* Block on incline */}
                        <g transform={`translate(${OBJ_CX},${OBJ_CY}) rotate(${-angle})`}>
                            <rect x={-OBJ_W / 2} y={-OBJ_H} width={OBJ_W} height={OBJ_H}
                                rx={5}
                                fill={isSliding ? 'rgba(216,90,48,0.25)' : 'rgba(29,158,117,0.2)'}
                                stroke={isSliding ? '#D85A30' : '#1D9E75'} strokeWidth={2} />
                            <text x={0} y={-OBJ_H / 2 + 5} textAnchor="middle"
                                style={{ fontSize: 10, fill: isSliding ? '#D85A30' : '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                                {mass}kg
                            </text>

                            {/* Normal force (perpendicular to surface = up in rotated frame) */}
                            <line x1={0} y1={-OBJ_H} x2={0} y2={-OBJ_H - 36}
                                stroke="#1D9E75" strokeWidth={1.5}
                                markerEnd="url(#fri_n)" />

                            {/* Friction (along surface uphill) */}
                            <line x1={-OBJ_W / 2} y1={-OBJ_H / 2}
                                x2={-OBJ_W / 2 - 34} y2={-OBJ_H / 2}
                                stroke="#D85A30" strokeWidth={1.5}
                                markerEnd="url(#fri_fk)" />
                            <text x={-OBJ_W / 2 - 18} y={-OBJ_H / 2 - 8} textAnchor="middle"
                                style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>f</text>
                        </g>

                        {/* Weight arrow (vertical) */}
                        <line x1={OBJ_CX} y1={OBJ_CY}
                            x2={OBJ_CX} y2={OBJ_CY + 44}
                            stroke="#378ADD" strokeWidth={2}
                            markerEnd="url(#fri_g)" />
                        <text x={OBJ_CX + 8} y={OBJ_CY + 36}
                            style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>
                            mg={(mass * g).toFixed(0)}N
                        </text>

                        {/* Angle of repose marker */}
                        <text x={INC_X2 + 10} y={INC_Y2 + 20}
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                            θ_rep={theta_rep.toFixed(1)}°
                        </text>

                        {/* Status */}
                        <text x={W / 2 + 40} y={50} textAnchor="middle"
                            style={{ fontSize: 11, fill: isSliding ? '#D85A30' : '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {isSliding
                                ? `SLIDING — a=${a_incl.toFixed(2)}m/s²`
                                : angle >= theta_rep - 1
                                    ? `On verge of sliding (θ≈θ_rep)`
                                    : `STATIC — θ<θ_rep=${theta_rep.toFixed(1)}°`}
                        </text>
                    </g>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(mode === 'flat' ? [
                    { label: 'f_s max = μₛN', val: `${f_s_max.toFixed(2)} N`, color: 'var(--teal)' },
                    { label: 'f_k = μₖN', val: `${f_k.toFixed(2)} N`, color: 'var(--coral)' },
                    { label: 'Angle of friction λ', val: `${lambda_flat.toFixed(2)}°`, color: '#7F77DD' },
                    { label: 'Acceleration', val: `${a_flat.toFixed(3)} m/s²`, color: 'var(--amber)' },
                ] : [
                    { label: 'W∥ = mg sinθ', val: `${W_par.toFixed(2)} N`, color: 'var(--coral)' },
                    { label: 'N = mg cosθ', val: `${N_incl.toFixed(2)} N`, color: 'var(--teal)' },
                    { label: 'Angle of repose', val: `${theta_rep.toFixed(2)}°`, color: '#7F77DD' },
                    { label: 'a (if sliding)', val: `${a_incl.toFixed(3)} m/s²`, color: 'var(--amber)' },
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