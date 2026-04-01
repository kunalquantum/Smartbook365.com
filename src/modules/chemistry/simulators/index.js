import LawsCombination from './ch01_basics/LawsCombination'
import MolarMass from './ch01_basics/MolarMass'
import MoleConcept from './ch01_basics/MoleConcept'
import Stoichiometry from './ch01_basics/Stoichiometry'
import EmpiricalFormula from './ch01_basics/EmpiricalFormula'
import Filtration from './ch03_techniques/Filtration'
import Distillation from './ch03_techniques/Distillation'
import Chromatography from './ch03_techniques/Chromatography'
import SolventExtract from './ch03_techniques/SolventExtract'
import AtomicModels from './ch04_atomic/AtomicModels'
import QuantumModel from './ch04_atomic/QuantumModel'
import QuantumNumbers from './ch04_atomic/QuantumNumbers'
import ElectronConfig from './ch04_atomic/ElectronConfig'
import DualNature from './ch04_atomic/DualNature'
import IonicBonding from './ch05_bonding/IonicBonding'
import LewisStructures from './ch05_bonding/LewisStructures'
import VSEPRBuilder from './ch05_bonding/VSEPRBuilder'
import Hybridisation from './ch05_bonding/Hybridisation'
import MOTheory from './ch05_bonding/MOTheory'
import HydrogenBonding from './ch05_bonding/HydrogenBonding'
import OxidationReduction from './ch06_redox/OxidationReduction'
import OxidationNumbers from './ch06_redox/OxidationNumbers'
import RedoxBalancer from './ch06_redox/RedoxBalancer'
import ElectrochemSeries from './ch06_redox/ElectrochemSeries'
import AlkaliMetals from './ch08_group12/AlkaliMetals'
import LiAnomaly from './ch08_group12/LiAnomaly'
import AlkalineEarth from './ch08_group12/AlkalineEarth'
import BeAnomaly from './ch08_group12/BeAnomaly'
import Compounds from './ch08_group12/Compounds'
import Group13Boron from './ch09_group131415/Group13Boron'
import Group14Carbon from './ch09_group131415/Group14Carbon'
import Group15Nitrogen from './ch09_group131415/Group15Nitrogen'
import OxidesOxoacids from './ch09_group131415/OxidesOxoacids'
import GasLaws from './ch10_states/GasLaws'
import KineticTheory from './ch10_states/KineticTheory'
import RealGases from './ch10_states/RealGases'
import Liquids from './ch10_states/Liquids'
import Solids from './ch10_states/Solids'
import Adsorption from './ch11_colloids/Adsorption'
import Catalysis from './ch11_colloids/Catalysis'
import Colloids from './ch11_colloids/Colloids'
import Coagulation from './ch11_colloids/Coagulation'
import EquilibriumConcept from './ch12_equilibrium/EquilibriumConcept'
import LeChatelier from './ch12_equilibrium/LeChatelier'
import IonicEquilibrium from './ch12_equilibrium/IonicEquilibrium'
import Ksp from './ch12_equilibrium/Ksp'
import SaltHydrolysis from './ch12_equilibrium/SaltHydrolysis'
import Radioactivity from './ch13_nuclear/Radioactivity'
import DecayKinetics from './ch13_nuclear/DecayKinetics'
import NuclearReactions from './ch13_nuclear/NuclearReactions'
import Applications from './ch13_nuclear/Applications'
import ElectronicEffects from './ch14_organic_basics/ElectronicEffects'
import FunctionalGroups from './ch14_organic_basics/FunctionalGroups'
import Nomenclature from './ch14_organic_basics/Nomenclature'
import Isomerism from './ch14_organic_basics/Isomerism'
import ReactionMechanisms from './ch14_organic_basics/ReactionMechanisms'
import Alkanes from './ch15_hydrocarbons/Alkanes'
import Alkenes from './ch15_hydrocarbons/Alkenes'
import Alkynes from './ch15_hydrocarbons/Alkynes'
import AromaticHydrocarbons from './ch15_hydrocarbons/AromaticHydrocarbons'
import Reactions from './ch15_hydrocarbons/Reactions'
import Drugs from './ch16_everyday/Drugs'
import Polymers from './ch16_everyday/Polymers'
import FoodChemistry from './ch16_everyday/FoodChemistry'
import CleaningAgents from './ch16_everyday/CleaningAgents'
export const SIMULATORS = {
    ch01_t0: LawsCombination, ch01_t1: MolarMass,
    ch01_t2: MoleConcept, ch01_t3: Stoichiometry,
    ch01_t4: EmpiricalFormula,
    ch03_t0: Filtration, ch03_t1: Distillation,
    ch03_t2: Chromatography, ch03_t3: SolventExtract,
    ch04_t0: AtomicModels, ch04_t1: QuantumModel,
    ch04_t2: QuantumNumbers, ch04_t3: ElectronConfig,
    ch04_t4: DualNature,
    ch05_t0: IonicBonding, ch05_t1: LewisStructures,
    ch05_t2: VSEPRBuilder, ch05_t3: Hybridisation,
    ch05_t4: MOTheory, ch05_t5: HydrogenBonding,
    ch06_t0: OxidationReduction, ch06_t1: OxidationNumbers,
    ch06_t2: RedoxBalancer, ch06_t3: ElectrochemSeries,
    ch08_t0: AlkaliMetals, ch08_t1: LiAnomaly,
    ch08_t2: AlkalineEarth, ch08_t3: BeAnomaly,
    ch08_t4: Compounds,
    ch09_t0: Group13Boron, ch09_t1: Group14Carbon,
    ch09_t2: Group15Nitrogen, ch09_t3: OxidesOxoacids,
    ch10_t0: GasLaws, ch10_t1: KineticTheory,
    ch10_t2: RealGases, ch10_t3: Liquids,
    ch10_t4: Solids,
    ch11_t0: Adsorption,
    ch11_t1: Catalysis,
    ch11_t2: Colloids,
    ch11_t3: Coagulation,
    ch12_t0: EquilibriumConcept,
    ch12_t1: LeChatelier,
    ch12_t2: IonicEquilibrium,
    ch12_t3: Ksp,
    ch12_t4: SaltHydrolysis,
    ch13_t0: Radioactivity,
    ch13_t1: DecayKinetics,
    ch13_t2: NuclearReactions,
    ch13_t3: Applications,
    ch14_t0: ElectronicEffects,
    ch14_t1: FunctionalGroups,
    ch14_t2: Nomenclature,
    ch14_t3: Isomerism,
    ch14_t4: ReactionMechanisms,
    ch15_t0: Alkanes,
    ch15_t1: Alkenes,
    ch15_t2: Alkynes,
    ch15_t3: AromaticHydrocarbons,
    ch15_t4: Reactions,
    ch16_t0: Drugs,
    ch16_t1: Polymers,
    ch16_t2: FoodChemistry,
    ch16_t3: CleaningAgents,
}