import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 440, H = 260

// SI base units with symbol, dimension, color
const BASE = [
    { sym: 'm', name: 'metre', dim: 'Length', color: '#EF9F27' },
    { sym: 'kg', name: 'kilogram', dim: 'Mass', color: '#D85A30' },
    { sym: 's', name: 'second', dim: 'Time', color: '#1D9E75' },
    { sym: 'A', name: 'ampere', dim: 'Current', color: '#378ADD' },
    { sym: 'K', name: 'kelvin', dim: 'Temperature', color: '#7F77DD' },
    { sym: 'mol', name: 'mole', dim: 'Amount', color: '#888780' },
    { sym: 'cd', name: 'candela', dim: 'Luminosity', color: '#F5C4B3' },
]

// Derived units with their base unit formula
const DERIVED = [
    { sym: 'N', name: 'Newton', formula: 'kg·m·s⁻²', bases: ['kg', 'm', 's'], color: '#EF9F27', desc: 'Force' },
    { sym: 'J', name: 'Joule', formula: 'kg·m²·s⁻²', bases: ['kg', 'm', 's'], color: '#D85A30', desc: 'Energy' },
    { sym: 'W', name: 'Watt', formula: 'kg·m²·s⁻³', bases: ['kg', 'm', 's'], color: '#1D9E75', desc: 'Power' },
    { sym: 'Pa', name: 'Pascal', formula: 'kg·m⁻¹·s⁻²', bases: ['kg', 'm', 's'], color: '#378ADD', desc: 'Pressure' },
    { sym: 'C', name: 'Coulomb', formula: 'A·s', bases: ['A', 's'], color: '#7F77DD', desc: 'Charge' },
    { sym: 'V', name: 'Volt', formula: 'kg·m²·s⁻³·A⁻¹', bases: ['kg', 'm', 's', 'A'], color: '#888780', desc: 'Voltage' },
    { sym: 'Ω', name: 'Ohm', formula: 'kg·m²·s⁻³·A⁻²', bases: ['kg', 'm', 's', 'A'], color: '#F5C4B3', desc: 'Resistance' },
    { sym: 'Hz', name: 'Hertz', formula: 's⁻¹', bases: ['s'], color: '#EF9F27', desc: 'Frequency' },
]

// Quick converter data
const CONVERTERS = {
    Length: { base: 'm', units: { mm: 1e-3, cm: 0.01, m: 1, km: 1e3, inch: 0.0254, foot: 0.3048, mile: 1609.34 } },
    Mass: { base: 'kg', units: { g: 0.001, kg: 1, tonne: 1e3, lb: 0.4536, oz: 0.02835 } },
    Time: { base: 's', units: { ms: 1e-3, s: 1, min: 60, hr: 3600, day: 86400 } },
    Energy: { base: 'J', units: { J: 1, kJ: 1e3, cal: 4.184, kcal: 4184, eV: 1.602e-19, kWh: 3.6e6 } },
    Pressure: { base: 'Pa', units: { Pa: 1, kPa: 1e3, MPa: 1e6, atm: 101325, bar: 1e5, mmHg: 133.3 } },
}

