export const ALKANES = {
    'Methane': { formula: 'CH₄', C: 1, H: 4, bp: -161.5, mp: -182.5, state: 'gas', color: '#888780' },
    'Ethane': { formula: 'C₂H₆', C: 2, H: 6, bp: -88.6, mp: -183.3, state: 'gas', color: '#888780' },
    'Propane': { formula: 'C₃H₈', C: 3, H: 8, bp: -42.1, mp: -187.7, state: 'gas', color: '#888780' },
    'Butane': { formula: 'C₄H₁₀', C: 4, H: 10, bp: -0.5, mp: -138.3, state: 'gas', color: '#888780' },
    'Pentane': { formula: 'C₅H₁₂', C: 5, H: 12, bp: 36.1, mp: -129.7, state: 'liquid', color: '#EF9F27' },
    'Hexane': { formula: 'C₆H₁₄', C: 6, H: 14, bp: 68.7, mp: -95.3, state: 'liquid', color: '#EF9F27' },
    'Heptane': { formula: 'C₇H₁₆', C: 7, H: 16, bp: 98.4, mp: -90.6, state: 'liquid', color: '#EF9F27' },
    'Octane': { formula: 'C₈H₁₈', C: 8, H: 18, bp: 125.7, mp: -56.8, state: 'liquid', color: '#D85A30' },
}

export const CONFORMATIONS = {
    'Eclipsed (0°)': { angle: 0, strain: 12.5, stability: 0, color: '#D85A30', desc: 'Maximum torsional strain — H atoms directly aligned' },
    'Gauche (60°)': { angle: 60, strain: 3.8, stability: 0.55, color: '#EF9F27', desc: 'Moderate strain — methyl and H partially eclipsed' },
    'Eclipsed (120°)': { angle: 120, strain: 12.5, stability: 0, color: '#D85A30', desc: 'Eclipsed again — same strain as 0°' },
    'Anti (180°)': { angle: 180, strain: 0, stability: 1, color: '#1D9E75', desc: 'Most stable — groups fully staggered and farthest apart' },
    'Gauche (240°)': { angle: 240, strain: 3.8, stability: 0.55, color: '#EF9F27', desc: 'Mirror of 60° gauche' },
    'Eclipsed (300°)': { angle: 300, strain: 12.5, stability: 0, color: '#D85A30', desc: 'Eclipsed — same as 0° and 120°' },
}

export const ADDITION_REACTIONS = {
    'Hydrogenation': { reagent: 'H₂ / Ni, Pt or Pd', product: 'Alkane', mechanism: 'syn addition', example: 'CH₂=CH₂ + H₂ →(Ni) CH₃CH₃', color: '#1D9E75', temp: 'heat (150°C)', Markov: false },
    'HBr addition': { reagent: 'HBr', product: 'Bromoalkane (Markovnikov)', mechanism: 'electrophilic addition', example: 'CH₂=CHCH₃ + HBr → CH₃CHBrCH₃', color: '#D85A30', temp: 'room temp', Markov: true },
    'Br₂ addition': { reagent: 'Br₂ (in CCl₄)', product: 'Dibromoalkane — decolourises brown', mechanism: 'electrophilic addition (bromonium)', example: 'CH₂=CH₂ + Br₂ → BrCH₂CH₂Br', color: '#EF9F27', temp: 'room temp', Markov: false },
    'H₂O (acid)': { reagent: 'H₂O / H₂SO₄', product: 'Alcohol (Markovnikov)', mechanism: 'electrophilic addition', example: 'CH₂=CHCH₃ + H₂O →(H⁺) CH₃CH(OH)CH₃', color: '#378ADD', temp: 'heat', Markov: true },
    'Ozonolysis': { reagent: 'O₃ then Zn/H₂O', product: 'Carbonyl fragments (aldehyde/ketone)', mechanism: 'cycloaddition', example: 'CH₂=CHCH₃ →(O₃) HCHO + CH₃CHO', color: '#7F77DD', temp: '−78°C', Markov: false },
    'Baeyer\'s test': { reagent: 'KMnO₄ (alk.)', product: 'Diol — purple decolourises', mechanism: 'syn dihydroxylation', example: 'CH₂=CH₂ + KMnO₄ → HOCH₂CH₂OH', color: '#7F77DD', temp: 'cold', Markov: false },
}

