import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const MATERIALS = {
    Steel: { Y: 200, K: 160, G: 80, color: '#378ADD', poisson: 0.30 },
    Aluminum: { Y: 70, K: 76, G: 26, color: '#1D9E75', poisson: 0.33 },
    Copper: { Y: 120, K: 140, G: 44, color: '#EF9F27', poisson: 0.34 },
    Glass: { Y: 70, K: 37, G: 28, color: '#7F77DD', poisson: 0.22 },
    Rubber: { Y: 0.05, K: 1.5, G: 0.003, color: '#1D9E75', poisson: 0.50 },
    Bone: { Y: 18, K: 17, G: 3.5, color: '#F5C4B3', poisson: 0.30 },
}

const MODULI = [
    { key: 'Y', label: "Young's Modulus", unit: 'GPa', desc: 'Resistance to stretching/compression', formula: 'Y = σ/ε = FL/AΔL' },
    { key: 'K', label: 'Bulk Modulus', unit: 'GPa', desc: 'Resistance to uniform compression', formula: 'K = −VΔP/ΔV' },
    { key: 'G', label: 'Shear Modulus', unit: 'GPa', desc: 'Resistance to shape change', formula: 'G = τ/γ = FL/AΔx' },
]

const W = 440, H = 200
const BAR_Y = 60, BAR_H = 32, BAR_GAP = 16

export default function ElasticModuli() {
    const [mat1, setMat1] = useState('Steel')
    const [mat2, setMat2] = useState('Copper')
    const [active, setActive] = useState('Y')

    const m1 = MATERIALS[mat1]
    const m2 = MATERIALS[mat2]
    const maxVal = Math.max(...Object.values(MATERIALS).map(m => m[active]))

    const barWidth = (val) => Math.max(4, (val / maxVal) * (W - 120))

    return (
        <div>
            {/* Modulus selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {MODULI.map(mod => (
                    <button key={mod.key} onClick={() => setActive(mod.key)} style={{
                        padding: '5px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: active === mod.key ? 'var(--amber)' : 'var(--bg3)',
                        color: active === mod.key ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{mod.label}</button>
                ))}
            </div>

            {/* Active modulus info */}
            {(() => {
                const mod = MODULI.find(m => m.key === active)
                return (
                    <div style={{
                        background: 'var(--bg3)', border: '1px solid var(--border2)',
                        borderRadius: 8, padding: '10px 16px', marginBottom: 16,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 8,
                    }}>
                        <div>
                            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>{mod.desc}</div>
                        </div>
                        <div style={{
                            fontFamily: 'var(--mono)', fontSize: 13,
                            color: 'var(--amber2)',
                            background: 'rgba(239,159,39,0.1)', padding: '4px 12px', borderRadius: 6,
                        }}>{mod.formula}</div>
                    </div>
                )
            })()}

            {/* Material selectors */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                {[{ label: 'Material A', val: mat1, set: setMat1, color: m1.color },
                { label: 'Material B', val: mat2, set: setMat2, color: m2.color }].map(({ label, val, set, color }) => (
                    <div key={label}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 6 }}>{label}</div>
                        <select value={val} onChange={e => set(e.target.value)} style={{
                            width: '100%',
                            background: 'var(--bg3)', border: `1px solid ${color}44`,
                            color: color, borderRadius: 6, padding: '6px 10px',
                            fontFamily: 'var(--mono)', fontSize: 13, cursor: 'pointer',
                        }}>
                            {Object.keys(MATERIALS).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                    </div>
                ))}
            </div>

            {/* All-material comparison bars */}
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 12 }}>
                {Object.entries(MATERIALS).map(([name, props], i) => {
                    const bw = barWidth(props[active])
                    const y = 12 + i * 28
                    const isSelected = name === mat1 || name === mat2
                    return (
                        <g key={name}>
                            <text x={78} y={y + 11} textAnchor="end"
                                style={{
                                    fontSize: 11, fontFamily: 'var(--mono)',
                                    fill: isSelected ? props.color : 'rgba(160,176,200,0.4)',
                                    fontWeight: isSelected ? 600 : 400,
                                }}>
                                {name}
                            </text>
                            <rect x={82} y={y} width={bw} height={20} rx={3}
                                fill={props.color}
                                opacity={isSelected ? 0.85 : 0.2} />
                            <text x={82 + bw + 6} y={y + 13}
                                style={{
                                    fontSize: 10, fontFamily: 'var(--mono)',
                                    fill: isSelected ? props.color : 'rgba(160,176,200,0.3)',
                                }}>
                                {props[active]} GPa
                            </text>
                        </g>
                    )
                })}
            </svg>

            {/* Comparison cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[{ name: mat1, mat: m1 }, { name: mat2, mat: m2 }].map(({ name, mat }) => (
                    <div key={name} style={{
                        background: 'var(--bg3)', borderRadius: 10,
                        padding: '14px 16px',
                        border: `1px solid ${mat.color}33`,
                    }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: mat.color, fontFamily: 'var(--mono)', marginBottom: 10 }}>
                            {name}
                        </div>
                        {MODULI.map(mod => (
                            <div key={mod.key} style={{
                                display: 'flex', justifyContent: 'space-between',
                                marginBottom: 6, fontSize: 12, fontFamily: 'var(--mono)',
                            }}>
                                <span style={{ color: 'var(--text3)' }}>{mod.label}</span>
                                <span style={{ color: active === mod.key ? mat.color : 'var(--text2)' }}>
                                    {mat[mod.key]} GPa
                                </span>
                            </div>
                        ))}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            marginTop: 8, paddingTop: 8,
                            borderTop: '1px solid var(--border)',
                            fontSize: 12, fontFamily: 'var(--mono)',
                        }}>
                            <span style={{ color: 'var(--text3)' }}>Poisson's ratio σ</span>
                            <span style={{ color: 'var(--text2)' }}>{mat.poisson}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}