import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO = {
  reverse: [
    'function reverse(head):',
    '  prev = null',
    '  cur  = head',
    '  while cur != null:',
    '    next = cur.next        // save next',
    '    cur.next = prev        // reverse link',
    '    prev = cur             // advance prev',
    '    cur  = next            // advance cur',
    '  return prev              // new head',
  ],
  cycle: [
    'function hasCycle(head):',
    '  slow = fast = head',
    '  while fast != null AND fast.next != null:',
    '    slow = slow.next       // move 1 step',
    '    fast = fast.next.next  // move 2 steps',
    '    if slow == fast:',
    '      return true          // cycle detected!',
    '  return false             // no cycle',
  ],
};

// ── Step generators ────────────────────────────────────────────────────────
function reverseSteps(arr) {
  const steps = [], n = arr.length;
  let prev = -1, cur = 0;
  // Track the reversed arrows: initially all point forward
  const arrows = arr.map((_, i) => (i < n - 1 ? i + 1 : -1)); // next pointers
  steps.push({ arr, prev, cur, next: cur < n ? cur + 1 : -1, arrows: [...arrows], phase: 'init', pseudoLine: 1, msg: 'Initialize: prev=null, cur=head' });

  while (cur < n) {
    const nxt = cur + 1 < n ? cur + 1 : -1;
    steps.push({ arr, prev, cur, next: nxt, arrows: [...arrows], phase: 'save_next', pseudoLine: 4, msg: `Save next = ${nxt < 0 ? 'null' : `node[${nxt}](${arr[nxt]})`}` });
    // Reverse cur's arrow
    arrows[cur] = prev;
    steps.push({ arr, prev, cur, next: nxt, arrows: [...arrows], phase: 'reverse', pseudoLine: 5, msg: `cur.next = prev → node[${cur}] now points to ${prev < 0 ? 'null' : `node[${prev}](${arr[prev]})`}` });
    prev = cur;
    cur = nxt < 0 ? n : nxt;
    steps.push({ arr, prev: prev, cur: cur >= n ? -1 : cur, next: -1, arrows: [...arrows], phase: 'advance', pseudoLine: 6, msg: `Advance: prev=node[${prev}](${arr[prev]}), cur=${cur >= n ? 'null' : `node[${cur}](${arr[cur]})`}` });
  }

  steps.push({ arr, prev, cur: -1, next: -1, arrows: [...arrows], phase: 'done', newHead: prev, pseudoLine: 8, msg: `✓ Reversed! New head = node[${prev}](${arr[prev]})` });
  return steps;
}

function cycleSteps(arr, cycleAt) {
  const steps = [], n = arr.length;
  const cp = Math.max(0, Math.min(cycleAt, n - 1));
  let slow = 0, fast = 0, iter = 0;

  const nextOf = i => (i + 1 >= n ? cp : i + 1);

  steps.push({ arr, slow, fast, cp, phase: 'init', pseudoLine: 1, msg: `Init: slow=fast=head(${arr[0]}). Cycle connects tail→node[${cp}](${arr[cp]})` });

  for (let i = 0; i < n * 3; i++) {
    slow = nextOf(slow);
    fast = nextOf(nextOf(fast));
    iter++;
    const met = slow === fast;
    steps.push({ arr, slow, fast, cp, phase: met ? 'meet' : 'step', pseudoLine: met ? 6 : 3, iter, msg: met ? `✓ Cycle detected! slow=fast at node[${slow}](${arr[slow]}) after ${iter} steps` : `Step ${iter}: slow→${arr[slow]}, fast→${arr[fast]}` });
    if (met) break;
  }
  return steps;
}

// ── Canvas draw ────────────────────────────────────────────────────────────
const NODE_W = 56, NODE_H = 38, GAP = 44;

