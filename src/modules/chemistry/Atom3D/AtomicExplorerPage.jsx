import { useState } from 'react'
import Atom3D from './Atom3D'
import { ATOM_DATA, GEOMETRY_DATA } from './AtomData'
import ReactionMixer from './ReactionMixer'
import ChemSlider from '../ui/ChemSlider'

export default function AtomicExplorerPage() {
    const [selElement, setSelElement] = useState(ATOM_DATA[0])
    const [viewMode, setViewMode] = useState('atomic') // 'atomic' | 'geometry'
    
    // Physical Variables
    const [ionCharge, setIonCharge] = useState(0)
    const [excitation, setExcitation] = useState(0)
    const [temperature, setTemperature] = useState(0)
    const [collisionEnergy, setCollisionEnergy] = useState(50)
    
    // Geometry State
    const [selGeo, setSelGeo] = useState(GEOMETRY_DATA[0])

    const [mixA, setMixA] = useState(ATOM_DATA[0]) // Hydrogen
    const [mixB, setMixB] = useState(ATOM_DATA[7]) // Oxygen

    const btnStyle = (active) => ({
        padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, fontFamily: 'var(--mono)', cursor: 'pointer',
        background: active ? 'var(--blue)' : 'var(--bg3)',
        color: active ? '#fff' : 'var(--text2)',
        border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
        transition: 'all 0.2s'
    });

    return (
        <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto', height: '100%', overflowY: 'auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        🔭
                    </div>
                    <div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--text1)', letterSpacing: '-0.5px' }}>3D Atomic Explorer</div>
                        <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>Dedicated Interactive Sandbox for Subatomic Mathematical Visualization</div>
                    </div>
                </div>
            </div>

            {/* View Mode Switcher */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                <button onClick={() => setViewMode('atomic')} style={btnStyle(viewMode === 'atomic')}>⚛️ Atomic Structure</button>
                <button onClick={() => setViewMode('geometry')} style={btnStyle(viewMode === 'geometry')}>📐 Molecular Geometry</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 1fr)', gap: 24, marginBottom: 40 }}>
                {/* Main Visualization Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {viewMode === 'atomic' ? (
                        <>
                            {/* Element Picker */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 8 }}>
                                {ATOM_DATA.map(el => (
                                    <button key={el.z} onClick={() => { setSelElement(el); setIonCharge(0); setExcitation(0); }} style={{
                                        padding: '8px 4px', borderRadius: 8, fontSize: 14,
                                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                                        background: selElement.z === el.z ? 'var(--blue)' : 'var(--bg3)',
                                        color: selElement.z === el.z ? '#fff' : 'var(--text2)',
                                        border: `1px solid ${selElement.z === el.z ? 'var(--blue)' : 'var(--border)'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                        transition: 'all 0.15s'
                                    }}>
                                        <span style={{ fontSize: 18 }}>{el.sym}</span>
                                        <span style={{ fontSize: 9, opacity: 0.8, fontWeight: 400 }}>Z = {el.z}</span>
                                    </button>
                                ))}
                            </div>

                            {/* 3D Viewer */}
                            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                                <Atom3D 
                                    z={selElement.z} 
                                    mass={selElement.mass} 
                                    symbol={selElement.sym} 
                                    name={selElement.name} 
                                    ionCharge={ionCharge}
                                    excitation={excitation}
                                    temperature={temperature}
                                />
                            </div>
                        </>
                    ) : (
                        /* Geometry View */
                        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24 }}>
                            <div style={{ aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, padding: 12, fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>VSEPR GEOMETRY MODE</div>
                                <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
                                    <defs>
                                        <radialGradient id="sphereGrad" cx="30%" cy="30%" r="70%">
                                            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                                            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="200" cy="150" r="15" fill="var(--gold)" />
                                    <circle cx="200" cy="150" r="15" fill="url(#sphereGrad)" />
                                    {selGeo.points.map((p, i) => (
                                        <g key={i}>
                                            <line x1="200" y1="150" x2={200 + p.x} y2={150 - p.y} stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                            <circle cx={200 + p.x} cy={150 - p.y} r="10" fill="var(--blue)" />
                                            <circle cx={200 + p.x} cy={150 - p.y} r="10" fill="url(#sphereGrad)" />
                                        </g>
                                    ))}
                                    <text x="200" y="280" textAnchor="middle" fill="#fff" style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)' }}>{selGeo.name}</text>
                                    <text x="200" y="295" textAnchor="middle" fill="var(--blue)" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>Bond Angle: {selGeo.angle}°</text>
                                </svg>
                            </div>
                        </div>
                    )}
                </div>

                {/* Experiment Controls Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    <div style={{ padding: 24, background: 'var(--bg3)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <h4 style={{ margin: '0 0 20px', fontSize: 14, color: 'var(--blue)', letterSpacing: 1.5, fontWeight: 800 }}>INTERACTIVE EXPERIMENTS</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {/* Variable A: Charge */}
                            <div>
                                <ChemSlider label="Charge State" unit="" value={ionCharge} min={-3} max={3} step={1} onChange={setIonCharge} color="var(--purple)" />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginTop: -6, fontFamily: 'var(--mono)' }}>
                                    <span>Anion</span>
                                    <span>Neutral</span>
                                    <span>Cation</span>
                                </div>
                            </div>

                            {/* Variable B: Energy Level */}
                            <div>
                                <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontFamily: 'var(--mono)', fontWeight: 600 }}>Energy Level / Excitation</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {[0, 1, 2].map(lvl => (
                                        <button key={lvl} onClick={() => setExcitation(lvl)} style={{
                                            flex: 1, padding: '10px 6px', borderRadius: 10, fontSize: 12, fontFamily: 'var(--mono)', cursor: 'pointer',
                                            background: excitation === lvl ? 'var(--gold)' : 'var(--bg2)',
                                            color: excitation === lvl ? '#000' : 'var(--text2)',
                                            border: `1px solid ${excitation === lvl ? 'var(--gold)' : 'var(--border)'}`,
                                            transition: '0.2s'
                                        }}>
                                            {lvl === 0 ? 'Ground' : `Excited n+${lvl}`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {viewMode === 'geometry' ? (
                                /* Geometry Variable */
                                <div>
                                    <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 10, fontFamily: 'var(--mono)', fontWeight: 600 }}>Molecule Geometry</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {GEOMETRY_DATA.map(g => (
                                            <button key={g.name} onClick={() => setSelGeo(g)} style={{
                                                padding: '12px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                                                background: selGeo.name === g.name ? 'rgba(55,138,221,0.15)' : 'var(--bg2)',
                                                border: `1px solid ${selGeo.name === g.name ? 'var(--blue)' : 'var(--border)'}`,
                                                transition: '0.2s', fontSize: 13, color: selGeo.name === g.name ? '#fff' : 'var(--text2)'
                                            }}>
                                                {g.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Physical Variables */
                                <>
                                    <ChemSlider label="Thermal Motion" unit=" K" value={temperature} min={0} max={2000} step={10} onChange={setTemperature} color="var(--coral)" />
                                    <ChemSlider label="Collision Energy" unit="%" value={collisionEnergy} min={10} max={100} step={1} onChange={setCollisionEnergy} color="var(--teal)" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Experimental Status Node */}
                    <div style={{ padding: 20, background: 'rgba(55,138,221,0.05)', borderRadius: 16, border: '1px solid var(--border)', fontSize: 12, lineHeight: 1.6, color: 'var(--text2)' }}>
                        <div style={{ color: 'var(--blue)', fontWeight: 800, marginBottom: 8, letterSpacing: 1 }}>STATUS REPORT</div>
                        {viewMode === 'atomic' ? (
                            <>
                                Stabilizing <strong>{selElement.name}</strong> at {temperature}K. 
                                {ionCharge !== 0 ? ` Ionization has shifted valence electron population.` : ` Electrically neutral.`}
                                {excitation > 0 ? ` Quantum excitation detected.` : ``}
                            </>
                        ) : (
                            <>Visualizing <strong>{selGeo.name}</strong> structural domains with an idealized {selGeo.angle}° bond angle.</>
                        )}
                    </div>
                </div>
            </div>

            {/* Reaction Sandbox Section */}
            <div style={{ borderTop: '2px dashed var(--border)', paddingTop: 40, paddingBottom: 60 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ fontSize: 24 }}>🧪</div>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text1)' }}>Molecular Synthesizer Sandbox</div>
                        <div style={{ fontSize: 12, color: 'var(--text3)' }}>Utilizes {collisionEnergy}% Collision Energy for interatomic structural synthesis</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1fr)', gap: 24, alignItems: 'center', marginBottom: 24 }}>
                    <div style={{ padding: 20, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 12, fontFamily: 'var(--mono)', fontWeight: 700 }}>REAGENT ALPHA</div>
                        <select 
                            value={mixA.z} 
                            onChange={(e) => setMixA(ATOM_DATA.find(x => x.z === parseInt(e.target.value)))}
                            style={{ width: '100%', padding: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: '#fff', borderRadius: 8, fontFamily: 'var(--mono)', outline: 'none' }}
                        >
                            {ATOM_DATA.map(el => <option key={el.z} value={el.z}>{el.sym} - {el.name}</option>)}
                        </select>
                    </div>

                    <div style={{ fontSize: 32, color: 'var(--border)', fontWeight: 300 }}>+</div>

                    <div style={{ padding: 20, background: 'var(--bg2)', borderRadius: 16, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 12, fontFamily: 'var(--mono)', fontWeight: 700 }}>REAGENT BETA</div>
                        <select 
                            value={mixB.z} 
                            onChange={(e) => setMixB(ATOM_DATA.find(x => x.z === parseInt(e.target.value)))}
                            style={{ width: '100%', padding: 10, background: 'var(--bg3)', border: '1px solid var(--border)', color: '#fff', borderRadius: 8, fontFamily: 'var(--mono)', outline: 'none' }}
                        >
                            {ATOM_DATA.map(el => <option key={el.z} value={el.z}>{el.sym} - {el.name}</option>)}
                        </select>
                    </div>
                </div>

                <ReactionMixer atomA={mixA} atomB={mixB} collisionEnergy={collisionEnergy} />
            </div>
        </div>
    )
}
