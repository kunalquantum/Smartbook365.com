import s from './PlayBar.module.css';

export default function PlayBar({ runner, accent = 'var(--cyan)' }) {
  const { playing, done, idx, total, speed,
    play, pause, reset, stepForward, stepBack, updateSpeed, canForward, canBack } = runner;

  const pct = total > 1 ? (idx / (total - 1)) * 100 : 0;

  return (
    <div className={s.bar}>
      {/* Transport */}
      <div className={s.transport}>
        <button className={s.tbtn} onClick={reset} title="Reset">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 6a5 5 0 1 0 5-5V3L3 1l2-2v2A6 6 0 1 1 0 6z" fill="currentColor"/>
          </svg>
        </button>
        <button className={s.tbtn} onClick={stepBack} disabled={!canBack} title="Step back">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="1" y="1" width="2" height="10" rx="1" fill="currentColor"/>
            <path d="M11 1L5 6l6 5V1z" fill="currentColor"/>
          </svg>
        </button>

        <button
          className={`${s.tbtn} ${s.playBtn}`}
          onClick={playing ? pause : play}
          style={{ '--accent': accent }}
          title={playing ? 'Pause' : 'Play'}
        >
          {playing
            ? <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><rect x="0" y="0" width="3" height="12" rx="1" fill="currentColor"/><rect x="7" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>
            : <svg width="11" height="12" viewBox="0 0 11 12" fill="none"><path d="M1 1l9 5-9 5V1z" fill="currentColor"/></svg>
          }
        </button>

        <button className={s.tbtn} onClick={stepForward} disabled={!canForward} title="Step forward">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="9" y="1" width="2" height="10" rx="1" fill="currentColor"/>
            <path d="M1 1l6 5-6 5V1z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Scrubber */}
      <div className={s.scrubWrap}>
        <input
          type="range"
          className={s.scrubber}
          min={0}
          max={Math.max(total - 1, 1)}
          value={Math.max(idx, 0)}
          onChange={e => runner.goTo(parseInt(e.target.value))}
          style={{ '--pct': pct + '%', '--accent': accent }}
        />
      </div>

      {/* Step counter */}
      <div className={s.counter} style={{ '--accent': accent }}>
        {done
          ? <span style={{ color: 'var(--green)', fontSize: '0.65rem', fontWeight: 700 }}>✓ Done</span>
          : idx < 0
            ? <span style={{ color: 'var(--t4)', fontSize: '0.65rem' }}>Not started</span>
            : <span>{idx + 1} <span style={{ color: 'var(--t4)' }}>/ {total}</span></span>
        }
      </div>

      {/* Speed */}
      <div className={s.speedWrap}>
        <span className={s.speedLabel}>Speed</span>
        <input
          type="range" min={80} max={1200} value={1280 - speed}
          className={s.speedRange}
          style={{ '--accent': accent }}
          onChange={e => updateSpeed(1280 - parseInt(e.target.value))}
        />
        <span className={s.speedVal} style={{ color: accent }}>
          {speed < 200 ? 'Fast' : speed > 700 ? 'Slow' : 'Med'}
        </span>
      </div>
    </div>
  );
}
