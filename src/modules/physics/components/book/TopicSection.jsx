export default function TopicSection({ topic, Simulator }) {
    return (
        <div style={{
            borderBottom: '1px solid var(--border)',
            padding: '28px 0',
        }}>
            {/* Topic header */}
            <div style={{ marginBottom: 20 }}>
                <span style={{
                    fontSize: 10, fontFamily: 'var(--mono)',
                    color: 'var(--coral)', background: 'rgba(216,90,48,0.10)',
                    padding: '2px 8px', borderRadius: 20,
                }}>
                    {topic.tag}
                </span>
                <h2 style={{
                    fontSize: 18, fontWeight: 700,
                    color: 'var(--text1)', margin: '8px 0 4px',
                }}>
                    {topic.name}
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560 }}>
                    {topic.concept}
                </p>
            </div>

            {/* Formula bar */}
            {topic.formula && (
                <div style={{
                    display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20,
                }}>
                    {topic.formula.map((f, i) => (
                        <div key={i} style={{
                            background: 'var(--bg3)',
                            border: '1px solid var(--border2)',
                            borderRadius: 8, padding: '6px 14px',
                            fontFamily: 'var(--mono)', fontSize: 13,
                            color: 'var(--amber2)',
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
                    borderRadius: 12, padding: '20px',
                    marginTop: 4,
                }}>
                    <div style={{
                        fontSize: 10, fontFamily: 'var(--mono)',
                        color: 'var(--teal)', letterSpacing: 2,
                        marginBottom: 14, textTransform: 'uppercase',
                    }}>
                        ⚡ Interactive Simulator
                    </div>
                    <Simulator />
                </div>
            )}
        </div>
    )
}