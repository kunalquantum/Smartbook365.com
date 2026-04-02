import { useState } from 'react'
import { CHAPTERS, TOTAL_TOPICS } from './data/physics'
import { useProgress } from './hooks/useProgress'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import ChapterView from './components/chapter/ChapterView'
import ChapterList from './components/chapter/ChapterList'
import StatCard from './components/ui/StatCard'
import { useAuth } from '../../context/AuthContext'
import AccessDenied from '../../components/auth/AccessDenied'
import './physics.css'

export default function PhysicsModule() {
  const [activeId, setActiveId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { done, toggle, chapterDone, reset } = useProgress()
  const { hasAccess } = useAuth()

  const activeChapter = CHAPTERS.find(c => c.id === activeId)
  const isLocked = activeChapter && !hasAccess('physics', activeChapter.id)

  return (
    <div className="physics-theme">
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar
          chapters={CHAPTERS}
          activeId={activeId}
          onSelect={(id) => { setActiveId(id); setSidebarOpen(false) }}
          chapterDone={chapterDone}
          totalDone={done.size}
          isOpen={sidebarOpen}
        />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <TopBar
            onMenuClick={() => setSidebarOpen(o => !o)}
            onReset={() => { if (confirm('Reset all progress?')) reset() }}
          />

          <main style={{ flex: 1, overflowY: 'auto' }}>
            {/* Hero band */}
            <div style={{
              background: 'var(--bg3)',
              borderBottom: '1px solid var(--border)',
              padding: '20px 28px',
            }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: 2, marginBottom: 6 }}>
                MAHARASHTRA STATE BOARD · HSC
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text1)', marginBottom: 2 }}>
                {activeChapter ? `Chapter ${activeChapter.id} · ${activeChapter.title}` : 'Class 11 Physics'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                {activeChapter
                  ? `${activeChapter.unit} — ${activeChapter.topics.length} topics`
                  : 'Select a chapter from the sidebar'}
              </div>
            </div>

            {/* Global stats (shown on home) */}
            {!activeChapter && (
              <div style={{ display: 'flex', gap: 10, padding: '16px 28px', flexWrap: 'wrap', borderBottom: '1px solid var(--border)' }}>
                <StatCard value={16} label="Chapters" />
                <StatCard value={TOTAL_TOPICS} label="Total Topics" />
                <StatCard value={done.size} label="Completed" />
                <StatCard value={`${Math.round((done.size / TOTAL_TOPICS) * 100)}%`} label="Progress" />
              </div>
            )}

            {activeChapter ? (
              isLocked ? (
                <AccessDenied subject="Physics" chapterTitle={activeChapter.title} />
              ) : (
                <ChapterView chapter={activeChapter} done={done} onToggle={toggle} chapterDone={chapterDone} />
              )
            ) : (
              <ChapterList chapters={CHAPTERS} chapterDone={chapterDone} />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}