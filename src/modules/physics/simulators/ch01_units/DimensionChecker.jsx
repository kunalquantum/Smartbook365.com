import { useState } from 'react'

const QUANTITIES = [
    { name: 'Force F', dim: { M: 1, L: 1, T: -2 }, sym: 'F', color: '#EF9F27' },
    { name: 'Velocity v', dim: { M: 0, L: 1, T: -1 }, sym: 'v', color: '#1D9E75' },
    { name: 'Mass m', dim: { M: 1, L: 0, T: 0 }, sym: 'm', color: '#D85A30' },
    { name: 'Length l', dim: { M: 0, L: 1, T: 0 }, sym: 'l', color: '#378ADD' },
    { name: 'Time t', dim: { M: 0, L: 0, T: 1 }, sym: 't', color: '#7F77DD' },
    { name: 'Acceleration a', dim: { M: 0, L: 1, T: -2 }, sym: 'a', color: '#EF9F27' },
    { name: 'Energy E', dim: { M: 1, L: 2, T: -2 }, sym: 'E', color: '#D85A30' },
    { name: 'Pressure P', dim: { M: 1, L: -1, T: -2 }, sym: 'P', color: '#7F77DD' },
    { name: 'Power W', dim: { M: 1, L: 2, T: -3 }, sym: 'W', color: '#1D9E75' },
    { name: 'Momentum p', dim: { M: 1, L: 1, T: -1 }, sym: 'p', color: '#888780' },
]

function dimStr(d) {
    const parts = []
    if (d.M !== 0) parts.push(d.M === 1 ? 'M' : `M${d.M > 0 ? d.M : d.M}`)
    if (d.L !== 0) parts.push(d.L === 1 ? 'L' : `L${d.L}`)
    if (d.T !== 0) parts.push(d.T === 1 ? 'T' : `T${d.T < 0 ? d.T : d.T}`)
    return parts.length ? '[' + parts.join('') + ']' : '[M⁰L⁰T⁰] = dimensionless'
}

function addDims(d1, d2) {
    return { M: d1.M + d2.M, L: d1.L + d2.L, T: d1.T + d2.T }
}

function dimsEqual(d1, d2) {
    return d1.M === d2.M && d1.L === d2.L && d1.T === d2.T
}

const PRESETS = [
    { name: "F = ma", lhs: 0, rhs: [2, 5], desc: "Newton's 2nd law" },
    { name: "E = ½mv²", lhs: 6, rhs: [2, 1, 1], desc: "Kinetic energy" },
    { name: "P = F/A", lhs: 7, rhs: [0, 3, 3], desc: "Wrong! F/L² ≠ P — try F/l²" },
    { name: "p = mv", lhs: 9, rhs: [2, 1], desc: "Linear momentum" },
    { name: "v = u + at", lhs: 1, rhs: [1, 5, 4], desc: "First equation of motion" },
]

