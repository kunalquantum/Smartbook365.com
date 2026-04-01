import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const FactorialNotation = () => {
  const [n, setN] = useState(5);

  const factorial = (num) => {
    if (num === 0) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const val = factorial(n);
  const sequence = Array.from({ length: n }, (_, i) => n - i);

  const [shuffled, setShuffled] = useState(Array.from({ length: Math.min(n, 5) }, (_, i) => i));

  const shuffle = () => {
    const arr = [...shuffled];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  };

  // Sync shuffled array size with n
  useEffect(() => {
    setShuffled(Array.from({ length: Math.min(n, 6) }, (_, i) => i));
  }, [n]);

  const emojis = ['🍎', '🍌', '🍇', '🍒', '🥝', '🫐'];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Factorial Notation</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The factorial of <strong>n</strong> is the product of all positive integers up to <em>n</em>. It represents the number of ways to <strong>arrange</strong> <em>n</em> distinct objects.
          </p>
        </motion.div>

        <MathSlider label="Number n" min={1} max={10} step={1} value={n} onChange={setN} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid var(--gold)' }}>
          <div className="math-font" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold)' }}>
            {n}! = {val.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '8px', wordBreak: 'break-all' }}>
            {Array.from({ length: n }, (_, i) => n - i).join(' × ')}
          </div>
        </motion.div>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={shuffle} style={{ padding: '12px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          🎲 Shuffle Arrangement
        </motion.button>

        <FormulaCard title="Definition" formula="n! = n \times (n-1) \times ... \times 1" />
      </div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--text3)', fontSize: '0.85rem' }}>Visualizing one of {val.toLocaleString()} arrangements:</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <AnimatePresence mode="popLayout">
            {shuffled.map((id) => (
              <motion.div key={id} layout initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} style={{ width: '50px', height: '50px', background: 'var(--bg4)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: '1px solid var(--gold)' }}>
                {emojis[id % emojis.length]}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <span style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '10px' }}>Visualizing {val} possible arrangements</span>
      </motion.div>
    </motion.div>
  );
};
