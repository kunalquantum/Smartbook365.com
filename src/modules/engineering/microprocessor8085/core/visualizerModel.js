import { INSTRUCTION_INFO } from './cpu8085';

const h2 = value => ((value ?? 0) & 0xff).toString(16).toUpperCase().padStart(2, '0');
const h4 = value => ((value ?? 0) & 0xffff).toString(16).toUpperCase().padStart(4, '0');
const b8 = value => ((value ?? 0) & 0xff).toString(2).padStart(8, '0');

const BASE_ENTITIES = [
  { id: 'pc', label: 'Program Counter', short: 'PC', valueKey: 'PC', description: 'Holds the address of the next instruction fetch.', x: 8, y: 8, w: 20, h: 12, group: 'control', depth: 0 },
  { id: 'memory', label: 'Memory Interface', short: 'MEM', description: 'Supplies opcodes and data bytes through memory read/write cycles.', x: 70, y: 10, w: 22, h: 16, group: 'external', depth: 2 },
  { id: 'ir', label: 'Instruction Register', short: 'IR', description: 'Latches the opcode currently being decoded.', x: 38, y: 8, w: 20, h: 12, group: 'control', depth: 1 },
  { id: 'decoder', label: 'Decoder', short: 'DEC', description: 'Translates the latched opcode into control signals.', x: 38, y: 28, w: 20, h: 14, group: 'control', depth: 1 },
  { id: 'timing', label: 'Timing Unit', short: 'T', description: 'Breaks execution into fetch, decode, execute and write-back timing.', x: 8, y: 28, w: 20, h: 14, group: 'control', depth: 0 },
  { id: 'regfile', label: 'Register Array', short: 'REG', description: 'Contains the working 8-bit and 16-bit programmer-visible registers.', x: 8, y: 52, w: 24, h: 18, group: 'datapath', depth: 0 },
  { id: 'acc', label: 'Accumulator', short: 'A', description: 'Main arithmetic register. Most ALU results return here.', x: 38, y: 52, w: 16, h: 14, group: 'datapath', depth: 1 },
  { id: 'alu', label: 'ALU', short: 'ALU', description: 'Performs arithmetic, logical, rotate, compare and increment/decrement operations.', x: 38, y: 72, w: 20, h: 16, group: 'datapath', depth: 1 },
  { id: 'flags', label: 'Flag Register', short: 'FLAGS', description: 'Captures carry, zero, sign, parity and auxiliary carry outcomes.', x: 62, y: 72, w: 18, h: 14, group: 'datapath', depth: 2 },
  { id: 'stack', label: 'Stack Engine', short: 'STACK', description: 'Uses SP to push return addresses and register pairs through memory.', x: 70, y: 48, w: 22, h: 16, group: 'external', depth: 2 },
  { id: 'io', label: 'I/O Ports', short: 'I/O', description: 'Handles IN and OUT instructions for mapped ports and devices.', x: 70, y: 72, w: 22, h: 14, group: 'external', depth: 2 },
];

function classifyInstruction(inst) {
  if (!inst) return 'idle';
  const category = INSTRUCTION_INFO[inst.mnemonic]?.category ?? 'Control';
  if (category === 'Arithmetic' || category === 'Logical') return 'alu';
  if (category === 'Branch') return 'branch';
  if (category === 'Stack') return 'stack';
  if (category === 'I/O') return 'io';
  if (['LDA', 'STA', 'LDAX', 'STAX', 'LHLD', 'SHLD'].includes(inst.mnemonic)) return 'memory';
  return 'transfer';
}

function readRegister(cpu, name) {
  if (!cpu) return 0;
  if (name === 'M') {
    const hl = ((cpu.registers.H ?? 0) << 8) | (cpu.registers.L ?? 0);
    return cpu.memory?.[hl] ?? 0;
  }
  return cpu.registers?.[name] ?? 0;
}

function parseTStates(value, trace) {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return 0;
  if (!value.includes('/')) return Number.parseInt(value, 10) || 0;
  const [shortPath, longPath] = value.split('/').map(part => Number.parseInt(part, 10) || 0);
  if (trace?.branchTaken === true) return Math.max(shortPath, longPath);
  if (trace?.branchTaken === false) return Math.min(shortPath, longPath);
  return Math.max(shortPath, longPath);
}

