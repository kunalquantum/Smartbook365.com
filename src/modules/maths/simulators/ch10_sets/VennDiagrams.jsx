import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const VennSVG = ({ setA, setB, universal, op }) => {
  const w = 380, h = 260;
  const cx1 = 150, cx2 = 230, cy = 125, r = 75;

  const onlyA = setA.filter(x => !setB.includes(x));
  const onlyB = setB.filter(x => !setA.includes(x));
  const both = setA.filter(x => setB.includes(x));
  const neither = universal.filter(x => !setA.includes(x) && !setB.includes(x));

  let highlighted = [];
  let hlColor = 'var(--teal)';
  if (op === 'union') { highlighted = [...new Set([...setA, ...setB])]; hlColor = 'var(--teal)'; }
  else if (op === 'intersection') { highlighted = both; hlColor = 'var(--gold)'; }
  else if (op === 'difference') { highlighted = onlyA; hlColor = '#7c8cf8'; }
  else if (op === 'complement') { highlighted = universal.filter(x => !setA.includes(x)); hlColor = 'var(--coral)'; }
  else if (op === 'symmetric') { highlighted = [...onlyA, ...onlyB]; hlColor = 'var(--teal)'; }

  const getRegionOpacity = (region) => {
    if (op === 'union') return region !== 'neither' ? 0.35 : 0.03;
    if (op === 'intersection') return region === 'both' ? 0.4 : 0.05;
    if (op === 'difference') return region === 'onlyA' ? 0.4 : 0.05;
    if (op === 'complement') return (region === 'onlyB' || region === 'neither') ? 0.35 : 0.05;
    if (op === 'symmetric') return (region === 'onlyA' || region === 'onlyB') ? 0.35 : 0.05;
    return 0.15;
  };

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <clipPath id="vdClipA"><circle cx={cx1} cy={cy} r={r} /></clipPath>
        <filter id="vd-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Universal */}
      <rect x={10} y={10} width={w - 20} height={h - 20} rx={12} fill={op === 'complement' ? `${hlColor}15` : 'rgba(255,255,255,0.02)'} stroke="var(--border)" strokeWidth="1" strokeDasharray="4 4" />
      <text x={25} y={30} fill="var(--text3)" fontSize="12" fontWeight="600">U</text>

      {/* Regions */}
      <circle cx={cx1} cy={cy} r={r} fill={hlColor} opacity={getRegionOpacity('onlyA')} filter="url(#vd-glow)" />
      <circle cx={cx2} cy={cy} r={r} fill={hlColor} opacity={getRegionOpacity('onlyB')} />
      <g clipPath="url(#vdClipA)">
        <circle cx={cx2} cy={cy} r={r} fill={hlColor} opacity={getRegionOpacity('both')} filter="url(#vd-glow)" />
      </g>

      {/* Outlines */}
      <circle cx={cx1} cy={cy} r={r} fill="none" stroke="var(--teal)" strokeWidth="2.5" />
      <circle cx={cx2} cy={cy} r={r} fill="none" stroke="var(--coral)" strokeWidth="2.5" />

      {/* Element labels */}
      {onlyA.length > 0 && onlyA.slice(0, 3).map((e, i) => (
        <text key={`a${i}`} x={cx1 - 30 + i * 18} y={cy + 5} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{e}</text>
      ))}
      {both.length > 0 && both.slice(0, 3).map((e, i) => (
        <text key={`ab${i}`} x={(cx1 + cx2) / 2 - 10 + i * 18} y={cy + 5} fill="var(--gold)" fontSize="12" textAnchor="middle" fontWeight="bold">{e}</text>
      ))}
      {onlyB.length > 0 && onlyB.slice(0, 3).map((e, i) => (
        <text key={`b${i}`} x={cx2 + 20 + i * 18} y={cy + 5} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{e}</text>
      ))}
      {op === 'complement' && neither.slice(0, 3).map((e, i) => (
        <text key={`n${i}`} x={30 + i * 20} y={h - 25} fill="var(--coral)" fontSize="11" fontWeight="bold">{e}</text>
      ))}

      <text x={cx1 - 35} y={cy - 55} fill="var(--teal)" fontSize="16" fontWeight="bold">A</text>
      <text x={cx2 + 25} y={cy - 55} fill="var(--coral)" fontSize="16" fontWeight="bold">B</text>

      {/* Result count */}
      <text x={w / 2} y={h - 10} fill={hlColor} fontSize="12" textAnchor="middle" fontWeight="600">
        Result: {`{${highlighted.join(', ')}}`} — {highlighted.length} elements
      </text>
    </svg>
  );
};

const OPS = [
  { key: 'union', label: 'A ∪ B', name: 'Union', color: 'var(--teal)' },
  { key: 'intersection', label: 'A ∩ B', name: 'Intersection', color: 'var(--gold)' },
  { key: 'difference', label: 'A − B', name: 'Difference', color: '#7c8cf8' },
  { key: 'complement', label: "A'", name: 'Complement', color: 'var(--coral)' },
  { key: 'symmetric', label: 'A △ B', name: 'Symmetric Diff', color: 'var(--teal)' },
];

export const VennDiagrams = () => {
  const [op, setOp] = useState('union');
  const [inputA, setInputA] = useState('1,2,3,4');
  const [inputB, setInputB] = useState('3,4,5,6');
  const [inputU, setInputU] = useState('1,2,3,4,5,6,7,8');

  const parse = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
  const setA = parse(inputA);
  const setB = parse(inputB);
  const universal = parse(inputU);

  const opInfo = OPS.find(o => o.key === op);
  let result = [];
  if (op === 'union') result = [...new Set([...setA, ...setB])];
  else if (op === 'intersection') result = setA.filter(x => setB.includes(x));
  else if (op === 'difference') result = setA.filter(x => !setB.includes(x));
  else if (op === 'complement') result = universal.filter(x => !setA.includes(x));
  else if (op === 'symmetric') result = [...setA.filter(x => !setB.includes(x)), ...setB.filter(x => !setA.includes(x))];

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Venn Diagrams</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Type comma-separated elements for A, B, and U. Choose an operation to see the highlighted result region.
          </p>
        </motion.div>

        {[{ label: 'U (Universal)', val: inputU, set: setInputU, color: 'var(--text3)' }, { label: 'Set A', val: inputA, set: setInputA, color: 'var(--teal)' }, { label: 'Set B', val: inputB, set: setInputB, color: 'var(--coral)' }].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '0.8rem', color: s.color, marginBottom: '4px', fontWeight: 600 }}>{s.label}</div>
            <input value={s.val} onChange={e => s.set(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
          {OPS.map(o => (
            <motion.button key={o.key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOp(o.key)} style={{ padding: '8px 4px', background: op === o.key ? o.color : 'var(--bg4)', color: op === o.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', transition: 'all 0.3s' }}>
              <span className="math-font">{o.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', borderLeft: `4px solid ${opInfo.color}` }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>{opInfo.name}</div>
          <div className="math-font" style={{ color: opInfo.color, fontSize: '1rem' }}>{`{${result.join(', ')}}`}</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <VennSVG setA={setA} setB={setB} universal={universal} op={op} />
      </motion.div>
    </motion.div>
  );
};
