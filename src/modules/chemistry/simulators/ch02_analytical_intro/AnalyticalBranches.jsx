import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

// ── data ──────────────────────────────────────────────────────────────────
const TREE = {
    root: {
        label: 'Analytical Chemistry',
        desc: 'The science of obtaining, processing and communicating information about the composition and structure of matter.',
        color: 'var(--gold)',
    },
    branches: [
        {
            id: 'qual',
            label: 'Qualitative Analysis',
            question: 'WHAT is present?',
            color: '#1D9E75',
            desc: 'Identifies which substances or elements are present in a sample. Does NOT tell us how much.',
            methods: [
                { name: 'Flame test', detail: 'Metal ions produce characteristic colours in a flame. Na⁺ → yellow, K⁺ → lilac, Ca²⁺ → brick red.' },
                { name: 'Precipitation test', detail: 'Add a reagent that forms an insoluble precipitate with the target ion. AgNO₃ + Cl⁻ → AgCl↓ (white).' },
                { name: 'Chromatography (id)', detail: 'Compare Rf values to known standards — identifies components in a mixture.' },
                { name: 'Spectroscopy (id)', detail: 'Compare absorption/emission spectra to reference spectra for identification.' },
            ],
        },
        {
            id: 'quant',
            label: 'Quantitative Analysis',
            question: 'HOW MUCH is present?',
            color: '#D85A30',
            desc: 'Determines the exact amount or concentration of a substance. Gives a numerical answer with units.',
            methods: [
                { name: 'Gravimetry', detail: 'Precipitate the analyte, filter, dry and weigh. Mass gives amount directly. E.g., Ba²⁺ precipitated as BaSO₄.' },
                { name: 'Titrimetry', detail: 'React analyte with a standard solution until endpoint (indicator colour change). Volume × molarity = moles.' },
                { name: 'Colorimetry', detail: "Beer-Lambert law: A = εlc. Absorbance ∝ concentration. Use a calibration curve." },
                { name: 'Potentiometry', detail: 'Measure cell potential (Nernst equation). pH meter is a common example.' },
            ],
        },
    ],
    approach: [
        {
            id: 'classical',
            label: 'Classical Methods',
            color: '#7F77DD',
            desc: 'Rely on chemical reactions and physical measurements of mass, volume or temperature.',
            examples: ['Gravimetric analysis', 'Acid-base titration', 'Redox titration', 'Complexometric titration'],
            pros: 'Inexpensive, no specialised equipment needed.',
            cons: 'Slower, may need large sample, less sensitive.',
        },
        {
            id: 'instrumental',
            label: 'Instrumental Methods',
            color: '#378ADD',
            desc: 'Use instruments that measure physical properties: light absorption, electrical signals, mass, etc.',
            examples: ['UV-Vis spectrophotometry', 'Atomic absorption spectroscopy', 'HPLC', 'GC-MS', 'NMR'],
            pros: 'Fast, very sensitive, can handle trace amounts.',
            cons: 'Expensive instruments, need calibration standards.',
        },
    ],
}

const FLAME_COLORS = {
    'Na⁺': { color: '#FFD700', flame: '#FF8C00', desc: 'Yellow — very intense' },
    'K⁺': { color: '#DA70D6', flame: '#9B30FF', desc: 'Lilac / violet' },
    'Ca²⁺': { color: '#FF6347', flame: '#FF4500', desc: 'Brick red' },
    'Sr²⁺': { color: '#FF0000', flame: '#CC0000', desc: 'Crimson red' },
    'Ba²⁺': { color: '#90EE90', flame: '#228B22', desc: 'Apple green' },
    'Cu²⁺': { color: '#00CED1', flame: '#008080', desc: 'Blue-green' },
    'Li⁺': { color: '#FF69B4', flame: '#DC143C', desc: 'Crimson red' },
}

