import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const Combinations = () => {
  const [n, setN] = useState(6);
  const [r, setR] = useState(3);
  const [selectedItems, setSelectedItems] = useState([]);
  const [groupsFound, setGroupsFound] = useState([]); // Array of sorted indices strings

  const factorial = (num) => {
    if (num <= 1) return 1;
    let res = 1;
    for (let i = 2; i <= num; i++) res *= i;
    return res;
  };

  const nCr = factorial(n) / (factorial(r) * factorial(n - r));
  const emojis = ['🍇', '🥝', '🫐', '🍒', '🍑', '🍊', '🍋', '🍏'];

  const toggleItem = (idx) => {
    if (selectedItems.includes(idx)) {
      setSelectedItems(selectedItems.filter(s => s !== idx));
    } else if (selectedItems.length < r) {
      const next = [...selectedItems, idx];
      setSelectedItems(next);
      if (next.length === r) {
        const key = [...next].sort((a,b) => a-b).join('-');
        if (!groupsFound.includes(key)) {
            setGroupsFound([key, ...groupsFound].slice(0, 5)); // Keep last 5
        }
      }
    }
  };

  useEffect(() => {
    setSelectedItems([]);
    setGroupsFound([]);
    if (r > n) setR(n);
  }, [n, r]);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Combinations (nCr)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Selecting <strong>r</strong> objects out of <strong>n</strong>. <strong>Order DOES NOT matter!</strong> Try picking identical items in different orders.
          </p>
        </motion.div>

        <MathSlider label="Pool size (n)" min={1} max={8} step={1} value={n} onChange={setN} />
        <MathSlider label="Selection size (r)" min={1} max={n} step={1} value={r} onChange={setR} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', textAlign: 'center', borderLeft: '4px solid var(--coral)' }}>
          <div className="math-font" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            {n}C{r} = {nCr} groups
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
            Groups Found: {groupsFound.length} / {nCr}
          </div>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', background: 'var(--bg2)', borderRadius: '12px' }}>
          {Array.from({ length: n }).map((_, i) => (
            <motion.button key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleItem(i)} style={{ width: '45px', height: '45px', background: selectedItems.includes(i) ? 'var(--coral)' : 'var(--bg4)', border: selectedItems.includes(i) ? '2px solid white' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {emojis[i]}
            </motion.button>
          ))}
        </div>

        <FormulaCard title="Combination Formula" formula="nCr = \frac{n!}{r!(n-r)!}" />
      </div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text3)' }}>Current Selection:</div>
        <div style={{ display: 'flex', gap: '10px', minHeight: '60px' }}>
          {selectedItems.map((idx, i) => (
            <motion.div key={idx} layout initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '50px', height: '50px', background: 'var(--bg4)', borderRadius: '50%', border: '2px solid var(--coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
              {emojis[idx]}
            </motion.div>
          ))}
          {Array.from({ length: r - selectedItems.length }).map((_, i) => (
             <div key={`empty-${i}`} style={{ width: '50px', height: '50px', background: 'var(--bg3)', borderRadius: '50%', border: '1px dashed var(--border)' }} />
          ))}
        </div>

        <div style={{ width: '100%', height: '1px', background: 'var(--border)' }} />

        <div style={{ alignSelf: 'stretch' }}>
           <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '10px' }}>Last Unique Groups Found:</div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
             {groupsFound.map((key, i) => (
               <motion.div key={key} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ background: 'var(--bg4)', padding: '8px 12px', borderRadius: '8px', fontSize: '1.2rem', display: 'flex', gap: '8px', borderLeft: '3px solid var(--coral)' }}>
                 {key.split('-').map(idx => emojis[parseInt(idx)])}
               </motion.div>
             ))}
             {groupsFound.length === 0 && <span style={{ color: 'var(--text3)', fontSize: '0.8rem', fontStyle: 'italic' }}>Pick {r} items to form a group.</span>}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
