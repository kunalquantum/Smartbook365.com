import React, { useState } from 'react';
import { MathSlider } from '../components/ui/MathSlider';
import { FormulaCard } from '../components/ui/FormulaCard';
import { ValueCard } from '../components/ui/ValueCard';

// Topic 0: Trigonometric functions of sum and difference
export const Ch03Topic0 = () => {
  const [angleA, setAngleA] = useState(45);
  const [angleB, setAngleB] = useState(30);

  const radA = angleA * Math.PI / 180;
  const radB = angleB * Math.PI / 180;

  const sinA = Math.sin(radA);
  const cosA = Math.cos(radA);
  const sinB = Math.sin(radB);
  const cosB = Math.cos(radB);

  const sinSumExp = sinA * cosB + cosA * sinB;
  const sinSumActual = Math.sin(radA + radB);

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <MathSlider label="Angle A" min={0} max={90} value={angleA} onChange={setAngleA} unit="°" />
        <MathSlider label="Angle B" min={0} max={90} value={angleB} onChange={setAngleB} unit="°" />
      </div>
      
      <FormulaCard 
        title="sin(A + B) = sin A cos B + cos A sin B"
        formula={`sin(${angleA + angleB}°) = ${sinSumActual.toFixed(4)}`}
        description={`Expanded: (${sinA.toFixed(3)})(${cosB.toFixed(3)}) + (${cosA.toFixed(3)})(${sinB.toFixed(3)}) = ${sinSumExp.toFixed(4)}`}
      />
    </div>
  );
};

// Topic 1: Multiple angles
export const Ch03Topic1 = () => {
  const [angle, setAngle] = useState(30);
  
  const rad = angle * Math.PI / 180;
  const sinA = Math.sin(rad);
  const cosA = Math.cos(rad);
  
  const sin2A = Math.sin(2 * rad);
  const expSin2A = 2 * sinA * cosA;

  return (
    <div style={{ padding: '16px' }}>
      <MathSlider label="Angle A" min={0} max={180} value={angle} onChange={setAngle} unit="°" />
      <div style={{ marginTop: '24px' }}>
        <FormulaCard 
          title="Double Angle Identity: sin(2A) = 2 sin A cos A"
          formula={`sin(${2 * angle}°) = ${sin2A.toFixed(4)}`}
          description={`Expanded: 2 × ${sinA.toFixed(3)} × ${cosA.toFixed(3)} = ${expSin2A.toFixed(4)}`}
        />
      </div>
    </div>
  );
};

// Topic 2: Factorization formulae
export const Ch03Topic2 = () => {
  return (
    <div style={{ padding: '16px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Key Factorization Formulae (Sum to Product)</p>
      <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
        <div className="math-font" style={{ background: 'var(--bg-surface-solid)', padding: '16px', borderRadius: '8px' }}>
          sin C + sin D = 2 sin( (C+D)/2 ) cos( (C-D)/2 )
        </div>
        <div className="math-font" style={{ background: 'var(--bg-surface-solid)', padding: '16px', borderRadius: '8px' }}>
          sin C - sin D = 2 cos( (C+D)/2 ) sin( (C-D)/2 )
        </div>
        <div className="math-font" style={{ background: 'var(--bg-surface-solid)', padding: '16px', borderRadius: '8px' }}>
          cos C + cos D = 2 cos( (C+D)/2 ) cos( (C-D)/2 )
        </div>
        <div className="math-font" style={{ background: 'var(--bg-surface-solid)', padding: '16px', borderRadius: '8px' }}>
          cos C - cos D = -2 sin( (C+D)/2 ) sin( (C-D)/2 )
        </div>
      </div>
    </div>
  );
};
