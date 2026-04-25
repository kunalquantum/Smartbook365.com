import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';
import s from './BinarySearch.module.css';

const PSEUDO = [
  'function binarySearch(arr, target):',
  '  lo, hi = 0, arr.length - 1',
  '  while lo <= hi:',
  '    mid = floor((lo + hi) / 2)',
  '    if arr[mid] == target:',
  '      return mid          // found!',
  '    elif arr[mid] < target:',
  '      lo = mid + 1        // search right',
  '    else:',
  '      hi = mid - 1        // search left',
  '  return -1               // not found',
];

function generateSteps(arr, target) {
  const steps = [];
  let lo = 0, hi = arr.length - 1, iters = 0;

  steps.push({ arr, lo, hi, mid: -1, target, phase: 'init', pseudoLine: 1, eliminated: new Set(), iters, msg: `Search for ${target} in ${arr.length} elements. lo=0, hi=${hi}` });

  const eliminated = new Set();

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    iters++;
    steps.push({ arr, lo, hi, mid, target, phase: 'mid', pseudoLine: 3, eliminated: new Set(eliminated), iters, msg: `Iteration ${iters}: mid = ⌊(${lo}+${hi})/2⌋ = ${mid}, arr[${mid}] = ${arr[mid]}` });

    if (arr[mid] === target) {
      steps.push({ arr, lo, hi, mid, target, phase: 'found', pseudoLine: 5, eliminated: new Set(eliminated), iters, msg: `arr[${mid}] = ${arr[mid]} = target ${target} → Found at index ${mid}! ✓` });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({ arr, lo, hi, mid, target, phase: 'go_right', pseudoLine: 7, eliminated: new Set(eliminated), iters, msg: `arr[${mid}]=${arr[mid]} < ${target} → target is in right half, lo = ${mid+1}` });
      for (let k = lo; k <= mid; k++) eliminated.add(k);
      lo = mid + 1;
    } else {
      steps.push({ arr, lo, hi, mid, target, phase: 'go_left', pseudoLine: 9, eliminated: new Set(eliminated), iters, msg: `arr[${mid}]=${arr[mid]} > ${target} → target is in left half, hi = ${mid-1}` });
      for (let k = mid; k <= hi; k++) eliminated.add(k);
      hi = mid - 1;
    }
  }
  steps.push({ arr, lo, hi, mid: -1, target, phase: 'not_found', pseudoLine: 10, eliminated: new Set(eliminated), iters, msg: `lo(${lo}) > hi(${hi}) → ${target} not in array. Searched ${iters} times.` });
  return steps;
}

