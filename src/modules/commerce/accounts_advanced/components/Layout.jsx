import { Outlet, NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Layout.css'

const BASE = '/commerce/accounts/advanced'
const NAV = [
  { path: BASE + '', label: 'Home', icon: '⬡', color: '#a78bfa' },
  { path: BASE + '/financial-statements', label: 'Financial Statements', icon: '📊', color: '#00e5ff' },
  { path: BASE + '/ratio-analysis', label: 'Ratio Analysis', icon: '⚖️', color: '#10b981' },
  { path: BASE + '/cash-flow', label: 'Cash Flow', icon: '💧', color: '#38bdf8' },
  { path: BASE + '/cost-accounting', label: 'Cost Accounting', icon: '🏗️', color: '#fbbf24' },
  { path: BASE + '/marginal-costing', label: 'Marginal Costing', icon: '📈', color: '#f0abfc' },
  { path: BASE + '/budgeting', label: 'Budgeting', icon: '🎯', color: '#f43f5e' },
  { path: BASE + '/standard-costing', label: 'Standard Costing', icon: '📐', color: '#fb923c' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  return (
    <div className="layout">
      <nav className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-mark">A</span>
            <span className="logo-text">nimaarf</span>
          </div>
          <span className="logo-sub">Accounting Simulator</span>
        </div>
        <ul className="nav-list">
          {NAV.map(n => (
            <li key={n.path}>
              <NavLink
                to={n.path || BASE}
                end={n.path === BASE + ''}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={({ isActive }) => isActive ? { '--accent': n.color } : {}}
                onClick={() => setOpen(false)}
              >
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
                <span className="nav-dot" style={{ background: n.color }} />
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <span className="mono" style={{ fontSize: 11, color: 'var(--ink3)' }}>Advanced Accounting & Costing</span>
        </div>
      </nav>
      <button className="menu-toggle" onClick={() => setOpen(o => !o)}>
        <span /><span /><span />
      </button>
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}
