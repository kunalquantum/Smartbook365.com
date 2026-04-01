import React, { useState } from 'react';
import { MathSlider } from '../../components/ui/MathSlider';

export const DeterminantExpander = () => {
  // A 3x3 matrix. We'll make only row 1 interactive to keep it clean, the rest static or random.
  const [a11, setA11] = useState(2);
  const [a12, setA12] = useState(-1);
  const [a13, setA13] = useState(3);
  
  const m = [
    [a11, a12, a13],
    [4, 5, 6],
    [-2, 3, 1]
  ];

  const c1 = (m[1][1]*m[2][2] - m[1][2]*m[2][1]);
  const c2 = (m[1][0]*m[2][2] - m[1][2]*m[2][0]);
  const c3 = (m[1][0]*m[2][1] - m[1][1]*m[2][0]);
  
  const det = a11 * c1 - a12 * c2 + a13 * c3;

  const Cell = ({ v, highlight, dim }) => (
    <div style={{
      width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '1.2rem', fontWeight: highlight ? 700 : 400,
      color: highlight ? 'white' : dim ? 'var(--text3)' : 'var(--text1)',
      background: highlight ? highlight : 'transparent',
      borderRadius: '8px', transition: 'all 0.3s'
    }}>
      {v}
    </div>
  );

  const [hoverCol, setHoverCol] = useState(-1);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>3×3 Determinant Expander</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Hover over the expansion terms to cleanly visualize the cofactors. Notice the alternating $\pm$ signs!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <MathSlider label="a₁₁" min={-5} max={5} value={a11} onChange={setA11} />
          <MathSlider label="a₁₂" min={-5} max={5} value={a12} onChange={setA12} />
          <MathSlider label="a₁₃" min={-5} max={5} value={a13} onChange={setA13} />
        </div>

        <div style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '12px', marginTop: '16px' }}>
          <div className="math-font" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', fontSize: '1.4rem' }}>
            <span>|A| =</span>
            <span 
              onMouseEnter={() => setHoverCol(0)} onMouseLeave={() => setHoverCol(-1)}
              style={{ color: 'var(--coral)', cursor: 'pointer', padding: '4px', borderBottom: hoverCol === 0 ? '2px solid var(--coral)' : 'none' }}>
              {a11}({c1})
            </span>
            <span>-</span>
            <span 
              onMouseEnter={() => setHoverCol(1)} onMouseLeave={() => setHoverCol(-1)}
              style={{ color: 'var(--blue)', cursor: 'pointer', padding: '4px', borderBottom: hoverCol === 1 ? '2px solid var(--blue)' : 'none' }}>
              ({a12})({c2})
            </span>
            <span>+</span>
            <span 
              onMouseEnter={() => setHoverCol(2)} onMouseLeave={() => setHoverCol(-1)}
              style={{ color: 'var(--teal)', cursor: 'pointer', padding: '4px', borderBottom: hoverCol === 2 ? '2px solid var(--teal)' : 'none' }}>
              {a13}({c3})
            </span>
            <span> = </span>
            <span style={{ fontWeight: 'bold' }}>{det}</span>
          </div>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ padding: '24px', borderLeft: '2px solid var(--text3)', borderRight: '2px solid var(--text3)', display: 'grid', gap: '8px' }}>
          {m.map((row, rIdx) => (
            <div key={rIdx} style={{ display: 'flex', gap: '8px' }}>
              {row.map((val, cIdx) => {
                let highlight = null;
                let dim = false;
                if (hoverCol !== -1) {
                  if (rIdx === 0 && cIdx === hoverCol) {
                    highlight = hoverCol === 0 ? 'var(--coral)' : hoverCol === 1 ? 'var(--blue)' : 'var(--teal)';
                  } else if (rIdx !== 0 && cIdx !== hoverCol) {
                    highlight = 'rgba(255,255,255,0.1)';
                  } else {
                    dim = true;
                  }
                }
                return <Cell key={cIdx} v={val} highlight={highlight} dim={dim} />;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