export default function AnalyticalBranches() {
    const [tab, setTab] = useState('map')       // map | flame | titration
    const [selBranch, setSelBranch] = useState(null)
    const [selAppr, setSelAppr] = useState(null)
    const [selMethod, setSelMethod] = useState(null)
    const [flameIon, setFlameIon] = useState('Na⁺')
    const [burette, setBurette] = useState(0)           // mL added
    const [analConc, setAnalConc] = useState(0.1)         // M analyte
    const [analVol, setAnalVol] = useState(25)          // mL analyte
    const [titConc, setTitConc] = useState(0.1)         // M titrant

    // Titration endpoint
    const moles_analyte = analConc * analVol / 1000
    const endpoint_mL = (moles_analyte / titConc) * 1000
    const burette_moles = titConc * burette / 1000
    const excess = burette_moles - moles_analyte
    const pH_approx = burette < endpoint_mL
        ? Math.max(1, 7 - Math.log10(Math.max(1e-14, (moles_analyte - burette_moles) / ((analVol + burette) / 1000))))
        : Math.min(13, 7 + Math.log10(Math.max(1e-14, excess / ((analVol + burette) / 1000))))
    const nearEndpoint = Math.abs(burette - endpoint_mL) < 0.5
    const pastEndpoint = burette > endpoint_mL + 0.1

    const indicatorColor =
        pH_approx < 4 ? '#FF4444' :
            pH_approx < 7 ? '#FF9944' :
                pH_approx < 8 ? '#FFFF44' :
                    pH_approx < 10 ? '#88EE44' :
                        '#4488FF'

    return (
        <div>
            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {[
                    { k: 'map', l: 'Branch Map' },
                    { k: 'flame', l: 'Flame Test Lab' },
                    { k: 'titration', l: 'Titration Sim' },
                ].map(t => (
                    <button key={t.k} onClick={() => { setTab(t.k); setSelBranch(null); setSelAppr(null); setSelMethod(null) }} style={{
                        padding: '6px 14px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: tab === t.k ? 'var(--gold)' : 'var(--bg3)',
                        color: tab === t.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${tab === t.k ? 'var(--gold)' : 'var(--border2)'}`,
                    }}>{t.l}</button>
                ))}
            </div>

            {/* ── TAB: BRANCH MAP ── */}
            {tab === 'map' && (
                <div>
                    {/* Root node */}
                    <div style={{
                        textAlign: 'center', padding: '12px 20px', marginBottom: 16,
                        background: 'rgba(212,160,23,0.1)', border: '2px solid var(--gold)',
                        borderRadius: 12, fontSize: 15, fontWeight: 700,
                        fontFamily: 'var(--mono)', color: 'var(--gold)',
                    }}>
                        {TREE.root.label}
                        <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text3)', marginTop: 4 }}>
                            {TREE.root.desc}
                        </div>
                    </div>

                    {/* Qual / Quant */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                        {TREE.branches.map(b => (
                            <div key={b.id}
                                onClick={() => { setSelBranch(selBranch === b.id ? null : b.id); setSelMethod(null) }}
                                style={{
                                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                                    background: selBranch === b.id ? `${b.color}20` : 'var(--bg3)',
                                    border: `2px solid ${selBranch === b.id ? b.color : 'var(--border)'}`,
                                    transition: 'all 0.15s',
                                }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: b.color, marginBottom: 4 }}>
                                    {b.label}
                                </div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--gold)', marginBottom: 6 }}>
                                    → {b.question}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>
                                    {b.desc}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Methods for selected branch */}
                    {selBranch && (() => {
                        const b = TREE.branches.find(x => x.id === selBranch)
                        return (
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: 1.5, marginBottom: 8 }}>
                                    METHODS — {b.label.toUpperCase()}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {b.methods.map(m => (
                                        <div key={m.name}
                                            onClick={() => setSelMethod(selMethod === m.name ? null : m.name)}
                                            style={{
                                                padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                                                background: selMethod === m.name ? `${b.color}18` : 'var(--bg3)',
                                                border: `1px solid ${selMethod === m.name ? b.color : 'var(--border)'}`,
                                            }}>
                                            <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: b.color }}>
                                                {m.name}
                                            </div>
                                            {selMethod === m.name && (
                                                <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6, lineHeight: 1.5 }}>
                                                    {m.detail}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })()}

                    {/* Classical / Instrumental */}
                    <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', letterSpacing: 1.5, marginBottom: 8 }}>
                        APPROACH
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {TREE.approach.map(a => (
                            <div key={a.id}
                                onClick={() => setSelAppr(selAppr === a.id ? null : a.id)}
                                style={{
                                    padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                                    background: selAppr === a.id ? `${a.color}18` : 'var(--bg3)',
                                    border: `2px solid ${selAppr === a.id ? a.color : 'var(--border)'}`,
                                }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: a.color, marginBottom: 6 }}>
                                    {a.label}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5, marginBottom: selAppr === a.id ? 8 : 0 }}>
                                    {a.desc}
                                </div>
                                {selAppr === a.id && (
                                    <div>
                                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4, marginTop: 4 }}>EXAMPLES</div>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                                            {a.examples.map(e => (
                                                <span key={e} style={{
                                                    fontSize: 10, fontFamily: 'var(--mono)', padding: '2px 8px',
                                                    borderRadius: 20, background: `${a.color}15`, color: a.color,
                                                }}>{e}</span>
                                            ))}
                                        </div>
                                        <div style={{ fontSize: 11, color: 'var(--teal)', marginBottom: 3 }}>✓ {a.pros}</div>
                                        <div style={{ fontSize: 11, color: 'var(--coral)', marginBottom: 0 }}>✗ {a.cons}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── TAB: FLAME TEST ── */}
            {tab === 'flame' && (
                <div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.6 }}>
                        Flame tests identify metal ions by the characteristic colour they produce. Dip a clean platinum wire into the ion solution, then hold it in a hot blue flame.
                    </div>

                    {/* Ion selector */}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
                        {Object.keys(FLAME_COLORS).map(ion => (
                            <button key={ion} onClick={() => setFlameIon(ion)} style={{
                                padding: '6px 14px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 600,
                                background: flameIon === ion ? FLAME_COLORS[ion].color + '40' : 'var(--bg3)',
                                color: flameIon === ion ? FLAME_COLORS[ion].color : 'var(--text2)',
                                border: `2px solid ${flameIon === ion ? FLAME_COLORS[ion].color : 'var(--border)'}`,
                            }}>{ion}</button>
                        ))}
                    </div>

                    {/* Flame visualisation */}
                    {(() => {
                        const fc = FLAME_COLORS[flameIon]
                        return (
                            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 20 }}>
                                {/* Flame SVG */}
                                <div style={{ flexShrink: 0 }}>
                                    <svg width={120} height={160} viewBox="0 0 120 160">
                                        {/* Bunsen burner base */}
                                        <rect x={44} y={140} width={32} height={16} rx={4}
                                            fill="rgba(160,176,200,0.3)" stroke="rgba(160,176,200,0.4)" strokeWidth={1} />
                                        <rect x={52} y={110} width={16} height={32} rx={3}
                                            fill="rgba(160,176,200,0.2)" stroke="rgba(160,176,200,0.3)" strokeWidth={1} />
                                        {/* Blue base flame */}
                                        <ellipse cx={60} cy={108} rx={12} ry={6}
                                            fill="rgba(55,138,221,0.5)" />
                                        {/* Main coloured flame — layered for glow effect */}
                                        <ellipse cx={60} cy={76} rx={22} ry={36}
                                            fill={`${fc.flame}30`} />
                                        <ellipse cx={60} cy={80} rx={16} ry={28}
                                            fill={`${fc.flame}50`} />
                                        <ellipse cx={60} cy={84} rx={10} ry={20}
                                            fill={`${fc.color}80`} />
                                        <ellipse cx={60} cy={88} rx={6} ry={14}
                                            fill={fc.color} />
                                        {/* Wire */}
                                        <line x1={60} y1={60} x2={60} y2={30}
                                            stroke="rgba(160,176,200,0.6)" strokeWidth={2} />
                                        <circle cx={60} cy={28} r={4}
                                            fill={fc.color} opacity={0.9} />
                                        {/* Glow ring */}
                                        <circle cx={60} cy={80} r={30}
                                            fill="none" stroke={fc.color} strokeWidth={1} opacity={0.15} />
                                    </svg>
                                </div>

                                {/* Info card */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: 28, fontWeight: 700, fontFamily: 'var(--mono)',
                                        color: fc.color, marginBottom: 6,
                                    }}>{flameIon}</div>
                                    <div style={{
                                        display: 'inline-block', padding: '4px 14px', borderRadius: 20,
                                        background: `${fc.color}25`, border: `1px solid ${fc.color}60`,
                                        fontSize: 13, fontFamily: 'var(--mono)', color: fc.color,
                                        marginBottom: 12,
                                    }}>
                                        {fc.desc}
                                    </div>
                                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                                        {flameIon === 'Na⁺' && 'Sodium gives an intensely bright yellow colour. Even trace amounts mask other colours — use cobalt blue glass to filter Na⁺ when looking for K⁺.'}
                                        {flameIon === 'K⁺' && "Potassium gives a lilac/violet colour visible through cobalt blue glass. The colour is easily masked by sodium contamination."}
                                        {flameIon === 'Ca²⁺' && "Calcium gives a brick-red or orange-red colour. Useful for distinguishing Ca²⁺ from Sr²⁺ (crimson) and Ba²⁺ (green)."}
                                        {flameIon === 'Sr²⁺' && "Strontium gives a deep crimson red — used in red fireworks and flares. More intense red than calcium."}
                                        {flameIon === 'Ba²⁺' && "Barium gives an apple-green colour. Used in green fireworks. Note: barium compounds are toxic."}
                                        {flameIon === 'Cu²⁺' && "Copper gives a distinctive blue-green or verdigris colour. Easily recognised — used in blue/green fireworks."}
                                        {flameIon === 'Li⁺' && "Lithium gives a crimson red, similar to strontium. Distinguished by other tests. Used in red emergency flares."}
                                    </div>
                                </div>
                            </div>
                        )
                    })()}

                    {/* Comparison table */}
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>Ion</th>
                                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>Flame colour</th>
                                    <th style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', fontWeight: 400 }}>Element</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(FLAME_COLORS).map(([ion, fc]) => (
                                    <tr key={ion}
                                        onClick={() => setFlameIon(ion)}
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            background: flameIon === ion ? `${fc.color}15` : 'transparent',
                                            cursor: 'pointer',
                                        }}>
                                        <td style={{ padding: '8px 14px', fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: fc.color }}>{ion}</td>
                                        <td style={{ padding: '8px 14px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: fc.color }} />
                                                <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{fc.desc}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '8px 14px', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                                            {ion.replace(/[⁺²⁺]/g, '').replace('+', '').replace('2', '').replace('⁺', '')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ── TAB: TITRATION ── */}
            {tab === 'titration' && (
                <div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.6 }}>
                        Strong acid–strong base titration. Add titrant (NaOH) from the burette into the analyte (HCl) flask. Watch the pH change and indicator colour shift at the endpoint.
                    </div>

                    {/* Setup controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                        {[
                            { label: 'Analyte (HCl) conc', unit: ' M', val: analConc, min: 0.01, max: 0.5, step: 0.01, fn: setAnalConc },
                            { label: 'Analyte volume', unit: ' mL', val: analVol, min: 5, max: 50, step: 1, fn: setAnalVol },
                            { label: 'Titrant (NaOH) conc', unit: ' M', val: titConc, min: 0.01, max: 0.5, step: 0.01, fn: setTitConc },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 5 }}>
                                    {s.label}
                                </div>
                                <input type="number" value={s.val} min={s.min} max={s.max} step={s.step}
                                    onChange={e => s.fn(Number(e.target.value))}
                                    style={{
                                        width: '100%', background: 'var(--bg3)', border: '1px solid var(--border2)',
                                        color: 'var(--text1)', borderRadius: 6, padding: '6px 10px',
                                        fontFamily: 'var(--mono)', fontSize: 12,
                                    }} />
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 2 }}>{s.unit.trim()}</div>
                            </div>
                        ))}
                    </div>

                    {/* Burette slider */}
                    <div style={{ marginBottom: 20 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12, fontFamily: 'var(--mono)' }}>
                            <span style={{ color: 'var(--text2)' }}>Volume of NaOH added</span>
                            <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{burette.toFixed(2)} mL</span>
                        </div>
                        <input type="range" min={0} max={endpoint_mL * 2} step={0.1}
                            value={burette}
                            onChange={e => setBurette(Number(e.target.value))}
                            style={{ width: '100%', accentColor: 'var(--gold)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 3 }}>
                            <span>0 mL</span>
                            <span style={{ color: 'rgba(29,158,117,0.7)' }}>Endpoint: {endpoint_mL.toFixed(2)} mL</span>
                            <span>{(endpoint_mL * 2).toFixed(1)} mL</span>
                        </div>
                    </div>

                    {/* Apparatus + graph side by side */}
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 16, marginBottom: 16 }}>
                        {/* Conical flask */}
                        <div>
                            <svg width={120} height={160} viewBox="0 0 120 160">
                                {/* Burette drip */}
                                <rect x={55} y={5} width={10} height={30} rx={3}
                                    fill="rgba(160,176,200,0.2)" stroke="rgba(160,176,200,0.3)" strokeWidth={1} />
                                <circle cx={60} cy={38} r={3}
                                    fill="rgba(55,138,221,0.8)"
                                    opacity={burette > 0 ? 0.9 : 0} />

                                {/* Flask body */}
                                <path d="M 35 65 L 20 130 Q 20 145 35 145 L 85 145 Q 100 145 100 130 L 85 65 Z"
                                    fill={indicatorColor + '35'}
                                    stroke="rgba(160,176,200,0.4)" strokeWidth={1.5} />

                                {/* Flask neck */}
                                <rect x={47} y={40} width={26} height={28} rx={3}
                                    fill={indicatorColor + '20'}
                                    stroke="rgba(160,176,200,0.3)" strokeWidth={1} />

                                {/* Liquid level — rises as volume added */}
                                {(() => {
                                    const fillH = Math.min(70, 10 + (burette / (endpoint_mL * 2)) * 60)
                                    return (
                                        <path d={`M 25 ${145 - fillH} Q 40 ${145 - fillH - 4} 60 ${145 - fillH} Q 80 ${145 - fillH - 4} 95 ${145 - fillH} L 100 130 Q 100 145 85 145 L 35 145 Q 20 145 20 130 Z`}
                                            fill={indicatorColor + '60'} />
                                    )
                                })()}

                                {/* Endpoint flash */}
                                {nearEndpoint && (
                                    <circle cx={60} cy={110} r={35}
                                        fill="none" stroke="var(--gold)" strokeWidth={2} opacity={0.5}
                                        strokeDasharray="6 4" />
                                )}
                            </svg>
                            <div style={{ textAlign: 'center', fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                                pH ≈ {pH_approx.toFixed(2)}
                            </div>
                        </div>

                        {/* pH curve */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 10px' }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 1.5, marginBottom: 8 }}>
                                pH CURVE
                            </div>
                            {(() => {
                                const W = 260, H = 110
                                const maxV = endpoint_mL * 2
                                const pts = Array.from({ length: 200 }, (_, i) => {
                                    const v = (i / 199) * maxV
                                    const mb = titConc * v / 1000
                                    const ma = analConc * analVol / 1000
                                    const ex = mb - ma
                                    const vol = (analVol + v) / 1000
                                    let pH
                                    if (Math.abs(ex) < 1e-9) { pH = 7 }
                                    else if (ex < 0) { pH = Math.max(0, -Math.log10(Math.abs(ex) / vol)) }
                                    else { pH = Math.min(14, 14 + Math.log10(ex / vol)) }
                                    return { x: 10 + (v / maxV) * (W - 20), y: 10 + (1 - pH / 14) * (H - 20) }
                                })
                                const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
                                const curX = 10 + (burette / maxV) * (W - 20)
                                const curY = 10 + (1 - pH_approx / 14) * (H - 20)
                                const epX = 10 + (endpoint_mL / maxV) * (W - 20)

                                return (
                                    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                                        {/* Grid lines */}
                                        {[0, 7, 14].map(pH => {
                                            const y = 10 + (1 - pH / 14) * (H - 20)
                                            return (
                                                <g key={pH}>
                                                    <line x1={10} y1={y} x2={W - 10} y2={y}
                                                        stroke="rgba(255,255,255,0.07)" strokeWidth={0.5} />
                                                    <text x={6} y={y + 3} textAnchor="end"
                                                        style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                                        {pH}
                                                    </text>
                                                </g>
                                            )
                                        })}
                                        {/* Endpoint line */}
                                        <line x1={epX} y1={10} x2={epX} y2={H - 10}
                                            stroke="rgba(29,158,117,0.4)" strokeWidth={1} strokeDasharray="4 3" />
                                        <text x={epX + 2} y={18}
                                            style={{ fontSize: 8, fill: 'rgba(29,158,117,0.6)', fontFamily: 'var(--mono)' }}>
                                            EP
                                        </text>
                                        {/* Curve */}
                                        <path d={pathD} fill="none" stroke="#EF9F27" strokeWidth={2} />
                                        {/* Current point */}
                                        <circle cx={curX} cy={Math.max(12, Math.min(H - 12, curY))} r={5}
                                            fill={indicatorColor} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                                        {/* Axes */}
                                        <line x1={10} y1={H - 10} x2={W - 10} y2={H - 10}
                                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                                        <text x={W - 8} y={H - 4} textAnchor="end"
                                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                            vol NaOH (mL)
                                        </text>
                                    </svg>
                                )
                            })()}
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{
                        padding: '10px 14px', borderRadius: 8, marginBottom: 14,
                        background: pastEndpoint
                            ? 'rgba(216,90,48,0.1)'
                            : nearEndpoint
                                ? 'rgba(212,160,23,0.1)'
                                : 'rgba(29,158,117,0.08)',
                        border: `1px solid ${pastEndpoint ? 'rgba(216,90,48,0.3)' : nearEndpoint ? 'rgba(212,160,23,0.3)' : 'rgba(29,158,117,0.2)'}`,
                        fontFamily: 'var(--mono)', fontSize: 12,
                        color: pastEndpoint ? 'var(--coral)' : nearEndpoint ? 'var(--gold)' : 'var(--teal)',
                    }}>
                        {pastEndpoint
                            ? `Past endpoint — excess NaOH = ${(excess * 1000).toFixed(3)} mmol`
                            : nearEndpoint
                                ? '⚡ Near endpoint! Watch for colour change'
                                : `${((moles_analyte - burette_moles) * 1000).toFixed(3)} mmol HCl remaining`}
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Endpoint volume" value={`${endpoint_mL.toFixed(2)} mL`} color="var(--teal)" highlight />
                        <ValueCard label="Moles of HCl" value={`${(moles_analyte * 1000).toFixed(3)} mmol`} color="var(--coral)" />
                        <ValueCard label="pH now" value={pH_approx.toFixed(2)} color="var(--gold)" />
                        <ValueCard label="NaOH added" value={`${burette.toFixed(2)} mL`} color="var(--text2)" />
                    </div>
                </div>
            )}
        </div>
    )
}