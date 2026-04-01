import React from 'react';

export const MathSlider = ({ label, min = 0, max = 100, step = 1, value, onChange, unit = '' }) => {
  return (
    <div className="math-slider-container" style={{ margin: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{label}</span>
        <span className="math-font" style={{ color: 'var(--accent)' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--primary)',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};
