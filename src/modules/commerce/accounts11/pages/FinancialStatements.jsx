import { useState, useEffect } from 'react';
import { PageHeader, Slider, StatBox, TabBar, LedgerTable, PageWrapper, ContentArea, SectionTitle, InfoBox } from '../components/UI';

const COLOR = '#f0b429';

function TradingAccount() {
  const [openingStock, setOpeningStock] = useState(50000);
  const [purchases, setPurchases] = useState(200000);
  const [purchaseReturns, setPurchaseReturns] = useState(10000);
  const [directExpenses, setDirectExpenses] = useState(20000);
  const [sales, setSales] = useState(350000);
  const [salesReturns, setSalesReturns] = useState(5000);
  const [closingStock, setClosingStock] = useState(60000);

  const netPurchases = purchases - purchaseReturns;
  const netSales = sales - salesReturns;
  const cogs = openingStock + netPurchases + directExpenses - closingStock;
  const grossProfit = netSales - cogs;

  const debitTotal = openingStock + netPurchases + directExpenses + (grossProfit > 0 ? grossProfit : 0);
  const creditTotal = netSales + closingStock + (grossProfit < 0 ? -grossProfit : 0);
  const total = Math.max(debitTotal, creditTotal);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Controls */}
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>PARAMETERS</div>
          <Slider label="Opening Stock" min={0} max={200000} step={5000} value={openingStock} onChange={setOpeningStock} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Purchases" min={50000} max={500000} step={10000} value={purchases} onChange={setPurchases} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Purchase Returns" min={0} max={50000} step={1000} value={purchaseReturns} onChange={setPurchaseReturns} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Direct Expenses" min={0} max={100000} step={2000} value={directExpenses} onChange={setDirectExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sales" min={100000} max={800000} step={10000} value={sales} onChange={setSales} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Sales Returns" min={0} max={50000} step={1000} value={salesReturns} onChange={setSalesReturns} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Closing Stock" min={0} max={200000} step={5000} value={closingStock} onChange={setClosingStock} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        {/* Account */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
            <StatBox label="GROSS PROFIT" value={grossProfit >= 0 ? grossProfit : 0} color={grossProfit >= 0 ? '#10b981' : '#f43f5e'} icon="📈" />
            <StatBox label="GROSS LOSS" value={grossProfit < 0 ? -grossProfit : 0} color="#f43f5e" icon="📉" />
            <StatBox label="NET SALES" value={netSales} color={COLOR} icon="💰" />
            <StatBox label="COST OF GOODS" value={cogs} color="var(--text2)" icon="🏭" />
          </div>

          {/* T-Account style */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {/* Debit side */}
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>DR — TRADING ACCOUNT</span>
              </div>
              {[
                ['To Opening Stock', openingStock],
                ['To Purchases', purchases],
                ['Less: Returns', -purchaseReturns],
                ['To Direct Expenses', directExpenses],
                ...(grossProfit >= 0 ? [['To Gross Profit c/d', grossProfit]] : []),
              ].filter(r => r[1] !== 0).map(([label, val], i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', animation: `slide-up 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ fontSize: 13, color: label.startsWith('Less') ? 'var(--rose)' : 'var(--text2)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>₹{Math.abs(val).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Credit side */}
            <div>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>CR</span>
              </div>
              {[
                ['By Sales', sales],
                ['Less: Returns', -salesReturns],
                ['By Closing Stock', closingStock],
                ...(grossProfit < 0 ? [['By Gross Loss c/d', -grossProfit]] : []),
              ].filter(r => r[1] !== 0).map(([label, val], i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', animation: `slide-up 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ fontSize: 13, color: label.startsWith('Less') ? 'var(--rose)' : 'var(--text2)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>₹{Math.abs(val).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <InfoBox color={COLOR} icon="💡">
            <strong>Gross Profit</strong> = Net Sales − (Opening Stock + Net Purchases + Direct Expenses − Closing Stock). Currently: ₹{netSales.toLocaleString('en-IN')} − ₹{cogs.toLocaleString('en-IN')} = <strong style={{ color: grossProfit >= 0 ? '#10b981' : '#f43f5e' }}>₹{Math.abs(grossProfit).toLocaleString('en-IN')} {grossProfit >= 0 ? 'Profit' : 'Loss'}</strong>
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

function PLAccount() {
  const [grossProfit, setGrossProfit] = useState(80000);
  const [otherIncome, setOtherIncome] = useState(15000);
  const [salaries, setSalaries] = useState(30000);
  const [rent, setRent] = useState(12000);
  const [depreciation, setDepreciation] = useState(8000);
  const [interestPaid, setInterestPaid] = useState(5000);
  const [miscExpenses, setMiscExpenses] = useState(3000);

  const totalIncome = grossProfit + otherIncome;
  const totalExpenses = salaries + rent + depreciation + interestPaid + miscExpenses;
  const netProfit = totalIncome - totalExpenses;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Gross Profit b/d" min={0} max={300000} step={5000} value={grossProfit} onChange={setGrossProfit} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Other Income" min={0} max={50000} step={1000} value={otherIncome} onChange={setOtherIncome} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Salaries" min={0} max={100000} step={2000} value={salaries} onChange={setSalaries} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Rent" min={0} max={50000} step={1000} value={rent} onChange={setRent} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Depreciation" min={0} max={30000} step={500} value={depreciation} onChange={setDepreciation} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Interest Paid" min={0} max={20000} step={500} value={interestPaid} onChange={setInterestPaid} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Misc Expenses" min={0} max={10000} step={500} value={miscExpenses} onChange={setMiscExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="TOTAL INCOME" value={totalIncome} color={COLOR} icon="📈" />
            <StatBox label="TOTAL EXPENSES" value={totalExpenses} color="var(--rose)" icon="💸" />
            <StatBox label={netProfit >= 0 ? 'NET PROFIT' : 'NET LOSS'} value={Math.abs(netProfit)} color={netProfit >= 0 ? 'var(--emerald)' : 'var(--rose)'} icon={netProfit >= 0 ? '✅' : '❌'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>DR — P&L ACCOUNT</span>
              </div>
              {[['To Salaries', salaries], ['To Rent', rent], ['To Depreciation', depreciation], ['To Interest Paid', interestPaid], ['To Misc Expenses', miscExpenses], ...(netProfit >= 0 ? [['To Net Profit c/d', netProfit]] : [])].map(([l, v], i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>CR</span>
              </div>
              {[['By Gross Profit b/d', grossProfit], ['By Other Income', otherIncome], ...(netProfit < 0 ? [['By Net Loss c/d', -netProfit]] : [])].map(([l, v], i) => (
                <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{totalIncome.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceSheetSim() {
  const [cash, setCash] = useState(50000);
  const [debtors, setDebtors] = useState(80000);
  const [stock, setStock] = useState(60000);
  const [fixedAssets, setFixedAssets] = useState(200000);
  const [capital, setCapital] = useState(250000);
  const [netProfit, setNetProfit] = useState(40000);
  const [loans, setLoans] = useState(80000);
  const [creditors, setCreditors] = useState(60000);

  const totalAssets = cash + debtors + stock + fixedAssets;
  const totalLiabilities = capital + netProfit + loans + creditors;
  const balanced = Math.abs(totalAssets - totalLiabilities) < 1;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 16, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 12, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>ASSETS</div>
          <Slider label="Cash & Bank" min={0} max={200000} step={5000} value={cash} onChange={setCash} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Debtors" min={0} max={300000} step={5000} value={debtors} onChange={setDebtors} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Closing Stock" min={0} max={200000} step={5000} value={stock} onChange={setStock} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Fixed Assets" min={0} max={500000} step={10000} value={fixedAssets} onChange={setFixedAssets} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <div style={{ fontSize: 12, color: 'var(--text3)', margin: '12px 0', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>LIABILITIES</div>
          <Slider label="Capital" min={0} max={500000} step={10000} value={capital} onChange={setCapital} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Net Profit" min={0} max={200000} step={5000} value={netProfit} onChange={setNetProfit} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Loans" min={0} max={300000} step={10000} value={loans} onChange={setLoans} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Creditors" min={0} max={200000} step={5000} value={creditors} onChange={setCreditors} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
        </div>

        <div>
          {/* Balance indicator */}
          <div style={{
            padding: '16px 24px', borderRadius: 14, marginBottom: 24,
            background: balanced ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
            border: `1px solid ${balanced ? '#10b981' : '#f43f5e'}50`,
            display: 'flex', alignItems: 'center', gap: 16,
          }}>
            <span style={{ fontSize: 32 }}>{balanced ? '⚖️' : '⚠️'}</span>
            <div>
              <div style={{ fontWeight: 700, color: balanced ? '#10b981' : '#f43f5e', marginBottom: 4 }}>
                {balanced ? 'BALANCE SHEET IS BALANCED ✓' : 'BALANCE SHEET NOT BALANCED'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                Assets: ₹{totalAssets.toLocaleString('en-IN')} | Liabilities: ₹{totalLiabilities.toLocaleString('en-IN')} | Diff: ₹{Math.abs(totalAssets - totalLiabilities).toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            {/* Liabilities */}
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>LIABILITIES & CAPITAL</span>
              </div>
              {[['Capital', capital], ['Add: Net Profit', netProfit], ['Loans (Long-term)', loans], ['Creditors', creditors]].map(([l, v], i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>₹{totalLiabilities.toLocaleString('en-IN')}</span>
              </div>
            </div>
            {/* Assets */}
            <div>
              <div style={{ background: `${COLOR}20`, padding: '12px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR, fontWeight: 700 }}>ASSETS</span>
              </div>
              {[['Fixed Assets', fixedAssets], ['Stock (Closing)', stock], ['Debtors', debtors], ['Cash & Bank', cash]].map(([l, v], i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text)' }}>₹{v.toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: balanced ? '#10b981' : '#f43f5e' }}>₹{totalAssets.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'trading', label: '📊 Trading Account' },
  { id: 'pl', label: '💰 P&L Account' },
  { id: 'bs', label: '⚖️ Balance Sheet' },
];

export default function FinancialStatements() {
  const [tab, setTab] = useState('trading');
  return (
    <PageWrapper>
      <PageHeader
        title="Financial Statements"
        subtitle="Interactively build Trading Accounts, Profit & Loss statements, and Balance Sheets with live parameter controls"
        icon="📊"
        color={COLOR}
        tag="CHAPTER 01"
      />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'trading' && <TradingAccount />}
          {tab === 'pl' && <PLAccount />}
          {tab === 'bs' && <BalanceSheetSim />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