function drawLL(canvas, arr, stepData, mode, cycleAt) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const n = arr.length;
  const totalW = n * NODE_W + (n - 1) * GAP;
  const sx = Math.max(32, (W - totalW) / 2);
  const nodeY = H / 2 - NODE_H / 2;
  const cx = i => sx + i * (NODE_W + GAP) + NODE_W / 2;
  const cy = nodeY + NODE_H / 2;

  const { prev = -1, cur = -1, next: nxt = -1, arrows = [], slow = -1, fast = -1, phase, newHead } = stepData ?? {};

  // Cycle arc
  if (mode === 'cycle') {
    const cp = Math.max(0, Math.min(cycleAt, n - 1));
    const lastX = cx(n - 1), cpX = cx(cp), arcY = nodeY + NODE_H + 36;
    ctx.beginPath();
    ctx.moveTo(lastX + NODE_W * 0.35, cy);
    ctx.bezierCurveTo(lastX + NODE_W * 0.35, arcY + 10, cpX - NODE_W * 0.35, arcY + 10, cpX - NODE_W * 0.35, cy + NODE_H / 2);
    ctx.strokeStyle = '#f05060aa';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    // Arrow tip
    ctx.beginPath();
    ctx.moveTo(cpX - NODE_W * 0.35 - 4, cy + NODE_H / 2 - 6);
    ctx.lineTo(cpX - NODE_W * 0.35, cy + NODE_H / 2);
    ctx.lineTo(cpX - NODE_W * 0.35 + 4, cy + NODE_H / 2 - 6);
    ctx.strokeStyle = '#f05060aa'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  // Draw next arrows (mode=reverse uses arrows array)
  arr.forEach((_, i) => {
    const fromX = cx(i) + NODE_W * 0.18;
    const fromY = cy;
    let toIdx = mode === 'reverse' ? arrows[i] : (i < n - 1 ? i + 1 : -1);
    if (toIdx === undefined) toIdx = i + 1 < n ? i + 1 : -1;
    if (toIdx < 0 || toIdx >= n) return;
    const toX = cx(toIdx) - NODE_W * 0.18;

    const isReversed = mode === 'reverse' && arrows[i] < i && arrows[i] >= 0;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, fromY);
    ctx.strokeStyle = isReversed ? '#22d47a88' : '#1e2836';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Arrow head
    const dir = toX > fromX ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(toX, fromY);
    ctx.lineTo(toX - dir * 7, fromY - 4);
    ctx.lineTo(toX - dir * 7, fromY + 4);
    ctx.closePath();
    ctx.fillStyle = isReversed ? '#22d47a88' : '#1e2836'; ctx.fill();
  });

  // null label
  const lastX = cx(n - 1) + NODE_W * 0.18;
  if (mode !== 'cycle') {
    ctx.fillStyle = '#3a4455'; ctx.font = '10px JetBrains Mono,monospace';
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('null', lastX + 6, cy);
  }

  // Nodes
  arr.forEach((v, i) => {
    const nx = sx + i * (NODE_W + GAP);
    // Val box
    let fill = '#10161e', stroke = '#1e2836', txtColor = '#566070';
    const isCur = i === cur, isPrev = i === prev, isNxt = i === nxt;
    const isSlow = i === slow, isFast = i === fast;
    const isMeet = phase === 'meet' && i === slow && i === fast;
    const isDone = phase === 'done' && i === newHead;

    if (isMeet)       { fill = '#1a1000'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isDone)  { fill = '#082010'; stroke = '#22d47a'; txtColor = '#22d47a'; }
    else if (isCur)   { fill = '#1a1030'; stroke = '#8b5cf6'; txtColor = '#8b5cf6'; }
    else if (isPrev)  { fill = '#071828'; stroke = '#00c8e8'; txtColor = '#00c8e8'; }
    else if (isNxt)   { fill = '#1a0c08'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isSlow && isFast) { fill = '#1a1000'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isSlow)  { fill = '#082010'; stroke = '#22d47a'; txtColor = '#22d47a'; }
    else if (isFast)  { fill = '#1a0508'; stroke = '#f05060'; txtColor = '#f05060'; }

    if (isCur || isPrev || isSlow || isFast || isMeet || isDone) { ctx.shadowColor = stroke; ctx.shadowBlur = 12; }

    // Val section
    ctx.beginPath();
    const vw = NODE_W * 0.65;
    ctx.roundRect(nx, nodeY, vw, NODE_H, [6, 0, 0, 6]);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    // Next ptr section
    ctx.beginPath();
    ctx.roundRect(nx + vw, nodeY, NODE_W * 0.35, NODE_H, [0, 6, 6, 0]);
    ctx.fillStyle = '#0a1018'; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke();

    // Value text
    ctx.fillStyle = txtColor;
    ctx.font = '700 13px JetBrains Mono,monospace';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(v, nx + vw / 2, nodeY + NODE_H / 2);

    // Pointer labels
    const labels = [];
    if (mode === 'reverse') {
      if (isCur) labels.push({ txt: 'cur', color: '#8b5cf6' });
      if (isPrev) labels.push({ txt: 'prev', color: '#00c8e8' });
      if (isNxt) labels.push({ txt: 'next', color: '#f5a623' });
    } else {
      if (isSlow && isFast) labels.push({ txt: 'slow=fast', color: '#f5a623' });
      else {
        if (isSlow) labels.push({ txt: 'slow', color: '#22d47a' });
        if (isFast) labels.push({ txt: 'fast', color: '#f05060' });
      }
    }
    labels.forEach((lb, li) => {
      ctx.fillStyle = lb.color;
      ctx.font = 'bold 9px JetBrains Mono,monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.fillText(lb.txt, nx + vw / 2, nodeY + NODE_H + 4 + li * 13);
    });
  });
}

