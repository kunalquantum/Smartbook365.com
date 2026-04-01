import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const ORBITALS = [
    {
        id: '1s',
        name: '1s Orbital',
        nodes: 0,
        color: '#EF9F27',
        desc: "The lowest energy state. The probability density is highest at the nucleus and decreases exponentially with distance.",
        equation: 'ψ₁ₛ ∝ e^(-r/a₀)'
    },
    {
        id: '2s',
        name: '2s Orbital',
        nodes: 1,
        color: '#1D9E75',
        desc: "Spherically symmetric but contains a radial node — a region where probability of finding an electron is zero.",
        equation: 'ψ₂ₛ ∝ (2 - r/a₀)e^(-r/2a₀)'
    },
    {
        id: '2p',
        name: '2p Orbital',
        nodes: 1,
        color: '#378ADD',
        desc: "Dumbbell-shaped. Contains an angular node (a nodal plane) passing through the nucleus.",
        equation: 'ψ₂ₚ ∝ r·e^(-r/2a₀)cos(θ)'
    }
]

function generateCloud(type) {
    const points = []
    const count = 1200
    for (let i = 0; i < count; i++) {
        let r, theta, x, y
        if (type === '1s') {
            // Exponential decay loosely
            r = -Math.log(Math.random()) * 20
            theta = Math.random() * 2 * Math.PI
        } else if (type === '2s') {
            // Inner peak, a node around r=30, and outer peak
            const rand = Math.random()
            if (rand < 0.2) {
                r = -Math.log(Math.random()) * 10
            } else {
                r = 45 + (-Math.log(Math.random()) * 25)
            }
            theta = Math.random() * 2 * Math.PI
        } else if (type === '2p') {
            // Dumbbell along Y axis
            r = -Math.log(Math.random()) * 30 + 15
            // weight theta towards poles
            theta = Math.random() < 0.5 
                ? (Math.random() - 0.5) * 1.2 
                : Math.PI + (Math.random() - 0.5) * 1.2
        }
        
        x = 100 + r * Math.cos(theta)
        y = 100 + r * Math.sin(theta)
        
        // Keep within bounds roughly
        if (x > 10 && x < 190 && y > 10 && y < 190) {
            points.push({ x, y, id: i })
        }
    }
    return points
}

