import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine } from 'recharts'
import './PageBase.css'
import './Budgeting.css'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const BUDGET_TYPES = [
  { id: 'master', label: 'Master Budget', icon: '👑', desc: 'Comprehensive plan combining all sub-budgets' },
  { id: 'sales', label: 'Sales Budget', icon: '💰', desc: 'Projected sales revenue and volume' },
  { id: 'production', label: 'Production Budget', icon: '🏭', desc: 'Units to manufacture based on sales + inventory' },
  { id: 'cash', label: 'Cash Budget', icon: '💵', desc: 'Expected cash inflows and outflows' },
  { id: 'capital', label: 'Capital Budget', icon: '🏗️', desc: 'Long-term investment and capital expenditure plan' },
  { id: 'flexible', label: 'Flexible Budget', icon: '🔄', desc: 'Adjusts with actual activity level' },
]

export default function Budgeting() {
  const [budgetedRevenue, setBudgetedRevenue] = useState(1000000)
  const [budgetedCost, setBudgetedCost] = useState(600000)
  const [actualActivity, setActualActivity] = useState(80)
  const [fixedCostBudget, setFixedCostBudget] = useState(200000)
  const [varCostPerPct, setVarCostPerPct] = useState(4000)
  const [tab, setTab] = useState('types')
  const [selectedType, setSelectedType] = useState('master')

  const flexRevenue = (budgetedRevenue * actualActivity) / 100
  const flexVC = (varCostPerPct * actualActivity)
  const flexCost = fixedCostBudget + flexVC
  const actualRevenueSim = flexRevenue * (0.9 + Math.random() * 0.0001)
  const actualCostSim = flexCost * (0.95 + Math.random() * 0.0001)

  const monthlyData = MONTHS.map((m, i) => {
    const seasonal = 1 + 0.3 * Math.sin((i / 11) * Math.PI)
    const budget = Math.round((budgetedRevenue / 12) * seasonal)
    const actual = Math.round(budget * (0.85 + i * 0.02))
    return {
      month: m,
      budgeted: budget,
      actual: actual,
      variance: actual - budget,
    }
  })

  const flexData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(act => ({
    activity: act + '%',
    fixedBudget: Math.round(budgetedCost),
    flexBudget: Math.round(fixedCostBudget + varCostPerPct * act),
    revenue: Math.round((budgetedRevenue * act) / 100),
  }))

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(244,63,94,0.1)', color: 'var(--rose)', border: '1px solid rgba(244,63,94,0.3)' }}>🎯 Topic 6</div>
        <h1 className="page-title">Budgeting & <span style={{ color: 'var(--rose)' }}>Control</span></h1>
        <p className="page-desc">Flex your budget parameters and see the difference between fixed and flexible budgeting live.</p>
      </div>

      <div className="tab-bar">
        {['types','monthly','flexible'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'types' ? '📚 Budget Types' : t === 'monthly' ? '📅 Monthly Analysis' : '🔄 Flexible Budget'}
          </button>
        ))}
      </div>

      {tab === 'types' && (
        <div className="bud-types">
          <div className="types-grid">
            {BUDGET_TYPES.map(bt => (
              <div key={bt.id} className={`type-card card ${selectedType === bt.id ? 'selected' : ''}`}
                onClick={() => setSelectedType(bt.id)} style={{ '--tc': bt.id === selectedType ? 'var(--rose)' : 'transparent' }}>
                <div className="type-icon">{bt.icon}</div>
                <h4 className="type-label">{bt.label}</h4>
                <p className="type-desc">{bt.desc}</p>
              </div>
            ))}
          </div>
          <div className="card type-detail">
            {selectedType === 'master' && <div className="type-content">
              <h3>Master Budget</h3>
              <p>The master budget is the central planning document that consolidates all functional budgets into one comprehensive plan. It includes:</p>
              <div className="budget-tree">
                <div className="bt-root">Master Budget</div>
                <div className="bt-children">
                  <div className="bt-node">Sales Budget</div>
                  <div className="bt-node">Production Budget</div>
                  <div className="bt-node">Cash Budget</div>
                  <div className="bt-node">Capital Budget</div>
                  <div className="bt-node">Budgeted P&L</div>
                  <div className="bt-node">Budgeted Balance Sheet</div>
                </div>
              </div>
            </div>}
            {selectedType === 'flexible' && <div className="type-content">
              <h3>Flexible Budget Formula</h3>
              <div className="formula-box">
                <code>Flexible Budget Cost = Fixed Cost + (Variable Cost per Unit × Actual Activity)</code>
              </div>
              <p style={{ marginTop: 12 }}>Unlike a fixed budget, a flexible budget adjusts for actual output, making variance analysis more meaningful.</p>
            </div>}
            {!['master','flexible'].includes(selectedType) && <div className="type-content">
              <h3>{BUDGET_TYPES.find(b => b.id === selectedType)?.label}</h3>
              <p>{BUDGET_TYPES.find(b => b.id === selectedType)?.desc}</p>
              <div className="formula-box" style={{ marginTop: 12 }}>
                <code>{selectedType === 'sales' ? 'Sales Budget = Expected Units × Selling Price' :
                  selectedType === 'production' ? 'Production Budget = Sales Units + Closing Stock − Opening Stock' :
                  selectedType === 'cash' ? 'Net Cash = Cash Inflows − Cash Outflows' :
                  'Capital Budget = Present Value of Inflows − Initial Investment'}</code>
              </div>
            </div>}
          </div>
        </div>
      )}

      {tab === 'monthly' && (
        <div className="bud-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Budget Parameters</h3>
            {[
              { label: 'Annual Budgeted Revenue', value: budgetedRevenue, set: setBudgetedRevenue, min: 200000, max: 10000000, step: 100000, color: 'var(--emerald)' },
              { label: 'Annual Budgeted Cost', value: budgetedCost, set: setBudgetedCost, min: 100000, max: 8000000, step: 100000, color: 'var(--rose)' },
            ].map(s => (
              <div key={s.label} className="slider-row">
                <div className="slider-labels">
                  <span className="slider-name">{s.label}</span>
                  <span className="slider-val mono" style={{ color: s.color }}>₹{(s.value / 1000).toFixed(0)}K</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(Number(e.target.value))} style={{ accentColor: s.color }} />
              </div>
            ))}
            <div className="ctrl-divider" />
            <div className="bud-legend">
              <div className="legend-item"><span style={{ background: 'var(--violet2)' }} /><span>Budgeted</span></div>
              <div className="legend-item"><span style={{ background: 'var(--cyan)' }} /><span>Actual</span></div>
              <div className="legend-item"><span style={{ background: 'var(--rose)' }} /><span>Negative Variance</span></div>
              <div className="legend-item"><span style={{ background: 'var(--emerald)' }} /><span>Positive Variance</span></div>
            </div>
          </div>
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <p className="chart-title">Monthly Budget vs Actual Revenue</p>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--ink3)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                  <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="budgeted" name="Budgeted" fill="var(--violet2)" radius={[4,4,0,0]} opacity={0.7} />
                  <Bar dataKey="actual" name="Actual" fill="var(--cyan)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <p className="chart-title">Monthly Variance</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--ink3)', fontSize: 10 }} />
                  <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                  <ReferenceLine y={0} stroke="var(--border2)" />
                  <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                  <Bar dataKey="variance" name="Variance" radius={[4,4,0,0]}
                    fill="var(--emerald)"
                    label={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'flexible' && (
        <div className="bud-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Flexible Budget Parameters</h3>
            {[
              { label: 'Fixed Cost Budget (₹)', value: fixedCostBudget, set: setFixedCostBudget, min: 0, max: 1000000, step: 10000, color: 'var(--rose)' },
              { label: 'Variable Cost per 1% Activity (₹)', value: varCostPerPct, set: setVarCostPerPct, min: 500, max: 20000, step: 500, color: 'var(--amber)' },
              { label: 'Budgeted Revenue (100% capacity)', value: budgetedRevenue, set: setBudgetedRevenue, min: 200000, max: 5000000, step: 100000, color: 'var(--emerald)' },
              { label: 'Actual Activity Level %', value: actualActivity, set: setActualActivity, min: 10, max: 120, step: 5, color: 'var(--cyan)' },
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
            <div className="flex-summary">
              <div className="flex-row"><span>At {actualActivity}% Activity:</span></div>
              <div className="flex-row"><span>Flexible Budget Revenue</span><span className="mono" style={{ color: 'var(--emerald)' }}>₹{flexRevenue.toLocaleString()}</span></div>
              <div className="flex-row"><span>Flexible Budget Cost</span><span className="mono" style={{ color: 'var(--rose)' }}>₹{flexCost.toLocaleString()}</span></div>
              <div className="flex-row"><span>Fixed Budget Cost</span><span className="mono" style={{ color: 'var(--violet2)' }}>₹{budgetedCost.toLocaleString()}</span></div>
              <div className="flex-row"><span style={{ fontWeight: 700 }}>Variance</span><span className="mono" style={{ color: 'var(--cyan)', fontWeight: 700 }}>₹{(budgetedCost - flexCost).toLocaleString()}</span></div>
            </div>
          </div>
          <div className="card">
            <p className="chart-title">Fixed Budget vs Flexible Budget vs Revenue</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={flexData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="activity" tick={{ fill: 'var(--ink3)', fontSize: 10 }} />
                <YAxis tick={{ fill: 'var(--ink3)', fontSize: 10 }} tickFormatter={v => '₹' + (v / 1000).toFixed(0) + 'K'} />
                <Tooltip formatter={v => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--emerald)" radius={[4,4,0,0]} opacity={0.8} />
                <Bar dataKey="flexBudget" name="Flex Budget" fill="var(--cyan)" radius={[4,4,0,0]} opacity={0.8} />
                <Bar dataKey="fixedBudget" name="Fixed Budget" fill="var(--violet2)" radius={[4,4,0,0]} opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
