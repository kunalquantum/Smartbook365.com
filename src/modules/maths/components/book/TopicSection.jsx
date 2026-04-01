import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useProgress } from '../../hooks/useProgress';

export const TopicSection = ({ title, index, chapterId, children }) => {
  const [completed, setCompleted] = useProgress(`${chapterId}_topic_${index}`, false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel"
      style={{
        padding: '24px',
        margin: '24px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600, letterSpacing: '1px' }}>
            TOPIC {index + 1}
          </span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '1.4rem', color: 'white' }}>{title}</h3>
        </div>
        
        <button 
          onClick={() => setCompleted(!completed)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: completed ? 'var(--success)' : 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem', fontWeight: 500
          }}
        >
          {completed ? 'Learned' : 'Mark Complete'}
          <CheckCircle size={20} />
        </button>
      </div>

      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {children || <p>Interactive content for {title} will appear here.</p>}
      </div>
    </motion.div>
  );
};
