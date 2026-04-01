import React, { useState } from 'react';
import { GraphCanvas } from '../components/ui/GraphCanvas';
import { MathSlider } from '../components/ui/MathSlider';
import { FormulaCard } from '../components/ui/FormulaCard';
import { ValueCard } from '../components/ui/ValueCard';

// Topic 0: Trigonometric functions with the help of unit circle
export const Ch02Topic0 = () => {
  const [angleDeg, setAngleDeg] = useState(45);
  
  const drawUnitCircle = (ctx, { w, h, mapX, mapY }) => {
    const cx = mapX(0);
    const cy = mapY(0);
    const radiusPx = mapX(1) - cx;
    const rad = angleDeg * (Math.PI / 180);
    
    // Draw unit circle
    ctx.beginPath();
    ctx.arc(cx, cy, radiusPx, 0, 2 * Math.PI);
    ctx.strokeStyle = 'var(--text-muted)';
    ctx.lineWidth = 2;
    ctx.stroke();

    const tx = mapX(Math.cos(rad));
    const ty = mapY(Math.sin(rad)); // standard y-up mapped correctly

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.lineTo(tx, cy);
    ctx.closePath();
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'var(--primary-light)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Point
    ctx.beginPath();
    ctx.arc(tx, ty, 6, 0, 2 * Math.PI);
    ctx.fillStyle = 'var(--accent)';
    ctx.fill();
  };

  const rad = angleDeg * (Math.PI / 180);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <MathSlider label="Angle (θ)" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
        <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
          <ValueCard label="sin(θ) = y" value={sinVal.toFixed(3)} color="var(--info)" />
          <ValueCard label="cos(θ) = x" value={cosVal.toFixed(3)} color="var(--primary)" />
          <ValueCard label="tan(θ) = y/x" value={Math.abs(tanVal) > 1000 ? '∞' : tanVal.toFixed(3)} color="var(--accent)" />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={300} height={300} drawFunction={drawUnitCircle} domain={[-1.5, 1.5]} range={[-1.5, 1.5]} />
      </div>
    </div>
  );
};

// Topic 1: Trigonometric functions of particular angles
export const Ch02Topic1 = () => {
  const [selectedAngle, setSelectedAngle] = useState(30);
  const angles = [0, 30, 45, 60, 90, 180, 270, 360];

  const values = {
    0: { sin: '0', cos: '1', tan: '0' },
    30: { sin: '1/2', cos: '√3/2', tan: '1/√3' },
    45: { sin: '1/√2', cos: '1/√2', tan: '1' },
    60: { sin: '√3/2', cos: '1/2', tan: '√3' },
    90: { sin: '1', cos: '0', tan: 'Not defined' },
    180: { sin: '0', cos: '-1', tan: '0' },
    270: { sin: '-1', cos: '0', tan: 'Not defined' },
    360: { sin: '0', cos: '1', tan: '0' },
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {angles.map(a => (
          <button 
            key={a}
            onClick={() => setSelectedAngle(a)}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--primary)',
              background: selectedAngle === a ? 'var(--primary)' : 'transparent',
              color: 'white', cursor: 'pointer', fontWeight: 600
            }}
          >
            {a}°
          </button>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
        <FormulaCard title={`sin(${selectedAngle}°)`} formula={values[selectedAngle].sin} />
        <FormulaCard title={`cos(${selectedAngle}°)`} formula={values[selectedAngle].cos} />
        <FormulaCard title={`tan(${selectedAngle}°)`} formula={values[selectedAngle].tan} />
      </div>
    </div>
  );
};

// Topic 2: Fundamental Identities
export const Ch02Topic2 = () => {
  const [angleDeg, setAngleDeg] = useState(30);
  const rad = angleDeg * (Math.PI / 180);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  
  const sinSq = sinVal * sinVal;
  const cosSq = cosVal * cosVal;

  return (
    <div style={{ padding: '16px' }}>
      <MathSlider label="Test Angle" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
      <div style={{ marginTop: '24px' }}>
        <FormulaCard 
          title="Verify Identity: sin²θ + cos²θ = 1" 
          formula={`${sinSq.toFixed(4)} + ${cosSq.toFixed(4)} = ${(sinSq + cosSq).toFixed(4)}`} 
          description="Notice how it always adds up to 1 regardless of the angle!"
        />
      </div>
    </div>
  );
};
