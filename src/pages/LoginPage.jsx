import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo-removebg-preview.png';
import '../styles/auth.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    
    try {
      // For now, signup uses the same login flow
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Registration failed. Please contact the administrator.');
    } finally {
      setLoading(false);
    }
  };

  const resetFields = (tab) => {
    setActiveTab(tab);
    setError('');
    setUsername('');
    setPassword('');
    setEmail('');
    setConfirmPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-scanlines"></div>

      <div className="auth-back">
        <Link to="/">← BACK TO HOME</Link>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <img src={logoImg} alt="Smartbook 365" className="auth-logo" />
          <div className="auth-system-tag">SECURE ACCESS PROTOCOL</div>
          <h1>SMARTBOOK <span>365</span></h1>
          <p className="auth-subtitle">
            {activeTab === 'login' ? 'AUTHENTICATE TO ACCESS MODULES' : 'CREATE YOUR LEARNING PROFILE'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => resetFields('login')}
          >
            SIGN IN
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => resetFields('signup')}
          >
            SIGN UP
          </button>
        </div>

        {/* Error */}
        {error && <div className="auth-error">{error}</div>}

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="auth-field">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'ACCESS MODULES'}
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="auth-field">
              <label>USERNAME</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="auth-field">
              <label>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="auth-field">
              <label>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="auth-field">
              <label>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'CREATING PROFILE...' : 'INITIATE ACCESS'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="auth-footer">
          {activeTab === 'login' 
            ? <>New to Smartbook? <a href="#" onClick={(e) => { e.preventDefault(); resetFields('signup'); }}>Create an account</a></>
            : <>Already have access? <a href="#" onClick={(e) => { e.preventDefault(); resetFields('login'); }}>Sign in</a></>
          }
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
