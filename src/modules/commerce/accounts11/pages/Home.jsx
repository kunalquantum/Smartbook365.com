import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const BASE = '/commerce/accounts/11th';

const TOPICS = [
  {
    path: BASE + '/financial-statements',
    title: 'Financial Statements',
    desc: 'Trading A/c · P&L A/c · Balance Sheet',
    icon: '📊',
    color: '#f0b429',
    topics: ['Trading Account', 'Profit & Loss', 'Balance Sheet'],
    chapter: '01'
  },
  {
    path: BASE + '/adjustments',
    title: 'Adjustments',
    desc: 'Closing Stock · Depreciation · Outstanding · Prepaid',
    icon: '⚙️',
    color: '#14b8a6',
    topics: ['Closing Stock', 'Depreciation', 'Outstanding', 'Prepaid'],
    chapter: '02'
  },
  {
    path: BASE + '/depreciation',
    title: 'Depreciation',
    desc: 'SLM · WDV Methods · Asset Schedule',
    icon: '📉',
    color: '#f43f5e',
    topics: ['SLM', 'WDV', 'Comparison'],
    chapter: '03'
  },
  {
    path: BASE + '/bills-of-exchange',
    title: 'Bills of Exchange',
    desc: 'Receivable · Payable · Dishonour · Renewal',
    icon: '📜',
    color: '#3b82f6',
    topics: ['Bills Receivable', 'Bills Payable', 'Dishonour', 'Renewal'],
    chapter: '04'
  },
  {
    path: BASE + '/consignment',
    title: 'Consignment',
    desc: 'Goods Sent · Stock Valuation · Abnormal Loss',
    icon: '📦',
    color: '#f97316',
    topics: ['Goods Sent', 'Stock Valuation', 'Abnormal Loss'],
    chapter: '05'
  },
  {
    path: BASE + '/joint-venture',
    title: 'Joint Venture',
    desc: 'Methods of Recording · Profit Sharing',
    icon: '🤝',
    color: '#10b981',
    topics: ['Separate Books', 'Memorandum Method', 'Profit Sharing'],
    chapter: '06'
  },
  {
    path: BASE + '/npo',
    title: 'Not-for-Profit Orgs',
    desc: 'Receipts & Payments · Income & Expenditure',
    icon: '🏛️',
    color: '#a78bfa',
    topics: ['R&P Account', 'I&E Account', 'Subscriptions'],
    chapter: '07'
  },
  {
    path: BASE + '/partnership',
    title: 'Partnership Accounts',
    desc: 'Admission · Retirement · Goodwill',
    icon: '👥',
    color: '#fcd34d',
    topics: ['Admission', 'Retirement', 'Goodwill'],
    chapter: '08'
  },
];

function FloatingOrb({ x, y, size, color, delay }) {
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      width: size, height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color}30, transparent 70%)`,
      animation: `float ${3 + delay}s ease-in-out ${delay}s infinite`,
      pointerEvents: 'none',
      filter: 'blur(1px)',
    }} />
  );
}

export default function Home() {
  const [hovered, setHovered] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 50);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background orbs */}
      <FloatingOrb x={10} y={20} size={300} color="#7c6af7" delay={0} />
      <FloatingOrb x={80} y={60} size={200} color="#f0b429" delay={1.5} />
      <FloatingOrb x={50} y={80} size={250} color="#14b8a6" delay={0.8} />
      <FloatingOrb x={90} y={10} size={150} color="#f43f5e" delay={2.2} />

      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(120,120,200,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,120,200,0.05) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '60px 40px', maxWidth: 1200, margin: '0 auto' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(124,106,247,0.15)',
            border: '1px solid rgba(124,106,247,0.3)',
            padding: '6px 20px',
            borderRadius: 100,
            fontSize: 12,
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent2)',
            letterSpacing: '0.1em',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
            INTERACTIVE · ANIMATED · SIMULATED
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 7vw, 80px)',
            fontWeight: 800,
            lineHeight: 1.05,
            marginBottom: 20,
            background: 'linear-gradient(135deg, #fff 0%, var(--accent2) 50%, var(--gold2) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ANIMAARF
          </h1>

          <p style={{
            fontSize: 18,
            color: 'var(--text2)',
            maxWidth: 560,
            margin: '0 auto',
            lineHeight: 1.7,
          }}>
            12th Grade Financial Accounting — <em>brought to life</em> through interactive simulations, animated ledgers, and real-time calculations.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            {['8 Topics', '24+ Simulations', 'Real-time Math', 'Animated Ledgers'].map(t => (
              <span key={t} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border2)',
                padding: '6px 16px',
                borderRadius: 100,
                fontSize: 13,
                color: 'var(--text2)',
                fontFamily: 'var(--font-mono)',
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Topic Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {TOPICS.map((topic, i) => (
            <Link
              key={topic.path}
              to={topic.path}
              style={{ textDecoration: 'none' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div style={{
                background: hovered === i
                  ? `linear-gradient(135deg, ${topic.color}18, var(--surface))`
                  : 'var(--surface)',
                border: `1px solid ${hovered === i ? topic.color + '50' : 'var(--border)'}`,
                borderRadius: 20,
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                transform: hovered === i ? 'translateY(-4px)' : 'none',
                boxShadow: hovered === i ? `0 12px 40px ${topic.color}20` : 'none',
                position: 'relative',
                overflow: 'hidden',
                animation: `slide-up 0.4s ease ${i * 0.06}s both`,
              }}>
                {/* Chapter badge */}
                <div style={{
                  position: 'absolute',
                  top: 16, right: 16,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: 'var(--text3)',
                  letterSpacing: '0.1em',
                }}>CH {topic.chapter}</div>

                {/* Glow bg */}
                <div style={{
                  position: 'absolute', right: -20, bottom: -20,
                  width: 120, height: 120, borderRadius: '50%',
                  background: `radial-gradient(circle, ${topic.color}15, transparent 70%)`,
                  transition: 'all 0.3s',
                  transform: hovered === i ? 'scale(1.5)' : 'scale(1)',
                }} />

                <div style={{
                  width: 52, height: 52,
                  borderRadius: 14,
                  background: `${topic.color}20`,
                  border: `2px solid ${topic.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                  marginBottom: 16,
                  boxShadow: hovered === i ? `0 0 16px ${topic.color}40` : 'none',
                  transition: 'all 0.3s',
                }}>{topic.icon}</div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--text)',
                  marginBottom: 6,
                }}>{topic.title}</h3>

                <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16, lineHeight: 1.5 }}>{topic.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {topic.topics.map(t => (
                    <span key={t} style={{
                      background: `${topic.color}12`,
                      border: `1px solid ${topic.color}25`,
                      color: topic.color,
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontFamily: 'var(--font-mono)',
                    }}>{t}</span>
                  ))}
                </div>

                <div style={{
                  marginTop: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: topic.color,
                  fontSize: 13,
                  fontWeight: 600,
                  opacity: hovered === i ? 1 : 0.5,
                  transition: 'all 0.2s',
                }}>
                  Explore simulation →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 60, color: 'var(--text3)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>
          ANIMAARF · 12th Grade Accounting Simulations · Built for learning
        </div>
      </div>
    </div>
  );
}
