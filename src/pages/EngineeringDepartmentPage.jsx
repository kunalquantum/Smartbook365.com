import React, { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import Chatbot from '../components/Chatbot'
import logoImg from '../assets/logo-removebg-preview.png'
import {
    DOMAIN_CATALOG,
    ENGINEERING_DEPARTMENTS,
    ENGINEERING_SEMESTERS,
    getEngineeringDepartmentById,
} from '../data/learningCatalog'
import '../styles/landing.css'
import { useAuth } from '../context/AuthContext'

function getSemesterPhase(semesterNumber) {
    if (semesterNumber <= 2) return 'Foundation Phase'
    if (semesterNumber <= 4) return 'Core Phase'
    if (semesterNumber <= 6) return 'Applied Phase'
    return 'Advanced Phase'
}

const EngineeringDepartmentPage = () => {
    const { user, logout } = useAuth()
    const { departmentId } = useParams()
    const [scrolled, setScrolled] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const department = useMemo(() => getEngineeringDepartmentById(departmentId), [departmentId])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24)
        }

        handleScroll()
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!department) {
        return <Navigate to="/domains/engineering" replace />
    }

    return (
        <div
            className="landing-page domain-page department-page"
            style={{
                '--domain-accent': department.accent,
                '--domain-glow': department.glow,
                '--department-accent': department.accent,
                '--department-glow': department.glow,
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
                        <li><Link to="/domains/engineering">Departments</Link></li>
                        <li><a href="#semester-grid">Semesters</a></li>
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
                            <span className="domain-code">{department.code}</span>
                            <h1>{department.title}</h1>
                            <p>{department.summary}</p>

                            <div className="hero-btns">
                                <a href="#semester-grid" className="btn btn-primary">VIEW SEMESTERS</a>
                                <Link to="/domains/engineering" className="btn btn-outline">BACK TO ENGINEERING</Link>
                            </div>
                        </div>

                        <div className="domain-hero-panel">
                            <span className="domain-status">{department.status}</span>
                            <h2>Department Brief</h2>
                            <p>{department.helper}</p>

                            <div className="domain-track-list">
                                {department.highlights.map((highlight) => (
                                    <span key={highlight}>{highlight}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="semester-grid" className="domain-subject-section">
                    <div className="container">
                        <div className="section-header">
                            <h2>{department.title} Semesters</h2>
                            <p>MOVE THROUGH THE DEPARTMENT STACK FROM SEM 1 TO SEM 8.</p>
                        </div>

                        <div className="semester-grid">
                            {ENGINEERING_SEMESTERS.map((semester) => (
                                <Link 
                                    key={semester.id} 
                                    to={`/domains/engineering/${departmentId}/sem-${semester.number}`} 
                                    className="semester-card"
                                >
                                    <div className="semester-card-head">
                                        <span className="domain-code">{semester.code}</span>
                                        <span className="semester-phase">{getSemesterPhase(semester.number)}</span>
                                    </div>

                                    <div className="semester-card-body">
                                        <h3>{semester.title}</h3>
                                        <p>{department.title} pathway for {semester.title}, built to stage the sequence from fundamentals into advanced work.</p>
                                    </div>

                                    <span className="view-more">VIEW SEMESTER CURRICULUM &rarr;</span>
                                </Link>
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
                        <p>{department.title.toUpperCase()} SEMESTER GATEWAY</p>
                    </div>
                    <div className="footer-links">
                        <h4>Departments</h4>
                        <ul>
                            {ENGINEERING_DEPARTMENTS.map((item) => (
                                <li key={item.id}>
                                    <Link to={`/domains/engineering/${item.id}`}>{item.title}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Connect</h4>
                        <div className="social-icons">
                            <a href="#semester-grid">SEM</a>
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

export default EngineeringDepartmentPage
