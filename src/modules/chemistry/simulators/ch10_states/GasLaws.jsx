import { useState } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

export default function GasLaws() {
    const [mode, setMode] = useState('boyle') // boyle | charles | gaylussac | ideal
    const [V, setV] = useState(10) // L
    const [T, setT] = useState(300) // K
    const [n, setN] = useState(1) // mol

    const R = 0.08206

    // Graph config
    const W = 380, H = 160, GP = { l: 40, r: 16, t: 16, b: 24 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b

    // Boyle graph (P vs V): P = k/V. Let k = 10.
    const boyleMaxV = 50, boyleMaxP = 10
    const boylePts = Array.from({ length: 50 }, (_, i) => {
        const vol = 1 + i
        return { x: vol, y: 10 / vol }
    })

    // Charles graph (V vs T): V = kT. Let V = 10 at 300K, so k = 10/300.
    const charlesMaxT = 800, charlesMaxV = (10 / 300) * 800
    const charlesPts = Array.from({ length: 2 }, (_, i) => {
        const temp = i === 0 ? 0 : 800
        return { x: temp, y: (10 / 300) * temp }
    })

    // Gay-Lussac graph (P vs T): P = kT. P = 1 at 300K, so k = 1/300.
    const gayMaxT = 800, gayMaxP = (1 / 300) * 800
    const gayPts = Array.from({ length: 2 }, (_, i) => {
        const temp = i === 0 ? 0 : 800
        return { x: temp, y: (1 / 300) * temp }
    })

    return (
        <div>
            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {[{ k: 'boyle', l: "Boyle's Law" }, { k: 'charles', l: "Charles's Law" }, { k: 'gaylussac', l: "Gay-Lussac's Law" }, { k: 'ideal', l: 'Ideal Gas Law' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '5px 4px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: mode === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? 'var(--teal)' : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>
            
            {mode === 'boyle' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--teal)' }}>Boyle's Law (T, n const):</strong> Pressure is inversely proportional to Volume. P ∝ 1/V. P₁V₁ = P₂V₂.
                    </div>
                    
                    <ChemSlider label="Volume V" unit=" L" value={V} min={1} max={50} step={1} onChange={setV} color="var(--teal)" />
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--teal)', letterSpacing: 2, marginBottom: 8 }}>
                            ISOTHERM: P vs V
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            <path d={boylePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${GP.l + (p.x / boyleMaxV) * PW},${GP.t + PH - (p.y / boyleMaxP) * PH}`).join(' ')} 
                                fill="none" stroke="var(--teal)" strokeWidth={2.5} />
                            
                            <circle cx={GP.l + (V / boyleMaxV) * PW} cy={GP.t + PH - ((10 / V) / boyleMaxP) * PH} r={5} fill="var(--coral)" stroke="#fff" strokeWidth={1} />
                            
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>V</text>
                            <text x={GP.l - 6} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>P</text>
                        </svg>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Pressure P" value={`${(10 / V).toFixed(2)} atm`} color="var(--coral)" highlight />
                        <ValueCard label="P × V" value="10.0 atm·L (Constant)" color="var(--gold)" />
                    </div>
                </div>
            )}
            
            {mode === 'charles' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(55,138,221,0.08)', border: '1px solid rgba(55,138,221,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: '#378ADD' }}>Charles's Law (P, n const):</strong> Volume is directly proportional to absolute Temperature. V ∝ T. V₁/T₁ = V₂/T₂.
                    </div>
                    
                    <ChemSlider label="Temperature T" unit=" K" value={T} min={10} max={800} step={10} onChange={setT} color="#378ADD" />
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#378ADD', letterSpacing: 2, marginBottom: 8 }}>
                            ISOBAR: V vs T
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            <path d={charlesPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${GP.l + (p.x / charlesMaxT) * PW},${GP.t + PH - (p.y / charlesMaxV) * PH}`).join(' ')} 
                                fill="none" stroke="#378ADD" strokeWidth={2.5} strokeDasharray="5 5" />
                                
                            <path d={`M ${GP.l + (100 / charlesMaxT) * PW},${GP.t + PH - (((10 / 300) * 100) / charlesMaxV) * PH} L ${GP.l + PW},${GP.t}`} 
                                fill="none" stroke="#378ADD" strokeWidth={2.5} />
                            
                            <circle cx={GP.l + (T / charlesMaxT) * PW} cy={GP.t + PH - (((10 / 300) * T) / charlesMaxV) * PH} r={5} fill="var(--teal)" stroke="#fff" strokeWidth={1} />
                            
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>T (K)</text>
                            <text x={GP.l - 6} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>V</text>
                            <text x={GP.l + 4} y={GP.t + PH - 4} style={{ fontSize: 8, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>0 K</text>
                        </svg>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Volume V" value={`${((10 / 300) * T).toFixed(2)} L`} color="var(--teal)" highlight />
                        <ValueCard label="V / T" value="0.033 L/K (Constant)" color="var(--gold)" />
                    </div>
                </div>
            )}

            {mode === 'gaylussac' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(216,90,48,0.08)', border: '1px solid rgba(216,90,48,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--coral)' }}>Gay-Lussac's Law (V, n const):</strong> Pressure is directly proportional to absolute Temperature. P ∝ T. P₁/T₁ = P₂/T₂.
                    </div>
                    
                    <ChemSlider label="Temperature T" unit=" K" value={T} min={10} max={800} step={10} onChange={setT} color="var(--coral)" />
                    
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--coral)', letterSpacing: 2, marginBottom: 8 }}>
                            ISOCHORE: P vs T
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            <path d={gayPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${GP.l + (p.x / gayMaxT) * PW},${GP.t + PH - (p.y / gayMaxP) * PH}`).join(' ')} 
                                fill="none" stroke="var(--coral)" strokeWidth={2.5} strokeDasharray="5 5" />
                                
                            <path d={`M ${GP.l + (100 / gayMaxT) * PW},${GP.t + PH - (((1 / 300) * 100) / gayMaxP) * PH} L ${GP.l + PW},${GP.t}`} 
                                fill="none" stroke="var(--coral)" strokeWidth={2.5} />
                            
                            <circle cx={GP.l + (T / gayMaxT) * PW} cy={GP.t + PH - (((1 / 300) * T) / gayMaxP) * PH} r={5} fill="var(--gold)" stroke="#fff" strokeWidth={1} />
                            
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>T (K)</text>
                            <text x={GP.l - 6} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>P</text>
                            <text x={GP.l + 4} y={GP.t + PH - 4} style={{ fontSize: 8, fill: 'var(--text3)', fontFamily: 'var(--mono)' }}>0 K</text>
                        </svg>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Pressure P" value={`${((1 / 300) * T).toFixed(2)} atm`} color="var(--gold)" highlight />
                        <ValueCard label="P / T" value="0.0033 atm/K (Constant)" color="#378ADD" />
                    </div>
                </div>
            )}

            {mode === 'ideal' && (
                <div>
                    <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: 'var(--gold)' }}>Ideal Gas Law:</strong> PV = nRT. Combines all simple gas laws into a single equation of state.
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <ChemSlider label="Moles n" unit=" mol" value={n} min={0.1} max={5} step={0.1} onChange={setN} color="var(--purple)" />
                        <ChemSlider label="Temperature T" unit=" K" value={T} min={100} max={1000} step={10} onChange={setT} color="#378ADD" />
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ChemSlider label="Volume V" unit=" L" value={V} min={1} max={100} step={1} onChange={setV} color="var(--teal)" />
                        </div>
                    </div>
                    
                    <div style={{ padding: '16px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, textAlign: 'center', fontFamily: 'var(--mono)', marginBottom: 14 }}>
                        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 8 }}>P = nRT / V</div>
                        <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--gold)' }}>
                            {((n * R * T) / V).toFixed(2)} <span style={{ fontSize: 16 }}>atm</span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        <ValueCard label="Gas constant R" value="0.0821 L·atm/mol·K" color="var(--text2)" />
                        <ValueCard label="Avogadro's Law" value="V ∝ n at const P,T" color="#888780" />
                    </div>
                </div>
            )}
        </div>
    )
}
