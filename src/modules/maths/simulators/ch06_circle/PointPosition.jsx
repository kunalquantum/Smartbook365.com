import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';
import { ValueCard } from '../../components/ui/ValueCard';

const PointPositionSVG = ({ mapX, mapY, r, px, py, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const dist = Math.sqrt(px * px + py * py);
  const radiusPx = Math.abs(mapX(r) - mapX(0));

  let color = 'white';
  if (dist < r - 0.1) color = 'var(--teal)'; // Inside
  else if (dist > r + 0.1) color = 'var(--coral)'; // Outside
  else color = 'var(--gold)'; // On

  return (
    <g>
      {/* Circle with heat zones */}
      <circle cx={mapX(0)} cy={mapY(0)} r={radiusPx} fill="rgba(255, 255, 255, 0.05)" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Distance Line */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(px)} y2={mapY(py)} stroke={color} strokeWidth="2" strokeDasharray="3 3" />

      {/* Origin */}
      <circle cx={mapX(0)} cy={mapY(0)} r={4} fill="white" />
      
      {/* Moving Point */}
      <circle cx={mapX(px)} cy={mapY(py)} r={6} fill={color} />
      <circle cx={mapX(px)} cy={mapY(py)} r={6} fill="none" stroke={color} strokeWidth="2">
        <animate attributeName="r" from="6" to="15" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </g>
  );
};

export const PointPosition = () => {
  const [r, setR] = useState(5);
  const [px, setPx] = useState(3);
  const [py, setPy] = useState(2);

  const distSq = px * px + py * py;
  const rSq = r * r;
  
  let status = "ON THE CIRCLE";
  let color = "var(--gold)";
  if (distSq < rSq) { status = "INSIDE THE CIRCLE"; color = "var(--teal)"; }
  if (distSq > rSq) { status = "OUTSIDE THE CIRCLE"; color = "var(--coral)"; }

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Position of a Point</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Comparing the power of point $P(x,y)$ relative to the circle $x^2 + y^2 = r^2$.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <MathSlider label="Radius r" min={1} max={8} value={r} onChange={setR} />
          <MathSlider label="Point x" min={-9} max={9} value={px} onChange={setPx} />
          <MathSlider label="Point y" min={-9} max={9} value={py} onChange={setPy} />
        </div>

        <div style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px' }}>Status</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: color }}>{status}</div>
        </div>

        <FormulaCard 
          title="Algebraic Check"
          formula={`x² + y² - r² = ${+(distSq - rSq).toFixed(1)}`}
          description={distSq - rSq < 0 ? "Negative: Inside" : distSq - rSq > 0 ? "Positive: Outside" : "Zero: On"}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-10, 10]} range={[-10, 10]}>
          <PointPositionSVG isSvg r={r} px={px} py={py} />
          <HtmlLabel isHtml x={px + 0.6} y={py + 0.6} style={{ color: color, fontWeight: 'bold' }}>P({px}, {py})</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
