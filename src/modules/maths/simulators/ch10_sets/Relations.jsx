import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const ArrowDiagram = ({ setA, setB, pairs }) => {
  const w = 380, h = 260;
  const leftX = 80, rightX = 300;
  const dotR = 14;

  const spacingA = setA.length > 1 ? (h - 60) / (setA.length - 1) : 0;
  const spacingB = setB.length > 1 ? (h - 60) / (setB.length - 1) : 0;
  const startYA = setA.length > 1 ? 30 : h / 2;
  const startYB = setB.length > 1 ? 30 : h / 2;

  const getYA = (i) => startYA + i * spacingA;
  const getYB = (j) => startYB + j * spacingB;

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <marker id="arrowhead-rel" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--gold)" />
        </marker>
        <filter id="rel-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Set labels */}
      <text x={leftX} y={18} fill="var(--teal)" fontSize="14" fontWeight="bold" textAnchor="middle">A</text>
      <text x={rightX} y={18} fill="var(--coral)" fontSize="14" fontWeight="bold" textAnchor="middle">B</text>

      {/* Ellipses */}
      <ellipse cx={leftX} cy={h / 2} rx={45} ry={h / 2 - 10} fill="rgba(0,196,180,0.08)" stroke="var(--teal)" strokeWidth="1.5" strokeDasharray="4 3" />
      <ellipse cx={rightX} cy={h / 2} rx={45} ry={h / 2 - 10} fill="rgba(247,103,89,0.08)" stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Arrows */}
      {pairs.map(([a, b], idx) => {
        const ai = setA.indexOf(a);
        const bi = setB.indexOf(b);
        if (ai < 0 || bi < 0) return null;
        return (
          <motion.line key={idx} x1={leftX + dotR + 4} y1={getYA(ai)} x2={rightX - dotR - 10} y2={getYB(bi)} stroke="var(--gold)" strokeWidth="2" markerEnd="url(#arrowhead-rel)" opacity="0.7" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.7 }} transition={{ delay: idx * 0.1, duration: 0.4 }}>
            <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="3s" begin={`${idx * 0.2}s`} repeatCount="indefinite" />
          </motion.line>
        );
      })}

      {/* A elements */}
      {setA.map((a, i) => (
        <g key={`a${i}`}>
          <circle cx={leftX} cy={getYA(i)} r={dotR} fill="var(--teal)" opacity="0.3" />
          <text x={leftX} y={getYA(i) + 5} fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">{a}</text>
        </g>
      ))}

      {/* B elements */}
      {setB.map((b, j) => (
        <g key={`b${j}`}>
          <circle cx={rightX} cy={getYB(j)} r={dotR} fill="var(--coral)" opacity="0.3" />
          <text x={rightX} y={getYB(j) + 5} fill="white" fontSize="13" textAnchor="middle" fontWeight="bold">{b}</text>
        </g>
      ))}
    </svg>
  );
};

export const Relations = () => {
  const [inputA, setInputA] = useState('1,2,3');
  const [inputB, setInputB] = useState('a,b,c');
  const [pairInput, setPairInput] = useState('');
  const [pairs, setPairs] = useState([['1', 'a'], ['2', 'b'], ['3', 'c'], ['1', 'b']]);

  const parse = (s) => s.split(',').map(x => x.trim()).filter(Boolean);
  const setA = parse(inputA);
  const setB = parse(inputB);

  const addPair = () => {
    const parts = pairInput.split(',').map(x => x.trim());
    if (parts.length === 2 && parts[0] && parts[1]) {
      setPairs(prev => [...prev, parts]);
      setPairInput('');
    }
  };

  const removePair = (idx) => setPairs(prev => prev.filter((_, i) => i !== idx));

  // Classify relation properties (reflexive, symmetric, transitive) when A=B
  const isSameSet = inputA === inputB;
  const isReflexive = isSameSet && setA.every(a => pairs.some(p => p[0] === a && p[1] === a));
  const isSymmetric = isSameSet && pairs.every(p => pairs.some(q => q[0] === p[1] && q[1] === p[0]));

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Relations</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Define sets A and B, then add ordered pairs. The <span style={{ color: 'var(--gold)' }}>arrows</span> pulse to show the mapping from A to B.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {[{ label: 'Set A', val: inputA, set: setInputA, color: 'var(--teal)' }, { label: 'Set B', val: inputB, set: setInputB, color: 'var(--coral)' }].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '0.8rem', color: s.color, marginBottom: '3px', fontWeight: 600 }}>{s.label}</div>
              <input value={s.val} onChange={e => s.set(e.target.value)} style={{ width: '100%', padding: '8px 10px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <input value={pairInput} onChange={e => setPairInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addPair()} placeholder="Add pair: a,b" style={{ flex: 1, padding: '8px 10px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'white', fontSize: '0.85rem', outline: 'none' }} />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={addPair} style={{ padding: '8px 14px', background: 'var(--gold)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>+</motion.button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', maxHeight: '60px', overflowY: 'auto' }}>
          {pairs.map((p, i) => (
            <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => removePair(i)} style={{ padding: '3px 8px', background: 'rgba(248,196,72,0.15)', color: 'var(--gold)', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>
              ({p[0]},{p[1]}) ×
            </motion.span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Pairs</div>
            <div className="math-font" style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem' }}>{pairs.length}</div>
          </motion.div>
          {isSameSet && (
            <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)' }}>Reflexive? {isReflexive ? '✓' : '✗'} | Symmetric? {isSymmetric ? '✓' : '✗'}</div>
            </motion.div>
          )}
        </div>

        <FormulaCard title="Relation" formula="R ⊆ A × B" description={`R = {${pairs.map(p => `(${p[0]},${p[1]})`).join(', ')}}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ArrowDiagram setA={setA} setB={setB} pairs={pairs} />
      </motion.div>
    </motion.div>
  );
};
