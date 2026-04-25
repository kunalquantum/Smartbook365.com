import { useState, useCallback, useEffect } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO_TP = [
  'function twoSum(arr, target):',
  '  lo, hi = 0, arr.length - 1',
  '  pairs = []',
  '  while lo < hi:',
  '    sum = arr[lo] + arr[hi]',
  '    if sum == target:',
  '      pairs.push([arr[lo], arr[hi]])',
  '      lo++; hi--',
  '    elif sum < target:',
  '      lo++               // need larger',
  '    else:',
  '      hi--               // need smaller',
  '  return pairs',
];

function tpSteps(arr, target) {
  const a = [...arr].sort((x, y) => x - y);
  const steps = [], pairs = [];
  let lo = 0, hi = a.length - 1;
  steps.push({ arr: a, lo, hi, pairs: [], target, sum: null, phase: 'init', pseudoLine: 1, msg: `Sorted array. Search pairs summing to ${target}` });
  while (lo < hi) {
    const sum = a[lo] + a[hi];
    steps.push({ arr: a, lo, hi, pairs: [...pairs], target, sum, phase: 'check', pseudoLine: 4, msg: `arr[${lo}](${a[lo]}) + arr[${hi}](${a[hi]}) = ${sum} vs target ${target}` });
    if (sum === target) {
      pairs.push([a[lo], a[hi]]);
      steps.push({ arr: a, lo, hi, pairs: [...pairs], target, sum, phase: 'found', pseudoLine: 6, msg: `✓ Found pair (${a[lo]}, ${a[hi]})! Move both pointers inward.` });
      lo++; hi--;
    } else if (sum < target) {
      steps.push({ arr: a, lo, hi, pairs: [...pairs], target, sum, phase: 'move_lo', pseudoLine: 9, msg: `${sum} < ${target} → need larger → lo++` });
      lo++;
    } else {
      steps.push({ arr: a, lo, hi, pairs: [...pairs], target, sum, phase: 'move_hi', pseudoLine: 11, msg: `${sum} > ${target} → need smaller → hi--` });
      hi--;
    }
  }
  steps.push({ arr: a, lo, hi, pairs, target, sum: null, phase: 'done', pseudoLine: 12, msg: `Done! Found ${pairs.length} pair(s): ${pairs.map(p => `(${p[0]},${p[1]})`).join(', ') || 'none'}` });
  return steps;
}

