import React from 'react';
import { motion } from 'framer-motion';

export const ValueCard = ({ label, value, icon: Icon, color = 'var(--accent)' }) => {
  return (
    <motion.div 
      className="glass-panel"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(30,41,59,0.8) 0%, rgba(30,41,59,0.4) 100%)'
      }}
    >
      {Icon && (
        <div style={{
          padding: '12px',
          borderRadius: '12px',
          background: `rgba(255,255,255,0.05)`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
          {label}
        </span>
        <span className="math-font" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
          {value}
        </span>
      </div>
    </motion.div>
  );
};
