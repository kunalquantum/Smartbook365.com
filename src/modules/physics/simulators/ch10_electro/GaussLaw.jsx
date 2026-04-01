import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const K = 9e9
const E0 = 8.85e-12

const DISTRIBUTIONS = {
    'Point charge': { desc: 'Spherical Gaussian surface around q', formula: 'E = kQ/r²', icon: '●' },
    'Infinite plane': { desc: 'Pillbox surface across charged plane', formula: 'E = σ/2ε₀', icon: '▬' },
    'Infinite wire': { desc: 'Cylindrical surface around wire', formula: 'E = λ/2πε₀r', icon: '|' },
    'Charged sphere': { desc: 'Gaussian sphere inside/outside shell', formula: 'E=0 inside, kQ/r² outside', icon: '○' },
}

export default function GaussLaw() {
    const [dist, setDist] = useState('Point charge')
    const [Q, setQ] = useState(5)      // nC
    const [sigma, setSigma] = useState(10)     // nC/m²
    const [lambda, setLambda] = useState(5)      // nC/m
    const [r, setR] = useState(0.3)    // m
    const [inside, setInside] = useState(false)  // for charged sphere

    const Q_C = Q * 1e-9
    const sigma_C = sigma * 1e-9
    const lambda_C = lambda * 1e-9

    // Compute E and flux based on distribution
    let E = 0, flux = 0, Qenc = 0
    if (dist === 'Point charge') {
        E = K * Math.abs(Q_C) / (r * r)
        Qenc = Q_C
        flux = Q_C / E0
    } else if (dist === 'Infinite plane') {
        E = sigma_C / (2 * E0)
        Qenc = sigma_C * 1   // per m²
        flux = sigma_C / E0
    } else if (dist === 'Infinite wire') {
        E = lambda_C / (2 * Math.PI * E0 * r)
        Qenc = lambda_C * 1  // per m
        flux = lambda_C / E0
    } else if (dist === 'Charged sphere') {
        E = inside ? 0 : K * Math.abs(Q_C) / (r * r)
        Qenc = inside ? 0 : Q_C
        flux = inside ? 0 : Q_C / E0
    }

    const CX = W / 2, CY = H / 2

    // Visualize based on distribution
    const nFluxLines = Math.min(16, Math.round(Math.abs(Q) * 2 + 4))
    const surfaceR = 90

    return (
        <div>
            {/* Distribution selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(DISTRIBUTIONS).map(d => (
                    <button key={d} onClick={() => setDist(d)} style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: dist === d ? 'var(--amber)' : 'var(--bg3)',
                        color: dist === d ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>{d}</button>
                ))}
            </div>

            {/* Sliders by distribution */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {dist === 'Point charge' && <>
                    <SimSlider label="Charge Q" unit=" nC" value={Q} min={0.5} max={20} step={0.5} onChange={setQ} />
                    <SimSlider label="Radius r" unit=" m" value={r} min={0.1} max={2} step={0.05} onChange={setR} />
                </>}
                {dist === 'Infinite plane' && (
                    <SimSlider label="Surface charge σ" unit=" nC/m²" value={sigma} min={1} max={50} step={1} onChange={setSigma} />
                )}
                {dist === 'Infinite wire' && <>
                    <SimSlider label="Linear charge λ" unit=" nC/m" value={lambda} min={0.5} max={20} step={0.5} onChange={setLambda} />
                    <SimSlider label="Radial distance r" unit=" m" value={r} min={0.05} max={1} step={0.05} onChange={setR} />
                </>}
                {dist === 'Charged sphere' && <>
                    <SimSlider label="Total charge Q" unit=" nC" value={Q} min={0.5} max={20} step={0.5} onChange={setQ} />
                    <SimSlider label="Distance r" unit=" m" value={r} min={0.05} max={2} step={0.05} onChange={setR} />
                </>}
            </div>

            {dist === 'Charged sphere' && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                    {['outside shell', 'inside shell'].map((l, i) => (
                        <button key={l} onClick={() => setInside(i === 1)} style={{
                            padding: '4px 14px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                            background: inside === (i === 1) ? 'var(--teal)' : 'var(--bg3)',
                            color: inside === (i === 1) ? '#fff' : 'var(--text2)',
                            border: '1px solid var(--border)',
                        }}>{l}</button>
                    ))}
                </div>
            )}

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>
                <defs>
                    <marker id="gf" viewBox="0 0 10 10" refX={8} refY={5}
                        markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                        <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.7)"
                            strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </marker>
                </defs>

                {/* === POINT CHARGE === */}
                {dist === 'Point charge' && (
                    <g>
                        {/* Gaussian surface */}
                        <circle cx={CX} cy={CY} r={surfaceR}
                            fill="none" stroke="rgba(29,158,117,0.3)"
                            strokeWidth={1.5} strokeDasharray="6 4" />
                        <text x={CX + surfaceR + 6} y={CY + 4}
                            style={{ fontSize: 9, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                            Gaussian surface
                        </text>

                        {/* Flux lines */}
                        {Array.from({ length: nFluxLines }, (_, i) => {
                            const angle = (i / nFluxLines) * 2 * Math.PI
                            const x1 = CX + 14 * Math.cos(angle)
                            const y1 = CY + 14 * Math.sin(angle)
                            const x2 = CX + (surfaceR + 20) * Math.cos(angle)
                            const y2 = CY + (surfaceR + 20) * Math.sin(angle)
                            return (
                                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                                    stroke={`rgba(239,159,39,${0.15 + Math.abs(Q_C) * 5e8})`}
                                    strokeWidth={1} markerEnd="url(#gf)" />
                            )
                        })}

                        {/* Source charge */}
                        <circle cx={CX} cy={CY} r={14}
                            fill="rgba(216,90,48,0.2)" stroke="#D85A30" strokeWidth={2} />
                        <text x={CX} y={CY + 5} textAnchor="middle"
                            style={{ fontSize: 12, fill: '#D85A30', fontFamily: 'var(--mono)', fontWeight: 700 }}>+</text>

                        {/* r label */}
                        <line x1={CX} y1={CY} x2={CX + surfaceR} y2={CY}
                            stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} strokeDasharray="3 2" />
                        <text x={CX + surfaceR / 2} y={CY - 6}
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>r</text>
                    </g>
                )}

                {/* === INFINITE PLANE === */}
                {dist === 'Infinite plane' && (
                    <g>
                        <rect x={CX - 4} y={20} width={8} height={H - 40}
                            fill={`rgba(55,138,221,${Math.min(0.5, sigma / 100 + 0.1)})`}
                            stroke="rgba(55,138,221,0.5)" strokeWidth={1.5} />
                        {/* σ charges on plane */}
                        {Array.from({ length: 7 }, (_, i) => (
                            <text key={i} x={CX} y={36 + i * 32} textAnchor="middle"
                                style={{ fontSize: 10, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>+</text>
                        ))}
                        {/* Field lines both sides */}
                        {[-1, 1].map(dir => (
                            Array.from({ length: 5 }, (_, i) => {
                                const y = 40 + i * 46
                                return (
                                    <line key={`${dir}_${i}`}
                                        x1={CX + dir * 12} y1={y}
                                        x2={CX + dir * 80} y2={y}
                                        stroke="rgba(239,159,39,0.5)" strokeWidth={1.5}
                                        markerEnd="url(#gf)" />
                                )
                            })
                        ))}
                        {/* Pillbox */}
                        <rect x={CX - 50} y={CY - 30} width={100} height={60}
                            fill="none" stroke="rgba(29,158,117,0.3)"
                            strokeWidth={1} strokeDasharray="5 3" />
                        <text x={CX + 54} y={CY + 4}
                            style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>pillbox</text>
                    </g>
                )}

                {/* === INFINITE WIRE === */}
                {dist === 'Infinite wire' && (
                    <g>
                        {/* Wire */}
                        <line x1={CX} y1={10} x2={CX} y2={H - 10}
                            stroke="#EF9F27" strokeWidth={3} />
                        {/* Cylindrical Gaussian surface */}
                        <ellipse cx={CX} cy={CY} rx={80} ry={25}
                            fill="none" stroke="rgba(29,158,117,0.3)"
                            strokeWidth={1.5} strokeDasharray="5 3" />
                        <ellipse cx={CX} cy={CY - 60} rx={80} ry={25}
                            fill="none" stroke="rgba(29,158,117,0.2)"
                            strokeWidth={1} strokeDasharray="5 3" />
                        {/* Cylinder sides */}
                        <line x1={CX - 80} y1={CY - 60} x2={CX - 80} y2={CY}
                            stroke="rgba(29,158,117,0.2)" strokeWidth={1} strokeDasharray="5 3" />
                        <line x1={CX + 80} y1={CY - 60} x2={CX + 80} y2={CY}
                            stroke="rgba(29,158,117,0.2)" strokeWidth={1} strokeDasharray="5 3" />
                        {/* Radial field lines */}
                        {[-70, -40, 40, 70].map((dx, i) => (
                            <line key={i}
                                x1={CX + Math.sign(dx) * 6} y1={CY - 28}
                                x2={CX + dx} y2={CY - 28}
                                stroke="rgba(239,159,39,0.5)" strokeWidth={1.5}
                                markerEnd="url(#gf)" />
                        ))}
                        <text x={CX + 86} y={CY - 26}
                            style={{ fontSize: 8, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>cylinder</text>
                    </g>
                )}

                {/* === CHARGED SPHERE === */}
                {dist === 'Charged sphere' && (
                    <g>
                        <circle cx={CX} cy={CY} r={70}
                            fill="rgba(55,138,221,0.08)"
                            stroke="rgba(55,138,221,0.5)" strokeWidth={2} />
                        <text x={CX} y={CY + 4} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>shell</text>
                        {inside ? (
                            <>
                                <text x={CX} y={CY - 20} textAnchor="middle"
                                    style={{ fontSize: 12, fill: 'rgba(29,158,117,0.7)', fontFamily: 'var(--mono)', fontWeight: 700 }}>E = 0</text>
                                <text x={CX} y={CY - 36} textAnchor="middle"
                                    style={{ fontSize: 10, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>Q_enclosed = 0</text>
                            </>
                        ) : (
                            Array.from({ length: 10 }, (_, i) => {
                                const angle = (i / 10) * 2 * Math.PI
                                return (
                                    <line key={i}
                                        x1={CX + 72 * Math.cos(angle)} y1={CY + 72 * Math.sin(angle)}
                                        x2={CX + 110 * Math.cos(angle)} y2={CY + 110 * Math.sin(angle)}
                                        stroke="rgba(239,159,39,0.5)" strokeWidth={1.5}
                                        markerEnd="url(#gf)" />
                                )
                            })
                        )}
                    </g>
                )}

                {/* Formula */}
                <text x={W / 2} y={H - 10} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>
                    Φ = ∮E·dA = Q_enc/ε₀  —  {DISTRIBUTIONS[dist].formula}
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Electric field E', val: E > 1e6 ? `${(E / 1e6).toFixed(3)} MV/m` : E > 1e3 ? `${(E / 1e3).toFixed(3)} kV/m` : `${E.toFixed(3)} V/m`, color: 'var(--amber)' },
                    { label: 'Flux Φ = Q/ε₀', val: `${(flux).toExponential(3)} Nm²/C`, color: 'var(--teal)' },
                    { label: 'Q enclosed', val: inside ? '0 (shell!)' : `${(Qenc * 1e9).toFixed(3)} nC`, color: inside ? 'var(--coral)' : 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 120,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}