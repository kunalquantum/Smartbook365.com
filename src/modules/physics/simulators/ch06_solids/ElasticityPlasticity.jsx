import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280
const PAD = { l: 52, r: 20, t: 20, b: 40 }
const PW = W - PAD.l - PAD.r
const PH = H - PAD.t - PAD.b

// Stress-strain curve key points (normalised 0-1)
const REGIONS = [
    { x: 0, y: 0, label: 'O', desc: 'Origin' },
    { x: 0.18, y: 0.32, label: 'P', desc: 'Proportional limit' },
    { x: 0.24, y: 0.38, label: 'E', desc: 'Elastic limit' },
    { x: 0.30, y: 0.42, label: 'Y', desc: 'Yield point' },
    { x: 0.65, y: 0.78, label: 'U', desc: 'Ultimate stress' },
    { x: 0.85, y: 0.60, label: 'F', desc: 'Fracture point' },
]

// Build smooth SVG path through key points
function buildPath(pts, sx, sy) {
    return pts.map((p, i) => {
        const x = PAD.l + p.x * PW
        const y = PAD.t + PH - p.y * PH
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')
}

const MATERIALS = {
    Steel: { color: '#378ADD', fracture: 0.85, ultimate: 0.65 },
    Rubber: { color: '#1D9E75', fracture: 0.95, ultimate: 0.90 },
    Concrete: { color: '#888780', fracture: 0.30, ultimate: 0.26 },
    Copper: { color: '#EF9F27', fracture: 0.80, ultimate: 0.60 },
}

export default function ElasticityPlasticity() {
    const [strain, setStrain] = useState(0.15)
    const [material, setMaterial] = useState('Steel')

    const mat = MATERIALS[material]

    // Current point on curve
    const getCurrentY = (x) => {
        for (let i = 1; i < REGIONS.length; i++) {
            const p0 = REGIONS[i - 1], p1 = REGIONS[i]
            if (x <= p1.x) {
                const t = (x - p0.x) / (p1.x - p0.x)
                return p0.y + t * (p1.y - p0.y)
            }
        }
        return REGIONS[REGIONS.length - 1].y
    }

    const curY = getCurrentY(strain)
    const isBroken = strain >= mat.fracture
    const isPlastic = strain > 0.24 && !isBroken
    const isElastic = strain <= 0.24

    const cpX = PAD.l + strain * PW
    const cpY = PAD.t + PH - curY * PH

    const zone = isBroken ? 'fracture'
        : strain > 0.30 ? 'plastic (necking)'
            : strain > 0.24 ? 'plastic (yield)'
                : strain > 0.18 ? 'elastic (non-linear)'
                    : 'elastic (linear — Hooke\'s law)'

    const zoneColor = isBroken ? '#D85A30'
        : isPlastic ? '#EF9F27'
            : '#1D9E75'

    const pathD = buildPath(REGIONS, PAD.l, PAD.t)

    return (
        <div>
            {/* Material selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MATERIALS).map(m => (
                    <button key={m} onClick={() => setMaterial(m)} style={{
                        padding: '4px 14px', borderRadius: 20, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: material === m ? MATERIALS[m].color : 'var(--bg3)',
                        color: material === m ? '#000' : 'var(--text2)',
                        border: `1px solid ${material === m ? MATERIALS[m].color : 'var(--border)'}`,
                    }}>{m}</button>
                ))}
            </div>

            <SimSlider
                label="Applied strain →"
                unit=""
                value={strain}
                min={0} max={0.95} step={0.01}
                onChange={setStrain}
            />

            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>

                {/* Region fills */}
                {/* Elastic region */}
                <rect x={PAD.l} y={PAD.t} width={0.24 * PW} height={PH}
                    fill="rgba(29,158,117,0.04)" />
                {/* Plastic region */}
                <rect x={PAD.l + 0.24 * PW} y={PAD.t}
                    width={(mat.fracture - 0.24) * PW} height={PH}
                    fill="rgba(239,159,39,0.04)" />

                {/* Region labels */}
                <text x={PAD.l + 0.10 * PW} y={PAD.t + 14}
                    style={{ fontSize: 9, fill: 'rgba(29,158,117,0.5)', fontFamily: 'var(--mono)' }}>
                    ELASTIC
                </text>
                <text x={PAD.l + 0.45 * PW} y={PAD.t + 14}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>
                    PLASTIC
                </text>

                {/* Curve */}
                <path d={pathD} fill="none"
                    stroke={mat.color} strokeWidth={2.5}
                    strokeLinecap="round" strokeLinejoin="round" />

                {/* Key point markers */}
                {REGIONS.slice(1).map(p => {
                    const px = PAD.l + p.x * PW
                    const py = PAD.t + PH - p.y * PH
                    return (
                        <g key={p.label}>
                            <circle cx={px} cy={py} r={3.5}
                                fill={mat.color} opacity={0.8} />
                            <text x={px + 5} y={py - 5}
                                style={{ fontSize: 9, fill: mat.color, fontFamily: 'var(--mono)', opacity: 0.8 }}>
                                {p.label}
                            </text>
                        </g>
                    )
                })}

                {/* Elastic limit vertical */}
                <line x1={PAD.l + 0.24 * PW} y1={PAD.t}
                    x2={PAD.l + 0.24 * PW} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.12)" strokeWidth={1} strokeDasharray="4 3" />

                {/* Fracture vertical */}
                <line x1={PAD.l + mat.fracture * PW} y1={PAD.t}
                    x2={PAD.l + mat.fracture * PW} y2={PAD.t + PH}
                    stroke="rgba(216,90,48,0.25)" strokeWidth={1} strokeDasharray="4 3" />

                {/* Current position */}
                {!isBroken && (
                    <circle cx={cpX} cy={cpY} r={7}
                        fill="#EF9F27" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                )}

                {/* Broken indicator */}
                {isBroken && (
                    <g>
                        <line x1={cpX - 12} y1={PAD.t + PH - 0.60 * PH}
                            x2={cpX - 4} y2={PAD.t + PH - 0.52 * PH}
                            stroke="#D85A30" strokeWidth={2} />
                        <line x1={cpX + 4} y1={PAD.t + PH - 0.68 * PH}
                            x2={cpX + 12} y2={PAD.t + PH - 0.60 * PH}
                            stroke="#D85A30" strokeWidth={2} />
                        <text x={cpX} y={PAD.t + PH - 0.70 * PH} textAnchor="middle"
                            style={{ fontSize: 11, fill: '#D85A30', fontFamily: 'var(--mono)' }}>✕ SNAP</text>
                    </g>
                )}

                {/* Axes */}
                <line x1={PAD.l} y1={PAD.t + PH} x2={W - PAD.r} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                    stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                <text x={W - PAD.r} y={PAD.t + PH + 16}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Strain →</text>
                <text x={PAD.l - 8} y={PAD.t + PH / 2} textAnchor="middle"
                    transform={`rotate(-90,${PAD.l - 8},${PAD.t + PH / 2})`}
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Stress →</text>
            </svg>

            {/* Zone badge */}
            <div style={{
                display: 'inline-block', padding: '6px 14px',
                borderRadius: 8, marginBottom: 14,
                background: zoneColor + '18',
                border: `1px solid ${zoneColor}44`,
                fontSize: 12, fontFamily: 'var(--mono)', color: zoneColor,
            }}>
                {isBroken ? '✕ Material fractured' : `Zone: ${zone}`}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Current strain', val: strain.toFixed(3), color: 'var(--amber)' },
                    { label: 'Stress (norm.)', val: isBroken ? '—' : curY.toFixed(3), color: mat.color },
                    { label: 'Behaviour', val: isBroken ? 'Fractured' : isPlastic ? 'Plastic' : 'Elastic', color: zoneColor },
                    { label: 'Fracture at', val: mat.fracture.toFixed(2), color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}