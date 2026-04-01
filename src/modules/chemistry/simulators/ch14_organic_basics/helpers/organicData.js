export const FUNCTIONAL_GROUPS = {
    'Alkane': {
        formula: 'C−H, C−C (σ only)', suffix: '-ane', color: '#888780',
        example: 'CH₄, C₂H₆, C₃H₈', exName: 'Methane, Ethane, Propane',
        hybridisation: 'sp³', bond: 'Single bonds only',
        properties: 'Non-polar, low boiling point, insoluble in water',
        reactions: ['Combustion', 'Halogenation (free radical)', 'Cracking'],
        structure: 'CCCC',
    },
    'Alkene': {
        formula: 'C=C (σ+π)', suffix: '-ene', color: '#1D9E75',
        example: 'C₂H₄, C₃H₆, 1-butene', exName: 'Ethene, Propene',
        hybridisation: 'sp²', bond: 'Double bond (1σ + 1π)',
        properties: 'Slightly polar, reactive (electrophilic addition)',
        reactions: ['Electrophilic addition', 'Hydrogenation', 'Polymerisation', 'Ozonolysis'],
        structure: 'C=CC',
    },
    'Alkyne': {
        formula: 'C≡C (σ+2π)', suffix: '-yne', color: '#EF9F27',
        example: 'C₂H₂, C₃H₄', exName: 'Ethyne (acetylene), Propyne',
        hybridisation: 'sp', bond: 'Triple bond (1σ + 2π)',
        properties: 'Linear, reactive, acidic terminal H',
        reactions: ['Electrophilic addition', 'Hydrogenation', 'Acidic H reaction'],
        structure: 'C#CC',
    },
    'Alcohol': {
        formula: '−OH', suffix: '-ol', color: '#378ADD',
        example: 'CH₃OH, C₂H₅OH', exName: 'Methanol, Ethanol',
        hybridisation: 'sp³ (O)', bond: 'C−O−H',
        properties: 'H-bonding → high BP, miscible with water',
        reactions: ['Dehydration', 'Oxidation', 'Esterification', 'Lucas test'],
        structure: 'CCO',
    },
    'Aldehyde': {
        formula: '−CHO', suffix: '-al', color: '#D85A30',
        example: 'HCHO, CH₃CHO', exName: 'Formaldehyde, Acetaldehyde',
        hybridisation: 'sp² (C)', bond: 'C=O (carbonyl)',
        properties: 'Polar, lower BP than alcohol, easily oxidised',
        reactions: ["Tollen's test", "Fehling's test", 'Nucleophilic addition', 'Cannizzaro'],
        structure: 'CC=O',
    },
    'Ketone': {
        formula: '−C(=O)−', suffix: '-one', color: '#7F77DD',
        example: 'CH₃COCH₃', exName: 'Acetone (propanone)',
        hybridisation: 'sp² (C)', bond: 'C=O (carbonyl)',
        properties: 'Polar, good solvent, cannot be easily oxidised',
        reactions: ['Nucleophilic addition', 'Iodoform test (CH₃CO−)', 'Aldol condensation'],
        structure: 'CC(=O)C',
    },
    'Carboxylic acid': {
        formula: '−COOH', suffix: '-oic acid', color: 'var(--coral)',
        example: 'HCOOH, CH₃COOH', exName: 'Formic acid, Acetic acid',
        hybridisation: 'sp² (C)', bond: 'C=O + O−H (resonance)',
        properties: 'Acidic, H-bonding, higher BP',
        reactions: ['Esterification', 'Salt formation', 'Decarboxylation', 'Reduction'],
        structure: 'CC(=O)O',
    },
    'Amine': {
        formula: '−NH₂', suffix: '-amine', color: '#FAC775',
        example: 'CH₃NH₂, C₆H₅NH₂', exName: 'Methylamine, Aniline',
        hybridisation: 'sp³ (N)', bond: 'C−N−H',
        properties: 'Basic, H-bonding (weaker than OH)',
        reactions: ['Acylation', 'Diazotisation', 'Reaction with acid', 'Hofmann bromamide'],
        structure: 'CCN',
    },
    'Ester': {
        formula: '−COO−', suffix: '-oate', color: '#A8D8B9',
        example: 'CH₃COOC₂H₅', exName: 'Ethyl acetate',
        hybridisation: 'sp² (C)', bond: 'C=O + C−O−C',
        properties: 'Fruity smell, lower BP than acid',
        reactions: ['Hydrolysis (acid/base)', 'Transesterification', 'Saponification'],
        structure: 'CC(=O)OC',
    },
}

