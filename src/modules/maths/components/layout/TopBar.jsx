import React from 'react';
import { motion } from 'framer-motion';
import { Book, Cpu, Beaker, FileText } from 'lucide-react';

export const TopBar = ({ activeChapter }) => {
  return (
    <div className="glass-panel" style={{
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      borderRadius: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
          width: '40px', height: '40px',
          borderRadius: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)'
        }}>
          <span style={{ fontFamily: 'Fira Code', fontWeight: 700, fontSize: '1.2rem' }}>∑</span>
        </div>
        <h2 style={{ margin: 0, fontWeight: 700, letterSpacing: '-0.5px' }}>Maths 11 Lab</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <button style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px 16px', borderRadius: '20px', color: 'white', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s'
        }}>
          <Beaker size={16} /> Beta
        </button>
      </div>
    </div>
  );
};
