import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import s from './Layout.module.css';

const NAV = [
  { to: '.', label: 'Home', icon: '⌂', exact: true, color: '#566070' },
  { to: 'arrays', label: 'Arrays & Strings', icon: '▤', color: '#00c8e8', tag: '4 viz' },
  { to: 'sorting', label: 'Sorting & Search', icon: '↕', color: '#8b5cf6', tag: '3 viz' },
  { to: 'trees', label: 'Trees & BST', icon: '⊛', color: '#22d47a', tag: '1 viz' },
  { to: 'linked-list', label: 'Linked Lists', icon: '⟳', color: '#f05060', tag: '1 viz' },
  { to: 'stacks', label: 'Stacks & Queues', icon: '⊟', color: '#e879a0', tag: '1 viz' },
  { to: 'graphs', label: 'Graphs', icon: '◈', color: '#f5a623', tag: '4 viz' },
];

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={s.shell}>
      <aside className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`}>
        <div className={s.sidebarTop}>
          <div className={s.logo}>
            <div className={s.logoMark}>⧖</div>
            {!collapsed && <div className={s.logoText}>DSA<span>Viz</span></div>}
          </div>
          <button className={s.collapseBtn} onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d={collapsed ? 'M3 2l4 3-4 3' : 'M7 2L3 5l4 3'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <button 
          onClick={() => navigate('/domains/software-placement')}
          style={{
            margin: '0 12px 12px',
            padding: '8px',
            background: 'rgba(244, 114, 182, 0.1)',
            border: '1px solid rgba(244, 114, 182, 0.2)',
            borderRadius: '6px',
            color: '#f472b6',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}
        >
          <span>◀</span> {!collapsed && 'BACK TO PLACEMENT'}
        </button>

        <nav className={s.nav}>
          {NAV.map(({ to, label, icon, color, exact, tag }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => `${s.navItem} ${isActive ? s.active : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span className={s.navIcon} style={{ color: isActive ? color : undefined }}>{icon}</span>
                  {!collapsed && (
                    <>
                      <span className={s.navLabel} style={{ color: isActive ? color : undefined }}>{label}</span>
                      {tag && !isActive && <span className={s.navTag}>{tag}</span>}
                      {isActive && <div className={s.activeBar} style={{ background: color }} />}
                    </>
                  )}
                  {isActive && collapsed && <div className={s.activeBarCollapsed} style={{ background: color }} />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className={s.sidebarFooter}>
            <div className={s.footerBadge}>
              <span className={s.footerDot} />
              <span>Play · Step · Scrub · Custom Data</span>
            </div>
          </div>
        )}
      </aside>

      <main className={s.main}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={s.pageWrap}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
