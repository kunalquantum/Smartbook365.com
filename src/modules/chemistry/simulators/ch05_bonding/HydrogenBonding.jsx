import { useState, useEffect, useRef } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const SYSTEMS = {
    'Water (H₂O)': {
        color: '#378ADD',
        donor: 'O−H···O',
        energy: '~20 kJ/mol',
        bp: '100°C (expected ~−80°C without H-bonds)',
        type: 'inter',
        desc: 'Water forms an extensive H-bond network — each molecule can form up to 4 H-bonds (2 donor, 2 acceptor). This gives water its anomalously high boiling point and surface tension.',
        nMolecules: 6,
        HBStrength: 0.85,
    },
    'HF': {
        color: '#1D9E75',
        donor: 'F−H···F',
        energy: '~29 kJ/mol (strongest H-bond)',
        bp: '19.5°C (expected ~−35°C)',
        type: 'inter',
        desc: 'HF forms very strong H-bonds because F is the most electronegative element. Despite being a small molecule, HF has a much higher boiling point than expected.',
        nMolecules: 5,
        HBStrength: 1.0,
    },
    'NH₃': {
        color: '#7F77DD',
        donor: 'N−H···N',
        energy: '~13 kJ/mol',
        bp: '-33°C (expected ~-90°C)',
        type: 'inter',
        desc: 'NH₃ forms moderate H-bonds. Each NH₃ has 3 N-H donors but only 1 lone pair acceptor — giving a chain structure rather than the 3D network of water.',
        nMolecules: 5,
        HBStrength: 0.6,
    },
    '2-Nitrophenol (intramolecular)': {
        color: '#EF9F27',
        donor: 'O−H···O=N',
        energy: '~25 kJ/mol',
        bp: '216°C (lower than 4-nitrophenol: 279°C)',
        type: 'intra',
        desc: 'Intramolecular H-bonding occurs within the same molecule. The O-H forms a H-bond to the nearby nitro group — this satisfies the donor/acceptor and blocks intermolecular H-bonding, lowering the boiling point.',
        nMolecules: 1,
        HBStrength: 0.75,
    },
}

