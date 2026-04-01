// Export generic simulators if any
export const Simulators = {};

// Export topic-specific simulators
import { DirectedAngles } from './ch01_angles/DirectedAngles';
import { AngleMeasurement } from './ch01_angles/AngleMeasurement';
import { ArcSector } from './ch01_angles/ArcSector';
import { UnitCircle } from './ch02_trig1/UnitCircle';
import { ParticularAngles } from './ch02_trig1/ParticularAngles';
import { TrigIdentities } from './ch02_trig1/TrigIdentities';
import { SumDifference } from './ch03_trig2/SumDifference';
import { DoubleAngle } from './ch03_trig2/DoubleAngle';
import { Factorization } from './ch03_trig2/Factorization';

import { DeterminantExpander } from './ch04_matrices/DeterminantExpander';
import { DeterminantProperties } from './ch04_matrices/DeterminantProperties';
import { CramersRule } from './ch04_matrices/CramersRule';
import { MatrixTypes } from './ch04_matrices/MatrixTypes';
import { MatrixAlgebra } from './ch04_matrices/MatrixAlgebra';

import { Locus } from './ch05_lines/Locus';
import { SlopeBuilder } from './ch05_lines/SlopeBuilder';
import { LineForms } from './ch05_lines/LineForms';
import { LineAngles } from './ch05_lines/LineAngles';
import { FamilyOfLines } from './ch05_lines/FamilyOfLines';

import { EquationBuilder as CircleEquation } from './ch06_circle/EquationBuilder';
import { TangentNormal as CircleTangent } from './ch06_circle/TangentNormal';
import { TangentCondition as CircleCondition } from './ch06_circle/TangentCondition';
import { ParametricEquations as CircleParametric } from './ch06_circle/ParametricEquations';
import { PointPosition as CirclePosition } from './ch06_circle/PointPosition';

import { ConicTypes } from './ch07_conics/ConicTypes';
import { ParabolaSim } from './ch07_conics/ParabolaSim';
import { EllipseSim } from './ch07_conics/EllipseSim';
import { HyperbolaSim } from './ch07_conics/HyperbolaSim';
import { FocusEquations } from './ch07_conics/FocusEquations';

import { RangeSim } from './ch08_dispersion/RangeSim';
import { VarianceSim } from './ch08_dispersion/VarianceSim';
import { StdDevSim } from './ch08_dispersion/StdDevSim';
import { CoefficientVar } from './ch08_dispersion/CoefficientVar';

import { AlgebraEvents } from './ch09_probability/AlgebraEvents';
import { ProbDefinition } from './ch09_probability/ProbDefinition';
import { AdditionTheorem } from './ch09_probability/AdditionTheorem';
import { ConditionalProb } from './ch09_probability/ConditionalProb';
import { MultiplicationThm } from './ch09_probability/MultiplicationThm';
import { BayesTheorem } from './ch09_probability/BayesTheorem';

import { SetTypes } from './ch10_sets/SetTypes';
import { VennDiagrams } from './ch10_sets/VennDiagrams';
import { SetOperations } from './ch10_sets/SetOperations';
import { Relations } from './ch10_sets/Relations';
import { FunctionTypes } from './ch10_sets/FunctionTypes';
import { DomainRange } from './ch10_sets/DomainRange';

import { ComplexAlgebra } from './ch11_complex/ComplexAlgebra';
import { ArgandDiagram } from './ch11_complex/ArgandDiagram';
import { PolarForm } from './ch11_complex/PolarForm';
import { ExponentialForm } from './ch11_complex/ExponentialForm';
import { DeMoivre } from './ch11_complex/DeMoivre';

import { ArithmeticProgression } from './ch12_sequences/ArithmeticProgression';
import { GeometricProgression } from './ch12_sequences/GeometricProgression';
import { GPSum } from './ch12_sequences/GP_Sum';
import { HarmonicProgression } from './ch12_sequences/HarmonicProgression';
import { AGProgression } from './ch12_sequences/AG_Progression';

import { CountingPrinciple } from './ch13_perms/CountingPrinciple';
import { FactorialNotation } from './ch13_perms/FactorialNotation';
import { Permutations } from './ch13_perms/Permutations';
import { Combinations } from './ch13_perms/Combinations';
import { CombinationProperties } from './ch13_perms/CombinationProperties';

