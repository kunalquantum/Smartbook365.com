import { useState, useEffect, useRef } from 'react'
import Atom3D from './Atom3D'

// Helper: GCD for balancing
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const lcm = (a, b) => (a * b) / gcd(a, b);

function calculateReaction(atomA, atomB) {
    if (atomA.group === 18 || atomB.group === 18) return null;

    const isSame = atomA.sym === atomB.sym;

    const getValency = (group) => {
        if (group === 1) return 1;
        if (group === 2) return 2;
        if (group === 13) return 3;
        if (group === 14) return 4;
        if (group === 15) return 3;
        if (group === 16) return 2;
        if (group === 17) return 1;
        return 0;
    }

    // Formatting
    const sub = (num) => num <= 1 ? '' : num.toString().split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');
    const coef = (num) => num <= 1 ? '' : num.toString();

    if (isSame) {
        if (atomA.diatomic) {
            return {
                product: `${atomA.sym}${sub(2)}`,
                eq: `${atomA.sym} + ${atomA.sym} → ${atomA.sym}${sub(2)}(g)`,
                type: 'Covalent',
                desc: `Two ${atomA.name} atoms sharing electrons to form a diatomic molecule.`
            }
        } else {
            return {
                product: `${atomA.sym}${sub(2)}`,
                eq: `${atomA.sym} + ${atomA.sym} → 2${atomA.sym}`,
                type: 'Metallic',
                desc: `Two ${atomA.name} atoms mixed. No chemical bond formed between identical metals in this sandbox.`
            }
        }
    }

    const vA = getValency(atomA.group);
    const vB = getValency(atomB.group);
    if (vA === 0 || vB === 0) return null;

    // Empirical formula ratio: A_n B_m
    // Cross valencies
    let n = vB;
    let m = vA;
    const g = gcd(n, m);
    n /= g;
    m /= g;

    // Reactant multiplicities (diatomic = 2, mono = 1)
    const x = atomA.diatomic ? 2 : 1;
    const y = atomB.diatomic ? 2 : 1;

    // Balance: p*A_x + q*B_y -> r*A_n B_m
    // atom conservation: p*x = r*n, q*y = r*m
    // r must be a multiple of x/gcd(x,n) and y/gcd(y,m)
    const r = lcm(x / gcd(x, n), y / gcd(y, m));
    const p = (r * n) / x;
    const q = (r * m) / y;

    const product = `${atomA.sym}${sub(n)}${atomB.sym}${sub(m)}`;
    const reactantA = `${atomA.sym}${sub(x)}`;
    const reactantB = `${atomB.sym}${sub(y)}`;
    
    const equation = `${coef(p)}${reactantA} + ${coef(q)}${reactantB} → ${coef(r)}${product}`;
    
    return {
        product,
        eq: equation,
        type: (atomA.group < 13 && atomB.group > 13) || (atomB.group < 13 && atomA.group > 13) ? 'Ionic' : 'Covalent',
        desc: `Reaction between ${atomA.name} and ${atomB.name}.`
    };
}

