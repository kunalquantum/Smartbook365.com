import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const ELEMENTS = [
    // Period 1
    { Z: 1, sym: 'H', name: 'Hydrogen', mass: 1.008, group: 1, period: 1, block: 's', EN: 2.20, AR: 53, IE1: 1312, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 2, sym: 'He', name: 'Helium', mass: 4.003, group: 18, period: 1, block: 's', EN: null, AR: 31, IE1: 2372, cat: 'noble-gas', col: '#F5C4B3' },
    // Period 2
    { Z: 3, sym: 'Li', name: 'Lithium', mass: 6.941, group: 1, period: 2, block: 's', EN: 0.98, AR: 167, IE1: 520, cat: 'alkali', col: '#EF9F27' },
    { Z: 4, sym: 'Be', name: 'Beryllium', mass: 9.012, group: 2, period: 2, block: 's', EN: 1.57, AR: 112, IE1: 899, cat: 'alkaline-earth', col: '#FAC775' },
    { Z: 5, sym: 'B', name: 'Boron', mass: 10.81, group: 13, period: 2, block: 'p', EN: 2.04, AR: 87, IE1: 800, cat: 'metalloid', col: '#888780' },
    { Z: 6, sym: 'C', name: 'Carbon', mass: 12.011, group: 14, period: 2, block: 'p', EN: 2.55, AR: 67, IE1: 1086, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 7, sym: 'N', name: 'Nitrogen', mass: 14.007, group: 15, period: 2, block: 'p', EN: 3.04, AR: 56, IE1: 1402, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 8, sym: 'O', name: 'Oxygen', mass: 15.999, group: 16, period: 2, block: 'p', EN: 3.44, AR: 48, IE1: 1314, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 9, sym: 'F', name: 'Fluorine', mass: 18.998, group: 17, period: 2, block: 'p', EN: 3.98, AR: 42, IE1: 1681, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 10, sym: 'Ne', name: 'Neon', mass: 20.18, group: 18, period: 2, block: 'p', EN: null, AR: 38, IE1: 2081, cat: 'noble-gas', col: '#F5C4B3' },
    // Period 3
    { Z: 11, sym: 'Na', name: 'Sodium', mass: 22.990, group: 1, period: 3, block: 's', EN: 0.93, AR: 186, IE1: 496, cat: 'alkali', col: '#EF9F27' },
    { Z: 12, sym: 'Mg', name: 'Magnesium', mass: 24.305, group: 2, period: 3, block: 's', EN: 1.31, AR: 160, IE1: 738, cat: 'alkaline-earth', col: '#FAC775' },
    { Z: 13, sym: 'Al', name: 'Aluminium', mass: 26.982, group: 13, period: 3, block: 'p', EN: 1.61, AR: 143, IE1: 577, cat: 'post-transition', col: '#B4B2A9' },
    { Z: 14, sym: 'Si', name: 'Silicon', mass: 28.086, group: 14, period: 3, block: 'p', EN: 1.90, AR: 117, IE1: 786, cat: 'metalloid', col: '#888780' },
    { Z: 15, sym: 'P', name: 'Phosphorus', mass: 30.974, group: 15, period: 3, block: 'p', EN: 2.19, AR: 98, IE1: 1012, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 16, sym: 'S', name: 'Sulfur', mass: 32.06, group: 16, period: 3, block: 'p', EN: 2.58, AR: 88, IE1: 1000, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 17, sym: 'Cl', name: 'Chlorine', mass: 35.45, group: 17, period: 3, block: 'p', EN: 3.16, AR: 79, IE1: 1251, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 18, sym: 'Ar', name: 'Argon', mass: 39.948, group: 18, period: 3, block: 'p', EN: null, AR: 71, IE1: 1521, cat: 'noble-gas', col: '#F5C4B3' },
    // Period 4
    { Z: 19, sym: 'K', name: 'Potassium', mass: 39.098, group: 1, period: 4, block: 's', EN: 0.82, AR: 227, IE1: 419, cat: 'alkali', col: '#EF9F27' },
    { Z: 20, sym: 'Ca', name: 'Calcium', mass: 40.078, group: 2, period: 4, block: 's', EN: 1.00, AR: 197, IE1: 590, cat: 'alkaline-earth', col: '#FAC775' },
    { Z: 21, sym: 'Sc', name: 'Scandium', mass: 44.956, group: 3, period: 4, block: 'd', EN: 1.36, AR: 162, IE1: 631, cat: 'transition', col: '#378ADD' },
    { Z: 22, sym: 'Ti', name: 'Titanium', mass: 47.867, group: 4, period: 4, block: 'd', EN: 1.54, AR: 147, IE1: 658, cat: 'transition', col: '#378ADD' },
    { Z: 23, sym: 'V', name: 'Vanadium', mass: 50.942, group: 5, period: 4, block: 'd', EN: 1.63, AR: 134, IE1: 650, cat: 'transition', col: '#378ADD' },
    { Z: 24, sym: 'Cr', name: 'Chromium', mass: 51.996, group: 6, period: 4, block: 'd', EN: 1.66, AR: 128, IE1: 653, cat: 'transition', col: '#378ADD' },
    { Z: 25, sym: 'Mn', name: 'Manganese', mass: 54.938, group: 7, period: 4, block: 'd', EN: 1.55, AR: 127, IE1: 717, cat: 'transition', col: '#378ADD' },
    { Z: 26, sym: 'Fe', name: 'Iron', mass: 55.845, group: 8, period: 4, block: 'd', EN: 1.83, AR: 126, IE1: 762, cat: 'transition', col: '#378ADD' },
    { Z: 27, sym: 'Co', name: 'Cobalt', mass: 58.933, group: 9, period: 4, block: 'd', EN: 1.88, AR: 125, IE1: 760, cat: 'transition', col: '#378ADD' },
    { Z: 28, sym: 'Ni', name: 'Nickel', mass: 58.693, group: 10, period: 4, block: 'd', EN: 1.91, AR: 124, IE1: 737, cat: 'transition', col: '#378ADD' },
    { Z: 29, sym: 'Cu', name: 'Copper', mass: 63.546, group: 11, period: 4, block: 'd', EN: 1.90, AR: 128, IE1: 745, cat: 'transition', col: '#378ADD' },
    { Z: 30, sym: 'Zn', name: 'Zinc', mass: 65.38, group: 12, period: 4, block: 'd', EN: 1.65, AR: 134, IE1: 906, cat: 'transition', col: '#378ADD' },
    { Z: 31, sym: 'Ga', name: 'Gallium', mass: 69.723, group: 13, period: 4, block: 'p', EN: 1.81, AR: 122, IE1: 579, cat: 'post-transition', col: '#B4B2A9' },
    { Z: 32, sym: 'Ge', name: 'Germanium', mass: 72.630, group: 14, period: 4, block: 'p', EN: 2.01, AR: 122, IE1: 762, cat: 'metalloid', col: '#888780' },
    { Z: 33, sym: 'As', name: 'Arsenic', mass: 74.922, group: 15, period: 4, block: 'p', EN: 2.18, AR: 119, IE1: 947, cat: 'metalloid', col: '#888780' },
    { Z: 34, sym: 'Se', name: 'Selenium', mass: 78.971, group: 16, period: 4, block: 'p', EN: 2.55, AR: 116, IE1: 941, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 35, sym: 'Br', name: 'Bromine', mass: 79.904, group: 17, period: 4, block: 'p', EN: 2.96, AR: 114, IE1: 1140, cat: 'nonmetal', col: '#A8D8B9' },
    { Z: 36, sym: 'Kr', name: 'Krypton', mass: 83.798, group: 18, period: 4, block: 'p', EN: null, AR: 88, IE1: 1351, cat: 'noble-gas', col: '#F5C4B3' },
]

