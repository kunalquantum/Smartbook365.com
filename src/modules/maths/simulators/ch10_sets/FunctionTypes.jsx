import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const FUNCTIONS = [
  { key: 'identity', label: 'Identity', formula: 'f(x) = x', fn: x => x, type: 'One-one & Onto', color: 'var(--teal)' },
  { key: 'constant', label: 'Constant', formula: 'f(x) = 3', fn: () => 3, type: 'Many-one, Not onto', color: 'var(--coral)' },
  { key: 'linear', label: 'Linear', formula: 'f(x) = 2x + 1', fn: x => 2 * x + 1, type: 'One-one & Onto', color: 'var(--gold)' },
  { key: 'quadratic', label: 'Quadratic', formula: 'f(x) = x²', fn: x => x * x, type: 'Many-one, Not onto (ℝ→ℝ)', color: '#7c8cf8' },
  { key: 'absolute', label: 'Absolute', formula: 'f(x) = |x|', fn: x => Math.abs(x), type: 'Many-one onto [0,∞)', color: 'var(--teal)' },
  { key: 'cubic', label: 'Cubic', formula: 'f(x) = x³', fn: x => x * x * x, type: 'One-one & Onto (bijective)', color: 'var(--coral)' },
  { key: 'recip', label: 'Reciprocal', formula: 'f(x) = 1/x', fn: x => x !== 0 ? 1 / x : null, type: 'One-one, Domain ≠ 0', color: 'var(--gold)' },
  { key: 'step', label: 'Step / GIF', formula: 'f(x) = ⌊x⌋', fn: x => Math.floor(x), type: 'Many-one, Onto ℤ', color: '#7c8cf8' },
];

const FunctionCurveSVG = ({ mapX, mapY, fn, color, isSvg, minX, maxX }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const points = [];
  const steps = 400;
  for (let i = 0; i <= steps; i++) {
    const x = minX + (i / steps) * (maxX - minX);
    const y = fn(x);
    if (y !== null && Math.abs(y) <= 10) {
      points.push([x, y]);
    }
  }

  // Split into segments for discontinuous functions
  const segments = [];
  let current = [];
  for (let i = 0; i < points.length; i++) {
    if (i > 0 && Math.abs(points[i][1] - points[i - 1][1]) > 5) {
      if (current.length > 1) segments.push(current);
      current = [points[i]];
    } else {
      current.push(points[i]);
    }
  }
  if (current.length > 1) segments.push(current);

  return (
    <g>
      <defs>
        <filter id="fn-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {segments.map((seg, si) => {
        const d = seg.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');
        return <path key={si} d={d} fill="none" stroke={color} strokeWidth="3" filter="url(#fn-glow)" />;
      })}
    </g>
  );
};

export const FunctionTypes = () => {
  const [activeKey, setActiveKey] = useState('identity');
  const info = FUNCTIONS.find(f => f.key === activeKey);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Types of Functions</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Select a function to see its graph, equation, and classification (one-one, onto, many-one, bijective).
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {FUNCTIONS.map(f => (
            <motion.button key={f.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveKey(f.key)} style={{ padding: '10px 8px', background: activeKey === f.key ? f.color : 'var(--bg4)', color: activeKey === f.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s', textAlign: 'left' }}>
              <span className="math-font">{f.formula}</span>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: '2px' }}>{f.label}</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeKey} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', borderLeft: `4px solid ${info.color}` }}>
            <div className="math-font" style={{ color: info.color, fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '6px' }}>{info.formula}</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
              <strong>Type:</strong> {info.type}
            </div>
          </motion.div>
        </AnimatePresence>

        <FormulaCard title="Function Classification" formula="f: A → B" description="One-one (injective): f(a₁) = f(a₂) ⟹ a₁ = a₂ | Onto (surjective): Range = Co-domain" />
      </div>

      <motion.div key={activeKey} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-8, 8]} range={[-8, 8]}>
          <FunctionCurveSVG isSvg fn={info.fn} color={info.color} />
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
