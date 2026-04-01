import UnitConverter from './ch01_units/UnitConverter'
import ErrorSimulator from './ch01_units/ErrorSimulator'
import DimensionChecker from './ch01_units/DimensionChecker'
import VernierCaliper from './ch01_units/VernierCaliper'

import VectorExplorer from './ch02_math/VectorExplorer'
import VectorAddition from './ch02_math/VectorAddition'
import DotCrossProduct from './ch02_math/DotCrossProduct'
import CalculusMotion from './ch02_math/CalculusMotion'

import ProjectileSim from './ch03_motion/ProjectileSim'
import CircularMotion from './ch03_motion/CircularMotion'
import RelativeVelocity from './ch03_motion/RelativeVelocity'

import NewtonFirst from './ch04_laws/NewtonFirst'
import NewtonSecond from './ch04_laws/NewtonSecond'
import NewtonThird from './ch04_laws/NewtonThird'
import FrictionSim from './ch04_laws/FrictionSim'
import CircularDyn from './ch04_laws/CircularDyn'

import GravitationalForce from './ch05_gravitation/GravitationalForce'
import GravityVariation from './ch05_gravitation/GravityVariation'
import OrbitalMotion from './ch05_gravitation/OrbitalMotion'
import EnergyWell from './ch05_gravitation/EnergyWell'

import ElasticityPlasticity from './ch06_solids/ElasticityPlasticity'
import StressStrain from './ch06_solids/StressStrain'
import ElasticModuli from './ch06_solids/ElasticModuli'
import ElasticPE from './ch06_solids/ElasticPE'

import TemperatureScales from './ch07_therma/TemperatureScales'
import ThermalExpansion from './ch07_therma/ThermalExpansion'
import Calorimetry from './ch07_therma/Calorimetry'
import HeatTransfer from './ch07_therma/HeatTransfer'
import IdealGasLaws from './ch07_therma/IdealGasLaws'

import WaveMotion from './ch08_sound/WaveMotion'
import SpeedOfSound from './ch08_sound/SpeedOfSound'
import Superposition from './ch08_sound/Superposition'
import StringsPipes from './ch08_sound/StringsPipes'
import DopplerEffect from './ch08_sound/DopplerEffect'

import ReflectionMirror from './ch09_optics/ReflectionMirror'
import RefractionSnell from './ch09_optics/RefractionSnell'
import LensSim from './ch09_optics/LensSim'
import OpticalInstruments from './ch09_optics/OpticalInstruments'
import WaveOptics from './ch09_optics/WaveOptics'

import CoulombLaw from './ch10_electro/CoulombLaw'
import EFieldPotential from './ch10_electro/EFieldPotential'
import GaussLaw from './ch10_electro/GaussLaw'
import Capacitor from './ch10_electro/Capacitor'

import DriftVelocity from './ch11_current/DriftVelocity'
import OhmsLaw from './ch11_current/OhmsLaw'
import KirchhoffLaws from './ch11_current/KirchhoffLaws'
import JouleHeating from './ch11_current/JouleHeating'

import BarMagnet from './ch12_magnetism/BarMagnet'
import LorentzForce from './ch12_magnetism/LorentzForce'
import BiotSavart from './ch12_magnetism/BiotSavart'
import MagneticMatter from './ch12_magnetism/MagneticMatter'

import FaradayInduction from './ch13_emi/FaradayInduction'
import InductanceSim from './ch13_emi/InductanceSim'
import ACGenerator from './ch13_emi/ACGenerator'
import TransformerSim from './ch13_emi/TransformerSim'

import EnergyBands from './ch14_semi/EnergyBands'
import DopingSim from './ch14_semi/DopingSim'
import PNJunction from './ch14_semi/PNJunction'
import SemiDevices from './ch14_semi/SemiDevices'

import CommElements from './ch15_comm/CommElements'
import Modulation from './ch15_comm/Modulation'
import WavePropagation from './ch15_comm/WavePropagation'
import DigitalComm from './ch15_comm/DigitalComm'

import BohrAtom from './ch16_modern/BohrAtom'
import QuantumNumbers from './ch16_modern/QuantumNumbers'
import NuclearDecay from './ch16_modern/NuclearDecay'
import PhotoelectricEffect from './ch16_modern/PhotoelectricEffect'

export const SIMULATORS = {
    ch01_t0: UnitConverter,
    ch01_t1: ErrorSimulator,
    ch01_t2: DimensionChecker,
    ch01_t3: VernierCaliper,

    ch02_t0: VectorExplorer,
    ch02_t1: VectorAddition,
    ch02_t2: DotCrossProduct,
    ch02_t3: CalculusMotion,

    ch03_t0: ProjectileSim,
    ch03_t1: CircularMotion,
    ch03_t2: RelativeVelocity,

    ch04_t0: NewtonFirst,
    ch04_t1: NewtonSecond,
    ch04_t2: NewtonThird,
    ch04_t3: FrictionSim,
    ch04_t4: CircularDyn,

    ch05_t0: GravitationalForce,
    ch05_t1: GravityVariation,
    ch05_t2: OrbitalMotion,
    ch05_t3: EnergyWell,

    ch06_t0: ElasticityPlasticity,
    ch06_t1: StressStrain,
    ch06_t2: ElasticModuli,
    ch06_t3: ElasticPE,


    ch07_t0: TemperatureScales,
    ch07_t1: ThermalExpansion,
    ch07_t2: Calorimetry,
    ch07_t3: HeatTransfer,
    ch07_t4: IdealGasLaws,

    ch08_t0: WaveMotion,
    ch08_t1: SpeedOfSound,
    ch08_t2: Superposition,
    ch08_t3: StringsPipes,
    ch08_t4: DopplerEffect,

    ch09_t0: ReflectionMirror,
    ch09_t1: RefractionSnell,
    ch09_t2: LensSim,
    ch09_t3: OpticalInstruments,
    ch09_t4: WaveOptics,

    ch10_t0: CoulombLaw,
    ch10_t1: EFieldPotential,
    ch10_t2: GaussLaw,
    ch10_t3: Capacitor,

    ch11_t0: DriftVelocity,
    ch11_t1: OhmsLaw,
    ch11_t2: KirchhoffLaws,
    ch11_t3: JouleHeating,


    ch12_t0: BarMagnet,
    ch12_t1: LorentzForce,
    ch12_t2: BiotSavart,
    ch12_t3: MagneticMatter,

    ch13_t0: FaradayInduction,
    ch13_t1: InductanceSim,
    ch13_t2: ACGenerator,
    ch13_t3: TransformerSim,

    ch14_t0: EnergyBands,
    ch14_t1: DopingSim,
    ch14_t2: PNJunction,
    ch14_t3: SemiDevices,

    ch15_t0: CommElements,
    ch15_t1: Modulation,
    ch15_t2: WavePropagation,
    ch15_t3: DigitalComm,


    ch16_t0: BohrAtom,
    ch16_t1: QuantumNumbers,
    ch16_t2: NuclearDecay,
    ch16_t3: PhotoelectricEffect,

}
