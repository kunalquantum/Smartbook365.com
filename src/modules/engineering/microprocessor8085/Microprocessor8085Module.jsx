import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Font import for the simulator
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;900&display=swap';
document.head.appendChild(fontLink);

import { INITIAL_CPU_STATE, assemble, executeInstruction, INSTRUCTION_INFO, EXAMPLE_PROGRAMS } from './core/cpu8085';
import VisualizerPanel from './components/Visualizer/VisualizerPanel';

// ── helpers ──────────────────────────────────────
const h2 = v => ((v||0)&0xFF).toString(16).toUpperCase().padStart(2,'0');
const h4 = v => ((v||0)&0xFFFF).toString(16).toUpperCase().padStart(4,'0');
const b8 = v => ((v||0)&0xFF).toString(2).padStart(8,'0');

// ─────────────────────────────────────────────────
//  STYLES (all inline via style objects + <style>)
// ─────────────────────────────────────────────────
const G = {
  accent:'#00E5A0', accentDim:'rgba(0,229,160,0.12)', accentDim2:'rgba(0,229,160,0.35)',
  bgApp:'#0B0D10', bgHeader:'#0E1013', bgPanel:'#101316', bgToolbar:'#0D0F12',
  bgCell:'#151A1E', bgInput:'#1A1F25', bgHover:'#1C2228',
  border:'#1E2630', borderHi:'#2A3540',
  textPrimary:'#DDE3EA', textDim:'#7A8898', textMuted:'#3D4E5E',
  tokMn:'#00E5A0', tokReg:'#60A5FA', tokHex:'#FBBF24', tokNum:'#A78BFA',
  tokLabel:'#F472B6', tokComment:'#2E3D4D',
  colorOk:'#4ADE80', colorWarn:'#FBBF24', colorErr:'#F87171',
  colorBp:'#F97316', colorPc:'#F97316', colorSp:'#60A5FA',
  mono:"'JetBrains Mono','Fira Code',monospace",
  sans:"'Inter',system-ui,sans-serif",
};

// ─────────────────────────────────────────────────
//  SYNTAX HIGHLIGHTER
// ─────────────────────────────────────────────────
const MN_SET = new Set(Object.keys(INSTRUCTION_INFO));
const REG_SET = new Set(['A','B','C','D','E','H','L','M','BC','DE','HL','SP','PSW']);

function HighlightedLine({ line }) {
  const ci = line.indexOf(';');
  const code = ci >= 0 ? line.slice(0,ci) : line;
  const comment = ci >= 0 ? line.slice(ci) : '';
  const tokens = [];

  let rest = code;
  const labelM = rest.match(/^(\s*)([A-Za-z_][A-Za-z0-9_]*)(:)/);
  if (labelM) {
    tokens.push(<span key="li">{labelM[1]}</span>);
    tokens.push(<span key="lb" style={{color:G.tokLabel,fontStyle:'italic'}}>{labelM[2]+labelM[3]}</span>);
    rest = rest.slice(labelM[0].length);
  }

  const indent = rest.match(/^(\s*)/)[1];
  if (indent) tokens.push(<span key="ind">{indent}</span>);
  rest = rest.trimStart();

  const parts = rest.split(/(\s+|,)/).filter(Boolean);
  let first = true;
  parts.forEach((p,i) => {
    if (/^\s+$/.test(p)||p===',') { tokens.push(<span key={`sp${i}`}>{p}</span>); return; }
    const u = p.toUpperCase();
    if (first && MN_SET.has(u)) {
      tokens.push(<span key={`mn${i}`} style={{color:G.tokMn,fontWeight:700}}>{p}</span>);
      first = false;
    } else if (REG_SET.has(u)) {
      tokens.push(<span key={`rg${i}`} style={{color:G.tokReg}}>{p}</span>);
    } else if (/^[0-9A-Fa-f]+H$/i.test(p)||/^0[Xx][0-9A-Fa-f]+$/.test(p)) {
      tokens.push(<span key={`hx${i}`} style={{color:G.tokHex}}>{p}</span>);
    } else if (/^\d+$/.test(p)) {
      tokens.push(<span key={`nm${i}`} style={{color:G.tokNum}}>{p}</span>);
    } else {
      tokens.push(<span key={`ot${i}`} style={{color:G.textDim}}>{p}</span>);
      first = false;
    }
  });

  if (comment) tokens.push(<span key="cm" style={{color:G.tokComment}}>{comment}</span>);
  return <>{tokens}</>;
}