export default function BinarySearch() {
  const [inputStr, setInputStr] = useState('3,7,12,18,24,31,38,45,52,60,71,85');
  const [targetStr, setTargetStr] = useState('38');
  const [arr, setArr] = useState([3,7,12,18,24,31,38,45,52,60,71,85]);
  const [target, setTarget] = useState(38);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((a, t) => { const s = generateSteps(a, t); setSteps(s); return s; }, []);
  useEffect(() => { recompute(arr, target); }, []);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const apply = () => {
    const parsed = inputStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n)).sort((a, b) => a - b);
    const t = parseInt(targetStr) || 0;
    if (parsed.length >= 2) { setArr(parsed); setTarget(t); recompute(parsed, t); runner.reset(); }
  };
  const randomize = () => {
    const s = new Set(); while (s.size < 12) s.add(Math.floor(Math.random() * 100) + 1);
    const a = [...s].sort((x, y) => x - y);
    const t = a[Math.floor(Math.random() * a.length)];
    setArr(a); setTarget(t); setInputStr(a.join(',')); setTargetStr(String(t)); recompute(a, t); runner.reset();
  };
  const missSearch = () => {
    const t = Math.floor(Math.random() * 100) + 101;
    setTarget(t); setTargetStr(String(t)); recompute(arr, t); runner.reset();
  };

  const { lo = -1, hi = -1, mid = -1, phase, eliminated = new Set() } = stepData ?? {};

  const getState = (idx) => {
    if (!stepData) return 'default';
    if (phase === 'found' && idx === mid) return 'found';
    if (phase === 'not_found') return eliminated.has(idx) ? 'eliminated' : 'default';
    if (eliminated.has(idx)) return 'eliminated';
    if (idx === mid) return phase === 'go_right' ? 'mid_less' : phase === 'go_left' ? 'mid_greater' : 'mid';
    if (idx === lo) return 'lo';
    if (idx === hi) return 'hi';
    if (idx > lo && idx < hi && idx !== mid) return 'search_space';
    return 'default';
  };

  const palette = {
    default:      { bg: 'var(--bg4)', border: 'var(--border2)', color: 'var(--t2)' },
    eliminated:   { bg: 'var(--bg2)', border: 'var(--border0)', color: 'var(--t4)', opacity: 0.35 },
    search_space: { bg: '#0c1820', border: '#1a3040', color: 'var(--t2)' },
    lo:           { bg: '#0e2030', border: 'var(--cyan)', color: 'var(--cyan)', label: 'lo' },
    hi:           { bg: '#0e2030', border: 'var(--blue)', color: 'var(--blue)', label: 'hi' },
    mid:          { bg: '#1a1030', border: 'var(--violet)', color: 'var(--violet)', label: 'mid', glow: 'var(--violet)' },
    mid_less:     { bg: '#1a0c08', border: 'var(--orange)', color: 'var(--orange)', label: 'mid<', glow: 'var(--orange)' },
    mid_greater:  { bg: '#08100a', border: 'var(--green)', color: 'var(--green)', label: 'mid>', glow: 'var(--green)' },
    found:        { bg: '#082010', border: 'var(--green)', color: 'var(--green)', label: '✓', glow: 'var(--green)' },
  };

  // Logarithmic depth visualization: how many steps theoretical
  const maxSteps = Math.ceil(Math.log2(arr.length + 1));
  const stepsUsed = stepData?.iters ?? 0;

  return (
    <div className={s.root}>
      <div className={s.header}>
        <div><div className={s.title}>Binary Search</div><div className={s.sub}>Sorted array · Halve search space each step · O(log n) · Watch the space shrink</div></div>
        <span className="tag tagSorting">Searching</span>
      </div>
      <div className={s.controls}>
        <input className="input" style={{ width: 280 }} value={inputStr} onChange={e => setInputStr(e.target.value)} placeholder="sorted values" />
        <input className="input" style={{ width: 70 }} value={targetStr} onChange={e => setTargetStr(e.target.value)} placeholder="target" />
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random (hit)</button>
        <button className="btn" onClick={missSearch}>⚄ Random (miss)</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={() => { runner.reset(); setTimeout(runner.play, 50); }} disabled={runner.playing}>▶ Play</button>
      </div>

      <div className={s.body}>
        <div className={s.mainArea}>
          {/* Search space indicator */}
          <div className={s.spaceIndicator}>
            <div className={s.spaceLabel}>Search space: <b style={{ color: 'var(--cyan)' }}>{lo < 0 ? arr.length : (hi >= lo ? hi - lo + 1 : 0)}</b> / {arr.length} elements</div>
            <div className={s.spaceFill} style={{ '--fill': `${lo < 0 ? 100 : (hi >= lo ? ((hi - lo + 1) / arr.length) * 100 : 0)}%` }} />
          </div>

          {/* Array cells */}
          <div className={s.cells}>
            {arr.map((v, idx) => {
              const st = getState(idx);
              const { bg, border, color, label, glow, opacity } = palette[st];
              return (
                <div key={idx} className={s.cellWrap}>
                  <div className={s.label} style={{ color: label ? color : 'transparent', minHeight: 16 }}>{label || '.'}</div>
                  <div className={s.cell} style={{ background: bg, borderColor: border, color, opacity: opacity ?? 1, boxShadow: glow ? `0 0 16px ${glow}50` : 'none' }}>
                    {v}
                  </div>
                  <div className={s.cellIdx} style={{ color: st !== 'eliminated' && st !== 'default' ? color : 'var(--t4)' }}>{idx}</div>
                </div>
              );
            })}
          </div>

          {/* Target display */}
          <div className={s.targetRow}>
            <div className={s.targetBox}>
              <span className={s.targetLabel}>Target</span>
              <span className={s.targetVal}>{target}</span>
            </div>
            {mid >= 0 && (
              <div className={s.targetBox}>
                <span className={s.targetLabel}>arr[mid]</span>
                <span className={s.targetVal} style={{ color: phase === 'found' ? 'var(--green)' : phase === 'go_right' ? 'var(--orange)' : 'var(--violet)' }}>{arr[mid]}</span>
              </div>
            )}
            {mid >= 0 && (
              <div className={s.cmpBox}>
                {arr[mid] === target ? '=' : arr[mid] < target ? '<' : '>'}
              </div>
            )}
          </div>

          {/* Step log */}
          <div className={s.log}>
            {steps.slice(0, (runner.idx < 0 ? 0 : runner.idx) + 1).filter((_, i) => i <= runner.idx).map((st, i) => (
              <div key={i} className={`${s.logLine} ${i === runner.idx ? s.logActive : ''}`} style={i === runner.idx && st.phase === 'found' ? { color: 'var(--green)' } : {}}>
                <span className={s.logIdx}>{i + 1}.</span> {st.msg}
              </div>
            ))}
          </div>
        </div>

        <div className={s.sideCol}>
          {/* Log(n) progress */}
          <div className={s.logN}>
            <div className={s.logNTitle}>log₂({arr.length}) = {maxSteps} max steps</div>
            <div className={s.logNBars}>
              {Array.from({ length: maxSteps }, (_, i) => (
                <div key={i} className={s.logNBar} style={{ background: i < stepsUsed ? (phase === 'found' ? 'var(--green)' : phase === 'not_found' ? 'var(--red)' : 'var(--cyan)') : 'var(--border2)' }} />
              ))}
            </div>
            <div className={s.logNSub}>{stepsUsed} step{stepsUsed !== 1 ? 's' : ''} used</div>
          </div>

          <div className={s.complexBox}>
            <div className={s.complexRow}><span>Time</span><b style={{ color: 'var(--cyan)' }}>O(log n)</b></div>
            <div className={s.complexRow}><span>Space</span><b style={{ color: 'var(--green)' }}>O(1)</b></div>
            <div className={s.complexRow}><span>Requires</span><b style={{ color: 'var(--amber)' }}>Sorted</b></div>
            <div className={s.complexRow}><span>n={arr.length}</span><b style={{ color: 'var(--t2)' }}>max {maxSteps} steps</b></div>
          </div>

          <div className={s.legend}>
            {[['var(--violet)', 'mid pointer'], ['var(--cyan)', 'lo pointer'], ['var(--blue)', 'hi pointer'], ['var(--orange)', 'mid < target'], ['var(--green)', 'mid > target / found'], ['var(--t4)', 'Eliminated']].map(([c, l]) => (
              <div key={l} className={s.legendRow}><div className={s.legendDot} style={{ background: c, opacity: l === 'Eliminated' ? 0.35 : 1 }} /><span>{l}</span></div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO} activeLine={stepData?.pseudoLine ?? -1} accent="var(--cyan)" />
      <PlayBar runner={runner} accent="var(--cyan)" />
    </div>
  );
}
