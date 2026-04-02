import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { CHAPTERS as PHYSICS_CHAPTERS } from '../modules/physics/data/physics';
import { CHAPTERS as CHEMISTRY_CHAPTERS } from '../modules/chemistry/data/chapters';
import { chapters as MATHS_CHAPTERS } from '../modules/maths/data/chapters';
import { PRICING, ADMIN_PHONE } from '../data/pricing';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [selectedSubjects, setSelectedSubjects] = useState({}); // { physics: boolean, ... }
  const [selectedChapters, setSelectedChapters] = useState({}); // { physics: [id, id], ... }

  const subjects = [
    { id: 'physics', name: 'Physics', color: 'var(--amber)', icon: '⚛️', data: PHYSICS_CHAPTERS },
    { id: 'chemistry', name: 'Chemistry', color: '#1D9E75', icon: '🧪', data: CHEMISTRY_CHAPTERS },
    { id: 'maths', name: 'Mathematics', color: '#4F46E5', icon: '📐', data: MATHS_CHAPTERS }
  ];

  const handleSubjectToggle = (subId) => {
    setSelectedSubjects(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
    if (!selectedSubjects[subId]) {
      setSelectedChapters(prev => ({ ...prev, [subId]: [] }));
    }
  };

  const handleChapterToggle = (subId, chId) => {
    if (selectedSubjects[subId]) {
      setSelectedSubjects(prev => ({ ...prev, [subId]: false }));
    }

    const current = selectedChapters[subId] || [];
    if (current.includes(chId)) {
      setSelectedChapters(prev => ({
        ...prev,
        [subId]: current.filter(id => id !== chId)
      }));
    } else {
      setSelectedChapters(prev => ({
        ...prev,
        [subId]: [...current, chId]
      }));
    }
  };

  const calculateTotal = () => {
    let total = 0;
    subjects.forEach(sub => {
      if (selectedSubjects[sub.id]) {
        total += PRICING[sub.id].fullPrice;
      } else {
        const chaptersCount = (selectedChapters[sub.id] || []).length;
        total += chaptersCount * PRICING[sub.id].chapterPrice;
      }
    });
    return total;
  };

  const handleWhatsAppRequest = () => {
    let message = `Hello Admin, I would like to request access for the following modules in Smartbook365:\n\n`;
    let hasSelection = false;

    subjects.forEach(sub => {
      if (selectedSubjects[sub.id]) {
        message += `*${sub.name}*: FULL MODULE (₹${PRICING[sub.id].fullPrice})\n`;
        hasSelection = true;
      } else if (selectedChapters[sub.id]?.length > 0) {
        const chTitles = sub.data
          .filter(ch => selectedChapters[sub.id].includes(ch.id))
          .map(ch => `Ch ${ch.id}: ${ch.title}`)
          .join(', ');
        const cost = selectedChapters[sub.id].length * PRICING[sub.id].chapterPrice;
        message += `*${sub.name}*: ${selectedChapters[sub.id].length} Chapters (${chTitles}) - ₹${cost}\n`;
        hasSelection = true;
      }
    });

    if (!hasSelection) {
      alert("Please select at least one subject or chapter.");
      return;
    }

    message += `\n*TOTAL QUOTE: ₹${calculateTotal()}*`;
    
    if (user) {
      message += `\n\nUser: ${user.name} (${user.username})`;
    } else {
      message += `\n\n(New User Inquiry - Please provide your name)`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ADMIN_PHONE}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg1)',
      color: 'var(--text1)',
      fontFamily: 'var(--sans)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>Build Your Smartbook</h1>
            <p style={{ color: 'var(--text3)' }}>Select the modules you want to unlock</p>
          </div>
          <Link to="/" style={{ 
            textDecoration: 'none', 
            color: 'var(--text2)', 
            fontSize: '14px', 
            fontWeight: '600',
            padding: '10px 20px',
            border: '1px solid var(--border)',
            borderRadius: '12px'
          }}>
            Back to Home
          </Link>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {subjects.map(sub => (
              <div key={sub.id} style={{
                background: 'var(--bg2)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '24px',
                  background: 'rgba(255,255,255,0.02)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '28px' }}>{sub.icon}</span>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '700' }}>{sub.name}</h3>
                      <p style={{ fontSize: '12px', color: 'var(--text3)' }}>{sub.data.length} Chapters Available</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: sub.color }}>₹{PRICING[sub.id].fullPrice}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text4)' }}>Full Module</div>
                    </div>
                    <button 
                      onClick={() => handleSubjectToggle(sub.id)}
                      style={{
                        padding: '8px 16px',
                        background: selectedSubjects[sub.id] ? sub.color : 'transparent',
                        color: selectedSubjects[sub.id] ? '#000' : sub.color,
                        border: `1px solid ${sub.color}`,
                        borderRadius: '8px',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedSubjects[sub.id] ? '✓ SELECTED' : 'SELECT ALL'}
                    </button>
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text3)', marginBottom: '16px' }}>OR SELECT CHAPTERS (₹{PRICING[sub.id].chapterPrice} each)</h4>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                    gap: '12px' 
                  }}>
                    {sub.data.map(ch => {
                      const isChSelected = selectedChapters[sub.id]?.includes(ch.id);
                      return (
                        <div 
                          key={ch.id} 
                          onClick={() => handleChapterToggle(sub.id, ch.id)}
                          style={{
                            padding: '12px',
                            background: isChSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                            border: `1px solid ${isChSelected ? sub.color : 'var(--border)'}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '4px',
                            border: `2px solid ${isChSelected ? sub.color : 'var(--text4)'}`,
                            background: isChSelected ? sub.color : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            color: '#000'
                          }}>
                            {isChSelected && '✓'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text4)' }}>CH {ch.id}</div>
                            <div style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ch.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ 
            position: 'sticky', 
            top: '40px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {subjects.map(sub => {
                const isFull = selectedSubjects[sub.id];
                const chCount = selectedChapters[sub.id]?.length || 0;
                if (!isFull && chCount === 0) return null;

                return (
                  <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text3)' }}>
                      {sub.name} {isFull ? '(All)' : `(${chCount} Ch)`}
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      ₹{isFull ? PRICING[sub.id].fullPrice : chCount * PRICING[sub.id].chapterPrice}
                    </span>
                  </div>
                );
              })}
              {calculateTotal() === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text4)', fontSize: '14px' }}>
                  No items selected yet.
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Estimated Total</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--amber)' }}>₹{calculateTotal()}</span>
              </div>
            </div>

            <button 
              onClick={handleWhatsAppRequest}
              style={{
                width: '100%',
                padding: '16px',
                background: '#25D366',
                color: '#fff',
                border: 'none',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                transition: 'transform 0.2s'
              }}
            >
              <span>💬</span> Send Request via WhatsApp
            </button>
            <p style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text4)', textAlign: 'center' }}>
              Clicking will open WhatsApp to send your request to our administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
