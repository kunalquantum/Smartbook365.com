import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const CircleSVG = ({ mapX, mapY, h, k, r, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const radiusPx = Math.abs(mapX(r) - mapX(0));

  return (
    <g>
      {/* Circle Boundary */}
      <circle cx={mapX(h)} cy={mapY(k)} r={radiusPx} fill="rgba(74, 143, 231, 0.1)" stroke="var(--blue)" strokeWidth="3" />
      
      {/* Center Point */}
      <circle cx={mapX(h)} cy={mapY(k)} r={4} fill="white" />
      
      {/* Radius Line */}
      <line x1={mapX(h)} y1={mapY(k)} x2={mapX(h + r)} y2={mapY(k)} stroke="var(--blue)" strokeWidth="2" strokeDasharray="4 4" />
    </g>
  );
};

export const EquationBuilder = () => {
  const [h, setH] = useState(0);
  const [k, setK] = useState(0);
  const [r, setR] = useState(3);

  // General form: x^2 + y^2 - 2hx - 2ky + (h^2 + k^2 - r^2) = 0
  const g = -h;
  const f = -k;
  const c = h * h + k * k - r * r;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Circle Equation Builder</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Adjust the center $(h, k)$ and radius $r$ to morph the circle and its equations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <MathSlider label="Center h" min={-5} max={5} value={h} onChange={setH} />
          <MathSlider label="Center k" min={-5} max={5} value={k} onChange={setK} />
          <MathSlider label="Radius r" min={0.5} max={5} step={0.1} value={r} onChange={setR} />
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <FormulaCard 
            title="Standard Form"
            formula={`(x - ${h})² + (y - ${k})² = ${r * r}`}
          />
          <FormulaCard 
            title="General Form"
            formula={`x² + y² + ${2 * g}x + ${2 * f}y + ${c.toFixed(1)} = 0`}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-10, 10]} range={[-10, 10]}>
          <CircleSVG isSvg h={h} k={k} r={r} />
          <HtmlLabel isHtml x={h + 0.5} y={k + 0.5} style={{ color: 'white', fontWeight: 'bold' }}>C({h}, {k})</HtmlLabel>
          <HtmlLabel isHtml x={h + r / 2} y={k - 0.5} style={{ color: 'var(--blue)', fontSize: '0.9rem' }}>r = {r}</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
