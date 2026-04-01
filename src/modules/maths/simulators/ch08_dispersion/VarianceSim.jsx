import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PRESETS = {
  'Test Scores': [45, 67, 82, 55, 90, 73, 61, 88, 50, 76],
  'Daily Sales': [120, 135, 110, 145, 130, 125, 140, 115, 150, 128],
  'Uniform': [50, 50, 50, 50, 50, 50, 50, 50],
};

const DeviationChart = ({ data, mean, isPopulation }) => {
  if (!data.length) return null;
  const maxVal = Math.max(...data.map(Math.abs), Math.abs(mean), 1);
  const barW = Math.min(34, Math.max(16, 340 / data.length - 4));

  return (
    <div style={{ width: '100%', height: 300, background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '16px', position: 'relative', overflow: 'hidden' }}>
      {/* Mean line at center */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', borderTop: '2px dashed var(--gold)', opacity: 0.5, zIndex: 1 }}>
        <span style={{ position: 'absolute', right: 6, top: -18, fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600 }}>x̄ = {mean.toFixed(2)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 4 }}>
        <AnimatePresence>
          {data.map((val, i) => {
            const dev = val - mean;
            const devSq = dev * dev;
            const h = Math.abs(dev / maxVal) * 120;
            const isPos = dev >= 0;
            const color = isPos ? 'var(--teal)' : 'var(--coral)';

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {/* Value label */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} style={{ position: 'absolute', top: isPos ? `calc(50% - ${h + 20}px)` : `calc(50% + ${h + 6}px)`, fontSize: '0.6rem', color: 'var(--text3)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {val}
                </motion.div>

                {/* Deviation bar from center */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h }}
                  transition={{ duration: 0.5, delay: i * 0.04, type: 'spring', damping: 12 }}
                  style={{
                    width: barW,
                    background: color,
                    borderRadius: isPos ? '6px 6px 0 0' : '0 0 6px 6px',
                    position: 'absolute',
                    [isPos ? 'bottom' : 'top']: '50%',
                    opacity: 0.8,
                  }}
                />

                {/* Deviation² indicator (small square) */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.04 }}
                  title={`(${val} - ${mean.toFixed(1)})² = ${devSq.toFixed(1)}`}
                  style={{
                    width: Math.min(barW - 2, Math.max(6, Math.sqrt(devSq / maxVal) * 15)),
                    height: Math.min(barW - 2, Math.max(6, Math.sqrt(devSq / maxVal) * 15)),
                    background: color,
                    opacity: 0.3,
                    borderRadius: '2px',
                    position: 'absolute',
                    [isPos ? 'bottom' : 'top']: `calc(50% + ${h + 3}px)`,
                  }}
                />
              </div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const VarianceSim = () => {
  const [data, setData] = useState([45, 67, 82, 55, 90, 73, 61, 88, 50, 76]);
  const [inputVal, setInputVal] = useState('');
  const [isPopulation, setIsPopulation] = useState(false);
  const [preset, setPreset] = useState('Test Scores');

  const n = data.length;
  const mean = n ? data.reduce((s, v) => s + v, 0) / n : 0;
  const sumSqDev = data.reduce((s, v) => s + (v - mean) ** 2, 0);
  const variance = n > (isPopulation ? 0 : 1) ? sumSqDev / (isPopulation ? n : n - 1) : 0;

  const addValue = () => {
    const v = parseFloat(inputVal);
    if (!isNaN(v)) { setData(prev => [...prev, v]); setInputVal(''); setPreset('Custom'); }
  };

  const applyPreset = (name) => {
    setPreset(name);
    setData([...PRESETS[name]]);
  };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Variance Calculator</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Bars show <span style={{ color: 'var(--teal)' }}>positive</span> and <span style={{ color: 'var(--coral)' }}>negative</span> deviations from the mean. The small squares hint at each squared deviation.
          </p>
        </motion.div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.keys(PRESETS).map(name => (
            <motion.button key={name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => applyPreset(name)} style={{ padding: '6px 12px', background: preset === name ? 'rgba(124,140,248,0.3)' : 'var(--bg4)', color: preset === name ? 'white' : 'var(--text3)', border: preset === name ? '1px solid rgba(124,140,248,0.5)' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {name}
            </motion.button>
          ))}
        </div>

        {/* Add data */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()} placeholder="Add value…" style={{ flex: 1, padding: '10px 14px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={addValue} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>+</motion.button>
        </div>

        {/* Population vs Sample toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ val: false, label: 'Sample (n−1)' }, { val: true, label: 'Population (n)' }].map(opt => (
            <motion.button key={String(opt.val)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsPopulation(opt.val)} style={{ flex: 1, padding: '9px', background: isPopulation === opt.val ? '#7c8cf8' : 'var(--bg4)', color: isPopulation === opt.val ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s' }}>
              {opt.label}
            </motion.button>
          ))}
        </div>

        {/* Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '60px', overflowY: 'auto' }}>
          {data.map((v, i) => (
            <motion.span key={i} whileHover={{ scale: 1.1 }} onClick={() => { setData(prev => prev.filter((_, j) => j !== i)); setPreset('Custom'); }} style={{ padding: '3px 8px', background: 'var(--bg4)', color: 'var(--text2)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 500 }}>
              {v} ×
            </motion.span>
          ))}
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>Mean (x̄)</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 'bold' }}>{mean.toFixed(2)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>Variance (σ²)</div>
            <div className="math-font" style={{ color: '#7c8cf8', fontSize: '1.2rem', fontWeight: 'bold' }}>{variance.toFixed(2)}</div>
          </motion.div>
        </div>

        <FormulaCard
          title={isPopulation ? "Population Variance" : "Sample Variance"}
          formula={isPopulation ? "σ² = Σ(xᵢ − x̄)² / n" : "s² = Σ(xᵢ − x̄)² / (n − 1)"}
          description={`Σ(xᵢ − x̄)² = ${sumSqDev.toFixed(2)}, ${isPopulation ? 'n' : 'n−1'} = ${isPopulation ? n : n - 1}`}
        />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <DeviationChart data={data} mean={mean} isPopulation={isPopulation} />
      </motion.div>
    </motion.div>
  );
};
