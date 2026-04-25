import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
    getEngineeringDepartmentById, 
    ENGINEERING_SUBJECTS,
    ENGINEERING_SEMESTERS 
} from '../data/learningCatalog';
import '../styles/landing.css';

const EngineeringSemesterPage = () => {
    const { departmentId, semesterId } = useParams();
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
