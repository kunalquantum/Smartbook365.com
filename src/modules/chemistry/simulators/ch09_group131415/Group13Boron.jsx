import { useState, useEffect, useRef } from 'react'
import { GROUP13 } from './helpers/groupData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const COMPOUNDS = {
    'Borax': {
        formula: 'Na₂B₄O₇·10H₂O',
        color: '#7F77DD',
        structure: 'Contains [B₄O₅(OH)₄]²⁻ unit — 2 tetrahedral + 2 trigonal B',
        reactions: [
            { eq: 'Na₂B₄O₇ + H₂SO₄ + 5H₂O → 2NaHSO₄ + 4H₃BO₃', note: 'Acidified → boric acid' },
            { eq: 'Na₂B₄O₇·10H₂O →(heat) Na₂B₄O₇ + 10H₂O', note: 'Loses water on heating → glassy bead' },
            { eq: 'Na₂B₄O₇ + CoO → Co(BO₂)₂ + 2NaBO₂', note: 'Borax bead test — characteristic colour' },
        ],
        uses: ['Borax bead test (qualitative analysis)', 'Laundry detergent booster', 'Antiseptic', 'Glass/ceramics'],
        key: 'Borax bead test: different metal oxides give characteristic colours in molten borax bead.',
    },
    'Boric acid': {
        formula: 'H₃BO₃',
        color: '#1D9E75',
        structure: 'Planar B(OH)₃ units linked by H-bonds — layered structure',
        reactions: [
            { eq: 'H₃BO₃ + H₂O ⇌ [B(OH)₄]⁻ + H⁺', note: 'Lewis acid — accepts OH⁻ (not H⁺ donor!)' },
            { eq: '4H₃BO₃ →(heat) H₂B₄O₇ + 5H₂O', note: 'Dehydrates to tetraboric acid → borax on further heating' },
            { eq: 'H₃BO₃ + 3CH₃OH → B(OCH₃)₃ + 3H₂O', note: 'Trimethyl borate — burns green (flame test)' },
        ],
        uses: ['Mild antiseptic', 'Eye wash', 'Fireproofing wood', 'Manufacture of borosilicate glass'],
        key: 'Boric acid is a weak LEWIS acid — it accepts OH⁻ from water to form [B(OH)₄]⁻, not by donating H⁺.',
    },
    'Diborane': {
        formula: 'B₂H₆',
        color: '#378ADD',
        structure: '4 terminal B-H bonds (2c-2e). 2 bridging B-H-B bonds (3c-2e "banana bonds").',
        reactions: [
            { eq: 'B₂H₆ + 3O₂ → B₂O₃ + 3H₂O', note: 'Burns spontaneously in air — huge energy release' },
            { eq: 'B₂H₆ + 6H₂O → 2H₃BO₃ + 6H₂', note: 'Rapid hydrolysis' },
            { eq: '3B₂H₆ + 6NH₃ → 2B₃N₃H₆ + 12H₂', note: 'Heated at high temp → borazine ("inorganic benzene")' },
        ],
        uses: ['Hydroboration–oxidation of alkenes', 'Propellant in rockets', 'Dopant for semiconductors'],
        key: 'The banana bonds are electron-deficient 3-center 2-electron bonds. This explains its high reactivity.',
    },
    'Aluminium': {
        formula: 'Al',
        color: '#888780',
        structure: 'FCC metal — protected by thin Al₂O₃ layer (passivation)',
        reactions: [
            { eq: '4Al + 3O₂ → 2Al₂O₃', note: 'Oxide layer → passivation in air' },
            { eq: '2Al + 6HCl → 2AlCl₃ + 3H₂', note: 'Reacts with dilute acid' },
            { eq: '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂', note: 'Reacts with base — amphoteric metal' },
            { eq: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe (thermite)', note: 'Highly exothermic — welding rails' },
        ],
        uses: ['Aerospace (lightweight)', 'Food packaging (foil)', 'Electrical wires', 'Thermite welding'],
        key: 'Al is amphoteric — reacts with both acids and bases. The thermite reaction releases enormous heat.',
    },
    'Alums': {
        formula: 'MAl(SO₄)₂·12H₂O',
        color: '#D85A30',
        structure: 'M⁺[Al(H₂O)₆]³⁺ (SO₄²⁻)₂ — double salt with octahedral Al',
        reactions: [
            { eq: 'Al₂(SO₄)₃ + K₂SO₄ + 24H₂O → 2KAl(SO₄)₂·12H₂O', note: 'Potash alum formation' },
            { eq: 'KAl(SO₄)₂·12H₂O →(heat) K₂SO₄ + Al₂O₃ + SO₃ + H₂O', note: 'Thermal decomposition' },
        ],
        uses: ['Water purification (coagulation)', 'Mordant in dyeing', 'Baking powder', 'Styptic pencil'],
        key: 'In water purification, Al³⁺ hydrolyses to form Al(OH)₃ colloid that coagulates suspended particles.',
    },
}

