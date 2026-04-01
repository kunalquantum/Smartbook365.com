import React from 'react';
import { motion } from 'framer-motion';

export const FormulaCard = ({ title, formula, description }) => {
  return (
    <motion.div 
      className="glass-panel glass-panel-hover"
      whileHover={{ scale: 1.02 }}
      style={{
        padding: '20px',
        margin: '12px 0',
        borderLeft: '4px solid var(--primary)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        fontSize: '120px',
        opacity: 0.05,
        fontFamily: 'serif',
        userSelect: 'none',
        pointerEvents: 'none'
      }}>
        ∫
      </div>
      {title && <h4 style={{ margin: '0 0 12px 0', color: 'var(--primary-light)', fontSize: '1.1rem' }}>{title}</h4>}
      <div className="math-font" style={{ 
        fontSize: '1.5rem', 
        color: 'white',
        letterSpacing: '1px',
        background: 'rgba(0,0,0,0.2)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-sm)',
        textAlign: 'center',
        marginBottom: description ? '12px' : '0'
      }}>
        {formula}
      </div>
      {description && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
        {description}
      </p>}
    </motion.div>
  );
};
