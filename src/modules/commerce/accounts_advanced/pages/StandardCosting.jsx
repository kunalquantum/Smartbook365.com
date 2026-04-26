import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Legend, Cell } from 'recharts'
import './PageBase.css'
import './StandardCosting.css'

function VarianceBadge({ label, value, favorable = true }) {
  const isFav = value >= 0 ? favorable : !favorable
  return (
    <div className={`var-badge ${isFav ? 'fav' : 'adv'}`}>
      <div className="var-label">{label}</div>
      <div className="var-val">₹{Math.abs(value).toLocaleString('en-IN')}</div>
      <div className="var-type">{isFav ? 'Favourable (F)' : 'Adverse (A)'}</div>
    </div>
  )
}

export default function StandardCosting() {
  const [tab, setTab] = useState('material')
  const [mat, setMat] = useState({
    stdQty: 5, stdPrice: 50, actQty: 5.5, actPrice: 48, actOutput: 1000
  })
  const [lab, setLab] = useState({
    stdHours: 4, stdRate: 80, actHours: 4.3, actRate: 75, actOutput: 1000
  })

  const updMat = (k, v) => setMat(p => ({ ...p, [k]: Number(v) }))
  const updLab = (k, v) => setLab(p => ({ ...p, [k]: Number(v) }))

  // Material Variances
  const stdMatCost = mat.stdQty * mat.stdPrice * mat.actOutput
  const actMatCost = mat.actQty * mat.actPrice * mat.actOutput
  const matCV = stdMatCost - actMatCost
  const matPV = (mat.stdPrice - mat.actPrice) * mat.actQty * mat.actOutput
  const matUV = (mat.stdQty - mat.actQty) * mat.stdPrice * mat.actOutput

  // Labour Variances
  const stdLabCost = lab.stdHours * lab.stdRate * lab.actOutput
  const actLabCost = lab.actHours * lab.actRate * lab.actOutput
  const labCV = stdLabCost - actLabCost
  const labRV = (lab.stdRate - lab.actRate) * lab.actHours * lab.actOutput
  const labEV = (lab.stdHours - lab.actHours) * lab.stdRate * lab.actOutput

  const matChartData = [
    { name: 'Std Cost', value: stdMatCost, fill: 'var(--violet2)' },
    { name: 'Actual Cost', value: actMatCost, fill: 'var(--amber)' },
  ]
  const varChartData = [
    { name: 'Mat CV', value: matCV, fill: matCV >= 0 ? '#10b981' : '#f43f5e' },
    { name: 'Mat PV', value: matPV, fill: matPV >= 0 ? '#10b981' : '#f43f5e' },
    { name: 'Mat UV', value: matUV, fill: matUV >= 0 ? '#10b981' : '#f43f5e' },
    { name: 'Lab CV', value: labCV, fill: labCV >= 0 ? '#10b981' : '#f43f5e' },
    { name: 'Lab RV', value: labRV, fill: labRV >= 0 ? '#10b981' : '#f43f5e' },
    { name: 'Lab EV', value: labEV, fill: labEV >= 0 ? '#10b981' : '#f43f5e' },
  ]

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(251,146,60,0.1)', color: 'var(--amber)', border: '1px solid rgba(251,146,60,0.3)' }}>📐 Topic 7</div>
        <h1 className="page-title">Standard <span style={{ color: 'var(--amber)' }}>Costing</span></h1>
        <p className="page-desc">Simulate standard vs actual — every change in quantity, price, or hours creates a variance. Watch it live.</p>
      </div>

      <div className="tab-bar">
        {['material','labour','summary'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'material' ? '🧱 Material Variance' : t === 'labour' ? '👷 Labour Variance' : '📊 Full Summary'}
          </button>
        ))}
      </div>

      {tab === 'material' && (
        <div className="sc-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Material Parameters</h3>
            <div className="param-group">
              <div className="param-group-label">STANDARD</div>
              {[
                { k: 'stdQty', label: 'Std Qty per unit (kg)', min: 1, max: 20, step: 0.5, color: 'var(--violet2)' },
                { k: 'stdPrice', label: 'Std Price per kg (₹)', min: 10, max: 200, step: 1, color: 'var(--violet2)' },
              ].map(s => (
                <div key={s.k} className="slider-row">
                  <div className="slider-labels">
                    <span className="slider-name">{s.label}</span>
                    <span className="slider-val mono" style={{ color: s.color }}>{mat[s.k]}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={mat[s.k]}
                    onChange={e => updMat(s.k, e.target.value)} style={{ accentColor: s.color }} />
                </div>
              ))}
            </div>
            <div className="ctrl-divider" />
            <div className="param-group">
              <div className="param-group-label">ACTUAL</div>
              {[
                { k: 'actQty', label: 'Act Qty per unit (kg)', min: 1, max: 20, step: 0.5, color: 'var(--amber)' },
                { k: 'actPrice', label: 'Act Price per kg (₹)', min: 10, max: 200, step: 1, color: 'var(--amber)' },
                { k: 'actOutput', label: 'Actual Output (units)', min: 100, max: 10000, step: 100, color: 'var(--cyan)' },
              ].map(s => (
                <div key={s.k} className="slider-row">
                  <div className="slider-labels">
                    <span className="slider-name">{s.label}</span>
                    <span className="slider-val mono" style={{ color: s.color }}>{mat[s.k]}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={mat[s.k]}
                    onChange={e => updMat(s.k, e.target.value)} style={{ accentColor: s.color }} />
                </div>
              ))}
            </div>
          </div>

          <div className="sc-right">
            <div className="var-cards">
              <VarianceBadge label="Material Cost Variance (MCV)" value={matCV} />
              <VarianceBadge label="Material Price Variance (MPV)" value={matPV} />
              <VarianceBadge label="Material Usage Variance (MUV)" value={matUV} />
            </div>

            <div className="card">
              <p className="chart-title">Standard vs Actual Material Cost</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={matChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis type="number" tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                  <YAxis type="category" dataKey="name" tick={{ fill: 'var(--ink2)', fontSize: 12 }} width={80} />
                  <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                  <Bar dataKey="value" radius={[0,6,6,0]}>
                    {matChartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card formula-ref">
              <p className="chart-title">Variance Formulas</p>
              <div className="formula-grid">
                <div className="formula-item">
                  <span>MCV = Standard Cost − Actual Cost</span>
                  <code>= ({mat.stdQty}×{mat.stdPrice}×{mat.actOutput}) − ({mat.actQty}×{mat.actPrice}×{mat.actOutput})</code>
                  <strong style={{ color: matCV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{matCV.toLocaleString()}</strong>
                </div>
                <div className="formula-item">
                  <span>MPV = (Std Price − Act Price) × Act Qty × Output</span>
                  <code>= ({mat.stdPrice}−{mat.actPrice}) × {mat.actQty} × {mat.actOutput}</code>
                  <strong style={{ color: matPV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{matPV.toLocaleString()}</strong>
                </div>
                <div className="formula-item">
                  <span>MUV = (Std Qty − Act Qty) × Std Price × Output</span>
                  <code>= ({mat.stdQty}−{mat.actQty}) × {mat.stdPrice} × {mat.actOutput}</code>
                  <strong style={{ color: matUV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{matUV.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'labour' && (
        <div className="sc-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Labour Parameters</h3>
            <div className="param-group">
              <div className="param-group-label">STANDARD</div>
              {[
                { k: 'stdHours', label: 'Std Hours per unit', min: 0.5, max: 20, step: 0.5, color: 'var(--violet2)' },
                { k: 'stdRate', label: 'Std Rate per hour (₹)', min: 20, max: 300, step: 5, color: 'var(--violet2)' },
              ].map(s => (
                <div key={s.k} className="slider-row">
                  <div className="slider-labels">
                    <span className="slider-name">{s.label}</span>
                    <span className="slider-val mono" style={{ color: s.color }}>{lab[s.k]}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={lab[s.k]}
                    onChange={e => updLab(s.k, e.target.value)} style={{ accentColor: s.color }} />
                </div>
              ))}
            </div>
            <div className="ctrl-divider" />
            <div className="param-group">
              <div className="param-group-label">ACTUAL</div>
              {[
                { k: 'actHours', label: 'Act Hours per unit', min: 0.5, max: 20, step: 0.5, color: 'var(--amber)' },
                { k: 'actRate', label: 'Act Rate per hour (₹)', min: 20, max: 300, step: 5, color: 'var(--amber)' },
                { k: 'actOutput', label: 'Actual Output (units)', min: 100, max: 10000, step: 100, color: 'var(--cyan)' },
              ].map(s => (
                <div key={s.k} className="slider-row">
                  <div className="slider-labels">
                    <span className="slider-name">{s.label}</span>
                    <span className="slider-val mono" style={{ color: s.color }}>{lab[s.k]}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={lab[s.k]}
                    onChange={e => updLab(s.k, e.target.value)} style={{ accentColor: s.color }} />
                </div>
              ))}
            </div>
          </div>

          <div className="sc-right">
            <div className="var-cards">
              <VarianceBadge label="Labour Cost Variance (LCV)" value={labCV} />
              <VarianceBadge label="Labour Rate Variance (LRV)" value={labRV} />
              <VarianceBadge label="Labour Efficiency Variance (LEV)" value={labEV} />
            </div>

            <div className="card formula-ref">
              <p className="chart-title">Variance Formulas</p>
              <div className="formula-grid">
                <div className="formula-item">
                  <span>LCV = Standard Labour Cost − Actual Labour Cost</span>
                  <code>= ({lab.stdHours}×{lab.stdRate}×{lab.actOutput}) − ({lab.actHours}×{lab.actRate}×{lab.actOutput})</code>
                  <strong style={{ color: labCV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{labCV.toLocaleString()}</strong>
                </div>
                <div className="formula-item">
                  <span>LRV = (Std Rate − Act Rate) × Act Hours × Output</span>
                  <code>= ({lab.stdRate}−{lab.actRate}) × {lab.actHours} × {lab.actOutput}</code>
                  <strong style={{ color: labRV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{labRV.toLocaleString()}</strong>
                </div>
                <div className="formula-item">
                  <span>LEV = (Std Hours − Act Hours) × Std Rate × Output</span>
                  <code>= ({lab.stdHours}−{lab.actHours}) × {lab.stdRate} × {lab.actOutput}</code>
                  <strong style={{ color: labEV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>= ₹{labEV.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'summary' && (
        <div className="sc-full">
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="chart-title">All Variances at a Glance</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={varChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--ink3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                <ReferenceLine y={0} stroke="var(--border2)" strokeWidth={2} />
                <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                <Bar dataKey="value" radius={[4,4,0,0]}>
                  {varChartData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="summary-table card">
            <p className="chart-title">Variance Summary Table</p>
            <table className="stmt-table">
              <thead><tr><th>Variance</th><th>Amount</th><th>Type</th><th>Component Variances</th></tr></thead>
              <tbody>
                <tr><td>Material Cost Variance</td><td className="mono" style={{ color: matCV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>₹{Math.abs(matCV).toLocaleString()}</td><td>{matCV >= 0 ? '✓ F' : '✗ A'}</td><td className="mono" style={{ fontSize: 11 }}>MPV + MUV</td></tr>
                <tr><td>Material Price Variance</td><td className="mono" style={{ color: matPV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>₹{Math.abs(matPV).toLocaleString()}</td><td>{matPV >= 0 ? '✓ F' : '✗ A'}</td><td></td></tr>
                <tr><td>Material Usage Variance</td><td className="mono" style={{ color: matUV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>₹{Math.abs(matUV).toLocaleString()}</td><td>{matUV >= 0 ? '✓ F' : '✗ A'}</td><td></td></tr>
                <tr><td>Labour Cost Variance</td><td className="mono" style={{ color: labCV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>₹{Math.abs(labCV).toLocaleString()}</td><td>{labCV >= 0 ? '✓ F' : '✗ A'}</td><td className="mono" style={{ fontSize: 11 }}>LRV + LEV</td></tr>
                <tr><td>Labour Rate Variance</td><td className="mono" style={{ color: labRV >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>₹{Math.abs(labRV).toLocaleString()}</td><td>{labRV >= 0 ? '✓ F' : '✗ A'}</td><td></td></tr>
                <tr className="row-profit"><td style={{ fontWeight: 700 }}>Labour Efficiency Variance</td><td className="mono" style={{ color: labEV >= 0 ? 'var(--emerald)' : 'var(--rose)', fontWeight: 700 }}>₹{Math.abs(labEV).toLocaleString()}</td><td>{labEV >= 0 ? '✓ F' : '✗ A'}</td><td></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
