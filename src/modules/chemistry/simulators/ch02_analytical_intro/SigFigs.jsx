import { useState, useMemo } from 'react'
import ValueCard from '../../components/ui/ValueCard'

// ── sig fig counter ────────────────────────────────────────────────────────
function countSigFigs(str) {
    const s = str.trim()
    if (!s || isNaN(Number(s))) return null

    // Remove sign and scientific notation for counting
    const abs = s.replace(/^-/, '').replace(/e.*/i, '')

    if (abs.includes('.')) {
        // Has decimal point — all digits are significant (leading zeros before first nonzero not)
        const noLeadZeros = abs.replace(/^0+\.0*/, '')
        return (noLeadZeros.replace('.', '').match(/\d/g) || []).length
    } else {
        // Integer — trailing zeros ambiguous — count up to last nonzero
        const stripped = abs.replace(/0+$/, '')
        return (stripped.match(/\d/g) || []).length
    }
}

function sigFigAnnotate(str) {
    // Returns array of {char, significant} for digit-by-digit highlighting
    if (!str || isNaN(Number(str))) return []
    const s = str.trim().replace(/^-/, '')
    const hasDot = s.includes('.')
    const digits = s.replace('.', '')
    let started = false
    let result = []
    let dIdx = 0

    for (let i = 0; i < s.length; i++) {
        const ch = s[i]
        if (ch === '.') { result.push({ char: '.', sig: false, isDot: true }); continue }
        if (ch === '0' && !started && !hasDot) {
            result.push({ char: '0', sig: false })
        } else if (ch !== '0') {
            started = true
            result.push({ char: ch, sig: true })
        } else {
            if (started) result.push({ char: '0', sig: true })
            else result.push({ char: '0', sig: false })
        }
    }
    return result
}

const RULES = [
    { rule: 'All non-zero digits are significant', examples: ['1234 → 4 SF', '3.14 → 3 SF'] },
    { rule: 'Zeros between non-zeros are significant', examples: ['3004 → 4 SF', '1.006 → 4 SF'] },
    { rule: 'Leading zeros are NOT significant', examples: ['0.0023 → 2 SF', '007 → 1 SF'] },
    { rule: 'Trailing zeros AFTER decimal point are significant', examples: ['3.00 → 3 SF', '100.0 → 4 SF'] },
    { rule: 'Trailing zeros WITHOUT decimal — ambiguous', examples: ['1300 → 2 or 4 SF', 'use 1.300×10³ for 4 SF'] },
]

const OPERATIONS = [
    {
        id: 'add',
        label: 'Addition / Subtraction',
        rule: 'Answer has the same number of DECIMAL PLACES as the least precise number.',
        a: 12.11, b: 18.0, c: 1.013,
        compute: (a, b, c) => {
            const sum = a + b + c
            const minDP = Math.max(0, ...([a, b, c].map(v => {
                const s = String(v)
                const dot = s.indexOf('.')
                return dot >= 0 ? s.length - dot - 1 : 0
            })))
            // least decimal places
            const leastDP = Math.min(...([a, b, c].map(v => {
                const s = String(v)
                const dot = s.indexOf('.')
                return dot >= 0 ? s.length - dot - 1 : 0
            })))
            return { exact: sum, rounded: parseFloat(sum.toFixed(leastDP)), dp: leastDP }
        },
    },
    {
        id: 'mul',
        label: 'Multiplication / Division',
        rule: 'Answer has the same number of SIGNIFICANT FIGURES as the factor with the fewest.',
        a: 4.52, b: 2.1, c: null,
        compute: (a, b) => {
            const prod = a * b
            const sfA = countSigFigs(String(a)) || 3
            const sfB = countSigFigs(String(b)) || 2
            const minSF = Math.min(sfA, sfB)
            const rounded = parseFloat(prod.toPrecision(minSF))
            return { exact: prod, rounded, sf: minSF }
        },
    },
]

