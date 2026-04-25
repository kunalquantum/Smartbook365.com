import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';
import s from './MergeSort.module.css';

const PSEUDO = [
  'function mergeSort(arr, l, r):',
  '  if l >= r: return',
  '  mid = floor((l + r) / 2)',
  '  mergeSort(arr, l, mid)      // left half',
  '  mergeSort(arr, mid+1, r)    // right half',
  '  merge(arr, l, mid, r)',
  '',
  'function merge(arr, l, mid, r):',
  '  left = arr[l..mid]',
  '  right = arr[mid+1..r]',
  '  i, j, k = 0, 0, l',
  '  while i < left.len AND j < right.len:',
  '    if left[i] <= right[j]:',
  '      arr[k++] = left[i++]',
  '    else:',
  '      arr[k++] = right[j++]',
  '  copy remaining elements',
];

function generateSteps(arr) {
  const steps = [];
  const a = [...arr];
  let comparisons = 0, swaps = 0;

  // Build a tree of divide operations first
  const tree = [];

  function mergeSort(a, l, r, depth) {
    if (l >= r) {
      steps.push({ arr: [...a], type: 'base', l, r, depth, comparisons, swaps, pseudoLine: 1, msg: `Base case: single element [${a[l]}]` });
      return;
    }
    const mid = Math.floor((l + r) / 2);
    steps.push({ arr: [...a], type: 'divide', l, r, mid, depth, comparisons, swaps, pseudoLine: 2, msg: `Divide [${l}..${r}] → [${l}..${mid}] | [${mid+1}..${r}]` });

    mergeSort(a, l, mid, depth + 1);
    mergeSort(a, mid + 1, r, depth + 1);

    // merge
    const left = a.slice(l, mid + 1);
    const right = a.slice(mid + 1, r + 1);
    steps.push({ arr: [...a], type: 'merge_start', l, r, mid, left: [...left], right: [...right], depth, comparisons, swaps, pseudoLine: 7, msg: `Merge [${l}..${mid}] with [${mid+1}..${r}]` });

    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      comparisons++;
      steps.push({ arr: [...a], type: 'compare', l, r, mid, ci: l+i, cj: mid+1+j, k, depth, comparisons, swaps, pseudoLine: 11, msg: `Compare ${left[i]} vs ${right[j]}` });
      if (left[i] <= right[j]) {
        a[k] = left[i]; i++;
        steps.push({ arr: [...a], type: 'place', l, r, k, depth, comparisons, swaps, pseudoLine: 13, msg: `Place ${a[k]} at index ${k}` });
      } else {
        a[k] = right[j]; j++;
        steps.push({ arr: [...a], type: 'place', l, r, k, depth, comparisons, swaps, pseudoLine: 15, msg: `Place ${a[k]} at index ${k}` });
      }
      swaps++; k++;
    }
    while (i < left.length) { a[k] = left[i]; i++; k++; steps.push({ arr: [...a], type: 'place', l, r, k: k-1, depth, comparisons, swaps, pseudoLine: 16, msg: `Copy remaining from left` }); }
    while (j < right.length) { a[k] = right[j]; j++; k++; steps.push({ arr: [...a], type: 'place', l, r, k: k-1, depth, comparisons, swaps, pseudoLine: 16, msg: `Copy remaining from right` }); }
    steps.push({ arr: [...a], type: 'merged', l, r, depth, comparisons, swaps, pseudoLine: 5, msg: `✓ Merged [${l}..${r}]: [${a.slice(l, r+1).join(', ')}]` });
  }

  mergeSort(a, 0, a.length - 1, 0);
  steps.push({ arr: [...a], type: 'done', comparisons, swaps, pseudoLine: -1, msg: `✓ Sorted! ${comparisons} comparisons, ${swaps} writes` });
  return steps;
}

