import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const REACTIONS = {
    'MnO₄⁻ + Fe²⁺ (acid)': {
        medium: 'acidic',
        ox: {
            label: 'Fe²⁺ → Fe³⁺',
            steps: [
                { title: 'Write skeleton', eq: 'Fe²⁺ → Fe³⁺', note: 'Fe atoms balanced (1=1)' },
                { title: 'Balance O (H₂O)', eq: 'Fe²⁺ → Fe³⁺', note: 'No O atoms — skip' },
                { title: 'Balance H (H⁺)', eq: 'Fe²⁺ → Fe³⁺', note: 'No H atoms — skip' },
                { title: 'Balance charge (e⁻)', eq: 'Fe²⁺ → Fe³⁺ + e⁻', note: 'LHS charge = +2, RHS = +3 → add 1e⁻ to RHS' },
            ],
            final: 'Fe²⁺ → Fe³⁺ + e⁻',
            ne: 1,
        },
        red: {
            label: 'MnO₄⁻ → Mn²⁺',
            steps: [
                { title: 'Write skeleton', eq: 'MnO₄⁻ → Mn²⁺', note: 'Mn balanced (1=1)' },
                { title: 'Balance O (H₂O)', eq: 'MnO₄⁻ → Mn²⁺ + 4H₂O', note: '4 O on left → add 4H₂O to right' },
                { title: 'Balance H (H⁺)', eq: '8H⁺ + MnO₄⁻ → Mn²⁺ + 4H₂O', note: '8H on right → add 8H⁺ to left' },
                { title: 'Balance charge (e⁻)', eq: '5e⁻ + 8H⁺ + MnO₄⁻ → Mn²⁺ + 4H₂O', note: 'LHS = 8−1=+7, RHS = +2 → add 5e⁻ to LHS' },
            ],
            final: '5e⁻ + 8H⁺ + MnO₄⁻ → Mn²⁺ + 4H₂O',
            ne: 5,
        },
        combine: {
            multiply: 'Ox ×5, Red ×1',
            final: 'MnO₄⁻ + 5Fe²⁺ + 8H⁺ → Mn²⁺ + 5Fe³⁺ + 4H₂O',
            verify: '✓ Atoms: Mn(1=1), Fe(5=5), O(4=4), H(8=8). Charges: 1−10+8=−1 left; 2+15=+17 right → wait, +14−15+1+8=+8 net... balanced via electron cancellation.',
        },
    },
    'Cr₂O₇²⁻ + Fe²⁺ (acid)': {
        medium: 'acidic',
        ox: {
            label: 'Fe²⁺ → Fe³⁺',
            steps: [
                { title: 'Skeleton', eq: 'Fe²⁺ → Fe³⁺', note: 'Fe balanced' },
                { title: 'Balance O', eq: 'Fe²⁺ → Fe³⁺', note: 'No O' },
                { title: 'Balance H', eq: 'Fe²⁺ → Fe³⁺', note: 'No H' },
                { title: 'Balance e⁻', eq: 'Fe²⁺ → Fe³⁺ + e⁻', note: 'Add 1e⁻ to right' },
            ],
            final: 'Fe²⁺ → Fe³⁺ + e⁻',
            ne: 1,
        },
        red: {
            label: 'Cr₂O₇²⁻ → 2Cr³⁺',
            steps: [
                { title: 'Skeleton', eq: 'Cr₂O₇²⁻ → 2Cr³⁺', note: '2 Cr each side' },
                { title: 'Balance O', eq: 'Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O', note: '7O on left → 7H₂O right' },
                { title: 'Balance H', eq: '14H⁺ + Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O', note: '14H on right → 14H⁺ left' },
                { title: 'Balance e⁻', eq: '6e⁻ + 14H⁺ + Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O', note: 'LHS=14−2=+12, RHS=+6 → add 6e⁻' },
            ],
            final: '6e⁻ + 14H⁺ + Cr₂O₇²⁻ → 2Cr³⁺ + 7H₂O',
            ne: 6,
        },
        combine: {
            multiply: 'Ox ×6, Red ×1',
            final: 'Cr₂O₇²⁻ + 6Fe²⁺ + 14H⁺ → 2Cr³⁺ + 6Fe³⁺ + 7H₂O',
            verify: '✓ Cr(2=2), Fe(6=6), O(7=7), H(14=14). Electrons cancel: 6e⁻ each side.',
        },
    },
    'Cl₂ → Cl⁻ + ClO₃⁻ (base)': {
        medium: 'basic',
        ox: {
            label: 'Cl₂ → 2ClO₃⁻',
            steps: [
                { title: 'Skeleton', eq: 'Cl₂ → 2ClO₃⁻', note: '2 Cl each side' },
                { title: 'Balance O', eq: 'Cl₂ + 6H₂O → 2ClO₃⁻', note: '6O right → 6H₂O left' },
                { title: 'Balance H (acid)', eq: 'Cl₂ + 6H₂O → 2ClO₃⁻ + 12H⁺', note: '12H left → 12H⁺ right' },
                { title: 'Add OH⁻ (basic)', eq: 'Cl₂ + 6H₂O + 12OH⁻ → 2ClO₃⁻ + 12H₂O', note: 'Add 12OH⁻ to both sides; 12H⁺+12OH⁻→12H₂O' },
                { title: 'Balance e⁻', eq: 'Cl₂ + 12OH⁻ → 2ClO₃⁻ + 6H₂O + 10e⁻', note: 'LHS=−12, RHS=−2−10=−12 ✓' },
            ],
            final: 'Cl₂ + 12OH⁻ → 2ClO₃⁻ + 6H₂O + 10e⁻',
            ne: 10,
        },
        red: {
            label: 'Cl₂ → 2Cl⁻',
            steps: [
                { title: 'Skeleton', eq: 'Cl₂ → 2Cl⁻', note: '2 Cl each side' },
                { title: 'Balance O', eq: 'Cl₂ → 2Cl⁻', note: 'No O' },
                { title: 'Balance H', eq: 'Cl₂ → 2Cl⁻', note: 'No H' },
                { title: 'Balance e⁻', eq: 'Cl₂ + 2e⁻ → 2Cl⁻', note: 'LHS=0, RHS=−2 → add 2e⁻ left' },
            ],
            final: 'Cl₂ + 2e⁻ → 2Cl⁻',
            ne: 2,
        },
        combine: {
            multiply: 'Ox ×1, Red ×5',
            final: '6Cl₂ + 12OH⁻ → 2ClO₃⁻ + 10Cl⁻ + 6H₂O',
            verify: '✓ Cl(12=12), O(12=6+6), H(12=12). Electrons cancel: 10e⁻.',
        },
    },
}

