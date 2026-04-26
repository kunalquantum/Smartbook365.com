import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#f97316';

function ConsignmentSim() {
  const [goodsSent, setGoodsSent] = useState(100000);
  const [expenses, setExpenses] = useState(8000);
  const [agentExpenses, setAgentExpenses] = useState(5000);
  const [commission, setCommission] = useState(5);
  const [totalUnits, setTotalUnits] = useState(100);
  const [unitsSold, setUnitsSold] = useState(80);
  const [salePrice, setSalePrice] = useState(1500);

  const totalSales = unitsSold * salePrice;
  const commissionAmt = totalSales * (commission / 100);
  const totalCost = goodsSent + expenses + agentExpenses;
  const costPerUnit = totalCost / totalUnits;
  const unitsInStock = totalUnits - unitsSold;
  const stockValue = unitsInStock * costPerUnit;
  const profit = totalSales - commissionAmt - (totalCost - stockValue);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30`, position: 'sticky', top: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Goods Sent (Cost ₹)" min={10000} max={500000} step={10000} value={goodsSent} onChange={setGoodsSent} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Consignor Expenses (₹)" min={0} max={30000} step={500} value={expenses} onChange={setExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Agent Expenses (₹)" min={0} max={20000} step={500} value={agentExpenses} onChange={setAgentExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Commission (%)" min={2} max={20} step={0.5} value={commission} onChange={setCommission} color={COLOR} format={v => v + '%'} />
          <Slider label="Total Units Sent" min={10} max={500} step={10} value={totalUnits} onChange={setTotalUnits} color={COLOR} format={v => v + ' units'} />
          <Slider label="Units Sold" min={0} max={totalUnits} step={5} value={Math.min(unitsSold, totalUnits)} onChange={v => setUnitsSold(Math.min(v, totalUnits))} color={COLOR} format={v => v + ' units'} />
          <Slider label="Sale Price per Unit (₹)" min={100} max={5000} step={50} value={salePrice} onChange={setSalePrice} color={COLOR} format={v => '₹' + v} />
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
            <StatBox label="TOTAL SALES" value={totalSales} color="var(--emerald)" icon="💰" />
            <StatBox label="COMMISSION" value={commissionAmt} color="var(--rose)" icon="💸" />
            <StatBox label="PROFIT / LOSS" value={Math.abs(profit)} color={profit >= 0 ? 'var(--emerald)' : 'var(--rose)'} icon={profit >= 0 ? '📈' : '📉'} sub={profit >= 0 ? 'PROFIT' : 'LOSS'} />
            <StatBox label="COST PER UNIT" value={costPerUnit} color={COLOR} icon="📦" sub="(including expenses)" />
            <StatBox label="UNSOLD UNITS" value={unitsInStock} prefix="" color="var(--blue)" icon="🏭" sub="units in stock" />
            <StatBox label="CLOSING STOCK VALUE" value={stockValue} color="var(--gold)" icon="📊" />
          </div>

          {/* Units sold visualization */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 600, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Units Flow Visualization</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
              {Array.from({ length: Math.min(totalUnits, 50) }, (_, i) => {
                const scaledIdx = Math.floor(i * (totalUnits / Math.min(totalUnits, 50)));
                const isSold = scaledIdx < unitsSold;
                return (
                  <div key={i} style={{
                    width: 16, height: 16, borderRadius: 3,
                    background: isSold ? 'var(--emerald)' : COLOR,
                    opacity: isSold ? 0.9 : 0.4,
                    transition: 'all 0.2s',
                  }} />
                );
              })}
              {totalUnits > 50 && <span style={{ fontSize: 12, color: 'var(--text3)', alignSelf: 'center' }}>...{totalUnits - 50} more</span>}
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ fontSize: 12, color: 'var(--emerald)' }}>■ Sold ({unitsSold})</span>
              <span style={{ fontSize: 12, color: COLOR }}>■ In Stock ({unitsInStock})</span>
            </div>
          </div>

          {/* Consignment Account */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <div style={{ borderRight: '2px solid var(--border2)' }}>
              <div style={{ background: `${COLOR}20`, padding: '10px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>DR — CONSIGNMENT A/C</span>
              </div>
              {[
                ['To Goods Sent on Consignment', goodsSent],
                ['To Consignor Expenses', expenses],
                ['To Agent Expenses', agentExpenses],
                ['To Commission', commissionAmt],
                ...(profit >= 0 ? [['To Profit on Consignment', profit]] : []),
              ].map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{(goodsSent + expenses + agentExpenses + commissionAmt + Math.max(0, profit)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
            <div>
              <div style={{ background: `${COLOR}20`, padding: '10px 16px', borderBottom: '1px solid var(--border)', textAlign: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: COLOR, fontWeight: 700 }}>CR</span>
              </div>
              {[
                ['By Sales (through Agent)', totalSales],
                ['By Closing Stock', stockValue],
                ...(profit < 0 ? [['By Loss on Consignment', -profit]] : []),
              ].map(([l, v], i) => (
                <div key={i} style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{l}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>₹{v.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              ))}
              <div style={{ padding: '10px 14px', background: `${COLOR}10`, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: COLOR }}>₹{(totalSales + stockValue + Math.max(0, -profit)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AbnormalLoss() {
  const [goodsSent, setGoodsSent] = useState(200000);
  const [expenses, setExpenses] = useState(10000);
  const [totalUnits, setTotalUnits] = useState(200);
  const [lostUnits, setLostUnits] = useState(20);
  const [insured, setInsured] = useState(true);
  const [claimAmt, setClaimAmt] = useState(8000);

  const totalCost = goodsSent + expenses;
  const costPerUnit = totalCost / totalUnits;
  const abnormalLossValue = lostUnits * costPerUnit;
  const netLoss = abnormalLossValue - (insured ? claimAmt : 0);

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>PARAMETERS</div>
          <Slider label="Cost of Goods Sent (₹)" min={10000} max={500000} step={10000} value={goodsSent} onChange={setGoodsSent} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Expenses (₹)" min={0} max={30000} step={500} value={expenses} onChange={setExpenses} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Total Units" min={10} max={500} step={10} value={totalUnits} onChange={setTotalUnits} color={COLOR} format={v => v + ' units'} />
          <Slider label="Units Lost (Abnormal)" min={0} max={Math.floor(totalUnits * 0.4)} step={1} value={Math.min(lostUnits, Math.floor(totalUnits * 0.4))} onChange={setLostUnits} color={COLOR} format={v => v + ' units'} />
          <div style={{ margin: '16px 0 8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={insured} onChange={e => setInsured(e.target.checked)} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>Goods are insured</span>
            </label>
          </div>
          {insured && <Slider label="Insurance Claim (₹)" min={0} max={Math.round(abnormalLossValue)} step={100} value={Math.min(claimAmt, Math.round(abnormalLossValue))} onChange={setClaimAmt} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />}
        </div>

        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 20 }}>
            <StatBox label="COST PER UNIT" value={costPerUnit} color={COLOR} icon="📦" />
            <StatBox label="ABNORMAL LOSS VALUE" value={abnormalLossValue} color="var(--rose)" icon="🔥" />
            {insured && <StatBox label="INSURANCE CLAIM" value={claimAmt} color="var(--emerald)" icon="🛡️" />}
            <StatBox label="NET LOSS" value={netLoss} color="var(--rose)" icon="💸" />
          </div>

          {/* Loss visualization */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 12, fontFamily: 'var(--font-display)' }}>Unit Breakdown</div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {Array.from({ length: Math.min(totalUnits, 60) }, (_, i) => {
                const scale = totalUnits / Math.min(totalUnits, 60);
                const isLost = Math.floor(i * scale) < lostUnits;
                return (
                  <div key={i} style={{
                    width: 14, height: 14, borderRadius: 3,
                    background: isLost ? 'var(--rose)' : 'var(--emerald)',
                    opacity: isLost ? 1 : 0.5,
                    boxShadow: isLost ? '0 0 6px var(--rose)' : 'none',
                    transition: 'all 0.2s',
                  }} />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <span style={{ fontSize: 12, color: 'var(--rose)' }}>■ Lost ({lostUnits})</span>
              <span style={{ fontSize: 12, color: 'var(--emerald)', opacity: 0.7 }}>■ Remaining ({totalUnits - lostUnits})</span>
            </div>
          </div>

          <InfoBox color={COLOR} icon="📋">
            <strong>Abnormal Loss Journal:</strong><br />
            Abnormal Loss A/c Dr ₹{abnormalLossValue.toFixed(0)}<br />
            &nbsp;&nbsp;To Consignment A/c Cr ₹{abnormalLossValue.toFixed(0)}<br />
            {insured && <>Insurance Company A/c Dr ₹{claimAmt.toLocaleString('en-IN')}<br />P&L A/c Dr ₹{netLoss.toFixed(0)} (loss not covered)<br />To Abnormal Loss A/c Cr ₹{abnormalLossValue.toFixed(0)}</>}
          </InfoBox>
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'main', label: '📦 Consignment Account' },
  { id: 'loss', label: '🔥 Abnormal Loss' },
];

export default function Consignment() {
  const [tab, setTab] = useState('main');
  return (
    <PageWrapper>
      <PageHeader title="Consignment" subtitle="Simulate goods sent on consignment, stock valuation, and abnormal loss scenarios" icon="📦" color={COLOR} tag="CHAPTER 05" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'main' && <ConsignmentSim />}
          {tab === 'loss' && <AbnormalLoss />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
