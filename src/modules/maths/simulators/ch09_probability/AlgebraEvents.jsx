import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const OPERATIONS = [
  { key: 'union', label: 'A ∪ B', desc: 'Union', color: 'var(--teal)' },
  { key: 'intersection', label: 'A ∩ B', desc: 'Intersection', color: 'var(--gold)' },
  { key: 'complementA', label: "A'", desc: 'Complement of A', color: 'var(--coral)' },
  { key: 'differenceAB', label: 'A − B', desc: 'Difference', color: '#7c8cf8' },
];

const VennDiagram = ({ op, nA, nB, nAB }) => {
  const w = 360, h = 260;
  const cx1 = 140, cx2 = 220, cy = 130, r = 80;

  const getOpacity = (region) => {
    // region: 'onlyA', 'onlyB', 'both', 'neither'
    if (op === 'union') return region !== 'neither' ? 0.5 : 0.05;
    if (op === 'intersection') return region === 'both' ? 0.5 : 0.05;
    if (op === 'complementA') return region === 'onlyA' || region === 'both' ? 0.05 : 0.5;
    if (op === 'differenceAB') return region === 'onlyA' ? 0.5 : 0.05;
    return 0.15;
  };

  const opColor = OPERATIONS.find(o => o.key === op)?.color || 'white';

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <clipPath id="clipA"><circle cx={cx1} cy={cy} r={r} /></clipPath>
        <clipPath id="clipB"><circle cx={cx2} cy={cy} r={r} /></clipPath>
        <clipPath id="clipNotA">
          <rect x={0} y={0} width={w} height={h} />
        </clipPath>
        <filter id="venn-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Universal set background */}
      <rect x={10} y={10} width={w - 20} height={h - 20} rx={12} fill="rgba(255,255,255,0.02)" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
      <text x={25} y={30} fill="var(--text3)" fontSize="12" fontWeight="600">S</text>

      {/* Neither region (complement highlight) */}
      {op === 'complementA' && (
        <rect x={10} y={10} width={w - 20} height={h - 20} rx={12} fill={opColor} opacity={0.12} />
      )}

      {/* Only A (A − B) */}
      <circle cx={cx1} cy={cy} r={r} fill={opColor} opacity={getOpacity('onlyA')} />
      
      {/* Only B */}
      <circle cx={cx2} cy={cy} r={r} fill={opColor} opacity={getOpacity('onlyB')} />

      {/* Both (intersection) — draw with clip */}
      <g clipPath="url(#clipA)">
        <circle cx={cx2} cy={cy} r={r} fill={opColor} opacity={getOpacity('both')} filter="url(#venn-glow)" />
      </g>

      {/* Circle strokes */}
      <circle cx={cx1} cy={cy} r={r} fill="none" stroke="var(--teal)" strokeWidth="2.5" opacity="0.8" />
      <circle cx={cx2} cy={cy} r={r} fill="none" stroke="var(--coral)" strokeWidth="2.5" opacity="0.8" />

      {/* Animated ring on active region */}
      {op === 'intersection' && (
        <g clipPath="url(#clipA)">
          <circle cx={cx2} cy={cy} r={r} fill="none" stroke={opColor} strokeWidth="2">
            <animate attributeName="stroke-width" values="1;4;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      )}

      {/* Labels */}
      <text x={cx1 - 35} y={cy + 5} fill="var(--teal)" fontSize="18" fontWeight="bold" textAnchor="middle">A</text>
      <text x={cx2 + 35} y={cy + 5} fill="var(--coral)" fontSize="18" fontWeight="bold" textAnchor="middle">B</text>

      {/* Counts */}
      <text x={cx1 - 25} y={cy + 25} fill="var(--text2)" fontSize="13" textAnchor="middle">{nA - nAB}</text>
      <text x={(cx1 + cx2) / 2} y={cy + 25} fill="var(--gold)" fontSize="13" textAnchor="middle" fontWeight="bold">{nAB}</text>
      <text x={cx2 + 25} y={cy + 25} fill="var(--text2)" fontSize="13" textAnchor="middle">{nB - nAB}</text>
    </svg>
  );
};

export const AlgebraEvents = () => {
  const [op, setOp] = useState('union');
  const [nS, setNS] = useState(20);
  const [nA, setNA] = useState(8);
  const [nB, setNB] = useState(10);
  const [nAB, setNAB] = useState(4);

  // Clamp nAB
  const maxAB = Math.min(nA, nB);
  const safeAB = Math.min(nAB, maxAB);

  const results = {
    union: nA + nB - safeAB,
    intersection: safeAB,
    complementA: nS - nA,
    differenceAB: nA - safeAB,
  };

  const formulaMap = {
    union: { f: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B)', d: `= ${nA} + ${nB} − ${safeAB} = ${results.union}` },
    intersection: { f: 'n(A ∩ B)', d: `= ${safeAB}` },
    complementA: { f: "n(A') = n(S) − n(A)", d: `= ${nS} − ${nA} = ${results.complementA}` },
    differenceAB: { f: 'n(A − B) = n(A) − n(A ∩ B)', d: `= ${nA} − ${safeAB} = ${results.differenceAB}` },
  };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Algebra of Events</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Select an operation and watch the Venn diagram highlight the corresponding region. Adjust set sizes interactively.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {OPERATIONS.map(o => (
            <motion.button key={o.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setOp(o.key)} style={{ padding: '10px', background: op === o.key ? o.color : 'var(--bg4)', color: op === o.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s', opacity: op === o.key ? 1 : 0.7 }}>
              <span className="math-font">{o.label}</span> <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({o.desc})</span>
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { label: 'n(S)', value: nS, set: setNS, min: 1, max: 50 },
            { label: 'n(A)', value: nA, set: setNA, min: 0, max: nS },
            { label: 'n(B)', value: nB, set: setNB, min: 0, max: nS },
            { label: 'n(A∩B)', value: safeAB, set: setNAB, min: 0, max: maxAB },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 500 }}>{s.label}</span>
                <span className="math-font" style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>{s.value}</span>
              </div>
              <input type="range" min={s.min} max={s.max} value={s.value} onChange={e => s.set(parseInt(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }} />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={op} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <FormulaCard title={OPERATIONS.find(o => o.key === op)?.desc} formula={formulaMap[op].f} description={formulaMap[op].d} />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <VennDiagram op={op} nA={nA} nB={nB} nAB={safeAB} />
      </motion.div>
    </motion.div>
  );
};
