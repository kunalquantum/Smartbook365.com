import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const SumAngleVisualizer = ({ mapX, mapY, angleA, angleB, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  const r = 2; // radius
  const radA = angleA * (Math.PI / 180);
  const radSum = (angleA + angleB) * (Math.PI / 180);

  const cx = mapX(0);
  const cy = mapY(0);
  const ax = mapX(r * Math.cos(radA));
  const ay = mapY(r * Math.sin(radA));
  const sx = mapX(r * Math.cos(radSum));
  const sy = mapY(r * Math.sin(radSum));

  return (
    <g>
      {/* Circle boundary */}
      <circle cx={cx} cy={cy} r={mapX(r) - cx} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Base X-axis */}
      <line x1={cx} y1={cy} x2={mapX(r)} y2={cy} stroke="var(--text3)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Angle A Ray */}
      <polygon points={`${cx},${cy} ${mapX(r)},${cy} ${ax},${ay}`} fill="rgba(28, 184, 160, 0.1)" stroke="var(--teal)" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Angle A+B Ray stacked from Angle A */}
      <polygon points={`${cx},${cy} ${ax},${ay} ${sx},${sy}`} fill="rgba(108, 99, 255, 0.1)" stroke="var(--indigo)" strokeWidth="2" strokeLinejoin="round" />
      
      {/* Total Angle Sum Arc (Base to Sum) */}
      <path 
        d={`M ${mapX(0.8)} ${cy} A ${mapX(0.8)-cx} ${mapX(0.8)-cx} 0 0 0 ${mapX(0.8 * Math.cos(radSum))} ${mapY(0.8 * Math.sin(radSum))}`} 
        fill="none" stroke="var(--coral)" strokeWidth="3" 
      />
      
      <circle cx={ax} cy={ay} r={4} fill="var(--teal)" />
      <circle cx={sx} cy={sy} r={5} fill="var(--indigo)" />
      <circle cx={cx} cy={cy} r={4} fill="white" />
    </g>
  );
};

export const SumDifference = () => {
  const [angleA, setAngleA] = useState(45);
  const [angleB, setAngleB] = useState(30);

  const radA = angleA * Math.PI / 180;
  const radB = angleB * Math.PI / 180;

  const sinSumActual = Math.round(Math.sin(radA + radB) * 1000) / 1000;
  const expansion = `${Math.round(Math.sin(radA)*100)/100}(${Math.round(Math.cos(radB)*100)/100}) + ${Math.round(Math.cos(radA)*100)/100}(${Math.round(Math.sin(radB)*100)/100})`;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--indigo)', marginBottom: '8px' }}>Sum of Angles Vectors</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Visually adding Angle A (Teal) and Angle B (Indigo) to form the combined Angle A+B (Red Arc).
          </p>
        </div>

        <MathSlider label="Angle A (θ)" min={0} max={90} value={angleA} onChange={setAngleA} unit="°" />
        <MathSlider label="Angle B (φ)" min={0} max={90} value={angleB} onChange={setAngleB} unit="°" />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <FormulaCard 
            title="Formula sin(A + B)"
            formula={`sin(${angleA + angleB}°) = ${sinSumActual}`}
            description={`Expansion: ${expansion}`}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-2.5, 2.5]} range={[-2.5, 2.5]}>
          <SumAngleVisualizer isSvg angleA={angleA} angleB={angleB} />
          <HtmlLabel isHtml x={1 * Math.cos((angleA/2)*Math.PI/180)} y={1 * Math.sin((angleA/2)*Math.PI/180)} style={{ color: 'var(--teal)', fontWeight: 'bold' }}>A</HtmlLabel>
          <HtmlLabel isHtml x={1.2 * Math.cos((angleA + angleB/2)*Math.PI/180)} y={1.2 * Math.sin((angleA + angleB/2)*Math.PI/180)} style={{ color: 'var(--indigo)', fontWeight: 'bold' }}>B</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
