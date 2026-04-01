import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

// Comprehensive reaction predictor
const REACTION_DB = {
    // [substrate][reagent] = product
    'Alkene + HBr': { product: 'Bromoalkane (Markovnikov)', eq: 'CH₂=CHCH₃ + HBr → CH₃CHBrCH₃', color: '#D85A30', type: 'Electrophilic addition' },
    'Alkene + Br₂': { product: 'Vicinal dibromide (anti addition)', eq: 'CH₂=CH₂ + Br₂ → BrCH₂CH₂Br', color: '#EF9F27', type: 'Electrophilic addition' },
    'Alkene + H₂': { product: 'Alkane (hydrogenation)', eq: 'CH₂=CH₂ + H₂ →(Ni) CH₃CH₃', color: '#1D9E75', type: 'Catalytic addition' },
    'Alkene + H₂O/H⁺': { product: 'Alcohol (Markovnikov)', eq: 'CH₂=CH₂ + H₂O →(H⁺) CH₃CH₂OH', color: '#378ADD', type: 'Electrophilic addition' },
    'Alkene + KMnO₄ (cold)': { product: 'Diol (KMnO₄ decolourised)', eq: 'CH₂=CH₂ + KMnO₄ → HOCH₂CH₂OH + MnO₂', color: '#7F77DD', type: 'Oxidation (Baeyer\'s test)' },
    'Alkene + O₃': { product: 'Carbonyl fragments', eq: 'CH₂=CHCH₃ →(O₃,Zn/H₂O) HCHO + CH₃CHO', color: '#7F77DD', type: 'Ozonolysis' },
    'Alkyne + H₂ (partial)': { product: 'cis-Alkene (Lindlar)', eq: 'RC≡CR + H₂ →(Lindlar) cis-RCH=CHR', color: '#1D9E75', type: 'Partial hydrogenation' },
    'Alkyne + HBr': { product: 'gem-Dibromoalkane (Markovnikov×2)', eq: 'HC≡CH + 2HBr → CH₃CBr₃', color: '#D85A30', type: 'Electrophilic addition ×2' },
    'Alkyne + AgNO₃': { product: 'Silver acetylide precipitate ↓', eq: 'HC≡CH + 2AgNO₃ → AgC≡CAg↓ + 2HNO₃', color: '#888780', type: 'Terminal alkyne test' },
    'Benzene + HNO₃/H₂SO₄': { product: 'Nitrobenzene', eq: 'C₆H₆ + HNO₃ →(H₂SO₄) C₆H₅NO₂ + H₂O', color: '#D85A30', type: 'EAS — nitration' },
    'Benzene + Br₂/FeBr₃': { product: 'Bromobenzene + HBr', eq: 'C₆H₆ + Br₂ →(FeBr₃) C₆H₅Br + HBr', color: '#EF9F27', type: 'EAS — halogenation' },
    'Benzene + RCl/AlCl₃': { product: 'Alkylbenzene (Friedel-Crafts)', eq: 'C₆H₆ + CH₃Cl →(AlCl₃) C₆H₅CH₃ + HCl', color: '#7F77DD', type: 'EAS — Friedel-Crafts' },
    'Alkane + Cl₂/hν': { product: 'Chloroalkane + HCl', eq: 'CH₄ + Cl₂ →(hν) CH₃Cl + HCl', color: '#1D9E75', type: 'Free radical substitution' },
    'Alkane + O₂': { product: 'CO₂ + H₂O (combustion)', eq: 'CH₄ + 2O₂ → CO₂ + 2H₂O', color: '#D85A30', type: 'Combustion' },
}

const SUBSTRATES = ['Alkane', 'Alkene', 'Alkyne', 'Benzene']
const REAGENTS = {
    'Alkane': ['Cl₂/hν', 'Br₂/hν', 'O₂'],
    'Alkene': ['HBr', 'HCl', 'Br₂', 'H₂/Ni', 'H₂O/H⁺', 'KMnO₄ (cold)', 'O₃ then Zn/H₂O'],
    'Alkyne': ['H₂/Lindlar', 'H₂ (excess)', 'HBr (2 mol)', 'AgNO₃/NH₃', 'Br₂/CCl₄'],
    'Benzene': ['HNO₃/H₂SO₄', 'Br₂/FeBr₃', 'Cl₂/FeCl₃', 'RCl/AlCl₃', 'RCOCl/AlCl₃'],
}

const lookupReaction = (substrate, reagent) => {
    const key = `${substrate} + ${reagent}`.replace('/hν', '/hν').replace('/Ni', '/Ni')
    const found = Object.entries(REACTION_DB).find(([k]) =>
        k.toLowerCase().includes(substrate.toLowerCase()) &&
        reagent.toLowerCase().split('/')[0].trim() === k.toLowerCase().split('+')[1]?.split('/')[0]?.trim()
    )
    if (found) return found[1]
    // Fuzzy match
    const partial = Object.entries(REACTION_DB).find(([k]) =>
        k.toLowerCase().includes(substrate.toLowerCase())
    )
    return partial ? partial[1] : null
}

