import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { ValueCard } from '../../components/ui/ValueCard';

const ParallelogramSVG = ({ mapX, mapY, ax, ay, bx, by, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const sx = ax + bx;
  const sy = ay + by;

  return (
    <g>
      {/* Area Polygon */}
      <polygon 
        points={`${mapX(0)},${mapY(0)} ${mapX(ax)},${mapY(ay)} ${mapX(sx)},${mapY(sy)} ${mapX(bx)},${mapY(by)}`} 
        fill="rgba(28, 184, 160, 0.2)" stroke="none" 
      />
      {/* Ghost connecting lines */}
      <line x1={mapX(ax)} y1={mapY(ay)} x2={mapX(sx)} y2={mapY(sy)} stroke="var(--border2)" strokeDasharray="4 4" strokeWidth="2" />
      <line x1={mapX(bx)} y1={mapY(by)} x2={mapX(sx)} y2={mapY(sy)} stroke="var(--border2)" strokeDasharray="4 4" strokeWidth="2" />
      
      {/* Vector A */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(ax)} y2={mapY(ay)} stroke="var(--indigo)" strokeWidth="3" strokeLinecap="round" />
      {/* Vector B */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(bx)} y2={mapY(by)} stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />

      <circle cx={mapX(ax)} cy={mapY(ay)} r={5} fill="var(--indigo)" />
      <circle cx={mapX(bx)} cy={mapY(by)} r={5} fill="var(--blue)" />
      <circle cx={mapX(0)} cy={mapY(0)} r={4} fill="white" />
    </g>
  );
};

export const DeterminantProperties = () => {
  const [ax, setAx] = useState(3);
  const [ay, setAy] = useState(1);
  const [bx, setBx] = useState(1);
  const [by, setBy] = useState(4);

  const det = ax * by - ay * bx;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Determinant = Geometric Area</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The 2×2 determinant gives the exact area of the parallelogram formed by row vectors A and B. 
            If it's negative, it means B is clockwise from A (orientation).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(108, 99, 255, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--indigo)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Vector A</h4>
            <MathSlider label="x₁" min={-5} max={5} value={ax} onChange={setAx} />
            <MathSlider label="y₁" min={-5} max={5} value={ay} onChange={setAy} />
          </div>
          <div style={{ padding: '12px', background: 'rgba(74, 143, 231, 0.1)', borderRadius: '12px', borderLeft: '4px solid var(--blue)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem' }}>Vector B</h4>
            <MathSlider label="x₂" min={-5} max={5} value={bx} onChange={setBx} />
            <MathSlider label="y₂" min={-5} max={5} value={by} onChange={setBy} />
          </div>
        </div>
        
        <ValueCard 
          label={`| A×B | = (${ax})(${by}) - (${ay})(${bx})`} 
          value={`Area = ${Math.abs(det)}`} 
          color={det < 0 ? 'var(--coral)' : 'var(--teal)'} 
        />
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-2, 8]} range={[-2, 8]}>
          <ParallelogramSVG isSvg ax={ax} ay={ay} bx={bx} by={by} />
          <HtmlLabel isHtml x={ax+0.2} y={ay+0.2} style={{ color: 'var(--indigo)', fontWeight: 'bold' }}>A</HtmlLabel>
          <HtmlLabel isHtml x={bx-0.4} y={by+0.4} style={{ color: 'var(--blue)', fontWeight: 'bold' }}>B</HtmlLabel>
          <HtmlLabel isHtml x={(ax+bx)/2} y={(ay+by)/2} style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1.2rem' }}>
            Area: {Math.abs(det)}
          </HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
