const BRANCH_STYLES = {
    Physical: { color: '#EF9F27', bg: 'rgba(239,159,39,0.1)' },
    Inorganic: { color: '#1D9E75', bg: 'rgba(29,158,117,0.1)' },
    Organic: { color: '#7F77DD', bg: 'rgba(127,119,221,0.1)' },
    Analytical: { color: '#D85A30', bg: 'rgba(216,90,48,0.1)' },
    Nuclear: { color: '#378ADD', bg: 'rgba(55,138,221,0.1)' },
    Applied: { color: '#EF9F27', bg: 'rgba(239,159,39,0.1)' },
}

export default function BranchBadge({ branch }) {
    const s = BRANCH_STYLES[branch] || BRANCH_STYLES.Physical
    return (
        <span style={{
            fontSize: 10, fontFamily: 'var(--mono)',
            color: s.color, background: s.bg,
            padding: '2px 8px', borderRadius: 20,
            display: 'inline-block',
            letterSpacing: '0.5px',
        }}>
            {branch} Chemistry
        </span>
    )
}