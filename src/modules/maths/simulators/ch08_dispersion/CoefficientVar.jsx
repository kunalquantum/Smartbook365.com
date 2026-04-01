import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PRESETS = {
  A: { name: 'Heights (cm)', data: [150, 162, 175, 158, 168, 172, 155, 180, 165, 160] },
  B: { name: 'Weights (kg)', data: [55, 62, 78, 65, 70, 68, 60, 72, 58, 64] },
};

const calcStats = (data) => {
  const n = data.length;
  if (n === 0) return { mean: 0, variance: 0, sd: 0, cv: 0 };
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const variance = n > 1 ? data.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1) : 0;
  const sd = Math.sqrt(variance);
  const cv = mean !== 0 ? (sd / mean) * 100 : 0;
  return { mean, variance, sd, cv };
};

const ComparisonBar = ({ label, cv, color, maxCV, winner }) => {
  const widthPct = maxCV > 0 ? (cv / maxCV) * 100 : 0;
  return (
    <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '10px', borderLeft: winner ? `4px solid ${color}` : '4px solid transparent' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text2)', fontWeight: 600 }}>{label}</span>
        <span className="math-font" style={{ color, fontWeight: 'bold', fontSize: '1rem' }}>{cv.toFixed(2)}%</span>
      </div>
      <div style={{ position: 'relative', height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${widthPct}%` }} transition={{ duration: 0.8, type: 'spring', damping: 15 }} style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: color, borderRadius: 5 }} />
      </div>
      {winner && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '6px', fontSize: '0.75rem', color, fontWeight: 600 }}>
          ✦ More consistent (lower CV)
        </motion.div>
      )}
    </motion.div>
  );
};

const MiniBarChart = ({ data, color, stats }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
      {data.map((v, i) => (
        <motion.div key={i} initial={{ height: 0 }} animate={{ height: (v / max) * 70 }} transition={{ duration: 0.4, delay: i * 0.03, type: 'spring', damping: 14 }} style={{ flex: 1, background: color, borderRadius: '3px 3px 0 0', opacity: 0.7, minWidth: 4 }} />
      ))}
    </div>
  );
};

export const CoefficientVar = () => {
  const [dataA, setDataA] = useState([...PRESETS.A.data]);
  const [dataB, setDataB] = useState([...PRESETS.B.data]);
  const [nameA, setNameA] = useState(PRESETS.A.name);
  const [nameB, setNameB] = useState(PRESETS.B.name);
  const [inputA, setInputA] = useState('');
  const [inputB, setInputB] = useState('');

  const statsA = calcStats(dataA);
  const statsB = calcStats(dataB);
  const maxCV = Math.max(statsA.cv, statsB.cv, 1);
  const winnerA = statsA.cv <= statsB.cv;

  const addA = () => { const v = parseFloat(inputA); if (!isNaN(v)) { setDataA(p => [...p, v]); setInputA(''); } };
  const addB = () => { const v = parseFloat(inputB); if (!isNaN(v)) { setDataB(p => [...p, v]); setInputB(''); } };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Coefficient of Variation</h3>
        <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
          Compare the <strong>relative variability</strong> of two datasets with different units or scales. Lower CV = more consistent data.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Dataset A */}
        <motion.div layout style={{ background: 'var(--bg3)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', border: winnerA ? '1px solid var(--teal)' : '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--teal)' }}>Dataset A</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{nameA}</span>
          </div>

          <MiniBarChart data={dataA} color="var(--teal)" stats={statsA} />

          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={inputA} onChange={e => setInputA(e.target.value)} onKeyDown={e => e.key === 'Enter' && addA()} placeholder="Add…" style={{ flex: 1, padding: '8px 10px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={addA} style={{ padding: '8px 14px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>+</motion.button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '50px', overflowY: 'auto' }}>
            {dataA.map((v, i) => (
              <span key={i} onClick={() => setDataA(p => p.filter((_, j) => j !== i))} style={{ padding: '2px 7px', background: 'rgba(0,196,180,0.15)', color: 'var(--teal)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>{v}×</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {[
              { l: 'x̄', v: statsA.mean.toFixed(1) },
              { l: 'σ', v: statsA.sd.toFixed(2) },
              { l: 'CV', v: `${statsA.cv.toFixed(1)}%` },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--bg4)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>{s.l}</div>
                <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '0.9rem' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dataset B */}
        <motion.div layout style={{ background: 'var(--bg3)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px', border: !winnerA ? '1px solid var(--coral)' : '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--coral)' }}>Dataset B</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{nameB}</span>
          </div>

          <MiniBarChart data={dataB} color="var(--coral)" stats={statsB} />

          <div style={{ display: 'flex', gap: '6px' }}>
            <input value={inputB} onChange={e => setInputB(e.target.value)} onKeyDown={e => e.key === 'Enter' && addB()} placeholder="Add…" style={{ flex: 1, padding: '8px 10px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={addB} style={{ padding: '8px 14px', background: 'var(--coral)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>+</motion.button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxHeight: '50px', overflowY: 'auto' }}>
            {dataB.map((v, i) => (
              <span key={i} onClick={() => setDataB(p => p.filter((_, j) => j !== i))} style={{ padding: '2px 7px', background: 'rgba(247,103,89,0.15)', color: 'var(--coral)', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>{v}×</span>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
            {[
              { l: 'x̄', v: statsB.mean.toFixed(1) },
              { l: 'σ', v: statsB.sd.toFixed(2) },
              { l: 'CV', v: `${statsB.cv.toFixed(1)}%` },
            ].map(s => (
              <div key={s.l} style={{ background: 'var(--bg4)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>{s.l}</div>
                <div className="math-font" style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.9rem' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Comparison bars */}
      <div style={{ display: 'grid', gap: '10px' }}>
        <ComparisonBar label={`A: ${nameA}`} cv={statsA.cv} color="var(--teal)" maxCV={maxCV} winner={winnerA} />
        <ComparisonBar label={`B: ${nameB}`} cv={statsB.cv} color="var(--coral)" maxCV={maxCV} winner={!winnerA} />
      </div>

      <FormulaCard title="Coefficient of Variation" formula="CV = (σ / x̄) × 100%" description="Dimensionless measure allowing comparison across different scales" />
    </motion.div>
  );
};
