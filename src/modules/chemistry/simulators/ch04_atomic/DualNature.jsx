import { useState, useMemo } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const h = 6.626e-34   // J·s
const hev = 4.136e-15   // eV·s
const c = 3e8         // m/s
const me = 9.109e-31   // kg
const e = 1.602e-19   // C
const hbar = h / (2 * Math.PI)

const PARTICLES = {
    'Electron': { mass: me, color: '#378ADD', unit: 'm_e' },
    'Proton': { mass: 1.673e-27, color: '#D85A30', unit: 'm_p' },
    'Neutron': { mass: 1.675e-27, color: '#888780', unit: 'm_n' },
    'α-particle': { mass: 6.644e-27, color: '#EF9F27', unit: 'm_α' },
    'Baseball': { mass: 0.145, color: '#1D9E75', unit: 'kg' },
}

export default function DualNature() {
    const [tab, setTab] = useState('debroglie')  // debroglie | uncertainty | photoelectric
    const [particle, setParticle] = useState('Electron')
    const [velocity, setVelocity] = useState(1e6)          // m/s
    const [deltax, setDeltax] = useState(1e-10)        // m  (Δx)
    const [freq, setFreq] = useState(800)           // THz
    const [metal, setMetal] = useState('Caesium')

    const METALS = {
        'Caesium': { phi: 2.0, color: '#EF9F27' },
        'Potassium': { phi: 2.3, color: '#1D9E75' },
        'Sodium': { phi: 2.75, color: '#7F77DD' },
        'Zinc': { phi: 4.3, color: '#378ADD' },
        'Copper': { phi: 4.7, color: '#D85A30' },
    }

    const ptcl = PARTICLES[particle]
    const m = ptcl.mass

    // de Broglie
    const p = m * velocity
    const lambda = h / p            // m
    const lambdaNm = lambda * 1e9   // nm
    const lambdaPm = lambda * 1e12  // pm

    // Uncertainty: Δp ≥ ħ/2Δx
    const deltap = hbar / (2 * deltax)      // kg·m/s
    const deltav = deltap / m               // m/s
    const deltaE = deltap * deltap / (2 * m)  // J
    const deltaEeV = deltaE / e               // eV

    // Photoelectric
    const met = METALS[metal]
    const phi = met.phi          // eV
    const fHz = freq * 1e12      // Hz
    const Ephoton = hev * freq * 1e12  // eV
    const ejects = Ephoton > phi
    const KEmax = Math.max(0, Ephoton - phi)
    const Vstop = KEmax           // V
    const f0 = phi / hev / 1e12 // THz threshold

    // de Broglie wavelength curve vs velocity
    const velPts = useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => {
            const v = 1e4 * Math.pow(10, (i / 59) * 6)  // 1e4 to 1e10 m/s
            if (v >= c) return null
            const lam = (h / (m * v)) * 1e12  // pm
            return { v, lam: Math.max(0.001, Math.min(1e6, lam)) }
        }).filter(Boolean)
    }, [m])

    const logVmin = 4, logVmax = 10
    const logLmin = Math.log10(Math.max(0.001, Math.min(...velPts.map(p => p.lam))))
    const logLmax = Math.log10(Math.max(...velPts.map(p => p.lam)))

    const GW = 340, GH = 130
    const GP = { l: 50, r: 16, t: 14, b: 30 }
    const PW = GW - GP.l - GP.r, PH = GH - GP.t - GP.b

    const toX = v => GP.l + ((Math.log10(v) - logVmin) / (logVmax - logVmin)) * PW
    const toY = lam => GP.t + PH - ((Math.log10(Math.max(0.001, lam)) - logLmin) / (logLmax - logLmin + 0.1)) * PH

    const curvePath = velPts.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toX(p.v).toFixed(1)},${toY(p.lam).toFixed(1)}`
    ).join(' ')

    return (
        <div>
            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'debroglie', l: 'de Broglie λ' },
                    { k: 'uncertainty', l: 'Heisenberg ΔxΔp' },
                    { k: 'photoelectric', l: 'Photoelectric effect' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setTab(opt.k)} style={{
                        flex: 1, padding: '5px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === opt.k ? 'var(--purple)' : 'var(--bg3)',
                        color: tab === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${tab === opt.k ? 'var(--purple)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── DE BROGLIE ── */}
            {tab === 'debroglie' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>de Broglie:</span> Every moving particle has an associated wavelength λ = h/mv. The lighter and faster the particle, the shorter the wavelength. Electrons show diffraction because their wavelength is comparable to atomic spacings (~100 pm).
                    </div>

                    {/* Particle selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(PARTICLES).map(k => (
                            <button key={k} onClick={() => setParticle(k)} style={{
                                padding: '3px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: particle === k ? PARTICLES[k].color : 'var(--bg3)',
                                color: particle === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${particle === k ? PARTICLES[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    <ChemSlider
                        label="Velocity" unit=" m/s"
                        value={velocity} min={1e4} max={2e8} step={1e5}
                        onChange={setVelocity} color={ptcl.color} />

                    {/* λ vs v graph */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 2, marginBottom: 8 }}>
                            λ (pm) vs VELOCITY (log scale)
                        </div>
                        <svg viewBox={`0 0 ${GW} ${GH}`} width="100%">
                            {/* Area */}
                            <path d={`${curvePath} L${toX(velPts[velPts.length - 1].v)},${GP.t + PH} L${toX(velPts[0].v)},${GP.t + PH} Z`}
                                fill={ptcl.color} opacity={0.07} />
                            {/* Curve */}
                            <path d={curvePath} fill="none" stroke={ptcl.color} strokeWidth={2} />

                            {/* Current point */}
                            {velocity >= velPts[0].v && velocity <= velPts[velPts.length - 1].v && (
                                <circle cx={toX(velocity)} cy={toY(lambdaPm)} r={6}
                                    fill={ptcl.color} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                            )}

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH}
                                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />

                            {/* Axis labels */}
                            <text x={GP.l + PW} y={GP.t + PH + 16}
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>v (m/s, log)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end"
                                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>λ (pm)</text>

                            {/* Reference line: atomic spacing ~100pm */}
                            {logLmin < 2 && logLmax > 2 && (
                                <g>
                                    <line x1={GP.l} y1={toY(100)} x2={GP.l + PW} y2={toY(100)}
                                        stroke="rgba(29,158,117,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                                    <text x={GP.l + PW - 2} y={toY(100) - 3} textAnchor="end"
                                        style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                                        100 pm (atomic scale)
                                    </text>
                                </g>
                            )}
                        </svg>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="λ = h/mv" value={lambdaPm > 1 ? `${lambdaPm.toFixed(2)} pm` : `${lambdaNm.toFixed(4)} nm`} color={ptcl.color} highlight />
                        <ValueCard label="Momentum p" value={p.toExponential(3)} unit=" kg·m/s" color="var(--gold)" />
                        <ValueCard label="Mass" value={m.toExponential(3)} unit=" kg" color="var(--text2)" />
                        <ValueCard label="Shows diffraction?" value={lambdaPm > 10 && particle !== 'Baseball' ? '✓ Yes (quantum scale)' : '✗ No (too small λ)'} color={lambdaPm > 10 ? 'var(--teal)' : 'var(--coral)'} />
                    </div>
                </div>
            )}

            {/* ── UNCERTAINTY ── */}
            {tab === 'uncertainty' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Heisenberg Uncertainty:</span> ΔxΔp ≥ ħ/2. This is not a measurement limitation — it is a fundamental property of quantum particles. The more precisely you know position, the less precisely you can know momentum, and vice versa.
                    </div>

                    {/* Particle */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(PARTICLES).map(k => (
                            <button key={k} onClick={() => setParticle(k)} style={{
                                padding: '3px 10px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: particle === k ? PARTICLES[k].color : 'var(--bg3)',
                                color: particle === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${particle === k ? PARTICLES[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    <ChemSlider label="Δx (position uncertainty)" unit=" m" value={deltax}
                        min={1e-15} max={1e-8} step={1e-12}
                        onChange={setDeltax} color={ptcl.color} precision={14} />

                    {/* Uncertainty trade-off visual */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        <div style={{ padding: '14px', background: `${ptcl.color}10`, border: `1px solid ${ptcl.color}30`, borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: ptcl.color, letterSpacing: 1.5, marginBottom: 8 }}>
                                POSITION Δx
                            </div>
                            <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: ptcl.color, marginBottom: 4 }}>
                                {deltax < 1e-12 ? `${(deltax * 1e15).toFixed(2)} fm`
                                    : deltax < 1e-9 ? `${(deltax * 1e12).toFixed(2)} pm`
                                        : deltax < 1e-6 ? `${(deltax * 1e9).toFixed(2)} nm`
                                            : `${deltax.toExponential(2)} m`}
                            </div>
                            {/* Bar: small Δx = tight constraint = bad momentum */}
                            <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, Math.max(2, (Math.log10(deltax) + 15) / (8) * 100))}%`,
                                    background: ptcl.color, borderRadius: 5,
                                }} />
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                {deltax < 1e-10 ? 'Very small — atomic scale' : deltax < 1e-6 ? 'Nano scale' : 'Macro scale'}
                            </div>
                        </div>

                        <div style={{ padding: '14px', background: 'rgba(127,119,221,0.1)', border: '1px solid rgba(127,119,221,0.3)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--purple)', letterSpacing: 1.5, marginBottom: 8 }}>
                                MOMENTUM Δp ≥ ħ/2Δx
                            </div>
                            <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--purple)', marginBottom: 4 }}>
                                {deltap.toExponential(3)} kg·m/s
                            </div>
                            {/* Bar: inversely proportional */}
                            <div style={{ height: 10, background: 'var(--bg3)', borderRadius: 5, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.min(100, Math.max(2, 100 - (Math.log10(deltax) + 15) / (8) * 100))}%`,
                                    background: 'var(--purple)', borderRadius: 5,
                                }} />
                            </div>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                Δv = {deltav > 1e8 ? '>c (relativistic limit!)' : `${deltav.toExponential(3)} m/s`}
                            </div>
                        </div>
                    </div>

                    {/* ΔxΔp product */}
                    <div style={{ padding: '12px 16px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text1)', lineHeight: 1.8, marginBottom: 14 }}>
                        ΔxΔp = {(deltax * deltap).toExponential(3)} kg·m²/s
                        <br />
                        ħ/2 = {(hbar / 2).toExponential(3)} kg·m²/s
                        <br />
                        <span style={{ color: 'var(--teal)', fontWeight: 700 }}>
                            ΔxΔp {deltax * deltap >= hbar / 2 ? '≥' : '<'} ħ/2 ✓
                        </span>
                        {' '}(uncertainty principle satisfied)
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Δx (position)" value={deltax.toExponential(2)} unit=" m" color={ptcl.color} highlight />
                        <ValueCard label="Δp ≥ ħ/2Δx" value={deltap.toExponential(3)} unit=" kg·m/s" color="var(--purple)" />
                        <ValueCard label="ΔE uncertainty" value={`${deltaEeV.toExponential(3)} eV`} color="var(--gold)" />
                        <ValueCard label="ΔxΔp product" value={(deltax * deltap).toExponential(3)} color="var(--teal)" />
                    </div>
                </div>
            )}

            {/* ── PHOTOELECTRIC ── */}
            {tab === 'photoelectric' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Einstein's Photoelectric:</span> E_photon = hf. If hf &gt; φ (work function), electron ejected with KE = hf − φ. Intensity affects number of electrons, not their energy. Frequency must exceed threshold — proving light is quantised (photons).
                    </div>

                    {/* Metal selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(METALS).map(k => (
                            <button key={k} onClick={() => setMetal(k)} style={{
                                padding: '3px 9px', borderRadius: 20, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: metal === k ? METALS[k].color : 'var(--bg3)',
                                color: metal === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${metal === k ? METALS[k].color : 'var(--border)'}`,
                            }}>{k} (φ={METALS[k].phi}eV)</button>
                        ))}
                    </div>

                    <ChemSlider label="Light frequency" unit=" THz" value={freq}
                        min={300} max={1500} step={10}
                        onChange={setFreq} color={ejects ? '#EF9F27' : 'var(--text3)'} />

                    {/* Status */}
                    <div style={{
                        padding: '12px 16px', borderRadius: 10, marginBottom: 14,
                        background: ejects ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)',
                        border: `1px solid ${ejects ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                        fontFamily: 'var(--mono)', fontSize: 12,
                        color: ejects ? 'var(--teal)' : 'var(--coral)',
                        lineHeight: 1.7,
                    }}>
                        {ejects
                            ? `✓ Photoelectric effect occurs! KE_max = hf − φ = ${Ephoton.toFixed(3)} − ${phi} = ${KEmax.toFixed(3)} eV`
                            : `✗ No emission. hf = ${Ephoton.toFixed(3)} eV < φ = ${phi} eV. Increase frequency above threshold (${f0.toFixed(0)} THz).`}
                    </div>

                    {/* Energy diagram */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        {/* KE vs frequency graph */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 8 }}>
                                KE_max vs FREQUENCY
                            </div>
                            {(() => {
                                const fMin = f0 * 0.5, fMax = f0 * 3
                                const KMax = hev * fMax * 1e12 - phi
                                const PW2 = 200, PH2 = 100
                                const P2 = { l: 36, r: 8, t: 8, b: 24 }
                                const tx = f => P2.l + ((f - fMin) / (fMax - fMin)) * (PW2 - P2.l - P2.r)
                                const ty = k => P2.t + (PH2 - P2.t - P2.b) - Math.max(0, k / Math.max(0.01, KMax)) * (PH2 - P2.t - P2.b)

                                const pts = Array.from({ length: 60 }, (_, i) => {
                                    const f = fMin + (i / 59) * (fMax - fMin)
                                    const ke = hev * f * 1e12 - phi
                                    return { f, ke: Math.max(0, ke) }
                                })
                                const linePath = pts.map((p, i) =>
                                    `${i === 0 ? 'M' : 'L'}${tx(p.f).toFixed(1)},${ty(p.ke).toFixed(1)}`
                                ).join(' ')

                                return (
                                    <svg viewBox={`0 0 ${PW2} ${PH2}`} width="100%">
                                        {/* Line */}
                                        <path d={linePath} fill="none" stroke="#EF9F27" strokeWidth={1.5} />
                                        {/* Threshold */}
                                        <line x1={tx(f0)} y1={P2.t} x2={tx(f0)} y2={PH2 - P2.b}
                                            stroke="rgba(216,90,48,0.5)" strokeWidth={1} strokeDasharray="3 2" />
                                        <text x={tx(f0)} y={P2.t - 2} textAnchor="middle"
                                            style={{ fontSize: 7, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>f₀</text>
                                        {/* Current */}
                                        {ejects && (
                                            <circle cx={tx(freq)} cy={ty(KEmax)} r={4}
                                                fill="#EF9F27" stroke="rgba(255,255,255,0.4)" strokeWidth={1} />
                                        )}
                                        {/* Axes */}
                                        <line x1={P2.l} y1={P2.t} x2={P2.l} y2={PH2 - P2.b}
                                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                        <line x1={P2.l} y1={PH2 - P2.b} x2={PW2 - P2.r} y2={PH2 - P2.b}
                                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                        <text x={PW2 - P2.r} y={PH2 - P2.b + 12}
                                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>f</text>
                                        <text x={P2.l - 4} y={P2.t + 8} textAnchor="end"
                                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>KE</text>
                                        {/* Slope label */}
                                        <text x={PW2 / 2} y={PH2 - 2} textAnchor="middle"
                                            style={{ fontSize: 7, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                                            slope = h = 4.136×10⁻¹⁵ eV·s
                                        </text>
                                    </svg>
                                )
                            })()}
                        </div>

                        {/* Energy breakdown */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {[
                                { label: 'Photon energy hf', val: `${Ephoton.toFixed(4)} eV`, color: '#EF9F27', w: 100 },
                                { label: 'Work function φ', val: `${phi} eV`, color: met.color, w: (phi / Math.max(Ephoton, phi)) * 100 },
                                { label: 'KE_max = hf − φ', val: ejects ? `${KEmax.toFixed(4)} eV` : '0 (no emission)', color: 'var(--teal)', w: ejects ? (KEmax / Math.max(Ephoton, 0.01)) * 100 : 0 },
                            ].map(row => (
                                <div key={row.label} style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                                        <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{row.label}</span>
                                        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: row.color }}>{row.val}</span>
                                    </div>
                                    <div style={{ height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, row.w))}%`, background: row.color, borderRadius: 4, transition: 'width 0.3s' }} />
                                    </div>
                                </div>
                            ))}

                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', padding: '8px 12px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)' }}>
                                Threshold freq f₀ = φ/h = <span style={{ color: met.color, fontWeight: 700 }}>{f0.toFixed(0)} THz</span>
                                <br />Stopping potential V₀ = KE/e = <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{ejects ? Vstop.toFixed(4) : '0'} V</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Photon energy hf" value={`${Ephoton.toFixed(4)} eV`} color="#EF9F27" highlight />
                        <ValueCard label="Work function φ" value={`${phi} eV`} color={met.color} />
                        <ValueCard label="KE_max" value={ejects ? `${KEmax.toFixed(4)} eV` : 'No emission'} color={ejects ? 'var(--teal)' : 'var(--coral)'} />
                        <ValueCard label="V_stop" value={ejects ? `${Vstop.toFixed(4)} V` : '—'} color={ejects ? 'var(--gold)' : 'var(--text3)'} />
                    </div>
                </div>
            )}
        </div>
    )
}