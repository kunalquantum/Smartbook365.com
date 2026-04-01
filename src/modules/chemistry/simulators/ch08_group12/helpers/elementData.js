export const GROUP1 = [
    { sym: 'Li', name: 'Lithium', Z: 3, M: 6.94, mp: 180, bp: 1342, density: 0.53, IE1: 520, EN: 0.98, AR: 152, rxnWater: 'slow', oxideType: 'normal', flameCol: '#CC3300', flameHex: 'Crimson red' },
    { sym: 'Na', name: 'Sodium', Z: 11, M: 22.99, mp: 98, bp: 883, density: 0.97, IE1: 496, EN: 0.93, AR: 186, rxnWater: 'vigorous', oxideType: 'peroxide', flameCol: '#FFAA00', flameHex: 'Golden yellow' },
    { sym: 'K', name: 'Potassium', Z: 19, M: 39.10, mp: 64, bp: 774, density: 0.86, IE1: 419, EN: 0.82, AR: 227, rxnWater: 'violent', oxideType: 'superoxide', flameCol: '#AA44FF', flameHex: 'Lilac/violet' },
    { sym: 'Rb', name: 'Rubidium', Z: 37, M: 85.47, mp: 39, bp: 688, density: 1.53, IE1: 403, EN: 0.82, AR: 248, rxnWater: 'violent', oxideType: 'superoxide', flameCol: '#FF4488', flameHex: 'Red-violet' },
    { sym: 'Cs', name: 'Caesium', Z: 55, M: 132.9, mp: 29, bp: 671, density: 1.87, IE1: 376, EN: 0.79, AR: 265, rxnWater: 'explosive', oxideType: 'superoxide', flameCol: '#88CCFF', flameHex: 'Blue-violet' },
]

export const GROUP2 = [
    { sym: 'Be', name: 'Beryllium', Z: 4, M: 9.01, mp: 1287, bp: 2469, density: 1.85, IE1: 899, EN: 1.57, AR: 112, rxnWater: 'none', hydroxideSol: 'insoluble', sulfateSol: 'soluble' },
    { sym: 'Mg', name: 'Magnesium', Z: 12, M: 24.31, mp: 650, bp: 1090, density: 1.74, IE1: 738, EN: 1.31, AR: 160, rxnWater: 'steam', hydroxideSol: 'slightly', sulfateSol: 'soluble' },
    { sym: 'Ca', name: 'Calcium', Z: 20, M: 40.08, mp: 842, bp: 1484, density: 1.55, IE1: 590, EN: 1.00, AR: 197, rxnWater: 'steady', hydroxideSol: 'slightly', sulfateSol: 'slightly' },
    { sym: 'Sr', name: 'Strontium', Z: 38, M: 87.62, mp: 777, bp: 1382, density: 2.64, IE1: 550, EN: 0.95, AR: 215, rxnWater: 'rapid', hydroxideSol: 'soluble', sulfateSol: 'slightly' },
    { sym: 'Ba', name: 'Barium', Z: 56, M: 137.3, mp: 727, bp: 1897, density: 3.51, IE1: 503, EN: 0.89, AR: 222, rxnWater: 'rapid', hydroxideSol: 'soluble', sulfateSol: 'insoluble' },
]

export const TREND_PROPS = {
    'Atomic radius (pm)': { g1: e => e.AR, g2: e => e.AR, unit: 'pm', dir: 'increases ↓ group', color: '#EF9F27' },
    'Ionisation energy': { g1: e => e.IE1, g2: e => e.IE1, unit: 'kJ/mol', dir: 'decreases ↓ group', color: '#D85A30' },
    'Electronegativity': { g1: e => e.EN, g2: e => e.EN, unit: '(Pauling)', dir: 'decreases ↓ group', color: '#7F77DD' },
    'Melting point (°C)': { g1: e => e.mp, g2: e => e.mp, unit: '°C', dir: 'decreases ↓ group', color: '#378ADD' },
    'Density (g/cm³)': { g1: e => e.density, g2: e => e.density, unit: 'g/cm³', dir: 'increases ↓ group', color: '#1D9E75' },
}