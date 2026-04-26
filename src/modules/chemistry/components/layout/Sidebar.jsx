import { Link } from 'react-router-dom'
import { TOTAL_TOPICS } from '../../data/chapters'
import { useAuth } from '../../../../context/AuthContext'

const BRANCH_COLOR = {
    Physical: '#EF9F27', Inorganic: '#1D9E75',
    Organic: '#7F77DD', Analytical: '#D85A30',
    Nuclear: '#378ADD', Applied: '#EF9F27',
}

export default function Sidebar({ chapters, activeId, onSelect, chapterDone, totalDone, isOpen }) {
    const { checkAccess } = useAuth()
    const pct = Math.round((totalDone / TOTAL_TOPICS) * 100)

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    onClick={() => onSelect(activeId)}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'none',
                    }}
                    className="sidebar-backdrop"
                />
            )}

            <aside 
                className={`module-sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    width: 265, minWidth: 265,
                    background: 'var(--bg2)',
                    borderRight: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    zIndex: 1001,
                }}
            >
                {/* Header */}
                <div style={{
                    padding: '15px 15px 13px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg3)',
                }}>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: 2, marginBottom: 3 }}>
                        STD XI · STATE BOARD
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text1)', marginBottom: 10 }}>
                        Chemistry
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: 'var(--gold)', transition: 'width 0.4s', borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 5 }}>
                        {totalDone}/{TOTAL_TOPICS} topics · {pct}%
                    </div>
                </div>

                {/* Dedicated Tools */}
                <div style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                    <div onClick={() => onSelect('atom3d')} style={{
                        padding: '10px 15px', cursor: 'pointer',
                        background: activeId === 'atom3d' ? 'rgba(55,138,221,0.1)' : 'transparent',
                        borderLeft: `3px solid ${activeId === 'atom3d' ? '#378ADD' : 'transparent'}`,
                        display: 'flex', alignItems: 'center', gap: 10,
                        transition: 'background 0.15s'
                    }}>
                        <span style={{ fontSize: 16 }}>🔭</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: activeId === 'atom3d' ? '#378ADD' : 'var(--text2)' }}>
                            3D Atomic Explorer
                        </span>
                    </div>
                </div>

                {/* Chapter list */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '5px 0' }}>
                    {chapters.map(ch => {
                        const done = chapterDone(ch.id, ch.topics.length)
                        const active = ch.id === activeId
                        const locked = !checkAccess('chemistry', ch.id)
                        const bColor = BRANCH_COLOR[ch.branch] || 'var(--gold)'
                        
                        return (
                            <div
                                key={ch.id}
                                onClick={() => onSelect(ch.id)}
                                style={{
                                    padding: '8px 13px',
                                    cursor: 'pointer',
                                    borderLeft: `3px solid ${active ? bColor : 'transparent'}`,
                                    background: active ? `${bColor}10` : 'transparent',
                                    display: 'flex', alignItems: 'center', gap: 9,
                                    transition: 'background 0.12s',
                                    opacity: locked ? 0.6 : 1,
                                }}
                            >
                                <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: bColor, opacity: 0.6, minWidth: 22 }}>
                                    {locked ? '🔒' : String(ch.id).padStart(2, '0')}
                                </span>
                                <span style={{ fontSize: 12, color: active ? 'var(--text1)' : 'var(--text2)', flex: 1, lineHeight: 1.3 }}>
                                    {ch.title}
                                </span>
                                {done > 0 && !locked && (
                                    <span style={{
                                        fontSize: 10, fontFamily: 'var(--mono)',
                                        color: 'var(--teal)', background: 'rgba(29,158,117,0.1)',
                                        padding: '1px 6px', borderRadius: 20,
                                    }}>
                                        {done}/{ch.topics.length}
                                    </span>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Home Link */}
                <Link to="/" style={{
                    padding: '15px', borderTop: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', gap: 10,
                    color: 'var(--text2)', fontSize: 13, fontWeight: 600,
                    textDecoration: 'none'
                }}>
                    <span>🏠</span> Back to Home
                </Link>
                
                <style>{`
                    @media (max-width: 768px) {
                        .module-sidebar {
                            position: fixed !important;
                            top: 0;
                            left: 0;
                            bottom: 0;
                            transform: translateX(-100%);
                        }
                        .module-sidebar.open {
                            transform: translateX(0);
                        }
                        .sidebar-backdrop {
                            display: block !important;
                        }
                    }
                `}</style>
            </aside>
        </>
    )
}