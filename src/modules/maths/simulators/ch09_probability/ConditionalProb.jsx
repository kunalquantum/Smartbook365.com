import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const ConditionalVenn = ({ pA, pB, pAB }) => {
  const w = 360, h = 260;
  const cx1 = 140, cx2 = 220, cy = 125, r = 75;
  const pAgivenB = pB > 0 ? pAB / pB : 0;

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <clipPath id="condClipA"><circle cx={cx1} cy={cy} r={r} /></clipPath>
        <clipPath id="condClipB"><circle cx={cx2} cy={cy} r={r} /></clipPath>
        <filter id="cond-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={8} y={8} width={w - 16} height={h - 16} rx={12} fill="rgba(255,255,255,0.02)" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />

      {/* A circle (faded) */}
      <circle cx={cx1} cy={cy} r={r} fill="var(--teal)" opacity="0.08" />
      <circle cx={cx1} cy={cy} r={r} fill="none" stroke="var(--teal)" strokeWidth="2" opacity="0.4" />

      {/* B circle (the "given" - highlighted) */}
      <circle cx={cx2} cy={cy} r={r} fill="var(--coral)" opacity="0.2" filter="url(#cond-glow)" />
      <circle cx={cx2} cy={cy} r={r} fill="none" stroke="var(--coral)" strokeWidth="3">
        <animate attributeName="stroke-width" values="2;4;2" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Intersection (the target) */}
      <g clipPath="url(#condClipB)">
        <circle cx={cx1} cy={cy} r={r} fill="var(--gold)" opacity="0.4" filter="url(#cond-glow)" />
      </g>

      {/* Labels */}
      <text x={cx1 - 35} y={cy} fill="var(--teal)" fontSize="15" fontWeight="bold" textAnchor="middle" opacity="0.6">A</text>
      <text x={cx2 + 35} y={cy - 10} fill="var(--coral)" fontSize="15" fontWeight="bold" textAnchor="middle">B</text>
      <text x={cx2 + 35} y={cy + 8} fill="var(--coral)" fontSize="11" textAnchor="middle">(Given)</text>

      <text x={(cx1 + cx2) / 2} y={cy - 12} fill="var(--gold)" fontSize="12" fontWeight="bold" textAnchor="middle">A∩B</text>
      <text x={(cx1 + cx2) / 2} y={cy + 8} fill="var(--gold)" fontSize="18" textAnchor="middle" fontWeight="bold">{pAB.toFixed(2)}</text>

      {/* Arrow showing "shrinking" sample space to B */}
      <text x={w / 2} y={h - 20} fill="white" fontSize="11" textAnchor="middle" fontWeight="600">
        New sample space = B → P(A|B) = {pAgivenB.toFixed(3)}
      </text>

      {/* Probability bar */}
      <rect x={30} y={h - 40} width={w - 60} height={8} rx={4} fill="rgba(255,255,255,0.05)" />
      <motion.rect x={30} y={h - 40} height={8} rx={4} fill="var(--gold)" animate={{ width: (w - 60) * Math.min(pAgivenB, 1) }} transition={{ type: 'spring', damping: 15 }} />
    </svg>
  );
};

export const ConditionalProb = () => {
  const [pA, setPA] = useState(0.5);
  const [pB, setPB] = useState(0.4);
  const [pAB, setPAB] = useState(0.2);

  const maxAB = Math.min(pA, pB);
  const safeAB = Math.min(pAB, maxAB);
  const pAgivenB = pB > 0 ? safeAB / pB : 0;
  const pBgivenA = pA > 0 ? safeAB / pA : 0;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Conditional Probability</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            <strong>P(A|B)</strong> = probability of A <em>given</em> B has occurred. The <span style={{ color: 'var(--coral)' }}>red circle B</span> pulses as the new sample space.
          </p>
        </motion.div>

        <MathSlider label="P(A)" min={0} max={1} step={0.05} value={pA} onChange={setPA} />
        <MathSlider label="P(B)" min={0.05} max={1} step={0.05} value={pB} onChange={setPB} />
        <MathSlider label="P(A ∩ B)" min={0} max={+maxAB.toFixed(2)} step={0.05} value={safeAB} onChange={setPAB} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '10px', textAlign: 'center', borderLeft: '4px solid var(--gold)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>P(A | B)</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontSize: '1.4rem', fontWeight: 'bold' }}>{pAgivenB.toFixed(3)}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '10px', textAlign: 'center', borderLeft: '4px solid var(--teal)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>P(B | A)</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.4rem', fontWeight: 'bold' }}>{pBgivenA.toFixed(3)}</div>
          </motion.div>
        </div>

        <motion.div style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Independent? </span>
          <span style={{ fontWeight: 'bold', color: Math.abs(pAB - pA * pB) < 0.01 ? 'var(--teal)' : 'var(--coral)' }}>
            {Math.abs(pAB - pA * pB) < 0.01 ? '✓ Yes (P(A∩B) = P(A)·P(B))' : '✗ No'}
          </span>
        </motion.div>

        <FormulaCard title="Conditional Probability" formula="P(A|B) = P(A ∩ B) / P(B)" description={`= ${safeAB.toFixed(2)} / ${pB.toFixed(2)} = ${pAgivenB.toFixed(3)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ConditionalVenn pA={pA} pB={pB} pAB={safeAB} />
      </motion.div>
    </motion.div>
  );
};
