import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

// ── SLIDING WINDOW ─────────────────────────────────────────────────────────
const SW_PSEUDO = [
  'function maxSumSubarray(arr, k):',
  '  windowSum = sum(arr[0..k-1])',
  '  maxSum = windowSum',
  '  for i = k to n-1:',
  '    windowSum += arr[i] - arr[i-k]   // slide!',
  '    maxSum = max(maxSum, windowSum)',
  '  return maxSum',
];

function swSteps(arr, k) {
  const steps = [], n = arr.length;
  if (k > n) return steps;
  let wSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = wSum, maxStart = 0;
  steps.push({ arr, lo: 0, hi: k-1, wSum, maxSum, maxStart, maxEnd: k-1, phase: 'init', pseudoLine: 1, msg: `Initial window [0..${k-1}]: sum = ${wSum}` });
  for (let i = k; i < n; i++) {
    const removed = arr[i-k], added = arr[i];
    steps.push({ arr, lo: i-k+1, hi: i, wSum, maxSum, maxStart, maxEnd: maxStart+k-1, phase: 'slide', pseudoLine: 4, msg: `Slide: remove arr[${i-k}]=${removed}, add arr[${i}]=${added}` });
    wSum += added - removed;
    if (wSum > maxSum) { maxSum = wSum; maxStart = i - k + 1; }
    steps.push({ arr, lo: i-k+1, hi: i, wSum, maxSum, maxStart, maxEnd: maxStart+k-1, phase: 'check', pseudoLine: 5, msg: `Window [${i-k+1}..${i}]: sum=${wSum}${wSum===maxSum?' ← new best!':''}` });
  }
  steps.push({ arr, lo: maxStart, hi: maxStart+k-1, wSum: maxSum, maxSum, maxStart, maxEnd: maxStart+k-1, phase: 'done', pseudoLine: 6, msg: `✓ Max sum = ${maxSum} at window [${maxStart}..${maxStart+k-1}]` });
  return steps;
}

