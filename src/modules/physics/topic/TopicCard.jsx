import Badge from '../ui/Badge'

export default function TopicCard({ topic, index, chId, isDone, onToggle }) {
    return (
        <div
            onClick={() => onToggle(`${chId}-${index}`)}
            style={{
                background: 'var(--bg2)',
                border: `1px solid ${isDone ? 'rgba(29,158,117,0.35)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '14px 16px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s, background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#152840'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg2)'}
        >
            {isDone && (
                <span style={{
                    position: 'absolute', top: 10, right: 12,
                    color: 'var(--teal)', fontSize: 13, fontFamily: 'var(--mono)',
                }}>✓</span>
            )}
            <div style={{ marginBottom: 8 }}>
                <Badge tag={topic.tag} />
            </div>
            <div style={{ fontSize: 14, color: 'var(--text1)', fontWeight: 600, marginBottom: 4, lineHeight: 1.4 }}>
                {topic.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
                {topic.detail}
            </div>
        </div>
    )
}