import { InductionPrinciple } from './ch14_induction/InductionPrinciple';
import { InductionApplications } from './ch14_induction/InductionApplications';
import { BinomialTheorem } from './ch14_induction/BinomialTheorem';

import { LimitMeaning } from './ch15_limits/LimitMeaning';
import { LimitAlgebra } from './ch15_limits/LimitAlgebra';
import { AlgebraicLimits } from './ch15_limits/AlgebraicLimits';
import { TrigLimits } from './ch15_limits/TrigLimits';
import { ExpLogLimits } from './ch15_limits/ExpLogLimits';

import { FirstPrinciple } from './ch16_ders/FirstPrinciple.jsx';
import { DerivativePoint } from './ch16_ders/DerivativePoint.jsx';
import { DerivativeFunction } from './ch16_ders/DerivativeFunction.jsx';
import { AlgebraicDerivatives } from './ch16_ders/AlgebraicDerivatives.jsx';
import { TrigDerivatives } from './ch16_ders/TrigDerivatives.jsx';

export const TopicSimulators = {
  // Chapter 1: Angle and its Measurement
  '1-0': DirectedAngles,
  '1-1': AngleMeasurement,
  '1-2': AngleMeasurement, // Reusing component for degree/radian convert
  '1-3': ArcSector,

  // Chapter 2: Trigonometry - 1
  '2-0': UnitCircle,
  '2-1': ParticularAngles,
  '2-2': TrigIdentities,

  // Chapter 3: Trigonometry - 2
  '3-0': SumDifference,
  '3-1': DoubleAngle,
  '3-2': Factorization,

  // Chapter 4: Determinants and Matrices
  '4-0': DeterminantExpander,
  '4-1': DeterminantProperties,
  '4-2': CramersRule,
  '4-3': MatrixTypes,
  '4-4': MatrixAlgebra,

  // Chapter 5: Straight Lines
  '5-0': Locus,
  '5-1': SlopeBuilder,
  '5-2': LineForms,
  '5-3': LineAngles,
  '5-4': FamilyOfLines,

  // Chapter 6: Circle
  '6-0': CircleEquation,
  '6-1': CircleTangent,
  '6-2': CircleCondition,
  '6-3': CircleParametric,
  '6-4': CirclePosition,

  // Chapter 7: Conic Sections
  '7-0': ConicTypes,
  '7-1': ParabolaSim,
  '7-2': EllipseSim,
  '7-3': HyperbolaSim,
  '7-4': FocusEquations,

  // Chapter 8: Measures of Dispersion
  '8-0': RangeSim,
  '8-1': VarianceSim,
  '8-2': StdDevSim,
  '8-3': CoefficientVar,

  // Chapter 9: Probability
  '9-0': AlgebraEvents,
  '9-1': ProbDefinition,
  '9-2': AdditionTheorem,
  '9-3': ConditionalProb,
  '9-4': MultiplicationThm,
  '9-5': BayesTheorem,

  // Chapter 10: Sets, Relations and Functions
  '10-0': SetTypes,
  '10-1': VennDiagrams,
  '10-2': SetOperations,
  '10-3': Relations,
  '10-4': FunctionTypes,
  '10-5': DomainRange,

  // Chapter 11: Complex Numbers
  '11-0': ComplexAlgebra,
  '11-1': ArgandDiagram,
  '11-2': PolarForm,
  '11-3': ExponentialForm,
  '11-4': DeMoivre,

  // Chapter 12: Sequences and Series
  '12-0': ArithmeticProgression,
  '12-1': GeometricProgression,
  '12-2': GPSum,
  '12-3': HarmonicProgression,
  '12-4': AGProgression,

  // Chapter 13: Permutations and Combinations
  '13-0': CountingPrinciple,
  '13-1': FactorialNotation,
  '13-2': Permutations,
  '13-3': Combinations,
  '13-4': CombinationProperties,

  // Chapter 14: Mathematical Induction
  '14-0': InductionPrinciple,
  '14-1': InductionApplications,
  '14-2': BinomialTheorem,

  // Chapter 15: Limits
  '15-0': LimitMeaning,
  '15-1': LimitAlgebra,
  '15-2': AlgebraicLimits,
  '15-3': TrigLimits,
  '15-4': ExpLogLimits,

  // Chapter 16: Derivatives
  '16-0': FirstPrinciple,
  '16-1': DerivativePoint,
  '16-2': DerivativeFunction,
  '16-3': AlgebraicDerivatives,
  '16-4': TrigDerivatives,
  
};