function getChangedFlags(prevCpu, cpu) {
  const keys = ['Z', 'S', 'P', 'CY', 'AC'];
  return keys
    .filter(key => (prevCpu?.flags?.[key] ?? 0) !== (cpu?.flags?.[key] ?? 0))
    .map(key => ({
      key,
      before: prevCpu?.flags?.[key] ?? 0,
      after: cpu?.flags?.[key] ?? 0,
    }));
}

function getChangedRegisters(trace, cpu) {
  if (!trace?.changes?.length) return [];
  return trace.changes
    .filter(change => change.type === 'reg')
    .map(change => ({
      reg: change.reg,
      after: cpu?.registers?.[change.reg] ?? change.val ?? 0,
      before: trace?.regsBefore?.[change.reg] ?? 0,
    }));
}

function getMemoryChanges(trace) {
  return (trace?.changes ?? []).filter(change => change.type === 'mem');
}

function deriveBusActivity(inst, trace, prevCpu, cpu) {
  if (!inst) {
    return {
      flows: [],
      busState: {
        address: '----',
        data: '--',
        control: 'IDLE',
      },
    };
  }

  const flows = [
    { id: 'fetch-pc', from: 'pc', to: 'memory', label: `Fetch @ ${h4(inst.addr)}H`, kind: 'fetch', active: true },
    { id: 'fetch-ir', from: 'memory', to: 'ir', label: inst.mnemonic, kind: 'fetch', active: true },
    { id: 'decode', from: 'ir', to: 'decoder', label: 'Decode opcode', kind: 'control', active: true },
    { id: 'timing', from: 'timing', to: 'decoder', label: 'Cycle control', kind: 'control', active: true },
  ];

  const mode = classifyInstruction(inst);
  const address = h4(inst.addr);
  let data = inst.data ?? inst.addr16 ?? inst.target ?? readRegister(prevCpu, inst.src) ?? readRegister(prevCpu, inst.dst);
  let control = 'OF/M1';

  if (mode === 'transfer') {
    if (inst.mnemonic === 'MOV') {
      flows.push({ id: 'mov', from: inst.src === 'M' ? 'memory' : 'regfile', to: inst.dst === 'M' ? 'memory' : 'regfile', label: `${inst.src} -> ${inst.dst}`, kind: 'data', active: true });
      if (inst.dst === 'A' || inst.src === 'A') flows.push({ id: 'mov-a', from: 'regfile', to: 'acc', label: 'Accumulator path', kind: 'data', active: true });
      control = inst.src === 'M' ? 'MEM RD' : inst.dst === 'M' ? 'MEM WR' : 'INT MOV';
      data = readRegister(prevCpu, inst.src);
    } else if (inst.mnemonic === 'MVI' || inst.mnemonic === 'LXI') {
      flows.push({ id: 'imm', from: 'decoder', to: inst.mnemonic === 'LXI' ? 'regfile' : inst.dst === 'M' ? 'memory' : 'regfile', label: `Immediate ${inst.mnemonic === 'LXI' ? h4(inst.data) : h2(inst.data)}H`, kind: 'data', active: true });
      control = inst.dst === 'M' ? 'MEM WR' : 'IMM LOAD';
      data = inst.data;
    } else {
      const memoryToCpu = ['LDA', 'LDAX', 'LHLD'].includes(inst.mnemonic);
      flows.push({ id: 'memx', from: memoryToCpu ? 'memory' : 'acc', to: memoryToCpu ? 'acc' : 'memory', label: trace?.busActivity?.[0] ?? 'Memory transfer', kind: 'data', active: true });
      flows.push({ id: 'memx-ctl', from: 'decoder', to: 'memory', label: memoryToCpu ? 'Read control' : 'Write control', kind: 'control', active: true });
      control = memoryToCpu ? 'MEM RD' : 'MEM WR';
      data = memoryToCpu ? readRegister(cpu, 'A') : prevCpu?.registers?.A ?? 0;
    }
  }

  if (mode === 'alu') {
    flows.push({ id: 'alu-operand-a', from: 'acc', to: 'alu', label: `A=${h2(trace?.regsBefore?.A ?? prevCpu?.registers?.A ?? 0)}H`, kind: 'data', active: true });
    if (inst.src || inst.data !== undefined) {
      const operand = inst.data !== undefined ? inst.data : readRegister(prevCpu, inst.src);
      flows.push({ id: 'alu-operand-b', from: inst.src === 'M' ? 'memory' : 'regfile', to: 'alu', label: `Operand=${h2(operand)}H`, kind: 'data', active: true });
      data = operand;
    }
    flows.push({ id: 'alu-result', from: 'alu', to: 'acc', label: `Result ${h2(cpu?.registers?.A ?? 0)}H`, kind: 'result', active: true });
    flows.push({ id: 'alu-flags', from: 'alu', to: 'flags', label: 'Flag update', kind: 'status', active: true });
    control = 'ALU EXEC';
  }

  if (mode === 'branch') {
    if (inst.cond) {
      flows.push({ id: 'branch-cond', from: 'flags', to: 'decoder', label: `${inst.cond}=${cpu?.flags?.[inst.cond] ?? 0}`, kind: 'status', active: true });
    }
    if (inst.mnemonic.startsWith('C') || inst.mnemonic.startsWith('R')) {
      flows.push({ id: 'branch-stack', from: inst.mnemonic.startsWith('C') ? 'pc' : 'stack', to: 'stack', label: trace?.stackActivity?.type === 'push' ? 'Push return address' : 'Restore return address', kind: 'stack', active: true });
    }
    flows.push({ id: 'branch-pc', from: 'decoder', to: 'pc', label: trace?.branchTaken ? `Load ${h4(trace.branchTarget)}H` : 'Sequential next', kind: 'control', active: true });
    control = trace?.branchTaken ? 'BRANCH TAKEN' : 'BRANCH TEST';
    data = trace?.branchTarget ?? cpu?.PC ?? 0;
  }

  if (mode === 'stack') {
    flows.push({ id: 'stack-sp', from: 'regfile', to: 'stack', label: `SP ${h4(cpu?.SP ?? 0)}H`, kind: 'stack', active: true });
    flows.push({ id: 'stack-move', from: inst.mnemonic === 'PUSH' ? 'regfile' : 'stack', to: inst.mnemonic === 'PUSH' ? 'stack' : 'regfile', label: `${inst.mnemonic} ${inst.rp}`, kind: 'stack', active: true });
    control = inst.mnemonic === 'PUSH' ? 'STACK WR' : 'STACK RD';
    data = trace?.stackActivity?.addr ?? cpu?.SP ?? 0;
  }

  if (mode === 'io') {
    flows.push({ id: 'io-flow', from: inst.mnemonic === 'IN' ? 'io' : 'acc', to: inst.mnemonic === 'IN' ? 'acc' : 'io', label: `${inst.mnemonic} ${h2(inst.port)}H`, kind: 'io', active: true });
    control = inst.mnemonic === 'IN' ? 'IO RD' : 'IO WR';
    data = inst.mnemonic === 'IN' ? (cpu?.registers?.A ?? 0) : (prevCpu?.registers?.A ?? 0);
  }

  return {
    flows,
    busState: {
      address: `${address}H`,
      data: typeof data === 'number' ? `${data <= 0xff ? h2(data) : h4(data)}H` : '--',
      control,
    },
  };
}

