import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const BayesBars = ({ prior, likelihood, marginal, posterior, labels }) => {
  const w = 360, h = 280;
  const bars = [
    { label: `P(${labels.H})`, value: prior, color: 'var(--teal)', sub: 'Prior' },
    { label: `P(${labels.E}|${labels.H})`, value: likelihood, color: 'var(--gold)', sub: 'Likelihood' },
    { label: `P(${labels.E})`, value: marginal, color: 'var(--text2)', sub: 'Evidence' },
    { label: `P(${labels.H}|${labels.E})`, value: posterior, color: 'var(--coral)', sub: 'Posterior' },
  ];
  const barW = 50;
  const gap = (w - 40 - bars.length * barW) / (bars.length - 1);

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <filter id="bayes-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Baseline */}
      <line x1={20} y1={h - 40} x2={w - 20} y2={h - 40} stroke="var(--border)" strokeWidth="1" />

      {bars.map((bar, i) => {
        const x = 20 + i * (barW + gap);
        const maxH = h - 80;
        const barH = bar.value * maxH;
        const y = h - 40 - barH;

        return (
          <g key={i}>
            {/* Bar */}
            <motion.rect
              x={x} width={barW} rx={6}
              fill={bar.color}
              opacity="0.8"
              filter="url(#bayes-glow)"
              initial={{ y: h - 40, height: 0 }}
              animate={{ y, height: barH }}
              transition={{ duration: 0.6, delay: i * 0.1, type: 'spring', damping: 14 }}
            />

            {/* Value label */}
            <motion.text
              x={x + barW / 2} textAnchor="middle"
              fill="white" fontSize="12" fontWeight="bold"
              initial={{ y: h - 45, opacity: 0 }}
              animate={{ y: y - 8, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              {bar.value.toFixed(3)}
            </motion.text>

            {/* Label */}
            <text x={x + barW / 2} y={h - 24} fill={bar.color} fontSize="9" fontWeight="600" textAnchor="middle">{bar.label}</text>
            <text x={x + barW / 2} y={h - 12} fill="var(--text3)" fontSize="8" textAnchor="middle">{bar.sub}</text>
          </g>
        );
      })}

      {/* Arrow from prior → posterior */}
      <line x1={20 + barW / 2} y1={h - 52} x2={20 + 3 * (barW + gap) + barW / 2} y2={h - 52} stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" markerEnd="url(#arrowhead)" />
    </svg>
  );
};

export const BayesTheorem = () => {
  const [scenario, setScenario] = useState('medical');

  const SCENARIOS = {
    medical: {
      name: '🏥 Medical Test',
      labels: { H: 'Disease', E: 'Positive' },
      initPrior: 0.01, initLikelihood: 0.95, initFalsePos: 0.05,
      desc: 'A rare disease (1%) with a 95% accurate test.',
    },
    spam: {
      name: '📧 Spam Filter',
      labels: { H: 'Spam', E: 'Word' },
      initPrior: 0.3, initLikelihood: 0.8, initFalsePos: 0.1,
      desc: '30% of emails are spam. "Free" appears in 80% of spam.',
    },
    quality: {
      name: '🏭 Quality Control',
      labels: { H: 'Defective', E: 'Failed' },
      initPrior: 0.02, initLikelihood: 0.99, initFalsePos: 0.03,
      desc: '2% defect rate. Test catches 99% of defects.',
    },
  };

  const sc = SCENARIOS[scenario];
  const [prior, setPrior] = useState(sc.initPrior);
  const [likelihood, setLikelihood] = useState(sc.initLikelihood);
  const [falsePos, setFalsePos] = useState(sc.initFalsePos);

  const switchScenario = (key) => {
    setScenario(key);
    const s = SCENARIOS[key];
    setPrior(s.initPrior);
    setLikelihood(s.initLikelihood);
    setFalsePos(s.initFalsePos);
  };

  const priorC = 1 - prior;
  const marginal = prior * likelihood + priorC * falsePos;
  const posterior = marginal > 0 ? (prior * likelihood) / marginal : 0;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Bayes' Theorem</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            See how <strong>prior belief</strong> updates to a <strong>posterior</strong> given new evidence. Pick a real-world scenario and adjust the parameters.
          </p>
        </motion.div>

        {/* Scenario tabs */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.entries(SCENARIOS).map(([key, s]) => (
            <motion.button key={key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => switchScenario(key)} style={{ padding: '8px 12px', background: scenario === key ? 'var(--coral)' : 'var(--bg4)', color: scenario === key ? 'white' : 'var(--text3)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.2s' }}>
              {s.name}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p key={scenario} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: 'var(--text3)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>
            {sc.desc}
          </motion.p>
        </AnimatePresence>

        <MathSlider label={`P(${sc.labels.H}) — Prior`} min={0.01} max={0.99} step={0.01} value={prior} onChange={setPrior} />
        <MathSlider label={`P(${sc.labels.E}|${sc.labels.H}) — Sensitivity`} min={0} max={1} step={0.05} value={likelihood} onChange={setLikelihood} />
        <MathSlider label={`P(${sc.labels.E}|${sc.labels.H}') — False Positive`} min={0} max={1} step={0.01} value={falsePos} onChange={setFalsePos} />

        {/* Key result */}
        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', textAlign: 'center', borderLeft: '4px solid var(--coral)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Posterior — P({sc.labels.H} | {sc.labels.E})</div>
          <div className="math-font" style={{ color: 'var(--coral)', fontSize: '2rem', fontWeight: 'bold' }}>{(posterior * 100).toFixed(1)}%</div>
          <div style={{ marginTop: '8px', height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${posterior * 100}%` }} transition={{ type: 'spring', damping: 15 }} style={{ height: '100%', background: 'var(--coral)', borderRadius: 4 }} />
          </div>
        </motion.div>

        <FormulaCard title="Bayes' Theorem" formula="P(H|E) = P(E|H)·P(H) / P(E)" description={`= (${likelihood.toFixed(2)} × ${prior.toFixed(2)}) / ${marginal.toFixed(4)} = ${posterior.toFixed(4)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BayesBars prior={prior} likelihood={likelihood} marginal={marginal} posterior={posterior} labels={sc.labels} />
      </motion.div>
    </motion.div>
  );
};
