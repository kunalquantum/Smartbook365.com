import { useState, useEffect, useRef } from 'react'
import ChemSlider from '../../components/ui/ChemSlider'
import ValueCard  from '../../components/ui/ValueCard'

const SYSTEMS = {
  'Iodine: water / CCl₄': {
    K: 85,
    organic: 'CCl₄',   organicColor: '#7F77DD',
    aqueous: 'Water',   aqueousColor: '#378ADD',
    solute:  'Iodine',  soluteColor:  '#D85A30',
    desc: 'K = [I₂]org / [I₂]aq = 85 — iodine strongly prefers CCl₄',
  },
  'Caffeine: water / DCM': {
    K: 4.6,
    organic: 'DCM',     organicColor: '#EF9F27',
    aqueous: 'Water',   aqueousColor: '#378ADD',
    solute:  'Caffeine',soluteColor:  '#1D9E75',
    desc: 'K = [Caff]org / [Caff]aq = 4.6',
  },
  'Benzoic acid: water / ether': {
    K: 10,
    organic: 'Ether',   organicColor: '#1D9E75',
    aqueous: 'Water',   aqueousColor: '#378ADD',
    solute:  'Benzoic acid', soluteColor: '#FAC775',
    desc: 'K = [BA]org / [BA]aq = 10',
  },
}

