import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const R = 8.314

const CATALYSTS = {
    'Fe — Haber': { Ea: 92, Eau: 230, color: '#D85A30', reaction: 'N₂ + 3H₂ → 2NH₃', type: 'heterogeneous' },
    'Pt — Ostwald': { Ea: 65, Eau: 180, color: '#888780', reaction: '4NH₃ + 5O₂ → 4NO + 6H₂O', type: 'heterogeneous' },
    'MnO₂ — H₂O₂': { Ea: 58, Eau: 200, color: '#7F77DD', reaction: '2H₂O₂ → 2H₂O + O₂', type: 'heterogeneous' },
    'Enzyme — amylase': { Ea: 30, Eau: 180, color: '#1D9E75', reaction: 'Starch → maltose', type: 'enzyme' },
}

// Maxwell-Boltzmann fraction with enough energy ≥ Ea
// f = exp(-Ea/RT) — relative
const rateAt = (Ea, TK) => Math.exp(-Ea * 1000 / (R * TK))

export default function Catalysis() {
    const [cat, setCat] = useState('Fe — Haber')
    const [T, setT] = useState(450)
    const [mode, setMode] = useState('barrier')  // barrier | distribution | enzyme

    const c = CATALYSTS[cat]
    const TK = T + 273
    const rCat = rateAt(c.Ea, TK)
    const rUncat = rateAt(c.Eau, TK)
    const speedup = rCat / Math.max(rUncat, 1e-300)

    // Maxwell-Boltzmann speed distribution
    const dist = useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => {
            const E = i * 12   // kJ/mol — energy axis
            const f = E * Math.exp(-E * 1000 / (R * TK))
            return { E, f }
        })
    }, [T])
    const maxF = Math.max(...dist.map(d => d.f))

    // Graph geometry
    const GW = 380, GH = 150, GP = { l: 36, r: 12, t: 12, b: 28 }
    const PW = GW - GP.l - GP.r, PH = GH - GP.t - GP.b
    const toX = E => GP.l + (E / 1200) * PW
    const toY = f => GP.t + PH - (f / maxF) * PH
    const distPath = dist.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.E).toFixed(1)},${toY(p.f).toFixed(1)}`).join(' ')

    // Fraction of molecules with E ≥ Ea and E ≥ Eau
    const fracCat = dist.filter(d => d.E >= c.Ea).reduce((s, d) => s + d.f, 0)
    const fracUncat = dist.filter(d => d.E >= c.Eau).reduce((s, d) => s + d.f, 0)
    const totalArea = dist.reduce((s, d) => s + d.f, 0)

    return (
        <div>
            {/* Catalyst selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(CATALYSTS).map(k => (
                    <button key={k} onClick={() => setCat(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: cat === k ? CATALYSTS[k].color : 'var(--bg3)',
                        color: cat === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${cat === k ? CATALYSTS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'barrier', l: 'Energy barrier' }, { k: 'distribution', l: 'M-B distribution' }, { k: 'enzyme', l: 'Enzyme model' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? c.color : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? c.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* Temperature slider — always visible */}
            <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Temperature</span>
                    <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)' }}>{T}°C ({TK} K)</span>
                </div>
                <input type="range" min={100} max={800} step={10} value={T}
                    onChange={e => setT(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--coral)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                    <span>100°C</span><span>800°C</span>
                </div>
            </div>

            {/* ── ENERGY BARRIER ── */}
            {mode === 'barrier' && (
                <div>
                    {/* The energy diagram — barrier HEIGHT changes with catalyst selection */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: `1px solid ${c.color}30`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: c.color, letterSpacing: 2, marginBottom: 8 }}>
                            ⚗ ENERGY PROFILE — drag catalyst to compare
                        </div>
                        <svg viewBox="0 0 400 160" width="100%">
                            {/* Reactant platform */}
                            <line x1={20} y1={90} x2={90} y2={90} stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} />
                            <text x={55} y={84} textAnchor="middle" style={{ fontSize: 9, fill: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>reactants</text>

                            {/* Product platform (lower — exothermic) */}
                            <line x1={280} y1={120} x2={390} y2={120} stroke="rgba(255,255,255,0.35)" strokeWidth={2.5} />
                            <text x={335} y={114} textAnchor="middle" style={{ fontSize: 9, fill: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>products</text>

                            {/* Uncatalysed path (dashed, tall barrier) */}
                            {(() => {
                                const peakY = 90 - c.Eau * 0.45
                                return (
                                    <path d={`M 90 90 Q 185 ${peakY} 280 120`}
                                        fill="none" stroke="rgba(160,176,200,0.3)"
                                        strokeWidth={1.5} strokeDasharray="6 3" />
                                )
                            })()}

                            {/* Catalysed path (solid, lower barrier — changes with cat selection!) */}
                            {(() => {
                                const peakY = 90 - c.Ea * 0.45
                                return (
                                    <path d={`M 90 90 Q 185 ${peakY} 280 120`}
                                        fill="none" stroke={c.color}
                                        strokeWidth={3} />
                                )
                            })()}

                            {/* Ea marker — catalysed */}
                            {(() => {
                                const peakY = 90 - c.Ea * 0.45
                                return (
                                    <>
                                        <line x1={220} y1={90} x2={220} y2={peakY}
                                            stroke={c.color} strokeWidth={1} strokeDasharray="3 3" />
                                        <text x={238} y={90 - c.Ea * 0.2}
                                            style={{ fontSize: 11, fill: c.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                            Ea={c.Ea} kJ
                                        </text>
                                    </>
                                )
                            })()}

                            {/* Ea marker — uncatalysed */}
                            {(() => {
                                const peakY = 90 - c.Eau * 0.45
                                return (
                                    <>
                                        <line x1={155} y1={90} x2={155} y2={peakY}
                                            stroke="rgba(160,176,200,0.4)" strokeWidth={1} strokeDasharray="3 3" />
                                        <text x={100} y={90 - c.Eau * 0.2}
                                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                            Ea={c.Eau} kJ (uncat)
                                        </text>
                                    </>
                                )
                            })()}

                            {/* Legend */}
                            <line x1={20} y1={148} x2={40} y2={148} stroke="rgba(160,176,200,0.3)" strokeWidth={1.5} strokeDasharray="5 3" />
                            <text x={46} y={152} style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>without catalyst</text>
                            <line x1={150} y1={148} x2={170} y2={148} stroke={c.color} strokeWidth={2} />
                            <text x={176} y={152} style={{ fontSize: 8, fill: c.color, fontFamily: 'var(--mono)' }}>with {cat.split(' ')[0]}</text>
                        </svg>
                    </div>

                    {/* Live rate meter */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {[
                            { label: 'Uncatalysed rate', r: rUncat, col: 'rgba(160,176,200,0.5)', Ea: c.Eau },
                            { label: 'Catalysed rate', r: rCat, col: c.color, Ea: c.Ea },
                        ].map(row => {
                            const pct = Math.min(100, (row.r / Math.max(rCat, rUncat)) * 100)
                            return (
                                <div key={row.label} style={{ padding: '12px 14px', background: 'var(--bg3)', border: `1px solid ${row.col}40`, borderRadius: 10 }}>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: row.col, marginBottom: 6 }}>{row.label}</div>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8 }}>Ea = {row.Ea} kJ/mol</div>
                                    {/* Rate bar */}
                                    <div style={{ height: 16, background: 'rgba(0,0,0,0.3)', borderRadius: 8, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: row.col, borderRadius: 8, transition: 'width 0.2s' }} />
                                    </div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.col, marginTop: 6, fontWeight: 700 }}>
                                        k ∝ {row.r.toExponential(2)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Speed-up factor */}
                    <div style={{ padding: '12px 16px', background: `${c.color}12`, border: `2px solid ${c.color}40`, borderRadius: 10, textAlign: 'center' }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>
                            Rate enhancement at {T}°C
                        </div>
                        <div style={{ fontSize: 24, fontFamily: 'var(--mono)', fontWeight: 700, color: c.color }}>
                            {speedup > 1e12 ? '>10¹²×' : speedup > 1e9 ? `${(speedup / 1e9).toFixed(1)} × 10⁹×` : speedup > 1e6 ? `${(speedup / 1e6).toFixed(1)} × 10⁶×` : speedup > 1000 ? `${speedup.toFixed(0)}×` : `${speedup.toFixed(1)}×`}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                            faster with catalyst
                        </div>
                    </div>
                </div>
            )}

            {/* ── MAXWELL-BOLTZMANN ── */}
            {mode === 'distribution' && (
                <div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            MOLECULES WITH ENOUGH ENERGY TO REACT
                        </div>
                        <svg viewBox={`0 0 ${GW} ${GH}`} width="100%">
                            {/* Shaded area ≥ Ea (catalysed) */}
                            {(() => {
                                const pts = dist.filter(d => d.E >= c.Ea)
                                if (pts.length < 2) return null
                                const areaPath = pts.map((p, i) =>
                                    `${i === 0 ? 'M' : 'L'}${toX(p.E).toFixed(1)},${toY(p.f).toFixed(1)}`
                                ).join(' ')
                                return (
                                    <path d={`${areaPath} L${toX(pts[pts.length - 1].E)},${GP.t + PH} L${toX(pts[0].E)},${GP.t + PH} Z`}
                                        fill={c.color} opacity={0.25} />
                                )
                            })()}

                            {/* Shaded area ≥ Eau (uncatalysed — tiny!) */}
                            {(() => {
                                const pts = dist.filter(d => d.E >= c.Eau)
                                if (pts.length < 2) return null
                                const areaPath = pts.map((p, i) =>
                                    `${i === 0 ? 'M' : 'L'}${toX(p.E).toFixed(1)},${toY(p.f).toFixed(1)}`
                                ).join(' ')
                                return (
                                    <path d={`${areaPath} L${toX(pts[pts.length - 1].E)},${GP.t + PH} L${toX(pts[0].E)},${GP.t + PH} Z`}
                                        fill="rgba(160,176,200,0.15)" />
                                )
                            })()}

                            {/* Distribution curve */}
                            <path d={distPath} fill="none" stroke="rgba(160,176,200,0.6)" strokeWidth={2} />

                            {/* Ea vertical lines */}
                            <line x1={toX(c.Ea)} y1={GP.t} x2={toX(c.Ea)} y2={GP.t + PH}
                                stroke={c.color} strokeWidth={2} />
                            <text x={toX(c.Ea) + 3} y={GP.t + 12}
                                style={{ fontSize: 9, fill: c.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>Ea={c.Ea}</text>

                            <line x1={toX(c.Eau)} y1={GP.t} x2={toX(c.Eau)} y2={GP.t + PH}
                                stroke="rgba(160,176,200,0.4)" strokeWidth={1.5} strokeDasharray="5 3" />
                            <text x={toX(c.Eau) + 3} y={GP.t + 24}
                                style={{ fontSize: 8, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>Ea={c.Eau} uncat</text>

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>E (kJ/mol)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>f(E)</text>
                        </svg>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ padding: '10px 14px', background: `${c.color}10`, border: `1px solid ${c.color}30`, borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: c.color, marginBottom: 4 }}>
                                Fraction with E ≥ {c.Ea} kJ (catalysed)
                            </div>
                            <div style={{ height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 5, overflow: 'hidden', marginBottom: 6 }}>
                                <div style={{ height: '100%', width: `${Math.min(100, (fracCat / totalArea) * 400)}%`, background: c.color, borderRadius: 5, transition: 'width 0.2s' }} />
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: c.color }}>
                                {((fracCat / totalArea) * 100).toFixed(3)}%
                            </div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(160,176,200,0.06)', border: '1px solid rgba(160,176,200,0.15)', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(160,176,200,0.6)', marginBottom: 4 }}>
                                Fraction with E ≥ {c.Eau} kJ (uncatalysed)
                            </div>
                            <div style={{ height: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 5, overflow: 'hidden', marginBottom: 6 }}>
                                <div style={{ height: '100%', width: `${Math.min(100, (fracUncat / totalArea) * 400)}%`, background: 'rgba(160,176,200,0.4)', borderRadius: 5, transition: 'width 0.2s' }} />
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'rgba(160,176,200,0.6)' }}>
                                {((fracUncat / totalArea) * 100).toFixed(4)}%
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 10, padding: '8px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        The coloured area (E ≥ Ea) represents molecules that can react. As T increases, this area grows. The catalyst shifts Ea left — dramatically expanding the reactive fraction.
                    </div>
                </div>
            )}

            {/* ── ENZYME ── */}
            {mode === 'enzyme' && (
                <div>
                    {/* Michaelis-Menten style: rate vs substrate concentration */}
                    {(() => {
                        const Vmax = 100, Km = 5
                        const pts = Array.from({ length: 60 }, (_, i) => ({
                            S: i * 0.5,
                            v: Vmax * (i * 0.5) / (Km + i * 0.5),
                        }))
                        const GW2 = 380, GH2 = 130, GP2 = { l: 40, r: 12, t: 10, b: 24 }
                        const PW2 = GW2 - GP2.l - GP2.r, PH2 = GH2 - GP2.t - GP2.b
                        const toX2 = S => GP2.l + (S / 30) * PW2
                        const toY2 = v => GP2.t + PH2 - (v / Vmax) * PH2
                        const mmPath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX2(p.S).toFixed(1)},${toY2(p.v).toFixed(1)}`).join(' ')
                        const Km_x = toX2(Km), halfVmax_y = toY2(Vmax / 2)
                        return (
                            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 8 }}>
                                    MICHAELIS-MENTEN CURVE — v vs [S]
                                </div>
                                <svg viewBox={`0 0 ${GW2} ${GH2}`} width="100%">
                                    {/* Vmax line */}
                                    <line x1={GP2.l} y1={toY2(Vmax)} x2={GP2.l + PW2} y2={toY2(Vmax)}
                                        stroke="rgba(29,158,117,0.3)" strokeWidth={1} strokeDasharray="5 4" />
                                    <text x={GP2.l + PW2 - 2} y={toY2(Vmax) - 3} textAnchor="end"
                                        style={{ fontSize: 8, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>Vmax</text>

                                    {/* Km lines */}
                                    <line x1={Km_x} y1={GP2.t} x2={Km_x} y2={halfVmax_y}
                                        stroke="rgba(212,160,23,0.4)" strokeWidth={1} strokeDasharray="3 3" />
                                    <line x1={GP2.l} y1={halfVmax_y} x2={Km_x} y2={halfVmax_y}
                                        stroke="rgba(212,160,23,0.4)" strokeWidth={1} strokeDasharray="3 3" />
                                    <text x={Km_x} y={GP2.t + PH2 + 14} textAnchor="middle"
                                        style={{ fontSize: 8, fill: 'rgba(212,160,23,0.6)', fontFamily: 'var(--mono)' }}>Km</text>
                                    <text x={GP2.l - 4} y={halfVmax_y + 3} textAnchor="end"
                                        style={{ fontSize: 8, fill: 'rgba(212,160,23,0.6)', fontFamily: 'var(--mono)' }}>Vmax/2</text>

                                    {/* Curve */}
                                    <path d={mmPath} fill="none" stroke="var(--teal)" strokeWidth={2.5} />

                                    {/* Axes */}
                                    <line x1={GP2.l} y1={GP2.t} x2={GP2.l} y2={GP2.t + PH2} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                                    <line x1={GP2.l} y1={GP2.t + PH2} x2={GP2.l + PW2} y2={GP2.t + PH2} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                                    <text x={GP2.l + PW2} y={GP2.t + PH2 + 14} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                        [S] — substrate conc.
                                    </text>
                                    <text x={GP2.l - 4} y={GP2.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>v</text>
                                </svg>
                            </div>
                        )
                    })()}

                    {/* Lock-and-key steps */}
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '4px 0', marginBottom: 14 }}>
                        {[
                            { label: 'Free enzyme', bg: 'rgba(29,158,117,0.12)', border: '#1D9E75', content: 'E', note: 'Active site empty' },
                            { label: '+ Substrate', bg: 'rgba(239,159,39,0.12)', border: 'var(--gold)', content: 'E+S', note: 'Substrate approaches' },
                            { label: 'ES complex', bg: 'rgba(127,119,221,0.12)', border: 'var(--purple)', content: 'ES', note: 'Ea lowered' },
                            { label: 'Products', bg: 'rgba(29,158,117,0.12)', border: '#1D9E75', content: 'P', note: 'Enzyme recycled' },
                        ].map((step, i) => (
                            <div key={i} style={{ flex: '0 0 80px', padding: '10px 8px', background: step.bg, border: `1.5px solid ${step.border}`, borderRadius: 10, textAlign: 'center' }}>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: step.border, marginBottom: 4 }}>
                                    {step.content}
                                </div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', lineHeight: 1.4 }}>{step.note}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: step.border, marginTop: 4 }}>{step.label}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        {[
                            { label: 'Ea with enzyme', val: `${CATALYSTS['Enzyme — amylase'].Ea} kJ/mol`, col: 'var(--teal)' },
                            { label: 'Ea without enzyme', val: `${CATALYSTS['Enzyme — amylase'].Eau} kJ/mol`, col: 'var(--coral)' },
                            { label: 'Specificity', val: 'One enzyme → one substrate', col: 'var(--gold)' },
                            { label: 'Optimum conditions', val: '37°C, pH 7.4', col: 'var(--purple)' },
                        ].map(p => (
                            <div key={p.label} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.label}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: p.col }}>{p.val}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Catalyst" value={cat.split(' ')[0]} color={c.color} highlight />
                <ValueCard label="Ea (cat)" value={`${c.Ea} kJ/mol`} color={c.color} />
                <ValueCard label="Ea (uncat)" value={`${c.Eau} kJ/mol`} color="var(--coral)" />
                <ValueCard label={`Rate ×`} value={speedup > 1e9 ? '>10⁹×' : speedup > 1000 ? `${speedup.toFixed(0)}×` : `${speedup.toFixed(1)}×`} color="var(--gold)" />
            </div>
        </div>
    )
}