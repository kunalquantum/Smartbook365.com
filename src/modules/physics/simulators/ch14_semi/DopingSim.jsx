import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 280

export default function DopingSim() {
    const [type, setType] = useState('intrinsic')  // intrinsic | ntype | ptype
    const [doping, setDoping] = useState(1e15)          // cm⁻³
    const [temp, setTemp] = useState(300)           // K

    // Intrinsic carrier concentration for Si
    const kT = 8.617e-5 * temp
    const ni = 1.5e10 * Math.exp((temp - 300) / 100)   // simplified ni(T)

    // Carrier concentrations
    let n = ni, p = ni
    const ND = type === 'ntype' ? doping : 0
    const NA = type === 'ptype' ? doping : 0
    if (type === 'ntype') {
        n = ND / 2 + Math.sqrt((ND / 2) ** 2 + ni ** 2)
        p = ni ** 2 / n
    } else if (type === 'ptype') {
        p = NA / 2 + Math.sqrt((NA / 2) ** 2 + ni ** 2)
        n = ni ** 2 / p
    }

    // Fermi level position (relative to mid-gap, in eV)
    const Eg = 1.1
    const EF_intrinsic = 0
    const EF_shift = type === 'intrinsic' ? 0
        : type === 'ntype' ? kT * Math.log(n / ni)
            : -kT * Math.log(p / ni)
    const EF_pos = 0.5 + EF_shift / Eg   // 0=valence, 1=conduction

    // Conductivity (relative)
    const mu_e = 1350, mu_h = 480   // cm²/Vs
    const sigma_rel = (n * mu_e + p * mu_h) / (ni * (mu_e + mu_h))

    // Colors
    const typeColor = type === 'ntype' ? '#D85A30' : type === 'ptype' ? '#378ADD' : '#1D9E75'

    // Band diagram heights
    const BD_X = 20, BD_W = 200, BD_Y = 40
    const VB_Y = H - 60, CB_Y = 80
    const BAND_H = 30
    const GAP_H = VB_Y - CB_Y - BAND_H

    // Fermi level y
    const EF_Y = VB_Y - EF_pos * GAP_H

    // Atom grid (right side)
    const GRID_X = 240, GRID_Y = 40
    const GRID_W = W - GRID_X - 20, GRID_H = H - 80
    const COLS = 7, ROWS = 5
    const cellW = GRID_W / COLS, cellH = GRID_H / ROWS

    const nDopantAtoms = Math.min(6, Math.round(Math.log10(doping / 1e12) * 2))

    const dopantPositions = [
        [1, 1], [3, 2], [5, 3], [2, 4], [4, 1], [6, 2]
    ].slice(0, nDopantAtoms)

    return (
        <div>
            {/* Type selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'intrinsic', l: 'Intrinsic Si', c: '#1D9E75' },
                    { k: 'ntype', l: 'n-type (donor)', c: '#D85A30' },
                    { k: 'ptype', l: 'p-type (acceptor)', c: '#378ADD' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setType(opt.k)} style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: type === opt.k ? opt.c : 'var(--bg3)',
                        color: type === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${type === opt.k ? opt.c : 'var(--border)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                {type !== 'intrinsic' && (
                    <SimSlider label={`${type === 'ntype' ? 'N_D' : 'N_A'} doping`}
                        unit=" ×10¹⁵cm⁻³"
                        value={doping / 1e15} min={0.01} max={100} step={0.5}
                        onChange={v => setDoping(v * 1e15)} />
                )}
                <SimSlider label="Temperature" unit=" K" value={temp} min={200} max={500} step={10} onChange={setTemp} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                {/* === Band diagram (left) === */}
                {/* Conduction band */}
                <rect x={BD_X} y={CB_Y} width={BD_W} height={BAND_H}
                    rx={4} fill="rgba(216,90,48,0.15)"
                    stroke="rgba(216,90,48,0.4)" strokeWidth={1} />
                <text x={BD_X - 4} y={CB_Y + BAND_H / 2 + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>CB</text>

                {/* Gap */}
                <rect x={BD_X} y={CB_Y + BAND_H} width={BD_W} height={GAP_H}
                    rx={0} fill="rgba(0,0,0,0.2)" />

                {/* Valence band */}
                <rect x={BD_X} y={VB_Y} width={BD_W} height={BAND_H}
                    rx={4} fill="rgba(55,138,221,0.15)"
                    stroke="rgba(55,138,221,0.4)" strokeWidth={1} />
                <text x={BD_X - 4} y={VB_Y + BAND_H / 2 + 4} textAnchor="end"
                    style={{ fontSize: 9, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>VB</text>

                {/* Donor/acceptor levels */}
                {type === 'ntype' && (
                    <g>
                        <line x1={BD_X + 10} y1={CB_Y + BAND_H + 8}
                            x2={BD_X + BD_W - 10} y2={CB_Y + BAND_H + 8}
                            stroke="rgba(216,90,48,0.4)" strokeWidth={1} strokeDasharray="6 4" />
                        <text x={BD_X + BD_W + 4} y={CB_Y + BAND_H + 12}
                            style={{ fontSize: 9, fill: 'rgba(216,90,48,0.5)', fontFamily: 'var(--mono)' }}>E_D</text>
                    </g>
                )}
                {type === 'ptype' && (
                    <g>
                        <line x1={BD_X + 10} y1={VB_Y - 8}
                            x2={BD_X + BD_W - 10} y2={VB_Y - 8}
                            stroke="rgba(55,138,221,0.4)" strokeWidth={1} strokeDasharray="6 4" />
                        <text x={BD_X + BD_W + 4} y={VB_Y - 4}
                            style={{ fontSize: 9, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>E_A</text>
                    </g>
                )}

                {/* Fermi level */}
                <line x1={BD_X} y1={EF_Y} x2={BD_X + BD_W} y2={EF_Y}
                    stroke="rgba(239,159,39,0.7)" strokeWidth={2} strokeDasharray="5 3" />
                <text x={BD_X + BD_W + 4} y={EF_Y + 4}
                    style={{ fontSize: 9, fill: 'rgba(239,159,39,0.8)', fontFamily: 'var(--mono)', fontWeight: 600 }}>E_F</text>

                {/* Intrinsic Fermi level (mid-gap reference) */}
                {type !== 'intrinsic' && (
                    <line x1={BD_X + 20} y1={(CB_Y + BAND_H + VB_Y) / 2}
                        x2={BD_X + BD_W - 20} y2={(CB_Y + BAND_H + VB_Y) / 2}
                        stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} strokeDasharray="2 3" />
                )}

                {/* EF shift arrow */}
                {type !== 'intrinsic' && Math.abs(EF_shift) > 0.01 && (
                    <g>
                        <defs>
                            <marker id="ef_arr" viewBox="0 0 10 10" refX={8} refY={5}
                                markerWidth={4} markerHeight={4} orient="auto-start-reverse">
                                <path d="M2 1L8 5L2 9" fill="none" stroke={typeColor}
                                    strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                            </marker>
                        </defs>
                        <line
                            x1={BD_X + BD_W / 2}
                            y1={(CB_Y + BAND_H + VB_Y) / 2}
                            x2={BD_X + BD_W / 2}
                            y2={EF_Y}
                            stroke={typeColor} strokeWidth={1.5}
                            markerEnd="url(#ef_arr)" />
                        <text x={BD_X + BD_W / 2 + 6}
                            y={((CB_Y + BAND_H + VB_Y) / 2 + EF_Y) / 2 + 4}
                            style={{ fontSize: 9, fill: typeColor, fontFamily: 'var(--mono)' }}>
                            {EF_shift > 0 ? '+' : ''}{(EF_shift * 1000).toFixed(0)}meV
                        </text>
                    </g>
                )}

                {/* === Atom grid (right) === */}
                {Array.from({ length: ROWS }, (_, row) =>
                    Array.from({ length: COLS }, (_, col) => {
                        const isDopant = dopantPositions.some(([dc, dr]) => dc === col && dr === row)
                        const cx = GRID_X + (col + 0.5) * cellW
                        const cy = GRID_Y + (row + 0.5) * cellH
                        return (
                            <g key={`${row}_${col}`}>
                                {/* Bonds */}
                                {col < COLS - 1 && (
                                    <line x1={cx} y1={cy}
                                        x2={GRID_X + (col + 1.5) * cellW} y2={cy}
                                        stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} />
                                )}
                                {row < ROWS - 1 && (
                                    <line x1={cx} y1={cy}
                                        x2={cx} y2={GRID_Y + (row + 1.5) * cellH}
                                        stroke="rgba(255,255,255,0.1)" strokeWidth={0.8} />
                                )}
                                {/* Atom */}
                                <circle cx={cx} cy={cy} r={isDopant ? 9 : 7}
                                    fill={isDopant
                                        ? (type === 'ntype' ? 'rgba(216,90,48,0.35)' : 'rgba(55,138,221,0.35)')
                                        : 'rgba(29,158,117,0.2)'}
                                    stroke={isDopant
                                        ? (type === 'ntype' ? '#D85A30' : '#378ADD')
                                        : 'rgba(29,158,117,0.4)'}
                                    strokeWidth={isDopant ? 2 : 1} />
                                <text x={cx} y={cy + 4} textAnchor="middle"
                                    style={{
                                        fontSize: 8,
                                        fill: isDopant ? (type === 'ntype' ? '#D85A30' : '#378ADD') : 'rgba(29,158,117,0.8)',
                                        fontFamily: 'var(--mono)',
                                    }}>
                                    {isDopant ? (type === 'ntype' ? 'P' : 'B') : 'Si'}
                                </text>

                                {/* Extra electron for n-type dopant */}
                                {isDopant && type === 'ntype' && (
                                    <g>
                                        <circle cx={cx + 12} cy={cy - 12} r={4}
                                            fill="rgba(216,90,48,0.8)" />
                                        <text x={cx + 12} y={cy - 9} textAnchor="middle"
                                            style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>−</text>
                                    </g>
                                )}
                                {/* Hole for p-type dopant */}
                                {isDopant && type === 'ptype' && (
                                    <circle cx={cx + 12} cy={cy - 12} r={4}
                                        fill="none" stroke="rgba(55,138,221,0.8)" strokeWidth={1.5} />
                                )}
                            </g>
                        )
                    })
                )}

                {/* Grid label */}
                <text x={GRID_X + GRID_W / 2} y={GRID_Y + GRID_H + 18} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                    Silicon lattice — {type === 'ntype' ? 'P (donor)' : type === 'ptype' ? 'B (acceptor)' : 'pure Si'} atoms shown
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Electrons n', val: n > 1e15 ? `${(n / 1e15).toFixed(2)}×10¹⁵` : `${(n / 1e10).toFixed(2)}×10¹⁰ /cm³`, color: 'var(--coral)' },
                    { label: 'Holes p', val: p > 1e15 ? `${(p / 1e15).toFixed(2)}×10¹⁵` : `${(p / 1e10).toFixed(2)}×10¹⁰ /cm³`, color: 'var(--teal)' },
                    { label: 'n × p = nᵢ²', val: `${(n * p).toExponential(2)}`, color: 'var(--amber)' },
                    { label: 'Conductivity ratio', val: `${sigma_rel.toFixed(1)}× intrinsic`, color: typeColor },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}