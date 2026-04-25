import React, { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import logoImg from '../assets/logo-removebg-preview.png'
import {
    COMPUTER_LANGUAGE_TRACKS,
    LANGUAGE_LEVELS,
    getComputerLanguageTrackById,
} from '../data/learningCatalog'
import '../styles/landing.css'

const ProgrammingLanguagePage = () => {
    const { languageId } = useParams()
    const [scrolled, setScrolled] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const track = useMemo(() => getComputerLanguageTrackById(languageId), [languageId])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!track) {
        return <Navigate to="/domains/computer-language" replace />
    }

    return (
        <div
            className="landing-page domain-page language-page"
            style={{
                '--domain-accent': track.accent,
                '--domain-glow': track.glow,
                '--language-accent': track.accent,
                '--language-glow': track.glow,
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
                        <li><Link to="/domains/computer-language">Languages</Link></li>
                        <li><a href="#language-levels">Levels</a></li>
                        <li><Link to="/subscription" className="btn btn-secondary">Join Now</Link></li>
                    </ul>
                </nav>
            </header>

            <main className="domain-page-shell">
                <section className="domain-hero-section">
                    <div className="container domain-hero-grid">
                        <div className="domain-hero-copy">
                            <span className="domain-code">{track.code}</span>
                            <h1>{track.title}</h1>
                            <p>{track.summary}</p>

                            <div className="hero-btns">
                                <a href="#language-levels" className="btn btn-primary">VIEW LEVELS</a>
                                <Link to="/domains/computer-language" className="btn btn-outline">BACK TO LANGUAGES</Link>
                            </div>
                        </div>

                        <div className="domain-hero-panel">
                            <span className="domain-status">{track.status}</span>
                            <h2>Language Brief</h2>
                            <p>{track.title} now branches into three learning levels so users can enter at the right depth and move through a cleaner progression path.</p>

                            <div className="domain-track-list">
                                {track.highlights.map((highlight) => (
                                    <span key={highlight}>{highlight}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="language-levels" className="domain-subject-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>{track.title} Levels</h2>
                            <p>BEGINNER, MEDIUM, AND ADVANCED ENTRY POINTS FOR THE {track.title.toUpperCase()} TRACK.</p>
                        </div>

                        <div className="language-level-grid">
                            {LANGUAGE_LEVELS.map((level) => (
                                <div key={level.id} className="language-level-card">
                                    <div className="language-level-head">
                                        <span className="domain-code">{level.code}</span>
                                        <span className="semester-phase">{level.focus}</span>
                                    </div>

                                    <div className="department-card-body">
                                        <h3>{level.title}</h3>
                                        <p>{level.summary}</p>
                                    </div>

                                    <span className="view-more">LEVEL TRACK READY &rarr;</span>
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
                        <p>{track.title.toUpperCase()} LEVEL GATEWAY</p>
                    </div>
                    <div className="footer-links">
                        <h4>Languages</h4>
                        <ul>
                            {COMPUTER_LANGUAGE_TRACKS.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/domains/computer-language/${item.id}`}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Connect</h4>
                        <div className="social-icons">
                            <a href="#language-levels">LEVELS</a>
                            <Link to="/subscription">JOIN</Link>
                        </div>
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

export default ProgrammingLanguagePage
