import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';

const WaveVisualizer = ({ mapX, mapY, freqC, freqD, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  const pointsOrig = [];
  const pointsSum = [];
  const pointsEnvelope1 = [];
  const pointsEnvelope2 = [];

  for (let x = 0; x <= 4 * Math.PI; x += 0.1) {
    const yC = Math.sin(freqC * x);
    const yD = Math.sin(freqD * x);
    const sum = yC + yD;
    
    const env = 2 * Math.cos(((freqC - freqD)/2) * x);
    
    pointsSum.push(`${mapX(x)},${mapY(sum)}`);
    pointsEnvelope1.push(`${mapX(x)},${mapY(env)}`);
    pointsEnvelope2.push(`${mapX(x)},${mapY(-env)}`);
  }

  return (
    <g>
      {/* Zero line */}
      <line x1={mapX(0)} y1={mapY(0)} x2={mapX(4*Math.PI)} y2={mapY(0)} stroke="var(--border2)" strokeWidth="2" />
      
      {/* Sum Wave */}
      <path d={`M ${pointsSum.join(' L ')}`} fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Envelopes (Beat frequency) */}
      <path d={`M ${pointsEnvelope1.join(' L ')}`} fill="none" stroke="var(--coral)" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />
      <path d={`M ${pointsEnvelope2.join(' L ')}`} fill="none" stroke="var(--coral)" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />
    </g>
  );
};

export const Factorization = () => {
  const [freqC, setFreqC] = useState(5);
  const [freqD, setFreqD] = useState(4);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Factorization: Wave Beats</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            When two waves of different frequencies (sin Cx + sin Dx) are added, they interfere to create "beats".
            This proves the sum-to-product formula where the product is a high-frequency wave (the teal wave inside) inside a low-frequency envelope (red dashed lines).
          </p>
        </div>

        <MathSlider label="Frequency C" min={1} max={10} value={freqC} onChange={setFreqC} />
        <MathSlider label="Frequency D" min={1} max={10} value={freqD} onChange={setFreqD} />
        
        <div style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
          <div className="math-font" style={{ color: 'var(--text1)', marginBottom: '8px' }}>
            sin({freqC}x) + sin({freqD}x) =
          </div>
          <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.2rem' }}>
            2 sin({(freqC+freqD)/2}x) cos({(freqC-freqD)/2}x)
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={400} height={300} domain={[0, 4*Math.PI]} range={[-2.5, 2.5]}>
          <WaveVisualizer isSvg freqC={freqC} freqD={freqD} />
        </GraphCanvas>
      </div>
    </div>
  );
};