export default function SigFigs() {
    const [tab, setTab] = useState('count')   // count | rules | calc
    const [input, setInput] = useState('0.00230')
    const [opIdx, setOpIdx] = useState(0)
    const [valA, setValA] = useState(12.11)
    const [valB, setValB] = useState(18.0)
    const [valC, setValC] = useState(1.013)

    const annotated = useMemo(() => sigFigAnnotate(input), [input])
    const sf = countSigFigs(input)
    const op = OPERATIONS[opIdx]
    const opResult = op.compute(valA, valB, valC)

    return (
        <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                    { k: 'count', l: 'Count Sig Figs' },
                    { k: 'rules', l: 'Rules' },
                    { k: 'calc', l: 'Calculations' },
                ].map(t => (
                    <button key={t.k} onClick={() => setTab(t.k)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: tab === t.k ? 'var(--gold)' : 'var(--bg3)',
                        color: tab === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── COUNT ── */}
            {tab === 'count' && (
                <div>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8 }}>
                            TYPE ANY NUMBER — digits are colour-coded significant (gold) vs not (dim)
                        </div>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            style={{
                                width: '100%', background: 'var(--bg3)',
                                border: '2px solid var(--border2)',
                                color: 'var(--text1)', borderRadius: 8,
                                padding: '10px 14px', fontFamily: 'var(--mono)',
                                fontSize: 22, letterSpacing: 4,
                            }}
                        />
                    </div>

                    {/* Digit annotation */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 16, padding: '12px 16px', background: 'var(--bg3)', borderRadius: 10, border: '1px solid var(--border)' }}>
                        {annotated.map((d, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <div style={{
                                    fontSize: 28, fontFamily: 'var(--mono)', fontWeight: 700,
                                    color: d.isDot ? 'var(--text3)' : d.sig ? 'var(--gold)' : 'rgba(160,176,200,0.25)',
                                    minWidth: 24, textAlign: 'center',
                                }}>{d.char}</div>
                                {!d.isDot && (
                                    <div style={{
                                        fontSize: 9, fontFamily: 'var(--mono)',
                                        color: d.sig ? 'rgba(212,160,23,0.7)' : 'rgba(160,176,200,0.2)',
                                    }}>
                                        {d.sig ? 'SIG' : 'not'}
                                    </div>
                                )}
                            </div>
                        ))}

                        <div style={{
                            marginLeft: 'auto', padding: '8px 16px',
                            background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.3)',
                            borderRadius: 8, textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>Sig Figs</div>
                            <div style={{ fontSize: 28, fontWeight: 700, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                                {sf ?? '?'}
                            </div>
                        </div>
                    </div>

                    {/* Quick examples */}
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 8, letterSpacing: 1 }}>
                        CLICK AN EXAMPLE
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {['0.0023', '100', '100.0', '1.006', '3400', '0.030050', '5.00×10³', '6.022×10²³'].map(ex => (
                            <button key={ex} onClick={() => setInput(ex)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: input === ex ? 'var(--gold)' : 'var(--bg3)',
                                color: input === ex ? '#000' : 'var(--text2)',
                                border: `1px solid ${input === ex ? 'var(--gold)' : 'var(--border)'}`,
                            }}>{ex} → {countSigFigs(ex) ?? '?'} SF</button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── RULES ── */}
            {tab === 'rules' && (
                <div>
                    {RULES.map((r, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: 14, padding: '12px 14px',
                            borderBottom: '1px solid var(--border)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                        }}>
                            <div style={{
                                width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
                                background: 'rgba(212,160,23,0.15)', border: '1px solid rgba(212,160,23,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)', fontWeight: 700,
                            }}>{i + 1}</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 12, color: 'var(--text1)', marginBottom: 6, lineHeight: 1.5 }}>
                                    {r.rule}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    {r.examples.map(ex => (
                                        <span key={ex} style={{
                                            fontSize: 11, fontFamily: 'var(--mono)',
                                            padding: '2px 10px', borderRadius: 20,
                                            background: 'rgba(212,160,23,0.1)', color: 'var(--gold)',
                                        }}>{ex}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── CALCULATIONS ── */}
            {tab === 'calc' && (
                <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {OPERATIONS.map((o, i) => (
                            <button key={o.id} onClick={() => setOpIdx(i)} style={{
                                padding: '5px 14px', borderRadius: 6, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                                background: opIdx === i ? 'var(--teal)' : 'var(--bg3)',
                                color: opIdx === i ? '#fff' : 'var(--text2)',
                                border: `1px solid ${opIdx === i ? 'var(--teal)' : 'var(--border2)'}`,
                            }}>{o.label}</button>
                        ))}
                    </div>

                    {/* Rule reminder */}
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 16, fontSize: 12, color: 'var(--teal)', fontFamily: 'var(--mono)' }}>
                        Rule: {op.rule}
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
                        {[
                            { label: 'A', val: valA, fn: setValA },
                            { label: 'B', val: valB, fn: setValB },
                            ...(opIdx === 0 && op.c !== null ? [{ label: 'C', val: valC, fn: setValC }] : []),
                        ].map((inp, i, arr) => (
                            <div key={inp.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
                                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>
                                        Value {inp.label} — {countSigFigs(String(inp.val))} SF
                                    </div>
                                    <input type="number" value={inp.val} step={0.001}
                                        onChange={e => inp.fn(Number(e.target.value))}
                                        style={{
                                            background: 'transparent', border: 'none',
                                            color: 'var(--text1)', fontFamily: 'var(--mono)',
                                            fontSize: 18, width: 100, outline: 'none',
                                        }} />
                                </div>
                                {i < arr.length - 1 && (
                                    <span style={{ fontSize: 18, color: 'var(--text3)', fontWeight: 700 }}>
                                        {opIdx === 0 ? '+' : '×'}
                                    </span>
                                )}
                            </div>
                        ))}

                        <span style={{ fontSize: 20, color: 'var(--text3)' }}>=</span>

                        {/* Result */}
                        <div style={{ padding: '8px 16px', background: 'rgba(212,160,23,0.12)', border: '2px solid rgba(212,160,23,0.4)', borderRadius: 8 }}>
                            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 3 }}>
                                Result ({opIdx === 0 ? `${opResult.dp} DP` : `${opResult.sf} SF`})
                            </div>
                            <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>
                                {opResult.rounded}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>
                                exact: {opResult.exact.toFixed(6)}
                            </div>
                        </div>
                    </div>

                    {/* Step-by-step */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--mono)', fontSize: 12 }}>
                        <div style={{ color: 'var(--text3)', fontSize: 10, marginBottom: 8, letterSpacing: 1 }}>WORKING</div>
                        {opIdx === 0 ? (
                            <div style={{ lineHeight: 2 }}>
                                <div style={{ color: 'var(--text2)' }}>{valA} → {countSigFigs(String(valA))} SF, <span style={{ color: 'var(--gold)' }}>{(() => { const s = String(valA); const d = s.indexOf('.'); return d >= 0 ? s.length - d - 1 : 0 })()} decimal places</span></div>
                                <div style={{ color: 'var(--text2)' }}>{valB} → {countSigFigs(String(valB))} SF, <span style={{ color: 'var(--gold)' }}>{(() => { const s = String(valB); const d = s.indexOf('.'); return d >= 0 ? s.length - d - 1 : 0 })()} decimal places</span></div>
                                {op.c !== null && <div style={{ color: 'var(--text2)' }}>{valC} → {countSigFigs(String(valC))} SF, <span style={{ color: 'var(--gold)' }}>{(() => { const s = String(valC); const d = s.indexOf('.'); return d >= 0 ? s.length - d - 1 : 0 })()} decimal places</span></div>}
                                <div style={{ color: 'var(--teal)', marginTop: 4 }}>Least decimal places = {opResult.dp}</div>
                                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>→ Round to {opResult.dp} DP = <strong>{opResult.rounded}</strong></div>
                            </div>
                        ) : (
                            <div style={{ lineHeight: 2 }}>
                                <div style={{ color: 'var(--text2)' }}>{valA} → <span style={{ color: 'var(--gold)' }}>{countSigFigs(String(valA))} sig figs</span></div>
                                <div style={{ color: 'var(--text2)' }}>{valB} → <span style={{ color: 'var(--gold)' }}>{countSigFigs(String(valB))} sig figs</span></div>
                                <div style={{ color: 'var(--teal)', marginTop: 4 }}>Fewest sig figs = {opResult.sf}</div>
                                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>→ Round to {opResult.sf} SF = <strong>{opResult.rounded}</strong></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}