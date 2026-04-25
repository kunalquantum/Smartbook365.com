// ─────────────────────────────────────────────────
//  8085 CPU Core — Assembler + Simulator Engine
// ─────────────────────────────────────────────────

export const INITIAL_CPU_STATE = () => ({
  registers: { A: 0, B: 0, C: 0, D: 0, E: 0, H: 0, L: 0 },
  flags: { Z: 0, S: 0, P: 0, CY: 0, AC: 0 },
  PC: 0x0000,
  SP: 0xFFFF,
  memory: new Array(65536).fill(0),
  halted: false,
  interruptEnabled: false,
});

function parity(val) {
  let v = val & 0xFF, count = 0;
  while (v) { count += v & 1; v >>= 1; }
  return count % 2 === 0 ? 1 : 0;
}

function setFlags(state, result, { skipCY=false, cy=null, ac=null }={}) {
  const r = result & 0xFF;
  state.flags.Z = r === 0 ? 1 : 0;
  state.flags.S = (r & 0x80) ? 1 : 0;
  state.flags.P = parity(r);
  if (!skipCY) state.flags.CY = cy !== null ? cy : (result > 0xFF || result < 0) ? 1 : 0;
  if (ac !== null) state.flags.AC = ac;
  return r;
}

function getRP(state, rp) {
  switch(rp) {
    case 'BC': return (state.registers.B << 8) | state.registers.C;
    case 'DE': return (state.registers.D << 8) | state.registers.E;
    case 'HL': return (state.registers.H << 8) | state.registers.L;
    case 'SP': return state.SP;
    default: return 0;
  }
}

function setRP(state, rp, val) {
  const v = val & 0xFFFF;
  switch(rp) {
    case 'BC': state.registers.B=(v>>8)&0xFF; state.registers.C=v&0xFF; break;
    case 'DE': state.registers.D=(v>>8)&0xFF; state.registers.E=v&0xFF; break;
    case 'HL': state.registers.H=(v>>8)&0xFF; state.registers.L=v&0xFF; break;
    case 'SP': state.SP=v; break;
  }
}

function parseNum(s) {
  if (!s && s !== 0) return 0;
  s = s.toString().toUpperCase().trim();
  if (s.endsWith('H')) return parseInt(s.slice(0,-1),16)||0;
  if (s.startsWith('0X')) return parseInt(s.slice(2),16)||0;
  if (s.endsWith('B')) return parseInt(s.slice(0,-1),2)||0;
  if (s.startsWith("'")&&s.endsWith("'")) return s.charCodeAt(1);
  return parseInt(s)||0;
}

function estimateSize(mnemonic) {
  const three=['LXI','MVI','SHLD','LHLD','STA','LDA','JMP','JC','JNC','JZ','JNZ','JP','JM','JPE','JPO','CALL','CC','CNC','CZ','CNZ','CP','CM','CPE','CPO'];
  const two=['ADI','ACI','SUI','SBI','ANI','ORI','XRI','CPI','IN','OUT'];
  if (three.includes(mnemonic)) return 3;
  if (two.includes(mnemonic)) return 2;
  return 1;
}

export function assemble(src) {
  const lines = src.split('\n');
  const labels = {}, parsed = [], errors = [];
  let addr = 0x0000;

  for (let ln=0; ln<lines.length; ln++) {
    let line = lines[ln].toUpperCase().trim();
    const ci = line.indexOf(';');
    if (ci!==-1) line=line.slice(0,ci).trim();
    if (!line) { parsed.push(null); continue; }

    if (line.startsWith('ORG')) {
      addr = parseNum(line.replace('ORG','').trim());
      parsed.push({type:'ORG',addr,lineNum:ln}); continue;
    }

    let labelMatch = line.match(/^([A-Z_][A-Z0-9_]*):\s*/);
    let label=null;
    if (labelMatch) { label=labelMatch[1]; line=line.slice(labelMatch[0].length).trim(); }
    if (label) labels[label]=addr;
    if (!line) { parsed.push(null); continue; }

    if (line.startsWith('DB')) {
      const args=line.replace('DB','').trim().split(',').map(s=>s.trim());
      const bytes=args.map(a=>parseNum(a));
      parsed.push({type:'DB',bytes,addr,lineNum:ln});
      addr+=bytes.length; continue;
    }

    const parts=line.split(/[\s,]+/).filter(Boolean);
    const mnemonic=parts[0], operands=parts.slice(1);
    parsed.push({mnemonic,operands,addr,lineNum:ln,label,line});
    addr+=estimateSize(mnemonic);
  }

  const instructions=[];
  for (const entry of parsed) {
    if (!entry) continue;
    if (entry.type==='ORG') continue;
    if (entry.type==='DB') { instructions.push({...entry,size:entry.bytes.length}); continue; }
    const {mnemonic,operands,lineNum} = entry;
    const resolvedOps = operands.map(op=>labels[op]!==undefined?labels[op]:op);
    const inst = buildInstruction(mnemonic,resolvedOps,entry.addr,lineNum,errors);
    if (inst) instructions.push(inst);
  }
  return {instructions,labels,errors};
}