export const IUPAC_EXAMPLES = [
    {
        name: '2-methylpropane',
        chain: 3, substituents: [{ type: 'methyl', pos: 2 }],
        steps: [
            'Find longest continuous carbon chain → 3C = propane',
            'Identify substituents → methyl group at C2',
            'Number chain to give lowest locant to substituent',
            'Name: 2-methylpropane',
        ],
        formula: '(CH₃)₂CHCH₃ → C₄H₁₀',
        color: '#EF9F27',
    },
    {
        name: '3-methylbut-1-ene',
        chain: 4, substituents: [{ type: 'methyl', pos: 3 }], doubleBond: 1,
        steps: [
            'Longest chain with double bond → 4C = butene',
            'Number so double bond gets lowest number → but-1-ene',
            'Methyl substituent at C3',
            'Name: 3-methylbut-1-ene',
        ],
        formula: 'CH₂=CHCH(CH₃)₂ → C₅H₁₀',
        color: '#1D9E75',
    },
    {
        name: '2-chloro-3-methylbutanal',
        chain: 4, substituents: [{ type: 'Cl', pos: 2 }, { type: 'methyl', pos: 3 }], functional: 'aldehyde',
        steps: [
            'Identify principal group → −CHO = aldehyde → suffix -al',
            'Number chain from −CHO end (C1)',
            'Cl at C2, methyl at C3',
            'Name: 2-chloro-3-methylbutanal',
        ],
        formula: '(CH₃)₂CHCH(Cl)CHO → C₅H₉ClO',
        color: '#D85A30',
    },
    {
        name: '2-methylpropan-1-ol',
        chain: 3, substituents: [{ type: 'methyl', pos: 2 }], functional: 'alcohol', OHpos: 1,
        steps: [
            'Identify principal group → −OH = alcohol → suffix -ol',
            'Longest chain including C with OH → 3C = propan-1-ol',
            'Methyl at C2',
            'Name: 2-methylpropan-1-ol',
        ],
        formula: '(CH₃)₂CHCH₂OH → C₄H₁₀O',
        color: '#378ADD',
    },
]

export const ISOMERS = {
    'C₄H₁₀ (butane)': {
        type: 'structural (chain)',
        color: '#EF9F27',
        isomers: [
            { name: 'n-butane', formula: 'CH₃CH₂CH₂CH₃', bp: -0.5 },
            { name: '2-methylpropane (isobutane)', formula: '(CH₃)₃CH', bp: -11.7 },
        ],
        note: 'Chain isomers differ in carbon skeleton. Branching lowers boiling point (less surface contact area).',
    },
    'C₃H₇Cl (chloropropane)': {
        type: 'structural (position)',
        color: '#1D9E75',
        isomers: [
            { name: '1-chloropropane', formula: 'CH₃CH₂CH₂Cl', bp: 46.6 },
            { name: '2-chloropropane', formula: '(CH₃)₂CHCl', bp: 36.5 },
        ],
        note: 'Position isomers differ in position of functional group on the same carbon skeleton.',
    },
    'C₂H₆O': {
        type: 'structural (functional group)',
        color: '#378ADD',
        isomers: [
            { name: 'Ethanol', formula: 'CH₃CH₂OH', bp: 78.4 },
            { name: 'Dimethyl ether', formula: 'CH₃OCH₃', bp: -24.0 },
        ],
        note: 'Functional group isomers have same molecular formula but different functional groups. Ethanol H-bonds; ether does not → huge BP difference.',
    },
    '2-butene (cis/trans)': {
        type: 'geometrical (cis-trans)',
        color: '#D85A30',
        isomers: [
            { name: 'cis-2-butene', formula: 'H and CH₃ same side', bp: 3.7 },
            { name: 'trans-2-butene', formula: 'H and CH₃ opposite sides', bp: 0.9 },
        ],
        note: 'Geometrical isomers exist because restricted rotation around C=C. cis has higher boiling point due to higher polarity.',
    },
    'Lactic acid (optical)': {
        type: 'optical (enantiomers)',
        color: '#7F77DD',
        isomers: [
            { name: 'D-lactic acid (R)', formula: 'Rotates plane-polarised light clockwise (+)', bp: null },
            { name: 'L-lactic acid (S)', formula: 'Rotates light anticlockwise (−)', bp: null },
        ],
        note: 'Optical isomers (enantiomers) are non-superimposable mirror images. Identical physical properties except optical rotation. Chiral centre = carbon with 4 different groups.',
    },
}

