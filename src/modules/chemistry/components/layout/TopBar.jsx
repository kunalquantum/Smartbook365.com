import { Link } from 'react-router-dom';

export default function TopBar({ onMenuClick, onReset }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center',
            padding: '0 16px', height: 46,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg2)',
            gap: 12, flexShrink: 0,
        }}>
            <button 
                onClick={onMenuClick} 
                className="menu-btn"
                style={{
                    background: 'none', border: 'none',
                    color: 'var(--gold)', fontSize: 18,
                    padding: '4px 6px',
                    display: 'none',
                }}
            >☰</button>

            <Link to="/" style={{ 
                textDecoration: 'none', 
                color: 'var(--gold)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                fontSize: '11px',
                fontWeight: '600',
                paddingRight: '12px',
                borderRight: '1px solid var(--border)'
            }}>
                <span>←</span> HOME
            </Link>

            <span className="module-title" style={{
                fontFamily: 'var(--mono)', fontSize: 10,
                color: 'var(--text3)', letterSpacing: '1.5px',
            }}>
                MAHARASHTRA · HSC · CHEMISTRY XI
            </span>

            <div style={{ flex: 1 }} />

            <button 
                onClick={onReset} 
                className="reset-btn"
                style={{
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

            <style>{`
                @media (max-width: 768px) {
                    .menu-btn {
                        display: block !important;
                    }
                    .module-title {
                        display: none !important;
                    }
                    .reset-btn {
                        padding: 4px 8px !important;
                        font-size: 10px !important;
                    }
                }
            `}</style>
        </div>
    )
}