import { useState, useMemo } from 'react'
import { GASES } from './helpers/gasData'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard from '../../components/ui/ValueCard'

const R = 0.08206  // L·atm/mol·K

export default function RealGases() {
    const [gas, setGas] = useState('CO₂')
    const [T, setT] = useState(300)
    const [mode, setMode] = useState('Zvsp')  // Zvsp | isotherm

    const g = GASES[gas]
    const a = g.a, b = g.b

    // Z vs P curve at given T
    const ZvP = useMemo(() => {
        return Array.from({ length: 60 }, (_, i) => {
            const P = 0.5 + i * 3   // atm
            // van der Waals — solve numerically for V
            // Use compressibility factor Z = PV/RT
            // Iterative: V_ideal = RT/P, then refine
            let V = R * T / P
            for (let iter = 0; iter < 30; iter++) {
                V = (R * T / (P + a / V ** 2)) + b
            }
            const Z = P * V / (R * T)
            return { P, Z, V }
        })
    }, [gas, T])

    // Isotherms (P vs V) at 3 temperatures
    const ISOTHERMS = [200, T, 400].map(Tiso => ({
        T: Tiso,
        color: Tiso === T ? g.color : Tiso < T ? '#378ADD' : '#D85A30',
        dash: Tiso !== T,
        pts: Array.from({ length: 80 }, (_, i) => {
            const V = b + 0.02 + i * 0.5
            if (V <= b) return null
            const P = R * Tiso / (V - b) - a / V ** 2
            return P > 0.1 && P < 100 ? { V, P } : null
        }).filter(Boolean),
    }))

    // Boyle temperature TB = a/(Rb)
    const TB = a / (R * b)

    // Current Z at slider T, 1 atm
    let V1 = R * T / 1
    for (let i = 0; i < 30; i++) V1 = (R * T / (1 + a / V1 ** 2)) + b
    const Z_at_1atm = 1 * V1 / (R * T)

    // Graph for Z vs P
    const W = 380, H = 160, GP = { l: 44, r: 16, t: 14, b: 28 }
    const PW = W - GP.l - GP.r, PH = H - GP.t - GP.b

    const makeZPath = (pts) => {
        const xs = pts.map(p => p.P), ys = pts.map(p => p.Z)
        const xMax = Math.max(...xs), yMin = Math.min(0.5, ...ys), yMax = Math.max(1.5, ...ys)
        const tx = x => GP.l + (x / xMax) * PW
        const ty = y => GP.t + PH - ((y - yMin) / (yMax - yMin || 1)) * PH
        return {
            path: pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${tx(p.P).toFixed(1)},${ty(p.Z).toFixed(1)}`).join(' '),
            tx, ty, xMax, yMin, yMax,
        }
    }

    const makeVPPath = (pts, xMax, yMax) => {
        const tx = x => GP.l + (x / xMax) * PW
        const ty = y => GP.t + PH - (y / yMax) * PH
        return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${tx(p.V).toFixed(1)},${ty(p.P).toFixed(1)}`).join(' ')
    }

    const zGraph = makeZPath(ZvP)

    const isoXmax = 20, isoPmax = 50
    const isoPaths = ISOTHERMS.map(iso => makeVPPath(iso.pts, isoXmax, isoPmax))

    return (
        <div>
            {/* Gas selector */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.entries(GASES).map(([k, v]) => (
                    <button key={k} onClick={() => setGas(k)} style={{
                        padding: '3px 8px', borderRadius: 20, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                        background: gas === k ? v.color : 'var(--bg3)',
                        color: gas === k ? '#000' : 'var(--text2)',
                        border: `1px solid ${gas === k ? v.color : 'var(--border)'}`,
                    }}>{k}</button>
                ))}
            </div>

            {/* Gas info */}
            <div style={{ padding: '10px 14px', background: `${g.color}10`, border: `1px solid ${g.color}30`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12 }}>
                <span style={{ color: g.color, fontWeight: 700 }}>{g.name}</span>
                <span style={{ color: 'var(--text3)', marginLeft: 8 }}>{g.desc}</span>
                <span style={{ color: 'var(--text3)', marginLeft: 16 }}>a = {a} L²·atm/mol²  ·  b = {b} L/mol</span>
            </div>

            {/* Mode */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {[{ k: 'Zvsp', l: 'Z vs P (compressibility)' }, { k: 'isotherm', l: 'P-V isotherms' }].map(opt => (
                    <button key={opt.k} onClick={() => setMode(opt.k)} style={{
                        flex: 1, padding: '6px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: mode === opt.k ? g.color : 'var(--bg3)',
                        color: mode === opt.k ? '#000' : 'var(--text2)',
                        border: `1px solid ${mode === opt.k ? g.color : 'var(--border2)'}`,
                    }}>{opt.l}</button>
                ))}
            </div>

            <ChemSlider label="Temperature T" unit=" K" value={T} min={200} max={600} step={10} onChange={setT} color={g.color} />

            {/* vdW equation reminder */}
            <div style={{ padding: '8px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)' }}>
                (P + an²/V²)(V − nb) = nRT  ·  a corrects intermolecular attraction, b corrects molecular volume
            </div>

            {mode === 'Zvsp' && (
                <div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: g.color, letterSpacing: 2, marginBottom: 8 }}>
                            Z = PV/nRT  (ideal = 1.0)
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {/* Ideal line Z=1 */}
                            <line x1={GP.l} y1={zGraph.ty(1)} x2={GP.l + PW} y2={zGraph.ty(1)}
                                stroke="rgba(255,255,255,0.15)" strokeWidth={1} strokeDasharray="5 4" />
                            <text x={GP.l + 4} y={zGraph.ty(1) - 4}
                                style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>ideal (Z=1)</text>

                            {/* Curve */}
                            <path d={zGraph.path} fill="none" stroke={g.color} strokeWidth={2.5} />

                            {/* Z>1 region label */}
                            <text x={GP.l + PW - 4} y={GP.t + 14} textAnchor="end"
                                style={{ fontSize: 8, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>Z&gt;1: repulsion dom.</text>
                            <text x={GP.l + PW - 4} y={GP.t + PH - 6} textAnchor="end"
                                style={{ fontSize: 8, fill: 'rgba(55,138,221,0.6)', fontFamily: 'var(--mono)' }}>Z&lt;1: attraction dom.</text>

                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>P (atm)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>Z</text>
                        </svg>
                    </div>

                    {/* Boyle temperature */}
                    <div style={{ padding: '10px 14px', background: `${g.color}10`, border: `1px solid ${g.color}30`, borderRadius: 8, marginBottom: 14, fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                        <strong style={{ color: g.color }}>Boyle temperature T_B = a/Rb = {TB.toFixed(0)} K</strong>
                        <br />At T_B, the gas behaves ideally over a wide pressure range (Z ≈ 1). Below T_B, attractive forces dominate (Z &lt; 1). Above T_B, repulsive volume dominates (Z &gt; 1).
                        {(T < TB)
                            ? (<span style={{ color: 'var(--teal)' }}> Current T ({T}K) &lt; T_B → attractions dominate.</span>)
                            : ((T > TB)
                                ? (<span style={{ color: 'var(--coral)' }}> Current T ({T}K) &gt; T_B → repulsion dominates.</span>)
                                : (<span style={{ color: 'var(--gold)' }}> At Boyle temperature — nearly ideal!</span>))}
                    </div>
                </div>
            )}

            {mode === 'isotherm' && (
                <div>
                    <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: g.color, letterSpacing: 2, marginBottom: 8 }}>
                            P−V ISOTHERMS — real vs ideal
                        </div>
                        <svg viewBox={`0 0 ${W} ${H}`} width="100%">
                            {ISOTHERMS.map((iso, i) => (
                                <path key={i} d={isoPaths[i]}
                                    fill="none"
                                    stroke={iso.color}
                                    strokeWidth={iso.T === T ? 2.5 : 1.2}
                                    strokeDasharray={iso.dash ? '5 4' : undefined}
                                    opacity={iso.T === T ? 1 : 0.5} />
                            ))}
                            {/* Labels */}
                            {ISOTHERMS.map((iso, i) => {
                                const last = iso.pts[iso.pts.length - 1]
                                if (!last) return null
                                const tx = x => GP.l + (x / isoXmax) * PW
                                const ty = y => GP.t + PH - (y / isoPmax) * PH
                                return (
                                    <text key={i} x={tx(last.V) + 4} y={ty(last.P) + 3}
                                        style={{ fontSize: 8, fill: iso.color, fontFamily: 'var(--mono)' }}>{iso.T}K</text>
                                )
                            })}
                            {/* Axes */}
                            <line x1={GP.l} y1={GP.t} x2={GP.l} y2={GP.t + PH} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <line x1={GP.l} y1={GP.t + PH} x2={GP.l + PW} y2={GP.t + PH} stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                            <text x={GP.l + PW} y={GP.t + PH + 16} style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>V (L)</text>
                            <text x={GP.l - 4} y={GP.t + 8} textAnchor="end" style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>P (atm)</text>
                        </svg>
                        <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 4 }}>
                            <span style={{ color: '#378ADD' }}>━</span> cold  <span style={{ color: g.color }}>━</span> selected T ({T}K)  <span style={{ color: '#D85A30' }}>━</span> hot
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <ValueCard label="Gas" value={g.name} color={g.color} highlight />
                <ValueCard label="a (atm·L²/mol²)" value={a} color="var(--teal)" />
                <ValueCard label="b (L/mol)" value={b} color="var(--purple)" />
                <ValueCard label="Boyle T" value={`${TB.toFixed(0)} K`} color="var(--gold)" />
            </div>
        </div>
    )
}