function deriveTiming(inst, trace) {
  if (!inst) {
    return {
      machineCycle: 'Idle',
      tStates: 0,
      stages: [
        { id: 'idle', label: 'Waiting', detail: 'Assemble and step through the program to animate cycles.', active: true },
      ],
    };
  }

  const info = INSTRUCTION_INFO[inst.mnemonic] ?? {};
  const mode = classifyInstruction(inst);
  const tStates = parseTStates(info.tstates, trace);
  const stages = [
    { id: 'fetch', label: 'Opcode Fetch', detail: `Address ${h4(inst.addr)}H placed on the bus and opcode latched.`, active: true },
    { id: 'decode', label: 'Decode', detail: `${inst.mnemonic} decoded into control lines.`, active: true },
  ];

  if (mode === 'memory') {
    stages.push({ id: 'mem', label: 'Memory Access', detail: trace?.busActivity?.[0] ?? 'Memory data transfer.', active: true });
  } else if (mode === 'stack') {
    stages.push({ id: 'stack', label: 'Stack Cycle', detail: trace?.busActivity?.[0] ?? 'Stack pointer drives memory transfer.', active: true });
  } else if (mode === 'branch') {
    stages.push({ id: 'branch', label: 'Branch Resolve', detail: trace?.branchTaken ? 'Condition satisfied; PC redirected.' : 'Condition failed; execution falls through.', active: true });
  } else if (mode === 'alu') {
    stages.push({ id: 'exec', label: 'ALU Execute', detail: 'Operands combine in the ALU and flags are refreshed.', active: true });
    stages.push({ id: 'write', label: 'Write Back', detail: 'Accumulator/register receives the ALU output.', active: true });
  } else if (mode === 'io') {
    stages.push({ id: 'io', label: 'I/O Cycle', detail: inst.mnemonic === 'IN' ? 'Peripheral drives data into A.' : 'Accumulator drives the selected port.', active: true });
  } else {
    stages.push({ id: 'write', label: 'Write Back', detail: 'Destination register or memory cell is updated.', active: true });
  }

  return {
    machineCycle: info.category ?? 'Control',
    tStates,
    stages,
  };
}