export default function MergeSort() {
  const [inputStr, setInputStr] = useState('38,27,43,3,9,82,10,15');
  const [baseArr, setBaseArr] = useState([38, 27, 43, 3, 9, 82, 10, 15]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((arr) => {
    const s = generateSteps(arr);
    setSteps(s);
    return s;
  }, []);

  useEffect(() => { recompute(baseArr); }, []);

  const onStep = useCallback((step) => { setStepData(step); }, []);
  const runner = useStepRunner(steps, onStep);

  const applyInput = () => {
    const parsed = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).slice(0, 12);
    if (parsed.length >= 2) { setBaseArr(parsed); const ns = recompute(parsed); runner.reset(); }
  };
  const randomize = () => {
    const arr = Array.from({ length: 8 }, () => Math.floor(Math.random() * 95) + 5);
    setBaseArr(arr); setInputStr(arr.join(',')); const ns = recompute(arr); runner.reset();
  };

  const display = stepData?.arr ?? baseArr;
  const n = display.length;
  const maxVal = Math.max(...display, 1);

  // Determine bar states
  const getBarState = (i) => {
    if (!stepData) return 'default';
    const { type, l, r, ci, cj, k } = stepData;
    if (type === 'done') return 'sorted';
    if (type === 'merged' && i >= l && i <= r) return 'merged';
    if (type === 'compare' && (i === ci || i === cj)) return i === ci ? 'compareL' : 'compareR';
    if (type === 'place' && i === k) return 'placed';
    if (type === 'divide' || type === 'merge_start' || type === 'merge' || type === 'compare' || type === 'place') {
      if (i >= l && i <= r) return 'active';
    }
    return 'default';
  };

  const barColors = {
    default:  { bg: 'var(--bg4)', border: 'var(--border2)', shadow: 'none', color: 'var(--t3)' },
    active:   { bg: '#0d1a28', border: 'var(--cyan2)', shadow: 'none', color: 'var(--t2)' },
    compareL: { bg: '#1a1030', border: 'var(--violet)', shadow: '0 0 12px #8b5cf640', color: 'var(--violet)' },
    compareR: { bg: '#0d2830', border: 'var(--cyan)', shadow: '0 0 12px #00c8e840', color: 'var(--cyan)' },
    placed:   { bg: '#0d2818', border: 'var(--green)', shadow: '0 0 14px #22d47a50', color: 'var(--green)' },
    merged:   { bg: '#0a2014', border: '#16a058', shadow: 'none', color: 'var(--green)' },
    sorted:   { bg: '#081a10', border: '#16a058', shadow: '0 0 6px #22d47a20', color: 'var(--green)' },
  };

  return (
    <div className={s.root}>
      {/* Header */}
      <div className={s.header}>
        <div>
          <div className={s.title}>Merge Sort</div>
          <div className={s.sub}>Divide & conquer · Stable · O(n log n) guaranteed · O(n) space</div>
        </div>
        <span className="tag tagSorting">Sorting</span>
      </div>

      {/* Controls */}
      <div className={s.controls}>
        <input className="input" style={{ width: 220 }} value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="e.g. 38,27,43,3,9,82" />
        <button className="btn" onClick={applyInput}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={() => { runner.reset(); setTimeout(runner.play, 50); }} disabled={runner.playing}>
          ▶ Auto Play
        </button>
      </div>

      {/* Main viz area */}
      <div className={s.body}>
        {/* Left: bars */}
        <div className={s.barArea}>
          <div className={s.areaLabel}>Array State</div>
          <div className={s.barChart}>
            {display.map((v, i) => {
              const state = getBarState(i);
              const { bg, border, shadow, color } = barColors[state];
              const hPct = Math.max((v / maxVal) * 100, 5);
              return (
                <div key={i} className={s.barCol}>
                  <div className={s.barVal} style={{ color }}>{v}</div>
                  <div className={s.barTrack}>
                    <div
                      className={`${s.bar} ${state !== 'default' ? s.barActive : ''}`}
                      style={{
                        height: `${hPct}%`,
                        background: bg,
                        borderColor: border,
                        boxShadow: shadow,
                      }}
                    />
                  </div>
                  <div className={s.barIdx}>{i}</div>
                </div>
              );
            })}
          </div>

          {/* Step message */}
          <div className={s.msgBox}>
            {stepData
              ? <><span className={s.msgIcon}>{stepData.type === 'done' ? '✓' : stepData.type === 'compare' ? '⟺' : stepData.type === 'divide' ? '÷' : stepData.type === 'merged' ? '✓' : '→'}</span> {stepData.msg}</>
              : <span style={{ color: 'var(--t4)' }}>Press Play or use step controls below</span>
            }
          </div>
        </div>

        {/* Right: stats + divide tree */}
        <div className={s.sideCol}>
          {/* Stats */}
          <div className={s.statsRow}>
            <div className={s.stat}>
              <div className={s.statNum} style={{ color: 'var(--violet)' }}>{stepData?.comparisons ?? 0}</div>
              <div className={s.statLabel}>Comparisons</div>
            </div>
            <div className={s.stat}>
              <div className={s.statNum} style={{ color: 'var(--cyan)' }}>{stepData?.swaps ?? 0}</div>
              <div className={s.statLabel}>Writes</div>
            </div>
            <div className={s.stat}>
              <div className={s.statNum} style={{ color: 'var(--amber)' }}>{stepData ? stepData.depth ?? 0 : 0}</div>
              <div className={s.statLabel}>Depth</div>
            </div>
          </div>

          {/* Complexity */}
          <div className={s.complexBox}>
            <div className={s.complexRow}><span>Time</span><b style={{ color: 'var(--cyan)' }}>O(n log n)</b></div>
            <div className={s.complexRow}><span>Space</span><b style={{ color: 'var(--amber)' }}>O(n)</b></div>
            <div className={s.complexRow}><span>Stable</span><b style={{ color: 'var(--green)' }}>Yes</b></div>
            <div className={s.complexRow}><span>In-place</span><b style={{ color: 'var(--red)' }}>No</b></div>
          </div>

          {/* Step type legend */}
          <div className={s.legend}>
            {Object.entries({ 'Dividing': 'var(--t2)', 'Comparing': 'var(--violet)', 'Comparing': 'var(--cyan)', 'Placing': 'var(--green)', 'Merged': '#16a058' }).map(([k, c], i) =>
              <div key={i} className={s.legendRow}>
                <div className={s.legendDot} style={{ background: c }} />
                <span>{ ['Dividing', 'Left element', 'Right element', 'Placing', 'Merged'][i] }</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pseudocode */}
      <PseudoCode lines={PSEUDO} activeLine={stepData?.pseudoLine ?? -1} accent="var(--violet)" />

      {/* Transport */}
      <PlayBar runner={runner} accent="var(--violet)" />
    </div>
  );
}
