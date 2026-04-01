import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const ConicSVG = ({ mapX, mapY, e, traceAngle, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  // SVG glow filter
  const filterId = 'conic-glow';

  let color = 'var(--gold)';
  if (e < 0.01) color = 'var(--gold)';
  else if (Math.abs(e - 1) < 0.05) color = 'var(--coral)';
  else if (e < 1) color = 'var(--teal)';
  else color = '#7c8cf8';

  // Generate conic points
  const points = [];
  const steps = 400;

  if (e < 0.01) {
    const r = 3;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      points.push([r * Math.cos(t), r * Math.sin(t)]);
    }
  } else if (Math.abs(e - 1) < 0.05) {
    const a = 1.5;
    for (let i = -steps / 2; i <= steps / 2; i++) {
      const t = (i / (steps / 2)) * 7;
      const y = t;
      const x = (y * y) / (4 * a);
      if (x <= 9) points.push([x, y]);
    }
  } else if (e < 1) {
    const a = 5;
    const c = a * e;
    const b = Math.sqrt(a * a - c * c);
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      points.push([a * Math.cos(t), b * Math.sin(t)]);
    }
  } else {
    const a = 2.5;
    const c = a * e;
    const b = Math.sqrt(c * c - a * a);
    for (let i = -steps / 2; i <= steps / 2; i++) {
      const t = (i / (steps / 2)) * 1.25;
      const x1 = a / Math.cos(t);
      const y1 = b * Math.tan(t);
      if (Math.abs(x1) <= 9.5 && Math.abs(y1) <= 9.5) points.push([x1, y1]);
    }
  }

  const validPoints = points.filter(p => Math.abs(p[0]) < 9.5 && Math.abs(p[1]) < 9.5);
  const pathD = validPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');

  // Animated tracer point on the curve
  const traceIdx = Math.floor((traceAngle / 360) * validPoints.length) % validPoints.length;
  const tracePoint = validPoints[Math.max(0, traceIdx)] || [0, 0];

  // Focus positions for directrix line demonstration
  let focusPos = null;
  let directrixX = null;

  if (e >= 0.01 && e < 1) {
    focusPos = [5 * e, 0];
    directrixX = 5 / e;
  } else if (Math.abs(e - 1) < 0.05) {
    focusPos = [1.5, 0];
    directrixX = -1.5;
  } else if (e > 1) {
    focusPos = [2.5 * e, 0];
    directrixX = 2.5 / e;
  }

  // Distance lines from trace point to focus and directrix
  const showDistLines = focusPos && tracePoint;
  const distToFocus = focusPos ? Math.sqrt((tracePoint[0] - focusPos[0]) ** 2 + (tracePoint[1] - focusPos[1]) ** 2) : 0;
  const distToDir = directrixX !== null ? Math.abs(tracePoint[0] - directrixX) : 0;

  return (
    <g>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="conic-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Directrix line */}
      {directrixX !== null && (
        <line x1={mapX(directrixX)} y1={mapY(-10)} x2={mapX(directrixX)} y2={mapY(10)} stroke="var(--text3)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
      )}

      {/* Distance lines: focus and directrix */}
      {showDistLines && (
        <>
          <line x1={mapX(tracePoint[0])} y1={mapY(tracePoint[1])} x2={mapX(focusPos[0])} y2={mapY(focusPos[1])} stroke="var(--coral)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
          <line x1={mapX(tracePoint[0])} y1={mapY(tracePoint[1])} x2={mapX(directrixX)} y2={mapY(tracePoint[1])} stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
        </>
      )}

      {/* Main curve with glow */}
      <path d={pathD} fill="none" stroke="url(#conic-grad)" strokeWidth="3" filter={`url(#${filterId})`} />

      {/* Focus point with pulse */}
      {focusPos && (
        <>
          <circle cx={mapX(focusPos[0])} cy={mapY(focusPos[1])} r={5} fill={color} />
          <circle cx={mapX(focusPos[0])} cy={mapY(focusPos[1])} r={5} fill="none" stroke={color} strokeWidth="2">
            <animate attributeName="r" from="5" to="18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Animated tracer point on curve */}
      <circle cx={mapX(tracePoint[0])} cy={mapY(tracePoint[1])} r={7} fill="white" opacity="0.9" />
      <circle cx={mapX(tracePoint[0])} cy={mapY(tracePoint[1])} r={4} fill={color} />

      {/* Center / origin */}
      <circle cx={mapX(0)} cy={mapY(0)} r={3} fill="white" opacity="0.6" />
    </g>
  );
};

export const ConicTypes = () => {
  const [e, setE] = useState(0.6);
  const [traceAngle, setTraceAngle] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();

  useEffect(() => {
    if (!isAnimating) return;
    let angle = traceAngle;
    const step = () => {
      angle = (angle + 0.8) % 360;
      setTraceAngle(angle);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  let type = 'Circle';
  let color = 'var(--gold)';
  let condition = 'e = 0';
  let description = 'All points equidistant from center.';
  if (e < 0.01) { type = 'Circle'; color = 'var(--gold)'; condition = 'e = 0'; description = 'All points equidistant from center.'; }
  else if (Math.abs(e - 1) < 0.05) { type = 'Parabola'; color = 'var(--coral)'; condition = 'e = 1'; description = 'Distance to focus = distance to directrix.'; }
  else if (e < 1) { type = 'Ellipse'; color = 'var(--teal)'; condition = '0 < e < 1'; description = 'Ratio of distances < 1, a closed curve.'; }
  else { type = 'Hyperbola'; color = '#7c8cf8'; condition = 'e > 1'; description = 'Ratio of distances > 1, two open branches.'; }

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Definition & Types of Conics</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A conic section is defined by its <strong>eccentricity (e)</strong>. The <span style={{ color: 'white' }}>white tracer</span> shows a point moving on the curve.
            <br />The <span style={{ color: 'var(--coral)' }}>red</span> line shows distance to focus, <span style={{ color: 'var(--gold)' }}>gold</span> line shows distance to directrix.
          </p>
        </motion.div>

        <MathSlider label="Eccentricity (e)" min={0} max={2} step={0.05} value={e} onChange={setE} />

        <button onClick={() => setIsAnimating(prev => !prev)} style={{ padding: '10px 16px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
          {isAnimating ? '⏸  Pause Tracer' : '▶  Animate Tracer'}
        </button>

        <AnimatePresence mode="wait">
          <motion.div key={type} initial={{ opacity: 0, scale: 0.95, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -8 }} transition={{ duration: 0.3 }} style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '12px', textAlign: 'center', borderLeft: `4px solid ${color}` }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '1px' }}>Conic Type</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: color }}>{type}</div>
            <div className="math-font" style={{ color: 'var(--text2)', marginTop: '4px', fontSize: '1.1rem' }}>{condition}</div>
            <div style={{ color: 'var(--text3)', marginTop: '6px', fontSize: '0.85rem' }}>{description}</div>
          </motion.div>
        </AnimatePresence>

        <FormulaCard
          title="Conic Definition"
          formula="PF / PM = e"
          description="PF = dist to focus, PM = dist to directrix"
        />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-10, 10]} range={[-10, 10]}>
          <ConicSVG isSvg e={e} traceAngle={traceAngle} />
          <HtmlLabel isHtml x={0} y={-8.5} style={{ color: color, fontWeight: 'bold', fontSize: '0.9rem' }}>{type} (e={e.toFixed(2)})</HtmlLabel>
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
