import { useState } from 'react';
import { PageHeader, Slider, StatBox, TabBar, PageWrapper, ContentArea, InfoBox } from '../components/UI';

const COLOR = '#3b82f6';

function BillLifecycle() {
  const [billAmount, setBillAmount] = useState(50000);
  const [period, setPeriod] = useState(3);
  const [discountRate, setDiscountRate] = useState(12);
  const [step, setStep] = useState(0);
  const [billType, setBillType] = useState('receivable');

  const discountAmt = billAmount * (discountRate / 100) * (period / 12);
  const proceeds = billAmount - discountAmt;
  const dueDate = new Date();
  dueDate.setMonth(dueDate.getMonth() + period);

  const STEPS_REC = [
    { label: 'Bill Drawn', icon: '✍️', desc: `Drawer draws a bill of ₹${billAmount.toLocaleString('en-IN')} on Drawee for ${period} months`, who: 'Drawer → Drawee', color: COLOR },
    { label: 'Bill Accepted', icon: '✅', desc: 'Drawee signs and returns the accepted bill to Drawer. Bill becomes a legal instrument.', who: 'Drawee accepts', color: '#10b981' },
    { label: 'Held / Discounted', icon: '🏦', desc: `If discounted: Bank pays ₹${proceeds.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (after deducting ₹${discountAmt.toLocaleString('en-IN', { maximumFractionDigits: 0 })} discount)`, who: 'Drawer → Bank', color: '#f0b429' },
    { label: 'Due Date', icon: '📅', desc: `Bill matures on ${dueDate.toDateString()}. Drawee must pay ₹${billAmount.toLocaleString('en-IN')}.`, who: 'Payment due', color: '#a78bfa' },
    { label: 'Honoured / Dishonoured', icon: '🎯', desc: 'If honoured: Drawee pays the amount. If dishonoured: Noting charges apply.', who: 'Drawee pays', color: '#14b8a6' },
  ];

  const journalEntries = {
    receivable: [
      { party: 'Drawer (on drawing)', dr: 'Bills Receivable A/c', cr: 'Drawee A/c', amt: billAmount },
      { party: 'Drawer (if discounted)', dr: 'Bank A/c', cr: 'Bills Receivable A/c', amt: proceeds, dr2: 'Discount A/c', cr2: '', amt2: discountAmt },
      { party: 'On maturity (honoured)', dr: 'Cash/Bank A/c', cr: 'Bills Receivable A/c', amt: billAmount },
    ],
    payable: [
      { party: 'Drawee (on acceptance)', dr: 'Drawer A/c', cr: 'Bills Payable A/c', amt: billAmount },
      { party: 'On maturity (payment)', dr: 'Bills Payable A/c', cr: 'Cash/Bank A/c', amt: billAmount },
    ]
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24 }}>
        <div>
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR, marginBottom: 20, fontFamily: 'var(--font-mono)' }}>BILL PARAMETERS</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['receivable', 'payable'].map(t => (
                <button key={t} onClick={() => setBillType(t)} style={{
                  flex: 1, padding: '8px', borderRadius: 8,
                  background: billType === t ? COLOR : 'var(--surface2)',
                  color: billType === t ? '#fff' : 'var(--text2)',
                  fontWeight: billType === t ? 700 : 400, fontSize: 12,
                }}>{t === 'receivable' ? 'Bills Receivable' : 'Bills Payable'}</button>
              ))}
            </div>
            <Slider label="Bill Amount (₹)" min={5000} max={500000} step={5000} value={billAmount} onChange={setBillAmount} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
            <Slider label="Period (months)" min={1} max={12} step={1} value={period} onChange={setPeriod} color={COLOR} format={v => v + ' months'} />
            <Slider label="Discount Rate (%)" min={6} max={24} step={1} value={discountRate} onChange={setDiscountRate} color={COLOR} format={v => v + '%'} />
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <StatBox label="BILL AMOUNT" value={billAmount} color={COLOR} icon="📜" />
            <StatBox label="DISCOUNT AMT" value={discountAmt} color="var(--rose)" icon="💸" />
            <StatBox label="PROCEEDS" value={proceeds} color="var(--emerald)" icon="💰" />
          </div>
        </div>

        <div>
          {/* Journey visualization */}
          <div className="card" style={{ border: `1px solid ${COLOR}30`, marginBottom: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 20, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Bill Lifecycle — Click steps to explore</div>
            <div style={{ display: 'flex', gap: 0, alignItems: 'center', marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
              {STEPS_REC.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                  <div
                    onClick={() => setStep(i)}
                    style={{
                      width: 80, textAlign: 'center', cursor: 'pointer',
                    }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%', margin: '0 auto 8px',
                      background: step >= i ? `${s.color}25` : 'var(--surface2)',
                      border: `2px solid ${step >= i ? s.color : 'var(--border)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22, transition: 'all 0.3s',
                      boxShadow: step === i ? `0 0 16px ${s.color}60` : 'none',
                    }}>{s.icon}</div>
                    <div style={{ fontSize: 10, color: step >= i ? s.color : 'var(--text3)', fontFamily: 'var(--font-mono)', fontWeight: step === i ? 700 : 400, lineHeight: 1.3 }}>{s.label}</div>
                  </div>
                  {i < STEPS_REC.length - 1 && (
                    <div style={{ width: 24, height: 2, background: step > i ? STEPS_REC[i].color : 'var(--border)', transition: 'background 0.3s', flexShrink: 0, margin: '-12px 0 0' }} />
                  )}
                </div>
              ))}
            </div>

            {/* Current step detail */}
            <div style={{
              background: `${STEPS_REC[step].color}10`,
              border: `1px solid ${STEPS_REC[step].color}30`,
              borderRadius: 12, padding: '20px',
              animation: 'bounce-in 0.3s ease',
              key: step,
            }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 28 }}>{STEPS_REC[step].icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: STEPS_REC[step].color, fontFamily: 'var(--font-display)' }}>{STEPS_REC[step].label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{STEPS_REC[step].who}</div>
                </div>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: 14 }}>{STEPS_REC[step].desc}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setStep(Math.max(0, step - 1))} style={{ flex: 1, padding: '10px', background: 'var(--surface2)', color: 'var(--text2)', borderRadius: 8 }}>← Prev</button>
              <button onClick={() => setStep(Math.min(STEPS_REC.length - 1, step + 1))} style={{ flex: 1, padding: '10px', background: COLOR, color: '#fff', borderRadius: 8, fontWeight: 600 }}>Next →</button>
            </div>
          </div>

          {/* Journal entries */}
          <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
            <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>Journal Entries</div>
            {journalEntries[billType].map((entry, i) => (
              <div key={i} style={{ marginBottom: 16, padding: '12px', background: 'var(--bg2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', marginBottom: 8 }}>{entry.party.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text)' }}>{entry.dr} A/c <span style={{ color: COLOR }}>Dr</span></span>
                    <span style={{ color: COLOR }}>₹{entry.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20 }}>
                    <span style={{ color: 'var(--text2)' }}>To {entry.cr} A/c</span>
                    <span style={{ color: 'var(--text2)' }}>₹{entry.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DishonourRenewal() {
  const [billAmount, setBillAmount] = useState(50000);
  const [notingCharges, setNotingCharges] = useState(500);
  const [renewalPeriod, setRenewalPeriod] = useState(3);
  const [interestRate, setInterestRate] = useState(12);
  const [mode, setMode] = useState('dishonour');

  const interest = billAmount * (interestRate / 100) * (renewalPeriod / 12);
  const newBillAmt = billAmount + notingCharges + interest;

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {['dishonour', 'renewal'].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            padding: '10px 24px', borderRadius: 10,
            background: mode === m ? COLOR : 'var(--surface)',
            color: mode === m ? '#fff' : 'var(--text2)',
            fontWeight: mode === m ? 700 : 400, border: `1px solid ${mode === m ? COLOR : 'var(--border)'}`,
          }}>{m === 'dishonour' ? '⚠️ Dishonour' : '🔄 Renewal'}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
          <Slider label="Original Bill Amount" min={5000} max={300000} step={5000} value={billAmount} onChange={setBillAmount} color={COLOR} format={v => '₹' + v.toLocaleString('en-IN')} />
          <Slider label="Noting Charges" min={0} max={2000} step={100} value={notingCharges} onChange={setNotingCharges} color={COLOR} format={v => '₹' + v} />
          {mode === 'renewal' && <>
            <Slider label="Renewal Period (months)" min={1} max={6} step={1} value={renewalPeriod} onChange={setRenewalPeriod} color={COLOR} format={v => v + ' months'} />
            <Slider label="Interest Rate (%)" min={6} max={24} step={1} value={interestRate} onChange={setInterestRate} color={COLOR} format={v => v + '%'} />
          </>}
        </div>

        <div>
          {mode === 'dishonour' ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <StatBox label="BILL AMOUNT" value={billAmount} color={COLOR} icon="📜" />
                <StatBox label="NOTING CHARGES" value={notingCharges} color="var(--rose)" icon="⚠️" />
              </div>
              <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
                <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Dishonour Journal Entries</div>
                {[
                  { who: 'In Drawer\'s Books', dr: 'Drawee A/c', cr: 'Bills Receivable A/c', amt: billAmount + notingCharges, note: 'Debit noting charges to Drawee' },
                  { who: 'In Drawee\'s Books', dr: 'Bills Payable A/c', cr: 'Drawee\'s Creditor A/c', amt: billAmount + notingCharges, note: 'Debit noting charges' },
                ].map((e, i) => (
                  <div key={i} style={{ marginBottom: 16, padding: '12px', background: 'var(--bg2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', marginBottom: 8 }}>{e.who.toUpperCase()}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{e.dr} A/c <span style={{ color: 'var(--rose)' }}>Dr</span></span>
                        <span style={{ color: 'var(--rose)' }}>₹{e.amt.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20 }}>
                        <span style={{ color: 'var(--text2)' }}>To {e.cr}</span>
                        <span style={{ color: 'var(--text2)' }}>₹{e.amt.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6, fontStyle: 'italic' }}>{e.note}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
                <StatBox label="ORIGINAL BILL" value={billAmount} color={COLOR} icon="📜" />
                <StatBox label="INTEREST" value={interest} color="var(--orange)" icon="📊" />
                <StatBox label="NEW BILL AMOUNT" value={newBillAmt} color="var(--emerald)" icon="📋" />
              </div>
              <div className="card" style={{ border: `1px solid ${COLOR}30` }}>
                <div style={{ fontWeight: 700, marginBottom: 16, fontFamily: 'var(--font-display)' }}>Renewal Journal Entries (Drawer's Books)</div>
                {[
                  { step: '1. Cancel old bill', dr: 'Drawee A/c', cr: 'Bills Receivable A/c', amt: billAmount, note: 'Cancel original bill' },
                  { step: '2. Record interest', dr: 'Drawee A/c', cr: 'Interest A/c', amt: interest, note: `₹${billAmount.toLocaleString('en-IN')} × ${interestRate}% × ${renewalPeriod}/12` },
                  { step: '3. New bill drawn', dr: 'Bills Receivable A/c', cr: 'Drawee A/c', amt: newBillAmt, note: `New bill = ₹${billAmount.toLocaleString('en-IN')} + ₹${notingCharges} + ₹${interest.toFixed(0)}` },
                ].map((e, i) => (
                  <div key={i} style={{ marginBottom: 14, padding: '12px', background: 'var(--bg2)', borderRadius: 10 }}>
                    <div style={{ fontSize: 11, color: COLOR, fontFamily: 'var(--font-mono)', marginBottom: 8, fontWeight: 700 }}>{e.step.toUpperCase()}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{e.dr} A/c Dr</span><span style={{ color: COLOR }}>₹{e.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20 }}>
                        <span style={{ color: 'var(--text2)' }}>To {e.cr}</span><span style={{ color: 'var(--text2)' }}>₹{e.amt.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, fontStyle: 'italic' }}>{e.note}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TABS = [
  { id: 'lifecycle', label: '📜 Bill Lifecycle' },
  { id: 'dishonour', label: '⚠️ Dishonour & Renewal' },
];

export default function BillsOfExchange() {
  const [tab, setTab] = useState('lifecycle');
  return (
    <PageWrapper>
      <PageHeader title="Bills of Exchange" subtitle="Trace the complete life of a bill — from drawing to maturity, dishonour, and renewal with animated flows" icon="📜" color={COLOR} tag="CHAPTER 04" />
      <ContentArea>
        <TabBar tabs={TABS} active={tab} onChange={setTab} color={COLOR} />
        <div style={{ marginTop: 32 }}>
          {tab === 'lifecycle' && <BillLifecycle />}
          {tab === 'dishonour' && <DishonourRenewal />}
        </div>
      </ContentArea>
    </PageWrapper>
  );
}
