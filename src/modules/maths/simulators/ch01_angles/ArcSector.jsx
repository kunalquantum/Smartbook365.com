import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { ValueCard } from '../../components/ui/ValueCard';

const SectorVisualizer = ({ mapX, mapY, radius, angleDeg, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  const cx = mapX(0);
  const cy = mapY(0);
  const rad = angleDeg * Math.PI / 180;
  
  const tx = mapX(radius * Math.cos(rad));
  const ty = mapY(radius * Math.sin(rad)); // flip Y is handled by mapY

  const rPx = mapX(radius) - cx;

  // Arc path
  const largeArc = angleDeg > 180 ? 1 : 0;
  const sweep = 0; // mapY inverts Y, so sweep is 0 for counter-clockwise
  const arcPath = angleDeg === 360 
    ? `M ${cx + rPx} ${cy} A ${rPx} ${rPx} 0 1 0 ${cx - rPx} ${cy} A ${rPx} ${rPx} 0 1 0 ${cx + rPx} ${cy}`
    : `M ${cx + rPx} ${cy} A ${rPx} ${rPx} 0 ${largeArc} ${sweep} ${tx} ${ty}`;

  const sectorPath = angleDeg === 360
    ? arcPath
    : `M ${cx} ${cy} L ${cx + rPx} ${cy} A ${rPx} ${rPx} 0 ${largeArc} ${sweep} ${tx} ${ty} Z`;

  return (
    <g>
      {/* Sector Fill */}
      <path d={sectorPath} fill="var(--indigo)" opacity="0.3" />
      
      {/* Arc Outline */}
      <path d={arcPath} fill="none" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" />
      
      {/* Radii */}
      {angleDeg !== 360 && (
        <>
          <line x1={cx} y1={cy} x2={cx + rPx} y2={cy} stroke="var(--text2)" strokeWidth="2" />
          <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--text2)" strokeWidth="2" />
        </>
      )}
      
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
};

export const ArcSector = () => {
  const [radius, setRadius] = useState(5);
  const [angleDeg, setAngleDeg] = useState(60);
  
  const rad = Math.round((angleDeg * Math.PI / 180) * 1000) / 1000;
  const arcLen = Math.round((radius * rad) * 100) / 100;
  const area = Math.round((0.5 * radius * radius * rad) * 100) / 100;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Arc Length & Sector Area</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Visualizes the length of arc (S) and area of sector (A) dynamically based on radius and angle.
          </p>
        </div>

        <MathSlider label="Radius (r)" min={1} max={10} value={radius} onChange={setRadius} unit=" cm" />
        <MathSlider label="Angle (θ)" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
          <ValueCard label="Arc Length (S = rθ)" value={`${arcLen} cm`} color="var(--teal)" />
          <ValueCard label="Sector Area (A = ½r²θ)" value={`${area} cm²`} color="var(--indigo)" />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-12, 12]} range={[-12, 12]}>
          <SectorVisualizer isSvg radius={radius} angleDeg={angleDeg} />
        </GraphCanvas>
      </div>
    </div>
  );
};
