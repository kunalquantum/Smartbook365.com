import { useState } from 'react'
import { FOOD_ADDITIVES } from './helpers/everydayData'
import ValueCard from '../../components/ui/ValueCard'

export default function FoodChemistry() {
  const [cat,  setCat]  = useState('Preservatives')
  const [selI, setSelI] = useState(0)
  const [mode, setMode] = useState('additives')   // additives | sweeteners | antioxidants

  const category = FOOD_ADDITIVES[cat]
  const item = category.items[selI]

  // Sweetness comparison chart
  const sweetData = FOOD_ADDITIVES['Artificial sweeteners'].items
  const maxSweet  = Math.max(...sweetData.map(s=>s.sweetness))

  // Antioxidant mechanism visual
  const RADICAL_STEPS = [
    { desc:'Lipid (LH) reacts with O₂ → lipid radical (L•) + hydroperoxides (LOOH)', col:'#D85A30' },
    { desc:'Antioxidant (AH) donates H• to lipid radical → L• + AH → LH + A•', col:'#1D9E75' },
    { desc:'Antioxidant radical (A•) is stable — does NOT continue chain reaction', col:'var(--teal)' },
    { desc:'Oxidation chain terminated — food stays fresh longer', col:'var(--gold)' },
  ]
  const [radStep, setRadStep] = useState(0)

  return (
    <div>
      {/* Mode tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:14 }}>
        {[{k:'additives',l:'Preservatives'},{k:'antioxidants',l:'Antioxidants'},{k:'sweeteners',l:'Sweeteners'}].map(t=>(
          <button key={t.k} onClick={()=>setMode(t.k)} style={{
            flex:1, padding:'6px', borderRadius:6, fontSize:11,
            fontFamily:'var(--mono)', cursor:'pointer',
            background: mode===t.k ? 'var(--gold)' : 'var(--bg3)',
            color: mode===t.k ? '#000' : 'var(--text2)',
            border:`1px solid ${mode===t.k?'var(--gold)':'var(--border)'}`,
          }}>{t.l}</button>
        ))}
      </div>

      {/* ── PRESERVATIVES ── */}
      {mode === 'additives' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(216,90,48,0.08)', border:'1px solid rgba(216,90,48,0.2)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            <strong style={{color:'var(--coral)'}}>Food preservatives</strong> extend shelf life by inhibiting microbial growth. They work by lowering water activity, acidifying the medium, or directly disrupting microbial cell membranes.
          </div>

          {/* Item selector */}
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
            {FOOD_ADDITIVES['Preservatives'].items.map((it,i)=>(
              <button key={i} onClick={()=>setSelI(i)} style={{
                padding:'4px 9px', borderRadius:20, fontSize:10,
                fontFamily:'var(--mono)', cursor:'pointer',
                background: selI===i ? 'var(--coral)' : 'var(--bg3)',
                color: selI===i ? '#fff' : 'var(--text2)',
                border:`1px solid ${selI===i?'var(--coral)':'var(--border)'}`,
              }}>{it.name.split(' ')[0]}</button>
            ))}
          </div>

          {/* Item detail */}
          <div style={{ padding:'14px 16px', background:'rgba(216,90,48,0.08)', border:`2px solid ${FOOD_ADDITIVES['Preservatives'].color}35`, borderRadius:12, marginBottom:14 }}>
            <div style={{ fontSize:14, fontFamily:'var(--mono)', fontWeight:700, color:'var(--coral)', marginBottom:6 }}>
              {FOOD_ADDITIVES['Preservatives'].items[selI].name}
            </div>
            {[
              {label:'Used in', val:FOOD_ADDITIVES['Preservatives'].items[selI].use,       col:'var(--text2)'},
              {label:'Mechanism', val:FOOD_ADDITIVES['Preservatives'].items[selI].mechanism, col:'var(--text2)'},
              {label:'Safety',    val:FOOD_ADDITIVES['Preservatives'].items[selI].safe===true?'Generally safe':FOOD_ADDITIVES['Preservatives'].items[selI].safe, col:FOOD_ADDITIVES['Preservatives'].items[selI].safe===true?'var(--teal)':'var(--gold)'},
            ].map(r=>(
              <div key={r.label} style={{ display:'flex', gap:8, marginBottom:4 }}>
                <span style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', minWidth:80 }}>{r.label}</span>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:r.col, lineHeight:1.5 }}>{r.val}</span>
              </div>
            ))}
            {FOOD_ADDITIVES['Preservatives'].items[selI].concern && (
              <div style={{ marginTop:6, padding:'6px 10px', background:'rgba(239,159,39,0.1)', border:'1px solid rgba(239,159,39,0.25)', borderRadius:6, fontSize:11, fontFamily:'var(--mono)', color:'var(--gold)' }}>
                ⚠ {FOOD_ADDITIVES['Preservatives'].items[selI].concern}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ANTIOXIDANTS ── */}
      {mode === 'antioxidants' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(29,158,117,0.08)', border:'1px solid rgba(29,158,117,0.2)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            <strong style={{color:'var(--teal)'}}>Antioxidants</strong> prevent rancidity in fats and oils by interrupting the free-radical chain reaction of lipid oxidation.
          </div>

          {/* Chain reaction step animator */}
          <div style={{ background:'rgba(0,0,0,0.2)', border:'1px solid var(--border)', borderRadius:10, padding:14, marginBottom:14 }}>
            <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', letterSpacing:1.5, marginBottom:10 }}>
              HOW ANTIOXIDANTS STOP RANCIDITY
            </div>

            <div style={{ display:'flex', gap:5, marginBottom:10 }}>
              {RADICAL_STEPS.map((_,i)=>(
                <button key={i} onClick={()=>setRadStep(i)} style={{
                  flex:1, padding:'5px', borderRadius:6, fontSize:10,
                  fontFamily:'var(--mono)', cursor:'pointer',
                  background: radStep===i?RADICAL_STEPS[i].col:radStep>i?`${RADICAL_STEPS[i].col}25`:'var(--bg3)',
                  color: radStep===i?'#fff':radStep>i?RADICAL_STEPS[i].col:'var(--text3)',
                  border:`1px solid ${radStep>=i?RADICAL_STEPS[i].col+'50':'var(--border)'}`,
                }}>{i+1}</button>
              ))}
            </div>

            {RADICAL_STEPS.slice(0,radStep+1).map((s,i)=>(
              <div key={i} style={{
                padding:'10px 14px', marginBottom:6,
                background: i===radStep?`${s.col}12`:'var(--bg3)',
                border:`1px solid ${i===radStep?s.col+'40':'var(--border)'}`,
                borderRadius:8,
              }}>
                <div style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                  <div style={{ width:22, height:22, borderRadius:'50%', background:`${s.col}25`, border:`1.5px solid ${s.col}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'var(--mono)', fontWeight:700, color:s.col, flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.5 }}>{s.desc}</div>
                </div>
              </div>
            ))}

            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setRadStep(p=>Math.max(0,p-1))} disabled={radStep===0} style={{ flex:1, padding:'6px', borderRadius:6, fontFamily:'var(--mono)', fontSize:11, cursor:'pointer', background:'var(--bg3)', color:'var(--text2)', border:'1px solid var(--border)', opacity:radStep===0?0.4:1 }}>←</button>
              <button onClick={()=>setRadStep(p=>Math.min(RADICAL_STEPS.length-1,p+1))} disabled={radStep>=RADICAL_STEPS.length-1} style={{ flex:1, padding:'6px', borderRadius:6, fontFamily:'var(--mono)', fontSize:11, cursor:'pointer', background:'rgba(29,158,117,0.12)', color:'var(--teal)', border:'1px solid rgba(29,158,117,0.3)', opacity:radStep>=RADICAL_STEPS.length-1?0.4:1 }}>→</button>
            </div>
          </div>

          {/* Antioxidant list */}
          {FOOD_ADDITIVES['Antioxidants'].items.map((it,i)=>(
            <div key={i} style={{ padding:'10px 14px', background:`${i%2===0?'rgba(29,158,117':'rgba(55,138,221'}.06)`, border:'1px solid var(--border)', borderRadius:8, marginBottom:6 }}>
              <div style={{ fontSize:12, fontFamily:'var(--mono)', fontWeight:700, color:'var(--teal)', marginBottom:3 }}>{it.name}</div>
              <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)' }}>Used in: {it.use}</span>
                <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text2)' }}>{it.mechanism}</span>
              </div>
              {it.concern && (
                <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--gold)', marginTop:4 }}>⚠ {it.concern}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SWEETENERS ── */}
      {mode === 'sweeteners' && (
        <div>
          <div style={{ padding:'10px 14px', background:'rgba(127,119,221,0.08)', border:'1px solid rgba(127,119,221,0.2)', borderRadius:8, marginBottom:14, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            Artificial sweeteners provide sweetness with fewer or zero calories. Sweetness is measured relative to sucrose (table sugar) = 1.
          </div>

          {/* Sweetness bar chart */}
          <div style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, fontFamily:'var(--mono)', color:'var(--text3)', marginBottom:8, letterSpacing:1 }}>
              SWEETNESS RELATIVE TO SUCROSE (= 1)
            </div>
            {sweetData.map((s,i)=>{
              const logPct = (Math.log10(s.sweetness) / Math.log10(maxSweet)) * 100
              return (
                <div key={s.name} style={{ marginBottom:8 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                    <span style={{ fontSize:11, fontFamily:'var(--mono)', fontWeight:700, color:'var(--purple)' }}>{s.name}</span>
                    <span style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--purple)' }}>
                      {s.sweetness}× · {s.cal} kcal/g
                    </span>
                  </div>
                  <div style={{ height:14, background:'var(--bg3)', borderRadius:7, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${logPct}%`, background:`${['#7F77DD','#EF9F27','#1D9E75','#A8D8B9','#D85A30'][i]}`, borderRadius:7, transition:'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize:9, fontFamily:'var(--mono)', color:'var(--text3)', marginTop:2 }}>
                    {s.use} · {s.concern || 'No significant concerns'}
                  </div>
                </div>
              )
            })}
            <div style={{ fontSize:11, fontFamily:'var(--mono)', color:'var(--text3)', marginTop:4 }}>
              Note: bar uses log scale — alitame (2000×) is vastly sweeter than saccharin (300×)
            </div>
          </div>

          {/* Sucrose reference */}
          <div style={{ padding:'10px 14px', background:'rgba(212,160,23,0.08)', border:'1px solid rgba(212,160,23,0.2)', borderRadius:8, fontSize:12, fontFamily:'var(--mono)', color:'var(--text2)', lineHeight:1.7 }}>
            <strong style={{color:'var(--gold)'}}>Sucrose (table sugar)</strong> = reference (1× sweetness, 4 kcal/g).
            <br/>Artificial sweeteners allow diabetics and dieters to enjoy sweet taste without the caloric or glycaemic impact.
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:14 }}>
        <ValueCard label="Category"  value={mode==='additives'?'Preservatives':mode==='antioxidants'?'Antioxidants':'Sweeteners'} color="var(--gold)" highlight />
        {mode==='sweeteners' && <ValueCard label="Sweetest" value="Alitame (2000×)" color="var(--purple)" />}
        {mode==='antioxidants' && <ValueCard label="Mechanism" value="Free radical chain termination" color="var(--teal)" />}
      </div>
    </div>
  )
}