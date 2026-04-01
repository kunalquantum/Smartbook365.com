import { useState, useEffect, useRef } from 'react'
import { BINDING_ENERGIES } from './helpers/nuclearData'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = {
    'U-235 fission': {
        color: '#EF9F27',
        eq: '²³⁵U + n → ⁹²Kr + ¹⁴¹Ba + 3n',
        type: 'fission',
        Q_MeV: 202.5,
        desc: 'One neutron triggers fission of U-235, releasing 3 neutrons and 202 MeV energy. Each neutron can trigger further fissions — chain reaction.',
        reactants: { '²³⁵U': 235.043928, 'n': 1.008665 },
        products: { '⁹²Kr': 91.926156, '¹⁴¹Ba': 140.914411, '3n': 3.025995 },
    },
    'D-T fusion': {
        color: '#378ADD',
        eq: '²H + ³H → ⁴He + n + 17.6 MeV',
        type: 'fusion',
        Q_MeV: 17.6,
        desc: 'Deuterium and tritium fuse to form helium-4, releasing a neutron and 17.6 MeV. The energy per unit mass is 4× that of fission.',
        reactants: { '²H': 2.014102, '³H': 3.016049 },
        products: { '⁴He': 4.002602, 'n': 1.008665 },
    },
    'Radioactive capture': {
        color: '#7F77DD',
        eq: '²³⁸U + n → ²³⁹U → ²³⁹Np → ²³⁹Pu',
        type: 'transmutation',
        Q_MeV: 4.8,
        desc: 'Uranium-238 captures a neutron and undergoes two beta decays to form Plutonium-239. This is how plutonium is produced in reactors.',
        reactants: { '²³⁸U': 238.050787, 'n': 1.008665 },
        products: { '²³⁹Pu': 239.052163 },
    },
}

