import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const TangentVisualizer = ({ mapX, mapY, theta, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  const r = 4;
  const px = r * Math.cos(theta);
  const py = r * Math.sin(theta);
  
  // Tangent line at (x1, y1) for x^2 + y^2 = r^2 is x*x1 + y*y1 = r^2
  // Normal line passes through (0,0) and (x1, y1): y = (y1/x1)x
  
  // To draw the tangent line: y = (r^2 - x*px) / py
  const drawLine = (slope, cVal, color, isDashed = false) => {
    const getY = (x) => slope * x + cVal;
    return <line x1={mapX(-10)} y1={mapY(getY(-10))} x2={mapX(10)} y2={mapY(getY(10))} stroke={color} strokeWidth={isDashed ? 2 : 3} strokeDasharray={isDashed ? "4 4" : "none"} />;
  };

  // Tangent slope: -px / py
  const mTangent = -px / (py === 0 ? 0.001 : py);
  const cTangent = (r * r) / (py === 0 ? 0.001 : py);

  return (
    <g>
      <circle cx={mapX(0)} cy={mapY(0)} r={Math.abs(mapX(r) - mapX(0))} fill="none" stroke="var(--border2)" strokeWidth="2" strokeDasharray="4 4" />
      
      {/* Normal (passes through origin) */}
      <line x1={mapX(-px * 1.5)} y1={mapY(-py * 1.5)} x2={mapX(px * 1.5)} y2={mapY(py * 1.5)} stroke="var(--blue)" strokeWidth="2" strokeDasharray="6 6" opacity="0.5" />
      
      {/* Tangent line */}
      <line 
         x1={mapX(px - 10 * Math.sin(theta))} y1={mapY(py + 10 * Math.cos(theta))}
         x2={mapX(px + 10 * Math.sin(theta))} y2={mapY(py - 10 * Math.cos(theta))}
         stroke="var(--teal)" strokeWidth="3"
      />

      <circle cx={mapX(px)} cy={mapY(py)} r={5} fill="var(--teal)" />
    </g>
  );
};

export const TangentNormal = () => {
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const px = 4 * Math.cos(rad);
  const py = 4 * Math.sin(rad);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Tangent & Normal</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The <strong>Tangent</strong> is perpendicular to the <strong>Normal</strong> at the point of contact. 
            Equation: $x x_1 + y y_1 = r^2$.
          </p>
        </div>

        <MathSlider label="Angle of contact (θ)" min={0} max={360} value={angle} onChange={setAngle} unit="°" />

        <div style={{ display: 'grid', gap: '16px' }}>
          <FormulaCard 
            title="Point of Contact"
            formula={`P(${px.toFixed(1)}, ${py.toFixed(1)})`}
            description="Lies on the circle x² + y² = 16"
          />
          <FormulaCard 
            title="Tangent Eq at P"
            formula={`${px.toFixed(1)}x + ${py.toFixed(1)}y = 16`}
            description={`Slope m = ${(-(px/(py||0.001))).toFixed(2)}`}
          />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-10, 10]} range={[-10, 10]}>
          <TangentVisualizer isSvg theta={rad} />
          <HtmlLabel isHtml x={px + 0.5} y={py + 0.5} style={{ color: 'var(--teal)', fontWeight: 'bold' }}>P</HtmlLabel>
          <HtmlLabel isHtml x={-px * 0.5} y={-py * 0.5} style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>Normal</HtmlLabel>
        </GraphCanvas>
      </div>
    </div>
  );
};
