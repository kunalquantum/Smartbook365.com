import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const MOLECULES = {
    'H₂': { AOs: ['1s', '1s'], totalE: 2, config: '(σ1s)²', BO: 1, mag: 'diamagnetic' },
    'He₂': { AOs: ['1s', '1s'], totalE: 4, config: '(σ1s)²(σ*1s)²', BO: 0, mag: '—' },
    'Li₂': { AOs: ['1s', '2s'], totalE: 6, config: '(σ1s)²(σ*1s)²(σ2s)²', BO: 1, mag: 'diamagnetic' },
    'B₂': { AOs: ['2s', '2p'], totalE: 10, config: 'KK(σ2s)²(σ*2s)²(π2p)²', BO: 1, mag: 'paramagnetic' },
    'C₂': { AOs: ['2s', '2p'], totalE: 12, config: 'KK(σ2s)²(σ*2s)²(π2p)⁴', BO: 2, mag: 'diamagnetic' },
    'N₂': { AOs: ['2s', '2p'], totalE: 14, config: 'KK(σ2s)²(σ*2s)²(π2p)⁴(σ2p)²', BO: 3, mag: 'diamagnetic' },
    'O₂': { AOs: ['2s', '2p'], totalE: 16, config: 'KK(σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)²', BO: 2, mag: 'paramagnetic' },
    'F₂': { AOs: ['2s', '2p'], totalE: 18, config: 'KK(σ2s)²(σ*2s)²(σ2p)²(π2p)⁴(π*2p)⁴', BO: 1, mag: 'diamagnetic' },
    'Ne₂': { AOs: ['2p'], totalE: 20, config: '…(π*2p)⁴(σ*2p)²', BO: 0, mag: '—' },
}

// MO energy levels (simplified, 2s/2p range)
const MO_LEVELS = [
    { label: 'σ*2p', E: 8, bonding: false, type: 'σ', color: '#D85A30' },
    { label: 'π*2p', E: 7, bonding: false, type: 'π', color: '#D85A30', deg: 2 },
    { label: 'σ2p', E: 6, bonding: true, type: 'σ', color: '#1D9E75' },
    { label: 'π2p', E: 5, bonding: true, type: 'π', color: '#1D9E75', deg: 2 },
    { label: 'σ*2s', E: 3.5, bonding: false, type: 'σ', color: '#D85A30' },
    { label: 'σ2s', E: 2.5, bonding: true, type: 'σ', color: '#1D9E75' },
    { label: 'σ*1s', E: 1.5, bonding: false, type: 'σ', color: '#D85A30' },
    { label: 'σ1s', E: 0.5, bonding: true, type: 'σ', color: '#1D9E75' },
]

// How many electrons go in each MO for each molecule
const FILL = {
    'H₂': { 'σ1s': 2 },
    'He₂': { 'σ1s': 2, 'σ*1s': 2 },
    'Li₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2 },
    'B₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'π2p': 2 },
    'C₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'π2p': 4 },
    'N₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'π2p': 4, 'σ2p': 2 },
    'O₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'σ2p': 2, 'π2p': 4, 'π*2p': 2 },
    'F₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'σ2p': 2, 'π2p': 4, 'π*2p': 4 },
    'Ne₂': { 'σ1s': 2, 'σ*1s': 2, 'σ2s': 2, 'σ*2s': 2, 'σ2p': 2, 'π2p': 4, 'π*2p': 4, 'σ*2p': 2 },
}

function electronDots(n, color, x, y, orbW) {
    const dots = []
    // Up arrows first, then down (Hund's for degenerate)
    const positions = n === 1 ? [[0, 1]] : n === 2 ? [[-1, 1], [1, -1]] : []
    if (n === 1) dots.push(<text key={0} x={x} y={y + 5} textAnchor="middle" style={{ fontSize: 14, fill: color, fontFamily: 'var(--mono)' }}>↑</text>)
    else if (n === 2) {
        dots.push(<text key={0} x={x - 5} y={y + 5} textAnchor="middle" style={{ fontSize: 14, fill: color, fontFamily: 'var(--mono)' }}>↑</text>)
        dots.push(<text key={1} x={x + 5} y={y + 5} textAnchor="middle" style={{ fontSize: 14, fill: `${color}90`, fontFamily: 'var(--mono)' }}>↓</text>)
    }
    return dots
}