export const EAS_REACTIONS = {
    'Nitration': { reagent: 'conc. HNO₃ + conc. H₂SO₄', product: 'Nitrobenzene', electrophile: 'NO₂⁺ (nitronium ion)', conditions: '50−60°C', color: '#D85A30', eq: 'C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O' },
    'Sulphonation': { reagent: 'fuming H₂SO₄ (oleum)', product: 'Benzenesulphonic acid', electrophile: 'SO₃ or HSO₃⁺', conditions: 'room temp', color: '#EF9F27', eq: 'C₆H₆ + H₂SO₄ → C₆H₅SO₃H + H₂O' },
    'Halogenation': { reagent: 'Cl₂ / FeCl₃', product: 'Chlorobenzene + HCl', electrophile: 'Cl⁺ (from FeCl₃ catalyst)', conditions: 'room temp, Lewis acid', color: '#1D9E75', eq: 'C₆H₆ + Cl₂ →(FeCl₃) C₆H₅Cl + HCl' },
    'Friedel-Crafts alkylation': { reagent: 'RCl / AlCl₃', product: 'Alkylbenzene', electrophile: 'R⁺ carbocation', conditions: 'anhydrous, Lewis acid', color: '#7F77DD', eq: 'C₆H₆ + CH₃Cl →(AlCl₃) C₆H₅CH₃ + HCl' },
    'Friedel-Crafts acylation': { reagent: 'RCOCl / AlCl₃', product: 'Aryl ketone', electrophile: 'RCO⁺ (acylium)', conditions: 'anhydrous', color: '#888780', eq: 'C₆H₆ + CH₃COCl →(AlCl₃) C₆H₅COCH₃ + HCl' },
}

export const DIRECTING_GROUPS = [
    { group: '−OH', type: 'ortho/para activating', color: '#1D9E75', mechanism: '+R (lone pair donation)', example: 'Phenol → faster EAS at o/p positions' },
    { group: '−NH₂', type: 'ortho/para activating', color: '#FAC775', mechanism: '+R (lone pair donation)', example: 'Aniline → very fast EAS' },
    { group: '−CH₃', type: 'ortho/para activating', color: '#888780', mechanism: '+I (hyperconjugation)', example: 'Toluene → slightly faster EAS' },
    { group: '−Cl', type: 'ortho/para deactivating', color: '#1D9E75', mechanism: '−I stronger than +R', example: 'Chlorobenzene → slower but o/p product' },
    { group: '−NO₂', type: 'meta deactivating', color: '#D85A30', mechanism: '−I and −R', example: 'Nitrobenzene → very slow, meta product' },
    { group: '−COOH', type: 'meta deactivating', color: 'var(--coral)', mechanism: '−I and −R', example: 'Benzoic acid → meta product' },
]

export const ALKYNE_REACTIONS = [
    { name: 'Hydrogenation (partial)', reagent: 'H₂ / Lindlar cat.', product: 'cis-Alkene', note: 'Lindlar (Pd/CaCO₃ + quinoline) gives cis-alkene only', color: '#1D9E75' },
    { name: 'Hydrogenation (full)', reagent: 'H₂ (excess) / Ni', product: 'Alkane', note: 'Two moles H₂ consumed; complete reduction', color: '#888780' },
    { name: 'Na/liquid NH₃ (Birch)', reagent: 'Na / liq. NH₃', product: 'trans-Alkene', note: 'Dissolving metal reduction — gives trans-alkene (Birch reduction)', color: '#7F77DD' },
    { name: 'HX addition', reagent: 'HBr (2 mol)', product: 'gem-dihalide', note: 'Markovnikov twice — both X on same carbon', color: '#D85A30' },
    { name: 'Halogenation', reagent: 'Br₂ (2 mol)', product: 'Tetrabromoalkane', note: 'Two moles Br₂ add across triple bond', color: '#EF9F27' },
    { name: 'Hydration (Markovnikov)', reagent: 'H₂O / H₂SO₄, HgSO₄', product: 'Ketone (via enol)', note: 'Keto-enol tautomerism — terminal alkyne gives methyl ketone', color: '#378ADD' },
    { name: 'Acidic H reaction', reagent: 'NaNH₂ or Na metal', product: 'Sodium acetylide', note: 'Terminal alkynes acidic (pKa≈25) — react with strong base to form nucleophile', color: 'var(--coral)' },
]