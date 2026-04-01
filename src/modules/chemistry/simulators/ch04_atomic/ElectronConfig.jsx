import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

// Aufbau order: (n+l) rule, then lower n first
const SUBSHELLS = [
    { n: 1, l: 0, sub: '1s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 2, l: 0, sub: '2s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 2, l: 1, sub: '2p', cap: 6, color: '#1D9E75', block: 'p' },
    { n: 3, l: 0, sub: '3s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 3, l: 1, sub: '3p', cap: 6, color: '#1D9E75', block: 'p' },
    { n: 4, l: 0, sub: '4s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 3, l: 2, sub: '3d', cap: 10, color: '#378ADD', block: 'd' },
    { n: 4, l: 1, sub: '4p', cap: 6, color: '#1D9E75', block: 'p' },
    { n: 5, l: 0, sub: '5s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 4, l: 2, sub: '4d', cap: 10, color: '#378ADD', block: 'd' },
    { n: 5, l: 1, sub: '5p', cap: 6, color: '#1D9E75', block: 'p' },
    { n: 6, l: 0, sub: '6s', cap: 2, color: '#EF9F27', block: 's' },
    { n: 4, l: 3, sub: '4f', cap: 14, color: '#D85A30', block: 'f' },
    { n: 5, l: 2, sub: '5d', cap: 10, color: '#378ADD', block: 'd' },
    { n: 6, l: 1, sub: '6p', cap: 6, color: '#1D9E75', block: 'p' },
]

const ELEMENTS = [
    { Z: 1, sym: 'H', name: 'Hydrogen', exceptions: false },
    { Z: 2, sym: 'He', name: 'Helium', exceptions: false },
    { Z: 3, sym: 'Li', name: 'Lithium', exceptions: false },
    { Z: 4, sym: 'Be', name: 'Beryllium', exceptions: false },
    { Z: 5, sym: 'B', name: 'Boron', exceptions: false },
    { Z: 6, sym: 'C', name: 'Carbon', exceptions: false },
    { Z: 7, sym: 'N', name: 'Nitrogen', exceptions: false },
    { Z: 8, sym: 'O', name: 'Oxygen', exceptions: false },
    { Z: 9, sym: 'F', name: 'Fluorine', exceptions: false },
    { Z: 10, sym: 'Ne', name: 'Neon', exceptions: false },
    { Z: 11, sym: 'Na', name: 'Sodium', exceptions: false },
    { Z: 12, sym: 'Mg', name: 'Magnesium', exceptions: false },
    { Z: 13, sym: 'Al', name: 'Aluminium', exceptions: false },
    { Z: 14, sym: 'Si', name: 'Silicon', exceptions: false },
    { Z: 15, sym: 'P', name: 'Phosphorus', exceptions: false },
    { Z: 16, sym: 'S', name: 'Sulfur', exceptions: false },
    { Z: 17, sym: 'Cl', name: 'Chlorine', exceptions: false },
    { Z: 18, sym: 'Ar', name: 'Argon', exceptions: false },
    { Z: 19, sym: 'K', name: 'Potassium', exceptions: false },
    { Z: 20, sym: 'Ca', name: 'Calcium', exceptions: false },
    { Z: 24, sym: 'Cr', name: 'Chromium', exceptions: true, note: '[Ar] 3d⁵4s¹ (half-filled 3d is extra stable)' },
    { Z: 29, sym: 'Cu', name: 'Copper', exceptions: true, note: '[Ar] 3d¹⁰4s¹ (fully-filled 3d is extra stable)' },
]

function buildConfig(Z) {
    let remaining = Z
    const filled = []
    for (const sh of SUBSHELLS) {
        if (remaining <= 0) break
        const n = Math.min(remaining, sh.cap)
        filled.push({ ...sh, electrons: n })
        remaining -= n
    }
    return filled
}

function formatConfig(config) {
    return config.map(sh => {
        const sup = sh.electrons.toString()
        return `${sh.sub}${sup}`
    }).join(' ')
}

// Hund's rule: how electrons fill within a subshell
function huntBoxes(total, cap, color) {
    const nOrbitals = cap / 2
    const boxes = []
    // Fill each orbital with 1 electron first (Hund), then pair
    for (let i = 0; i < nOrbitals; i++) {
        const up = i < total ? 1 : 0
        const down = i < total - nOrbitals ? 1 : 0
        boxes.push({ up, down })
    }
    return boxes
}

export default function ElectronConfig() {
    const [Z, setZ] = useState(6)   // carbon default
    const [rule, setRule] = useState('aufbau')   // aufbau | pauli | hund
    const [showAll, setShowAll] = useState(false)

    const element = ELEMENTS.find(e => e.Z === Z) || ELEMENTS.find(e => e.Z === 6)

    // Config — use exception if available
    let config
    if (element.exceptions && rule === 'aufbau') {
        // Show the exceptional config
        config = buildConfig(Z)  // simplified — full exception data would need override
    } else {
        config = buildConfig(Z)
    }

    const configStr = formatConfig(config)
    const valenceShell = config[config.length - 1]
    const valenceE = config.filter(sh => sh.n === Math.max(...config.map(s => s.n)))
        .reduce((s, sh) => s + sh.electrons, 0)

    // Noble gas abbreviation
    const nobleGases = { 2: '[He]', 10: '[Ne]', 18: '[Ar]', 36: '[Kr]' }
    const ngZ = [2, 10, 18, 36].reverse().find(z => z < Z)
    const abbrevConfig = ngZ
        ? (nobleGases[ngZ] + ' ' + config.filter(sh => sh.n > (ngZ === 2 ? 1 : ngZ === 10 ? 2 : ngZ === 18 ? 3 : 4)).map(sh => `${sh.sub}${sh.electrons}`).join(' '))
        : configStr

    return (
        <div>
            {/* Element selector */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                    SELECT ELEMENT (Z = 1–29)
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                    {ELEMENTS.map(el => (
                        <button key={el.Z} onClick={() => setZ(el.Z)} style={{
                            padding: '3px 8px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: Z === el.Z ? 'var(--coral)' : 'var(--bg3)',
                            color: Z === el.Z ? '#fff' : 'var(--text2)',
                            border: `1px solid ${Z === el.Z ? 'var(--coral)' : el.exceptions ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`,
                        }}>
                            {el.sym}
                            {el.exceptions && <span style={{ fontSize: 8, color: 'var(--gold)', marginLeft: 2 }}>*</span>}
                        </button>
                    ))}
                </div>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                    * = exception to Aufbau principle (Cr, Cu)
                </div>
            </div>

            {/* Rule tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'aufbau', l: 'Aufbau principle' },
                    { k: 'pauli', l: "Pauli exclusion" },
                    { k: 'hund', l: "Hund's rule" },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setRule(opt.k)} style={{
                        flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rule === opt.k ? 'var(--gold)' : 'var(--bg3)',
                        color: rule === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${rule === opt.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Element header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, padding: '14px 18px', background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 12 }}>
                <div style={{
                    width: 56, height: 56, borderRadius: 10,
                    background: 'rgba(216,90,48,0.15)',
                    border: '2px solid var(--coral)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                    <div style={{ fontSize: 8, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{element.Z}</div>
                    <div style={{ fontSize: 18, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)' }}>{element.sym}</div>
                </div>
                <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text1)' }}>{element.name}</div>
                    <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)', marginTop: 4 }}>{configStr}</div>
                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>{abbrevConfig}</div>
                </div>
                {element.exceptions && (
                    <div style={{ marginLeft: 'auto', padding: '6px 12px', background: 'rgba(239,159,39,0.12)', border: '1px solid rgba(239,159,39,0.3)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                        ⚠ Exception
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{element.note}</div>
                    </div>
                )}
            </div>

            {/* ── AUFBAU VIEW ── */}
            {rule === 'aufbau' && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 12, letterSpacing: 1 }}>
                        FILL ORDER: 1s → 2s → 2p → 3s → 3p → 4s → 3d → 4p… (n+l rule)
                    </div>

                    {/* Diagonal fill order visual */}
                    <div style={{ padding: '12px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {SUBSHELLS.map((sh, i) => {
                                const filled = config.find(c => c.sub === sh.sub)
                                const isFull = filled && filled.electrons === sh.cap
                                const isPartial = filled && filled.electrons < sh.cap && filled.electrons > 0
                                return (
                                    <div key={sh.sub} style={{
                                        padding: '5px 10px', borderRadius: 8, fontSize: 12,
                                        fontFamily: 'var(--mono)', fontWeight: 700,
                                        background: isFull ? `${sh.color}30` : isPartial ? `${sh.color}15` : 'var(--bg3)',
                                        color: isFull ? sh.color : isPartial ? `${sh.color}90` : 'var(--text3)',
                                        border: `1px solid ${isFull ? sh.color : isPartial ? `${sh.color}50` : 'var(--border)'}`,
                                        position: 'relative',
                                    }}>
                                        {sh.sub}
                                        {filled && (
                                            <sup style={{ fontSize: 9, marginLeft: 2 }}>{filled.electrons}</sup>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Energy level diagram */}
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 10, letterSpacing: 1 }}>
                        ENERGY LEVEL DIAGRAM
                    </div>
                    <svg viewBox="0 0 440 180" width="100%"
                        style={{ display: 'block', background: 'rgba(0,0,0,0.15)', borderRadius: 10, marginBottom: 14 }}>
                        {config.slice(0, showAll ? config.length : 6).map((sh, i) => {
                            const barW = 80
                            const barX = 60 + (i % 6) * 62
                            const barY = 150 - sh.n * 28

                            return (
                                <g key={sh.sub}>
                                    <rect x={barX} y={barY} width={barW} height={8}
                                        rx={3}
                                        fill={`${sh.color}35`}
                                        stroke={sh.color} strokeWidth={1.5} />
                                    {/* Electrons */}
                                    {Array.from({ length: sh.electrons }, (_, e) => {
                                        const isUp = e % 2 === 0
                                        const orbI = Math.floor(e / 2)
                                        const ex = barX + 6 + orbI * 14
                                        const ey = barY - 4
                                        return (
                                            <g key={e}>
                                                <circle cx={ex + 4} cy={ey} r={4}
                                                    fill="rgba(55,138,221,0.7)"
                                                    stroke="#378ADD" strokeWidth={1} />
                                                <text x={ex + 4} y={ey + 3} textAnchor="middle"
                                                    style={{ fontSize: 7, fill: '#fff', fontFamily: 'var(--mono)' }}>
                                                    {isUp ? '↑' : '↓'}
                                                </text>
                                            </g>
                                        )
                                    })}
                                    <text x={barX + barW / 2} y={barY + 18} textAnchor="middle"
                                        style={{ fontSize: 9, fill: sh.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                        {sh.sub}
                                    </text>
                                </g>
                            )
                        })}
                        {/* Energy axis */}
                        <line x1={30} y1={20} x2={30} y2={160}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.8} />
                        <text x={24} y={20} textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>E</text>
                        <text x={24} y={160} textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>low</text>
                    </svg>
                </div>
            )}

            {/* ── PAULI VIEW ── */}
            {rule === 'pauli' && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--purple)', fontWeight: 700 }}>Pauli Exclusion Principle:</span> No two electrons in the same atom can have the same set of all four quantum numbers. Therefore each orbital holds at most 2 electrons — and they must have opposite spins (↑↓).
                    </div>

                    {/* Orbital boxes */}
                    {config.map(sh => {
                        const nOrbs = sh.cap / 2
                        return (
                            <div key={sh.sub} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: sh.color, minWidth: 28 }}>
                                    {sh.sub}
                                </span>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {Array.from({ length: nOrbs }, (_, orbI) => {
                                        const e1 = orbI * 2 < sh.electrons
                                        const e2 = orbI * 2 + 1 < sh.electrons
                                        return (
                                            <div key={orbI} style={{
                                                width: 36, height: 36, borderRadius: 6,
                                                background: `${sh.color}10`,
                                                border: `1.5px solid ${sh.color}40`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                gap: 2,
                                                fontSize: 14,
                                            }}>
                                                {e1 && <span style={{ color: sh.color }}>↑</span>}
                                                {e2 && <span style={{ color: `${sh.color}80` }}>↓</span>}
                                            </div>
                                        )
                                    })}
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                    {sh.electrons}/{sh.cap} e⁻
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ── HUND'S VIEW ── */}
            {rule === 'hund' && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Hund's Rule:</span> Within a subshell, electrons occupy separate orbitals with parallel spins before pairing. This maximises total spin and minimises repulsion.
                    </div>

                    {/* Show only partially filled subshells */}
                    {config.filter(sh => sh.electrons > 0 && sh.electrons < sh.cap).length === 0 && (
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text3)', padding: '12px', background: 'var(--bg3)', borderRadius: 8, marginBottom: 14 }}>
                            All subshells are completely filled for {element.name} — choose N, O, F, C, B or a partially filled element to see Hund's rule in action.
                        </div>
                    )}

                    {config.map(sh => {
                        if (sh.electrons === 0) return null
                        const nOrbs = sh.cap / 2
                        const isOpen = sh.electrons > 0 && sh.electrons < sh.cap
                        return (
                            <div key={sh.sub} style={{ marginBottom: 14 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: sh.color }}>{sh.sub}</span>
                                    {isOpen && (
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', background: 'rgba(29,158,117,0.1)', padding: '2px 8px', borderRadius: 20, border: '1px solid rgba(29,158,117,0.3)' }}>
                                            Hund's rule applies here
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    {Array.from({ length: nOrbs }, (_, orbI) => {
                                        // Hund: fill one per orbital first
                                        const hasUp = orbI < sh.electrons && orbI < nOrbs
                                        const hasDown = orbI < sh.electrons - nOrbs
                                        return (
                                            <div key={orbI} style={{
                                                width: 40, height: 44, borderRadius: 6,
                                                background: `${sh.color}${isOpen ? '12' : '08'}`,
                                                border: `1.5px solid ${sh.color}${isOpen ? '50' : '25'}`,
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                fontSize: 15, lineHeight: 1.2,
                                            }}>
                                                <span style={{ color: sh.color, opacity: hasUp ? 1 : 0.15 }}>↑</span>
                                                <span style={{ color: `${sh.color}80`, opacity: hasDown ? 1 : 0.15 }}>↓</span>
                                            </div>
                                        )
                                    })}
                                </div>
                                {isOpen && (
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                        {sh.electrons} electron{sh.electrons > 1 ? 's' : ''} in {nOrbs} orbitals — singly filled first, all ↑ (parallel spins)
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Element" value={`${element.sym} (Z=${element.Z})`} color="var(--coral)" highlight />
                <ValueCard label="Configuration" value={abbrevConfig.length < 20 ? abbrevConfig : configStr.slice(0, 20) + '…'} color="var(--gold)" />
                <ValueCard label="Valence electrons" value={`${valenceE}`} color="var(--teal)" />
                <ValueCard label="Filled subshells" value={`${config.length}`} color="var(--text2)" />
            </div>
        </div>
    )
}