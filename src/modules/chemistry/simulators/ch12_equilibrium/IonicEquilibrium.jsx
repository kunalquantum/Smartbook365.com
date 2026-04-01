import { useState, useMemo } from 'react'
import { WEAK_ACIDS, WEAK_BASES } from './helpers/equilData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

export default function IonicEquilibrium() {
    const [type, setType] = useState('acid') // acid | base
    const [selected, setSelected] = useState('CH₃COOH (acetic)')
    const [conc, setConc] = useState(0.1) // M

    const list = type === 'acid' ? WEAK_ACIDS : WEAK_BASES
    const data = list[selected] || Object.values(list)[0]
    const K = type === 'acid' ? data.Ka : data.Kb
    const K_label = type === 'acid' ? 'Ka' : 'Kb'
    const ion_label = type === 'acid' ? 'H⁺' : 'OH⁻'

    // Ostwald Dilution Law: K = C*alpha^2 / (1-alpha)
    // alpha^2 + (K/C)alpha - (K/C) = 0
    // solve using quadratic formula: ax^2 + bx + c = 0 -> x = [-b + sqrt(b^2 - 4ac)] / 2a
    const alpha = useMemo(() => {
        const a = 1
        const b = K / conc
        const c = -K / conc
        const disc = b * b - 4 * a * c
        return (-b + Math.sqrt(disc)) / (2 * a)
    }, [K, conc])

    const ionConc = conc * alpha
    const pX = -Math.log10(ionConc)
    const pH = type === 'acid' ? pX : 14 - pX

    return (
        <div className="simulator-container">
            {/* Type Toggle */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button onClick={() => { setType('acid'); setSelected(Object.keys(WEAK_ACIDS)[0]); }} 
                    style={{ flex: 1, padding: '8px', borderRadius: 8, background: type === 'acid' ? 'var(--orange)' : 'var(--bg3)', color: type === 'acid' ? '#000' : 'var(--text2)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    Weak Acids
                </button>
                <button onClick={() => { setType('base'); setSelected(Object.keys(WEAK_BASES)[0]); }} 
                    style={{ flex: 1, padding: '8px', borderRadius: 8, background: type === 'base' ? 'var(--indigo)' : 'var(--bg3)', color: type === 'base' ? '#fff' : 'var(--text2)', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    Weak Bases
                </button>
            </div>

            {/* Species Selector */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
                {Object.keys(list).map(name => (
                    <button key={name} onClick={() => setSelected(name)}
                        style={{
                            padding: '4px 10px', borderRadius: 20, fontSize: 12,
                            background: selected === name ? list[name].color : 'var(--bg2)',
                            color: selected === name ? '#000' : 'var(--text3)',
                            border: `1px solid ${selected === name ? list[name].color : 'var(--border)'}`,
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        {name}
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div style={{ background: 'var(--bg3)', padding: 16, borderRadius: 12, marginBottom: 20, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontFamily: 'var(--mono)', fontSize: 12 }}>
                    <span>Initial Concentration (C)</span>
                    <span style={{ color: 'var(--teal)', fontWeight: 700 }}>{conc.toFixed(3)} M</span>
                </div>
                <input type="range" min={-4} max={0} step={0.01} value={Math.log10(conc)}
                    onChange={e => setConc(Math.pow(10, parseFloat(e.target.value)))}
                    style={{ width: '100%', accentColor: 'var(--teal)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>
                    <span>0.0001 M</span><span>1.0 M</span>
                </div>
            </div>

            {/* Calculation Card */}
            <div style={{ background: `${data.color}15`, border: `1px solid ${data.color}40`, padding: 16, borderRadius: 12, marginBottom: 20 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 14, fontWeight: 700, color: data.color, marginBottom: 12 }}>
                    {selected.split(' ')[0]} ⇌ {type === 'acid' ? `H⁺ + ${data.conj}` : `${data.conj} + OH⁻`}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                        <div style={{ marginBottom: 4 }}>{K_label} = {K.toExponential(2)}</div>
                        <div style={{ marginBottom: 4 }}>α = {(alpha * 100).toFixed(2)}%</div>
                        <div>[{ion_label}] = {ionConc.toExponential(3)} M</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 2 }}>Current pH</div>
                        <div style={{ fontSize: 32, fontWeight: 900, color: data.color }}>{pH.toFixed(2)}</div>
                    </div>
                </div>
            </div>

            {/* Ostwald Visualization */}
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    Ostwald's Dilution Law Visualization
                </div>
                <div style={{ position: 'relative', height: 120, background: 'var(--bg2)', borderRadius: 8, overflow: 'hidden', padding: '10px 0' }}>
                    {/* Graph Background */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'var(--border)' }} />
                    <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 1, background: 'var(--border)' }} />
                    
                    {/* The Curve: alpha vs Dilution (1/C) */}
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d={`M 0 100 ${Array.from({length: 20}, (_, i) => {
                            const x = i * 5;
                            const currentC = Math.pow(10, - (i/19) * 4);
                            const b = K/currentC;
                            const curAlpha = (-b + Math.sqrt(b*b + 4*K/currentC))/2;
                            return `L ${x} ${100 - curAlpha * 100}`;
                        }).join(' ')}`} fill="none" stroke={data.color} strokeWidth="2" />
                        
                        {/* Current Point */}
                        <circle cx={((4 + Math.log10(conc)) / 4) * 100} cy={100 - alpha * 100} r="4" fill={data.color} />
                    </svg>
                    
                    <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 10, color: data.color, fontWeight: 700, textAlign: 'right' }}>
                        α approachs 1.0 (100%)<br/>as dilution increases
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--text3)', marginTop: 6 }}>
                    <span>High Conc (1M)</span>
                    <span>Low Conc (0.0001M)</span>
                </div>
            </div>

            {/* Results Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginTop: 20 }}>
                <ValueCard label="Dissociation (α)" value={`${(alpha * 100).toFixed(2)}%`} color={data.color} />
                <ValueCard label={type === 'acid' ? 'pH' : 'pOH'} value={pX.toFixed(2)} color="var(--teal)" />
                <ValueCard label="Final pH" value={pH.toFixed(2)} color="var(--gold)" highlight />
                <ValueCard label="Species" value={selected.split(' ')[0]} color={data.color} />
            </div>
        </div>
    )
}