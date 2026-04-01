import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const GASES = {
    'SO₂': { k: 2.2, n: 1.3, color: '#FAC775', r: 7 },
    'NH₃': { k: 1.8, n: 1.5, color: '#7F77DD', r: 6 },
    'CO': { k: 1.2, n: 1.8, color: '#888780', r: 5 },
    'O₂': { k: 0.8, n: 2.0, color: '#D85A30', r: 5 },
}

// Deterministic positions for adsorption sites on charcoal surface
const SITES = Array.from({ length: 48 }, (_, i) => ({
    x: 28 + (i % 8) * 46,
    y: 28 + Math.floor(i / 8) * 32,
}))

export default function Adsorption() {
    const [tab, setTab] = useState('surface')  // surface | compare | types
    const [gas, setGas] = useState('NH₃')
    const [P, setP] = useState(3)
    const [T, setT] = useState(300)
    const [type, setType] = useState('physi')

    const g = GASES[gas]
    // Freundlich: x/m = k·P^(1/n), temp effect on k
    const kT = GASES[gas].k * Math.exp(-0.002 * (T - 300))
    const xm = Math.min(1, kT * Math.pow(P, 1 / GASES[gas].n) / 8)  // 0−1 coverage

    // How many sites are filled
    const nFilled = Math.round(xm * SITES.length)

    // Isotherm curve for graph
    const curve = useMemo(() => {
        return Array.from({ length: 80 }, (_, i) => {
            const p = 0.1 + i * 0.25
            const kt = GASES[gas].k * Math.exp(-0.002 * (T - 300))
            const coverage = Math.min(1, kt * Math.pow(p, 1 / GASES[gas].n) / 8)
            return { p, coverage }
        })
    }, [gas, T])

    // Graph geometry
    const GW = 320, GH = 110
    const GP = { l: 36, r: 12, t: 10, b: 24 }
    const PW = GW - GP.l - GP.r
    const PH = GH - GP.t - GP.b
    const toX = p => GP.l + ((p - 0.1) / 19.9) * PW
    const toY = c => GP.t + PH - c * PH
    const curvePath = curve.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.p).toFixed(1)},${toY(p.coverage).toFixed(1)}`
    ).join(' ')

    return (
        <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'surface', l: 'Live surface coverage' }, { k: 'compare', l: 'Gas comparison' }, { k: 'types', l: 'Physi vs Chemi' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: tab === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── LIVE SURFACE ── */}
            {tab === 'surface' && (
                <div>
                    {/* Gas selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                        {Object.entries(GASES).map(([k, v]) => (
                            <button key={k} onClick={() => setGas(k)} style={{
                                flex: 1, padding: '6px', borderRadius: 8, fontSize: 13,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: gas === k ? v.color : 'var(--bg3)',
                                color: gas === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${gas === k ? v.color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Two sliders side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                PRESSURE — {P.toFixed(1)} atm
                            </div>
                            <input type="range" min={0.1} max={20} step={0.1} value={P}
                                onChange={e => setP(Number(e.target.value))}
                                style={{ width: '100%', accentColor: g.color }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                <span>0.1</span><span>20 atm</span>
                            </div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                TEMPERATURE — {T} K
                            </div>
                            <input type="range" min={200} max={500} step={5} value={T}
                                onChange={e => setT(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--coral)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                <span>200K</span><span>500K</span>
                            </div>
                        </div>
                    </div>

                    {/* THE MAIN VISUAL — adsorbent surface with molecules populating */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: `2px solid ${g.color}40`, borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: g.color, letterSpacing: 2 }}>
                                CHARCOAL SURFACE
                            </span>
                            <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: g.color }}>
                                {nFilled}/{SITES.length} sites filled ({(xm * 100).toFixed(1)}%)
                            </span>
                        </div>

                        <svg viewBox="0 0 400 175" width="100%">
                            {/* Charcoal base */}
                            <rect x={8} y={140} width={384} height={28} rx={4}
                                fill="rgba(136,135,128,0.25)" stroke="rgba(136,135,128,0.4)" strokeWidth={1} />
                            {/* Surface texture */}
                            {Array.from({ length: 12 }, (_, i) => (
                                <rect key={i} x={12 + i * 32} y={134} width={28} height={8} rx={3}
                                    fill="rgba(136,135,128,0.2)" stroke="rgba(136,135,128,0.3)" strokeWidth={0.8} />
                            ))}

                            {/* Adsorption sites */}
                            {SITES.map((site, i) => {
                                const filled = i < nFilled
                                const opacity = filled ? 1 : 0.15
                                return (
                                    <g key={i}>
                                        {/* Site marker */}
                                        <circle cx={site.x} cy={site.y + 110}
                                            r={g.r + 3}
                                            fill={filled ? `${g.color}18` : 'rgba(255,255,255,0.03)'}
                                            stroke={filled ? g.color : 'rgba(255,255,255,0.08)'}
                                            strokeWidth={filled ? 1.5 : 0.5} />
                                        {/* Gas molecule */}
                                        {filled && (
                                            <circle cx={site.x} cy={site.y + 110}
                                                r={g.r}
                                                fill={g.color}
                                                opacity={0.85} />
                                        )}
                                    </g>
                                )
                            })}

                            {/* Coverage bar at bottom */}
                            <rect x={8} y={168} width={384} height={6} rx={3}
                                fill="rgba(0,0,0,0.3)" />
                            <rect x={8} y={168} width={384 * xm} height={6} rx={3}
                                fill={g.color} style={{ transition: 'width 0.2s' }} />
                        </svg>
                    </div>

                    {/* Isotherm graph — updates in real time */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            FREUNDLICH ISOTHERM — x/m = kP^(1/n)
                        </div>
                        <svg viewBox={`0 0 ${GW} ${GH}`} width="100%">
                            <path d={`${curvePath} L${toX(20)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                fill={g.color} opacity={0.08} />
                            <path d={curvePath} fill="none" stroke={g.color} strokeWidth={2} />
                            {/* Current state dot */}
                            <circle cx={toX(P)} cy={toY(xm)} r={6}
                                fill={g.color} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                            {/* Crosshairs */}
                            <line x1={toX(P)} y1={GP.t} x2={toX(P)} y2={GP.t + PH}
                                stroke={`${g.color}50`} strokeWidth={1} strokeDasharray="4 3" />
                            <line x1={GP.l} y1={toY(xm)} x2={GP.l + PW} y2={toY(xm)}
                                stroke={`${g.color}50`} strokeWidth={1} strokeDasharray="4 3" />
                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 14}
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>P (atm)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>x/m</text>
                        </svg>
                    </div>
                </div>
            )}

            {/* ── GAS COMPARISON ── */}
            {tab === 'compare' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        All gases at P = <strong style={{ color: 'var(--gold)' }}>{P.toFixed(1)} atm</strong>, T = <strong style={{ color: 'var(--coral)' }}>{T} K</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>PRESSURE — {P.toFixed(1)} atm</div>
                            <input type="range" min={0.1} max={20} step={0.1} value={P}
                                onChange={e => setP(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--gold)' }} />
                        </div>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>TEMPERATURE — {T} K</div>
                            <input type="range" min={200} max={500} step={5} value={T}
                                onChange={e => setT(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--coral)' }} />
                        </div>
                    </div>

                    {/* Side-by-side mini surfaces */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {Object.entries(GASES).map(([k, v]) => {
                            const kt = v.k * Math.exp(-0.002 * (T - 300))
                            const cov = Math.min(1, kt * Math.pow(P, 1 / v.n) / 8)
                            const nFill = Math.round(cov * 24)
                            return (
                                <div key={k} style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${v.color}30`, borderRadius: 10, padding: 10 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: v.color }}>{k}</span>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: v.color }}>{(cov * 100).toFixed(1)}%</span>
                                    </div>
                                    {/* Mini surface grid */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                                        {Array.from({ length: 24 }, (_, i) => (
                                            <div key={i} style={{
                                                width: 14, height: 14, borderRadius: '50%',
                                                background: i < nFill ? v.color : 'rgba(255,255,255,0.05)',
                                                border: `1px solid ${i < nFill ? v.color : 'rgba(255,255,255,0.1)'}`,
                                                transition: 'background 0.15s',
                                            }} />
                                        ))}
                                    </div>
                                    {/* Coverage bar */}
                                    <div style={{ height: 6, background: 'rgba(0,0,0,0.3)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${cov * 100}%`, background: v.color, borderRadius: 3, transition: 'width 0.2s' }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                        Easily liquefiable gases (high boiling point, high polarity) adsorb more strongly. SO₂ &gt; NH₃ &gt; CO &gt; O₂ for charcoal adsorption.
                    </div>
                </div>
            )}

            {/* ── TYPES ── */}
            {tab === 'types' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        {[{ k: 'physi', l: 'Physisorption', col: '#1D9E75' }, { k: 'chemi', l: 'Chemisorption', col: '#D85A30' }].map(opt => (
                            <button key={opt.k} onClick={() => setType(opt.k)} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 13,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: type === opt.k ? opt.col : 'var(--bg3)',
                                color: type === opt.k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${type === opt.k ? opt.col : 'var(--border)'}`,
                            }}>{opt.l}</button>
                        ))}
                    </div>

                    {/* Energy diagram — changes based on type */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, marginBottom: 14 }}>
                        <svg viewBox="0 0 380 140" width="100%">
                            {/* Reactant level */}
                            <line x1={20} y1={60} x2={90} y2={60} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                            <text x={55} y={54} textAnchor="middle" style={{ fontSize: 9, fill: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>gas + surface</text>

                            {type === 'physi' ? (
                                // No activation barrier — smooth curve down
                                <>
                                    <path d="M 90 60 C 130 62 180 68 230 95"
                                        fill="none" stroke="#1D9E75" strokeWidth={3} />
                                    <line x1={230} y1={95} x2={360} y2={95} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                                    <text x={295} y={110} textAnchor="middle" style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>physisorbed state</text>
                                    {/* ΔH arrow */}
                                    <line x1={340} y1={60} x2={340} y2={95} stroke="#1D9E75" strokeWidth={1} strokeDasharray="3 3" />
                                    <text x={356} y={80} textAnchor="middle" style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>~40</text>
                                    <text x={356} y={91} textAnchor="middle" style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>kJ/mol</text>
                                    <text x={200} y={30} textAnchor="middle" style={{ fontSize: 11, fill: '#1D9E75', fontFamily: 'var(--mono)', fontWeight: 700 }}>No Ea barrier — van der Waals forces</text>
                                </>
                            ) : (
                                // Activation barrier then deep well
                                <>
                                    <path d="M 90 60 C 110 60 130 20 160 20 C 190 20 200 60 230 90"
                                        fill="none" stroke="#D85A30" strokeWidth={3} />
                                    <line x1={230} y1={90} x2={360} y2={90} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                                    <text x={295} y={105} textAnchor="middle" style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>chemisorbed state</text>
                                    {/* Ea arrow */}
                                    <line x1={160} y1={60} x2={160} y2={20} stroke="#D85A30" strokeWidth={1} strokeDasharray="3 3" />
                                    <text x={173} y={43} style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>Ea</text>
                                    {/* ΔH arrow */}
                                    <line x1={340} y1={60} x2={340} y2={90} stroke="#D85A30" strokeWidth={1} strokeDasharray="3 3" />
                                    <text x={355} y={78} textAnchor="middle" style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>~300</text>
                                    <text x={355} y={89} textAnchor="middle" style={{ fontSize: 9, fill: '#D85A30', fontFamily: 'var(--mono)' }}>kJ/mol</text>
                                    <text x={200} y={134} textAnchor="middle" style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 700 }}>Covalent/ionic bond formed</text>
                                </>
                            )}

                            {/* E-axis */}
                            <line x1={16} y1={10} x2={16} y2={120} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <text x={12} y={14} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>E↑</text>
                        </svg>
                    </div>

                    {/* Comparison table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '1px', background: 'var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        {[['', 'Physisorption', 'Chemisorption'],
                        ['Force', 'van der Waals', 'Covalent/ionic'],
                        ['ΔH', '20−40 kJ/mol', '80−400 kJ/mol'],
                        ['Ea', 'None (spontaneous)', 'Required'],
                        ['Layers', 'Multilayer', 'Monolayer only'],
                        ['Reversible', '✓ Yes', '✗ No (usually)'],
                        ['Specific', 'Not specific', 'Highly specific'],
                        ['Temp effect', '↓ as T rises', '↑ then ↓'],
                        ].map((row, ri) => (
                            row.map((cell, ci) => (
                                <div key={`${ri}-${ci}`} style={{
                                    padding: '8px 12px',
                                    background: ri === 0 ? 'rgba(0,0,0,0.3)' : ci === 0 ? 'var(--bg3)' : ci === 1 ? 'rgba(29,158,117,0.06)' : 'rgba(216,90,48,0.06)',
                                    fontSize: ri === 0 ? 11 : 12,
                                    fontFamily: 'var(--mono)',
                                    fontWeight: ri === 0 || ci === 0 ? 700 : 400,
                                    color: ri === 0 ? (ci === 1 ? '#1D9E75' : ci === 2 ? '#D85A30' : 'var(--text3)') : ci === 0 ? 'var(--text3)' : 'var(--text2)',
                                }}>
                                    {cell}
                                </div>
                            ))
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Coverage" value={`${(xm * 100).toFixed(1)}%`} color={g.color} highlight />
                <ValueCard label="Sites filled" value={`${nFilled} / ${SITES.length}`} color={g.color} />
                <ValueCard label="P" value={`${P.toFixed(1)} atm`} color="var(--gold)" />
                <ValueCard label="T effect" value={T > 350 ? 'Coverage ↓ (high T)' : 'Coverage ↑'} color="var(--coral)" />
            </div>
        </div>
    )
}