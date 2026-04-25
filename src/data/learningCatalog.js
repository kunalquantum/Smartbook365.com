import chemistryImg from '../assets/subject-chemistry.png'
import physicsImg from '../assets/subject-physics.png'
import mathsImg from '../assets/subject-maths.png'

export const LIVE_SUBJECTS = [
    {
        id: 'chemistry',
        title: 'Chemistry',
        code: 'CH-01',
        description: 'QUANTUM STRUCTURES AND BONDS.',
        image: chemistryImg,
        route: '/chemistry',
    },
    {
        id: 'physics',
        title: 'Physics',
        code: 'PH-02',
        description: 'GRAVITY AND ORBITAL SYSTEMS.',
        image: physicsImg,
        route: '/physics',
    },
    {
        id: 'maths',
        title: 'Mathematics',
        code: 'MA-03',
        description: 'GEOMETRIC MANIFOLD DYNAMICS.',
        image: mathsImg,
        route: '/maths',
    },
]

export const DOMAIN_CATALOG = [
    {
        id: 'engineering',
        title: 'Engineering',
        code: 'Domain 01',
        summary: 'Applied systems, machine logic, structural thinking, and quantitative control.',
        helper: 'Engineering now opens through department pathways, so learners can enter a discipline first and then move semester by semester.',
        sectionTitle: 'Engineering Departments',
        sectionCopy: 'Choose a department first, then move into the semester structure for that branch.',
        status: 'Department Layer Live',
        highlights: ['Applied mechanics', 'Quantitative design', 'System control'],
        accent: '#7dd3fc',
        glow: 'rgba(125, 211, 252, 0.18)',
    },
    {
        id: 'commerce',
        title: 'Commerce',
        code: 'Domain 02',
        summary: 'Decision frameworks, financial structure, strategic trade flows, and operational thinking.',
        helper: 'Commerce is next in the Smartbook roadmap. For now, the current live modules show the same simulation depth the domain pages will inherit.',
        sectionTitle: 'Current Live Modules Across Smartbook',
        sectionCopy: 'These active modules demonstrate the interaction model while commerce subjects are being mapped.',
        status: 'Expansion Queue',
        highlights: ['Decision systems', 'Flow analysis', 'Operational logic'],
        accent: '#f59e0b',
        glow: 'rgba(245, 158, 11, 0.18)',
    },
    {
        id: 'science',
        title: 'Science',
        code: 'Domain 03',
        summary: 'Atomic intuition, force systems, and mathematical structures rendered through high-fidelity simulation.',
        helper: 'Science now splits into 11th and 12th views so learners can enter by academic year before moving into the active subject modules.',
        sectionTitle: 'Science Standards',
        sectionCopy: 'For now, both 11th and 12th expose the same live Smartbook subject cards until the year-wise separation is filled in.',
        status: 'Live Now',
        highlights: ['Atomic models', 'Field dynamics', 'Pure mathematics'],
        accent: '#22d3ee',
        glow: 'rgba(34, 211, 238, 0.18)',
    },
    {
        id: 'computer-language',
        title: 'Computer Language',
        code: 'Domain 04',
        summary: 'Logic, abstraction, symbolic systems, and technical pattern recognition for digital thinking.',
        helper: 'Computer language now opens into language-specific cards so the domain can branch by programming stack before full course pages are added.',
        sectionTitle: 'Programming Language Tracks',
        sectionCopy: 'Choose a language lane below. These cards act as the current entry points while deeper course routes are staged.',
        status: 'Track Layer Live',
        highlights: ['Symbolic logic', 'Pattern structure', 'Computational thinking'],
        accent: '#a78bfa',
        glow: 'rgba(167, 139, 250, 0.18)',
    },
]

export function getDomainById(domainId) {
    return DOMAIN_CATALOG.find((domain) => domain.id === domainId) || null
}

