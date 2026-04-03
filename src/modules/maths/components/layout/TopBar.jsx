import React from 'react';
import { motion } from 'framer-motion';
import { Book, Cpu, Beaker, FileText, Home, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TopBar = ({ activeChapter, onMenuClick }) => {
  return (
    <div className="glass-panel" style={{
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      borderRadius: 0,
      zIndex: 10,
      height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onMenuClick}
          className="mobile-menu-btn"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            width: '40px', height: '40px',
            borderRadius: '12px',
            display: 'none', alignItems: 'center', justifyContent: 'center',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <Menu size={20} />
        </button>

        <Link to="/" className="home-btn" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '40px', height: '40px',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--primary)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          textDecoration: 'none'
        }}>
          <Home size={20} />
        </Link>
        <div className="math-logo" style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          width: '40px', height: '40px',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
        }}>
          <span style={{ fontFamily: 'Fira Code', fontWeight: 700, fontSize: '1.2rem' }}>∑</span>
        </div>
        <h2 className="math-title" style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.5px' }}>Maths 11 Lab</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="beta-badge" style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '6px 12px', borderRadius: '20px', color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s',
          fontSize: '0.8rem'
        }}>
          <Beaker size={14} /> Beta
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .math-logo, .math-title, .home-btn {
            display: none !important;
          }
          .beta-badge {
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};
