import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO_INSERT = [
  'function insert(heap, val):',
  '  heap.append(val)        // add at end',
  '  i = heap.length - 1',
  '  while i > 0:            // sift up',
  '    parent = (i - 1) // 2',
  '    if heap[parent] < heap[i]:',
  '      swap(heap[parent], heap[i])',
  '      i = parent',
  '    else: break           // heap property OK',
];

const PSEUDO_EXTRACT = [
  'function extractMax(heap):',
  '  max = heap[0]',
  '  heap[0] = heap.pop()    // move last to root',
  '  i = 0                   // sift down',
  '  while true:',
  '    largest = i',
  '    l = 2*i+1, r = 2*i+2',
  '    if l < n AND heap[l] > heap[largest]: largest=l',
  '    if r < n AND heap[r] > heap[largest]: largest=r',
  '    if largest == i: break',
  '    swap(heap[i], heap[largest])',
  '    i = largest',
];

function insertSteps(heap, val) {
  const h = [...heap, val];
  const steps = [];
  let i = h.length - 1;
  steps.push({ heap: [...h], i, parent: -1, phase: 'inserted', pseudoLine: 1, msg: `Insert ${val} at index ${i} (end of array)` });

  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    steps.push({ heap: [...h], i, parent, phase: 'compare', pseudoLine: 5, msg: `Compare h[${i}]=${h[i]} with parent h[${parent}]=${h[parent]}` });
    if (h[parent] < h[i]) {
      [h[i], h[parent]] = [h[parent], h[i]];
      steps.push({ heap: [...h], i, parent, phase: 'swap', pseudoLine: 6, msg: `h[${parent}]=${h[parent]} < h[${i}]=${h[i]}, wait — after swap: h[${parent}]=${h[parent]}, h[${i}]=${h[i]}` });
      i = parent;
    } else {
      steps.push({ heap: [...h], i, parent, phase: 'done_sift', pseudoLine: 8, msg: `h[${parent}]=${h[parent]} ≥ h[${i}]=${h[i]}, heap property satisfied ✓` });
      break;
    }
  }
  steps.push({ heap: [...h], i: 0, parent: -1, phase: 'done', pseudoLine: -1, msg: `✓ Inserted ${val}. Max heap: [${h.join(', ')}]` });
  return { steps, newHeap: h };
}

function extractSteps(heap) {
  if (!heap.length) return { steps: [], newHeap: [] };
  const h = [...heap];
  const steps = [];
  const max = h[0];
  steps.push({ heap: [...h], i: 0, largest: -1, l: -1, r: -1, phase: 'read_max', pseudoLine: 1, msg: `Max = h[0] = ${max}` });

  h[0] = h[h.length - 1];
  h.pop();
  steps.push({ heap: [...h], i: 0, largest: -1, l: -1, r: -1, phase: 'moved', pseudoLine: 2, msg: `Move last element to root. Heap size: ${h.length}` });

  let i = 0;
  while (true) {
    const l = 2 * i + 1, r = 2 * i + 2;
    let largest = i;
    steps.push({ heap: [...h], i, largest, l: l < h.length ? l : -1, r: r < h.length ? r : -1, phase: 'check', pseudoLine: 5, msg: `At i=${i}, check children: l=${l<h.length?h[l]:'—'}, r=${r<h.length?h[r]:'—'}` });
    if (l < h.length && h[l] > h[largest]) largest = l;
    if (r < h.length && h[r] > h[largest]) largest = r;
    if (largest === i) {
      steps.push({ heap: [...h], i, largest, l: l<h.length?l:-1, r: r<h.length?r:-1, phase: 'done_sift', pseudoLine: 9, msg: `i=${i} is already largest ✓, heap property satisfied` });
      break;
    }
    steps.push({ heap: [...h], i, largest, l: l<h.length?l:-1, r: r<h.length?r:-1, phase: 'swap', pseudoLine: 10, msg: `Swap h[${i}]=${h[i]} with h[${largest}]=${h[largest]}` });
    [h[i], h[largest]] = [h[largest], h[i]];
    i = largest;
  }
  steps.push({ heap: [...h], i: 0, largest: -1, l: -1, r: -1, phase: 'done', extractedMax: max, pseudoLine: -1, msg: `✓ Extracted max=${max}. Heap: [${h.join(', ')}]` });
  return { steps, newHeap: h };
}