export default function SolventExtract() {
  const [system,   setSystem]   = useState('Iodine: water / CCl₄')
  const [nExtracts,setNExtracts]= useState(1)      // number of extractions
  const [Vorg,     setVorg]     = useState(50)     // volume organic solvent (mL)
  const [Vaq,      setVaq]      = useState(100)    // volume aqueous (mL)
  const [C0,       setC0]       = useState(0.1)    // initial concentration in aqueous (mol/L)
  const [shake,    setShake]    = useState(false)
  const [shakeAnim,setShakeAnim]= useState(0)

  const rafRef  = useRef(null)
  const lastRef = useRef(null)
  const tRef    = useRef(0)
  const [tick,  setTick] = useState(0)

  useEffect(() => {
    if (!shake) return
    const step = ts => {
      if (!lastRef.current) lastRef.current = ts
      tRef.current += (ts - lastRef.current) / 1000
      lastRef.current = ts
      setShakeAnim(Math.sin(tRef.current * 12) * 8)
      setTick(p => p+1)
      if (tRef.current > 1.5) { setShake(false); tRef.current=0; lastRef.current=null; setShakeAnim(0) }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(rafRef.current); lastRef.current = null }
  }, [shake])

  const sys  = SYSTEMS[system]
  const K    = sys.K
  const Vorg_L = Vorg / 1000
  const Vaq_L  = Vaq  / 1000

  // After n extractions with V_org / n each time
  const extractionEff = (nEx) => {
    const Vs = Vorg_L / nEx     // volume per extraction
    let Caq = C0
    for (let i = 0; i < nEx; i++) {
      Caq = Caq * Vaq_L / (Vaq_L + K * Vs)
    }
    const remaining    = Caq * Vaq_L          // mol remaining in aqueous
    const extracted    = C0 * Vaq_L - remaining // mol extracted
    const efficiency   = (extracted / (C0 * Vaq_L)) * 100
    return { remaining, extracted, efficiency, CaqFinal: Caq }
  }

  const single   = extractionEff(1)
  const multiple = extractionEff(nExtracts)

  // Layer concentrations for funnel visual
  const { CaqFinal } = multiple
  const CorgFinal = K * CaqFinal * (Vorg_L / nExtracts) / (Vorg_L / nExtracts)   // simplified display

  // Colour intensity based on concentration
  const orgAlpha  = Math.min(0.9, (multiple.extracted / (C0 * Vaq_L)) * 0.8 + 0.1)
  const aqAlpha   = Math.min(0.9, (multiple.remaining / (C0 * Vaq_L)) * 0.8 + 0.05)

  return (
    <div>
      {/* System selector */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
        {Object.keys(SYSTEMS).map(k => (
          <button key={k} onClick={() => setSystem(k)} style={{
            padding:'3px 9px', borderRadius:20, fontSize:10,
            fontFamily:'var(--mono)', cursor:'pointer',
            background: system===k ? 'var(--teal)' : 'var(--bg3)',
            color: system===k ? '#fff' : 'var(--text2)',
            border:`1px solid ${system===k?'var(--teal)':'var(--border)'}`,
          }}>{k}</button>
        ))}
      </div>

      {/* System description */}
      <div style={{ padding:'8px 14px', background:'rgba(0,0,0,0.2)', border:'1px solid var(--border)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)' }}>
        {sys.desc}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
        <ChemSlider label="V organic (mL)" unit=" mL" value={Vorg} min={10} max={200} step={10} onChange={setVorg} color={sys.organicColor} />
        <ChemSlider label="V aqueous (mL)"  unit=" mL" value={Vaq}  min={10} max={500} step={10} onChange={setVaq}  color={sys.aqueousColor} />
        <ChemSlider label="Initial [solute]" unit=" mol/L" value={C0} min={0.01} max={1} step={0.01} onChange={setC0} color={sys.soluteColor} precision={3} />
        <ChemSlider label="No. of extractions" unit="" value={nExtracts} min={1} max={8} step={1} onChange={setNExtracts} color="var(--gold)" />
      </div>

      {/* Main layout: funnel | comparison */}
      <div style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:16, marginBottom:14 }}>

        {/* Separating funnel */}
        <div style={{ background:'rgba(0,0,0,0.2)', border:'1px solid var(--border)', borderRadius:12, padding:14, display:'flex', flexDirection:'column', alignItems:'center' }}>
          <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--teal)', letterSpacing:1.5, marginBottom:8 }}>
            SEP. FUNNEL
          </div>

          <svg viewBox="0 0 140 220" width="100%"
            style={{ transform:`translateX(${shakeAnim}px)`, transition:'transform 0.02s' }}>
            {/* Stopper */}
            <ellipse cx={70} cy={16} rx={14} ry={6}
              fill="rgba(239,159,39,0.3)" stroke="var(--gold)" strokeWidth={1.5} />

            {/* Funnel top neck */}
            <rect x={62} y={22} width={16} height={14}
              fill="rgba(55,138,221,0.05)"
              stroke="rgba(55,138,221,0.2)" strokeWidth={1} />

            {/* Pear-shaped body */}
            <path d="M 62 36 L 55 90 L 48 130 Q 40 160 70 172 Q 100 160 92 130 L 85 90 L 78 36 Z"
              fill="rgba(55,138,221,0.05)"
              stroke="rgba(55,138,221,0.25)" strokeWidth={1.5} />

            {/* Organic layer (top — lighter) */}
            <clipPath id="funnelClip">
              <path d="M 62 36 L 55 90 L 48 130 Q 40 160 70 172 Q 100 160 92 130 L 85 90 L 78 36 Z" />
            </clipPath>
            <rect x={40} y={36} width={60} height={60}
              fill={`${sys.organicColor}`} opacity={orgAlpha * 0.35}
              clipPath="url(#funnelClip)" />
            <rect x={40} y={96} width={60} height={76}
              fill={`${sys.aqueousColor}`} opacity={aqAlpha * 0.35}
              clipPath="url(#funnelClip)" />

            {/* Layer interface line */}
            <line x1={48} y1={96} x2={92} y2={96}
              stroke="rgba(255,255,255,0.25)" strokeWidth={1}
              strokeDasharray="3 2" />

            {/* Layer labels */}
            <text x={70} y={72} textAnchor="middle"
              style={{fontSize:8,fill:sys.organicColor,fontFamily:'var(--mono)',fontWeight:700}}>
              {sys.organic}
            </text>
            <text x={70} y={82} textAnchor="middle"
              style={{fontSize:7,fill:`${sys.organicColor}90`,fontFamily:'var(--mono)'}}>
              (less dense)
            </text>
            <text x={70} y={120} textAnchor="middle"
              style={{fontSize:8,fill:sys.aqueousColor,fontFamily:'var(--mono)',fontWeight:700}}>
              {sys.aqueous}
            </text>
            <text x={70} y={130} textAnchor="middle"
              style={{fontSize:7,fill:`${sys.aqueousColor}90`,fontFamily:'var(--mono)'}}>
              (more dense)
            </text>

            {/* Stopcock */}
            <rect x={64} y={172} width={12} height={18}
              rx={2} fill="rgba(239,159,39,0.3)"
              stroke="var(--gold)" strokeWidth={1} />
            <rect x={58} y={178} width={24} height={6}
              rx={3} fill="rgba(239,159,39,0.4)"
              stroke="var(--gold)" strokeWidth={0.8} />

            {/* Tip */}
            <path d="M 66 190 L 70 208 L 74 190 Z"
              fill="rgba(55,138,221,0.1)"
              stroke="rgba(55,138,221,0.3)" strokeWidth={1} />

            {/* Conical flask below */}
            <path d="M 58 210 L 50 220 L 90 220 L 82 210 Z"
              fill={`${sys.aqueousColor}15`}
              stroke={`${sys.aqueousColor}30`} strokeWidth={1} />
          </svg>

          <button onClick={() => setShake(true)} disabled={shake} style={{
            padding:'6px 14px', borderRadius:6, fontSize:11,
            fontFamily:'var(--mono)', cursor:'pointer', marginTop:4,
            background:'rgba(29,158,117,0.12)', color:'var(--teal)',
            border:'1px solid rgba(29,158,117,0.3)',
          }}>
            {shake ? 'Mixing…' : '🔄 Shake'}
          </button>
        </div>

        {/* Comparison panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--teal)', letterSpacing:1.5 }}>
            EXTRACTION EFFICIENCY
          </div>

          {/* Formula */}
          <div style={{ padding:'10px 14px', background:'var(--bg3)', border:'1px solid var(--border2)', borderRadius:8, fontFamily:'var(--mono)', fontSize:11, color:'var(--text2)', lineHeight:1.8 }}>
            K = [X]<sub>org</sub> / [X]<sub>aq</sub> = <span style={{color:'var(--gold)',fontWeight:700}}>{K}</span>
            <br/>After {nExtracts} extraction{nExtracts>1?'s':''} of {Vorg}mL ÷ {nExtracts}:
          </div>

          {/* Single vs multiple comparison */}
          {[
            { label:'1 extraction (all volume at once)', eff:single.efficiency,   col:'var(--coral)' },
            { label:`${nExtracts} extraction${nExtracts>1?'s':''} (${(Vorg/nExtracts).toFixed(0)}mL each)`, eff:multiple.efficiency, col:'var(--teal)' },
          ].map((row, i) => (
            <div key={i} style={{ padding:'10px 14px', background:`${row.col}10`, border:`1px solid ${row.col}30`, borderRadius:8 }}>
              <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text2)', marginBottom:6 }}>
                {row.label}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ flex:1, height:14, background:'var(--bg3)', borderRadius:7, overflow:'hidden' }}>
                  <div style={{
                    height:'100%', width:`${row.eff}%`,
                    background:row.col, borderRadius:7,
                    transition:'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize:14, fontFamily:'var(--mono)', fontWeight:700, color:row.col, minWidth:50 }}>
                  {row.eff.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}

          {/* Improvement */}
          {nExtracts > 1 && (
            <div style={{ padding:'10px 14px', background:'rgba(212,160,23,0.08)', border:'1px solid rgba(212,160,23,0.25)', borderRadius:8, fontFamily:'var(--mono)', fontSize:12, color:'var(--gold)' }}>
              +{(multiple.efficiency - single.efficiency).toFixed(1)}% improvement by using {nExtracts} smaller extractions vs 1 large extraction
            </div>
          )}

          {/* Remaining in aqueous */}
          <div style={{ padding:'10px 14px', background:'var(--bg3)', border:'1px solid var(--border)', borderRadius:8 }}>
            <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', marginBottom:6 }}>
              Remaining in aqueous phase after {nExtracts} extraction{nExtracts>1?'s':''}:
            </div>
            <div style={{ height:10, background:`${sys.aqueousColor}20`, borderRadius:5, overflow:'hidden' }}>
              <div style={{
                height:'100%',
                width:`${(multiple.remaining/(C0*Vaq_L))*100}%`,
                background:sys.aqueousColor, borderRadius:5,
              }} />
            </div>
            <div style={{ fontSize:11, fontFamily:'var(--mono)', color:sys.aqueousColor, marginTop:4 }}>
              {((multiple.remaining/(C0*Vaq_L))*100).toFixed(1)}% remaining  ·  {multiple.remaining.toFixed(5)} mol
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <ValueCard label="Partition coeff K" value={K.toString()} color="var(--gold)" highlight />
        <ValueCard label="Extraction efficiency" value={`${multiple.efficiency.toFixed(2)}%`} color="var(--teal)" />
        <ValueCard label="Extracted (mol)" value={multiple.extracted.toFixed(5)} color={sys.soluteColor} />
        <ValueCard label="Still in aq. phase" value={`${multiple.remaining.toFixed(5)} mol`} color={sys.aqueousColor} />
      </div>
    </div>
  )
}