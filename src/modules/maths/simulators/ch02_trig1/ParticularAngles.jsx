import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';

const StandardTriangle = ({ mapX, mapY, angle, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  // Hypotenuse length is 2 based on domain
  const H = 2;
  const rad = angle * Math.PI / 180;
  const A = H * Math.cos(rad);
  const O = H * Math.sin(rad);

  const cx = mapX(0);
  const cy = mapY(0);
  const tx = mapX(A);
  const ty = mapY(O);

  return (
    <g>
      <path d={`M ${cx} ${cy} L ${tx} ${cy} L ${tx} ${ty} Z`} fill="var(--bg4)" stroke="var(--blue)" strokeWidth="2" strokeLinejoin="round" />
      {/* Right angle marker */}
      <path d={`M ${mapX(A - 0.2)} ${cy} L ${mapX(A - 0.2)} ${mapY(0.2)} L ${tx} ${mapY(0.2)}`} fill="none" stroke="var(--teal)" strokeWidth="2" />
      {/* Angle arc */}
      <path d={`M ${mapX(0.4)} ${cy} A ${mapX(0.4) - mapX(0)} ${mapX(0.4) - mapX(0)} 0 0 0 ${mapX(0.4 * Math.cos(rad))} ${mapY(0.4 * Math.sin(rad))}`} fill="none" stroke="var(--gold)" strokeWidth="2" />
    </g>
  );
};

export const ParticularAngles = () => {
  const [angle, setAngle] = useState(30);

  // Map configurations
  const configs = {
    30: { opp: '1', adj: '√3', hyp: '2' },
    45: { opp: '1', adj: '1', hyp: '√2' },
    60: { opp: '√3', adj: '1', hyp: '2' }
  };

  const current = configs[angle];

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Standard Triangles</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Visualizing the ratios for 30°, 45°, and 60° via geometry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {[30, 45, 60].map(a => (
            <button key={a} onClick={() => setAngle(a)} style={{
              flex: 1, padding: '12px', borderRadius: '8px', 
              background: angle === a ? 'var(--teal)' : 'var(--bg4)',
              color: angle === a ? 'var(--bg)' : 'var(--teal)',
              border: 'none', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
            }}>
              {a}° Triangle
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px' }}>
          <div className="math-font" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center' }}>
            <div>
              <div style={{ color: 'var(--coral)', fontSize: '0.8rem' }}>sin({angle}°)</div>
              <div style={{ fontSize: '1.2rem', marginTop: '4px' }}>{current.opp} / {current.hyp}</div>
            </div>
            <div>
              <div style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>cos({angle}°)</div>
              <div style={{ fontSize: '1.2rem', marginTop: '4px' }}>{current.adj} / {current.hyp}</div>
            </div>
            <div>
              <div style={{ color: 'var(--gold)', fontSize: '0.8rem' }}>tan({angle}°)</div>
              <div style={{ fontSize: '1.2rem', marginTop: '4px' }}>{current.opp} / {current.adj}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-0.5, 2.5]} range={[-0.5, 2.5]}>
          <StandardTriangle isSvg angle={angle} />
          <HtmlLabel isHtml x={1 * Math.cos(angle * Math.PI / 180)} y={1 * Math.sin(angle * Math.PI / 180) + 0.1} style={{color: 'var(--text1)', fontSize:'12px', fontWeight: 'bold'}}>{current.hyp}</HtmlLabel>
          <HtmlLabel isHtml x={1 * Math.cos(angle * Math.PI / 180)} y={-0.1} style={{color: 'var(--blue)', fontSize:'12px', fontWeight: 'bold'}}>{current.adj}</HtmlLabel>
          <HtmlLabel isHtml x={2 * Math.cos(angle * Math.PI / 180) + 0.1} y={(2 * Math.sin(angle * Math.PI / 180)) / 2} style={{color: 'var(--coral)', fontSize:'12px', fontWeight: 'bold'}}>{current.opp}</HtmlLabel>
          <HtmlLabel isHtml x={0.5} y={0.2} style={{color: 'var(--gold)', fontSize:'12px', fontWeight: 'bold'}}>{angle}°</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
