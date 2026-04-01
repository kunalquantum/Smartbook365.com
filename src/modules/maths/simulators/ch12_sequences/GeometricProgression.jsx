import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const GeometricProgression = () => {
  const [a, setA] = useState(1);
  const [r, setR] = useState(2);
  const [n, setN] = useState(8);

  const terms = [];
  for (let i = 0; i < n; i++) {
    const val = a * Math.pow(r, i);
    terms.push(val);
  }

  const tn = a * Math.pow(r, n - 1);
  const maxVal = Math.max(...terms.map(Math.abs), 1);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Geometric Progression (G.P.)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A sequence where each term after the first is found by multiplying the previous one by a fixed, non-zero number called the <strong>common ratio (r)</strong>.
          </p>
        </motion.div>

        <MathSlider label="First term (a)" min={-5} max={5} step={0.5} value={a} onChange={setA} />
        <MathSlider label="Common ratio (r)" min={-3} max={3} step={0.1} value={r} onChange={setR} />
        <MathSlider label="Number of terms (n)" min={3} max={12} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>tₙ (nth term)</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{tn.toFixed(2)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--coral)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Type</div>
            <div style={{ color: Math.abs(r) < 1 ? 'var(--teal)' : 'var(--coral)', fontWeight: 'bold', fontSize: '1rem' }}>
              {Math.abs(r) < 1 ? 'Convergent' : 'Divergent'}
            </div>
          </motion.div>
        </div>

        <FormulaCard title="nth Term of G.P." formula="tₙ = a·rⁿ⁻¹" description={`${a} · (${r})<sup>${n - 1}</sup> = ${tn.toFixed(4)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', maxHeight: '100px', overflowY: 'auto', padding: '8px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <AnimatePresence>
            {terms.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '4px 8px', background: 'var(--bg4)', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '40px' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>t{i + 1}</span>
                <span className="math-font" style={{ fontWeight: 'bold', color: 'var(--gold)', fontSize: '0.85rem' }}>{t.toFixed(1)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Exponential Growth/Decay Chart */}
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '6px', padding: '10px 20px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
          {terms.map((t, i) => {
            const h = Math.min(180, Math.abs((t / maxVal) * 160)) || 2;
            const isNegative = t < 0;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: isNegative ? 'flex-start' : 'flex-end', height: '100%', position: 'relative' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ type: 'spring', damping: 12 }}
                  style={{
                    width: '100%',
                    background: isNegative ? 'var(--coral)' : 'var(--gold)',
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.6 + (i / n) * 0.4,
                  }}
                />
                {i < n - 1 && (
                  <div style={{ position: 'absolute', bottom: isNegative ? 'auto' : h, top: isNegative ? h : 'auto', width: '100%', textAlign: 'center', fontSize: '9px', color: 'var(--teal)', fontWeight: 'bold' }}>
                    ×{r}
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
