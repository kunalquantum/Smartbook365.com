import React, { useState, useEffect, Suspense } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo-removebg-preview.png';
import { DEMO_CONFIG as STATIC_DEMO } from '../config/demoConfig';
import { useAuth } from '../context/AuthContext';
import { getDemoSimulator, getChapterInfo } from '../config/demoRegistry';
import DemoVisualizer from '../components/DemoVisualizer';
import '../styles/auth.css';

const DemoPage = () => {
    const { demoConfig } = useAuth();
    const [demoConf, setDemoConf] = useState(demoConfig || STATIC_DEMO);

    // Load dynamic demo config (admin may have changed it)
    useEffect(() => {
        if (demoConfig) {
            setDemoConf(demoConfig);
        } else {
            try {
                const local = localStorage.getItem('sb_demo_config');
                if (local) setDemoConf(JSON.parse(local));
            } catch { /* ignore */ }
        }
    }, [demoConfig]);

    const SUBJECTS = [
        { key: 'physics', icon: '⚛️', route: '/demo/physics', ...(demoConf.physics || STATIC_DEMO.physics) },
        { key: 'chemistry', icon: '⚗️', route: '/demo/chemistry', ...(demoConf.chemistry || STATIC_DEMO.chemistry) },
        { key: 'maths', icon: '📐', route: '/demo/maths', ...(demoConf.maths || STATIC_DEMO.maths) },
    ];

    return (
        <div className="demo-page">
            <div className="demo-scanlines"></div>
            
            {/* Ambient Background Glows */}
            <div className="bg-glow-1"></div>
            <div className="bg-glow-2"></div>

            <div className="demo-back">
                <Link to="/">← BACK TO HOME</Link>
            </div>

            {/* Header Section */}
            <header className="demo-header-new">
                <div className="logo-container">
                    <img src={logoImg} alt="Smartbook 365" />
                </div>
                <div className="public-beta-badge">
                    <span className="dot"></span>
                    <span className="text">Free Public Beta</span>
                </div>
                <h1 className="main-title">
                    DEMO <span className="highlight">LABS</span>
                </h1>
                <p className="main-desc text-center mx-auto">
                    Experience the future of digital learning. Interact with our proprietary 3D/2D simulators 
                    directly from this dashboard. No registration, no friction—just pure science.
                </p>
            </header>

            {/* Interactive Visualizers Section */}
            <main className="demo-main-container">
                <div className="demo-visualizer-grid">
                    {SUBJECTS.map((subject) => {
                        const firstChapterId = subject.chapterIds?.[0];
                        const chapterInfo = firstChapterId ? getChapterInfo(subject.key, firstChapterId) : null;
                        const Simulator = firstChapterId ? getDemoSimulator(subject.key, firstChapterId) : null;

                        return (
                            <div 
                                key={subject.key} 
                                className="lab-card group"
                                style={{ '--subject-accent': subject.accent }}
                            >
                                {/* Visualizer Preview */}
                                <div className="lab-preview-box">
                                    <DemoVisualizer Simulator={Simulator} accentColor={subject.accent} />
                                </div>

                                {/* Content */}
                                <div className="lab-content">
                                    <div className="lab-header">
                                        <div className="lab-title-group">
                                            <div className="featured-tag">Featured Module</div>
                                            <h3 className="chapter-title">
                                                {chapterInfo?.title || subject.label}
                                            </h3>
                                        </div>
                                        <div className="subject-icon">{subject.icon}</div>
                                    </div>

                                    <p className="chapter-desc">
                                        {chapterInfo?.desc || chapterInfo?.description || subject.description}
                                    </p>

                                    <div className="lab-footer">
                                        <div className="availability-info">
                                            <span className="label">Availability</span>
                                            <span className="value">
                                                {subject.chapterIds?.length || 0} Free Chapters
                                            </span>
                                        </div>
                                        <Link 
                                            to={firstChapterId ? `${subject.route}/${firstChapterId}` : subject.route}
                                            className="enter-lab-btn"
                                        >
                                            ENTER LAB →
                                        </Link>
                                    </div>
                                </div>

                                {/* Corner Accent */}
                                <div className="corner-accent"></div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* Full Access CTA */}
            <section className="demo-cta-section">
                <div className="cta-box">
                    <h2 className="cta-title">Unlock the Full Experience</h2>
                    <p className="cta-desc">
                        The Demo Labs only show a few of our 48+ interactive modules. 
                        Join 50,000+ students mastering complex concepts through visual intuition.
                    </p>
                    <div className="cta-actions">
                        <Link to="/login" className="btn-primary">
                            GET FULL ACCESS
                        </Link>
                        <Link to="/pricing" className="btn-secondary">
                            VIEW PRICING
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Michroma&family=Inter:wght@400;500;600;700;800&display=swap');

                .font-michroma { font-family: 'Michroma', sans-serif; }
                
                .demo-page {
                    min-height: 100vh;
                    background: #050505;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow-x: hidden;
                    padding-top: 80px;
                    padding-bottom: 100px;
                }

                .demo-scanlines {
                    position: fixed;
                    inset: 0;
                    background: linear-gradient(
                        rgba(18, 16, 16, 0) 50%, 
                        rgba(0, 0, 0, 0.2) 50%
                    ), linear-gradient(
                        90deg, 
                        rgba(255, 0, 0, 0.03), 
                        rgba(0, 255, 0, 0.01), 
                        rgba(0, 0, 255, 0.03)
                    );
                    background-size: 100% 3px, 3px 100%;
                    pointer-events: none;
                    z-index: 50;
                }

                .bg-glow-1 {
                    position: absolute;
                    top: 0; left: 25%;
                    width: 400px; height: 400px;
                    background: rgba(0, 255, 255, 0.1);
                    filter: blur(120px);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .bg-glow-2 {
                    position: absolute;
                    bottom: 0; right: 25%;
                    width: 400px; height: 400px;
                    background: rgba(168, 85, 247, 0.1);
                    filter: blur(120px);
                    border-radius: 50%;
                    pointer-events: none;
                }

                .demo-back {
                    position: absolute;
                    top: 24px; left: 24px;
                    z-index: 60;
                }

                .demo-back a {
                    color: rgba(255,255,255,0.4);
                    font-family: 'Michroma', sans-serif;
                    font-size: 10px;
                    text-decoration: none;
                    letter-spacing: 0.1em;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .demo-back a:hover { color: #00FFFF; transform: translateX(-4px); }

                .demo-header-new {
                    text-align: center;
                    margin-bottom: 60px;
                    position: relative;
                    z-index: 10;
                    padding: 0 20px;
                }

                .logo-container {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 24px;
                }

                .logo-container img {
                    width: 64px;
                    height: 64px;
                    object-fit: contain;
                    filter: drop-shadow(0 0 15px rgba(0, 255, 255, 0.4));
                }

                .public-beta-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 4px 16px;
                    border-radius: 999px;
                    background: rgba(0, 255, 255, 0.1);
                    border: 1px solid rgba(0, 255, 255, 0.2);
                    margin-bottom: 24px;
                }

                .public-beta-badge .dot {
                    width: 6px;
                    height: 6px;
                    background: #00FFFF;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .public-beta-badge .text {
                    font-size: 10px;
                    font-weight: bold;
                    color: #00FFFF;
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    font-family: monospace;
                }

                .main-title {
                    font-family: 'Michroma', sans-serif;
                    font-size: 2.5rem;
                    font-weight: bold;
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                }

                .main-title .highlight { color: #00FFFF; }

                .main-desc {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.9rem;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .demo-main-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 10;
                    padding: 0 20px;
                }

                .demo-visualizer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 32px;
                }

                .lab-card {
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(30, 41, 59, 1);
                    border-radius: 20px;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    transition: all 0.5s ease;
                    position: relative;
                }

                .lab-card:hover {
                    border-color: rgba(0, 255, 255, 0.5);
                    box-shadow: 0 0 50px rgba(0, 255, 255, 0.05);
                }

                .lab-preview-box {
                    height: 340px;
                    width: 100%;
                    background: rgba(2, 6, 23, 0.6);
                    border-bottom: 1px solid rgba(30, 41, 59, 1);
                }

                .lab-content {
                    padding: 24px;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                }

                .lab-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .featured-tag {
                    font-size: 10px;
                    font-weight: bold;
                    color: #00FFFF;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-family: monospace;
                    margin-bottom: 4px;
                }

                .chapter-title {
                    font-size: 1.25rem;
                    font-weight: bold;
                    transition: color 0.3s;
                }

                .lab-card:hover .chapter-title { color: #00FFFF; }

                .subject-icon { font-size: 1.5rem; }

                .chapter-desc {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.85rem;
                    margin-bottom: 24px;
                    line-height: 1.6;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .lab-footer {
                    margin-top: auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .availability-info {
                    display: flex;
                    flex-direction: column;
                }

                .availability-info .label {
                    font-size: 10px;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }

                .availability-info .value {
                    font-size: 12px;
                    font-family: monospace;
                    color: rgba(255,255,255,0.8);
                }

                .enter-lab-btn {
                    padding: 8px 20px;
                    border-radius: 8px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    font-size: 12px;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .enter-lab-btn:hover {
                    background: #00FFFF;
                    color: #000;
                    border-color: #00FFFF;
                }

                .enter-lab-btn:active { transform: scale(0.95); }

                .corner-accent {
                    position: absolute;
                    top: 0; right: 0;
                    width: 96px; height: 96px;
                    background: linear-gradient(to bottom left, rgba(0, 255, 255, 0.1), transparent);
                    opacity: 0;
                    transition: opacity 0.3s;
                    pointer-events: none;
                }

                .lab-card:hover .corner-accent { opacity: 1; }

                .demo-cta-section {
                    margin-top: 100px;
                    text-align: center;
                    position: relative;
                    z-index: 10;
                }

                .cta-box {
                    display: inline-block;
                    padding: 40px;
                    border-radius: 32px;
                    background: linear-gradient(to bottom, rgba(15, 23, 42, 1), rgba(2, 6, 23, 1));
                    border: 1px solid rgba(30, 41, 59, 1);
                    max-width: 700px;
                    width: 100%;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }

                .cta-title {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 16px;
                }

                .cta-desc {
                    color: rgba(255,255,255,0.6);
                    font-size: 0.95rem;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .cta-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn-primary {
                    padding: 12px 32px;
                    border-radius: 12px;
                    background: #00FFFF;
                    color: #000;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s;
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
                }

                .btn-primary:hover { background: #00dcdc; transform: translateY(-2px); }

                .btn-secondary {
                    padding: 12px 32px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    font-weight: bold;
                    text-decoration: none;
                    transition: all 0.3s;
                }

                .btn-secondary:hover { background: rgba(255,255,255,0.1); }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.1); }
                }

                @media (max-width: 768px) {
                    .main-title { font-size: 1.75rem; }
                    .demo-visualizer-grid { grid-template-columns: 1fr; }
                    .lab-preview-box { height: 280px; }
                    .cta-box { padding: 30px 20px; }
                    .cta-title { font-size: 1.5rem; }
                }
            `}</style>
        </div>
    );
};

export default DemoPage;