export default function UnitConverter() {
    const [tab, setTab] = useState('tree')   // tree | convert
    const [selDerived, setSel] = useState(0)
    const [qty, setQty] = useState('Length')
    const [from, setFrom] = useState('cm')
    const [to, setTo] = useState('m')
    const [val, setVal] = useState(100)

    const d = DERIVED[selDerived]
    const q = CONVERTERS[qty]
    const res = (val * q.units[from]) / q.units[to]

    // Layout: base units in a row at bottom, selected derived at top
    const baseY = H - 48
    const derivY = 40
    const baseSpacing = (W - 40) / (BASE.length - 1)

    const getBaseX = sym => {
        const i = BASE.findIndex(b => b.sym === sym)
        return i >= 0 ? 20 + i * baseSpacing : -100
    }

    const sel = (v, fn, keys) => (
        <select value={v} onChange={e => fn(e.target.value)} style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            color: 'var(--text1)', borderRadius: 6, padding: '5px 10px',
            fontFamily: 'var(--mono)', fontSize: 12, cursor: 'pointer',
        }}>
            {keys.map(k => <option key={k}>{k}</option>)}
        </select>
    )

    return (
        <div>
            {/* Tab switch */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['tree', 'convert'].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '5px 18px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: tab === t ? 'var(--amber)' : 'var(--bg3)',
                        color: tab === t ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{t === 'tree' ? 'SI Unit Tree' : 'Quick Converter'}</button>
                ))}
            </div>

            {tab === 'tree' && (
                <>
                    {/* Derived unit selector */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {DERIVED.map((d, i) => (
                            <button key={d.sym} onClick={() => setSel(i)} style={{
                                padding: '3px 10px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: selDerived === i ? d.color : 'var(--bg3)',
                                color: selDerived === i ? '#000' : 'var(--text2)',
                                border: `1px solid ${selDerived === i ? d.color : 'var(--border)'}`,
                            }}>{d.sym} ({d.desc})</button>
                        ))}
                    </div>

                    <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                        style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                        {/* Lines from derived to base units */}
                        {d.bases.map(bsym => {
                            const bx = getBaseX(bsym)
                            const b = BASE.find(b => b.sym === bsym)
                            return (
                                <g key={bsym}>
                                    <line x1={W / 2} y1={derivY + 22}
                                        x2={bx} y2={baseY - 6}
                                        stroke={`${b.color}50`} strokeWidth={1.5}
                                        strokeDasharray="5 3" />
                                    {/* Animated dot traveling along line */}
                                    {[0, 0.4, 0.7].map((offset, oi) => {
                                        const p = ((Date.now() / 2000 + offset) % 1)
                                        const px = W / 2 + (bx - W / 2) * p
                                        const py = (derivY + 22) + (baseY - 6 - derivY - 22) * p
                                        return (
                                            <circle key={oi} cx={px} cy={py} r={3}
                                                fill={b.color} opacity={0.7} />
                                        )
                                    })}
                                </g>
                            )
                        })}

                        {/* Derived unit box */}
                        <rect x={W / 2 - 60} y={10} width={120} height={44}
                            rx={8} fill={`${d.color}20`}
                            stroke={d.color} strokeWidth={2} />
                        <text x={W / 2} y={30} textAnchor="middle"
                            style={{ fontSize: 16, fill: d.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            {d.sym}
                        </text>
                        <text x={W / 2} y={46} textAnchor="middle"
                            style={{ fontSize: 9, fill: `${d.color}90`, fontFamily: 'var(--mono)' }}>
                            {d.formula}
                        </text>

                        {/* Base units */}
                        {BASE.map((b, i) => {
                            const bx = getBaseX(b.sym)
                            const isUsed = d.bases.includes(b.sym)
                            return (
                                <g key={b.sym}>
                                    <circle cx={bx} cy={baseY} r={isUsed ? 22 : 16}
                                        fill={isUsed ? `${b.color}25` : 'rgba(160,176,200,0.06)'}
                                        stroke={isUsed ? b.color : 'rgba(160,176,200,0.2)'}
                                        strokeWidth={isUsed ? 2 : 1} />
                                    <text x={bx} y={baseY - 2} textAnchor="middle"
                                        style={{
                                            fontSize: isUsed ? 13 : 11,
                                            fill: isUsed ? b.color : 'rgba(160,176,200,0.3)',
                                            fontFamily: 'var(--mono)', fontWeight: isUsed ? 700 : 400,
                                        }}>
                                        {b.sym}
                                    </text>
                                    <text x={bx} y={baseY + 10} textAnchor="middle"
                                        style={{
                                            fontSize: 8,
                                            fill: isUsed ? `${b.color}80` : 'rgba(160,176,200,0.2)',
                                            fontFamily: 'var(--mono)',
                                        }}>
                                        {b.dim.slice(0, 4)}
                                    </text>
                                </g>
                            )
                        })}

                        {/* Label */}
                        <text x={W / 2} y={H - 8} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            All {DERIVED.length} derived units built from {BASE.length} SI base units
                        </text>
                    </svg>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Derived unit', val: `${d.sym} (${d.name})`, color: d.color },
                            { label: 'In base units', val: d.formula, color: 'var(--amber)' },
                            { label: 'Quantity', val: d.desc, color: 'var(--teal)' },
                            { label: 'Base units used', val: d.bases.join(', '), color: 'var(--text2)' },
                        ].map(c => (
                            <div key={c.label} style={{
                                background: 'var(--bg3)', borderRadius: 8,
                                padding: '8px 12px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                            }}>
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>{c.label}</div>
                                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tab === 'convert' && (
                <div>
                    {/* Quantity tabs */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(CONVERTERS).map(k => (
                            <button key={k} onClick={() => {
                                setQty(k)
                                const units = Object.keys(CONVERTERS[k].units)
                                setFrom(units[1]); setTo(units[0])
                                setVal(100)
                            }} style={{
                                padding: '4px 12px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: qty === k ? 'var(--amber)' : 'var(--bg3)',
                                color: qty === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${qty === k ? 'var(--amber)' : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    <SimSlider label="Value" unit={` ${from}`}
                        value={val} min={0.001} max={10000} step={0.001}
                        onChange={setVal} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
                        {sel(from, v => setFrom(v), Object.keys(q.units))}
                        <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 18 }}>→</span>
                        {sel(to, v => setTo(v), Object.keys(q.units))}
                    </div>

                    {/* Result */}
                    <div style={{
                        marginTop: 18, padding: '16px 20px', background: 'var(--bg3)',
                        borderRadius: 10, border: '1px solid var(--border2)',
                        display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap',
                    }}>
                        <span style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                            {val} {from} =
                        </span>
                        <span style={{ fontSize: 28, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                            {res < 0.0001 || res > 1e7
                                ? res.toExponential(4)
                                : parseFloat(res.toFixed(6))}
                        </span>
                        <span style={{ fontSize: 18, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{to}</span>
                    </div>

                    {/* Factor */}
                    <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                        Conversion: 1 {from} = {(q.units[from] / q.units[to]).toExponential(4)} {to}
                        {'  |  '}SI base unit: <span style={{ color: 'var(--teal)' }}>{q.base}</span>
                    </div>
                </div>
            )}
        </div>
    )
}