export function TwoPointers() {
  const [inputStr, setInputStr] = useState('1,3,5,7,9,11,13,15');
  const [target, setTarget] = useState(16);
  const [arr, setArr] = useState([1,3,5,7,9,11,13,15]);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((a, t) => { const s = tpSteps(a, t); setSteps(s); return s; }, []);
  useEffect(() => { recompute(arr, target); }, []);
  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const apply = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 12);
    if (p.length >= 2) { setArr(p); recompute(p, target); runner.reset(); }
  };
  const randomize = () => {
    const s = new Set(); while (s.size < 9) s.add(Math.floor(Math.random()*30)+1);
    const a = [...s].sort((x,y)=>x-y);
    const t = a[Math.floor(Math.random()*a.length/2)] + a[Math.floor(a.length/2) + Math.floor(Math.random()*a.length/2)];
    setArr(a); setInputStr(a.join(',')); setTarget(t); recompute(a, t); runner.reset();
  };

  const display = stepData?.arr ?? arr;
  const { lo = -1, hi = -1, phase, sum, pairs = [] } = stepData ?? {};

  const getState = idx => {
    if (!stepData) return 'default';
    if (phase === 'done') return 'done';
    if (idx === lo && idx === hi) return 'both';
    if (idx === lo) return phase === 'found' ? 'found' : 'lo';
    if (idx === hi) return phase === 'found' ? 'found' : 'hi';
    if (idx > lo && idx < hi) return 'search';
    return 'out';
  };

  const pal = {
    default: { bg:'var(--bg4)', bc:'var(--border2)', color:'var(--t2)' },
    out:     { bg:'var(--bg2)', bc:'var(--border0)', color:'var(--t4)' },
    search:  { bg:'#0c1820', bc:'#1a3040', color:'var(--t2)' },
    lo:      { bg:'#071820', bc:'var(--cyan)', color:'var(--cyan)', lbl:'lo' },
    hi:      { bg:'#120820', bc:'var(--violet)', color:'var(--violet)', lbl:'hi' },
    found:   { bg:'#081810', bc:'var(--green)', color:'var(--green)', lbl:'✓' },
    done:    { bg:'#081810', bc:'#16a058', color:'var(--green)' },
    both:    { bg:'#1a1030', bc:'var(--pink)', color:'var(--pink)', lbl:'lo=hi' },
  };

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Two Pointers — Two Sum</div>
        <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Sorted input · O(n) · Contract window based on sum vs target</div></div>
        <span className="tag tagArrays">Arrays</span>
      </div>
      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom, var(--bg2), var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:200}} value={inputStr} onChange={e=>setInputStr(e.target.value)} placeholder="sorted values" />
        <label style={{fontSize:'0.7rem',color:'var(--t3)',display:'flex',alignItems:'center',gap:6}}>Target: <input className="input" style={{width:65}} type="number" value={target} onChange={e=>{setTarget(parseInt(e.target.value)||0); runner.reset();}} /></label>
        <button className="btn" onClick={apply}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className="btn btnPrimary" onClick={()=>{runner.reset();setTimeout(runner.play,50);}} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 210px', overflow:'hidden', minHeight:0 }}>
        <div style={{ padding:'18px 24px', display:'flex', flexDirection:'column', gap:16, overflowY:'auto', borderRight:'1px solid var(--border0)' }}>
          <div style={{ fontSize:'0.62rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t3)' }}>Sorted Array — Target: <span style={{color:'var(--amber)',fontWeight:700}}>{target}</span></div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {display.map((v,i)=>{
              const st=getState(i);
              const {bg,bc,color,lbl}=pal[st];
              return (
                <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3}}>
                  <div style={{fontSize:'0.6rem',fontWeight:700,color:lbl?color:'transparent',minHeight:14}}>{lbl||'·'}</div>
                  <div style={{width:46,height:46,background:bg,border:`2px solid ${bc}`,borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.9rem',fontWeight:700,color,transition:'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',boxShadow:['lo','hi','found'].includes(st)?`0 0 14px ${bc}50`:'none',transform:['lo','hi','found'].includes(st)?'scale(1.1)':'scale(1)'}}>{v}</div>
                  <div style={{fontSize:'0.56rem',color:'var(--t4)'}}>{i}</div>
                </div>
              );
            })}
          </div>

          {sum !== null && (
            <div style={{display:'flex',alignItems:'center',gap:10,background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:'10px 16px'}}>
              <span style={{color:'var(--cyan)',fontWeight:700,fontSize:'1.1rem'}}>{display[lo]}</span>
              <span style={{color:'var(--t3)'}}>+</span>
              <span style={{color:'var(--violet)',fontWeight:700,fontSize:'1.1rem'}}>{display[hi]}</span>
              <span style={{color:'var(--t3)'}}>= <b style={{color:sum===target?'var(--green)':sum<target?'var(--amber)':'var(--red)',fontSize:'1.1rem'}}>{sum}</b></span>
              <span style={{fontSize:'0.75rem',color:'var(--t3)'}}>
                {sum===target?'= target ✓':sum<target?'< target → lo++':'> target → hi--'}
              </span>
            </div>
          )}

          {pairs.length > 0 && (
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              {pairs.map(([a,b],i)=>(
                <div key={i} style={{background:'#081810',border:'1px solid var(--green)',borderRadius:6,padding:'5px 12px',fontSize:'0.8rem',color:'var(--green)',fontWeight:600}}>({a}, {b})</div>
              ))}
            </div>
          )}

          <div style={{padding:'10px 14px',borderRadius:7,background:'var(--bg3)',border:'1px solid var(--border1)',fontSize:'0.73rem',color:'var(--t1)',minHeight:38,display:'flex',alignItems:'center'}}>
            {stepData?.msg??<span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>
        </div>

        <div style={{padding:14,display:'flex',flexDirection:'column',gap:12,overflowY:'auto'}}>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:7}}>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--t4)',marginBottom:3}}>Complexity</div>
            {[['Time','O(n)','var(--cyan)'],['Space','O(1)','var(--green)'],['Requires','Sorted','var(--amber)']].map(([k,v,c])=>(
              <div key={k} style={{display:'flex',justifyContent:'space-between',fontSize:'0.7rem',color:'var(--t3)'}}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12}}>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--t4)',marginBottom:8}}>Pairs Found</div>
            <div style={{fontFamily:'var(--display)',fontSize:'1.8rem',fontWeight:800,color:'var(--green)'}}>{pairs.length}</div>
          </div>
          <div style={{background:'var(--bg3)',border:'1px solid var(--border1)',borderRadius:8,padding:12,display:'flex',flexDirection:'column',gap:6}}>
            <div style={{fontSize:'0.6rem',fontWeight:600,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--t4)'}}>Key Insight</div>
            {[['var(--cyan)','lo pointer (needs ↑)'],['var(--violet)','hi pointer (needs ↓)'],['var(--green)','Match found!']].map(([c,l])=>(
              <div key={l} style={{display:'flex',alignItems:'center',gap:7,fontSize:'0.66rem',color:'var(--t3)',fontFamily:'var(--sans)'}}>
                <div style={{width:8,height:8,borderRadius:2,background:c,flexShrink:0}}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO_TP} activeLine={stepData?.pseudoLine??-1} accent="var(--cyan)" />
      <PlayBar runner={runner} accent="var(--cyan)" />
    </div>
  );
}
