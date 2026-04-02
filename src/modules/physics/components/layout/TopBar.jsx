import { Link } from 'react-router-dom';

export default function TopBar({ onMenuClick, onReset }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            padding: '0 16px', height: 48,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)',
            gap: 12,
        }}>
            <button
                onClick={onMenuClick}
                style={{
                    background: 'none', border: 'none',
                    color: 'var(--amber)', fontSize: 18, padding: '4px 6px',
                    display: 'none',
                }}
                className="menu-btn"
            >
                ☰
            </button>
            <Link to="/" style={{ 
                textDecoration: 'none', 
                color: 'var(--amber)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontSize: '12px',
                fontWeight: '600',
                paddingRight: '12px',
                borderRight: '1px solid var(--border)'
            }}>
                <span>←</span> HOME
            </Link>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text3)', letterSpacing: '1.5px' }}>
                MAHARASHTRA · HSC · PHYSICS XI
            </span>
            <div style={{ flex: 1 }} />
            <button
                onClick={onReset}
                style={{
                    background: 'none', border: '1px solid var(--border)',
                    color: 'var(--text3)', fontSize: 12, padding: '4px 12px',
                    borderRadius: 6, fontFamily: 'var(--mono)',
                    transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--coral)'}
                onMouseLeave={e => e.target.style.color = 'var(--text3)'}
            >
                reset
            </button>
        </div>
    )
}