const BORAX_BEAD_COLORS = [
    { metal: 'Co', hot: 'Blue', cold: 'Blue', hotCol: '#378ADD', coldCol: '#378ADD' },
    { metal: 'Cr', hot: 'Green', cold: 'Green', hotCol: '#1D9E75', coldCol: '#1D9E75' },
    { metal: 'Cu', hot: 'Green', cold: 'Blue', hotCol: '#1D9E75', coldCol: '#378ADD' },
    { metal: 'Fe', hot: 'Yellow', cold: 'Yellow', hotCol: '#EF9F27', coldCol: '#EF9F27' },
    { metal: 'Mn', hot: 'Violet', cold: 'Violet', hotCol: '#7F77DD', coldCol: '#7F77DD' },
    { metal: 'Ni', hot: 'Brown', cold: 'Grey', hotCol: '#D85A30', coldCol: '#888780' },
]

export default function Group13Boron() {
    const [compound, setCompound] = useState('Diborane')
    const [mode, setMode] = useState('compound')   // compound | trends | boraxbead
    const [selEl, setSelEl] = useState('B')
    const [trendProp, setTrendProp] = useState('AR')

    const cp = COMPOUNDS[compound]
    const el = GROUP13.find(e => e.sym === selEl)

    const TREND_DATA = {
        AR: { label: 'Atomic radius (pm)', vals: GROUP13.map(e => e.AR), max: 170 },
        IE1: { label: 'IE₁ (kJ/mol)', vals: GROUP13.map(e => e.IE1), max: 800 },
        EN: { label: 'Electronegativity', vals: GROUP13.map(e => e.EN), max: 2.04 },
        mp: { label: 'Melting point (°C)', vals: GROUP13.map(e => e.mp), max: 2076 },
    }
    const td = TREND_DATA[trendProp]

    // Diborane Interactive State
    const [theta, setTheta] = useState(0)

    const drawDiborane = (th) => {
        const rad = th * Math.PI / 180;
        const project = (x, y, z) => {
            const xRot = x * Math.cos(rad) + z * Math.sin(rad);
            const zRot = -x * Math.sin(rad) + z * Math.cos(rad);
            return { px: 200 + xRot * 1.5, py: 120 + y * 1.5, pz: zRot };
        }
        
        const B1 = { id: 'B1', ...project(-35, 0, 0), r: 24, c: '#A8D8B9', lbl: 'B', type: 'B' };
        const B2 = { id: 'B2', ...project(35, 0, 0), r: 24, c: '#A8D8B9', lbl: 'B', type: 'B' };
        const Ht1 = { id: 'Ht1', ...project(-65, -45, 0), r: 16, c: '#FAC775', lbl: 'H', type: 't' };
        const Ht2 = { id: 'Ht2', ...project(-65, 45, 0), r: 16, c: '#FAC775', lbl: 'H', type: 't' };
        const Ht3 = { id: 'Ht3', ...project(65, -45, 0), r: 16, c: '#FAC775', lbl: 'H', type: 't' };
        const Ht4 = { id: 'Ht4', ...project(65, 45, 0), r: 16, c: '#FAC775', lbl: 'H', type: 't' };
        const Hb1 = { id: 'Hb1', ...project(0, 0, 45), r: 18, c: '#378ADD', lbl: 'H', type: 'b' };
        const Hb2 = { id: 'Hb2', ...project(0, 0, -45), r: 18, c: '#378ADD', lbl: 'H', type: 'b' };
        
        const atoms = [B1, B2, Ht1, Ht2, Ht3, Ht4, Hb1, Hb2].sort((a,b) => a.pz - b.pz);
        const bonds = [
            { a: B1, b: Ht1 }, { a: B1, b: Ht2 }, { a: B2, b: Ht3 }, { a: B2, b: Ht4 },
            { a: B1, b: Hb1 }, { a: B2, b: Hb1 }, { a: B1, b: Hb2 }, { a: B2, b: Hb2 }
        ].map(bond => ({ ...bond, mz: (bond.a.pz + bond.b.pz)/2 })).sort((a,b) => a.mz - b.mz)
        return { atoms, bonds }
    }
    const dino = drawDiborane(theta)

    // Borax Bead Interactive State
    const [beadTemp, setBeadTemp] = useState(25)
    const [selM, setSelM] = useState(BORAX_BEAD_COLORS[0])
    const [particles, setParticles] = useState([])
    const TRef = useRef(beadTemp)
    TRef.current = beadTemp

    useEffect(() => {
        if (mode !== 'boraxbead') return
        let frame
        const loop = () => {
            setParticles(prev => {
                let next = prev.map(p => ({...p, y: p.y - 1.5, o: p.o - 0.02, x: p.x + Math.sin(p.y*0.1)*0.5})).filter(p => p.o > 0)
                if (TRef.current > 100 && TRef.current < 740 && Math.random() > 0.4) {
                    next.push({ id: Math.random(), x: 190 + Math.random() * 20, y: 155, o: 1 })
                }
                return next
            })
            frame = requestAnimationFrame(loop)
        }
        frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    }, [mode])

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'compound', l: 'Compounds' }, { k: 'boraxbead', l: 'Borax bead test' }, { k: 'trends', l: 'Group 13 trends' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--purple)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--purple)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            {/* ── COMPOUNDS + DIBORANE 3D ── */}
            {mode === 'compound' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {Object.keys(COMPOUNDS).map(k => (
                            <button key={k} onClick={() => setCompound(k)} style={{
                                padding: '4px 10px', borderRadius: 20, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: compound === k ? COMPOUNDS[k].color : 'var(--bg3)',
                                color: compound === k ? '#000' : 'var(--text2)',
                                border: `1px solid ${compound === k ? COMPOUNDS[k].color : 'var(--border)'}`,
                            }}>{k}</button>
                        ))}
                    </div>

                    {/* Interactive 3D Viewer for Diborane */}
                    {compound === 'Diborane' && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: cp.color, letterSpacing: 2, marginBottom: 12 }}>
                                ⚗ 3D DIBORANE (B₂H₆) BANANA BONDS
                            </div>
                            
                            <ChemSlider label="Rotate 3D View" unit="°" value={theta} min={0} max={360} step={1} onChange={setTheta} color={cp.color} />

                            <svg viewBox="0 0 400 240" style={{ marginTop: 14 }}>
                                {/* Bonds */}
                                {dino.bonds.map((b, i) => (
                                    <line key={`bond-${i}`} x1={b.a.px} y1={b.a.py} x2={b.b.px} y2={b.b.py} stroke="var(--border2)" opacity="0.6" strokeWidth={3} strokeLinecap="round" />
                                ))}

                                {/* Atoms */}
                                {dino.atoms.map(a => (
                                    <g key={a.id}>
                                        <circle cx={a.px} cy={a.py} r={a.r} fill={`${a.c}20`} stroke={a.c} strokeWidth={2} />
                                        <text x={a.px} y={a.py+4} textAnchor="middle" style={{ fontSize: a.r*0.6, fontFamily: 'var(--mono)', fontWeight: 700, fill: a.c }}>{a.lbl}</text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    )}

                    {/* standard info view */}
                    <div style={{ padding: '12px 16px', background: `${cp.color}12`, border: `1px solid ${cp.color}35`, borderRadius: 10, marginBottom: 14 }}>
                        <div style={{ fontSize: 15, fontFamily: 'var(--mono)', fontWeight: 700, color: cp.color, marginBottom: 3 }}>
                            {compound} — {cp.formula}
                        </div>
                        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                            {cp.structure}
                        </div>
                    </div>

                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--gold)', lineHeight: 1.6 }}>
                        ★ {cp.key}
                    </div>

                    <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>KEY REACTIONS</div>
                        {cp.reactions.map((r, i) => (
                            <div key={i} style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 6 }}>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', fontWeight: 700, color: cp.color, marginBottom: 3 }}>{r.eq}</div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{r.note}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {cp.uses.map((u, i) => (
                            <div key={i} style={{ padding: '4px 12px', background: `${cp.color}12`, border: `1px solid ${cp.color}30`, borderRadius: 20, fontSize: 11, fontFamily: 'var(--mono)', color: cp.color }}>
                                {u}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── INTERACTIVE BORAX BEAD TEST ── */}
            {mode === 'boraxbead' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--purple)' }}>Interactive Borax Bead Test:</strong> Select a metal oxide, then heat the borax. Watch it swell (lose water of crystallisation) and melt into a clear glass bead that takes on the characteristic colour of the metal!
                    </div>

                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                        {BORAX_BEAD_COLORS.map(b => (
                            <button key={b.metal} onClick={() => setSelM(b)} style={{
                                padding: '6px 10px', borderRadius: 8, fontSize: 12,
                                fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                background: selM.metal === b.metal ? b.hotCol : 'var(--bg3)',
                                color: selM.metal === b.metal ? '#fff' : 'var(--text2)',
                                border: `1px solid ${selM.metal === b.metal ? b.hotCol : 'var(--border)'}`,
                            }}>{b.metal}</button>
                        ))}
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
                        <ChemSlider label={`Heat Burner (${selM.metal} dipped)`} unit="°C" value={beadTemp} min={25} max={1000} step={5} onChange={setBeadTemp} color="var(--purple)" />
                        
                        <svg viewBox="0 0 400 240" style={{ marginTop: 14 }}>
                            {/* Bunsen Burner abstract */}
                            <path d="M 170 240 L 180 200 L 220 200 L 230 240 Z" fill="rgba(255,255,255,0.03)" stroke="var(--border2)" strokeWidth="2" />
                            <rect x="190" y="160" width="20" height="40" fill="rgba(255,255,255,0.08)" stroke="var(--border2)" strokeWidth="2" />
                            
                            {/* Flame */}
                            {beadTemp > 25 && (
                                <path 
                                    d={`M 180 160 Q 200 ${160 - ((beadTemp-25)/975)*140} 220 160 Z`} 
                                    fill="url(#flameGrad)" opacity="0.8" 
                                />
                            )}
                            <defs>
                                <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#1D9E75" />
                                    <stop offset="50%" stopColor="#378ADD" />
                                    <stop offset="100%" stopColor="transparent" />
                                </linearGradient>
                                <radialGradient id="glare" cx="40%" cy="30%">
                                    <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                                    <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                                </radialGradient>
                            </defs>

                            {/* Platinum Wire Loop */}
                            <path d="M 350 140 L 210 140 A 10 10 0 1 1 210 120" fill="none" stroke="#999" strokeWidth="2" />
                            
                            {/* The Bead */}
                            {(() => {
                                let r = 8
                                let fill = '#fff'
                                let opacity = 1
                                let isGlass = false
                                if (beadTemp < 100) {
                                    r = 8; fill = '#f5f5f5'; // white powder
                                } else if (beadTemp < 740) {
                                    r = 8 + ((beadTemp - 100) / 640) * 12; // swells
                                    fill = '#e0e0e0';
                                } else {
                                    r = 10; // collapses to glass
                                    fill = beadTemp > 850 ? selM.hotCol : selM.coldCol;
                                    isGlass = true;
                                    opacity = 0.85;
                                }
                                return (
                                    <g>
                                        <circle cx="200" cy="130" r={r} fill={fill} opacity={opacity} stroke="#ccc" strokeWidth="0.5" />
                                        {isGlass && <circle cx="200" cy="130" r={r} fill="url(#glare)" />}
                                        <text x="200" y="100" textAnchor="middle" fill={isGlass ? fill : '#ccc'} style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                            {isGlass ? `${selM.metal} (BO₂)₂ glass` : beadTemp > 100 ? 'Swelling...' : 'Na₂B₄O₇·10H₂O'}
                                        </text>
                                    </g>
                                )
                            })()}

                            {/* Steam Particles */}
                            {particles.map(p => (
                                <text key={p.id} x={p.x} y={p.y} fill={`rgba(200,200,255,${p.o})`} style={{ fontSize: 10, fontFamily: 'var(--mono)' }}>H₂O</text>
                            ))}
                        </svg>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
                            <div style={{ padding: '8px', background: 'var(--bg3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', flex: 1, textAlign: 'center', border: `1px solid ${beadTemp < 100 ? 'var(--coral)' : 'var(--border)'}` }}>
                                1. Powder (25°C)
                            </div>
                            <div style={{ padding: '8px', background: 'var(--bg3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', flex: 1, textAlign: 'center', marginLeft: 8, border: `1px solid ${beadTemp >= 100 && beadTemp < 740 ? 'var(--coral)' : 'var(--border)'}` }}>
                                2. Loses water (100°C)
                            </div>
                            <div style={{ padding: '8px', background: 'var(--bg3)', borderRadius: 6, fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)', flex: 1, textAlign: 'center', marginLeft: 8, border: `1px solid ${beadTemp >= 740 ? 'var(--coral)' : 'var(--border)'}` }}>
                                3. Glass bead (740°C+)
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TRENDS ── */}
            {mode === 'trends' && (
                <div>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                        {Object.entries(TREND_DATA).map(([k, v]) => (
                            <button key={k} onClick={() => setTrendProp(k)} style={{
                                flex: 1, padding: '5px', borderRadius: 6, fontSize: 11,
                                fontFamily: 'var(--mono)', cursor: 'pointer',
                                background: trendProp === k ? 'var(--teal)' : 'var(--bg3)',
                                color: trendProp === k ? '#fff' : 'var(--text2)',
                                border: `1px solid ${trendProp === k ? 'var(--teal)' : 'var(--border)'}`,
                            }}>{v.label}</button>
                        ))}
                    </div>

                    {GROUP13.map((e, i) => {
                        const v = td.vals[i]
                        return (
                            <div key={e.sym} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, cursor: 'pointer' }}
                                onClick={() => setSelEl(e.sym)}>
                                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${e.color}20`, border: `1.5px solid ${e.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700, color: e.color, flexShrink: 0 }}>
                                    {e.sym}
                                </div>
                                <div style={{ flex: 1, height: 20, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${(v / td.max) * 100}%`, background: e.sym === selEl ? e.color : `${e.color}60`, borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(0,0,0,0.7)', fontWeight: 700 }}>{v}</span>
                                    </div>
                                </div>
                                <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 50 }}>{e.type}</span>
                            </div>
                        )
                    })}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Focus" value={mode === 'compound' ? compound : mode === 'trends' ? el?.name || 'Group 13' : 'Borax bead test'} color="var(--purple)" highlight />
                <ValueCard label="Group 13 anomaly" value="B is metalloid, others metallic" color="var(--gold)" />
                <ValueCard label="Inert pair effect" value="Tl prefers +1 over +3" color="var(--coral)" />
            </div>
        </div>
    )
}