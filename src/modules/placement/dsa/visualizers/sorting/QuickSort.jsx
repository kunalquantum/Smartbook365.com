import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';
import s from './QuickSort.module.css';

const PSEUDO = [
  'function quickSort(arr, lo, hi):',
  '  if lo >= hi: return',
  '  p = partition(arr, lo, hi)',
  '  quickSort(arr, lo, p-1)',
  '  quickSort(arr, p+1, hi)',
  '',
  'function partition(arr, lo, hi):',
  '  pivot = arr[hi]             // last element',
  '  i = lo - 1                  // slow pointer',
  '  for j = lo to hi-1:',
  '    if arr[j] <= pivot:',
  '      i++',
  '      swap(arr[i], arr[j])',
  '  swap(arr[i+1], arr[hi])     // place pivot',
  '  return i + 1',
];

function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  let comps = 0, swaps = 0;

  const addStep = (type, extra = {}) => {
    steps.push({ arr: [...a], type, comps, swaps, ...extra });
  };

  function swap(i, j) {
    [a[i], a[j]] = [a[j], a[i]];
    swaps++;
  }

  function partition(lo, hi) {
    const pivot = a[hi];
    addStep('pivot', { lo, hi, pivotIdx: hi, pivot, i: lo - 1, pseudoLine: 7, msg: `Partition [${lo}..${hi}], pivot = ${pivot}` });
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      comps++;
      addStep('compare', { lo, hi, pivotIdx: hi, pivot, i, j, pseudoLine: 10, msg: `Compare arr[${j}]=${a[j]} ≤ pivot(${pivot})?` });
      if (a[j] <= pivot) {
        i++;
        addStep('swap_start', { lo, hi, pivotIdx: hi, pivot, i, j, pseudoLine: 12, msg: `Yes → swap arr[${i}]=${a[i]} ↔ arr[${j}]=${a[j]}` });
        swap(i, j);
        addStep('swapped', { lo, hi, pivotIdx: hi, pivot, i, j, pseudoLine: 12, msg: `Swapped: arr[${i}]=${a[i]}, arr[${j}]=${a[j]}` });
      } else {
        addStep('skip', { lo, hi, pivotIdx: hi, pivot, i, j, pseudoLine: 10, msg: `No (${a[j]} > ${pivot}) → skip` });
      }
    }
    swap(i + 1, hi);
    addStep('pivot_placed', { lo, hi, pivotIdx: i + 1, pivot, i, pseudoLine: 13, msg: `Pivot ${pivot} placed at index ${i + 1} ✓` });
    return i + 1;
  }

  function quickSort(lo, hi, depth = 0) {
    if (lo >= hi) {
      if (lo === hi) addStep('base', { lo, hi, depth, pseudoLine: 1, msg: `Base: element at [${lo}] is sorted` });
      return;
    }
    addStep('recurse', { lo, hi, depth, pseudoLine: 0, msg: `quickSort([${lo}..${hi}])` });
    const p = partition(lo, hi);
    quickSort(lo, p - 1, depth + 1);
    quickSort(p + 1, hi, depth + 1);
  }

  quickSort(0, a.length - 1);
  addStep('done', { pseudoLine: -1, msg: `✓ Sorted! ${comps} comparisons, ${swaps} swaps` });
  return steps;
}

