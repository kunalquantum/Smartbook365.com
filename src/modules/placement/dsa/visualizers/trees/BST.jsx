import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

const PSEUDO_INSERT = [
  'function insert(root, val):',
  '  if root == null:',
  '    return new Node(val)    // base case',
  '  if val < root.val:',
  '    root.left = insert(root.left, val)',
  '  elif val > root.val:',
  '    root.right = insert(root.right, val)',
  '  return root              // unchanged',
];
const PSEUDO_SEARCH = [
  'function search(root, val):',
  '  if root == null: return false',
  '  if val == root.val: return true',
  '  if val < root.val:',
  '    return search(root.left, val)',
  '  else:',
  '    return search(root.right, val)',
];

// ── BST logic ─────────────────────────────────────────────────────────────
class BSTNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; this.id = Math.random(); }
}

function cloneTree(n) {
  if (!n) return null;
  const c = new BSTNode(n.val); c.id = n.id; c.left = cloneTree(n.left); c.right = cloneTree(n.right); return c;
}

function insertNode(root, val) {
  if (!root) return new BSTNode(val);
  if (val < root.val) root.left = insertNode(root.left, val);
  else if (val > root.val) root.right = insertNode(root.right, val);
  return root;
}

function buildBST(vals) {
  let r = null; vals.forEach(v => { r = insertNode(r, v); }); return r;
}

function insertSteps(root, val) {
  const steps = [];
  const path = [];
  function traverse(node) {
    if (!node) {
      steps.push({ path: [...path], highlight: null, found: false, inserted: val, pseudoLine: 2, msg: `Reached null → insert ${val} here` });
      return new BSTNode(val);
    }
    path.push(node.val);
    steps.push({ path: [...path], highlight: node.val, found: false, pseudoLine: 3, msg: `Visit ${node.val}: ${val} ${val < node.val ? '<' : val > node.val ? '>' : '='} ${node.val} → go ${val < node.val ? 'left' : val > node.val ? 'right' : '(duplicate)'}` });
    if (val < node.val) { node.left = traverse(node.left); }
    else if (val > node.val) { node.right = traverse(node.right); }
    return node;
  }
  const newRoot = cloneTree(root);
  traverse(newRoot);
  steps.push({ path, highlight: val, found: true, inserted: val, pseudoLine: 7, msg: `✓ ${val} inserted into BST` });
  return { steps, newRoot };
}

function searchSteps(root, val) {
  const steps = [];
  const path = [];
  function traverse(node) {
    if (!node) {
      steps.push({ path: [...path], highlight: null, found: false, pseudoLine: 1, msg: `Reached null → ${val} not in BST` }); return;
    }
    path.push(node.val);
    if (val === node.val) {
      steps.push({ path: [...path], highlight: node.val, found: true, pseudoLine: 2, msg: `✓ Found ${val} at this node!` }); return;
    }
    steps.push({ path: [...path], highlight: node.val, found: false, pseudoLine: 3, msg: `${val} ${val < node.val ? '<' : '>'} ${node.val} → go ${val < node.val ? 'left' : 'right'}` });
    if (val < node.val) traverse(node.left); else traverse(node.right);
  }
  traverse(root);
  return steps;
}

function traversalSteps(root, mode) {
  const steps = [], visited = [];
  function pre(n)  { if (!n) return; visited.push(n.val); steps.push({ visited:[...visited], active:n.val, pseudoLine:mode==='pre'?1:mode==='in'?2:3, msg:`Visit ${n.val}` }); pre(n.left); pre(n.right); }
  function ino(n)  { if (!n) return; ino(n.left); visited.push(n.val); steps.push({ visited:[...visited], active:n.val, pseudoLine:2, msg:`Visit ${n.val}` }); ino(n.right); }
  function post(n) { if (!n) return; post(n.left); post(n.right); visited.push(n.val); steps.push({ visited:[...visited], active:n.val, pseudoLine:3, msg:`Visit ${n.val}` }); }
  if (mode==='pre') pre(root); else if (mode==='in') ino(root); else post(root);
  return steps;
}

// ── Layout ─────────────────────────────────────────────────────────────────
function layoutTree(root) {
  if (!root) return { nodes: [], edges: [] };
  const nodes = [], edges = [];
  const counter = { v: 0 };
  function dfs(n, depth, parent) {
    if (!n) return;
    dfs(n.left, depth + 1, n);
    n._x = counter.v++; n._y = depth;
    dfs(n.right, depth + 1, n);
    nodes.push(n);
    if (parent) edges.push([parent.val, n.val, parent._x, parent._y, n._x, n._y]);
  }
  dfs(root, 0, null);
  return { nodes, edges, total: counter.v };
}

