// Animated reaction arrow: forward → or equilibrium ⇌
export default function ReactionArrow({
    x1, y1, x2, y2,
    type = 'forward',    // forward | equilibrium | reverse
    color = 'var(--gold)',
    animated = false,
}) {
    const id = `arr_${Math.random().toString(36).slice(2, 7)}`
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
    const offset = 5

    return (
        <g>
            <defs>
                <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={5} markerHeight={5} orient="auto-start-reverse">
                    <path d="M2 1L8 5L2 9" fill="none" stroke={color}
                        strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </marker>
            </defs>

            {type === 'forward' && (
                <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={color} strokeWidth={1.8}
                    markerEnd={`url(#${id})`} />
            )}

            {type === 'equilibrium' && (
                <g>
                    {/* Forward arrow (top) */}
                    <line x1={x1} y1={y1 - offset} x2={x2} y2={y2 - offset}
                        stroke={color} strokeWidth={1.5}
                        markerEnd={`url(#${id})`} />
                    {/* Reverse arrow (bottom) */}
                    <line x1={x2} y1={y2 + offset} x2={x1} y2={y1 + offset}
                        stroke={`${color}80`} strokeWidth={1.5}
                        markerEnd={`url(#${id})`} />
                </g>
            )}
        </g>
    )
}