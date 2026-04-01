import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

export const LimitMeaning = () => {
  const [delta, setDelta] = useState(0.5);
  const [zoom, setZoom] = useState(1);
  const a = 2, L = 4; // f(x) = x^2

  const epsilon = (a + delta)**2 - L;
  const w = 400, h = 300;
  const padding = 40;

  // Coordinate mapping
  const getX = (val) => padding + (val * 60 * zoom);
  const getY = (val) => h - padding - (val * 15 * zoom);

  return (
    <motion.div className="glass-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
          <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>The Meaning of Limit (&epsilon;-&delta;)</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            For every <strong>&epsilon; &gt; 0</strong> (no matter how small), there exists a <strong>&delta; &gt; 0</strong> such that if 0 &lt; |x - a| &lt; &delta;, then |f(x) - L| &lt; &epsilon;.
          </p>
        </motion.div>

        <MathSlider label="Delta (&delta;)" min={0.05} max={1} step={0.05} value={delta} onChange={setDelta} />

        <div style={{ display: 'flex', gap: '8px' }}>
           <button onClick={() => setZoom(zoom === 1 ? 2.5 : 1)} style={{ flex: 1, padding: '12px', background: zoom > 1 ? 'var(--gold)' : 'var(--bg4)', color: zoom > 1 ? 'black' : 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
             {zoom > 1 ? '🔍 Zoom Out' : '🔍 Zoom into Neighborhood'}
           </button>
        </div>

        <motion.div layout style={{ background: 'var(--bg4)', padding: '16px', borderRadius: '12px', borderLeft: '4px solid var(--gold)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text2)' }}>
            <strong>&delta; = {delta.toFixed(2)}</strong> &rarr; <strong>&epsilon; &asymp; {epsilon.toFixed(2)}</strong>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
            As &delta; shrinks, the neighborhood around L (4) also shrinks.
          </div>
        </motion.div>

        <FormulaCard title="Formal Definition" formula="0 < |x - a| < \delta \implies |f(x) - L| < \epsilon" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, background: 'var(--bg2)', borderRadius: '16px', padding: '10px', overflow: 'hidden', position: 'relative' }}>
        <svg width={w} height={h} style={{ background: 'var(--bg2)' }}>
          {/* Axes */}
          <line x1={padding} y1={h - padding} x2={w - 10} y2={h - padding} stroke="white" strokeWidth="1" />
          <line x1={padding} y1={h - padding} x2={padding} y2={10} stroke="white" strokeWidth="1" />

          {/* Function f(x) = x^2 */}
          <path d={Array.from({ length: 50 }, (_, i) => {
            const vx = (i / 10);
            return `${i === 0 ? 'M' : 'L'} ${getX(vx)} ${getY(vx * vx)}`;
          }).join(' ')} fill="none" stroke="var(--gold)" strokeWidth="2" opacity="0.6" />

          {/* Neighborhood Delta around a=2 */}
          <rect x={getX(a - delta)} y={padding} width={getX(a + delta) - getX(a - delta)} height={h - 2 * padding} fill="rgba(255, 215, 0, 0.1)" />
          
          {/* Neighborhood Epsilon around L=4 */}
          <rect x={padding} y={getY((a+delta)**2)} width={w - 2 * padding} height={getY((a-delta)**2) - getY((a+delta)**2)} fill="rgba(255, 127, 80, 0.1)" />

          {/* Highlight point (a, L) */}
          <circle cx={getX(a)} cy={getY(L)} r="4" fill="var(--gold)" />
          <line x1={getX(a)} y1={h - padding} x2={getX(a)} y2={getY(L)} stroke="var(--gold)" strokeDasharray="4" />
          <line x1={padding} y1={getY(L)} x2={getX(a)} y2={getY(L)} stroke="var(--gold)" strokeDasharray="4" />

          {/* Labels */}
          <text x={getX(a)} y={h - padding + 20} fill="var(--gold)" fontSize="10" textAnchor="middle">a=2</text>
          <text x={padding - 15} y={getY(L)} fill="var(--gold)" fontSize="10" textAnchor="end">L=4</text>
        </svg>
        
        {zoom > 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--gold)' }}>
                ZOOMED 2.5x
            </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
