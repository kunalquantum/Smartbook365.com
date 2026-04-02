import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AccessDenied = ({ subject, chapterTitle }) => {
  const { user } = useAuth();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      padding: '40px',
      textAlign: 'center',
      color: 'var(--text1)'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '24px',
        opacity: 0.5
      }}>
        🔒
      </div>
      <h2 style={{ fontSize: '28px', marginBottom: '16px', fontWeight: '700' }}>
        Access Restricted
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: 'var(--text3)', 
        maxWidth: '450px', 
        lineHeight: '1.6',
        marginBottom: '32px'
      }}>
        You are currently on the <b>{user?.role === 'admin' ? 'Unlimited' : 'Standard'}</b> plan. 
        Access to <b>"{chapterTitle}"</b> in {subject} is not included in your current allocation.
      </p>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/subscription" style={{
          padding: '12px 24px',
          background: 'var(--amber)',
          color: '#000',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: '700',
          cursor: 'pointer'
        }}>
          Buy this Module
        </Link>
        <button style={{
          padding: '12px 24px',
          background: 'transparent',
          color: 'var(--text2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default AccessDenied;
