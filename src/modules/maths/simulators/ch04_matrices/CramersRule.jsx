import React, { useState } from 'react';
import { GraphCanvas, HtmlLabel } from '../../components/ui/GraphCanvas';
import { MathSlider } from '../../components/ui/MathSlider';
import { FormulaCard } from '../../components/ui/FormulaCard';

const LinesVisualizer = ({ mapX, mapY, a1, b1, c1, a2, b2, c2, xSol, ySol, D, isSvg }) => {
  if (!isSvg || !mapX || !mapY) return null;

  // Find points for line 1: a1 x + b1 y = c1
  // y = (c1 - a1 x) / b1
  const getL1Y = (x) => b1 !== 0 ? (c1 - a1 * x) / b1 : null;
  const getL1X = (y) => a1 !== 0 ? (c1 - b1 * y) / a1 : null;

  // L1 endpoints for SVG domain [-10, 10]
  let l1p1, l1p2;
  if (b1 !== 0 && a1 !== 0) {
    l1p1 = [-10, getL1Y(-10)];
    l1p2 = [10, getL1Y(10)];
  } else if (b1 === 0) {
    l1p1 = [c1/a1, -10];
    l1p2 = [c1/a1, 10];
  } else {
    l1p1 = [-10, c1/b1];
    l1p2 = [10, c1/b1];
  }

  const getL2Y = (x) => b2 !== 0 ? (c2 - a2 * x) / b2 : null;
  const getL2X = (y) => a2 !== 0 ? (c2 - b2 * y) / a2 : null;
  
  let l2p1, l2p2;
  if (b2 !== 0 && a2 !== 0) {
    l2p1 = [-10, getL2Y(-10)];
    l2p2 = [10, getL2Y(10)];
  } else if (b2 === 0) {
    l2p1 = [c2/a2, -10];
    l2p2 = [c2/a2, 10];
  } else {
    l2p1 = [-10, c2/b2];
    l2p2 = [10, c2/b2];
  }

  return (
    <g>
      <line x1={mapX(l1p1[0])} y1={mapY(l1p1[1])} x2={mapX(l1p2[0])} y2={mapY(l1p2[1])} stroke="var(--blue)" strokeWidth="3" opacity="0.8" />
      <line x1={mapX(l2p1[0])} y1={mapY(l2p1[1])} x2={mapX(l2p2[0])} y2={mapY(l2p2[1])} stroke="var(--teal)" strokeWidth="3" opacity="0.8" />

      {D !== 0 && (
        <circle cx={mapX(xSol)} cy={mapY(ySol)} r={6} fill="var(--coral)" />
      )}
    </g>
  );
};

export const CramersRule = () => {
  const [a1, setA1] = useState(2);
  const [b1, setB1] = useState(3);
  const [c1, setC1] = useState(6);

  const [a2, setA2] = useState(1);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(4);

  const D = a1 * b2 - a2 * b1;
  const Dx = c1 * b2 - c2 * b1;
  const Dy = a1 * c2 - a2 * c1;

  const x = D !== 0 ? Dx / D : null;
  const y = D !== 0 ? Dy / D : null;

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div>
          <h3 style={{ color: 'var(--coral)', marginBottom: '4px' }}>Cramer's Rule</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
            Determinants geometrically represent the solution (intersection) to systems of linear equations.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '8px', background: 'rgba(74, 143, 231, 0.1)', borderLeft: '4px solid var(--blue)' }}>
            <div style={{fontWeight: 'bold', color: 'var(--blue)', marginBottom:'8px'}}>L1: {a1}x + {b1}y = {c1}</div>
            <MathSlider label="a₁" min={-5} max={5} value={a1} onChange={setA1} />
            <MathSlider label="b₁" min={-5} max={5} value={b1} onChange={setB1} />
            <MathSlider label="c₁" min={-10} max={10} value={c1} onChange={setC1} />
          </div>
          <div style={{ padding: '8px', background: 'rgba(28, 184, 160, 0.1)', borderLeft: '4px solid var(--teal)' }}>
            <div style={{fontWeight: 'bold', color: 'var(--teal)', marginBottom:'8px'}}>L2: {a2}x + {b2}y = {c2}</div>
            <MathSlider label="a₂" min={-5} max={5} value={a2} onChange={setA2} />
            <MathSlider label="b₂" min={-5} max={5} value={b2} onChange={setB2} />
            <MathSlider label="c₂" min={-10} max={10} value={c2} onChange={setC2} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '16px' }}>
          <FormulaCard title="D" formula={D.toString()} />
          <FormulaCard title="Dx" formula={Dx.toString()} />
          <FormulaCard title="Dy" formula={Dy.toString()} />
        </div>

        {D !== 0 ? (
          <div style={{ background: 'var(--bg4)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
            <strong style={{ color: 'var(--coral)' }}>Solution: </strong> 
            <span className="math-font">x = {Dx}/{D} = {+(x).toFixed(2)}, y = {Dy}/{D} = {+(y).toFixed(2)}</span>
          </div>
        ) : (
          <div style={{ background: 'rgba(232, 93, 84, 0.2)', padding: '12px', borderRadius: '8px', textAlign: 'center', color: 'var(--coral)' }}>
            <strong>D = 0!</strong> Lines are Parallel or Coincident.
          </div>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <GraphCanvas width={340} height={340} domain={[-10, 10]} range={[-10, 10]}>
          <LinesVisualizer isSvg a1={a1} b1={b1} c1={c1} a2={a2} b2={b2} c2={c2} xSol={x} ySol={y} D={D} />
          {D !== 0 && (
            <HtmlLabel isHtml x={x+0.5} y={y+0.5} style={{ color: 'var(--coral)', fontWeight: 'bold' }}>
              ({+(x).toFixed(1)}, {+(y).toFixed(1)})
            </HtmlLabel>
          )}
        </GraphCanvas>
      </div>
    </div>
  );
};
