import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#14b8a6';

function ClosingStockSim() {
  const [openingStock, setOpeningStock] = useState(50000);
  const [purchases, setPurchases] = useState(200000);
  const [sales, setSales] = useState(180000);
  const [grossMargin, setGrossMargin] = useState(25);

  // Estimate closing stock based on margin
  const costOfSales = sales * (1 - grossMargin / 100);
  const closingStock = openingStock + purchases - costOfSales;
  const stockTurnover = costOfSales / ((openingStock + Math.max(0, closingStock)) / 2);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Opening Stock" min={0} max={200000} step={5000} value={openingStock} onChange={setOpeningStock} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Purchases" min={0} max={500000} step={10000} value={purchases} onChange={setPurchases} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sales" min={0} max={500000} step={10000} value={sales} onChange={setSales} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Gross Margin %" min={5} max={60} step={1} value={grossMargin} onChange={setGrossMargin} color={COLOR} format={v => v + '%'} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="CLOSING STOCK" value={Math.max(0, closingStock)} color={COLOR} icon="📦" />
            <StatBox label="COST OF SALES" value={costOfSales} color="var(--orange)" icon="🏭" />
            <StatBox label="STOCK TURNOVER" value={stockTurnover.toFixed(2)} prefix="" color="var(--blue)" icon="🔄" sub="times per year" />
          </div>

          {/* Visual stock flow */}
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontWeight: 600, marginBottom: 20, color: COLOR, fontFamily: 'var(--font-display)' }}>Stock Flow Visualization</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24, flexWrap: 'wrap' }}>
              {[
                { label: 'Opening Stock', value: openingStock, color: '#3b82f6' },
                { label: '+ Purchases', value: purchases, color: COLOR },
                { label: '− Cost of Sales', value: -costOfSales, color: '#f43f5e' },
                { label: '= Closing Stock', value: Math.max(0, closingStock), color: '#f0b429' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <div style={{
                    background: `${item.color}20`,
                    border: `1px solid ${item.color}40`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    textAlign: 'center',
                    minWidth: 120,
                  }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 700, color: item.color }}>
                      ₹{Math.abs(item.value).toLocaleString('en-IN')}
                    </div>
                  </div>
                  {i < 3 && <div style={{ fontSize: 20, color: 'var(--text3)', padding: '0 4px' }}>→</div>}
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div style={{ marginTop: 8 }}>
              {[
                { label: 'Opening Stock', value: openingStock, color: '#3b82f6', max: openingStock + purchases },
                { label: 'Purchases Added', value: purchases, color: COLOR, max: openingStock + purchases },
                { label: 'Cost of Sales', value: costOfSales, color: '#f43f5e', max: openingStock + purchases },
                { label: 'Closing Stock', value: Math.max(0, closingStock), color: '#f0b429', max: openingStock + purchases },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: item.color }}>₹{item.value.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 8 }}>
                    <div style={{
                      width: `${(item.value / item.max) * 100}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: 4,
                      transition: 'width 0.4s ease',
                      boxShadow: `0 0 8px ${item.color}60`,
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox color={COLOR} icon="📋">
              <strong>Adjustment Journal Entry:</strong> Closing Stock A/c Dr ₹{Math.max(0, closingStock).toLocaleString('en-IN')} | To Trading A/c Cr ₹{Math.max(0, closingStock).toLocaleString('en-IN')}
              <br />Closing Stock appears on the <strong>Credit side of Trading Account</strong> and as a <strong>Current Asset in Balance Sheet</strong>.
            </InfoBox>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutstandingPrepaid() {
  const [expense, setExpense] = useState(60000);
  const [paidMonths, setPaidMonths] = useState(10);
  const [accruedExtra, setAccruedExtra] = useState(5000);

  const totalMonths = 12;
  const outstanding = (expense / totalMonths) * (totalMonths - paidMonths) + accruedExtra;
  const prepaid = 0; // when paid > due
  const amountPaid = (expense / totalMonths) * paidMonths;

  const [rMode, setRMode] = useState('outstanding');

  const [prepaidAmount, setPrepaidAmount] = useState(24000);
  const [prepaidPeriod, setPrepaidPeriod] = useState(8); // months remaining

  const prepaidAdj = (prepaidAmount / 12) * prepaidPeriod;
  const expenseCharged = prepaidAmount - prepaidAdj;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Outstanding */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 16, color: COLOR, fontFamily: 'var(--font-display)', fontSize: 17 }}>Outstanding Expenses</div>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 16 }}>
          <Slider label="Annual Expense (₹)" min={12000} max={200000} step={6000} value={expense} onChange={setExpense} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Months Paid" min={0} max={12} step={1} value={paidMonths} onChange={setPaidMonths} color={COLOR} format={v => v + ' months'} />
          <Slider label="Additional Accrual (₹)" min={0} max={20000} step={1000} value={accruedExtra} onChange={setAccruedExtra} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatBox label="PAID SO FAR" value={amountPaid} color="var(--emerald)" icon="✅" />
          <StatBox label="OUTSTANDING" value={outstanding} color="var(--rose)" icon="⚠️" />
        </div>
        {/* Month bar */}
        <div className="card" style={{ marginTop: 16, border: `1px solid ${COLOR}20` }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Payment Timeline (12 months)</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} style={{
                width: 'calc((100% - 44px) / 12)',
                height: 32, borderRadius: 4,
                background: i < paidMonths ? 'var(--emerald)' : 'var(--rose)',
                opacity: i < paidMonths ? 0.9 : 0.5,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, color: 'white', fontFamily: 'var(--font-mono)',
                transition: 'all 0.2s',
                boxShadow: i < paidMonths ? '0 0 6px rgba(16,185,129,0.4)' : 'none',
              }}>{i + 1}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--emerald)' }}>■ Paid ({paidMonths})</span>
            <span style={{ fontSize: 12, color: 'var(--rose)' }}>■ Outstanding ({12 - paidMonths})</span>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <InfoBox color={COLOR} icon="📝">
            Journal: Expense A/c Dr ₹{outstanding.toLocaleString('en-IN')} | To Outstanding Expense A/c Cr ₹{outstanding.toLocaleString('en-IN')}<br/>
            Shows in <strong>P&L (expense added)</strong> and <strong>Balance Sheet Liability side</strong>.
          </InfoBox>
        </div>
      </div>

      {/* Prepaid */}
      <div>
        <div style={{ fontWeight: 700, marginBottom: 16, color: COLOR, fontFamily: 'var(--font-display)', fontSize: 17 }}>Prepaid Expenses</div>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 16 }}>
          <Slider label="Total Premium Paid (₹)" min={12000} max={120000} step={6000} value={prepaidAmount} onChange={setPrepaidAmount} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Months Prepaid (future)" min={1} max={11} step={1} value={prepaidPeriod} onChange={setPrepaidPeriod} color={COLOR} format={v => v + ' months'} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatBox label="EXPENSE THIS YEAR" value={expenseCharged} color="var(--orange)" icon="📋" />
          <StatBox label="PREPAID (ASSET)" value={prepaidAdj} color="var(--blue)" icon="🔮" />
        </div>

        {/* Visual circle */}
        <div className="card" style={{ marginTop: 16, border: `1px solid ${COLOR}20`, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>Period Allocation</div>
          <svg width="180" height="180" style={{ margin: '0 auto', display: 'block' }}>
            <circle cx="90" cy="90" r="70" fill="none" stroke="var(--surface2)" strokeWidth="20" />
            <circle cx="90" cy="90" r="70" fill="none" stroke={COLOR} strokeWidth="20"
              strokeDasharray={`${(expenseCharged / prepaidAmount) * 440} 440`}
              strokeDashoffset="110"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
            <circle cx="90" cy="90" r="70" fill="none" stroke="#3b82f6" strokeWidth="20"
              strokeDasharray={`${(prepaidAdj / prepaidAmount) * 440} 440`}
              strokeDashoffset={110 - (expenseCharged / prepaidAmount) * 440}
              style={{ transition: 'all 0.5s ease' }}
            />
            <text x="90" y="85" textAnchor="middle" fill="var(--text)" fontSize="13" fontFamily="var(--font-mono)">{Math.round((expenseCharged / prepaidAmount) * 100)}%</text>
            <text x="90" y="105" textAnchor="middle" fill="var(--text2)" fontSize="10">Expense</text>
          </svg>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <span style={{ fontSize: 12, color: COLOR }}>■ This Year's Expense</span>
            <span style={{ fontSize: 12, color: '#3b82f6' }}>■ Prepaid</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccruedIncome() {
  const [annualIncome, setAnnualIncome] = useState(48000);
  const [monthsReceived, setMonthsReceived] = useState(9);

  const accrued = (annualIncome / 12) * (12 - monthsReceived);
  const received = (annualIncome / 12) * monthsReceived;

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ fontWeight: 700, marginBottom: 20, color: COLOR, fontFamily: 'var(--font-display)', fontSize: 18 }}>Accrued Income Simulation</div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <Slider label="Annual Income (₹)" min={12000} max={200000} step={6000} value={annualIncome} onChange={setAnnualIncome} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Months Already Received" min={0} max={11} step={1} value={monthsReceived} onChange={setMonthsReceived} color={COLOR} format={v => v + ' months'} />
        </div>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <StatBox label="RECEIVED" value={received} color="var(--emerald)" icon="✅" />
            <StatBox label="ACCRUED (DUE)" value={accrued} color="var(--blue)" icon="⏳" />
          </div>
          <InfoBox color={COLOR} icon="📘">
            Journal Entry: Accrued Income A/c Dr ₹{accrued.toLocaleString('en-IN')} | To Income A/c Cr ₹{accrued.toLocaleString('en-IN')}<br/>
            <strong>Accrued Income</strong> is shown on the <strong>Asset side of Balance Sheet</strong> as a Current Asset.
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'stock', label: '📦 Closing Stock' },
  { id: 'outstanding', label: '⏱️ Outstanding & Prepaid' },
  { id: 'accrued', label: '💰 Accrued Income' },
];

export default function Adjustments() {
  const [tab, setTab] = useState('stock');
  return (
    <PageWrapper>
      <PageHeader title="Adjustments" subtitle="Master all year-end adjustments with interactive visual tools — from closing stock to accrued income" icon="⚙️" color={COLOR} tag="CHAPTER 02" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'stock' && <ClosingStockSim />}
          {tab === 'outstanding' && <OutstandingPrepaid />}
          {tab === 'accrued' && <AccruedIncome />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
