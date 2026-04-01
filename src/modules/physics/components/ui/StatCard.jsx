export default function StatCard({ value, label }) {
    return (
        <div style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '10px 18px',
            minWidth: 90,
        }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>
                {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, letterSpacing: '0.5px' }}>
                {label}
            </div>
        </div>
    )
}