import { useState, useEffect, useRef } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const IONS = [
    { ion: 'Na⁺', charge: 1, color: '#EF9F27', electrolyte: 'NaCl', concNeeded: 'High (~50mM)' },
    { ion: 'Ca²⁺', charge: 2, color: '#1D9E75', electrolyte: 'CaCl₂', concNeeded: 'Medium (~0.65mM)' },
    { ion: 'Al³⁺', charge: 3, color: '#7F77DD', electrolyte: 'AlCl₃', concNeeded: 'Very low (~0.09mM)' },
]

export default function Coagulation() {
    const [mode, setMode] = useState('hardyschulze')
    const [selIon, setSelIon] = useState(2)      // 0=Na, 1=Ca, 2=Al
    const [conc, setConc] = useState(0)       // 0 to 1 (normalised)
    const [micStep, setMicStep] = useState(0)

    // Particle system for coagulation demo
    const particlesRef = useRef(
        Array.from({ length: 20 }, (_, i) => ({
            x: 30 + (i % 5) * 74,
            y: 40 + Math.floor(i / 5) * 50,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            cluster: -1,
        }))
    )
    const [pSnap, setPSnap] = useState(particlesRef.current)

    const ion = IONS[selIon]
    // Coagulating power ∝ z^6
    const power = ion.charge ** 6
    const maxPower = 3 ** 6  // 729
    const floccThresh = 0.25 + (1 - power / maxPower) * 0.65  // lower thresh for higher charge
    const flocculated = conc > floccThresh

    // Reset particles when ion changes
    useEffect(() => {
        particlesRef.current = Array.from({ length: 20 }, (_, i) => ({
            x: 30 + (i % 5) * 74,
            y: 40 + Math.floor(i / 5) * 50,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2,
            cluster: -1,
        }))
        setConc(0)
    }, [selIon])

    useEffect(() => {
        const iv = setInterval(() => {
            particlesRef.current = particlesRef.current.map((p, i) => {
                if (flocculated) {
                    // Drift toward clusters of 4 fixed points
                    const clusterCentres = [{ x: 100, y: 110 }, { x: 220, y: 110 }, { x: 310, y: 110 }, { x: 165, y: 170 }]
                    const ci = i % clusterCentres.length
                    const cx = clusterCentres[ci].x, cy = clusterCentres[ci].y
                    const dx = cx - p.x, dy = cy - p.y
                    const dist = Math.sqrt(dx * dx + dy * dy)
                    if (dist < 14) return { ...p, vx: 0, vy: 0 }
                    return { ...p, x: p.x + dx * 0.04, y: p.y + dy * 0.04, vx: 0, vy: 0 }
                }
                // Normal Brownian
                const kx = (Math.random() - 0.5) * 2.5, ky = (Math.random() - 0.5) * 2.5
                let vx = p.vx * 0.9 + kx, vy = p.vy * 0.9 + ky
                const sp = Math.sqrt(vx * vx + vy * vy)
                if (sp > 2.5) { vx = vx / sp * 2.5; vy = vy / sp * 2.5 }
                let x = p.x + vx, y = p.y + vy
                if (x < 15 || x > 385) { vx *= -1; x = Math.max(15, Math.min(385, x)) }
                if (y < 15 || y > 225) { vy *= -1; y = Math.max(15, Math.min(225, y)) }
                return { ...p, x, y, vx, vy }
            })
            setPSnap([...particlesRef.current])
        }, 40)
        return () => clearInterval(iv)
    }, [flocculated])

    const MICELLE_STEPS = [
        { title: 'Individual soap molecules in water', desc: 'RCOO⁻Na⁺ dissolved — polar heads hydrated, tails avoid water' },
        { title: 'Approaching critical micelle concentration (CMC)', desc: 'Molecules start clustering at air-water interface — tails out' },
        { title: 'Micelle nucleation', desc: 'Above CMC, molecules rapidly self-assemble into spherical micelle' },
        { title: 'Mature micelle — grease trapped', desc: '50−100 molecules: tails inward (non-polar core), heads outward (ionic)' },
        { title: 'Cleansing action', desc: 'Grease dissolves in core → entire micelle washed away with water' },
    ]

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'hardyschulze', l: 'Hardy-Schulze' }, { k: 'demo', l: 'Coagulation demo' }, { k: 'micelle', l: 'Micelle formation' }].map(t => (
                    <button key={t.k} onClick={() => setMode(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === t.k ? 'var(--coral)' : 'var(--bg3)',
                        color: mode === t.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === t.k ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── HARDY-SCHULZE ── */}
            {mode === 'hardyschulze' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.07)', border: '1px solid rgba(216,90,48,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--coral)' }}>Hardy-Schulze rule:</strong> Coagulating power of an ion ∝ z⁶ (its charge). Click each ion — watch the power bar explode.
                    </div>

                    {/* Ion buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                        {IONS.map((ion, i) => (
                            <button key={ion.ion} onClick={() => setSelIon(i)} style={{
                                padding: '14px 10px', borderRadius: 12, cursor: 'pointer', textAlign: 'center',
                                background: selIon === i ? `${ion.color}25` : 'var(--bg3)',
                                border: `2px solid ${selIon === i ? ion.color : 'var(--border)'}`,
                                transition: 'all 0.15s',
                            }}>
                                <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: ion.color }}>{ion.ion}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>charge = +{ion.charge}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: ion.color, marginTop: 4 }}>
                                    z⁶ = {ion.charge ** 6}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Power comparison — DRAMATIC bars */}
                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, letterSpacing: 1 }}>
                            RELATIVE COAGULATING POWER
                        </div>
                        {IONS.map((ion, i) => {
                            const pct = (ion.charge ** 6 / 729) * 100
                            return (
                                <div key={ion.ion} style={{ marginBottom: 12, cursor: 'pointer' }}
                                    onClick={() => setSelIon(i)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: selIon === i ? ion.color : 'var(--text2)' }}>
                                            {ion.ion}  ({ion.electrolyte})
                                        </span>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: ion.color }}>
                                            {ion.charge}⁶ = {ion.charge ** 6} units
                                        </span>
                                    </div>
                                    <div style={{ height: 22, background: 'var(--bg3)', borderRadius: 11, overflow: 'hidden', border: `1px solid ${selIon === i ? ion.color : 'var(--border)'}` }}>
                                        <div style={{
                                            height: '100%', width: `${pct}%`,
                                            background: `linear-gradient(90deg, ${ion.color}80, ${ion.color})`,
                                            borderRadius: 11, transition: 'width 0.4s',
                                            display: 'flex', alignItems: 'center', paddingLeft: 10,
                                        }}>
                                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.8)', fontWeight: 700 }}>
                                                {ion.concNeeded}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Key insight */}
                    <div style={{ padding: '12px 16px', background: 'rgba(212,160,23,0.1)', border: '2px solid rgba(212,160,23,0.3)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
                        Al³⁺ vs Na⁺ — coagulating power ratio: 3⁶/1⁶ = <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 16 }}>729:1</span>
                        <br />That is why AlCl₃ is used at trace concentrations to purify water, while NaCl requires high concentrations.
                    </div>
                </div>
            )}

            {/* ── DEMO ── */}
            {mode === 'demo' && (
                <div>
                    {/* Ion selector */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                        {IONS.map((ion, i) => (
                            <button key={ion.ion} onClick={() => setSelIon(i)} style={{
                                flex: 1, padding: '8px', borderRadius: 8, fontSize: 13,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selIon === i ? ion.color : 'var(--bg3)',
                                color: selIon === i ? '#000' : 'var(--text2)',
                                border: `1px solid ${selIon === i ? ion.color : 'var(--border)'}`,
                            }}>{ion.ion}</button>
                        ))}
                    </div>

                    {/* Concentration slider */}
                    <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                Add {ion.electrolyte}
                            </span>
                            <span style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: flocculated ? 'var(--coral)' : 'var(--teal)' }}>
                                {flocculated ? '⚡ COAGULATING' : '✓ Stable sol'}
                            </span>
                        </div>
                        <input type="range" min={0} max={1} step={0.01} value={conc}
                            onChange={e => setConc(Number(e.target.value))}
                            style={{ width: '100%', accentColor: ion.color }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                            <span>no electrolyte</span>
                            <span>high concentration</span>
                        </div>
                    </div>

                    {/* Threshold indicator */}
                    <div style={{ position: 'relative', height: 12, background: 'var(--bg3)', borderRadius: 6, border: '1px solid var(--border)', marginBottom: 14, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${conc * 100}%`, background: `linear-gradient(90deg,var(--teal),${ion.color})`, borderRadius: 6, transition: 'width 0.1s' }} />
                        <div style={{ position: 'absolute', top: 0, left: `${floccThresh * 100}%`, height: '100%', width: 2, background: 'var(--coral)' }} />
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 14, textAlign: 'center' }}>
                        coagulation threshold for {ion.ion} at {(floccThresh * 100).toFixed(0)}% — drag slider past the red line
                    </div>

                    {/* Live particle animation */}
                    <div style={{ background: 'rgba(0,0,0,0.28)', border: `2px solid ${flocculated ? 'rgba(216,90,48,0.4)' : 'rgba(29,158,117,0.2)'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14, transition: 'border-color 0.3s' }}>
                        <div style={{ padding: '5px 12px', background: flocculated ? 'rgba(216,90,48,0.12)' : 'rgba(29,158,117,0.06)', fontSize: 10, fontFamily: 'var(--mono)', color: flocculated ? 'var(--coral)' : 'var(--teal)', letterSpacing: 1.5, transition: 'all 0.3s' }}>
                            {flocculated ? `⚡ As₂S₃ SOL — COAGULATING — ${ion.ion} neutralising −ve charge` : '✓ As₂S₃ SOL — STABLE (particles repel each other)'}
                        </div>
                        <svg viewBox="0 0 400 240" width="100%" style={{ display: 'block' }}>
                            {pSnap.map((p, i) => {
                                const r = flocculated ? 10 : 8
                                return (
                                    <g key={i}>
                                        <circle cx={p.x} cy={p.y} r={r}
                                            fill={`${ion.color}30`}
                                            stroke={ion.color}
                                            strokeWidth={flocculated ? 2 : 1.5}
                                            opacity={0.9} />
                                        {!flocculated && (
                                            <text x={p.x} y={p.y + 3.5} textAnchor="middle"
                                                style={{ fontSize: 8, fill: ion.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>−</text>
                                        )}
                                    </g>
                                )
                            })}
                            {flocculated && (
                                <text x={200} y={225} textAnchor="middle"
                                    style={{ fontSize: 11, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                    ↓ Aggregates settling out
                                </text>
                            )}
                        </svg>
                    </div>
                </div>
            )}

            {/* ── MICELLE ── */}
            {mode === 'micelle' && (
                <div>
                    {/* Step navigator */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {MICELLE_STEPS.map((_, i) => (
                            <button key={i} onClick={() => setMicStep(i)} style={{
                                flex: 1, padding: '8px 4px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: micStep === i ? 'var(--teal)' : micStep > i ? 'rgba(29,158,117,0.15)' : 'var(--bg3)',
                                color: micStep === i ? '#fff' : micStep > i ? 'var(--teal)' : 'var(--text3)',
                                border: `1px solid ${micStep >= i ? 'rgba(29,158,117,0.4)' : 'var(--border)'}`,
                            }}>{i + 1}</button>
                        ))}
                    </div>

                    {/* Step title */}
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.1)', border: '1px solid rgba(29,158,117,0.3)', borderRadius: 8, marginBottom: 14 }}>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', marginBottom: 4 }}>
                            Step {micStep + 1}: {MICELLE_STEPS[micStep].title}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                            {MICELLE_STEPS[micStep].desc}
                        </div>
                    </div>

                    {/* Micelle diagram — changes by step */}
                    <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
                        <svg viewBox="0 0 420 220" width="100%" style={{ display: 'block' }}>
                            {/* Water background */}
                            <rect x={0} y={0} width={420} height={220}
                                fill="rgba(55,138,221,0.04)" />

                            {/* STEP 0 — scattered molecules */}
                            {micStep === 0 && Array.from({ length: 12 }, (_, i) => {
                                const x = 40 + (i % 4) * 92, y = 50 + Math.floor(i / 4) * 60
                                const ang = (i * 47) * Math.PI / 180
                                return (
                                    <g key={i}>
                                        <line x1={x} y1={y} x2={x + Math.cos(ang) * 28} y2={y + Math.sin(ang) * 28}
                                            stroke="rgba(239,159,39,0.5)" strokeWidth={2.5} strokeLinecap="round" />
                                        <circle cx={x + Math.cos(ang) * 28} cy={y + Math.sin(ang) * 28} r={6}
                                            fill="rgba(29,158,117,0.6)" stroke="#1D9E75" strokeWidth={1.5} />
                                    </g>
                                )
                            })}

                            {/* STEP 1 — surface film */}
                            {micStep === 1 && Array.from({ length: 14 }, (_, i) => {
                                const x = 30 + i * 26
                                return (
                                    <g key={i}>
                                        <line x1={x} y1={60} x2={x} y2={90}
                                            stroke="rgba(239,159,39,0.6)" strokeWidth={2.5} strokeLinecap="round" />
                                        <circle cx={x} cy={56} r={6}
                                            fill="rgba(29,158,117,0.7)" stroke="#1D9E75" strokeWidth={1.5} />
                                    </g>
                                )
                            })}

                            {/* STEP 2 — nucleation (partial ring) */}
                            {micStep === 2 && Array.from({ length: 12 }, (_, i) => {
                                const ang = (i / 12) * 2 * Math.PI
                                const cx = 210, cy = 110, R = 55
                                const hx = cx + Math.cos(ang) * R, hy = cy + Math.sin(ang) * R
                                const tx = cx + Math.cos(ang) * (R - 30), ty = cy + Math.sin(ang) * (R - 30)
                                return (
                                    <g key={i}>
                                        <line x1={hx} y1={hy} x2={tx} y2={ty}
                                            stroke="rgba(239,159,39,0.5)" strokeWidth={2} strokeLinecap="round" />
                                        <circle cx={hx} cy={hy} r={6}
                                            fill="rgba(29,158,117,0.6)" stroke="#1D9E75" strokeWidth={1.5} />
                                    </g>
                                )
                            })}

                            {/* STEP 3 — full micelle */}
                            {(micStep === 3 || micStep === 4) && (
                                <>
                                    {/* Core */}
                                    <circle cx={210} cy={110} r={46}
                                        fill={micStep === 4 ? "rgba(239,159,39,0.2)" : "rgba(239,159,39,0.1)"}
                                        stroke="rgba(239,159,39,0.3)" strokeWidth={1} strokeDasharray="3 3" />
                                    {micStep === 4 && (
                                        <text x={210} y={114} textAnchor="middle"
                                            style={{ fontSize: 11, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                            GREASE
                                        </text>
                                    )}

                                    {/* Soap molecules */}
                                    {Array.from({ length: 18 }, (_, i) => {
                                        const ang = (i / 18) * 2 * Math.PI
                                        const hx = 210 + Math.cos(ang) * 76, hy = 110 + Math.sin(ang) * 76
                                        const tx = 210 + Math.cos(ang) * 50, ty = 110 + Math.sin(ang) * 50
                                        return (
                                            <g key={i}>
                                                <line x1={hx} y1={hy} x2={tx} y2={ty}
                                                    stroke="rgba(239,159,39,0.55)" strokeWidth={2.5} strokeLinecap="round" />
                                                <circle cx={hx} cy={hy} r={7}
                                                    fill="rgba(29,158,117,0.65)" stroke="#1D9E75" strokeWidth={1.5} />
                                            </g>
                                        )
                                    })}
                                </>
                            )}

                            {/* Legend */}
                            <line x1={20} y1={205} x2={38} y2={205} stroke="rgba(239,159,39,0.6)" strokeWidth={2.5} strokeLinecap="round" />
                            <text x={44} y={209} style={{ fontSize: 9, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>hydrocarbon tail (non-polar)</text>
                            <circle cx={220} cy={205} r={6} fill="rgba(29,158,117,0.65)" stroke="#1D9E75" strokeWidth={1.5} />
                            <text x={230} y={209} style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>polar head (COO⁻)</text>
                        </svg>
                    </div>

                    {/* Prev/Next */}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setMicStep(p => Math.max(0, p - 1))} disabled={micStep === 0} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
                            opacity: micStep === 0 ? 0.4 : 1,
                        }}>← Back</button>
                        <button onClick={() => setMicStep(p => Math.min(MICELLE_STEPS.length - 1, p + 1))} disabled={micStep === MICELLE_STEPS.length - 1} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
                            background: 'rgba(29,158,117,0.12)', color: 'var(--teal)', border: '1px solid rgba(29,158,117,0.3)',
                            opacity: micStep === MICELLE_STEPS.length - 1 ? 0.4 : 1,
                        }}>Next →</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Hardy-Schulze" value={`z⁶ rule — ${ion.ion}: ${ion.charge ** 6} units`} color={ion.color} highlight />
                <ValueCard label="Coagulation" value={flocculated ? 'Occurring' : 'Stable sol'} color={flocculated ? 'var(--coral)' : 'var(--teal)'} />
                <ValueCard label="CMC" value="Critical micelle conc." color="var(--teal)" />
            </div>
        </div>
    )
}