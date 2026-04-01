import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const TreeDiagram = ({ pA, pBgivenA, pBgivenAc }) => {
  const w = 380, h = 300;
  const pAc = 1 - pA;
  const pAandB = pA * pBgivenA;
  const pAandBc = pA * (1 - pBgivenA);
  const pAcandB = pAc * pBgivenAc;
  const pAcandBc = pAc * (1 - pBgivenAc);

  const root = { x: 40, y: h / 2 };
  const midA = { x: 170, y: 90 };
  const midAc = { x: 170, y: 210 };

  const leaves = [
    { x: 320, y: 40, label: 'A ∩ B', p: pAandB, color: 'var(--teal)' },
    { x: 320, y: 120, label: "A ∩ B'", p: pAandBc, color: 'var(--text3)' },
    { x: 320, y: 190, label: "A' ∩ B", p: pAcandB, color: 'var(--coral)' },
    { x: 320, y: 260, label: "A' ∩ B'", p: pAcandBc, color: 'var(--text3)' },
  ];

  const maxP = Math.max(pAandB, pAandBc, pAcandB, pAcandBc, 0.01);

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <filter id="tree-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Root to mid branches */}
      <line x1={root.x} y1={root.y} x2={midA.x} y2={midA.y} stroke="var(--teal)" strokeWidth="2.5" opacity="0.7" />
      <line x1={root.x} y1={root.y} x2={midAc.x} y2={midAc.y} stroke="var(--coral)" strokeWidth="2.5" opacity="0.7" />

      {/* Branch labels */}
      <text x={95} y={midA.y + 15} fill="var(--teal)" fontSize="11" fontWeight="600">P(A)={pA.toFixed(2)}</text>
      <text x={95} y={midAc.y - 5} fill="var(--coral)" fontSize="11" fontWeight="600">P(A')={pAc.toFixed(2)}</text>

      {/* Mid to leaves */}
      <line x1={midA.x} y1={midA.y} x2={leaves[0].x} y2={leaves[0].y} stroke="var(--teal)" strokeWidth="2" opacity="0.6" />
      <line x1={midA.x} y1={midA.y} x2={leaves[1].x} y2={leaves[1].y} stroke="var(--text3)" strokeWidth="1.5" opacity="0.4" />
      <line x1={midAc.x} y1={midAc.y} x2={leaves[2].x} y2={leaves[2].y} stroke="var(--coral)" strokeWidth="2" opacity="0.6" />
      <line x1={midAc.x} y1={midAc.y} x2={leaves[3].x} y2={leaves[3].y} stroke="var(--text3)" strokeWidth="1.5" opacity="0.4" />

      {/* Conditional labels */}
      <text x={240} y={55} fill="var(--gold)" fontSize="9" fontWeight="500">P(B|A)={pBgivenA.toFixed(2)}</text>
      <text x={240} y={115} fill="var(--text3)" fontSize="9" fontWeight="500">P(B'|A)={(1 - pBgivenA).toFixed(2)}</text>
      <text x={240} y={195} fill="var(--gold)" fontSize="9" fontWeight="500">P(B|A')={pBgivenAc.toFixed(2)}</text>
      <text x={240} y={255} fill="var(--text3)" fontSize="9" fontWeight="500">P(B'|A')={(1 - pBgivenAc).toFixed(2)}</text>

      {/* Root node */}
      <circle cx={root.x} cy={root.y} r={8} fill="white" />
      <circle cx={root.x} cy={root.y} r={8} fill="none" stroke="white" strokeWidth="1.5">
        <animate attributeName="r" from="8" to="14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Mid nodes */}
      <circle cx={midA.x} cy={midA.y} r={6} fill="var(--teal)" />
      <circle cx={midAc.x} cy={midAc.y} r={6} fill="var(--coral)" />

      {/* Leaf nodes with proportional size */}
      {leaves.map((l, i) => (
        <g key={i}>
          <motion.circle cx={l.x} cy={l.y} r={Math.max(6, (l.p / maxP) * 14)} fill={l.color} opacity="0.8" filter="url(#tree-glow)" animate={{ r: Math.max(6, (l.p / maxP) * 14) }} transition={{ type: 'spring', damping: 12 }} />
          <text x={l.x + 18} y={l.y - 6} fill={l.color} fontSize="10" fontWeight="bold">{l.label}</text>
          <text x={l.x + 18} y={l.y + 8} fill="white" fontSize="11" fontWeight="bold">{l.p.toFixed(3)}</text>
        </g>
      ))}
    </svg>
  );
};

export const MultiplicationThm = () => {
  const [pA, setPA] = useState(0.6);
  const [pBgivenA, setPBgA] = useState(0.7);
  const [pBgivenAc, setPBgAc] = useState(0.3);

  const pAc = 1 - pA;
  const pAandB = pA * pBgivenA;
  const pAcandB = pAc * pBgivenAc;
  const pB = pAandB + pAcandB;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Multiplication Theorem</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The probability tree shows how joint probabilities are computed by <strong>multiplying along branches</strong>. Leaf node sizes are proportional to probability.
          </p>
        </motion.div>

        <MathSlider label="P(A)" min={0.05} max={0.95} step={0.05} value={pA} onChange={setPA} />
        <MathSlider label="P(B | A)" min={0} max={1} step={0.05} value={pBgivenA} onChange={setPBgA} />
        <MathSlider label="P(B | A')" min={0} max={1} step={0.05} value={pBgivenAc} onChange={setPBgAc} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'P(A ∩ B)', value: pAandB.toFixed(3), color: 'var(--teal)' },
            { label: "P(A' ∩ B)", value: pAcandB.toFixed(3), color: 'var(--coral)' },
            { label: 'P(B)', value: pB.toFixed(3), color: 'var(--gold)' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
              <div className="math-font" style={{ color: s.color, fontSize: '1.05rem', fontWeight: 'bold' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <FormulaCard title="Multiplication Theorem" formula="P(A ∩ B) = P(A) · P(B|A)" description={`= ${pA.toFixed(2)} × ${pBgivenA.toFixed(2)} = ${pAandB.toFixed(3)}`} />
        <FormulaCard title="Total Probability" formula="P(B) = P(A)·P(B|A) + P(A')·P(B|A')" description={`= ${pAandB.toFixed(3)} + ${pAcandB.toFixed(3)} = ${pB.toFixed(3)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TreeDiagram pA={pA} pBgivenA={pBgivenA} pBgivenAc={pBgivenAc} />
      </motion.div>
    </motion.div>
  );
};
