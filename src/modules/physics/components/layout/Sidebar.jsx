import ProgressBar from '../ui/ProgressBar'
import { TOTAL_TOPICS } from '../../data/physics'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../../context/AuthContext'

export default function Sidebar({ chapters, activeId, onSelect, chapterDone, totalDone, isOpen }) {
    const { hasAccess } = useAuth()
    const globalPct = Math.round((totalDone / TOTAL_TOPICS) * 100)

    return (
        <aside style={{
            width: 260, minWidth: 260,
            background: 'var(--bg2)',
            borderRight: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px 16px 14px',
                borderBottom: '1px solid var(--border)',
                background: 'var(--bg3)',
            }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', letterSpacing: 2, marginBottom: 4 }}>
                    STD XI · STATE BOARD
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text1)', marginBottom: 10 }}>
                    Physics
                </div>
                <ProgressBar value={totalDone} max={TOTAL_TOPICS} />
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)', marginTop: 5 }}>
                    {totalDone}/{TOTAL_TOPICS} topics · {globalPct}%
                </div>
            </div>

            {/* Chapter list */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '6px 0' }}>
                {chapters.map(ch => {
                    const done = chapterDone(ch.id, ch.topics.length)
                    const active = ch.id === activeId
                    const locked = !hasAccess('physics', ch.id)

                    return (
                        <div
                            key={ch.id}
                            onClick={() => onSelect(ch.id)}
                            style={{
                                padding: '9px 14px',
                                cursor: 'pointer',
                                borderLeft: `3px solid ${active ? 'var(--amber)' : 'transparent'}`,
                                background: active ? 'rgba(239,159,39,0.07)' : 'transparent',
                                display: 'flex', alignItems: 'center', gap: 10,
                                transition: 'background 0.15s',
                                opacity: locked ? 0.6 : 1,
                            }}
                        >
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', opacity: 0.6, minWidth: 22 }}>
                                {locked ? '🔒' : String(ch.id).padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: 13, color: active ? 'var(--text1)' : 'var(--text2)', flex: 1, lineHeight: 1.3 }}>
                                {ch.title}
                            </span>
                            {done > 0 && !locked && (
                                <span style={{
                                    fontSize: 10, fontFamily: 'var(--mono)',
                                    color: 'var(--teal)', background: 'rgba(29,158,117,0.12)',
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
                padding: '16px', borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 10,
                color: 'var(--text2)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none'
            }}>
                <span>🏠</span> Back to Home
            </Link>
        </aside>
    )
}