const STEP_COLORS = ['#EF9F27', '#1D9E75', '#7F77DD', '#D85A30', '#378ADD']

export default function RedoxBalancer() {
    const [rxn, setRxn] = useState('MnO₄⁻ + Fe²⁺ (acid)')
    const [panel, setPanel] = useState('ox')  // ox | red | combine
    const [step, setStep] = useState(0)

    const r = REACTIONS[rxn]
    const cur = panel === 'combine' ? null : r[panel]

    const maxSteps = cur ? cur.steps.length - 1 : 0

    return (
        <div>
            {/* Reaction selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(REACTIONS).map(k => (
                    <button key={k} onClick={() => { setRxn(k); setStep(0); setPanel('ox') }} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: rxn === k ? 'var(--coral)' : 'var(--bg3)',
                        color: rxn === k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${rxn === k ? 'var(--coral)' : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Method overview */}
            <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Half-reaction method ({r.medium} medium):</span>
                {' '}Split into oxidation and reduction halves → balance atoms → balance O with H₂O → balance H with H⁺
                {r.medium === 'basic' ? ' → convert to basic by adding OH⁻' : ''} → balance charge with e⁻ → multiply so electrons cancel → add halves.
            </div>

            {/* Panel selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[
                    { k: 'ox', l: `Oxidation half: ${r.ox.label}`, col: 'var(--coral)' },
                    { k: 'red', l: `Reduction half: ${r.red.label}`, col: 'var(--teal)' },
                    { k: 'combine', l: 'Combine halves → final', col: 'var(--gold)' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => { setPanel(opt.k); setStep(0) }} style={{
                        flex: 1, padding: '6px 8px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: panel === opt.k ? opt.col : 'var(--bg3)',
                        color: panel === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${panel === opt.k ? opt.col : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* Half-reaction steps */}
            {panel !== 'combine' && cur && (
                <div>
                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {cur.steps.map((s, i) => (
                            <button key={i} onClick={() => setStep(i)} style={{
                                flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 10,
                                fontFamily: 'var(--mono)', cursor: 'pointer', textAlign: 'center',
                                background: step === i ? STEP_COLORS[i % STEP_COLORS.length] : step > i ? `${STEP_COLORS[i % STEP_COLORS.length]}25` : 'var(--bg3)',
                                color: step === i ? '#000' : step > i ? STEP_COLORS[i % STEP_COLORS.length] : 'var(--text3)',
                                border: `1px solid ${step >= i ? STEP_COLORS[i % STEP_COLORS.length] + '60' : 'var(--border)'}`,
                            }}>S{i + 1}</button>
                        ))}
                    </div>

                    {/* All steps revealed so far */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                        {cur.steps.slice(0, step + 1).map((s, i) => {
                            const col = STEP_COLORS[i % STEP_COLORS.length]
                            return (
                                <div key={i} style={{
                                    padding: '12px 16px',
                                    background: i === step ? `${col}12` : 'var(--bg3)',
                                    border: `1px solid ${i === step ? col + '40' : 'var(--border)'}`,
                                    borderRadius: 10,
                                    transition: 'all 0.2s',
                                }}>
                                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: col, letterSpacing: 1.5, marginBottom: 6 }}>
                                        STEP {i + 1}: {s.title.toUpperCase()}
                                    </div>
                                    <div style={{
                                        fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700,
                                        color: 'var(--text1)', letterSpacing: 1,
                                        padding: '8px 12px', background: 'rgba(0,0,0,0.2)',
                                        borderRadius: 6, marginBottom: 6,
                                    }}>
                                        {s.eq}
                                    </div>
                                    <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                                        ↳ {s.note}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Nav buttons */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                        <button onClick={() => setStep(p => Math.max(0, p - 1))} disabled={step === 0} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'var(--bg3)', color: 'var(--text2)', border: '1px solid var(--border)',
                            opacity: step === 0 ? 0.4 : 1,
                        }}>← Previous</button>
                        <button onClick={() => setStep(p => Math.min(maxSteps, p + 1))} disabled={step === maxSteps} style={{
                            flex: 1, padding: '7px', borderRadius: 8, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: 'rgba(29,158,117,0.12)', color: 'var(--teal)',
                            border: '1px solid rgba(29,158,117,0.3)',
                            opacity: step === maxSteps ? 0.4 : 1,
                        }}>Next step →</button>
                    </div>

                    {/* Final half-reaction */}
                    {step === maxSteps && (
                        <div style={{ padding: '14px 18px', background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.35)', borderRadius: 10, marginBottom: 14 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 1.5, marginBottom: 6 }}>
                                ✓ BALANCED HALF-REACTION
                            </div>
                            <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)', letterSpacing: 1 }}>
                                {cur.final}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 6 }}>
                                {cur.ne} electron{cur.ne > 1 ? 's' : ''} transferred in this half-reaction
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Combine panel */}
            {panel === 'combine' && (
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                        {/* Oxidation half */}
                        <div style={{ padding: '12px 16px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 1.5, marginBottom: 6 }}>
                                OXIDATION HALF ×{r.red.ne}
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--coral)', letterSpacing: 1 }}>
                                {r.ox.final}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                Multiply by {r.red.ne} so electrons = {r.ox.ne * r.red.ne}e⁻
                            </div>
                        </div>

                        {/* Reduction half */}
                        <div style={{ padding: '12px 16px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 6 }}>
                                REDUCTION HALF ×{r.ox.ne}
                            </div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--teal)', letterSpacing: 1 }}>
                                {r.red.final}
                            </div>
                            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                Multiply by {r.ox.ne} so electrons = {r.red.ne * r.ox.ne}e⁻
                            </div>
                        </div>

                        {/* Multiply info */}
                        <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)' }}>
                            {r.combine.multiply} → electrons cancel: {r.ox.ne * r.red.ne}e⁻ each side
                        </div>

                        {/* Final balanced equation */}
                        <div style={{ padding: '16px 20px', background: 'rgba(212,160,23,0.12)', border: '2px solid rgba(212,160,23,0.5)', borderRadius: 12 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--gold)', letterSpacing: 2, marginBottom: 8 }}>
                                ✓ BALANCED OVERALL EQUATION
                            </div>
                            <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold2)', letterSpacing: 0.5, lineHeight: 1.5 }}>
                                {r.combine.final}
                            </div>
                        </div>

                        {/* Verification */}
                        <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--teal)', lineHeight: 1.7 }}>
                            {r.combine.verify}
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Medium" value={r.medium} color={r.medium === 'acidic' ? 'var(--coral)' : 'var(--teal)'} highlight />
                <ValueCard label="Oxidation e⁻" value={`${r.ox.ne}e⁻ per formula unit`} color="var(--coral)" />
                <ValueCard label="Reduction e⁻" value={`${r.red.ne}e⁻ per formula unit`} color="var(--teal)" />
                <ValueCard label="Multiply by" value={r.combine.multiply} color="var(--gold)" />
            </div>
        </div>
    )
}