export const ENGINEERING_DEPARTMENTS = [
    {
        id: 'computer-engineering',
        title: 'Computer Engineering',
        code: 'Dept 01',
        summary: 'Software systems, circuit logic, programming foundations, and digital architecture.',
        helper: 'Move through the core computing path one semester at a time, from fundamentals to advanced system design.',
        status: 'Core Track',
        accent: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.18)',
        highlights: ['Programming logic', 'Digital systems', 'Architecture flow'],
    },
    {
        id: 'civil-engineering',
        title: 'Civil Engineering',
        code: 'Dept 02',
        summary: 'Structures, materials, environmental systems, and large-scale built environments.',
        helper: 'Track the civil route semester by semester, from base mechanics to structural and environmental systems.',
        status: 'Infrastructure Track',
        accent: '#2dd4bf',
        glow: 'rgba(45, 212, 191, 0.18)',
        highlights: ['Structures', 'Survey systems', 'Environmental design'],
    },
    {
        id: 'mechanical-engineering',
        title: 'Mechanical Engineering',
        code: 'Dept 03',
        summary: 'Machine systems, motion, thermal processes, fabrication, and applied mechanics.',
        helper: 'Follow the mechanical sequence from engineering basics to machine design and production systems.',
        status: 'Machine Track',
        accent: '#60a5fa',
        glow: 'rgba(96, 165, 250, 0.18)',
        highlights: ['Machine dynamics', 'Thermal systems', 'Production flow'],
    },
]

export const ENGINEERING_SEMESTERS = Array.from({ length: 8 }, (_, index) => ({
    id: `sem-${index + 1}`,
    number: index + 1,
    title: `SEM ${index + 1}`,
    code: `S0${index + 1}`,
    summary: `Semester ${index + 1} sequence for guided engineering progression.`,
}))

export function getEngineeringDepartmentById(departmentId) {
    return ENGINEERING_DEPARTMENTS.find((department) => department.id === departmentId) || null
}

export const SCIENCE_LEVELS = [
    {
        id: '11th',
        title: '11th Standard',
        code: 'Level 01',
        copy: 'Current live science modules available for 11th learners.',
        subjects: LIVE_SUBJECTS,
    },
    {
        id: '12th',
        title: '12th Standard',
        code: 'Level 02',
        copy: 'Current live science modules available for 12th learners.',
        subjects: LIVE_SUBJECTS,
    },
]

export const COMPUTER_LANGUAGE_TRACKS = [
    {
        id: 'python',
        title: 'Python',
        code: 'Lang 01',
        summary: 'Readable logic, scripting workflows, data handling, and foundational automation patterns.',
        status: 'Track Ready',
        accent: '#60a5fa',
        glow: 'rgba(96, 165, 250, 0.18)',
        highlights: ['Scripting', 'Data flow', 'Automation'],
    },
    {
        id: 'java',
        title: 'Java',
        code: 'Lang 02',
        summary: 'Object-oriented structure, scalable application logic, and cross-platform system design.',
        status: 'Track Ready',
        accent: '#f97316',
        glow: 'rgba(249, 115, 22, 0.18)',
        highlights: ['OOP systems', 'Application logic', 'Platform runtime'],
    },
    {
        id: 'sql',
        title: 'SQL',
        code: 'Lang 03',
        summary: 'Data querying, relational thinking, schema design, and structured information retrieval.',
        status: 'Track Ready',
        accent: '#22d3ee',
        glow: 'rgba(34, 211, 238, 0.18)',
        highlights: ['Queries', 'Relational models', 'Data retrieval'],
    },
    {
        id: 'c',
        title: 'C',
        code: 'Lang 04',
        summary: 'Low-level memory awareness, procedural control, and systems-oriented programming foundations.',
        status: 'Track Ready',
        accent: '#a3a3a3',
        glow: 'rgba(163, 163, 163, 0.18)',
        highlights: ['Memory logic', 'Procedural flow', 'System basics'],
    },
    {
        id: 'cpp',
        title: 'C++',
        code: 'Lang 05',
        summary: 'Performance-focused programming, object models, and systems-level abstraction in depth.',
        status: 'Track Ready',
        accent: '#818cf8',
        glow: 'rgba(129, 140, 248, 0.18)',
        highlights: ['Performance', 'Object models', 'Abstraction'],
    },
]

export const LANGUAGE_LEVELS = [
    {
        id: 'beginner',
        title: 'Beginner',
        code: 'Level 01',
        summary: 'Start with syntax, foundations, and simple programming patterns for first-time learners.',
        focus: 'Foundation Layer',
    },
    {
        id: 'medium',
        title: 'Medium',
        code: 'Level 02',
        summary: 'Move into practical problem solving, structured programs, and stronger logic-building exercises.',
        focus: 'Applied Layer',
    },
    {
        id: 'advanced',
        title: 'Advanced',
        code: 'Level 03',
        summary: 'Push into deeper abstractions, optimization thinking, and production-style programming workflows.',
        focus: 'Advanced Layer',
    },
]

export function getComputerLanguageTrackById(trackId) {
    return COMPUTER_LANGUAGE_TRACKS.find((track) => track.id === trackId) || null
}
