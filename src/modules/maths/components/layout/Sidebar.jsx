import React from 'react';
import { motion } from 'framer-motion';
import { chapters } from '../../data/chapters';

export const Sidebar = ({ activeChapter, onSelectChapter }) => {
  return (
    <div className="glass-panel" style={{
      width: '280px',
      height: '100vh',
      borderTop: 'none',
      borderBottom: 'none',
      borderLeft: 'none',
      borderRadius: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 20
    }}>
      <div style={{ padding: '24px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Chapters</h3>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Maharashtra HSC Class 11 Maths</p>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 24px 12px' }}>
        {chapters.map((ch, idx) => {
          const isActive = ch.id === activeChapter;
          return (
            <motion.button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              whileHover={{ x: 4 }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                margin: '4px 0',
                background: isActive ? 'linear-gradient(90deg, rgba(79, 70, 229, 0.15) 0%, transparent 100%)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                borderRadius: '0 8px 8px 0',
                cursor: 'pointer',
                color: isActive ? 'white' : 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.2s, color 0.2s'
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? 'var(--primary-light)' : 'var(--text-muted)', marginBottom: '4px' }}>
                CHAPTER {ch.id}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: isActive ? 600 : 500, lineHeight: 1.3 }}>
                {ch.title}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
