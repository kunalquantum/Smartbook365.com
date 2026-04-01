import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { ValueCard } from '../../components/ui/ValueCard';
import { FormulaCard } from '../../components/ui/FormulaCard';

const RadianSvg = ({ mapX, mapY, degree, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const rad = degree * Math.PI / 180;
  
  const cx = mapX(0);
  const cy = mapY(0);
  const rPx = mapX(1) - cx;

  const tx = mapX(Math.cos(rad));
  const ty = mapY(Math.sin(rad)); // SVG Y invert handled via sweep

  const largeArc = degree > 180 ? 1 : 0;
  // Arc path: counter-clockwise sweep = 0
  const arcPath = degree === 360 
    ? `M ${cx + rPx} ${cy} A ${rPx} ${rPx} 0 1 0 ${cx - rPx} ${cy} A ${rPx} ${rPx} 0 1 0 ${cx + rPx} ${cy}`
    : `M ${cx + rPx} ${cy} A ${rPx} ${rPx} 0 ${largeArc} 0 ${tx} ${ty}`;

  return (
    <g>
      {/* Ghost Circle */}
      <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="var(--border2)" strokeWidth={2} strokeDasharray="4 4" />
      
      {/* Filled Arc */}
      {degree > 0 && <path d={arcPath} fill="none" stroke="var(--teal)" strokeWidth={6} strokeLinecap="round" />}
      
      {/* Radii */}
      {degree > 0 && degree < 360 && (
        <>
          <line x1={cx} y1={cy} x2={cx + rPx} y2={cy} stroke="var(--text3)" strokeWidth={2} />
          <line x1={cx} y1={cy} x2={tx} y2={ty} stroke="var(--text3)" strokeWidth={2} />
        </>
      )}
      
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
};

const RadianHtml = ({ mapX, mapY, degree, isHtml }) => {
  if (!isHtml || !mapX || !mapY) return null;
  const rad = degree * Math.PI / 180;
  const midRad = rad / 2;
  // Position text radially outward from the arc midpoint
  const mx = Math.cos(midRad) * 1.5; // unit radius + 0.5 padding
  const my = Math.sin(midRad) * 1.5;

  return (
    <div style={{ position: 'absolute', top: mapY(my), left: mapX(mx), transform: 'translate(-50%, -50%)', 
      background: 'var(--teal)', color: 'var(--bg)', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 600 }}>
      {`${(rad).toFixed(2)} rad`}
    </div>
  );
};

export const AngleMeasurement = () => {
  const [degree, setDegree] = useState(57.3); // 1 Radian approx
  
  const radian = Math.round((degree * Math.PI / 180) * 1000) / 1000;
  const piFactor = Math.round((degree / 180) * 1000) / 1000;
  
  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Degree ↔ Radian Converter</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A radian is the angle where the arc length equals the radius. Note that 1 rad ≈ 57.3°.
          </p>
        </div>

        <MathSlider label="Angle (θ)" min={0} max={360} step={0.1} value={degree} onChange={setDegree} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <ValueCard label="Degree" value={`${degree.toFixed(1)}°`} color="var(--blue)" />
          <ValueCard label="Radian" value={`${radian.toFixed(3)} rad`} color="var(--teal)" />
          <ValueCard label="In terms of π" value={`${piFactor.toFixed(3)}π`} color="var(--indigo)" />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-2, 2]} range={[-2, 2]}>
          <RadianSvg isSvg degree={degree} />
          {degree > 0 && <RadianHtml isHtml degree={degree} />}
        </GraphCanvas>
      </div>
    </div>
  );
};
