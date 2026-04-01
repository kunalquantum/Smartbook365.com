import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const OPS = [
  { key: 'union', label: 'A ∪ B', formula: 'A ∪ B = {x : x ∈ A or x ∈ B}' },
  { key: 'intersection', label: 'A ∩ B', formula: 'A ∩ B = {x : x ∈ A and x ∈ B}' },
  { key: 'difference', label: 'A − B', formula: 'A − B = {x : x ∈ A and x ∉ B}' },
  { key: 'complement', label: "A'", formula: "A' = {x ∈ U : x ∉ A}" },
  { key: 'cartesian', label: 'A × B', formula: 'A × B = {(a,b) : a ∈ A, b ∈ B}' },
];

const CartesianGrid = ({ setA, setB }) => {
  if (!setA.length || !setB.length) return null;
  const cellW = Math.min(40, 240 / Math.max(setA.length, 1));
  const cellH = Math.min(40, 180 / Math.max(setB.length, 1));
  const w = setA.length * cellW + 60;
  const h = setB.length * cellH + 50;

  return (
    <svg width={Math.max(w, 200)} height={Math.max(h, 150)} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '8px' }}>
      {/* Column headers (A) */}
      {setA.map((a, i) => (
        <text key={`ha${i}`} x={55 + i * cellW + cellW / 2} y={20} fill="var(--teal)" fontSize="12" textAnchor="middle" fontWeight="bold">{a}</text>
      ))}
      {/* Row headers (B) */}
      {setB.map((b, j) => (
        <text key={`hb${j}`} x={30} y={45 + j * cellH + cellH / 2} fill="var(--coral)" fontSize="12" textAnchor="middle" fontWeight="bold">{b}</text>
      ))}
      {/* Cells */}
      {setA.map((a, i) => (
        setB.map((b, j) => (
          <g key={`${i}-${j}`}>
            <motion.rect
              x={55 + i * cellW} y={30 + j * cellH} width={cellW - 2} height={cellH - 2} rx={4}
              fill="rgba(124,140,248,0.15)" stroke="#7c8cf8" strokeWidth="1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i + j) * 0.04, type: 'spring', damping: 12 }}
            />
            <text x={55 + i * cellW + cellW / 2 - 1} y={30 + j * cellH + cellH / 2 + 4} fill="white" fontSize={Math.min(10, cellW / 3.5)} textAnchor="middle">({a},{b})</text>
          </g>
        ))
      ))}
    </svg>
  );
};

export const SetOperations = () => {
  const [op, setOp] = useState('union');
  const [inputA, setInputA] = useState('1,2,3');
  const [inputB, setInputB] = useState('2,3,4,5');
  const [inputU, setInputU] = useState('1,2,3,4,5,6');

  const parse = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
  const setA = parse(inputA);
  const setB = parse(inputB);
  const universal = parse(inputU);

  let result = [];
  if (op === 'union') result = [...new Set([...setA, ...setB])];
  else if (op === 'intersection') result = setA.filter(x => setB.includes(x));
  else if (op === 'difference') result = setA.filter(x => !setB.includes(x));
  else if (op === 'complement') result = universal.filter(x => !setA.includes(x));
  else if (op === 'cartesian') result = setA.flatMap(a => setB.map(b => `(${a},${b})`));

  const opInfo = OPS.find(o => o.key === op);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Operations on Sets</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Perform set operations including <strong>Cartesian Product</strong>. See the result set update live.
          </p>
        </motion.div>

        {[{ label: 'Set A', val: inputA, set: setInputA, color: 'var(--teal)' }, { label: 'Set B', val: inputB, set: setInputB, color: 'var(--coral)' }, { label: 'U (Universal)', val: inputU, set: setInputU, color: 'var(--text3)' }].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '0.8rem', color: s.color, marginBottom: '4px', fontWeight: 600 }}>{s.label}</div>
            <input value={s.val} onChange={e => s.set(e.target.value)} style={{ width: '100%', padding: '9px 12px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          </div>
        ))}

        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {OPS.map(o => (
            <motion.button key={o.key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOp(o.key)} style={{ padding: '8px 12px', background: op === o.key ? '#7c8cf8' : 'var(--bg4)', color: op === o.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s' }}>
              <span className="math-font">{o.label}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={op} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <FormulaCard title={opInfo.label} formula={opInfo.formula} description={`= {${result.join(', ')}} — ${result.length} element${result.length !== 1 ? 's' : ''}`} />
          </motion.div>
        </AnimatePresence>

        {op === 'cartesian' && (
          <div style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <span className="math-font" style={{ color: 'var(--gold)', fontSize: '0.9rem' }}>|A × B| = {setA.length} × {setB.length} = {setA.length * setB.length}</span>
          </div>
        )}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {op === 'cartesian' ? (
          <CartesianGrid setA={setA} setB={setB} />
        ) : (
          <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '24px', minWidth: 280, textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '1px' }}>Result Elements</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
              <AnimatePresence>
                {result.map((e, i) => (
                  <motion.span key={e} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ delay: i * 0.03, type: 'spring', damping: 12 }} style={{ padding: '8px 14px', background: 'rgba(124,140,248,0.2)', color: 'white', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
                    {e}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
            {result.length === 0 && <div style={{ color: 'var(--text3)', marginTop: '16px' }}>∅ (empty set)</div>}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
