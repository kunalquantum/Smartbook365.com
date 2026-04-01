import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const BinomialTheorem = () => {
  const [n, setN] = useState(3);
  const [a, setA] = useState('a');
  const [b, setB] = useState('b');
  const [activeTerm, setActiveTerm] = useState(null);

  const nCrVal = (nn, rr) => {
    if (rr < 0 || rr > nn) return 0;
    const factorial = (num) => {
      if (num <= 1) return 1;
      let res = 1;
      for (let i = 2; i <= num; i++) res *= i;
      return res;
    };
    return Math.round(factorial(nn) / (factorial(rr) * factorial(nn - rr)));
  };

  const getExpansion = () => {
    const terms = [];
    for (let r = 0; r <= n; r++) {
      const coeff = nCrVal(n, r);
      const aPow = n - r;
      const bPow = r;
      terms.push({ coeff, aPow, bPow, r });
    }
    return terms;
  };

  const expansion = getExpansion();

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Binomial Theorem</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Expanding <strong>(a + b)ⁿ</strong>. The coefficients come from the <em>n-th row</em> of Pascal’s Triangle.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '10px' }}>
           <div style={{ flex: 1 }}>
             <label style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Term a</label>
             <input value={a} onChange={e => setA(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }} />
           </div>
           <div style={{ flex: 1 }}>
             <label style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Term b</label>
             <input value={b} onChange={e => setB(e.target.value)} style={{ width: '100%', padding: '8px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white' }} />
           </div>
        </div>

        <MathSlider label="Exponent n" min={0} max={6} step={1} value={n} onChange={setN} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--gold)' }}>
          <div className="math-font" style={{ fontSize: '1.2rem', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
            <span>({a} + {b})<sup>{n}</sup> = </span>
            {expansion.map((t, i) => (
              <motion.span key={i} animate={{ 
                scale: activeTerm === i ? 1.2 : 1, 
                color: activeTerm === i ? 'var(--gold)' : 'white' 
              }} 
              style={{ fontWeight: activeTerm === i ? 'bold' : 'normal' }}>
                {t.coeff !== 1 || (t.aPow === 0 && t.bPow === 0) ? t.coeff : ''}
                {t.aPow > 0 && <span>{a}{t.aPow > 1 && <sup>{t.aPow}</sup>}</span>}
                {t.bPow > 0 && <span>{b}{t.bPow > 1 && <sup>{t.bPow}</sup>}</span>}
                {i < expansion.length - 1 && <span style={{ marginLeft: '4px' }}>+</span>}
              </motion.span>
            ))}
          </div>
        </motion.div>

        <FormulaCard title="Formula" formula="(a+b)^n = \sum_{r=0}^n \binom{n}{r} a^{n-r} b^r" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Pascal's Triangle (Row {n})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
          {Array.from({ length: 6 }).map((_, row) => (
            <div key={row} style={{ display: 'flex', gap: '5px', opacity: row > n ? 0.3 : 1 }}>
              {Array.from({ length: row + 1 }).map((_, col) => {
                const val = nCrVal(row, col);
                const isSelected = row === n && activeTerm === col;
                return (
                  <motion.div
                    key={col}
                    onMouseEnter={() => row === n && setActiveTerm(col)}
                    onMouseLeave={() => row === n && setActiveTerm(null)}
                    animate={{ 
                       background: isSelected ? 'var(--gold)' : 'var(--bg4)',
                       scale: isSelected ? 1.2 : 1,
                       boxShadow: isSelected ? '0 0 10px var(--gold)' : 'none'
                    }}
                    style={{ width: '35px', height: '35px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', cursor: row === n ? 'pointer' : 'default' }}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text3)', textAlign: 'center' }}>
           Hover over Row {n} to highlight terms in expansion!
        </div>
      </motion.div>
    </motion.div>
  );
};