export function SlidingWindow() {
  const [inputStr, setInputStr] = useState('2,1,5,1,3,2,4,7,1,3');
  const [k, setK] = useState(3);
  const [arr, setArr] = useState([2,1,5,1,3,2,4,7,1,3]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((a, kk) => { const s = swSteps(a, kk); setSteps(s); return s; }, []);
  useEffect(() => { recompute(arr, k); }, []);
  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const apply = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 14);
    if (p.length >= 2) { setArr(p); recompute(p, k); runner.reset(); }
  };
  const randomize = () => {
    const a = Array.from({length:10},()=>Math.floor(Math.random()*15)+1);
    setArr(a); setInputStr(a.join(',')); recompute(a, k); runner.reset();
  };
  const changeK = (nk) => { const kk = Math.max(1, Math.min(nk, arr.length)); setK(kk); recompute(arr, kk); runner.reset(); };

  const display = arr;
  const { lo = -1, hi = -1, wSum, maxSum, maxStart = -1, maxEnd = -1, phase } = stepData ?? {};
  const maxVal = Math.max(...display, 1);

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Sliding Window — Max Sum Subarray</div>
        <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Fixed window size k · O(n) · slide without recomputing the whole window</div></div>
        <span className="tag tagArrays">Arrays</span>
      </div>
      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom, var(--bg2), var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:220}} value={inputStr} onChange={e=>setInputStr(e.target.value)} />
        <label style={{fontSize:'0.7rem',color:'var(--t3)',display:'flex',alignItems:'center',gap:6}}>k =
          <input className="input" style={{width:55}} type="number" value={k} min={1} max={arr.length} onChange={e=>changeK(parseInt(e.target.value)||1)} />
        </label>
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={()=>{runner.reset();setTimeout(runner.play,50);}} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 210px', overflow:'hidden', minHeight:0 }}>
        <div style={{ padding:'18px 24px', display:'flex', flexDirection:'column', gap:14, overflowY:'auto', borderRight:'1px solid var(--border0)' }}>
          {/* Bar chart */}
          <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:140 }}>
            {display.map((v,i)=>{
              const inWin = i >= lo && i <= hi;
              const isBest = phase === 'done' && i >= maxStart && i <= maxEnd;
              const h = Math.max((v/maxVal)*120, 6);
              return (
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                  <div style={{fontSize:'0.62rem',color:isBest?'var(--green)':inWin?'var(--cyan)':'var(--t3)',fontWeight:600}}>{v}</div>
                  <div style={{width:'100%',height:h,background:isBest?'#082010':inWin?'#071828':'var(--bg4)',border:`1px solid ${isBest?'var(--green)':inWin?'var(--cyan)':'var(--border2)'}`,borderRadius:'3px 3px 0 0',transition:'all 0.25s',boxShadow:isBest?'0 0 10px #22d47a40':inWin?'0 0 8px #00c8e830':'none'}}/>
                  <div style={{fontSize:'0.55rem',color:'var(--t4)'}}>{i}</div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          {wSum !== undefined && (
            <div style={{display:'flex',gap:10}}>
              <div style={{flex:1,background:'var(--bg3)',border:'1px solid var(--border2)',borderRadius:8,padding:'10px 14px',display:'flex',flexDirection:'column',gap:3}}>
                <div style={{fontSize:'0.6rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Window [{lo}..{hi}]</div>
                <div style={{fontFamily:'var(--display)',fontSize:'1.4rem',fontWeight:800,color:'var(--cyan)'}}>{wSum}</div>
              </div>
              <div style={{flex:1,background:'#082010',border:'1px solid var(--green2)',borderRadius:8,padding:'10px 14px',display:'flex',flexDirection:'column',gap:3}}>
                <div style={{fontSize:'0.6rem',color:'var(--t3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>Best Sum</div>
                <div style={{fontFamily:'var(--display)',fontSize:'1.4rem',fontWeight:800,color:'var(--green)'}}>{maxSum}</div>
              </div>
            </div>
          )}

          <div style={{padding:'10px 14px',borderRadius:7,background:'var(--bg3)',border:'1px solid var(--border1)',fontSize:'0.73rem',color:'var(--t1)',minHeight:38,display:'flex',alignItems:'center'}}>
            {stepData?.msg??<span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>
        </div>

        <div style={{padding:14,display:'flex',flexDirection:'column',gap:12,overflowY:'auto'}}>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:7}}>
            {[['Time','O(n)','var(--cyan)'],['Space','O(1)','var(--green)'],['Window k',k,'var(--amber)']].map(([a,b,c])=>(
              <div key={a} style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--t3)'}}><span>{a}</span><b style={{color:c,fontWeight:600}}>{b}</b></div>
            ))}
          </div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--t4)'}}>Key Trick</div>
            <p style={{fontSize:'0.67rem',color:'var(--t3)',lineHeight:1.6,fontFamily:'var(--sans)'}}>Instead of recomputing the sum of k elements every step (O(k)), just subtract the element leaving and add the element entering. O(1) per slide!</p>
          </div>
        </div>
      </div>

      <PseudoCode lines={SW_PSEUDO} activeLine={stepData?.pseudoLine??-1} accent="var(--cyan)" />
      <PlayBar runner={runner} accent="var(--cyan)" />
    </div>
  );
}

// ── KADANE'S ────────────────────────────────────────────────────────────────
const KAD_PSEUDO = [
  'function kadane(arr):',
  '  curMax = arr[0]',
  '  globalMax = arr[0]',
  '  bestStart = bestEnd = 0',
  '  curStart = 0',
  '  for i = 1 to n-1:',
  '    if arr[i] > curMax + arr[i]:',
  '      curMax = arr[i]             // reset',
  '      curStart = i',
  '    else:',
  '      curMax = curMax + arr[i]    // extend',
  '    if curMax > globalMax:',
  '      globalMax = curMax',
  '      bestStart = curStart',
  '      bestEnd = i',
  '  return globalMax',
];

function kadaneSteps(arr) {
  const steps = [], n = arr.length;
  let curMax = arr[0], globalMax = arr[0], curStart = 0, bestStart = 0, bestEnd = 0;
  steps.push({ arr, i:0, curMax, globalMax, curStart, bestStart, bestEnd, pseudoLine:1, msg:`Init: curMax = globalMax = arr[0] = ${arr[0]}` });
  for (let i = 1; i < n; i++) {
    const resetBetter = arr[i] > curMax + arr[i];
    const prev = curMax;
    if (resetBetter) {
      steps.push({ arr, i, curMax, globalMax, curStart, bestStart, bestEnd, pseudoLine:6, msg:`arr[${i}]=${arr[i]} alone beats extending (${prev}+${arr[i]}=${prev+arr[i]}) → reset window` });
      curMax = arr[i]; curStart = i;
    } else {
      steps.push({ arr, i, curMax, globalMax, curStart, bestStart, bestEnd, pseudoLine:10, msg:`Extend: curMax = ${prev} + ${arr[i]} = ${prev+arr[i]}` });
      curMax += arr[i];
    }
    const newBest = curMax > globalMax;
    if (newBest) { globalMax = curMax; bestStart = curStart; bestEnd = i; }
    steps.push({ arr, i, curMax, globalMax, curStart, bestStart, bestEnd, pseudoLine:11, msg:`i=${i}: curMax=${curMax}${newBest?' → new global best!':''}` });
  }
  steps.push({ arr, i:n-1, curMax, globalMax, curStart, bestStart, bestEnd, phase:'done', pseudoLine:15, msg:`✓ Max subarray sum = ${globalMax}, range [${bestStart}..${bestEnd}]` });
  return steps;
}

export function Kadane() {
  const [inputStr, setInputStr] = useState('-2,1,-3,4,-1,2,1,-5,4');
  const [arr, setArr] = useState([-2,1,-3,4,-1,2,1,-5,4]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((a) => { const s = kadaneSteps(a); setSteps(s); return s; }, []);
  useEffect(() => { recompute(arr); }, []);
  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const apply = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0,12);
    if (p.length>=2) { setArr(p); recompute(p); runner.reset(); }
  };
  const randomize = () => {
    const a = Array.from({length:10},()=>Math.floor(Math.random()*21)-9);
    setArr(a); setInputStr(a.join(',')); recompute(a); runner.reset();
  };

  const display = arr;
  const { i: curI = -1, curMax, globalMax, curStart = 0, bestStart = 0, bestEnd = -1, phase } = stepData ?? {};
  const absMax = Math.max(...display.map(Math.abs), 1);

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Kadane's Algorithm — Maximum Subarray</div>
        <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Works with negatives · O(n) time · O(1) space · Classic DP-adjacent technique</div></div>
        <span className="tag tagArrays">Arrays</span>
      </div>
      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom, var(--bg2), var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:220}} value={inputStr} onChange={e=>setInputStr(e.target.value)} placeholder="can include negatives" />
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={()=>{runner.reset();setTimeout(runner.play,50);}} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 210px', overflow:'hidden', minHeight:0 }}>
        <div style={{ padding:'18px 24px', display:'flex', flexDirection:'column', gap:14, overflowY:'auto', borderRight:'1px solid var(--border0)' }}>
          {/* Bar chart with neg support */}
          <div style={{ display:'flex', alignItems:'center', gap:5, height:160, position:'relative' }}>
            <div style={{position:'absolute',left:0,right:0,top:'50%',height:1,background:'var(--border1)'}}/>
            {display.map((v,i)=>{
              const isActive = i === curI;
              const inCur = i >= curStart && i <= curI && curI >= 0;
              const isBest = phase==='done' && i >= bestStart && i <= bestEnd;
              const h = Math.abs(v) / absMax * 70;
              const isPos = v >= 0;
              const color = isBest ? 'var(--green)' : isActive ? 'var(--amber)' : inCur ? 'var(--cyan)' : 'var(--border2)';
              return (
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',position:'relative',height:'100%'}}>
                  <div style={{fontSize:'0.6rem',fontWeight:600,color:isBest?'var(--green)':isActive?'var(--amber)':inCur?'var(--cyan)':'var(--t3)',marginBottom:2}}>{v}</div>
                  <div style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'center',width:'100%'}}>
                    {isPos
                      ? <div style={{height:h,width:'100%',background:isBest?'#082010':isActive?'#1a1000':inCur?'#071828':'var(--bg4)',border:`1px solid ${color}`,borderRadius:'3px 3px 0 0',alignSelf:'flex-end',transition:'all 0.25s',boxShadow:isBest?'0 0 10px #22d47a40':isActive?'0 0 10px #f5a62340':'none'}}/>
                      : <div style={{height:h,width:'100%',background:isActive?'#1a0808':'var(--bg3)',border:`1px solid ${isActive?'var(--red)':'var(--border1)'}`,borderRadius:'0 0 3px 3px',alignSelf:'flex-start',transition:'all 0.25s'}}/>
                    }
                  </div>
                  <div style={{fontSize:'0.55rem',color:'var(--t4)'}}>{i}</div>
                </div>
              );
            })}
          </div>

          {/* Tracker boxes */}
          {stepData && (
            <div style={{display:'flex',gap:10}}>
              <div style={{flex:1,background:'var(--bg3)',border:'1px solid var(--cyan2)',borderRadius:8,padding:'10px 14px'}}>
                <div style={{fontSize:'0.6rem',color:'var(--t3)'}}>curMax (local)</div>
                <div style={{fontFamily:'var(--display)',fontSize:'1.3rem',fontWeight:800,color:'var(--cyan)'}}>{curMax}</div>
                <div style={{fontSize:'0.6rem',color:'var(--t4)'}}>from idx {curStart}</div>
              </div>
              <div style={{flex:1,background:'#082010',border:'1px solid var(--green2)',borderRadius:8,padding:'10px 14px'}}>
                <div style={{fontSize:'0.6rem',color:'var(--t3)'}}>globalMax (best)</div>
                <div style={{fontFamily:'var(--display)',fontSize:'1.3rem',fontWeight:800,color:'var(--green)'}}>{globalMax}</div>
                <div style={{fontSize:'0.6rem',color:'var(--t4)'}}>range [{bestStart}..{bestEnd}]</div>
              </div>
            </div>
          )}

          <div style={{padding:'10px 14px',borderRadius:7,background:'var(--bg3)',border:'1px solid var(--border1)',fontSize:'0.73rem',color:'var(--t1)',minHeight:38,display:'flex',alignItems:'center'}}>
            {stepData?.msg??<span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>
        </div>

        <div style={{padding:14,display:'flex',flexDirection:'column',gap:12,overflowY:'auto'}}>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:7}}>
            {[['Time','O(n)','var(--cyan)'],['Space','O(1)','var(--green)'],['Handles','Negatives','var(--amber)']].map(([a,b,c])=>(
              <div key={a} style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--t3)'}}><span>{a}</span><b style={{color:c,fontWeight:600}}>{b}</b></div>
            ))}
          </div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:8}}>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--t4)'}}>Core Idea</div>
            <p style={{fontSize:'0.67rem',color:'var(--t3)',lineHeight:1.6,fontFamily:'var(--sans)'}}>If extending the current window makes things worse than just the current element alone, <b style={{color:'var(--amber)'}}>reset</b> the window. Otherwise, <b style={{color:'var(--cyan)'}}>extend</b>.</p>
          </div>
        </div>
      </div>

      <PseudoCode lines={KAD_PSEUDO} activeLine={stepData?.pseudoLine??-1} accent="var(--cyan)" />
      <PlayBar runner={runner} accent="var(--cyan)" />
    </div>
  );
}
