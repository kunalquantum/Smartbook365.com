import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo-removebg-preview.png';
import { DEMO_CONFIG as STATIC_DEMO } from '../config/demoConfig';
import '../styles/auth.css';

const DemoPage = () => {
    const [demoConf, setDemoConf] = useState(STATIC_DEMO);

    // Load dynamic demo config (admin may have changed it)
    useEffect(() => {
        const loadDynamic = async () => {
            // Try localStorage first (admin saves here)
            try {
                const local = localStorage.getItem('sb_demo_config');
                if (local) { setDemoConf(JSON.parse(local)); return; }
            } catch { /* ignore */ }
        };
        loadDynamic();
    }, []);

    const SUBJECTS = [
        { key: 'chemistry', icon: '⚗️', route: '/demo/chemistry', ...(demoConf.chemistry || STATIC_DEMO.chemistry) },
        { key: 'physics', icon: '⚛️', route: '/demo/physics', ...(demoConf.physics || STATIC_DEMO.physics) },
        { key: 'maths', icon: '📐', route: '/demo/maths', ...(demoConf.maths || STATIC_DEMO.maths) },
    ];

    const totalFree = SUBJECTS.reduce((s, sub) => s + (sub.chapterIds?.length || 0), 0);

    return (
        <div className="demo-page">
            <div className="demo-scanlines"></div>

            <div className="demo-back">
                <Link to="/">← BACK TO HOME</Link>
            </div>

            {/* Header */}
            <div className="demo-header">
                <img src={logoImg} alt="Smartbook 365" className="demo-logo" />
                <div className="demo-badge">FREE ACCESS</div>
                <h1>DEMO <span>MODE</span></h1>
                <p className="demo-subtitle">
                    EXPERIENCE SMARTBOOK 365 — NO LOGIN REQUIRED
                </p>
                <p className="demo-desc">
                    Explore curated chapters from each subject with full interactive visualizations.
                    No account needed. No credit card. Just learning.
                </p>
            </div>

            {/* Subject Cards */}
            <div className="demo-grid">
                {SUBJECTS.map((subject) => (
                    <Link 
                        to={subject.route} 
                        key={subject.key} 
                        className="demo-card"
                        style={{ '--card-accent': subject.accent }}
                    >
                        <div className="demo-card-icon">{subject.icon}</div>
                        <h2>{subject.label}</h2>
                        <p>{subject.description}</p>
                        <div className="demo-card-meta">
                            {subject.chapterIds?.length || 0} FREE {(subject.chapterIds?.length || 0) === 1 ? 'CHAPTER' : 'CHAPTERS'}
                        </div>
                        <div className="demo-card-cta">EXPLORE FREE →</div>
                    </Link>
                ))}
            </div>

            {/* Upgrade Banner */}
            <div className="demo-upgrade">
                <p>Want access to <strong>all chapters</strong> across {SUBJECTS.length} subjects?</p>
                <Link to="/login" className="demo-upgrade-btn">UNLOCK FULL ACCESS</Link>
            </div>

            <style>{`
                .demo-page {
                    min-height: 100vh;
                    background: #0B0B0B;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 60px 20px 80px;
                    position: relative;
                    overflow: hidden;
                }

                .demo-page::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background-image: 
                        linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    pointer-events: none;
                }

                .demo-scanlines {
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: repeating-linear-gradient(
                        0deg, transparent, transparent 2px,
                        rgba(0, 0, 0, 0.03) 2px, rgba(0, 0, 0, 0.03) 4px
                    );
                    pointer-events: none;
                    z-index: 0;
                }

                .demo-back {
                    position: absolute;
                    top: 20px; left: 20px;
                    z-index: 2;
                }

                .demo-back a {
                    color: rgba(255,255,255,0.4);
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.6rem;
                    text-decoration: none;
                    letter-spacing: 0.1rem;
                    transition: all 0.3s ease;
                }

                .demo-back a:hover { color: #00FFFF; }

                .demo-header {
                    text-align: center;
                    margin-bottom: 48px;
                    position: relative;
                    z-index: 1;
                    padding: 0 16px;
                }

                .demo-logo {
                    width: 70px;
                    filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.3));
                    margin-bottom: 20px;
                }

                .demo-badge {
                    display: inline-block;
                    background: rgba(0, 255, 255, 0.12);
                    color: #00FFFF;
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.6rem;
                    padding: 5px 14px;
                    border-radius: 2px;
                    letter-spacing: 0.2rem;
                    margin-bottom: 16px;
                    border: 1px solid rgba(0, 255, 255, 0.25);
                }

                .demo-header h1 {
                    font-family: 'Michroma', sans-serif;
                    font-size: 2.5rem;
                    color: #fff;
                    letter-spacing: 0.15rem;
                    margin-bottom: 8px;
                }

                .demo-header h1 span { color: #00FFFF; }

                .demo-subtitle {
                    color: rgba(255,255,255,0.4);
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.6rem;
                    letter-spacing: 0.2rem;
                    margin-bottom: 16px;
                }

                .demo-desc {
                    color: rgba(255,255,255,0.5);
                    font-size: 0.85rem;
                    max-width: 520px;
                    line-height: 1.7;
                    margin: 0 auto;
                }

                .demo-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    max-width: 900px;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                    margin-bottom: 48px;
                    padding: 0 16px;
                }

                .demo-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 4px;
                    padding: 36px 28px;
                    text-decoration: none;
                    color: #fff;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .demo-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 100%; height: 3px;
                    background: var(--card-accent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .demo-card:hover {
                    border-color: var(--card-accent);
                    transform: translateY(-4px);
                    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
                }

                .demo-card:hover::before { opacity: 1; }

                .demo-card-icon {
                    font-size: 2.5rem;
                    margin-bottom: 16px;
                }

                .demo-card h2 {
                    font-family: 'Michroma', sans-serif;
                    font-size: 1rem;
                    letter-spacing: 0.1rem;
                    margin-bottom: 10px;
                }

                .demo-card p {
                    color: rgba(255,255,255,0.5);
                    font-size: 0.8rem;
                    line-height: 1.6;
                    margin-bottom: 16px;
                }

                .demo-card-meta {
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.55rem;
                    color: var(--card-accent);
                    letter-spacing: 0.15rem;
                    margin-bottom: 20px;
                    opacity: 0.8;
                }

                .demo-card-cta {
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.65rem;
                    color: #fff;
                    letter-spacing: 0.1rem;
                    padding: 10px 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    transition: color 0.3s ease;
                }

                .demo-card:hover .demo-card-cta {
                    color: var(--card-accent);
                }

                .demo-upgrade {
                    text-align: center;
                    position: relative;
                    z-index: 1;
                    padding: 0 16px;
                }

                .demo-upgrade p {
                    color: rgba(255,255,255,0.5);
                    font-size: 0.85rem;
                    margin-bottom: 16px;
                }

                .demo-upgrade-btn {
                    display: inline-block;
                    background: #00FFFF;
                    color: #000;
                    font-family: 'Michroma', sans-serif;
                    font-size: 0.7rem;
                    padding: 12px 28px;
                    border-radius: 2px;
                    text-decoration: none;
                    letter-spacing: 0.1rem;
                    transition: all 0.3s ease;
                }

                .demo-upgrade-btn:hover {
                    box-shadow: 0 0 25px rgba(0, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                /* ═══ MOBILE RESPONSIVE ═══ */
                @media (max-width: 768px) {
                    .demo-page { padding: 50px 12px 60px; }
                    .demo-grid { grid-template-columns: 1fr; gap: 16px; }
                    .demo-header h1 { font-size: 1.6rem; letter-spacing: 0.08rem; }
                    .demo-subtitle { font-size: 0.5rem; letter-spacing: 0.1rem; }
                    .demo-desc { font-size: 0.78rem; }
                    .demo-badge { font-size: 0.5rem; padding: 4px 10px; }
                    .demo-logo { width: 50px; }
                    .demo-card { padding: 24px 20px; }
                    .demo-card-icon { font-size: 2rem; }
                    .demo-card h2 { font-size: 0.85rem; }
                    .demo-upgrade-btn { font-size: 0.6rem; padding: 10px 20px; }
                }

                @media (max-width: 480px) {
                    .demo-header h1 { font-size: 1.3rem; }
                    .demo-card { padding: 20px 16px; }
                    .demo-card p { font-size: 0.75rem; }
                    .demo-back { top: 12px; left: 12px; }
                    .demo-back a { font-size: 0.5rem; }
                }
            `}</style>
        </div>
    );
};

export default DemoPage;
