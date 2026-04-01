export const GASES = {
    'He': { a: 0.034, b: 0.0238, M: 4.003, color: '#A8D8B9', name: 'Helium', desc: 'Noble gas — nearly ideal' },
    'H₂': { a: 0.244, b: 0.0266, M: 2.016, color: '#E8F5EF', name: 'Hydrogen', desc: 'Lightest gas — nearly ideal' },
    'N₂': { a: 1.39, b: 0.0391, M: 28.014, color: '#378ADD', name: 'Nitrogen', desc: 'Diatomic — mildly non-ideal' },
    'O₂': { a: 1.36, b: 0.0318, M: 31.999, color: '#D85A30', name: 'Oxygen', desc: 'Diatomic — mildly non-ideal' },
    'CO₂': { a: 3.59, b: 0.0427, M: 44.010, color: '#1D9E75', name: 'Carbon dioxide', desc: 'Polar — significant deviations' },
    'NH₃': { a: 4.17, b: 0.0371, M: 17.031, color: '#7F77DD', name: 'Ammonia', desc: 'H-bonding — large deviations' },
    'Cl₂': { a: 6.49, b: 0.0562, M: 70.906, color: '#FAC775', name: 'Chlorine', desc: 'Large molecule — high a, b' },
    'CH₄': { a: 2.25, b: 0.0428, M: 16.043, color: '#888780', name: 'Methane', desc: 'Non-polar — moderate deviations' },
}

export const LIQUIDS = {
    'Water': { ST: 72.8, viscosity: 1.002, VP: 3.17, BP: 100, color: '#378ADD', STnote: 'High ST due to H-bonding' },
    'Ethanol': { ST: 22.3, viscosity: 1.200, VP: 5.95, BP: 78, color: '#EF9F27', STnote: 'Lower ST — weaker H-bonds' },
    'Mercury': { ST: 485.5, viscosity: 1.526, VP: 0.002, BP: 357, color: '#888780', STnote: 'Highest ST — metallic bonds' },
    'Acetone': { ST: 23.7, viscosity: 0.316, VP: 24.7, BP: 56, color: '#7F77DD', STnote: 'Low ST — polar but no H-bonds' },
    'Benzene': { ST: 28.9, viscosity: 0.652, VP: 9.95, BP: 80, color: '#1D9E75', STnote: 'Aromatic — π interactions' },
}

export const UNIT_CELLS = {
    'Simple cubic (SC)': {
        atomsPerCell: 1, CN: 6, PE: 52.4,
        fraction: '8 × ⅛',
        color: '#EF9F27',
        example: 'Polonium (Po)',
        packingDesc: 'Lowest packing — large voids',
        r_a: 'a = 2r',
    },
    'Body-centred cubic (BCC)': {
        atomsPerCell: 2, CN: 8, PE: 68.0,
        fraction: '8×⅛ + 1',
        color: '#1D9E75',
        example: 'Fe, Na, K, Cr',
        packingDesc: 'Better packing — body centre fills',
        r_a: 'a = 4r/√3',
    },
    'Face-centred cubic (FCC/CCP)': {
        atomsPerCell: 4, CN: 12, PE: 74.0,
        fraction: '8×⅛ + 6×½',
        color: '#7F77DD',
        example: 'Cu, Ag, Au, Ni, NaCl',
        packingDesc: 'Closest packing — most efficient',
        r_a: 'a = 2√2 r',
    },
}