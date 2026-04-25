import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';
import s from './PrefixSum.module.css';

const PSEUDO = [
  'function buildPrefix(arr):',
  '  prefix = [0]               // prefix[0] = 0',
  '  for i = 0 to n-1:',
  '    prefix[i+1] = prefix[i] + arr[i]',
  '  return prefix',
  '',
  'function rangeSum(l, r):',
  '  return prefix[r+1] - prefix[l]',
  '  // O(1) query!',
];

function generateSteps(arr) {
  const steps = [];
  const prefix = [0];
  steps.push({ arr, prefix: [0], phase: 'init', building: -1, pseudoLine: 1, msg: 'Initialize: prefix[0] = 0 (empty prefix sum)' });
  for (let i = 0; i < arr.length; i++) {
    const next = prefix[i] + arr[i];
    prefix.push(next);
    steps.push({ arr, prefix: [...prefix], phase: 'build', building: i, current: i, pseudoLine: 3, msg: `prefix[${i+1}] = prefix[${i}](${prefix[i]-arr[i]}) + arr[${i}](${arr[i]}) = ${next}` });
  }
  steps.push({ arr, prefix: [...prefix], phase: 'done', building: arr.length, pseudoLine: 4, msg: `Prefix array built! Now any range sum is O(1).` });
  return steps;
}

