import { useState } from 'react'
import ValueCard from '../../components/ui/ValueCard'

const EN_DATA = [
  { sym:'H',  Z:1,  EN:2.20, group:1,  period:1, col:'#A8D8B9' },
  { sym:'Li', Z:3,  EN:0.98, group:1,  period:2, col:'#EF9F27' },
  { sym:'Be', Z:4,  EN:1.57, group:2,  period:2, col:'#FAC775' },
  { sym:'B',  Z:5,  EN:2.04, group:13, period:2, col:'#888780' },
  { sym:'C',  Z:6,  EN:2.55, group:14, period:2, col:'#A8D8B9' },
  { sym:'N',  Z:7,  EN:3.04, group:15, period:2, col:'#378ADD' },
  { sym:'O',  Z:8,  EN:3.44, group:16, period:2, col:'#D85A30' },
  { sym:'F',  Z:9,  EN:3.98, group:17, period:2, col:'#A8D8B9' },
  { sym:'Na', Z:11, EN:0.93, group:1,  period:3, col:'#EF9F27' },
  { sym:'Mg', Z:12, EN:1.31, group:2,  period:3, col:'#FAC775' },
  { sym:'Al', Z:13, EN:1.61, group:13, period:3, col:'#B4B2A9' },
  { sym:'Si', Z:14, EN:1.90, group:14, period:3, col:'#888780' },
  { sym:'P',  Z:15, EN:2.19, group:15, period:3, col:'#A8D8B9' },
  { sym:'S',  Z:16, EN:2.58, group:16, period:3, col:'#FAC775' },
  { sym:'Cl', Z:17, EN:3.16, group:17, period:3, col:'#A8D8B9' },
  { sym:'K',  Z:19, EN:0.82, group:1,  period:4, col:'#EF9F27' },
  { sym:'Ca', Z:20, EN:1.00, group:2,  period:4, col:'#FAC775' },
  { sym:'Br', Z:35, EN:2.96, group:17, period:4, col:'#A8D8B9' },
  { sym:'I',  Z:53, EN:2.66, group:17, period:5, col:'#7F77DD' },
]

// Bond pair for bond character predictor
const BOND_PAIRS = [
  ['H','F'],['H','Cl'],['H','Br'],['H','O'],['H','N'],['H','C'],['H','H'],
  ['Na','Cl'],['K','Br'],['Li','F'],['C','O'],['N','O'],['Si','O'],
  ['Na','F'],['Mg','O'],['Al','Cl'],['C','N'],['C','Cl'],
]

function bondCharacter(dEN) {
  if (dEN > 1.7) return { type:'Ionic',           color:'#EF9F27', pct:Math.min(100, (dEN-1.7)*30+70) }
  if (dEN > 0.4) return { type:'Polar covalent',  color:'#1D9E75', pct:Math.round(dEN/1.7*70) }
  return              { type:'Non-polar covalent',color:'#378ADD', pct:5 }
}

function ENColor(en) {
  // Low EN = red, mid = yellow, high EN = blue-green
  if (en < 1.5) return `rgba(216,90,48,${0.4 + en/1.5*0.4})`
  if (en < 2.5) return `rgba(239,159,39,${0.4 + (en-1.5)*0.4})`
  return `rgba(29,158,117,${0.4 + (en-2.5)/1.5*0.4})`
}

