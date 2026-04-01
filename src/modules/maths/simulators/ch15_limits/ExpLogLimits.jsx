import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const ExpLogLimits = () => {
  const [x, setX] = useState(0.5);
  const [limitType, setLimitType] = useState('e');

  const getTrace = (val) => {
    if (limitType === 'e') return Math.pow(1 + val, 1 / val);
    if (limitType === 'exp') return (Math.pow(Math.E, val) - 1) / val;
    return Math.log(1 + val) / val;
  };

  const res = getTrace(x);
  const e = Math.E;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Exponential & Logarithmic Limits</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Limits involving <em>Euler's number (e)</em> and natural logarithms.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button onClick={() => setLimitType('e')} style={{ flex: 1, padding: '8px', background: limitType === 'e' ? 'var(--gold)' : 'var(--bg4)', color: limitType === 'e' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>Def of e</button>
          <button onClick={() => setLimitType('exp')} style={{ flex: 1, padding: '8px', background: limitType === 'exp' ? 'var(--gold)' : 'var(--bg4)', color: limitType === 'exp' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>(e^x - 1)/x</button>
          <button onClick={() => setLimitType('log')} style={{ flex: 1, padding: '8px', background: limitType === 'log' ? 'var(--gold)' : 'var(--bg4)', color: limitType === 'log' ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem' }}>log(1+x)/x</button>
        </div>

        <MathSlider label="Variable x" min={0.01} max={1} step={0.01} value={x} onChange={setX} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--gold)' }}>
          <div className="math-font" style={{ fontSize: '1.4rem', color: 'white' }}>
            {limitType === 'e' ? `(1 + x)^(1/x) \u2192 ${e.toFixed(4)}` : 
             limitType === 'exp' ? `(e^x - 1)/x \u2192 1.0000` : 
             `log(1+x)/x \u2192 1.0000`}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--gold)', marginTop: '8px' }}>
             Current: {res.toFixed(6)}
          </div>
        </motion.div>

        <FormulaCard title="Standard Limit" formula={limitType === 'e' ? "\\lim_{x \\to 0} (1+x)^{1/x} = e" : limitType === 'exp' ? "\\lim_{x \\to 0} \\frac{e^x - 1}{x} = 1" : "\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x} = 1"} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px', minHeight: '250px' }}>
         <svg width="250" height="200" style={{ overflow: 'visible' }}>
            {/* Target Line */}
            <line x1="0" y1="100" x2="250" y2="100" stroke="var(--gold)" strokeDasharray="4" opacity="0.3" />
            <text x="255" y="105" fill="var(--gold)" fontSize="10">Limit: {limitType === 'e' ? 'e' : '1'}</text>

            {/* Convergence Tracer */}
            <motion.path 
               d={Array.from({ length: 100 }, (_, i) => {
                  const vx = 1 - (i / 100);
                  const vy = (getTrace(vx) - (limitType === 'e' ? e : 1)) * 50 + 100;
                  return `${i === 0 ? 'M' : 'L'} ${250 - i * 2.5} ${vy}`;
               }).join(' ')} 
               fill="none" 
               stroke="var(--gold)" 
               strokeWidth="2" 
               opacity="0.4"
            />

            {/* Current Point */}
            <motion.circle 
               animate={{ cx: 250 - (1-x)*250, cy: (res - (limitType === 'e' ? e : 1)) * 50 + 100 }} 
               r="6" 
               fill="var(--gold)" 
               stroke="white" 
               strokeWidth="2"
            />
         </svg>
         
         <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '300px' }}>
            Slide <strong>x &rarr; 0</strong> to see how the function converges exactly to the limit value.
         </p>
      </motion.div>
    </motion.div>
  );
};