export default function QuickSort() {
  const [inputStr, setInputStr] = useState('64,34,25,12,22,11,90,45');
  const [baseArr, setBaseArr] = useState([64, 34, 25, 12, 22, 11, 90, 45]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((arr) => { const s = generateSteps(arr); setSteps(s); return s; }, []);
  useEffect(() => { recompute(baseArr); }, []);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const applyInput = () => {
    const p = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 12);
    if (p.length >= 2) { setBaseArr(p); recompute(p); runner.reset(); }
  };
  const randomize = () => {
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 95) + 5);
    setBaseArr(a); setInputStr(a.join(',')); recompute(a); runner.reset();
  };

  const display = stepData?.arr ?? baseArr;
  const maxVal = Math.max(...display, 1);
  const { lo = -1, hi = -1, pivotIdx = -1, i: iPtr = -1, j: jPtr = -1, type } = stepData ?? {};

  const getState = (idx) => {
    if (!stepData) return 'default';
    if (type === 'done') return 'sorted';
    if (type === 'pivot_placed' && idx === pivotIdx) return 'placed';
    if (type === 'pivot_placed' && idx >= lo && idx <= hi) return 'active';
    if (idx === pivotIdx) return 'pivot';
    if (idx === iPtr && (type === 'swap_start' || type === 'swapped')) return 'swapI';
    if (idx === jPtr && (type === 'swap_start' || type === 'swapped')) return 'swapJ';
    if (idx === jPtr) return 'j';
    if (idx === iPtr) return 'i';
    if (idx >= lo && idx <= hi) return 'active';
    return 'dim';
  };

  const palette = {
    default: { bg: 'var(--bg4)', border: 'var(--border2)', color: 'var(--t3)' },
    dim:     { bg: 'var(--bg3)', border: 'var(--border1)', color: 'var(--t4)' },
    active:  { bg: '#0c1a26', border: '#1e3a4a', color: 'var(--t2)' },
    pivot:   { bg: '#1e1000', border: 'var(--amber)', color: 'var(--amber)', label: 'pivot' },
    i:       { bg: '#1a1030', border: 'var(--violet)', color: 'var(--violet)', label: 'i' },
    j:       { bg: '#0d1a30', border: 'var(--cyan)', color: 'var(--cyan)', label: 'j' },
    swapI:   { bg: '#1a0c28', border: 'var(--pink)', color: 'var(--pink)', label: 'i↕' },
    swapJ:   { bg: '#1a0c28', border: 'var(--pink)', color: 'var(--pink)', label: 'j↕' },
    placed:  { bg: '#082010', border: 'var(--green)', color: 'var(--green)', label: '✓' },
    sorted:  { bg: '#061810', border: '#16a058', color: 'var(--green)' },
  };

  return (
    <div className={s.root}>
      <div className={s.header}>
        <div><div className={s.title}>Quick Sort</div><div className={s.sub}>Partition-based · In-place · Avg O(n log n) · Watch pivot place itself</div></div>
        <span className="tag tagSorting">Sorting</span>
      </div>
      <div className={s.controls}>
        <input className="input" style={{ width: 220 }} value={inputStr} onChange={e => setInputStr(e.target.value)} />
        <button className="btn" onClick={applyInput}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={() => { runner.reset(); setTimeout(runner.play, 50); }} disabled={runner.playing}>▶ Auto Play</button>
      </div>

      <div className={s.body}>
        <div className={s.barArea}>
          <div className={s.areaLabel}>Array State</div>
          <div className={s.barChart}>
            {display.map((v, idx) => {
              const st = getState(idx);
              const { bg, border, color, label } = palette[st];
              const hPct = Math.max((v / maxVal) * 100, 4);
              return (
                <div key={idx} className={s.barCol}>
                  {label && <div className={s.pointerLabel} style={{ color }}>{label}</div>}
                  {!label && <div className={s.barVal} style={{ color }}>{v}</div>}
                  <div className={s.barTrack}>
                    <div className={s.bar} style={{ height: `${hPct}%`, background: bg, borderColor: border, boxShadow: ['pivot','placed','swapI','swapJ'].includes(st) ? `0 0 14px ${border}60` : 'none' }} />
                  </div>
                  <div className={s.barVal} style={{ color, fontSize: '0.7rem' }}>{v}</div>
                  <div className={s.barIdx}>{idx}</div>
                </div>
              );
            })}
          </div>

          {/* Partition visualizer */}
          {stepData && lo >= 0 && (
            <div className={s.partitionBar}>
              {display.map((_, idx) => {
                const inRange = idx >= lo && idx <= hi;
                const isPivot = idx === pivotIdx;
                const isLeft = inRange && idx <= iPtr && !isPivot;
                const isRight = inRange && idx > iPtr && idx < pivotIdx;
                return (
                  <div key={idx} className={s.partCell} style={{
                    background: isPivot ? '#1e1000' : isLeft ? '#0a1a10' : isRight ? '#0a1030' : inRange ? '#0a1020' : 'transparent',
                    border: `1px solid ${isPivot ? 'var(--amber)' : isLeft ? 'var(--green2)' : isRight ? 'var(--violet2)' : inRange ? 'var(--border1)' : 'transparent'}`,
                  }}>
                    {isPivot ? '★' : isLeft ? '≤' : isRight ? '>' : inRange ? '·' : ''}
                  </div>
                );
              })}
              <div className={s.partLegend}>
                <span style={{ color: 'var(--amber)' }}>★ pivot</span>
                <span style={{ color: 'var(--green)' }}>≤ left zone</span>
                <span style={{ color: 'var(--violet)' }}>&gt; right zone</span>
              </div>
            </div>
          )}

          <div className={s.msgBox}>{stepData ? stepData.msg : <span style={{ color: 'var(--t4)' }}>Press Play to start</span>}</div>
        </div>

        <div className={s.sideCol}>
          <div className={s.statsRow}>
            <div className={s.stat}><div className={s.statNum} style={{ color: 'var(--violet)' }}>{stepData?.comps ?? 0}</div><div className={s.statLabel}>Comparisons</div></div>
            <div className={s.stat}><div className={s.statNum} style={{ color: 'var(--pink)' }}>{stepData?.swaps ?? 0}</div><div className={s.statLabel}>Swaps</div></div>
          </div>
          <div className={s.complexBox}>
            <div className={s.complexRow}><span>Avg Time</span><b style={{ color: 'var(--cyan)' }}>O(n log n)</b></div>
            <div className={s.complexRow}><span>Worst</span><b style={{ color: 'var(--red)' }}>O(n²)</b></div>
            <div className={s.complexRow}><span>Space</span><b style={{ color: 'var(--green)' }}>O(log n)</b></div>
            <div className={s.complexRow}><span>In-place</span><b style={{ color: 'var(--green)' }}>Yes</b></div>
            <div className={s.complexRow}><span>Stable</span><b style={{ color: 'var(--red)' }}>No</b></div>
          </div>
          <div className={s.legend}>
            {[['var(--amber)', 'Pivot'], ['var(--cyan)', 'j pointer'], ['var(--violet)', 'i pointer'], ['var(--pink)', 'Swapping'], ['var(--green)', 'Pivot placed']].map(([c, l]) => (
              <div key={l} className={s.legendRow}><div className={s.legendDot} style={{ background: c }} /><span>{l}</span></div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO} activeLine={stepData?.pseudoLine ?? -1} accent="var(--amber)" />
      <PlayBar runner={runner} accent="var(--amber)" />
    </div>
  );
}
