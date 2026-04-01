import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const TrigDerivatives = () => {
  const [func, setFunc] = useState('sin');
  
  const derivatives = {
    sin: { label: 'sin x', deriv: 'cos x', color: 'var(--teal)' },
    cos: { label: 'cos x', deriv: '-sin x', color: 'var(--coral)' },
    tan: { label: 'tan x', deriv: 'sec² x', color: 'var(--gold)' },
    cot: { label: 'cot x', deriv: '-cosec² x', color: 'var(--gold)' },
    sec: { label: 'sec x', deriv: 'sec x tan x', color: 'var(--gold)' },
    cosec: { label: 'cosec x', deriv: '-cosec x cot x', color: 'var(--gold)' },
    asin: { label: 'arcsin x', deriv: '1 / \u221a(1 - x\u00b2)', color: 'var(--teal)' },
    acos: { label: 'arccos x', deriv: '-1 / \u221a(1 - x\u00b2)', color: 'var(--coral)' },
    atan: { label: 'arctan x', deriv: '1 / (1 + x\u00b2)', color: 'var(--gold)' }
  };

  const active = derivatives[func];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: active.color, marginBottom: '8px' }}>Trigonometric & Inverse Trig</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Derivatives of circular and inverse circular functions.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {Object.keys(derivatives).map(k => (
            <motion.button key={k} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setFunc(k)} style={{ padding: '8px', background: func === k ? active.color : 'var(--bg4)', color: func === k ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
              {derivatives[k].label}
            </motion.button>
          ))}
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: `4px solid ${active.color}` }}>
          <div className="math-font" style={{ fontSize: '1rem', color: 'var(--text3)', marginBottom: '8px' }}>
             (d/dx) {active.label}
          </div>
          <div className="math-font" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
             {active.deriv}
          </div>
        </motion.div>

        <FormulaCard title="Standard Result" formula={`\\frac{d}{dx}(${active.label}) = ${active.deriv}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px' }}>
        <svg width="200" height="200" viewBox="-120 -120 240 240">
           {/* Periodicity / Graph Visual */}
           <circle cx="0" cy="0" r="100" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 2" />
           <motion.path 
              d={Array.from({ length: 60 }, (_, i) => {
                 const ang = (i / 60) * 2 * Math.PI;
                 const rad = 80 + 15 * Math.sin(ang * 4); // Just a decorative geometric pattern
                 return `${i === 0 ? 'M' : 'L'} ${rad * Math.cos(ang)} ${rad * Math.sin(ang)}`;
              }).join(' ')} 
              fill="none" 
              stroke={active.color} 
              strokeWidth="2" 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
           />
           <text x="0" y="5" fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{active.label}</text>
        </svg>
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center' }}>
          {func.startsWith('a') ? 'Inverse trig derivatives are strictly algebraic but relate to circle segments.' : 'Circular functions have periodic derivatives (sin \u2192 cos \u2192 -sin \u2192 -cos).'}
        </p>
      </motion.div>
    </motion.div>
  );
};
