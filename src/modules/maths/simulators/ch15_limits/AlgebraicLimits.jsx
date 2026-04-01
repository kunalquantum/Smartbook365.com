import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const AlgebraicLimits = () => {
  const [a, setA] = useState(2);
  const [method, setMethod] = useState('factor');
  const [showCancellation, setShowCancellation] = useState(false);

  const reset = () => setShowCancellation(false);
  useEffect(reset, [a, method]);

  const scenarios = {
    factor: {
      title: 'Factorization',
      problem: `\\lim_{x \\to ${a}} \\frac{x^2 - ${a*a}}{x - ${a}}`,
      step1: `\\frac{(x - ${a})(x + ${a})}{x - ${a}}`,
      result: `x + ${a} \\to ${2*a}`,
      cancelled: `(x - ${a})`
    },
    rational: {
      title: 'Rationalization',
      problem: `\\lim_{x \\to 0} \\frac{\\sqrt{x + 1} - 1}{x}`,
      step1: `\\frac{\\sqrt{x + 1} - 1}{x} \\cdot \\frac{\\sqrt{x + 1} + 1}{\\sqrt{x + 1} + 1}`,
      result: `\\frac{1}{\\sqrt{x+1}+1} \\to 0.5`,
      cancelled: `x`
    }
  };

  const curr = scenarios[method];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Algebraic Limits</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Resolving <strong>0/0</strong> indeterminate forms by cancelling the common factor that makes it zero.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setMethod('factor')} style={{ flex: 1, padding: '10px', background: method === 'factor' ? 'var(--teal)' : 'var(--bg4)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Factorization</button>
          <button onClick={() => setMethod('rational')} style={{ flex: 1, padding: '10px', background: method === 'rational' ? 'var(--teal)' : 'var(--bg4)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Rationalization</button>
        </div>

        {method === 'factor' && <MathSlider label="Limit a" min={1} max={5} step={1} value={a} onChange={setA} />}

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--teal)' }}>
          <div className="math-font" style={{ fontSize: '1.4rem', color: 'white', marginBottom: '10px' }}>
            {curr.problem}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '60px' }}>
            {!showCancellation ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCancellation(true)} style={{ padding: '8px 16px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Solve Indeterminate Form
              </motion.button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ fontSize: '1.1rem', color: 'var(--text2)' }}>
                Result: <span style={{ color: 'var(--teal)', fontWeight: 'bold' }}>{curr.result}</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        <FormulaCard title="Important Formula" formula="\lim_{x \to a} \frac{x^n - a^n}{x - a} = n a^{n-1}" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px', minHeight: '250px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Step-by-Step Visualization:</div>
        
        <div style={{ position: 'relative', fontSize: '1.5rem', fontFamily: 'serif', display: 'flex', alignItems: 'center' }}>
          {method === 'factor' ? (
             <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div style={{ borderBottom: '2px solid white', padding: '0 10px', display: 'flex', gap: '5px' }}>
                      <AnimatePresence>
                        {(!showCancellation || true) && (
                          <motion.span animate={{ 
                            opacity: showCancellation ? 0 : 1, 
                            y: showCancellation ? -50 : 0,
                            color: showCancellation ? 'var(--coral)' : 'white'
                          }} transition={{ duration: 0.8 }}>
                            (x - {a})
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <span>(x + {a})</span>
                   </div>
                   <div>
                     <AnimatePresence>
                        {(!showCancellation || true) && (
                          <motion.span animate={{ 
                            opacity: showCancellation ? 0 : 1, 
                            y: showCancellation ? 50 : 0,
                            color: showCancellation ? 'var(--coral)' : 'white'
                          }} transition={{ duration: 0.8 }}>
                            (x - {a})
                          </motion.span>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
                {showCancellation && (
                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 10, opacity: 1 }} transition={{ delay: 0.8 }} style={{ marginLeft: '10px', color: 'var(--teal)' }}>
                    &rarr; {2*a}
                  </motion.div>
                )}
             </div>
          ) : (
            <div style={{ textAlign: 'center' }}>
               <motion.div animate={{ color: showCancellation ? 'var(--teal)' : 'white' }}>
                  {showCancellation ? '1 / (√x+1 + 1)' : '(√x+1 - 1) / x'}
               </motion.div>
               {showCancellation && <div style={{ fontSize: '1rem', color: 'var(--text3)' }}>x &rarr; 0 yields 1/2</div>}
            </div>
          )}
        </div>

        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '280px' }}>
          {showCancellation ? 'The "Zero Factor" has been cancelled!' : 'Click Solve to see the cancellation animation.'}
        </p>
      </motion.div>
    </motion.div>
  );
};