export default function ReactionMixer({ atomA, atomB, collisionEnergy = 50 }) {
    const [phase, setPhase] = useState('idle') // idle, moving, reaction, result, inert
    const [progress, setProgress] = useState(0)
    const [reaction, setReaction] = useState(null)
    const rafRef = useRef()
    
    // speed inversely proportional to energy (lower duration = faster)
    const duration = 2.5 - (collisionEnergy / 100) * 2; 

    const isInert = atomA.group === 18 || atomB.group === 18

    useEffect(() => {
        setPhase('idle')
        setProgress(0)
        setReaction(calculateReaction(atomA, atomB))
    }, [atomA, atomB])

    useEffect(() => {
        if (phase === 'moving') {
            const start = performance.now()
            const loop = (time) => {
                const elapsed = (time - start) / 1000
                const p = Math.min(1, elapsed / duration)
                setProgress(p)
                if (p < 1) {
                    rafRef.current = requestAnimationFrame(loop)
                } else {
                    if (isInert) setPhase('inert')
                    else setPhase('reaction')
                }
            }
            rafRef.current = requestAnimationFrame(loop)
            return () => cancelAnimationFrame(rafRef.current)
        }
        
        if (phase === 'reaction') {
            const timer = setTimeout(() => {
                setPhase('result')
            }, 1000 + (100 - collisionEnergy) * 10) // higher energy = shorter reaction flash? No, let's keep it fixed or related
            return () => clearTimeout(timer)
        }
    }, [phase, isInert, duration, collisionEnergy])

    const startSim = () => {
        setPhase('moving')
        setProgress(0)
    }

    const gap = 120 * (1 - progress)
    const offsetA = -gap
    const offsetB = gap

    return (
        <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text1)', margin: 0 }}>3D LABORATORY SANDBOX</h3>
                    <p style={{ fontSize: 11, color: 'var(--text3)', margin: '4px 0 0' }}>Structural Subatomic Collision Visualizer</p>
                </div>
                <button 
                    onClick={startSim} 
                    disabled={phase !== 'idle'}
                    style={{
                        padding: '10px 20px', background: phase === 'idle' ? 'var(--blue)' : 'var(--bg3)',
                        border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700,
                        fontFamily: 'var(--mono)', cursor: phase === 'idle' ? 'pointer' : 'not-allowed',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                >
                    {phase === 'idle' ? 'INITIATE COLLISION' : 'SIMULATING...'}
                </button>
            </div>

            <div style={{ 
                height: 350, background: 'var(--bg3)', borderRadius: 16, border: '1px solid var(--border)',
                position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    {(phase !== 'result') && (
                        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: phase === 'inert' ? (1 - progress * 0.5) : 1 }}>
                            <Atom3D {...atomA} compact={true} offsetX={offsetA} scale={0.7} />
                        </div>
                    )}
                    {(phase !== 'result') && (
                        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: phase === 'inert' ? (1 - progress * 0.5) : 1 }}>
                            <Atom3D {...atomB} compact={true} offsetX={offsetB} scale={0.7} />
                        </div>
                    )}

                    {phase === 'reaction' && (
                        <div style={{ 
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            width: 100, height: 100, borderRadius: '50%', background: 'var(--gold)',
                            filter: 'blur(30px)', animation: 'pulse 0.5s infinite alternate'
                        }} />
                    )}

                    {phase === 'result' && (
                        <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'moleculeSpin 10s linear infinite' }}>
                             <Atom3D {...atomA} compact={true} offsetX={-25} scale={0.7} />
                             <Atom3D {...atomB} compact={true} offsetX={25} scale={0.7} />
                        </div>
                    )}
                </div>

                {phase === 'idle' && (
                    <div style={{ zIndex: 10, textAlign: 'center', background: 'rgba(0,0,0,0.6)', padding: '12px 24px', borderRadius: 40, border: '1px solid var(--border)', backdropFilter: 'blur(4px)' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>{atomA.sym} + {atomB.sym}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>READY FOR 3D SYNTHESIS</div>
                    </div>
                )}

                {phase === 'reaction' && (
                    <div style={{ position: 'absolute', bottom: 30, zIndex: 10, textAlign: 'center', width: '100%', animation: 'fadeIn 0.5s' }}>
                         <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--gold)', fontFamily: 'var(--mono)', letterSpacing: 2 }}>
                            ELECTRON SHELL OVERLAP...
                         </div>
                         <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>CALCULATING BOND ENTHALPY</div>
                    </div>
                )}

                {phase === 'result' && (
                    <div style={{ position: 'absolute', bottom: 20, zIndex: 10, textAlign: 'center', width: '100%', padding: '0 20px', animation: 'fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)' }}>
                        <div style={{ background: 'rgba(0,0,0,0.85)', padding: '16px 20px', borderRadius: 16, border: '1px solid var(--border)', display: 'inline-block', minWidth: 280, backdropFilter: 'blur(10px)', boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
                            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.5px' }}>{reaction ? reaction.product : 'Interatomic Complex'}</div>
                            <div style={{ fontSize: 16, fontFamily: 'var(--mono)', color: 'var(--gold)', margin: '10px 0', fontWeight: 700 }}>
                                {reaction ? reaction.eq : `${atomA.sym} + ${atomB.sym} → Linkage`}
                            </div>
                            <div style={{ fontSize: 10, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{reaction?.type} Interaction</div>
                            <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6, maxWidth: 300, margin: '0 auto' }}> {productDescription(atomA, atomB, reaction)} </div>
                            <button onClick={() => { setPhase('idle'); setProgress(0); }} style={{ marginTop: 16, padding: '6px 18px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--text2)', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>REINITIALIZE SANDBOX</button>
                        </div>
                    </div>
                )}

                {phase === 'inert' && (
                    <div style={{ zIndex: 10, textAlign: 'center', background: 'rgba(0,0,0,0.8)', padding: '20px', borderRadius: 16, border: '1px solid var(--coral)' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--coral)' }}>STRUCTURALLY INERT</div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', margin: '8px 0', maxWidth: 200 }}>Full valence shells prevents overlap or electron exchange. Atoms bounce.</div>
                        <button onClick={() => { setPhase('idle'); setProgress(0); }} style={{ padding: '4px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 4, color: '#fff', fontSize: 10, cursor: 'pointer' }}>RETRY</button>
                    </div>
                )}

                <style>{`
                    @keyframes pulse { from { opacity: 0.3; scale: 0.8; } to { opacity: 1; scale: 1.2; } }
                    @keyframes moleculeSpin { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }
                    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                `}</style>
            </div>
        </div>
    )
}

function productDescription(atomA, atomB, reaction) {
    if (!reaction) return "Atoms have successfully localized within bonding distance. Structural stabilization achieved.";
    if (reaction.type === 'Ionic') {
        return `Ionic lattice formation: ${atomA.group < atomB.group ? atomA.sym : atomB.sym} is donating ${Math.max(atomA.group, atomB.group) === atomA.group ? 'valence e-' : 'electrons'} to stabilize the partner.`;
    }
    return `Covalent sharing: Both ${atomA.sym} and ${atomB.sym} are sharing pairs of electrons to achieve a stable octet configuration.`;
}
