import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const FirstPrinciple = () => {
  const [h, setH] = useState(1);
  const a = 1.5; // Fixed point P

  // f(x) = x^2 / 2
  const f = (x) => (x * x) / 2;
  const df = (x) => x;

  const w = 400, h_svg = 300;
  const padding = 50;

  const getX = (val) => padding + val * 80;
  const getY = (val) => h_svg - padding - val * 40;

  const px = getX(a);
  const py = getY(f(a));
  const qx = getX(a + h);
  const qy = getY(f(a + h));

  // Secant Line Line: y - y1 = m(x - x1) -> y = m(x - px) + py
  const slope = (f(a + h) - f(a)) / h;
  
  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>First Principle of Derivative</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The derivative at point <strong>P</strong> is the limit of the <strong>slope of the secant line PQ</strong> as point Q moves towards P ($h \to 0$).
          </p>
        </motion.div>

        <MathSlider label="Distance h" min={0.01} max={2} step={0.01} value={h} onChange={setH} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--teal)' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text3)' }}>Secant Slope PQ:</div>
          <div className="math-font" style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
            {(f(a+h) - f(a)).toFixed(3)} / {h.toFixed(3)} = <span style={{ color: 'var(--teal)' }}>{slope.toFixed(4)}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '4px' }}>
            True Derivative f'(1.5) = {df(a).toFixed(4)}
          </div>
        </motion.div>

        <FormulaCard title="The Limit Definition" formula="f'(a) = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, background: 'var(--bg2)', borderRadius: '16px', padding: '10px', minHeight: '300px' }}>
        <svg width={w} height={h_svg}>
          {/* Axes */}
          <line x1={padding} y1={h_svg-padding} x2={w-10} y2={h_svg-padding} stroke="white" strokeWidth="1" />
          <line x1={padding} y1={h_svg-padding} x2={padding} y2={10} stroke="white" strokeWidth="1" />

          {/* Function Path */}
          <path d={Array.from({ length: 40 }, (_, i) => {
             const vx = i / 10;
             return `${i === 0 ? 'M' : 'L'} ${getX(vx)} ${getY(f(vx))}`;
          }).join(' ')} fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.4" />

          {/* Secant/Tangent Line */}
          <line 
             x1={getX(a - 0.5)} 
             y1={py - slope * 40} 
             x2={getX(a + h + 0.5)} 
             y2={qy + slope * 40} 
             stroke="var(--teal)" 
             strokeWidth="2" 
             strokeDasharray={h < 0.1 ? "0" : "4 2"}
          />

          {/* Point P */}
          <circle cx={px} cy={py} r="5" fill="var(--teal)" />
          <text x={px-5} y={py-10} fill="var(--teal)" fontSize="12" textAnchor="end" fontWeight="bold">P(a, f(a))</text>

          {/* Point Q */}
          <motion.circle animate={{ cx: qx, cy: qy }} r="5" fill="var(--coral)" />
          <motion.text animate={{ x: qx+10, y: qy-5 }} fill="var(--coral)" fontSize="12" fontWeight="bold">Q(a+h, f(a+h))</motion.text>

          {/* h bracket visualization */}
          <line x1={px} y1={h_svg-padding+10} x2={qx} y2={h_svg-padding+10} stroke="var(--text3)" strokeWidth="1" />
          <text x={(px+qx)/2} y={h_svg-padding+25} fill="var(--text3)" fontSize="10" textAnchor="middle">h = {h.toFixed(2)}</text>
        </svg>
        
        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', marginTop: '10px' }}>
          As <strong>h shrinks</strong>, point Q slides onto P, and the dashed secant line becomes the solid tangent line!
        </p>
      </motion.div>
    </motion.div>
  );
};
