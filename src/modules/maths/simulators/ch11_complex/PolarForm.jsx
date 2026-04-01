import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const PolarForm = () => {
  const [r, setR] = useState(3);
  const [theta, setTheta] = useState(45);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef();

  const thetaRad = (theta * Math.PI) / 180;
  const re = r * Math.cos(thetaRad);
  const im = r * Math.sin(thetaRad);

  useEffect(() => {
    if (!isAnimating) return;
    let t = theta;
    const step = () => {
      t = (t + 0.5) % 360;
      setTheta(t);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const w = 360, h = 360;
  const scale = 30;
  const cx = w / 2, cy = h / 2;
  const mx = (x) => cx + x * scale;
  const my = (y) => cy - y * scale;

  // Trail
  const trail = [];
  for (let i = 1; i <= 30; i++) {
    const tt = ((theta - i * 2) * Math.PI) / 180;
    trail.push([r * Math.cos(tt), r * Math.sin(tt)]);
  }

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Polar Form</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            <strong>z = r(cos θ + i sin θ)</strong> — adjust the modulus <strong>r</strong> and argument <strong>θ</strong>. Animate to trace the circle of radius r.
          </p>
        </motion.div>

        <MathSlider label="r (modulus)" min={0.5} max={5} step={0.5} value={r} onChange={setR} />
        <MathSlider label="θ (argument)" min={0} max={360} step={1} value={Math.round(theta)} onChange={setTheta} unit="°" />

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(p => !p)} style={{ padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
          {isAnimating ? '⏸  Pause Rotation' : '▶  Rotate z'}
        </motion.button>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Cartesian ↔ Polar</div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--teal)' }}>z = a + bi</div>
              <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1rem', fontWeight: 'bold' }}>{re.toFixed(2)} + {im.toFixed(2)}i</div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: '1.2rem' }}>⟺</span>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--gold)' }}>z = r·cis θ</div>
              <div className="math-font" style={{ color: 'var(--gold)', fontSize: '1rem', fontWeight: 'bold' }}>{r}·cis {Math.round(theta)}°</div>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'r', value: r.toFixed(1), color: 'var(--gold)' },
            { label: 'θ', value: `${Math.round(theta)}°`, color: '#7c8cf8' },
            { label: 'θ (rad)', value: thetaRad.toFixed(3), color: 'var(--text2)' },
          ].map(s => (
            <motion.div key={s.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{s.label}</div>
              <div className="math-font" style={{ color: s.color, fontSize: '1rem', fontWeight: 'bold' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <FormulaCard title="Polar Form" formula="z = r(cos θ + i sin θ) = r·cis θ" description={`r = ${r}, θ = ${Math.round(theta)}° → Re = ${re.toFixed(2)}, Im = ${im.toFixed(2)}`} />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <defs>
            <filter id="pf-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Axes */}
          <line x1={0} y1={cy} x2={w} y2={cy} stroke="var(--border)" strokeWidth="1" />
          <line x1={cx} y1={0} x2={cx} y2={h} stroke="var(--border)" strokeWidth="1" />

          {/* Modulus circle */}
          <circle cx={cx} cy={cy} r={r * scale} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

          {/* Argument arc */}
          {r > 0 && (
            <path d={(() => {
              const ar = Math.min(r * scale, 35);
              const endX = cx + ar * Math.cos(-thetaRad);
              const endY = cy + ar * Math.sin(-thetaRad);
              const large = theta > 180 ? 1 : 0;
              return `M ${cx + ar} ${cy} A ${ar} ${ar} 0 ${large} 0 ${endX} ${endY}`;
            })()} fill="none" stroke="#7c8cf8" strokeWidth="2" opacity="0.6" />
          )}

          {/* Trail */}
          {trail.map((t, i) => (
            <circle key={i} cx={mx(t[0])} cy={my(t[1])} r={2} fill="var(--gold)" opacity={0.5 - i * 0.015} />
          ))}

          {/* Projection lines */}
          <line x1={mx(re)} y1={cy} x2={mx(re)} y2={my(im)} stroke="var(--teal)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          <line x1={cx} y1={my(im)} x2={mx(re)} y2={my(im)} stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

          {/* Vector */}
          <line x1={cx} y1={cy} x2={mx(re)} y2={my(im)} stroke="var(--gold)" strokeWidth="3" filter="url(#pf-glow)" />

          {/* Point */}
          <circle cx={mx(re)} cy={my(im)} r={8} fill="var(--gold)" />
          <circle cx={mx(re)} cy={my(im)} r={8} fill="none" stroke="var(--gold)" strokeWidth="1.5">
            <animate attributeName="r" from="8" to="16" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Labels */}
          <text x={mx(re) + 10} y={my(im) - 10} fill="var(--gold)" fontSize="12" fontWeight="bold">z</text>
          <text x={mx(re / 2)} y={cy + 16} fill="var(--teal)" fontSize="10">cos θ·r</text>
          <text x={cx - 40} y={my(im / 2)} fill="var(--coral)" fontSize="10">sin θ·r</text>
          <text x={cx + 20} y={cy - 5} fill="#7c8cf8" fontSize="10">θ</text>
          <text x={w - 14} y={cy - 6} fill="var(--text3)" fontSize="10">Re</text>
          <text x={cx + 6} y={14} fill="var(--text3)" fontSize="10">Im</text>

          <circle cx={cx} cy={cy} r={3} fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
