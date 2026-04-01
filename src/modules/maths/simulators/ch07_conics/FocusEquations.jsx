import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const FocusSVG = ({ mapX, mapY, conic, variant, param, traceVal, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const points = [];
  const steps = 300;
  const a = param;

  if (conic === 'parabola') {
    const fourA = 4 * a;
    for (let i = -steps; i <= steps; i++) {
      const t = (i / steps) * 8;
      let x, y;
      if (variant === 0) { y = t; x = t * t / fourA; }
      else if (variant === 1) { y = t; x = -t * t / fourA; }
      else if (variant === 2) { x = t; y = t * t / fourA; }
      else { x = t; y = -t * t / fourA; }
      if (Math.abs(x) <= 9.5 && Math.abs(y) <= 9.5) points.push([x, y]);
    }
  } else if (conic === 'ellipse') {
    const b = a * 0.6;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      if (variant === 0) points.push([a * Math.cos(t), b * Math.sin(t)]);
      else points.push([b * Math.cos(t), a * Math.sin(t)]);
    }
  } else {
    const b = a * 0.7;
    // Both branches
    for (let i = -steps / 2; i <= steps / 2; i++) {
      const t = (i / (steps / 2)) * 1.2;
      const secT = 1 / Math.cos(t);
      const tanT = Math.tan(t);
      if (variant === 0) {
        const rx = a * secT, ry = b * tanT;
        if (Math.abs(rx) <= 9.5 && Math.abs(ry) <= 9.5) points.push([rx, ry]);
      } else {
        const rx = b * tanT, ry = a * secT;
        if (Math.abs(rx) <= 9.5 && Math.abs(ry) <= 9.5) points.push([rx, ry]);
      }
    }
    // Second branch
    for (let i = -steps / 2; i <= steps / 2; i++) {
      const t = (i / (steps / 2)) * 1.2;
      const secT = 1 / Math.cos(t);
      const tanT = Math.tan(t);
      if (variant === 0) {
        const rx = -a * secT, ry = -b * tanT;
        if (Math.abs(rx) <= 9.5 && Math.abs(ry) <= 9.5) points.push([rx, ry]);
      } else {
        const rx = -b * tanT, ry = -a * secT;
        if (Math.abs(rx) <= 9.5 && Math.abs(ry) <= 9.5) points.push([rx, ry]);
      }
    }
  }

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');

  // Compute focus positions
  let foci = [];
  let dirLine = null;
  const b = conic === 'ellipse' ? a * 0.6 : a * 0.7;

  if (conic === 'parabola') {
    if (variant === 0) { foci = [[a, 0]]; dirLine = { x1: -a, y1: -10, x2: -a, y2: 10 }; }
    else if (variant === 1) { foci = [[-a, 0]]; dirLine = { x1: a, y1: -10, x2: a, y2: 10 }; }
    else if (variant === 2) { foci = [[0, a]]; dirLine = { x1: -10, y1: -a, x2: 10, y2: -a }; }
    else { foci = [[0, -a]]; dirLine = { x1: -10, y1: a, x2: 10, y2: a }; }
  } else if (conic === 'ellipse') {
    const cc = Math.sqrt(a * a - b * b);
    if (variant === 0) foci = [[cc, 0], [-cc, 0]];
    else foci = [[0, cc], [0, -cc]];
  } else {
    const cc = Math.sqrt(a * a + b * b);
    if (variant === 0) foci = [[cc, 0], [-cc, 0]];
    else foci = [[0, cc], [0, -cc]];
  }

  // Tracer on curve
  let tx = 0, ty = 0;
  if (conic === 'parabola') {
    const fourA = 4 * a;
    const t = traceVal;
    if (variant === 0) { ty = t; tx = t * t / fourA; }
    else if (variant === 1) { ty = t; tx = -t * t / fourA; }
    else if (variant === 2) { tx = t; ty = t * t / fourA; }
    else { tx = t; ty = -t * t / fourA; }
  } else if (conic === 'ellipse') {
    const tRad = traceVal;
    if (variant === 0) { tx = a * Math.cos(tRad); ty = b * Math.sin(tRad); }
    else { tx = b * Math.cos(tRad); ty = a * Math.sin(tRad); }
  } else {
    const t = traceVal * 1.1;
    if (Math.abs(t) < 1.25) {
      const secT = 1 / Math.cos(t);
      const tanT = Math.tan(t);
      if (variant === 0) { tx = a * secT; ty = b * tanT; }
      else { tx = b * tanT; ty = a * secT; }
    }
  }
  const tracerInBounds = Math.abs(tx) <= 9.5 && Math.abs(ty) <= 9.5;

  const color = conic === 'parabola' ? 'var(--coral)' : conic === 'ellipse' ? 'var(--teal)' : '#7c8cf8';

  return (
    <g>
      <defs>
        <filter id="focus-eq-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Directrix */}
      {dirLine && (
        <line x1={mapX(dirLine.x1)} y1={mapY(dirLine.y1)} x2={mapX(dirLine.x2)} y2={mapY(dirLine.y2)} stroke="var(--text3)" strokeWidth="2" strokeDasharray="6 4" opacity="0.5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
        </line>
      )}

      {/* Asymptotes for hyperbola */}
      {conic === 'hyperbola' && (
        <>
          {variant === 0 ? (
            <>
              <line x1={mapX(-9)} y1={mapY(-9 * b / a)} x2={mapX(9)} y2={mapY(9 * b / a)} stroke="var(--text3)" strokeWidth="1" strokeDasharray="5 4" opacity="0.4" />
              <line x1={mapX(-9)} y1={mapY(9 * b / a)} x2={mapX(9)} y2={mapY(-9 * b / a)} stroke="var(--text3)" strokeWidth="1" strokeDasharray="5 4" opacity="0.4" />
            </>
          ) : (
            <>
              <line x1={mapX(-9 * b / a)} y1={mapY(-9)} x2={mapX(9 * b / a)} y2={mapY(9)} stroke="var(--text3)" strokeWidth="1" strokeDasharray="5 4" opacity="0.4" />
              <line x1={mapX(9 * b / a)} y1={mapY(-9)} x2={mapX(-9 * b / a)} y2={mapY(9)} stroke="var(--text3)" strokeWidth="1" strokeDasharray="5 4" opacity="0.4" />
            </>
          )}
        </>
      )}

      {/* Distance lines from tracer to foci */}
      {tracerInBounds && foci.map((f, i) => (
        <line key={i} x1={mapX(tx)} y1={mapY(ty)} x2={mapX(f[0])} y2={mapY(f[1])} stroke={i === 0 ? 'var(--coral)' : 'var(--gold)'} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7">
          <animate attributeName="stroke-opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
        </line>
      ))}

      {/* Curve */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="3" filter="url(#focus-eq-glow)" />

      {/* Foci with pulse */}
      {foci.map((f, i) => (
        <g key={i}>
          <circle cx={mapX(f[0])} cy={mapY(f[1])} r={5} fill={i === 0 ? 'var(--coral)' : 'var(--gold)'} />
          <circle cx={mapX(f[0])} cy={mapY(f[1])} r={5} fill="none" stroke={i === 0 ? 'var(--coral)' : 'var(--gold)'} strokeWidth="1.5">
            <animate attributeName="r" from="5" to="16" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.7" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Center */}
      <circle cx={mapX(0)} cy={mapY(0)} r={3} fill="white" />

      {/* Tracer */}
      {tracerInBounds && (
        <>
          <circle cx={mapX(tx)} cy={mapY(ty)} r={8} fill="white" opacity="0.15" />
          <circle cx={mapX(tx)} cy={mapY(ty)} r={5} fill="white" />
        </>
      )}
    </g>
  );
};

const VARIANTS = {
  parabola: [
    { label: 'y² = 4ax', desc: 'Opens right' },
    { label: 'y² = −4ax', desc: 'Opens left' },
    { label: 'x² = 4ay', desc: 'Opens up' },
    { label: 'x² = −4ay', desc: 'Opens down' },
  ],
  ellipse: [
    { label: 'x²/a² + y²/b² = 1', desc: 'Major along X-axis' },
    { label: 'x²/b² + y²/a² = 1', desc: 'Major along Y-axis' },
  ],
  hyperbola: [
    { label: 'x²/a² − y²/b² = 1', desc: 'Transverse along X' },
    { label: 'y²/a² − x²/b² = 1', desc: 'Transverse along Y' },
  ],
};

export const FocusEquations = () => {
  const [conic, setConic] = useState('parabola');
  const [variant, setVariant] = useState(0);
  const [param, setParam] = useState(2);
  const [traceVal, setTraceVal] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();
  const dirRef = useRef(1);

  const variants = VARIANTS[conic];

  const handleConicChange = (c) => {
    setConic(c);
    setVariant(0);
    setTraceVal(0);
    dirRef.current = 1;
  };

  // Animate tracer
  useEffect(() => {
    if (!isAnimating) return;
    let t = traceVal;
    const step = () => {
      if (conic === 'parabola') {
        t += 0.04 * dirRef.current;
        if (t > 6) dirRef.current = -1;
        if (t < -6) dirRef.current = 1;
      } else if (conic === 'ellipse') {
        t = (t + 0.015) % (2 * Math.PI);
      } else {
        t += 0.006 * dirRef.current;
        if (t > 1) dirRef.current = -1;
        if (t < -1) dirRef.current = 1;
      }
      setTraceVal(t);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating, conic]);

  // Focus description
  const b = conic === 'ellipse' ? param * 0.6 : param * 0.7;
  let focusText = '';
  if (conic === 'parabola') {
    const aStr = param.toFixed(1);
    if (variant === 0) focusText = `Focus: (${aStr}, 0) · Directrix: x = −${aStr}`;
    else if (variant === 1) focusText = `Focus: (−${aStr}, 0) · Directrix: x = ${aStr}`;
    else if (variant === 2) focusText = `Focus: (0, ${aStr}) · Directrix: y = −${aStr}`;
    else focusText = `Focus: (0, −${aStr}) · Directrix: y = ${aStr}`;
  } else if (conic === 'ellipse') {
    const cc = Math.sqrt(param * param - b * b).toFixed(2);
    const e = (Math.sqrt(param * param - b * b) / param).toFixed(3);
    focusText = variant === 0 ? `Foci: (±${cc}, 0) · e = ${e}` : `Foci: (0, ±${cc}) · e = ${e}`;
  } else {
    const cc = Math.sqrt(param * param + b * b).toFixed(2);
    const e = (Math.sqrt(param * param + b * b) / param).toFixed(3);
    focusText = variant === 0 ? `Foci: (±${cc}, 0) · e = ${e}` : `Foci: (0, ±${cc}) · e = ${e}`;
  }

  const conicColors = { parabola: 'var(--coral)', ellipse: 'var(--teal)', hyperbola: '#7c8cf8' };

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <h3 style={{ color: 'var(--blue)', marginBottom: '8px' }}>Standard Equations & Focus</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            Explore every standard form. The <span style={{ color: 'white', fontWeight: 'bold' }}>tracer</span> animates along the curve while distance lines pulse to the foci.
          </p>
        </motion.div>

        {/* Conic tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['parabola', 'ellipse', 'hyperbola'].map(c => (
            <motion.button key={c} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => handleConicChange(c)} style={{ flex: 1, padding: '10px', background: conic === c ? conicColors[c] : 'var(--bg4)', color: conic === c ? 'white' : 'var(--text2)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.3s ease' }}>
              {c}
            </motion.button>
          ))}
        </div>

        {/* Variant selector with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div key={conic} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ display: 'grid', gridTemplateColumns: `repeat(${variants.length > 2 ? 2 : variants.length}, 1fr)`, gap: '6px' }}>
            {variants.map((v, i) => (
              <motion.button key={i} whileHover={{ scale: 1.03, borderColor: 'var(--border2)' }} onClick={() => setVariant(i)} style={{ padding: '10px 8px', background: variant === i ? 'rgba(255,255,255,0.1)' : 'var(--bg4)', color: variant === i ? 'white' : 'var(--text3)', border: variant === i ? '1px solid var(--border2)' : '1px solid transparent', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center', transition: 'all 0.25s ease' }}>
                <div className="math-font" style={{ fontWeight: 600 }}>{v.label}</div>
                <div style={{ fontSize: '0.7rem', marginTop: '2px', opacity: 0.7 }}>{v.desc}</div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        <MathSlider label="Parameter (a)" min={1} max={5} step={0.5} value={param} onChange={setParam} />

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(prev => !prev)} style={{ padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s ease' }}>
          {isAnimating ? '⏸  Pause Tracer' : '▶  Animate Tracer'}
        </motion.button>

        <FormulaCard
          title={variants[variant].desc}
          formula={variants[variant].label}
          description={focusText}
        />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-10, 10]} range={[-10, 10]}>
          <FocusSVG isSvg conic={conic} variant={variant} param={param} traceVal={traceVal} />
          <HtmlLabel isHtml x={0} y={-8.5} style={{ color: conicColors[conic], fontWeight: 'bold', fontSize: '0.85rem' }}>
            {variants[variant].desc}
          </HtmlLabel>
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
