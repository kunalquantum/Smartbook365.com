import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const TangentLineSVG = ({ mapX, mapY, m, r, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  // Tangent condition: c = ± r * sqrt(1 + m^2)
  const c = r * Math.sqrt(1 + m * m);
  
  const getY1 = (x) => m * x + c;
  const getY2 = (x) => m * x - c;

  return (
    <g>
      <circle cx={mapX(0)} cy={mapY(0)} r={Math.abs(mapX(r) - mapX(0))} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Upper Tangent */}
      <line x1={mapX(-10)} y1={mapY(getY1(-10))} x2={mapX(10)} y2={mapY(getY1(10))} stroke="var(--coral)" strokeWidth="3" />
      
      {/* Lower Tangent */}
      <line x1={mapX(-10)} y1={mapY(getY2(-10))} x2={mapX(10)} y2={mapY(getY2(10))} stroke="var(--coral)" strokeWidth="3" />
      
      {/* Point of contact calculation for visualization */}
      {/* For y = mx + c, the point of contact is ( -r^2 m / c, r^2 / c ) */}
      <circle cx={mapX(-r * r * m / c)} cy={mapY(r * r / c)} r={4} fill="white" />
      <circle cx={mapX(r * r * m / c)} cy={mapY(-r * r / c)} r={4} fill="white" />
    </g>
  );
};

export const TangentCondition = () => {
  const [m, setM] = useState(1);
  const [r, setR] = useState(4);

  const c = Math.round(r * Math.sqrt(1 + m * m) * 100) / 100;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Condition of Tangency</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A line $y = mx + c$ is tangent to $x^2 + y^2 = r^2$ if $c^2 = r^2(1 + m^2)$. Fix $m$ and $r$ to find $c$.
          </p>
        </div>

        <MathSlider label="Slope (m)" min={-5} max={5} step={0.1} value={m} onChange={setM} />
        <MathSlider label="Radius (r)" min={1} max={7} step={0.1} value={r} onChange={setR} />

        <div style={{ display: 'grid', gap: '16px' }}>
          <FormulaCard 
            title="Intercept Value (c)"
            formula={`c = ± ${r}√(${1 + Math.round(m*m*100)/100})`}
            description={`c = ± ${c}`}
          />
          <FormulaCard 
            title="Line Equations"
            formula={`y = ${m}x + ${c}  &  y = ${m}x - ${c}`}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-10, 10]} range={[-10, 10]}>
          <TangentLineSVG isSvg m={m} r={r} />
          <HtmlLabel isHtml x={0.5} y={c} style={{ color: 'var(--coral)', fontWeight: 'bold' }}>+c</HtmlLabel>
          <HtmlLabel isHtml x={0.5} y={-c} style={{ color: 'var(--coral)', fontWeight: 'bold' }}>-c</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
