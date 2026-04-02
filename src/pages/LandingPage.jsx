import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/landing.css';

const LandingPage = () => {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 });
    const [scrollWidth, setScrollWidth] = useState(0);
    const heroVisualRef = useRef(null);

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
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Progress bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolledPercent = (winScroll / height) * 100;
            setScrollWidth(scrolledPercent);

            // Parallax for Hero
            if (heroVisualRef.current) {
                const speed = 0.2;
                const yPos = -(window.scrollY * speed);
                heroVisualRef.current.style.transform = `translateY(${yPos}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
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

            <header id="main-header" className={scrolled ? 'scrolled' : ''}>
                <nav className="container">
                    <div className="logo">
                        <span className="logo-icon">▲</span>
                        <span className="logo-text">Smartbook</span>
                    </div>
                    <ul className="nav-links" style={{ alignItems: 'center' }}>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#subjects">Subjects</a></li>
                        {user ? (
                            <>
                                <li><Link to="/subscription" style={{ color: 'var(--amber)', fontWeight: '700' }}>My Subscription</Link></li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '10px' }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'var(--amber)',
                                        color: '#000',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '14px',
                                        fontWeight: '800'
                                    }}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <button onClick={logout} className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }}>Logout</button>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/subscription" className="btn btn-secondary">Join Now</Link></li>
                        )}
                    </ul>
                </nav>
            </header>

            <main>
                <section id="hero" className="hero-section">
                    <div className="container hero-grid">
                        <div className="hero-content">
                            <h1 className="reveal">
                                Stop Reading. <br />
                                <div className="hero-dot-container">
                                    <div className="hero-dot"></div>
                                    <span className="gradient-text hero-title-large">Explore</span>
                                </div>
                            </h1>

                            <p className="reveal delay-1">The first truly interactive educational visualizer that brings every topic of every subject to life with stunning 3D simulations.</p>
                            <div className="hero-btns reveal delay-2">
                                <a href="#demo" className="btn btn-primary">Try Demo</a>
                                <a href="#subjects" className="btn btn-outline">Explore Subjects</a>
                            </div>
                        </div>
                        <div className="hero-visual-container reveal delay-3" ref={heroVisualRef}>

                            <div className="glass-card visual-wrapper">
                                <img src="/assets/images/hero.png" alt="Smartbook Holographic Hero" className="hero-img" />
                            </div>
                            <div className="floating-badge badge-1">3D Sims</div>
                            <div className="floating-badge badge-2">Interactive</div>
                        </div>
                    </div>
                    <div className="hero-bg-glow"></div>
                </section>

                <section id="features" className="features-section">
                    <div className="container section-header text-center">
                        <h2 className="reveal"><span className="typewriter-static">Built for the Modern Learner</span></h2>
                        <p className="reveal delay-1">Smartbook goes beyond static text. It simulates reality to ensure deep understanding of complex scientific and mathematical concepts.</p>
                    </div>
                    <div className="container features-grid">
                        <div className="feature-card reveal delay-1">
                            <div className="feature-icon">🔬</div>
                            <h3>Interactive Visuals</h3>
                            <p>Every topic is visualized with interactive controls. Rotate, zoom, and experiment in real-time with medical-grade precision.</p>
                        </div>
                        <div className="feature-card reveal delay-2">
                            <div className="feature-icon">📚</div>
                            <h3>Subject Segregation</h3>
                            <p>Meticulously organized structure across Science and Mathematics. Find any chapter or topic from the HSC curriculum in seconds.</p>
                        </div>
                        <div className="feature-card reveal delay-3">
                            <div className="feature-icon">⚡</div>
                            <h3>Simulatory Learning</h3>
                            <p>Don't just learn formulas—simulate them. Modify parameters and see the physical results instantly with real-time telemetry.</p>
                        </div>
                    </div>
                </section>

                <section id="subjects" className="subjects-section">
                    <div className="container section-header text-center">
                        <h2 className="reveal">Explore the <span className="gradient-text">Smart Universe</span></h2>
                    </div>
                    <div className="container subject-tabs">
                        <div className="subject-card reveal delay-1">
                            <div className="subject-preview">
                                <img src="/assets/images/chemistry.png" alt="Chemistry Simulation Preview" />
                            </div>
                            <div className="subject-info">
                                <h3>Chemistry</h3>
                                <p>Atomic structures, chemical bonds, and reactions. Visualized down to the atomic level with interactive 3D models.</p>
                                <Link to="/chemistry" className="view-more">Launch Module &rarr;</Link>
                            </div>
                        </div>
                        <div className="subject-card reveal delay-2">
                            <div className="subject-preview">
                                <img src="/assets/images/math.png" alt="Math Simulation Preview" />
                            </div>
                            <div className="subject-info">
                                <h3>Mathematics</h3>
                                <p>Calculus, Geometry, and Algebra. Abstract concepts made tangible through interactive coordinate grids and function visualizers.</p>
                                <Link to="/maths" className="view-more">Launch Module &rarr;</Link>
                            </div>
                        </div>
                        <div className="subject-card reveal delay-3">
                            <div className="subject-preview">
                                <img src="/assets/images/physics.png" alt="Physics Simulation Preview" />
                            </div>
                            <div className="subject-info">
                                <h3>Physics</h3>
                                <p>Mechanics, Optics, and Electromagnetism. Simulate the laws of the universe with high-fidelity physics engines.</p>
                                <Link to="/physics" className="view-more">Launch Module &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>


            <footer id="main-footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <div className="logo">
                            <span className="logo-icon">▲</span>
                            <span className="logo-text">Smartbook</span>
                        </div>
                        <p>The premium educational visualizer for the next generation.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#">Simulations</a></li>
                            <li><a href="#">Subjects</a></li>
                            <li><a href="#">Pricing</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        <div className="social-icons">
                            <a href="#">Tw</a>
                            <a href="#">In</a>
                            <a href="#">Fb</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom text-center">
                    <p>&copy; 2026 Smartbook Visualizer. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
