import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import './PageBase.css'
import './CostAccounting.css'

export default function CostAccounting() {
  const [tab, setTab] = useState('elements')
  const [job, setJob] = useState({ units: 500, directMaterial: 120, directLabour: 80, machineHours: 3, overheadRate: 40, adminOH: 15000, sellingOH: 8000 })
  const [proc, setProc] = useState({ input: 1000, normalLoss: 5, abnormalLoss: 2, rawMat: 50, processing: 30, closing: 100 })
  const [elements, setElements] = useState({ rawMaterial: 400000, directLabour: 200000, factoryOH: 150000, adminOH: 80000, sellingOH: 60000 })

  const updJob = (k, v) => setJob(p => ({ ...p, [k]: Number(v) }))
  const updProc = (k, v) => setProc(p => ({ ...p, [k]: Number(v) }))
  const updEl = (k, v) => setElements(p => ({ ...p, [k]: Number(v) }))

  const primeCost = job.units * (job.directMaterial + job.directLabour)
  const worksCost = primeCost + job.units * job.machineHours * job.overheadRate
  const costProd = worksCost + job.adminOH
  const totalCost = costProd + job.sellingOH
  const costPerUnit = totalCost / job.units

  const procOutput = proc.input - (proc.input * proc.normalLoss / 100) - proc.abnormalLoss
  const totalProcCost = proc.input * proc.rawMat + proc.input * proc.processing
  const normalOutput = proc.input - (proc.input * proc.normalLoss / 100)
  const costPerUnit2 = totalProcCost / normalOutput

  const elTotal = Object.values(elements).reduce((a, b) => a + b, 0)
  const pieData = [
    { name: 'Raw Material', value: elements.rawMaterial, color: '#00e5ff' },
    { name: 'Direct Labour', value: elements.directLabour, color: '#a78bfa' },
    { name: 'Factory OH', value: elements.factoryOH, color: '#fbbf24' },
    { name: 'Admin OH', value: elements.adminOH, color: '#10b981' },
    { name: 'Selling OH', value: elements.sellingOH, color: '#f43f5e' },
  ]

  return (
    <div className="page-wrap">
      <div className="page-header">
        <div className="ph-badge" style={{ background: 'rgba(251,191,36,0.1)', color: 'var(--amber)', border: '1px solid rgba(251,191,36,0.3)' }}>🏗️ Topic 4</div>
        <h1 className="page-title">Cost <span style={{ color: 'var(--amber)' }}>Accounting</span></h1>
        <p className="page-desc">Build costs from raw elements to finished goods. Simulate Job Costing and Process Costing live.</p>
      </div>

      <div className="tab-bar">
        {['elements','job','process'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'elements' ? '🧩 Elements of Cost' : t === 'job' ? '🔧 Job Costing' : '🔄 Process Costing'}
          </button>
        ))}
      </div>

      {tab === 'elements' && (
        <div className="ca-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Cost Elements</h3>
            {[
              { k: 'rawMaterial', label: 'Raw Material', color: 'var(--cyan)' },
              { k: 'directLabour', label: 'Direct Labour', color: 'var(--violet2)' },
              { k: 'factoryOH', label: 'Factory Overhead', color: 'var(--amber)' },
              { k: 'adminOH', label: 'Admin Overhead', color: 'var(--emerald)' },
              { k: 'sellingOH', label: 'Selling Overhead', color: 'var(--rose)' },
            ].map(s => (
              <div key={s.k} className="slider-row">
                <div className="slider-labels">
                  <span className="slider-name">{s.label}</span>
                  <span className="slider-val mono" style={{ color: s.color }}>₹{elements[s.k].toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min={10000} max={1000000} step={10000} value={elements[s.k]}
                  onChange={e => updEl(s.k, e.target.value)} style={{ accentColor: s.color }} />
              </div>
            ))}
            <div className="ctrl-divider" />
            <div className="total-box">
              <span>Total Cost of Production</span>
              <span className="mono" style={{ color: 'var(--amber)', fontSize: 18, fontWeight: 700 }}>
                ₹{elTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="ca-right">
            <div className="card">
              <p className="chart-title">Cost Composition</p>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => '₹' + v.toLocaleString('en-IN')} contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 10 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="card cost-sheet">
              <p className="chart-title">Cost Sheet</p>
              <table className="stmt-table">
                <tbody>
                  <tr><td>Raw Material</td><td className="mono" style={{ color: 'var(--cyan)' }}>₹{elements.rawMaterial.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Direct Labour</td><td className="mono" style={{ color: 'var(--violet2)' }}>₹{elements.directLabour.toLocaleString('en-IN')}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Prime Cost</td><td className="mono" style={{ fontWeight: 700 }}>₹{(elements.rawMaterial + elements.directLabour).toLocaleString('en-IN')}</td></tr>
                  <tr><td>Factory Overhead</td><td className="mono" style={{ color: 'var(--amber)' }}>₹{elements.factoryOH.toLocaleString('en-IN')}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Works Cost</td><td className="mono" style={{ fontWeight: 700 }}>₹{(elements.rawMaterial + elements.directLabour + elements.factoryOH).toLocaleString('en-IN')}</td></tr>
                  <tr><td>Admin Overhead</td><td className="mono" style={{ color: 'var(--emerald)' }}>₹{elements.adminOH.toLocaleString('en-IN')}</td></tr>
                  <tr><td>Selling Overhead</td><td className="mono" style={{ color: 'var(--rose)' }}>₹{elements.sellingOH.toLocaleString('en-IN')}</td></tr>
                  <tr className="row-profit"><td style={{ fontWeight: 700 }}>Total Cost</td><td className="mono" style={{ color: 'var(--amber)', fontWeight: 700 }}>₹{elTotal.toLocaleString('en-IN')}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'job' && (
        <div className="ca-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Job Parameters</h3>
            {[
              { k: 'units', label: 'Units', min: 10, max: 5000, step: 10, color: 'var(--cyan)', prefix: '' },
              { k: 'directMaterial', label: 'Direct Material/unit', min: 10, max: 500, step: 5, color: 'var(--amber)', prefix: '₹' },
              { k: 'directLabour', label: 'Direct Labour/unit', min: 10, max: 300, step: 5, color: 'var(--violet2)', prefix: '₹' },
              { k: 'machineHours', label: 'Machine Hours/unit', min: 0.5, max: 20, step: 0.5, color: 'var(--emerald)', prefix: '' },
              { k: 'overheadRate', label: 'OH Rate/machine hr', min: 10, max: 200, step: 5, color: 'var(--sky)', prefix: '₹' },
              { k: 'adminOH', label: 'Admin Overhead', min: 0, max: 100000, step: 1000, color: 'var(--pink)', prefix: '₹' },
              { k: 'sellingOH', label: 'Selling Overhead', min: 0, max: 50000, step: 500, color: 'var(--rose)', prefix: '₹' },
            ].map(s => (
              <div key={s.k} className="slider-row">
                <div className="slider-labels">
                  <span className="slider-name">{s.label}</span>
                  <span className="slider-val mono" style={{ color: s.color }}>{s.prefix}{job[s.k].toLocaleString('en-IN')}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={job[s.k]}
                  onChange={e => updJob(s.k, e.target.value)} style={{ accentColor: s.color }} />
              </div>
            ))}
          </div>
          <div className="ca-right">
            <div className="card job-cost-sheet">
              <p className="chart-title">Job Cost Sheet</p>
              <table className="stmt-table">
                <tbody>
                  <tr><td>Direct Material ({job.units} × ₹{job.directMaterial})</td><td className="mono">₹{(job.units * job.directMaterial).toLocaleString()}</td></tr>
                  <tr><td>Direct Labour ({job.units} × ₹{job.directLabour})</td><td className="mono">₹{(job.units * job.directLabour).toLocaleString()}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Prime Cost</td><td className="mono" style={{ fontWeight: 700 }}>₹{primeCost.toLocaleString()}</td></tr>
                  <tr><td>Factory OH ({job.units} × {job.machineHours}hrs × ₹{job.overheadRate})</td><td className="mono">₹{(job.units * job.machineHours * job.overheadRate).toLocaleString()}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Works Cost</td><td className="mono" style={{ fontWeight: 700 }}>₹{worksCost.toLocaleString()}</td></tr>
                  <tr><td>Admin Overhead</td><td className="mono">₹{job.adminOH.toLocaleString()}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Cost of Production</td><td className="mono" style={{ fontWeight: 700 }}>₹{costProd.toLocaleString()}</td></tr>
                  <tr><td>Selling Overhead</td><td className="mono">₹{job.sellingOH.toLocaleString()}</td></tr>
                  <tr className="row-profit"><td style={{ fontWeight: 700 }}>Total Cost of Job</td><td className="mono" style={{ color: 'var(--amber)', fontWeight: 700 }}>₹{totalCost.toLocaleString()}</td></tr>
                  <tr><td>Cost Per Unit</td><td className="mono" style={{ color: 'var(--cyan)', fontWeight: 700 }}>₹{costPerUnit.toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
            <div className="kpi-row">
              {[
                { label: 'Prime Cost/unit', val: '₹' + ((job.directMaterial + job.directLabour)).toFixed(2), color: 'var(--cyan)' },
                { label: 'Works Cost/unit', val: '₹' + (worksCost / job.units).toFixed(2), color: 'var(--violet2)' },
                { label: 'Total Cost/unit', val: '₹' + costPerUnit.toFixed(2), color: 'var(--amber)' },
              ].map(k => (
                <div className="kpi-card" key={k.label} style={{ '--kc': k.color }}>
                  <div className="kpi-val" style={{ color: k.color, fontSize: 22 }}>{k.val}</div>
                  <div className="kpi-label">{k.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'process' && (
        <div className="ca-grid">
          <div className="card controls-card">
            <h3 className="ctrl-title">🎛️ Process Parameters</h3>
            {[
              { k: 'input', label: 'Input Units', min: 100, max: 10000, step: 100, color: 'var(--cyan)' },
              { k: 'normalLoss', label: 'Normal Loss %', min: 0, max: 30, step: 0.5, color: 'var(--amber)' },
              { k: 'abnormalLoss', label: 'Abnormal Loss Units', min: 0, max: 200, step: 1, color: 'var(--rose)' },
              { k: 'rawMat', label: 'Material Cost/unit (₹)', min: 10, max: 200, step: 5, color: 'var(--violet2)' },
              { k: 'processing', label: 'Processing Cost/unit (₹)', min: 5, max: 100, step: 5, color: 'var(--emerald)' },
            ].map(s => (
              <div key={s.k} className="slider-row">
                <div className="slider-labels">
                  <span className="slider-name">{s.label}</span>
                  <span className="slider-val mono" style={{ color: s.color }}>{proc[s.k]}{s.k === 'normalLoss' ? '%' : ''}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={proc[s.k]}
                  onChange={e => updProc(s.k, e.target.value)} style={{ accentColor: s.color }} />
              </div>
            ))}
          </div>
          <div className="ca-right">
            <div className="card">
              <p className="chart-title">Process Account</p>
              <div className="process-flow">
                <div className="proc-box input-box">
                  <div className="proc-label">Input</div>
                  <div className="proc-val">{proc.input} units</div>
                </div>
                <div className="proc-arrow">→</div>
                <div className="proc-box proc-box">
                  <div className="proc-label">Process</div>
                  <div className="proc-val" style={{ fontSize: 13 }}>
                    NL: {(proc.input * proc.normalLoss / 100).toFixed(0)} units<br />
                    AL: {proc.abnormalLoss} units
                  </div>
                </div>
                <div className="proc-arrow">→</div>
                <div className="proc-box output-box">
                  <div className="proc-label">Output</div>
                  <div className="proc-val" style={{ color: 'var(--emerald)' }}>{procOutput.toFixed(0)} units</div>
                </div>
              </div>
              <table className="stmt-table" style={{ marginTop: 16 }}>
                <tbody>
                  <tr><td>Total Input Cost</td><td className="mono">₹{totalProcCost.toLocaleString()}</td></tr>
                  <tr><td>Normal Output</td><td className="mono">{normalOutput.toFixed(0)} units</td></tr>
                  <tr><td>Abnormal Loss Units</td><td className="mono" style={{ color: 'var(--rose)' }}>{proc.abnormalLoss}</td></tr>
                  <tr><td>Cost per Normal Unit</td><td className="mono" style={{ color: 'var(--cyan)' }}>₹{costPerUnit2.toFixed(2)}</td></tr>
                  <tr className="row-hl"><td style={{ fontWeight: 700 }}>Abnormal Loss A/c</td><td className="mono" style={{ color: 'var(--rose)', fontWeight: 700 }}>₹{(proc.abnormalLoss * costPerUnit2).toFixed(2)}</td></tr>
                  <tr className="row-profit"><td style={{ fontWeight: 700 }}>Output Valuation</td><td className="mono" style={{ color: 'var(--emerald)', fontWeight: 700 }}>₹{(procOutput * costPerUnit2).toFixed(2)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
