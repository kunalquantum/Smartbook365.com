import { useState, useEffect, useRef, useMemo } from 'react'
import { generateNucleus } from './Nucleus'
import { generateElectrons } from './ElectronShells'
import { getShells } from './AtomData'
import ChemSlider from '../ui/ChemSlider'

export default function Atom3D({ z, mass, symbol, name, scale = 1, offsetX = 0, offsetY = 0, compact = false, ionCharge = 0, excitation = 0, temperature = 0, mobile = false }) {
    const pCount = z;
    const nCount = Math.round(mass) - z;
    const eCount = z - ionCharge;
    
    // Dynamic generation based on Electron Count
    const shells = useMemo(() => getShells(eCount), [eCount])
    const nuc = useMemo(() => generateNucleus(pCount, nCount), [nCount, pCount])
    
    // Animation Time
    const [t, setT] = useState(0)
    
    // Interaction states
    const [rot, setRot] = useState({ x: 15, y: 0 })
    const [dragActive, setDragActive] = useState(false)
    const [eSpeed, setESpeed] = useState(1)
    const [explode, setExplode] = useState(0)
    const [zoom, setZoom] = useState(1)
    
    // Advanced Visualization Toggles
    const [viewMode, setViewMode] = useState('orbital') // 'orbital' | 'cloud'
    const [showNucleus, setShowNucleus] = useState(true)
    const [energyLevels, setEnergyLevels] = useState(false)
    const [focusShell, setFocusShell] = useState('All') // 'All' | '0' | '1' ...
    
    const lastPos = useRef({ x: 0, y: 0 })
    const speedRef = useRef(eSpeed)
    const zoomRef = useRef(1)

    useEffect(() => {
        speedRef.current = eSpeed
    }, [eSpeed])
    
    // Animation Loop
    useEffect(() => {
        let frame;
        let lastTime = 0;
        const loop = (time) => {
            if (lastTime === 0) lastTime = time;
            const dt = (time - lastTime) / 1000;
            lastTime = time;
            
            if (speedRef.current > 0) {
                setT(curr => curr + dt * speedRef.current)
            }
            
            const targetZoom = focusShell === 'All' ? 1 : 120 / (35 + parseInt(focusShell) * 25)
            const nextZoom = zoomRef.current + (targetZoom - zoomRef.current) * (dt * 6)
            zoomRef.current = nextZoom
            setZoom(nextZoom)
            
            frame = requestAnimationFrame(loop)
        }
        frame = requestAnimationFrame(loop)
        return () => cancelAnimationFrame(frame)
    }, [focusShell])

    const handlePointerDown = (e) => {
        e.target.setPointerCapture(e.pointerId);
        lastPos.current = { x: e.clientX, y: e.clientY };
        setDragActive(true);
    };
    const handlePointerMove = (e) => {
        if (!dragActive) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        lastPos.current = { x: e.clientX, y: e.clientY };
        setRot(prev => ({ 
            x: Math.max(-90, Math.min(90, prev.x - dy * 0.4)), 
            y: prev.y + dx * 0.4 
        }));
    };
    const handlePointerUp = (e) => {
        e.target.releasePointerCapture(e.pointerId);
        setDragActive(false);
    };

    // pass temp & excitation to generateElectrons
    const { particles: electrons, segments, labels } = generateElectrons(shells, t, temperature, excitation)

    const project = (pt) => {
        const radY = rot.y * Math.PI / 180
        const radX = rot.x * Math.PI / 180
        
        let pointScale = zoom * scale
        if (explode > 0) {
            if (pt.type === 'p' || pt.type === 'n') pointScale *= (1 + explode * 3)
            if (pt.type === 'e' || pt.type === 'ring' || pt.type === 'label') pointScale *= (1 + explode * 0.4)
        }

        let sx = pt.x * pointScale
        let sy = pt.y * pointScale
        let sz = pt.z * pointScale
        
        let x1 = sx * Math.cos(radY) + sz * Math.sin(radY)
        let z1 = -sx * Math.sin(radY) + sz * Math.cos(radY)
        let y2 = sy * Math.cos(radX) - z1 * Math.sin(radX)
        let z2 = sy * Math.sin(radX) + z1 * Math.cos(radX)
        
        return { ...pt, px: 200 + x1 + offsetX, py: 150 + y2 + offsetY, pz: z2 }
    }

    const allProj = [
        ...(showNucleus ? nuc : []).map(project),
        ...(viewMode === 'orbital' ? electrons : []).map(project)
    ]
    
    const projSegments = segments.map(s => ({
        ...s,
        a: project({ ...s.a, type: 'ring' }), 
        b: project({ ...s.b, type: 'ring' })
    }))

    const projLabels = (energyLevels ? labels : []).map(l => project({...l, type: 'label'}))
    
    const renderItems = [
        ...allProj.map(p => ({ ...p, mz: p.pz })),
        ...projSegments.map(s => ({ ...s, mz: (s.a.pz + s.b.pz) / 2 }))
    ].sort((a, b) => a.mz - b.mz)

    const btnStyle = (active) => ({
        padding: mobile ? '8px 10px' : '6px 12px', borderRadius: 6, fontSize: mobile ? 11 : 12, fontWeight: 600, fontFamily: 'var(--mono)', cursor: 'pointer',
        background: active ? 'var(--blue)' : 'var(--bg2)',
        color: active ? '#fff' : 'var(--text2)',
        border: `1px solid ${active ? 'var(--blue)' : 'var(--border)'}`,
        transition: 'all 0.2s', whiteSpace: 'nowrap'
    });

    const chargeSymbol = ionCharge === 0 ? '' : (Math.abs(ionCharge) === 1 ? (ionCharge > 0 ? '+' : '−') : `${Math.abs(ionCharge)}${ionCharge > 0 ? '+' : '−'}`);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 0 : 16, height: compact ? '100%' : 'auto' }}>
            <div style={{ 
                position: 'relative', 
                width: '100%', 
                height: compact ? '100%' : 'auto',
                aspectRatio: compact ? 'none' : '4/3', 
                borderRadius: 12, 
                overflow: compact ? 'visible' : 'hidden' 
            }}>
                {!compact && (
                    <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, fontFamily: 'var(--mono)', color: 'rgba(255,255,255,0.4)', pointerEvents: 'none' }}>
                        👆 CLICK & DRAG TO SPIN
                    </div>
                )}

                <svg 
                    viewBox="0 0 400 300" 
                    style={{ width: '100%', height: '100%', background: 'none', cursor: dragActive ? 'grabbing' : 'grab', touchAction: 'none' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <defs>
                        <radialGradient id="sphere3D" cx="30%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
                            <stop offset="40%" stopColor="#fff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
                        </radialGradient>
                        <filter id="cloudBlur">
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                    </defs>
                    {!compact && (
                        <>
                            <text x="200" y="30" textAnchor="middle" fill="#fff" style={{ fontSize: 16, fontFamily: 'var(--mono)', fontWeight: 700 }}>
                                {name} ({symbol}<sup>{chargeSymbol}</sup>)
                            </text>
                            <text x="200" y="50" textAnchor="middle" fill="var(--text2)" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>
                                {pCount} Protons • {nCount} Neutrons • {eCount} Electrons
                            </text>
                        </>
                    )}
                    
                    {renderItems.map((item, i) => {
                        const isFocused = focusShell === 'All' || item.sIdx === parseInt(focusShell);
                        const op = focusShell === 'All' ? 1 : (isFocused ? 1 : 0.05);

                        if (item.type === 'ring') {
                            if (viewMode === 'cloud') {
                                return <line key={`rc${i}`} x1={item.a.px} y1={item.a.py} x2={item.b.px} y2={item.b.py} stroke="#1D9E75" strokeOpacity={op * 0.4} strokeWidth={20 * zoom * scale} strokeLinecap="round" filter="url(#cloudBlur)" pointerEvents="none" />
                            } else {
                                return <line key={`r${i}`} x1={item.a.px} y1={item.a.py} x2={item.b.px} y2={item.b.py} stroke="rgba(255,255,255,0.15)" strokeWidth={1.5 * zoom * scale} strokeOpacity={op} strokeLinecap="round" pointerEvents="none" />
                            }
                        } else if (item.type === 'p' || item.type === 'n') {
                            const nOp = focusShell !== 'All' ? 0.2 : 1;
                            return (
                                <g key={item.id} opacity={nOp}>
                                    <circle cx={item.px} cy={item.py} r={item.r * zoom * scale} fill={item.color} pointerEvents="none" />
                                    <circle cx={item.px} cy={item.py} r={item.r * zoom * scale} fill="url(#sphere3D)" pointerEvents="none" />
                                </g>
                            )
                        } else if (item.type === 'e') {
                            const finalR = item.r * (1 + explode) * zoom * scale
                            return (
                                <g key={item.id} opacity={op}>
                                    <circle cx={item.px} cy={item.py} r={finalR} fill={item.color} pointerEvents="none" />
                                    <circle cx={item.px} cy={item.py} r={finalR} fill="url(#sphere3D)" pointerEvents="none" />
                                </g>
                            )
                        }
                        return null;
                    })}

                    {projLabels.map((l, i) => {
                        const isFocused = focusShell === 'All' || l.sIdx === parseInt(focusShell);
                        return (
                            <text key={`l${i}`} x={l.px} y={l.py} fill="#FFF" opacity={isFocused ? 1 : 0.1} style={{ fontSize: 13, fontFamily: 'var(--mono)', fontWeight: 600, pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' }}>
                                {l.text}
                            </text>
                        )
                    })}
                </svg>
            </div>

            {!compact && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px', background: 'var(--bg3)', borderRadius: 12, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <button onClick={() => setViewMode(v => v === 'orbital' ? 'cloud' : 'orbital')} style={btnStyle(viewMode === 'cloud')}>☁️ Cloud View</button>
                        <button onClick={() => setShowNucleus(v => !v)} style={btnStyle(showNucleus)}>🔴 Nucleus</button>
                        <button onClick={() => setEnergyLevels(v => !v)} style={btnStyle(energyLevels)}>📈 Energy Levels</button>
                        
                        <select value={focusShell} onChange={e => setFocusShell(e.target.value)} style={{ padding: mobile ? '8px 10px' : '6px 12px', borderRadius: 6, background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: mobile ? 11 : 12, outline: 'none', cursor: 'pointer', width: mobile ? '100%' : 'auto' }}>
                            <option value="All">🔭 Focus: Entire Atom</option>
                            {shells.map((_, i) => <option key={i} value={i}>🔭 Focus: {['K', 'L', 'M', 'N'][i]} Shell</option>)}
                        </select>
                    </div>

                    <ChemSlider label="Rotate 3D" unit="°" value={Math.round(((rot.y % 360) + 360) % 360)} min={0} max={360} step={1} onChange={(v) => setRot(p => ({...p, y: v}))} color="var(--blue)" />
                    <ChemSlider label="Orbit Speed" unit="x" value={eSpeed} min={0} max={4} step={0.1} onChange={setESpeed} color="var(--teal)" />
                    <ChemSlider label="Deconstruct" unit="%" value={Math.round(explode * 100)} min={0} max={100} step={1} onChange={(v) => setExplode(v / 100)} color="var(--coral)" />
                </div>
            )}
        </div>
    )
}
