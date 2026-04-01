import { useState, useMemo } from 'react'
import { SPARINGLY_SOLUBLE } from './helpers/equilData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

export default function Ksp() {
    const [salt, setSalt] = useState('AgCl')
    const [mode, setMode] = useState('solubility')   // solubility | precipitation | common_ion
    const [catAdd, setCatAdd] = useState(0)    // extra cation added (M)
    const [anAdd, setAnAdd] = useState(0)    // extra anion (common ion)
    const [vol, setVol] = useState(100)  // volume for mixing

    const sp = SPARINGLY_SOLUBLE[salt]
    const Ksp_val = sp.Ksp
    const p = sp.catN, q = sp.anN

    // Solubility s from Ksp = (ps)^p * (qs)^q = p^p * q^q * s^(p+q)
    const s = Math.pow(Ksp_val / (Math.pow(p, p) * Math.pow(q, q)), 1 / (p + q))

    // Ion concentrations at equilibrium (no common ion)
    const catConc = p * s
    const anConc = q * s

    // Ion product Q_sp with added ions
    const Q_sp = Math.pow(catConc + catAdd, p) * Math.pow(anConc + anAdd, q)
    const precipitates = Q_sp > Ksp_val

    // Common ion effect on solubility
    const s_common = useMemo(() => {
        if (anAdd === 0 && catAdd === 0) return s
        // With extra anion [An] = q*s + anAdd → solve numerically
        if (anAdd > 0) {
            let s2 = s
            for (let i = 0; i < 100; i++) {
                const catTerm = Math.pow(p * s2 + catAdd, p)
                const anTerm = Math.pow(q * s2 + anAdd, q)
                const diff = catTerm * anTerm - Ksp_val
                const deriv = p * catTerm / s2 + q * anTerm / s2  // simplified
                s2 = Math.max(1e-15, s2 - diff / (deriv * 10))
            }
            return s2
        }
        return s
    }, [salt, anAdd, catAdd, s, Ksp_val, p, q])

    // Precipitation from mixing two solutions
    const [concA, setConcA] = useState(1e-4)  // e.g. [Ag⁺]
    const [concB, setConcB] = useState(1e-4)  // e.g. [Cl⁻]
    const Qmix = Math.pow(concA, p) * Math.pow(concB, q)

    return (
        <div className="simulator-container">
            {/* Salt selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(SPARINGLY_SOLUBLE).map(k => (
                    <button key={k} onClick={() => setSalt(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: salt === k ? SPARINGLY_SOLUBLE[k].color : 'var(--bg3)',
                        color: salt === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${salt === k ? SPARINGLY_SOLUBLE[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'solubility', l: 'Solubility' }, { k: 'precipitation', l: 'Precipitation' }, { k: 'common_ion', l: 'Common ion effect' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? sp.color : 'var(--bg3)',
                        color: mode === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? sp.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* Ksp formula */}
            <div style={{ padding: '8px 14px', background: `${sp.color}10`, border: `1px solid ${sp.color}30`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12 }}>
                <span style={{ color: sp.color, fontWeight: 700 }}>{salt}</span>
                <span style={{ color: 'var(--text3)', marginLeft: 12 }}>{sp.s_formula}</span>
                <span style={{ color: sp.color, marginLeft: 12, fontWeight: 700 }}>Ksp = {Ksp_val.toExponential(2)}</span>
            </div>

            {/* ── SOLUBILITY ── */}
            {mode === 'solubility' && (
                <div>
                    {/* Ksp comparison bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                            Ksp COMPARISON — MORE SOLUBLE → HIGHER Ksp
                        </div>
                        {Object.entries(SPARINGLY_SOLUBLE).map(([k, v]) => {
                            const logK = Math.log10(v.Ksp)
                            const logMin = -13, logMax = -4
                            const pct = ((logK - logMin) / (logMax - logMin)) * 100
                            return (
                                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, cursor: 'pointer' }}
                                    onClick={() => setSalt(k)}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: v.color, minWidth: 60 }}>{k}</span>
                                    <div style={{ flex: 1, height: 14, background: 'var(--bg3)', borderRadius: 7, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${pct}%`, background: k === salt ? v.color : `${v.color}60`, borderRadius: 7, transition: 'width 0.3s' }} />
                                    </div>
                                    <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: v.color, minWidth: 70 }}>
                                        {v.Ksp.toExponential(2)}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Dissolution calculation */}
                    <div style={{ padding: '12px 16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, lineHeight: 1.9 }}>
                        <div style={{ fontWeight: 700, color: sp.color, marginBottom: 4 }}>
                            Dissolution: {salt} → {sp.catN > 1 ? sp.catN : ''}{sp.cat} + {sp.anN > 1 ? sp.anN : ''}{sp.an}
                        </div>
                        Ksp = [{sp.cat}]^{p} [{sp.an}]^{q} = ({p}s)^{p} × ({q}s)^{q} = {Math.pow(p, p) * Math.pow(q, q)} × s^{p + q}
                        <br />s = ⁿ√(Ksp/{Math.pow(p, p) * Math.pow(q, q)}) = <span style={{ color: sp.color, fontWeight: 700, fontSize: 14 }}>{s.toExponential(4)} mol/L</span>
                        <br />[{sp.cat}] = {catConc.toExponential(4)} M  ·  [{sp.an}] = {anConc.toExponential(4)} M
                    </div>

                    {/* g/L solubility */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div style={{ padding: '12px 14px', background: `${sp.color}10`, border: `1px solid ${sp.color}30`, borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>Molar solubility</div>
                            <div style={{ fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700, color: sp.color }}>{s.toExponential(4)}</div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>mol/L</div>
                        </div>
                        <div style={{ padding: '12px 14px', background: `${sp.color}10`, border: `1px solid ${sp.color}30`, borderRadius: 10, textAlign: 'center' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 4 }}>Ion product verified</div>
                            <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)' }}>
                                Ksp = {(Math.pow(catConc, p) * Math.pow(anConc, q)).toExponential(2)}
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)' }}>= {Ksp_val.toExponential(2)} ✓</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRECIPITATION ── */}
            {mode === 'precipitation' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Precipitation rule:</strong> Mix two solutions. If the ion product Q exceeds Ksp, precipitation occurs. Drag sliders to explore.
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                [{sp.cat}] = {concA.toExponential(2)} M
                            </div>
                            <input type="range" min={-8} max={-2} step={0.1}
                                value={Math.log10(concA)}
                                onChange={e => setConcA(Math.pow(10, Number(e.target.value)))}
                                style={{ width: '100%', accentColor: sp.color }} />
                        </div>
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                                [{sp.an}] = {concB.toExponential(2)} M
                            </div>
                            <input type="range" min={-8} max={-2} step={0.1}
                                value={Math.log10(concB)}
                                onChange={e => setConcB(Math.pow(10, Number(e.target.value)))}
                                style={{ width: '100%', accentColor: 'var(--teal)' }} />
                        </div>
                    </div>

                    {/* Q vs Ksp visual */}
                    {(() => {
                        const logQ = Math.log10(Qmix)
                        const logK = Math.log10(Ksp_val)
                        const logMin = logK - 4, logMax = logK + 4
                        const QpctX = Math.max(2, Math.min(98, ((logQ - logMin) / (logMax - logMin)) * 100))
                        const KpctX = ((logK - logMin) / (logMax - logMin)) * 100
                        const ppts = Qmix > Ksp_val
                        return (
                            <div style={{ marginBottom: 14 }}>
                                <div style={{ position: 'relative', height: 40 }}>
                                    <div style={{ position: 'absolute', top: 18, left: 0, right: 0, height: 4, background: 'var(--bg3)', borderRadius: 2 }} />
                                    <div style={{ position: 'absolute', top: 16, left: 0, width: `${KpctX}%`, height: 8, background: 'rgba(29,158,117,0.2)', borderRadius: 2 }} />
                                    <div style={{ position: 'absolute', top: 16, left: `${KpctX}%`, right: 0, height: 8, background: 'rgba(216,90,48,0.2)', borderRadius: 2 }} />
                                    <div style={{ position: 'absolute', left: `${KpctX}%`, top: 10, width: 3, height: 20, background: sp.color, transform: 'translateX(-50%)' }} />
                                    <div style={{ position: 'absolute', left: `${KpctX}%`, top: 2, transform: 'translateX(-50%)', fontSize: 9, fontFamily: 'var(--mono)', color: sp.color, fontWeight: 700, whiteSpace: 'nowrap' }}>Ksp={Ksp_val.toExponential(1)}</div>
                                    <div style={{
                                        position: 'absolute', left: `${QpctX}%`, top: 8,
                                        width: 24, height: 24, borderRadius: '50%',
                                        background: ppts ? 'var(--coral)' : 'var(--teal)',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        transform: 'translateX(-50%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700, color: '#fff',
                                        transition: 'left 0.2s',
                                    }}>Q</div>
                                </div>
                                <div style={{
                                    padding: '12px 16px', borderRadius: 10, marginTop: 8,
                                    background: ppts ? 'rgba(216,90,48,0.12)' : 'rgba(29,158,117,0.08)',
                                    border: `2px solid ${ppts ? 'rgba(216,90,48,0.4)' : 'rgba(29,158,117,0.3)'}`,
                                    fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700,
                                    color: ppts ? 'var(--coral)' : 'var(--teal)',
                                }}>
                                    Q = [{sp.cat}]^{p}[{sp.an}]^{q} = {Qmix.toExponential(3)}
                                    <br />Ksp = {Ksp_val.toExponential(2)}
                                    <br />{ppts ? `Q > Ksp → ↓ ${salt} PRECIPITATES` : `Q < Ksp → Solution is unsaturated — no precipitation`}
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            {/* ── COMMON ION ── */}
            {mode === 'common_ion' && (
                <div>
                    <div style={{ padding: '10px 14px', background: `${sp.color}10`, border: `1px solid ${sp.color}25`, borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: sp.color }}>Common ion effect:</strong> Adding an ion that is already present in the dissolution equilibrium decreases solubility (Le Chatelier — shifts reverse).
                    </div>

                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>
                            Added [{sp.an}] (common ion) = {anAdd.toExponential(2)} M
                        </div>
                        <input type="range" min={0} max={-2} step={0.05}
                            value={anAdd === 0 ? -10 : Math.log10(anAdd)}
                            onChange={e => {
                                const v = Number(e.target.value)
                                setAnAdd(v <= -9 ? 0 : Math.pow(10, v))
                            }}
                            style={{ width: '100%', accentColor: sp.color }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                            <span>no addition</span><span>0.01 M</span>
                        </div>
                    </div>

                    {/* Solubility comparison bars */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 10 }}>
                            SOLUBILITY WITH vs WITHOUT COMMON ION
                        </div>
                        {[
                            { label: 'Without common ion', val: s, col: sp.color },
                            { label: `With ${anAdd.toExponential(2)} M ${sp.an}`, val: s_common, col: 'rgba(216,90,48,0.8)' },
                        ].map(row => (
                            <div key={row.label} style={{ marginBottom: 10 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.col }}>{row.label}</span>
                                    <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col }}>{row.val.toExponential(4)} M</span>
                                </div>
                                <div style={{ height: 16, background: 'rgba(0,0,0,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(row.val / s) * 100}%`, background: row.col, borderRadius: 8, transition: 'width 0.3s', maxWidth: '100%' }} />
                                </div>
                            </div>
                        ))}
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--coral)', marginTop: 6, fontWeight: 700 }}>
                            Solubility reduced by {s_common < s ? `${((1 - s_common / s) * 100).toFixed(1)}%` : '0%'}
                        </div>
                    </div>

                    <div style={{ padding: '8px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        <strong style={{ color: 'var(--gold)' }}>Application:</strong> Common ion effect used in gravimetric analysis — adding excess precipitating agent drives dissolution to near-zero, ensuring complete precipitation.
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Salt" value={salt} color={sp.color} highlight />
                <ValueCard label="Ksp" value={Ksp_val.toExponential(2)} color={sp.color} />
                <ValueCard label="Solubility" value={`${s.toExponential(3)} M`} color="var(--teal)" />
                <ValueCard label="Common ion ↓" value={s_common < s ? `${((1 - s_common / s) * 100).toFixed(1)}% less` : '—'} color="var(--coral)" />
            </div>
        </div>
    )
}
