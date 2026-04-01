import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const EllipseSVG = ({ mapX, mapY, a, b, traceAngle, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const c = Math.sqrt(Math.max(a * a - b * b, 0));
  const steps = 400;

  // Ellipse path
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    points.push([a * Math.cos(t), b * Math.sin(t)]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');

  // Animated tracer point on ellipse
  const tRad = (traceAngle * Math.PI) / 180;
  const tx = a * Math.cos(tRad);
  const ty = b * Math.sin(tRad);

  // Distances from tracer to each focus
  const d1 = Math.sqrt((tx - c) ** 2 + ty * ty);
  const d2 = Math.sqrt((tx + c) ** 2 + ty * ty);

  // Trail: recent tracer positions (fading dots)
  const trailCount = 20;
  const trail = [];
  for (let i = 1; i <= trailCount; i++) {
    const tA = ((traceAngle - i * 3) * Math.PI) / 180;
    trail.push([a * Math.cos(tA), b * Math.sin(tA)]);
  }

  return (
    <g>
      <defs>
        <filter id="ellipse-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ellipse-fill-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Filled ellipse */}
      <path d={pathD} fill="url(#ellipse-fill-grad)" stroke="none" />

      {/* Major & minor axes */}
      <line x1={mapX(-a)} y1={mapY(0)} x2={mapX(a)} y2={mapY(0)} stroke="var(--border2)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
      <line x1={mapX(0)} y1={mapY(-b)} x2={mapX(0)} y2={mapY(b)} stroke="var(--border2)" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />

      {/* String lines from tracer to both foci (sum = 2a visualization) */}
      <line x1={mapX(-c)} y1={mapY(0)} x2={mapX(tx)} y2={mapY(ty)} stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 3" opacity="0.85">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </line>
      <line x1={mapX(c)} y1={mapY(0)} x2={mapX(tx)} y2={mapY(ty)} stroke="var(--coral)" strokeWidth="2" strokeDasharray="4 3" opacity="0.85">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />
      </line>

      {/* Ellipse curve with glow */}
      <path d={pathD} fill="none" stroke="var(--teal)" strokeWidth="3" filter="url(#ellipse-glow)" />

      {/* Trail dots */}
      {trail.map((p, i) => (
        <circle key={i} cx={mapX(p[0])} cy={mapY(p[1])} r={2.5} fill="var(--teal)" opacity={0.5 - i * 0.02} />
      ))}

      {/* Foci with dual-ring pulse */}
      {[-c, c].map((fx, idx) => (
        <g key={idx}>
          <circle cx={mapX(fx)} cy={mapY(0)} r={6} fill={idx === 0 ? 'var(--gold)' : 'var(--coral)'} />
          <circle cx={mapX(fx)} cy={mapY(0)} r={6} fill="none" stroke={idx === 0 ? 'var(--gold)' : 'var(--coral)'} strokeWidth="2">
            <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Vertices */}
      <circle cx={mapX(-a)} cy={mapY(0)} r={3.5} fill="var(--teal)" />
      <circle cx={mapX(a)} cy={mapY(0)} r={3.5} fill="var(--teal)" />
      <circle cx={mapX(0)} cy={mapY(-b)} r={3.5} fill="var(--teal)" opacity="0.6" />
      <circle cx={mapX(0)} cy={mapY(b)} r={3.5} fill="var(--teal)" opacity="0.6" />

      {/* Center */}
      <circle cx={mapX(0)} cy={mapY(0)} r={3} fill="white" />

      {/* Tracer with ring */}
      <circle cx={mapX(tx)} cy={mapY(ty)} r={9} fill="white" opacity="0.15" />
      <circle cx={mapX(tx)} cy={mapY(ty)} r={6} fill="white" />
    </g>
  );
};

export const EllipseSim = () => {
  const [a, setA] = useState(5);
  const [b, setB] = useState(3);
  const [traceAngle, setTraceAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();

  useEffect(() => {
    if (!isAnimating) return;
    let angle = traceAngle;
    const step = () => {
      angle = (angle + 0.6) % 360;
      setTraceAngle(angle);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const major = Math.max(a, b);
  const minor = Math.min(a, b);
  const c = Math.sqrt(Math.max(major * major - minor * minor, 0));
  const ecc = major > 0 ? c / major : 0;
  const lr = major > 0 ? (2 * minor * minor) / major : 0;

  // Live distance readouts
  const tRad = (traceAngle * Math.PI) / 180;
  const tx = a * Math.cos(tRad);
  const ty = b * Math.sin(tRad);
  const d1 = Math.sqrt((tx + c) ** 2 + ty * ty);
  const d2 = Math.sqrt((tx - c) ** 2 + ty * ty);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Ellipse Explorer</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The <span style={{ color: 'white', fontWeight: 'bold' }}>white point</span> traces the ellipse. Watch how the sum of distances to both foci stays <strong>constant = 2a</strong>.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <MathSlider label="Semi-major (a)" min={1} max={8} step={0.5} value={a} onChange={setA} />
          <MathSlider label="Semi-minor (b)" min={0.5} max={7} step={0.5} value={b} onChange={setB} />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(prev => !prev)} style={{ flex: 1, padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
            {isAnimating ? '⏸  Pause Tracer' : '▶  Animate Tracer'}
          </motion.button>
        </div>
        {!isAnimating && (
          <MathSlider label="Tracer angle" min={0} max={360} step={1} value={Math.round(traceAngle)} onChange={setTraceAngle} unit="°" />
        )}

        <FormulaCard
          title="Standard Equation"
          formula={`x²/${(a * a).toFixed(0)} + y²/${(b * b).toFixed(0)} = 1`}
          description={a === b ? '🔵 Eccentricity = 0 → this is a circle!' : undefined}
        />

        {/* Live distance readout */}
        <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Sum of Distances (Live)</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
            <span className="math-font" style={{ color: 'var(--gold)', fontSize: '1rem' }}>{d1.toFixed(2)}</span>
            <span style={{ color: 'var(--text3)' }}>+</span>
            <span className="math-font" style={{ color: 'var(--coral)', fontSize: '1rem' }}>{d2.toFixed(2)}</span>
            <span style={{ color: 'var(--text3)' }}>=</span>
            <span className="math-font" style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}>{(d1 + d2).toFixed(2)}</span>
          </div>
          <div className="math-font" style={{ color: 'var(--teal)', fontSize: '0.85rem', marginTop: '4px' }}>2a = {(2 * a).toFixed(1)}</div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {[
            { label: 'Eccentricity', value: ecc.toFixed(3), color: 'var(--coral)' },
            { label: 'c = √(a²−b²)', value: c.toFixed(2), color: 'var(--gold)' },
            { label: 'Latus Rectum', value: lr.toFixed(2), color: 'var(--teal)' },
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
          <EllipseSVG isSvg a={a} b={b} traceAngle={traceAngle} />
          <HtmlLabel isHtml x={c + 0.5} y={-0.8} style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.8rem' }}>F₁</HtmlLabel>
          <HtmlLabel isHtml x={-c - 0.5} y={-0.8} style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '0.8rem' }}>F₂</HtmlLabel>
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
