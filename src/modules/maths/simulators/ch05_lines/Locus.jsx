import React, { useState } from 'react';
import { GraphCanvas } from '../../components/ui/GraphCanvas';
import { useAnimationLoop } from '../../hooks/useAnimationLoop';
import { FormulaCard } from '../../components/ui/FormulaCard';

const LocusVisualizer = ({ mapX, mapY, shapeSelected, frame, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;
  
  // Parametric mapping based on time `frame`
  const t = (frame / 100) * 2 * Math.PI; // 0 to 2PI over 100 frames
  
  const points = [];
  for (let i = 0; i <= frame; i++) {
    const ti = (i / 100) * 2 * Math.PI;
    if (shapeSelected === 'circle') {
      points.push(`${mapX(3 * Math.cos(ti))},${mapY(3 * Math.sin(ti))}`);
    } else if (shapeSelected === 'ellipse') {
      points.push(`${mapX(4 * Math.cos(ti))},${mapY(2 * Math.sin(ti))}`);
    } else { // Parabola
      // mapping ti from -2 to 2 instead of 0 to 2PI
      const pT = ((i / 100) * 4) - 2;
      points.push(`${mapX(pT)},${mapY(pT * pT - 2)}`);
    }
  }

  // Current moving point
  let currX, currY;
  if (shapeSelected === 'circle') {
    currX = 3 * Math.cos(t); currY = 3 * Math.sin(t);
  } else if (shapeSelected === 'ellipse') {
    currX = 4 * Math.cos(t); currY = 2 * Math.sin(t);
  } else {
    currX = ((frame / 100) * 4) - 2; currY = currX * currX - 2;
  }

  return (
    <g>
      {/* Animated Path Trace */}
      {points.length > 0 && <path d={`M ${points.join(' L ')}`} fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />}
      
      {/* Constraints logic (e.g. radius line for circle) */}
      {shapeSelected === 'circle' && (
        <line x1={mapX(0)} y1={mapY(0)} x2={mapX(currX)} y2={mapY(currY)} stroke="var(--blue)" strokeWidth="2" strokeDasharray="4 4" />
      )}
      {shapeSelected === 'circle' && <circle cx={mapX(0)} cy={mapY(0)} r={3} fill="var(--blue)" />}
      
      {/* Moving Point */}
      <circle cx={mapX(currX)} cy={mapY(currY)} r={6} fill="var(--coral)" />
      
      {/* Pulsing ring around the point using native SVG animate */}
      <circle cx={mapX(currX)} cy={mapY(currY)} r={6} fill="none" stroke="var(--coral)" strokeWidth="2">
        <animate attributeName="r" values="6;20" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  );
};

export const Locus = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shape, setShape] = useState('circle');
  
  const { frame, setFrame } = useAnimationLoop(isPlaying, 100, 30); // 100 frames max, 30fps

  const handleReset = () => setFrame(0);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ color: 'var(--teal)', marginBottom: '8px' }}>Locus of a Point</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>
            A locus is the curve mapped out by a moving point satisfying a specific geometrical condition.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
          {['circle', 'ellipse', 'parabola'].map(s => (
            <button key={s} onClick={() => { setShape(s); handleReset(); }} style={{ padding: '8px', background: shape === s ? 'var(--bg4)' : 'transparent', color: shape === s ? 'var(--teal)' : 'var(--text3)', border: shape === s ? '1px solid var(--teal)' : '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer', textTransform: 'capitalize' }}>
              {s}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button onClick={() => setIsPlaying(!isPlaying)} style={{ flex: 1, padding: '12px', background: isPlaying ? 'var(--coral)' : 'var(--teal)', color: 'var(--bg)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {isPlaying ? 'Pause Animation' : 'Start Trace'}
          </button>
          <button onClick={handleReset} style={{ padding: '12px', background: 'var(--bg4)', color: 'var(--text1)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Reset</button>
        </div>
        
        <FormulaCard 
          title="Condition" 
          formula={shape === 'circle' ? 'Distance from origin = 3' : shape === 'ellipse' ? 'Sum of distances from focal points is constant' : 'Distance to focus equals distance to directrix'}
          description={shape === 'circle' ? 'x² + y² = 9' : shape === 'ellipse' ? 'x²/16 + y²/4 = 1' : 'y = x² - 2'}
        />
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-5, 5]} range={[-5, 5]}>
          <LocusVisualizer isSvg shapeSelected={shape} frame={frame} />
        </GraphCanvas>
      </div>
    </div>
  );
};