// ── Component ─────────────────────────────────────────────────────────────
export default function LinkedListVisualizer() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('reverse');
  const [inputStr, setInputStr] = useState('1,2,3,4,5,6,7');
  const [arr, setArr] = useState([1,2,3,4,5,6,7]);
  const [cycleAt, setCycleAt] = useState(2);
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);
  const resetAnim = () => { runner.reset(); setStepData(null); };

  const compute = useCallback((a, m, cp) => {
    const s = m === 'reverse' ? reverseSteps(a) : cycleSteps(a, cp);
    setSteps(s); return s;
  }, []);

  useEffect(() => { compute(arr, mode, cycleAt); }, []);

  useEffect(() => {
    drawLL(canvasRef.current, arr, stepData, mode, cycleAt);
  }, [arr, stepData, mode, cycleAt]);

  const applyInput = () => {
    const p = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 10);
    if (p.length >= 2) { setArr(p); compute(p, mode, cycleAt); resetAnim(); }
  };
  const randomize = () => {
    const a = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 1);
    setArr(a); setInputStr(a.join(',')); compute(a, mode, cycleAt); resetAnim();
  };
  const switchMode = (m) => { setMode(m); compute(arr, m, cycleAt); resetAnim(); };

  const accent = mode === 'reverse' ? 'var(--violet)' : 'var(--red)';

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Linked List</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Reversal (prev/cur/next) · Cycle Detection (Floyd's slow/fast pointers)</div>
        </div>
        <span className="tag tagLinked">Linked List</span>
      </div>

      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:200}} value={inputStr} onChange={e=>setInputStr(e.target.value)} />
        <button className="btn" onClick={applyInput}>Apply</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className={`btn ${mode==='reverse'?'btnStep':''}`} onClick={()=>switchMode('reverse')}>↩ Reverse</button>
        <button className={`btn ${mode==='cycle'?'btnDanger':''}`} onClick={()=>switchMode('cycle')}>⟳ Cycle Detect</button>
        {mode === 'cycle' && (
          <label style={{fontSize:'0.7rem',color:'var(--t3)',display:'flex',alignItems:'center',gap:6}}>
            Cycle at idx:
            <input className="input" style={{width:55}} type="number" value={cycleAt} min={0} max={arr.length-1}
              onChange={e=>{ const cp=Math.max(0,Math.min(parseInt(e.target.value)||0,arr.length-1)); setCycleAt(cp); compute(arr,mode,cp); resetAnim(); }} />
          </label>
        )}
        <div className="divider" />
        <button className="btn btnPrimary" style={{background:accent,borderColor:accent,color:'#000'}} onClick={()=>{resetAnim();setTimeout(runner.play,80);}} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 230px', overflow:'hidden', minHeight:0 }}>
        <div style={{ position:'relative', overflow:'hidden', borderRight:'1px solid var(--border0)' }}>
          <canvas ref={canvasRef} width={900} height={260} style={{ width:'100%', height:'100%', display:'block' }} />
        </div>

        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', fontSize:'0.72rem', color:'var(--t1)', minHeight:50, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>

          {mode === 'reverse' && stepData && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:4 }}>Pointer State</div>
              {[['prev', stepData.prev < 0 ? 'null' : `node[${stepData.prev}] = ${arr[stepData.prev]}`, 'var(--cyan)'],
                ['cur',  stepData.cur  < 0 ? 'null' : `node[${stepData.cur}] = ${arr[stepData.cur]}`,   'var(--violet)'],
                ['next', stepData.next < 0 ? 'null' : `node[${stepData.next}] = ${arr[stepData.next]}`, 'var(--amber)'],
              ].map(([k, v, c]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.7rem' }}>
                  <b style={{ color: c }}>{k}</b>
                  <span style={{ color:'var(--t2)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {mode === 'cycle' && stepData && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:4 }}>Pointer State</div>
              {[['slow', stepData.slow >= 0 ? `node[${stepData.slow}] = ${arr[stepData.slow]}` : 'null', 'var(--green)'],
                ['fast', stepData.fast >= 0 ? `node[${stepData.fast}] = ${arr[stepData.fast]}` : 'null', 'var(--red)'],
                ['iteration', stepData.iter ?? 0, 'var(--amber)'],
              ].map(([k,v,c]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'0.7rem' }}>
                  <b style={{ color: c }}>{k}</b>
                  <span style={{ color:'var(--t2)' }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {[['Time','O(n)','var(--cyan)'],['Space','O(1)','var(--green)'],['In-place','Yes','var(--green)']].map(([k,v,c]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:4 }}>Legend</div>
            {(mode === 'reverse'
              ? [['var(--violet)','cur (current node)'],['var(--cyan)','prev (reversed so far)'],['var(--amber)','next (saved ahead)'],['var(--green)','Reversed arrow ↩']]
              : [['var(--green)','slow (1 step/iter)'],['var(--red)','fast (2 steps/iter)'],['var(--amber)','Meet point = cycle!'],['var(--red)','Cycle back edge']]
            ).map(([c,l]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.65rem', color:'var(--t3)', fontFamily:'var(--sans)' }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO[mode]} activeLine={stepData?.pseudoLine ?? -1} accent={accent} />
      <PlayBar runner={runner} accent={accent} />
    </div>
  );
}
