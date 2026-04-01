import React from 'react';
import { motion } from 'framer-motion';
import { chapters } from '../../data/chapters';
import { TopicSection } from './TopicSection';
import { Simulators, TopicSimulators } from '../../simulators';

export const ChapterPage = ({ chapterId }) => {
  const chapter = chapters.find(ch => ch.id === chapterId);
  const SimulatorComponent = Simulators[chapterId];

  if (!chapter) return <div>Chapter not found</div>;

  return (
    <motion.div 
      key={chapterId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}
    >
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '0 0 16px 0', 
          background: 'linear-gradient(90deg, #fff, var(--primary-light))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          {chapter.title}
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          {chapter.description}
        </p>
      </div>

      {SimulatorComponent && (
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 12px', background: 'rgba(59, 130, 246, 0.15)',
            color: 'var(--info)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '1px',
            marginBottom: '16px'
          }}>
            INTERACTIVE SIMULATOR
          </div>
          <SimulatorComponent />
        </div>
      )}

      <div>
        <h2 style={{ fontSize: '1.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '24px' }}>Topics</h2>
        {chapter.topics.map((topic, index) => {
          const TopicSim = TopicSimulators[`${chapterId}-${index}`];
          return (
            <TopicSection 
              key={`${chapterId}-${index}`} 
              title={topic} 
              index={index} 
              chapterId={chapterId}
            >
              {TopicSim && <TopicSim />}
            </TopicSection>
          );
        })}
      </div>
    </motion.div>
  );
};
