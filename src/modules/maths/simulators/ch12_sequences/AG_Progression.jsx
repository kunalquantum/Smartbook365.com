import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const AGProgression = () => {
  const [a, setA] = useState(1);
  const [d, setD] = useState(1);
  const [r, setR] = useState(0.5);
  const [n, setN] = useState(8);

  const terms = [];
  let currentSum = 0;
  const partialSums = [];

  for (let i = 0; i < n; i++) {
    const apPart = a + i * d;
    const gpPart = Math.pow(r, i);
    const val = apPart * gpPart;
    terms.push(val);
    currentSum += val;
    partialSums.push(currentSum);
  }

  // S_inf formula: S_inf = a/(1-r) + dr/(1-r)^2
  const sInf = Math.abs(r) < 1 ? a / (1 - r) + (d * r) / Math.pow(1 - r, 2) : Infinity;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Arithmetico-Geometric (A.G.P.)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A sequence formed by the term-by-term product of an A.P. and a G.P.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <MathSlider label="AP: a" min={0} max={5} step={0.5} value={a} onChange={setA} />
          <MathSlider label="AP: d" min={0} max={3} step={0.1} value={d} onChange={setD} />
        </div>
        <MathSlider label="GP: r" min={-1.5} max={1.5} step={0.05} value={r} onChange={setR} />
        <MathSlider label="Terms (n)" min={3} max={15} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Sum Sₙ</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1.2rem' }}>{currentSum.toFixed(3)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--gold)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>S_∞</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.2rem' }}>{sInf === Infinity ? 'Div.' : sInf.toFixed(3)}</div>
          </motion.div>
        </div>

        <FormulaCard title="nth Term of A.G.P." formula="tₙ = [a + (n − 1)d] · rⁿ⁻¹" description={`[${a} + (${n}-1)${d}] · (${r})<sup>${n - 1}</sup> = ${terms[n - 1].toFixed(4)}`} />
        {Math.abs(r) < 1 && (
          <FormulaCard title="Sum to Infinity" formula="S_∞ = a/(1−r) + dr/(1−r)²" />
        )}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', padding: '12px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {terms.slice(0, 10).map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 10px', background: 'var(--bg4)', borderRadius: '6px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text3)' }}>t{i + 1} = ({a + i * d} · {r !== 0 ? Math.pow(r, i).toFixed(2) : 0})</span>
              <span className="math-font" style={{ fontWeight: 'bold', color: 'var(--coral)' }}>{t.toFixed(3)}</span>
            </motion.div>
          ))}
          {n > 10 && <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text3)' }}>... and {n - 10} more terms</div>}
        </div>

        {/* Visual of term components */}
        <div style={{ height: '160px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '15px', position: 'relative' }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* AP part (linear) */}
            <motion.path
              d={terms.map((_, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - ((a + i * d) / (a + (n - 1) * d)) * 40}`).join(' ')}
              fill="none" stroke="var(--teal)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4"
            />
            {/* AGP Result (curve) */}
            <motion.path
              d={terms.map((t, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (t / Math.max(...terms, 1)) * 90}`).join(' ')}
              fill="none" stroke="var(--coral)" strokeWidth="1.5"
              animate={{ d: terms.map((t, i) => `${i === 0 ? 'M' : 'L'} ${(i / (n - 1)) * 100} ${100 - (t / Math.max(...terms, 1)) * 90}`).join(' ') }}
            />
          </svg>
          <div style={{ position: 'absolute', top: '10px', left: '15px', display: 'flex', gap: '15px' }}>
            <div style={{ fontSize: '9px', color: 'var(--teal)' }}>--- AP Part</div>
            <div style={{ fontSize: '9px', color: 'var(--coral)', fontWeight: 'bold' }}>— AGP Result</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
