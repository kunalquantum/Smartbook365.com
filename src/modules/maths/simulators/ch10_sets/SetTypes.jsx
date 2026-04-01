import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

const SET_TYPES = [
  { key: 'empty', label: 'Empty Set', symbol: '∅', elements: [], desc: 'Contains no elements. Cardinality = 0.', color: 'var(--text3)' },
  { key: 'singleton', label: 'Singleton', symbol: '{a}', elements: ['a'], desc: 'Contains exactly one element.', color: 'var(--teal)' },
  { key: 'finite', label: 'Finite Set', symbol: '{1,2,3,4,5}', elements: ['1', '2', '3', '4', '5'], desc: 'Has a countable, limited number of elements.', color: 'var(--gold)' },
  { key: 'infinite', label: 'Infinite Set', symbol: 'ℕ = {1,2,3,…}', elements: ['1', '2', '3', '4', '5', '…', '∞'], desc: 'Elements cannot be exhaustively listed.', color: 'var(--coral)' },
  { key: 'equal', label: 'Equal Sets', symbol: 'A = B', elements: ['1', '2', '3'], desc: 'Two sets with identical elements: A = {1,2,3}, B = {1,2,3}.', color: '#7c8cf8' },
  { key: 'subset', label: 'Subset', symbol: 'A ⊆ B', elements: ['1', '2'], desc: 'Every element of A is also in B. A = {1,2}, B = {1,2,3,4}.', color: 'var(--teal)' },
  { key: 'power', label: 'Power Set', symbol: 'P(A)', elements: ['∅', '{a}', '{b}', '{a,b}'], desc: 'Set of all subsets. |P(A)| = 2ⁿ.', color: 'var(--gold)' },
  { key: 'universal', label: 'Universal Set', symbol: 'U', elements: ['All'], desc: 'Contains all elements under consideration.', color: 'var(--coral)' },
];

const SetVisual = ({ type }) => {
  const w = 360, h = 220;
  const info = SET_TYPES.find(t => t.key === type);
  if (!info) return null;

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <filter id="set-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Universal set box for subset/universal */}
      {(type === 'subset' || type === 'universal') && (
        <rect x={20} y={15} width={w - 40} height={h - 30} rx={12} fill="rgba(247,103,89,0.06)" stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="6 4" />
      )}
      {type === 'subset' && (
        <>
          <text x={w - 35} y={35} fill="var(--coral)" fontSize="14" fontWeight="bold">B</text>
          <circle cx={w / 2 - 20} cy={h / 2} r={55} fill="rgba(0,196,180,0.12)" stroke="var(--teal)" strokeWidth="2" filter="url(#set-glow)" />
          <text x={w / 2 - 20} y={h / 2 - 35} fill="var(--teal)" fontSize="13" textAnchor="middle" fontWeight="bold">A ⊆ B</text>
          {info.elements.map((e, i) => (
            <text key={i} x={w / 2 - 20 + (i - 0.5) * 30} y={h / 2 + 5} fill="white" fontSize="16" textAnchor="middle" fontWeight="bold">{e}</text>
          ))}
          <text x={w / 2 + 60} y={h / 2 + 5} fill="var(--coral)" fontSize="14" textAnchor="middle">3</text>
          <text x={w / 2 + 90} y={h / 2 + 5} fill="var(--coral)" fontSize="14" textAnchor="middle">4</text>
        </>
      )}

      {/* Equal sets */}
      {type === 'equal' && (
        <>
          <circle cx={w / 2 - 30} cy={h / 2} r={65} fill="rgba(124,140,248,0.1)" stroke="#7c8cf8" strokeWidth="2" />
          <circle cx={w / 2 + 30} cy={h / 2} r={65} fill="rgba(124,140,248,0.1)" stroke="#7c8cf8" strokeWidth="2" />
          <text x={w / 2 - 70} y={h / 2 - 45} fill="#7c8cf8" fontSize="14" fontWeight="bold">A</text>
          <text x={w / 2 + 60} y={h / 2 - 45} fill="#7c8cf8" fontSize="14" fontWeight="bold">B</text>
          <text x={w / 2} y={h / 2 - 10} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">A = B</text>
          {info.elements.map((e, i) => (
            <text key={i} x={w / 2 + (i - 1) * 30} y={h / 2 + 20} fill="white" fontSize="16" textAnchor="middle" fontWeight="bold">{e}</text>
          ))}
        </>
      )}

      {/* Standard set (empty, singleton, finite, infinite, power, universal) */}
      {!['subset', 'equal'].includes(type) && (
        <>
          <ellipse cx={w / 2} cy={h / 2} rx={120} ry={75} fill={`${info.color}11`} stroke={info.color} strokeWidth="2.5" filter="url(#set-glow)" />
          {type === 'empty' ? (
            <text x={w / 2} y={h / 2 + 6} fill="var(--text3)" fontSize="28" textAnchor="middle" fontWeight="bold">∅</text>
          ) : (
            info.elements.map((e, i) => {
              const angle = (i / info.elements.length) * 2 * Math.PI - Math.PI / 2;
              const rx = Math.min(70, 25 * info.elements.length * 0.3);
              const ry = 30;
              const ex = w / 2 + rx * Math.cos(angle);
              const ey = h / 2 + ry * Math.sin(angle);
              return (
                <g key={i}>
                  <circle cx={ex} cy={ey} r={14} fill={info.color} opacity="0.2" />
                  <text x={ex} y={ey + 5} fill="white" fontSize="14" textAnchor="middle" fontWeight="bold">{e}</text>
                  {type === 'infinite' && e === '…' && (
                    <text x={ex} y={ey + 5} fill="white" fontSize="18" textAnchor="middle">
                      <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
                      …
                    </text>
                  )}
                </g>
              );
            })
          )}
          <text x={w / 2} y={30} fill={info.color} fontSize="22" textAnchor="middle" fontWeight="bold">{info.symbol}</text>
        </>
      )}
    </svg>
  );
};

export const SetTypes = () => {
  const [activeType, setActiveType] = useState('finite');
  const info = SET_TYPES.find(t => t.key === activeType);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Types of Sets</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Tap a set type to visualize it. Each type has distinct properties and notation.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {SET_TYPES.map(t => (
            <motion.button key={t.key} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveType(t.key)} style={{ padding: '10px 8px', background: activeType === t.key ? t.color : 'var(--bg4)', color: activeType === t.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s', opacity: activeType === t.key ? 1 : 0.7, textAlign: 'left' }}>
              <span className="math-font">{t.symbol}</span>
              <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '2px' }}>{t.label}</div>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeType} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', borderLeft: `4px solid ${info.color}` }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: info.color, marginBottom: '6px' }}>{info.label}</div>
            <div style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>{info.desc}</div>
            {activeType === 'power' && (
              <div className="math-font" style={{ color: 'var(--gold)', marginTop: '8px' }}>|P(A)| = 2ⁿ = 2² = 4</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <SetVisual type={activeType} />
      </motion.div>
    </motion.div>
  );
};
