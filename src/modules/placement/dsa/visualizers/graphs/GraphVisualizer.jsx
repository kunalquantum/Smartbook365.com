import { useState, useRef, useEffect, useCallback } from 'react';
import PlayBar from '../../components/PlayBar';
import PseudoCode from '../../components/PseudoCode';
import { useStepRunner } from '../../hooks/useStepRunner';

// ── Graph presets ─────────────────────────────────────────────────────────
const UNDIRECTED_GRAPH = {
  nodes: [0,1,2,3,4,5,6,7],
  edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[3,7],[4,7],[5,6]],
  pos: [{x:0.5,y:0.08},{x:0.25,y:0.32},{x:0.75,y:0.32},{x:0.1,y:0.6},{x:0.4,y:0.6},{x:0.6,y:0.6},{x:0.9,y:0.6},{x:0.25,y:0.88}],
};
const WEIGHTED_GRAPH = {
  nodes: [0,1,2,3,4,5],
  edges: [[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,4,5],[3,4,3],[3,5,2],[4,5,1]],
  pos: [{x:0.08,y:0.5},{x:0.42,y:0.12},{x:0.42,y:0.85},{x:0.68,y:0.12},{x:0.68,y:0.85},{x:0.92,y:0.5}],
};
const DAG = {
  nodes: [0,1,2,3,4,5],
  edges: [[5,2],[5,0],[4,0],[4,1],[2,3],[3,1]],
  pos: [{x:0.85,y:0.5},{x:0.85,y:0.85},{x:0.55,y:0.32},{x:0.55,y:0.7},{x:0.12,y:0.62},{x:0.12,y:0.2}],
};

// ── Step generators ────────────────────────────────────────────────────────
function bfsSteps(graph, start) {
  const adj = {}; graph.nodes.forEach(n=>adj[n]=[]);
  graph.edges.forEach(([a,b])=>{ adj[a].push(b); adj[b].push(a); });
  const steps=[], vis=new Set(), queue=[start]; vis.add(start);
  steps.push({ vis:new Set(vis), active:start, queue:[...queue], edge:null, pseudoLine:1, msg:`Init: enqueue start node ${start}` });
  while(queue.length) {
    const cur=queue.shift();
    steps.push({ vis:new Set(vis), active:cur, queue:[...queue], edge:null, pseudoLine:3, msg:`Dequeue ${cur}, explore neighbors` });
    for(const nb of adj[cur]) {
      if(!vis.has(nb)) {
        vis.add(nb); queue.push(nb);
        steps.push({ vis:new Set(vis), active:nb, queue:[...queue], edge:[cur,nb], pseudoLine:5, msg:`${nb} unvisited → enqueue, mark visited` });
      } else {
        steps.push({ vis:new Set(vis), active:cur, queue:[...queue], edge:[cur,nb], pseudoLine:4, msg:`${nb} already visited → skip` });
      }
    }
  }
  steps.push({ vis:new Set(vis), active:-1, queue:[], pseudoLine:-1, done:true, msg:`BFS complete. Visited: [${[...vis].join(', ')}]` });
  return steps;
}

function dfsSteps(graph, start) {
  const adj = {}; graph.nodes.forEach(n=>adj[n]=[]);
  graph.edges.forEach(([a,b])=>{ adj[a].push(b); adj[b].push(a); });
  const steps=[], vis=new Set(), stack=[];
  function dfs(node, from) {
    vis.add(node); stack.push(node);
    steps.push({ vis:new Set(vis), active:node, stack:[...stack], edge:from!=null?[from,node]:null, pseudoLine:2, msg:`Visit ${node} (depth=${stack.length-1})` });
    for(const nb of adj[node]) {
      if(!vis.has(nb)) { dfs(nb, node); }
      else { steps.push({ vis:new Set(vis), active:node, stack:[...stack], edge:[node,nb], pseudoLine:4, msg:`${nb} already visited → backtrack` }); }
    }
    stack.pop();
    steps.push({ vis:new Set(vis), active:node, stack:[...stack], edge:null, pseudoLine:5, msg:`Backtrack from ${node}` });
  }
  dfs(start, null);
  steps.push({ vis:new Set(vis), active:-1, stack:[], pseudoLine:-1, done:true, msg:`DFS complete. Order: [${[...vis].join(', ')}]` });
  return steps;
}

