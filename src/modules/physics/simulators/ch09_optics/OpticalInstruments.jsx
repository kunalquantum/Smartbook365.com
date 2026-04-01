import { useState } from 'react'
import SimSlider from '../../components/ui/SimSlider'

const W = 460, H = 260
const CY = H / 2

export default function OpticalInstruments() {
    const [inst, setInst] = useState('microscope')
    const [fo, setFo] = useState(1)    // objective focal length cm
    const [fe, setFe] = useState(5)    // eyepiece focal length cm
    const [L, setL] = useState(15)   // tube length cm
    const [D, setD] = useState(25)   // near point cm

    // Magnifications
    const M_micro = (L / fo) * (D / fe)
    const M_scope = fo / fe   // astronomical telescope (inverted)

    const M = inst === 'microscope' ? M_micro : M_scope
    const label = inst === 'microscope' ? 'Compound Microscope' : 'Astronomical Telescope'

    // Simplified ray diagram positions
    const OBJ_X = inst === 'microscope' ? 60 : 40
    const EYE_X = inst === 'microscope' ? 380 : 400
    const OBJ_LENS_X = inst === 'microscope' ? 110 : 120
    const EYE_LENS_X = inst === 'microscope' ? 320 : 340

    // Intermediate image
    const imgX = inst === 'microscope' ? 260 : 260

    const lensShape = (cx, h, conv) => {
        const b = conv ? 14 : -10
        return `M ${cx} ${CY - h / 2} Q ${cx + b} ${CY} ${cx} ${CY + h / 2} Q ${cx - b} ${CY} ${cx} ${CY - h / 2} Z`
    }

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['microscope', 'telescope'].map(i => (
                    <button key={i} onClick={() => setInst(i)} style={{
                        padding: '5px 16px', borderRadius: 6, fontSize: 12,
                        fontFamily: 'var(--mono)', cursor: 'pointer', flex: 1,
                        background: inst === i ? 'var(--amber)' : 'var(--bg3)',
                        color: inst === i ? '#000' : 'var(--text2)',
                        border: '1px solid var(--border2)',
                    }}>{i}</button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
                <SimSlider label="fo (obj)" unit=" cm" value={fo} min={0.5} max={10} step={0.5} onChange={setFo} />
                <SimSlider label="fe (eye)" unit=" cm" value={fe} min={1} max={20} step={0.5} onChange={setFe} />
                {inst === 'microscope' && (
                    <SimSlider label="Tube L" unit=" cm" value={L} min={5} max={30} step={1} onChange={setL} />
                )}
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} width="100%"
                style={{ display: 'block', marginBottom: 12, background: 'rgba(0,0,0,0.12)', borderRadius: 8 }}>

                {/* Optical axis */}
                <line x1={20} y1={CY} x2={W - 20} y2={CY}
                    stroke="rgba(255,255,255,0.07)" strokeWidth={0.8} />

                {/* Object */}
                <line x1={OBJ_X} y1={CY} x2={OBJ_X} y2={CY - 28}
                    stroke="#FAC775" strokeWidth={2.5} />
                <circle cx={OBJ_X} cy={CY - 28} r={3} fill="#FAC775" />
                <text x={OBJ_X} y={CY + 14} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#FAC775', fontFamily: 'var(--mono)' }}>
                    {inst === 'microscope' ? 'Object' : 'Distant'}
                </text>

                {/* Objective lens */}
                <path d={lensShape(OBJ_LENS_X, 100, true)}
                    fill="rgba(55,138,221,0.15)" stroke="#378ADD" strokeWidth={2} />
                <text x={OBJ_LENS_X} y={CY + 58} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#378ADD', fontFamily: 'var(--mono)' }}>
                    Objective fo={fo}cm
                </text>

                {/* Intermediate image */}
                <line x1={imgX} y1={CY} x2={imgX} y2={CY + (inst === 'microscope' ? 38 : 22)}
                    stroke="rgba(216,90,48,0.6)" strokeWidth={2} strokeDasharray="3 2" />
                <text x={imgX} y={CY - 10} textAnchor="middle"
                    style={{ fontSize: 8, fill: 'rgba(216,90,48,0.6)', fontFamily: 'var(--mono)' }}>
                    {inst === 'microscope' ? 'Real image' : 'Image at ∞'}
                </text>

                {/* Eyepiece lens */}
                <path d={lensShape(EYE_LENS_X, 100, true)}
                    fill="rgba(29,158,117,0.12)" stroke="#1D9E75" strokeWidth={2} />
                <text x={EYE_LENS_X} y={CY + 58} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#1D9E75', fontFamily: 'var(--mono)' }}>
                    Eyepiece fe={fe}cm
                </text>

                {/* Eye */}
                <ellipse cx={EYE_X} cy={CY} rx={10} ry={14}
                    fill="rgba(239,159,39,0.15)" stroke="#EF9F27" strokeWidth={1.5} />
                <circle cx={EYE_X} cy={CY} r={5}
                    fill="rgba(239,159,39,0.4)" />
                <text x={EYE_X} y={CY + 26} textAnchor="middle"
                    style={{ fontSize: 9, fill: '#EF9F27', fontFamily: 'var(--mono)' }}>Eye</text>

                {/* Rays — schematic */}
                {[CY - 20, CY, CY + 20].map((ry, i) => (
                    <line key={i}
                        x1={OBJ_X} y1={CY - 28}
                        x2={OBJ_LENS_X} y2={ry}
                        stroke="rgba(250,199,117,0.2)" strokeWidth={0.8} />
                ))}
                {[CY - 14, CY, CY + 14].map((ry, i) => (
                    <line key={i}
                        x1={EYE_LENS_X} y1={ry}
                        x2={EYE_X - 10} y2={CY + (i - 1) * 6}
                        stroke="rgba(29,158,117,0.2)" strokeWidth={0.8} />
                ))}

                {/* Magnification label */}
                <text x={W / 2} y={18} textAnchor="middle"
                    style={{ fontSize: 11, fill: 'var(--amber)', fontFamily: 'var(--mono)', fontWeight: 700 }}>
                    {label}  |M| = {M.toFixed(1)}×
                </text>
            </svg>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(inst === 'microscope' ? [
                    { label: 'M = (L/fo)(D/fe)', val: `${M_micro.toFixed(1)}×`, color: 'var(--amber)' },
                    { label: 'Objective mag', val: `${(L / fo).toFixed(1)}×`, color: 'var(--teal)' },
                    { label: 'Eyepiece mag', val: `${(D / fe).toFixed(1)}×`, color: 'var(--coral)' },
                    { label: 'Tube length L', val: `${L} cm`, color: 'var(--text2)' },
                ] : [
                    { label: 'M = fo/fe', val: `${M_scope.toFixed(1)}×`, color: 'var(--amber)' },
                    { label: 'Objective fo', val: `${fo} cm`, color: 'var(--teal)' },
                    { label: 'Eyepiece fe', val: `${fe} cm`, color: 'var(--coral)' },
                    { label: 'Tube length', val: `${fo + fe} cm`, color: 'var(--text2)' },
                ]).map(c => (
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