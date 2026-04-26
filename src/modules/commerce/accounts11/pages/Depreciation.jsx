import { useState, useEffect } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#f43f5e';

function SLMSim() {
  const [cost, setCost] = useState(100000);
  const [salvage, setSalvage] = useState(10000);
  const [life, setLife] = useState(10);
  const [year, setYear] = useState(1);

  const annualDep = (cost - salvage) / life;
  const depRate = ((annualDep / cost) * 100).toFixed(2);
  const accumulated = annualDep * year;
  const bookValue = cost - accumulated;
  const years = Array.from({ length: life }, (_, i) => ({
    yr: i + 1,
    dep: annualDep,
    bv: cost - annualDep * (i + 1),
    acc: annualDep * (i + 1),
  }));

  useEffect(() => { if (year > life) setYear(life); }, [life]);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Cost of Asset (₹)" min={10000} max={500000} step={10000} value={cost} onChange={setCost} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Salvage Value (₹)" min={0} max={50000} step={1000} value={salvage} onChange={setSalvage} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Useful Life (years)" min={2} max={20} step={1} value={life} onChange={setLife} color={COLOR} format={v => v + ' yrs'} />
          <Slider label="View Year" min={1} max={life} step={1} value={year} onChange={setYear} color={COLOR} format={v => 'Year ' + v} />

          <div style={{ marginTop: 20, padding: '12px', background: `${COLOR}10`, border: `1px solid ${COLOR}30`, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>FORMULA</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
              Annual Dep = (Cost − Salvage) / Life<br />
              = (₹{cost.toLocaleString('en-IN')} − ₹{salvage.toLocaleString('en-IN')}) / {life}<br />
              = <span style={{ color: COLOR }}>₹{annualDep.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span><br />
              Rate = <span style={{ color: COLOR }}>{depRate}% p.a.</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="ANNUAL DEPRECIATION" value={annualDep} color={COLOR} icon="📉" sub={`${depRate}% per year`} />
            <StatBox label={`BOOK VALUE (Year ${year})`} value={bookValue} color="var(--blue)" icon="📘" />
            <StatBox label="ACCUMULATED DEP" value={accumulated} color="var(--orange)" icon="🔢" />
          </div>

          {/* Asset value bar chart */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Asset Book Value Over Time (SLM)</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 160 }}>
              {years.map((y, i) => (
                <div key={y.yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%',
                    height: `${(y.bv / cost) * 140}px`,
                    background: year === y.yr
                      ? `linear-gradient(180deg, ${COLOR}, ${COLOR}88)`
                      : y.bv > 0 ? 'var(--surface2)' : 'var(--surface)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    boxShadow: year === y.yr ? `0 0 12px ${COLOR}60` : 'none',
                  }} onClick={() => setYear(y.yr)} />
                  {years.length <= 15 && (
                    <span style={{ fontSize: 9, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{y.yr}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 12, color: COLOR }}>■ Selected Year</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>■ Other Years</span>
            </div>
          </div>

          {/* Year schedule table */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead>
                <tr style={{ background: `${COLOR}20` }}>
                  {['Year', 'Opening BV', 'Depreciation', 'Closing BV', 'Accum. Dep'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'right', color: COLOR, fontSize: 11, letterSpacing: '0.05em', fontWeight: 700, borderBottom: `1px solid ${COLOR}30` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {years.map((y, i) => (
                  <tr key={y.yr}
                    onClick={() => setYear(y.yr)}
                    style={{
                      background: year === y.yr ? `${COLOR}12` : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      cursor: 'pointer',
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}>
                    <td style={{ padding: '9px 14px', color: year === y.yr ? COLOR : 'var(--text2)', textAlign: 'right', fontWeight: year === y.yr ? 700 : 400 }}>Yr {y.yr}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text2)' }}>₹{(cost - annualDep * i).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: COLOR }}>₹{y.dep.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text)' }}>₹{y.bv.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--orange)' }}>₹{y.acc.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function WDVSim() {
  const [cost, setCost] = useState(100000);
  const [rate, setRate] = useState(20);
  const [years, setYears] = useState(8);
  const [viewYear, setViewYear] = useState(1);

  const schedule = Array.from({ length: years }, (_, i) => {
    const bvPrev = i === 0 ? cost : cost * Math.pow(1 - rate / 100, i);
    const dep = bvPrev * (rate / 100);
    const bv = bvPrev - dep;
    return { yr: i + 1, bvPrev, dep, bv };
  });

  const current = schedule[viewYear - 1];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Original Cost (₹)" min={10000} max={500000} step={10000} value={cost} onChange={setCost} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="WDV Rate (%)" min={5} max={50} step={5} value={rate} onChange={setRate} color={COLOR} format={v => v + '%'} />
          <Slider label="No. of Years" min={2} max={15} step={1} value={years} onChange={setYears} color={COLOR} format={v => v + ' years'} />
          <Slider label="View Year" min={1} max={years} step={1} value={viewYear} onChange={setViewYear} color={COLOR} format={v => 'Year ' + v} />

          <div style={{ marginTop: 20, padding: '12px', background: `${COLOR}10`, border: `1px solid ${COLOR}30`, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>FORMULA</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
              Dep = WDV × Rate<br />
              Yr {viewYear}: ₹{current?.bvPrev.toFixed(0)} × {rate}%<br />
              = <span style={{ color: COLOR }}>₹{current?.dep.toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label={`DEPRECIATION (Y${viewYear})`} value={current?.dep || 0} color={COLOR} icon="📉" />
            <StatBox label={`BOOK VALUE (Y${viewYear})`} value={current?.bv || 0} color="var(--blue)" icon="📘" />
            <StatBox label="TOTAL CHARGED" value={cost - (current?.bv || 0)} color="var(--orange)" icon="🔢" />
          </div>

          {/* Curve chart - WDV creates diminishing curve */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 20, fontFamily: 'var(--font-display)' }}>Diminishing Balance — Book Value Curve</div>
            <svg width="100%" height="160" viewBox={`0 0 ${Math.max(200, years * 30)} 160`} preserveAspectRatio="xMidYMid meet">
              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map(v => (
                <line key={v} x1="0" y1={v * 140} x2={Math.max(200, years * 30)} y2={v * 140}
                  stroke="rgba(120,120,200,0.1)" strokeWidth="1" />
              ))}
              {/* WDV curve */}
              <polyline
                points={schedule.map((y, i) => `${i * (Math.max(200, years * 30) / (years - 1)) || 0},${140 - (y.bv / cost) * 130}`).join(' ')}
                fill="none"
                stroke={COLOR}
                strokeWidth="2.5"
                style={{ filter: `drop-shadow(0 0 6px ${COLOR}80)` }}
              />
              {/* Points */}
              {schedule.map((y, i) => (
                <circle key={i}
                  cx={i * (Math.max(200, years * 30) / (years - 1)) || 0}
                  cy={140 - (y.bv / cost) * 130}
                  r={viewYear === y.yr ? 6 : 3}
                  fill={viewYear === y.yr ? COLOR : 'var(--surface)'}
                  stroke={COLOR}
                  strokeWidth="1.5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewYear(y.yr)}
                />
              ))}
            </svg>
          </div>

          {/* Table */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', maxHeight: 300, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
              <thead style={{ position: 'sticky', top: 0 }}>
                <tr style={{ background: `${COLOR}20` }}>
                  {['Year', 'Opening WDV', 'Depreciation', 'Closing WDV'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: 'right', color: COLOR, fontSize: 11, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schedule.map((y, i) => (
                  <tr key={y.yr} onClick={() => setViewYear(y.yr)} style={{
                    background: viewYear === y.yr ? `${COLOR}12` : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    cursor: 'pointer', borderBottom: '1px solid var(--border)',
                  }}>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: viewYear === y.yr ? COLOR : 'var(--text2)' }}>Yr {y.yr}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text2)' }}>₹{y.bvPrev.toFixed(0)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: COLOR }}>₹{y.dep.toFixed(0)}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text)' }}>₹{y.bv.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonSim() {
  const [cost, setCost] = useState(100000);
  const [salvage, setSalvage] = useState(10000);
  const [life, setLife] = useState(8);
  const [wdvRate, setWdvRate] = useState(25);

  const slmAnnual = (cost - salvage) / life;
  const slmYears = Array.from({ length: life }, (_, i) => ({ yr: i + 1, dep: slmAnnual, bv: cost - slmAnnual * (i + 1) }));
  const wdvYears = Array.from({ length: life }, (_, i) => {
    const bvPrev = cost * Math.pow(1 - wdvRate / 100, i);
    return { yr: i + 1, dep: bvPrev * (wdvRate / 100), bv: bvPrev * (1 - wdvRate / 100) };
  });

  return (
    <div>
      <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <Slider label="Cost (₹)" min={10000} max={500000} step={10000} value={cost} onChange={setCost} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Salvage (₹)" min={0} max={50000} step={1000} value={salvage} onChange={setSalvage} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Life (years)" min={3} max={15} step={1} value={life} onChange={setLife} color={COLOR} format={v => v + ' yrs'} />
          <Slider label="WDV Rate (%)" min={10} max={50} step={5} value={wdvRate} onChange={setWdvRate} color={COLOR} format={v => v + '%'} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="card" style={{ border: '1px solid rgba(59,130,246,0.3)' }}>
          <div style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 16, fontFamily: 'var(--font-display)' }}>SLM — Straight Line Method</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>Annual Depreciation (constant)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#3b82f6', fontFamily: 'var(--font-display)' }}>₹{slmAnnual.toFixed(0)}</div>
          </div>
          {slmYears.map(y => (
            <div key={y.yr} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
                <span>Year {y.yr}</span><span>₹{y.dep.toFixed(0)} | BV: ₹{y.bv.toFixed(0)}</span>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 3, height: 6 }}>
                <div style={{ width: `${(y.bv / cost) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ border: `1px solid ${COLOR}40` }}>
          <div style={{ fontWeight: 700, color: COLOR, marginBottom: 16, fontFamily: 'var(--font-display)' }}>WDV — Written Down Value Method</div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>Rate (diminishing each year)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLOR, fontFamily: 'var(--font-display)' }}>{wdvRate}% per year</div>
          </div>
          {wdvYears.map(y => (
            <div key={y.yr} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 2 }}>
                <span>Year {y.yr}</span><span>₹{y.dep.toFixed(0)} | BV: ₹{y.bv.toFixed(0)}</span>
              </div>
              <div style={{ background: 'var(--surface2)', borderRadius: 3, height: 6 }}>
                <div style={{ width: `${(y.bv / cost) * 100}%`, height: '100%', background: COLOR, borderRadius: 3, transition: 'width 0.4s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <InfoBox color={COLOR} icon="⚖️">
          <strong>SLM</strong>: Equal depreciation each year — simpler, suits assets with uniform use.<br />
          <strong>WDV</strong>: Higher depreciation initially, decreasing over time — suits assets that lose value faster when new (machinery, vehicles).<br />
          Total depreciation charged: SLM = ₹{(cost - salvage).toLocaleString('en-IN')} | WDV ≈ ₹{Math.round(cost - wdvYears[life - 1]?.bv || 0).toLocaleString('en-IN')}
        </InfoBox>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'slm', label: '📏 SLM Method' },
  { id: 'wdv', label: '📉 WDV Method' },
  { id: 'compare', label: '⚖️ Comparison' },
];

export default function DepreciationPage() {
  const [tab, setTab] = useState('slm');
  return (
    <PageWrapper>
      <PageHeader title="Depreciation" subtitle="Visualize how assets lose value over time using Straight Line and Written Down Value methods" icon="📉" color={COLOR} tag="CHAPTER 03" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'slm' && <SLMSim />}
          {tab === 'wdv' && <WDVSim />}
          {tab === 'compare' && <ComparisonSim />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