function buildInstruction(mnemonic,ops,addr,lineNum,errors) {
  const op=(i)=>ops[i]!==undefined?ops[i]:null;
  const num=(i)=>typeof op(i)==='number'?op(i):parseNum(op(i));
  const base={addr,lineNum,mnemonic,operands:ops};

  switch(mnemonic) {
    case 'MOV':  return {...base,size:1,dst:op(0),src:op(1)};
    case 'MVI':  return {...base,size:2,dst:op(0),data:num(1)};
    case 'LXI':  return {...base,size:3,rp:op(0),data:num(1)};
    case 'LDA':  return {...base,size:3,addr16:num(0)};
    case 'STA':  return {...base,size:3,addr16:num(0)};
    case 'LDAX': return {...base,size:1,rp:op(0)};
    case 'STAX': return {...base,size:1,rp:op(0)};
    case 'LHLD': return {...base,size:3,addr16:num(0)};
    case 'SHLD': return {...base,size:3,addr16:num(0)};
    case 'XCHG': return {...base,size:1};
    case 'XTHL': return {...base,size:1};
    case 'SPHL': return {...base,size:1};
    case 'PCHL': return {...base,size:1};
    case 'ADD':  return {...base,size:1,src:op(0)};
    case 'ADC':  return {...base,size:1,src:op(0)};
    case 'ADI':  return {...base,size:2,data:num(0)};
    case 'ACI':  return {...base,size:2,data:num(0)};
    case 'SUB':  return {...base,size:1,src:op(0)};
    case 'SBB':  return {...base,size:1,src:op(0)};
    case 'SUI':  return {...base,size:2,data:num(0)};
    case 'SBI':  return {...base,size:2,data:num(0)};
    case 'INR':  return {...base,size:1,dst:op(0)};
    case 'DCR':  return {...base,size:1,dst:op(0)};
    case 'INX':  return {...base,size:1,rp:op(0)};
    case 'DCX':  return {...base,size:1,rp:op(0)};
    case 'DAD':  return {...base,size:1,rp:op(0)};
    case 'DAA':  return {...base,size:1};
    case 'ANA':  return {...base,size:1,src:op(0)};
    case 'ANI':  return {...base,size:2,data:num(0)};
    case 'ORA':  return {...base,size:1,src:op(0)};
    case 'ORI':  return {...base,size:2,data:num(0)};
    case 'XRA':  return {...base,size:1,src:op(0)};
    case 'XRI':  return {...base,size:2,data:num(0)};
    case 'CMA':  return {...base,size:1};
    case 'CMC':  return {...base,size:1};
    case 'STC':  return {...base,size:1};
    case 'CMP':  return {...base,size:1,src:op(0)};
    case 'CPI':  return {...base,size:2,data:num(0)};
    case 'RLC':  return {...base,size:1};
    case 'RRC':  return {...base,size:1};
    case 'RAL':  return {...base,size:1};
    case 'RAR':  return {...base,size:1};
    case 'JMP':  return {...base,size:3,target:num(0)};
    case 'JC':   return {...base,size:3,target:num(0),cond:'CY',val:1};
    case 'JNC':  return {...base,size:3,target:num(0),cond:'CY',val:0};
    case 'JZ':   return {...base,size:3,target:num(0),cond:'Z',val:1};
    case 'JNZ':  return {...base,size:3,target:num(0),cond:'Z',val:0};
    case 'JP':   return {...base,size:3,target:num(0),cond:'S',val:0};
    case 'JM':   return {...base,size:3,target:num(0),cond:'S',val:1};
    case 'JPE':  return {...base,size:3,target:num(0),cond:'P',val:1};
    case 'JPO':  return {...base,size:3,target:num(0),cond:'P',val:0};
    case 'CALL': return {...base,size:3,target:num(0)};
    case 'CC':   return {...base,size:3,target:num(0),cond:'CY',val:1};
    case 'CNC':  return {...base,size:3,target:num(0),cond:'CY',val:0};
    case 'CZ':   return {...base,size:3,target:num(0),cond:'Z',val:1};
    case 'CNZ':  return {...base,size:3,target:num(0),cond:'Z',val:0};
    case 'CP':   return {...base,size:3,target:num(0),cond:'S',val:0};
    case 'CM':   return {...base,size:3,target:num(0),cond:'S',val:1};
    case 'CPE':  return {...base,size:3,target:num(0),cond:'P',val:1};
    case 'CPO':  return {...base,size:3,target:num(0),cond:'P',val:0};
    case 'RET':  return {...base,size:1};
    case 'RC':   return {...base,size:1,cond:'CY',val:1};
    case 'RNC':  return {...base,size:1,cond:'CY',val:0};
    case 'RZ':   return {...base,size:1,cond:'Z',val:1};
    case 'RNZ':  return {...base,size:1,cond:'Z',val:0};
    case 'RP':   return {...base,size:1,cond:'S',val:0};
    case 'RM':   return {...base,size:1,cond:'S',val:1};
    case 'RPE':  return {...base,size:1,cond:'P',val:1};
    case 'RPO':  return {...base,size:1,cond:'P',val:0};
    case 'PUSH': return {...base,size:1,rp:op(0)};
    case 'POP':  return {...base,size:1,rp:op(0)};
    case 'IN':   return {...base,size:2,port:num(0)};
    case 'OUT':  return {...base,size:2,port:num(0)};
    case 'NOP':  return {...base,size:1};
    case 'HLT':  return {...base,size:1};
    case 'EI':   return {...base,size:1};
    case 'DI':   return {...base,size:1};
    case 'RIM':  return {...base,size:1};
    case 'SIM':  return {...base,size:1};
    case 'RST':  return {...base,size:1,n:num(0)};
    default:
      errors.push({lineNum,msg:`Unknown mnemonic: ${mnemonic}`});
      return null;
  }
}

