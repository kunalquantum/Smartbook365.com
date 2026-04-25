import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO_NGE = [
  'function nextGreaterElement(arr):',
  '  stack = []   // monotonic decreasing',
  '  result = [-1, -1, ..., -1]',
  '  for i = 0 to n-1:',
  '    while stack not empty AND arr[stack.top] < arr[i]:',
  '      idx = stack.pop()',
  '      result[idx] = arr[i]   // arr[i] is NGE',
  '    stack.push(i)',
  '  return result',
];

const PSEUDO_MINSTACK = [
  'class MinStack:',
  '  stack = []  // [value, currentMin] pairs',
  '  def push(val):',
  '    minSoFar = min(val, stack.top.min if stack else val)',
  '    stack.push([val, minSoFar])',
  '  def pop():',
  '    return stack.pop().value',
  '  def getMin():',
  '    return stack.top.min   // O(1)!',
];

function ngeSteps(arr) {
  const steps = [], n = arr.length;
  const stk = [], result = Array(n).fill(-1);

  steps.push({ arr, stk: [], result: [...result], i: -1, popping: -1, pushing: -1, pseudoLine: 1, msg: 'Init: empty stack, all results = -1' });

  for (let i = 0; i < n; i++) {
    steps.push({ arr, stk: [...stk], result: [...result], i, popping: -1, pushing: -1, pseudoLine: 3, msg: `i=${i}: arr[${i}]=${arr[i]} — check stack top` });

    while (stk.length > 0 && arr[stk[stk.length - 1]] < arr[i]) {
      const top = stk[stk.length - 1];
      result[top] = arr[i];
      stk.pop();
      steps.push({ arr, stk: [...stk], result: [...result], i, popping: top, pushing: -1, pseudoLine: 5, msg: `arr[${top}]=${arr[top]} < arr[${i}]=${arr[i]} → pop ${top}, NGE = ${arr[i]}` });
    }

    stk.push(i);
    steps.push({ arr, stk: [...stk], result: [...result], i, popping: -1, pushing: i, pseudoLine: 7, msg: `Push i=${i} (arr[${i}]=${arr[i]}) onto stack` });
  }

  // Remaining in stack have no NGE
  while (stk.length > 0) {
    const top = stk.pop();
    result[top] = -1;
    steps.push({ arr, stk: [...stk], result: [...result], i: n, popping: top, pushing: -1, pseudoLine: 8, msg: `arr[${top}]=${arr[top]} has no greater element → result = -1` });
  }

  steps.push({ arr, stk: [], result: [...result], i: -1, popping: -1, pushing: -1, done: true, pseudoLine: 8, msg: `✓ NGE: [${result.join(', ')}]` });
  return steps;
}

function minStackSteps(ops) {
  const steps = [], stk = [];

  for (const op of ops) {
    if (op.type === 'push') {
      const minSoFar = stk.length > 0 ? Math.min(op.val, stk[stk.length - 1][1]) : op.val;
      stk.push([op.val, minSoFar]);
      steps.push({ stk: stk.map(p => [...p]), op, minSoFar, pseudoLine: 3, msg: `push(${op.val}): minSoFar = min(${op.val}, ${stk.length > 1 ? stk[stk.length - 2][1] : op.val}) = ${minSoFar}` });
    } else if (op.type === 'pop' && stk.length > 0) {
      const popped = stk.pop();
      steps.push({ stk: stk.map(p => [...p]), op, popped: popped[0], pseudoLine: 5, msg: `pop() → removed ${popped[0]}, new min = ${stk.length ? stk[stk.length - 1][1] : 'none'}` });
    } else if (op.type === 'getMin') {
      const m = stk.length > 0 ? stk[stk.length - 1][1] : null;
      steps.push({ stk: stk.map(p => [...p]), op, queriedMin: m, pseudoLine: 7, msg: `getMin() → ${m ?? 'stack empty'} (read top.min — O(1)!)` });
    }
  }
  steps.push({ stk: stk.map(p => [...p]), done: true, pseudoLine: -1, msg: `✓ All operations complete` });
  return steps;
}

const DEFAULT_OPS = [
  { type: 'push', val: 5 }, { type: 'push', val: 3 }, { type: 'push', val: 7 },
  { type: 'getMin' }, { type: 'push', val: 2 }, { type: 'getMin' },
  { type: 'pop' }, { type: 'getMin' },
];

