import { useState, useMemo } from 'react'
import { GASES } from './helpers/gasData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const R = 8.314, kB = 1.381e-23

export default function KineticTheory() {
    const [gas1, setGas1] = useState('N₂')
    const [gas2, setGas2] = useState('H₂')
    const [T, setT] = useState(300)
    const [showGas2, setShowGas2] = useState(true)
    const [mode, setMode] = useState('distribution')  // distribution | effusion

    const buildDist = (gasKey) => {
        const M = GASES[gasKey].M / 1000  // kg/mol
        return Array.from({ length: 120 }, (_, i) => {
            const v = i * 15   // m/s
            // Maxwell-Boltzmann: f(v) = 4π(M/2πRT)^(3/2) v² exp(-Mv²/2RT)
            const A = 4 * Math.PI * Math.pow(M / (2 * Math.PI * R * T), 1.5)
            const f = A * v * v * Math.exp(-M * v * v / (2 * R * T))
            return { v, f }
        })
    }

    const dist1 = useMemo(() => buildDist(gas1), [gas1, T])
    const dist2 = useMemo(() => buildDist(gas2), [gas2, T])

    const speeds = (gasKey) => {
        const M = GASES[gasKey].M / 1000
        return {
            ump: Math.sqrt(2 * R * T / M),          // most probable
            uavg: Math.sqrt(8 * R * T / (Math.PI * M)),// average
            urms: Math.sqrt(3 * R * T / M),          // RMS
        }
    }
    const sp1 = speeds(gas1)
    const sp2 = speeds(gas2)

    // Graph
    const W = 380, H = 160, GP = { l: 40, r: 16, t: 12, b: 28 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const allDists = showGas2 ? [...dist1, ...dist2] : dist1
    const maxF = Math.max(...allDists.map(p => p.f), 0.001)
    const maxV = 1800
    const toX = v => GP.l + (v / maxV) * PW
    const toY = f => GP.t + PH - (f / maxF) * PH

    const makePath = (dist) =>
        dist.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.v).toFixed(1)},${toY(p.f).toFixed(1)}`).join(' ')

    const path1 = makePath(dist1)
    const path2 = showGas2 ? makePath(dist2) : ''

    // Speed markers for gas1
    const col1 = GASES[gas1].color
    const col2 = GASES[gas2].color

    // Graham's law
    const gRatio = Math.sqrt(GASES[gas2].M / GASES[gas1].M)

    return (
        <div>
            {/* Mode */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'distribution', l: 'Maxwell-Boltzmann distribution' }, { k: 'effusion', l: "Graham's law of effusion" }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Gas selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>GAS 1</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {Object.keys(GASES).map(g => (
                            <button key={g} onClick={() => setGas1(g)} style={{
                                padding: '3px 7px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: gas1 === g ? GASES[g].color : 'var(--bg3)',
                                color: gas1 === g ? '#000' : 'var(--text2)',
                                border: `1px solid ${gas1 === g ? GASES[g].color : 'var(--border)'}`,
                            }}>{g}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>
                        GAS 2 <button onClick={() => setShowGas2(p => !p)} style={{ fontSize: 9, padding: '1px 6px', borderRadius: 20, background: showGas2 ? 'rgba(29,158,117,0.15)' : 'var(--bg3)', color: showGas2 ? 'var(--teal)' : 'var(--text3)', border: '1px solid var(--border)', cursor: 'pointer', marginLeft: 4, fontFamily: 'var(--mono)' }}>{showGas2 ? 'hide' : 'show'}</button>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', opacity: showGas2 ? 1 : 0.3 }}>
                        {Object.keys(GASES).map(g => (
                            <button key={g} onClick={() => setGas2(g)} disabled={!showGas2} style={{
                                padding: '3px 7px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: gas2 === g ? GASES[g].color : 'var(--bg3)',
                                color: gas2 === g ? '#000' : 'var(--text2)',
                                border: `1px solid ${gas2 === g ? GASES[g].color : 'var(--border)'}`,
                            }}>{g}</button>
                        ))}
                    </div>
                </div>
            </div>

            <ChemSlider label="Temperature T" unit=" K" value={T} min={100} max={1000} step={10} onChange={setT} color="var(--coral)" />

            {mode === 'distribution' && (
                <div>
                    {/* Distribution graph */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                            ⚗ MAXWELL-BOLTZMANN SPEED DISTRIBUTION
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {/* Gas 2 first (behind) */}
                            {showGas2 && (
                                <>
                                    <path d={`${path2} L${toX(maxV)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                        fill={col2} opacity={0.06} />
                                    <path d={path2} fill="none" stroke={col2} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7} />
                                </>
                            )}
                            {/* Gas 1 */}
                            <path d={`${path1} L${toX(maxV)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                fill={col1} opacity={0.1} />
                            <path d={path1} fill="none" stroke={col1} strokeWidth={2.5} />

                            {/* Speed markers for gas 1 */}
                            {[
                                { v: sp1.ump, label: 'u_mp', col: `${col1}80` },
                                { v: sp1.uavg, label: 'ū', col: `${col1}A0` },
                                { v: sp1.urms, label: 'u_rms', col: col1 },
                            ].map((m, i) => (
                                m.v < maxV ? (
                                    <g key={i}>
                                        <line x1={toX(m.v)} y1={GP.t} x2={toX(m.v)} y2={GP.t + PH}
                                            stroke={m.col} strokeWidth={1} strokeDasharray="3 3" />
                                        <text x={toX(m.v)} y={GP.t + PH + 16} textAnchor="middle"
                                            style={{ fontSize: 8, fill: m.col, fontFamily: 'var(--mono)' }}>{m.label}</text>
                                    </g>
                                ) : null
                            ))}

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16}
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>v (m/s)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>f(v)</text>

                            {/* Legend */}
                            <line x1={W - 80} y1={H - 10} x2={W - 60} y2={H - 10} stroke={col1} strokeWidth={2} />
                            <text x={W - 56} y={H - 7} style={{ fontSize: 9, fill: col1, fontFamily: 'var(--mono)' }}>
                                {gas1} ({GASES[gas1].M}g/mol)
                            </text>
                            {showGas2 && (
                                <>
                                    <line x1={W - 80} y1={H - 22} x2={W - 60} y2={H - 22} stroke={col2} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.8} />
                                    <text x={W - 56} y={H - 19} style={{ fontSize: 9, fill: col2, fontFamily: 'var(--mono)' }}>
                                        {gas2} ({GASES[gas2].M}g/mol)
                                    </text>
                                </>
                            )}
                        </svg>
                    </div>

                    {/* Speed comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {[{ g: gas1, sp: sp1, col: col1 }, { g: gas2, sp: sp2, col: col2 }].filter((_, i) => i === 0 || showGas2).map(row => (
                            <div key={row.g} style={{ padding: '12px 14px', background: `${row.col}10`, border: `1px solid ${row.col}30`, borderRadius: 10 }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col, marginBottom: 8 }}>
                                    {row.g} at {T} K
                                </div>
                                {[
                                    { label: 'u_mp (most probable)', v: row.sp.ump },
                                    { label: 'ū (average)', v: row.sp.uavg },
                                    { label: 'u_rms (root mean sq)', v: row.sp.urms },
                                ].map(s => (
                                    <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 11, fontFamily: 'var(--mono)' }}>
                                        <span style={{ color: 'var(--text3)' }}>{s.label}</span>
                                        <span style={{ color: row.col, fontWeight: 700 }}>{s.v.toFixed(0)} m/s</span>
                                    </div>
                                ))}
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 6, lineHeight: 1.5 }}>
                                    u_mp : ū : u_rms = 1 : 1.128 : 1.225
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {mode === 'effusion' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--purple)' }}>Graham's law:</strong> Rate of effusion ∝ 1/√M. Lighter gases effuse faster. Does not depend on temperature — only molar mass matters.
                    </div>

                    {/* Effusion race */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, letterSpacing: 1 }}>
                            EFFUSION RACE — same time interval
                        </div>
                        {[{ g: gas1, col: col1 }, { g: gas2, col: col2 }].map(row => {
                            const M = GASES[row.g].M
                            const rateRel = 1 / Math.sqrt(M)
                            const maxRate = 1 / Math.sqrt(Math.min(GASES[gas1].M, GASES[gas2].M))
                            const barPct = (rateRel / maxRate) * 100
                            return (
                                <div key={row.g} style={{ marginBottom: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col }}>
                                            {row.g}  (M = {M} g/mol)
                                        </span>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: row.col }}>
                                            r ∝ {(1 / Math.sqrt(M)).toFixed(4)}
                                        </span>
                                    </div>
                                    <div style={{ height: 18, background: 'var(--bg3)', borderRadius: 9, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${barPct}%`, background: row.col, borderRadius: 9, transition: 'width 0.4s' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Ratio */}
                    <div style={{ padding: '14px 16px', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)', borderRadius: 10, fontFamily: 'var(--mono)', lineHeight: 1.8 }}>
                        <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                            r({gas1}) / r({gas2}) = √(M{gas2}/M{gas1}) = √({GASES[gas2].M}/{GASES[gas1].M}) = <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 15 }}>{gRatio.toFixed(4)}</span>
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {gas1} effuses {gRatio > 1 ? gRatio.toFixed(2) + '× faster' : (1 / gRatio).toFixed(2) + '× slower'} than {gas2}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label={`${gas1} u_rms`} value={`${sp1.urms.toFixed(0)} m/s`} color={col1} highlight />
                {showGas2 && <ValueCard label={`${gas2} u_rms`} value={`${sp2.urms.toFixed(0)} m/s`} color={col2} />}
                <ValueCard label="T" value={`${T} K`} color="var(--coral)" />
                <ValueCard label="Ratio u_mp:ū:u_rms" value="1 : 1.128 : 1.225" color="var(--text2)" />
            </div>
        </div>
    )
}