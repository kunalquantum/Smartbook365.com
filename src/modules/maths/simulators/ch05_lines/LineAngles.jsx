import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';

const IntersectAngleVisualizer = ({ mapX, mapY, m1, m2, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  // Two lines passing through origin (0,0) with slopes m1, m2
  // We can draw them from x=-5 to 5
  
  // Calculate polar angles of the slopes to draw the wedge arc correctly
  const a1 = Math.atan(m1);
  const a2 = Math.atan(m2);
  
  // Determine arc boundaries
  const startAng = Math.min(a1, a2);
  const endAng = Math.max(a1, a2);

  // Wedge radius
  const rw = 2; // arc radius
  const arcR = Math.abs(mapX(rw) - mapX(0));
  const x1Arc = mapX(rw * Math.cos(startAng));
  const y1Arc = mapY(rw * Math.sin(startAng));
  const x2Arc = mapX(rw * Math.cos(endAng));
  const y2Arc = mapY(rw * Math.sin(endAng));

  return (
    <g>
      <line x1={mapX(-5)} y1={mapY(-5*m1)} x2={mapX(5)} y2={mapY(5*m1)} stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
      <line x1={mapX(-5)} y1={mapY(-5*m2)} x2={mapX(5)} y2={mapY(5*m2)} stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Interior Arc Wedge */}
      <path 
        d={`M ${mapX(0)} ${mapY(0)} L ${x1Arc} ${y1Arc} A ${arcR} ${arcR} 0 0 0 ${x2Arc} ${y2Arc} Z`} 
        fill="rgba(232, 93, 84, 0.2)" stroke="var(--coral)" strokeWidth="2" 
      />
      
      <circle cx={mapX(0)} cy={mapY(0)} r={5} fill="white" />
    </g>
  );
};

export const LineAngles = () => {
  const [m1, setM1] = useState(0.5);
  const [m2, setM2] = useState(-2);

  // Angle formula: tan(theta) = |(m1 - m2) / (1 + m1*m2)|
  const denom = 1 + m1 * m2;
  let angDeg = 90; // Default to 90 if perp
  if (Math.abs(denom) > 0.001) {
    const tanTheta = Math.abs((m1 - m2) / denom);
    angDeg = Math.atan(tanTheta) * (180 / Math.PI);
  }

  // Find midpoint angle for label
  const a1 = Math.atan(m1);
  const a2 = Math.atan(m2);
  const midAng = (a1 + a2) / 2;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Angle Between Lines</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The acute angle θ between two intersecting lines is strictly governed by their slopes $m_1$ and $m_2$.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          <MathSlider label="Slope m₁ (Blue)" min={-5} max={5} step={0.25} value={m1} onChange={setM1} />
          <MathSlider label="Slope m₂ (Teal)" min={-5} max={5} step={0.25} value={m2} onChange={setM2} />
        </div>

        <div style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
          <div className="math-font" style={{ fontSize: '1.1rem', color: 'var(--text2)', marginBottom: '8px' }}>
            tan(θ) = |(m₁ - m₂) / (1 + m₁m₂)|
          </div>
          <div className="math-font" style={{ fontSize: '1.5rem', color: 'var(--coral)' }}>
            {Math.abs(denom) < 0.001 ? 'Lines are Perpendicular (90°)' : `θ ≈ ${angDeg.toFixed(1)}°`}
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-5, 5]} range={[-5, 5]}>
          <IntersectAngleVisualizer isSvg m1={m1} m2={m2} />
          <HtmlLabel isHtml x={0.5 * Math.cos(midAng)} y={0.5 * Math.sin(midAng)} style={{color: 'var(--coral)', fontWeight:'bold', background:'transparent'}}>
            {angDeg.toFixed(1)}°
          </HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
