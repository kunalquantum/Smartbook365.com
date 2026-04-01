import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const HyperbolaSVG = ({ mapX, mapY, a, b, traceParam, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const c = Math.sqrt(a * a + b * b);
  const steps = 300;

  // Right branch
  const rightBranch = [];
  const leftBranch = [];
  for (let i = -steps / 2; i <= steps / 2; i++) {
    const t = (i / (steps / 2)) * 1.25;
    const secT = 1 / Math.cos(t);
    const tanT = Math.tan(t);
    const rx = a * secT; const ry = b * tanT;
    const lx = -a * secT; const ly = -b * tanT;
    if (Math.abs(rx) <= 9.5 && Math.abs(ry) <= 9.5) rightBranch.push([rx, ry]);
    if (Math.abs(lx) <= 9.5 && Math.abs(ly) <= 9.5) leftBranch.push([lx, ly]);
  }

  const makePath = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');

  // Tracer on right branch
  const secTrace = 1 / Math.cos(traceParam);
  const tanTrace = Math.tan(traceParam);
  const tx = a * secTrace;
  const ty = b * tanTrace;
  const inBounds = Math.abs(tx) <= 9.5 && Math.abs(ty) <= 9.5;

  // Distances from tracer to foci
  const d1 = Math.sqrt((tx - c) ** 2 + ty * ty);
  const d2 = Math.sqrt((tx + c) ** 2 + ty * ty);

  // Trail
  const trailCount = 15;
  const trail = [];
  for (let i = 1; i <= trailCount; i++) {
    const tt = traceParam - i * 0.03;
    if (Math.abs(tt) < 1.25) {
      const sx = a / Math.cos(tt);
      const sy = b * Math.tan(tt);
      if (Math.abs(sx) <= 9.5 && Math.abs(sy) <= 9.5) trail.push([sx, sy]);
    }
  }

  // Asymptote slope
  const asSlope = b / a;

  return (
    <g>
      <defs>
        <filter id="hyp-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Asymptotes with subtle animation */}
      <line x1={mapX(-9)} y1={mapY(-9 * asSlope)} x2={mapX(9)} y2={mapY(9 * asSlope)} stroke="var(--text3)" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="26" dur="3s" repeatCount="indefinite" />
      </line>
      <line x1={mapX(-9)} y1={mapY(9 * asSlope)} x2={mapX(9)} y2={mapY(-9 * asSlope)} stroke="var(--text3)" strokeWidth="1.5" strokeDasharray="8 5" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="26" dur="3s" repeatCount="indefinite" />
      </line>

      {/* Transverse axis */}
      <line x1={mapX(-a)} y1={mapY(0)} x2={mapX(a)} y2={mapY(0)} stroke="var(--border2)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />

      {/* Distance lines from tracer to foci */}
      {inBounds && (
        <>
          <line x1={mapX(tx)} y1={mapY(ty)} x2={mapX(c)} y2={mapY(0)} stroke="var(--coral)" strokeWidth="2" strokeDasharray="4 3" opacity="0.8">
            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </line>
          <line x1={mapX(tx)} y1={mapY(ty)} x2={mapX(-c)} y2={mapY(0)} stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 3" opacity="0.8">
            <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
          </line>
        </>
      )}

      {/* Hyperbola branches with glow */}
      <path d={makePath(rightBranch)} fill="none" stroke="#7c8cf8" strokeWidth="3" filter="url(#hyp-glow)" />
      <path d={makePath(leftBranch)} fill="none" stroke="#7c8cf8" strokeWidth="3" filter="url(#hyp-glow)" />

      {/* Trail */}
      {trail.map((p, i) => (
        <circle key={i} cx={mapX(p[0])} cy={mapY(p[1])} r={2} fill="#7c8cf8" opacity={0.5 - i * 0.03} />
      ))}

      {/* Foci with pulse */}
      {[c, -c].map((fx, idx) => (
        <g key={idx}>
          <circle cx={mapX(fx)} cy={mapY(0)} r={6} fill={idx === 0 ? 'var(--coral)' : 'var(--gold)'} />
          <circle cx={mapX(fx)} cy={mapY(0)} r={6} fill="none" stroke={idx === 0 ? 'var(--coral)' : 'var(--gold)'} strokeWidth="2">
            <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Vertices */}
      <circle cx={mapX(a)} cy={mapY(0)} r={4} fill="#7c8cf8" />
      <circle cx={mapX(-a)} cy={mapY(0)} r={4} fill="#7c8cf8" />

      {/* Center */}
      <circle cx={mapX(0)} cy={mapY(0)} r={3} fill="white" />

      {/* Tracer with ring */}
      {inBounds && (
        <>
          <circle cx={mapX(tx)} cy={mapY(ty)} r={9} fill="white" opacity="0.15" />
          <circle cx={mapX(tx)} cy={mapY(ty)} r={6} fill="white" />
        </>
      )}
    </g>
  );
};

export const HyperbolaSim = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const [traceParam, setTraceParam] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();
  const dirRef = useRef(1);

  useEffect(() => {
    if (!isAnimating) return;
    let t = traceParam;
    const step = () => {
      t += 0.008 * dirRef.current;
      if (t > 1.15) dirRef.current = -1;
      if (t < -1.15) dirRef.current = 1;
      setTraceParam(t);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const c = Math.sqrt(a * a + b * b);
  const ecc = a > 0 ? c / a : 1;
  const lr = a > 0 ? (2 * b * b) / a : 0;

  // Live difference readout
  const secT = 1 / Math.cos(traceParam);
  const tanT = Math.tan(traceParam);
  const tx = a * secT;
  const ty = b * tanT;
  const d1 = Math.sqrt((tx - c) ** 2 + ty * ty);
  const d2 = Math.sqrt((tx + c) ** 2 + ty * ty);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: '#7c8cf8', marginBottom: '8px' }}>Hyperbola Explorer</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Watch the <span style={{ color: 'white', fontWeight: 'bold' }}>tracer</span> ride along one branch. The <strong>difference</strong> of distances to both foci stays constant = 2a.
            <br />The <span style={{ color: 'var(--text3)' }}>dashed lines</span> are the asymptotes.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <MathSlider label="Transverse (a)" min={1} max={6} step={0.5} value={a} onChange={setA} />
          <MathSlider label="Conjugate (b)" min={0.5} max={6} step={0.5} value={b} onChange={setB} />
        </div>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(prev => !prev)} style={{ padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
          {isAnimating ? '⏸  Pause Tracer' : '▶  Animate Tracer'}
        </motion.button>
        {!isAnimating && (
          <MathSlider label="Tracer param" min={-1.15} max={1.15} step={0.01} value={traceParam} onChange={setTraceParam} />
        )}

        <FormulaCard
          title="Standard Equation"
          formula={`x²/${(a * a).toFixed(0)} − y²/${(b * b).toFixed(0)} = 1`}
        />

        {/* Live difference readout */}
        <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Difference of Distances (Live)</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
            <span className="math-font" style={{ color: 'var(--gold)', fontSize: '1rem' }}>{d2.toFixed(2)}</span>
            <span style={{ color: 'var(--text3)' }}>−</span>
            <span className="math-font" style={{ color: 'var(--coral)', fontSize: '1rem' }}>{d1.toFixed(2)}</span>
            <span style={{ color: 'var(--text3)' }}>=</span>
            <span className="math-font" style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.abs(d2 - d1).toFixed(2)}</span>
          </div>
          <div className="math-font" style={{ color: '#7c8cf8', fontSize: '0.85rem', marginTop: '4px' }}>2a = {(2 * a).toFixed(1)}</div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          {[
            { label: 'Eccentricity', value: ecc.toFixed(3), color: 'var(--coral)' },
            { label: 'c = √(a²+b²)', value: c.toFixed(2), color: 'var(--gold)' },
            { label: 'Latus Rectum', value: lr.toFixed(2), color: 'var(--teal)' },
            { label: 'Asymptote slope', value: `±${(b / a).toFixed(2)}`, color: 'var(--text2)' },
          ].map(item => (
            <motion.div key={item.label} whileHover={{ scale: 1.04 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '3px' }}>{item.label}</div>
              <div className="math-font" style={{ color: item.color, fontSize: '1rem', fontWeight: 'bold' }}>{item.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-10, 10]} range={[-10, 10]}>
          <HyperbolaSVG isSvg a={a} b={b} traceParam={traceParam} />
          <HtmlLabel isHtml x={c + 0.5} y={-0.8} style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.8rem' }}>F₁</HtmlLabel>
          <HtmlLabel isHtml x={-c - 0.5} y={-0.8} style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem' }}>F₂</HtmlLabel>
          <HtmlLabel isHtml x={6} y={6 * b / a + 0.6} style={{ color: 'var(--text3)', fontSize: '0.7rem' }}>y = (b/a)x</HtmlLabel>
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
