import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PRESETS = {
  'Test Scores': [45, 67, 82, 55, 90, 73, 61, 88, 50, 76],
  'Daily Sales': [120, 135, 110, 145, 130, 125, 140, 115, 150, 128],
  'Uniform': [50, 50, 50, 50, 50, 50, 50, 50],
};

const BellCurve = ({ data, mean, sd, animPhase }) => {
  if (!data.length || sd === 0) return null;

  const w = 360, h = 280;
  const margin = { top: 20, bottom: 40, left: 8, right: 8 };
  const plotW = w - margin.left - margin.right;
  const plotH = h - margin.top - margin.bottom;

  const xMin = mean - 4 * sd;
  const xMax = mean + 4 * sd;
  const mapX = (x) => margin.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const gauss = (x) => (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mean) / sd) ** 2);
  const maxG = gauss(mean);
  const mapY = (g) => margin.top + plotH - (g / maxG) * plotH * 0.9;

  // Bell curve path
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = xMin + (i / 200) * (xMax - xMin);
    pts.push([mapX(x), mapY(gauss(x))]);
  }
  const curveD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

  // Filled area under curve
  const fillD = curveD + ` L ${mapX(xMax)} ${mapY(0)} L ${mapX(xMin)} ${mapY(0)} Z`;

  // Sigma zones
  const zones = [
    { from: mean - sd, to: mean + sd, color: 'var(--teal)', label: '68.27%', opacity: 0.15 },
    { from: mean - 2 * sd, to: mean + 2 * sd, color: 'var(--gold)', label: '95.45%', opacity: 0.08 },
    { from: mean - 3 * sd, to: mean + 3 * sd, color: 'var(--coral)', label: '99.73%', opacity: 0.04 },
  ];

  // Data dots on x-axis
  const dotY = mapY(0) + 14;

  return (
    <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
      <defs>
        <linearGradient id="bell-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.02" />
        </linearGradient>
        <filter id="sd-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sigma zones (reverse order so innermost is on top) */}
      {zones.slice().reverse().map((z, i) => {
        const zPts = [];
        for (let j = 0; j <= 100; j++) {
          const x = z.from + (j / 100) * (z.to - z.from);
          zPts.push([mapX(x), mapY(gauss(x))]);
        }
        const zD = zPts.map((p, j) => `${j === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
        const zFill = zD + ` L ${mapX(z.to)} ${mapY(0)} L ${mapX(z.from)} ${mapY(0)} Z`;
        return <path key={i} d={zFill} fill={z.color} opacity={z.opacity * (animPhase > 0.3 ? 1 : 0)} style={{ transition: 'opacity 0.8s' }} />;
      })}

      {/* Fill under curve */}
      <path d={fillD} fill="url(#bell-grad)" />

      {/* Curve with glow */}
      <path d={curveD} fill="none" stroke="var(--teal)" strokeWidth="3" filter="url(#sd-glow)" />

      {/* Mean line */}
      <line x1={mapX(mean)} y1={margin.top} x2={mapX(mean)} y2={mapY(0)} stroke="var(--gold)" strokeWidth="2" strokeDasharray="6 4" />
      <text x={mapX(mean)} y={margin.top - 5} fill="var(--gold)" fontSize="11" textAnchor="middle" fontWeight="bold">x̄ = {mean.toFixed(1)}</text>

      {/* ±σ markers */}
      {[-3, -2, -1, 1, 2, 3].map(k => (
        <g key={k}>
          <line x1={mapX(mean + k * sd)} y1={mapY(0) - 4} x2={mapX(mean + k * sd)} y2={mapY(0) + 4} stroke="var(--text3)" strokeWidth="1.5" opacity="0.6" />
          <text x={mapX(mean + k * sd)} y={mapY(0) + 16} fill="var(--text3)" fontSize="9" textAnchor="middle">{k > 0 ? `+${k}σ` : `${k}σ`}</text>
        </g>
      ))}

      {/* Data points on x-axis */}
      {data.map((v, i) => (
        <circle key={i} cx={mapX(v)} cy={dotY} r={4} fill="white" opacity="0.7" stroke="var(--teal)" strokeWidth="1">
          <animate attributeName="r" from="3" to="5" dur="2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.5" to="1" dur="2s" begin={`${i * 0.1}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Zone labels */}
      {zones.map((z, i) => (
        <text key={i} x={mapX(mean)} y={mapY(gauss(mean + (i + 0.7) * sd)) - 2} fill={z.color} fontSize="10" textAnchor="middle" fontWeight="600" opacity="0.8">
          {z.label}
        </text>
      ))}
    </svg>
  );
};

export const StdDevSim = () => {
  const [data, setData] = useState([45, 67, 82, 55, 90, 73, 61, 88, 50, 76]);
  const [inputVal, setInputVal] = useState('');
  const [preset, setPreset] = useState('Test Scores');
  const [animPhase, setAnimPhase] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPhase(1), 300);
    return () => clearTimeout(t);
  }, [data]);

  const n = data.length;
  const mean = n ? data.reduce((s, v) => s + v, 0) / n : 0;
  const variance = n > 1 ? data.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1) : 0;
  const sd = Math.sqrt(variance);

  const addValue = () => {
    const v = parseFloat(inputVal);
    if (!isNaN(v)) { setData(prev => [...prev, v]); setInputVal(''); setPreset('Custom'); setAnimPhase(0); }
  };

  const applyPreset = (name) => {
    setPreset(name);
    setData([...PRESETS[name]]);
    setAnimPhase(0);
  };

  // Count in each σ zone
  const in1 = data.filter(v => Math.abs(v - mean) <= sd).length;
  const in2 = data.filter(v => Math.abs(v - mean) <= 2 * sd).length;
  const in3 = data.filter(v => Math.abs(v - mean) <= 3 * sd).length;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Standard Deviation</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The bell curve shows the normal distribution. Colored zones mark ±1σ, ±2σ, and ±3σ regions. Data dots pulse on the x-axis.
          </p>
        </motion.div>

        {/* Presets */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {Object.keys(PRESETS).map(name => (
            <motion.button key={name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => applyPreset(name)} style={{ padding: '6px 12px', background: preset === name ? 'rgba(0,196,180,0.3)' : 'var(--bg4)', color: preset === name ? 'white' : 'var(--text3)', border: preset === name ? '1px solid rgba(0,196,180,0.5)' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.2s' }}>
              {name}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && addValue()} placeholder="Add value…" style={{ flex: 1, padding: '10px 14px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} onClick={addValue} style={{ padding: '10px 18px', background: 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem' }}>+</motion.button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'Mean', value: mean.toFixed(2), color: 'var(--gold)' },
            { label: 'Variance', value: variance.toFixed(2), color: '#7c8cf8' },
            { label: 'Std Dev', value: sd.toFixed(2), color: 'var(--teal)' },
          ].map(item => (
            <motion.div key={item.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{item.label}</div>
              <div className="math-font" style={{ color: item.color, fontSize: '1.1rem', fontWeight: 'bold' }}>{item.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Zone counts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
          {[
            { label: '±1σ', count: in1, pct: n ? (in1 / n * 100).toFixed(0) : 0, color: 'var(--teal)' },
            { label: '±2σ', count: in2, pct: n ? (in2 / n * 100).toFixed(0) : 0, color: 'var(--gold)' },
            { label: '±3σ', count: in3, pct: n ? (in3 / n * 100).toFixed(0) : 0, color: 'var(--coral)' },
          ].map(z => (
            <div key={z.label} style={{ background: 'var(--bg4)', padding: '8px', borderRadius: '8px', textAlign: 'center', borderLeft: `3px solid ${z.color}` }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)' }}>{z.label}: {z.count}/{n}</div>
              <div className="math-font" style={{ color: z.color, fontWeight: 'bold', fontSize: '0.95rem' }}>{z.pct}%</div>
            </div>
          ))}
        </div>

        <FormulaCard title="Standard Deviation" formula="σ = √[Σ(xᵢ − x̄)² / (n − 1)]" description={`σ = √(${variance.toFixed(2)}) = ${sd.toFixed(2)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <BellCurve data={data} mean={mean} sd={sd || 1} animPhase={animPhase} />
      </motion.div>
    </motion.div>
  );
};
