import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const AlgebraicDerivatives = () => {
  const [rule, setRule] = useState('power');
  const [uVal, setUVal] = useState(3);
  const [vVal, setVVal] = useState(2);

  const rules = {
    power: { label: 'Power Rule', formula: '(d/dx) x^n = n x^{n-1}', result: `n = ${uVal} \u2192 f'(x) = ${uVal}x^${uVal - 1}`, color: 'var(--teal)' },
    sum: { label: 'Sum Rule', formula: '(d/dx)[u+v] = u\' + v\'', result: `(x^${uVal})' + (x^${vVal})' = ${uVal}x^${uVal-1} + ${vVal}x^${vVal-1}`, color: 'var(--coral)' },
    product: { label: 'Product Rule', formula: '(uv)\' = uv\' + vu\'', result: `... \u2192 (${uVal}+${vVal}) x^${uVal+vVal-1}`, color: 'var(--gold)' },
    quotient: { label: 'Quotient Rule', formula: '(u/v)\' = \frac{vu\' - uv\'}{v^2}', result: 'Result depends on u, v functions', color: 'var(--gold)' },
    chain: { label: 'Chain Rule', formula: '(d/dx) f(g(x)) = f\'(g(x)) \cdot g\'(x)', result: `Example: (sin(x^${uVal}))' = cos(x^${uVal}) \cdot ${uVal}x^${uVal-1}`, color: 'var(--teal)' }
  };

  const active = rules[rule];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: active.color, marginBottom: '8px' }}>Algebraic Rules</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Master the recipes of differentiation. From basic sums to <strong>Composite Functions (Chain Rule)</strong>.
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {Object.keys(rules).map(k => (
            <motion.button key={k} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setRule(k)} style={{ flex: 1, padding: '8px', background: rule === k ? active.color : 'var(--bg4)', color: rule === k ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600 }}>
              {rules[k].label}
            </motion.button>
          ))}
        </div>

        <MathSlider label="Variable u (exponent)" min={1} max={5} step={1} value={uVal} onChange={setUVal} />
        <MathSlider label="Variable v (exponent)" min={1} max={5} step={1} value={vVal} onChange={setVVal} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: `4px solid ${active.color}` }}>
          <div className="math-font" style={{ fontSize: '1.2rem', color: 'white', opacity: 0.8 }}>
             {active.formula}
          </div>
          <div style={{ fontSize: '1.1rem', color: active.color, marginTop: '8px', fontWeight: 'bold' }}>
             {active.result}
          </div>
        </motion.div>

        <FormulaCard title="Rule Explanation" formula={active.formula} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px' }}>
        {rule === 'chain' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ width: 80, height: 80, border: '4px dashed var(--teal)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)', fontWeight: 'bold' }}>
               Outer
            </motion.div>
            <div style={{ fontSize: '1.5rem', color: 'var(--text3)' }}>&times;</div>
            <motion.div animate={{ rotate: -720 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ width: 50, height: 50, border: '3px dashed var(--coral)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.8rem' }}>
               Inner
            </motion.div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
            <motion.div initial={{ height: 0 }} animate={{ height: uVal * 15 }} style={{ width: '20px', background: 'var(--teal)', borderRadius: '4px 4px 0 0' }} />
            <motion.div initial={{ height: 0 }} animate={{ height: vVal * 15 }} style={{ width: '20px', background: 'var(--coral)', borderRadius: '4px 4px 0 0' }} />
            <div style={{ width: '2px', height: '100%', background: 'var(--border)' }} />
            <motion.div initial={{ height: 0 }} animate={{ height: (uVal + vVal) * 15 }} style={{ width: '20px', background: 'var(--gold)', borderRadius: '4px 4px 0 0' }} />
          </div>
        )}
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center' }}>
          {rule === 'chain' ? 'Chain Rule: The outer rate is scaled by the inner rate!' : 'Comparing rates of change and their combined effect.'}
        </p>
      </motion.div>
    </motion.div>
  );
};
