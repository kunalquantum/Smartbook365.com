import { useState } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import './PageBase.css'
import './RatioAnalysis.css'

const INITIAL = {
  currentAssets: 800000, currentLiabilities: 400000, inventory: 200000, cashEq: 150000,
  netProfit: 180000, revenue: 1200000, grossProfit: 480000, equity: 1200000, totalAssets: 2000000,
  totalDebt: 800000, ebit: 250000, interestExp: 50000, operatingCF: 220000,
}

function fmt2(n) { return n.toFixed(2) }

function RatioGauge({ label, value, min, max, good, color, unit = '' }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const isGood = good === 'high' ? value >= (min + (max - min) * 0.5) : value <= (min + (max - min) * 0.5)
  return (
    <div className="ratio-gauge">
      <div className="gauge-label">{label}</div>
      <div className="gauge-value" style={{ color }}>{fmt2(value)}{unit}</div>
      <div className="gauge-track">
        <div className="gauge-fill" style={{ width: pct + '%', background: color }} />
      </div>
      <div className="gauge-status" style={{ color: isGood ? 'var(--emerald)' : 'var(--amber)' }}>
        {isGood ? '✓ Healthy' : '⚠ Review'}
      </div>
    </div>
  )
}

export default function RatioAnalysis() {
  const [v, setV] = useState(INITIAL)
  const [tab, setTab] = useState('liquidity')

  const upd = (k, val) => setV(prev => ({ ...prev, [k]: Number(val) }))

  const currentRatio = v.currentAssets / v.currentLiabilities
  const quickRatio = (v.currentAssets - v.inventory) / v.currentLiabilities
  const cashRatio = v.cashEq / v.currentLiabilities
  const npm = (v.netProfit / v.revenue) * 100
  const gpm = (v.grossProfit / v.revenue) * 100
  const roe = (v.netProfit / v.equity) * 100
  const roa = (v.netProfit / v.totalAssets) * 100
  const deRatio = v.totalDebt / v.equity
  const debtRatio = v.totalDebt / v.totalAssets
  const icr = v.ebit / v.interestExp
  const cfDebt = v.operatingCF / v.totalDebt

  const radarData = [
    { subject: 'Liquidity', value: Math.min(100, currentRatio * 25) },
    { subject: 'Profitability', value: Math.min(100, npm * 3) },
    { subject: 'Solvency', value: Math.min(100, Math.max(0, 100 - deRatio * 30)) },
    { subject: 'ROE', value: Math.min(100, roe * 3) },
    { subject: 'ICR', value: Math.min(100, icr * 15) },
    { subject: 'CF/Debt', value: Math.min(100, cfDebt * 100) },
  ]

  const tabs = {
    liquidity: {
      ratios: [
        { label: 'Current Ratio', value: currentRatio, min: 0, max: 4, good: 'high', color: 'var(--cyan)', note: '≥ 2:1 ideal' },
        { label: 'Quick Ratio', value: quickRatio, min: 0, max: 3, good: 'high', color: 'var(--sky)', note: '≥ 1:1 ideal' },
        { label: 'Cash Ratio', value: cashRatio, min: 0, max: 2, good: 'high', color: 'var(--emerald)', note: '≥ 0.5 ideal' },
      ],
      sliders: [
        { k: 'currentAssets', label: 'Current Assets', min: 100000, max: 2000000, step: 10000, color: 'var(--cyan)' },
        { k: 'currentLiabilities', label: 'Current Liabilities', min: 50000, max: 1000000, step: 10000, color: 'var(--rose)' },
        { k: 'inventory', label: 'Inventory', min: 0, max: 500000, step: 5000, color: 'var(--amber)' },
        { k: 'cashEq', label: 'Cash & Equivalents', min: 0, max: 500000, step: 5000, color: 'var(--emerald)' },
      ]
    },
    profitability: {
      ratios: [
        { label: 'Net Profit Margin', value: npm, min: 0, max: 50, good: 'high', color: 'var(--pink)', unit: '%', note: '> 10% ideal' },
        { label: 'Gross Profit Margin', value: gpm, min: 0, max: 80, good: 'high', color: 'var(--violet2)', unit: '%', note: '> 30% ideal' },
        { label: 'Return on Equity', value: roe, min: 0, max: 40, good: 'high', color: 'var(--emerald)', unit: '%', note: '> 15% ideal' },
        { label: 'Return on Assets', value: roa, min: 0, max: 20, good: 'high', color: 'var(--amber)', unit: '%', note: '> 5% ideal' },
      ],
      sliders: [
        { k: 'netProfit', label: 'Net Profit', min: 0, max: 500000, step: 5000, color: 'var(--cyan)' },
        { k: 'revenue', label: 'Revenue', min: 200000, max: 5000000, step: 50000, color: 'var(--emerald)' },
        { k: 'grossProfit', label: 'Gross Profit', min: 50000, max: 2000000, step: 10000, color: 'var(--violet2)' },
        { k: 'equity', label: 'Equity', min: 100000, max: 5000000, step: 50000, color: 'var(--pink)' },
      ]
    },
    solvency: {
      ratios: [
        { label: 'Debt-to-Equity', value: deRatio, min: 0, max: 3, good: 'low', color: 'var(--rose)', note: '< 1.5 ideal' },
        { label: 'Debt Ratio', value: debtRatio, min: 0, max: 1, good: 'low', color: 'var(--amber)', note: '< 0.5 ideal' },
        { label: 'Interest Coverage', value: icr, min: 0, max: 10, good: 'high', color: 'var(--emerald)', note: '> 3 ideal' },
        { label: 'CF to Debt', value: cfDebt, min: 0, max: 1, good: 'high', color: 'var(--cyan)', note: '> 0.2 ideal' },
      ],
      sliders: [
        { k: 'totalDebt', label: 'Total Debt', min: 0, max: 3000000, step: 50000, color: 'var(--rose)' },
        { k: 'ebit', label: 'EBIT', min: 0, max: 1000000, step: 10000, color: 'var(--emerald)' },
        { k: 'interestExp', label: 'Interest Expense', min: 1000, max: 200000, step: 1000, color: 'var(--amber)' },
        { k: 'operatingCF', label: 'Operating Cash Flow', min: 0, max: 1000000, step: 10000, color: 'var(--cyan)' },
      ]
    }
  }

  const current = tabs[tab]

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--emerald)', border: '1px solid rgba(16,185,129,0.3)' }}>⚖️ Topic 2</div>
        <h1 className="page-title">Ratio <span style={{ color: 'var(--emerald)' }}>Analysis</span></h1>
        <p className="page-desc">Pull the sliders, watch all ratios recalculate instantly. Radar chart shows overall financial health.</p>
      </div>

      <div className="tab-bar">
        {['liquidity', 'profitability', 'solvency'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'liquidity' ? '💧 Liquidity' : t === 'profitability' ? '💰 Profitability' : '🏛️ Solvency'}
          </button>
        ))}
      </div>

      <div className="ra-grid">
        <div className="card controls-card">
          <h3 className="ctrl-title">🎛️ Adjust Parameters</h3>
          {current.sliders.map(s => (
            <div key={s.k} className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">{s.label}</span>
                <span className="slider-val mono" style={{ color: s.color }}>
                  {v[s.k].toLocaleString('en-IN')}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={v[s.k]}
                onChange={e => upd(s.k, e.target.value)} style={{ accentColor: s.color }} />
            </div>
          ))}

          <div className="ctrl-divider" />
          <div className="radar-wrap">
            <p className="chart-title">Health Radar</p>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--ink3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} />
                <Radar dataKey="value" stroke="var(--emerald)" fill="var(--emerald)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ratios-panel">
          <div className="ratios-gauges">
            {current.ratios.map(r => (
              <div className="card" key={r.label} style={{ padding: 20 }}>
                <RatioGauge {...r} />
                <div className="ratio-note mono">{r.note}</div>
              </div>
            ))}
          </div>
          <div className="card formula-card">
            <p className="chart-title">Formulas Reference</p>
            <div className="formula-grid">
              {tab === 'liquidity' && <>
                <div className="formula-item"><span>Current Ratio</span><code>Current Assets / Current Liabilities</code></div>
                <div className="formula-item"><span>Quick Ratio</span><code>(Current Assets − Inventory) / Current Liabilities</code></div>
                <div className="formula-item"><span>Cash Ratio</span><code>Cash & Equivalents / Current Liabilities</code></div>
              </>}
              {tab === 'profitability' && <>
                <div className="formula-item"><span>Net Profit Margin</span><code>Net Profit / Revenue × 100</code></div>
                <div className="formula-item"><span>Gross Profit Margin</span><code>Gross Profit / Revenue × 100</code></div>
                <div className="formula-item"><span>ROE</span><code>Net Profit / Equity × 100</code></div>
                <div className="formula-item"><span>ROA</span><code>Net Profit / Total Assets × 100</code></div>
              </>}
              {tab === 'solvency' && <>
                <div className="formula-item"><span>Debt-to-Equity</span><code>Total Debt / Equity</code></div>
                <div className="formula-item"><span>Debt Ratio</span><code>Total Debt / Total Assets</code></div>
                <div className="formula-item"><span>Interest Coverage</span><code>EBIT / Interest Expense</code></div>
                <div className="formula-item"><span>CF to Debt</span><code>Operating CF / Total Debt</code></div>
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