export default function DimensionChecker() {
    const [lhsIdx, setLhsIdx] = useState(0)
    const [rhsList, setRhsList] = useState([2, 5])   // indices of RHS quantities
    const [checked, setChecked] = useState(false)
    const [preset, setPreset] = useState(0)

    const loadPreset = (i) => {
        const p = PRESETS[i]
        setPreset(i)
        setLhsIdx(p.lhs)
        setRhsList(p.rhs)
        setChecked(false)
    }

    const addRhs = (idx) => {
        if (rhsList.length < 4) setRhsList(p => [...p, idx])
    }
    const removeRhs = (pos) => {
        setRhsList(p => p.filter((_, i) => i !== pos))
    }

    const lhsDim = QUANTITIES[lhsIdx].dim
    const rhsDim = rhsList.reduce((acc, idx) => addDims(acc, QUANTITIES[idx].dim), { M: 0, L: 0, T: 0 })
    const isEqual = dimsEqual(lhsDim, rhsDim)

    return (
        <div>
            {/* Preset buttons */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {PRESETS.map((p, i) => (
                    <button key={i} onClick={() => loadPreset(i)} style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: preset === i ? 'var(--teal)' : 'var(--bg3)',
                        color: preset === i ? '#fff' : 'var(--text2)',
                        border: `1px solid ${preset === i ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{p.name}</button>
                ))}
            </div>

            {/* LHS selector */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                    LHS (left-hand side):
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {QUANTITIES.map((q, i) => (
                        <button key={i} onClick={() => { setLhsIdx(i); setChecked(false) }} style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: lhsIdx === i ? q.color : 'var(--bg3)',
                            color: lhsIdx === i ? '#000' : 'var(--text2)',
                            border: `1px solid ${lhsIdx === i ? q.color : 'var(--border)'}`,
                        }}>{q.sym}</button>
                    ))}
                </div>
            </div>

            {/* RHS builder */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                    RHS (right-hand side) — click to add, × to remove:
                </div>
                {/* Selected RHS tokens */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10, minHeight: 36, padding: '4px 8px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)', alignItems: 'center' }}>
                    {rhsList.length === 0 && (
                        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                            Click quantities below to add →
                        </span>
                    )}
                    {rhsList.map((idx, pos) => {
                        const q = QUANTITIES[idx]
                        return (
                            <div key={pos} style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                padding: '3px 8px', borderRadius: 6, fontSize: 12,
                                fontFamily: 'var(--mono)',
                                background: `${q.color}20`, color: q.color,
                                border: `1px solid ${q.color}40`,
                            }}>
                                {q.sym}
                                <span onClick={() => removeRhs(pos)}
                                    style={{ cursor: 'pointer', fontSize: 14, color: q.color, marginLeft: 2 }}>×</span>
                            </div>
                        )
                    })}
                    {rhsList.length > 1 && (
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginLeft: 6 }}>
                            = {dimStr(rhsDim)}
                        </div>
                    )}
                </div>
                {/* Quantity buttons to add */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {QUANTITIES.map((q, i) => (
                        <button key={i} onClick={() => { addRhs(i); setChecked(false) }} style={{
                            padding: '3px 10px', borderRadius: 6, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'var(--bg3)', color: q.color,
                            border: `1px solid ${q.color}40`,
                            opacity: rhsList.length >= 4 ? 0.4 : 1,
                        }}>+{q.sym}</button>
                    ))}
                </div>
            </div>

            {/* Dimension comparison */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                padding: '14px 18px', background: 'var(--bg3)',
                borderRadius: 10, border: '1px solid var(--border)',
                marginBottom: 14,
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>LHS</div>
                    <div style={{ fontSize: 14, fontFamily: 'var(--mono)', color: QUANTITIES[lhsIdx].color, fontWeight: 700 }}>
                        {QUANTITIES[lhsIdx].sym} = {dimStr(lhsDim)}
                    </div>
                </div>

                <div style={{ fontSize: 24, color: 'var(--text3)' }}>≟</div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>RHS</div>
                    <div style={{ fontSize: 14, fontFamily: 'var(--mono)', color: 'var(--amber)', fontWeight: 700 }}>
                        {rhsList.map(i => QUANTITIES[i].sym).join('·')} = {dimStr(rhsDim)}
                    </div>
                </div>

                <button onClick={() => setChecked(true)}
                    disabled={rhsList.length === 0}
                    style={{
                        padding: '8px 20px', borderRadius: 8, fontSize: 13,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: 'rgba(239,159,39,0.12)', color: 'var(--amber)',
                        border: '1px solid rgba(239,159,39,0.3)',
                        opacity: rhsList.length === 0 ? 0.4 : 1,
                    }}>Check →</button>
            </div>

            {/* Result */}
            {checked && (
                <div style={{
                    padding: '12px 16px', borderRadius: 10, marginBottom: 14,
                    background: isEqual ? 'rgba(29,158,117,0.1)' : 'rgba(216,90,48,0.1)',
                    border: `1px solid ${isEqual ? 'rgba(29,158,117,0.3)' : 'rgba(216,90,48,0.3)'}`,
                    fontFamily: 'var(--mono)', fontSize: 13,
                    color: isEqual ? 'var(--teal)' : 'var(--coral)',
                }}>
                    {isEqual
                        ? `✓ Dimensionally CORRECT — ${QUANTITIES[lhsIdx].sym} = ${rhsList.map(i => QUANTITIES[i].sym).join('·')} is valid`
                        : `✗ Dimensionally WRONG — LHS ${dimStr(lhsDim)} ≠ RHS ${dimStr(rhsDim)}`}
                    {PRESETS[preset] && (
                        <div style={{ fontSize: 11, marginTop: 6, opacity: 0.7 }}>{PRESETS[preset].desc}</div>
                    )}
                </div>
            )}

            {/* Dimension table */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                gap: 8,
            }}>
                {[
                    { label: 'M (mass)', val: `${lhsDim.M} vs ${rhsDim.M}`, match: lhsDim.M === rhsDim.M },
                    { label: 'L (length)', val: `${lhsDim.L} vs ${rhsDim.L}`, match: lhsDim.L === rhsDim.L },
                    { label: 'T (time)', val: `${lhsDim.T} vs ${rhsDim.T}`, match: lhsDim.T === rhsDim.T },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px',
                        border: `1px solid ${c.match ? 'rgba(29,158,117,0.3)' : checked ? 'rgba(216,90,48,0.3)' : 'var(--border)'}`,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--mono)', color: c.match ? 'var(--teal)' : checked ? 'var(--coral)' : 'var(--text2)' }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}