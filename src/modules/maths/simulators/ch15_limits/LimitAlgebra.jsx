import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const LimitAlgebra = () => {
  const [L, setL] = useState(3);
  const [M, setM] = useState(2);
  const [op, setOp] = useState('sum');

  const operations = [
    { id: 'sum', label: 'L + M', formula: 'lim(f+g) = L + M', result: L + M },
    { id: 'diff', label: 'L − M', formula: 'lim(f-g) = L − M', result: L - M },
    { id: 'prod', label: 'L · M', formula: 'lim(f·g) = L · M', result: L * M },
    { id: 'quot', label: 'L / M', formula: 'lim(f/g) = L / M', result: M !== 0 ? (L / M).toFixed(2) : '∞' },
    { id: 'pow', label: 'Lᵏ', formula: 'lim(fᵏ) = [lim f]ᵏ', result: Math.pow(L, 2).toFixed(2), label2: 'L²' },
  ];

  const activeOp = operations.find(o => o.id === op);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Algebra of Limits</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Rules for combining limits of functions. Suppose <strong>lim f(x) = L</strong> and <strong>lim g(x) = M</strong>.
          </p>
        </motion.div>

        <MathSlider label="Limit L" min={-10} max={10} step={0.5} value={L} onChange={setL} />
        <MathSlider label="Limit M" min={-10} max={10} step={0.5} value={M} onChange={setM} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {operations.map(o => (
            <motion.button key={o.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOp(o.id)} style={{ padding: '8px', background: op === o.id ? 'var(--gold)' : 'var(--bg4)', color: op === o.id ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
              {o.label2 || o.label}
            </motion.button>
          ))}
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px' }}>Result</div>
          <div className="math-font" style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
            {activeOp.result}
          </div>
        </motion.div>

        <FormulaCard title="Limit Law" formula={activeOp.formula} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text2)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '15px 25px', background: 'var(--bg4)', borderRadius: '12px', color: 'var(--teal)', fontWeight: 'bold' }}>{L}</div>
          <span style={{ fontSize: '1.5rem' }}>{op === 'sum' ? '+' : op === 'diff' ? '−' : op === 'prod' ? '·' : op === 'quot' ? '/' : '^2'}</span>
          <div style={{ padding: '15px 25px', background: 'var(--bg4)', borderRadius: '12px', color: 'var(--coral)', fontWeight: 'bold' }}>{op === 'pow' ? '2' : M}</div>
          <span style={{ fontSize: '1.5rem' }}>=</span>
          <div style={{ padding: '15px 25px', background: 'var(--bg4)', borderRadius: '12px', color: 'var(--gold)', fontWeight: 'bold' }}>{activeOp.result}</div>
        </div>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '300px' }}>
          {op === 'quot' && M === 0 ? 'Warning: Limit of quotient exists only if M ≠ 0.' : 'Algebraic rules allow piecewise evaluation of complex limits.'}
        </p>
      </motion.div>
    </motion.div>
  );
};
