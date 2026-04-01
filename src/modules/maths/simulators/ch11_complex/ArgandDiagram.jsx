import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const ArgandDiagram = () => {
  const [points, setPoints] = useState([
    { re: 3, im: 2, label: 'z₁', color: 'var(--teal)' },
    { re: -2, im: 1, label: 'z₂', color: 'var(--coral)' },
    { re: 1, im: -3, label: 'z₃', color: 'var(--gold)' },
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [showConjugates, setShowConjugates] = useState(false);
  const [traceAngle, setTraceAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef();

  const w = 360, h = 360;
  const scale = 30;
  const cx = w / 2, cy = h / 2;
  const mx = (x) => cx + x * scale;
  const my = (y) => cy - y * scale;

  const active = points[activeIdx];
  const mod = Math.sqrt(active.re ** 2 + active.im ** 2);
  const arg = Math.atan2(active.im, active.re);

  // Animate circle tracer
  useEffect(() => {
    if (!isAnimating) return;
    let a = traceAngle;
    const step = () => {
      a = (a + 0.015) % (2 * Math.PI);
      setTraceAngle(a);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const updateActive = (key, val) => {
    setPoints(prev => prev.map((p, i) => i === activeIdx ? { ...p, [key]: val } : p));
  };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Argand Diagram</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Plot complex numbers on the Argand plane. Toggle <strong>conjugates</strong> or animate the <strong>modulus circle</strong>.
          </p>
        </motion.div>

        {/* Point selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {points.map((p, i) => (
            <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveIdx(i)} style={{ flex: 1, padding: '8px', background: activeIdx === i ? p.color : 'var(--bg4)', color: activeIdx === i ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s' }}>
              {p.label}
            </motion.button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <MathSlider label={`Re(${active.label})`} min={-5} max={5} step={0.5} value={active.re} onChange={v => updateActive('re', v)} />
          <MathSlider label={`Im(${active.label})`} min={-5} max={5} step={0.5} value={active.im} onChange={v => updateActive('im', v)} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowConjugates(p => !p)} style={{ flex: 1, padding: '9px', background: showConjugates ? 'var(--gold)' : 'var(--bg4)', color: showConjugates ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s' }}>
            {showConjugates ? '✓ Conjugates' : 'Show Conjugates'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(p => !p)} style={{ flex: 1, padding: '9px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s' }}>
            {isAnimating ? '⏸ Stop |z| circle' : '▶ Animate |z|'}
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: `${active.label}`, value: `${active.re}${active.im >= 0 ? '+' : ''}${active.im}i`, color: active.color },
            { label: '|z|', value: mod.toFixed(2), color: 'var(--gold)' },
            { label: 'arg(z)', value: `${(arg * 180 / Math.PI).toFixed(1)}°`, color: '#7c8cf8' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
              <div className="math-font" style={{ color: s.color, fontSize: '0.95rem', fontWeight: 'bold' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <FormulaCard title="Argand Plane" formula="z = a + bi = (a, b)" description={`Modulus |z| = √(${active.re}² + ${active.im}²) = ${mod.toFixed(2)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <defs>
            <filter id="arg-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Axes */}
          <line x1={0} y1={cy} x2={w} y2={cy} stroke="var(--border)" strokeWidth="1" />
          <line x1={cx} y1={0} x2={cx} y2={h} stroke="var(--border)" strokeWidth="1" />
          <text x={w - 14} y={cy - 6} fill="var(--text3)" fontSize="10">Re</text>
          <text x={cx + 6} y={14} fill="var(--text3)" fontSize="10">Im</text>

          {/* Modulus circle */}
          <circle cx={cx} cy={cy} r={mod * scale} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

          {/* Animated tracer on |z| circle */}
          {isAnimating && (
            <>
              <circle cx={mx(mod * Math.cos(traceAngle))} cy={my(mod * Math.sin(traceAngle))} r={4} fill="var(--gold)" opacity="0.8" />
              <line x1={cx} y1={cy} x2={mx(mod * Math.cos(traceAngle))} y2={my(mod * Math.sin(traceAngle))} stroke="var(--gold)" strokeWidth="1" opacity="0.3" />
            </>
          )}

          {/* Arg arc */}
          {mod > 0.3 && (
            <path d={`M ${mx(Math.min(mod, 1.5))} ${cy} A ${Math.min(mod, 1.5) * scale} ${Math.min(mod, 1.5) * scale} 0 ${Math.abs(arg) > Math.PI ? 1 : 0} ${arg >= 0 ? 0 : 1} ${mx(Math.min(mod, 1.5) * Math.cos(arg))} ${my(Math.min(mod, 1.5) * Math.sin(arg))}`} fill="none" stroke="#7c8cf8" strokeWidth="1.5" opacity="0.5" />
          )}

          {/* Points */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Projection lines */}
              <line x1={mx(p.re)} y1={cy} x2={mx(p.re)} y2={my(p.im)} stroke={p.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
              <line x1={cx} y1={my(p.im)} x2={mx(p.re)} y2={my(p.im)} stroke={p.color} strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

              {/* Vector */}
              <line x1={cx} y1={cy} x2={mx(p.re)} y2={my(p.im)} stroke={p.color} strokeWidth="2" filter="url(#arg-glow)" />
              <circle cx={mx(p.re)} cy={my(p.im)} r={6} fill={p.color} />
              <text x={mx(p.re) + 10} y={my(p.im) - 8} fill={p.color} fontSize="11" fontWeight="bold">{p.label}</text>

              {/* Conjugate */}
              {showConjugates && (
                <>
                  <line x1={cx} y1={cy} x2={mx(p.re)} y2={my(-p.im)} stroke={p.color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
                  <circle cx={mx(p.re)} cy={my(-p.im)} r={4} fill={p.color} opacity="0.4" />
                  <text x={mx(p.re) + 10} y={my(-p.im) + 14} fill={p.color} fontSize="9" opacity="0.6">{p.label.replace('z', 'z̄')}</text>
                </>
              )}
            </g>
          ))}

          {/* Origin */}
          <circle cx={cx} cy={cy} r={3} fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
