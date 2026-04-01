import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460

export default function VernierCaliper() {
    const [mm, setMm] = useState(23.4)
    const [tool, setTool] = useState('vernier')  // vernier | screw

    // ── VERNIER CALIPER ──────────────────────────────────────
    const mainScale = Math.floor(mm)
    const vernierDiv = Math.round((mm % 1) * 10)
    const LC_V = 0.1   // mm least count
    const reading_V = mainScale + vernierDiv * LC_V

    // ── SCREW GAUGE ──────────────────────────────────────────
    const pitch = 0.5   // mm per revolution
    const thimbleDiv = 50    // divisions on thimble
    const LC_S = pitch / thimbleDiv   // 0.01 mm
    const mainS = Math.floor(mm / pitch) * pitch
    const thimblePos = ((mm % pitch) / pitch) * thimbleDiv
    const reading_S = mainS + thimblePos * LC_S

    // ── SVG constants ─────────────────────────────────────────
    const H_V = 120, H_S = 160

    // VERNIER dimensions
    const RAIL_Y = 50, RAIL_H = 20
    const SCALE = 16   // px per mm (main scale)
    const BASE_X = 30   // left edge of main scale

    const jawPos = BASE_X + mm * SCALE
    const nMainDiv = Math.ceil((W - BASE_X - 30) / SCALE)

    // SCREW gauge positions
    const BARREL_X = 60, BARREL_Y = 70
    const BARREL_W = 280, BARREL_H = 30
    const THIMBLE_W = 60

    return (
        <div>
            {/* Tool selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['vernier', 'screw'].map(t => (
                    <button key={t} onClick={() => setTool(t)} style={{
                        padding: '5px 18px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: tool === t ? 'var(--amber)' : 'var(--bg3)',
                        color: tool === t ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{t === 'vernier' ? 'Vernier Caliper' : 'Screw Gauge'}</button>
                ))}
            </div>

            <SimSlider
                label={tool === 'vernier' ? 'Object width' : 'Object diameter'}
                unit=" mm" value={mm} min={0} max={20} step={0.1}
                onChange={setMm} />

            {tool === 'vernier' && (
                <>
                    <svg viewBox={`0 0 ${W} ${H_V}`} width="100%"
                        style={{ display: 'block', marginBottom: 14, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                        {/* Fixed jaw (left) */}
                        <rect x={BASE_X - 2} y={RAIL_Y - 20} width={12} height={RAIL_H + 20}
                            rx={3} fill="rgba(55,138,221,0.2)"
                            stroke="rgba(55,138,221,0.5)" strokeWidth={1.5} />

                        {/* Main scale rail */}
                        <rect x={BASE_X} y={RAIL_Y} width={W - BASE_X - 20} height={RAIL_H}
                            rx={3} fill="rgba(160,176,200,0.08)"
                            stroke="rgba(160,176,200,0.2)" strokeWidth={1} />

                        {/* Main scale ticks */}
                        {Array.from({ length: nMainDiv + 1 }, (_, i) => {
                            const x = BASE_X + i * SCALE
                            const isMM = true
                            const is5 = i % 5 === 0
                            const is10 = i % 10 === 0
                            return (
                                <g key={i}>
                                    <line x1={x} y1={RAIL_Y} x2={x}
                                        y2={RAIL_Y - (is10 ? 14 : is5 ? 10 : 6)}
                                        stroke="rgba(160,176,200,0.5)"
                                        strokeWidth={is10 ? 1.5 : 0.8} />
                                    {is10 && (
                                        <text x={x} y={RAIL_Y - 18} textAnchor="middle"
                                            style={{ fontSize: 10, fill: 'rgba(160,176,200,0.6)', fontFamily: 'var(--mono)' }}>
                                            {i}
                                        </text>
                                    )}
                                </g>
                            )
                        })}

                        {/* "mm" label */}
                        <text x={W - 18} y={RAIL_Y - 6}
                            style={{ fontSize: 8, fill: 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>mm</text>

                        {/* Moving jaw */}
                        <rect x={jawPos - 4} y={RAIL_Y - 20} width={12} height={RAIL_H + 20}
                            rx={3} fill="rgba(239,159,39,0.2)"
                            stroke="#EF9F27" strokeWidth={2} />

                        {/* Vernier scale on moving jaw */}
                        {Array.from({ length: 11 }, (_, i) => {
                            const vSpacing = SCALE * 0.9
                            const x = jawPos - 4 + i * vSpacing / 1
                            const isCoincide = i === vernierDiv
                            return (
                                <g key={i}>
                                    <line x1={x} y1={RAIL_Y + RAIL_H}
                                        x2={x} y2={RAIL_Y + RAIL_H + (isCoincide ? 16 : 10)}
                                        stroke={isCoincide ? '#EF9F27' : 'rgba(239,159,39,0.4)'}
                                        strokeWidth={isCoincide ? 2.5 : 0.8} />
                                    {(i % 5 === 0) && (
                                        <text x={x} y={RAIL_Y + RAIL_H + 24} textAnchor="middle"
                                            style={{ fontSize: 8, fill: isCoincide ? '#EF9F27' : 'rgba(160,176,200,0.4)', fontFamily: 'var(--mono)' }}>
                                            {i}
                                        </text>
                                    )}
                                </g>
                            )
                        })}

                        {/* Coinciding line highlight */}
                        <line
                            x1={jawPos - 4 + vernierDiv * SCALE * 0.9}
                            y1={RAIL_Y + RAIL_H - 2}
                            x2={jawPos - 4 + vernierDiv * SCALE * 0.9}
                            y2={RAIL_Y + RAIL_H + 18}
                            stroke="#EF9F27" strokeWidth={3} opacity={0.6} />

                        {/* Gap measurement arrows */}
                        <line x1={BASE_X + 8} y1={RAIL_Y - 28}
                            x2={jawPos - 4} y2={RAIL_Y - 28}
                            stroke="rgba(29,158,117,0.5)" strokeWidth={1} />
                        <text x={(BASE_X + 8 + jawPos - 4) / 2} y={RAIL_Y - 32} textAnchor="middle"
                            style={{ fontSize: 10, fill: 'rgba(29,158,117,0.8)', fontFamily: 'var(--mono)', fontWeight: 600 }}>
                            {reading_V.toFixed(1)} mm
                        </text>

                        {/* Label */}
                        <text x={W / 2} y={H_V - 6} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            Vernier caliper  |  LC = 1 MSD − 1 VSD = {LC_V} mm
                        </text>
                    </svg>

                    {/* Reading breakdown */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Main scale (MS)', val: `${mainScale} mm`, color: 'var(--teal)' },
                            { label: `Vernier ×LC (${LC_V})`, val: `${vernierDiv} div`, color: 'var(--amber)' },
                            { label: 'Total reading', val: `${reading_V.toFixed(1)} mm`, color: 'var(--amber)', hl: true },
                            { label: 'Formula', val: `MS + VS×LC`, color: 'var(--text3)' },
                        ].map(c => (
                            <div key={c.label} style={{
                                background: 'var(--bg3)', borderRadius: 8,
                                padding: '10px 14px',
                                border: `1px solid ${c.hl ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`,
                                flex: 1, minWidth: 100,
                            }}>
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {tool === 'screw' && (
                <>
                    <svg viewBox={`0 0 ${W} ${H_S}`} width="100%"
                        style={{ display: 'block', marginBottom: 14, background: 'rgba(0,0,0,0.15)', borderRadius: 8 }}>

                        {/* Anvil (fixed) */}
                        <rect x={30} y={BARREL_Y - 5} width={30} height={BARREL_H + 10}
                            rx={4} fill="rgba(55,138,221,0.2)"
                            stroke="rgba(55,138,221,0.5)" strokeWidth={2} />
                        <text x={45} y={BARREL_Y - 12} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(55,138,221,0.5)', fontFamily: 'var(--mono)' }}>anvil</text>

                        {/* Barrel (sleeve) */}
                        <rect x={BARREL_X} y={BARREL_Y} width={BARREL_W} height={BARREL_H}
                            rx={4} fill="rgba(160,176,200,0.08)"
                            stroke="rgba(160,176,200,0.25)" strokeWidth={1.5} />

                        {/* Barrel main scale (0.5mm divisions) */}
                        {Array.from({ length: Math.ceil(mm / 0.5) + 6 }, (_, i) => {
                            const x = BARREL_X + i * (SCALE * 0.5)
                            const isMM = i % 2 === 0
                            return (
                                <g key={i}>
                                    <line x1={x} y1={BARREL_Y}
                                        x2={x} y2={BARREL_Y - (isMM ? 12 : 7)}
                                        stroke="rgba(160,176,200,0.4)"
                                        strokeWidth={isMM ? 1.5 : 0.8} />
                                    {isMM && i % 4 === 0 && (
                                        <text x={x} y={BARREL_Y - 16} textAnchor="middle"
                                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.5)', fontFamily: 'var(--mono)' }}>
                                            {i / 2}
                                        </text>
                                    )}
                                </g>
                            )
                        })}

                        {/* Barrel reference line */}
                        <line x1={BARREL_X} y1={BARREL_Y + BARREL_H / 2}
                            x2={BARREL_X + BARREL_W} y2={BARREL_Y + BARREL_H / 2}
                            stroke="rgba(160,176,200,0.3)" strokeWidth={0.5} />

                        {/* Thimble (rotating drum) */}
                        {(() => {
                            const thimbleX = BARREL_X + mm * SCALE
                            const rotation = (mm / pitch) * 360   // degrees

                            return (
                                <g>
                                    {/* Thimble cylinder */}
                                    <rect x={thimbleX} y={BARREL_Y - 8}
                                        width={THIMBLE_W} height={BARREL_H + 16}
                                        rx={4} fill="rgba(239,159,39,0.15)"
                                        stroke="#EF9F27" strokeWidth={2} />

                                    {/* Thimble divisions */}
                                    {Array.from({ length: thimbleDiv }, (_, i) => {
                                        const yFrac = (i / thimbleDiv + (thimblePos / thimbleDiv)) % 1
                                        const ty = BARREL_Y - 8 + yFrac * (BARREL_H + 16)
                                        const isCoinc = Math.round(thimblePos) === i
                                        const isLabel = i % 10 === 0
                                        return (
                                            <g key={i}>
                                                <line x1={thimbleX} y1={ty}
                                                    x2={thimbleX + (isCoinc ? 22 : isLabel ? 18 : 12)} y2={ty}
                                                    stroke={isCoinc ? '#EF9F27' : 'rgba(239,159,39,0.35)'}
                                                    strokeWidth={isCoinc ? 2 : 0.8} />
                                                {isLabel && (
                                                    <text x={thimbleX + 24} y={ty + 3}
                                                        style={{ fontSize: 8, fill: isCoinc ? '#EF9F27' : 'rgba(160,176,200,0.35)', fontFamily: 'var(--mono)' }}>
                                                        {i}
                                                    </text>
                                                )}
                                            </g>
                                        )
                                    })}

                                    {/* Reference line on thimble */}
                                    <line x1={thimbleX} y1={BARREL_Y + BARREL_H / 2}
                                        x2={thimbleX + THIMBLE_W} y2={BARREL_Y + BARREL_H / 2}
                                        stroke="rgba(239,159,39,0.6)" strokeWidth={1.5} />

                                    {/* Thimble label */}
                                    <text x={thimbleX + THIMBLE_W / 2} y={BARREL_Y - 16} textAnchor="middle"
                                        style={{ fontSize: 9, fill: 'rgba(239,159,39,0.5)', fontFamily: 'var(--mono)' }}>
                                        thimble
                                    </text>
                                </g>
                            )
                        })()}

                        {/* Spindle → object → anvil */}
                        <rect x={58} y={BARREL_Y + BARREL_H / 2 - 3}
                            width={BARREL_X + mm * SCALE - 60} height={6}
                            rx={2} fill="rgba(160,176,200,0.2)" />

                        {/* Reading label */}
                        <text x={W / 2} y={H_S - 24} textAnchor="middle"
                            style={{ fontSize: 11, fill: '#EF9F27', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                            Reading = {reading_S.toFixed(2)} mm
                        </text>
                        <text x={W / 2} y={H_S - 10} textAnchor="middle"
                            style={{ fontSize: 9, fill: 'rgba(160,176,200,0.3)', fontFamily: 'var(--mono)' }}>
                            Screw gauge  |  Pitch = {pitch}mm  |  LC = pitch/divisions = {LC_S} mm
                        </text>
                    </svg>

                    {/* Reading breakdown */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Main scale (MS)', val: `${mainS.toFixed(1)} mm`, color: 'var(--teal)' },
                            { label: 'Thimble reading', val: `${Math.round(thimblePos)} div`, color: 'var(--amber)' },
                            { label: 'Thimble × LC', val: `${(thimblePos * LC_S).toFixed(3)} mm`, color: 'var(--amber)' },
                            { label: 'Total reading', val: `${reading_S.toFixed(2)} mm`, color: 'var(--amber)', hl: true },
                        ].map(c => (
                            <div key={c.label} style={{
                                background: 'var(--bg3)', borderRadius: 8,
                                padding: '10px 14px',
                                border: `1px solid ${c.hl ? 'rgba(239,159,39,0.4)' : 'var(--border)'}`,
                                flex: 1, minWidth: 100,
                            }}>
                                <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginBottom: 4 }}>{c.label}</div>
                                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--mono)', color: c.color }}>{c.val}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}