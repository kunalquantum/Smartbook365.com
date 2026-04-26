import { Link } from 'react-router-dom'
import './Home.css'

const BASE = '/commerce/accounts/advanced'

const TOPICS = [
  { path: BASE + '/financial-statements', label: 'Financial Statement Analysis', sub: 'Comparative · Common Size', icon: '📊', color: '#00e5ff', desc: 'Compare companies across time periods with live animated statements' },
  { path: BASE + '/ratio-analysis', label: 'Ratio Analysis', sub: 'Liquidity · Profitability · Solvency', icon: '⚖️', color: '#10b981', desc: 'Drag sliders, watch ratios transform in real time' },
  { path: BASE + '/cash-flow', label: 'Cash Flow Statement', sub: 'Operating · Investing · Financing', icon: '💧', color: '#38bdf8', desc: 'See cash flow like water — watch it fill, drain and balance' },
  { path: BASE + '/cost-accounting', label: 'Cost Accounting', sub: 'Elements · Job · Process', icon: '🏗️', color: '#fbbf24', desc: 'Build products from raw materials to finished goods live' },
  { path: BASE + '/marginal-costing', label: 'Marginal Costing', sub: 'Contribution · Break-even', icon: '📈', color: '#f0abfc', desc: 'Watch the BEP shift as fixed costs and prices change' },
  { path: BASE + '/budgeting', label: 'Budgeting', sub: 'Types · Flexible Budget', icon: '🎯', color: '#f43f5e', desc: 'Flex the budget and see actual vs budgeted variance live' },
  { path: BASE + '/standard-costing', label: 'Standard Costing', sub: 'Variance · Material & Labour', icon: '📐', color: '#fb923c', desc: 'Simulate real vs standard — variance tells the story' },
]

export default function Home() {
  return (
    <div className="home">
      <div className="home-hero">
        <div className="hero-badge">
          <span>✦</span> Interactive Learning Platform
        </div>
        <h1 className="hero-title">
          Accounting<br />
          <span className="gradient-text">Comes Alive</span>
        </h1>
        <p className="hero-sub">
          Advanced Accounting & Cost Accounting — simulated, interactive, animated.<br />
          Touch the sliders. Watch the numbers breathe.
        </p>
        <div className="hero-stats">
          <div className="stat"><span className="stat-n">7</span><span className="stat-l">Topics</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">25+</span><span className="stat-l">Simulations</span></div>
          <div className="stat-div" />
          <div className="stat"><span className="stat-n">∞</span><span className="stat-l">Parameters</span></div>
        </div>
      </div>

      <div className="topics-grid">
        {TOPICS.map((t, i) => (
          <Link to={t.path} key={t.path} className="topic-card" style={{ '--c': t.color, animationDelay: `${i * 0.07}s` }}>
            <div className="topic-glow" />
            <div className="topic-icon">{t.icon}</div>
            <div className="topic-num mono">0{i + 1}</div>
            <h3 className="topic-label">{t.label}</h3>
            <p className="topic-sub">{t.sub}</p>
            <p className="topic-desc">{t.desc}</p>
            <div className="topic-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
