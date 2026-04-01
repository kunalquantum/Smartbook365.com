import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const SpiralVisualizer = ({ mapX, mapY, angleDeg, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const rad = angleDeg * (Math.PI / 180);
  const rRay = 7;
  
  // Parametric spiral for rotation path
  const points = [];
  const steps = Math.abs(angleDeg);
  const direction = angleDeg < 0 ? -1 : 1;
  
  for (let i = 0; i <= steps; i += Math.max(1, steps / 100)) {
    const t = i * (Math.PI / 180) * direction;
    const currentR = 2 + (i / 360) * 0.8; // Radius expands slightly per rotation
    points.push(`${mapX(currentR * Math.cos(t))},${mapY(currentR * Math.sin(t))}`);
  }
  
  // Make sure last point is exact
  const finalR = 2 + (steps / 360) * 0.8;
  points.push(`${mapX(finalR * Math.cos(rad))},${mapY(finalR * Math.sin(rad))}`);
  
  const pathD = `M ${points.join(' L ')}`;
  
  const tx = rRay * Math.cos(rad);
  const ty = rRay * Math.sin(rad);

  return (
    <g>
      {/* Spiral trace showing full rotation history */}
      <path d={pathD} fill="none" stroke="var(--gold)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Initial Ray */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(rRay)} y2={mapY(0)} stroke="var(--text3)" strokeLinecap="round" strokeWidth={3} />
      {/* Terminal Ray */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(tx)} y2={mapY(ty)} stroke="var(--indigo)" strokeLinecap="round" strokeWidth={3} />
      
      <circle cx={mapX(tx)} cy={mapY(ty)} r={5} fill="var(--blue)" />
      <circle cx={mapX(0)} cy={mapY(0)} r={4} fill="white" />
    </g>
  );
};

export const DirectedAngles = () => {
  const [angleDeg, setAngleDeg] = useState(405);

  const quadrant = angleDeg >= 0 
    ? ((Math.floor((angleDeg % 360) / 90)) + 1)
    : ((Math.floor(((360 + (angleDeg % 360)) % 360) / 90)) + 1);
    
  const rotations = Math.floor(Math.abs(angleDeg) / 360);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Directed Angles & Co-terminal</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Angles &gt; 360° show multiple full rotations. Notice the spiral tracking the exact path.
          </p>
        </div>
        
        <MathSlider label="Angle (θ)" min={-720} max={720} value={angleDeg} onChange={setAngleDeg} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormulaCard 
            title="Direction" 
            formula={`${angleDeg > 0 ? 'Anti-clockwise' : angleDeg < 0 ? 'Clockwise' : 'Zero'}`} 
          />
          <FormulaCard 
            title="Properties" 
            formula={`Quadrant ${quadrant}`} 
            description={`${rotations} full turn(s)`}
          />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-8, 8]} range={[-8, 8]}>
          <SpiralVisualizer isSvg angleDeg={angleDeg} />
        </GraphCanvas>
      </div>
    </div>
  );
};
