import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const VennAddition = ({ pA, pB, pAB }) => {
  const w = 360, h = 240;
  const cx1 = 140, cx2 = 220, cy = 120, r = 75;
  const pAuB = pA + pB - pAB;

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <clipPath id="addClipA"><circle cx={cx1} cy={cy} r={r} /></clipPath>
        <filter id="add-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={8} y={8} width={w - 16} height={h - 16} rx={12} fill="rgba(255,255,255,0.02)" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

      {/* A circle */}
      <circle cx={cx1} cy={cy} r={r} fill="var(--teal)" opacity="0.2" filter="url(#add-glow)" />
      <circle cx={cx1} cy={cy} r={r} fill="none" stroke="var(--teal)" strokeWidth="2.5" />

      {/* B circle */}
      <circle cx={cx2} cy={cy} r={r} fill="var(--coral)" opacity="0.15" />
      <circle cx={cx2} cy={cy} r={r} fill="none" stroke="var(--coral)" strokeWidth="2.5" />

      {/* Intersection highlight */}
      <g clipPath="url(#addClipA)">
        <circle cx={cx2} cy={cy} r={r} fill="var(--gold)" opacity="0.3" />
        <circle cx={cx2} cy={cy} r={r} fill="none" stroke="var(--gold)" strokeWidth="2">
          <animate attributeName="stroke-width" values="1;3;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Labels with probabilities */}
      <text x={cx1 - 30} y={cy - 10} fill="var(--teal)" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
      <text x={cx1 - 30} y={cy + 10} fill="var(--teal)" fontSize="12" textAnchor="middle">{(pA - pAB).toFixed(2)}</text>
      
      <text x={(cx1 + cx2) / 2} y={cy - 10} fill="var(--gold)" fontSize="14" fontWeight="bold" textAnchor="middle">A∩B</text>
      <text x={(cx1 + cx2) / 2} y={cy + 10} fill="var(--gold)" fontSize="12" textAnchor="middle">{pAB.toFixed(2)}</text>

      <text x={cx2 + 30} y={cy - 10} fill="var(--coral)" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>
      <text x={cx2 + 30} y={cy + 10} fill="var(--coral)" fontSize="12" textAnchor="middle">{(pB - pAB).toFixed(2)}</text>

      {/* Union probability bar at bottom */}
      <rect x={30} y={h - 30} width={w - 60} height={12} rx={6} fill="rgba(255,255,255,0.05)" />
      <motion.rect x={30} y={h - 30} height={12} rx={6} fill="var(--teal)" opacity="0.8" animate={{ width: (w - 60) * Math.min(pAuB, 1) }} transition={{ type: 'spring', damping: 15 }} />
      <text x={w / 2} y={h - 20} fill="white" fontSize="10" textAnchor="middle" fontWeight="bold">P(A∪B) = {pAuB.toFixed(3)}</text>
    </svg>
  );
};

export const AdditionTheorem = () => {
  const [pA, setPA] = useState(0.4);
  const [pB, setPB] = useState(0.35);
  const [pAB, setPAB] = useState(0.15);

  const maxAB = Math.min(pA, pB);
  const safeAB = Math.min(pAB, maxAB);
  const pAuB = pA + pB - safeAB;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Addition Theorem</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Adjust P(A), P(B), and P(A∩B). Watch the Venn diagram redistribute probability regions and the union bar animate.
          </p>
        </motion.div>

        <MathSlider label="P(A)" min={0} max={1} step={0.05} value={pA} onChange={setPA} />
        <MathSlider label="P(B)" min={0} max={1} step={0.05} value={pB} onChange={setPB} />
        <MathSlider label="P(A ∩ B)" min={0} max={+maxAB.toFixed(2)} step={0.05} value={safeAB} onChange={setPAB} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>P(A ∪ B)</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.3rem', fontWeight: 'bold' }}>{pAuB.toFixed(3)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>Mutually Exclusive?</div>
            <div style={{ color: safeAB === 0 ? 'var(--teal)' : 'var(--coral)', fontSize: '1.1rem', fontWeight: 'bold' }}>{safeAB === 0 ? '✓ Yes' : '✗ No'}</div>
          </motion.div>
        </div>

        <FormulaCard title="Addition Theorem" formula="P(A ∪ B) = P(A) + P(B) − P(A ∩ B)" description={`= ${pA} + ${pB} − ${safeAB.toFixed(2)} = ${pAuB.toFixed(3)}`} />
        {safeAB === 0 && (
          <FormulaCard title="Mutually Exclusive" formula="P(A ∪ B) = P(A) + P(B)" description="When A ∩ B = ∅" />
        )}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <VennAddition pA={pA} pB={pB} pAB={safeAB} />
      </motion.div>
    </motion.div>
  );
};