function dijkstraSteps(graph) {
  const adj={}; graph.nodes.forEach(n=>adj[n]=[]);
  graph.edges.forEach(([a,b,w])=>{ adj[a].push([b,w]); adj[b].push([a,w]); });
  const dist={}, vis=new Set(), steps=[];
  graph.nodes.forEach(n=>dist[n]=Infinity); dist[0]=0;
  steps.push({ dist:{...dist}, vis:new Set(vis), active:-1, relaxEdge:null, pseudoLine:1, msg:`Init: dist[0]=0, all others=∞` });
  for(let iter=0;iter<graph.nodes.length;iter++) {
    let u=-1;
    graph.nodes.forEach(n=>{ if(!vis.has(n)&&(u===-1||dist[n]<dist[u])) u=n; });
    if(u===-1||dist[u]===Infinity) break;
    vis.add(u);
    steps.push({ dist:{...dist}, vis:new Set(vis), active:u, relaxEdge:null, pseudoLine:3, msg:`Pick min-dist unvisited: node ${u} (dist=${dist[u]})` });
    for(const [v,w] of adj[u]) {
      if(!vis.has(v)&&dist[u]+w<dist[v]) {
        dist[v]=dist[u]+w;
        steps.push({ dist:{...dist}, vis:new Set(vis), active:u, relaxEdge:[u,v], pseudoLine:5, msg:`Relax ${u}→${v} (w=${w}): new dist[${v}]=${dist[v]}` });
      }
    }
  }
  steps.push({ dist:{...dist}, vis:new Set(vis), active:-1, relaxEdge:null, pseudoLine:-1, done:true, msg:`All shortest paths found!` });
  return steps;
}

function topoSteps(graph) {
  const adj={}, indeg={};
  graph.nodes.forEach(n=>{ adj[n]=[]; indeg[n]=0; });
  graph.edges.forEach(([a,b])=>{ adj[a].push(b); indeg[b]++; });
  const steps=[], result=[], queue=graph.nodes.filter(n=>indeg[n]===0);
  steps.push({ indeg:{...indeg}, queue:[...queue], result:[], active:-1, pseudoLine:1, msg:`Init: zero-indegree nodes = [${queue.join(', ')}]` });
  while(queue.length) {
    queue.sort((a,b)=>a-b);
    const cur=queue.shift(); result.push(cur);
    steps.push({ indeg:{...indeg}, queue:[...queue], result:[...result], active:cur, pseudoLine:3, msg:`Process ${cur}: remove outgoing edges` });
    for(const nb of adj[cur]) {
      indeg[nb]--;
      steps.push({ indeg:{...indeg}, queue:[...queue], result:[...result], active:cur, relaxEdge:[cur,nb], pseudoLine:5, msg:`indeg[${nb}]-- = ${indeg[nb]}${indeg[nb]===0?' → enqueue!':''}` });
      if(indeg[nb]===0) { queue.push(nb); steps.push({ indeg:{...indeg}, queue:[...queue], result:[...result], active:nb, pseudoLine:6, msg:`Enqueue ${nb}` }); }
    }
  }
  steps.push({ indeg:{...indeg}, queue:[], result, active:-1, pseudoLine:-1, done:true, msg:`Topo order: [${result.join(' → ')}]` });
  return steps;
}

const PSEUDO = {
  bfs: ['function BFS(graph, start):','  queue = [start]; visited = {start}','  while queue not empty:','    node = queue.dequeue()','    for nb in neighbors(node):','      if nb not visited:','        mark nb; enqueue nb'],
  dfs: ['function DFS(graph, start):','  mark start as visited','  for nb in neighbors(start):','    if nb not visited:','      DFS(graph, nb)','    else: skip (already seen)'],
  dijkstra: ['function Dijkstra(graph, src):','  dist = {all: ∞}; dist[src] = 0','  priority_queue = [src]','  while pq not empty:','    u = node with min dist','    for (v,w) in neighbors(u):','      relax: dist[v] = min(dist[v], dist[u]+w)'],
  topo: ["function kahnTopo(graph):",'  compute in-degrees for each node','  queue = nodes where indeg == 0','  while queue not empty:','    u = dequeue()','    result.push(u)','    for v in neighbors(u): indeg[v]--','    if indeg[v]==0: enqueue(v)'],
};

