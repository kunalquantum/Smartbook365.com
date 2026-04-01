import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const CombinationProperties = () => {
  const [n, setN] = useState(6);
  const [r, setR] = useState(2);

  const factorial = (num) => {
    if (num <= 1) return 1;
    let res = 1; // Changed from 1n to 1
    for (let i = 2; i <= num; i++) res *= i; // Changed from BigInt(i) to i
    return res;
  };

  const nCrVal = (nn, rr) => {
    if (rr < 0 || rr > nn) return 0; // Changed from 0n to 0
    const res = factorial(nn) / (factorial(rr) * factorial(nn - rr));
    return res;
  };

  const currentNCR = nCrVal(n, r);
  const complementaryNCR = nCrVal(n, n - r);
  const nPlusOneCr = nCrVal(n + 1, r);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Properties of Combinations</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Discover identities like <strong>nCr = nC(n-r)</strong> and <strong>Pascal's Rule</strong>.
          </p>
        </motion.div>

        <MathSlider label="n" min={1} max={10} step={1} value={n} onChange={setN} />
        <MathSlider label="r" min={0} max={n} step={1} value={r} onChange={setR} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          <motion.div layout style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>Symmetry Property: nCr = nC(n-r)</div>
            <div className="math-font" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              {n}C{r} = {n}C{n - r} = <span style={{ color: 'var(--teal)' }}>{currentNCR.toString()}</span>
            </div>
          </motion.div>

          <motion.div layout style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>Pascal's Identity: nCr + nC(r-1)</div>
            <div className="math-font" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {currentNCR} + {r > 0 ? nCrVal(n, r - 1) : 0} = <span style={{ color: 'var(--gold)' }}>{nCrVal(n + 1, r)}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>which is (n+1)Cr = {n + 1}C{r}</div>
            </div>
          </motion.div>
        </div>

        <FormulaCard title="Important Properties" formula="nCr = n! / [r!(n−r)!]" description="nC0 = 1, nCn = 1, nC1 = n" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
        {/* Pascal's Triangle Section */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px' }}>
              {Array.from({ length: i + 1 }).map((_, j) => {
                const val = Number(nCrVal(i, j));
                const isActive = i === n && j === r;
                const isNPlusOne = i === n + 1 && j === r;
                const isPascalPair = i === n && (j === r || j === r - 1);
                
                return (
                  <motion.div
                    key={j}
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      backgroundColor: isActive ? 'var(--teal)' : isNPlusOne ? 'var(--gold)' : isPascalPair ? 'rgba(248,196,72,0.3)' : 'var(--bg4)',
                      borderColor: isActive || isNPlusOne ? 'white' : 'var(--border)'
                    }}
                    style={{ width: i < 5 ? '32px' : '28px', height: i < 5 ? '32px' : '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '1px solid', fontSize: i < 6 ? '0.8rem' : '0.65rem', color: isActive || isNPlusOne ? 'white' : 'var(--text2)', transition: 'all 0.3s' }}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text3)' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--teal)', borderRadius: '50%' }} /> Active nCr
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', color: 'var(--text3)' }}>
            <div style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} /> Pascal Result
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
