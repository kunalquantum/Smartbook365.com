import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO_BFS = [
  'function levelOrder(root):',
  '  if root == null: return []',
  '  queue = [root]',
  '  result = []',
  '  while queue not empty:',
  '    node = queue.dequeue()',
  '    result.push(node.val)',
  '    if node.left:  queue.enqueue(left)',
  '    if node.right: queue.enqueue(right)',
  '  return result',
];

const PSEUDO_PATH = [
  'function hasPathSum(root, target):',
  '  if root == null: return false',
  '  if isLeaf(root):',
  '    return root.val == target',
  '  remaining = target - root.val',
  '  return hasPathSum(root.left,  remaining)',
  '         OR hasPathSum(root.right, remaining)',
];

// Build tree from level-order array (null = missing node)
function buildTree(arr) {
  if (!arr.length || arr[0] == null) return null;
  const nodes = arr.map((v, i) => v != null ? { val: v, id: i, left: null, right: null } : null);
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < nodes.length && nodes[l]) nodes[i].left = nodes[l];
    if (r < nodes.length && nodes[r]) nodes[i].right = nodes[r];
  }
  return nodes[0];
}

function assignPos(node, depth, counter) {
  if (!node) return;
  assignPos(node.left, depth + 1, counter);
  node._x = counter.v++;
  node._y = depth;
  assignPos(node.right, depth + 1, counter);
}

function collectNodes(node, arr = []) {
  if (!node) return arr;
  collectNodes(node.left, arr);
  arr.push(node);
  collectNodes(node.right, arr);
  return arr;
}

// BFS steps
function bfsSteps(root) {
  if (!root) return [];
  const steps = [], queue = [root], result = [], levels = [];
  let levelStart = 1, nextLevel = 0, level = 0;

  steps.push({ queue: [root.val], result: [], visited: new Set(), active: null, pseudoLine: 2, msg: 'Enqueue root. Begin level-order traversal.' });

  while (queue.length) {
    const node = queue.shift();
    levelStart--;
    result.push(node.val);
    const visited = new Set(result);
    steps.push({ queue: queue.map(n => n.val), result: [...result], visited: new Set(visited), active: node.val, level, pseudoLine: 5, msg: `Dequeue ${node.val} (level ${level}), add to result` });

    if (node.left) {
      queue.push(node.left); nextLevel++;
      steps.push({ queue: queue.map(n => n.val), result: [...result], visited: new Set(visited), active: node.val, enqueuing: node.left.val, pseudoLine: 7, msg: `Enqueue left child: ${node.left.val}` });
    }
    if (node.right) {
      queue.push(node.right); nextLevel++;
      steps.push({ queue: queue.map(n => n.val), result: [...result], visited: new Set(visited), active: node.val, enqueuing: node.right.val, pseudoLine: 8, msg: `Enqueue right child: ${node.right.val}` });
    }
    if (levelStart === 0) { level++; levelStart = nextLevel; nextLevel = 0; }
  }
  steps.push({ queue: [], result: [...result], visited: new Set(result), active: null, done: true, pseudoLine: 9, msg: `✓ Level-order: [${result.join(' → ')}]` });
  return steps;
}

// Path sum steps
function pathSumSteps(root, target) {
  const steps = [];
  function dfs(node, remaining, path) {
    if (!node) {
      steps.push({ path: [...path], active: null, found: false, remaining, pseudoLine: 1, msg: `null node → return false` });
      return false;
    }
    path.push(node.val);
    const newRem = remaining - node.val;
    const isLeaf = !node.left && !node.right;
    steps.push({ path: [...path], active: node.val, found: false, remaining, newRem, isLeaf, pseudoLine: isLeaf ? 2 : 4, msg: `Visit ${node.val}: remaining ${remaining} - ${node.val} = ${newRem}${isLeaf ? ' (leaf!)' : ''}` });

    if (isLeaf) {
      const found = newRem === 0;
      steps.push({ path: [...path], active: node.val, found, remaining: newRem, pseudoLine: 3, msg: found ? `✓ Leaf! remaining=0, path found: [${path.join('→')}]` : `✗ Leaf but remaining=${newRem} ≠ 0` });
      path.pop();
      return found;
    }
    const l = dfs(node.left, newRem, path);
    if (!l) dfs(node.right, newRem, path);
    path.pop();
    return l;
  }
  const found = dfs(root, target, []);
  steps.push({ path: [], active: null, found, done: true, pseudoLine: -1, msg: found ? `✓ Path with sum ${target} exists!` : `✗ No path with sum ${target}` });
  return steps;
}