export default function StacksVisualizer() {
  const [subMode, setSubMode] = useState('nge');
  const [inputStr, setInputStr] = useState('4,5,2,10,8,3,6,1');
  const [arr, setArr] = useState([4,5,2,10,8,3,6,1]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((a, m) => {
    const s = m === 'nge' ? ngeSteps(a) : minStackSteps(DEFAULT_OPS);
    setSteps(s); return s;
  }, []);

  useEffect(() => { recompute(arr, subMode); }, []);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);
  const resetAnim = () => { runner.reset(); setStepData(null); };

  const apply = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 12);
    if (p.length >= 2) { setArr(p); recompute(p, subMode); resetAnim(); }
  };
  const randomize = () => {
    const a = Array.from({ length: 8 }, () => Math.floor(Math.random() * 20) + 1);
    setArr(a); setInputStr(a.join(',')); recompute(a, subMode); resetAnim();
  };
  const switchMode = m => { setSubMode(m); recompute(arr, m); resetAnim(); };

  const { stk = [], result = [], i: curI = -1, popping = -1, pushing = -1, queriedMin, minSoFar } = stepData ?? {};
  const accent = subMode === 'nge' ? 'var(--pink)' : 'var(--cyan)';

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Stacks & Queues</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Monotonic Stack (NGE) · Min Stack (O(1) getMin)</div>
        </div>
        <span className="tag tagStacks">Stacks</span>
      </div>

      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <button className={`btn ${subMode==='nge'?'btnStep':''}`} onClick={() => switchMode('nge')}>Monotonic Stack (NGE)</button>
        <button className={`btn ${subMode==='minstack'?'btnStep':''}`} onClick={() => switchMode('minstack')}>Min Stack</button>
        <div className="divider" />
        {subMode === 'nge' && <>
          <input className="input" style={{width:200}} value={inputStr} onChange={e => setInputStr(e.target.value)} />
          <button className="btn" onClick={apply}>Apply</button>
          <button className="btn" onClick={randomize}>⚄ Random</button>
          <div className="divider" />
        </>}
        <button className="btn btnPrimary" style={{background:accent,borderColor:accent,color:'#000'}} onClick={() => { resetAnim(); setTimeout(runner.play, 80); }} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', overflow:'hidden', minHeight:0 }}>
        <div style={{ padding:'18px 24px', display:'flex', flexDirection:'column', gap:14, overflowY:'auto', borderRight:'1px solid var(--border0)' }}>

          {/* NGE view */}
          {subMode === 'nge' && (
            <>
              <div>
                <div style={{ fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', marginBottom:10 }}>Array</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {arr.map((v, idx) => {
                    const isI = idx === curI;
                    const isPop = idx === popping;
                    const isPush = idx === pushing;
                    const inStack = stk.includes(idx);
                    const ngeKnown = result[idx] !== undefined && result[idx] !== -1;
                    const ngeNone  = result[idx] === -1 && stepData?.done;

                    let bg='var(--bg4)', bc='var(--border2)', color='var(--t2)';
                    if (isPop)    { bg='#1a0818'; bc='var(--pink)'; color='var(--pink)'; }
                    else if (isPush) { bg='#071828'; bc='var(--cyan)'; color='var(--cyan)'; }
                    else if (isI)    { bg='#1a1000'; bc='var(--amber)'; color='var(--amber)'; }
                    else if (inStack){ bg='#0c1820'; bc='#1e3040'; color='var(--t1)'; }
                    return (
                      <div key={idx} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        {/* NGE result above */}
                        <div style={{ fontSize:'0.62rem', fontWeight:700, color: ngeKnown?'var(--green)':ngeNone?'var(--t4)':'transparent', minHeight:14 }}>
                          {ngeKnown ? result[idx] : ngeNone ? '-1' : '?'}
                        </div>
                        <div style={{ width:46, height:46, background:bg, border:`2px solid ${bc}`, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.9rem', fontWeight:700, color, transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:[isI,isPop,isPush].some(Boolean)?`0 0 14px ${bc}50`:'none', transform:[isI,isPop,isPush].some(Boolean)?'scale(1.1)':'scale(1)' }}>{v}</div>
                        <div style={{ fontSize:'0.56rem', color:'var(--t4)' }}>{idx}</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize:'0.62rem', color:'var(--t4)', marginTop:6 }}>↑ NGE result (shown above each cell)</div>
              </div>

              {/* Stack visualization - horizontal from bottom */}
              <div>
                <div style={{ fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', marginBottom:10 }}>
                  Stack (monotonic decreasing by value)
                </div>
                <div style={{ display:'flex', flexDirection:'row', gap:4, alignItems:'center' }}>
                  <span style={{ fontSize:'0.62rem', color:'var(--t4)' }}>bottom →</span>
                  {stk.length === 0 && <span style={{ fontSize:'0.7rem', color:'var(--t4)', padding:'6px 14px', border:'1px dashed var(--border1)', borderRadius:6 }}>empty</span>}
                  {stk.map((idx, si) => {
                    const isTop = si === stk.length - 1;
                    return (
                      <div key={si} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                        <div style={{ padding:'7px 12px', background: isTop ? '#071828' : 'var(--bg4)', border:`1px solid ${isTop ? 'var(--cyan)' : 'var(--border2)'}`, borderRadius:6, fontSize:'0.82rem', fontWeight:700, color: isTop ? 'var(--cyan)' : 'var(--t2)', transition:'all 0.3s' }}>
                          {arr[idx]}<span style={{ fontSize:'0.55rem', color:'var(--t4)', marginLeft:3 }}>[{idx}]</span>
                        </div>
                      </div>
                    );
                  })}
                  <span style={{ fontSize:'0.62rem', color:'var(--t4)' }}>← top</span>
                </div>
              </div>
            </>
          )}

          {/* Min Stack view */}
          {subMode === 'minstack' && (
            <>
              <div>
                <div style={{ fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', marginBottom:6 }}>Operation Sequence</div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                  {DEFAULT_OPS.map((op, i) => (
                    <div key={i} style={{ padding:'4px 10px', borderRadius:6, fontSize:'0.7rem', fontWeight:600, background: op.type==='push'?'#071828':op.type==='pop'?'#1a0508':'#1a1000', border:`1px solid ${op.type==='push'?'var(--cyan2)':op.type==='pop'?'var(--red2)':'var(--amber2)'}`, color: op.type==='push'?'var(--cyan)':op.type==='pop'?'var(--red)':'var(--amber)' }}>
                      {op.type==='push'?`push(${op.val})`:op.type==='pop'?'pop()':'getMin()'}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stack display: [val | curMin] */}
              <div>
                <div style={{ fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)', marginBottom:8 }}>
                  Stack — each entry stores [value | minSoFar]
                </div>
                <div style={{ display:'flex', flexDirection:'column-reverse', gap:3, maxHeight:200, overflowY:'auto' }}>
                  {stk.length === 0 && <div style={{ fontSize:'0.7rem', color:'var(--t4)', padding:'8px', border:'1px dashed var(--border1)', borderRadius:6, textAlign:'center' }}>empty</div>}
                  {stk.map(([val, mn], i) => {
                    const isTop = i === stk.length - 1;
                    const isMin = mn === (stk[stk.length-1]?.[1]);
                    return (
                      <div key={i} style={{ display:'flex', gap:2, alignItems:'stretch' }}>
                        <div style={{ flex:1, padding:'8px 14px', background: isTop?'#0c1820':'var(--bg4)', border:`1px solid ${isTop?'var(--cyan2)':'var(--border2)'}`, borderRadius:'6px 0 0 6px', fontSize:'0.82rem', fontWeight:700, color: isTop?'var(--cyan)':'var(--t2)' }}>
                          {val}
                        </div>
                        <div style={{ flex:1, padding:'8px 14px', background:'#082010', border:'1px solid var(--green2)', borderLeft:'none', borderRadius:'0 6px 6px 0', fontSize:'0.82rem', fontWeight:700, color:'var(--green)', display:'flex', alignItems:'center', gap:5 }}>
                          <span style={{fontSize:'0.58rem',color:'var(--t4)'}}>min:</span>{mn}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {queriedMin !== undefined && queriedMin !== null && (
                <div style={{ background:'#082010', border:'1px solid var(--green)', borderRadius:8, padding:'10px 16px', display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{fontSize:'0.75rem',color:'var(--t2)'}}>getMin() →</span>
                  <span style={{fontFamily:'var(--display)',fontSize:'1.4rem',fontWeight:800,color:'var(--green)'}}>{queriedMin}</span>
                  <span style={{fontSize:'0.65rem',color:'var(--t3)'}}>O(1) — just read top!</span>
                </div>
              )}
            </>
          )}

          <div style={{ padding:'10px 14px', borderRadius:7, background:'var(--bg3)', border:'1px solid var(--border1)', fontSize:'0.73rem', color:'var(--t1)', minHeight:38, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>
        </div>

        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:7 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {(subMode === 'nge'
              ? [['Time','O(n)','var(--cyan)'],['Space','O(n)','var(--amber)'],['Each elem','pushed/popped once','var(--green)']]
              : [['push','O(1)','var(--cyan)'],['pop','O(1)','var(--cyan)'],['getMin','O(1)','var(--green)'],['Space','O(n)','var(--amber)']]
            ).map(([k,v,c]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)' }}>Key Insight</div>
            <p style={{ fontSize:'0.66rem', color:'var(--t3)', lineHeight:1.6, fontFamily:'var(--sans)' }}>
              {subMode === 'nge'
                ? 'The stack stays monotonically decreasing. When a larger element arrives, everything smaller gets its NGE answered and is popped. Total: O(n) — each element pushed/popped exactly once.'
                : 'Each node stores not just its value but the minimum of all elements at or below it. So getMin() is always O(1) — just peek the top. No scanning needed!'
              }
            </p>
          </div>

          {subMode === 'nge' && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:5 }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Legend</div>
              {[['var(--amber)','Current i (scanning)'],['var(--pink)','Popped (NGE found!)'],['var(--cyan)','Pushed onto stack'],['var(--green)','NGE result shown above']].map(([c,l])=>(
                <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.65rem', color:'var(--t3)', fontFamily:'var(--sans)' }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PseudoCode lines={subMode === 'nge' ? PSEUDO_NGE : PSEUDO_MINSTACK} activeLine={stepData?.pseudoLine ?? -1} accent={accent} />
      <PlayBar runner={runner} accent={accent} />
    </div>
  );
}