export function executeInstruction(state, inst, ports={}) {
  const s = JSON.parse(JSON.stringify(state));
  const trace={pc:inst.addr,mnemonic:inst.mnemonic,changes:[],busActivity:[],regsBefore:{...state.registers},flagsBefore:{...state.flags}};

  function getMem(addr){return s.memory[addr&0xFFFF]||0;}
  function setMem(addr,val){s.memory[addr&0xFFFF]=val&0xFF; trace.changes.push({type:'mem',addr:addr&0xFFFF,val:val&0xFF});}
  function getReg(r){if(r==='M')return getMem(getRP(s,'HL')); return s.registers[r]||0;}
  function setReg(r,v){
    const val=v&0xFF;
    if(r==='M'){setMem(getRP(s,'HL'),val);}
    else{s.registers[r]=val; trace.changes.push({type:'reg',reg:r,val});}
  }

  const m=inst.mnemonic;
  switch(m) {
    case 'MOV': setReg(inst.dst,getReg(inst.src)); trace.busActivity.push(`${inst.src}→${inst.dst}: ${toH(getReg(inst.src))}`); break;
    case 'MVI': setReg(inst.dst,inst.data); trace.busActivity.push(`Imm ${toH(inst.data)}→${inst.dst}`); break;
    case 'LXI': setRP(s,inst.rp,inst.data); trace.busActivity.push(`${toH16(inst.data)}→${inst.rp}`); break;
    case 'LDA': {const v=getMem(inst.addr16); s.registers.A=v; trace.busActivity.push(`Mem[${toH16(inst.addr16)}]→A: ${toH(v)}`); break;}
    case 'STA': setMem(inst.addr16,s.registers.A); trace.busActivity.push(`A(${toH(s.registers.A)})→Mem[${toH16(inst.addr16)}]`); break;
    case 'LDAX': {const v=getMem(getRP(s,inst.rp)); s.registers.A=v; trace.busActivity.push(`[${inst.rp}]→A`); break;}
    case 'STAX': setMem(getRP(s,inst.rp),s.registers.A); break;
    case 'LHLD': s.registers.L=getMem(inst.addr16); s.registers.H=getMem(inst.addr16+1); break;
    case 'SHLD': setMem(inst.addr16,s.registers.L); setMem(inst.addr16+1,s.registers.H); break;
    case 'XCHG': {const tmp={H:s.registers.H,L:s.registers.L}; s.registers.H=s.registers.D; s.registers.L=s.registers.E; s.registers.D=tmp.H; s.registers.E=tmp.L; break;}
    case 'XTHL': {const lo=getMem(s.SP),hi=getMem(s.SP+1); setMem(s.SP,s.registers.L); setMem(s.SP+1,s.registers.H); s.registers.L=lo; s.registers.H=hi; break;}
    case 'SPHL': s.SP=getRP(s,'HL'); break;
    case 'PCHL': s.PC=getRP(s,'HL')-inst.size; break;
    case 'ADD': case 'ADC': {
      const src=getReg(inst.src),cy=m==='ADC'?s.flags.CY:0,res=s.registers.A+src+cy;
      const ac=((s.registers.A&0xF)+(src&0xF)+cy)>0xF?1:0;
      s.registers.A=setFlags(s,res,{ac}); trace.busActivity.push(`A+${inst.src}+${cy}=${res&0xFF}`); break;
    }
    case 'ADI': case 'ACI': {const cy=m==='ACI'?s.flags.CY:0,res=s.registers.A+inst.data+cy; s.registers.A=setFlags(s,res,{ac:((s.registers.A&0xF)+(inst.data&0xF)+cy)>0xF?1:0}); break;}
    case 'SUB': case 'SBB': {const src=getReg(inst.src),bw=m==='SBB'?s.flags.CY:0,res=s.registers.A-src-bw; s.registers.A=setFlags(s,res,{cy:res<0?1:0,ac:((s.registers.A&0xF)-(src&0xF)-bw)<0?1:0}); trace.busActivity.push(`A-${inst.src}=${res&0xFF}`); break;}
    case 'SUI': case 'SBI': {const bw=m==='SBI'?s.flags.CY:0,res=s.registers.A-inst.data-bw; s.registers.A=setFlags(s,res,{cy:res<0?1:0}); break;}
    case 'INR': {const v=getReg(inst.dst)+1; setReg(inst.dst,v); setFlags(s,v,{skipCY:true}); trace.busActivity.push(`${inst.dst}++ → ${v&0xFF}`); break;}
    case 'DCR': {const v=getReg(inst.dst)-1; setReg(inst.dst,v); setFlags(s,v,{skipCY:true}); trace.busActivity.push(`${inst.dst}-- → ${v&0xFF}`); break;}
    case 'INX': setRP(s,inst.rp,getRP(s,inst.rp)+1); break;
    case 'DCX': setRP(s,inst.rp,getRP(s,inst.rp)-1); break;
    case 'DAD': {const res=getRP(s,'HL')+getRP(s,inst.rp); setRP(s,'HL',res); s.flags.CY=res>0xFFFF?1:0; break;}
    case 'ANA': {s.registers.A=setFlags(s,s.registers.A&getReg(inst.src),{cy:0,ac:0}); break;}
    case 'ANI': {s.registers.A=setFlags(s,s.registers.A&inst.data,{cy:0}); break;}
    case 'ORA': {s.registers.A=setFlags(s,s.registers.A|getReg(inst.src),{cy:0,ac:0}); break;}
    case 'ORI': {s.registers.A=setFlags(s,s.registers.A|inst.data,{cy:0}); break;}
    case 'XRA': {s.registers.A=setFlags(s,s.registers.A^getReg(inst.src),{cy:0,ac:0}); break;}
    case 'XRI': {s.registers.A=setFlags(s,s.registers.A^inst.data,{cy:0}); break;}
    case 'CMA': s.registers.A=(~s.registers.A)&0xFF; break;
    case 'CMC': s.flags.CY^=1; break;
    case 'STC': s.flags.CY=1; break;
    case 'CMP': {const res=s.registers.A-getReg(inst.src); setFlags(s,res,{cy:res<0?1:0}); trace.busActivity.push(`A vs ${inst.src}: ${res<0?'A<':'A>='}`); break;}
    case 'CPI': {const res=s.registers.A-inst.data; setFlags(s,res,{cy:res<0?1:0}); break;}
    case 'RLC': {const msb=(s.registers.A>>7)&1; s.registers.A=((s.registers.A<<1)|msb)&0xFF; s.flags.CY=msb; break;}
    case 'RRC': {const lsb=s.registers.A&1; s.registers.A=((s.registers.A>>1)|(lsb<<7))&0xFF; s.flags.CY=lsb; break;}
    case 'RAL': {const msb=(s.registers.A>>7)&1; s.registers.A=((s.registers.A<<1)|s.flags.CY)&0xFF; s.flags.CY=msb; break;}
    case 'RAR': {const lsb=s.registers.A&1; s.registers.A=((s.registers.A>>1)|(s.flags.CY<<7))&0xFF; s.flags.CY=lsb; break;}
    case 'JMP': {s.PC=inst.target-inst.size; trace.busActivity.push(`JMP→${toH16(inst.target)}`); trace.branchTaken=true; trace.branchTarget=inst.target; break;}
    case 'JC':case 'JNC':case 'JZ':case 'JNZ':case 'JP':case 'JM':case 'JPE':case 'JPO': {
      const taken=s.flags[inst.cond]===inst.val;
      if(taken) s.PC=inst.target-inst.size;
      trace.busActivity.push(`${m}(${inst.cond}=${s.flags[inst.cond]}): ${taken?'TAKEN':'SKIP'}`);
      trace.branchTaken=taken; trace.branchTarget=inst.target; break;
    }
    case 'CALL':case 'CC':case 'CNC':case 'CZ':case 'CNZ':case 'CP':case 'CM':case 'CPE':case 'CPO': {
      const taken=!inst.cond||s.flags[inst.cond]===inst.val;
      if(taken){
        const ret=inst.addr+inst.size;
        s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,(ret>>8)&0xFF);
        s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,ret&0xFF);
        s.PC=inst.target-inst.size;
        trace.stackActivity={type:'push',addr:ret};
        trace.busActivity.push(`CALL→${toH16(inst.target)},ret=${toH16(ret)}`);
      } break;
    }
    case 'RET':case 'RC':case 'RNC':case 'RZ':case 'RNZ':case 'RP':case 'RM':case 'RPE':case 'RPO': {
      const taken=!inst.cond||s.flags[inst.cond]===inst.val;
      if(taken){
        const lo=getMem(s.SP); s.SP=(s.SP+1)&0xFFFF;
        const hi=getMem(s.SP); s.SP=(s.SP+1)&0xFFFF;
        const ret=(hi<<8)|lo; s.PC=ret-inst.size;
        trace.stackActivity={type:'pop',addr:ret};
        trace.busActivity.push(`RET→${toH16(ret)}`);
      } break;
    }
    case 'PUSH': {
      let hi,lo;
      if(inst.rp==='PSW'){hi=s.registers.A;lo=(s.flags.S<<7)|(s.flags.Z<<6)|(s.flags.AC<<4)|(s.flags.P<<2)|1|(s.flags.CY);}
      else{hi=s.registers[inst.rp[0]]||0; lo=s.registers[inst.rp[1]]||0;}
      s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,hi);
      s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,lo);
      trace.stackActivity={type:'push',rp:inst.rp}; trace.busActivity.push(`PUSH ${inst.rp}, SP→${toH16(s.SP)}`); break;
    }
    case 'POP': {
      const lo=getMem(s.SP); s.SP=(s.SP+1)&0xFFFF;
      const hi=getMem(s.SP); s.SP=(s.SP+1)&0xFFFF;
      if(inst.rp==='PSW'){s.registers.A=hi;s.flags.S=(lo>>7)&1;s.flags.Z=(lo>>6)&1;s.flags.AC=(lo>>4)&1;s.flags.P=(lo>>2)&1;s.flags.CY=lo&1;}
      else{s.registers[inst.rp[0]]=hi;s.registers[inst.rp[1]]=lo;}
      trace.stackActivity={type:'pop',rp:inst.rp}; trace.busActivity.push(`POP ${inst.rp}, SP→${toH16(s.SP)}`); break;
    }
    case 'IN':  s.registers.A=(ports[inst.port]||0)&0xFF; trace.busActivity.push(`IN port${inst.port}h→A`); break;
    case 'OUT': ports[inst.port]=s.registers.A; trace.busActivity.push(`A→OUT port${inst.port}h`); break;
    case 'HLT': s.halted=true; trace.busActivity.push('CPU HALTED'); break;
    case 'EI':  s.interruptEnabled=true; break;
    case 'DI':  s.interruptEnabled=false; break;
    case 'DAA': {
      let a=s.registers.A,cy=s.flags.CY;
      if((a&0x0F)>9||s.flags.AC){a+=0x06;}
      if(a>0x9F||cy){a+=0x60;cy=1;}
      s.registers.A=setFlags(s,a,{cy}); break;
    }
    case 'RST': {
      const ret=inst.addr+1;
      s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,(ret>>8)&0xFF);
      s.SP=(s.SP-1)&0xFFFF; setMem(s.SP,ret&0xFF);
      s.PC=(inst.n*8)-1; break;
    }
    default: break;
  }
  s.PC=(s.PC+inst.size)&0xFFFF;
  return {newState:s,trace};
}

