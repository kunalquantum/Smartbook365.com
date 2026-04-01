export default function ProgressBar({ value, max, color = 'var(--amber)', height = 3 }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
        <div style={{
            height, background: 'var(--border)',
            borderRadius: height, overflow: 'hidden',
        }}>
            <div style={{
                height: '100%', width: `${pct}%`,
                background: color, borderRadius: height,
                transition: 'width 0.4s ease',
            }} />
        </div>
    )
}