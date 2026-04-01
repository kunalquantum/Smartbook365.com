import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const CountingPrinciple = () => {
  const [option1, setOption1] = useState(3);
  const [option2, setOption2] = useState(2);
  const [type, setType] = useState('multiplication');
  const [selectedA, setSelectedA] = useState(0);
  const [selectedB, setSelectedB] = useState(0);

  const total = type === 'multiplication' ? option1 * option2 : option1 + option2;

  const w = 360, h = 260;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Fundamental Principles of Counting</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            <strong>Multiplication Principle:</strong> If an event can occur in <em>m</em> ways and another in <em>n</em> ways, then both can occur in <strong>m &times; n</strong> ways.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setType('multiplication')} style={{ flex: 1, padding: '10px', background: type === 'multiplication' ? 'var(--teal)' : 'var(--bg4)', color: type === 'multiplication' ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Multiplication (AND)
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setType('addition')} style={{ flex: 1, padding: '10px', background: type === 'addition' ? 'var(--coral)' : 'var(--bg4)', color: type === 'addition' ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>
            Addition (OR)
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '4px' }}>Event A: {type === 'multiplication' ? 'Shirts' : 'Group 1'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {Array.from({ length: option1 }).map((_, i) => (
                <button key={i} onClick={() => setSelectedA(i)} style={{ width: '30px', height: '30px', background: selectedA === i ? (type === 'multiplication' ? 'var(--teal)' : 'var(--teal)') : 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '0.7rem' }}>{type === 'multiplication' ? 'S' : 'G'}{i+1}</button>
              ))}
              <button onClick={() => setOption1(Math.min(option1 + 1, 6))} style={{ width: '30px', height: '30px', background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text3)' }}>+</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '4px' }}>Event B: {type === 'multiplication' ? 'Pants' : 'Group 2'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {Array.from({ length: option2 }).map((_, i) => (
                <button key={i} onClick={() => setSelectedB(i)} style={{ width: '30px', height: '30px', background: selectedB === i ? (type === 'multiplication' ? 'var(--coral)' : 'var(--coral)') : 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'white', fontSize: '0.7rem' }}>{type === 'multiplication' ? 'P' : 'G'}{i+1}</button>
              ))}
              <button onClick={() => setOption2(Math.min(option2 + 1, 6))} style={{ width: '30px', height: '30px', background: 'var(--bg2)', border: '1px dashed var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text3)' }}>+</button>
            </div>
          </div>
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${type === 'multiplication' ? 'var(--teal)' : 'var(--coral)'}` }}>
          <div className="math-font" style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>
            {option1} {type === 'multiplication' ? '&times;' : '+'} {option2} = <span style={{ color: type === 'multiplication' ? 'var(--teal)' : 'var(--coral)' }}>{total}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '4px' }}>
            {type === 'multiplication' ? `Selection: (S${selectedA+1}, P${selectedB+1})` : `Selected Choice: ${selectedA+1}`}
          </div>
        </motion.div>

        <FormulaCard title={type === 'multiplication' ? 'AND Rule' : 'OR Rule'} formula={type === 'multiplication' ? 'Total = m &times; n' : 'Total = m + n'} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          {type === 'multiplication' ? (
            <g>
              {Array.from({ length: option1 }).map((_, i) => (
                Array.from({ length: option2 }).map((_, j) => {
                  const x = (w / (option1 + 1)) * (i + 1);
                  const y = (h / (option2 + 1)) * (j + 1);
                  const isActive = selectedA === i && selectedB === j;
                  return (
                    <motion.g key={`${i}-${j}`}>
                      <circle cx={x} cy={y} r={isActive ? 12 : 6} fill={isActive ? 'var(--teal)' : 'var(--bg4)'} stroke="var(--teal)" strokeWidth={isActive ? 2 : 1} />
                      {isActive && <motion.circle cx={x} cy={y} r={16} fill="none" stroke="var(--teal)" initial={{ scale: 0.8, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5 }} />}
                      <text x={x} y={y + (isActive ? 4 : 3)} fill={isActive ? 'white' : 'var(--text3)'} fontSize={isActive ? 10 : 7} textAnchor="middle" fontWeight={isActive ? 'bold' : 'normal'}>S{i+1}P{j+1}</text>
                    </motion.g>
                  );
                })
              ))}
            </g>
          ) : (
            <g>
              {Array.from({ length: option1 }).map((_, i) => {
                const x = 60 + i * 40;
                const isActive = selectedA === i;
                return (
                  <motion.circle key={`a${i}`} cx={x} cy={h / 2 - 30} r={isActive ? 15 : 10} fill={isActive ? 'var(--teal)' : 'var(--bg4)'} stroke="var(--teal)" strokeWidth="2" onClick={() => setSelectedA(i)} />
                );
              })}
              {Array.from({ length: option2 }).map((_, j) => {
                const x = 60 + j * 40;
                const isActive = selectedB === j;
                return (
                  <motion.circle key={`b${j}`} cx={x} cy={h / 2 + 30} r={isActive ? 15 : 10} fill={isActive ? 'var(--coral)' : 'var(--bg4)'} stroke="var(--coral)" strokeWidth="2" onClick={() => setSelectedB(j)} />
                );
              })}
            </g>
          )}
        </svg>
      </motion.div>
    </motion.div>
  );
};
