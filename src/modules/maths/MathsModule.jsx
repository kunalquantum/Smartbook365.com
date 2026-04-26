import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ChapterPage } from './components/book/ChapterPage';
import { useAuth } from '../../context/AuthContext';
import AccessDenied from '../../components/auth/AccessDenied';
import { chapters } from './data/chapters';
import './maths.css';
import './App.css';

import { isDemoChapter } from '../../config/demoConfig';

function MathsModule({ isDemoMode = false }) {
  const { "*": path } = useParams();
  const chapterIdFromUrl = path?.split('/')[0];

  const [activeChapter, setActiveChapter] = useState(chapterIdFromUrl || (isDemoMode ? '2' : '1'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { checkAccess } = useAuth();

  // Sync with URL changes
  useEffect(() => {
    if (chapterIdFromUrl) setActiveChapter(chapterIdFromUrl);
  }, [chapterIdFromUrl]);

  const chapterData = chapters.find(ch => ch.id === activeChapter);
  
  const isLocked = !checkAccess('maths', activeChapter, isDemoMode);


  return (
    <div className="maths-theme">
      <div className="bg-gradient-math"></div>
      <div className={`app-container ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar 
          activeChapter={activeChapter} 
          onSelectChapter={(id) => { setActiveChapter(id); setSidebarOpen(false); }} 
          isOpen={sidebarOpen}
        />
        
        <div className="main-content">
          <TopBar 
            activeChapter={activeChapter} 
            onMenuClick={() => setSidebarOpen(o => !o)}
          />
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
