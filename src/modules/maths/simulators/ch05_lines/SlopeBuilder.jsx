import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';

const SlopeTriangleVisualizer = ({ mapX, mapY, x1, y1, x2, y2, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  return (
    <g>
      {/* Main Line */}
      {/* Extend the line visually beyond the two points */}
      <line 
        x1={mapX(-10)} y1={mapY(y1 + ((y2-y1)/(x2-x1))*(-10-x1) )} 
        x2={mapX(10)} y2={mapY(y1 + ((y2-y1)/(x2-x1))*(10-x1) )} 
        stroke="var(--text3)" strokeWidth="2" strokeDasharray="4 4" 
      />
      
      <line x1={mapX(x1)} y1={mapY(y1)} x2={mapX(x2)} y2={mapY(y2)} stroke="var(--indigo)" strokeWidth="4" strokeLinecap="round" />
      
      {/* The Rise (Vertical) */}
      <line x1={mapX(x2)} y1={mapY(y1)} x2={mapX(x2)} y2={mapY(y2)} stroke="var(--coral)" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />

      {/* The Run (Horizontal) */}
      <line x1={mapX(x1)} y1={mapY(y1)} x2={mapX(x2)} y2={mapY(y1)} stroke="var(--teal)" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />

      {/* Points */}
      <circle cx={mapX(x1)} cy={mapY(y1)} r={6} fill="var(--indigo)" />
      <circle cx={mapX(x2)} cy={mapY(y2)} r={6} fill="var(--indigo)" />
      
      {/* Corner point of triangle */}
      <rect x={mapX(x2)-4} y={mapY(y1)-4} width={8} height={8} fill="var(--bg4)" stroke="var(--text2)" strokeWidth="2" />
    </g>
  );
};

export const SlopeBuilder = () => {
  const [x1, setX1] = useState(-3);
  const [y1, setY1] = useState(-2);
  const [x2, setX2] = useState(4);
  const [y2, setY2] = useState(3);

  // Prevent divide by zero visually by locking slider or just handling it
  const actualX2 = x1 === x2 ? x2 + 0.001 : x2; 

  const rise = y2 - y1;
  const run = actualX2 - x1;
  const m = rise / run;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--indigo)', marginBottom: '8px' }}>Slope Builder</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The slope $m$ measures the steepness of a line as the ratio of vertical change (<strong>Rise</strong>, <span style={{color:'var(--coral)'}}>Red</span>) to horizontal change (<strong>Run</strong>, <span style={{color:'var(--teal)'}}>Green</span>).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--blue)' }}>Point 1 (A)</h4>
            <MathSlider label="x₁" min={-8} max={8} value={x1} onChange={setX1} />
            <MathSlider label="y₁" min={-8} max={8} value={y1} onChange={setY1} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: 'var(--blue)' }}>Point 2 (B)</h4>
            <MathSlider label="x₂" min={-8} max={8} value={x2} onChange={setX2} />
            <MathSlider label="y₂" min={-8} max={8} value={y2} onChange={setY2} />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg4)', padding: '16px', borderRadius: '12px' }}>
          <div className="math-font" style={{ flex: 1, fontSize: '1.2rem', color: 'var(--text1)' }}>
            m = <span style={{color: 'var(--coral)'}}>{rise}</span> / <span style={{color: 'var(--teal)'}}>{+(run).toFixed(2)}</span> = <strong>{+(m).toFixed(2)}</strong>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-8, 8]} range={[-8, 8]}>
          <SlopeTriangleVisualizer isSvg x1={x1} y1={y1} x2={actualX2} y2={y2} />
          <HtmlLabel isHtml x={x1-0.5} y={y1+0.5} style={{color: 'white', fontWeight: 'bold'}}>{`A(${x1},${y1})`}</HtmlLabel>
          <HtmlLabel isHtml x={actualX2+0.5} y={y2+0.5} style={{color: 'white', fontWeight: 'bold'}}>{`B(${actualX2},${y2})`}</HtmlLabel>
          
          <HtmlLabel isHtml x={actualX2 + 0.5} y={(y1+y2)/2} style={{color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.9rem', background:'var(--bg)', padding:'2px', borderRadius:'4px'}}>
            Rise: {rise}
          </HtmlLabel>
          <HtmlLabel isHtml x={(x1+actualX2)/2} y={y1 - 0.5} style={{color: 'var(--teal)', fontWeight: 'bold', fontSize: '0.9rem', background:'var(--bg)', padding:'2px', borderRadius:'4px'}}>
            Run: {+(run).toFixed(1)}
          </HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