export const MECHANISMS = {
    'SN2': {
        name: 'SN2 — Bimolecular nucleophilic substitution',
        color: '#1D9E75',
        example: 'CH₃Br + OH⁻ → CH₃OH + Br⁻',
        steps: [
            'Nucleophile (OH⁻) attacks carbon from back side',
            'Transition state: C with 5 partial bonds (trigonal bipyramidal)',
            'Leaving group (Br⁻) departs simultaneously',
            'Inversion of configuration (Walden inversion)',
        ],
        rate: 'Rate = k[substrate][nucleophile]  ← 2nd order',
        favoured: 'Primary substrates, strong nucleophiles, polar aprotic solvents',
        stereo: 'Complete inversion of configuration',
        color_sub: '#1D9E75',
    },
    'SN1': {
        name: 'SN1 — Unimolecular nucleophilic substitution',
        color: '#EF9F27',
        example: '(CH₃)₃CBr + H₂O → (CH₃)₃COH + HBr',
        steps: [
            'Step 1 (slow): C−Br bond breaks → carbocation intermediate',
            'Carbocation stabilised by hyperconjugation/induction',
            'Step 2 (fast): Nucleophile attacks carbocation from either face',
            'Racemic mixture formed (50:50)',
        ],
        rate: 'Rate = k[substrate]  ← 1st order (only substrate in RDS)',
        favoured: 'Tertiary substrates, weak nucleophiles, polar protic solvents',
        stereo: 'Racemisation (mixture of both configurations)',
        color_sub: '#EF9F27',
    },
    'E2': {
        name: 'E2 — Bimolecular elimination',
        color: '#7F77DD',
        example: 'CH₃CH₂Br + OH⁻ → CH₂=CH₂ + Br⁻ + H₂O',
        steps: [
            'Base (OH⁻) abstracts β-hydrogen simultaneously',
            'C−Br bond breaks simultaneously',
            'π bond forms — alkene produced',
            'Anti-periplanar geometry required (H and X on opposite sides)',
        ],
        rate: 'Rate = k[substrate][base]  ← 2nd order',
        favoured: 'Strong bulky base, high temperature, anti-periplanar geometry',
        stereo: 'Stereospecific — anti addition',
        color_sub: '#7F77DD',
    },
    'E1': {
        name: 'E1 — Unimolecular elimination',
        color: '#D85A30',
        example: '(CH₃)₃CBr → (CH₃)₂C=CH₂ + HBr (with heat)',
        steps: [
            'Step 1 (slow): C−Br ionises → carbocation + Br⁻',
            'Step 2 (fast): Base removes β-hydrogen',
            'π bond forms → alkene',
            'Saytzeff product (more substituted alkene) favoured',
        ],
        rate: 'Rate = k[substrate]  ← 1st order',
        favoured: 'Tertiary substrates, weak base, high temperature',
        stereo: 'Non-stereospecific — mixture of geometrical isomers',
        color_sub: '#D85A30',
    },
}

export const INDUCTIVE_GROUPS = [
    { group: '−F', I: +2.0, R: +0.5, col: '#1D9E75', type: '−I, +R' },
    { group: '−Cl', I: +1.5, R: +0.3, col: '#1D9E75', type: '−I, +R' },
    { group: '−OH', I: +0.9, R: +1.8, col: '#378ADD', type: '−I, +R' },
    { group: '−NH₂', I: +0.6, R: +2.2, col: '#FAC775', type: '−I, +R' },
    { group: '−NO₂', I: +1.8, R: +1.5, col: '#D85A30', type: '−I, −R' },
    { group: '−CN', I: +1.2, R: +0.8, col: '#7F77DD', type: '−I, −R' },
    { group: '−COOH', I: +0.8, R: +0.6, col: 'var(--coral)', type: '−I, −R' },
    { group: '−CH₃', I: -0.3, R: -0.1, col: '#888780', type: '+I' },
]