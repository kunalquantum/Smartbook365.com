import { useState, useMemo } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const ln2 = Math.LN2
const C14_HALF_LIFE = 5730   // years
const C14_LAMBDA = ln2 / C14_HALF_LIFE

const MEDICAL_ISOTOPES = {
    'Tc-99m (imaging)': { t_half: 6.01, unit: 'hr', decay: 'γ', use: 'SPECT scans — thyroid, bone, brain', color: '#888780', why: 'Short t½ — low dose; γ rays detectable outside body' },
    'I-131 (therapy)': { t_half: 8.025, unit: 'days', decay: 'β', use: 'Thyroid cancer treatment', color: '#7F77DD', why: 'Concentrates in thyroid; β rays kill cancer cells locally' },
    'F-18 (PET)': { t_half: 109.8, unit: 'min', decay: 'β+', use: 'PET scan — cancer, brain activity', color: '#1D9E75', why: 'β⁺ emits positrons → annihilation → 2 γ at 180° — precise imaging' },
    'Co-60 (radiation)': { t_half: 5.27, unit: 'yr', decay: 'γ', use: 'Radiation therapy, food irradiation', color: '#378ADD', why: 'High energy γ rays kill rapidly dividing cancer cells' },
    'Ra-226 (historic)': { t_half: 1600, unit: 'yr', decay: 'α', use: 'Historical cancer treatment (now obsolete)', color: '#D85A30', why: 'Now replaced by safer isotopes — α too damaging internally' },
}

const RADIATION_USES = [
    { use: 'Carbon dating', desc: '¹⁴C/¹²C ratio measures age of organic material (up to ~50,000 years)', color: '#1D9E75' },
    { use: 'Food irradiation', desc: 'γ rays kill bacteria and pests in food — extends shelf life', color: '#EF9F27' },
    { use: 'Smoke detectors', desc: 'Am-241 α source ionises air; smoke absorbs ions → alarm triggers', color: '#888780' },
    { use: 'Sterilisation', desc: 'Medical equipment sterilised with γ rays — no heat needed', color: '#378ADD' },
    { use: 'Power generation', desc: 'Nuclear fission → heat → turbines → electricity (low CO₂)', color: '#D85A30' },
    { use: 'Industrial gauging', desc: 'β/γ through materials measures thickness of metal sheets, paper', color: '#7F77DD' },
]