// Canvas: draw heap as binary tree
function drawHeap(canvas, heap, { activeI, parent, largest, l, r, phase }) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (!heap.length) return;

  const n = heap.length;
  const depth = Math.floor(Math.log2(n));
  const R = 20;

  // Position: for node i, level = floor(log2(i+1)), pos within level
  const getXY = (i) => {
    const level = Math.floor(Math.log2(i + 1));
    const levelStart = Math.pow(2, level) - 1;
    const levelCount = Math.pow(2, level);
    const posInLevel = i - levelStart;
    const x = (W / (levelCount + 1)) * (posInLevel + 1);
    const y = 40 + level * Math.min(70, (H - 60) / Math.max(depth, 1));
    return { x, y };
  };

  // Edges first
  for (let i = 1; i < n; i++) {
    const p = Math.floor((i - 1) / 2);
    const { x: px, y: py } = getXY(p);
    const { x: cx, y: cy } = getXY(i);
    const isSwapEdge = (i === activeI && p === parent) || (i === largest && p === activeI);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy);
    ctx.strokeStyle = isSwapEdge ? '#8b5cf666' : '#1e2836';
    ctx.lineWidth = isSwapEdge ? 2 : 1.5;
    if (isSwapEdge) { ctx.shadowColor = '#8b5cf6'; ctx.shadowBlur = 6; }
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  // Nodes
  for (let i = 0; i < n; i++) {
    const { x, y } = getXY(i);
    const isActive = i === activeI;
    const isParent = i === parent;
    const isLargest = i === largest;
    const isL = i === l;
    const isR = i === r;
    const isRoot = i === 0;

    let fill = '#10161e', stroke = '#1e2836', txtColor = '#566070';
    if (isActive && phase === 'swap') { fill = '#1a0a28'; stroke = '#8b5cf6'; txtColor = '#8b5cf6'; }
    else if (isLargest && phase === 'swap') { fill = '#1a0a28'; stroke = '#8b5cf6'; txtColor = '#8b5cf6'; }
    else if (isActive)   { fill = '#1a1000'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isParent)   { fill = '#071828'; stroke = '#00c8e8'; txtColor = '#00c8e8'; }
    else if (isRoot && phase !== 'done') { fill = '#082010'; stroke = '#22d47a'; txtColor = '#22d47a'; }
    else if (isL || isR) { fill = '#0c1820'; stroke = '#1e3040'; txtColor = 'var(--t2)'; }

    if (isActive || isParent || isLargest) { ctx.shadowColor = stroke; ctx.shadowBlur = 12; }
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = txtColor;
    ctx.font = `600 11px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(heap[i], x, y);

    // Index label
    ctx.fillStyle = '#3a4455';
    ctx.font = '9px JetBrains Mono, monospace';
    ctx.fillText(`[${i}]`, x, y + R + 9);
  }

  // Root label
  if (heap.length > 0) {
    const { x, y } = getXY(0);
    ctx.fillStyle = '#22d47a';
    ctx.font = 'bold 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('MAX', x, y - R - 8);
  }
}

export default function HeapViz() {
  const canvasRef = useRef(null);
  const [heap, setHeap] = useState([90, 75, 80, 55, 60, 50, 65]);
  const [inputStr, setInputStr] = useState('90,75,80,55,60,50,65');
  const [insertVal, setInsertVal] = useState('');
  const [subMode, setSubMode] = useState('insert');
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);
  const pendingHeapRef = useRef(heap);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);
  const resetAnim = () => { runner.reset(); setStepData(null); };

  useEffect(() => {
    const { i, parent, largest, l, r, phase } = stepData ?? {};
    drawHeap(canvasRef.current, stepData?.heap ?? heap, { activeI: i ?? -1, parent: parent ?? -1, largest: largest ?? -1, l: l ?? -1, r: r ?? -1, phase: phase ?? '' });
  }, [heap, stepData]);

  const doInsert = () => {
    const v = parseInt(insertVal); if (isNaN(v)) return;
    const { steps: s, newHeap } = insertSteps(heap, v);
    pendingHeapRef.current = newHeap;
    setSteps(s); setSubMode('insert'); resetAnim();
    setInsertVal('');
    // Update heap after animation finishes
    const totalTime = s.length * 500 + 200;
    setTimeout(() => { setHeap(newHeap); }, totalTime);
  };

  const doExtract = () => {
    if (!heap.length) return;
    const { steps: s, newHeap } = extractSteps(heap);
    pendingHeapRef.current = newHeap;
    setSteps(s); setSubMode('extract'); resetAnim();
    const totalTime = s.length * 500 + 200;
    setTimeout(() => { setHeap(newHeap); }, totalTime);
  };

  const buildFromInput = () => {
    const vals = inputStr.split(',').map(v => parseInt(v.trim())).filter(n => !isNaN(n)).slice(0, 15);
    // Build a valid max heap from vals using heapify
    const h = [...vals];
    for (let i = Math.floor(h.length/2) - 1; i >= 0; i--) {
      let cur = i;
      while (true) {
        const l = 2*cur+1, r = 2*cur+2; let lg = cur;
        if (l < h.length && h[l] > h[lg]) lg = l;
        if (r < h.length && h[r] > h[lg]) lg = r;
        if (lg === cur) break;
        [h[cur], h[lg]] = [h[lg], h[cur]]; cur = lg;
      }
    }
    setHeap(h); setInputStr(h.join(',')); resetAnim();
  };

  const randomize = () => {
    const s = new Set(); while(s.size < 8) s.add(Math.floor(Math.random()*90)+5);
    setInputStr([...s].join(','));
    const h = [...s];
    for (let i = Math.floor(h.length/2)-1; i>=0; i--) {
      let cur=i;
      while(true){const l=2*cur+1,r=2*cur+2;let lg=cur;if(l<h.length&&h[l]>h[lg])lg=l;if(r<h.length&&h[r]>h[lg])lg=r;if(lg===cur)break;[h[cur],h[lg]]=[h[lg],h[cur]];cur=lg;}
    }
    setHeap(h); resetAnim();
  };

  const pseudo = subMode === 'insert' ? PSEUDO_INSERT : PSEUDO_EXTRACT;

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Max Heap / Priority Queue</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Insert O(log n) · Extract-Max O(log n) · Sift Up · Sift Down</div>
        </div>
        <span className="tag tagTrees">Heap</span>
      </div>

      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:200}} value={inputStr} onChange={e=>setInputStr(e.target.value)} placeholder="values to heapify" />
        <button className="btn" onClick={buildFromInput}>Heapify</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <input className="input" style={{width:75}} value={insertVal} onChange={e=>setInsertVal(e.target.value)} placeholder="insert val" onKeyDown={e=>e.key==='Enter'&&doInsert()} />
        <button className="btn btnSuccess" onClick={doInsert}>+ Insert</button>
        <button className="btn btnDanger" onClick={doExtract} disabled={!heap.length}>↑ Extract Max</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 230px', overflow:'hidden', minHeight:0 }}>
        <div style={{ overflow:'hidden', borderRight:'1px solid var(--border0)', display:'flex', flexDirection:'column' }}>
          {/* Tree canvas */}
          <div style={{ flex:1, position:'relative' }}>
            <canvas ref={canvasRef} width={900} height={240} style={{ width:'100%', height:'100%', display:'block' }} />
          </div>
          {/* Array representation */}
          <div style={{ padding:'10px 24px', borderTop:'1px solid var(--border0)', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)' }}>Array Representation (parent of i = ⌊(i-1)/2⌋)</div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {(stepData?.heap ?? heap).map((v, i) => {
                const isActive = i === stepData?.i;
                const isParent = i === stepData?.parent;
                const isLargest = i === stepData?.largest;
                let bc = 'var(--border2)', color = 'var(--t2)', bg = 'var(--bg4)';
                if (i === 0) { bc = 'var(--green2)'; color = 'var(--green)'; bg = '#082010'; }
                if (isActive || isLargest) { bc = 'var(--violet)'; color = 'var(--violet)'; bg = '#1a0a28'; }
                if (isParent) { bc = 'var(--cyan)'; color = 'var(--cyan)'; bg = '#071828'; }
                return (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                    <div style={{ width:40, height:36, background:bg, border:`1px solid ${bc}`, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.82rem', fontWeight:700, color, transition:'all 0.25s', boxShadow:(isActive||isParent||isLargest)?`0 0 10px ${bc}50`:'none' }}>{v}</div>
                    <div style={{ fontSize:'0.55rem', color:'var(--t4)' }}>[{i}]</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', fontSize:'0.72rem', color:'var(--t1)', minHeight:50, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Insert a value or Extract Max to animate</span>}
          </div>

          {stepData?.extractedMax !== undefined && (
            <div style={{ background:'#082010', border:'1px solid var(--green)', borderRadius:8, padding:'10px 14px', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{fontSize:'0.72rem',color:'var(--t3)'}}>Extracted Max:</span>
              <span style={{fontFamily:'var(--display)',fontSize:'1.4rem',fontWeight:800,color:'var(--green)'}}>{stepData.extractedMax}</span>
            </div>
          )}

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {[['Insert','O(log n)','var(--cyan)'],['Extract Max','O(log n)','var(--amber)'],['Get Max','O(1)','var(--green)'],['Build heap','O(n)','var(--violet)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)' }}>Key Insight</div>
            <p style={{ fontSize:'0.66rem', color:'var(--t3)', lineHeight:1.6, fontFamily:'var(--sans)' }}>
              Insert: append to end, sift <b style={{color:'var(--cyan)'}}>up</b> until parent is larger.<br/>
              Extract: move last to root, sift <b style={{color:'var(--amber)'}}>down</b> swapping with largest child.
            </p>
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Legend</div>
            {[['var(--green)','Root (max element)'],['var(--amber)','Currently sifting'],['var(--cyan)','Parent node'],['var(--violet)','Swap pair']].map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.65rem', color:'var(--t3)', fontFamily:'var(--sans)' }}>
                <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={pseudo} activeLine={stepData?.pseudoLine ?? -1} accent="var(--amber)" />
      <PlayBar runner={runner} accent="var(--amber)" />
    </div>
  );
}
