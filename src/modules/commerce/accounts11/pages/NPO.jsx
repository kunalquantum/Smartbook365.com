import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#a78bfa';

function ReceiptsPayments() {
  const [openingCash, setOpeningCash] = useState(15000);
  const [subscriptions, setSubscriptions] = useState(80000);
  const [donations, setDonations] = useState(25000);
  const [grantReceived, setGrantReceived] = useState(30000);
  const [entranceFees, setEntranceFees] = useState(10000);
  const [salaries, setSalaries] = useState(40000);
  const [rent, setRent] = useState(18000);
  const [sports, setSports] = useState(12000);
  const [misc, setMisc] = useState(5000);

  const totalReceipts = openingCash + subscriptions + donations + grantReceived + entranceFees;
  const totalPayments = salaries + rent + sports + misc;
  const closingCash = totalReceipts - totalPayments;

  const receiptsItems = [
    { label: 'Opening Balance (Cash)', value: openingCash },
    { label: 'Subscriptions Received', value: subscriptions },
    { label: 'Donations', value: donations },
    { label: 'Government Grant', value: grantReceived },
    { label: 'Entrance Fees', value: entranceFees },
  ];

  const paymentsItems = [
    { label: 'Salaries', value: salaries },
    { label: 'Rent', value: rent },
    { label: 'Sports Expenses', value: sports },
    { label: 'Miscellaneous', value: misc },
    { label: 'Closing Balance (Cash)', value: closingCash },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20, maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 8 }}>RECEIPTS</div>
          <Slider label="Opening Cash Balance" min={0} max={50000} step={1000} value={openingCash} onChange={setOpeningCash} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Subscriptions" min={0} max={200000} step={5000} value={subscriptions} onChange={setSubscriptions} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Donations" min={0} max={100000} step={5000} value={donations} onChange={setDonations} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Grants Received" min={0} max={100000} step={5000} value={grantReceived} onChange={setGrantReceived} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Entrance Fees" min={0} max={30000} step={1000} value={entranceFees} onChange={setEntranceFees} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', margin: '16px 0 8px' }}>PAYMENTS</div>
          <Slider label="Salaries" min={0} max={100000} step={2000} value={salaries} onChange={setSalaries} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Rent" min={0} max={40000} step={1000} value={rent} onChange={setRent} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sports Expenses" min={0} max={40000} step={1000} value={sports} onChange={setSports} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Miscellaneous" min={0} max={20000} step={500} value={misc} onChange={setMisc} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="TOTAL RECEIPTS" value={totalReceipts} color={COLOR} icon="📥" />
            <StatBox label="TOTAL PAYMENTS" value={totalPayments} color="var(--rose)" icon="📤" />
            <StatBox label="CLOSING BALANCE" value={closingCash} color={closingCash >= 0 ? 'var(--emerald)' : 'var(--rose)'} icon="💰" />
          </div>

          {/* R&P Account T-format */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>RECEIPTS</span>
              </div>
              {receiptsItems.map((item, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', animation: `slide-up 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{totalReceipts.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>PAYMENTS</span>
              </div>
              {paymentsItems.map((item, i) => (
                <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{item.label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: i === paymentsItems.length - 1 ? 'var(--emerald)' : 'var(--text)' }}>₹{item.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{totalReceipts.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox color={COLOR} icon="ℹ️">
              <strong>Receipts & Payments A/c</strong> is a cash book — it records <em>actual cash received and paid</em> during the year. It includes capital receipts, revenue receipts, and all cash transactions regardless of period. Unlike I&E A/c, it does NOT distinguish between capital and revenue items.
            </InfoBox>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncomeExpenditure() {
  const [subscriptions, setSubscriptions] = useState(80000);
  const [outstanding, setOutstanding] = useState(8000);
  const [advanceSubs, setAdvanceSubs] = useState(5000);
  const [donations, setDonations] = useState(15000);
  const [salaries, setSalaries] = useState(40000);
  const [salariesOutstanding, setSalariesOutstanding] = useState(4000);
  const [rent, setRent] = useState(18000);
  const [depreciation, setDepreciation] = useState(6000);
  const [sports, setSports] = useState(12000);

  const adjustedSubs = subscriptions + outstanding - advanceSubs;
  const totalIncome = adjustedSubs + donations;
  const adjustedSalaries = salaries + salariesOutstanding;
  const totalExpenditure = adjustedSalaries + rent + depreciation + sports;
  const surplus = totalIncome - totalExpenditure;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20, maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 8 }}>INCOME</div>
          <Slider label="Subscriptions (Received)" min={0} max={200000} step={5000} value={subscriptions} onChange={setSubscriptions} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Add: Outstanding Subs" min={0} max={20000} step={500} value={outstanding} onChange={setOutstanding} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Less: Advance Subs" min={0} max={15000} step={500} value={advanceSubs} onChange={setAdvanceSubs} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Donations (Revenue)" min={0} max={50000} step={2000} value={donations} onChange={setDonations} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', margin: '16px 0 8px' }}>EXPENDITURE</div>
          <Slider label="Salaries (Paid)" min={0} max={100000} step={2000} value={salaries} onChange={setSalaries} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Add: Salaries Outstanding" min={0} max={20000} step={500} value={salariesOutstanding} onChange={setSalariesOutstanding} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Rent" min={0} max={40000} step={1000} value={rent} onChange={setRent} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Depreciation" min={0} max={20000} step={500} value={depreciation} onChange={setDepreciation} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sports Expenses" min={0} max={30000} step={1000} value={sports} onChange={setSports} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="TOTAL INCOME" value={totalIncome} color={COLOR} icon="📊" />
            <StatBox label="TOTAL EXPENDITURE" value={totalExpenditure} color="var(--rose)" icon="💸" />
            <StatBox label={surplus >= 0 ? 'SURPLUS' : 'DEFICIT'} value={Math.abs(surplus)} color={surplus >= 0 ? 'var(--emerald)' : 'var(--rose)'} icon={surplus >= 0 ? '🏛️' : '⚠️'} />
          </div>

          {/* Subscriptions adjustment highlight */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 12, fontFamily: 'var(--font-display)', color: 'var(--text)', fontSize: 15 }}>Subscription Adjustment (Key Concept)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 13 }}>
              {[
                { label: 'Received', value: subscriptions, color: COLOR },
                { label: '+ Outstanding', value: outstanding, color: 'var(--emerald)', sign: '+' },
                { label: '− Advance', value: advanceSubs, color: 'var(--rose)', sign: '−' },
                { label: '= Adjusted', value: adjustedSubs, color: 'var(--gold)' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ color: 'var(--text3)', fontSize: 16 }}>{item.sign || '='}</span>}
                  <div style={{ background: `${item.color}15`, border: `1px solid ${item.color}30`, padding: '8px 14px', borderRadius: 10, textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: item.color, fontWeight: 700 }}>₹{item.value.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* I&E Account */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>EXPENDITURE</span>
              </div>
              {[
                ['To Salaries', salaries],
                ['Add: Outstanding', salariesOutstanding],
                ['To Rent', rent],
                ['To Depreciation', depreciation],
                ['To Sports Expenses', sports],
                ...(surplus >= 0 ? [['To Surplus (transferred)', surplus]] : []),
              ].map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: l.startsWith('Add') ? 'var(--emerald)' : 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ background: `${COLOR}20`, padding: '10px 14px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>INCOME</span>
              </div>
              {[
                ['By Subscriptions (received)', subscriptions],
                ['Add: Outstanding', outstanding],
                ['Less: Advance received', -advanceSubs],
                ['By Donations', donations],
                ...(surplus < 0 ? [['By Deficit', -surplus]] : []),
              ].filter(r => r[1] !== 0).map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: v < 0 ? 'var(--rose)' : 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: v < 0 ? 'var(--rose)' : 'var(--text)' }}>₹{Math.abs(v).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox color={COLOR} icon="🏛️">
              <strong>I&E A/c</strong> is like P&L for NPOs — it records only <em>revenue items on accrual basis</em>. Surplus/Deficit is transferred to the Capital Fund (General Fund). Capital receipts like donations for specific purposes and life membership fees go directly to the Balance Sheet.
            </InfoBox>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'rp', label: '📥 Receipts & Payments' },
  { id: 'ie', label: '⚖️ Income & Expenditure' },
];

export default function NPO() {
  const [tab, setTab] = useState('rp');
  return (
    <PageWrapper>
      <PageHeader title="Not-for-Profit Orgs" subtitle="Master NPO accounting with interactive Receipts & Payments and Income & Expenditure simulations" icon="🏛️" color={COLOR} tag="CHAPTER 07" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'rp' && <ReceiptsPayments />}
          {tab === 'ie' && <IncomeExpenditure />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
