import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const ExponentialForm = () => {
  const [r, setR] = useState(2);
  const [theta, setTheta] = useState(60);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef();

  const thetaRad = (theta * Math.PI) / 180;
  const re = r * Math.cos(thetaRad);
  const im = r * Math.sin(thetaRad);

  useEffect(() => {
    if (!isAnimating) return;
    let t = theta;
    const step = () => {
      t = (t + 0.4) % 360;
      setTheta(t);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const w = 340, h = 340;
  const scale = 35;
  const cx = w / 2, cy = h / 2;
  const mx = (x) => cx + x * scale;
  const my = (y) => cy - y * scale;

  // Euler spiral trail
  const trail = [];
  for (let i = 1; i <= 40; i++) {
    const tt = ((theta - i * 2) * Math.PI) / 180;
    const tr = r * (1 - i * 0.005); // slight spiral fade
    trail.push([tr * Math.cos(tt), tr * Math.sin(tt), 0.6 - i * 0.013]);
  }

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Exponential Form</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            <strong>z = re<sup>iθ</sup></strong> — Euler's formula connects exponentials to rotation. Watch <strong>e<sup>iπ</sup> = −1</strong> unfold as θ → π.
          </p>
        </motion.div>

        <MathSlider label="r" min={0.5} max={4} step={0.5} value={r} onChange={setR} />
        <MathSlider label="θ" min={0} max={360} step={1} value={Math.round(theta)} onChange={setTheta} unit="°" />

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(p => !p)} style={{ padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s' }}>
          {isAnimating ? '⏸  Pause' : '▶  Animate e^iθ'}
        </motion.button>

        {/* Three representations */}
        <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          {[
            { label: 'Cartesian', value: `${re.toFixed(2)} + ${im.toFixed(2)}i`, color: 'var(--teal)' },
            { label: 'Polar', value: `${r}·cis(${Math.round(theta)}°)`, color: 'var(--gold)' },
            { label: 'Exponential', value: `${r}·e^(i·${thetaRad.toFixed(2)})`, color: 'var(--coral)' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>{s.label}</span>
              <span className="math-font" style={{ color: s.color, fontWeight: 'bold', fontSize: '0.95rem' }}>{s.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Special angles */}
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {[
            { label: 'e^i0 = 1', angle: 0 },
            { label: 'e^iπ/2 = i', angle: 90 },
            { label: 'e^iπ = −1', angle: 180 },
            { label: 'e^i3π/2 = −i', angle: 270 },
          ].map(sp => (
            <motion.button key={sp.angle} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => { setTheta(sp.angle); setR(1); setIsAnimating(false); }} style={{ flex: 1, padding: '7px 4px', background: Math.round(theta) === sp.angle && r === 1 ? 'var(--coral)' : 'var(--bg4)', color: Math.round(theta) === sp.angle && r === 1 ? 'white' : 'var(--text3)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 600, transition: 'all 0.2s' }}>
              {sp.label}
            </motion.button>
          ))}
        </div>

        <FormulaCard title="Euler's Formula" formula="e^(iθ) = cos θ + i sin θ" description="Exponential form: z = r·e^(iθ)" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <defs>
            <filter id="ef-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <line x1={0} y1={cy} x2={w} y2={cy} stroke="var(--border)" strokeWidth="1" />
          <line x1={cx} y1={0} x2={cx} y2={h} stroke="var(--border)" strokeWidth="1" />

          {/* Unit circle always shown */}
          <circle cx={cx} cy={cy} r={scale} fill="none" stroke="white" strokeWidth="1" opacity="0.15" />

          {/* Modulus circle */}
          <circle cx={cx} cy={cy} r={r * scale} fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />

          {/* Trail */}
          {trail.map((t, i) => (
            <circle key={i} cx={mx(t[0])} cy={my(t[1])} r={2} fill="var(--coral)" opacity={Math.max(0, t[2])} />
          ))}

          {/* Arg arc */}
          {r > 0 && (
            <path d={(() => {
              const ar = 25;
              const endX = cx + ar * Math.cos(-thetaRad);
              const endY = cy + ar * Math.sin(-thetaRad);
              const large = theta > 180 ? 1 : 0;
              return `M ${cx + ar} ${cy} A ${ar} ${ar} 0 ${large} 0 ${endX} ${endY}`;
            })()} fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.6" />
          )}

          {/* Vector */}
          <line x1={cx} y1={cy} x2={mx(re)} y2={my(im)} stroke="var(--coral)" strokeWidth="3" filter="url(#ef-glow)" />

          {/* Point */}
          <circle cx={mx(re)} cy={my(im)} r={7} fill="var(--coral)" />
          <circle cx={mx(re)} cy={my(im)} r={7} fill="none" stroke="var(--coral)" strokeWidth="1.5">
            <animate attributeName="r" from="7" to="15" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
          </circle>

          {/* Special points on unit circle */}
          {[0, 90, 180, 270].map(deg => {
            const rad = (deg * Math.PI) / 180;
            return <circle key={deg} cx={mx(Math.cos(rad))} cy={my(Math.sin(rad))} r={3} fill="white" opacity="0.4" />;
          })}

          <text x={mx(re) + 10} y={my(im) - 10} fill="var(--coral)" fontSize="11" fontWeight="bold">re^iθ</text>
          <circle cx={cx} cy={cy} r={3} fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
