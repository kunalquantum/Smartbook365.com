import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ChapterPage } from './components/book/ChapterPage';
import { useAuth } from '../../context/AuthContext';
import AccessDenied from '../../components/auth/AccessDenied';
import { chapters } from './data/chapters';
import './maths.css';
import './App.css';

function MathsModule() {
  const [activeChapter, setActiveChapter] = useState('1');
  const { hasAccess } = useAuth();

  const chapterData = chapters.find(ch => ch.id === activeChapter);
  const isLocked = !hasAccess('maths', Number(activeChapter));

  return (
    <div className="maths-theme">
      <div className="bg-gradient-math"></div>
      <div className="app-container">
        <Sidebar activeChapter={activeChapter} onSelectChapter={setActiveChapter} />
        
        <div className="main-content">
          <TopBar activeChapter={activeChapter} />
          <div className="page-content">
            {isLocked ? (
              <AccessDenied subject="Mathematics" chapterTitle={chapterData?.title || 'This Chapter'} />
            ) : (
              <ChapterPage chapterId={activeChapter} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathsModule;

