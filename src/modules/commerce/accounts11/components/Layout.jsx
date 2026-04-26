import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const BASE = '/commerce/accounts/11th';
const NAV = [
  { path: BASE + '', label: 'Home', icon: '⬡', color: '#7c6af7' },
  { path: BASE + '/financial-statements', label: 'Financial Statements', icon: '📊', color: '#f0b429', short: 'Fin. Stmt' },
  { path: BASE + '/adjustments', label: 'Adjustments', icon: '⚙️', color: '#14b8a6', short: 'Adjust' },
  { path: BASE + '/depreciation', label: 'Depreciation', icon: '📉', color: '#f43f5e', short: 'Deprec.' },
  { path: BASE + '/bills-of-exchange', label: 'Bills of Exchange', icon: '📜', color: '#3b82f6', short: 'Bills' },
  { path: BASE + '/consignment', label: 'Consignment', icon: '📦', color: '#f97316', short: 'Consign.' },
  { path: BASE + '/joint-venture', label: 'Joint Venture', icon: '🤝', color: '#10b981', short: 'JV' },
  { path: BASE + '/npo', label: 'Not-for-Profit Orgs', icon: '🏛️', color: '#a78bfa', short: 'NPO' },
  { path: BASE + '/partnership', label: 'Partnership', icon: '👥', color: '#fcd34d', short: 'Partner' },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240,
        minHeight: '100vh',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'sticky',
        top: 0,
        flexShrink: 0,
        zIndex: 100,
        overflow: 'hidden'
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '24px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          justifyContent: collapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent), var(--gold))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
            boxShadow: '0 0 16px rgba(124,106,247,0.5)'
          }}>A</div>
          {!collapsed && (
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>ANIMAARF</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>12TH ACCOUNTING</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
          {NAV.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '12px' : '10px 16px',
                  margin: '2px 8px',
                  borderRadius: 10,
                  background: active ? `${item.color}18` : 'transparent',
                  border: active ? `1px solid ${item.color}40` : '1px solid transparent',
                  color: active ? item.color : 'var(--text2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  position: 'relative',
                }}>
                  {active && (
                    <div style={{
                      position: 'absolute', left: -8, top: '50%', transform: 'translateY(-50%)',
                      width: 3, height: '60%', background: item.color, borderRadius: 2,
                      boxShadow: `0 0 8px ${item.color}`
                    }} />
                  )}
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && (
                    <span style={{
                      fontSize: 13, fontWeight: active ? 600 : 400,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            margin: '12px 8px',
            padding: '10px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text2)',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {collapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, minWidth: 0, overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