const CAT_COLORS = {
    'alkali': '#EF9F27',
    'alkaline-earth': '#FAC775',
    'transition': '#378ADD',
    'post-transition': '#B4B2A9',
    'metalloid': '#888780',
    'nonmetal': '#A8D8B9',
    'noble-gas': '#F5C4B3',
}
const CAT_LABELS = {
    'alkali': 'Alkali metal', 'alkaline-earth': 'Alkaline earth',
    'transition': 'Transition metal', 'post-transition': 'Post-transition',
    'metalloid': 'Metalloid', 'nonmetal': 'Non-metal', 'noble-gas': 'Noble gas',
}

const PROPERTIES = ['AR', 'IE1', 'EN', 'mass']
const PROP_LABELS = { AR: 'Atomic radius (pm)', IE1: 'IE₁ (kJ/mol)', EN: 'Electronegativity', mass: 'Atomic mass' }

export default function PeriodicTable() {
    const [selected, setSelected] = useState(null)
    const [highlight, setHighlight] = useState('category')  // category | period | group | block | property
    const [property, setProperty] = useState('AR')
    const [filterCat, setFilterCat] = useState(null)

    const sel = selected ? ELEMENTS.find(e => e.Z === selected) : null

    // Color logic
    const getColor = (el) => {
        if (filterCat && el.cat !== filterCat) return 'rgba(160,176,200,0.08)'
        if (highlight === 'category') return `${CAT_COLORS[el.cat] || '#888'}30`
        if (highlight === 'period') return el.period === (sel?.period) ? `${el.col}40` : `${el.col}10`
        if (highlight === 'group') return el.group === (sel?.group) ? `${el.col}40` : `${el.col}10`
        if (highlight === 'block') return el.block === (sel?.block) ? `${el.col}40` : `${el.col}10`
        if (highlight === 'property') {
            const vals = ELEMENTS.map(e => e[property]).filter(v => v !== null)
            const minV = Math.min(...vals), maxV = Math.max(...vals)
            const val = el[property]
            if (val === null) return 'rgba(160,176,200,0.06)'
            const norm = (val - minV) / (maxV - minV)
            // Blue→Teal→Gold gradient
            const r = Math.round(55 + norm * (239 - 55))
            const g = Math.round(138 + norm * (159 - 138))
            const b = Math.round(221 + norm * (39 - 221))
            return `rgba(${r},${g},${b},0.5)`
        }
        return `${el.col}20`
    }

    const getBorder = (el) => {
        if (el.Z === selected) return `2px solid ${el.col}`
        return `1px solid ${CAT_COLORS[el.cat] || '#888'}40`
    }

    // Build grid: period 1-4, group 1-18
    const grid = {}
    ELEMENTS.forEach(el => {
        grid[`${el.period}-${el.group}`] = el
    })

    const CELL = 38, GAP = 2
    const periods = [1, 2, 3, 4]
    const groups = Array.from({ length: 18 }, (_, i) => i + 1)

    return (
        <div>
            {/* Highlight mode */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {[
                    { k: 'category', l: 'By category' },
                    { k: 'period', l: 'Highlight period' },
                    { k: 'group', l: 'Highlight group' },
                    { k: 'block', l: 'Highlight block' },
                    { k: 'property', l: 'Property heat map' },
                ].map(opt => (
                    <button key={opt.k} onClick={() => setHighlight(opt.k)} style={{
                        padding: '4px 12px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: highlight === opt.k ? 'var(--teal)' : 'var(--bg3)',
                        color: highlight === opt.k ? '#fff' : 'var(--text2)',
                        border: `1px solid ${highlight === opt.k ? 'var(--teal)' : 'var(--border)'}`,
                    }}>{opt.l}</button>
                ))}
                {highlight === 'property' && (
                    <select value={property} onChange={e => setProperty(e.target.value)}
                        style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '3px 8px', borderRadius: 6 }}>
                        {PROPERTIES.map(p => <option key={p} value={p}>{PROP_LABELS[p]}</option>)}
                    </select>
                )}
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.entries(CAT_COLORS).map(([cat, col]) => (
                    <button key={cat} onClick={() => setFilterCat(filterCat === cat ? null : cat)} style={{
                        padding: '3px 9px', borderRadius: 20, fontSize: 10,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: filterCat === cat ? col : `${col}15`,
                        color: filterCat === cat ? '#000' : col,
                        border: `1px solid ${col}50`,
                    }}>{CAT_LABELS[cat]}</button>
                ))}
            </div>

            {/* Periodic table grid */}
            <div style={{
                overflowX: 'auto', marginBottom: 14,
                background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 12,
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(18, ${CELL}px)`,
                    gap: `${GAP}px`,
                    width: 18 * (CELL + GAP),
                }}>
                    {periods.flatMap(p =>
                        groups.map(g => {
                            const el = grid[`${p}-${g}`]
                            if (!el) return (
                                <div key={`${p}-${g}`} style={{ width: CELL, height: CELL }} />
                            )
                            const bg = getColor(el)
                            const bord = getBorder(el)
                            const isSelected = el.Z === selected
                            return (
                                <div key={el.Z}
                                    onClick={() => setSelected(isSelected ? null : el.Z)}
                                    style={{
                                        width: CELL, height: CELL, borderRadius: 4,
                                        background: bg, border: bord, cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', justifyContent: 'center',
                                        transition: 'all 0.15s',
                                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                                        zIndex: isSelected ? 10 : 1, position: 'relative',
                                    }}>
                                    <div style={{
                                        fontSize: 6, fontFamily: 'var(--mono)',
                                        color: `${CAT_COLORS[el.cat]}80`,
                                        lineHeight: 1,
                                    }}>{el.Z}</div>
                                    <div style={{
                                        fontSize: 11, fontFamily: 'var(--mono)', fontWeight: 700,
                                        color: CAT_COLORS[el.cat] || '#fff',
                                        lineHeight: 1.1,
                                    }}>{el.sym}</div>
                                    <div style={{
                                        fontSize: 6, fontFamily: 'var(--mono)',
                                        color: `${CAT_COLORS[el.cat]}70`,
                                        lineHeight: 1,
                                    }}>{el.mass.toFixed(1)}</div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Selected element info */}
            {sel ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 14 }}>
                    {/* Element card */}
                    <div style={{ padding: '16px', background: `${CAT_COLORS[sel.cat]}12`, border: `2px solid ${CAT_COLORS[sel.cat]}50`, borderRadius: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 10,
                                background: `${CAT_COLORS[sel.cat]}20`,
                                border: `2px solid ${CAT_COLORS[sel.cat]}`,
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: `${CAT_COLORS[sel.cat]}80` }}>{sel.Z}</div>
                                <div style={{ fontSize: 22, fontFamily: 'var(--mono)', fontWeight: 700, color: CAT_COLORS[sel.cat] }}>{sel.sym}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text1)' }}>{sel.name}</div>
                                <div style={{ fontSize: 12, fontFamily: 'var(--mono)', color: CAT_COLORS[sel.cat], marginTop: 4 }}>
                                    {CAT_LABELS[sel.cat]}
                                </div>
                                <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 2 }}>
                                    Period {sel.period}  ·  Group {sel.group}  ·  Block {sel.block}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { l: 'Atomic mass', v: `${sel.mass} u` },
                                { l: 'Atomic radius', v: sel.AR ? `${sel.AR} pm` : '—' },
                                { l: 'IE₁', v: `${sel.IE1} kJ/mol` },
                                { l: 'Electronegativity', v: sel.EN !== null ? sel.EN.toFixed(2) : 'N/A' },
                            ].map(p => (
                                <div key={p.l} style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>
                                    <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', marginBottom: 2 }}>{p.l}</div>
                                    <div style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 700, color: CAT_COLORS[sel.cat] }}>{p.v}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Trend position */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {/* Period trend bar */}
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                                PERIOD {sel.period} — POSITION
                            </div>
                            <div style={{ display: 'flex', gap: 3 }}>
                                {ELEMENTS.filter(e => e.period === sel.period).sort((a, b) => a.group - b.group).map(e => (
                                    <div key={e.Z} style={{
                                        width: 26, height: 26, borderRadius: 4,
                                        background: e.Z === sel.Z ? `${CAT_COLORS[e.cat]}60` : `${CAT_COLORS[e.cat]}15`,
                                        border: `1px solid ${CAT_COLORS[e.cat]}${e.Z === sel.Z ? '' : '25'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 8, fontFamily: 'var(--mono)', fontWeight: 700,
                                        color: CAT_COLORS[e.cat],
                                    }}>{e.sym}</div>
                                ))}
                            </div>
                        </div>

                        {/* Group trend bar */}
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                                GROUP {sel.group} — POSITION
                            </div>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {ELEMENTS.filter(e => e.group === sel.group).sort((a, b) => a.period - b.period).map(e => (
                                    <div key={e.Z} style={{
                                        width: 34, height: 34, borderRadius: 6,
                                        background: e.Z === sel.Z ? `${CAT_COLORS[e.cat]}60` : `${CAT_COLORS[e.cat]}15`,
                                        border: `1px solid ${CAT_COLORS[e.cat]}${e.Z === sel.Z ? '' : '25'}`,
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                        fontSize: 9, fontFamily: 'var(--mono)', fontWeight: 700,
                                        color: CAT_COLORS[e.cat],
                                    }}>
                                        <div style={{ fontSize: 7, color: `${CAT_COLORS[e.cat]}70` }}>P{e.period}</div>
                                        <div>{e.sym}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Property comparison in period */}
                        <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10 }}>
                            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', letterSpacing: 1.5, marginBottom: 8 }}>
                                IE₁ IN PERIOD {sel.period}
                            </div>
                            {ELEMENTS.filter(e => e.period === sel.period).sort((a, b) => a.group - b.group).map(e => {
                                const max = Math.max(...ELEMENTS.filter(x => x.period === sel.period).map(x => x.IE1))
                                const w = (e.IE1 / max) * 100
                                return (
                                    <div key={e.Z} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', fontWeight: 700, color: CAT_COLORS[e.cat], minWidth: 22 }}>{e.sym}</span>
                                        <div style={{ flex: 1, height: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 4, overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%', width: `${w}%`,
                                                background: e.Z === sel.Z ? CAT_COLORS[sel.cat] : `${CAT_COLORS[e.cat]}50`,
                                                borderRadius: 4, transition: 'width 0.3s',
                                            }} />
                                        </div>
                                        <span style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--text3)', minWidth: 40 }}>{e.IE1}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ padding: '24px', textAlign: 'center', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 14 }}>
                    <div style={{ fontSize: 14, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                        Click any element to see its properties and position in trends
                    </div>
                </div>
            )}

            {/* Legend */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.entries(CAT_COLORS).map(([cat, col]) => (
                    <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 12, height: 12, borderRadius: 3, background: `${col}40`, border: `1px solid ${col}` }} />
                        <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: col }}>{CAT_LABELS[cat]}</span>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {sel ? [
                    { label: 'Symbol', value: sel.sym, color: CAT_COLORS[sel.cat] },
                    { label: 'Atomic number', value: `Z = ${sel.Z}`, color: 'var(--gold)' },
                    { label: 'Block', value: `${sel.block}-block`, color: 'var(--teal)' },
                    { label: 'Category', value: CAT_LABELS[sel.cat], color: CAT_COLORS[sel.cat] },
                ].map(c => (
                    <ValueCard key={c.label} label={c.label} value={c.value} color={c.color} />
                )) : (
                    <ValueCard label="Elements shown" value={`${ELEMENTS.length} (Z=1 to 36)`} color="var(--text2)" />
                )}
            </div>
        </div>
    )
}