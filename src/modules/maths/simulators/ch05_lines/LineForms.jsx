import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const LineSVG = ({ mapX, mapY, m, c, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  // y = mx + c
  // x = (y - c) / m
  const getY = (x) => m * x + c;
  const getX = (y) => m !== 0 ? (y - c) / m : null;

  let p1, p2;
  // Let's assume domain is [-10, 10]
  p1 = [-10, getY(-10)];
  p2 = [10, getY(10)];

  return (
    <g>
      <line x1={mapX(p1[0])} y1={mapY(p1[1])} x2={mapX(p2[0])} y2={mapY(p2[1])} stroke="var(--teal)" strokeWidth="3" />
      
      {/* Y-intercept */}
      <circle cx={mapX(0)} cy={mapY(c)} r={5} fill="var(--coral)" />
      
      {/* X-intercept */}
      {m !== 0 && (
        <circle cx={mapX(-c/m)} cy={mapY(0)} r={5} fill="var(--blue)" />
      )}
    </g>
  );
};

export const LineForms = () => {
  const [form, setForm] = useState('slope-intercept');
  
  // Universal parameters we control under the hood
  // We'll map sliders to these. But to make them independent:
  const [m, setM] = useState(1);
  const [c, setC] = useState(2); // y-intercept
  const [aInt, setAInt] = useState(3); // x-intercept for double intercept
  const [bInt, setBInt] = useState(4); // y-intercept
  
  // Derived standard model (y = mx + c) depending on active form
  let activeM = 1;
  let activeC = 0;
  
  if (form === 'slope-intercept') {
    activeM = m; activeC = c;
  } else if (form === 'double-intercept') {
    // x/a + y/b = 1  => bx + ay = ab => y = (-b/a)x + b
    const safeA = aInt === 0 ? 0.001 : aInt;
    activeM = -bInt / safeA;
    activeC = bInt;
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Forms of Equation</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A straight line can be expressed in multiple algebraic forms. See how the visual graph morphs!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['slope-intercept', 'double-intercept'].map(f => (
            <button key={f} onClick={() => setForm(f)} style={{ flex: 1, padding: '10px', background: form === f ? 'var(--blue)' : 'var(--bg4)', color: form === f ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}>
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>

        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', minHeight: '180px' }}>
          {form === 'slope-intercept' && (
            <>
              <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.4rem', marginBottom: '16px', textAlign: 'center' }}>
                y = {m}x {c >= 0 ? '+' : '-'} {Math.abs(c)}
              </div>
              <MathSlider label="Slope (m)" min={-5} max={5} step={0.5} value={m} onChange={setM} />
              <MathSlider label="Y-Intercept (c)" min={-5} max={5} value={c} onChange={setC} />
            </>
          )}

          {form === 'double-intercept' && (
            <>
              <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.4rem', marginBottom: '16px', textAlign: 'center' }}>
                x / {aInt} + y / {bInt} = 1
              </div>
              <MathSlider label="X-Intercept (a)" min={-8} max={8} value={aInt} onChange={setAInt} />
              <MathSlider label="Y-Intercept (b)" min={-8} max={8} value={bInt} onChange={setBInt} />
            </>
          )}
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-8, 8]} range={[-8, 8]}>
          <LineSVG isSvg m={activeM} c={activeC} />
          
          <HtmlLabel isHtml x={0.5} y={activeC + 0.5} style={{color: 'var(--coral)', fontWeight: 'bold'}}>
            (0, {+(activeC).toFixed(1)})
          </HtmlLabel>
          
          {activeM !== 0 && (
            <HtmlLabel isHtml x={(-activeC/activeM) + 0.5} y={0.5} style={{color: 'var(--blue)', fontWeight: 'bold'}}>
              ({+(-activeC/activeM).toFixed(1)}, 0)
            </HtmlLabel>
          )}
        </GraphCanvas>
      </div>
    </div>
  );
};
