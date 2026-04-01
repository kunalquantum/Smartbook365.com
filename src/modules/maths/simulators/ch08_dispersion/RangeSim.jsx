import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PRESETS = {
  'Custom': [],
  'Test Scores': [45, 67, 82, 55, 90, 73, 61, 88, 50, 76],
  'Temperatures': [22, 25, 28, 23, 30, 27, 21, 26, 29, 24],
  'Heights (cm)': [150, 162, 175, 158, 168, 172, 155, 180, 165, 160],
};

const BarChart = ({ data, min, max, mean }) => {
  if (!data.length) return null;
  const maxVal = Math.max(...data, 1);
  const barWidth = Math.min(36, Math.max(18, 340 / data.length - 4));

  return (
    <div style={{ position: 'relative', width: '100%', height: 260, background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px 16px 30px', overflow: 'hidden' }}>
      {/* Mean line */}
      {data.length > 0 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${30 + (mean / maxVal) * 200}px`, borderTop: '2px dashed var(--gold)', opacity: 0.6, zIndex: 2 }}>
          <span style={{ position: 'absolute', right: 4, top: -18, fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600 }}>x̄ = {mean.toFixed(1)}</span>
        </div>
      )}

      {/* Min line */}
      {data.length > 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${30 + (min / maxVal) * 200}px`, borderTop: '2px dashed var(--teal)', opacity: 0.4, zIndex: 2 }}>
          <span style={{ position: 'absolute', left: 4, top: -18, fontSize: '0.65rem', color: 'var(--teal)' }}>Min</span>
        </div>
      )}

      {/* Max line */}
      {data.length > 1 && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${30 + (max / maxVal) * 200}px`, borderTop: '2px dashed var(--coral)', opacity: 0.4, zIndex: 2 }}>
          <span style={{ position: 'absolute', left: 4, top: 2, fontSize: '0.65rem', color: 'var(--coral)' }}>Max</span>
        </div>
      )}

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '100%', gap: 4 }}>
        <AnimatePresence>
          {data.map((val, i) => {
            const h = (val / maxVal) * 200;
            const isMin = val === min;
            const isMax = val === max;
            const barColor = isMin ? 'var(--teal)' : isMax ? 'var(--coral)' : 'rgba(124, 140, 248, 0.7)';
            return (
              <motion.div key={i} initial={{ height: 0, opacity: 0 }} animate={{ height: h, opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, delay: i * 0.03, type: 'spring', damping: 15 }} style={{ width: barWidth, background: barColor, borderRadius: '6px 6px 0 0', position: 'relative', minHeight: 4 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.03 }} style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '0.65rem', color: 'var(--text2)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {val}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const RangeSim = () => {
  const [data, setData] = useState([45, 67, 82, 55, 90, 73, 61, 88, 50, 76]);
  const [inputVal, setInputVal] = useState('');
  const [preset, setPreset] = useState('Test Scores');

  const sorted = [...data].sort((a, b) => a - b);
  const min = sorted[0] || 0;
  const max = sorted[sorted.length - 1] || 0;
  const range = max - min;
  const mean = data.length ? data.reduce((s, v) => s + v, 0) / data.length : 0;

  const addValue = () => {
    const v = parseFloat(inputVal);
    if (!isNaN(v)) {
      setData(prev => [...prev, v]);
      setInputVal('');
      setPreset('Custom');
    }
  };

  const removeValue = (idx) => {
    setData(prev => prev.filter((_, i) => i !== idx));
    setPreset('Custom');
  };

  const applyPreset = (name) => {
    setPreset(name);
    if (PRESETS[name].length > 0) setData([...PRESETS[name]]);
  };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Range Explorer</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Add or remove data values. The <span style={{ color: 'var(--coral)' }}>red bar</span> is the maximum, <span style={{ color: 'var(--teal)' }}>green</span> is the minimum. Range = Max − Min.
          </p>
        </motion.div>

        {/* Preset selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.keys(PRESETS).filter(k => k !== 'Custom').map(name => (
            <motion.button key={name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => applyPreset(name)} style={{ padding: '7px 12px', background: preset === name ? 'rgba(124, 140, 248, 0.3)' : 'var(--bg4)', color: preset === name ? 'white' : 'var(--text3)', border: preset === name ? '1px solid rgba(124,140,248,0.5)' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {name}
            </motion.button>
          ))}
        </div>

        {/* Data entry */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()} placeholder="Add a value…" style={{ flex: 1, padding: '10px 14px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={addValue} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>+</motion.button>
        </div>

        {/* Data chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '80px', overflowY: 'auto' }}>
          <AnimatePresence>
            {data.map((v, i) => (
              <motion.span key={`${i}-${v}`} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} onClick={() => removeValue(i)} style={{ padding: '4px 10px', background: v === max ? 'rgba(247,103,89,0.2)' : v === min ? 'rgba(0,196,180,0.2)' : 'var(--bg4)', color: v === max ? 'var(--coral)' : v === min ? 'var(--teal)' : 'var(--text2)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>
                {v} ×
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'Min', value: min, color: 'var(--teal)' },
            { label: 'Max', value: max, color: 'var(--coral)' },
            { label: 'Range', value: range, color: 'white' },
          ].map(item => (
            <motion.div key={item.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px', letterSpacing: '0.5px' }}>{item.label}</div>
              <div className="math-font" style={{ color: item.color, fontSize: '1.3rem', fontWeight: 'bold' }}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        <FormulaCard title="Range Formula" formula="Range = Max − Min" description={`${max} − ${min} = ${range}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BarChart data={data} min={min} max={max} mean={mean} />
      </motion.div>
    </motion.div>
  );
};
