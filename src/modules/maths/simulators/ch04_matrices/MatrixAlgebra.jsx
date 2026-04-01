import React, { useState } from 'react';
import { MathSlider } from '../../components/ui/MathSlider';

export const MatrixAlgebra = () => {
  // 2x2 A
  const [a11, setA11] = useState(1); const [a12, setA12] = useState(2);
  const [a21, setA21] = useState(3); const [a22, setA22] = useState(4);
  // 2x2 B
  const [b11, setB11] = useState(5); const [b12, setB12] = useState(6);
  const [b21, setB21] = useState(7); const [b22, setB22] = useState(8);

  const [hoverR, setHoverR] = useState(-1);
  const [hoverC, setHoverC] = useState(-1);

  // Result Matrix C
  const c11 = a11*b11 + a12*b21;
  const c12 = a11*b12 + a12*b22;
  const c21 = a21*b11 + a22*b21;
  const c22 = a21*b12 + a22*b22;

  const C = [
    [c11, c12],
    [c21, c22]
  ];

  const getDotProductStr = (r, c) => {
    const rowA = r === 0 ? [a11, a12] : [a21, a22];
    const colB = c === 0 ? [b11, b21] : [b12, b22];
    return `(${rowA[0]})(${colB[0]}) + (${rowA[1]})(${colB[1]})`;
  };

  const getSumStr = (r, c) => {
    const rowA = r === 0 ? [a11, a12] : [a21, a22];
    const colB = c === 0 ? [b11, b21] : [b12, b22];
    return `${rowA[0]*colB[0]} + ${rowA[1]*colB[1]}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ color: 'var(--indigo)', marginBottom: '8px' }}>Matrix Multiplication</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Hover over the completely interactive result matrix $C$ to trace exactly how the **Row × Column** dot products compute the elements.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(74, 143, 231, 0.1)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--blue)', marginBottom: '8px', fontSize: '0.9rem' }}>Matrix A (Sliders)</h4>
            <MathSlider label="a₁₁" min={-5} max={5} value={a11} onChange={setA11} />
            <MathSlider label="a₁₂" min={-5} max={5} value={a12} onChange={setA12} />
            <MathSlider label="a₂₁" min={-5} max={5} value={a21} onChange={setA21} />
            <MathSlider label="a₂₂" min={-5} max={5} value={a22} onChange={setA22} />
          </div>
          <div style={{ padding: '12px', background: 'rgba(28, 184, 160, 0.1)', borderRadius: '12px' }}>
            <h4 style={{ color: 'var(--teal)', marginBottom: '8px', fontSize: '0.9rem' }}>Matrix B (Sliders)</h4>
            <MathSlider label="b₁₁" min={-5} max={5} value={b11} onChange={setB11} />
            <MathSlider label="b₁₂" min={-5} max={5} value={b12} onChange={setB12} />
            <MathSlider label="b₂₁" min={-5} max={5} value={b21} onChange={setB21} />
            <MathSlider label="b₂₂" min={-5} max={5} value={b22} onChange={setB22} />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          
          {/* Matrix A */}
          <div style={{ borderLeft: '2px solid var(--text3)', borderRight: '2px solid var(--text3)', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[0, 1].map(r => [0, 1].map(c => {
              const val = r === 0 ? (c === 0 ? a11 : a12) : (c === 0 ? a21 : a22);
              const highlight = r === hoverR;
              return <div key={`a-${r}-${c}`} className="math-font" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: highlight ? 'var(--blue)' : 'transparent', color: highlight ? 'white' : 'var(--text1)', borderRadius: '8px', transition: 'all 0.2s' }}>{val}</div>
            }))}
          </div>

          <div className="math-font" style={{ fontSize: '1.5rem', color: 'var(--text3)' }}>×</div>

          {/* Matrix B */}
          <div style={{ borderLeft: '2px solid var(--text3)', borderRight: '2px solid var(--text3)', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[0, 1].map(r => [0, 1].map(c => {
              const val = r === 0 ? (c === 0 ? b11 : b12) : (c === 0 ? b21 : b22);
              const highlight = c === hoverC;
              return <div key={`b-${r}-${c}`} className="math-font" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: highlight ? 'var(--teal)' : 'transparent', color: highlight ? 'white' : 'var(--text1)', borderRadius: '8px', transition: 'all 0.2s' }}>{val}</div>
            }))}
          </div>
          
          <div className="math-font" style={{ fontSize: '1.5rem', color: 'var(--text3)' }}>=</div>

          {/* Matrix C Result */}
          <div style={{ borderLeft: '2px solid var(--text1)', borderRight: '2px solid var(--text1)', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[0, 1].map(r => [0, 1].map(c => {
              const highlight = r === hoverR && c === hoverC;
              return (
                <div 
                  key={`c-${r}-${c}`} 
                  onMouseEnter={() => { setHoverR(r); setHoverC(c); }}
                  onMouseLeave={() => { setHoverR(-1); setHoverC(-1); }}
                  className="math-font" 
                  style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', background: highlight ? 'var(--indigo)' : 'var(--bg4)', color: highlight ? 'white' : 'var(--coral)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.3s' }}
                >
                  {C[r][c]}
                </div>
              );
            }))}
          </div>
        </div>

        {/* Dynamic Formula Tracing */}
        {hoverR !== -1 && hoverC !== -1 && (
          <div style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', width: '100%', textAlign: 'center' }}>
            <div className="math-font" style={{ color: 'var(--text2)', marginBottom: '8px' }}>
              C<sub style={{fontSize: '0.7rem'}}>{hoverR+1}{hoverC+1}</sub> = (Row {hoverR+1} of A) · (Col {hoverC+1} of B)
            </div>
            <div className="math-font" style={{ color: 'var(--indigo)', fontSize: '1.3rem' }}>
              {getDotProductStr(hoverR, hoverC)} = {getSumStr(hoverR, hoverC)} = {C[hoverR][hoverC]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
