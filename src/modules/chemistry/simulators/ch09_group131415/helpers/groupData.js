export const GROUP13 = [
    { sym: 'B', name: 'Boron', Z: 5, AR: 87, IE1: 800, EN: 2.04, mp: 2076, type: 'metalloid', color: '#7F77DD' },
    { sym: 'Al', name: 'Aluminium', Z: 13, AR: 143, IE1: 577, EN: 1.61, mp: 660, type: 'metal', color: '#888780' },
    { sym: 'Ga', name: 'Gallium', Z: 31, AR: 122, IE1: 579, EN: 1.81, mp: 30, type: 'metal', color: '#888780' },
    { sym: 'In', name: 'Indium', Z: 49, AR: 163, IE1: 558, EN: 1.78, mp: 157, type: 'metal', color: '#888780' },
    { sym: 'Tl', name: 'Thallium', Z: 81, AR: 170, IE1: 589, EN: 1.62, mp: 304, type: 'metal', color: '#888780' },
]

export const GROUP14 = [
    { sym: 'C', name: 'Carbon', Z: 6, AR: 77, IE1: 1086, EN: 2.55, mp: 3550, type: 'nonmetal', color: '#888780' },
    { sym: 'Si', name: 'Silicon', Z: 14, AR: 117, IE1: 786, EN: 1.90, mp: 1414, type: 'metalloid', color: '#7F77DD' },
    { sym: 'Ge', name: 'Germanium', Z: 32, AR: 122, IE1: 762, EN: 2.01, mp: 938, type: 'metalloid', color: '#7F77DD' },
    { sym: 'Sn', name: 'Tin', Z: 50, AR: 140, IE1: 709, EN: 1.96, mp: 232, type: 'metal', color: '#888780' },
    { sym: 'Pb', name: 'Lead', Z: 82, AR: 175, IE1: 716, EN: 2.33, mp: 327, type: 'metal', color: '#888780' },
]

export const GROUP15 = [
    { sym: 'N', name: 'Nitrogen', Z: 7, AR: 56, IE1: 1402, EN: 3.04, mp: -210, type: 'nonmetal', color: '#378ADD' },
    { sym: 'P', name: 'Phosphorus', Z: 15, AR: 98, IE1: 1012, EN: 2.19, mp: 44, type: 'nonmetal', color: '#EF9F27' },
    { sym: 'As', name: 'Arsenic', Z: 33, AR: 114, IE1: 947, EN: 2.18, mp: 817, type: 'metalloid', color: '#7F77DD' },
    { sym: 'Sb', name: 'Antimony', Z: 51, AR: 133, IE1: 834, EN: 2.05, mp: 631, type: 'metalloid', color: '#7F77DD' },
    { sym: 'Bi', name: 'Bismuth', Z: 83, AR: 143, IE1: 703, EN: 2.02, mp: 271, type: 'metal', color: '#888780' },
]

export const CARBON_ALLOTROPES = [
    {
        name: 'Diamond', formula: 'C (sp³)',
        color: '#A8D8B9', hybridisation: 'sp³',
        structure: '3D tetrahedral network — each C bonded to 4 others',
        hardness: '10/10 (hardest known)',
        conduct: 'Non-conductor (no free e⁻)',
        uses: 'Cutting tools, jewellery, abrasives',
        density: 3.51,
    },
    {
        name: 'Graphite', formula: 'C (sp²)',
        color: '#888780', hybridisation: 'sp²',
        structure: 'Layered hexagonal sheets — weak van der Waals between layers',
        hardness: '1-2/10 (soft — layers slide)',
        conduct: 'Good conductor (delocalised π e⁻)',
        uses: 'Pencils, lubricant, electrodes, graphene source',
        density: 2.09,
    },
    {
        name: 'Fullerene (C₆₀)', formula: 'C₆₀',
        color: '#EF9F27', hybridisation: 'sp²',
        structure: 'Spherical cage — 60 C atoms, 20 hexagons + 12 pentagons',
        hardness: 'Moderate (molecular solid)',
        conduct: 'Semiconductor (modified)',
        uses: 'Drug delivery, superconductors (doped), nanotechnology',
        density: 1.72,
    },
    {
        name: 'Graphene', formula: 'C (single layer)',
        color: '#1D9E75', hybridisation: 'sp²',
        structure: 'Single atom thick hexagonal sheet — 2D material',
        hardness: '200× stronger than steel',
        conduct: 'Excellent (highest known electron mobility)',
        uses: 'Transistors, sensors, composite materials',
        density: null,
    },
]

export const N_OXIDES = [
    { formula: 'N₂O', ON: +1, name: 'Dinitrogen oxide', col: '#A8D8B9', acid: false, desc: 'Laughing gas — anaesthetic' },
    { formula: 'NO', ON: +2, name: 'Nitric oxide', col: '#1D9E75', acid: false, desc: 'Air pollutant, biological signalling' },
    { formula: 'N₂O₃', ON: +3, name: 'Dinitrogen trioxide', col: '#EF9F27', acid: true, desc: 'Anhydride of HNO₂' },
    { formula: 'NO₂', ON: +4, name: 'Nitrogen dioxide', col: '#D85A30', acid: true, desc: 'Brown gas, air pollution, Ostwald process' },
    { formula: 'N₂O₅', ON: +5, name: 'Dinitrogen pentoxide', col: '#7F77DD', acid: true, desc: 'Anhydride of HNO₃' },
]

export const P_OXOACIDS = [
    { formula: 'H₃PO₄', name: 'Phosphoric acid', basicity: 3, pBonds: 0, pHbonds: 0, desc: 'All 3 OH groups ionisable — triprotic', color: '#EF9F27' },
    { formula: 'H₃PO₃', name: 'Phosphorous acid', basicity: 2, pBonds: 1, pHbonds: 1, desc: '1 P−H bond (not ionisable) — diprotic', color: '#1D9E75' },
    { formula: 'H₃PO₂', name: 'Hypophosphorous acid', basicity: 1, pBonds: 2, pHbonds: 2, desc: '2 P−H bonds (not ionisable) — monoprotic', color: '#378ADD' },
]