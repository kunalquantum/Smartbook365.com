import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const HarmonicProgression = () => {
  const [a, setA] = useState(2);
  const [d, setD] = useState(1);
  const [n, setN] = useState(8);

  const apTerms = [];
  const hpTerms = [];
  for (let i = 0; i < n; i++) {
    const apVal = a + i * d;
    apTerms.push(apVal);
    hpTerms.push(apVal !== 0 ? 1 / apVal : Infinity);
  }

  const tn = 1 / (a + (n - 1) * d);
  const maxVal = Math.max(...hpTerms.filter(x => x !== Infinity), 1);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Harmonic Progression (H.P.)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A sequence where the reciprocals of the terms form an Arithmetic Progression (A.P.).
          </p>
        </motion.div>

        <MathSlider label="First term of AP (1/a₁)" min={0.5} max={10} step={0.5} value={a} onChange={setA} />
        <MathSlider label="Diff of AP" min={0.1} max={5} step={0.1} value={d} onChange={setD} />
        <MathSlider label="Number of terms (n)" min={3} max={12} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid #7c8cf8' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>tₙ (H.P. Term)</div>
            <div className="math-font" style={{ color: '#7c8cf8', fontWeight: 'bold', fontSize: '1.2rem' }}>{tn.toFixed(3)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Reciprocal (A.P.)</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1.2rem' }}>{(1 / tn).toFixed(1)}</div>
          </motion.div>
        </div>

        <FormulaCard title="nth Term of H.P." formula="tₙ = 1 / [a + (n − 1)d]" description={`1 / [${a} + (${n}-1)${d}] = ${tn.toFixed(4)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '10px' }}>
          <AnimatePresence>
            {hpTerms.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} style={{ padding: '6px 10px', background: 'var(--bg4)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text3)' }}>H{i + 1}</span>
                <span className="math-font" style={{ fontWeight: 'bold', color: '#7c8cf8', fontSize: '0.9rem' }}>{t === Infinity ? '∞' : t.toFixed(3)}</span>
                <span style={{ fontSize: '0.5rem', color: 'var(--teal)', marginTop: '2px' }}>1/{(1 / t).toFixed(1)}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Reciprocal Decay Visualizer */}
        <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '10px 20px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {hpTerms.map((t, i) => {
            const h = t !== Infinity ? Math.min(180, (t / maxVal) * 160) : 180;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ type: 'spring', damping: 15 }}
                  style={{
                    width: '100%',
                    background: '#7c8cf8',
                    borderRadius: '4px 4px 0 0',
                    opacity: 0.5 + (1 - i / n) * 0.5,
                  }}
                />
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};