export default function Applications() {
    const [tab, setTab] = useState('dating')   // dating | medical | uses
    const [age, setAge] = useState(5730)       // years
    const [selIso, setSelIso] = useState('Tc-99m (imaging)')

    const iso = MEDICAL_ISOTOPES[selIso]

    // C-14 dating
    const N_over_N0 = Math.exp(-C14_LAMBDA * age)     // current / original
    const actRatio = N_over_N0                        // activity ratio = N ratio
    const pct_remain = N_over_N0 * 100

    // Age from activity ratio (inverse)
    const [actInput, setActInput] = useState(50)       // % of original
    const computed_age = -Math.log(actInput / 100) / C14_LAMBDA

    // Decay curve for C-14
    const W = 360, H = 130, GP = { l: 44, r: 12, t: 12, b: 24 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const tMax = 50000
    const toX = t => GP.l + (t / tMax) * PW
    const toY = f => GP.t + PH - f * PH
    const c14Path = Array.from({ length: 80 }, (_, i) => {
        const t = (i / 79) * tMax
        return `${i === 0 ? 'M' : 'L'}${toX(t).toFixed(1)},${toY(Math.exp(-C14_LAMBDA * t)).toFixed(1)}`
    }).join(' ')

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'dating', l: 'Carbon dating' }, { k: 'medical', l: 'Nuclear medicine' }, { k: 'uses', l: 'Other applications' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? 'var(--teal)' : 'var(--bg3)',
                        color: tab === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── CARBON DATING ── */}
            {tab === 'dating' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--teal)' }}>Radiocarbon dating:</strong> Living organisms maintain ¹⁴C/¹²C ratio = atmospheric ratio. After death, ¹⁴C decays (t½=5730 yr) while ¹²C stays constant. Measuring the remaining ¹⁴C gives the age.
                    </div>

                    {/* Mode 1: Given age → find % remaining */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 10 }}>
                            MODE 1: GIVEN AGE → FIND ¹⁴C REMAINING
                        </div>

                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Age of sample</span>
                                <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)' }}>{age.toLocaleString()} years</span>
                            </div>
                            <input type="range" min={0} max={50000} step={100}
                                value={age} onChange={e => setAge(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--teal)' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                <span>0 yr</span><span>50,000 yr</span>
                            </div>
                        </div>

                        {/* Decay graph with current point */}
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            <path d={`${c14Path} L${toX(tMax)},${GP.t + PH} L${GP.l},${GP.t + PH} Z`}
                                fill="var(--teal)" opacity={0.07} />
                            <path d={c14Path} fill="none" stroke="var(--teal)" strokeWidth={2.5} />

                            {/* Half-life markers */}
                            {[1, 2, 3, 4, 5].map(n => {
                                const t = n * 5730, f = Math.exp(-C14_LAMBDA * t)
                                if (t > tMax) return null
                                return (
                                    <g key={n}>
                                        <line x1={toX(t)} y1={GP.t} x2={toX(t)} y2={GP.t + PH}
                                            stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />
                                        <text x={toX(t)} y={GP.t + PH + 14} textAnchor="middle"
                                            style={{ fontSize: 7, fill: 'rgba(160,176,200,0.25)', fontFamily: 'var(--mono)' }}>t½×{n}</text>
                                    </g>
                                )
                            })}

                            {/* Current point */}
                            <circle cx={toX(age)} cy={toY(N_over_N0)} r={6}
                                fill="var(--teal)" stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
                            <line x1={toX(age)} y1={GP.t} x2={toX(age)} y2={GP.t + PH}
                                stroke="rgba(29,158,117,0.5)" strokeWidth={1} strokeDasharray="3 3" />
                            <line x1={GP.l} y1={toY(N_over_N0)} x2={GP.l + PW} y2={toY(N_over_N0)}
                                stroke="rgba(29,158,117,0.5)" strokeWidth={1} strokeDasharray="3 3" />

                            {/* Value annotation */}
                            <text x={toX(age) + 8} y={toY(N_over_N0) - 6}
                                style={{ fontSize: 10, fill: 'var(--teal)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                {pct_remain.toFixed(2)}%
                            </text>

                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 14} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Age (years)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>¹⁴C/¹⁴C₀</text>
                        </svg>

                        <div style={{ padding: '8px 12px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8, marginTop: 8, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7 }}>
                            N/N₀ = e^(−λt) = e^(−{C14_LAMBDA.toExponential(4)}×{age.toLocaleString()}) = <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{pct_remain.toFixed(3)}%</span> remaining
                        </div>
                    </div>

                    {/* Mode 2: Given % → find age */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 10 }}>
                            MODE 2: GIVEN ¹⁴C REMAINING → FIND AGE
                        </div>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Activity remaining</span>
                                <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>{actInput.toFixed(1)}% of original</span>
                            </div>
                            <input type="range" min={1} max={100} step={0.5}
                                value={actInput} onChange={e => setActInput(Number(e.target.value))}
                                style={{ width: '100%', accentColor: 'var(--gold)' }} />
                        </div>
                        <div style={{ padding: '8px 12px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.7 }}>
                            t = −ln(A/A₀)/λ = −ln({(actInput / 100).toFixed(4)}) / {C14_LAMBDA.toExponential(4)} = <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{computed_age.toFixed(0).toLocaleString()} years</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── NUCLEAR MEDICINE ── */}
            {tab === 'medical' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(MEDICAL_ISOTOPES).map(k => (
                            <button key={k} onClick={() => setSelIso(k)} style={{
                                padding: '4px 9px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selIso === k ? MEDICAL_ISOTOPES[k].color : 'var(--bg3)',
                                color: selIso === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${selIso === k ? MEDICAL_ISOTOPES[k].color : 'var(--border)'}`,
                            }}>{k.split(' ')[0]}</button>
                        ))}
                    </div>

                    {/* Main info card */}
                    <div style={{ padding: '14px 16px', background: `${iso.color}12`, border: `2px solid ${iso.color}35`, borderRadius: 12, marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: iso.color }}>{selIso.split(' ')[0]}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                    t½ = {iso.t_half} {iso.unit}  ·  decay: {iso.decay}
                                </div>
                            </div>
                            <div style={{
                                marginLeft: 'auto', padding: '4px 12px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', background: `${iso.color}20`, color: iso.color,
                                border: `1px solid ${iso.color}40`, fontWeight: 700,
                            }}>{iso.decay} emitter</div>
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', fontWeight: 600, marginBottom: 6 }}>{iso.use}</div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{iso.why}</div>
                    </div>

                    {/* Half-life comparison — why each is chosen */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            HALF-LIFE COMPARISON — shorter t½ = less patient dose but less time to use
                        </div>
                        {Object.entries(MEDICAL_ISOTOPES).map(([k, v]) => {
                            // Normalise to log scale for display
                            const t_hours = v.unit === 'hr' ? v.t_half : v.unit === 'min' ? v.t_half / 60 : v.unit === 'days' ? v.t_half * 24 : v.t_half * 8760
                            const logT = Math.log10(Math.max(0.1, t_hours))
                            const logMin = Math.log10(0.1), logMax = Math.log10(50000 * 8760)
                            const pct = ((logT - logMin) / (logMax - logMin)) * 100
                            return (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}
                                    onClick={() => setSelIso(k)}>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 55 }}>{k.split(' ')[0]}</span>
                                    <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: k === selIso ? v.color : `${v.color}60`, borderRadius: 7, transition: 'width 0.3s' }} />
                                    </div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 70 }}>
                                        {v.t_half} {v.unit}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Why short half-life is preferred in medicine */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>Short t½ (imaging)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>Low patient dose · decays quickly after scan · can be given repeatedly</div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', marginBottom: 4 }}>Longer t½ (therapy)</div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>Needs to deliver dose over days · must stay in tissue long enough to work</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── OTHER USES ── */}
            {tab === 'uses' && (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {RADIATION_USES.map((u, i) => (
                            <div key={u.use} style={{ padding: '12px 16px', background: `${u.color}10`, border: `1px solid ${u.color}30`, borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${u.color}25`, border: `1.5px solid ${u.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: u.color, flexShrink: 0 }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: u.color, marginBottom: 4 }}>{u.use}</div>
                                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>{u.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Radiation dose perspective */}
                    <div style={{ marginTop: 14, padding: '12px 16px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: '#378ADD', marginBottom: 8 }}>
                            RADIATION DOSE PERSPECTIVE (mSv)
                        </div>
                        {[
                            { label: 'Chest X-ray', dose: 0.1, col: 'var(--teal)' },
                            { label: 'Background/year', dose: 2.4, col: '#A8D8B9' },
                            { label: 'CT scan', dose: 10, col: 'var(--gold)' },
                            { label: 'Medical limit/year', dose: 50, col: '#EF9F27' },
                            { label: 'Acute radiation syndrome', dose: 1000, col: 'var(--coral)' },
                        ].map(row => (
                            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: row.col, minWidth: 140 }}>{row.label}</span>
                                <div style={{ flex: 1, height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(Math.log10(row.dose + 0.1) / Math.log10(1001)) * 100}%`, background: row.col, borderRadius: 5 }} />
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: row.col, minWidth: 50 }}>{row.dose} mSv</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {tab === 'dating' && (
                    <>
                        <ValueCard label="Sample age" value={`${age.toLocaleString()} yr`} color="var(--teal)" highlight />
                        <ValueCard label="¹⁴C remaining" value={`${pct_remain.toFixed(2)}%`} color="var(--teal)" />
                        <ValueCard label="t½ (C-14)" value="5730 years" color="var(--gold)" />
                    </>
                )}
                {tab === 'medical' && (
                    <>
                        <ValueCard label="Isotope" value={selIso.split(' ')[0]} color={iso.color} highlight />
                        <ValueCard label="t½" value={`${iso.t_half} ${iso.unit}`} color={iso.color} />
                        <ValueCard label="Decay" value={iso.decay} color="var(--gold)" />
                    </>
                )}
                {tab === 'uses' && (
                    <ValueCard label="Applications" value={`${RADIATION_USES.length} key uses`} color="var(--teal)" highlight />
                )}
            </div>
        </div>
    )
}