import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { CHAPTERS, TOTAL_TOPICS } from './data/chapters'
import { useProgress } from './hooks/useProgress'
import Sidebar from './components/layout/Sidebar'
import TopBar from './components/layout/TopBar'
import ChapterPage from './components/book/ChapterPage'
import ValueCard from './components/ui/ValueCard'
import BranchBadge from './components/ui/BranchBadge'
import AtomicExplorerPage from './components/Atom3D/AtomicExplorerPage'
import { useAuth } from '../../context/AuthContext'
import AccessDenied from '../../components/auth/AccessDenied'
import { DEMO_CONFIG, isDemoChapter } from '../../config/demoConfig'
import './chemistry.css'

const BRANCH_COLOR = {
    Physical: '#EF9F27', Inorganic: '#1D9E75',
    Organic: '#7F77DD', Analytical: '#D85A30',
    Nuclear: '#378ADD', Applied: '#EF9F27',
}

export default function ChemistryModule({ isDemoMode = false }) {
    const { "*": path } = useParams()
    const chapterId = path?.split('/')[0]
    
    const [activeId, setActiveId] = useState(chapterId ? Number(chapterId) : null)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const { done, toggle, chapterDone, reset } = useProgress()
    const { checkAccess } = useAuth()

    // Sync with URL changes
    useEffect(() => {
        if (chapterId) setActiveId(Number(chapterId))
    }, [chapterId])

    const activeChapter = CHAPTERS.find(c => c.id === activeId)
    const isLocked = activeChapter && !checkAccess('chemistry', activeChapter.id, isDemoMode)

    return (
        <div className="chemistry-theme">
            <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
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
                        onReset={() => { if (confirm('Reset all Chemistry progress?')) reset() }}
                    />

                    <main style={{ flex: 1, overflowY: 'auto' }}>
                        {/* Hero band */}
                        <div style={{
                            background: 'var(--bg3)',
                            borderBottom: '1px solid var(--border)',
                            padding: '18px 26px',
                        }}>
                            {activeChapter && <BranchBadge branch={activeChapter.branch} />}
                            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text1)', margin: '8px 0 2px' }}>
                                {activeChapter
                                    ? `Chapter ${activeChapter.id} · ${activeChapter.title}`
                                    : 'Class 11 Chemistry'}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text3)' }}>
                                {activeChapter
                                    ? `${activeChapter.topics.length} topics`
                                    : 'Maharashtra State Board · Select a chapter'}
                            </div>
                        </div>

                        {/* Global stats (home screen) */}
                        {!activeChapter && activeId !== 'atom3d' && (
                            <>
                                <div style={{
                                    display: 'flex', gap: 10, padding: '14px 26px',
                                    flexWrap: 'wrap', borderBottom: '1px solid var(--border)',
                                }}>
                                    {[
                                        { label: 'Chapters', value: 16 },
                                        { label: 'Topics', value: TOTAL_TOPICS },
                                        { label: 'Completed', value: done.size },
                                        { label: 'Progress', value: `${Math.round(done.size / TOTAL_TOPICS * 100)}%` },
                                    ].map(s => (
                                        <ValueCard key={s.label} label={s.label} value={String(s.value)} />
                                    ))}
                                </div>

                                {/* Branch summary */}
                                <div style={{ padding: '20px 26px' }}>
                                    <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 16, letterSpacing: 1 }}>
                                        CHAPTERS BY BRANCH
                                    </div>
                                    {[
                                        { branch: 'Physical', chs: [1, 4, 5, 6, 10, 11, 12, 13] },
                                        { branch: 'Inorganic', chs: [7, 8, 9] },
                                        { branch: 'Organic', chs: [14, 15] },
                                        { branch: 'Analytical', chs: [2, 3] },
                                        { branch: 'Applied', chs: [16] },
                                    ].map(b => (
                                        <div key={b.branch} style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            marginBottom: 12, padding: '10px 14px',
                                            background: 'var(--bg2)', borderRadius: 8,
                                            border: '1px solid var(--border)',
                                            cursor: 'pointer',
                                        }}
                                            onClick={() => setActiveId(b.chs[0])}
                                        >
                                            <BranchBadge branch={b.branch} />
                                            <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                                                Ch {b.chs.join(', ')}
                                            </span>
                                            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                                                {b.chs.length} chapter{b.chs.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {activeChapter && (
                            isLocked ? (
                                <AccessDenied subject="Chemistry" chapterTitle={activeChapter.title} />
                            ) : (
                                <ChapterPage
                                    chapter={activeChapter}
                                    done={done}
                                    onToggle={toggle}
                                />
                            )
                        )}

                        {activeId === 'atom3d' && (
                            <AtomicExplorerPage />
                        )}
                    </main>
                </div>
            </div>
        </div>
    )
}