export default function HydrogenBonding() {
    const [system, setSystem] = useState('Water (H₂O)')
    const [speed, setSpeed] = useState(1)
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null), lastRef = useRef(null), tRef = useRef(0)

    useEffect(() => {
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000 * speed
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => cancelAnimationFrame(rafRef.current)
    }, [speed])

    const t = tRef.current
    const sys = SYSTEMS[system]
    const W = 420, H = 240

    // Generate molecule positions
    const molPositions = Array.from({ length: sys.nMolecules }, (_, i) => {
        const baseX = sys.type === 'intra' ? W / 2 : 60 + (i % 3) * 120
        const baseY = sys.type === 'intra' ? H / 2 - 20 : 60 + Math.floor(i / 3) * 110
        const jx = Math.sin(t * 0.3 + i * 1.7) * 6
        const jy = Math.cos(t * 0.4 + i * 1.3) * 6
        return { x: baseX + jx, y: baseY + jy, angle: (i * 60 + t * 5) % 360 }
    })

    // Draw a single water-type molecule
    const drawMolecule = (cx, cy, ang, col, idx) => {
        const rad = ang * Math.PI / 180
        const hLen = 24
        // Two H positions
        const angles = [rad - 0.9, rad + 0.9]
        return (
            <g key={idx}>
                {/* Central atom (O/F/N) */}
                <circle cx={cx} cy={cy} r={11}
                    fill={`${col}25`} stroke={col} strokeWidth={2} />
                <text x={cx} y={cy + 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: col, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    {system === 'HF' ? 'F' : system === 'NH₃' ? 'N' : 'O'}
                </text>

                {/* H atoms */}
                {angles.map((a, i) => {
                    const hx = cx + Math.cos(a) * hLen
                    const hy = cy + Math.sin(a) * hLen
                    return (
                        <g key={i}>
                            <line x1={cx + Math.cos(a) * 11} y1={cy + Math.sin(a) * 11}
                                x2={hx - Math.cos(a) * 7} y2={hy - Math.sin(a) * 7}
                                stroke={`${col}50`} strokeWidth={1.8} />
                            <circle cx={hx} cy={hy} r={7}
                                fill="rgba(168,216,185,0.2)"
                                stroke="#A8D8B9" strokeWidth={1.5} />
                            <text x={hx} y={hy + 3} textAnchor="middle"
                                style={{ fontSize: 8, fill: '#A8D8B9', fontFamily: 'var(--mono)', fontWeight: 700 }}>H</text>
                        </g>
                    )
                })}
            </g>
        )
    }

    // Draw H-bonds between molecules
    const drawHBonds = () => {
        if (sys.type === 'intra') return null
        if (molPositions.length < 2) return null

        const bonds = []
        // Connect each molecule to nearest neighbour
        const pairs = [
            [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
            [0, 3], [1, 4], [2, 5]
        ].filter(([a, b]) => a < molPositions.length && b < molPositions.length)

        pairs.slice(0, 6).forEach(([i, j], bi) => {
            const m1 = molPositions[i], m2 = molPositions[j]
            const dx = m2.x - m1.x, dy = m2.y - m1.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist > 140) return
            const strength = sys.HBStrength * (1 - dist / 150)
            if (strength <= 0) return

            // Animated pulsing H-bond
            const pulse = 0.4 + 0.3 * Math.sin(t * 1.5 + bi)
            bonds.push(
                <line key={bi}
                    x1={m1.x} y1={m1.y}
                    x2={m2.x} y2={m2.y}
                    stroke={sys.color}
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    opacity={pulse * strength * 0.8} />
            )
            // δ+ / δ- labels
            if (dist < 100) {
                bonds.push(
                    <text key={`d${bi}`}
                        x={(m1.x + m2.x) / 2} y={(m1.y + m2.y) / 2 - 6}
                        textAnchor="middle"
                        style={{ fontSize: 8, fill: `${sys.color}80`, fontFamily: 'var(--mono)' }}>
                        ···
                    </text>
                )
            }
        })
        return bonds
    }

    // Intramolecular H-bond (2-nitrophenol)
    const drawIntra = () => {
        const cx = W / 2, cy = H / 2 - 20
        const col = sys.color
        return (
            <g>
                {/* Benzene ring */}
                {Array.from({ length: 6 }, (_, i) => {
                    const a1 = i / 6 * 2 * Math.PI - Math.PI / 6
                    const a2 = (i + 1) / 6 * 2 * Math.PI - Math.PI / 6
                    const r = 34
                    return (
                        <line key={i}
                            x1={cx + r * Math.cos(a1)} y1={cy + r * Math.sin(a1)}
                            x2={cx + r * Math.cos(a2)} y2={cy + r * Math.sin(a2)}
                            stroke="rgba(136,135,128,0.6)" strokeWidth={1.5} />
                    )
                })}

                {/* OH group */}
                <line x1={cx + 34} y1={cy} x2={cx + 56} y2={cy - 18}
                    stroke={`${col}60`} strokeWidth={1.5} />
                <circle cx={cx + 56} cy={cy - 18} r={10}
                    fill={`${col}20`} stroke={col} strokeWidth={1.5} />
                <text x={cx + 56} y={cy - 15} textAnchor="middle"
                    style={{ fontSize: 8, fill: col, fontFamily: 'var(--mono)', fontWeight: 700 }}>O</text>
                <circle cx={cx + 74} cy={cy - 28} r={7}
                    fill="rgba(168,216,185,0.2)" stroke="#A8D8B9" strokeWidth={1.5} />
                <text x={cx + 74} y={cy - 25} textAnchor="middle"
                    style={{ fontSize: 8, fill: '#A8D8B9', fontFamily: 'var(--mono)', fontWeight: 700 }}>H</text>

                {/* Nitro group */}
                <line x1={cx + 34 * Math.cos(Math.PI / 3 + Math.PI / 6)} y1={cy + 34 * Math.sin(Math.PI / 3 + Math.PI / 6)}
                    x2={cx + 60} y2={cy + 26}
                    stroke="rgba(216,90,48,0.5)" strokeWidth={1.5} />
                <circle cx={cx + 60} cy={cy + 26} r={10}
                    fill="rgba(216,90,48,0.2)" stroke="var(--coral)" strokeWidth={1.5} />
                <text x={cx + 60} y={cy + 30} textAnchor="middle"
                    style={{ fontSize: 7, fill: 'var(--coral)', fontFamily: 'var(--mono)', fontWeight: 700 }}>N⁺</text>
                <circle cx={cx + 78} cy={cy + 20} r={9}
                    fill="rgba(216,90,48,0.15)" stroke="rgba(216,90,48,0.5)" strokeWidth={1} />
                <text x={cx + 78} y={cy + 24} textAnchor="middle"
                    style={{ fontSize: 7, fill: 'var(--coral)', fontFamily: 'var(--mono)' }}>O⁻</text>

                {/* Intramolecular H-bond (dashed arc) */}
                {(() => {
                    const pulse = 0.5 + 0.35 * Math.sin(t * 1.2)
                    return (
                        <path
                            d={`M ${cx + 74} ${cy - 28} Q ${cx + 85} ${cy - 4} ${cx + 78} ${cy + 20}`}
                            fill="none"
                            stroke={col}
                            strokeWidth={1.5}
                            strokeDasharray="4 3"
                            opacity={pulse} />
                    )
                })()}
                <text x={cx + 98} y={cy - 4}
                    style={{ fontSize: 9, fill: `${col}80`, fontFamily: 'var(--mono)' }}>···</text>
                <text x={cx + 90} y={cy + 8}
                    style={{ fontSize: 8, fill: `${col}60`, fontFamily: 'var(--mono)' }}>H-bond</text>
                <text x={cx + 90} y={cy + 18}
                    style={{ fontSize: 8, fill: `${col}50`, fontFamily: 'var(--mono)' }}>intramol.</text>
            </g>
        )
    }

    return (
        <div>
            {/* System selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(SYSTEMS).map(k => (
                    <button key={k} onClick={() => setSystem(k)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: system === k ? SYSTEMS[k].color : 'var(--bg3)',
                        color: system === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${system === k ? SYSTEMS[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Type badge */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
                <span style={{
                    fontSize: 11, fontFamily: 'var(--mono)',
                    color: sys.type === 'intra' ? 'var(--gold)' : '#378ADD',
                    background: sys.type === 'intra' ? 'rgba(212,160,23,0.1)' : 'rgba(55,138,221,0.1)',
                    border: `1px solid ${sys.type === 'intra' ? 'rgba(212,160,23,0.3)' : 'rgba(55,138,221,0.3)'}`,
                    padding: '4px 12px', borderRadius: 20,
                }}>
                    {sys.type === 'intra' ? 'Intramolecular H-bond' : 'Intermolecular H-bond'}
                </span>
                <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                    {sys.donor}  ·  {sys.energy}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* Animation */}
                <div style={{ background: 'rgba(0,0,0,0.22)', border: `1px solid ${sys.color}30`, borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: sys.color, letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ H-BOND NETWORK
                    </div>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                        {sys.type === 'inter' ? (
                            <>
                                {drawHBonds()}
                                {molPositions.map((p, i) => drawMolecule(p.x, p.y, p.angle, sys.color, i))}
                            </>
                        ) : (
                            drawIntra()
                        )}

                        {/* Legend */}
                        <line x1={W - 80} y1={H - 20} x2={W - 50} y2={H - 20}
                            stroke={sys.color} strokeWidth={1.5} strokeDasharray="4 3" opacity={0.6} />
                        <text x={W - 46} y={H - 16}
                            style={{ fontSize: 8, fill: `${sys.color}80`, fontFamily: 'var(--mono)' }}>H-bond</text>
                    </svg>

                    {/* Speed control */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Speed:</span>
                        {[0.5, 1, 2].map(s => (
                            <button key={s} onClick={() => setSpeed(s)} style={{
                                padding: '3px 10px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: speed === s ? sys.color : 'var(--bg3)',
                                color: speed === s ? '#000' : 'var(--text2)',
                                border: `1px solid ${speed === s ? sys.color : 'var(--border)'}`,
                            }}>{s}×</button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ padding: '12px 14px', background: `${sys.color}10`, border: `1px solid ${sys.color}30`, borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: sys.color, letterSpacing: 1.5, marginBottom: 6 }}>
                            KEY FACTS
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                            {sys.desc}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 6 }}>
                            EFFECT ON BOILING POINT
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.7, fontWeight: 600 }}>
                            {sys.bp}
                        </div>
                    </div>

                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            H-BOND STRENGTH COMPARISON
                        </div>
                        {[
                            { sys: 'HF', label: 'F−H···F', strength: 1.0, col: '#1D9E75' },
                            { sys: 'H₂O', label: 'O−H···O', strength: 0.85, col: '#378ADD' },
                            { sys: '2-NP', label: 'O−H···O(intra)', strength: 0.75, col: '#EF9F27' },
                            { sys: 'NH₃', label: 'N−H···N', strength: 0.6, col: '#7F77DD' },
                        ].map(row => (
                            <div key={row.sys} style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.col }}>{row.label}</span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: row.col }}>{(row.strength * 29).toFixed(0)} kJ/mol</span>
                                </div>
                                <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${row.strength * 100}%`, background: row.col, borderRadius: 4 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="System" value={system.split(' ')[0]} color={sys.color} highlight />
                <ValueCard label="H-bond type" value={sys.type === 'intra' ? 'Intramolecular' : 'Intermolecular'} color={sys.type === 'intra' ? 'var(--gold)' : '#378ADD'} />
                <ValueCard label="H-bond energy" value={sys.energy} color="var(--teal)" />
                <ValueCard label="BP effect" value="Raises BP significantly" color="var(--coral)" />
            </div>
        </div>
    )
}