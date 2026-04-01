import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const FamilyVisualizer = ({ mapX, mapY, a1, b1, c1, a2, b2, c2, lambda, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  // L1: a1x + b1y + c1 = 0
  // L2: a2x + b2y + c2 = 0
  // L_lambda: (a1 + λa2)x + (b1 + λb2)y + (c1 + λc2) = 0

  const al = a1 + lambda * a2;
  const bl = b1 + lambda * b2;
  const cl = c1 + lambda * c2;

  // Helper to draw a line given ax + by + c = 0
  const drawLine = (a, b, c, stroke, width, dashed = false) => {
    // x range [-10, 10]
    // y = (-ax - c) / b
    const getY = (x) => b !== 0 ? (-a * x - c) / b : null;
    
    let p1, p2;
    if (b !== 0) {
      p1 = [-10, getY(-10)];
      p2 = [10, getY(10)];
    } else {
      p1 = [-c/a, -10];
      p2 = [-c/a, 10];
    }
    
    return <line x1={mapX(p1[0])} y1={mapY(p1[1])} x2={mapX(p2[0])} y2={mapY(p2[1])} stroke={stroke} strokeWidth={width} strokeDasharray={dashed ? "4 4" : "none"} opacity={dashed ? 0.4 : 1} />;
  };

  // Intersection Point (x, y)
  // a1x + b1y = -c1
  // a2x + b2y = -c2
  const D = a1 * b2 - a2 * b1;
  const Dx = (-c1) * b2 - (-c2) * b1;
  const Dy = a1 * (-c2) - a2 * (-c1);
  const ix = D !== 0 ? Dx / D : 0;
  const iy = D !== 0 ? Dy / D : 0;

  return (
    <g>
      {/* Base Lines */}
      {drawLine(a1, b1, c1, "var(--blue)", 2, true)}
      {drawLine(a2, b2, c2, "var(--teal)", 2, true)}
      
      {/* Resulting Line */}
      {drawLine(al, bl, cl, "var(--coral)", 4)}

      {/* Common Point */}
      {D !== 0 && (
        <circle cx={mapX(ix)} cy={mapY(iy)} r={6} fill="white" stroke="var(--coral)" strokeWidth="2" />
      )}
    </g>
  );
};

export const FamilyOfLines = () => {
  const [lambda, setLambda] = useState(1);

  // Line 1: x + y - 2 = 0
  const [a1, b1, c1] = [1, 1, -2];
  // Line 2: x - y - 4 = 0
  const [a2, b2, c2] = [1, -1, -4];

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Family of Lines</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Any line passing through the intersection of $L_1=0$ and $L_2=0$ can be represented as $L_1 + \lambda L_2 = 0$.
            Change $\lambda$ to see the line rotate around the pivot point.
          </p>
        </div>

        <MathSlider label="Parameter (λ)" min={-10} max={10} step={0.1} value={lambda} onChange={setLambda} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <FormulaCard 
            title="Active Equation"
            formula={`(L₁) + ${lambda}(L₂) = 0`}
            description={`Result: (${(1 + lambda).toFixed(1)})x + (${(1 - lambda).toFixed(1)})y + (${(-2 - 4*lambda).toFixed(1)}) = 0`}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, borderLeft: '3px solid var(--blue)', paddingLeft: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Line 1</div>
            <div className="math-font" style={{ color: 'var(--blue)' }}>x + y - 2 = 0</div>
          </div>
          <div style={{ flex: 1, borderLeft: '3px solid var(--teal)', paddingLeft: '12px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Line 2</div>
            <div className="math-font" style={{ color: 'var(--teal)' }}>x - y - 4 = 0</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-5, 8]} range={[-5, 8]}>
          <FamilyVisualizer isSvg a1={a1} b1={b1} c1={c1} a2={a2} b2={b2} c2={c2} lambda={lambda} />
          {/* Intersection: x+y=2, x-y=4 => 2x=6 => x=3, y=-1 */}
          <HtmlLabel isHtml x={3.5} y={-0.5} style={{ color: 'white', fontWeight: 'bold' }}>P(3, -1)</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
