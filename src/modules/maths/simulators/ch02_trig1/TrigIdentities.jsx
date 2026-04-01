import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PythagoreanSquares = ({ mapX, mapY, angleDeg, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const rad = angleDeg * (Math.PI / 180);
  
  const cx = 0;
  const cy = 0;
  const rPx = mapX(1) - mapX(0); // 1 unit in pixels

  const tx = Math.cos(rad);
  const ty = Math.sin(rad);

  const pxCX = mapX(0);
  const pxCY = mapY(0);
  const pxTX = mapX(tx);
  const pxTY = mapY(ty);

  return (
    <g>
      {/* Unit Circle */}
      <circle cx={pxCX} cy={pxCY} r={rPx} fill="none" stroke="var(--border2)" strokeWidth={2} strokeDasharray="4 4" />
      
      {/* Triangle */}
      <polygon points={`${pxCX},${pxCY} ${pxTX},${pxCY} ${pxTX},${pxTY}`} fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth={1} />
      
      {/* Cosine Square (Horizontal: x to x+tx, down to cy-ty. Wait, a square on bottom going down? ) */}
      {/* Square on base: width = tx, height = tx. Center it on the axis or draw below? Let's draw below axis. */}
      {tx !== 0 && (
        <rect 
          x={tx > 0 ? pxCX : pxTX} 
          y={pxCY} 
          width={Math.abs(mapX(tx) - pxCX)} 
          height={Math.abs(mapX(tx) - pxCX)} 
          fill="var(--blue)" fillOpacity="0.2" 
          stroke="var(--blue)" strokeWidth="2" 
        />
      )}

      {/* Sine Square (Vertical: attached to the vertical perpendicular) */}
      {ty !== 0 && (
        <rect 
          x={tx > 0 ? pxTX : pxTX - Math.abs(mapY(ty) - pxCY)} 
          y={ty > 0 ? pxTY : pxCY} 
          width={Math.abs(mapY(ty) - pxCY)} 
          height={Math.abs(mapY(ty) - pxCY)} 
          fill="var(--coral)" fillOpacity="0.2" 
          stroke="var(--coral)" strokeWidth="2" 
        />
      )}

      {/* Hypotenuse Square (Area = 1), angled. Let's not clutter, the two squares showing sum = 1 is conceptual. */}
      {/* Drawing angled square on hypotenuse is tricky but beautiful. */}
      {/* The unit square has area 1. We just draw a square on the hypotenuse. */}
      <polygon 
        points={`
          ${pxCX},${pxCY} 
          ${pxTX},${pxTY} 
          ${mapX(tx - ty)},${mapY(ty + tx)} 
          ${mapX(-ty)},${mapY(tx)}
        `} 
        fill="var(--teal)" fillOpacity="0.1" stroke="var(--teal)" strokeWidth="2" 
      />
      
      <circle cx={pxCX} cy={pxCY} r={4} fill="white" />
    </g>
  );
};

export const TrigIdentities = () => {
  const [angleDeg, setAngleDeg] = useState(30);
  
  const rad = angleDeg * (Math.PI / 180);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  
  const sinSq = sinVal * sinVal;
  const cosSq = cosVal * cosVal;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Pythagorean Identity</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            sin²θ + cos²θ = 1 visualised geometrically via squares on a right triangle in the unit circle.
            Blue area + Red area = Green area (1).
          </p>
        </div>

        <MathSlider label="Angle (θ)" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <FormulaCard 
            title="Area Verification" 
            formula={`${sinSq.toFixed(2)} + ${cosSq.toFixed(2)} = ${Math.round(sinSq + cosSq)}`}
            description="The sum of the red and blue squares equals exactly the green square (1 unit²)."
          />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-2.5, 2.5]} range={[-2.5, 2.5]}>
          <PythagoreanSquares isSvg angleDeg={angleDeg} />
        </GraphCanvas>
      </div>
    </div>
  );
};