export default function Electronegativity() {
  const [tab,    setTab]    = useState('trend')
  const [bondA,  setBondA]  = useState('H')
  const [bondB,  setBondB]  = useState('Cl')
  const [selEl,  setSelEl]  = useState(null)

  const periods = [2,3,4]

  // Bond character
  const elA   = EN_DATA.find(e => e.sym === bondA)
  const elB   = EN_DATA.find(e => e.sym === bondB)
  const dEN   = elA && elB ? Math.abs(elA.EN - elB.EN) : 0
  const bchar = bondCharacter(dEN)

  // Halogens group 17
  const group17 = EN_DATA.filter(e => e.group === 17).sort((a,b) => a.period - b.period)

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[
          { k:'trend',  l:'EN trends'     },
          { k:'heatmap',l:'Heat map'       },
          { k:'bond',   l:'Bond character' },
        ].map(opt => (
          <button key={opt.k} onClick={() => setTab(opt.k)} style={{
            flex:1, padding:'5px 8px', borderRadius:6, fontSize:11,
            fontFamily:'var(--mono)', cursor:'pointer',
            background: tab===opt.k ? 'var(--purple)' : 'var(--bg3)',
            color: tab===opt.k ? '#fff' : 'var(--text2)',
            border:`1px solid ${tab===opt.k?'var(--purple)':'var(--border2)'}`,
          }}>{opt.l}</button>
        ))}
      </div>

      {/* ── TREND ── */}
      {tab === 'trend' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(127,119,221,0.08)', border:'1px solid rgba(127,119,221,0.25)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            <span style={{color:'var(--purple)',fontWeight:700}}>Electronegativity (Pauling scale)</span> increases across a period and decreases down a group. F = 4.0 (highest). Noble gases have no defined EN. Diagonal relationships share similar EN values.
          </div>

          {periods.map(p => {
            const pData = EN_DATA.filter(e => e.period === p && e.group < 19).sort((a,b) => a.group-b.group)
            return (
              <div key={p} style={{ marginBottom:16 }}>
                <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', letterSpacing:1.5, marginBottom:8 }}>
                  PERIOD {p}
                </div>
                {pData.map(el => (
                  <div key={el.sym}
                    onClick={() => setSelEl(selEl===el.sym?null:el.sym)}
                    style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, cursor:'pointer' }}>
                    <div style={{
                      width:30, height:30, borderRadius:5, flexShrink:0,
                      background:`${el.col}20`, border:`1.5px solid ${el.col}`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontFamily:'var(--mono)', fontWeight:700, color:el.col,
                    }}>{el.sym}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                        <span style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--text3)' }}>Pauling EN</span>
                        <span style={{ fontSize:11, fontFamily:'var(--mono)', fontWeight:700, color: ENColor(el.EN).replace(/rgba\(([^,]+),([^,]+),([^,]+),[^)]+\)/, 'rgb($1,$2,$3)') }}>
                          {el.EN !== null ? el.EN.toFixed(2) : 'N/A'}
                        </span>
                      </div>
                      <div style={{ height:10, background:'var(--bg3)', borderRadius:4, overflow:'hidden' }}>
                        <div style={{
                          height:'100%',
                          width:`${(el.EN/4)*100}%`,
                          background:ENColor(el.EN),
                          borderRadius:4, transition:'width 0.3s',
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          })}

          {/* Halogens down group */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', letterSpacing:1.5, marginBottom:8 }}>
              GROUP 17 — DOWN GROUP (EN decreases)
            </div>
            {group17.map(el => (
              <div key={el.sym} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <div style={{
                  width:36, height:36, borderRadius:5, flexShrink:0,
                  background:`${el.col}20`, border:`1.5px solid ${el.col}`,
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  fontSize:10, fontFamily:'var(--mono)', fontWeight:700, color:el.col,
                }}>
                  <div style={{ fontSize:7, color:`${el.col}70` }}>P{el.period}</div>
                  {el.sym}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ height:10, background:'var(--bg3)', borderRadius:4, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${(el.EN/4)*100}%`, background:ENColor(el.EN), borderRadius:4 }} />
                  </div>
                </div>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:el.col, minWidth:30 }}>{el.EN}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HEAT MAP ── */}
      {tab === 'heatmap' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(127,119,221,0.08)', border:'1px solid rgba(127,119,221,0.25)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            Colour intensity represents EN value. Darker blue-green = higher EN (F=4.0). Darker red = lower EN (Cs≈0.79).
          </div>

          {/* Heat map grid */}
          <div style={{ background:'rgba(0,0,0,0.2)', border:'1px solid var(--border)', borderRadius:12, padding:12, marginBottom:14 }}>
            <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--purple)', letterSpacing:2, marginBottom:12 }}>
              ⚗ ELECTRONEGATIVITY HEAT MAP
            </div>
            {[1,2,3,4].map(p => {
              const pData = EN_DATA.filter(e => e.period === p).sort((a,b)=>a.group-b.group)
              return (
                <div key={p} style={{ display:'flex', gap:3, marginBottom:3, alignItems:'center' }}>
                  <span style={{ fontSize:8, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:16 }}>P{p}</span>
                  {pData.map(el => (
                    <div key={el.sym}
                      onClick={() => setSelEl(selEl===el.sym?null:el.sym)}
                      style={{
                        width:40, height:40, borderRadius:5, cursor:'pointer',
                        background: ENColor(el.EN),
                        border: selEl===el.sym ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                        transition:'all 0.15s',
                      }}>
                      <div style={{ fontSize:10, fontFamily:'var(--mono)', fontWeight:700, color:'#fff', lineHeight:1.1 }}>{el.sym}</div>
                      <div style={{ fontSize:8, fontFamily:'var(--mono)', color:'rgba(255,255,255,0.8)' }}>{el.EN?.toFixed(1)}</div>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Colour scale */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)' }}>Low EN (0.8)</span>
            <div style={{ flex:1, height:12, borderRadius:6, background:'linear-gradient(90deg, rgba(216,90,48,0.7), rgba(239,159,39,0.7), rgba(29,158,117,0.8))' }} />
            <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)' }}>High EN (4.0)</span>
          </div>

          {/* Selected element */}
          {selEl && (() => {
            const el = EN_DATA.find(e=>e.sym===selEl)
            return el ? (
              <div style={{ padding:'12px 16px', background:`${el.col}12`, border:`1px solid ${el.col}35`, borderRadius:10 }}>
                <div style={{ fontSize:15, fontFamily:'var(--mono)', fontWeight:700, color:el.col }}>
                  {el.sym} — EN = {el.EN?.toFixed(2) ?? 'N/A'}
                </div>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', marginTop:4 }}>
                  Period {el.period} · Group {el.group} · {
                    el.EN > 3 ? 'Very high EN — strong electron attractor' :
                    el.EN > 2 ? 'Moderate-high EN — polar bonds' :
                    el.EN > 1 ? 'Low-moderate EN — slightly polar' :
                    'Very low EN — strong electron donor'
                  }
                </div>
              </div>
            ) : null
          })()}
        </div>
      )}

      {/* ── BOND CHARACTER ── */}
      {tab === 'bond' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(127,119,221,0.08)', border:'1px solid rgba(127,119,221,0.25)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            <span style={{color:'var(--purple)',fontWeight:700}}>ΔEN determines bond type:</span>
            {' '}ΔEN &gt; 1.7 → ionic. 0.4–1.7 → polar covalent. &lt;0.4 → non-polar covalent.
          </div>

          {/* Element pickers */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:14 }}>
            {[{label:'Atom A', val:bondA, set:setBondA},{label:'Atom B', val:bondB, set:setBondB}].map(picker => (
              <div key={picker.label}>
                <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', letterSpacing:1.5, marginBottom:8 }}>
                  {picker.label}
                </div>
                <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                  {EN_DATA.filter(e=>e.EN!==null).map(el => (
                    <button key={el.sym} onClick={() => picker.set(el.sym)} style={{
                      padding:'3px 8px', borderRadius:6, fontSize:11,
                      fontFamily:'var(--mono)', cursor:'pointer', fontWeight:700,
                      background: picker.val===el.sym ? el.col : `${el.col}15`,
                      color: picker.val===el.sym ? '#000' : el.col,
                      border:`1px solid ${picker.val===el.sym ? el.col : el.col+'40'}`,
                    }}>{el.sym}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bond analysis */}
          <div style={{ padding:'16px', background:`${bchar.color}10`, border:`2px solid ${bchar.color}40`, borderRadius:12, marginBottom:14 }}>
            <div style={{ fontSize:14, fontFamily:'var(--mono)', fontWeight:700, color:bchar.color, marginBottom:10 }}>
              {bondA}−{bondB} bond  ·  ΔEN = |{elA?.EN?.toFixed(2)} − {elB?.EN?.toFixed(2)}| = {dEN.toFixed(2)}
            </div>

            {/* Bond type bar */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)' }}>Ionic character</span>
                <span style={{ fontSize:12, fontFamily:'var(--mono)', fontWeight:700, color:bchar.color }}>{bchar.type}</span>
              </div>
              <div style={{ height:16, background:'var(--bg3)', borderRadius:8, overflow:'hidden', position:'relative' }}>
                {/* Scale markers */}
                {[{pct:0,l:'0'},{pct:24,l:'0.4'},{pct:100*(1.7/3.5),l:'1.7'},{pct:100,l:'3.5'}].map(m => (
                  <div key={m.pct} style={{ position:'absolute', left:`${m.pct}%`, top:0, width:1, height:'100%', background:'rgba(255,255,255,0.1)' }} />
                ))}
                <div style={{
                  height:'100%',
                  width:`${Math.min(100,(dEN/3.5)*100)}%`,
                  background:bchar.color,
                  borderRadius:8, transition:'width 0.3s',
                }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:3, fontSize:8, fontFamily:'var(--mono)', color:'var(--text3)' }}>
                <span>Non-polar (0)</span><span>Polar cov. (0.4)</span><span>Ionic (1.7)</span>
              </div>
            </div>

            {/* Atom EN display */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
              <div style={{ textAlign:'center' }}>
                <div style={{
                  width:50, height:50, borderRadius:'50%', margin:'0 auto 6px',
                  background:`${elA?.col}20`, border:`2px solid ${elA?.col}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:14, fontFamily:'var(--mono)', fontWeight:700, color:elA?.col,
                }}>{bondA}</div>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text2)' }}>EN = {elA?.EN?.toFixed(2)}</div>
                {elA && elB && elA.EN < elB.EN && (
                  <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--text3)' }}>δ+</div>
                )}
              </div>

              {/* Bond visualiser */}
              <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                <div style={{
                  height:6, borderRadius:3,
                  background:`linear-gradient(90deg, ${elA?.col}80, ${elB?.col}80)`,
                  width:'100%',
                  position:'relative',
                }}>
                  {/* Electron density blob */}
                  <div style={{
                    position:'absolute',
                    width:24, height:24, borderRadius:'50%',
                    background:bchar.color,
                    opacity:0.5,
                    top:'50%', transform:'translateY(-50%)',
                    left:`${50 + (elB && elA && elB.EN > elA.EN ? (elB.EN - elA.EN) / 4 * 50 : -(elA && elB && elA.EN > elB.EN ? (elA.EN-elB.EN)/4*50 : 0))}%`,
                    transition:'left 0.3s',
                  }} />
                </div>
                <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--text3)', textAlign:'center' }}>
                  {dEN < 0.4 ? 'shared equally' : dEN < 1.7 ? `electron density shifted toward ${elA && elB && elB.EN > elA.EN ? bondB : bondA}` : `electron transferred to ${elA && elB && elB.EN > elA.EN ? bondB : bondA}`}
                </div>
              </div>

              <div style={{ textAlign:'center' }}>
                <div style={{
                  width:50, height:50, borderRadius:'50%', margin:'0 auto 6px',
                  background:`${elB?.col}20`, border:`2px solid ${elB?.col}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:14, fontFamily:'var(--mono)', fontWeight:700, color:elB?.col,
                }}>{bondB}</div>
                <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text2)' }}>EN = {elB?.EN?.toFixed(2)}</div>
                {elA && elB && elB.EN > elA.EN && (
                  <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--text3)' }}>δ−</div>
                )}
              </div>
            </div>
          </div>

          {/* Common bond ΔEN table */}
          <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', marginBottom:8, letterSpacing:1 }}>
            QUICK REFERENCE — COMMON BONDS
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6, marginBottom:14 }}>
            {BOND_PAIRS.slice(0,12).map(([a,b]) => {
              const ea = EN_DATA.find(e=>e.sym===a)
              const eb = EN_DATA.find(e=>e.sym===b)
              if (!ea || !eb) return null
              const dE  = Math.abs(ea.EN-eb.EN)
              const bc  = bondCharacter(dE)
              return (
                <button key={`${a}${b}`}
                  onClick={() => { setBondA(a); setBondB(b) }}
                  style={{
                    padding:'6px 8px', borderRadius:8, fontSize:11,
                    fontFamily:'var(--mono)', cursor:'pointer', textAlign:'left',
                    background:`${bc.color}10`, border:`1px solid ${bc.color}30`,
                    color:bc.color,
                  }}>
                  <span style={{fontWeight:700}}>{a}−{b}</span>
                  <span style={{fontSize:9,marginLeft:5,opacity:0.7}}>ΔEN={dE.toFixed(1)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
        <ValueCard label="Highest EN" value="F = 4.0 (Pauling)" color="var(--purple)" highlight />
        <ValueCard label="Lowest EN"  value="Cs ≈ 0.79"         color="var(--coral)"  />
        <ValueCard label="Trend"      value="↑ across period, ↓ down group" color="var(--teal)" />
        {tab==='bond' && <ValueCard label="ΔEN = " value={`${dEN.toFixed(2)} → ${bchar.type}`} color={bchar.color} highlight />}
      </div>
    </div>
  )
}