// Chain reaction simulation
function ChainReaction({ running, onFission }) {
    const canvasRef = useRef(null)
    const stateRef = useRef({
        nuclei: [{ x: 200, y: 150, active: true, id: 0, gen: 0 }],
        neutrons: [{ x: 20, y: 150, vx: 3.5, vy: 0, active: true }],
        explosions: [],
        nextId: 1, frame: 0, running: false,
    })
    const rafRef = useRef(null)

    useEffect(() => {
        stateRef.current.running = running
        if (!running) return

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        const W = canvas.width, H = canvas.height

        const step = () => {
            if (!stateRef.current.running) return
            const s = stateRef.current
            s.frame++
            ctx.clearRect(0, 0, W, H)

            // Background
            ctx.fillStyle = 'rgba(13,31,26,0.3)'
            ctx.fillRect(0, 0, W, H)

            // Limit to 40 nuclei to avoid runaway
            const MAX_NUCLEI = 40

            // Update neutrons
            s.neutrons = s.neutrons.filter(n => {
                if (!n.active) return false
                n.x += n.vx; n.y += n.vy
                if (n.x < 0 || n.x > W || n.y < 0 || n.y > H) return false

                // Check collision with nuclei
                for (const nuc of s.nuclei) {
                    if (!nuc.active) continue
                    const dx = n.x - nuc.x, dy = n.y - nuc.y
                    if (Math.sqrt(dx * dx + dy * dy) < 16 && s.nuclei.length < MAX_NUCLEI) {
                        nuc.active = false
                        // Spawn 2 fragment nuclei + 2 neutrons
                        if (nuc.gen < 3) {
                            for (let i = 0; i < 2; i++) {
                                const ang = Math.random() * Math.PI * 2
                                s.nuclei.push({ x: nuc.x + Math.cos(ang) * 20, y: nuc.y + Math.sin(ang) * 20, active: true, id: s.nextId++, gen: nuc.gen + 1 })
                                const na = Math.random() * Math.PI * 2
                                s.neutrons.push({ x: nuc.x, y: nuc.y, vx: Math.cos(na) * 2.5, vy: Math.sin(na) * 2.5, active: true })
                            }
                        }
                        s.explosions.push({ x: nuc.x, y: nuc.y, r: 4, maxR: 30, color: '#EF9F27', alpha: 1 })
                        onFission && onFission()
                        return false
                    }
                }

                // Draw neutron
                ctx.fillStyle = 'rgba(168,216,185,0.9)'
                ctx.beginPath(); ctx.arc(n.x, n.y, 3, 0, Math.PI * 2); ctx.fill()
                return true
            })

            // Update explosions
            s.explosions = s.explosions.filter(e => {
                e.r += 1.5; e.alpha -= 0.04
                if (e.alpha <= 0) return false
                ctx.globalAlpha = e.alpha
                ctx.strokeStyle = e.color
                ctx.lineWidth = 2
                ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.stroke()
                ctx.globalAlpha = 1
                return true
            })

            // Draw nuclei
            s.nuclei.forEach(nuc => {
                if (!nuc.active) return
                const col = ['#EF9F27', '#D85A30', '#7F77DD', '#378ADD'][nuc.gen] || '#888780'
                ctx.fillStyle = `${col}60`
                ctx.strokeStyle = col
                ctx.lineWidth = 2
                ctx.beginPath(); ctx.arc(nuc.x, nuc.y, 12, 0, Math.PI * 2)
                ctx.fill(); ctx.stroke()
                ctx.fillStyle = col
                ctx.font = '8px monospace'
                ctx.textAlign = 'center'
                ctx.fillText('U', nuc.x, nuc.y + 3)
            })

            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [running])

    return (
        <canvas ref={canvasRef} width={400} height={240}
            style={{ display: 'block', width: '100%', borderRadius: 8 }} />
    )
}

export default function NuclearReactions() {
    const [rxn, setRxn] = useState('U-235 fission')
    const [tab, setTab] = useState('reaction')   // reaction | binding | chain
    const [running, setRunning] = useState(false)
    const [fissions, setFissions] = useState(0)

    const r = REACTIONS[rxn]

    // Mass defect: Δm = (sum reactant masses) - (sum product masses)
    const reactantMass = Object.values(r.reactants).reduce((s, m) => s + m, 0)
    const productMass = Object.values(r.products).reduce((s, m) => s + m, 0)
    const deltaMass = reactantMass - productMass   // u
    const Q_MeV_calc = deltaMass * 931.5            // MeV

    // Graph for binding energy curve
    const W = 380, H = 140, GP = { l: 44, r: 12, t: 14, b: 28 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b
    const maxBE = 9.0, maxA = 240
    const toX = A => GP.l + (A / maxA) * PW
    const toY = BE => GP.t + PH - (BE / maxBE) * PH
    const bePath = BINDING_ENERGIES.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.A).toFixed(1)},${toY(p.BE_per_A).toFixed(1)}`).join(' ')

    const handleFission = () => setFissions(p => p + 1)

    const resetChain = () => {
        setRunning(false)
        setFissions(0)
    }

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(REACTIONS).map(k => (
                    <button key={k} onClick={() => setRxn(k)} style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxn === k ? REACTIONS[k].color : 'var(--bg3)',
                        color: rxn === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${rxn === k ? REACTIONS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {[{ k: 'reaction', l: 'Q-value & mass defect' }, { k: 'binding', l: 'Binding energy curve' }, { k: 'chain', l: 'Chain reaction' }].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: tab === t.k ? r.color : 'var(--bg3)',
                        color: tab === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? r.color : 'var(--border)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── REACTION ── */}
            {tab === 'reaction' && (
                <div>
                    <div style={{ padding: '12px 16px', background: `${r.color}12`, border: `2px solid ${r.color}40`, borderRadius: 12, marginBottom: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: r.color, marginBottom: 6, letterSpacing: 1 }}>
                            {r.eq}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.desc}</div>
                    </div>

                    {/* Mass-energy calculation */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 12 }}>
                            MASS-ENERGY CALCULATION (E = mc²)
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                            {/* Reactants */}
                            <div style={{ padding: '10px 12px', background: `${r.color}10`, border: `1px solid ${r.color}30`, borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>REACTANTS</div>
                                {Object.entries(r.reactants).map(([sym, m]) => (
                                    <div key={sym} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: r.color, marginBottom: 2 }}>
                                        {sym}: {m.toFixed(6)} u
                                    </div>
                                ))}
                                <div style={{ borderTop: `1px solid ${r.color}30`, marginTop: 6, paddingTop: 6, fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: r.color }}>
                                    Σ = {reactantMass.toFixed(6)} u
                                </div>
                            </div>

                            {/* Arrow */}
                            <div style={{ fontSize: 20, color: 'var(--text3)', textAlign: 'center' }}>→</div>

                            {/* Products */}
                            <div style={{ padding: '10px 12px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6 }}>PRODUCTS</div>
                                {Object.entries(r.products).map(([sym, m]) => (
                                    <div key={sym} style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)', marginBottom: 2 }}>
                                        {sym}: {m.toFixed(6)} u
                                    </div>
                                ))}
                                <div style={{ borderTop: '1px solid rgba(29,158,117,0.3)', marginTop: 6, paddingTop: 6, fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)' }}>
                                    Σ = {productMass.toFixed(6)} u
                                </div>
                            </div>

                            {/* = */}
                            <div style={{ fontSize: 20, color: 'var(--text3)', textAlign: 'center' }}>=</div>

                            {/* Q */}
                            <div style={{ padding: '10px 12px', background: 'rgba(212,160,23,0.12)', border: '2px solid rgba(212,160,23,0.4)', borderRadius: 8, textAlign: 'center' }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', marginBottom: 6 }}>ENERGY Q</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Δm = {deltaMass.toFixed(6)} u</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>× 931.5 MeV/u</div>
                                <div style={{ fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', marginTop: 6 }}>
                                    {Q_MeV_calc.toFixed(1)} MeV
                                </div>
                            </div>
                        </div>

                        {/* Comparison */}
                        <div style={{ padding: '8px 12px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text2)' }}>
                            Compare: chemical reaction (coal burning) ≈ 4 eV/atom  ·  nuclear fission = {r.Q_MeV} MeV = {(r.Q_MeV * 1e6 / 4).toExponential(1)} × more energy
                        </div>
                    </div>

                    {/* Fission vs Fusion comparison */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                            { type: 'Fission', color: '#EF9F27', Q: 202.5, condition: 'Slow neutrons, critical mass', fuel: 'U-235, Pu-239', use: 'Nuclear reactors, A-bomb' },
                            { type: 'Fusion', color: '#378ADD', Q: 17.6, condition: '~10⁸ K (plasma)', fuel: 'Deuterium, Tritium', use: 'H-bomb, future reactors' },
                        ].map(row => (
                            <div key={row.type} style={{ padding: '10px 14px', background: `${row.color}10`, border: `1px solid ${row.color}30`, borderRadius: 10 }}>
                                <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: row.color, marginBottom: 6 }}>{row.type}</div>
                                {[['Q-value', row.Q + ' MeV'], ['Condition', row.condition], ['Fuel', row.fuel], ['Use', row.use]].map(([k, v]) => (
                                    <div key={k} style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text2)', marginBottom: 3 }}>
                                        <span style={{ color: 'var(--text3)' }}>{k}: </span>{v}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── BINDING ENERGY ── */}
            {tab === 'binding' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: '#378ADD' }}>Binding energy per nucleon</strong> — peaks at Fe-56 (most stable). Elements lighter than Fe release energy by fusion; heavier than Fe release energy by fission. This is why stars shine.
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {/* Fe-56 peak marker */}
                            <line x1={toX(56)} y1={GP.t} x2={toX(56)} y2={GP.t + PH}
                                stroke="rgba(212,160,23,0.3)" strokeWidth={1} strokeDasharray="4 3" />
                            <text x={toX(56)} y={GP.t + 5} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(212,160,23,0.8)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                Fe-56 (most stable)
                            </text>

                            {/* Fission and Fusion regions */}
                            <rect x={GP.l} y={GP.t} width={toX(56) - GP.l} height={PH}
                                fill="rgba(55,138,221,0.04)" />
                            <rect x={toX(56)} y={GP.t} width={GP.l + PW - toX(56)} height={PH}
                                fill="rgba(239,159,39,0.04)" />
                            <text x={toX(28)} y={GP.t + 18} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(55,138,221,0.4)', fontFamily: 'var(--mono)' }}>← fusion region</text>
                            <text x={toX(148)} y={GP.t + 18} textAnchor="middle"
                                style={{ fontSize: 8, fill: 'rgba(239,159,39,0.4)', fontFamily: 'var(--mono)' }}>fission region →</text>

                            {/* Curve */}
                            <path d={bePath} fill="none" stroke="rgba(160,176,200,0.7)" strokeWidth={2} />

                            {/* Data points */}
                            {BINDING_ENERGIES.map(p => (
                                <circle key={p.A} cx={toX(p.A)} cy={toY(p.BE_per_A)} r={4}
                                    fill={p.A === 56 ? 'var(--gold)' : 'rgba(160,176,200,0.6)'}
                                    stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                            ))}

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Mass number A</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>BE/A (MeV)</text>
                        </svg>
                    </div>

                    {/* Data table */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                        {BINDING_ENERGIES.map(p => (
                            <div key={p.A} style={{
                                padding: '6px 10px', background: p.A === 56 ? 'rgba(212,160,23,0.12)' : 'var(--bg3)',
                                border: `1px solid ${p.A === 56 ? 'rgba(212,160,23,0.4)' : 'var(--border)'}`,
                                borderRadius: 8, textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: p.A === 56 ? 'var(--gold)' : 'var(--text2)' }}>{p.symbol}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: p.A === 56 ? 'var(--gold)' : 'var(--text3)' }}>{p.BE_per_A} MeV</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── CHAIN REACTION ── */}
            {tab === 'chain' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(239,159,39,0.08)', border: '1px solid rgba(239,159,39,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Chain reaction:</strong> Each U-235 fission releases ~3 neutrons, each capable of triggering further fissions. If k &gt; 1 (supercritical), exponential growth → nuclear explosion. If k = 1 (critical) → sustained reactor.
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', border: `2px solid ${running ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14, transition: 'border-color 0.3s' }}>
                        <div style={{ padding: '6px 12px', background: running ? 'rgba(239,159,39,0.1)' : 'rgba(0,0,0,0.2)', fontSize: 10, fontFamily: 'var(--mono)', color: running ? 'var(--gold)' : 'var(--text3)', transition: 'all 0.3s' }}>
                            {running ? `⚡ CHAIN REACTION IN PROGRESS — ${fissions} fissions` : '○ Ready — click Start to initiate chain reaction'}
                        </div>
                        <ChainReaction running={running} onFission={handleFission} />
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <button onClick={() => { if (running) { setRunning(false) } else { setFissions(0); setRunning(true) } }} style={{
                            flex: 2, padding: '10px', borderRadius: 8, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: running ? 'rgba(216,90,48,0.15)' : 'rgba(239,159,39,0.15)',
                            color: running ? 'var(--coral)' : 'var(--gold)',
                            border: `2px solid ${running ? 'rgba(216,90,48,0.4)' : 'rgba(239,159,39,0.4)'}`,
                        }}>{running ? '⏸ Stop reaction' : '▶ Initiate chain reaction'}</button>
                        <button onClick={resetChain} style={{
                            flex: 1, padding: '10px', borderRadius: 8, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text3)', border: '1px solid var(--border)',
                        }}>↺ Reset</button>
                    </div>

                    {/* Multiplication factor */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {[
                            { k: 'k < 1', label: 'Subcritical', col: 'var(--teal)', desc: 'Reaction dies out — used for control rods' },
                            { k: 'k = 1', label: 'Critical', col: 'var(--gold)', desc: 'Sustained chain reaction — nuclear reactor' },
                            { k: 'k > 1', label: 'Supercritical', col: 'var(--coral)', desc: 'Exponential growth — nuclear weapon' },
                        ].map(row => (
                            <div key={row.k} style={{ padding: '10px', background: `${row.col === 'var(--teal)' ? 'rgba(29,158,117' : row.col === 'var(--gold)' ? 'rgba(212,160,23' : 'rgba(216,90,48'}.08)`, border: `1px solid ${row.col}30`, borderRadius: 8, textAlign: 'center' }}>
                                <div style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700, color: row.col }}>{row.k}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.col, marginTop: 3 }}>{row.label}</div>
                                <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4, lineHeight: 1.4 }}>{row.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Reaction" value={rxn} color={r.color} highlight />
                <ValueCard label="Q-value" value={`${r.Q_MeV} MeV`} color="var(--gold)" />
                <ValueCard label="Type" value={r.type} color={r.color} />
                {tab === 'chain' && <ValueCard label="Fissions" value={fissions} color="var(--coral)" />}
            </div>
        </div>
    )
}