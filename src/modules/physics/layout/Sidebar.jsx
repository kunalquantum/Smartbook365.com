import ProgressBar from '../ui/ProgressBar'
import { TOTAL_TOPICS } from '../../data/physics'

export default function Sidebar({ chapters, activeId, onSelect, chapterDone, totalDone, isOpen }) {
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
                            }}
                        >
                            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--amber)', opacity: 0.6, minWidth: 22 }}>
                                {String(ch.id).padStart(2, '0')}
                            </span>
                            <span style={{ fontSize: 13, color: active ? 'var(--text1)' : 'var(--text2)', flex: 1, lineHeight: 1.3 }}>
                                {ch.title}
                            </span>
                            {done > 0 && (
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
        </aside>
    )
}