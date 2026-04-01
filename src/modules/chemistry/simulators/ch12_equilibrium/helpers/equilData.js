export const REACTIONS = {
    'N₂ + 3H₂ ⇌ 2NH₃': {
        color: '#1D9E75', Kc: 977, temp: 500,
        forward: 'N₂ + 3H₂ → 2NH₃  (exothermic, ΔH=−92 kJ)',
        back: '2NH₃ → N₂ + 3H₂',
        ΔH: -92, nGas_reactants: 4, nGas_products: 2,
        species: ['N₂', 'H₂', 'NH₃'],
        initConc: [1.0, 3.0, 0.0],
    },
    'H₂ + I₂ ⇌ 2HI': {
        color: '#7F77DD', Kc: 54.3, temp: 425,
        forward: 'H₂ + I₂ → 2HI',
        back: '2HI → H₂ + I₂',
        ΔH: 0, nGas_reactants: 2, nGas_products: 2,
        species: ['H₂', 'I₂', 'HI'],
        initConc: [1.0, 1.0, 0.0],
    },
    'N₂O₄ ⇌ 2NO₂': {
        color: '#D85A30', Kc: 0.0131, temp: 25,
        forward: 'N₂O₄ → 2NO₂  (endothermic, ΔH=+57 kJ)',
        back: '2NO₂ → N₂O₄',
        ΔH: +57, nGas_reactants: 1, nGas_products: 2,
        species: ['N₂O₄', 'NO₂'],
        initConc: [0.5, 0.0],
    },
    'CO + H₂O ⇌ CO₂ + H₂': {
        color: '#EF9F27', Kc: 4.06, temp: 500,
        forward: 'CO + H₂O → CO₂ + H₂  (water-gas shift)',
        back: 'CO₂ + H₂ → CO + H₂O',
        ΔH: -41, nGas_reactants: 2, nGas_products: 2,
        species: ['CO', 'H₂O', 'CO₂', 'H₂'],
        initConc: [1.0, 1.0, 0.0, 0.0],
    },
}

export const WEAK_ACIDS = {
    'CH₃COOH (acetic)': { Ka: 1.8e-5, color: '#EF9F27', conj: 'CH₃COO⁻' },
    'HF (hydrofluoric)': { Ka: 6.8e-4, color: '#1D9E75', conj: 'F⁻' },
    'HCN (hydrocyanic)': { Ka: 6.2e-10, color: '#7F77DD', conj: 'CN⁻' },
    'HNO₂ (nitrous)': { Ka: 4.5e-4, color: '#D85A30', conj: 'NO₂⁻' },
    'H₂CO₃ (carbonic)': { Ka: 4.3e-7, color: '#378ADD', conj: 'HCO₃⁻' },
}

export const WEAK_BASES = {
    'NH₃ (ammonia)': { Kb: 1.8e-5, color: '#7F77DD', conj: 'NH₄⁺' },
    'C₂H₅NH₂ (ethylamine)': { Kb: 5.6e-4, color: '#1D9E75', conj: 'C₂H₅NH₃⁺' },
    'C₅H₅N (pyridine)': { Kb: 1.7e-9, color: '#D85A30', conj: 'C₅H₅NH⁺' },
    'C₆H₅NH₂ (aniline)': { Kb: 4.3e-10, color: '#EF9F27', conj: 'C₆H₅NH₃⁺' },
}

export const SPARINGLY_SOLUBLE = {
    'AgCl': { Ksp: 1.8e-10, cat: 'Ag⁺', an: 'Cl⁻', catN: 1, anN: 1, color: '#888780', s_formula: 'Ksp = [Ag⁺][Cl⁻]' },
    'BaSO₄': { Ksp: 1.1e-10, cat: 'Ba²⁺', an: 'SO₄²⁻', catN: 1, anN: 1, color: '#EF9F27', s_formula: 'Ksp = [Ba²⁺][SO₄²⁻]' },
    'PbI₂': { Ksp: 9.8e-9, cat: 'Pb²⁺', an: 'I⁻', catN: 1, anN: 2, color: '#FAC775', s_formula: 'Ksp = [Pb²⁺][I⁻]²' },
    'Ca(OH)₂': { Ksp: 4.7e-6, cat: 'Ca²⁺', an: 'OH⁻', catN: 1, anN: 2, color: '#1D9E75', s_formula: 'Ksp = [Ca²⁺][OH⁻]²' },
    'Ag₂CrO₄': { Ksp: 1.1e-12, cat: 'Ag⁺', an: 'CrO₄²⁻', catN: 2, anN: 1, color: '#D85A30', s_formula: 'Ksp = [Ag⁺]²[CrO₄²⁻]' },
    'CaF₂': { Ksp: 3.4e-11, cat: 'Ca²⁺', an: 'F⁻', catN: 1, anN: 2, color: '#7F77DD', s_formula: 'Ksp = [Ca²⁺][F⁻]²' },
}