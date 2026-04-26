import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#10b981';

function JVMemorandum() {
  const [aContrib, setAContrib] = useState(80000);
  const [bContrib, setBContrib] = useState(60000);
  const [aExpenses, setAExpenses] = useState(10000);
  const [bExpenses, setBExpenses] = useState(8000);
  const [sales, setSales] = useState(200000);
  const [shareA, setShareA] = useState(60);

  const shareB = 100 - shareA;
  const totalCost = aContrib + bContrib + aExpenses + bExpenses;
  const profit = sales - totalCost;
  const profitA = profit * (shareA / 100);
  const profitB = profit * (shareB / 100);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>PARTNER A</div>
          <Slider label="A's Contribution (₹)" min={0} max={300000} step={10000} value={aContrib} onChange={setAContrib} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="A's Expenses (₹)" min={0} max={50000} step={1000} value={aExpenses} onChange={setAExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, marginTop: 12 }}>PARTNER B</div>
          <Slider label="B's Contribution (₹)" min={0} max={300000} step={10000} value={bContrib} onChange={setBContrib} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="B's Expenses (₹)" min={0} max={50000} step={1000} value={bExpenses} onChange={setBExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8, marginTop: 12 }}>JOINT VENTURE</div>
          <Slider label="Total Sales (₹)" min={50000} max={800000} step={10000} value={sales} onChange={setSales} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="A's Profit Share (%)" min={10} max={90} step={5} value={shareA} onChange={setShareA} color={COLOR} format={v => v + '%'} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="TOTAL SALES" value={sales} color={COLOR} icon="💰" />
            <StatBox label="TOTAL COST" value={totalCost} color="var(--orange)" icon="🏭" />
            <StatBox label={profit >= 0 ? 'JV PROFIT' : 'JV LOSS'} value={Math.abs(profit)} color={profit >= 0 ? 'var(--emerald)' : 'var(--rose)'} icon={profit >= 0 ? '📈' : '📉'} />
          </div>

          {/* Profit sharing visual */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Profit Sharing</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { name: 'Partner A', share: shareA, profit: profitA, color: COLOR },
                { name: 'Partner B', share: shareB, profit: profitB, color: '#3b82f6' },
              ].map(p => (
                <div key={p.name} style={{ background: `${p.color}10`, border: `1px solid ${p.color}30`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>{p.name === 'Partner A' ? '👤' : '👥'}</div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: p.color, fontFamily: 'var(--font-display)' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{p.share}% share</div>
                  <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', color: profit >= 0 ? 'var(--emerald)' : 'var(--rose)' }}>
                    ₹{Math.abs(p.profit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>{profit >= 0 ? 'Profit' : 'Loss'}</div>
                </div>
              ))}
            </div>

            {/* Share bar */}
            <div style={{ height: 24, borderRadius: 12, overflow: 'hidden', display: 'flex' }}>
              <div style={{ width: `${shareA}%`, background: `linear-gradient(90deg, ${COLOR}, ${COLOR}cc)`, transition: 'width 0.4s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>A {shareA}%</span>
              </div>
              <div style={{ width: `${shareB}%`, background: 'linear-gradient(90deg, #3b82f6cc, #3b82f6)', transition: 'width 0.4s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>B {shareB}%</span>
              </div>
            </div>
          </div>

          {/* Memorandum JV Account */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>DR — MEMORANDUM JV A/C</span>
              </div>
              {[['To A\'s Contribution', aContrib], ['To B\'s Contribution', bContrib], ['To A\'s Expenses', aExpenses], ['To B\'s Expenses', bExpenses], ...(profit >= 0 ? [['To Profit (A)', profitA], ['To Profit (B)', profitB]] : [])].map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{sales.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>CR</span>
              </div>
              {[['By Sales', sales], ...(profit < 0 ? [['By Loss (A)', -profitA], ['By Loss (B)', -profitB]] : [])].map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{sales.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeparateBooksMethod() {
  const [purchase, setPurchase] = useState(100000);
  const [expenses, setExpenses] = useState(15000);
  const [sales, setSales] = useState(160000);
  const [partnerShare, setPartnerShare] = useState(50);

  const profit = sales - purchase - expenses;
  const myShare = profit * (partnerShare / 100);
  const coventureBalance = sales - purchase - expenses; // simplified

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Purchases (₹)" min={10000} max={400000} step={10000} value={purchase} onChange={setPurchase} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Joint Expenses (₹)" min={0} max={50000} step={1000} value={expenses} onChange={setExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sales (₹)" min={50000} max={600000} step={10000} value={sales} onChange={setSales} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="My Profit Share (%)" min={10} max={90} step={10} value={partnerShare} onChange={setPartnerShare} color={COLOR} format={v => v + '%'} />
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
            <StatBox label="JOINT PROFIT" value={profit} color={profit >= 0 ? COLOR : 'var(--rose)'} icon="🤝" />
            <StatBox label="MY SHARE" value={myShare} color="var(--blue)" icon="👤" sub={`${partnerShare}%`} />
            <StatBox label="PARTNER'S SHARE" value={profit - myShare} color="var(--accent)" icon="👥" sub={`${100 - partnerShare}%`} />
          </div>
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Joint Venture A/c (In My Books)</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2.2 }}>
              {[
                { dr: 'Joint Venture A/c', cr: 'Cash/Bank A/c', amt: purchase, note: 'Purchases for JV' },
                { dr: 'Joint Venture A/c', cr: 'Cash/Bank A/c', amt: expenses, note: 'Expenses paid' },
                { dr: 'Cash/Bank A/c', cr: 'Joint Venture A/c', amt: sales, note: 'Sales proceeds' },
                { dr: 'Joint Venture A/c', cr: 'Profit & Loss A/c', amt: myShare, note: `My share of profit (${partnerShare}%)` },
                { dr: 'Co-venturer A/c', cr: 'Joint Venture A/c', amt: profit - myShare, note: 'Partner\'s share settled' },
              ].map((e, i) => (
                <div key={i} style={{ marginBottom: 14, padding: '10px 14px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: '0.08em', marginBottom: 6 }}>{e.note.toUpperCase()}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text)' }}>{e.dr} A/c <span style={{ color: COLOR }}>Dr</span></span>
                    <span style={{ color: COLOR }}>₹{e.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20 }}>
                    <span style={{ color: 'var(--text2)' }}>To {e.cr} A/c</span>
                    <span style={{ color: 'var(--text2)' }}>₹{e.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'memo', label: '📋 Memorandum Method' },
  { id: 'separate', label: '📚 Separate Books' },
];

export default function JointVenture() {
  const [tab, setTab] = useState('memo');
  return (
    <PageWrapper>
      <PageHeader title="Joint Venture" subtitle="Explore two methods of recording joint ventures with animated profit-sharing breakdowns" icon="🤝" color={COLOR} tag="CHAPTER 06" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'memo' && <JVMemorandum />}
          {tab === 'separate' && <SeparateBooksMethod />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
