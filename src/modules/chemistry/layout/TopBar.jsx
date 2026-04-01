export default function TopBar({ onMenuClick, onReset }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            padding: '0 16px', height: 46,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)',
            gap: 12, flexShrink: 0,
        }}>
            <button onClick={onMenuClick} style={{
                background: 'none', border: 'none',
                color: 'var(--gold)', fontSize: 18,
                padding: '4px 6px',
            }}>☰</button>

            <span style={{
                fontFamily: 'var(--mono)', fontSize: 10,
                color: 'var(--text3)', letterSpacing: '1.5px',
            }}>
                MAHARASHTRA · HSC · CHEMISTRY XI
            </span>

            <div style={{ flex: 1 }} />

            <button onClick={onReset} style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text3)', fontSize: 11,
                padding: '4px 12px', borderRadius: 6,
                fontFamily: 'var(--mono)',
                transition: 'color 0.15s',
            }}
                onMouseEnter={e => e.target.style.color = 'var(--coral)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}
            >
                reset
            </button>
        </div>
    )
}