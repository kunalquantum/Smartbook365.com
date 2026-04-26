import { useState, useRef } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import './PageBase.css'
import './FinancialStatements.css'

const INITIAL = {
  revenue: 1200000, cogs: 720000, opex: 180000, tax: 75000,
  assets: 2000000, liabilities: 800000,
  prevRevenue: 1000000, prevCogs: 620000, prevOpex: 160000, prevTax: 60000,
  prevAssets: 1700000, prevLiabilities: 750000,
}

function fmt(n) { return '₹' + (n >= 100000 ? (n / 100000).toFixed(1) + 'L' : n.toLocaleString('en-IN')) }
function pct(a, b) { return b ? (((a - b) / b) * 100).toFixed(1) : '0.0' }

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10, padding: '10px 14px' }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink3)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, fontSize: 13 }}>
          {p.name}: <strong>{fmt(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

export default function FinancialStatements() {
  const [vals, setVals] = useState(INITIAL)
  const [tab, setTab] = useState('comparative')
  const [animKey, setAnimKey] = useState(0)

  const update = (k, v) => {
    setVals(prev => ({ ...prev, [k]: Number(v) }))
    setAnimKey(k => k + 1)
  }

  const grossProfit = vals.revenue - vals.cogs
  const netProfit = grossProfit - vals.opex - vals.tax
  const equity = vals.assets - vals.liabilities
  const prevGP = vals.prevRevenue - vals.prevCogs
  const prevNP = prevGP - vals.prevOpex - vals.prevTax
  const prevEquity = vals.prevAssets - vals.prevLiabilities

  const chartData = [
    { name: 'Revenue', current: vals.revenue, previous: vals.prevRevenue },
    { name: 'Gross Profit', current: grossProfit, previous: prevGP },
    { name: 'Net Profit', current: netProfit, previous: prevNP },
    { name: 'Assets', current: vals.assets, previous: vals.prevAssets },
    { name: 'Equity', current: equity, previous: prevEquity },
  ]

  const commonSize = [
    { name: 'COGS', pct: ((vals.cogs / vals.revenue) * 100).toFixed(1) },
    { name: 'OpEx', pct: ((vals.opex / vals.revenue) * 100).toFixed(1) },
    { name: 'Tax', pct: ((vals.tax / vals.revenue) * 100).toFixed(1) },
    { name: 'Net Profit', pct: ((netProfit / vals.revenue) * 100).toFixed(1) },
  ]

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(0,229,255,0.1)', color: 'var(--cyan)', border: '1px solid rgba(0,229,255,0.3)' }}>📊 Topic 1</div>
        <h1 className="page-title">Financial Statement <span style={{ color: 'var(--cyan)' }}>Analysis</span></h1>
        <p className="page-desc">Adjust parameters and watch the statements update live. Compare periods, size your data.</p>
      </div>

      <div className="tab-bar">
        {['comparative', 'common-size'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'comparative' ? '📅 Comparative' : '📐 Common Size'}
          </button>
        ))}
      </div>

      <div className="fs-grid">
        {/* Controls */}
        <div className="card controls-card">
          <h3 className="ctrl-title">🎛️ Current Year Parameters</h3>
          {[
            { k: 'revenue', label: 'Revenue', min: 500000, max: 5000000, step: 50000, color: 'var(--cyan)' },
            { k: 'cogs', label: 'Cost of Goods Sold', min: 100000, max: vals.revenue * 0.9, step: 10000, color: 'var(--amber)' },
            { k: 'opex', label: 'Operating Expenses', min: 50000, max: 500000, step: 5000, color: 'var(--violet2)' },
            { k: 'tax', label: 'Tax', min: 0, max: 200000, step: 5000, color: 'var(--rose)' },
            { k: 'assets', label: 'Total Assets', min: 500000, max: 10000000, step: 100000, color: 'var(--emerald)' },
            { k: 'liabilities', label: 'Total Liabilities', min: 100000, max: vals.assets * 0.9, step: 50000, color: 'var(--pink)' },
          ].map(s => (
            <div key={s.k} className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">{s.label}</span>
                <span className="slider-val mono" style={{ color: s.color }}>{fmt(vals[s.k])}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={vals[s.k]}
                onChange={e => update(s.k, e.target.value)} style={{ accentColor: s.color }} />
            </div>
          ))}
          <div className="ctrl-divider" />
          <h3 className="ctrl-title" style={{ marginTop: 4 }}>📅 Previous Year Parameters</h3>
          {[
            { k: 'prevRevenue', label: 'Prev Revenue', min: 500000, max: 5000000, step: 50000, color: 'var(--sky)' },
            { k: 'prevCogs', label: 'Prev COGS', min: 100000, max: vals.prevRevenue * 0.9, step: 10000, color: 'var(--amber)' },
          ].map(s => (
            <div key={s.k} className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">{s.label}</span>
                <span className="slider-val mono" style={{ color: s.color }}>{fmt(vals[s.k])}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={vals[s.k]}
                onChange={e => update(s.k, e.target.value)} style={{ accentColor: s.color }} />
            </div>
          ))}
        </div>

        {/* Statement */}
        <div className="card stmt-card" key={animKey}>
          {tab === 'comparative' ? (
            <>
              <div className="stmt-header">
                <span>Comparative Income Statement</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink3)' }}>Live Preview</span>
              </div>
              <table className="stmt-table">
                <thead>
                  <tr><th>Particulars</th><th>Current Year</th><th>Previous Year</th><th>Change %</th></tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Revenue', cur: vals.revenue, prev: vals.prevRevenue, bold: true },
                    { label: 'Less: COGS', cur: -vals.cogs, prev: -vals.prevCogs },
                    { label: 'Gross Profit', cur: grossProfit, prev: prevGP, bold: true, hl: true },
                    { label: 'Less: OpEx', cur: -vals.opex, prev: -vals.prevOpex },
                    { label: 'Less: Tax', cur: -vals.tax, prev: -vals.prevTax },
                    { label: 'Net Profit', cur: netProfit, prev: prevNP, bold: true, hl: true, profit: true },
                  ].map((r, i) => (
                    <tr key={i} className={`${r.hl ? 'row-hl' : ''} ${r.profit ? 'row-profit' : ''}`}>
                      <td style={{ fontWeight: r.bold ? 700 : 400 }}>{r.label}</td>
                      <td className="mono" style={{ color: r.cur < 0 ? 'var(--rose)' : 'var(--ink)' }}>
                        {r.cur < 0 ? '(' + fmt(-r.cur) + ')' : fmt(r.cur)}
                      </td>
                      <td className="mono" style={{ color: r.prev < 0 ? 'var(--rose)' : 'var(--ink3)' }}>
                        {r.prev < 0 ? '(' + fmt(-r.prev) + ')' : fmt(r.prev)}
                      </td>
                      <td className="mono">
                        <span className={`pct-badge ${Number(pct(r.cur, r.prev)) >= 0 ? 'pos' : 'neg'}`}>
                          {Number(pct(r.cur, r.prev)) >= 0 ? '▲' : '▼'} {Math.abs(pct(r.cur, r.prev))}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className="stmt-header">
                <span>Common Size Statement (% of Revenue)</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--ink3)' }}>Revenue = 100%</span>
              </div>
              <div className="cs-bars">
                {commonSize.map(row => (
                  <div key={row.name} className="cs-row">
                    <span className="cs-label">{row.name}</span>
                    <div className="cs-bar-wrap">
                      <div className="cs-bar" style={{ width: `${Math.min(100, Math.abs(row.pct))}%`,
                        background: row.name === 'Net Profit' ? 'var(--cyan)' : 'var(--violet)' }} />
                    </div>
                    <span className="cs-pct mono" style={{ color: Number(row.pct) < 0 ? 'var(--rose)' : 'var(--cyan)' }}>
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="chart-wrap" style={{ marginTop: 24 }}>
            <p className="chart-title">Visual Comparison</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--ink3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 100000).toFixed(0) + 'L'} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="current" name="Current" fill="#00e5ff" radius={[4,4,0,0]} />
                <Bar dataKey="previous" name="Previous" fill="#7c3aed" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-row">
          {[
            { label: 'Gross Profit Margin', val: ((grossProfit / vals.revenue) * 100).toFixed(1) + '%', color: 'var(--emerald)' },
            { label: 'Net Profit Margin', val: ((netProfit / vals.revenue) * 100).toFixed(1) + '%', color: 'var(--cyan)' },
            { label: 'YoY Revenue Growth', val: pct(vals.revenue, vals.prevRevenue) + '%', color: 'var(--amber)' },
            { label: 'Debt-to-Equity', val: (vals.liabilities / equity).toFixed(2), color: 'var(--violet2)' },
          ].map(k => (
            <div className="kpi-card" key={k.label} style={{ '--kc': k.color }}>
              <div className="kpi-val" style={{ color: k.color }}>{k.val}</div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
