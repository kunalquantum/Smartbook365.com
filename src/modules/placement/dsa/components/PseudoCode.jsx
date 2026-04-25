import s from './PseudoCode.module.css';

export default function PseudoCode({ lines, activeLine, accent = 'var(--cyan)' }) {
  return (
    <div className={s.panel}>
      <div className={s.title}>
        <span>Pseudocode</span>
      </div>
      <div className={s.code}>
        {lines.map((line, i) => {
          const isActive = i === activeLine;
          const lineNum = String(i + 1).padStart(2, ' ');
          return (
            <div
              key={i}
              className={`${s.line} ${isActive ? s.active : ''}`}
              style={isActive ? { '--accent': accent } : {}}
            >
              <span className={s.lineNum}>{lineNum}</span>
              <span className={s.lineText}>{line}</span>
              {isActive && <span className={s.cursor} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
