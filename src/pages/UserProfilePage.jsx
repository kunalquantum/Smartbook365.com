import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo-removebg-preview.png';

const UserProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="profile-shell" style={{
            minHeight: '100vh',
            background: '#0B0B0B',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            padding: '40px 20px'
        }}>
            {/* Header / Nav */}
            <header style={{
                maxWidth: '1000px',
                margin: '0 auto 60px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
                    <img src={logoImg} alt="Smartbook 365" style={{ width: '40px' }} />
                    <span style={{ 
                        fontFamily: 'Michroma', 
                        color: '#fff', 
                        fontSize: '1rem',
                        letterSpacing: '2px'
                    }}>SMARTBOOK</span>
                </Link>
                <button onClick={() => navigate(-1)} style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '8px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontFamily: 'Michroma'
                }}>← BACK</button>
            </header>

            <main style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '40px' }}>
                    
                    {/* Left Panel: Profile Info */}
                    <aside>
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            padding: '40px 20px',
                            textAlign: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00FFFF, #ff00ff)',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#000',
                                boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)'
                            }}>
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#fff' }}>{user.name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginBottom: '24px' }}>@{user.username}</p>
                            
                            <div style={{ 
                                display: 'inline-block',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                background: user.role === 'admin' ? 'rgba(255,0,255,0.1)' : 'rgba(0,255,255,0.1)',
                                border: `1px solid ${user.role === 'admin' ? '#ff00ff' : '#00FFFF'}`,
                                color: user.role === 'admin' ? '#ff00ff' : '#00FFFF',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {user.username === 'admin' || user.email === 'admin@smartbook.com' ? 'Platform Owner' : user.role}
                            </div>

                            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {user.role === 'admin' && (
                                    <Link to="/admin" style={{
                                        background: '#ff00ff',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        fontFamily: 'Michroma'
                                    }}>ADMIN CONSOLE</Link>
                                )}
                                <button onClick={handleLogout} style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#ff4d4d',
                                    border: '1px solid rgba(255,77,77,0.2)',
                                    padding: '12px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontFamily: 'Michroma'
                                }}>SIGN OUT</button>
                            </div>
                        </div>
                    </aside>

                    {/* Right Panel: Subscriptions & Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* Account Details Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '30px'
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontFamily: 'Michroma', color: '#00FFFF' }}>Core Details</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase' }}>Email Protocol</label>
                                    <div style={{ fontSize: '1rem', color: '#fff' }}>{user.email || 'N/A'}</div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '4px', textTransform: 'uppercase' }}>Account ID</label>
                                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace' }}>{user.id}</div>
                                </div>
                            </div>
                        </div>

                        {/* Subscriptions Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            padding: '30px',
                            flex: 1
                        }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', fontFamily: 'Michroma', color: '#00FFFF' }}>Active Access Modules</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {Object.entries(user.subscriptions || {}).map(([subject, chapters]) => {
                                    const isFull = chapters === 'all';
                                    return (
                                        <div key={subject} style={{
                                            padding: '20px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: '8px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}>
                                            <div>
                                                <h4 style={{ fontSize: '1rem', textTransform: 'capitalize', marginBottom: '4px' }}>{subject}</h4>
                                                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
                                                    {isFull ? 'Unlimited Access' : `${chapters.length} Chapters Active`}
                                                </p>
                                            </div>
                                            <div style={{
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                background: isFull ? 'rgba(0,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                                                color: isFull ? '#00FFFF' : 'rgba(255,255,255,0.5)',
                                                fontSize: '0.65rem',
                                                fontWeight: 'bold',
                                                fontFamily: 'Michroma'
                                            }}>
                                                {isFull ? 'UNLIMITED' : 'PARTIAL'}
                                            </div>
                                        </div>
                                    );
                                })}

                                {(!user.subscriptions || Object.keys(user.subscriptions).length === 0) && (
                                    <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.2)' }}>
                                        No active subscriptions found.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .profile-shell main > div {
                        grid-template-columns: 1fr !important;
                    }
                    aside {
                        max-width: 400px;
                        margin: 0 auto;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserProfilePage;
