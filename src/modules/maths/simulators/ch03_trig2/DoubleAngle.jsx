import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const DoubleAngleVisualizer = ({ mapX, mapY, angle, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const rad = angle * (Math.PI / 180);
  const rad2 = 2 * rad;
  
  const cx = mapX(0), cy = mapY(0), rPx = mapX(1) - cx;

  const t1x = mapX(Math.cos(rad)), t1y = mapY(Math.sin(rad));
  const t2x = mapX(Math.cos(rad2)), t2y = mapY(Math.sin(rad2));

  return (
    <g>
      <circle cx={cx} cy={cy} r={rPx} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Angle A */}
      <polygon points={`${cx},${cy} ${t1x},${cy} ${t1x},${t1y}`} fill="var(--bg4)" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Angle 2A Base */}
      <line x1={cx} y1={cy} x2={t2x} y2={t2y} stroke="var(--coral)" strokeWidth="2" />
      
      {/* 2A Vertical Sine */}
      <line x1={t2x} y1={cy} x2={t2x} y2={t2y} stroke="var(--coral)" strokeWidth="3" strokeDasharray="4 4" />
      
      {/* Base Sine */ }
      <line x1={t1x} y1={cy} x2={t1x} y2={t1y} stroke="var(--teal)" strokeWidth="3" />

      {/* Arcs */}
      <path d={`M ${mapX(0.3)} ${cy} A ${mapX(0.3)-cx} ${mapX(0.3)-cx} 0 0 0 ${mapX(0.3*Math.cos(rad))} ${mapY(0.3*Math.sin(rad))}`} fill="none" stroke="var(--teal)" strokeWidth="2" />
      <path d={`M ${mapX(0.4)} ${cy} A ${mapX(0.4)-cx} ${mapX(0.4)-cx} 0 0 0 ${mapX(0.4*Math.cos(rad2))} ${mapY(0.4*Math.sin(rad2))}`} fill="none" stroke="var(--coral)" strokeWidth="2" />

      <circle cx={t1x} cy={t1y} r={4} fill="var(--teal)" />
      <circle cx={t2x} cy={t2y} r={4} fill="var(--coral)" />
    </g>
  );
};

export const DoubleAngle = () => {
  const [angle, setAngle] = useState(25);
  
  const sinA = Math.round(Math.sin(angle * Math.PI / 180) * 1000) / 1000;
  const sin2A = Math.round(Math.sin(2 * angle * Math.PI / 180) * 1000) / 1000;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Double Angle Projector</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Compare Angle A (Teal) with Angle 2A (Red). Notice how the vertical height (sine) of 2A relates to A.
          </p>
        </div>

        <MathSlider label="Angle A (θ)" min={0} max={90} value={angle} onChange={setAngle} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <FormulaCard 
            title="Double Angle Identity"
            formula={`sin(${2 * angle}°) = ${sin2A}`}
            description={`sin(2A) = 2 sin(A) cos(A)`}
          />
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-1.2, 1.2]} range={[-1.2, 1.2]}>
          <DoubleAngleVisualizer isSvg angle={angle} />
          <HtmlLabel isHtml x={0.35 * Math.cos(angle*Math.PI/180/2)} y={0.35 * Math.sin(angle*Math.PI/180/2)} style={{ color: 'var(--teal)', fontSize: '10px' }}>A</HtmlLabel>
          <HtmlLabel isHtml x={0.45 * Math.cos(angle*Math.PI/180)} y={0.45 * Math.sin(angle*Math.PI/180)} style={{ color: 'var(--coral)', fontSize: '10px' }}>2A</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
