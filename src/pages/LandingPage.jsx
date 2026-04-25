import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';
import Chatbot from '../components/Chatbot';
import logoImg from '../assets/logo-removebg-preview.png';
import chemistryImg from '../assets/subject-chemistry.png';
import physicsImg from '../assets/subject-physics.png';
import mathsImg from '../assets/subject-maths.png';

const LandingPage = () => {
    const { user, logout } = useAuth();
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
        if (!container) return;

        let frameId;
        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const height = container.scrollHeight - container.clientHeight;
            const progress = height > 0 ? scrollTop / height : 0;
            
            // Set global scroll variable for parallax
            container.style.setProperty('--scroll-progress', progress);
            container.style.setProperty('--scroll-top', scrollTop);
            
            frameId = requestAnimationFrame(() => {
                setScrolled(scrollTop > 50);
                const width = progress * 100;
                setScrollWidth(width);
            });
        };

        container.addEventListener('scroll', handleScroll);
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        handleScroll();
        
        return () => {
            container.removeEventListener('scroll', handleScroll);
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

    // 4. Typewriter Effect
    const Typewriter = ({ strings }) => {
        const [text, setText] = useState('');
        const [isDeleting, setIsDeleting] = useState(false);
        const [loopNum, setLoopNum] = useState(0);
        const [typingSpeed, setTypingSpeed] = useState(150);

        useEffect(() => {
            const handleType = () => {
                const i = loopNum % strings.length;
                const fullText = strings[i];

                setText(isDeleting 
                    ? fullText.substring(0, text.length - 1) 
                    : fullText.substring(0, text.length + 1)
                );

                setTypingSpeed(isDeleting ? 50 : 150);

                if (!isDeleting && text === fullText) {
                    setTimeout(() => setIsDeleting(true), 2000);
                } else if (isDeleting && text === '') {
                    setIsDeleting(false);
                    setLoopNum(loopNum + 1);
                }
            };

            const timer = setTimeout(handleType, typingSpeed);
            return () => clearTimeout(timer);
        }, [text, isDeleting, loopNum, strings, typingSpeed]);

        return <span className="typewriter-text">{text}</span>;
    };

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
                        <li><a href="#subjects">Subjects</a></li>
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
                            <div className="feature-card reveal delay-3">
                                <h3>Pure Immersion</h3>
                                <p>A DISTRACTION-FREE ENVIRONMENT DESIGNED FOR DEEP TECHNICAL FOCUS.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="subjects" className="subjects-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="reveal">Target Modules</h2>
                        </div>
                        <div className="subject-tabs">
                            <div className="subject-card reveal delay-1">
                                <div className="subject-visual">
                                    <img src={chemistryImg} alt="Chemistry Module Visual" />
                                </div>
                                <div className="subject-info">
                                    <h3>Chemistry</h3>
                                    <p>QUANTUM STRUCTURES AND BONDS.</p>
                                    <Link to="/chemistry" className="view-more">ENTER MODULE &rarr;</Link>
                                </div>
                            </div>
                            <div className="subject-card reveal delay-2">
                                <div className="subject-visual">
                                    <img src={physicsImg} alt="Physics Module Visual" />
                                </div>
                                <div className="subject-info">
                                    <h3>Physics</h3>
                                    <p>GRAVITY AND ORBITAL SYSTEMS.</p>
                                    <Link to="/physics" className="view-more">ENTER MODULE &rarr;</Link>
                                </div>
                            </div>
                            <div className="subject-card reveal delay-3">
                                <div className="subject-visual">
                                    <img src={mathsImg} alt="Mathematics Module Visual" />
                                </div>
                                <div className="subject-info">
                                    <h3>Mathematics</h3>
                                    <p>GEOMETRIC MANIFOLD DYNAMICS.</p>
                                    <Link to="/maths" className="view-more">ENTER MODULE &rarr;</Link>
                                </div>
                            </div>
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
                className={`chatbot-fab ${isChatOpen ? 'hidden' : 'reveal delay-3'} ${isRoaming ? 'roaming' : ''}`} 
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
