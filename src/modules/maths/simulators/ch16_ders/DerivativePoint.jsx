import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const DerivativePoint = () => {
  const [point, setPoint] = useState(2);
  const [zoom, setZoom] = useState(1);

  // f(x) = x^2 / 4
  const f = (x) => (x * x) / 4;
  const df = (x) => x / 2;

  const w = 400, h_svg = 300;
  const padding = 50;

  const getX = (val) => padding + (val * 60 * zoom);
  const getY = (val) => h_svg - padding - (f(val) * 40 * zoom);

  const px = getX(point);
  const py = getY(point);
  const slope = df(point);
  const angle = Math.atan(slope) * (180 / Math.PI);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Derivative at a Point</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The derivative <strong>f'(a)</strong> is the <strong>slope</strong> of the tangent line at <strong>x = a</strong>. 
            Zoom in to see how the curve looks like a straight line locally!
          </p>
        </motion.div>

        <MathSlider label="Position a" min={0.1} max={5} step={0.1} value={point} onChange={setPoint} />

        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setZoom(zoom === 1 ? 3 : 1)} style={{ flex: 1, padding: '12px', background: zoom > 1 ? 'var(--gold)' : 'var(--bg4)', color: zoom > 1 ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
             {zoom > 1 ? '🔍 Zoom Out' : '🔍 Local Zoom (Linearity)'}
           </button>
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '20px', borderRadius: '16px', textAlign: 'center', borderLeft: '4px solid var(--gold)' }}>
          <div className="math-font" style={{ fontSize: '1rem', color: 'var(--text3)' }}>
             Slope of Tangent at x={point}:
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--gold)' }}>
             m = {slope.toFixed(3)}
          </div>
          <motion.div animate={{ rotate: -angle }} style={{ display: 'inline-block', width: '30px', height: '4px', background: 'var(--gold)', borderRadius: '2px', marginTop: '10px' }} />
        </motion.div>

        <FormulaCard title="Equation" formula={`y - f(a) = f'(a)(x - a)`} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, background: 'var(--bg2)', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
        <svg width={w} height={h_svg}>
          {/* Grid */}
          <line x1={padding} y1={h_svg-padding} x2={w-10} y2={h_svg-padding} stroke="white" strokeWidth="1" opacity="0.3" />
          <line x1={padding} y1={h_svg-padding} x2={padding} y2={10} stroke="white" strokeWidth="1" opacity="0.3" />

          {/* Curve */}
          <path d={Array.from({ length: 60 }, (_, i) => {
            const vx = (i / 10);
            return `${i === 0 ? 'M' : 'L'} ${getX(vx)} ${getY(vx)}`;
          }).join(' ')} fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.6" />

          {/* Tangent Line */}
          <line 
             x1={getX(point - 1)} 
             y1={getY(point) + slope * 60 * zoom} 
             x2={getX(point + 1)} 
             y2={getY(point) - slope * 60 * zoom} 
             stroke="white" 
             strokeWidth="1.5"
          />

          {/* Rolling Ball */}
          <motion.g animate={{ x: px, y: py, rotate: -angle }}>
             <circle cx="0" cy="-8" r="8" fill="var(--teal)" stroke="white" strokeWidth="2" />
             <line x1="-5" y1="-8" x2="5" y2="-8" stroke="white" strokeWidth="1" />
          </motion.g>

          {/* Labels */}
          <text x={px} y={py + 25} fill="var(--gold)" fontSize="10" textAnchor="middle">a={point}</text>
        </svg>

        <div style={{ position: 'absolute', bottom: 10, right: 10, fontSize: '0.7rem', color: 'var(--text3)' }}>
           Tilt represents rate of change.
        </div>
      </motion.div>
    </motion.div>
  );
};
