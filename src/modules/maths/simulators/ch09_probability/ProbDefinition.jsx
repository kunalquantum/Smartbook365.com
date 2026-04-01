import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';
import { MathSlider } from '../../components/ui/MathSlider';

const EXPERIMENTS = [
  { name: 'Coin Toss', space: ['H', 'T'], icon: '🪙' },
  { name: 'Die Roll', space: ['1', '2', '3', '4', '5', '6'], icon: '🎲' },
  { name: 'Two Coins', space: ['HH', 'HT', 'TH', 'TT'], icon: '🪙🪙' },
  { name: 'Card Suit', space: ['♠', '♥', '♦', '♣'], icon: '🃏' },
];

const OutcomeGrid = ({ space, selected, onToggle, simulationResult }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', padding: '16px', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <AnimatePresence>
        {space.map((item, i) => {
          const isSel = selected.includes(item);
          const isSimResult = simulationResult === item;
          return (
            <motion.button
              key={item}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: isSimResult ? 1.2 : 1 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 12 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggle(item)}
              style={{
                width: 56, height: 56,
                borderRadius: '12px',
                background: isSimResult ? 'var(--gold)' : isSel ? 'var(--teal)' : 'var(--bg4)',
                color: (isSimResult || isSel) ? 'white' : 'var(--text2)',
                border: isSel ? '2px solid var(--teal)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s, border 0.3s',
                boxShadow: isSimResult ? '0 0 20px rgba(248,196,72,0.4)' : 'none',
              }}
            >
              {item}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const ProbDefinition = () => {
  const [expIdx, setExpIdx] = useState(1);
  const [selected, setSelected] = useState(['2', '4', '6']);
  const [simResult, setSimResult] = useState(null);
  const [simCount, setSimCount] = useState(0);
  const [simHits, setSimHits] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const rafRef = useRef();
  const simRef = useRef({ count: 0, hits: 0 });

  const exp = EXPERIMENTS[expIdx];
  const nS = exp.space.length;
  const nE = selected.length;
  const prob = nS > 0 ? nE / nS : 0;

  const toggleOutcome = (item) => {
    setSelected(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  const switchExp = (idx) => {
    setExpIdx(idx);
    setSelected([]);
    setSimResult(null);
    setSimCount(0);
    setSimHits(0);
    simRef.current = { count: 0, hits: 0 };
  };

  // Simulate
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      const outcome = exp.space[Math.floor(Math.random() * nS)];
      const hit = selected.includes(outcome);
      simRef.current.count++;
      if (hit) simRef.current.hits++;
      setSimResult(outcome);
      setSimCount(simRef.current.count);
      setSimHits(simRef.current.hits);
    }, 150);
    return () => clearInterval(interval);
  }, [isSimulating, selected, exp]);

  const empiricalP = simCount > 0 ? simHits / simCount : 0;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Definition of Probability</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Click outcomes to define event <strong>E</strong>. Then <strong>simulate</strong> repeated trials and watch the empirical probability converge to the theoretical value!
          </p>
        </motion.div>

        {/* Experiment tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {EXPERIMENTS.map((e, i) => (
            <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => switchExp(i)} style={{ padding: '8px 12px', background: expIdx === i ? 'var(--teal)' : 'var(--bg4)', color: expIdx === i ? 'white' : 'var(--text3)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.2s' }}>
              {e.icon} {e.name}
            </motion.button>
          ))}
        </div>

        {/* Outcome grid */}
        <OutcomeGrid space={exp.space} selected={selected} onToggle={toggleOutcome} simulationResult={simResult} />

        {/* Simulate button */}
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setIsSimulating(p => !p); if (!isSimulating) { simRef.current = { count: 0, hits: 0 }; setSimCount(0); setSimHits(0); } }} style={{ padding: '12px', background: isSimulating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem', transition: 'all 0.3s' }}>
          {isSimulating ? '⏸  Stop Simulation' : `▶  Simulate ${exp.name}`}
        </motion.button>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'n(S)', value: nS, color: 'var(--text2)' },
            { label: 'n(E)', value: nE, color: 'var(--teal)' },
            { label: 'P(E)', value: prob.toFixed(4), color: 'var(--gold)' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
              <div className="math-font" style={{ color: s.color, fontSize: '1.1rem', fontWeight: 'bold' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Simulation results */}
        {simCount > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Simulation ({simCount} trials)</div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'baseline' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>Empirical P(E) =</span>
              <span className="math-font" style={{ color: 'var(--gold)', fontSize: '1.3rem', fontWeight: 'bold' }}>{empiricalP.toFixed(4)}</span>
            </div>
            <div style={{ marginTop: '8px', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div animate={{ width: `${empiricalP * 100}%` }} transition={{ duration: 0.3 }} style={{ height: '100%', background: 'var(--gold)', borderRadius: 3 }} />
            </div>
          </motion.div>
        )}

        <FormulaCard title="Classical Definition" formula="P(E) = n(E) / n(S)" description={`= ${nE} / ${nS} = ${prob.toFixed(4)}`} />
      </div>
    </motion.div>
  );
};
