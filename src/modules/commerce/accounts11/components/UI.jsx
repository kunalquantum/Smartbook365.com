// Reusable UI Components

export function PageHeader({ title, subtitle, icon, color = 'var(--accent)', tag }) {
  return (
    <div style={{
      padding: '48px 40px 32px',
      background: `radial-gradient(ellipse at top left, ${color}12 0%, transparent 60%)`,
      borderBottom: '1px solid var(--border)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(circle, rgba(120,120,200,0.08) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        pointerEvents: 'none'
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {tag && (
          <div style={{
            display: 'inline-block',
            background: `${color}20`,
            border: `1px solid ${color}40`,
            color: color,
            padding: '3px 12px',
            borderRadius: 100,
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.12em',
            marginBottom: 16,
            fontWeight: 700,
          }}>{tag}</div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: `linear-gradient(135deg, ${color}30, ${color}10)`,
            border: `2px solid ${color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
            boxShadow: `0 0 24px ${color}30`,
            flexShrink: 0,
          }} className="animate-float">{icon}</div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 4vw, 42px)',
              fontWeight: 800,
              background: `linear-gradient(135deg, ${color}, var(--text))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
            }}>{title}</h1>
            {subtitle && <p style={{ color: 'var(--text2)', marginTop: 8, maxWidth: 600 }}>{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Slider({ label, min, max, step = 1, value, onChange, color = 'var(--accent)', format }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <label style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>{label}</label>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: color,
          background: `${color}15`,
          padding: '2px 10px',
          borderRadius: 6,
          border: `1px solid ${color}30`,
          fontWeight: 700,
        }}>{format ? format(value) : value}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ '--thumb-color': color }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{min}</span>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{max}</span>
      </div>
    </div>
  );
}

export function StatBox({ label, value, color = 'var(--accent)', prefix = '₹', icon, sub }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${color}12, transparent)`,
      border: `1px solid ${color}30`,
      borderRadius: 14,
      padding: '18px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', right: -10, top: -10,
        width: 60, height: 60, borderRadius: '50%',
        background: `${color}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>{icon}</div>
      <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}
      </div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export function TabBar({ tabs, active, onChange, color = 'var(--accent)' }) {
  return (
    <div style={{
      display: 'flex', gap: 4,
      background: 'var(--bg2)',
      padding: 4,
      borderRadius: 12,
      border: '1px solid var(--border)',
      flexWrap: 'wrap',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            background: active === tab.id ? color : 'transparent',
            color: active === tab.id ? '#fff' : 'var(--text2)',
            fontWeight: active === tab.id ? 600 : 400,
            fontSize: 13,
            boxShadow: active === tab.id ? `0 0 12px ${color}60` : 'none',
            transition: 'all 0.2s',
          }}
        >{tab.label}</button>
      ))}
    </div>
  );
}

export function LedgerTable({ headers, rows, footerRows, color = 'var(--accent)' }) {
  return (
    <div style={{
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid var(--border)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: `${color}20` }}>
            {headers.map((h, i) => (
              <th key={i} style={{
                padding: '10px 16px',
                textAlign: i === 0 ? 'left' : 'right',
                color,
                fontSize: 11,
                letterSpacing: '0.08em',
                fontWeight: 700,
                borderBottom: `1px solid ${color}30`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} style={{
              background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
              borderBottom: '1px solid var(--border)',
              animation: `slide-up 0.3s ease ${ri * 0.05}s both`,
            }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{
                  padding: '10px 16px',
                  textAlign: ci === 0 ? 'left' : 'right',
                  color: ci === 0 ? 'var(--text)' : 'var(--text2)',
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
        {footerRows && (
          <tfoot>
            {footerRows.map((row, ri) => (
              <tr key={ri} style={{
                background: `${color}10`,
                borderTop: `2px solid ${color}40`,
              }}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '12px 16px',
                    textAlign: ci === 0 ? 'left' : 'right',
                    color,
                    fontWeight: 700,
                  }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tfoot>
        )}
      </table>
    </div>
  );
}

export function InfoBox({ children, color = 'var(--accent)', icon = 'ℹ️' }) {
  return (
    <div style={{
      background: `${color}10`,
      border: `1px solid ${color}30`,
      borderRadius: 10,
      padding: '12px 16px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      fontSize: 13,
      color: 'var(--text2)',
      lineHeight: 1.6,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function AnimNumber({ value, prefix = '₹', decimals = 0 }) {
  const formatted = typeof value === 'number'
    ? value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value;
  return <span style={{ transition: 'all 0.3s', display: 'inline-block' }}>{prefix}{formatted}</span>;
}

export function PageWrapper({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {children}
    </div>
  );
}

export function ContentArea({ children }) {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, color = 'var(--accent)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, marginTop: 32 }}>
      <div style={{ width: 4, height: 20, background: color, borderRadius: 2, boxShadow: `0 0 8px ${color}` }} />
      <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{children}</h2>
    </div>
  );
}
