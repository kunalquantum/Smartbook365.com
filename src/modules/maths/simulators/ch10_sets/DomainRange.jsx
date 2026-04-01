import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { FormulaCard } from '../../components/ui/FormulaCard';

const PRESETS = [
  { key: 'linear', label: 'f(x) = 2x + 1', fn: x => 2 * x + 1, domain: 'ℝ', range: 'ℝ', color: 'var(--teal)' },
  { key: 'quadratic', label: 'f(x) = x²', fn: x => x * x, domain: 'ℝ', range: '[0, ∞)', color: 'var(--gold)' },
  { key: 'sqrt', label: 'f(x) = √x', fn: x => x >= 0 ? Math.sqrt(x) : null, domain: '[0, ∞)', range: '[0, ∞)', color: 'var(--coral)' },
  { key: 'sine', label: 'f(x) = sin x', fn: x => Math.sin(x), domain: 'ℝ', range: '[−1, 1]', color: '#7c8cf8' },
  { key: 'recip', label: 'f(x) = 1/x', fn: x => x !== 0 ? 1 / x : null, domain: 'ℝ − {0}', range: 'ℝ − {0}', color: 'var(--teal)' },
  { key: 'exp', label: 'f(x) = eˣ', fn: x => Math.exp(x), domain: 'ℝ', range: '(0, ∞)', color: 'var(--gold)' },
];

const DomainRangeSVG = ({ mapX, mapY, fn, color, traceX, isSvg, minX, maxX }) => {
  if (!isSvg || !mapX || !mapY) return null;

  const points = [];
  const steps = 400;
  for (let i = 0; i <= steps; i++) {
    const x = minX + (i / steps) * (maxX - minX);
    const y = fn(x);
    if (y !== null && !isNaN(y) && Math.abs(y) <= 10) points.push([x, y]);
  }

  const segments = [];
  let current = [];
  for (let i = 0; i < points.length; i++) {
    if (i > 0 && Math.abs(points[i][1] - points[i - 1][1]) > 5) {
      if (current.length > 1) segments.push(current);
      current = [points[i]];
    } else {
      current.push(points[i]);
    }
  }
  if (current.length > 1) segments.push(current);

  const ty = fn(traceX);
  const validTrace = ty !== null && !isNaN(ty) && Math.abs(ty) <= 10;

  return (
    <g>
      <defs>
        <filter id="dr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Domain highlight on x-axis */}
      <rect x={mapX(minX)} y={mapY(0) - 2} width={mapX(maxX) - mapX(minX)} height={4} fill="var(--teal)" opacity="0.3" rx={2} />

      {/* Curve */}
      {segments.map((seg, si) => {
        const d = seg.map((p, i) => `${i === 0 ? 'M' : 'L'} ${mapX(p[0])} ${mapY(p[1])}`).join(' ');
        return <path key={si} d={d} fill="none" stroke={color} strokeWidth="3" filter="url(#dr-glow)" />;
      })}

      {/* Vertical tracer line x → f(x) */}
      {validTrace && (
        <>
          <line x1={mapX(traceX)} y1={mapY(0)} x2={mapX(traceX)} y2={mapY(ty)} stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
          <line x1={mapX(0)} y1={mapY(ty)} x2={mapX(traceX)} y2={mapY(ty)} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />

          {/* Trace dot on x-axis */}
          <circle cx={mapX(traceX)} cy={mapY(0)} r={5} fill="var(--teal)" />

          {/* Trace dot on curve */}
          <circle cx={mapX(traceX)} cy={mapY(ty)} r={7} fill="white" />
          <circle cx={mapX(traceX)} cy={mapY(ty)} r={7} fill="none" stroke="white" strokeWidth="1.5">
            <animate attributeName="r" from="7" to="14" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>

          {/* Trace dot on y-axis (range) */}
          <circle cx={mapX(0)} cy={mapY(ty)} r={5} fill={color} />
        </>
      )}
    </g>
  );
};

export const DomainRange = () => {
  const [activeKey, setActiveKey] = useState('quadratic');
  const [traceX, setTraceX] = useState(2);
  const [isAnimating, setIsAnimating] = useState(true);
  const rafRef = useRef();
  const dirRef = useRef(1);

  const info = PRESETS.find(f => f.key === activeKey);

  useEffect(() => {
    if (!isAnimating) return;
    let x = traceX;
    const step = () => {
      x += 0.03 * dirRef.current;
      if (x > 7) dirRef.current = -1;
      if (x < -7) dirRef.current = 1;
      setTraceX(x);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isAnimating]);

  const ty = info.fn(traceX);
  const validY = ty !== null && !isNaN(ty) && Math.abs(ty) <= 10;

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Domain, Co-domain & Range</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The <span style={{ color: 'var(--teal)' }}>teal dot</span> sweeps the domain (x-axis). The <span style={{ color: 'white' }}>white dot</span> traces f(x), and the <span style={{ color: info.color }}>colored dot</span> shows the range projection on y-axis.
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
          {PRESETS.map(f => (
            <motion.button key={f.key} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setActiveKey(f.key)} style={{ padding: '8px 6px', background: activeKey === f.key ? f.color : 'var(--bg4)', color: activeKey === f.key ? 'white' : 'var(--text3)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem', transition: 'all 0.3s' }}>
              {f.label}
            </motion.button>
          ))}
        </div>

        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setIsAnimating(p => !p)} style={{ padding: '10px', background: isAnimating ? 'var(--coral)' : 'var(--teal)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.3s' }}>
          {isAnimating ? '⏸  Pause Sweep' : '▶  Sweep Domain'}
        </motion.button>

        {/* Live readout */}
        <motion.div layout style={{ background: 'var(--bg4)', padding: '14px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'var(--teal)', textTransform: 'uppercase' }}>x (Domain)</div>
              <div className="math-font" style={{ color: 'var(--teal)', fontSize: '1.2rem', fontWeight: 'bold' }}>{traceX.toFixed(2)}</div>
            </div>
            <span style={{ color: 'var(--text3)', fontSize: '1.4rem' }}>→</span>
            <div>
              <div style={{ fontSize: '0.6rem', color: info.color, textTransform: 'uppercase' }}>f(x) (Range)</div>
              <div className="math-font" style={{ color: info.color, fontSize: '1.2rem', fontWeight: 'bold' }}>{validY ? ty.toFixed(2) : '—'}</div>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center', borderLeft: '3px solid var(--teal)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Domain</div>
            <div className="math-font" style={{ color: 'var(--teal)', fontWeight: 'bold', fontSize: '1rem' }}>{info.domain}</div>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} style={{ background: 'var(--bg4)', padding: '10px', borderRadius: '10px', textAlign: 'center', borderLeft: `3px solid ${info.color}` }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text3)', textTransform: 'uppercase' }}>Range</div>
            <div className="math-font" style={{ color: info.color, fontWeight: 'bold', fontSize: '1rem' }}>{info.range}</div>
          </motion.div>
        </div>

        <FormulaCard title={info.label} formula="f: Domain → Co-domain" description={`Domain: ${info.domain}, Range: ${info.range}`} />
      </div>

      <motion.div key={activeKey} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={360} height={360} domain={[-8, 8]} range={[-8, 8]}>
          <DomainRangeSVG isSvg fn={info.fn} color={info.color} traceX={traceX} />
          {validY && <HtmlLabel isHtml x={traceX + 0.5} y={ty + 0.5} style={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem' }}>({traceX.toFixed(1)}, {ty.toFixed(1)})</HtmlLabel>}
        </GraphCanvas>
      </motion.div>
    </motion.div>
  );
};