// Canvas draw
function drawTree(canvas, root, { visited, active, enqueuing, pathNodes, foundPath }) {
  if (!canvas || !root) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const rootClone = JSON.parse(JSON.stringify(root));
  const counter = { v: 0 };
  assignPos(rootClone, 0, counter);
  const nodes = collectNodes(rootClone);
  const total = counter.v;

  const PAD = 40, R = 19;
  const xS = total > 1 ? (W - PAD * 2) / (total - 1) : 0;
  const maxD = Math.max(...nodes.map(n => n._y), 1);
  const yS = Math.min(70, (H - PAD * 2) / maxD);
  const xy = n => ({ x: PAD + n._x * xS, y: PAD + n._y * yS });

  // Edges
  function drawEdges(n) {
    if (!n) return;
    [n.left, n.right].forEach(child => {
      if (!child) return;
      const { x: px, y: py } = xy(n), { x: cx, y: cy } = xy(child);
      const inPath = pathNodes?.has(n.val) && pathNodes?.has(child.val);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy);
      if (inPath && foundPath) { ctx.shadowColor = '#22d47a'; ctx.shadowBlur = 6; }
      ctx.strokeStyle = inPath && foundPath ? '#22d47a66' : inPath ? '#00c8e866' : '#1e2836';
      ctx.lineWidth = inPath ? 2 : 1.5;
      ctx.stroke(); ctx.shadowBlur = 0;
      drawEdges(child);
    });
  }
  drawEdges(rootClone);

  // Nodes
  nodes.forEach(n => {
    const { x, y } = xy(n);
    const isActive = n.val === active;
    const isVisited = visited?.has(n.val);
    const isEnqueue = n.val === enqueuing;
    const inPath = pathNodes?.has(n.val);

    let fill = '#10161e', stroke = '#1e2836', txtColor = '#566070';
    if (isActive && foundPath) { fill = '#082010'; stroke = '#22d47a'; txtColor = '#22d47a'; }
    else if (isActive)    { fill = '#1a1000'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isEnqueue)   { fill = '#071828'; stroke = '#00c8e8'; txtColor = '#00c8e8'; }
    else if (inPath && foundPath) { fill = '#082010'; stroke = '#22d47a88'; txtColor = '#22d47a'; }
    else if (inPath)      { fill = '#071828'; stroke = '#00c8e866'; txtColor = '#00c8e8'; }
    else if (isVisited)   { fill = '#0a1818'; stroke = '#22d47a55'; txtColor = '#22d47a'; }

    if (isActive || isEnqueue) { ctx.shadowColor = stroke; ctx.shadowBlur = 14; }
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = txtColor;
    ctx.font = `600 11px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(n.val, x, y);
  });
}

export default function TreeTraversalViz() {
  const canvasRef = useRef(null);
  const [subMode, setSubMode] = useState('bfs');
  const [inputStr, setInputStr] = useState('1,2,3,4,5,6,7,8,9,10,11');
  const [targetStr, setTargetStr] = useState('18');
  const [treeArr, setTreeArr] = useState([1,2,3,4,5,6,7,8,9,10,11]);
  const [root, setRoot] = useState(() => buildTree([1,2,3,4,5,6,7,8,9,10,11]));
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const recompute = useCallback((r, m, t) => {
    const s = m === 'bfs' ? bfsSteps(r) : pathSumSteps(r, t);
    setSteps(s); return s;
  }, []);

  useEffect(() => { if (root) recompute(root, subMode, parseInt(targetStr) || 0); }, []);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);
  const resetAnim = () => { runner.reset(); setStepData(null); };

  const applyInput = () => {
    const vals = inputStr.split(',').map(s => { const n = parseInt(s.trim()); return isNaN(n) ? null : n; });
    const r = buildTree(vals);
    if (r) { setRoot(r); setTreeArr(vals); recompute(r, subMode, parseInt(targetStr)||0); resetAnim(); }
  };
  const randomize = () => {
    const n = 11;
    const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 50) + 1);
    const r = buildTree(arr);
    setRoot(r); setTreeArr(arr); setInputStr(arr.join(',')); recompute(r, subMode, parseInt(targetStr)||0); resetAnim();
  };
  const switchMode = m => { setSubMode(m); recompute(root, m, parseInt(targetStr)||0); resetAnim(); };

  useEffect(() => {
    const pathNodes = stepData?.path ? new Set(stepData.path) : new Set();
    const visited = stepData?.visited ?? new Set();
    drawTree(canvasRef.current, root, {
      visited,
      active: stepData?.active ?? null,
      enqueuing: stepData?.enqueuing ?? null,
      pathNodes,
      foundPath: stepData?.found ?? false,
    });
  }, [root, stepData]);

  const accent = subMode === 'bfs' ? 'var(--amber)' : 'var(--green)';
  const pseudo = subMode === 'bfs' ? PSEUDO_BFS : PSEUDO_PATH;
  const result = stepData?.result ?? [];
  const queue = stepData?.queue ?? [];
  const path = stepData?.path ?? [];

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Tree Traversal</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>BFS Level-Order · Path Sum · Watch the queue grow level by level</div>
        </div>
        <span className="tag tagTrees">Trees</span>
      </div>

      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:220}} value={inputStr} onChange={e=>setInputStr(e.target.value)} placeholder="level-order e.g. 1,2,3,null,5" />
        <button className="btn" onClick={applyInput}>Build</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <button className={`btn ${subMode==='bfs'?'btnStep':''}`} style={subMode==='bfs'?{color:'var(--amber)',borderColor:'var(--amber2)'}:{}} onClick={() => switchMode('bfs')}>BFS Level-Order</button>
        <button className={`btn ${subMode==='path'?'btnStep':''}`} style={subMode==='path'?{color:'var(--green)',borderColor:'var(--green2)'}:{}} onClick={() => switchMode('path')}>Path Sum</button>
        {subMode === 'path' && (
          <label style={{fontSize:'0.7rem',color:'var(--t3)',display:'flex',alignItems:'center',gap:6}}>
            Target:
            <input className="input" style={{width:65}} type="number" value={targetStr}
              onChange={e => { setTargetStr(e.target.value); recompute(root, subMode, parseInt(e.target.value)||0); resetAnim(); }} />
          </label>
        )}
        <div className="divider" />
        <button className="btn btnPrimary" style={{background:accent,borderColor:accent,color:'#000'}} onClick={() => { resetAnim(); setTimeout(runner.play, 80); }} disabled={runner.playing}>▶ Play</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 230px', overflow:'hidden', minHeight:0 }}>
        <div style={{ position:'relative', overflow:'hidden', borderRight:'1px solid var(--border0)' }}>
          <canvas ref={canvasRef} width={900} height={320} style={{ width:'100%', height:'100%', display:'block' }} />
        </div>

        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', fontSize:'0.72rem', color:'var(--t1)', minHeight:46, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Press ▶ Play to start</span>}
          </div>

          {/* BFS Queue */}
          {subMode === 'bfs' && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Queue (FIFO)</div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {queue.length === 0 && <span style={{fontSize:'0.7rem',color:'var(--t4)'}}>empty</span>}
                {queue.map((v,i) => (
                  <div key={i} style={{ width:30, height:30, background:'#071828', border:'1px solid var(--cyan2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color:'var(--cyan)' }}>{v}</div>
                ))}
              </div>
            </div>
          )}

          {/* BFS Result */}
          {subMode === 'bfs' && result.length > 0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Visit Order</div>
              <div style={{ fontSize:'0.72rem', color:'var(--amber)', fontFamily:'var(--mono)' }}>{result.join(' → ')}</div>
            </div>
          )}

          {/* Path Sum current path */}
          {subMode === 'path' && path.length > 0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Current Path</div>
              <div style={{ fontSize:'0.72rem', color:'var(--green)', fontFamily:'var(--mono)' }}>{path.join(' → ')}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--t3)', marginTop:6 }}>
                Sum: {path.reduce((a,b)=>a+b,0)} / Target: {targetStr}
              </div>
            </div>
          )}

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {[['Time','O(n)','var(--cyan)'],['Space',subMode==='bfs'?'O(w) queue width':'O(h) call stack','var(--amber)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Legend</div>
            {(subMode==='bfs'
              ? [['var(--amber)','Current (dequeued)'],['var(--cyan)','Just enqueued'],['var(--green)','Already visited']]
              : [['var(--amber)','Currently visiting'],['var(--cyan)','On current path'],['var(--green)','Path found!']]
            ).map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.65rem', color:'var(--t3)', fontFamily:'var(--sans)' }}>
                <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={pseudo} activeLine={stepData?.pseudoLine ?? -1} accent={accent} />
      <PlayBar runner={runner} accent={accent} />
    </div>
  );
}
