import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const ATOMS = {
    H: { mass: 1.008, color: '#A8D8B9', r: 10 },
    C: { mass: 12.011, color: '#888780', r: 13 },
    N: { mass: 14.007, color: '#378ADD', r: 12 },
    O: { mass: 15.999, color: '#D85A30', r: 12 },
    Na: { mass: 22.990, color: '#EF9F27', r: 13 },
    Cl: { mass: 35.453, color: '#1D9E75', r: 14 },
    S: { mass: 32.06, color: '#FAC775', r: 13 },
    Ca: { mass: 40.078, color: '#EF9F27', r: 14 },
    Fe: { mass: 55.845, color: '#D85A30', r: 14 },
    K: { mass: 39.098, color: '#EF9F27', r: 14 },
    P: { mass: 30.974, color: '#D85A30', r: 12 },
    Mg: { mass: 24.305, color: '#1D9E75', r: 13 },
}

const PRESETS = [
    { name: 'H₂O', formula: { H: 2, O: 1 } },
    { name: 'CO₂', formula: { C: 1, O: 2 } },
    { name: 'NaCl', formula: { Na: 1, Cl: 1 } },
    { name: 'H₂SO₄', formula: { H: 2, S: 1, O: 4 } },
    { name: 'CaCO₃', formula: { Ca: 1, C: 1, O: 3 } },
    { name: 'NH₃', formula: { N: 1, H: 3 } },
    { name: 'Glucose', formula: { C: 6, H: 12, O: 6 } },
    { name: 'NaOH', formula: { Na: 1, O: 1, H: 1 } },
]

export default function MolarMass() {
    const [counts, setCounts] = useState({ H: 2, O: 1 })
    const [preset, setPreset] = useState('H₂O')
    const [sampleG, setSample] = useState(18)

    const loadPreset = name => {
        const p = PRESETS.find(m => m.name === name)
        if (p) { setCounts({ ...p.formula }); setPreset(name) }
    }
    const adjust = (el, d) => {
        setCounts(prev => {
            const n = { ...prev, [el]: Math.max(0, (prev[el] || 0) + d) }
            if (!n[el]) delete n[el]
            return n
        })
        setPreset('custom')
    }

    const elems = Object.keys(counts).filter(el => counts[el] > 0)
    const molarM = elems.reduce((s, el) => s + (ATOMS[el]?.mass || 0) * counts[el], 0)
    const nMoles = molarM > 0 ? sampleG / molarM : 0
    const nPart = nMoles * 6.022e23

    // Atom tiles for visual — max 30 shown
    const atomList = []
    elems.forEach(el => { for (let i = 0; i < counts[el]; i++) atomList.push(el) })
    const shown = atomList.slice(0, 30)
    const TILE = 34

    return (
        <div>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {PRESETS.map(m => (
                    <button key={m.name} onClick={() => loadPreset(m.name)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: preset === m.name ? 'var(--gold)' : 'var(--bg3)',
                        color: preset === m.name ? '#000' : 'var(--text2)',
                        border: `1px solid ${preset === m.name ? 'var(--gold)' : 'var(--border)'}`,
                    }}>{m.name}</button>
                ))}
            </div>

            {/* Element controls */}
            <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 10, letterSpacing: 1 }}>
                    ADD ELEMENTS
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                    {Object.entries(ATOMS).map(([el, data]) => (
                        <button key={el} onClick={() => adjust(el, 1)} style={{
                            padding: '4px 10px', borderRadius: 6, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: `${data.color}15`, color: data.color,
                            border: `1px solid ${data.color}40`,
                        }}>+{el}</button>
                    ))}
                </div>

                {/* Current composition */}
                {elems.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {elems.map(el => {
                            const data = ATOMS[el]
                            return (
                                <div key={el} style={{
                                    display: 'flex', alignItems: 'center', gap: 5,
                                    background: `${data?.color || '#FAC775'}10`,
                                    border: `1px solid ${data?.color || '#FAC775'}40`,
                                    borderRadius: 8, padding: '6px 10px',
                                }}>
                                    <span style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: data?.color || '#FAC775' }}>{el}</span>
                                    <button onClick={() => adjust(el, -1)} style={{
                                        background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                                        color: 'var(--text2)', borderRadius: 4,
                                        width: 20, height: 20, fontSize: 14, cursor: 'pointer',
                                    }}>−</button>
                                    <span style={{ fontSize: 13, fontFamily: 'var(--mono)', color: 'var(--text1)', minWidth: 16, textAlign: 'center' }}>
                                        {counts[el]}
                                    </span>
                                    <button onClick={() => adjust(el, 1)} style={{
                                        background: 'none', border: '1px solid rgba(255,255,255,0.15)',
                                        color: 'var(--text2)', borderRadius: 4,
                                        width: 20, height: 20, fontSize: 14, cursor: 'pointer',
                                    }}>+</button>
                                    <span style={{ fontSize: 10, color: data?.color || '#FAC775', fontFamily: 'var(--mono)' }}>
                                        {((data?.mass || 0) * counts[el]).toFixed(2)} g
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Atom tiles visualisation */}
            {shown.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                        ATOMS IN ONE MOLECULE {atomList.length > 30 ? `(showing 30 of ${atomList.length})` : ''}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {shown.map((el, i) => {
                            const data = ATOMS[el]
                            return (
                                <div key={i} style={{
                                    width: TILE, height: TILE, borderRadius: 6,
                                    background: `${data?.color || '#FAC775'}18`,
                                    border: `1.5px solid ${data?.color || '#FAC775'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: data?.color || '#FAC775',
                                }}>{el}</div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Mass contribution bars */}
            {elems.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                        MASS CONTRIBUTION PER ELEMENT
                    </div>
                    {elems.map(el => {
                        const data = ATOMS[el]
                        const mass = (data?.mass || 0) * counts[el]
                        const pct = molarM > 0 ? (mass / molarM) * 100 : 0
                        return (
                            <div key={el} style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: data?.color || '#FAC775' }}>
                                        {el} × {counts[el]}
                                    </span>
                                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                        {mass.toFixed(3)} g/mol ({pct.toFixed(1)}%)
                                    </span>
                                </div>
                                <div style={{ height: 12, background: 'var(--bg3)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: data?.color || '#FAC775', borderRadius: 3 }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Sample calc */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>Sample mass:</span>
                <input type="number" value={sampleG} min={0.001} step={0.1}
                    onChange={e => setSample(Number(e.target.value))}
                    style={{
                        background: 'var(--bg3)', border: '1px solid var(--border2)',
                        color: 'var(--text1)', borderRadius: 6, padding: '4px 10px',
                        fontFamily: 'var(--mono)', fontSize: 12, width: 80,
                    }} />
                <span style={{ fontSize: 12, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>g</span>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Molar mass M" value={molarM.toFixed(3)} unit=" g/mol" color="var(--gold)" highlight />
                <ValueCard label={`Moles in ${sampleG}g`} value={nMoles.toFixed(4)} unit=" mol" color="var(--teal)" />
                <ValueCard label="Molecules" value={nPart.toExponential(3)} color="var(--purple)" />
                <ValueCard label="Formula" value={elems.map(el => `${el}${counts[el] > 1 ? counts[el] : ''}`).join('')} color="var(--text2)" />
            </div>
        </div>
    )
}