import BranchBadge from '../ui/BranchBadge'

export default function TopicSection({ topic, index, chId, branch, isDone, onToggle, Simulator }) {
    return (
        <div style={{
            borderBottom: '1px solid var(--border)',
            padding: '28px 0',
        }}>
            {/* Topic header */}
            <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{
                        fontSize: 10, fontFamily: 'var(--mono)',
                        color: 'var(--coral)', background: 'rgba(216,90,48,0.1)',
                        padding: '2px 8px', borderRadius: 20,
                    }}>
                        {topic.tag}
                    </span>
                    <span
                        onClick={() => onToggle(`${chId}-${index}`)}
                        style={{
                            marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--mono)',
                            cursor: 'pointer', padding: '3px 10px', borderRadius: 6,
                            background: isDone ? 'rgba(29,158,117,0.15)' : 'rgba(255,255,255,0.05)',
                            color: isDone ? 'var(--teal)' : 'var(--text3)',
                            border: `1px solid ${isDone ? 'rgba(29,158,117,0.3)' : 'var(--border)'}`,
                            transition: 'all 0.15s',
                        }}
                    >
                        {isDone ? '✓ done' : 'mark done'}
                    </span>
                </div>

                <h2 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text1)', margin: '0 0 6px' }}>
                    {topic.name}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 580, margin: 0 }}>
                    {topic.concept}
                </p>
            </div>

            {/* Formula bar */}
            {topic.formula?.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
                    {topic.formula.map((f, i) => (
                        <div key={i} style={{
                            background: 'var(--bg3)',
                            border: '1px solid var(--border2)',
                            borderRadius: 8, padding: '5px 13px',
                            fontFamily: 'var(--mono)', fontSize: 12,
                            color: 'var(--gold2)',
                        }}>
                            {f}
                        </div>
                    ))}
                </div>
            )}

            {/* Simulator */}
            {Simulator && (
                <div style={{
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: 12, padding: '18px',
                    marginTop: 4,
                }}>
                    <div style={{
                        fontSize: 10, fontFamily: 'var(--mono)',
                        color: 'var(--teal)', letterSpacing: 2,
                        marginBottom: 14, textTransform: 'uppercase',
                    }}>
                        ⚗ Interactive Lab
                    </div>
                    <Simulator />
                </div>
            )}
        </div>
    )
}