import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    getEngineeringDepartmentById, 
    ENGINEERING_SUBJECTS,
    ENGINEERING_SEMESTERS 
} from '../data/learningCatalog';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/logo-removebg-preview.png';
import '../styles/landing.css';

const EngineeringSemesterPage = () => {
    const { departmentId, semesterId } = useParams();
    const [scrolled, setScrolled] = React.useState(false);
    const { user, logout } = useAuth();
    
    React.useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const deptId = departmentId;
    const semNum = parseInt(semesterId.replace('sem-', ''));
    
    const department = getEngineeringDepartmentById(deptId);
    const semester = ENGINEERING_SEMESTERS.find(s => s.number === semNum);
    const subjects = ENGINEERING_SUBJECTS[deptId]?.[semNum] || [];

    const getSemesterPhase = (num) => {
        if (num <= 2) return 'Foundational Phase'
        if (num <= 4) return 'Core Specialization'
        if (num <= 6) return 'Advanced Engineering'
        return 'Professional Capstone'
    }

    if (!department || !semester) return <div>Not Found</div>;

    return (
        <div className="landing-page domain-page">
            <header id="main-header" className={scrolled ? 'scrolled' : ''}>
                <nav className="container">
                    <Link to="/" className="logo">
                        <img src={logoImg} alt="Smartbook 365 Logo" className="logo-img" />
                        <span className="logo-text">Smartbook</span>
                    </Link>

                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to={`/domains/engineering/${deptId}`}>Semesters</Link></li>
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
            <div className="domain-page-shell">
                <section className="domain-hero-section" style={{ minHeight: '40vh', alignItems: 'center' }}>
                    <div className="container">
                        <div className="domain-hero-copy">
                            <div className="domain-code" style={{ marginBottom: '1rem' }}>{semester.code}</div>
                            <h1 style={{ fontSize: '3.5rem' }}>{semester.title}</h1>
                            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>
                                {department.title} — {getSemesterPhase(semNum)}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="domain-subject-section" style={{ paddingTop: '4rem' }}>
                    <div className="container">
                        <div className="section-header">
                            <h2>Curriculum Modules</h2>
                            <p>CORE SUBJECTS & INTERACTIVE SIMULATORS</p>
                        </div>

                        <div className="domain-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
                            {subjects.map((subject) => (
                                <Link key={subject.id} to={subject.route} className="domain-card">
                                    <div className="domain-card-head">
                                        <span className="domain-code">{subject.code}</span>
                                        <span className="domain-status">{subject.status}</span>
                                    </div>
                                    <div className="domain-card-body" style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '1rem' }}>{subject.title}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.8' }}>{subject.summary}</p>
                                    </div>
                                    <div className="view-more" style={{ marginTop: '2rem', color: 'var(--primary)', fontFamily: 'Michroma', fontSize: '0.7rem' }}>
                                        ENTER MODULE &rarr;
                                    </div>
                                </Link>
                            ))}
                            {subjects.length === 0 && (
                                <div style={{ 
                                    gridColumn: '1/-1', 
                                    padding: '4rem', 
                                    textAlign: 'center', 
                                    background: 'rgba(255,255,255,0.02)', 
                                    border: '1px dashed rgba(255,255,255,0.1)',
                                    borderRadius: '8px'
                                }}>
                                    <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Michroma', fontSize: '0.8rem' }}>
                                        CURRICULUM STAGING IN PROGRESS
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                            <Link to={`/domains/engineering/${deptId}`} className="btn btn-outline">
                                &larr; BACK TO SEMESTERS
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default EngineeringSemesterPage;
