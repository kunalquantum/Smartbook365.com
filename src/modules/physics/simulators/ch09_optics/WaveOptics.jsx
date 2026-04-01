import { useState, useMemo } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 300
const SLIT_X = 80
const SCREEN_X = W - 60
const CY = H / 2

// Wavelength → RGB colour
function wavelengthToRgb(nm) {
    let r, g, b
    if (nm < 380) { r = 0.5; g = 0; b = 0.5 }
    else if (nm < 440) { r = -(nm - 440) / 60; g = 0; b = 1 }
    else if (nm < 490) { r = 0; g = (nm - 440) / 50; b = 1 }
    else if (nm < 510) { r = 0; g = 1; b = -(nm - 510) / 20 }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; b = 0 }
    else if (nm < 645) { r = 1; g = -(nm - 645) / 65; b = 0 }
    else { r = 1; g = 0; b = 0 }
    const factor = nm < 380 ? 0.3 : nm < 420 ? 0.3 + 0.7 * (nm - 380) / 40 : nm > 700 ? 0.3 + 0.7 * (780 - nm) / 80 : 1
    return `rgb(${Math.round(r * 255 * factor)},${Math.round(g * 255 * factor)},${Math.round(b * 255 * factor)})`
}

export default function WaveOptics() {
    const [lambda, setLambda] = useState(550)   // nm
    const [d, setD] = useState(0.5)   // mm slit separation
    const [D, setD_] = useState(100)   // cm screen distance

    const beta = (lambda * 1e-9 * D * 1e-2) / (d * 1e-3) * 1e3  // fringe width in mm
    const color = wavelengthToRgb(lambda)

    // Screen height in SVG
    const SCREEN_H = H - 40
    const nFringes = 9

    // Intensity at each screen point
    const screenPoints = useMemo(() => {
        return Array.from({ length: H - 20 }, (_, i) => {
            const y_mm = ((i - (H - 20) / 2) / ((H - 20) / 2)) * 15   // -15mm to +15mm
            const phase = (Math.PI * d * 1e-3 * y_mm * 1e-3) / (lambda * 1e-9 * D * 1e-2)
            const I = Math.pow(Math.cos(phase), 2)
            return { y: i + 10, I }
        })
    }, [lambda, d, D])

    // Fringe positions
    const fringes = Array.from({ length: nFringes * 2 + 1 }, (_, i) => {
        const n = i - nFringes
        return {
            n,
            y: CY - (n * beta / 15) * (H / 2),    // scale beta to SVG
            isBright: true,
        }
    })

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="Wavelength λ" unit=" nm" value={lambda} min={380} max={700} step={5} onChange={setLambda} />
                <SimSlider label="Slit sep d" unit=" mm" value={d} min={0.1} max={2} step={0.05} onChange={setD} />
                <SimSlider label="Distance D" unit=" cm" value={D} min={20} max={200} step={5} onChange={setD_} />
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8 }}>

                {/* Source */}
                <circle cx={30} cy={CY} r={8}
                    fill={color} opacity={0.8} />
                <text x={30} y={CY + 20} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>src</text>

                {/* Barrier with two slits */}
                <rect x={SLIT_X - 4} y={20} width={8} height={H - 40}
                    fill="rgba(160,176,200,0.2)" stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                {/* Slits (gaps) */}
                <rect x={SLIT_X - 5} y={CY - 14} width={10} height={8}
                    fill="#0B1929" />
                <rect x={SLIT_X - 5} y={CY + 6} width={10} height={8}
                    fill="#0B1929" />
                <text x={SLIT_X} y={H - 8} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>
                    d={d}mm
                </text>

                {/* Rays from slits — Huygens secondary wavelets */}
                {[CY - 10, CY + 10].map((sy, si) => (
                    [0.15, 0.4, 0.65, 0.9].map((f, ri) => {
                        const tx = SLIT_X + f * (SCREEN_X - SLIT_X)
                        const ty = sy + (CY - sy) * f * 0.3
                        return (
                            <line key={`${si}_${ri}`}
                                x1={SLIT_X + 5} y1={sy}
                                x2={tx} y2={ty}
                                stroke={color}
                                strokeWidth={0.6}
                                opacity={0.12} />
                        )
                    })
                ))}

                {/* Screen */}
                <rect x={SCREEN_X} y={20} width={28} height={H - 40} rx={2}
                    fill="#0B1929" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />

                {/* Intensity pattern on screen */}
                {screenPoints.map(pt => (
                    <rect key={pt.y}
                        x={SCREEN_X + 2} y={pt.y}
                        width={24} height={1.1}
                        fill={color}
                        opacity={pt.I * 0.9} />
                ))}

                {/* Fringe labels */}
                {fringes.filter(f => Math.abs(f.n) <= 3 && f.y > 20 && f.y < H - 20).map(fr => (
                    <g key={fr.n}>
                        <line x1={SCREEN_X + 30} y1={fr.y} x2={SCREEN_X + 46} y2={fr.y}
                            stroke="rgba(255,255,255,0.15)" strokeWidth={0.5} />
                        <text x={SCREEN_X + 48} y={fr.y + 4}
                            style={{ fontSize: 8, fill: 'rgba(255,255,255,0.3)', fontFamily: 'var(--mono)' }}>
                            {fr.n === 0 ? 'n=0' : `n=${fr.n}`}
                        </text>
                    </g>
                ))}

                {/* Distance arrow */}
                <line x1={SLIT_X + 5} y1={H - 14} x2={SCREEN_X} y2={H - 14}
                    stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
                <text x={(SLIT_X + SCREEN_X) / 2} y={H - 4} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(255,255,255,0.25)', fontFamily: 'var(--mono)' }}>
                    D={D}cm
                </text>

                {/* Fringe width beta */}
                {fringes[nFringes] && fringes[nFringes + 1] && (
                    <>
                        <line x1={SCREEN_X - 10} y1={fringes[nFringes].y}
                            x2={SCREEN_X - 10} y2={fringes[nFringes + 1].y}
                            stroke="rgba(239,159,39,0.4)" strokeWidth={1} />
                        <text x={SCREEN_X - 14} y={(fringes[nFringes].y + fringes[nFringes + 1].y) / 2 + 4}
                            textAnchor="end"
                            style={{ fontSize: 9, fill: 'rgba(239,159,39,0.6)', fontFamily: 'var(--mono)' }}>β</text>
                    </>
                )}

                {/* Wavelength colour swatch */}
                <rect x={12} y={12} width={40} height={12} rx={3}
                    fill={color} opacity={0.8} />
                <text x={56} y={22}
                    style={{ fontSize: 9, fill: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>
                    {lambda}nm
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {[
                    { label: 'Fringe width β', val: `${beta.toFixed(3)} mm`, color: 'var(--amber)' },
                    { label: 'β = λD/d', val: `${(lambda / 1e6).toFixed(4)}×${D}/${d}`, color: 'var(--text3)' },
                    { label: 'Colour', val: lambda < 450 ? 'Violet' : lambda < 495 ? 'Blue' : lambda < 570 ? 'Green' : lambda < 620 ? 'Yellow' : lambda < 650 ? 'Orange' : 'Red', color },
                    { label: 'More fringes if', val: 'd↑ or D↓ or λ↑', color: 'var(--teal)' },
                ].map(c => (
                    <div key={c.label} style={{
                        background: 'var(--bg3)', borderRadius: 8,
                        padding: '10px 14px', border: '1px solid var(--border)', flex: 1, minWidth: 110,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}