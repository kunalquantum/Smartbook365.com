import React, { useState, useEffect, useRef } from 'react';
import { GraphCanvas } from '../components/ui/GraphCanvas';
import { MathSlider } from '../components/ui/MathSlider';
import { FormulaCard } from '../components/ui/FormulaCard';
import { ValueCard } from '../components/ui/ValueCard';
import { RefreshCw, Navigation, Maximize } from 'lucide-react';

// Topic 0: Directed Angles
export const Ch01Topic0 = () => {
  const [angleDeg, setAngleDeg] = useState(45);
  
  const drawAngle = (ctx, { w, h }) => {
    const cx = w / 2;
    const cy = h / 2;
    const radius = 100;
    const rad = angleDeg * (Math.PI / 180);
    
    // Draw initial ray (X-axis positive)
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + radius + 20, cy);
    ctx.strokeStyle = 'var(--text-secondary)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw terminal ray
    const tx = cx + radius * Math.cos(-rad); // SVG y is inverted, so -rad
    const ty = cy + radius * Math.sin(-rad);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = 'var(--primary-light)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw arc indicating direction
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, -rad, angleDeg < 0);
    ctx.strokeStyle = 'var(--accent)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <FormulaCard 
          title="Directed Angle" 
          formula={`${angleDeg}°`} 
          description={angleDeg > 0 ? "Anti-clockwise rotation (Positive)" : angleDeg < 0 ? "Clockwise rotation (Negative)" : "Zero Angle"}
        />
        <MathSlider label="Rotate Terminal Ray" min={-360} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={300} height={300} drawFunction={drawAngle} domain={[-2, 2]} range={[-2, 2]} />
      </div>
    </div>
  );
};

// Topic 1: Systems of Measurement
export const Ch01Topic1 = () => {
  return (
    <div style={{ padding: '16px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Comparing the three systems of measuring an angle for one complete rotation:</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <ValueCard label="Sexagesimal (Degree)" value="360°" icon={RefreshCw} color="var(--primary)" />
        <ValueCard label="Centesimal (Grade)" value="400g" icon={Maximize} color="var(--secondary)" />
        <ValueCard label="Circular (Radian)" value="2π rad" icon={Navigation} color="var(--accent)" />
      </div>
    </div>
  );
};

// Topic 2: Relation between Degree and Radian
export const Ch01Topic2 = () => {
  const [degree, setDegree] = useState(180);
  const radian = (degree * Math.PI) / 180;

  return (
    <div style={{ padding: '16px' }}>
      <MathSlider label="Degree Value" min={0} max={360} step={1} value={degree} onChange={setDegree} unit="°" />
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <ValueCard label="Degree" value={`${degree}°`} color="var(--primary)" />
        <ValueCard label="Radian" value={`${radian.toFixed(4)} rad`} color="var(--accent)" />
      </div>
      <div style={{ marginTop: '24px' }}>
        <FormulaCard title="Conversion Formula" formula={`\\theta^c = \\theta^\\circ \\times \\frac{\\pi}{180}`} />
      </div>
    </div>
  );
};

// Topic 3: Length of an arc and Area of a sector
export const Ch01Topic3 = () => {
  const [radius, setRadius] = useState(5);
  const [angleDeg, setAngleDeg] = useState(60);
  
  const rad = angleDeg * (Math.PI / 180);
  const arcLen = radius * rad;
  const area = 0.5 * radius * radius * rad;

  const drawSector = (ctx, { w, h }) => {
    const cx = w / 2;
    const cy = h / 2;
    const pxRadius = radius * 15; // scale factor
    
    // Wedge
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, pxRadius, 0, -rad, true); // draw counter-clockwise
    ctx.lineTo(cx, cy);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
    ctx.strokeStyle = 'var(--primary)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arc highlight
    ctx.beginPath();
    ctx.arc(cx, cy, pxRadius, 0, -rad, true);
    ctx.strokeStyle = 'var(--accent)';
    ctx.lineWidth = 4;
    ctx.stroke();
  };

  return (
    <div style={{ padding: '16px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <MathSlider label="Radius (r)" min={1} max={10} value={radius} onChange={setRadius} unit=" cm" />
        <MathSlider label="Angle (θ)" min={0} max={360} value={angleDeg} onChange={setAngleDeg} unit="°" />
        
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ValueCard label="Arc Length (S = rθ)" value={`${arcLen.toFixed(2)} cm`} color="var(--accent)" />
          <ValueCard label="Sector Area (A = ½r²θ)" value={`${area.toFixed(2)} cm²`} color="var(--primary)" />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={300} height={300} drawFunction={drawSector} domain={[-2, 2]} range={[-2, 2]} />
      </div>
    </div>
  );
};
