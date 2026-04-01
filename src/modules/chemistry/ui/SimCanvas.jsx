export default function SimCanvas({ children, height = 260, label, style = {} }) {
    return (
        <div style={{
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 4,
            marginTop: 4,
            ...style,
        }}>
            {label && (
                <div style={{
                    fontSize: 10, fontFamily: 'var(--mono)',
                    color: 'var(--teal)', letterSpacing: 2,
                    padding: '8px 14px 4px',
                    textTransform: 'uppercase',
                }}>
                    ⚗ {label}
                </div>
            )}
            <svg
                viewBox={`0 0 460 ${height}`}
                width="100%"
                style={{ display: 'block' }}
            >
                {children}
            </svg>
        </div>
    )
}