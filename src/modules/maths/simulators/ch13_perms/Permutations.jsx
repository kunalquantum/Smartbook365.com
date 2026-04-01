import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const Permutations = () => {
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [slots, setSlots] = useState([]);
  
  const factorial = (num) => {
    if (num <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const nPr = factorial(n) / factorial(n - r);
  const emojis = ['🍎', '🍌', '🍇', '🍒', '🥝', '🫐', '🍑', '🍊'];

  const toggleItem = (idx) => {
    if (slots.includes(idx)) {
      setSlots(slots.filter(s => s !== idx));
    } else if (slots.length < r) {
      setSlots([...slots, idx]);
    }
  };

  useEffect(() => {
    setSlots([]);
    if (r > n) setR(n);
  }, [n, r]);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Permutations (nPr)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Arranging <strong>r</strong> objects out of <strong>n</strong>. <strong>Order matters!</strong> Click items below to fill the slots.
          </p>
        </motion.div>

        <MathSlider label="Total items (n)" min={1} max={8} step={1} value={n} onChange={setN} />
        <MathSlider label="Items to arrange (r)" min={1} max={n} step={1} value={r} onChange={setR} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', textAlign: 'center', borderLeft: '4px solid var(--teal)' }}>
          <div className="math-font" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            {n}P{r} = {nPr} ways
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
            Filled {slots.length} / {r} slots
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', background: 'var(--bg2)', borderRadius: '12px' }}>
          {Array.from({ length: n }).map((_, i) => (
            <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleItem(i)} style={{ width: '45px', height: '45px', background: slots.includes(i) ? 'var(--teal)' : 'var(--bg4)', border: slots.includes(i) ? '2px solid white' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {emojis[i]}
            </motion.button>
          ))}
        </div>

        <FormulaCard title="Formula" formula="nPr = \frac{n!}{(n-r)!}" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '25px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          {Array.from({ length: r }).map((_, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <motion.div animate={{ borderColor: slots[i] !== undefined ? 'var(--teal)' : 'var(--border)', scale: slots[i] !== undefined ? 1.05 : 1 }} style={{ width: '60px', height: '60px', background: 'var(--bg4)', borderRadius: '12px', border: '3px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                <AnimatePresence mode="wait">
                  {slots[i] !== undefined && (
                    <motion.span key={slots[i]} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                      {emojis[slots[i]]}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text3)' }}>Slot {i + 1}</span>
            </div>
          ))}
        </div>
        
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '280px' }}>
          Notice how picking item A then B is different from B then A. Both are unique permutations.
        </p>
        
        {slots.length === r && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '0.9rem' }}>
            ✅ Arrangement Sample Complete!
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