function deriveAlu(inst, prevCpu, cpu) {
  if (!inst) {
    return {
      active: false,
      title: 'No ALU activity yet',
      summary: 'Run or step an instruction to inspect bit-level arithmetic and flag reasoning.',
      operandA: 0,
      operandB: 0,
      result: 0,
      operation: 'Idle',
    };
  }

  const mode = classifyInstruction(inst);
  const isAluInstruction = mode === 'alu';
  const aBefore = prevCpu?.registers?.A ?? 0;
  const sourceValue = inst.data !== undefined ? inst.data : inst.src ? readRegister(prevCpu, inst.src) : 0;
  let operation = inst.mnemonic;
  let summary = 'This instruction does not route through the arithmetic/logic unit in a meaningful way.';
  let result = cpu?.registers?.A ?? aBefore;

  if (isAluInstruction) {
    summary = `${inst.mnemonic} combines A=${h2(aBefore)}H with ${inst.src ? `${inst.src}=${h2(sourceValue)}H` : `immediate=${h2(sourceValue)}H`} and then refreshes the flags.`;
    if (['INR', 'DCR'].includes(inst.mnemonic)) {
      result = inst.dst === 'M' ? (cpu?.memory?.[((cpu?.registers?.H ?? 0) << 8) | (cpu?.registers?.L ?? 0)] ?? 0) : (cpu?.registers?.[inst.dst] ?? 0);
      operation = `${inst.mnemonic} ${inst.dst}`;
      summary = `${inst.mnemonic} updates ${inst.dst} locally, but still recomputes Zero, Sign, Parity and Auxiliary Carry.`;
    }
    if (['CMP', 'CPI'].includes(inst.mnemonic)) {
      result = (aBefore - sourceValue) & 0xff;
      operation = 'Compare';
      summary = `Compare performs A - operand without storing the result, but the hidden subtraction still drives the flag register.`;
    }
    if (['ANA', 'ANI', 'ORA', 'ORI', 'XRA', 'XRI', 'CMA', 'CMC', 'STC', 'RLC', 'RRC', 'RAL', 'RAR'].includes(inst.mnemonic)) {
      operation = 'Logic / Rotate';
    }
  }

  return {
    active: isAluInstruction,
    title: isAluInstruction ? `${operation} datapath` : 'ALU standby',
    summary,
    operandA: aBefore,
    operandB: sourceValue,
    result,
    operation,
  };
}

function deriveNarrative(inst, trace, timing, changedFlags) {
  if (!inst) {
    return {
      headline: 'Assembler ready',
      story: 'Load a program, assemble it, then step through the machine to light up the architecture.',
      flagStory: 'Flags remain static until an instruction changes them.',
      nextHint: 'Try a data transfer, ALU and branch example to compare machine behavior.',
    };
  }

  const activity = trace?.busActivity?.join(' • ') || 'Instruction executed through the shared datapath.';
  const flagStory = changedFlags.length
    ? changedFlags.map(flag => `${flag.key}: ${flag.before} -> ${flag.after}`).join(' • ')
    : 'No flag changes on this step.';

  return {
    headline: `${inst.mnemonic} in ${timing.machineCycle.toLowerCase()} mode`,
    story: activity,
    flagStory,
    nextHint: trace?.branchTaken === true
      ? `Program flow jumps to ${h4(trace.branchTarget)}H on the next fetch.`
      : `Next fetch will continue from ${h4((inst.addr + inst.size) & 0xffff)}H unless another branch intervenes.`,
  };
}

