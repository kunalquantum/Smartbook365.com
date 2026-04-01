import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const MAT = {
    'Copper (conductor)': { Eg: 0, fermi: 0.5, type: 'conductor', color: '#EF9F27' },
    'Silicon': { Eg: 1.1, fermi: 0.5, type: 'semi', color: '#1D9E75' },
    'Germanium': { Eg: 0.7, fermi: 0.5, type: 'semi', color: '#7F77DD' },
    'GaAs': { Eg: 1.4, fermi: 0.5, type: 'semi', color: '#D85A30' },
    'Diamond (insulator)': { Eg: 5.5, fermi: 0.5, type: 'insulator', color: '#888780' },
    'SiO₂ (insulator)': { Eg: 9.0, fermi: 0.5, type: 'insulator', color: '#888780' },
}

export default function EnergyBands() {
    const [mat, setMat] = useState('Silicon')
    const [temp, setTemp] = useState(300)    // K
    const [custom, setCustom] = useState(false)
    const [Eg, setEg] = useState(1.1)

    const m = MAT[mat]
    const EgVal = custom ? Eg : m.Eg
    const kT = 8.617e-5 * temp   // eV

    // Intrinsic carrier conc (relative, normalised)
    const ni_rel = EgVal < 0.01 ? 1 : Math.exp(-EgVal / (2 * kT))
    const ni_log = EgVal < 0.01 ? 1 : Math.max(0, 1 + Math.log10(ni_rel) / 20)

    // Classification
    const matType = EgVal < 0.1 ? 'conductor' : EgVal < 3 ? 'semiconductor' : 'insulator'
    const typeColor = matType === 'conductor' ? '#EF9F27' : matType === 'semiconductor' ? '#1D9E75' : '#888780'

    // SVG band diagram layout
    const CX = W / 2
    const BAND_W = 320
    const BAND_X = (W - BAND_W) / 2
    const VB_TOP = H - 60       // valence band top y
    const VB_H = 50
    const GAP_PX = Math.min(120, EgVal * 30)  // band gap in px
    const CB_BOT = VB_TOP - GAP_PX             // conduction band bottom y
    const CB_H = 50
    const FERMI_Y = VB_TOP - GAP_PX / 2         // Fermi level (mid-gap for intrinsic)

    // Electron fill in conduction band (thermal excitation)
    const nElec = Math.round(ni_log * 8)
    const nHole = nElec

    return (
        <div>
            {/* Material selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MAT).map(k => (
                    <button key={k} onClick={() => { setMat(k); setCustom(false); setEg(MAT[k].Eg) }} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mat === k && !custom ? MAT[k].color : 'var(--bg3)',
                        color: mat === k && !custom ? '#000' : 'var(--text2)',
                        border: `1px solid ${mat === k && !custom ? MAT[k].color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
                <button onClick={() => setCustom(true)} style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 10,
                    fontFamily: 'var(--mono)', cursor: 'pointer',
                    background: custom ? '#378ADD' : 'var(--bg3)',
                    color: custom ? '#000' : 'var(--text2)',
                    border: `1px solid ${custom ? '#378ADD' : 'var(--border)'}`,
                }}>Custom</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Temperature T" unit=" K" value={temp} min={50} max={600} step={10} onChange={setTemp} />
                {custom && <SimSlider label="Band gap E_g" unit=" eV" value={Eg} min={0} max={10} step={0.1} onChange={setEg} />}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* === Conduction Band === */}
                {EgVal > 0.05 ? (
                    <g>
                        {/* CB fill — partially occupied */}
                        <rect x={BAND_X} y={CB_BOT - CB_H} width={BAND_W} height={CB_H}
                            rx={4}
                            fill={`rgba(216,90,48,0.12)`}
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1.5} />
                        <text x={BAND_X - 8} y={CB_BOT - CB_H / 2 + 4} textAnchor="end"
                            style={{ fontSize: 10, fill: 'rgba(216,90,48,0.7)', fontFamily: 'var(--mono)' }}>CB</text>
                        {/* E_c label */}
                        <text x={BAND_X + BAND_W + 8} y={CB_BOT + 4}
                            style={{ fontSize: 9, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>E_c</text>

                        {/* Excited electrons in CB */}
                        {Array.from({ length: nElec }, (_, i) => {
                            const ex = BAND_X + 20 + (i % 8) * (BAND_W - 40) / 8
                            const ey = CB_BOT - 12 - Math.floor(i / 8) * 16
                            return (
                                <g key={i}>
                                    <circle cx={ex} cy={ey} r={5}
                                        fill="rgba(216,90,48,0.8)"
                                        stroke="rgba(216,90,48,0.4)" strokeWidth={0.5} />
                                    <text x={ex} y={ey + 3.5} textAnchor="middle"
                                        style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)', pointerEvents: 'none' }}>−</text>
                                </g>
                            )
                        })}
                    </g>
                ) : (
                    /* Conductor: overlapping bands */
                    <g>
                        <rect x={BAND_X} y={VB_TOP - 30} width={BAND_W} height={80}
                            rx={4}
                            fill="rgba(239,159,39,0.15)"
                            stroke="rgba(239,159,39,0.5)" strokeWidth={1.5} />
                        <text x={CX} y={VB_TOP + 20} textAnchor="middle"
                            style={{ fontSize: 11, fill: 'rgba(239,159,39,0.8)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            Overlapping bands — free electrons everywhere
                        </text>
                    </g>
                )}

                {/* === Band Gap === */}
                {EgVal > 0.05 && GAP_PX > 4 && (
                    <g>
                        {/* Gap fill */}
                        <rect x={BAND_X} y={CB_BOT} width={BAND_W} height={GAP_PX}
                            rx={0}
                            fill="rgba(0,0,0,0.2)" />
                        {/* E_g label */}
                        <line x1={BAND_X - 20} y1={CB_BOT} x2={BAND_X - 20} y2={VB_TOP}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} />
                        <line x1={BAND_X - 25} y1={CB_BOT} x2={BAND_X - 15} y2={CB_BOT}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} />
                        <line x1={BAND_X - 25} y1={VB_TOP} x2={BAND_X - 15} y2={VB_TOP}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} />
                        <text x={BAND_X - 28} y={(CB_BOT + VB_TOP) / 2 + 4} textAnchor="end"
                            style={{ fontSize: 10, fill: typeColor, fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            E_g={EgVal}eV
                        </text>

                        {/* Fermi level */}
                        <line x1={BAND_X} y1={FERMI_Y} x2={BAND_X + BAND_W} y2={FERMI_Y}
                            stroke="rgba(239,159,39,0.5)" strokeWidth={1.5} strokeDasharray="6 4" />
                        <text x={BAND_X + BAND_W + 8} y={FERMI_Y + 4}
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.7)', fontFamily: 'var(--mono)' }}>E_F</text>

                        {/* Thermal excitation arrows */}
                        {nElec > 0 && Array.from({ length: Math.min(nElec, 3) }, (_, i) => {
                            const ax = BAND_X + 60 + i * 80
                            return (
                                <g key={i}>
                                    <defs>
                                        <marker id={`exc${i}`} viewBox="0 0 10 10" refX={8} refY={5}
                                            markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                                            <path d="M2 1L8 5L2 9" fill="none" stroke="rgba(239,159,39,0.5)"
                                                strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                                        </marker>
                                    </defs>
                                    <line x1={ax} y1={VB_TOP - 4} x2={ax} y2={CB_BOT + 4}
                                        stroke="rgba(239,159,39,0.4)" strokeWidth={1}
                                        markerEnd={`url(#exc${i})`} strokeDasharray="3 2" />
                                </g>
                            )
                        })}
                    </g>
                )}

                {/* === Valence Band === */}
                {EgVal > 0.05 && (
                    <g>
                        <rect x={BAND_X} y={VB_TOP} width={BAND_W} height={VB_H}
                            rx={4}
                            fill="rgba(55,138,221,0.2)"
                            stroke="rgba(55,138,221,0.5)" strokeWidth={1.5} />
                        <text x={BAND_X - 8} y={VB_TOP + VB_H / 2 + 4} textAnchor="end"
                            style={{ fontSize: 10, fill: 'rgba(55,138,221,0.7)', fontFamily: 'var(--mono)' }}>VB</text>
                        <text x={BAND_X + BAND_W + 8} y={VB_TOP + 4}
                            style={{ fontSize: 9, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>E_v</text>

                        {/* Holes in VB */}
                        {Array.from({ length: nHole }, (_, i) => {
                            const hx = BAND_X + 20 + (i % 8) * (BAND_W - 40) / 8
                            const hy = VB_TOP + 12 + Math.floor(i / 8) * 16
                            return (
                                <g key={i}>
                                    <circle cx={hx} cy={hy} r={5}
                                        fill="none"
                                        stroke="rgba(55,138,221,0.7)" strokeWidth={1.5} />
                                    <text x={hx} y={hy + 3.5} textAnchor="middle"
                                        style={{ fontSize: 8, fill: 'rgba(55,138,221,0.8)', fontFamily: 'var(--mono)' }}>+</text>
                                </g>
                            )
                        })}
                    </g>
                )}

                {/* Classification badge */}
                <text x={CX} y={24} textAnchor="middle"
                    style={{ fontSize: 13, fill: typeColor, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    {matType.toUpperCase()}  —  E_g = {EgVal} eV  —  T = {temp} K
                </text>

                {/* ni indicator */}
                <text x={CX} y={44} textAnchor="middle"
                    style={{ fontSize: 10, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                    {matType === 'conductor' ? 'n ~ 10²⁸ m⁻³ (always conducting)'
                        : matType === 'semiconductor' ? `nᵢ ∝ e^(−Eg/2kT) at ${temp}K`
                            : 'Essentially zero carriers at room temperature'}
                </text>

                {/* kT arrow */}
                {EgVal > 0 && (
                    <text x={BAND_X + BAND_W - 4} y={FERMI_Y - 6} textAnchor="end"
                        style={{ fontSize: 9, fill: 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                        kT = {(kT * 1000).toFixed(1)} meV
                    </text>
                )}
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Band gap E_g', val: `${EgVal} eV`, color: typeColor },
                    { label: 'Classification', val: matType, color: typeColor },
                    { label: 'kT at T', val: `${(kT * 1000).toFixed(2)} meV`, color: 'var(--amber)' },
                    { label: 'E_g / kT ratio', val: EgVal < 0.01 ? '0 (metal)' : ((EgVal / kT).toFixed(1)), color: 'var(--text2)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}