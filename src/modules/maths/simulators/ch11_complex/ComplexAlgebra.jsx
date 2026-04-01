import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormulaCard } from '../../components/ui/FormulaCard';
import { MathSlider } from '../../components/ui/MathSlider';

const fmt = (r, i) => {
  const rS = r === 0 && i !== 0 ? '' : r.toFixed(2);
  const iS = i === 0 ? '' : `${i >= 0 && rS ? '+' : ''}${i.toFixed(2)}i`;
  return `${rS}${iS}` || '0';
};

const OPS = [
  { key: 'add', label: 'z₁ + z₂', fn: (a, b, c, d) => [a + c, b + d] },
  { key: 'sub', label: 'z₁ − z₂', fn: (a, b, c, d) => [a - c, b - d] },
  { key: 'mul', label: 'z₁ · z₂', fn: (a, b, c, d) => [a * c - b * d, a * d + b * c] },
  { key: 'div', label: 'z₁ / z₂', fn: (a, b, c, d) => { const den = c * c + d * d; return den ? [(a * c + b * d) / den, (b * c - a * d) / den] : [0, 0]; } },
  { key: 'conj', label: 'z̄₁', fn: (a, b) => [a, -b] },
  { key: 'mod', label: '|z₁|', fn: (a, b) => [Math.sqrt(a * a + b * b), 0] },
];

export const ComplexAlgebra = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [c, setC] = useState(1);
  const [d, setD] = useState(-1);
  const [op, setOp] = useState('add');

  const opInfo = OPS.find(o => o.key === op);
  const [rr, ri] = opInfo.fn(a, b, c, d);

  const w = 300, h = 300;
  const scale = 25;
  const cx = w / 2, cy = h / 2;
  const mx = (x) => cx + x * scale;
  const my = (y) => cy - y * scale;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Algebra of Complex Numbers</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Define <span style={{ color: 'var(--teal)' }}>z₁</span> and <span style={{ color: 'var(--coral)' }}>z₂</span>, pick an operation, and see the result on the Argand plane.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <MathSlider label="Re(z₁)" min={-5} max={5} step={0.5} value={a} onChange={setA} />
          <MathSlider label="Im(z₁)" min={-5} max={5} step={0.5} value={b} onChange={setB} />
          <MathSlider label="Re(z₂)" min={-5} max={5} step={0.5} value={c} onChange={setC} />
          <MathSlider label="Im(z₂)" min={-5} max={5} step={0.5} value={d} onChange={setD} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
          {OPS.map(o => (
            <motion.button key={o.key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOp(o.key)} style={{ padding: '8px', background: op === o.key ? '#7c8cf8' : 'var(--bg4)', color: op === o.key ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'all 0.3s' }}>
              {o.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {[
            { label: 'z₁', value: fmt(a, b), color: 'var(--teal)' },
            { label: 'z₂', value: fmt(c, d), color: 'var(--coral)' },
            { label: 'Result', value: op === 'mod' ? rr.toFixed(3) : fmt(rr, ri), color: 'var(--gold)' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
              <div className="math-font" style={{ color: s.color, fontSize: '0.95rem', fontWeight: 'bold' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <FormulaCard title={opInfo.label} formula={
          op === 'add' ? '(a+bi) + (c+di) = (a+c) + (b+d)i' :
          op === 'sub' ? '(a+bi) − (c+di) = (a−c) + (b−d)i' :
          op === 'mul' ? '(a+bi)(c+di) = (ac−bd) + (ad+bc)i' :
          op === 'div' ? '(a+bi)/(c+di) = [(ac+bd) + (bc−ad)i] / (c²+d²)' :
          op === 'conj' ? 'z̄ = a − bi' : '|z| = √(a² + b²)'
        } />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <defs>
            <marker id="ca-arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--gold)" />
            </marker>
            <filter id="ca-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Axes */}
          <line x1={0} y1={cy} x2={w} y2={cy} stroke="var(--border)" strokeWidth="1" />
          <line x1={cx} y1={0} x2={cx} y2={h} stroke="var(--border)" strokeWidth="1" />
          <text x={w - 12} y={cy - 6} fill="var(--text3)" fontSize="10">Re</text>
          <text x={cx + 6} y={14} fill="var(--text3)" fontSize="10">Im</text>

          {/* Grid dots */}
          {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(gi => (
            [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(gj => (
              <circle key={`${gi}-${gj}`} cx={mx(gi)} cy={my(gj)} r={1} fill="var(--border)" opacity="0.3" />
            ))
          ))}

          {/* z1 vector */}
          <line x1={cx} y1={cy} x2={mx(a)} y2={my(b)} stroke="var(--teal)" strokeWidth="2.5" filter="url(#ca-glow)" />
          <circle cx={mx(a)} cy={my(b)} r={6} fill="var(--teal)" />

          {/* z2 vector */}
          <line x1={cx} y1={cy} x2={mx(c)} y2={my(d)} stroke="var(--coral)" strokeWidth="2.5" />
          <circle cx={mx(c)} cy={my(d)} r={6} fill="var(--coral)" />

          {/* Result vector */}
          {op !== 'mod' && (
            <>
              <line x1={cx} y1={cy} x2={mx(rr)} y2={my(ri)} stroke="var(--gold)" strokeWidth="3" filter="url(#ca-glow)" markerEnd="url(#ca-arrow)" />
              <circle cx={mx(rr)} cy={my(ri)} r={7} fill="var(--gold)">
                <animate attributeName="r" values="6;9;6" dur="2s" repeatCount="indefinite" />
              </circle>
            </>
          )}

          {/* Parallelogram for add */}
          {op === 'add' && (
            <polygon points={`${cx},${cy} ${mx(a)},${my(b)} ${mx(rr)},${my(ri)} ${mx(c)},${my(d)}`} fill="var(--gold)" opacity="0.08" stroke="var(--gold)" strokeWidth="1" strokeDasharray="4 3" />
          )}

          {/* Labels */}
          <text x={mx(a) + 8} y={my(b) - 8} fill="var(--teal)" fontSize="11" fontWeight="bold">z₁</text>
          <text x={mx(c) + 8} y={my(d) - 8} fill="var(--coral)" fontSize="11" fontWeight="bold">z₂</text>
          {op !== 'mod' && <text x={mx(rr) + 8} y={my(ri) - 8} fill="var(--gold)" fontSize="11" fontWeight="bold">{opInfo.label}</text>}
        </svg>
      </motion.div>
    </motion.div>
  );
};
