import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'
import './PageBase.css'
import './CashFlow.css'

const INIT = {
  netIncome: 180000, depreciation: 40000, arChange: -30000, apChange: 20000, inventoryChange: -15000,
  capex: -120000, investments: -50000, assetSales: 30000,
  loanProceeds: 200000, loanRepayment: -80000, dividends: -40000, equityIssue: 0,
  openingCash: 150000,
}

function WaterFall({ data }) {
  let running = 0
  const bars = data.map(d => {
    const start = running
    running += d.value
    return { ...d, start, end: running }
  })
  const min = Math.min(0, ...bars.map(b => b.start))
  const max = Math.max(...bars.map(b => b.end))
  const range = max - min || 1

  return (
    <div className="waterfall">
      {bars.map((b, i) => {
        const isPos = b.value >= 0
        const barH = Math.abs(b.value) / range * 200
        const bottom = ((Math.min(b.start, b.end) - min) / range) * 200
        return (
          <div key={i} className="wf-col">
            <div className="wf-bar-area">
              <div className="wf-bar" style={{
                height: barH + 'px',
                bottom: bottom + 'px',
                background: b.total ? 'var(--cyan)' : isPos ? 'var(--emerald)' : 'var(--rose)',
                opacity: b.total ? 1 : 0.85,
              }} />
            </div>
            <div className="wf-label">{b.label}</div>
            <div className="wf-val mono" style={{ color: isPos || b.total ? 'var(--emerald)' : 'var(--rose)' }}>
              {isPos ? '+' : ''}{(b.value / 1000).toFixed(0)}K
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function CashFlow() {
  const [v, setV] = useState(INIT)
  const [tab, setTab] = useState('overview')

  const upd = (k, val) => setV(prev => ({ ...prev, [k]: Number(val) }))

  const operating = v.netIncome + v.depreciation + v.arChange + v.apChange + v.inventoryChange
  const investing = v.capex + v.investments + v.assetSales
  const financing = v.loanProceeds + v.loanRepayment + v.dividends + v.equityIssue
  const netChange = operating + investing + financing
  const closingCash = v.openingCash + netChange

  const waterfallData = [
    { label: 'Opening', value: v.openingCash, total: true },
    { label: 'Operating', value: operating },
    { label: 'Investing', value: investing },
    { label: 'Financing', value: financing },
    { label: 'Closing', value: closingCash, total: true },
  ]

  const timeData = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    cash: v.openingCash + (netChange / 12) * (i + 1) + Math.sin(i * 0.8) * 20000,
    operating: operating / 12 + Math.random() * 5000 - 2500,
  }))

  const sections = {
    operating: [
      { k: 'netIncome', label: 'Net Income', min: 0, max: 500000, step: 5000, color: 'var(--cyan)' },
      { k: 'depreciation', label: 'Depreciation (+)', min: 0, max: 200000, step: 5000, color: 'var(--violet2)' },
      { k: 'arChange', label: 'AR Change (±)', min: -200000, max: 200000, step: 5000, color: 'var(--amber)' },
      { k: 'apChange', label: 'AP Change (±)', min: -200000, max: 200000, step: 5000, color: 'var(--emerald)' },
      { k: 'inventoryChange', label: 'Inventory Change (±)', min: -200000, max: 200000, step: 5000, color: 'var(--rose)' },
    ],
    investing: [
      { k: 'capex', label: 'CapEx (outflow)', min: -1000000, max: 0, step: 10000, color: 'var(--rose)' },
      { k: 'investments', label: 'Investments Made', min: -500000, max: 0, step: 5000, color: 'var(--amber)' },
      { k: 'assetSales', label: 'Asset Sales', min: 0, max: 500000, step: 5000, color: 'var(--emerald)' },
    ],
    financing: [
      { k: 'loanProceeds', label: 'Loan Proceeds', min: 0, max: 1000000, step: 10000, color: 'var(--cyan)' },
      { k: 'loanRepayment', label: 'Loan Repayment', min: -500000, max: 0, step: 5000, color: 'var(--rose)' },
      { k: 'dividends', label: 'Dividends Paid', min: -300000, max: 0, step: 5000, color: 'var(--violet2)' },
      { k: 'equityIssue', label: 'Equity Issued', min: 0, max: 1000000, step: 10000, color: 'var(--emerald)' },
    ]
  }

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(56,189,248,0.1)', color: 'var(--sky)', border: '1px solid rgba(56,189,248,0.3)' }}>💧 Topic 3</div>
        <h1 className="page-title">Cash Flow <span style={{ color: 'var(--sky)' }}>Statement</span></h1>
        <p className="page-desc">Watch cash flow like water — adjust the pipes and see how cash moves through the business.</p>
      </div>

      <div className="tab-bar">
        {['overview','operating','investing','financing'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'overview' ? '🗺 Overview' : t === 'operating' ? '⚙️ Operating' : t === 'investing' ? '📈 Investing' : '💳 Financing'}
          </button>
        ))}
      </div>

      <div className="cf-grid">
        <div className="card controls-card">
          <h3 className="ctrl-title">🎛️ {tab === 'overview' ? 'Opening Balance' : tab.charAt(0).toUpperCase() + tab.slice(1) + ' Activities'}</h3>
          {tab === 'overview' && (
            <div className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">Opening Cash</span>
                <span className="slider-val mono" style={{ color: 'var(--cyan)' }}>₹{v.openingCash.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={0} max={1000000} step={10000} value={v.openingCash} onChange={e => upd('openingCash', e.target.value)} />
            </div>
          )}
          {tab !== 'overview' && sections[tab].map(s => (
            <div key={s.k} className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">{s.label}</span>
                <span className="slider-val mono" style={{ color: s.color }}>
                  {v[s.k] >= 0 ? '+' : ''}₹{v[s.k].toLocaleString('en-IN')}
                </span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={v[s.k]}
                onChange={e => upd(s.k, e.target.value)} style={{ accentColor: s.color }} />
            </div>
          ))}

          <div className="ctrl-divider" />
          <div className="cf-summary-mini">
            {[
              { label: 'Operating CF', val: operating, color: 'var(--cyan)' },
              { label: 'Investing CF', val: investing, color: 'var(--sky)' },
              { label: 'Financing CF', val: financing, color: 'var(--violet2)' },
              { label: 'Net Change', val: netChange, color: netChange >= 0 ? 'var(--emerald)' : 'var(--rose)' },
            ].map(r => (
              <div key={r.label} className="cf-mini-row">
                <span>{r.label}</span>
                <span className="mono" style={{ color: r.color }}>{r.val >= 0 ? '+' : ''}₹{Math.abs(r.val).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="cf-right">
          <div className="card cf-waterfall-card">
            <p className="chart-title">Cash Flow Waterfall</p>
            <WaterFall data={waterfallData} />
          </div>

          <div className="card">
            <p className="chart-title">Cash Position Over Year</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="cfGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--sky)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--sky)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--ink3)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                <ReferenceLine y={0} stroke="var(--rose)" strokeDasharray="4 4" />
                <Tooltip formatter={(v) => ['₹' + v.toLocaleString('en-IN'), 'Cash']} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                <Area type="monotone" dataKey="cash" stroke="var(--sky)" strokeWidth={2} fill="url(#cfGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="kpi-row">
            {[
              { label: 'Opening Cash', val: '₹' + (v.openingCash / 1000).toFixed(0) + 'K', color: 'var(--ink2)' },
              { label: 'Net Cash Change', val: (netChange >= 0 ? '+' : '') + '₹' + (netChange / 1000).toFixed(0) + 'K', color: netChange >= 0 ? 'var(--emerald)' : 'var(--rose)' },
              { label: 'Closing Cash', val: '₹' + (closingCash / 1000).toFixed(0) + 'K', color: closingCash > v.openingCash ? 'var(--cyan)' : 'var(--amber)' },
              { label: 'CF Adequacy', val: operating > 0 ? 'Positive ✓' : 'Negative ⚠', color: operating > 0 ? 'var(--emerald)' : 'var(--rose)' },
            ].map(k => (
              <div className="kpi-card" key={k.label} style={{ '--kc': k.color }}>
                <div className="kpi-val" style={{ color: k.color, fontSize: 20 }}>{k.val}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
