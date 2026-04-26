import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#fcd34d';

function AdmissionSim() {
  const [capitalA, setCapitalA] = useState(100000);
  const [capitalB, setCapitalB] = useState(80000);
  const [shareA, setShareA] = useState(3);
  const [shareB, setShareB] = useState(2);
  const [newShare, setNewShare] = useState(4); // denominator of new partner's share e.g. 1/4
  const [goodwill, setGoodwill] = useState(60000);
  const [newCapital, setNewCapital] = useState(50000);
  const [premiumPaid, setPremiumPaid] = useState(15000);
  const [revalGain, setRevalGain] = useState(20000);

  const totalOld = shareA + shareB;
  const newPartnerFraction = 1 / newShare;
  const remainingFraction = 1 - newPartnerFraction;

  // Sacrifice ratio: old partners sacrifice in old ratio
  const sacrificeA = (shareA / totalOld) * newPartnerFraction;
  const sacrificeB = (shareB / totalOld) * newPartnerFraction;

  // New profit sharing ratio (simplified as fractions of total)
  const newRatioA = (shareA / totalOld) * remainingFraction;
  const newRatioB = (shareB / totalOld) * remainingFraction;

  const goodwillShareA = goodwill * (shareA / totalOld);
  const goodwillShareB = goodwill * (shareB / totalOld);

  const revalA = revalGain * (shareA / totalOld);
  const revalB = revalGain * (shareB / totalOld);

  const newCapA = capitalA + goodwillShareA + revalA;
  const newCapB = capitalB + goodwillShareB + revalB;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20, maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>OLD PARTNERS</div>
          <Slider label="A's Capital (₹)" min={10000} max={300000} step={10000} value={capitalA} onChange={setCapitalA} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="A's Share (numerator)" min={1} max={9} step={1} value={shareA} onChange={setShareA} color={COLOR} format={v => v + '/' + totalOld} />
          <Slider label="B's Capital (₹)" min={10000} max={300000} step={10000} value={capitalB} onChange={setCapitalB} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="B's Share (numerator)" min={1} max={9} step={1} value={shareB} onChange={setShareB} color={COLOR} format={v => v + '/' + totalOld} />
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', margin: '12px 0 8px' }}>NEW PARTNER (C)</div>
          <Slider label="C's Share (1/x)" min={3} max={8} step={1} value={newShare} onChange={setNewShare} color={COLOR} format={v => '1/' + v} />
          <Slider label="C's Capital (₹)" min={10000} max={200000} step={5000} value={newCapital} onChange={setNewCapital} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Premium for Goodwill (₹)" min={0} max={100000} step={2500} value={premiumPaid} onChange={setPremiumPaid} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Revaluation Gain (₹)" min={0} max={50000} step={2000} value={revalGain} onChange={setRevalGain} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Firm's Goodwill Value (₹)" min={0} max={200000} step={5000} value={goodwill} onChange={setGoodwill} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        <div>
          {/* Ratio display */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Profit Sharing Ratios</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              {[
                { name: 'Partner A', old: `${shareA}:${totalOld}`, newR: `${(newRatioA * 100).toFixed(1)}%`, sacrifice: `${(sacrificeA * 100).toFixed(1)}%`, color: COLOR },
                { name: 'Partner B', old: `${shareB}:${totalOld}`, newR: `${(newRatioB * 100).toFixed(1)}%`, sacrifice: `${(sacrificeB * 100).toFixed(1)}%`, color: '#f97316' },
                { name: 'Partner C (New)', old: '—', newR: `${(newPartnerFraction * 100).toFixed(1)}%`, sacrifice: '—', color: 'var(--emerald)' },
              ].map(p => (
                <div key={p.name} style={{
                  background: `${p.color}10`, border: `1px solid ${p.color}30`,
                  borderRadius: 12, padding: 16, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{p.name === 'Partner C (New)' ? '🆕' : '👤'}</div>
                  <div style={{ fontWeight: 700, color: p.color, fontFamily: 'var(--font-display)', marginBottom: 8 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>OLD RATIO</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text2)', marginBottom: 8 }}>{p.old}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>NEW RATIO</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: p.color }}>{p.newR}</div>
                  {p.sacrifice !== '—' && (
                    <>
                      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 8, marginBottom: 4 }}>SACRIFICE</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--rose)' }}>{p.sacrifice}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Capital accounts after admission */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Capital Accounts After Admission</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: `${COLOR}20` }}>
                    {['Item', 'Partner A', 'Partner B', 'Partner C'].map(h => (
                      <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Item' ? 'left' : 'right', color: COLOR, fontSize: 11, letterSpacing: '0.06em', borderBottom: `1px solid ${COLOR}30` }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Opening Capital', a: capitalA, b: capitalB, c: newCapital },
                    { label: 'Add: Goodwill Share', a: goodwillShareA, b: goodwillShareB, c: 0 },
                    { label: 'Add: Revaluation Gain', a: revalA, b: revalB, c: 0 },
                    { label: 'Add: Premium (share)', a: premiumPaid * (shareA / totalOld), b: premiumPaid * (shareB / totalOld), c: 0 },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '9px 14px', color: 'var(--text2)' }}>{row.label}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text)' }}>₹{row.a.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text)' }}>₹{row.b.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td style={{ padding: '9px 14px', textAlign: 'right', color: 'var(--text)' }}>₹{row.c.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    </tr>
                  ))}
                  <tr style={{ background: `${COLOR}12`, borderTop: `2px solid ${COLOR}40` }}>
                    <td style={{ padding: '10px 14px', color: COLOR, fontWeight: 700 }}>Final Capital</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: COLOR, fontWeight: 700 }}>₹{newCapA.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: COLOR, fontWeight: 700 }}>₹{newCapB.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', color: COLOR, fontWeight: 700 }}>₹{newCapital.toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <InfoBox color={COLOR} icon="💡">
            <strong>Sacrificing Ratio</strong> = Old Ratio − New Ratio. Partners A & B sacrifice in their old ratio {shareA}:{shareB} to give C a {(newPartnerFraction * 100).toFixed(0)}% share. Premium for goodwill ₹{premiumPaid.toLocaleString('en-IN')} is distributed between A and B in {shareA}:{shareB} ratio.
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

function GoodwillSim() {
  const [method, setMethod] = useState('avg');
  // Average profits method
  const [profits, setProfits] = useState([80000, 90000, 70000, 100000, 85000]);
  const [yearsGW, setYearsGW] = useState(3);
  // Super profits
  const [normalRate, setNormalRate] = useState(10);
  const [capital, setCapital] = useState(500000);
  // Capitalization
  const [capRate, setCapRate] = useState(12);

  const avgProfit = profits.reduce((a, b) => a + b, 0) / profits.length;
  const goodwillAvg = avgProfit * yearsGW;

  const normalProfit = capital * (normalRate / 100);
  const superProfit = avgProfit - normalProfit;
  const goodwillSuper = superProfit * yearsGW;

  const goodwillCap = (avgProfit / (capRate / 100));

  const METHODS = [
    { id: 'avg', label: 'Average Profits' },
    { id: 'super', label: 'Super Profits' },
    { id: 'cap', label: 'Capitalisation' },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {METHODS.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{
            padding: '10px 20px', borderRadius: 10, fontSize: 13,
            background: method === m.id ? COLOR : 'var(--surface)',
            color: method === m.id ? '#000' : 'var(--text2)',
            fontWeight: method === m.id ? 700 : 400,
            border: `1px solid ${method === m.id ? COLOR : 'var(--border)'}`,
          }}>{m.label}</button>
        ))}
      </div>

      {method === 'avg' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>ANNUAL PROFITS</div>
            {profits.map((p, i) => (
              <Slider key={i} label={`Year ${i + 1} Profit (₹)`} min={0} max={200000} step={5000} value={p}
                onChange={v => { const n = [...profits]; n[i] = v; setProfits(n); }} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
            ))}
            <Slider label="Years' Purchase" min={1} max={5} step={1} value={yearsGW} onChange={setYearsGW} color={COLOR} format={v => v + ' yrs'} />
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <StatBox label="AVERAGE PROFIT" value={avgProfit} color={COLOR} icon="📊" />
              <StatBox label="GOODWILL VALUE" value={goodwillAvg} color="var(--emerald)" icon="💎" />
            </div>
            <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
              <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Year-wise Profit Bars</div>
              {profits.map((p, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text2)', marginBottom: 4 }}>
                    <span>Year {i + 1}</span><span style={{ fontFamily: 'var(--font-mono)', color: COLOR }}>₹{p.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 10, position: 'relative' }}>
                    <div style={{ width: `${(p / 200000) * 100}%`, height: '100%', background: COLOR, borderRadius: 4, transition: 'width 0.4s', boxShadow: `0 0 8px ${COLOR}60` }} />
                    <div style={{ position: 'absolute', top: 0, left: `${(avgProfit / 200000) * 100}%`, width: 2, height: '100%', background: 'var(--rose)', opacity: 0.8 }} />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 8 }}>Red line = Average Profit</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <InfoBox color={COLOR} icon="🧮">
                Goodwill = Average Profit × Years' Purchase = ₹{avgProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} × {yearsGW} = <strong>₹{goodwillAvg.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
              </InfoBox>
            </div>
          </div>
        </div>
      )}

      {method === 'super' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
            <Slider label="Average Profit (₹)" min={0} max={300000} step={5000} value={avgProfit} onChange={() => {}} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
            <Slider label="Capital Employed (₹)" min={100000} max={2000000} step={50000} value={capital} onChange={setCapital} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
            <Slider label="Normal Rate of Return (%)" min={5} max={20} step={1} value={normalRate} onChange={setNormalRate} color={COLOR} format={v => v + '%'} />
            <Slider label="Years' Purchase" min={1} max={5} step={1} value={yearsGW} onChange={setYearsGW} color={COLOR} format={v => v + ' yrs'} />
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              <StatBox label="NORMAL PROFIT" value={normalProfit} color="var(--blue)" icon="📊" />
              <StatBox label="SUPER PROFIT" value={Math.max(0, superProfit)} color="var(--gold)" icon="⭐" sub={superProfit < 0 ? 'No goodwill' : undefined} />
              <StatBox label="GOODWILL" value={Math.max(0, goodwillSuper)} color="var(--emerald)" icon="💎" />
            </div>
            {/* Visual: Normal vs Actual */}
            <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Profit Breakdown</div>
              <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 24, padding: '0 20px' }}>
                {[
                  { label: 'Normal Profit', value: normalProfit, color: '#3b82f6' },
                  { label: 'Actual Profit', value: avgProfit, color: COLOR },
                  { label: 'Super Profit', value: Math.max(0, superProfit), color: 'var(--gold)' },
                ].map(bar => {
                  const max = Math.max(avgProfit, normalProfit) * 1.1;
                  return (
                    <div key={bar.label} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ height: `${(bar.value / max) * 100}px`, background: bar.color, borderRadius: '6px 6px 0 0', transition: 'height 0.4s ease', boxShadow: `0 0 12px ${bar.color}60`, marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 20 }}>
                        <span style={{ fontSize: 10, color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>₹{bar.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>{bar.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <InfoBox color={COLOR} icon="⭐">
                Super Profit = Actual Avg Profit − Normal Profit = ₹{avgProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} − ₹{normalProfit.toLocaleString('en-IN')} = <strong>₹{superProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                <br />Goodwill = Super Profit × {yearsGW} = <strong>₹{goodwillSuper.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
              </InfoBox>
            </div>
          </div>
        </div>
      )}

      {method === 'cap' && (
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
            <Slider label="Average Profit (₹)" min={10000} max={500000} step={10000} value={avgProfit} onChange={() => {}} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
            <Slider label="Normal Rate of Return (%)" min={5} max={25} step={1} value={capRate} onChange={setCapRate} color={COLOR} format={v => v + '%'} />
            <Slider label="Capital Employed (₹)" min={100000} max={2000000} step={50000} value={capital} onChange={setCapital} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
              <StatBox label="CAPITALISED VALUE" value={goodwillCap} color={COLOR} icon="💰" sub="of average profit" />
              <StatBox label="CAPITAL EMPLOYED" value={capital} color="var(--blue)" icon="🏦" />
              <StatBox label="GOODWILL" value={Math.max(0, goodwillCap - capital)} color="var(--emerald)" icon="💎" />
            </div>
            <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
              <div style={{ fontWeight: 600, marginBottom: 16 }}>Capitalisation Method Breakdown</div>
              {[
                { label: 'Capitalised Value of Profits', value: goodwillCap, formula: `₹${avgProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })} ÷ ${capRate}% = ₹${goodwillCap.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: COLOR },
                { label: 'Less: Capital Employed', value: capital, formula: 'As given', color: 'var(--rose)' },
                { label: 'Goodwill', value: Math.max(0, goodwillCap - capital), formula: 'Capitalised Value − Capital', color: 'var(--emerald)' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '14px', background: `${item.color}10`, border: `1px solid ${item.color}25`, borderRadius: 10, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 13, color: item.color, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{item.formula}</div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: item.color }}>₹{item.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RetirementSim() {
  const [capA, setCapA] = useState(150000);
  const [capB, setCapB] = useState(100000);
  const [capC, setCapC] = useState(80000);
  const [oldA, setOldA] = useState(3);
  const [oldB, setOldB] = useState(2);
  const [oldC, setOldC] = useState(1);
  const [retiree, setRetiree] = useState('B');
  const [revalGain, setRevalGain] = useState(24000);
  const [goodwillFirm, setGoodwillFirm] = useState(60000);

  const total = oldA + oldB + oldC;
  const gain = { A: revalGain * (oldA / total), B: revalGain * (oldB / total), C: revalGain * (oldC / total) };
  const gw = { A: goodwillFirm * (oldA / total), B: goodwillFirm * (oldB / total), C: goodwillFirm * (oldC / total) };
  const finalCap = {
    A: capA + gain.A + gw.A,
    B: capB + gain.B + gw.B,
    C: capC + gain.C + gw.C,
  };
  const amountDue = finalCap[retiree];

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="A's Capital (₹)" min={10000} max={400000} step={10000} value={capA} onChange={setCapA} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="A's Share" min={1} max={6} step={1} value={oldA} onChange={setOldA} color={COLOR} format={v => v + '/' + total} />
          <Slider label="B's Capital (₹)" min={10000} max={400000} step={10000} value={capB} onChange={setCapB} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="B's Share" min={1} max={6} step={1} value={oldB} onChange={setOldB} color={COLOR} format={v => v + '/' + total} />
          <Slider label="C's Capital (₹)" min={10000} max={400000} step={10000} value={capC} onChange={setCapC} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="C's Share" min={1} max={6} step={1} value={oldC} onChange={setOldC} color={COLOR} format={v => v + '/' + total} />
          <Slider label="Revaluation Gain (₹)" min={0} max={100000} step={2000} value={revalGain} onChange={setRevalGain} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Firm's Goodwill (₹)" min={0} max={200000} step={5000} value={goodwillFirm} onChange={setGoodwillFirm} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>RETIRING PARTNER</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['A', 'B', 'C'].map(p => (
                <button key={p} onClick={() => setRetiree(p)} style={{
                  flex: 1, padding: '10px', borderRadius: 8,
                  background: retiree === p ? COLOR : 'var(--surface2)',
                  color: retiree === p ? '#000' : 'var(--text2)',
                  fontWeight: 700,
                }}>{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ padding: '20px', background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.3)', borderRadius: 14, marginBottom: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>AMOUNT DUE TO RETIRING PARTNER {retiree}</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: COLOR, fontFamily: 'var(--font-display)' }}>₹{amountDue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 13, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <thead>
                <tr style={{ background: `${COLOR}20` }}>
                  {['Item', 'Partner A', 'Partner B', 'Partner C'].map(h => (
                    <th key={h} style={{ padding: '10px 14px', textAlign: h === 'Item' ? 'left' : 'right', color: COLOR, fontSize: 11, borderBottom: `1px solid ${COLOR}30` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Opening Capital', a: capA, b: capB, c: capC },
                  { label: 'Add: Revaluation Gain', a: gain.A, b: gain.B, c: gain.C },
                  { label: 'Add: Goodwill Share', a: gw.A, b: gw.B, c: gw.C },
                  { label: 'Final Capital (Due)', a: finalCap.A, b: finalCap.B, c: finalCap.C, highlight: true },
                ].map((row, i) => (
                  <tr key={i} style={{ background: row.highlight ? `${COLOR}12` : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', borderBottom: `${row.highlight ? '2px' : '1px'} solid ${row.highlight ? COLOR + '40' : 'var(--border)'}` }}>
                    <td style={{ padding: '9px 14px', color: row.highlight ? COLOR : 'var(--text2)', fontWeight: row.highlight ? 700 : 400 }}>{row.label}</td>
                    {['A', 'B', 'C'].map(p => (
                      <td key={p} style={{ padding: '9px 14px', textAlign: 'right', color: retiree === p ? 'var(--rose)' : (row.highlight ? COLOR : 'var(--text)'), fontWeight: row.highlight ? 700 : 400 }}>
                        ₹{({ A: row.a, B: row.b, C: row.c }[p]).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    ))}
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

const TABS = [
  { id: 'admission', label: '🆕 Admission of Partner' },
  { id: 'goodwill', label: '💎 Goodwill Valuation' },
  { id: 'retirement', label: '🚪 Retirement / Death' },
];

export default function Partnership() {
  const [tab, setTab] = useState('admission');
  return (
    <PageWrapper>
      <PageHeader title="Partnership Accounts" subtitle="Simulate partner admission, goodwill valuation methods, and retirement settlements interactively" icon="👥" color={COLOR} tag="CHAPTER 08" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'admission' && <AdmissionSim />}
          {tab === 'goodwill' && <GoodwillSim />}
          {tab === 'retirement' && <RetirementSim />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