export default function QuantumModel() {
    const [orb, setOrb] = useState('1s')
    const [view, setView] = useState('cloud') // cloud | density

    const cur = ORBITALS.find(o => o.id === orb)
    
    // Memoize the cloud so it doesn't flicker on every re-render unless orb changes
    const cloudPoints = useMemo(() => generateCloud(orb), [orb])

    return (
        <div>
            {/* Intro text */}
            <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 4 }}>
                    1926 · ERWIN SCHRÖDINGER
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)', marginBottom: 6 }}>Quantum Mechanical Model</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                    Electrons are treated as 3D standing waves rather than particles in fixed orbits. 
                    The wave function (<b>ψ</b>) has no physical meaning, but its square (<b>|ψ|²</b>) represents 
                    the <b>probability density</b> of finding an electron in a specific region of space around the nucleus.
                </div>
            </div>

            {/* Schrödinger Equation UI */}
            <div style={{ padding: '12px 14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.2)', borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 1.5, marginBottom: 6 }}>
                    SCHRÖDINGER EQUATION
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24, fontFamily: 'var(--mono)', fontWeight: 700, color: '#378ADD' }}>
                        Ĥψ = Eψ
                    </div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.5 }}>
                        <div><b style={{color: '#fff'}}>Ĥ</b> = Hamiltonian operator (total energy)</div>
                        <div><b style={{color: '#fff'}}>ψ</b> = Wave function (atomic orbital)</div>
                        <div><b style={{color: '#fff'}}>E</b> = Energy of the state</div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                    {ORBITALS.map(o => (
                        <button key={o.id} onClick={() => setOrb(o.id)} style={{
                            padding: '6px 14px', borderRadius: 6, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 600,
                            background: orb === o.id ? o.color : 'var(--bg3)',
                            color: orb === o.id ? '#000' : 'var(--text2)',
                            border: `1px solid ${orb === o.id ? o.color : 'var(--border)'}`,
                        }}>
                            {o.name}
                        </button>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 6, background: 'var(--bg3)', padding: 4, borderRadius: 8, border: '1px solid var(--border)' }}>
                    <button onClick={() => setView('cloud')} style={{
                        padding: '4px 12px', borderRadius: 4, fontSize: 11, border: 'none',
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: view === 'cloud' ? 'var(--border2)' : 'transparent',
                        color: view === 'cloud' ? '#fff' : 'var(--text3)',
                    }}>Electron Cloud</button>
                    <button onClick={() => setView('density')} style={{
                        padding: '4px 12px', borderRadius: 4, fontSize: 11, border: 'none',
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: view === 'density' ? 'var(--border2)' : 'transparent',
                        color: view === 'density' ? '#fff' : 'var(--text3)',
                    }}>Radial Probability</button>
                </div>
            </div>

            {/* Main Visual */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', border: `1px solid ${cur.color}30`, borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 220 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: cur.color, letterSpacing: 2, marginBottom: 8, alignSelf: 'flex-start' }}>
                        {view === 'cloud' ? 'PROBABILITY CLOUD (|ψ|²)' : 'RADIAL PROBABILITY DIST. 4πr²R²'}
                    </div>

                    {view === 'cloud' ? (
                        <svg viewBox="0 0 200 200" width="180" height="180" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, transparent 70%)', borderRadius: '50%' }}>
                            {cloudPoints.map(p => (
                                <circle key={p.id} cx={p.x} cy={p.y} r={0.8} fill={cur.color} opacity={0.6 + Math.random() * 0.4} />
                            ))}
                            {/* Nucleus */}
                            <circle cx={100} cy={100} r={2} fill="#fff" />
                            <circle cx={100} cy={100} r={4} fill="none" stroke="#fff" strokeWidth={0.5} opacity={0.5} />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 200 150" width="100%" height="150" style={{ marginTop: 'auto' }}>
                            {/* Axes */}
                            <line x1={20} y1={130} x2={190} y2={130} stroke="var(--border2)" strokeWidth={1} />
                            <line x1={20} y1={10} x2={20} y2={130} stroke="var(--border2)" strokeWidth={1} />
                            <text x={190} y={142} fontSize={8} fill="var(--text3)" fontFamily="var(--mono)" textAnchor="end">Distance (r)</text>
                            <text x={10} y={20} fontSize={8} fill="var(--text3)" fontFamily="var(--mono)" textAnchor="middle" transform="rotate(-90 10,20)">Probability</text>
                            
                            {/* Graph Paths */}
                            {orb === '1s' && (
                                <path d="M 20 130 Q 50 10, 80 50 T 180 128" fill="none" stroke={cur.color} strokeWidth={2} />
                            )}
                            {orb === '2s' && (
                                <path d="M 20 130 Q 30 80, 40 130 Q 80 40, 140 125 T 180 129" fill="none" stroke={cur.color} strokeWidth={2} />
                            )}
                            {orb === '2p' && (
                                <path d="M 20 130 Q 80 20, 160 128" fill="none" stroke={cur.color} strokeWidth={2} />
                            )}
                        </svg>
                    )}
                </div>

                {/* Info Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '12px 14px', background: `${cur.color}10`, border: `1px solid ${cur.color}30`, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: cur.color, letterSpacing: 1.5, marginBottom: 6 }}>
                            ORBITAL DESCRIPTION
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.6 }}>
                            {cur.desc}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            RADIAL WAVE FUNCTION
                        </div>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                            {cur.equation}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 6 }}>
                            NODES
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.6 }}>
                            Regions of zero probability. Total nodes = n - 1.
                            <br/>
                            <span style={{color: 'var(--coral)'}}>Radial nodes = {orb==='1s'?0:orb==='2s'?1:0}</span>
                            <br/>
                            <span style={{color: 'var(--coral)'}}>Angular nodes (l) = {orb==='2p'?1:0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Concept" value="Probability Density" color="var(--teal)" highlight />
                <ValueCard label="Total Nodes (n - 1)" value={cur.nodes} color={cur.color} />
                <ValueCard label="Wave Function Square" value="|ψ|²" color="var(--gold)" />
            </div>
        </div>
    )
}