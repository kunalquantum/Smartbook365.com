import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/landing.css';
import Chatbot from '../components/Chatbot';
import logoImg from '../assets/logo-removebg-preview.png';
import { DOMAIN_CATALOG } from '../data/learningCatalog';

const LandingPage = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });
    const [scrollWidth, setScrollWidth] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isRoaming, setIsRoaming] = useState(false);
    const [showBubble, setShowBubble] = useState(false);
    const containerRef = useRef(null);

    // Close menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Reveal on Scroll Animation
    useEffect(() => {
        const revealElements = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // 2. Scroll Effects
    useEffect(() => {
        const container = containerRef.current;
        const isMobile = window.innerWidth <= 768;
        if (!container && !isMobile) return;

        let frameId;
        const handleScroll = () => {
            const scrollTop = isMobile ? window.scrollY : container.scrollTop;
            const height = isMobile
                ? document.documentElement.scrollHeight - window.innerHeight
                : container.scrollHeight - container.clientHeight;
            const progress = height > 0 ? scrollTop / height : 0;
            
            // Set global scroll variable for parallax
            const scrollHost = isMobile ? document.documentElement : container;
            scrollHost.style.setProperty('--scroll-progress', progress);
            scrollHost.style.setProperty('--scroll-top', scrollTop);
            
            frameId = requestAnimationFrame(() => {
                setScrolled(scrollTop > 50);
                const width = progress * 100;
                setScrollWidth(width);
            });
        };

        const scrollTarget = isMobile ? window : container;
        scrollTarget.addEventListener('scroll', handleScroll, { passive: true });
        document.body.style.overflow = isMobile ? 'auto' : 'hidden';
        handleScroll();
        
        return () => {
            scrollTarget.removeEventListener('scroll', handleScroll);
            document.body.style.overflow = 'auto';
            cancelAnimationFrame(frameId);
        };
    }, []);

    // Proactive AI Engagement (Roaming Behavior)
    useEffect(() => {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 3000)); // Initial wait
            setIsRoaming(true);
            
            await new Promise(r => setTimeout(r, 2000)); // Moving to center
            setShowBubble(true);
            
            await new Promise(r => setTimeout(r, 3000)); // Show bubble
            setShowBubble(false);
            
            await new Promise(r => setTimeout(r, 1000)); // Small pause
            setIsRoaming(false); // Return back
        };

        sequence();
    }, []);

    // 3. Custom Cursor
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        let animationFrame;
        const animate = () => {
            setCursorPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.15,
                y: prev.y + (mousePos.y - prev.y) * 0.15
            }));
            setFollowerPos(prev => ({
                x: prev.x + (mousePos.x - prev.x) * 0.1,
                y: prev.y + (mousePos.y - prev.y) * 0.1
            }));
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [mousePos]);

    return (
        <div className="landing-page">
            <div id="scroll-progress" style={{ width: `${scrollWidth}%` }}></div>
            <div id="custom-cursor" style={{ transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)` }}></div>
            <div id="cursor-follower" style={{ transform: `translate3d(${followerPos.x - 14}px, ${followerPos.y - 14}px, 0)` }}></div>

            <header id="main-header" className={`${scrolled ? 'scrolled' : ''} ${isMenuOpen ? 'menu-active' : ''}`}>
                <nav className="container">
                    <div className="logo">
                        <img src={logoImg} alt="Smartbook 365 Logo" className="logo-img" />
                        <span className="logo-text">Smartbook</span>
                    </div>

                    <ul className="nav-links">
                        <li><a href="#features">Experience</a></li>
                        <li><a href="#domains">Domains</a></li>
                        <li><Link to="/subscription" className="btn btn-secondary">Join Now</Link></li>
                    </ul>
                </nav>
            </header>

            <div className="landing-page-container" ref={containerRef}>
                <section id="hero" className="hero-section">
                    <div className="container hero-grid">
                        <div className="hero-content">
                            <h1 className="reveal">
                                SMARTBOOK
                            </h1>
                            <div className="hero-btns reveal delay-2">
                                <Link to="/login" className="btn btn-primary">GET STARTED</Link>
                                <Link to="/demo" className="btn btn-outline">TRY DEMO</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="features-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="reveal">The Architecture</h2>
                            <p className="reveal delay-1">REDEFINING EDUCATION THROUGH HIGH-FIDELITY SIMULATIONS.</p>
                        </div>
                        <div className="features-grid">
                            <div className="feature-card reveal delay-1">
                                <h3>Visual Precision</h3>
                                <p>MEDICAL-GRADE 3D REPRESENTATIONS OF ATOMIC AND PHYSICAL SYSTEMS.</p>
                            </div>
                            <div className="feature-card reveal delay-2">
                                <h3>Total Control</h3>
                                <p>MANIPULATE PARAMETERS IN REAL-TIME TO SEE INSTANT PHYSICAL RESULTS.</p>
                            </div>
                            <div className="feature-card ">
                                <h3>Pure Immersion</h3>
                                <p>A DISTRACTION-FREE ENVIRONMENT DESIGNED FOR DEEP TECHNICAL FOCUS.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="domains" className="subjects-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="reveal">Learning Domains</h2>
                            <p className="reveal delay-1">ENTER THROUGH THE DOMAIN LAYER, THEN DROP INTO THE LIVE SUBJECT STACK.</p>
                        </div>
                        <div className="domain-grid">
                            {DOMAIN_CATALOG.map((domain, index) => (
                                <Link
                                    key={domain.id}
                                    to={`/domains/${domain.id}`}
                                    className={`domain-card reveal delay-${index + 1}`}
                                    style={{
                                        '--domain-accent': domain.accent,
                                        '--domain-glow': domain.glow,
                                    }}
                                >
                                    <div className="domain-card-head">
                                        <span className="domain-code">{domain.code}</span>
                                        <span className="domain-status">{domain.status}</span>
                                    </div>

                                    <div className="domain-card-body">
                                        <h3>{domain.title}</h3>
                                        <p>{domain.summary}</p>
                                    </div>

                                    <div className="domain-track-list">
                                        {domain.highlights.map((highlight) => (
                                            <span key={highlight}>{highlight}</span>
                                        ))}
                                    </div>

                                    <span className="view-more">ENTER DOMAIN &rarr;</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                <footer id="main-footer" style={{ scrollSnapAlign: 'start' }}>
                    <div className="container footer-grid">
                        <div className="footer-brand">
                             <div className="logo">
                                <img src={logoImg} alt="Smartbook 365 Logo" className="logo-img" />
                                <span className="logo-text">Smartbook</span>
                            </div>
                            <p>SMARTBOOK 365 VISUALIZER INTERFACE 1.0</p>
                        </div>
                        <div className="footer-links">
                            <h4>Protocol</h4>
                            <ul>
                                <li><a href="#">Simulations</a></li>
                                <li><a href="#">Network</a></li>
                            </ul>
                        </div>
                        <div className="footer-social">
                            <h4>Connect</h4>
                            <div className="social-icons">
                                <a href="#">TW</a>
                                <a href="#">IG</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Chatbot Floating Button / Mascot */}
            <div 
                className={`chatbot-fab ${isChatOpen ? 'hidden' : ''} ${isRoaming ? 'roaming' : ''}`} 
                onClick={() => setIsChatOpen(true)}
            >
                <div className="chatbot-inner">
                    <img src={logoImg} alt="Chatbot Support" />
                </div>
                <div className="chatbot-glow"></div>
                
                {showBubble && (
                    <div className="chat-speech-bubble">
                        CAN I HELP U?
                    </div>
                )}
            </div>

            {/* Chatbot Window */}
            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    );
};

export default LandingPage;
