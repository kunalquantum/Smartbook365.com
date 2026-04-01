import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const DerivativeFunction = () => {
  const [showDeriv, setShowDeriv] = useState(true);
  
  const f = (x) => Math.sin(x);
  const df = (x) => Math.cos(x);

  const w = 360, h = 240, p = 40;
  const mx = (x) => p + ((x + 3.14) / 6.28) * (w - 2 * p);
  const my = (y) => h / 2 - (y * 60);

  const pointsF = [];
  const pointsDF = [];
  for (let x = -3.14; x <= 3.14; x += 0.1) {
    pointsF.push([x, f(x)]);
    pointsDF.push([x, df(x)]);
  }

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Derivative as a Function</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The derivative is itself a function <strong>f'(x)</strong>. Notice how <strong>f'(x)</strong> is 0 where <strong>f(x)</strong> has peaks or valleys.
          </p>
        </motion.div>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowDeriv(!showDeriv)} style={{ padding: '12px', background: showDeriv ? 'var(--gold)' : 'var(--bg4)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          {showDeriv ? 'Hide Derivative' : 'Show Derivative f\'(x)'}
        </motion.button>

        <div style={{ background: 'var(--bg4)', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '15px', height: '2px', background: 'var(--teal)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>f(x) = sin(x)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', opacity: showDeriv ? 1 : 0.3 }}>
            <div style={{ width: '15px', height: '2px', background: 'var(--gold)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>f'(x) = cos(x)</span>
          </div>
        </div>

        <FormulaCard title="Derivative Function" formula="f'(x) = \frac{d}{dx}f(x)" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <line x1={p} y1={h / 2} x2={w - p} y2={h / 2} stroke="var(--border)" strokeWidth="0.5" />
          <line x1={w / 2} y1={p} x2={w / 2} y2={h - p} stroke="var(--border)" strokeWidth="0.5" />
          
          <path d={pointsF.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mx(pt[0])} ${my(pt[1])}`).join(' ')} fill="none" stroke="var(--teal)" strokeWidth="2.5" />

          <AnimatePresence>
            {showDeriv && (
              <motion.path
                key="deriv"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                d={pointsDF.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${mx(pt[0])} ${my(pt[1])}`).join(' ')}
                fill="none" stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 2"
              />
            )}
          </AnimatePresence>

          <text x={w / 2} y={h - 10} fill="var(--text3)" fontSize="10" textAnchor="middle">f'(x) is the rate of change of f(x)</text>
        </svg>
      </motion.div>
    </motion.div>
  );
};
