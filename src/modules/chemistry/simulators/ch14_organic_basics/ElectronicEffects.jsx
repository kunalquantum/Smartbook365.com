import React, { useState } from 'react'
import { INDUCTIVE_GROUPS } from './helpers/organicData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const ElectronicEffects = () => {
    const [selectedGroup, setSelectedGroup] = useState(INDUCTIVE_GROUPS[0])
    const [theoryTab, setTheoryTab] = useState('inductive')

    return (
        <div style={{ padding: '20px', color: 'white', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', color: 'var(--coral)', marginBottom: '30px' }}>Electronic Effects in Organic Chemistry</h1>

            {/* Tabs for different effects */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
                <button 
                    onClick={() => setTheoryTab('inductive')}
                    style={{
                        padding: '10px 20px',
                        background: theoryTab === 'inductive' ? 'var(--dark-blue)' : 'transparent',
                        border: '1px solid var(--coral)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Inductive Effect
                </button>
                <button 
                    onClick={() => setTheoryTab('resonance')}
                    style={{
                        padding: '10px 20px',
                        background: theoryTab === 'resonance' ? 'var(--dark-blue)' : 'transparent',
                        border: '1px solid var(--coral)',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                    }}
                >
                    Resonance / Mesomeric Effect
                </button>
            </div>

            {theoryTab === 'inductive' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px' }}>
                    <div className="control-panel" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px' }}>
                        <h3>Select Functional Group</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '15px' }}>
                            {INDUCTIVE_GROUPS.map(g => (
                                <button
                                    key={g.group}
                                    onClick={() => setSelectedGroup(g)}
                                    style={{
                                        padding: '8px',
                                        background: selectedGroup.group === g.group ? 'var(--coral)' : 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: '5px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        transition: '0.2s'
                                    }}
                                >
                                    {g.group}
                                </button>
                            ))}
                        </div>

                        <div style={{ marginTop: '30px', padding: '15px', borderLeft: `4px solid ${selectedGroup.col}` }}>
                            <h4>Details for {selectedGroup.group}</h4>
                            <p><strong>Type:</strong> {selectedGroup.type}</p>
                            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                {selectedGroup.type.includes('-I') 
                                    ? 'Electron withdrawing group. Pulls sigma density away from the carbon chain.' 
                                    : 'Electron donating group. Pushes sigma density into the carbon chain.'}
                            </p>
                        </div>
                    </div>

                    <div className="visualization" style={{ background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', position: 'relative' }}>
                        <h3>Inductive Effect Visualisation</h3>
                        <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Permanent displacement of σ-electrons along a saturated chain.</p>
                        
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            {/* Carbon Chain */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                {[3, 2, 1].map(i => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                        <div style={{ 
                                            width: '50px', height: '50px', 
                                            borderRadius: '50%', background: '#888780',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold', fontSize: '1.2rem',
                                            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
                                        }}>
                                            C{i}
                                        </div>
                                        {/* Partial charge delta */}
                                        <div style={{ 
                                            position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)',
                                            color: selectedGroup.type.includes('-I') ? '#FFD700' : '#00E5FF'
                                        }}>
                                            δ{'+'.repeat(i)}
                                        </div>
                                        {/* Induction Arrow */}
                                        <div style={{ 
                                            position: 'absolute', left: '100%', width: '40px', height: '2px', 
                                            background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <div style={{ 
                                                width: '0', height: '0', 
                                                borderTop: '5px solid transparent',
                                                borderBottom: '5px solid transparent',
                                                borderLeft: selectedGroup.type.includes('-I') ? 'none' : '8px solid rgba(255,255,255,0.8)',
                                                borderRight: selectedGroup.type.includes('-I') ? '8px solid rgba(255,255,255,0.8)' : 'none',
                                                opacity: 1 - (i-1)*0.3
                                            }} />
                                        </div>
                                    </div>
                                ))}
                                {/* The Group */}
                                <div style={{ 
                                    width: '60px', height: '60px', 
                                    borderRadius: '50%', background: selectedGroup.col,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1.1rem',
                                    boxShadow: `0 0 15px ${selectedGroup.col}`
                                }}>
                                    {selectedGroup.group}
                                </div>
                                <div style={{ 
                                    position: 'absolute', top: '70px', right: '10px',
                                    color: selectedGroup.type.includes('-I') ? '#F44336' : '#4CAF50',
                                    fontWeight: 'bold'
                                }}>
                                    δ{selectedGroup.type.includes('-I') ? '−' : '+'}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '10px' }}>
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>
                                <strong>Observation:</strong> The effect decreases as distance from the group increases. 
                                By C3, the effect is almost negligible. 
                                {selectedGroup.type.includes('-I') ? 'Electron withdrawing groups (EWG)' : 'Electron donating groups (EDG)'} like {selectedGroup.group} 
                                stabilize {selectedGroup.type.includes('-I') ? 'anions' : 'cations'}.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '25px', borderRadius: '15px' }}>
                    <h3>Resonance (Mesomeric) Effect</h3>
                    <p style={{ opacity: 0.8 }}>Polarity produced in a molecule by the interaction of two π-bonds or between a π-bond and lone pair of electrons.</p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                        <div style={{ padding: '15px', border: '1px solid #1D9E75', borderRadius: '10px' }}>
                            <h4 style={{ color: '#1D9E75' }}>+R / +M Effect</h4>
                            <p style={{ fontSize: '0.9rem' }}>Transfer of electrons is <strong>away</strong> from the group and <strong>towards</strong> the conjugated system.</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Examples: −OH, −NH₂, −OR, −Cl, −I</p>
                            <div style={{ 
                                marginTop: '15px', padding: '10px', background: 'rgba(29, 158, 117, 0.1)', 
                                textAlign: 'center', borderRadius: '5px', fontStyle: 'italic'
                            }}>
                                Increases electron density in the ring (at ortho/para).
                            </div>
                        </div>

                        <div style={{ padding: '15px', border: '1px solid #D85A30', borderRadius: '10px' }}>
                            <h4 style={{ color: '#D85A30' }}>-R / -M Effect</h4>
                            <p style={{ fontSize: '0.9rem' }}>Transfer of electrons is <strong>towards</strong> the group and <strong>away</strong> from the conjugated system.</p>
                            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Examples: −NO₂, −CN, −CHO, −COOH</p>
                            <div style={{ 
                                marginTop: '15px', padding: '10px', background: 'rgba(216, 90, 48, 0.1)', 
                                textAlign: 'center', borderRadius: '5px', fontStyle: 'italic'
                            }}>
                                Decreases electron density in the ring. Deactivates ring.
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px' }}>
                        <h4>Electromeric Effect (E-effect)</h4>
                        <p style={{ fontSize: '0.9rem' }}>A <strong>temporary</strong> effect involving complete transfer of shared π-electrons to one of the atoms in the presence of an attacking reagent.</p>
                        <div style={{ display: 'flex', gap: '40px', marginTop: '15px' }}>
                            <div>
                                <strong style={{ color: 'var(--coral)' }}>+E Effect:</strong> Electrons transfer to the atom where reagent gets attached.
                            </div>
                            <div>
                                <strong style={{ color: 'var(--coral)' }}>-E Effect:</strong> Electrons transfer away from the atom where reagent gets attached.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '40px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px' }}>
                <h3>Summary Table</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Feature</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Inductive Effect</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Resonance Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '10px' }}>Bond involved</td>
                            <td style={{ padding: '10px' }}>σ (Sigma) bonds</td>
                            <td style={{ padding: '10px' }}>π (Pi) bonds or lone pairs</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px' }}>Permanence</td>
                            <td style={{ padding: '10px' }}>Permanent</td>
                            <td style={{ padding: '10px' }}>Permanent</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px' }}>Distance</td>
                            <td style={{ padding: '10px' }}>Decreases rapidly</td>
                            <td style={{ padding: '10px' }}>Travels long distance in conjugated chains</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px' }}>Mechanism</td>
                            <td style={{ padding: '10px' }}>Partial displacement</td>
                            <td style={{ padding: '10px' }}>Complete transfer</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ElectronicEffects