function toH(v,w=2){return(v||0).toString(16).toUpperCase().padStart(w,'0')+'h';}
function toH16(v){return(v||0).toString(16).toUpperCase().padStart(4,'0')+'h';}

export const INSTRUCTION_INFO = {
  MOV: {desc:'Move data between registers or memory',cycles:1,tstates:'4/7',flags:'None',category:'Data Transfer'},
  MVI: {desc:'Move immediate data to register/memory',cycles:2,tstates:'7/10',flags:'None',category:'Data Transfer'},
  LXI: {desc:'Load immediate 16-bit to register pair',cycles:3,tstates:10,flags:'None',category:'Data Transfer'},
  LDA: {desc:'Load Accumulator from direct address',cycles:3,tstates:13,flags:'None',category:'Data Transfer'},
  STA: {desc:'Store Accumulator to direct address',cycles:3,tstates:13,flags:'None',category:'Data Transfer'},
  LDAX:{desc:'Load Accumulator indirect via BC/DE',cycles:1,tstates:7,flags:'None',category:'Data Transfer'},
  STAX:{desc:'Store Accumulator indirect via BC/DE',cycles:1,tstates:7,flags:'None',category:'Data Transfer'},
  LHLD:{desc:'Load HL from direct address',cycles:3,tstates:16,flags:'None',category:'Data Transfer'},
  SHLD:{desc:'Store HL to direct address',cycles:3,tstates:16,flags:'None',category:'Data Transfer'},
  XCHG:{desc:'Exchange HL and DE register pairs',cycles:1,tstates:4,flags:'None',category:'Data Transfer'},
  XTHL:{desc:'Exchange HL with top of stack',cycles:1,tstates:16,flags:'None',category:'Data Transfer'},
  SPHL:{desc:'Move HL to Stack Pointer',cycles:1,tstates:6,flags:'None',category:'Data Transfer'},
  PCHL:{desc:'Move HL to Program Counter (jump)',cycles:1,tstates:6,flags:'None',category:'Branch'},
  ADD: {desc:'Add register/memory to Accumulator',cycles:1,tstates:'4/7',flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  ADC: {desc:'Add register + Carry to Accumulator',cycles:1,tstates:'4/7',flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  ADI: {desc:'Add immediate byte to Accumulator',cycles:2,tstates:7,flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  ACI: {desc:'Add immediate + Carry to Accumulator',cycles:2,tstates:7,flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  SUB: {desc:'Subtract register/memory from A',cycles:1,tstates:'4/7',flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  SBB: {desc:'Subtract register + Borrow from A',cycles:1,tstates:'4/7',flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  SUI: {desc:'Subtract immediate from A',cycles:2,tstates:7,flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  SBI: {desc:'Subtract immediate + Borrow from A',cycles:2,tstates:7,flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  INR: {desc:'Increment register or memory by 1',cycles:1,tstates:'4/10',flags:'Z,S,P,AC',category:'Arithmetic'},
  DCR: {desc:'Decrement register or memory by 1',cycles:1,tstates:'4/10',flags:'Z,S,P,AC',category:'Arithmetic'},
  INX: {desc:'Increment 16-bit register pair',cycles:1,tstates:6,flags:'None',category:'Arithmetic'},
  DCX: {desc:'Decrement 16-bit register pair',cycles:1,tstates:6,flags:'None',category:'Arithmetic'},
  DAD: {desc:'Add register pair to HL',cycles:1,tstates:10,flags:'CY',category:'Arithmetic'},
  DAA: {desc:'Decimal Adjust Accumulator for BCD',cycles:1,tstates:4,flags:'Z,S,P,CY,AC',category:'Arithmetic'},
  ANA: {desc:'AND register/memory with A',cycles:1,tstates:'4/7',flags:'Z,S,P,CY=0,AC',category:'Logical'},
  ANI: {desc:'AND immediate with A',cycles:2,tstates:7,flags:'Z,S,P,CY=0',category:'Logical'},
  ORA: {desc:'OR register/memory with A',cycles:1,tstates:'4/7',flags:'Z,S,P,CY=0,AC=0',category:'Logical'},
  ORI: {desc:'OR immediate with A',cycles:2,tstates:7,flags:'Z,S,P,CY=0',category:'Logical'},
  XRA: {desc:'XOR register/memory with A',cycles:1,tstates:'4/7',flags:'Z,S,P,CY=0,AC=0',category:'Logical'},
  XRI: {desc:'XOR immediate with A',cycles:2,tstates:7,flags:'Z,S,P,CY=0',category:'Logical'},
  CMA: {desc:'Complement Accumulator (bitwise NOT)',cycles:1,tstates:4,flags:'None',category:'Logical'},
  CMC: {desc:'Complement Carry flag',cycles:1,tstates:4,flags:'CY',category:'Logical'},
  STC: {desc:'Set Carry flag to 1',cycles:1,tstates:4,flags:'CY=1',category:'Logical'},
  CMP: {desc:'Compare register/memory with A (sets flags)',cycles:1,tstates:'4/7',flags:'Z,S,P,CY,AC',category:'Logical'},
  CPI: {desc:'Compare immediate with A (sets flags)',cycles:2,tstates:7,flags:'Z,S,P,CY,AC',category:'Logical'},
  RLC: {desc:'Rotate A left, MSB wraps to bit0 and CY',cycles:1,tstates:4,flags:'CY',category:'Logical'},
  RRC: {desc:'Rotate A right, LSB wraps to bit7 and CY',cycles:1,tstates:4,flags:'CY',category:'Logical'},
  RAL: {desc:'Rotate A left through Carry',cycles:1,tstates:4,flags:'CY',category:'Logical'},
  RAR: {desc:'Rotate A right through Carry',cycles:1,tstates:4,flags:'CY',category:'Logical'},
  JMP: {desc:'Unconditional jump to 16-bit address',cycles:3,tstates:10,flags:'None',category:'Branch'},
  JC:  {desc:'Jump if Carry=1',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JNC: {desc:'Jump if Carry=0',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JZ:  {desc:'Jump if Zero=1 (result was zero)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JNZ: {desc:'Jump if Zero=0 (result was non-zero)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JP:  {desc:'Jump if Sign=0 (result positive)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JM:  {desc:'Jump if Sign=1 (result negative)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JPE: {desc:'Jump if Parity=1 (even parity)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  JPO: {desc:'Jump if Parity=0 (odd parity)',cycles:3,tstates:'7/10',flags:'None',category:'Branch'},
  CALL:{desc:'Call subroutine: push PC, jump to address',cycles:3,tstates:18,flags:'None',category:'Branch'},
  CC:  {desc:'Call if Carry=1',cycles:3,tstates:'9/18',flags:'None',category:'Branch'},
  CNC: {desc:'Call if Carry=0',cycles:3,tstates:'9/18',flags:'None',category:'Branch'},
  CZ:  {desc:'Call if Zero=1',cycles:3,tstates:'9/18',flags:'None',category:'Branch'},
  CNZ: {desc:'Call if Zero=0',cycles:3,tstates:'9/18',flags:'None',category:'Branch'},
  RET: {desc:'Return from subroutine: pop PC from stack',cycles:1,tstates:10,flags:'None',category:'Branch'},
  RC:  {desc:'Return if Carry=1',cycles:1,tstates:'6/12',flags:'None',category:'Branch'},
  RNC: {desc:'Return if Carry=0',cycles:1,tstates:'6/12',flags:'None',category:'Branch'},
  RZ:  {desc:'Return if Zero=1',cycles:1,tstates:'6/12',flags:'None',category:'Branch'},
  RNZ: {desc:'Return if Zero=0',cycles:1,tstates:'6/12',flags:'None',category:'Branch'},
  PUSH:{desc:'Push register pair to stack',cycles:1,tstates:12,flags:'None',category:'Stack'},
  POP: {desc:'Pop register pair from stack',cycles:1,tstates:10,flags:'None',category:'Stack'},
  IN:  {desc:'Read I/O port into Accumulator',cycles:2,tstates:10,flags:'None',category:'I/O'},
  OUT: {desc:'Write Accumulator to I/O port',cycles:2,tstates:10,flags:'None',category:'I/O'},
  NOP: {desc:'No operation — wastes 4 T-states',cycles:1,tstates:4,flags:'None',category:'Control'},
  HLT: {desc:'Halt CPU execution until interrupt',cycles:1,tstates:5,flags:'None',category:'Control'},
  EI:  {desc:'Enable interrupt system',cycles:1,tstates:4,flags:'None',category:'Control'},
  DI:  {desc:'Disable interrupt system',cycles:1,tstates:4,flags:'None',category:'Control'},
  RST: {desc:'Restart: push PC, jump to n×8',cycles:1,tstates:12,flags:'None',category:'Control'},
  RIM: {desc:'Read Interrupt Mask into A',cycles:1,tstates:4,flags:'None',category:'Control'},
  SIM: {desc:'Set Interrupt Mask from A',cycles:1,tstates:4,flags:'None',category:'Control'},
};

export const EXAMPLE_PROGRAMS = {
  'Add Two Numbers': `; Add two numbers — result in A and memory
MVI A, 25H    ; First number = 37
MVI B, 14H    ; Second number = 20
ADD B         ; A = A + B = 57 = 39H
STA 8000H     ; Store result at 8000H
HLT           ; Stop`,

  'Find Largest': `; Find largest of 5 numbers stored at 9000H
LXI H, 9000H  ; Pointer to array
MVI M, 43H    ; array[0] = 67
INX H
MVI M, 12H    ; array[1] = 18
INX H
MVI M, 78H    ; array[2] = 120 (largest)
INX H
MVI M, 55H    ; array[3] = 85
INX H
MVI M, 33H    ; array[4] = 51
LXI H, 9000H  ; Reset pointer
MOV A, M      ; A = first element
MVI C, 04H    ; 4 comparisons left
LOOP: INX H
CMP M         ; Compare A with next
JNC SKIP      ; Jump if A >= M
MOV A, M      ; New max found
SKIP: DCR C
JNZ LOOP
STA 9010H     ; Store largest
HLT`,

  'Fibonacci Series': `; Store first 8 Fibonacci numbers at 9000H
LXI H, 9000H  ; Memory pointer
MVI A, 00H    ; F(0) = 0
MOV M, A
INX H
MVI A, 01H    ; F(1) = 1
MOV M, A
MVI C, 06H    ; Generate 6 more
LOOP: MOV A, M      ; Load F(n)
DCX H
ADD M         ; A = F(n) + F(n-1)
INX H
INX H
MOV M, A
DCR C
JNZ LOOP
HLT`,

  'Count 1-Bits': `; Count number of 1s in register B
MVI B, 0B5H   ; Test = 10110101 = 5 ones
MVI C, 00H    ; Counter
MVI D, 08H    ; 8 bits to check
LOOP: MOV A, B
ANI 01H       ; Isolate LSB
JZ SKIP       ; If 0, skip count
INR C         ; Count this 1
SKIP: MOV A, B
RRC           ; Shift B right
MOV B, A
DCR D
JNZ LOOP
MOV A, C      ; Result in A
HLT`,

  'Bubble Sort': `; Bubble sort 5 numbers at 9000H
LXI H, 9000H
MVI M, 45H
INX H: MVI M, 12H
INX H: MVI M, 78H
INX H: MVI M, 23H
INX H: MVI M, 56H
MVI D, 04H    ; Outer passes
OUTER: MVI E, 04H
LXI H, 9000H
INNER: MOV A, M
INX H
CMP M
JC NOSWAP     ; Already sorted
MOV B, M      ; Swap
MOV M, A
DCX H
MOV M, B
INX H
NOSWAP: DCR E
JNZ INNER
DCR D
JNZ OUTER
HLT`,

  'Stack Demo (PUSH/POP)': `; Demonstrate PUSH and POP
MVI A, 0AAH   ; A = AAH
MVI B, 0BBH   ; B = BBH
MVI C, 0CCH   ; C = CCH
PUSH B        ; Push BC pair
PUSH PSW      ; Push A and flags
MVI A, 00H    ; Corrupt A
MVI B, 00H    ; Corrupt B
MVI C, 00H    ; Corrupt C
POP PSW       ; Restore A (AAH)
POP B         ; Restore BC (BB,CC)
HLT`,

  'I/O Demo (LED)': `; Send patterns to LED port 00H
MVI A, 0FFH   ; All LEDs ON
OUT 00H       ; Send to port 0
MVI A, 55H    ; Alternating 01010101
OUT 00H
MVI A, 0AAH   ; Alternating 10101010
OUT 00H
MVI A, 0F0H   ; Upper half ON
OUT 01H       ; Also send to 7-seg port
HLT`,

  'Factorial of 5': `; Calculate 5! = 120 (78H)
MVI B, 05H    ; n = 5
MVI A, 01H    ; result = 1
MULT: MVI C, 00H  ; C counts multiply loops
MVI D, A      ; Save A (multiplicand)
ADDLOOP: ADD D ; A = A + D (multiply by repeated add)
DCR B
JZ DONE
INR C
MOV A, C      ; Hmm - simple loop multiply
HLT
DONE: STA 8050H
HLT`,

  'Memory Transfer': `; Copy 5 bytes from 9000H to 9100H
LXI H, 9000H  ; Source: load some data
MVI M, 11H: INX H
MVI M, 22H: INX H
MVI M, 33H: INX H
MVI M, 44H: INX H
MVI M, 55H
LXI H, 9000H  ; Source pointer
LXI D, 9100H  ; Destination pointer
MVI C, 05H    ; 5 bytes to copy
LOOP: MOV A, M    ; Load from source
STAX D        ; Store to dest
INX H         ; Advance source
INX D         ; Advance dest
DCR C
JNZ LOOP
HLT`,
};
