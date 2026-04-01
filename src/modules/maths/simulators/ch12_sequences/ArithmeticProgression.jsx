import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const ArithmeticProgression = () => {
  const [a, setA] = useState(2);
  const [d, setD] = useState(3);
  const [n, setN] = useState(10);

  const terms = [];
  for (let i = 0; i < n; i++) {
    terms.push(a + i * d);
  }

  const sum = (n / 2) * (2 * a + (n - 1) * d);
  const tn = a + (n - 1) * d;

  const maxVal = Math.max(...terms, 1);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Arithmetic Progression (A.P.)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A sequence where the difference between consecutive terms is constant. Adjust the <strong>first term (a)</strong> and <strong>common difference (d)</strong>.
          </p>
        </motion.div>

        <MathSlider label="First term (a)" min={-10} max={10} step={1} value={a} onChange={setA} />
        <MathSlider label="Common difference (d)" min={-5} max={10} step={0.5} value={d} onChange={setD} />
        <MathSlider label="Number of terms (n)" min={3} max={20} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>tₙ (nth term)</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1.2rem' }}>{tn}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Sₙ (Sum)</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{sum}</div>
          </motion.div>
        </div>

        <FormulaCard title="nth Term" formula="tₙ = a + (n − 1)d" description={`${a} + (${n}-1)${d} = ${tn}`} />
        <FormulaCard title="Sum of n Terms" formula="Sₙ = n/2 [2a + (n − 1)d]" description={`${n}/2 [2(${a}) + (${n}-1)${d}] = ${sum}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxHeight: '120px', overflowY: 'auto', padding: '10px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <AnimatePresence>
            {terms.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '6px 12px', background: 'var(--bg4)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '45px' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>t{i + 1}</span>
                <span className="math-font" style={{ fontWeight: 'bold', color: 'var(--teal)' }}>{t}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Visual Staircase/Bar Chart */}
        <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '4px', padding: '10px 20px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {terms.map((t, i) => {
            const height = Math.abs((t / maxVal) * 140) || 5;
            const isNegative = t < 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isNegative ? 'flex-start' : 'flex-end', height: '100%', position: 'relative' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ type: 'spring', damping: 15 }}
                  style={{
                    width: '100%',
                    background: isNegative ? 'var(--coral)' : 'var(--teal)',
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.7 + (i / n) * 0.3,
                  }}
                />
                {i < n - 1 && d !== 0 && (
                  <div style={{ position: 'absolute', bottom: isNegative ? 'auto' : height, top: isNegative ? height : 'auto', width: '100%', textAlign: 'center', fontSize: '10px', color: 'var(--gold)', fontWeight: 'bold' }}>
                    {d > 0 ? '+' : ''}{d}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
