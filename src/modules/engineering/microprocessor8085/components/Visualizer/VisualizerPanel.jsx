import { useEffect, useMemo, useState } from 'react';
import { deriveVisualizerModel, visualizerFormatters } from '../../core/visualizerModel';

const { h2, h4, b8 } = visualizerFormatters;

const FLOW_COLORS = {
  fetch: '#60A5FA',
  control: '#FBBF24',
  data: '#00E5A0',
  result: '#F472B6',
  status: '#A78BFA',
  stack: '#FB923C',
  io: '#38BDF8',
};

function panel(theme) {
  return {
    background: theme.bgCell,
    border: `1px solid ${theme.border}`,
    borderRadius: 12,
    boxShadow: '0 14px 40px rgba(0,0,0,0.22)',
  };
}

function SectionTitle({ theme, title, kicker, extra }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 10 }}>
      <div>
        <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.16em', color: theme.accent }}>{kicker}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: theme.textPrimary }}>{title}</div>
      </div>
      {extra}
    </div>
  );
}

function ArchitectureView({ model, selectedId, setSelectedId, theme }) {
  const entityMap = new Map(model.entities.map(entity => [entity.id, entity]));
  const edgePoint = (entity, side = 'center') => {
    if (!entity) return { x: 0, y: 0 };
    if (side === 'left') return { x: entity.x, y: entity.y + entity.h / 2 };
    if (side === 'right') return { x: entity.x + entity.w, y: entity.y + entity.h / 2 };
    return { x: entity.x + entity.w / 2, y: entity.y + entity.h / 2 };
  };

  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle
        theme={theme}
        kicker="2D TEACHING VIEW"
        title="Architecture map"
        extra={<span style={{ fontFamily: theme.mono, fontSize: 10, color: theme.textDim }}>{model.currentInst?.mnemonic ?? 'IDLE'}</span>}
      />
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: 320, display: 'block' }}>
        <defs>
          <linearGradient id="activeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={theme.accent} stopOpacity="0.65" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {model.relationships.map(flow => {
          const from = entityMap.get(flow.from);
          const to = entityMap.get(flow.to);
          const start = edgePoint(from, from?.x < to?.x ? 'right' : 'left');
          const end = edgePoint(to, from?.x < to?.x ? 'left' : 'right');
          const cx = (start.x + end.x) / 2;
          const stroke = FLOW_COLORS[flow.kind] ?? theme.accent;
          return (
            <g key={flow.id} opacity={flow.active ? 1 : 0.28}>
              <path
                d={`M ${start.x} ${start.y} C ${cx} ${start.y}, ${cx} ${end.y}, ${end.x} ${end.y}`}
                fill="none"
                stroke={stroke}
                strokeWidth={flow.active ? 2.7 : 1.2}
                strokeDasharray={flow.kind === 'control' ? '5 4' : undefined}
                style={{ filter: flow.active ? `drop-shadow(0 0 8px ${stroke})` : 'none' }}
              />
            </g>
          );
        })}

        {model.entities.map(entity => {
          const selected = selectedId === entity.id;
          return (
            <g key={entity.id} onClick={() => setSelectedId(entity.id)} style={{ cursor: 'pointer' }}>
              <rect
                x={entity.x}
                y={entity.y}
                width={entity.w}
                height={entity.h}
                rx="4"
                fill={entity.active ? 'url(#activeGlow)' : theme.bgPanel}
                stroke={selected ? theme.tokHex : entity.active ? theme.accent : theme.border}
                strokeWidth={selected ? 1.8 : 1.2}
              />
              <text x={entity.x + 2.2} y={entity.y + 4.8} fill={entity.active ? '#081016' : theme.textPrimary} style={{ fontSize: 3.5, fontWeight: 800, letterSpacing: '0.08em' }}>
                {entity.short}
              </text>
              <text x={entity.x + 2.2} y={entity.y + entity.h - 2.5} fill={entity.active ? '#081016' : theme.textDim} style={{ fontSize: 2.2 }}>
                {entity.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function DepthView({ model, selectedId, setSelectedId, theme }) {
  const layers = ['control', 'datapath', 'external'];
  const layerLabels = {
    control: 'Control plane',
    datapath: 'Datapath plane',
    external: 'Memory / I-O plane',
  };

  return (
    <div style={{ ...panel(theme), padding: 14, minHeight: 360 }}>
      <SectionTitle
        theme={theme}
        kicker="DEPTH VIEW"
        title="Spatial signal deck"
        extra={<span style={{ fontFamily: theme.mono, fontSize: 10, color: theme.textDim }}>{model.timing.machineCycle}</span>}
      />
      <div style={{ perspective: 1400, height: 320, position: 'relative', overflow: 'auto', paddingTop: 4 }}>
        {layers.map((layer, index) => {
          const items = model.entities.filter(entity => entity.group === layer);
          return (
            <div
              key={layer}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${index * 74}px`,
                minHeight: 112,
                borderRadius: 18,
                border: `1px solid ${theme.border}`,
                background: index === 0 ? 'rgba(96,165,250,0.08)' : index === 1 ? 'rgba(0,229,160,0.08)' : 'rgba(251,146,60,0.08)',
                transform: `rotateX(18deg) translateY(${index * 2}px) translateZ(${index * 6}px)`,
                transformOrigin: 'center top',
                transformStyle: 'preserve-3d',
                padding: '12px 14px 14px',
                boxShadow: `0 ${12 + index * 4}px ${28 + index * 8}px rgba(0,0,0,0.22)`,
              }}
            >
              <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.12em', color: theme.textMuted, marginBottom: 8 }}>{layerLabels[layer]}</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {items.map(entity => {
                  const selected = entity.id === selectedId;
                  return (
                    <button
                      key={entity.id}
                      onClick={() => setSelectedId(entity.id)}
                      style={{
                        appearance: 'none',
                        border: `1px solid ${selected ? theme.tokHex : entity.active ? theme.accent : theme.border}`,
                        background: entity.active ? 'rgba(0,229,160,0.16)' : theme.bgPanel,
                        color: theme.textPrimary,
                        minWidth: 102,
                        textAlign: 'left',
                        borderRadius: 12,
                        padding: '10px 12px',
                        transform: `translateZ(${entity.depth * 6}px)`,
                        boxShadow: entity.active ? `0 0 18px rgba(0,229,160,0.14)` : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontFamily: theme.mono, fontSize: 10, color: entity.active ? theme.accent : theme.textMuted }}>{entity.short}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{entity.label}</div>
                      <div style={{ fontFamily: theme.mono, fontSize: 10, color: theme.textDim, marginTop: 6 }}>{entity.value}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Inspector({ model, selectedId, theme }) {
  const selected = model.entities.find(entity => entity.id === selectedId) ?? model.entities[0];
  const inbound = model.relationships.filter(flow => flow.to === selected.id);
  const outbound = model.relationships.filter(flow => flow.from === selected.id);

  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle theme={theme} kicker="INSPECTOR" title={selected.label} />
      <div style={{ color: theme.textDim, lineHeight: 1.5, fontSize: 13 }}>{selected.description}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: theme.mono, fontSize: 10, border: `1px solid ${theme.border}`, borderRadius: 999, padding: '5px 9px', color: theme.textPrimary }}>
          VALUE {selected.value || '--'}
        </span>
        <span style={{ fontFamily: theme.mono, fontSize: 10, border: `1px solid ${selected.active ? theme.accent : theme.border}`, borderRadius: 999, padding: '5px 9px', color: selected.active ? theme.accent : theme.textMuted }}>
          {selected.active ? 'ACTIVE THIS STEP' : 'IDLE THIS STEP'}
        </span>
      </div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.12em', color: theme.textMuted, marginBottom: 6 }}>INBOUND</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(inbound.length ? inbound : [{ id: 'none-in', label: 'No inbound activity' }]).map(flow => (
              <div key={flow.id} style={{ padding: '8px 10px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}`, fontSize: 12, color: theme.textDim }}>
                {flow.label}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 9, letterSpacing: '0.12em', color: theme.textMuted, marginBottom: 6 }}>OUTBOUND</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(outbound.length ? outbound : [{ id: 'none-out', label: 'No outbound activity' }]).map(flow => (
              <div key={flow.id} style={{ padding: '8px 10px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}`, fontSize: 12, color: theme.textDim }}>
                {flow.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowLane({ model, theme }) {
  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle
        theme={theme}
        kicker="BUS FLOW"
        title="Address, data and control"
        extra={
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              ['ADDR', model.busState.address],
              ['DATA', model.busState.data],
              ['CTRL', model.busState.control],
            ].map(([label, value]) => (
              <span key={label} style={{ fontFamily: theme.mono, fontSize: 10, color: theme.textPrimary, border: `1px solid ${theme.border}`, borderRadius: 999, padding: '5px 9px' }}>
                {label} {value}
              </span>
            ))}
          </div>
        }
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {model.flows.map(flow => (
            <div
              key={flow.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gap: 8,
                alignItems: 'center',
                padding: '8px 10px',
                borderRadius: 10,
                border: `1px solid ${theme.border}`,
                background: theme.bgPanel,
              }}
            >
              <span style={{ fontFamily: theme.mono, fontSize: 10, color: FLOW_COLORS[flow.kind] ?? theme.accent }}>{flow.kind.toUpperCase()}</span>
              <span style={{ fontSize: 12, color: theme.textDim }}>{flow.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em', marginBottom: 6 }}>CURRENT STORY</div>
            <div style={{ color: theme.textPrimary, lineHeight: 1.55, fontSize: 13 }}>{model.inspectionCopy.story}</div>
          </div>
          <div style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em', marginBottom: 6 }}>NEXT FETCH</div>
            <div style={{ color: theme.textDim, lineHeight: 1.55, fontSize: 13 }}>{model.inspectionCopy.nextHint}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AluInspector({ model, theme }) {
  const flagRows = model.states.flags.length ? model.states.flags : [
    { key: 'Z', before: null, after: null },
  ];

  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle theme={theme} kicker="ALU / FLAGS" title={model.alu.title} />
      <div style={{ color: theme.textDim, lineHeight: 1.55, fontSize: 13, marginBottom: 12 }}>{model.alu.summary}</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
        {[
          ['OPERAND A', model.alu.operandA],
          ['OPERAND B', model.alu.operandB],
          ['RESULT', model.alu.result],
        ].map(([label, value]) => (
          <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em' }}>{label}</div>
            <div style={{ fontFamily: theme.mono, fontSize: 18, fontWeight: 700, color: theme.textPrimary, marginTop: 4 }}>{h2(value)}H</div>
            <div style={{ fontFamily: theme.mono, fontSize: 10, color: theme.accent, marginTop: 6 }}>{b8(value)}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em', marginBottom: 8 }}>FLAG CHANGES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {flagRows.map(flag => (
              <div key={flag.key} style={{ minWidth: 82, padding: '8px 10px', borderRadius: 10, border: `1px solid ${theme.border}`, background: flag.before !== flag.after && flag.before !== null ? 'rgba(167,139,250,0.12)' : theme.bgCell }}>
                <div style={{ fontFamily: theme.mono, fontSize: 10, color: theme.textPrimary }}>{flag.key}</div>
                <div style={{ fontFamily: theme.mono, fontSize: 12, color: theme.textDim, marginTop: 4 }}>
                  {flag.before === null ? 'unchanged' : `${flag.before} -> ${flag.after}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em', marginBottom: 8 }}>REGISTER DELTAS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(model.states.registers.length ? model.states.registers : [{ reg: 'NONE', before: 0, after: 0 }]).map(row => (
              <div key={row.reg} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: theme.mono, fontSize: 11, color: theme.textDim }}>
                <span>{row.reg}</span>
                <span style={{ color: theme.textPrimary }}>{row.reg === 'NONE' ? 'No register write-back' : `${h2(row.before)}H -> ${h2(row.after)}H`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimingPanel({ model, theme }) {
  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle
        theme={theme}
        kicker="TIMING"
        title={`${model.timing.machineCycle} timing`}
        extra={<span style={{ fontFamily: theme.mono, fontSize: 11, color: theme.accent }}>{model.timing.tStates} T-states</span>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${model.timing.stages.length}, minmax(0, 1fr))`, gap: 10 }}>
        {model.timing.stages.map((stage, index) => (
          <div key={stage.id} style={{ padding: '12px 12px 14px', borderRadius: 12, background: index === model.timing.stages.length - 1 ? 'rgba(0,229,160,0.12)' : theme.bgPanel, border: `1px solid ${index === model.timing.stages.length - 1 ? theme.accent : theme.border}` }}>
            <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em' }}>T{index + 1}</div>
            <div style={{ marginTop: 6, fontSize: 14, fontWeight: 700, color: theme.textPrimary }}>{stage.label}</div>
            <div style={{ marginTop: 6, fontSize: 12, lineHeight: 1.5, color: theme.textDim }}>{stage.detail}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}`, color: theme.textDim, lineHeight: 1.55, fontSize: 13 }}>
        {model.inspectionCopy.headline}. {model.inspectionCopy.flagStory}
      </div>
    </div>
  );
}

function ComparePanel({ model, theme }) {
  const snapshot = model.historySnapshot;
  const before = snapshot?.before;
  const after = snapshot?.after;

  return (
    <div style={{ ...panel(theme), padding: 14 }}>
      <SectionTitle theme={theme} kicker="BEFORE / AFTER" title="Execution delta" />
      {!snapshot && <div style={{ color: theme.textDim, fontSize: 13 }}>Step an instruction to capture a compare snapshot.</div>}
      {snapshot && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            ['PC', before?.PC ?? 0, after?.PC ?? 0, value => h4(value)],
            ['SP', before?.SP ?? 0, after?.SP ?? 0, value => h4(value)],
            ['A', before?.registers?.A ?? 0, after?.registers?.A ?? 0, value => h2(value)],
          ].map(([label, prev, next, formatter]) => (
            <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
              <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted }}>{label}</div>
              <div style={{ marginTop: 6, fontFamily: theme.mono, fontSize: 12, color: theme.textPrimary }}>{formatter(prev)}H</div>
              <div style={{ marginTop: 4, fontFamily: theme.mono, fontSize: 12, color: theme.accent }}>{formatter(next)}H</div>
            </div>
          ))}
        </div>
      )}
      {snapshot && model.states.memory.length > 0 && (
        <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10, background: theme.bgPanel, border: `1px solid ${theme.border}` }}>
          <div style={{ fontFamily: theme.mono, fontSize: 9, color: theme.textMuted, letterSpacing: '0.12em', marginBottom: 8 }}>MEMORY TOUCHES</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {model.states.memory.map(cell => (
              <div key={cell.addr} style={{ padding: '7px 9px', borderRadius: 10, border: `1px solid ${theme.border}`, fontFamily: theme.mono, fontSize: 11, color: theme.textPrimary }}>
                {h4(cell.addr)}H: {h2(cell.before)}H &rarr; {h2(cell.after)}H
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VisualizerPanel({
  cpu,
  prevCpu,
  currentInst,
  lastTrace,
  history,
  ports,
  currentIdx,
  isRunning,
  theme,
}) {
  const [selectedId, setSelectedId] = useState('decoder');
  const [mode, setMode] = useState('beginner');

  const model = useMemo(() => deriveVisualizerModel({
    cpu,
    prevCpu,
    currentInst,
    lastTrace,
    history,
    ports,
    currentIdx,
    isRunning,
  }), [cpu, prevCpu, currentInst, lastTrace, history, ports, currentIdx, isRunning]);

  useEffect(() => {
    const active = model.entities.find(entity => entity.active);
    if (active) setSelectedId(active.id);
  }, [model.currentInst?.mnemonic, model.busState.control]);

  return (
    <div style={{ flex: 1, overflow: 'auto', padding: 14, background: theme.bgPanel }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: theme.mono, fontSize: 10, letterSpacing: '0.18em', color: theme.accent }}>INTERACTIVE VISUALIZER</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.textPrimary, marginTop: 4 }}>
            {model.currentInst ? `${model.currentInst.mnemonic} at ${h4(model.currentInst.addr)}H` : 'Shared concept model ready'}
          </div>
          <div style={{ fontSize: 13, color: theme.textDim, marginTop: 6, maxWidth: 880 }}>{model.inspectionCopy.story}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['beginner', 'expert'].map(value => (
            <button
              key={value}
              onClick={() => setMode(value)}
              style={{
                appearance: 'none',
                border: `1px solid ${mode === value ? theme.accent : theme.border}`,
                background: mode === value ? theme.accentDim : theme.bgCell,
                color: mode === value ? theme.accent : theme.textDim,
                borderRadius: 999,
                fontFamily: theme.mono,
                fontSize: 10,
                letterSpacing: '0.12em',
                padding: '7px 11px',
                cursor: 'pointer',
              }}
            >
              {value.toUpperCase()}
            </button>
          ))}
          <span style={{ fontFamily: theme.mono, fontSize: 10, border: `1px solid ${theme.border}`, borderRadius: 999, padding: '7px 11px', color: theme.textPrimary }}>
            STEP {Math.max(0, currentIdx + 1)}
          </span>
          <span style={{ fontFamily: theme.mono, fontSize: 10, border: `1px solid ${isRunning ? theme.accent : theme.border}`, borderRadius: 999, padding: '7px 11px', color: isRunning ? theme.accent : theme.textMuted }}>
            {model.controls.playPauseLabel.toUpperCase()}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 14 }}>
        <ArchitectureView model={model} selectedId={selectedId} setSelectedId={setSelectedId} theme={theme} />
        <DepthView model={model} selectedId={selectedId} setSelectedId={setSelectedId} theme={theme} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mode === 'expert' ? '0.95fr 1.05fr' : '1fr', gap: 14, marginTop: 14 }}>
        <Inspector model={model} selectedId={selectedId} theme={theme} />
        {mode === 'expert' && <ComparePanel model={model} theme={theme} />}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 14, marginTop: 14 }}>
        <FlowLane model={model} theme={theme} />
        <AluInspector model={model} theme={theme} />
      </div>

      <div style={{ marginTop: 14 }}>
        <TimingPanel model={model} theme={theme} />
      </div>
    </div>
  );
}
