import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const ParabolaSVG = ({ mapX, mapY, a, orient, traceT, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const fourA = 4 * a;
  const points = [];
  const steps = 300;

  if (orient === 'right') {
    for (let i = -steps; i <= steps; i++) {
      const t = (i / steps) * 8;
      const x = (t * t) / fourA;
      if (Math.abs(x) <= 9.5 && Math.abs(t) <= 9.5) points.push([x, t]);
    }
  } else {
    for (let i = -steps; i <= steps; i++) {
      const t = (i / steps) * 8;
      const y = (t * t) / fourA;
      if (Math.abs(t) <= 9.5 && Math.abs(y) <= 9.5) points.push([t, y]);
    }
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');

  // Tracer on curve
  let tx, ty;
  if (orient === 'right') {
    ty = traceT;
    tx = (ty * ty) / fourA;
  } else {
    tx = traceT;
    ty = (tx * tx) / fourA;
  }

  const focusX = orient === 'right' ? a : 0;
  const focusY = orient === 'right' ? 0 : a;

  // Directrix
  const dirX1 = orient === 'right' ? -a : -10;
  const dirY1 = orient === 'right' ? -10 : -a;
  const dirX2 = orient === 'right' ? -a : 10;
  const dirY2 = orient === 'right' ? 10 : -a;

  // Foot of perpendicular on directrix
  const footX = orient === 'right' ? -a : tx;
  const footY = orient === 'right' ? ty : -a;

  // Latus rectum endpoints
  const lr1 = orient === 'right' ? [a, 2 * a] : [-2 * a, a];
  const lr2 = orient === 'right' ? [a, -2 * a] : [2 * a, a];

  // Distance from tracer to focus
  const distF = Math.sqrt((tx - focusX) ** 2 + (ty - focusY) ** 2);

  return (
    <g>
      <defs>
        <filter id="parabola-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="focus-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--coral)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--coral)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Subtle fill region */}
      <path d={pathD} fill="rgba(247, 103, 89, 0.04)" stroke="none" />

      {/* Directrix with glow */}
      <line x1={mapX(dirX1)} y1={mapY(dirY1)} x2={mapX(dirX2)} y2={mapY(dirY2)} stroke="var(--text3)" strokeWidth="2" strokeDasharray="8 5" opacity="0.6" />

      {/* Axis of symmetry */}
      {orient === 'right' ? (
        <line x1={mapX(-9)} y1={mapY(0)} x2={mapX(9)} y2={mapY(0)} stroke="var(--border2)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      ) : (
        <line x1={mapX(0)} y1={mapY(-9)} x2={mapX(0)} y2={mapY(9)} stroke="var(--border2)" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
      )}

      {/* Latus rectum with glow */}
      <line x1={mapX(lr1[0])} y1={mapY(lr1[1])} x2={mapX(lr2[0])} y2={mapY(lr2[1])} stroke="var(--teal)" strokeWidth="2.5" strokeDasharray="5 3" filter="url(#parabola-glow)" />

      {/* Distance lines: tracer to focus & tracer to directrix */}
      <line x1={mapX(tx)} y1={mapY(ty)} x2={mapX(focusX)} y2={mapY(focusY)} stroke="var(--coral)" strokeWidth="2" strokeDasharray="4 3" opacity="0.85">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </line>
      <line x1={mapX(tx)} y1={mapY(ty)} x2={mapX(footX)} y2={mapY(footY)} stroke="var(--gold)" strokeWidth="2" strokeDasharray="4 3" opacity="0.85">
        <animate attributeName="stroke-opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </line>

      {/* Foot of perpendicular on directrix */}
      <circle cx={mapX(footX)} cy={mapY(footY)} r={3} fill="var(--gold)" opacity="0.8" />

      {/* Main parabola curve */}
      <path d={pathD} fill="none" stroke="var(--coral)" strokeWidth="3" filter="url(#parabola-glow)" />

      {/* Focus with multi-ring pulse */}
      <circle cx={mapX(focusX)} cy={mapY(focusY)} r={20} fill="url(#focus-grad)" opacity="0.15" />
      <circle cx={mapX(focusX)} cy={mapY(focusY)} r={6} fill="var(--coral)" />
      <circle cx={mapX(focusX)} cy={mapY(focusY)} r={6} fill="none" stroke="var(--coral)" strokeWidth="2">
        <animate attributeName="r" from="6" to="20" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.9" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={mapX(focusX)} cy={mapY(focusY)} r={6} fill="none" stroke="var(--coral)" strokeWidth="1.5">
        <animate attributeName="r" from="6" to="20" dur="2s" begin="0.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.7" to="0" dur="2s" begin="0.6s" repeatCount="indefinite" />
      </circle>

      {/* Vertex */}
      <circle cx={mapX(0)} cy={mapY(0)} r={4} fill="white" />

      {/* Tracer with outer ring */}
      <circle cx={mapX(tx)} cy={mapY(ty)} r={8} fill="white" opacity="0.2" />
      <circle cx={mapX(tx)} cy={mapY(ty)} r={5} fill="white" />
    </g>
  );
};

