export default function SimSlider({ label, unit, value, min, max, step = 1, onChange }) {
    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 12, fontFamily: 'var(--mono)',
                color: 'var(--text2)', marginBottom: 5,
            }}>
                <span>{label}</span>
                <span style={{ color: 'var(--amber)' }}>{value}{unit}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step}
                value={value} onChange={e => onChange(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--amber)', cursor: 'pointer' }}
            />
        </div>
    )
}