// ── Canvas draw ────────────────────────────────────────────────────────────
function drawGraph(canvas, graph, stepData, mode) {
  if(!canvas) return;
  const ctx=canvas.getContext('2d'); const W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  const PAD=50, R=22;
  const xy=i=>({ x:PAD+graph.pos[i].x*(W-PAD*2), y:PAD+graph.pos[i].y*(H-PAD*2) });

  const vis   = stepData?.vis   ?? new Set();
  const active = stepData?.active ?? -1;
  const relaxEdge = stepData?.relaxEdge ?? stepData?.edge ?? null;
  const result = stepData?.result ?? [];
  const dist   = stepData?.dist ?? null;
  const indeg  = stepData?.indeg ?? null;
  const queue  = stepData?.queue ?? [];

  // Edges
  graph.edges.forEach(([a,b,w])=>{
    const {x:ax,y:ay}=xy(a), {x:bx,y:by}=xy(b);
    const isRelax = relaxEdge&&((relaxEdge[0]===a&&relaxEdge[1]===b)||(relaxEdge[0]===b&&relaxEdge[1]===a));
    const isVisEdge = (vis.has(a)||result.includes(a)) && (vis.has(b)||result.includes(b));

    const directed = mode==='topo'||mode==='dijkstra';
    ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by);
    ctx.strokeStyle = isRelax?'#f5a623':isVisEdge?'#22d47a44':'#1e2836';
    ctx.lineWidth = isRelax?2.5:1.5;
    if(isRelax){ctx.shadowColor='#f5a623';ctx.shadowBlur=10;}
    ctx.stroke(); ctx.shadowBlur=0;

    // Directed arrow
    if(directed) {
      const ang=Math.atan2(by-ay,bx-ax);
      const ex=bx-Math.cos(ang)*R, ey=by-Math.sin(ang)*R;
      const sx=ax+Math.cos(ang)*R, sy=ay+Math.sin(ang)*R;
      ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey);
      ctx.strokeStyle=isRelax?'#f5a623':isVisEdge?'#22d47a44':'#1e2836';
      ctx.lineWidth=isRelax?2:1.5; ctx.stroke();
      const hs=8;
      ctx.beginPath();
      ctx.moveTo(ex,ey);
      ctx.lineTo(ex-hs*Math.cos(ang-0.4),ey-hs*Math.sin(ang-0.4));
      ctx.lineTo(ex-hs*Math.cos(ang+0.4),ey-hs*Math.sin(ang+0.4));
      ctx.closePath(); ctx.fillStyle=isRelax?'#f5a623':isVisEdge?'#22d47a44':'#1e2836'; ctx.fill();
    }

    // Weight label
    if(w!==undefined) {
      const mx=(ax+bx)/2, my=(ay+by)/2;
      ctx.fillStyle=isRelax?'#f5a623':'#3a4455';
      ctx.font='600 10px JetBrains Mono,monospace';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(w,mx,my);
    }
  });

  // Nodes
  graph.nodes.forEach(n=>{
    const {x,y}=xy(n);
    const isActive=n===active;
    const isVis=vis.has(n)||result.includes(n);
    const inQueue=queue.includes(n);
    const isResult=result[result.length-1]===n;

    let fill='#10161e', stroke='#1e2836', txtColor='#566070';
    if(isActive&&isResult)  { fill='#1a1000'; stroke='#f5a623'; txtColor='#f5a623'; }
    else if(isActive)        { fill='#071828'; stroke='#00c8e8'; txtColor='#00c8e8'; }
    else if(isResult)        { fill='#1a1000'; stroke='#f5a62388'; txtColor='#f5a623'; }
    else if(isVis)           { fill='#082010'; stroke='#22d47a'; txtColor='#22d47a'; }
    else if(inQueue)         { fill='#071828'; stroke='#00c8e844'; txtColor='#00c8e8'; }

    if(isActive||isVis) {ctx.shadowColor=stroke;ctx.shadowBlur=12;}
    ctx.beginPath();ctx.arc(x,y,R,0,Math.PI*2);
    ctx.fillStyle=fill;ctx.fill();
    ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();
    ctx.shadowBlur=0;

    ctx.fillStyle=txtColor;ctx.font='600 12px JetBrains Mono,monospace';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(n,x,y);

    // Dist badge (Dijkstra)
    if(dist) {
      const d=dist[n];
      ctx.fillStyle=d===Infinity?'#3a4455':isVis?'#22d47a':'#00c8e8';
      ctx.font='600 9px JetBrains Mono,monospace';
      ctx.fillText(d===Infinity?'∞':d,x,y-R-8);
    }

    // Indegree badge (Topo)
    if(indeg) {
      const d=indeg[n];
      const bx2=x+R*0.75,by2=y-R*0.75;
      ctx.beginPath();ctx.arc(bx2,by2,8,0,Math.PI*2);
      ctx.fillStyle=d===0?'#082010':'#10161e';ctx.fill();
      ctx.strokeStyle=d===0?'#22d47a':'#30363d';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=d===0?'#22d47a':'#566070';
      ctx.font='600 9px JetBrains Mono,monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(d,bx2,by2);
    }
  });
}

