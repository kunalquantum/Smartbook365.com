import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { ValueCard } from '../../components/ui/ValueCard';

const ParametricSVG = ({ mapX, mapY, r, theta, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  const x = r * Math.cos(theta);
  const y = r * Math.sin(theta);

  return (
    <g>
      <circle cx={mapX(0)} cy={mapY(0)} r={Math.abs(mapX(r) - mapX(0))} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Triangle */}
      <polygon points={`${mapX(0)},${mapY(0)} ${mapX(x)},${mapY(0)} ${mapX(x)},${mapY(y)}`} fill="rgba(108, 99, 255, 0.15)" stroke="var(--indigo)" strokeWidth="1" />
      
      {/* Horizontal x = r cos theta */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(x)} y2={mapY(0)} stroke="var(--blue)" strokeWidth="3" />
      
      {/* Vertical y = r sin theta */}
      <line x1={mapX(x)} y1={mapY(0)} x2={mapX(x)} y2={mapY(y)} stroke="var(--coral)" strokeWidth="3" />

      {/* Connection Ray */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(x)} y2={mapY(y)} stroke="var(--text1)" strokeWidth="2" />
      
      <circle cx={mapX(x)} cy={mapY(y)} r={6} fill="var(--indigo)" />
    </g>
  );
};

export const ParametricEquations = () => {
  const [r, setR] = useState(5);
  const [angle, setAngle] = useState(30);

  const rad = (angle * Math.PI) / 180;
  const x = Math.round(r * Math.cos(rad) * 100) / 100;
  const y = Math.round(r * Math.sin(rad) * 100) / 100;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--indigo)', marginBottom: '8px' }}>Parametric Equations</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Any point on a circle can be defined by its radius $r$ and angle $\theta$. 
            $x = r \cos\theta, y = r \sin\theta$.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <MathSlider label="Radius (r)" min={1} max={8} value={r} onChange={setR} />
          <MathSlider label="Angle (θ)" min={0} max={360} value={angle} onChange={setAngle} unit="°" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <ValueCard label="x = r cos θ" value={x} color="var(--blue)" />
          <ValueCard label="y = r sin θ" value={y} color="var(--coral)" />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={400} height={400} domain={[-10, 10]} range={[-10, 10]}>
          <ParametricSVG isSvg r={r} theta={rad} />
          <HtmlLabel isHtml x={x / 2} y={-0.4} style={{ color: 'var(--blue)', fontWeight: 'bold', fontSize: '10px' }}>r cos θ</HtmlLabel>
          <HtmlLabel isHtml x={x + 0.4} y={y / 2} style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '10px' }}>r sin θ</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
