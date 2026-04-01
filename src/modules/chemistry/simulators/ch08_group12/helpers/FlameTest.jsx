import { useEffect, useRef, useState } from 'react'

// Reusable animated flame with colour
export default function FlameTest({ color, label, active, size = 80 }) {
    const [tick, setTick] = useState(0)
    const rafRef = useRef(null)
    const tRef = useRef(0)
    const lastRef = useRef(null)

    useEffect(() => {
        if (!active) return
        const step = ts => {
            if (!lastRef.current) lastRef.current = ts
            tRef.current += (ts - lastRef.current) / 1000
            lastRef.current = ts
            setTick(p => p + 1)
            rafRef.current = requestAnimationFrame(step)
        }
        rafRef.current = requestAnimationFrame(step)
        return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
    }, [active])

    const t = tRef.current

    if (!active) {
        return (
            <div style={{ width: size, textAlign: 'center' }}>
                <div style={{ width: size * 0.4, height: size * 0.6, background: 'rgba(160,176,200,0.1)', borderRadius: '50% 50% 30% 30%', margin: '0 auto 4px', border: '1px solid rgba(160,176,200,0.2)' }} />
                <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>{label}</div>
            </div>
        )
    }

    // Flame flicker paths
    const flicker = Math.sin(t * 8) * 0.15
    const flicker2 = Math.cos(t * 11) * 0.1

    return (
        <div style={{ width: size, textAlign: 'center' }}>
            <svg viewBox="0 0 40 60" width={size * 0.8} height={size * 1.0} style={{ display: 'block', margin: '0 auto' }}>
                {/* Outer flame glow */}
                <ellipse cx={20} cy={38} rx={14 + flicker * 4} ry={18 + flicker2 * 3}
                    fill={color} opacity={0.15} />
                {/* Main flame */}
                <path d={`M 20 52 C ${10 + flicker * 8} 40 ${8 + flicker2 * 6} 28 ${18 + flicker * 4} 18 C ${22 + flicker2 * 3} 12 ${26 + flicker * 5} 22 ${20 - flicker * 3} 26 C ${16 + flicker * 4} 30 ${30 + flicker2 * 4} 40 20 52 Z`}
                    fill={color} opacity={0.85} />
                {/* Inner bright core */}
                <path d={`M 20 50 C ${14 + flicker * 4} 42 ${15 + flicker2 * 3} 34 ${19 + flicker} 28 C ${22 + flicker2 * 2} 24 ${24 + flicker * 3} 32 20 50 Z`}
                    fill="rgba(255,255,255,0.5)" opacity={0.7 + flicker * 0.2} />
                {/* Burner */}
                <rect x={16} y={52} width={8} height={8} rx={1}
                    fill="rgba(136,135,128,0.6)" />
            </svg>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color, fontWeight: 700, marginTop: 2 }}>{label}</div>
        </div>
    )
}