// ── Component ─────────────────────────────────────────────────────────────
export default function GraphVisualizer() {
  const canvasRef=useRef(null);
  const [mode,setMode]=useState('bfs');
  const [startNode,setStartNode]=useState(0);
  const [stepData,setStepData]=useState(null);
  const [steps,setSteps]=useState([]);

  const graph = mode==='dijkstra'?WEIGHTED_GRAPH : mode==='topo'?DAG : UNDIRECTED_GRAPH;

  const onStep=useCallback((step)=>setStepData(step),[]);
  const runner=useStepRunner(steps,onStep);

  const resetAnim=()=>{ runner.reset(); setStepData(null); };

  const compute=useCallback((m,sn)=>{
    let s=[];
    if(m==='bfs')      s=bfsSteps(UNDIRECTED_GRAPH,sn);
    else if(m==='dfs') s=dfsSteps(UNDIRECTED_GRAPH,sn);
    else if(m==='dijkstra') s=dijkstraSteps(WEIGHTED_GRAPH);
    else if(m==='topo')     s=topoSteps(DAG);
    setSteps(s); return s;
  },[]);

  useEffect(()=>{ compute(mode,startNode); },[mode,startNode]);

  useEffect(()=>{
    drawGraph(canvasRef.current, graph, stepData, mode);
  },[stepData, mode, graph]);

  const accent = mode==='bfs'?'var(--cyan)':mode==='dfs'?'var(--violet)':mode==='dijkstra'?'var(--amber)':'var(--green)';

  const visOrder = [...(stepData?.vis??[])];
  const result   = stepData?.result??[];
  const dist     = stepData?.dist;
  const queueNodes = stepData?.queue??[];

  return (
    <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto auto', height:'100%', overflow:'hidden', background:'var(--bg1)' }}>
      <div style={{ padding:'14px 24px 12px', borderBottom:'1px solid var(--border1)', background:'var(--bg2)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
        <div>
          <div style={{ fontFamily:'var(--display)', fontSize:'1rem', fontWeight:700, letterSpacing:'-0.02em' }}>Graph Algorithms</div>
          <div style={{ fontSize:'0.65rem', color:'var(--t3)', marginTop:2, fontFamily:'var(--sans)' }}>BFS · DFS · Dijkstra's SSSP · Topological Sort (Kahn's)</div>
        </div>
        <span className="tag tagGraphs">Graphs</span>
      </div>

      <div style={{ padding:'8px 24px', borderBottom:'1px solid var(--border0)', background:'linear-gradient(to bottom,var(--bg2),var(--bg3))', display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        <select className="select" value={mode} onChange={e=>{ setMode(e.target.value); resetAnim(); }}>
          <option value="bfs">BFS — Breadth-First Search</option>
          <option value="dfs">DFS — Depth-First Search</option>
          <option value="dijkstra">Dijkstra — Shortest Path</option>
          <option value="topo">Topological Sort (Kahn's)</option>
        </select>
        {(mode==='bfs'||mode==='dfs') && (
          <label style={{fontSize:'0.7rem',color:'var(--t3)',display:'flex',alignItems:'center',gap:6}}>
            Start:
            <select className="select" value={startNode} onChange={e=>{setStartNode(parseInt(e.target.value));resetAnim();}}>
              {UNDIRECTED_GRAPH.nodes.map(n=><option key={n} value={n}>Node {n}</option>)}
            </select>
          </label>
        )}
        <div className="divider" />
        <button className="btn btnPrimary" style={{background:accent,borderColor:accent}} onClick={()=>{resetAnim();compute(mode,startNode);setTimeout(runner.play,80);}} disabled={runner.playing}>▶ Run</button>
        <button className="btn" onClick={resetAnim}>✕ Reset</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 240px', overflow:'hidden', minHeight:0 }}>
        {/* Canvas */}
        <div style={{ position:'relative', overflow:'hidden', borderRight:'1px solid var(--border0)' }}>
          <canvas ref={canvasRef} width={900} height={340} style={{ width:'100%', height:'100%', display:'block' }} />
        </div>

        {/* Side */}
        <div style={{ padding:14, display:'flex', flexDirection:'column', gap:10, overflowY:'auto' }}>
          {/* Step message */}
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', fontSize:'0.72rem', color:'var(--t1)', minHeight:46, display:'flex', alignItems:'center' }}>
            {stepData?.msg ?? <span style={{color:'var(--t4)'}}>Press ▶ Run to start</span>}
          </div>

          {/* Queue/Stack */}
          {(mode==='bfs'||mode==='dfs') && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>
                {mode==='bfs'?'Queue (FIFO)':'Stack (LIFO)'}
              </div>
              <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                {(mode==='bfs'?queueNodes:stepData?.stack??[]).map((n,i)=>(
                  <div key={i} style={{ width:30, height:30, background:'#071828', border:'1px solid var(--cyan2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color:'var(--cyan)' }}>{n}</div>
                ))}
                {!(mode==='bfs'?queueNodes:stepData?.stack??[]).length && <span style={{fontSize:'0.7rem',color:'var(--t4)'}}>empty</span>}
              </div>
            </div>
          )}

          {/* Visit order */}
          {(mode==='bfs'||mode==='dfs') && visOrder.length>0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Visit Order</div>
              <div style={{ fontSize:'0.72rem', color:'var(--green)' }}>{visOrder.join(' → ')}</div>
            </div>
          )}

          {/* Dijkstra distance table */}
          {mode==='dijkstra' && dist && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Distance Table</div>
              {WEIGHTED_GRAPH.nodes.map(n=>(
                <div key={n} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', padding:'3px 0', borderBottom:'1px solid var(--border0)', color:'var(--t3)' }}>
                  <span>Node {n}</span>
                  <b style={{ color:dist[n]===Infinity?'var(--t4)':'var(--green)' }}>{dist[n]===Infinity?'∞':dist[n]}</b>
                </div>
              ))}
            </div>
          )}

          {/* Topo result */}
          {mode==='topo' && result.length>0 && (
            <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:8 }}>Topo Order</div>
              <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                {result.map((n,i)=>(
                  <div key={i} style={{ width:30, height:30, background:'#082010', border:'1px solid var(--green)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700, color:'var(--green)' }}>{n}</div>
                ))}
              </div>
            </div>
          )}

          {/* Complexity */}
          <div style={{ background:'var(--bg3)', border:'1px solid var(--border1)', borderRadius:8, padding:'10px 12px', display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:'0.6rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--t4)', marginBottom:2 }}>Complexity</div>
            {mode==='bfs'&&[['Time','O(V+E)','var(--cyan)'],['Space','O(V)','var(--green)'],['Data struct','Queue','var(--amber)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
            {mode==='dfs'&&[['Time','O(V+E)','var(--cyan)'],['Space','O(V)','var(--green)'],['Data struct','Stack/Recursion','var(--violet)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
            {mode==='dijkstra'&&[['Time','O(V²)','var(--cyan)'],['Space','O(V)','var(--green)'],['Neg weights','Not allowed','var(--red)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
            {mode==='topo'&&[['Time','O(V+E)','var(--cyan)'],['Space','O(V)','var(--green)'],['Requires','DAG only','var(--amber)']].map(([k,v,c])=>(
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'var(--t3)' }}><span>{k}</span><b style={{color:c,fontWeight:600}}>{v}</b></div>
            ))}
          </div>
        </div>
      </div>

      <PseudoCode lines={PSEUDO[mode]} activeLine={stepData?.pseudoLine??-1} accent={accent} />
      <PlayBar runner={runner} accent={accent} />
    </div>
  );
}
