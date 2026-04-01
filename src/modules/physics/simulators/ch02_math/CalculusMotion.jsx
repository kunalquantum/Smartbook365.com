import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const PRESETS = {
    'Uniform motion': { u: 20, a: 0 },
    'Uniform acceleration': { u: 0, a: 5 },
    'Deceleration': { u: 30, a: -4 },
    'Free fall': { u: 0, a: 9.8 },
}

const W = 380, H = 140, PAD = { l: 44, r: 12, t: 16, b: 28 }

function MiniGraph({ points, color, yLabel, unit }) {
    if (!points.length) return null
    const xs = points.map(p => p[0])
    const ys = points.map(p => p[1])
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const rangeY = maxY - minY || 1
    const plotW = W - PAD.l - PAD.r
    const plotH = H - PAD.t - PAD.b

    const px = (x, i) => PAD.l + (i / (points.length - 1)) * plotW
    const py = y => PAD.t + plotH - ((y - minY) / rangeY) * plotH

    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p[0], i).toFixed(1)},${py(p[1]).toFixed(1)}`).join(' ')

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginBottom: 4 }}>
            {/* Zero line */}
            {minY < 0 && maxY > 0 && (
                <line x1={PAD.l} y1={py(0)} x2={W - PAD.r} y2={py(0)}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="3 3" />
            )}
            {/* Curve */}
            <path d={d} fill="none" stroke={color} strokeWidth={2} />
            {/* Area fill */}
            <path d={`${d} L${W - PAD.r},${PAD.t + plotH} L${PAD.l},${PAD.t + plotH} Z`}
                fill={color} opacity={0.07} />
            {/* Y-axis */}
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + plotH}
                stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
            {/* X-axis */}
            <line x1={PAD.l} y1={PAD.t + plotH} x2={W - PAD.r} y2={PAD.t + plotH}
                stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
            {/* Y label */}
            <text x={8} y={PAD.t + plotH / 2} textAnchor="middle"
                transform={`rotate(-90,8,${PAD.t + plotH / 2})`}
                style={{ fontSize: 9, fill: color, fontFamily: 'var(--mono)' }}>{yLabel}</text>
            {/* Min/max labels */}
            <text x={PAD.l - 3} y={PAD.t + 8} textAnchor="end"
                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                {maxY.toFixed(1)}
            </text>
            <text x={PAD.l - 3} y={PAD.t + plotH} textAnchor="end"
                style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                {minY.toFixed(1)}
            </text>
            {/* X labels */}
            {[0, 2.5, 5].map(t => (
                <text key={t} x={PAD.l + (t / 5) * plotW} y={H - 4} textAnchor="middle"
                    style={{ fontSize: 9, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>{t}s</text>
            ))}
        </svg>
    )
}

export default function CalculusMotion() {
    const [u, setU] = useState(10)
    const [a, setA] = useState(4)
    const [preset, setPreset] = useState(null)

    const applyPreset = name => {
        const p = PRESETS[name]
        setU(p.u); setA(p.a); setPreset(name)
    }

    const N = 60
    const pts = useMemo(() => Array.from({ length: N }, (_, i) => {
        const t = (i / (N - 1)) * 5
        return { t, x: u * t + 0.5 * a * t * t, v: u + a * t, a: a }
    }), [u, a])

    const posPts = pts.map(p => [p.t, p.x])
    const velPts = pts.map(p => [p.t, p.v])
    const accPts = pts.map(p => [p.t, p.a])

    const t3 = pts[Math.floor(N * 0.6)]

    return (
        <div>
            {/* Presets */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                {Object.keys(PRESETS).map(k => (
                    <button key={k} onClick={() => applyPreset(k)} style={{
                        padding: '4px 10px', borderRadius: 6, fontSize: 11,
                        fontFamily: 'var(--mono)', cursor: 'pointer',
                        background: preset === k ? 'var(--teal)' : 'var(--bg3)',
                        color: preset === k ? '#fff' : 'var(--text2)',
                        border: '1px solid var(--border)',
                    }}>{k}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <SimSlider label="Initial velocity u" unit=" m/s" value={u} min={-20} max={40} step={1} onChange={v => { setU(v); setPreset(null) }} />
                <SimSlider label="Acceleration a" unit=" m/s²" value={a} min={-15} max={15} step={0.5} onChange={v => { setA(v); setPreset(null) }} />
            </div>

            {/* 3 graphs stacked */}
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>
                x(t) = ut + ½at²  →  differentiate  →  v(t) = u + at  →  differentiate  →  a(t) = {a}
            </div>

            <MiniGraph points={posPts} color="#EF9F27" yLabel="x (m)" unit="m" />
            <div style={{ fontSize: 10, color: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)', textAlign: 'center', marginBottom: 4 }}>
                v = dx/dt (slope of position curve)
            </div>

            <MiniGraph points={velPts} color="#1D9E75" yLabel="v (m/s)" unit="m/s" />
            <div style={{ fontSize: 10, color: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)', textAlign: 'center', marginBottom: 4 }}>
                a = dv/dt (slope of velocity curve)
            </div>

            <MiniGraph points={accPts} color="#D85A30" yLabel="a (m/s²)" unit="m/s²" />

            {/* Snapshot at t = 3s */}
            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'x at t=3s', val: `${(u * 3 + 0.5 * a * 9).toFixed(1)} m`, color: 'var(--amber)' },
                    { label: 'v at t=3s', val: `${(u + a * 3).toFixed(1)} m/s`, color: 'var(--teal)' },
                    { label: 'a (const)', val: `${a} m/s²`, color: 'var(--coral)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 16px', border: '1px solid var(--border)', flex: 1, minWidth: 100,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 17, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}