export default function PrefixSum() {
  const [inputStr, setInputStr] = useState('3,1,4,1,5,9,2,6');
  const [arr, setArr] = useState([3,1,4,1,5,9,2,6]);
  const [L, setL] = useState(2);
  const [R, setR] = useState(6);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);
  const [queryMode, setQueryMode] = useState(false);

  const recompute = useCallback((a) => { const s = generateSteps(a); setSteps(s); return s; }, []);
  useEffect(() => { recompute(arr); }, []);

  const onStep = useCallback((step) => { setStepData(step); if (step?.phase === 'done') setQueryMode(true); }, []);
  const runner = useStepRunner(steps, onStep);

  const apply = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 12);
    if (p.length >= 2) { setArr(p); recompute(p); runner.reset(); setQueryMode(false); }
  };
  const randomize = () => {
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1);
    setArr(a); setInputStr(a.join(',')); recompute(a); runner.reset(); setQueryMode(false);
  };

  const prefix = stepData?.prefix ?? [0];
  const builtUpTo = stepData?.building ?? -1;
  const n = arr.length;
  const lC = Math.max(0, Math.min(L, n - 1));
  const rC = Math.max(lC, Math.min(R, n - 1));
  const rangeSum = prefix[rC + 1] !== undefined ? prefix[rC + 1] - prefix[lC] : null;

  return (
    <div className={s.root}>
      <div className={s.header}>
        <div><div className={s.title}>Prefix Sum Array</div><div className={s.sub}>Build O(n) · Query any range sum O(1) · The most powerful array preprocessing trick</div></div>
        <span className="tag tagArrays">Arrays</span>
      </div>
      <div className={s.controls}>
        <input className="input" style={{ width: 200 }} value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="e.g. 3,1,4,1,5,9" />
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={() => { runner.reset(); setQueryMode(false); setTimeout(runner.play, 50); }} disabled={runner.playing}>▶ Build Prefix</button>
      </div>

      <div className={s.body}>
        <div className={s.vizCol}>
          {/* Original array */}
          <div className={s.section}>
            <div className={s.sectionLabel}>Original Array  <span style={{ color: 'var(--t4)' }}>arr[0..{n-1}]</span></div>
            <div className={s.cells}>
              {arr.map((v, i) => {
                const isActive = stepData?.current === i;
                const inRange = queryMode && i >= lC && i <= rC;
                return (
                  <div key={i} className={s.cellWrap}>
                    <div className={s.cell} style={{
                      background: isActive ? '#1a1030' : inRange ? '#071820' : 'var(--bg4)',
                      borderColor: isActive ? 'var(--violet)' : inRange ? 'var(--cyan)' : 'var(--border2)',
                      color: isActive ? 'var(--violet)' : inRange ? 'var(--cyan)' : 'var(--t1)',
                      boxShadow: isActive ? '0 0 14px #8b5cf640' : inRange ? '0 0 10px #00c8e830' : 'none',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                    }}>{v}</div>
                    <div className={s.cellIdx}>{i}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrow connector */}
          <div className={s.connector}>
            <div className={s.connLine} />
            <div className={s.connLabel}>{stepData?.current !== undefined ? `+ arr[${stepData.current}]` : 'prefix[i+1] = prefix[i] + arr[i]'}</div>
          </div>

          {/* Prefix array */}
          <div className={s.section}>
            <div className={s.sectionLabel}>Prefix Array  <span style={{ color: 'var(--t4)' }}>prefix[0..{n}]</span></div>
            <div className={s.cells}>
              {Array.from({ length: n + 1 }, (_, i) => {
                const revealed = builtUpTo >= i - 1;
                const isL = queryMode && i === lC;
                const isR = queryMode && i === rC + 1;
                const isJustBuilt = i === builtUpTo + 1 && revealed;
                return (
                  <div key={i} className={s.cellWrap}>
                    <div className={s.cell} style={{
                      background: isL ? '#071820' : isR ? '#071820' : isJustBuilt ? '#1a1030' : revealed ? '#0a1220' : 'var(--bg3)',
                      borderColor: isL ? 'var(--cyan)' : isR ? 'var(--green)' : isJustBuilt ? 'var(--violet)' : revealed ? '#1a3040' : 'var(--border1)',
                      color: isL ? 'var(--cyan)' : isR ? 'var(--green)' : isJustBuilt ? 'var(--violet)' : revealed ? 'var(--t1)' : 'var(--t4)',
                      opacity: revealed ? 1 : 0.3,
                      boxShadow: isL ? '0 0 12px #00c8e840' : isR ? '0 0 12px #22d47a40' : isJustBuilt ? '0 0 14px #8b5cf650' : 'none',
                      transform: (isL || isR || isJustBuilt) ? 'scale(1.1)' : 'scale(1)',
                    }}>
                      {revealed ? prefix[i] ?? '?' : '?'}
                    </div>
                    <div className={s.cellIdx} style={{ color: isL ? 'var(--cyan)' : isR ? 'var(--green)' : 'var(--t4)' }}>
                      {isL ? 'L' : isR ? 'R+1' : i}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Query controls */}
          {queryMode && (
            <div className={s.queryPanel}>
              <div className={s.queryTitle}>Range Query  <span style={{ color: 'var(--cyan)' }}>sum(L, R) = prefix[R+1] − prefix[L]</span></div>
              <div className={s.queryControls}>
                <label className={s.queryLabel}>
                  L =
                  <input type="number" className="input" style={{ width: 60 }} value={L} min={0} max={n-1} onChange={e => setL(Math.max(0, Math.min(parseInt(e.target.value)||0, n-1)))} />
                </label>
                <label className={s.queryLabel}>
                  R =
                  <input type="number" className="input" style={{ width: 60 }} value={R} min={0} max={n-1} onChange={e => setR(Math.max(0, Math.min(parseInt(e.target.value)||0, n-1)))} />
                </label>
              </div>
              {rangeSum !== null && (
                <div className={s.queryResult}>
                  <span className={s.qr}>sum({lC}..{rC})</span>
                  <span className={s.qeq}>=</span>
                  <span className={s.qterm} style={{ color: 'var(--green)' }}>prefix[{rC+1}]</span>
                  <span className={s.qeq}>−</span>
                  <span className={s.qterm} style={{ color: 'var(--cyan)' }}>prefix[{lC}]</span>
                  <span className={s.qeq}>=</span>
                  <span className={s.qterm} style={{ color: 'var(--green)' }}>{prefix[rC+1]}</span>
                  <span className={s.qeq}>−</span>
                  <span className={s.qterm} style={{ color: 'var(--cyan)' }}>{prefix[lC]}</span>
                  <span className={s.qeq}>=</span>
                  <span className={s.qans}>{rangeSum}</span>
                </div>
              )}
            </div>
          )}

          <div className={s.msgBox}>{stepData?.msg ?? <span style={{ color: 'var(--t4)' }}>Press ▶ Build Prefix to animate</span>}</div>
        </div>

        <div className={s.sideCol}>
          <div className={s.complexBox}>
            <div className={s.complexTitle}>Complexity</div>
            <div className={s.complexRow}><span>Build</span><b style={{ color: 'var(--cyan)' }}>O(n)</b></div>
            <div className={s.complexRow}><span>Query</span><b style={{ color: 'var(--green)' }}>O(1)</b></div>
            <div className={s.complexRow}><span>Space</span><b style={{ color: 'var(--amber)' }}>O(n)</b></div>
          </div>
          <div className={s.insightBox}>
            <div className={s.insightTitle}>Key Insight</div>
            <p>Without prefix sums, every range query takes O(n) — you'd loop through the range.</p>
            <p>With prefix sums, <b>any</b> range query is O(1): just subtract two stored values.</p>
            <p>Classic use case: answering Q range-sum queries in O(n + Q) instead of O(n·Q).</p>
          </div>
          <div className={s.complexBox}>
            <div className={s.complexTitle}>State</div>
            <div className={s.complexRow}><span>Built up to</span><b style={{ color: 'var(--violet)' }}>{builtUpTo < 0 ? '—' : `idx ${builtUpTo}`}</b></div>
            <div className={s.complexRow}><span>Prefix size</span><b style={{ color: 'var(--cyan)' }}>{prefix.length}</b></div>
            {queryMode && <div className={s.complexRow}><span>Range sum</span><b style={{ color: 'var(--green)' }}>{rangeSum ?? '?'}</b></div>}
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO} activeLine={stepData?.pseudoLine ?? -1} accent="var(--cyan)" />
      <PlayBar runner={runner} accent="var(--cyan)" />
    </div>
  );
}