export const ParabolaSim = () => {
  const [a, setA] = useState(1.5);
  const [orient, setOrient] = useState('right');
  const [traceT, setTraceT] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();
  const dirRef = useRef(1);

  useEffect(() => {
    if (!isAnimating) return;
    let t = traceT;
    const step = () => {
      t += 0.04 * dirRef.current;
      if (t > 7) dirRef.current = -1;
      if (t < -7) dirRef.current = 1;
      setTraceT(t);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const focusLabel = orient === 'right' ? `F(${a.toFixed(1)}, 0)` : `F(0, ${a.toFixed(1)})`;
  const directrixEq = orient === 'right' ? `x = −${a.toFixed(1)}` : `y = −${a.toFixed(1)}`;
  const lr = (4 * a).toFixed(1);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Parabola Explorer</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Watch the <span style={{ color: 'white', fontWeight: 'bold' }}>tracer point</span> glide along the parabola.
            <br />The <span style={{ color: 'var(--coral)' }}>red</span> and <span style={{ color: 'var(--gold)' }}>gold</span> dashes show equal distances to focus and directrix.
          </p>
        </motion.div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {['right', 'up'].map(o => (
            <motion.button key={o} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setOrient(o)} style={{ flex: 1, padding: '10px', background: orient === o ? 'var(--coral)' : 'var(--bg4)', color: orient === o ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'background 0.3s' }}>
              {o === 'right' ? 'y² = 4ax' : 'x² = 4ay'}
            </motion.button>
          ))}
        </div>

        <MathSlider label="Focus parameter (a)" min={0.5} max={3} step={0.1} value={a} onChange={setA} />

        <div style={{ display: 'flex', gap: '8px' }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(prev => !prev)} style={{ flex: 1, padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
            {isAnimating ? '⏸  Pause' : '▶  Animate'}
          </motion.button>
          {!isAnimating && (
            <MathSlider label="" min={-7} max={7} step={0.1} value={traceT} onChange={setTraceT} />
          )}
        </div>

        <motion.div layout style={{ display: 'grid', gap: '10px' }}>
          <FormulaCard
            title="Standard Equation"
            formula={orient === 'right' ? `y² = ${(4 * a).toFixed(1)}x` : `x² = ${(4 * a).toFixed(1)}y`}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[
              { label: 'Focus', value: focusLabel, color: 'var(--coral)' },
              { label: 'Directrix', value: directrixEq, color: 'var(--text2)' },
              { label: 'L.R. Length', value: `4a = ${lr}`, color: 'var(--teal)' },
            ].map(item => (
              <motion.div key={item.label} whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.5px' }}>{item.label}</div>
                <div className="math-font" style={{ color: item.color, fontSize: '0.95rem', fontWeight: 'bold' }}>{item.value}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-10, 10]} range={[-10, 10]}>
          <ParabolaSVG isSvg a={a} orient={orient} traceT={traceT} />
          {orient === 'right' ? (
            <>
              <HtmlLabel isHtml x={a + 0.8} y={0.5} style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.85rem' }}>F</HtmlLabel>
              <HtmlLabel isHtml x={-a - 0.2} y={-8.5} style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>Directrix</HtmlLabel>
            </>
          ) : (
            <>
              <HtmlLabel isHtml x={0.6} y={a + 0.5} style={{ color: 'var(--coral)', fontWeight: 'bold', fontSize: '0.85rem' }}>F</HtmlLabel>
              <HtmlLabel isHtml x={5} y={-a + 0.3} style={{ color: 'var(--text3)', fontSize: '0.75rem' }}>Directrix</HtmlLabel>
            </>
          )}
          <HtmlLabel isHtml x={0.5} y={0.5} style={{ color: 'white', fontSize: '0.8rem' }}>V</HtmlLabel>
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
