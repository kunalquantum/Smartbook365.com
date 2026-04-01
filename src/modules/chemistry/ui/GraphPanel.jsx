// Reusable mini line-graph for any simulator
// points: [{x, y}], xLabel, yLabel, color
export default function GraphPanel({
    points = [], xLabel = 'x', yLabel = 'y',
    color = 'var(--gold)', height = 120,
    showDot = true, currentX = null,
}) {
    if (points.length < 2) return null

    const W = 420, H = height
    const PAD = { l: 44, r: 16, t: 12, b: 28 }
    const PW = W - PAD.l - PAD.r
    const PH = H - PAD.t - PAD.b

    const xs = points.map(p => p.x)
    const ys = points.map(p => p.y)
    const xMin = Math.min(...xs), xMax = Math.max(...xs)
    const yMin = Math.min(...ys), yMax = Math.max(...ys)
    const xRange = xMax - xMin || 1
    const yRange = yMax - yMin || 1

    const toSX = x => PAD.l + ((x - xMin) / xRange) * PW
    const toSY = y => PAD.t + PH - ((y - yMin) / yRange) * PH

    const pathD = points.map((p, i) =>
        `${i === 0 ? 'M' : 'L'}${toSX(p.x).toFixed(1)},${toSY(p.y).toFixed(1)}`
    ).join(' ')

    // Current point
    const curPt = currentX !== null
        ? points.reduce((closest, p) =>
            Math.abs(p.x - currentX) < Math.abs(closest.x - currentX) ? p : closest
            , points[0])
        : null

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
            {/* Area fill */}
            <path
                d={`${pathD} L${toSX(xMax)},${PAD.t + PH} L${toSX(xMin)},${PAD.t + PH} Z`}
                fill={color} opacity={0.07}
            />
            {/* Curve */}
            <path d={pathD} fill="none" stroke={color} strokeWidth={2} />

            {/* Current point */}
            {showDot && curPt && (
                <>
                    <line x1={toSX(curPt.x)} y1={PAD.t} x2={toSX(curPt.x)} y2={PAD.t + PH}
                        stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} strokeDasharray="3 3" />
                    <circle cx={toSX(curPt.x)} cy={toSY(curPt.y)} r={5}
                        fill={color} stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
                </>
            )}

            {/* Axes */}
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + PH}
                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
            <line x1={PAD.l} y1={PAD.t + PH} x2={PAD.l + PW} y2={PAD.t + PH}
                stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />

            {/* Axis labels */}
            <text x={PAD.l + PW} y={PAD.t + PH + 16}
                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                {xLabel}
            </text>
            <text x={PAD.l - 6} y={PAD.t + PH / 2 + 4} textAnchor="end"
                transform={`rotate(-90,${PAD.l - 6},${PAD.t + PH / 2 + 4})`}
                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                {yLabel}
            </text>

            {/* Min/max y */}
            <text x={PAD.l - 4} y={PAD.t + 8} textAnchor="end"
                style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                {yMax.toFixed(2)}
            </text>
            <text x={PAD.l - 4} y={PAD.t + PH} textAnchor="end"
                style={{ fontSize: 8, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                {yMin.toFixed(2)}
            </text>
        </svg>
    )
}