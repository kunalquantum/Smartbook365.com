import React, { useState } from 'react';

export const MatrixTypes = () => {
  const [type, setType] = useState('Diagonal');

  const types = ['Diagonal', 'Scalar', 'Identity', 'Upper Triangular', 'Lower Triangular', 'Symmetric', 'Skew-Symmetric'];

  // A 3x3 general notation matrix mapped by row and col (0-indexed)
  const renderCell = (r, c) => {
    let highlight = false;
    let val = `a${r+1}${c+1}`;
    let bg = 'transparent';
    let color = 'var(--text1)';
    let isZero = false;

    if (type === 'Diagonal') {
      if (r !== c) isZero = true;
      else bg = 'rgba(74, 143, 231, 0.2)'; // blue
    } else if (type === 'Scalar') {
      if (r !== c) isZero = true;
      else { val = 'k'; bg = 'rgba(108, 99, 255, 0.2)'; /* indigo */ }
    } else if (type === 'Identity') {
      if (r !== c) isZero = true;
      else { val = '1'; bg = 'rgba(28, 184, 160, 0.2)'; /* teal */ }
    } else if (type === 'Upper Triangular') {
      if (r > c) isZero = true;
      else bg = 'rgba(240, 180, 41, 0.2)'; // gold
    } else if (type === 'Lower Triangular') {
      if (r < c) isZero = true;
      else bg = 'rgba(232, 93, 84, 0.2)'; // coral
    } else if (type === 'Symmetric') {
      val = r < c ? `a${r+1}${c+1}` : r > c ? `a${c+1}${r+1}` : `a${r+1}${c+1}`;
      bg = r === c ? 'rgba(255,255,255,0.05)' : r < c ? 'rgba(74, 143, 231, 0.2)' : 'rgba(74, 143, 231, 0.4)';
    } else if (type === 'Skew-Symmetric') {
      if (r === c) isZero = true;
      else {
        val = r < c ? `a${r+1}${c+1}` : `-a${c+1}${r+1}`;
        bg = r < c ? 'rgba(232, 93, 84, 0.2)' : 'rgba(232, 93, 84, 0.4)';
      }
    }

    if (isZero) {
      val = '0';
      color = 'var(--text3)'; // dim zero
    }

    return (
      <div key={`${r}-${c}`} className="math-font" style={{
        width: '60px', height: '60px', borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: bg, color: color, fontSize: '1.2rem', fontWeight: 600,
        transition: 'all 0.4s ease'
      }}>
        {val}
      </div>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <h3 style={{ color: 'var(--teal)', marginBottom: '16px' }}>Types of Matrices</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {types.map(t => (
            <button 
              key={t}
              onClick={() => setType(t)}
              style={{
                textAlign: 'left', padding: '12px 16px', borderRadius: '8px', 
                background: type === t ? 'var(--bg4)' : 'transparent',
                color: type === t ? 'var(--teal)' : 'var(--text2)',
                border: type === t ? '1px solid var(--teal)' : '1px solid transparent',
                cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s'
              }}
            >
              {t} Matrix
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ 
          padding: '24px', borderLeft: '3px solid var(--text3)', borderRight: '3px solid var(--text3)', 
          borderRadius: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' 
        }}>
          {[0,1,2].map(r => [0,1,2].map(c => renderCell(r, c)))}
        </div>
      </div>
    </div>
  );
};