export function deriveVisualizerModel({
  cpu,
  prevCpu,
  currentInst,
  lastTrace,
  history,
  ports,
  currentIdx,
  isRunning,
}) {
  const changedFlags = getChangedFlags(prevCpu, cpu);
  const changedRegisters = getChangedRegisters(lastTrace, cpu);
  const memoryChanges = getMemoryChanges(lastTrace);
  const { flows, busState } = deriveBusActivity(currentInst, lastTrace, prevCpu, cpu);
  const timing = deriveTiming(currentInst, lastTrace);
  const alu = deriveAlu(currentInst, prevCpu, cpu);
  const narrative = deriveNarrative(currentInst, lastTrace, timing, changedFlags);
  const category = classifyInstruction(currentInst);

  const activeEntityIds = new Set(['pc', 'memory', 'ir', 'decoder', 'timing']);
  if (category === 'alu') ['acc', 'alu', 'flags', 'regfile'].forEach(id => activeEntityIds.add(id));
  if (category === 'branch') ['flags', 'pc'].forEach(id => activeEntityIds.add(id));
  if (category === 'stack') ['stack', 'regfile'].forEach(id => activeEntityIds.add(id));
  if (category === 'io') ['io', 'acc'].forEach(id => activeEntityIds.add(id));
  if (category === 'memory' || category === 'transfer') ['regfile', 'acc'].forEach(id => activeEntityIds.add(id));

  const entities = BASE_ENTITIES.map(entity => {
    let value = '';
    if (entity.id === 'pc') value = `${h4(cpu?.PC)}H`;
    if (entity.id === 'ir') value = currentInst?.mnemonic ?? '--';
    if (entity.id === 'acc') value = `${h2(cpu?.registers?.A)}H`;
    if (entity.id === 'flags') value = ['Z', 'S', 'P', 'CY', 'AC'].map(key => `${key}${cpu?.flags?.[key] ?? 0}`).join(' ');
    if (entity.id === 'stack') value = `SP ${h4(cpu?.SP)}H`;
    if (entity.id === 'io') value = `P0 ${h2(ports?.[0] ?? 0)}H`;
    if (entity.id === 'regfile') value = `B ${h2(cpu?.registers?.B)} C ${h2(cpu?.registers?.C)} H ${h2(cpu?.registers?.H)} L ${h2(cpu?.registers?.L)}`;
    if (entity.id === 'memory') value = currentInst ? `@ ${h4(currentInst.addr)}H` : '64K';
    if (entity.id === 'timing') value = `${timing.tStates} T`;
    if (entity.id === 'decoder') value = INSTRUCTION_INFO[currentInst?.mnemonic]?.category ?? 'Idle';
    if (entity.id === 'alu' && alu.active) value = `${alu.operation}`;
    return {
      ...entity,
      active: activeEntityIds.has(entity.id),
      value,
    };
  });

  const changedState = {
    flags: changedFlags,
    registers: changedRegisters,
    memory: memoryChanges.map(change => ({
      addr: change.addr,
      before: prevCpu?.memory?.[change.addr] ?? 0,
      after: change.val ?? 0,
    })),
  };

  const lastSnapshot = history?.[history.length - 1] ?? null;

  return {
    entities,
    relationships: flows,
    states: changedState,
    transitions: timing.stages,
    steps: timing.stages,
    flows,
    inspectionCopy: narrative,
    controls: {
      playPauseLabel: isRunning ? 'Pause' : 'Run',
      canStepBack: history?.length > 0,
      currentStep: currentIdx + 1,
    },
    busState,
    alu,
    timing,
    currentInst,
    lastTrace,
    historySnapshot: lastSnapshot,
  };
}

export const visualizerFormatters = { h2, h4, b8 };
