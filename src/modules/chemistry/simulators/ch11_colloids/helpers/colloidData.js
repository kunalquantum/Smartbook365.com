export const COLLOID_TYPES = [
    { name: 'Sol', dispersed: 'Solid', medium: 'Liquid', example: 'Paint, muddy water, gold sol', color: '#EF9F27' },
    { name: 'Gel', dispersed: 'Liquid', medium: 'Solid', example: 'Jelly, cheese, butter', color: '#1D9E75' },
    { name: 'Emulsion', dispersed: 'Liquid', medium: 'Liquid', example: 'Milk, mayonnaise, cream', color: '#378ADD' },
    { name: 'Aerosol', dispersed: 'Solid', medium: 'Gas', example: 'Smoke, dust clouds', color: '#888780' },
    { name: 'Foam', dispersed: 'Gas', medium: 'Solid', example: 'Pumice stone, foam rubber', color: '#7F77DD' },
    { name: 'Liquid foam', dispersed: 'Gas', medium: 'Liquid', example: 'Whipped cream, soap foam', color: '#D85A30' },
]

export const FREUNDLICH_GASES = {
    'O₂': { k: 0.8, n: 2.0, color: '#D85A30', note: 'Moderate adsorption' },
    'CO': { k: 1.2, n: 1.8, color: '#888780', note: 'Good adsorption on charcoal' },
    'NH₃': { k: 1.8, n: 1.5, color: '#7F77DD', note: 'Strong adsorption — polar' },
    'SO₂': { k: 2.2, n: 1.3, color: '#FAC775', note: 'Very strong — highly polar' },
    'HCl': { k: 2.5, n: 1.2, color: '#1D9E75', note: 'Strongest — high polarity' },
}

export const CATALYSTS = {
    'Fe (Haber process)': {
        color: '#D85A30', Ea_cat: 92, Ea_uncat: 230,
        reaction: 'N₂ + 3H₂ → 2NH₃',
        type: 'heterogeneous', promoter: 'K₂O, Al₂O₃',
        mechanism: 'N₂ and H₂ adsorb on Fe surface → weaken bonds → react → product desorbs',
    },
    'Pt (Ostwald process)': {
        color: '#888780', Ea_cat: 65, Ea_uncat: 180,
        reaction: '4NH₃ + 5O₂ → 4NO + 6H₂O',
        type: 'heterogeneous', promoter: 'Rh (rhodium)',
        mechanism: 'NH₃ adsorbs on Pt/Rh gauze → oxidation → NO desorbs',
    },
    'MnO₂ (H₂O₂ decomp.)': {
        color: '#7F77DD', Ea_cat: 58, Ea_uncat: 200,
        reaction: '2H₂O₂ → 2H₂O + O₂',
        type: 'heterogeneous', promoter: 'None required',
        mechanism: 'H₂O₂ adsorbs on MnO₂ → O−O bond breaks → O₂ released',
    },
    'H⁺ (esterification)': {
        color: '#EF9F27', Ea_cat: 55, Ea_uncat: 150,
        reaction: 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O',
        type: 'homogeneous', promoter: 'N/A',
        mechanism: 'H⁺ protonates carbonyl → nucleophilic attack → ester formed',
    },
    'Enzyme (amylase)': {
        color: '#1D9E75', Ea_cat: 30, Ea_uncat: 180,
        reaction: 'Starch + H₂O → maltose + glucose',
        type: 'enzyme', promoter: 'Cofactors (Mg²⁺, Zn²⁺)',
        mechanism: 'Substrate fits active site (lock-and-key) → ES complex → product released',
    },
}

export const ELECTROLYTES = {
    'NaCl': { cation: 'Na⁺', charge: 1, color: '#EF9F27' },
    'CaCl₂': { cation: 'Ca²⁺', charge: 2, color: '#1D9E75' },
    'AlCl₃': { cation: 'Al³⁺', charge: 3, color: '#7F77DD' },
    'Na₂SO₄': { cation: 'Na⁺', charge: 1, color: '#EF9F27', anion: 'SO₄²⁻', anionCharge: 2 },
    'MgSO₄': { cation: 'Mg²⁺', charge: 2, color: '#D85A30' },
    'K₃PO₄': { cation: 'K⁺', charge: 1, color: '#378ADD', anion: 'PO₄³⁻', anionCharge: 3 },
}