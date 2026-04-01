import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { ChapterPage } from './components/book/ChapterPage';
import './maths.css';
import './App.css';

function MathsModule() {
  const [activeChapter, setActiveChapter] = useState('1');

  return (
    <div className="maths-theme">
      <div className="bg-gradient-math"></div>
      <div className="app-container">
        <Sidebar activeChapter={activeChapter} onSelectChapter={setActiveChapter} />
        
        <div className="main-content">
          <TopBar activeChapter={activeChapter} />
          <div className="page-content">
            <ChapterPage chapterId={activeChapter} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MathsModule;

