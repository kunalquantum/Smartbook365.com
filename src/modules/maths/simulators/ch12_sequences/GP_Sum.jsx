import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const GPSum = () => {
  const [a, setA] = useState(1);
  const [r, setR] = useState(0.5);
  const [n, setN] = useState(10);
  const [showSumToInfinity, setShowSumToInfinity] = useState(true);

  const terms = [];
  const partialSums = [];
  let currentSum = 0;
  for (let i = 0; i < n; i++) {
    const val = a * Math.pow(r, i);
    terms.push(val);
    currentSum += val;
    partialSums.push(currentSum);
  }

  const sn = r !== 1 ? (a * (1 - Math.pow(r, n))) / (1 - r) : a * n;
  const sInf = Math.abs(r) < 1 ? a / (1 - r) : Infinity;

  const maxVal = Math.max(...partialSums.map(Math.abs), sInf !== Infinity ? sInf : 1);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Sum of Terms in G.P.</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Explore how partial sums converge or diverge. If <strong>|r| &lt; 1</strong>, the sum to infinity exists.
          </p>
        </motion.div>

        <MathSlider label="First term (a)" min={-5} max={5} step={0.5} value={a} onChange={setA} />
        <MathSlider label="Common ratio (r)" min={-2.5} max={2.5} step={0.1} value={r} onChange={setR} />
        <MathSlider label="Number of terms (n)" min={2} max={30} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Sₙ (Partial Sum)</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1.2rem' }}>{sn.toFixed(3)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Sum to ∞</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{sInf === Infinity ? 'Div.' : sInf.toFixed(3)}</div>
          </motion.div>
        </div>

        <FormulaCard title="Sum of n terms" formula="Sₙ = a(1 − rⁿ) / (1 − r)" description={`r = ${r}, n = ${n} → Sₙ = ${sn.toFixed(4)}`} />
        {Math.abs(r) < 1 && (
          <FormulaCard title="Sum to Infinity" formula="S_∞ = a / (1 − r)" description={`${a} / (1 − ${r}) = ${sInf.toFixed(4)}`} />
        )}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        {/* Converge Visualizer (Cumulative) */}
        <div style={{ height: '240px', background: 'var(--bg2)', borderRadius: '16px', border: '1px solid var(--border)', position: 'relative', overflow: 'hidden', padding: '15px' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Target line for S_inf */}
            {sInf !== Infinity && maxVal !== 0 && (
              <motion.line
                x1="0" y1={100 - (sInf / maxVal) * 90} x2="100" y2={100 - (sInf / maxVal) * 90}
                stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="2 1"
                animate={{ y1: 100 - (sInf / maxVal) * 90, y2: 100 - (sInf / maxVal) * 90 }}
              />
            )}
            
            {/* Area under sum */}
            {n > 1 && maxVal !== 0 && (
              <motion.path
                d={partialSums.map((s, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (s / maxVal) * 90}`).join(' ') + ` L 100 100 L 0 100 Z`}
                fill="var(--teal)" opacity="0.15"
                animate={{ d: partialSums.map((s, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (s / maxVal) * 90}`).join(' ') + ` L 100 100 L 0 100 Z` }}
                transition={{ type: 'spring', damping: 15 }}
              />
            )}

            {/* Path of partial sums */}
            {n > 1 && maxVal !== 0 && (
              <motion.path
                d={partialSums.map((s, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (s / maxVal) * 90}`).join(' ')}
                fill="none" stroke="var(--teal)" strokeWidth="1"
                animate={{ d: partialSums.map((s, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (s / maxVal) * 90}`).join(' ') }}
              />
            )}

            {/* Dots for partial sums */}
            {n > 1 && maxVal !== 0 && partialSums.map((s, i) => (
              <motion.circle
                key={i} cx={(i / (n - 1)) * 100} cy={100 - (s / maxVal) * 90} r="1"
                fill="var(--teal)"
                animate={{ cx: (i / (n - 1)) * 100, cy: 100 - (s / maxVal) * 90 }}
              />
            ))}
          </svg>

          <div style={{ position: 'absolute', top: '10px', left: '15px', color: 'var(--text3)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Partial Sums S₁ → S{n}</div>
          {sInf !== Infinity && (
            <div style={{ position: 'absolute', top: `${100 - (sInf / maxVal) * 90}%`, right: '15px', transform: 'translateY(-100%)', color: 'var(--gold)', fontSize: '10px', fontWeight: 'bold' }}>
              Limit (S_∞) = {sInf.toFixed(2)}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--teal)', borderRadius: '50%' }} />
            <span style={{ fontSize: '10px', color: 'var(--text3)' }}>Partial Sums</span>
          </div>
          {sInf !== Infinity && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} />
              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>Convergence Point</span>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
