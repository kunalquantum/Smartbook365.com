export const DRUG_CLASSES = {
    'Analgesics': {
        color: '#D85A30',
        desc: 'Pain killers — block pain signals',
        subclasses: [
            { name: 'Non-narcotic (NSAIDs)', examples: 'Aspirin, Paracetamol, Ibuprofen', mechanism: 'Block COX enzymes → reduce prostaglandin synthesis → less pain/inflammation', addictive: false, sideEffect: 'GI irritation (aspirin), liver damage (paracetamol overdose)' },
            { name: 'Narcotic (opioids)', examples: 'Morphine, Codeine, Heroin', mechanism: 'Bind opioid receptors in CNS → block pain → euphoria', addictive: true, sideEffect: 'Highly addictive, respiratory depression, constipation' },
        ],
    },
    'Antibiotics': {
        color: '#1D9E75',
        desc: 'Kill or inhibit bacteria — do not work on viruses',
        subclasses: [
            { name: 'Bactericidal', examples: 'Penicillin, Streptomycin, Ciprofloxacin', mechanism: 'Kill bacteria — disrupt cell wall synthesis (penicillin) or DNA replication', addictive: false, sideEffect: 'Allergy, gut flora disruption' },
            { name: 'Bacteriostatic', examples: 'Tetracycline, Chloramphenicol, Erythromycin', mechanism: 'Inhibit bacterial growth — block protein synthesis', addictive: false, sideEffect: 'Photosensitivity, grey syndrome (chloramphenicol)' },
        ],
    },
    'Antiseptics': {
        color: '#7F77DD',
        desc: 'Applied to living tissue to kill/inhibit microorganisms',
        subclasses: [
            { name: 'Antiseptics', examples: 'Dettol, Savlon, Boric acid', mechanism: 'Disrupt cell membrane of bacteria/fungi', addictive: false, sideEffect: 'Mild — skin irritation if concentrated' },
            { name: 'Disinfectants', examples: 'Phenol (0.2%), Bleach, Formaldehyde', mechanism: 'Kill microorganisms on non-living surfaces — more concentrated than antiseptics', addictive: false, sideEffect: 'Toxic if ingested — not for use on skin' },
        ],
    },
    'Tranquilisers': {
        color: '#378ADD',
        desc: 'CNS depressants — relieve anxiety and stress',
        subclasses: [
            { name: 'Barbiturates', examples: 'Veronal, Amytal, Luminal', mechanism: 'Enhance GABA activity → reduce CNS excitation', addictive: true, sideEffect: 'Highly addictive, overdose fatal' },
            { name: 'Benzodiazepines', examples: 'Diazepam (Valium), Alprazolam (Xanax)', mechanism: 'Bind GABA-A receptor → calming, anxiolytic', addictive: true, sideEffect: 'Dependence, memory impairment' },
        ],
    },
    'Antacids': {
        color: '#EF9F27',
        desc: 'Neutralise excess stomach acid (HCl)',
        subclasses: [
            { name: 'Systemic antacids', examples: 'NaHCO₃, Na₂CO₃', mechanism: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂', addictive: false, sideEffect: 'Belching, alkalosis if overused' },
            { name: 'Non-systemic', examples: 'Mg(OH)₂, Al(OH)₃, CaCO₃', mechanism: 'Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O — not absorbed', addictive: false, sideEffect: 'Constipation (Al), diarrhoea (Mg)' },
        ],
    },
    'Antihistamines': {
        color: '#FAC775',
        desc: 'Block histamine receptors — treat allergies',
        subclasses: [
            { name: 'H1 blockers', examples: 'Diphenhydramine, Cetirizine, Loratadine', mechanism: 'Block H1 receptors → prevent vasodilation, itching, bronchospasm', addictive: false, sideEffect: 'Drowsiness (older generation)' },
        ],
    },
}

export const POLYMERS = {
    'Polyethylene (LDPE)': {
        type: 'addition', natural: false, color: '#888780',
        monomer: 'CH₂=CH₂ (ethylene)', repeat: '−(CH₂CH₂)ₙ−',
        Tg: -120, density: 0.91, crystallinity: 'semi',
        uses: ['Plastic bags', 'Bottles', 'Packaging film'],
        properties: 'Flexible, low density, chemically resistant',
        reaction: 'nCH₂=CH₂ →(initiator) −(CH₂−CH₂)ₙ−',
    },
    'PVC': {
        type: 'addition', natural: false, color: '#D85A30',
        monomer: 'CH₂=CHCl (vinyl chloride)', repeat: '−(CH₂CHCl)ₙ−',
        Tg: 87, density: 1.4, crystallinity: 'amorphous',
        uses: ['Pipes', 'Cables', 'Flooring'],
        properties: 'Rigid (unplasticised), flame retardant',
        reaction: 'nCH₂=CHCl →(radical) −(CH₂CHCl)ₙ−',
    },
    'Teflon (PTFE)': {
        type: 'addition', natural: false, color: '#1D9E75',
        monomer: 'CF₂=CF₂ (tetrafluoroethylene)', repeat: '−(CF₂CF₂)ₙ−',
        Tg: 117, density: 2.2, crystallinity: 'semi',
        uses: ['Non-stick cookware', 'Gaskets', 'Medical implants'],
        properties: 'Extremely low friction, chemically inert, high temperature',
        reaction: 'nCF₂=CF₂ → −(CF₂CF₂)ₙ−',
    },
    'Nylon-6,6': {
        type: 'condensation', natural: false, color: '#EF9F27',
        monomer: 'Hexamethylenediamine + Adipic acid', repeat: '−NH(CH₂)₆NHCO(CH₂)₄CO−',
        Tg: 50, density: 1.14, crystallinity: 'semi',
        uses: ['Textiles', 'Ropes', 'Toothbrush bristles', 'Gears'],
        properties: 'Strong, tough, good abrasion resistance',
        reaction: 'H₂N(CH₂)₆NH₂ + HOOC(CH₂)₄COOH → Nylon + H₂O',
    },
    'Bakelite': {
        type: 'condensation', natural: false, color: '#7F77DD',
        monomer: 'Phenol + Formaldehyde (HCHO)', repeat: '3D cross-linked network',
        Tg: null, density: 1.3, crystallinity: 'thermoset',
        uses: ['Electrical fittings', 'Handles', 'Circuit boards'],
        properties: 'Thermosetting — cannot be remelted, excellent insulator',
        reaction: 'C₆H₅OH + HCHO →(H⁺/OH⁻) cross-linked phenol-formaldehyde',
    },
    'Natural rubber': {
        type: 'natural', natural: true, color: '#D85A30',
        monomer: 'Isoprene (2-methylbuta-1,3-diene)', repeat: 'cis-polyisoprene',
        Tg: -70, density: 0.92, crystallinity: 'amorphous',
        uses: ['Tyres', 'Gloves', 'Elastic bands'],
        properties: 'Elastic, waterproof; vulcanised (S bridges) for strength',
        reaction: 'Latex from Hevea brasiliensis → cis-1,4-polyisoprene',
    },
    'Starch': {
        type: 'natural', natural: true, color: '#A8D8B9',
        monomer: 'α-D-glucose', repeat: 'α(1→4) and α(1→6) glycosidic bonds',
        Tg: null, density: 1.5, crystallinity: 'semi',
        uses: ['Food (energy storage)', 'Paper making', 'Adhesives'],
        properties: 'Amylose (linear) + amylopectin (branched)',
        reaction: 'nC₆H₁₂O₆ → (C₆H₁₀O₅)ₙ + nH₂O',
    },
    'Protein': {
        type: 'natural', natural: true, color: '#FAC775',
        monomer: 'Amino acids (H₂N−CHR−COOH)', repeat: '−NH−CHR−CO− (peptide bond)',
        Tg: null, density: 1.3, crystallinity: 'varies',
        uses: ['Enzymes', 'Structural (collagen, keratin)', 'Hormones'],
        properties: '20 amino acids, sequence determines 3D structure and function',
        reaction: 'H₂N−CHR₁−COOH + H₂N−CHR₂−COOH → dipeptide + H₂O',
    },
}

export const FOOD_ADDITIVES = {
    'Preservatives': {
        color: '#D85A30',
        items: [
            { name: 'Sodium benzoate', use: 'Soft drinks, pickles', mechanism: 'Inhibits yeast and bacteria — disrupts cell membrane', safe: true },
            { name: 'Sodium chloride', use: 'Meat, fish curing', mechanism: 'Lowers water activity — bacteria cannot grow', safe: true },
            { name: 'Sodium nitrite', use: 'Processed meats', mechanism: 'Inhibits Clostridium botulinum; gives pink colour', safe: 'moderate', concern: 'Forms nitrosamines at high temp' },
            { name: 'Potassium sorbate', use: 'Cheese, bread', mechanism: 'Disrupts fungal cell membrane', safe: true },
            { name: 'Vinegar (acetic acid)', use: 'Pickles, sauces', mechanism: 'Low pH inhibits microbial growth', safe: true },
        ],
    },
    'Antioxidants': {
        color: '#1D9E75',
        items: [
            { name: 'BHT (butylated hydroxytoluene)', use: 'Fats, oils, cereals', mechanism: 'Donates H• to lipid radicals — stops chain oxidation', safe: 'moderate', concern: 'May be carcinogenic at high doses' },
            { name: 'Vitamin C (ascorbic acid)', use: 'Fruit juices, jams', mechanism: 'Reducing agent — sacrificial oxidation', safe: true },
            { name: 'Vitamin E (tocopherol)', use: 'Vegetable oils', mechanism: 'Scavenges free radicals in lipid bilayers', safe: true },
            { name: 'Sulphur dioxide (SO₂)', use: 'Dried fruit, wine', mechanism: 'Inhibits oxidative enzymes', safe: 'moderate', concern: 'Trigger for asthmatics' },
        ],
    },
    'Artificial sweeteners': {
        color: '#7F77DD',
        items: [
            { name: 'Saccharin', sweetness: 300, cal: 0, use: 'Diabetic foods', safe: 'debate', concern: 'Possible bladder carcinogen at very high doses (rat studies)' },
            { name: 'Aspartame', sweetness: 180, cal: 4, use: 'Diet drinks, gum', safe: true, concern: 'Breaks down to phenylalanine (issue for PKU patients)' },
            { name: 'Sucralose', sweetness: 600, cal: 0, use: 'Baking, drinks', safe: true, concern: 'Very stable at high temperature' },
            { name: 'Stevia', sweetness: 300, cal: 0, use: 'Natural alternative', safe: true, concern: 'None significant — plant derived' },
            { name: 'Alitame', sweetness: 2000, cal: 0, use: 'Limited use', safe: true, concern: 'Very high potency — difficult to use' },
        ],
    },
}

export const CLEANING_AGENTS = {
    'Soap': {
        color: '#378ADD',
        type: 'ionic surfactant',
        formula: 'RCOONa (sodium salt of long-chain fatty acid)',
        make: 'Saponification: fat + NaOH → soap + glycerol',
        mechanism: 'Polar COO⁻ head (hydrophilic) + long non-polar tail (hydrophobic) → forms micelle around grease',
        pros: ['Biodegradable', 'Made from natural fats', 'Non-toxic'],
        cons: ['Scum in hard water (Ca²⁺/Mg²⁺ → insoluble soap)', 'Less effective in acidic water'],
        HardWater: '2RCOONa + CaCl₂ → (RCOO)₂Ca↓ + 2NaCl  (scum!)',
    },
    'Detergent': {
        color: '#EF9F27',
        type: 'synthetic surfactant',
        formula: 'RSO₃Na (sodium alkylbenzenesulphonate)',
        make: 'Alkylbenzene + H₂SO₄ (sulphonation) → sulphonic acid → neutralise with NaOH',
        mechanism: 'Same hydrophobic/hydrophilic principle as soap — but sulphonate group stays soluble with Ca²⁺/Mg²⁺',
        pros: ['Works in hard water', 'Works in acidic/alkaline conditions', 'More powerful surfactant'],
        cons: ['Older types non-biodegradable (environmental issue)', 'May irritate skin'],
        HardWater: 'RSO₃Na + CaCl₂ → Ca(RSO₃)₂ (stays soluble — no scum!)',
    },
}