import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const TrigLimits = () => {
  const [x, setX] = useState(0.8);
  const [mode, setMode] = useState('squeeze');

  const rad = 150;
  const cx = 50, cy = 200;

  // Points for Squeeze Theorem
  const px = cx + rad * Math.cos(x);
  const py = cy - rad * Math.sin(x);
  const tx = cx + rad;
  const ty = cy - rad * Math.tan(x);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={{ color: 'var(--coral)', marginBottom: '8px' }}>Trigonometric Limits</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            The fundamental limit <strong>sin(x)/x &rarr; 1</strong> is proved using the <em>Squeeze Theorem</em>.
          </p>
        </motion.div>

        <MathSlider label="Angle x (radians)" min={0.01} max={1.2} step={0.01} value={x} onChange={setX} />

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--coral)' }}>
          <div className="math-font" style={{ fontSize: '1.2rem', color: 'white' }}>
             cos(x) &lt; <span style={{ color: 'var(--coral)' }}>sin(x)/x</span> &lt; 1
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text3)', marginTop: '6px' }}>
             Values: {Math.cos(x).toFixed(4)} &lt; {(Math.sin(x)/x).toFixed(4)} &lt; 1.0000
          </div>
        </motion.div>

        <FormulaCard title="Squeeze Result" formula="\lim_{x \to 0} \frac{\sin x}{x} = 1" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', justifyContent: 'center', alignItems: 'center', background: 'var(--bg2)', borderRadius: '16px', padding: '20px' }}>
        <svg width="300" height="250" viewBox="0 0 300 250">
          {/* Unit Circle Arc */}
          <path d={`M ${cx+rad} ${cy} A ${rad} ${rad} 0 0 0 ${cx + rad * Math.cos(1.2)} ${cy - rad * Math.sin(1.2)}`} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="4 2" />
          
          {/* Outer Triangle (Blue/Tan) */}
          <motion.path d={`M ${cx} ${cy} L ${tx} ${cy} L ${tx} ${ty} Z`} fill="rgba(64, 180, 255, 0.15)" stroke="#40b4ff" strokeWidth="2" />
          
          {/* Sector (Orange/x) */}
          <motion.path d={`M ${cx} ${cy} L ${cx + rad} ${cy} A ${rad} ${rad} 0 0 0 ${px} ${py} Z`} fill="rgba(255, 127, 80, 0.2)" stroke="var(--coral)" strokeWidth="1" />
          
          {/* Inner Triangle (Green/Sin) */}
          <motion.path d={`M ${cx} ${cy} L ${px} ${cy} L ${px} ${py} Z`} fill="rgba(78, 205, 196, 0.25)" stroke="var(--teal)" strokeWidth="2" />

          {/* Labels */}
          <line x1={cx} y1={cy} x2={cx+rad+20} y2={cy} stroke="white" strokeWidth="1" />
          <line x1={cx} y1={cy} x2={cx} y2={cy-rad-20} stroke="white" strokeWidth="1" />
          
          <text x={tx + 5} y={ty} fill="#40b4ff" fontSize="10">tan x</text>
          <text x={px + 5} y={py - 5} fill="var(--coral)" fontSize="10">arc x</text>
          <text x={px - 25} y={(cy + py)/2} fill="var(--teal)" fontSize="10">sin x</text>
        </svg>

        <div style={{ display: 'flex', gap: '15px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
              <div style={{ width: 10, height: 10, background: 'rgba(78, 205, 196, 0.4)', borderRadius: '2px' }} /> Inner Tri
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
              <div style={{ width: 10, height: 10, background: 'rgba(255, 127, 80, 0.4)', borderRadius: '2px' }} /> Sector
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem' }}>
              <div style={{ width: 10, height: 10, background: 'rgba(64, 180, 255, 0.4)', borderRadius: '2px' }} /> Outer Tri
           </div>
        </div>

        <p style={{ color: 'var(--text3)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '280px' }}>
          Area(Inner) &le; Area(Sector) &le; Area(Outer) <br/>
          As x &rarr; 0, the green and blue areas "squeeze" the orange sector to 1.
        </p>
      </motion.div>
    </motion.div>
  );
};
