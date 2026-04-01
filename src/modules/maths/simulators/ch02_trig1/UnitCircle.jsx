import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { ValueCard } from '../../components/ui/ValueCard';

const SnapAngles = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360];

const UnitCircleVisualizer = ({ mapX, mapY, angleDeg, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const rad = angleDeg * (Math.PI / 180);
  
  const cx = mapX(0);
  const cy = mapY(0);
  const rPx = mapX(1) - cx;

  const tx = mapX(Math.cos(rad));
  const ty = mapY(Math.sin(rad));

  return (
    <g>
      {/* Unit Circle */}
      <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Snap Point Indicators */}
      {SnapAngles.map(a => {
        const arad = a * Math.PI / 180;
        return <circle key={a} cx={mapX(Math.cos(arad))} cy={mapY(Math.sin(arad))} r={2} fill="rgba(255,255,255,0.2)" />;
      })}

      {/* Triangle Fill */}
      <path d={`M ${cx} ${cy} L ${tx} ${ty} L ${tx} ${cy} Z`} fill="rgba(74, 143, 231, 0.15)" stroke="var(--blue)" strokeWidth="1" strokeLinejoin="round" />
      
      {/* Sine (Vertical) */}
      <line x1={tx} y1={cy} x2={tx} y2={ty} stroke="var(--coral)" strokeWidth="3" />
      
      {/* Cosine (Horizontal) */}
      <line x1={cx} y1={cy} x2={tx} y2={cy} stroke="var(--blue)" strokeWidth="3" />

      {/* Hypotenuse */}
      <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--text1)" strokeWidth="2" />
      
      <circle cx={tx} cy={ty} r={5} fill="var(--indigo)" />
    </g>
  );
};

export const UnitCircle = () => {
  const [angleDeg, setAngleDeg] = useState(45);
  
  // Snap to nearest 15/30 if close
  const displayAngle = SnapAngles.find(a => Math.abs(a - angleDeg) < 3) ?? angleDeg;
  
  const rad = displayAngle * (Math.PI / 180);
  const sinVal = Math.round(Math.sin(rad) * 1000) / 1000;
  const cosVal = Math.round(Math.cos(rad) * 1000) / 1000;
  const tanVal = Math.abs(Math.cos(rad)) < 0.001 ? 'Undefined' : Math.round(Math.tan(rad) * 1000) / 1000;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--indigo)', marginBottom: '8px' }}>Annotated Unit Circle</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Sine represents the vertical projection (red), Cosine represents the horizontal projection (blue). Snaps to common angles.
          </p>
        </div>

        <MathSlider label="Angle (θ)" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <ValueCard label="Vertical Projection (sin θ)" value={sinVal} color="var(--coral)" />
          <ValueCard label="Horizontal Projection (cos θ)" value={cosVal} color="var(--blue)" />
          <ValueCard label="Slope (tan θ = sin/cos)" value={tanVal} color="var(--teal)" />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={400} height={400} domain={[-1.5, 1.5]} range={[-1.5, 1.5]}>
          <UnitCircleVisualizer isSvg angleDeg={displayAngle} />
          
          <HtmlLabel isHtml x={Math.cos(rad) / 2} y={-0.1} style={{ color: 'var(--blue)', fontSize: '11px', fontWeight: 'bold' }}>
            {cosVal}
          </HtmlLabel>
          <HtmlLabel isHtml x={Math.cos(rad) + (Math.cos(rad) > 0 ? 0.1 : -0.1)} y={Math.sin(rad) / 2} style={{ color: 'var(--coral)', fontSize: '11px', fontWeight: 'bold' }}>
            {sinVal}
          </HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
