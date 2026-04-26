import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import logoImg from '../assets/logo-removebg-preview.png'
import { COMMERCE_ACCOUNTS_LEVELS } from '../data/learningCatalog'
import '../styles/landing.css'

const CommerceAccountsPage = () => {
    const [scrolled, setScrolled] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div
            className="landing-page domain-page"
            style={{
                '--domain-accent': '#f59e0b',
                '--domain-glow': 'rgba(245, 158, 11, 0.18)',
            }}
        >
            <header id="main-header" className={scrolled ? 'scrolled' : ''}>
                <nav className="container">
                    <Link to="/" className="logo">
                        <img src={logoImg} alt="Smartbook 365 Logo" className="logo-img" />
                        <span className="logo-text">Smartbook</span>
                    </Link>

                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/domains/commerce">Commerce</Link></li>
                        <li><Link to="/subscription" className="btn btn-secondary">Join Now</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="domain-page-shell">
                <section className="domain-hero-section">
                    <div className="container domain-hero-grid">
                        <div className="domain-hero-copy">
                            <span className="domain-code">Trk 01</span>
                            <h1>Accounts Track</h1>
                            <p>Financial ledgers, asset depreciation, venture structures, and core accounting logic.</p>

                            <div className="hero-btns">
                                <a href={`#levels`} className="btn btn-primary">VIEW LEVELS</a>
                                <Link to="/domains/commerce" className="btn btn-outline">BACK TO COMMERCE</Link>
                            </div>
                        </div>

                        <div className="domain-hero-panel">
                            <span className="domain-status">Track Live</span>
                            <h2>Track Brief</h2>
                            <p>Select your academic year to access the specific accounting modules.</p>

                            <div className="domain-track-list">
                                <span>Financial accounting</span>
                                <span>Asset depreciation</span>
                                <span>Venture systems</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="levels" className="domain-subject-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>Academic Levels</h2>
                            <p>Choose your level below to enter the accounting modules.</p>
                        </div>

                        <div className="domain-section-stack">
                            {COMMERCE_ACCOUNTS_LEVELS.map((level) => (
                                <div key={level.id} className="science-level-block">
                                    <div className="science-level-head">
                                        <span className="domain-code">{level.code}</span>
                                        <h3>{level.title}</h3>
                                        <p>{level.copy}</p>
                                    </div>

                                    <div className="subject-tabs">
                                        {level.subjects.map((subject) => (
                                            <div key={`${level.id}-${subject.id}`} className="subject-card">
                                                <div className="subject-visual">
                                                    <img src={subject.image} alt={`${subject.title} Module Visual`} />
                                                </div>
                                                <div className="subject-info">
                                                    <span className="subject-code">{subject.code}</span>
                                                    <h3>{subject.title}</h3>
                                                    <p>{subject.description}</p>
                                                    <Link to={subject.route} className="view-more">ENTER MODULE &rarr;</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer id="main-footer">
                <div className="container footer-grid">
                    <div className="footer-brand">
                        <div className="logo">
                            <img src={logoImg} alt="Smartbook 365 Logo" className="logo-img" />
                            <span className="logo-text">Smartbook</span>
                        </div>
                        <p>ACCOUNTS TRACK ACCESS LAYER</p>
                    </div>
                </div>
            </footer>

            <div
                className={`chatbot-fab ${isChatOpen ? 'hidden' : ''}`}
                onClick={() => setIsChatOpen(true)}
            >
                <div className="chatbot-inner">
                    <img src={logoImg} alt="Chatbot Support" />
                </div>
                <div className="chatbot-glow"></div>
            </div>

            <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
    )
}

export default CommerceAccountsPage
