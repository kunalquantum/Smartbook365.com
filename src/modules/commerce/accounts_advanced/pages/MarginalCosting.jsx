import { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, ReferenceArea, Legend } from 'recharts'
import './PageBase.css'
import './MarginalCosting.css'

export default function MarginalCosting() {
  const [fc, setFc] = useState(300000)
  const [vc, setVc] = useState(60)
  const [sp, setSp] = useState(100)
  const [units, setUnits] = useState(10000)
  const [tab, setTab] = useState('bep')

  const contribution = sp - vc
  const contributionPct = (contribution / sp) * 100
  const bepUnits = fc / contribution
  const bepSales = bepUnits * sp
  const actualRevenue = units * sp
  const actualVC = units * vc
  const actualContribution = units * contribution
  const netProfit = actualContribution - fc
  const mos = actualRevenue - bepSales
  const mosPct = (mos / actualRevenue) * 100

  const chartData = useMemo(() => {
    const maxU = Math.max(units * 1.5, bepUnits * 2, 5000)
    const step = maxU / 20
    return Array.from({ length: 21 }, (_, i) => {
      const u = i * step
      return {
        units: Math.round(u),
        revenue: Math.round(u * sp),
        totalCost: Math.round(fc + u * vc),
        fixedCost: fc,
        profit: Math.round(u * sp - fc - u * vc),
      }
    })
  }, [fc, vc, sp, units])

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(240,171,252,0.1)', color: 'var(--pink)', border: '1px solid rgba(240,171,252,0.3)' }}>📈 Topic 5</div>
        <h1 className="page-title">Marginal <span style={{ color: 'var(--pink)' }}>Costing</span></h1>
        <p className="page-desc">Watch the Break-even Point shift as you move fixed costs, variable costs, and selling price.</p>
      </div>

      <div className="tab-bar">
        {['bep','contribution'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'bep' ? '🎯 Break-even Analysis' : '💡 Contribution Analysis'}
          </button>
        ))}
      </div>

      <div className="mc-grid">
        <div className="card controls-card">
          <h3 className="ctrl-title">🎛️ Parameters</h3>
          {[
            { label: 'Fixed Costs (₹)', value: fc, set: setFc, min: 50000, max: 2000000, step: 10000, color: 'var(--rose)' },
            { label: 'Variable Cost per Unit (₹)', value: vc, set: setVc, min: 10, max: 200, step: 1, color: 'var(--amber)' },
            { label: 'Selling Price per Unit (₹)', value: sp, set: setSp, min: vc + 1, max: 500, step: 1, color: 'var(--emerald)' },
            { label: 'Actual Units Sold', value: units, set: setUnits, min: 0, max: 50000, step: 100, color: 'var(--cyan)' },
          ].map(s => (
            <div key={s.label} className="slider-row">
              <div className="slider-labels">
                <span className="slider-name">{s.label}</span>
                <span className="slider-val mono" style={{ color: s.color }}>{s.value.toLocaleString('en-IN')}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                onChange={e => s.set(Number(e.target.value))} style={{ accentColor: s.color }} />
            </div>
          ))}
          <div className="ctrl-divider" />
          <div className="mc-summary">
            {[
              { label: 'Contribution/unit', val: '₹' + contribution.toFixed(2), color: 'var(--pink)' },
              { label: 'P/V Ratio', val: contributionPct.toFixed(1) + '%', color: 'var(--violet2)' },
              { label: 'BEP (Units)', val: bepUnits.toFixed(0), color: 'var(--amber)' },
              { label: 'BEP (₹)', val: '₹' + (bepSales / 1000).toFixed(1) + 'K', color: 'var(--rose)' },
            ].map(r => (
              <div key={r.label} className="mc-mini-row">
                <span>{r.label}</span>
                <span className="mono" style={{ color: r.color, fontWeight: 700 }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mc-right">
          <div className="card">
            <p className="chart-title">{tab === 'bep' ? 'Break-Even Chart' : 'Contribution Chart'}</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="units" tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => v.toLocaleString()} label={{ value: 'Units', position: 'insideBottom', offset: -2, fill: 'var(--ink3)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                <Tooltip formatter={(v, n) => ['₹' + v.toLocaleString('en-IN'), n]} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine x={Math.round(bepUnits)} stroke="var(--amber)" strokeDasharray="6 3" label={{ value: 'BEP', fill: 'var(--amber)', fontSize: 11 }} />
                <ReferenceLine x={units} stroke="var(--cyan)" strokeDasharray="4 4" label={{ value: 'Actual', fill: 'var(--cyan)', fontSize: 11 }} />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="var(--emerald)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="totalCost" name="Total Cost" stroke="var(--rose)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="fixedCost" name="Fixed Cost" stroke="var(--border2)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <p className="chart-title">Profit/Loss at Different Output</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="units" tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => v.toLocaleString()} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                <ReferenceLine y={0} stroke="var(--amber)" strokeWidth={1.5} />
                <Tooltip formatter={(v) => ['₹' + v.toLocaleString('en-IN'), 'Profit/Loss']} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                <Line type="monotone" dataKey="profit" name="Profit/Loss" stroke="var(--pink)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="kpi-row">
            {[
              { label: 'Actual Contribution', val: '₹' + (actualContribution / 1000).toFixed(1) + 'K', color: 'var(--pink)' },
              { label: 'Net Profit/Loss', val: (netProfit >= 0 ? '₹' : '-₹') + Math.abs(netProfit / 1000).toFixed(1) + 'K', color: netProfit >= 0 ? 'var(--emerald)' : 'var(--rose)' },
              { label: 'Margin of Safety', val: '₹' + (mos / 1000).toFixed(1) + 'K', color: mos >= 0 ? 'var(--cyan)' : 'var(--rose)' },
              { label: 'MoS %', val: mosPct.toFixed(1) + '%', color: mosPct >= 0 ? 'var(--violet2)' : 'var(--rose)' },
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