export default function MOTheory() {
    const [mol, setMol] = useState('O₂')
    const [showBO, setShowBO] = useState(true)

    const m = MOLECULES[mol]
    const fill = FILL[mol] || {}

    // Count bonding and antibonding electrons
    let Nb = 0, Na = 0
    MO_LEVELS.forEach(lv => {
        const n = fill[lv.label] || 0
        if (lv.bonding) Nb += n
        else Na += n
    })
    const BO = (Nb - Na) / 2

    const W = 340, H = 280
    const LEFT_X = 60, RIGHT_X = W - 60
    const MO_X = W / 2
    const E_SCALE = 28
    const E_ZERO = H - 24

    const levelY = (E) => E_ZERO - E * E_SCALE

    return (
        <div>
            {/* Molecule selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(MOLECULES).map(k => {
                    const mo = MOLECULES[k]
                    const isParam = mo.mag === 'paramagnetic'
                    return (
                        <button key={k} onClick={() => setMol(k)} style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 12,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: mol === k ? '#378ADD' : 'var(--bg3)',
                            color: mol === k ? '#fff' : 'var(--text2)',
                            border: `1px solid ${mol === k ? '#378ADD' : isParam ? 'rgba(216,90,48,0.4)' : 'var(--border)'}`,
                        }}>
                            {k}
                            {isParam && <span style={{ fontSize: 8, marginLeft: 2, color: 'var(--coral)' }}>↑↑</span>}
                        </button>
                    )
                })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>

                {/* MO Diagram */}
                <div style={{ background: 'rgba(0,0,0,0.22)', border: '1px solid rgba(55,138,221,0.25)', borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 2, marginBottom: 8 }}>
                        ⚗ MO ENERGY DIAGRAM — {mol}
                    </div>
                    <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                        {/* Energy axis */}
                        <line x1={30} y1={10} x2={30} y2={H - 10}
                            stroke="rgba(255,255,255,0.12)" strokeWidth={0.8} />
                        <text x={26} y={14} textAnchor="end"
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>E↑</text>

                        {/* Atomic orbital levels (left = atom A, right = atom B) */}
                        {[2.5, 5].map((E, i) => {
                            const y = levelY(E)
                            return (
                                <g key={i}>
                                    {/* Left AO */}
                                    <line x1={LEFT_X - 20} y1={y} x2={LEFT_X + 20} y2={y}
                                        stroke="rgba(160,176,200,0.25)" strokeWidth={1.5} />
                                    {/* Right AO */}
                                    <line x1={RIGHT_X - 20} y1={y} x2={RIGHT_X + 20} y2={y}
                                        stroke="rgba(160,176,200,0.25)" strokeWidth={1.5} />
                                    {/* Dashed lines to MO */}
                                    <line x1={LEFT_X + 20} y1={y} x2={MO_X - 35} y2={y + (i === 0 ? 10 : -10)}
                                        stroke="rgba(160,176,200,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                                    <line x1={RIGHT_X - 20} y1={y} x2={MO_X + 35} y2={y + (i === 0 ? 10 : -10)}
                                        stroke="rgba(160,176,200,0.1)" strokeWidth={0.5} strokeDasharray="3 3" />
                                </g>
                            )
                        })}

                        {/* MO levels */}
                        {MO_LEVELS.map((lv, i) => {
                            const y = levelY(lv.E)
                            const isDeg = lv.deg === 2
                            const nElec = fill[lv.label] || 0
                            const isActive = nElec > 0
                            const col = isActive ? lv.color : `${lv.color}40`

                            const offsets = isDeg ? [-18, 18] : [0]

                            return (
                                <g key={lv.label}>
                                    {offsets.map((ox, di) => {
                                        const lineX = MO_X + ox
                                        const ePerOrb = isDeg ? (di === 0 ? Math.min(nElec, 2) : Math.max(0, nElec - 2)) : nElec
                                        return (
                                            <g key={di}>
                                                <line x1={lineX - 16} y1={y} x2={lineX + 16} y2={y}
                                                    stroke={col} strokeWidth={2} strokeLinecap="round" />
                                                {ePerOrb > 0 && electronDots(Math.min(ePerOrb, 2), lv.color, lineX, y - 10, 32)}
                                            </g>
                                        )
                                    })}
                                    {/* Label */}
                                    <text x={MO_X + (isDeg ? 32 : 22)} y={y + 4}
                                        style={{ fontSize: 8, fill: isActive ? lv.color : `${lv.color}50`, fontFamily: 'var(--mono)', fontWeight: isActive ? 700 : 400 }}>
                                        {lv.label}
                                    </text>
                                    {/* * for antibonding */}
                                    {!lv.bonding && (
                                        <text x={MO_X - (isDeg ? 32 : 22) - 4} y={y + 4} textAnchor="end"
                                            style={{ fontSize: 8, fill: `${lv.color}60`, fontFamily: 'var(--mono)' }}>
                                            antibonding
                                        </text>
                                    )}
                                </g>
                            )
                        })}

                        {/* Labels */}
                        <text x={LEFT_X} y={H - 6} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Atom A</text>
                        <text x={MO_X} y={H - 6} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>MOs</text>
                        <text x={RIGHT_X} y={H - 6} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Atom B</text>
                    </svg>
                </div>

                {/* Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Bond order */}
                    <div style={{ padding: '14px 16px', background: 'rgba(55,138,221,0.1)', border: '1px solid rgba(55,138,221,0.3)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 1.5, marginBottom: 8 }}>
                            BOND ORDER CALCULATION
                        </div>
                        <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.8 }}>
                            BO = (Nb − Na) / 2
                            <br />= ({Nb} − {Na}) / 2
                            <br /><span style={{ color: '#378ADD', fontWeight: 700, fontSize: 16 }}>= {BO}</span>
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 6 }}>
                            {BO === 0 ? '⚠ BO = 0 → molecule does not exist' : BO === 1 ? 'Single bond' : BO === 2 ? 'Double bond' : BO === 3 ? 'Triple bond' : `Bond order ${BO}`}
                        </div>
                    </div>

                    {/* Electron count */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                            ELECTRON COUNT
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: '#1D9E75' }}>{Nb}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Bonding e⁻</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: '#D85A30' }}>{Na}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Antibonding e⁻</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 20, fontFamily: 'var(--mono)', fontWeight: 700, color: '#378ADD' }}>{Nb + Na}</div>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>Total e⁻</div>
                            </div>
                        </div>
                    </div>

                    {/* Magnetic property */}
                    <div style={{
                        padding: '12px 14px',
                        background: m.mag === 'paramagnetic' ? 'rgba(216,90,48,0.1)' : 'rgba(29,158,117,0.08)',
                        border: `1px solid ${m.mag === 'paramagnetic' ? 'rgba(216,90,48,0.3)' : 'rgba(29,158,117,0.25)'}`,
                        borderRadius: 10,
                    }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: m.mag === 'paramagnetic' ? 'var(--coral)' : 'var(--teal)', letterSpacing: 1.5, marginBottom: 6 }}>
                            MAGNETIC PROPERTY
                        </div>
                        <div style={{ fontSize: 14, fontFamily: 'var(--mono)', fontWeight: 700, color: m.mag === 'paramagnetic' ? 'var(--coral)' : 'var(--teal)' }}>
                            {m.mag}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                            {m.mag === 'paramagnetic' ? 'Has unpaired electrons — attracted to magnetic field' : m.mag === 'diamagnetic' ? 'All electrons paired — weakly repelled by magnetic field' : 'Does not exist as a stable molecule'}
                        </div>
                    </div>

                    {/* Configuration */}
                    <div style={{ padding: '12px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 6 }}>
                            MO CONFIGURATION
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text1)', lineHeight: 1.7, wordBreak: 'break-word' }}>
                            {m.config}
                        </div>
                    </div>

                    {/* Key concept */}
                    <div style={{ padding: '12px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 10, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <span style={{ color: 'var(--gold)', fontWeight: 700 }}>O₂ paradox:</span> Lewis structure predicts O₂ as diamagnetic — but MO theory correctly predicts it as <strong>paramagnetic</strong> (2 unpaired electrons in degenerate π*2p). This was a triumph of MO theory.
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Molecule" value={mol} color="#378ADD" highlight />
                <ValueCard label="Bond order" value={`${BO}`} color="var(--gold)" />
                <ValueCard label="Magnetic" value={m.mag} color={m.mag === 'paramagnetic' ? 'var(--coral)' : 'var(--teal)'} />
                <ValueCard label="Total e⁻" value={`${Nb + Na}`} color="var(--text2)" />
            </div>
        </div>
    )
}