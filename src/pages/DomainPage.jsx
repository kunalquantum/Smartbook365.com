import React, { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import logoImg from '../assets/logo-removebg-preview.png'
import {
    COMPUTER_LANGUAGE_TRACKS,
    DOMAIN_CATALOG,
    ENGINEERING_DEPARTMENTS,
    LIVE_SUBJECTS,
    SCIENCE_LEVELS,
    COMMERCE_TRACKS,
    SOFTWARE_PLACEMENT_TRACKS,
    getDomainById,
} from '../data/learningCatalog'
import '../styles/landing.css'
import { useAuth } from '../context/AuthContext'

const DomainPage = () => {
    const { user, logout } = useAuth()
    const { domainId } = useParams()
    const [scrolled, setScrolled] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const domain = useMemo(() => getDomainById(domainId), [domainId])
    const isEngineering = domain?.id === 'engineering'
    const isScience = domain?.id === 'science'
    const isCommerce = domain?.id === 'commerce'
    const isComputerLanguage = domain?.id === 'computer-language'
    const isSoftwarePlacement = domain?.id === 'software-placement'
    const sectionId = isEngineering
        ? 'engineering-departments'
        : isScience
            ? 'science-standards'
            : isCommerce
                ? 'commerce-tracks'
                : isComputerLanguage
                    ? 'language-tracks'
                    : isSoftwarePlacement
                        ? 'placement-tracks'
                        : 'live-subjects'

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!domain) {
        return <Navigate to="/" replace />
    }

    return (
        <div
            className="landing-page domain-page"
            style={{
                '--domain-accent': domain.accent,
                '--domain-glow': domain.glow,
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
                        <li><a href={`#${sectionId}`}>{isEngineering ? 'Departments' : isScience ? 'Standards' : isCommerce ? 'Tracks' : isComputerLanguage ? 'Languages' : isSoftwarePlacement ? 'Tracks' : 'Live Subjects'}</a></li>
                        {user ? (
                            <>
                                <li>
                                    <Link to="/profile" className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-1)', textDecoration: 'none' }}>
                                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: '#000' }}>
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.name}</span>
                                    </Link>
                                </li>
                                {user.role === 'admin' ? (
                                    <li><Link to="/admin" className="btn btn-outline" style={{ borderColor: '#ff00ff', color: '#ff00ff', fontSize: '0.6rem', padding: '0.4rem 1.2rem', minWidth: 'auto' }}>ADMIN DASH</Link></li>
                                ) : (
                                    <li><button onClick={logout} className="btn btn-outline" style={{ borderColor: 'var(--text-3)', color: 'var(--text-3)', fontSize: '0.6rem', padding: '0.4rem 1.2rem', minWidth: 'auto' }}>LOGOUT</button></li>
                                )}
                            </>
                        ) : (
                            <li><Link to="/subscription" className="btn btn-secondary">Join Now</Link></li>
                        )}
                    </ul>
                </nav>
            </header>

            <main className="domain-page-shell">
                <section className="domain-hero-section">
                    <div className="container domain-hero-grid">
                        <div className="domain-hero-copy">
                            <span className="domain-code">{domain.code}</span>
                            <h1>{domain.title}</h1>
                            <p>{domain.summary}</p>

                            <div className="hero-btns">
                                <a href={`#${sectionId}`} className="btn btn-primary">{isEngineering ? 'VIEW DEPARTMENTS' : isScience ? 'VIEW STANDARDS' : isCommerce ? 'VIEW TRACKS' : isComputerLanguage ? 'VIEW LANGUAGES' : isSoftwarePlacement ? 'VIEW TRACKS' : 'VIEW SUBJECTS'}</a>
                                <Link to="/" className="btn btn-outline">BACK HOME</Link>
                            </div>
                        </div>

                        <div className="domain-hero-panel">
                            <span className="domain-status">{domain.status}</span>
                            <h2>Domain Brief</h2>
                            <p>{domain.helper}</p>

                            <div className="domain-track-list">
                                {domain.highlights.map((highlight) => (
                                    <span key={highlight}>{highlight}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id={sectionId} className="domain-subject-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>{domain.sectionTitle}</h2>
                            <p>{domain.sectionCopy}</p>
                        </div>

                        {isEngineering ? (
                            <div className="department-grid">
                                {ENGINEERING_DEPARTMENTS.map((department) => (
                                    <Link
                                        key={department.id}
                                        to={`/domains/engineering/${department.id}`}
                                        className="department-card"
                                        style={{
                                            '--department-accent': department.accent,
                                            '--department-glow': department.glow,
                                        }}
                                    >
                                        <div className="department-card-head">
                                            <span className="domain-code">{department.code}</span>
                                            <span className="domain-status">{department.status}</span>
                                        </div>

                                        <div className="department-card-body">
                                            <h3>{department.title}</h3>
                                            <p>{department.summary}</p>
                                        </div>

                                        <div className="domain-track-list">
                                            {department.highlights.map((highlight) => (
                                                <span key={highlight}>{highlight}</span>
                                            ))}
                                        </div>

                                        <span className="view-more">ENTER DEPARTMENT &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        ) : isScience ? (
                            <div className="domain-section-stack">
                                {SCIENCE_LEVELS.map((level) => (
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
                        ) : isCommerce ? (
                            <div className="language-grid">
                                {COMMERCE_TRACKS.map((track) => (
                                    <Link
                                        key={track.id}
                                        to={track.route}
                                        className="language-card"
                                        style={{
                                            '--language-accent': track.accent,
                                            '--language-glow': track.glow,
                                        }}
                                    >
                                        <div className="department-card-head">
                                            <span className="domain-code">{track.code}</span>
                                            <span className="domain-status">{track.status}</span>
                                        </div>

                                        <div className="department-card-body">
                                            <h3>{track.title}</h3>
                                            <p>{track.summary}</p>
                                        </div>

                                        <div className="domain-track-list">
                                            {track.highlights.map((highlight) => (
                                                <span key={highlight}>{highlight}</span>
                                            ))}
                                        </div>

                                        <span className="view-more">ENTER TRACK &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        ) : isComputerLanguage ? (
                            <div className="language-grid">
                                {COMPUTER_LANGUAGE_TRACKS.map((track) => (
                                    <Link
                                        key={track.id}
                                        to={`/domains/computer-language/${track.id}`}
                                        className="language-card"
                                        style={{
                                            '--language-accent': track.accent,
                                            '--language-glow': track.glow,
                                        }}
                                    >
                                        <div className="department-card-head">
                                            <span className="domain-code">{track.code}</span>
                                            <span className="domain-status">{track.status}</span>
                                        </div>

                                        <div className="department-card-body">
                                            <h3>{track.title}</h3>
                                            <p>{track.summary}</p>
                                        </div>

                                        <div className="domain-track-list">
                                            {track.highlights.map((highlight) => (
                                                <span key={highlight}>{highlight}</span>
                                            ))}
                                        </div>

                                    </Link>
                                ))}
                            </div>
                        ) : isSoftwarePlacement ? (
                            <div className="language-grid">
                                {SOFTWARE_PLACEMENT_TRACKS.map((track) => (
                                    <Link
                                        key={track.id}
                                        to={track.route}
                                        className="language-card"
                                        style={{
                                            '--language-accent': track.accent,
                                            '--language-glow': track.glow,
                                        }}
                                    >
                                        <div className="department-card-head">
                                            <span className="domain-code">{track.code}</span>
                                            <span className="domain-status">{track.status}</span>
                                        </div>

                                        <div className="department-card-body">
                                            <h3>{track.title}</h3>
                                            <p>{track.summary}</p>
                                        </div>

                                        <div className="domain-track-list">
                                            {track.highlights.map((highlight) => (
                                                <span key={highlight}>{highlight}</span>
                                            ))}
                                        </div>

                                        <span className="view-more">ENTER TRACK &rarr;</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="subject-tabs">
                                {LIVE_SUBJECTS.map((subject) => (
                                    <div key={subject.id} className="subject-card">
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
                        )}
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
                        <p>{domain.title.toUpperCase()} DOMAIN ACCESS LAYER</p>
                    </div>
                    <div className="footer-links">
                        <h4>Pathways</h4>
                        <ul>
                            {DOMAIN_CATALOG.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/domains/${item.id}`}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Connect</h4>
                        <div className="social-icons">
                            <a href={`#${sectionId}`}>{isEngineering ? 'DEPTS' : isScience ? 'STD' : isComputerLanguage ? 'LANG' : 'LIVE'}</a>
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

export default DomainPage