// ── Canvas draw ─────────────────────────────────────────────────────────────
function drawBST(canvas, root, { pathSet, highlight, visitedSet, activeNode, insertedVal }) {
  if (!canvas || !root) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const { nodes, edges, total } = layoutTree(root);
  const PAD = 44, R = 20;
  const xS = total > 1 ? (W - PAD * 2) / (total - 1) : 0;
  const maxDepth = Math.max(...nodes.map(n => n._y), 1);
  const yS = Math.min(72, (H - PAD * 2) / maxDepth);
  const xy = n => ({ x: PAD + n._x * xS, y: PAD + n._y * yS });

  // Edges first
  edges.forEach(([pv, cv]) => {
    const pn = nodes.find(n => n.val === pv), cn = nodes.find(n => n.val === cv);
    if (!pn || !cn) return;
    const { x: px, y: py } = xy(pn), { x: cx, y: cy } = xy(cn);
    const inPath = pathSet.has(pv) && pathSet.has(cv);
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy);
    if (inPath) { ctx.shadowColor = '#00c8e8'; ctx.shadowBlur = 6; }
    ctx.strokeStyle = inPath ? '#00c8e840' : '#1e2836';
    ctx.lineWidth = inPath ? 2 : 1.5;
    ctx.stroke(); ctx.shadowBlur = 0;
  });

  // Nodes
  nodes.forEach(n => {
    const { x, y } = xy(n);
    const isPath = pathSet.has(n.val);
    const isHL = n.val === highlight;
    const isVisited = visitedSet.has(n.val);
    const isActive = n.val === activeNode;
    const isInserted = n.val === insertedVal;

    let fill = '#10161e', stroke = '#1e2836', txtColor = '#566070';
    if (isInserted) { fill = '#0d2818'; stroke = '#22d47a'; txtColor = '#22d47a'; }
    else if (isHL)  { fill = '#1a1030'; stroke = '#8b5cf6'; txtColor = '#8b5cf6'; }
    else if (isActive) { fill = '#1a1000'; stroke = '#f5a623'; txtColor = '#f5a623'; }
    else if (isVisited) { fill = '#082010'; stroke = '#22d47a88'; txtColor = '#22d47a'; }
    else if (isPath) { fill = '#071828'; stroke = '#00c8e8'; txtColor = '#00c8e8'; }

    // Glow
    if (isHL || isActive || isInserted) {
      ctx.shadowColor = stroke; ctx.shadowBlur = 16;
    }

    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2);
    ctx.fillStyle = fill; ctx.fill();
    ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.fillStyle = txtColor;
    ctx.font = `600 12px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(n.val, x, y);
  });
}

// ── Component ──────────────────────────────────────────────────────────────
export default function BSTVisualizer() {
  const canvasRef = useRef(null);
  const [root, setRoot] = useState(() => buildBST([50,30,70,20,40,60,80,10,35,45]));
  const [inputStr, setInputStr] = useState('50,30,70,20,40,60,80,10,35,45');
  const [insertVal, setInsertVal] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [traversalMode, setTraversalMode] = useState('in');
  const [mode, setMode] = useState('insert'); // insert | search | traversal
  const [stepData, setStepData] = useState(null);
  const [steps, setSteps] = useState([]);

  const onStep = useCallback((step) => setStepData(step), []);
  const runner = useStepRunner(steps, onStep);

  const resetAnim = () => { runner.reset(); setStepData(null); };

  const buildFromInput = () => {
    const vals = inputStr.split(',').map(s=>parseInt(s.trim())).filter(n=>!isNaN(n));
    if (vals.length) { setRoot(buildBST(vals)); resetAnim(); }
  };
  const randomize = () => {
    const s = new Set(); while(s.size<10) s.add(Math.floor(Math.random()*90)+5);
    const vals = [...s];
    setRoot(buildBST(vals)); setInputStr(vals.join(',')); resetAnim();
  };

  const doInsert = () => {
    const v = parseInt(insertVal); if(isNaN(v)) return;
    const newRoot = cloneTree(root);
    insertNode(newRoot, v);
    const { steps: newSteps } = insertSteps(root, v);
    setSteps(newSteps); setMode('insert'); resetAnim();
    setRoot(insertNode(cloneTree(root), v));
    setInsertVal('');
  };

  const doSearch = () => {
    const v = parseInt(searchVal); if(isNaN(v)||!root) return;
    setSteps(searchSteps(root, v)); setMode('search'); resetAnim();
    setSearchVal('');
  };

  const doTraversal = () => {
    if (!root) return;
    setSteps(traversalSteps(root, traversalMode)); setMode('traversal'); resetAnim();
  };

  // Draw on each step change
  useEffect(() => {
    const pathSet = new Set(stepData?.path ?? []);
    const visitedSet = new Set(stepData?.visited ?? []);
    drawBST(canvasRef.current, root, {
      pathSet,
      highlight: stepData?.highlight ?? null,
      visitedSet,
      activeNode: stepData?.active ?? null,
      insertedVal: (mode === 'insert' && stepData?.found) ? stepData.inserted : null,
    });
  }, [root, stepData, mode]);

  const pseudo = mode === 'search' ? PSEUDO_SEARCH : PSEUDO_INSERT;
  const accent = mode === 'traversal' ? 'var(--amber)' : mode === 'search' ? 'var(--cyan)' : 'var(--violet)';

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      {/* Header */}
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Binary Search Tree</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>Insert · Search · Traversal · left &lt; root &lt; right at every node</div>
        </div>
        <span className="tag tagTrees">Trees</span>
      </div>

      {/* Controls */}
      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <input className="input" style={{width:220}} value={inputStr} onChange={e=>setInputStr(e.target.value)} placeholder="values to build BST" />
        <button className="btn" onClick={buildFromInput}>Build</button>
        <button className="btn" onClick={randomize}>⚄ Random</button>
        <div className="divider" />
        <input className="input" style={{width:70}} value={insertVal} onChange={e=>setInsertVal(e.target.value)} placeholder="value" onKeyDown={e=>e.key==='Enter'&&doInsert()} />
        <button className="btn btnSuccess" onClick={doInsert}>+ Insert</button>
        <div className="divider" />
        <input className="input" style={{width:70}} value={searchVal} onChange={e=>setSearchVal(e.target.value)} placeholder="value" onKeyDown={e=>e.key==='Enter'&&doSearch()} />
        <button className="btn" style={{color:'var(--cyan)',borderColor:'var(--cyan2)'}} onClick={doSearch}>🔍 Search</button>
        <div className="divider" />
        <select className="select" value={traversalMode} onChange={e=>{setTraversalMode(e.target.value);resetAnim();}}>
          <option value="in">Inorder</option>
          <option value="pre">Preorder</option>
          <option value="post">Postorder</option>
        </select>
        <button className="btn" style={{color:'var(--amber)',borderColor:'#3a2800'}} onClick={doTraversal}>▶ Traverse</button>
        <button className="btn btnDanger" onClick={resetAnim}>✕ Clear</button>
      </div>

      {/* Body */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 220px', overflow:'hidden', minHeight:0 }}>
        {/* Canvas */}
        <div style={{ position:'relative', overflow:'hidden', borderRight:'1px solid var(--border0)' }}>
          <canvas ref={canvasRef} width={900} height={340}
            style={{ width:'100%', height:'100%', display:'block' }} />
          {!root && (
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--t4)', fontSize:'0.8rem' }}>
              Enter values above and click Build
            </div>
          )}
        </div>

        {/* Side panel */}
        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:12, overflowY:'auto' }}>
          {/* Step message */}
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', fontSize:'0.72rem', color:'var(--t1)', minHeight:50, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Use controls above, then press ▶ Play</span>}
          </div>

          {/* Path so far */}
          {stepData?.path?.length > 0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:7 }}>Search Path</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {stepData.path.map((v,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:3 }}>
                    {i>0 && <span style={{color:'var(--t4)',fontSize:'0.7rem'}}>→</span>}
                    <div style={{ padding:'2px 8px', background: i===stepData.path.length-1?'#1a1030':'var(--bg4)', border:`1px solid ${i===stepData.path.length-1?'var(--violet)':'var(--border2)'}`, borderRadius:5, fontSize:'0.72rem', fontWeight:600, color:i===stepData.path.length-1?'var(--violet)':'var(--t2)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traversal order */}
          {mode === 'traversal' && stepData?.visited?.length > 0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:7 }}>
                {traversalMode==='in'?'Inorder':traversalMode==='pre'?'Preorder':'Postorder'} (sorted: {traversalMode==='in'?'yes':'no'})
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                {stepData.visited.map((v,i)=>(
                  <div key={i} style={{ padding:'2px 8px', background:i===stepData.visited.length-1?'#1a1000':'#0a1810', border:`1px solid ${i===stepData.visited.length-1?'var(--amber)':'var(--green2)'}`, borderRadius:5, fontSize:'0.7rem', fontWeight:600, color:i===stepData.visited.length-1?'var(--amber)':'var(--green)' }}>{v}</div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {[['Search','O(h)','var(--cyan)'],['Insert','O(h)','var(--violet)'],['Best h','O(log n)','var(--green)'],['Worst h','O(n)','var(--red)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>

          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Legend</div>
            {[['var(--cyan)','Search path'],['var(--violet)','Current node'],['var(--green)','Visited / Inserted'],['var(--amber)','Traversal cursor']].map(([c,l])=>(
              <div key={l} style={{ display:'flex', alignItems:'center', gap:7, fontSize:'0.66rem', color:'var(--t3)', fontFamily:'var(--sans)' }}>
                <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={pseudo} activeLine={stepData?.pseudoLine??-1} accent={accent} />
      <PlayBar runner={runner} accent={accent} />
    </div>
  );
}
