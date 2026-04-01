import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const DeMoivre = () => {
  const [r, setR] = useState(1);
  const [theta, setTheta] = useState(45);
  const [n, setN] = useState(3);

  const thetaRad = (theta * Math.PI) / 180;
  const resultR = Math.pow(r, n);
  const resultTheta = n * theta;
  const resultThetaNorm = ((resultTheta % 360) + 360) % 360;
  const resultThetaRad = (resultThetaNorm * Math.PI) / 180;
  const resultRe = resultR * Math.cos(resultThetaRad);
  const resultIm = resultR * Math.sin(resultThetaRad);

  // nth roots of unity
  const roots = [];
  for (let k = 0; k < Math.abs(n); k++) {
    const rootTheta = (theta / n + (360 * k) / n);
    const rootR = Math.pow(r, 1 / Math.abs(n));
    const rad = (rootTheta * Math.PI) / 180;
    roots.push({ re: rootR * Math.cos(rad), im: rootR * Math.sin(rad), angle: rootTheta });
  }

  const w = 360, h = 360;
  const maxR = Math.max(resultR, r, 2);
  const scale = Math.min(30, 150 / maxR);
  const cx = w / 2, cy = h / 2;
  const mx = (x) => cx + x * scale;
  const my = (y) => cy - y * scale;

  const origRe = r * Math.cos(thetaRad);
  const origIm = r * Math.sin(thetaRad);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>De Moivre's Theorem</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            <strong>(r·cis θ)ⁿ = rⁿ·cis(nθ)</strong> — the modulus is raised to the power, and the argument is multiplied. See the <span style={{ color: 'var(--gold)' }}>nth roots of unity</span> as evenly-spaced points.
          </p>
        </motion.div>

        <MathSlider label="r (modulus)" min={0.5} max={3} step={0.5} value={r} onChange={setR} />
        <MathSlider label="θ (argument)" min={0} max={360} step={5} value={theta} onChange={setTheta} unit="°" />
        <MathSlider label="n (power)" min={-5} max={8} step={1} value={n} onChange={setN} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>z = r·cis θ</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '0.95rem' }}>{r}·cis {theta}°</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--coral)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>zⁿ = rⁿ·cis(nθ)</div>
            <div className="math-font" style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.95rem' }}>{resultR.toFixed(2)}·cis {resultThetaNorm.toFixed(0)}°</div>
          </motion.div>
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px' }}>Result (Cartesian)</div>
          <div className="math-font" style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '1.1rem' }}>
            {resultRe.toFixed(3)} {resultIm >= 0 ? '+' : ''}{resultIm.toFixed(3)}i
          </div>
        </motion.div>

        {n > 0 && (
          <div style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--gold)', fontWeight: 600, marginBottom: '4px' }}>{n}th Roots (angles):</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {roots.map((rt, i) => (
                <span key={i} className="math-font" style={{ padding: '3px 8px', background: 'rgba(248,196,72,0.12)', color: 'var(--gold)', borderRadius: '4px', fontSize: '0.75rem' }}>
                  {rt.angle.toFixed(0)}°
                </span>
              ))}
            </div>
          </div>
        )}

        <FormulaCard title="De Moivre's Theorem" formula="[r(cos θ + i sin θ)]ⁿ = rⁿ(cos nθ + i sin nθ)" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <defs>
            <filter id="dm-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <line x1={0} y1={cy} x2={w} y2={cy} stroke="var(--border)" strokeWidth="1" />
          <line x1={cx} y1={0} x2={cx} y2={h} stroke="var(--border)" strokeWidth="1" />

          {/* Original modulus circle */}
          <circle cx={cx} cy={cy} r={r * scale} fill="none" stroke="var(--teal)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />

          {/* Result modulus circle */}
          {resultR * scale <= 170 && (
            <circle cx={cx} cy={cy} r={resultR * scale} fill="none" stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
          )}

          {/* Nth roots polygon */}
          {n > 0 && roots.length > 1 && (
            <polygon
              points={roots.map(rt => `${mx(rt.re)},${my(rt.im)}`).join(' ')}
              fill="rgba(248,196,72,0.08)" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="4 3"
            />
          )}

          {/* Nth roots */}
          {n > 0 && roots.map((rt, i) => (
            <g key={i}>
              <line x1={cx} y1={cy} x2={mx(rt.re)} y2={my(rt.im)} stroke="var(--gold)" strokeWidth="1.5" opacity="0.5" />
              <circle cx={mx(rt.re)} cy={my(rt.im)} r={5} fill="var(--gold)">
                <animate attributeName="r" values="4;7;4" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            </g>
          ))}

          {/* Original z */}
          <line x1={cx} y1={cy} x2={mx(origRe)} y2={my(origIm)} stroke="var(--teal)" strokeWidth="2.5" filter="url(#dm-glow)" />
          <circle cx={mx(origRe)} cy={my(origIm)} r={6} fill="var(--teal)" />
          <text x={mx(origRe) + 10} y={my(origIm) - 8} fill="var(--teal)" fontSize="11" fontWeight="bold">z</text>

          {/* Result zⁿ */}
          {Math.abs(resultRe) * scale <= 170 && Math.abs(resultIm) * scale <= 170 && (
            <>
              <line x1={cx} y1={cy} x2={mx(resultRe)} y2={my(resultIm)} stroke="var(--coral)" strokeWidth="3" filter="url(#dm-glow)" />
              <circle cx={mx(resultRe)} cy={my(resultIm)} r={7} fill="var(--coral)" />
              <circle cx={mx(resultRe)} cy={my(resultIm)} r={7} fill="none" stroke="var(--coral)" strokeWidth="1.5">
                <animate attributeName="r" from="7" to="16" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
              </circle>
              <text x={mx(resultRe) + 10} y={my(resultIm) - 8} fill="var(--coral)" fontSize="11" fontWeight="bold">zⁿ</text>
            </>
          )}

          <circle cx={cx} cy={cy} r={3} fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
};