// ─────────────────────────────────────────────────
//  EDITOR PANEL
// ─────────────────────────────────────────────────
function EditorPanel({ src, setSrc, instructions, errors, breakpoints, toggleBp, currentIdx, doAssemble }) {
  const taRef = useRef(null);
  const hlRef = useRef(null);
  const lines = src.split('\n');

  const lineAddrMap = {};
  instructions.forEach(inst => { if (inst && inst.lineNum !== undefined) lineAddrMap[inst.lineNum] = inst.addr; });
  const errorLines = new Set(errors.map(e=>e.lineNum));
  const currentLine = currentIdx >= 0 && instructions[currentIdx] ? instructions[currentIdx].lineNum : -1;

  const syncScroll = () => { if (hlRef.current && taRef.current) hlRef.current.scrollTop = taRef.current.scrollTop; };

  const handleKey = (e) => {
    if (e.key==='Tab') {
      e.preventDefault();
      const ta=taRef.current, s=ta.selectionStart, nd=src.slice(0,s)+'  '+src.slice(ta.selectionEnd);
      setSrc(nd);
      setTimeout(()=>{ta.selectionStart=ta.selectionEnd=s+2;},0);
    }
  };

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',background:G.bgPanel,overflow:'hidden'}}>
      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,flexShrink:0,flexWrap:'wrap'}}>
        <span style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,marginRight:'auto'}}>ASSEMBLY EDITOR</span>
        <select
          onChange={e=>{if(e.target.value)setSrc(EXAMPLE_PROGRAMS[e.target.value]);e.target.value='';}}
          style={{background:G.bgInput,border:`1px solid ${G.border}`,color:G.textDim,fontFamily:G.mono,fontSize:11,padding:'3px 6px',borderRadius:4,cursor:'pointer',outline:'none'}}
          defaultValue=""
        >
          <option value="">Load Example…</option>
          {Object.keys(EXAMPLE_PROGRAMS).map(k=><option key={k} value={k}>{k}</option>)}
        </select>
        <button onClick={doAssemble} style={{background:G.accent,color:'#000',border:'none',fontFamily:G.mono,fontSize:11,fontWeight:700,padding:'5px 14px',borderRadius:5,cursor:'pointer',letterSpacing:'0.05em'}}>
          ▶ ASSEMBLE
        </button>
      </div>

      {/* Editor body */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {/* Gutter */}
        <div style={{width:68,flexShrink:0,background:G.bgToolbar,borderRight:`1px solid ${G.border}`,overflow:'hidden',userSelect:'none'}}>
          {lines.map((_,i)=>{
            const addr=lineAddrMap[i], isCur=i===currentLine, isBp=breakpoints.has(i), isErr=errorLines.has(i);
            return (
              <div key={i} onClick={()=>toggleBp(i)} title={addr!==undefined?`0x${h4(addr)}`:''} style={{
                display:'flex',alignItems:'center',gap:2,height:20,padding:'0 4px',cursor:'pointer',
                fontFamily:G.mono,fontSize:9,
                background: isCur ? G.accentDim : isErr ? 'rgba(248,113,113,0.1)' : 'transparent',
                transition:'background 0.1s',
              }}>
                <span style={{color:G.colorBp,fontSize:8,width:8,opacity:isBp?1:0}}>●</span>
                <span style={{color:G.textMuted,minWidth:18,textAlign:'right'}}>{i+1}</span>
                {addr!==undefined && <span style={{color:G.accentDim2,fontSize:8,marginLeft:2}}>{h4(addr)}</span>}
              </div>
            );
          })}
        </div>

        {/* Code area */}
        <div style={{position:'relative',flex:1,overflow:'hidden'}}>
          {/* Highlighted display */}
          <div ref={hlRef} style={{
            position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none',
            padding:'0 12px',fontFamily:G.mono,fontSize:13,lineHeight:'20px',
            whiteSpace:'pre',color:G.textPrimary,
          }}>
            {lines.map((line,i)=>(
              <div key={i} style={{
                height:20,
                background: i===currentLine ? G.accentDim : errorLines.has(i) ? 'rgba(248,113,113,0.07)' : breakpoints.has(i) ? 'rgba(249,115,22,0.07)' : 'transparent',
                borderLeft: i===currentLine ? `2px solid ${G.accent}` : '2px solid transparent',
                marginLeft:-12, paddingLeft:10,
              }}>
                <HighlightedLine line={line} />{'\n'}
              </div>
            ))}
          </div>
          <textarea
            ref={taRef}
            value={src}
            onChange={e=>setSrc(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKey}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            style={{
              position:'absolute',inset:0,width:'100%',height:'100%',
              background:'transparent',border:'none',outline:'none',resize:'none',
              fontFamily:G.mono,fontSize:13,lineHeight:'20px',
              color:'transparent',caretColor:G.accent,
              padding:'0 12px',overflow:'auto',whiteSpace:'pre',
            }}
          />
        </div>
      </div>

      {/* Error/success bar */}
      {errors.length>0 && (
        <div style={{background:'rgba(248,113,113,0.08)',borderTop:`1px solid rgba(248,113,113,0.3)`,padding:'5px 10px',maxHeight:70,overflowY:'auto',flexShrink:0}}>
          {errors.map((e,i)=><div key={i} style={{fontFamily:G.mono,fontSize:11,color:'#ff6b6b',padding:'1px 0'}}>⚠ Line {e.lineNum+1}: {e.msg}</div>)}
        </div>
      )}
      {errors.length===0 && instructions.length>0 && (
        <div style={{background:'rgba(0,229,160,0.06)',borderTop:`1px solid rgba(0,229,160,0.2)`,padding:'4px 10px',fontFamily:G.mono,fontSize:11,color:G.colorOk,flexShrink:0}}>
          ✓ Assembled — {instructions.length} instructions · {instructions.reduce((a,i)=>a+(i?.size||0),0)} bytes
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  REGISTERS PANEL
// ─────────────────────────────────────────────────
function RegistersPanel({ cpu, prev }) {
  const r=cpu.registers, pr=prev?.registers||{};
  const getRP=(h,l)=>((r[h]||0)<<8)|(r[l]||0);

  const RegCell=({name})=>{
    const val=r[name]||0, changed=pr[name]!==undefined&&pr[name]!==val;
    return (
      <div style={{background:changed?G.accentDim:G.bgCell,border:`1px solid ${changed?G.accent:G.border}`,borderRadius:7,padding:'7px 5px',display:'flex',flexDirection:'column',alignItems:'center',gap:2,transition:'all 0.2s'}}>
        <span style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.1em'}}>{name}</span>
        <span style={{fontFamily:G.mono,fontSize:15,fontWeight:700,color:changed?G.accent:G.textPrimary}}>{h2(val)}</span>
        <span style={{fontFamily:G.mono,fontSize:7,color:G.textDim}}>{b8(val)}</span>
        <span style={{fontFamily:G.mono,fontSize:9,color:G.tokNum}}>{val}</span>
      </div>
    );
  };

  return (
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:10,height:'100%',overflowY:'auto'}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`,flexShrink:0}}>REGISTERS</div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4}}>
        {['A','B','C','D','E','H','L'].map(reg=><RegCell key={reg} name={reg}/>)}
      </div>

      <div style={{display:'flex',flexDirection:'column',gap:3}}>
        {[['BC','B','C'],['DE','D','E'],['HL','H','L']].map(([name,h,l])=>(
          <div key={name} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 8px',background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:5}}>
            <span style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,fontWeight:700,width:20}}>{name}</span>
            <span style={{fontFamily:G.mono,fontSize:13,color:G.tokHex,fontWeight:600}}>{h4(getRP(h,l))}</span>
            <span style={{fontFamily:G.mono,fontSize:9,color:G.textDim,marginLeft:'auto'}}>{getRP(h,l)}</span>
          </div>
        ))}
      </div>

      {[['PC',cpu.PC,G.colorPc],['SP',cpu.SP,G.colorSp]].map(([name,val,col])=>(
        <div key={name} style={{display:'flex',alignItems:'center',gap:8,padding:'6px 8px',background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:6}}>
          <span style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:col,width:20}}>{name}</span>
          <span style={{fontFamily:G.mono,fontSize:14,fontWeight:700,color:G.textPrimary}}>{h4(val)}</span>
          <div style={{flex:1,height:4,background:G.bgHover,borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',background:col,borderRadius:2,width:`${(val/0xFFFF)*100}%`,transition:'width 0.3s'}}/>
          </div>
        </div>
      ))}

      {/* Accumulator bit viewer */}
      <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:7,padding:8}}>
        <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,marginBottom:5}}>A = {h2(r.A||0)}h = {r.A||0}</div>
        <div style={{display:'flex',gap:3}}>
          {b8(r.A||0).split('').map((bit,i)=>(
            <div key={i} style={{flex:1,aspectRatio:'1',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:G.mono,fontSize:11,fontWeight:700,borderRadius:3,border:`1px solid ${G.border}`,background:bit==='1'?G.accent:G.bgPanel,color:bit==='1'?'#000':G.textMuted,transition:'background 0.2s'}}>
              {bit}
            </div>
          ))}
        </div>
        <div style={{display:'flex',gap:3,marginTop:2}}>
          {[7,6,5,4,3,2,1,0].map(b=><div key={b} style={{flex:1,textAlign:'center',fontFamily:G.mono,fontSize:8,color:G.textMuted}}>{b}</div>)}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  FLAGS PANEL
// ─────────────────────────────────────────────────
function FlagsPanel({ cpu, prev }) {
  const f=cpu.flags, pf=prev?.flags||{};
  const FLAGS=[
    {k:'Z',  full:'Zero',      desc:'Result was zero',           col:'#4ADE80'},
    {k:'S',  full:'Sign',      desc:'Result bit7=1 (negative)',  col:'#F472B6'},
    {k:'P',  full:'Parity',    desc:'Even number of 1-bits',     col:'#A78BFA'},
    {k:'CY', full:'Carry',     desc:'Unsigned overflow/borrow',  col:'#FB923C'},
    {k:'AC', full:'Aux Carry', desc:'Carry from bit3 (BCD)',     col:'#FCD34D'},
  ];

  return (
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:10}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`}}>FLAGS</div>

      <div style={{display:'flex',gap:5}}>
        {FLAGS.map(({k,full,desc,col})=>{
          const val=f[k]||0, changed=pf[k]!==undefined&&pf[k]!==val;
          return (
            <div key={k} title={desc} style={{
              flex:1,display:'flex',flexDirection:'column',alignItems:'center',padding:'8px 3px',
              borderRadius:7,border:`1px solid ${val?col:G.border}`,
              background:val?`color-mix(in srgb, ${col} 12%, transparent)`:G.bgCell,
              opacity:val?1:0.5,cursor:'default',transition:'all 0.2s',gap:3,
              animation:changed?'flash 0.4s ease':undefined,
            }}>
              <span style={{fontFamily:G.mono,fontSize:10,fontWeight:700,color:val?col:G.textMuted}}>{k}</span>
              <span style={{fontFamily:G.mono,fontSize:20,fontWeight:700,color:G.textPrimary,lineHeight:1}}>{val}</span>
              <span style={{fontFamily:G.mono,fontSize:7,color:G.textMuted,textAlign:'center',lineHeight:1.2}}>{full}</span>
              <div style={{width:7,height:7,borderRadius:'50%',background:val?col:G.textMuted,boxShadow:val?`0 0 7px ${col}`:'none',transition:'all 0.2s'}}/>
            </div>
          );
        })}
      </div>

      {/* Conditional jump readiness */}
      <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.1em',marginTop:2}}>CONDITIONAL BRANCH STATUS</div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:4}}>
        {[
          ['JZ',  f.Z===1,  'Z=1'],['JNZ',f.Z===0,  'Z=0'],
          ['JC',  f.CY===1, 'CY=1'],['JNC',f.CY===0,'CY=0'],
          ['JP',  f.S===0,  'S=0'],['JM',  f.S===1,  'S=1'],
          ['JPE', f.P===1,  'P=1'],['JPO', f.P===0,  'P=0'],
          ['CALL','–','always'],
        ].map(([name,active,cond],i)=>(
          <div key={i} style={{
            display:'flex',justifyContent:'space-between',alignItems:'center',
            padding:'3px 7px',borderRadius:5,
            background:active===true?G.accentDim:G.bgCell,
            border:`1px solid ${active===true?G.accent:G.border}`,
            opacity:active===false?0.4:1,transition:'all 0.2s',
          }}>
            <span style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.tokMn}}>{name}</span>
            <span style={{fontFamily:G.mono,fontSize:9,color:G.textMuted}}>{active===true?'✓':active===false?'✗':'–'}</span>
          </div>
        ))}
      </div>

      <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:6,padding:'7px 10px'}}>
        <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,marginBottom:4}}>FLAG REGISTER BYTE (PSW)</div>
        <div style={{fontFamily:G.mono,fontSize:11,color:G.tokHex}}>
          {h2((f.S<<7)|(f.Z<<6)|(f.AC<<4)|(f.P<<2)|1|(f.CY))}h
        </div>
        <div style={{fontFamily:G.mono,fontSize:8,color:G.textDim,marginTop:3}}>
          S7 Z6 0 AC4 0 P2 1 CY0
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  MEMORY PANEL
// ─────────────────────────────────────────────────
function MemoryPanel({ cpu, writeMemory }) {
  const [page, setPage] = useState(0x90);
  const [jump, setJump] = useState('9000');
  const [editCell, setEditCell] = useState(null);
  const [editVal, setEditVal] = useState('');
  const [mode, setMode] = useState('hex');

  const base = page*0x100;
  const mem = cpu.memory, pc=cpu.PC, sp=cpu.SP;
  const hl=((cpu.registers.H||0)<<8)|(cpu.registers.L||0);

  const fmt = v => mode==='hex'?h2(v):mode==='dec'?v.toString().padStart(3,' '):b8(v);

  const rows=[];
  for(let r=0;r<16;r++) {
    const cells=[];
    for(let c=0;c<16;c++){const addr=base+r*16+c; cells.push({addr,val:mem[addr]||0});}
    rows.push(cells);
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      {/* Toolbar */}
      <div style={{display:'flex',alignItems:'center',gap:6,padding:'6px 8px',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,flexShrink:0,flexWrap:'wrap'}}>
        <span style={{fontFamily:G.mono,fontSize:10,fontWeight:700,color:G.accent,letterSpacing:'0.15em',marginRight:'auto'}}>MEMORY 64KB</span>
        <div style={{display:'flex',gap:2}}>
          <input value={jump} onChange={e=>setJump(e.target.value.toUpperCase())} onKeyDown={e=>{if(e.key==='Enter'){const a=parseInt(jump,16);if(!isNaN(a))setPage(Math.floor(a/0x100));}}} placeholder="ADDR" maxLength={4}
            style={{width:50,background:G.bgInput,border:`1px solid ${G.border}`,color:G.textPrimary,fontFamily:G.mono,fontSize:11,padding:'3px 5px',borderRadius:4,outline:'none',textTransform:'uppercase'}}/>
          <button onClick={()=>{const a=parseInt(jump,16);if(!isNaN(a))setPage(Math.floor(a/0x100));}} style={{background:G.bgInput,border:`1px solid ${G.border}`,color:G.accent,fontFamily:G.mono,fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:4,cursor:'pointer'}}>GO</button>
        </div>
        <div style={{display:'flex',gap:2}}>
          {['hex','dec','bin'].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{fontFamily:G.mono,fontSize:9,padding:'3px 6px',borderRadius:3,border:`1px solid ${m===mode?G.accent:G.border}`,background:m===mode?G.accent:G.bgInput,color:m===mode?'#000':G.textMuted,cursor:'pointer',fontWeight:m===mode?700:400}}>
              {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:3}}>
          <button onClick={()=>setPage(p=>Math.max(0,p-1))} style={{background:G.bgInput,border:`1px solid ${G.border}`,color:G.textDim,padding:'3px 7px',borderRadius:3,cursor:'pointer'}}>◀</button>
          <span style={{fontFamily:G.mono,fontSize:11,fontWeight:700,color:G.tokHex,minWidth:36,textAlign:'center'}}>{h4(base)}</span>
          <button onClick={()=>setPage(p=>Math.min(0xFF,p+1))} style={{background:G.bgInput,border:`1px solid ${G.border}`,color:G.textDim,padding:'3px 7px',borderRadius:3,cursor:'pointer'}}>▶</button>
        </div>
      </div>

      {/* Legend */}
      <div style={{display:'flex',gap:10,padding:'3px 8px',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,flexShrink:0,fontFamily:G.mono,fontSize:9}}>
        <span style={{color:G.colorPc}}>■ PC</span>
        <span style={{color:G.colorSp}}>■ SP</span>
        <span style={{color:G.accent}}>■ HL</span>
        <span style={{color:G.textDim}}>■ Non-zero</span>
        <span style={{color:G.textMuted,marginLeft:'auto',fontStyle:'italic'}}>Click cell to edit</span>
      </div>

      {/* Grid */}
      <div style={{flex:1,overflowY:'auto',fontFamily:G.mono,fontSize:10}}>
        {/* Header */}
        <div style={{display:'flex',padding:'2px 4px',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,position:'sticky',top:0,zIndex:2}}>
          <div style={{width:42,flexShrink:0,color:G.textMuted,fontSize:9,fontWeight:700}}>ADDR</div>
          {Array.from({length:16},(_,i)=><div key={i} style={{width:mode==='bin'?72:22,textAlign:'center',color:G.textMuted,fontSize:9,flexShrink:0}}>{i.toString(16).toUpperCase()}</div>)}
          <div style={{flex:1,paddingLeft:6,color:G.textMuted,fontSize:9}}>ASCII</div>
        </div>

        {rows.map((row,ri)=>(
          <div key={ri} style={{display:'flex',alignItems:'center',padding:'1px 4px',borderBottom:`1px solid rgba(255,255,255,0.02)`}}>
            <div style={{width:42,color:G.tokHex,fontSize:9,fontWeight:600,flexShrink:0}}>{h4(base+ri*16)}</div>
            {row.map(({addr,val})=>{
              const isPc=addr===pc, isSp=addr===sp, isHl=addr===hl, isNz=val!==0;
              const isEdit=editCell===addr;
              const cellW = mode==='bin'?72:22;
              return (
                <div key={addr}
                  onClick={()=>{setEditCell(addr);setEditVal(h2(val));}}
                  title={`${h4(addr)}h = ${val} = ${b8(val)}b`}
                  style={{
                    width:cellW,height:18,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:2,cursor:'pointer',flexShrink:0,
                    background:isPc?'rgba(249,115,22,0.3)':isSp?'rgba(96,165,250,0.2)':isHl?G.accentDim:'transparent',
                    transition:'background 0.1s',
                  }}
                >
                  {isEdit?(
                    <input value={editVal} autoFocus maxLength={2}
                      onChange={e=>setEditVal(e.target.value.toUpperCase())}
                      onBlur={()=>{const p=parseInt(editVal,16);if(!isNaN(p))writeMemory(addr,p);setEditCell(null);}}
                      onKeyDown={e=>{
                        if(e.key==='Enter'){const p=parseInt(editVal,16);if(!isNaN(p))writeMemory(addr,p);setEditCell(null);}
                        if(e.key==='Escape')setEditCell(null);
                      }}
                      onClick={e=>e.stopPropagation()}
                      style={{width:cellW-2,background:G.bgInput,border:`1px solid ${G.accent}`,color:G.accent,fontFamily:G.mono,fontSize:9,textAlign:'center',outline:'none',padding:0,borderRadius:2,textTransform:'uppercase'}}
                    />
                  ):(
                    <span style={{fontSize:9,color:isPc?G.colorPc:isSp?G.colorSp:isHl?G.accent:isNz?G.textPrimary:G.textMuted,fontWeight:(isPc||isSp||isHl)?700:400}}>
                      {fmt(val)}
                    </span>
                  )}
                </div>
              );
            })}
            <div style={{flex:1,paddingLeft:6,display:'flex',minWidth:0,overflow:'hidden'}}>
              {row.map(({addr,val})=>(
                <span key={addr} style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,width:8,textAlign:'center'}}>
                  {val>=32&&val<127?String.fromCharCode(val):'·'}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{display:'flex',gap:12,padding:'4px 8px',background:G.bgToolbar,borderTop:`1px solid ${G.border}`,fontFamily:G.mono,fontSize:9,color:G.textDim,flexShrink:0}}>
        <span>PC: <b style={{color:G.colorPc}}>{h4(pc)}h</b></span>
        <span>SP: <b style={{color:G.colorSp}}>{h4(sp)}h</b></span>
        <span>HL: <b style={{color:G.accent}}>{h4(hl)}h</b></span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  STACK PANEL
// ─────────────────────────────────────────────────
function StackPanel({ cpu, trace }) {
  const { memory, SP } = cpu;
  const cells=[];
  for(let i=12;i>=-4;i--){
    const addr=(SP+i)&0xFFFF;
    cells.push({addr,val:memory[addr]||0,isSP:i===0,isAbove:i<0});
  }
  const ops=trace.filter(t=>t.stackActivity).slice(-10).reverse();

  return (
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:10,height:'100%',overflow:'hidden'}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`,flexShrink:0}}>STACK</div>

      <div style={{fontFamily:G.mono,fontSize:11,color:G.textDim}}>
        SP = <span style={{color:G.colorSp,fontWeight:700}}>{h4(SP)}h</span>
        <span style={{marginLeft:12,color:G.textMuted,fontSize:10}}>({0xFFFF-SP} bytes used)</span>
      </div>

      {/* Stack cells */}
      <div style={{display:'flex',flexDirection:'column',gap:2,overflowY:'auto',flex:1}}>
        <div style={{fontFamily:G.mono,fontSize:8,color:G.textMuted,textAlign:'center',letterSpacing:'0.1em'}}>HIGH ADDR ↑</div>
        {cells.map(({addr,val,isSP,isAbove})=>(
          <div key={addr} style={{
            display:'flex',alignItems:'center',gap:8,padding:'3px 7px',
            background:isSP?'rgba(96,165,250,0.12)':G.bgCell,
            border:`1px solid ${isSP?G.colorSp:G.border}`,
            borderRadius:4,opacity:isAbove?0.35:1,
            fontFamily:G.mono,fontSize:10,transition:'all 0.2s',
          }}>
            <span style={{color:G.textMuted,fontSize:9,minWidth:36}}>{h4(addr)}</span>
            <span style={{color:isSP?G.textPrimary:G.textDim,fontWeight:isSP?700:400}}>{h2(val)}</span>
            <span style={{fontFamily:G.mono,fontSize:8,color:G.textMuted}}>{b8(val)}</span>
            {isSP && <span style={{marginLeft:'auto',fontFamily:G.mono,fontSize:9,color:G.colorSp,fontWeight:700}}>← SP</span>}
          </div>
        ))}
        <div style={{fontFamily:G.mono,fontSize:8,color:G.textMuted,textAlign:'center',letterSpacing:'0.1em'}}>GROWS ↑</div>
      </div>

      {/* Stack op history */}
      <div style={{flexShrink:0}}>
        <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.1em',marginBottom:5}}>OPERATIONS</div>
        {ops.length===0&&<div style={{fontFamily:G.mono,fontSize:10,color:G.textMuted,fontStyle:'italic'}}>No stack ops yet</div>}
        {ops.map((t,i)=>(
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:6,padding:'3px 7px',marginBottom:2,
            borderRadius:4,background:G.bgCell,
            borderLeft:`3px solid ${t.stackActivity.type==='push'?G.colorOk:'#F472B6'}`,
            fontFamily:G.mono,fontSize:10,
          }}>
            <span style={{fontSize:8,fontWeight:700,color:G.textMuted,minWidth:28}}>{t.stackActivity.type.toUpperCase()}</span>
            <span style={{color:G.tokMn,fontWeight:600}}>{t.mnemonic}</span>
            {t.stackActivity.rp&&<span style={{color:G.tokReg,marginLeft:'auto'}}>{t.stackActivity.rp}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  TRACE PANEL
// ─────────────────────────────────────────────────
function TracePanel({ trace, currentIdx, instructions }) {
  const bottomRef=useRef(null);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:'smooth'});},[trace.length]);

  const cur=instructions[currentIdx];
  const info=cur?INSTRUCTION_INFO[cur.mnemonic]:null;

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',padding:10,gap:8}}>
      {/* Current instruction detail */}
      {cur&&(
        <div style={{background:G.bgCell,border:`1px solid ${G.accent}`,borderRadius:8,padding:'8px 10px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5}}>
            <span style={{fontFamily:G.mono,fontSize:16,fontWeight:700,color:G.tokMn}}>{cur.mnemonic}</span>
            <span style={{fontFamily:G.mono,fontSize:13,color:G.tokReg}}>{(cur.operands||[]).join(', ')}</span>
            <span style={{marginLeft:'auto',fontFamily:G.mono,fontSize:10,color:G.tokHex}}>@ {h4(cur.addr)}h</span>
          </div>
          {info&&<>
            <div style={{fontSize:11,color:G.textDim,marginBottom:5,lineHeight:1.4}}>{info.desc}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:10,fontFamily:G.mono,fontSize:9,color:G.textMuted}}>
              <span>Bytes: <b style={{color:G.tokHex}}>{cur.size}</b></span>
              <span>Cycles: <b style={{color:G.tokHex}}>{info.cycles}</b></span>
              <span>T-states: <b style={{color:G.tokHex}}>{info.tstates}</b></span>
              <span>Flags: <b style={{color:G.tokReg}}>{info.flags}</b></span>
              <span style={{marginLeft:'auto',color:G.accent,fontWeight:700}}>{info.category}</span>
            </div>
          </>}
        </div>
      )}

      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.12em',color:G.textMuted,flexShrink:0}}>EXECUTION TRACE</div>

      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:1}}>
        {trace.length===0&&<div style={{fontFamily:G.mono,fontSize:10,color:G.textMuted,fontStyle:'italic',padding:'8px 0'}}>Run or step to see trace…</div>}
        {trace.map((t,i)=>(
          <div key={i} style={{
            display:'flex',alignItems:'center',gap:6,padding:'2px 6px',borderRadius:3,
            fontFamily:G.mono,fontSize:10,
            background:i===trace.length-1?G.accentDim:'transparent',
            borderLeft:`2px solid ${i===trace.length-1?G.accent:'transparent'}`,
          }}>
            <span style={{color:G.textMuted,minWidth:26}}>{(i+1).toString().padStart(3,'0')}</span>
            <span style={{color:G.tokHex,minWidth:36}}>{h4(t.pc)}</span>
            <span style={{color:G.tokMn,fontWeight:600,minWidth:48}}>{t.mnemonic}</span>
            <span style={{color:G.textDim,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.busActivity?.[0]||''}</span>
            {t.branchTaken!==undefined&&(
              <span style={{fontSize:9,fontWeight:700,color:t.branchTaken?G.colorOk:G.textMuted,flexShrink:0}}>
                {t.branchTaken?'↗ TAKEN':'↔ SKIP'}
              </span>
            )}
            {t.stackActivity&&(
              <span style={{fontSize:9,color:G.colorSp,fontWeight:700,flexShrink:0}}>
                {t.stackActivity.type==='push'?'⬇ PUSH':'⬆ POP'}
              </span>
            )}
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  I/O PANEL
// ─────────────────────────────────────────────────
function IOPanel({ ports, setPort }) {
  const [ep,setEp]=useState('');
  const [ev,setEv]=useState('');

  const p0=ports[0]||0, p1=ports[1]||0;

  const SevenSeg=({digit})=>{
    const D={0:[1,1,1,1,1,1,0],1:[0,1,1,0,0,0,0],2:[1,1,0,1,1,0,1],3:[1,1,1,1,0,0,1],4:[0,1,1,0,0,1,1],5:[1,0,1,1,0,1,1],6:[1,0,1,1,1,1,1],7:[1,1,1,0,0,0,0],8:[1,1,1,1,1,1,1],9:[1,1,1,1,0,1,1],10:[1,1,1,0,1,1,1],11:[0,0,1,1,1,1,1],12:[1,0,0,1,1,1,0],13:[0,1,1,1,1,0,1],14:[1,0,0,1,1,1,1],15:[1,0,0,0,1,1,1]};
    const s=D[digit&0xF]||[0,0,0,0,0,0,0];
    const on=G.accent, off='rgba(255,255,255,0.04)';
    return (
      <svg viewBox="0 0 30 50" width={34} height={56}>
        <rect x="5" y="2"  width="20" height="4" rx="2" fill={s[0]?on:off}/>
        <rect x="23" y="4"  width="4" height="18" rx="2" fill={s[1]?on:off}/>
        <rect x="23" y="26" width="4" height="18" rx="2" fill={s[2]?on:off}/>
        <rect x="5" y="44" width="20" height="4" rx="2" fill={s[3]?on:off}/>
        <rect x="3" y="26" width="4" height="18" rx="2" fill={s[4]?on:off}/>
        <rect x="3" y="4"  width="4" height="18" rx="2" fill={s[5]?on:off}/>
        <rect x="5" y="23" width="20" height="4" rx="2" fill={s[6]?on:off}/>
      </svg>
    );
  };

  const portList=Object.entries(ports).map(([p,v])=>({port:parseInt(p),val:v}));

  return (
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:10,height:'100%',overflowY:'auto'}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`,flexShrink:0}}>I/O PORTS & DEVICES</div>

      {/* LED bar - port 00 */}
      <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:8,padding:'8px 10px'}}>
        <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.08em',marginBottom:8}}>PORT 00h — LED Output (OUT 00H)</div>
        <div style={{display:'flex',gap:5,alignItems:'center',marginBottom:5}}>
          {b8(p0).split('').map((bit,i)=>(
            <div key={i} style={{width:16,height:16,borderRadius:'50%',border:`1px solid ${G.border}`,background:bit==='1'?G.accent:G.bgPanel,boxShadow:bit==='1'?`0 0 9px ${G.accent}`:'none',transition:'all 0.2s'}}/>
          ))}
        </div>
        <div style={{fontFamily:G.mono,fontSize:9,color:G.textDim}}>{h2(p0)}h = {p0} = {b8(p0)}b</div>
      </div>

      {/* 7-segment - port 01 */}
      <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:8,padding:'8px 10px'}}>
        <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.08em',marginBottom:8}}>PORT 01h — 7-Segment (OUT 01H)</div>
        <div style={{display:'flex',gap:10,alignItems:'center',justifyContent:'center',padding:'6px 0',background:G.bgPanel,borderRadius:5,marginBottom:5}}>
          <SevenSeg digit={p1>>4}/>
          <SevenSeg digit={p1&0x0F}/>
        </div>
        <div style={{fontFamily:G.mono,fontSize:9,color:G.textDim}}>Value: {h2(p1)}h = {p1}</div>
      </div>

      {/* Manual port control */}
      <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:8,padding:'8px 10px'}}>
        <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.08em',marginBottom:6}}>SET PORT (simulate IN instruction)</div>
        <div style={{display:'flex',gap:5}}>
          <input value={ep} onChange={e=>setEp(e.target.value.toUpperCase())} placeholder="Port" maxLength={2}
            style={{flex:1,background:G.bgInput,border:`1px solid ${G.border}`,color:G.textPrimary,fontFamily:G.mono,fontSize:11,padding:'4px 6px',borderRadius:4,outline:'none',textTransform:'uppercase'}}/>
          <input value={ev} onChange={e=>setEv(e.target.value.toUpperCase())} placeholder="Value" maxLength={2}
            style={{flex:1,background:G.bgInput,border:`1px solid ${G.border}`,color:G.textPrimary,fontFamily:G.mono,fontSize:11,padding:'4px 6px',borderRadius:4,outline:'none',textTransform:'uppercase'}}/>
          <button onClick={()=>{const p=parseInt(ep,16),v=parseInt(ev,16);if(!isNaN(p)&&!isNaN(v)){setPort(p,v);setEp('');setEv('');}}}
            style={{background:G.accent,color:'#000',border:'none',fontFamily:G.mono,fontSize:10,fontWeight:700,padding:'4px 10px',borderRadius:4,cursor:'pointer'}}>SET</button>
        </div>
      </div>

      <div>
        <div style={{fontFamily:G.mono,fontSize:9,fontWeight:700,color:G.textMuted,letterSpacing:'0.1em',marginBottom:5}}>ALL ACTIVE PORTS</div>
        {portList.length===0&&<div style={{fontFamily:G.mono,fontSize:10,color:G.textMuted,fontStyle:'italic'}}>No port activity yet</div>}
        {portList.map(({port,val})=>(
          <div key={port} style={{display:'flex',alignItems:'center',gap:8,padding:'4px 8px',background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:5,marginBottom:3,fontFamily:G.mono,fontSize:10}}>
            <span style={{color:G.tokHex,minWidth:28,fontWeight:700}}>{h2(port)}h</span>
            <div style={{display:'flex',gap:2}}>
              {b8(val).split('').map((bit,i)=><div key={i} style={{width:10,height:10,borderRadius:'50%',background:bit==='1'?G.accent:G.bgPanel,border:`1px solid ${G.border}`,transition:'background 0.2s'}}/>)}
            </div>
            <span style={{color:G.textDim,marginLeft:'auto'}}>{h2(val)}h = {val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  CPU DIAGRAM PANEL
// ─────────────────────────────────────────────────
function CPUPanel({ cpu, currentInst }) {
  const [sel, setSel]=useState(null);

  const BLOCKS=[
    {k:'ACC',   label:'A',            x:8,  y:30, w:22, h:18, desc:'Accumulator',           detail:'Primary 8-bit register. One operand for every ALU op comes from here and results return here.'},
    {k:'ALU',   label:'ALU',          x:34, y:30, w:24, h:18, desc:'Arithmetic Logic Unit', detail:'Performs all arithmetic (ADD/SUB) and logical (AND/OR/XOR) operations. Always uses Accumulator as one operand.'},
    {k:'FLAGS', label:'FLAGS',        x:8,  y:52, w:22, h:13, desc:'Flag Register',          detail:'Z,S,P,CY,AC flags. Updated after ALU ops. Used by conditional jumps/calls.'},
    {k:'REGS',  label:'B C D E H L', x:34, y:52, w:24, h:13, desc:'General Registers',      detail:'Six 8-bit GPRs. Used as B,C,D,E,H,L individually or BC,DE,HL pairs. HL most often used as memory pointer.'},
    {k:'PC',    label:'PC',           x:62, y:18, w:20, h:12, desc:'Program Counter',        detail:'Points to next instruction to fetch. Auto-increments. Modified by JMP/CALL/RET/Jcond.'},
    {k:'SP',    label:'SP',           x:62, y:34, w:20, h:12, desc:'Stack Pointer',          detail:'Points to top of stack in RAM. Decremented by PUSH/CALL, incremented by POP/RET.'},
    {k:'DEC',   label:'DECODE',       x:62, y:50, w:20, h:13, desc:'Instruction Decoder',   detail:'Decodes opcode, generates control signals to route data and perform the correct operation.'},
    {k:'ABUS',  label:'ADDRESS BUS (A15–A0)', x:4,y:82,w:92,h:7, desc:'Address Bus 16-bit', detail:'16-bit unidirectional bus. CPU drives this with memory/IO address. Can address 64KB (0000h–FFFFh).'},
    {k:'DBUS',  label:'DATA BUS (D7–D0)',     x:4,y:91,w:92,h:7, desc:'Data Bus 8-bit',     detail:'8-bit bidirectional bus for data transfer between CPU and memory/IO. Multiplexed with low 8 address bits.'},
  ];

  function isActive(k) {
    if(!currentInst) return false;
    const mn=currentInst.mnemonic;
    const aluOps=['ADD','ADC','ADI','ACI','SUB','SBB','SUI','SBI','ANA','ANI','ORA','ORI','XRA','XRI','CMP','CPI','INR','DCR','DAD','RLC','RRC','RAL','RAR'];
    if(k==='ALU'&&aluOps.includes(mn)) return true;
    if(k==='FLAGS'&&aluOps.includes(mn)) return true;
    if(k==='ACC'&&(aluOps.includes(mn)||['LDA','LDAX','MOV','MVI','POP'].includes(mn))) return true;
    if(k==='PC'&&['JMP','JC','JNC','JZ','JNZ','JP','JM','CALL','RET','PCHL'].includes(mn)) return true;
    if(k==='SP'&&['PUSH','POP','CALL','RET','XTHL'].includes(mn)) return true;
    if(k==='ABUS') return true;
    if(k==='DBUS'&&mn!=='NOP') return true;
    return false;
  }

  const selBlock=BLOCKS.find(b=>b.k===sel);

  return (
    <div style={{padding:12,display:'flex',flexDirection:'column',gap:10,height:'100%',overflowY:'auto'}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`,flexShrink:0}}>CPU ARCHITECTURE</div>
      <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,flexShrink:0}}>Click any block for details. Glowing = active in current instruction.</div>

      <svg viewBox="0 0 100 100" style={{width:'100%',maxHeight:220,flexShrink:0}}>
        {/* CPU body */}
        <rect x="3" y="5" width="94" height="78" fill={G.bgCell} stroke={G.border} strokeWidth="0.5" rx="2"/>
        <text x="50" y="10" textAnchor="middle" fontSize="3.2" fill={G.textMuted} fontFamily="monospace" fontWeight="bold">INTEL 8085 MICROPROCESSOR</text>

        {/* Wires */}
        <line x1="30" y1="39" x2="34" y2="39" stroke={G.accent} strokeWidth="0.4" opacity="0.4"/>
        <line x1="58" y1="62" x2="62" y2="62" stroke={G.borderHi} strokeWidth="0.3" strokeDasharray="0.8,0.4"/>
        <line x1="30" y1="58" x2="34" y2="58" stroke={G.borderHi} strokeWidth="0.3" strokeDasharray="0.8,0.4"/>

        {BLOCKS.map(blk=>{
          const active=isActive(blk.k), isSel=sel===blk.k;
          return (
            <g key={blk.k} onClick={()=>setSel(sel===blk.k?null:blk.k)} style={{cursor:'pointer'}}>
              <rect x={blk.x} y={blk.y} width={blk.w} height={blk.h}
                fill={active?G.accentDim:G.bgPanel}
                stroke={isSel?G.accent:active?G.accent:G.border}
                strokeWidth={isSel?0.8:0.4} rx="1"
                opacity={isSel?1:active?0.95:0.7}
              />
              <text x={blk.x+blk.w/2} y={blk.y+blk.h/2+(blk.h<14?1.5:2.5)}
                textAnchor="middle" fontSize={blk.k==='REGS'||blk.k==='ABUS'||blk.k==='DBUS'?2.2:3.5}
                fill={active||isSel?G.accent:G.textDim} fontFamily="monospace"
                fontWeight={active||isSel?'bold':'normal'} style={{pointerEvents:'none'}}
              >{blk.label}</text>
              {active&&<circle cx={blk.x+blk.w-2} cy={blk.y+2} r="1.2" fill={G.accent} opacity="0.9">
                <animate attributeName="opacity" values="1;0.2;1" dur="0.7s" repeatCount="indefinite"/>
              </circle>}
            </g>
          );
        })}
      </svg>

      {selBlock&&(
        <div style={{background:G.bgCell,border:`1px solid ${G.accent}`,borderRadius:7,padding:'8px 10px',flexShrink:0}}>
          <div style={{fontFamily:G.mono,fontSize:12,fontWeight:700,color:G.accent,marginBottom:4}}>{selBlock.desc}</div>
          <div style={{fontSize:11,color:G.textDim,lineHeight:1.5}}>{selBlock.detail}</div>
          {currentInst&&isActive(selBlock.k)&&<div style={{marginTop:5,fontFamily:G.mono,fontSize:10,color:G.tokMn}}>⚡ Active in: {currentInst.mnemonic}</div>}
        </div>
      )}

      <div style={{flexShrink:0}}>
        <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,letterSpacing:'0.1em',marginBottom:5}}>FETCH – DECODE – EXECUTE CYCLE</div>
        <div style={{display:'flex',gap:4}}>
          {['1 FETCH','2 DECODE','3 EXECUTE'].map(s=>(
            <div key={s} style={{flex:1,display:'flex',alignItems:'center',gap:5,padding:'5px 7px',background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:5}}>
              <div style={{width:16,height:16,borderRadius:'50%',background:G.accent,color:'#000',fontFamily:G.mono,fontSize:8,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s[0]}</div>
              <span style={{fontFamily:G.mono,fontSize:8,color:G.textDim,letterSpacing:'0.05em'}}>{s.slice(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {currentInst&&(
        <div style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:7,padding:'8px 10px',flexShrink:0}}>
          <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,marginBottom:4,letterSpacing:'0.08em'}}>CURRENTLY EXECUTING</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <span style={{fontFamily:G.mono,fontSize:14,fontWeight:700,color:G.tokMn}}>{currentInst.mnemonic}</span>
            <span style={{fontFamily:G.mono,fontSize:12,color:G.tokReg}}>{(currentInst.operands||[]).join(', ')}</span>
          </div>
          {INSTRUCTION_INFO[currentInst.mnemonic]&&(
            <div style={{fontFamily:G.mono,fontSize:10,color:G.textDim,marginTop:4}}>
              {INSTRUCTION_INFO[currentInst.mnemonic].desc}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  INSTRUCTION REFERENCE PANEL
// ─────────────────────────────────────────────────
function InstrRefPanel() {
  const [search, setSearch]=useState('');
  const [cat, setCat]=useState('All');
  const [sel, setSel]=useState(null);

  const CATS=['All','Data Transfer','Arithmetic','Logical','Branch','Stack','I/O','Control'];
  const entries=Object.entries(INSTRUCTION_INFO).filter(([mn,info])=>{
    const ms=mn.includes(search.toUpperCase())||info.desc.toLowerCase().includes(search.toLowerCase());
    const mc=cat==='All'||info.category===cat;
    return ms&&mc;
  });

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',padding:10,gap:8}}>
      <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.15em',color:G.accent,paddingBottom:6,borderBottom:`1px solid ${G.border}`,flexShrink:0}}>INSTRUCTION REFERENCE</div>

      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search instructions…"
        style={{width:'100%',boxSizing:'border-box',background:G.bgInput,border:`1px solid ${G.border}`,color:G.textPrimary,fontFamily:G.mono,fontSize:11,padding:'5px 8px',borderRadius:5,outline:'none',flexShrink:0}}/>

      <div style={{display:'flex',flexWrap:'wrap',gap:3,flexShrink:0}}>
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{fontFamily:G.mono,fontSize:8,fontWeight:700,padding:'3px 6px',borderRadius:4,border:`1px solid ${c===cat?G.accent:G.border}`,background:c===cat?G.accent:G.bgCell,color:c===cat?'#000':G.textMuted,cursor:'pointer',letterSpacing:'0.05em'}}>
            {c}
          </button>
        ))}
      </div>

      {sel&&INSTRUCTION_INFO[sel]&&(
        <div style={{background:G.bgCell,border:`1px solid ${G.accent}`,borderRadius:7,padding:'8px 10px',flexShrink:0}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontFamily:G.mono,fontSize:16,fontWeight:700,color:G.tokMn}}>{sel}</span>
            <span style={{fontFamily:G.mono,fontSize:9,color:G.accent,background:G.accentDim,padding:'2px 6px',borderRadius:3}}>{INSTRUCTION_INFO[sel].category}</span>
          </div>
          <div style={{fontSize:11,color:G.textDim,marginBottom:6,lineHeight:1.4}}>{INSTRUCTION_INFO[sel].desc}</div>
          {[['Bytes',INSTRUCTION_INFO[sel].cycles],['T-states',INSTRUCTION_INFO[sel].tstates],['Flags affected',INSTRUCTION_INFO[sel].flags]].map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',fontFamily:G.mono,fontSize:10,padding:'2px 0',borderBottom:`1px solid ${G.border}`,color:G.textDim}}>
              <span>{k}</span><span style={{color:G.tokHex,fontWeight:600}}>{v}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:1}}>
        {entries.map(([mn,info])=>(
          <div key={mn} onClick={()=>setSel(sel===mn?null:mn)} style={{
            display:'flex',alignItems:'center',gap:8,padding:'5px 8px',borderRadius:5,cursor:'pointer',
            background:sel===mn?G.accentDim:G.bgCell,border:`1px solid ${sel===mn?G.accent:G.border}`,transition:'all 0.1s',
          }}>
            <span style={{fontFamily:G.mono,fontSize:11,fontWeight:700,color:G.tokMn,minWidth:40}}>{mn}</span>
            <span style={{fontSize:10,color:G.textDim,flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{info.desc}</span>
            <span style={{fontFamily:G.mono,fontSize:8,color:G.textMuted,whiteSpace:'nowrap'}}>{info.category}</span>
          </div>
        ))}
        {entries.length===0&&<div style={{fontFamily:G.mono,fontSize:10,color:G.textMuted,fontStyle:'italic',padding:'8px 0'}}>No match found</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
//  CONTROLS BAR
// ─────────────────────────────────────────────────
function ControlBar({ isRunning, assembled, halted, doAssemble, step, run, reset, speed, setSpeed, progress, total }) {
  const canStep=assembled&&!isRunning&&!halted;
  const canRun=assembled&&!halted;
  const Btn=({onClick,disabled,bg,color,children,title})=>(
    <button onClick={onClick} disabled={disabled} title={title} style={{
      display:'flex',alignItems:'center',gap:5,fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.08em',
      padding:'6px 12px',borderRadius:6,border:`1px solid ${bg}`,background:disabled?G.bgCell:bg,
      color:disabled?G.textMuted:color,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.4:1,transition:'all 0.15s',
    }}>{children}</button>
  );

  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'7px 14px',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,flexShrink:0,flexWrap:'wrap'}}>
      <Btn onClick={doAssemble} bg={G.border} color={G.accent} title="Assemble code">⚙ ASSEMBLE</Btn>

      <div style={{width:1,height:22,background:G.border,margin:'0 2px'}}/>

      <Btn onClick={reset} disabled={!assembled} bg={G.bgCell} color={G.textDim} title="Reset to start">⏮ RESET</Btn>
      <Btn onClick={step} disabled={!canStep} bg={G.bgCell} color={G.tokReg} title="Step one instruction">⏭ STEP</Btn>
      <Btn onClick={run} disabled={!canRun} bg={isRunning?G.colorWarn:G.accent} color="#000" title={isRunning?'Pause':'Run program'}>
        {isRunning?'⏸ PAUSE':'▶ RUN'}
      </Btn>

      {halted&&(
        <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,padding:'4px 10px',borderRadius:4,background:'rgba(248,113,113,0.15)',color:'#ff6b6b',border:'1px solid rgba(248,113,113,0.4)',letterSpacing:'0.1em'}}>
          ⛔ HALTED
        </div>
      )}

      <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <span style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,letterSpacing:'0.1em'}}>SPEED</span>
          <input type="range" min={50} max={1500} step={50} value={1550-speed}
            onChange={e=>setSpeed(1550-parseInt(e.target.value))}
            style={{width:70,accentColor:G.accent,cursor:'pointer'}}/>
          <span style={{fontFamily:G.mono,fontSize:9,color:G.accent,minWidth:30}}>{speed<200?'MAX':`${speed}ms`}</span>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:5}}>
          <div style={{width:80,height:4,background:G.bgHover,borderRadius:2,overflow:'hidden'}}>
            <div style={{height:'100%',background:G.accent,borderRadius:2,width:`${total>0?Math.round((progress/total)*100):0}%`,transition:'width 0.3s'}}/>
          </div>
          <span style={{fontFamily:G.mono,fontSize:9,color:G.textMuted}}>{progress}/{total}</span>
        </div>
      </div>
    </div>
  );
}

const PAGE_META = [
  { id: 'WORKSPACE', label: 'Workspace', desc: 'Editor + execution controls' },
  { id: 'VISUALIZER', label: 'Visualizer Lab', desc: 'Architecture, buses, ALU and timing' },
  { id: 'MEMORY', label: 'Memory Lab', desc: 'Memory, stack and port activity' },
  { id: 'DEBUG', label: 'Debug Desk', desc: 'Trace, CPU internals and reference' },
];

function resolveInitialPage() {
  if (typeof window === 'undefined') return 'WORKSPACE';
  const hash = window.location.hash.replace('#', '').toUpperCase();
  return PAGE_META.some(page => page.id === hash) ? hash : 'WORKSPACE';
}

function PageSwitcher({ activePage, setActivePage, cpu, trace, theme }) {
  return (
    <div style={{display:'flex',alignItems:'stretch',gap:10,padding:'10px 14px',background:theme.bgHeader,borderBottom:`1px solid ${theme.border}`,flexShrink:0,overflowX:'auto'}}>
      {PAGE_META.map(page => {
        const active = page.id === activePage;
        return (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            style={{
              appearance:'none',
              minWidth:190,
              textAlign:'left',
              borderRadius:10,
              border:`1px solid ${active ? theme.accent : theme.border}`,
              background:active ? 'linear-gradient(135deg, rgba(0,229,160,0.16), rgba(96,165,250,0.12))' : theme.bgCell,
              color:theme.textPrimary,
              padding:'10px 12px',
              cursor:'pointer',
              transition:'all 0.18s',
            }}
          >
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
              <span style={{fontFamily:theme.mono,fontSize:10,fontWeight:700,letterSpacing:'0.12em',color:active ? theme.accent : theme.textMuted}}>
                {page.label.toUpperCase()}
              </span>
              {active && <span style={{fontFamily:theme.mono,fontSize:9,color:theme.tokHex}}>LIVE</span>}
            </div>
            <div style={{fontSize:12,color:theme.textDim,marginTop:5,lineHeight:1.35}}>{page.desc}</div>
            <div style={{display:'flex',gap:10,marginTop:8,fontFamily:theme.mono,fontSize:9,color:theme.textMuted}}>
              <span>PC {h4(cpu.PC)}</span>
              <span>TR {trace.length}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────
//  MAIN APP
// ─────────────────────────────────────────────────
export default function Microprocessor8085Module() {
  const navigate = useNavigate();
  const [src, setSrc] = useState(`; 8085 Simulator — Click ASSEMBLE then STEP or RUN
; Load example programs from the dropdown above!

LXI H, 9000H  ; Set HL = 9000H (memory pointer)
MVI A, 25H    ; A = 37 decimal
MVI B, 14H    ; B = 20 decimal
ADD B         ; A = A + B = 57 = 39H (flags update!)
MOV M, A      ; Store 57 at address 9000H
INX H         ; HL = 9001H
MVI A, 0FFH   ; A = 255
INR A         ; A = 0 — sets Zero flag and Carry!
MOV M, A      ; Store 0 at 9001H
LXI SP, 9FFFh ; Set Stack Pointer
MVI B, 0AAH   ; B = AAH
PUSH B        ; Push BC onto stack (SP decreases)
MVI B, 00H    ; Clear B
POP B         ; Restore B from stack (should be AAH)
HLT           ; Stop`);

  const [cpu, setCpu] = useState(INITIAL_CPU_STATE());
  const [instructions, setInstructions] = useState([]);
  const [labels, setLabels] = useState({});
  const [errors, setErrors] = useState([]);
  const [curIdx, setCurIdx] = useState(-1);
  const [trace, setTrace] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [breakpoints, setBreakpoints] = useState(new Set());
  const [ports, setPorts] = useState({});
  const [speed, setSpeed] = useState(400);
  const [assembled, setAssembled] = useState(false);
  const [prevCpu, setPrevCpu] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [activePage, setActivePage] = useState(resolveInitialPage);

  // Right panel tabs
  const [rightTab, setRightTab] = useState('TRACE');
  // Left-center tabs
  const [leftTab, setLeftTab] = useState('REGISTERS');

  const cpuRef = useRef(cpu);
  const instRef = useRef(instructions);
  const idxRef = useRef(curIdx);
  const portsRef = useRef(ports);
  const intervalRef = useRef(null);

  cpuRef.current = cpu;
  instRef.current = instructions;
  idxRef.current = curIdx;
  portsRef.current = ports;

  const doAssemble = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); setIsRunning(false); }
    const res = assemble(src);
    setInstructions(res.instructions);
    setLabels(res.labels);
    setErrors(res.errors);
    setCpu(INITIAL_CPU_STATE());
    setCurIdx(-1);
    setTrace([]);
    setPrevCpu(null);
    setExecutionHistory([]);
    setPorts({});
    setAssembled(res.errors.length === 0 && res.instructions.length > 0);
  }, [src]);

  const doStep = useCallback(() => {
    const state = cpuRef.current, insts = instRef.current, idx = idxRef.current;
    if (state.halted) return false;
    const nextIdx = idx + 1;
    const inst = insts[nextIdx];
    if (!inst) return false;
    setPrevCpu(JSON.parse(JSON.stringify(state)));
    const curPorts = { ...portsRef.current };
    const { newState, trace: tr } = executeInstruction(state, inst, curPorts);
    setCpu(newState);
    setCurIdx(nextIdx);
    setTrace(prev => [...prev.slice(-149), { ...tr, index: nextIdx }]);
    setExecutionHistory(prev => [...prev.slice(-63), {
      index: nextIdx,
      instruction: inst,
      before: JSON.parse(JSON.stringify(state)),
      after: JSON.parse(JSON.stringify(newState)),
      trace: tr,
    }]);
    // Update ports if OUT was used
    setPorts(curPorts);
    return !newState.halted;
  }, []);

  const doRun = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      return;
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      const state = cpuRef.current, insts = instRef.current, idx = idxRef.current;
      if (state.halted || idx >= insts.length - 1) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        return;
      }
      const nextIdx = idx + 1;
      const inst = insts[nextIdx];
      if (!inst) { clearInterval(intervalRef.current); setIsRunning(false); return; }

      const curPorts = { ...portsRef.current };
      const { newState, trace: tr } = executeInstruction(state, inst, curPorts);
      setCpu({ ...newState });
      setCurIdx(nextIdx);
      setTrace(prev => [...prev.slice(-149), { ...tr, index: nextIdx }]);
      setExecutionHistory(prev => [...prev.slice(-63), {
        index: nextIdx,
        instruction: inst,
        before: JSON.parse(JSON.stringify(state)),
        after: JSON.parse(JSON.stringify(newState)),
        trace: tr,
      }]);
      setPorts(curPorts);

      // Check breakpoint for NEXT instruction
      const bpIdx = nextIdx + 1;
      const nextInst = insts[bpIdx];
      if (nextInst && breakpoints.has(nextInst.lineNum)) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
      }
      if (newState.halted) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, speed);
  }, [isRunning, speed, breakpoints]);

  const doReset = useCallback(() => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setCpu(INITIAL_CPU_STATE());
    setCurIdx(-1);
    setTrace([]);
    setPrevCpu(null);
    setExecutionHistory([]);
    setPorts({});
  }, []);

  const toggleBp = useCallback((lineNum) => {
    setBreakpoints(prev => {
      const next = new Set(prev);
      if (next.has(lineNum)) next.delete(lineNum); else next.add(lineNum);
      return next;
    });
  }, []);

  const writeMemory = useCallback((addr, val) => {
    setCpu(prev => {
      const next = { ...prev, memory: [...prev.memory] };
      next.memory[addr & 0xFFFF] = val & 0xFF;
      return next;
    });
  }, []);

  const setPort = useCallback((port, val) => {
    setPorts(prev => ({ ...prev, [port]: val & 0xFF }));
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activePage.toLowerCase();
    }
  }, [activePage]);

  const curInst = instructions[curIdx] || null;
  const RIGHT_TABS = ['TRACE', 'MEMORY', 'STACK', 'I/O', 'CPU', 'INSTR REF'];
  const LEFT_TABS  = ['REGISTERS', 'FLAGS'];

  const TabBar = ({ tabs, active, setActive }) => (
    <div style={{display:'flex',background:G.bgToolbar,borderBottom:`1px solid ${G.border}`,flexShrink:0,overflowX:'auto'}}>
      {tabs.map(t=>(
        <button key={t} onClick={()=>setActive(t)} style={{
          fontFamily:G.mono,fontSize:9,fontWeight:700,letterSpacing:'0.1em',
          padding:'7px 12px',background:'none',border:'none',
          borderBottom:`2px solid ${t===active?G.accent:'transparent'}`,
          color:t===active?G.accent:G.textMuted,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,transition:'all 0.15s',
        }}>{t}</button>
      ))}
    </div>
  );

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100vh',background:G.bgApp,overflow:'hidden',color:G.textPrimary,fontFamily:G.sans}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',padding:'8px 16px',background:G.bgHeader,borderBottom:`1px solid ${G.border}`,flexShrink:0,gap:12}}>
        <button onClick={() => navigate('/domains/engineering/computer-engineering')} style={{display:'flex',alignItems:'center',gap:5,fontFamily:G.mono,fontSize:10,fontWeight:700,padding:'4px 8px',borderRadius:4,background:G.bgCell,border:`1px solid ${G.border}`,color:G.textMuted,cursor:'pointer',marginRight:10}}>
          ◀ BACK
        </button>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{fontFamily:G.mono,fontSize:17,fontWeight:900,color:'#000',background:G.accent,padding:'2px 8px',borderRadius:4,letterSpacing:'0.05em'}}>8085</div>
          <div style={{fontFamily:G.mono,fontSize:11,fontWeight:700,color:G.textPrimary,letterSpacing:'0.12em'}}>MICROPROCESSOR SIMULATOR</div>
        </div>
        <div style={{display:'flex',gap:6,marginLeft:'auto'}}>
          {['HSC GRADE 12','MAHARASHTRA BOARD'].map(t=>(
            <span key={t} style={{fontFamily:G.mono,fontSize:9,fontWeight:700,letterSpacing:'0.1em',padding:'3px 8px',borderRadius:4,background:G.bgCell,border:`1px solid ${G.border}`,color:G.textMuted}}>{t}</span>
          ))}
          {cpu.halted&&<span style={{fontFamily:G.mono,fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:4,background:'rgba(248,113,113,0.15)',border:'1px solid rgba(248,113,113,0.4)',color:'#ff6b6b',letterSpacing:'0.1em'}}>⛔ HLT</span>}
          {isRunning&&<span style={{fontFamily:G.mono,fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:4,background:G.accentDim,border:`1px solid ${G.accent}`,color:G.accent,letterSpacing:'0.1em'}}>⚡ RUNNING</span>}
        </div>
      </div>

      {/* Control bar */}
      <ControlBar
        isRunning={isRunning} assembled={assembled} halted={cpu.halted}
        doAssemble={doAssemble} step={doStep} run={doRun} reset={doReset}
        speed={speed} setSpeed={setSpeed}
        progress={curIdx+1} total={instructions.length}
      />

      <PageSwitcher activePage={activePage} setActivePage={setActivePage} cpu={cpu} trace={trace} theme={G} />

      {/* Workspace */}
      <div style={{display:'flex',flex:1,overflow:'hidden'}}>
        {activePage === 'WORKSPACE' && (
          <>
            <div style={{width:'40%',minWidth:260,flexShrink:0,borderRight:`1px solid ${G.border}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <EditorPanel
                src={src} setSrc={setSrc}
                instructions={instructions} errors={errors}
                breakpoints={breakpoints} toggleBp={toggleBp}
                currentIdx={curIdx} doAssemble={doAssemble}
              />
            </div>

            <div style={{width:210,flexShrink:0,borderRight:`1px solid ${G.border}`,display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <TabBar tabs={LEFT_TABS} active={leftTab} setActive={setLeftTab}/>
              <div style={{flex:1,overflow:'hidden',overflowY:'auto'}}>
                {leftTab==='REGISTERS' && <RegistersPanel cpu={cpu} prev={prevCpu}/>}
                {leftTab==='FLAGS'     && <FlagsPanel cpu={cpu} prev={prevCpu}/>}
              </div>
            </div>

            <div style={{flex:1,minWidth:0,display:'flex',flexDirection:'column',overflow:'hidden'}}>
              <TabBar tabs={RIGHT_TABS} active={rightTab} setActive={setRightTab}/>
              <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
                {rightTab==='TRACE'    && <TracePanel trace={trace} currentIdx={curIdx} instructions={instructions}/>}
                {rightTab==='MEMORY'   && <MemoryPanel cpu={cpu} writeMemory={writeMemory}/>}
                {rightTab==='STACK'    && <StackPanel cpu={cpu} trace={trace}/>}
                {rightTab==='I/O'      && <IOPanel ports={ports} setPort={setPort}/>}
                {rightTab==='CPU'      && <CPUPanel cpu={cpu} currentInst={curInst}/>}
                {rightTab==='INSTR REF'&& <InstrRefPanel/>}
              </div>
            </div>
          </>
        )}

        {activePage === 'VISUALIZER' && (
          <VisualizerPanel
            cpu={cpu}
            prevCpu={prevCpu}
            currentInst={curInst}
            lastTrace={trace[trace.length - 1] || null}
            history={executionHistory}
            ports={ports}
            currentIdx={curIdx}
            isRunning={isRunning}
            theme={G}
          />
        )}

        {activePage === 'MEMORY' && (
          <div style={{flex:1,display:'grid',gridTemplateColumns:'1.35fr 0.95fr',gridTemplateRows:'minmax(0,1fr) minmax(0,0.9fr)',gap:0,overflow:'hidden'}}>
            <div style={{borderRight:`1px solid ${G.border}`,borderBottom:`1px solid ${G.border}`,minHeight:0,overflow:'hidden'}}>
              <MemoryPanel cpu={cpu} writeMemory={writeMemory}/>
            </div>
            <div style={{borderBottom:`1px solid ${G.border}`,minHeight:0,overflow:'hidden'}}>
              <StackPanel cpu={cpu} trace={trace}/>
            </div>
            <div style={{borderRight:`1px solid ${G.border}`,minHeight:0,overflow:'hidden'}}>
              <IOPanel ports={ports} setPort={setPort}/>
            </div>
            <div style={{minHeight:0,overflow:'hidden',display:'flex',flexDirection:'column',background:G.bgPanel}}>
              <div style={{padding:'12px 14px',borderBottom:`1px solid ${G.border}`,background:G.bgToolbar}}>
                <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.14em',color:G.accent}}>MEMORY ACTIVITY SUMMARY</div>
                <div style={{fontSize:12,color:G.textDim,marginTop:6,lineHeight:1.45}}>
                  Watch data memory, stack movement and live port values together. This page is for observing how the program physically touches RAM and devices.
                </div>
              </div>
              <div style={{padding:14,display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10}}>
                {[
                  ['PC', `${h4(cpu.PC)}H`],
                  ['SP', `${h4(cpu.SP)}H`],
                  ['LAST PORT 00', `${h2(ports[0] || 0)}H`],
                ].map(([label, value]) => (
                  <div key={label} style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:10,padding:'10px 12px'}}>
                    <div style={{fontFamily:G.mono,fontSize:9,color:G.textMuted,letterSpacing:'0.1em'}}>{label}</div>
                    <div style={{fontFamily:G.mono,fontSize:16,fontWeight:700,color:G.textPrimary,marginTop:6}}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{flex:1,minHeight:0,borderTop:`1px solid ${G.border}`}}>
                <TracePanel trace={trace} currentIdx={curIdx} instructions={instructions}/>
              </div>
            </div>
          </div>
        )}

        {activePage === 'DEBUG' && (
          <div style={{flex:1,display:'grid',gridTemplateColumns:'300px 1fr 320px',gap:0,overflow:'hidden'}}>
            <div style={{borderRight:`1px solid ${G.border}`,display:'flex',flexDirection:'column',minHeight:0,overflow:'hidden'}}>
              <TabBar tabs={LEFT_TABS} active={leftTab} setActive={setLeftTab}/>
              <div style={{flex:1,overflow:'hidden',overflowY:'auto'}}>
                {leftTab==='REGISTERS' && <RegistersPanel cpu={cpu} prev={prevCpu}/>}
                {leftTab==='FLAGS'     && <FlagsPanel cpu={cpu} prev={prevCpu}/>}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateRows:'1.05fr 0.95fr',minHeight:0,overflow:'hidden'}}>
              <div style={{borderBottom:`1px solid ${G.border}`,minHeight:0,overflow:'hidden'}}>
                <TracePanel trace={trace} currentIdx={curIdx} instructions={instructions}/>
              </div>
              <div style={{minHeight:0,overflow:'hidden'}}>
                <CPUPanel cpu={cpu} currentInst={curInst}/>
              </div>
            </div>
            <div style={{borderLeft:`1px solid ${G.border}`,display:'grid',gridTemplateRows:'1fr 1fr',minHeight:0,overflow:'hidden'}}>
              <div style={{borderBottom:`1px solid ${G.border}`,minHeight:0,overflow:'hidden'}}>
                <InstrRefPanel/>
              </div>
              <div style={{padding:14,overflowY:'auto',background:G.bgPanel}}>
                <div style={{fontFamily:G.mono,fontSize:10,fontWeight:700,letterSpacing:'0.14em',color:G.accent}}>DEBUG NOTES</div>
                <div style={{marginTop:10,display:'flex',flexDirection:'column',gap:10}}>
                  {[
                    `Current instruction: ${curInst ? `${curInst.mnemonic} @ ${h4(curInst.addr)}H` : 'No instruction selected'}`,
                    `Trace entries captured: ${trace.length}`,
                    `Breakpoints armed: ${breakpoints.size}`,
                    `Execution history snapshots: ${executionHistory.length}`,
                    cpu.halted ? 'CPU is halted. Reset or step a new program to continue.' : 'CPU is ready for the next fetch/execute cycle.',
                  ].map((text, index) => (
                    <div key={index} style={{background:G.bgCell,border:`1px solid ${G.border}`,borderRadius:10,padding:'10px 12px',fontSize:12,color:G.textDim,lineHeight:1.5}}>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div style={{display:'flex',alignItems:'center',gap:14,padding:'3px 14px',background:G.bgHeader,borderTop:`1px solid ${G.border}`,fontFamily:G.mono,fontSize:9,color:G.textDim,flexShrink:0}}>
        <span>PC: <b style={{color:G.colorPc}}>{h4(cpu.PC)}h</b></span>
        <span>SP: <b style={{color:G.colorSp}}>{h4(cpu.SP)}h</b></span>
        <span>A: <b style={{color:G.tokMn}}>{h2(cpu.registers.A||0)}h</b></span>
        <span>Z:<b style={{color:cpu.flags.Z?G.colorOk:G.textMuted}}>{cpu.flags.Z}</b> S:<b style={{color:cpu.flags.S?G.colorErr:G.textMuted}}>{cpu.flags.S}</b> P:<b>{cpu.flags.P}</b> CY:<b style={{color:cpu.flags.CY?G.colorWarn:G.textMuted}}>{cpu.flags.CY}</b></span>
        <span>Steps: <b style={{color:G.textPrimary}}>{trace.length}</b></span>
        {curInst&&<span>Executing: <b style={{color:G.tokMn}}>{curInst.mnemonic}</b></span>}
        <span style={{marginLeft:'auto',color:G.textMuted,fontStyle:'italic'}}>Click gutter → toggle breakpoint · Click memory cell → edit · Click CPU block → info</span>
      </div>
    </div>
  );
}
