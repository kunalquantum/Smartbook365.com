import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const InductionPrinciple = () => {
  const [isPushed, setIsPushed] = useState(false);
  const [chainBroken, setChainBroken] = useState(false);
  const [dominoCount, setDominoCount] = useState(10);
  
  const reset = () => {
    setIsPushed(false);
  };

  const togglePush = () => {
    setIsPushed(true);
  };

  useEffect(() => {
    reset();
  }, [chainBroken, dominoCount]);

  const w = 400, h = 200;
  
  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>The Principle of Mathematical Induction</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Imagine a row of dominoes. To knock them all down:
            1. Knock the <strong>first</strong> one (Base Case).
            2. Ensure that if one falls, the <strong>next</strong> one falls (Inductive Step).
          </p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePush} disabled={isPushed} style={{ flex: 1, padding: '12px', background: isPushed ? 'var(--bg4)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isPushed ? 'Falling...' : '👉 Push First Domino (P(1))'}
          </motion.button>
          
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setChainBroken(!chainBroken)} style={{ padding: '12px', background: 'var(--bg4)', color: chainBroken ? 'var(--coral)' : 'var(--text2)', border: chainBroken ? '1px solid var(--coral)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer' }}>
            {chainBroken ? '🔗 Fix Chain' : '✂️ Break Chain (P(k) ↛ P(k+1))'}
          </motion.button>

          <button onClick={reset} style={{ padding: '12px', background: 'var(--bg4)', color: 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>🔄 Reset</button>
        </div>

        <div style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--teal)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
            <strong>Logic:</strong> {isPushed ? (chainBroken ? 'Chain broke! Not all statements are true.' : 'Success! All statements are true for all n.') : 'Ready to start the proof...'}
          </div>
        </div>

        <FormulaCard title="The Two Steps" formula="P(1) \text{ is true} \\ P(k) \Rightarrow P(k+1)" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px', minHeight: '200px' }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
          {Array.from({ length: dominoCount }).map((_, i) => {
            const x = 40 + i * 35;
            const y = h - 60;
            const isBrokenGap = chainBroken && i === 4;
            const willFall = isPushed && (!chainBroken || i <= 4);
            
            return (
              <motion.g key={i}>
                <motion.rect
                  initial={{ rotate: 0 }}
                  animate={{ 
                    rotate: willFall ? 75 : 0,
                    x: isBrokenGap ? x + 10 : x
                  }}
                  transition={{ 
                    delay: willFall ? i * 0.15 : 0, 
                    type: 'spring', 
                    stiffness: 50 
                  }}
                  width="10"
                  height="50"
                  fill={isBrokenGap ? 'var(--coral)' : (i === 0 ? 'var(--teal)' : 'var(--bg4)')}
                  stroke={i === 0 ? 'var(--teal)' : 'var(--border)'}
                  rx="2"
                  y={y}
                />
                <text x={isBrokenGap ? x+15 : x+5} y={y + 65} fontSize="8" fill="var(--text3)" textAnchor="middle">P({i+1})</text>
                {isBrokenGap && (
                   <text x={x + 3} y={y + 25} fontSize="12" fill="var(--coral)" textAnchor="middle" fontWeight="bold">!</text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </motion.div>
    </motion.div>
  );
};
