// Renders a single atom as an SVG circle with element symbol
// Used across bonding, structure, organic simulators
const ELEMENT_COLORS = {
    H: '#E8F5EF', C: '#444441', N: '#378ADD', O: '#D85A30',
    F: '#1D9E75', Cl: '#1D9E75', Br: '#D4537E', I: '#7F77DD',
    S: '#EF9F27', P: '#D85A30', Na: '#EF9F27', Ca: '#EF9F27',
    Mg: '#1D9E75', Al: '#888780', Si: '#888780', default: '#FAC775',
}

export default function MoleculeAtom({
    cx, cy, element = 'C', radius = 16,
    labelSize = 11, showLabel = true,
    highlight = false, opacity = 1,
}) {
    const col = ELEMENT_COLORS[element] || ELEMENT_COLORS.default
    return (
        <g opacity={opacity}>
            <circle cx={cx} cy={cy} r={radius}
                fill={`${col}25`}
                stroke={highlight ? '#F0C040' : col}
                strokeWidth={highlight ? 2.5 : 1.5} />
            {showLabel && (
                <text x={cx} y={cy + labelSize * 0.35} textAnchor="middle"
                    style={{
                        fontSize: labelSize, fill: col,
                        fontFamily: 'var(--mono)', fontWeight: 600,
                        pointerEvents: 'none',
                    }}>
                    {element}
                </text>
            )}
        </g>
    )
}