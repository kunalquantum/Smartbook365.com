export default function ValueCard({ label, value, unit = '', color = 'var(--gold)', highlight = false }) {
    return (
        <div style={{
            background: 'var(--bg3)',
            border: `1px solid ${highlight ? color + '55' : 'var(--border)'}`,
            borderRadius: 'var(--radius)',
            padding: '10px 14px',
            flex: 1,
            minWidth: 100,
        }}>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>
                {label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--mono)', color }}>
                {value}
                {unit && <span style={{ fontSize: 11, marginLeft: 3, opacity: 0.7 }}>{unit}</span>}
            </div>
        </div>
    )
}