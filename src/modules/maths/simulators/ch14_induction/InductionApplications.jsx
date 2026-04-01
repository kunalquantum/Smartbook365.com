import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const InductionApplications = () => {
  const [n, setN] = useState(4);
  const [sumType, setSumType] = useState('odds');

  const sums = {
    integers: { label: 'Sum of n integers', formula: '1+2+...+n = n(n+1)/2', calc: (v) => (v * (v + 1)) / 2, color: 'var(--teal)' },
    odds: { label: 'Sum of n odd numbers', formula: '1+3+...+(2n-1) = n²', calc: (v) => v * v, color: 'var(--coral)' },
    squares: { label: 'Sum of n squares', formula: '1²+2²+...+n² = n(n+1)(2n+1)/6', calc: (v) => (v * (v + 1) * (2 * v + 1)) / 6, color: 'var(--gold)' }
  };

  const active = sums[sumType];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: active.color, marginBottom: '8px' }}>Applications</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Induction is used to prove formulas for series sums. Observe how the total grows with <strong>n</strong>.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Object.keys(sums).map(k => (
            <motion.button key={k} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setSumType(k)} style={{ flex: 1, padding: '8px', background: sumType === k ? active.color : 'var(--bg4)', color: sumType === k ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
              {sums[k].label}
            </motion.button>
          ))}
        </div>

        <MathSlider label="Number of terms (n)" min={1} max={10} step={1} value={n} onChange={setN} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: `4px solid ${active.color}` }}>
          <div className="math-font" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: active.color }}>
             {active.calc(n)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '4px' }}>
             {active.formula}
          </div>
        </motion.div>

        <FormulaCard title="Formula" formula={active.formula} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', width: '200px', height: '200px', alignContent: 'flex-start' }}>
          {sumType === 'odds' ? (
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 20px)`, gap: '2px' }}>
              {Array.from({ length: n * n }).map((_, i) => {
                 const row = Math.floor(i / n);
                 const col = i % n;
                 const layer = Math.max(row, col) + 1;
                 return (
                   <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: layer * 0.1 }} style={{ width: '20px', height: '20px', background: `hsl(${20 + layer * 20}, 70%, 50%)`, borderRadius: '2px' }} />
                 );
              })}
            </div>
          ) : (
             <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '150px' }}>
               {Array.from({ length: n }).map((_, i) => (
                 <motion.div key={i} initial={{ height: 0 }} animate={{ height: sumType === 'integers' ? (i + 1) * 10 : (i + 1) * (i + 1) * 1.5 }} transition={{ type: 'spring' }} style={{ width: '15px', background: active.color, borderRadius: '4px 4px 0 0' }} />
               ))}
             </div>
          )}
        </div>
        <div style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center' }}>
          {sumType === 'odds' ? 'Odds form concentric L-shapes in a square!' : 'Visual growth of the sum.'}
        </div>
      </motion.div>
    </motion.div>
  );
};