// Better lookup
const getReaction = (sub, rg) => {
    const searchKey = `${sub} + ${rg}`
    for (const [key, val] of Object.entries(REACTION_DB)) {
        const subLower = sub.toLowerCase()
        const rgLower = rg.split('/')[0].replace('(', '').trim().toLowerCase()
        const keyLower = key.toLowerCase()
        if (keyLower.includes(subLower) && keyLower.includes(rgLower)) return val
    }
    return null
}

export default function Reactions() {
    const [sub, setSub] = useState('Alkene')
    const [rg, setRg] = useState('HBr')

    const result = getReaction(sub, rg)

    return (
        <div>
            <div style={{ padding: '10px 14px', background: 'rgba(127,119,221,0.08)', border: '1px solid rgba(127,119,221,0.2)', borderRadius: 8, marginBottom: 14, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>
                Select a substrate and reagent — the product and mechanism appear immediately.
            </div>

            {/* Substrate selector */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>SUBSTRATE</div>
                <div style={{ display: 'flex', gap: 6 }}>
                    {SUBSTRATES.map(s => (
                        <button key={s} onClick={() => { setSub(s); setRg(REAGENTS[s][0]) }} style={{
                            flex: 1, padding: '8px', borderRadius: 8, fontSize: 13,
                            fontFamily: 'var(--mono)', cursor: 'pointer', fontWeight: 700,
                            background: sub === s ? 'var(--purple)' : 'var(--bg3)',
                            color: sub === s ? '#fff' : 'var(--text2)',
                            border: `1px solid ${sub === s ? 'var(--purple)' : 'var(--border)'}`,
                        }}>{s}</button>
                    ))}
                </div>
            </div>

            {/* Reagent selector */}
            <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 6, letterSpacing: 1 }}>REAGENT</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {REAGENTS[sub].map(r => (
                        <button key={r} onClick={() => setRg(r)} style={{
                            padding: '5px 10px', borderRadius: 20, fontSize: 11,
                            fontFamily: 'var(--mono)', cursor: 'pointer',
                            background: rg === r ? (result?.color || 'var(--teal)') : 'var(--bg3)',
                            color: rg === r ? '#000' : 'var(--text2)',
                            border: `1px solid ${rg === r ? (result?.color || 'var(--teal)') : 'var(--border)'}`,
                        }}>{r}</button>
                    ))}
                </div>
            </div>

            {/* Reaction result */}
            {result ? (
                <div>
                    {/* Main equation */}
                    <div style={{ padding: '16px 20px', background: `${result.color}15`, border: `2px solid ${result.color}50`, borderRadius: 12, marginBottom: 14, textAlign: 'center' }}>
                        <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: result.color, lineHeight: 1.6, letterSpacing: 0.5 }}>
                            {result.eq}
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: `${result.color}10`, border: `1px solid ${result.color}30`, borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>PRODUCT</div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: result.color }}>{result.product}</div>
                        </div>
                        <div style={{ padding: '10px 14px', background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 8 }}>
                            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 3 }}>MECHANISM TYPE</div>
                            <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: 'var(--gold)' }}>{result.type}</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '20px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, textAlign: 'center', color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: 12 }}>
                    No reaction data for this combination — try another reagent.
                </div>
            )}

            {/* Quick reference all reactions */}
            <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 8, letterSpacing: 1 }}>
                    QUICK REFERENCE — ALL {sub.toUpperCase()} REACTIONS
                </div>
                {REAGENTS[sub].map(r => {
                    const rx = getReaction(sub, r)
                    return (
                        <div key={r} style={{ display: 'flex', gap: 8, padding: '6px 10px', marginBottom: 4, cursor: 'pointer', borderRadius: 6, background: rg === r ? `${rx?.color || 'var(--teal)'}12` : 'transparent', border: `1px solid ${rg === r ? `${rx?.color || 'var(--teal)'}30` : 'transparent'}` }}
                            onClick={() => setRg(r)}>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: rx?.color || 'var(--text3)', minWidth: 100 }}>{r}</span>
                            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text2)' }}>→ {rx?.product || '?'}</span>
                        </div>
                    )
                })}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <ValueCard label="Substrate" value={sub} color="var(--purple)" highlight />
                <ValueCard label="Reagent" value={rg} color={result?.color || 'var(--text3)'} />
                <ValueCard label="Type" value={result?.type || '—'} color={result?.color || 'var(--text3)'} />
            </div>
        </div>
    )
}