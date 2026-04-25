import { DEMO_CONFIG } from '../config/demoConfig'
import { ADMIN_PHONE, PRICING as STATIC_PRICING } from '../data/pricing'
import {
    loadChatAnalytics,
    loadLongTermProfile,
    loadPersistedSessions,
    mergeAnalyticsPatch,
    persistLongTermProfile,
    persistSessions,
} from './chatStorage'

export const DEFAULT_PERSONA_ID = 'student_support'

export const PERSONAS = {
    acemedic_guide: {
        id: 'acemedic_guide',
        label: 'Acemedic Guide',
        role: 'Concept Coach',
        headerTitle: 'Acemedic Guide',
        headerSubtitle: 'Break concepts into clear steps',
        systemLabel: 'ACADEMIC MODE',
        greetingA: 'I am your Acemedic Guide. Ask for a concept, chapter, or revision target and I will turn it into a structured learning path.',
        greetingB: 'Acemedic Guide is online. Give me a topic or exam goal and I will teach it in a clean, step-by-step flow.',
        prompt: 'Try: "Explain quantum numbers", "Build me a revision plan", or "Help me with Chapter 4 chemistry."',
        helper: 'Best for concept teaching, study plans, revision paths, and exam prep.',
        placeholder: 'Ask for an explanation, chapter plan, or study workflow...',
        theme: {
            accent: '#38bdf8',
            accentStrong: '#e0f2fe',
            accentGlow: 'rgba(56, 189, 248, 0.22)',
            accentGlowStrong: 'rgba(56, 189, 248, 0.42)',
            surface: 'rgba(5, 15, 29, 0.96)',
            surfaceSoft: 'rgba(11, 28, 46, 0.9)',
            userInk: '#04121f',
            muted: 'rgba(224, 242, 254, 0.8)',
            shadow: '0 0 34px rgba(56, 189, 248, 0.24)',
        },
    },
    salesman: {
        id: 'salesman',
        label: 'Salesman',
        role: 'Conversion Expert',
        headerTitle: 'Salesman',
        headerSubtitle: 'Match users to the right plan',
        systemLabel: 'SALES MODE',
        greetingA: 'I am your Smartbook Salesman. I can compare plans, point to the best demo route, and recommend the most sensible unlock.',
        greetingB: 'Salesman mode is active. Tell me your subject, budget, or access goal and I will map the best path fast.',
        prompt: 'Try: "Compare modules vs chapters", "What should I buy for physics?", or "Show me the cheapest way to start."',
        helper: 'Best for demo guidance, pricing comparisons, chapter vs module advice, and conversion flows.',
        placeholder: 'Ask about pricing, demos, upgrade paths, or value...',
        theme: {
            accent: '#f59e0b',
            accentStrong: '#fef3c7',
            accentGlow: 'rgba(245, 158, 11, 0.22)',
            accentGlowStrong: 'rgba(245, 158, 11, 0.42)',
            surface: 'rgba(30, 15, 2, 0.96)',
            surfaceSoft: 'rgba(57, 33, 4, 0.9)',
            userInk: '#1f1302',
            muted: 'rgba(254, 243, 199, 0.82)',
            shadow: '0 0 34px rgba(245, 158, 11, 0.24)',
        },
    },
    student_support: {
        id: 'student_support',
        label: 'Student Support',
        role: 'Support Desk',
        headerTitle: 'Student Support',
        headerSubtitle: 'Diagnose issues and next steps',
        systemLabel: 'SUPPORT MODE',
        greetingA: 'I am Student Support. I can help with login issues, locked chapters, route confusion, and next-step troubleshooting.',
        greetingB: 'Student Support is ready. Tell me what feels blocked and I will narrow it down into a practical next step.',
        prompt: 'Try: "I cannot log in", "Why is this chapter locked?", or "Guide me to the right page."',
        helper: 'Best for troubleshooting, access guidance, workflow recovery, and practical next steps.',
        placeholder: 'Describe the issue, blocked step, or support question...',
        theme: {
            accent: '#22c55e',
            accentStrong: '#dcfce7',
            accentGlow: 'rgba(34, 197, 94, 0.22)',
            accentGlowStrong: 'rgba(34, 197, 94, 0.42)',
            surface: 'rgba(3, 24, 13, 0.96)',
            surfaceSoft: 'rgba(10, 46, 25, 0.9)',
            userInk: '#06170d',
            muted: 'rgba(220, 252, 231, 0.82)',
            shadow: '0 0 34px rgba(34, 197, 94, 0.24)',
        },
    },
}

const SUBJECTS = [
    { id: 'chemistry', label: 'Chemistry', demoRoute: '/demo/chemistry', fullRoute: '/chemistry' },
    { id: 'physics', label: 'Physics', demoRoute: '/demo/physics', fullRoute: '/physics' },
    { id: 'maths', label: 'Mathematics', demoRoute: '/demo/maths', fullRoute: '/maths' },
]

const DEFAULT_QUICK_REPLIES = {
    guest: [
        { label: 'Explain a concept', type: 'send_text', text: 'Explain a concept to me' },
        { label: 'Plan my study', type: 'start_workflow', workflowId: 'study_planner' },
        { label: 'Compare pricing', type: 'start_workflow', workflowId: 'pricing_selector' },
        { label: 'Guide demo path', type: 'send_text', text: 'Show me the best demo path' },
        { label: 'Fix an issue', type: 'start_workflow', workflowId: 'support_triage' },
        { label: 'Set reminder', type: 'start_workflow', workflowId: 'reminder_setup' },
    ],
    user: [
        { label: 'Continue learning', type: 'send_text', text: 'Help me continue learning from where I am' },
        { label: 'Explain this chapter', type: 'send_text', text: 'Explain this chapter to me' },
        { label: 'Study workflow', type: 'start_workflow', workflowId: 'study_planner' },
        { label: 'Unlock access', type: 'start_workflow', workflowId: 'pricing_selector' },
        { label: 'Support triage', type: 'start_workflow', workflowId: 'support_triage' },
        { label: 'Set reminder', type: 'start_workflow', workflowId: 'reminder_setup' },
    ],
    admin: [
        { label: 'Analytics snapshot', type: 'toggle_analytics' },
        { label: 'Pricing workflow', type: 'start_workflow', workflowId: 'pricing_selector' },
        { label: 'Support triage', type: 'start_workflow', workflowId: 'support_triage' },
        { label: 'Study planner', type: 'start_workflow', workflowId: 'study_planner' },
        { label: 'Route guidance', type: 'send_text', text: 'Show me route guidance for this page' },
    ],
}

const INTENTS = [
    {
        id: 'study_plan',
        personaId: 'acemedic_guide',
        keywords: ['study plan', 'revision plan', 'plan my study', 'study workflow', 'schedule my study', 'exam prep'],
        workflowId: 'study_planner',
        priority: 9,
    },
    {
        id: 'concept_explain',
        personaId: 'acemedic_guide',
        keywords: ['explain', 'teach', 'understand', 'what is', 'how does', 'walk me through', 'help me learn'],
        priority: 8,
    },
    {
        id: 'pricing_compare',
        personaId: 'salesman',
        keywords: ['pricing', 'price', 'cost', 'plan', 'compare', 'worth', 'budget', 'module price', 'chapter price'],
        workflowId: 'pricing_selector',
        priority: 8,
    },
    {
        id: 'demo_path',
        personaId: 'salesman',
        keywords: ['demo', 'free access', 'preview', 'try demo', 'sample chapter', 'free mode'],
        priority: 7,
    },
    {
        id: 'unlock_access',
        personaId: 'salesman',
        keywords: ['unlock', 'buy', 'purchase', 'subscribe', 'upgrade', 'get access', 'unlock module'],
        workflowId: 'pricing_selector',
        priority: 8,
    },
    {
        id: 'login_issue',
        personaId: 'student_support',
        keywords: ['login', 'log in', 'sign in', 'password', 'username', 'cannot log', 'cant log', 'failed login'],
        workflowId: 'support_triage',
        priority: 9,
    },
    {
        id: 'locked_issue',
        personaId: 'student_support',
        keywords: ['locked', 'restricted', 'access denied', 'chapter locked', 'cannot open', 'cant open'],
        workflowId: 'support_triage',
        priority: 9,
    },
    {
        id: 'navigation_help',
        personaId: 'student_support',
        keywords: ['where do i go', 'navigate', 'where is', 'which page', 'how do i get', 'route guidance'],
        priority: 7,
    },
    {
        id: 'support_issue',
        personaId: 'student_support',
        keywords: ['help', 'issue', 'problem', 'bug', 'error', 'not working', 'stuck', 'blocked'],
        workflowId: 'support_triage',
        priority: 8,
    },
    {
        id: 'set_reminder',
        personaId: 'student_support',
        keywords: ['remind me', 'set reminder', 'schedule reminder', 'later today', 'tomorrow remind', 'next week remind'],
        workflowId: 'reminder_setup',
        priority: 7,
    },
    {
        id: 'session_history',
        personaId: 'student_support',
        keywords: ['history', 'previous session', 'what did we talk', 'memory', 'remember'],
        priority: 6,
    },
    {
        id: 'admin_help',
        personaId: 'student_support',
        keywords: ['admin', 'pricing dashboard', 'user access', 'analytics'],
        priority: 6,
        roleMode: 'admin',
    },
    {
        id: 'greeting',
        personaId: 'student_support',
        keywords: ['hi', 'hello', 'hey', 'yo', 'good morning', 'good evening'],
        priority: 4,
    },
]

const WORKFLOWS = {
    study_planner: {
        id: 'study_planner',
        title: 'Study Planner',
        personaId: 'acemedic_guide',
        steps: [
            {
                id: 'subject',
                label: 'Choose the subject',
                type: 'choice',
                options: SUBJECTS.map((subject) => ({ label: subject.label, value: subject.id })),
                validate: (value) => SUBJECTS.some((subject) => subject.id === value),
            },
            {
                id: 'goal',
                label: 'What do you need most?',
                type: 'choice',
                options: [
                    { label: 'Understand a concept', value: 'concept' },
                    { label: 'Revise a chapter', value: 'revision' },
                    { label: 'Prepare for an exam', value: 'exam' },
                ],
                validate: (value) => ['concept', 'revision', 'exam'].includes(value),
            },
            {
                id: 'chapter',
                label: 'Which chapter or topic?',
                type: 'text',
                placeholder: 'Example: Chapter 4 or Quantum numbers',
                optional: true,
                validate: (value) => !value || value.trim().length >= 2,
            },
            {
                id: 'time',
                label: 'How much time do you have today?',
                type: 'choice',
                options: [
                    { label: '15 min', value: '15' },
                    { label: '30 min', value: '30' },
                    { label: '60 min', value: '60' },
                    { label: '90+ min', value: '90' },
                ],
                validate: (value) => ['15', '30', '60', '90'].includes(String(value)),
            },
        ],
    },
    pricing_selector: {
        id: 'pricing_selector',
        title: 'Pricing Advisor',
        personaId: 'salesman',
        steps: [
            {
                id: 'subject',
                label: 'Which subject are you buying for?',
                type: 'choice',
                options: SUBJECTS.map((subject) => ({ label: subject.label, value: subject.id })),
                validate: (value) => SUBJECTS.some((subject) => subject.id === value),
            },
            {
                id: 'accessType',
                label: 'What kind of access do you want?',
                type: 'choice',
                options: [
                    { label: 'Full module', value: 'full' },
                    { label: 'A few chapters', value: 'chapters' },
                    { label: 'Demo first', value: 'demo' },
                ],
                validate: (value) => ['full', 'chapters', 'demo'].includes(value),
            },
            {
                id: 'budget',
                label: 'What budget do you want to stay under?',
                type: 'number',
                placeholder: 'Example: 1000',
                optional: true,
                validate: (value) => !value || Number(value) > 0,
            },
        ],
    },
    support_triage: {
        id: 'support_triage',
        title: 'Support Triage',
        personaId: 'student_support',
        steps: [
            {
                id: 'issueType',
                label: 'What kind of issue is this?',
                type: 'choice',
                options: [
                    { label: 'Login problem', value: 'login' },
                    { label: 'Locked chapter', value: 'locked' },
                    { label: 'Navigation confusion', value: 'navigation' },
                    { label: 'Pricing question', value: 'pricing' },
                ],
                validate: (value) => ['login', 'locked', 'navigation', 'pricing'].includes(value),
            },
            {
                id: 'subject',
                label: 'Which subject is affected?',
                type: 'choice',
                options: [
                    { label: 'Not subject-specific', value: 'general' },
                    ...SUBJECTS.map((subject) => ({ label: subject.label, value: subject.id })),
                ],
                validate: (value) => value === 'general' || SUBJECTS.some((subject) => subject.id === value),
            },
            {
                id: 'detail',
                label: 'Give one useful detail',
                type: 'text',
                placeholder: 'Example: Chapter 4 stays locked after login',
                validate: (value) => value?.trim().length >= 4,
            },
        ],
    },
    reminder_setup: {
        id: 'reminder_setup',
        title: 'Reminder Builder',
        personaId: 'student_support',
        steps: [
            {
                id: 'topic',
                label: 'What should I remind you about?',
                type: 'text',
                placeholder: 'Example: Revise chemistry chapter 4',
                validate: (value) => value?.trim().length >= 3,
            },
            {
                id: 'dueDate',
                label: 'When should I remind you?',
                type: 'text',
                placeholder: 'Example: tomorrow 6pm or 2026-05-01 18:00',
                validate: (value) => Boolean(parseNaturalDate(value)),
            },
        ],
    },
}

function createId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function deepClone(value) {
    return JSON.parse(JSON.stringify(value))
}

function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s/:-]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
}

function humanizePath(path) {
    if (!path || path === '/') return 'Home'

    return path
        .split('/')
        .filter(Boolean)
        .map((part) => part.replace(/-/g, ' '))
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' / ')
}

function detectSubjectFromPath(path = '') {
    if (path.includes('chemistry')) return 'chemistry'
    if (path.includes('physics')) return 'physics'
    if (path.includes('maths')) return 'maths'
    return null
}

function deriveRoleMode(runtimeContext) {
    if (runtimeContext.user?.role === 'admin') return 'admin'
    if (runtimeContext.user) return 'user'
    return 'guest'
}

function getExperimentBucket(id) {
    const last = id.slice(-1)
    const code = parseInt(last, 36)
    return Number.isNaN(code) || code % 2 === 0 ? 'A' : 'B'
}

function formatDateTime(isoString) {
    try {
        return new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: 'numeric',
            minute: '2-digit',
        }).format(new Date(isoString))
    } catch {
        return isoString
    }
}

function parseNaturalDate(text) {
    if (!text) return null

    const value = text.trim().toLowerCase()
    const now = new Date()
    const candidate = new Date(now)

    const timeMatch = value.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
    const applyTime = () => {
        if (!timeMatch) {
            candidate.setHours(9, 0, 0, 0)
            return
        }

        let hours = Number(timeMatch[1])
        const minutes = Number(timeMatch[2] || 0)
        const meridiem = timeMatch[3]

        if (meridiem === 'pm' && hours < 12) hours += 12
        if (meridiem === 'am' && hours === 12) hours = 0

        candidate.setHours(hours, minutes, 0, 0)
    }

    if (value.includes('tomorrow')) {
        candidate.setDate(candidate.getDate() + 1)
        applyTime()
        return candidate.toISOString()
    }

    if (value.includes('next week')) {
        candidate.setDate(candidate.getDate() + 7)
        applyTime()
        return candidate.toISOString()
    }

    const inDaysMatch = value.match(/in\s+(\d+)\s+day/)
    if (inDaysMatch) {
        candidate.setDate(candidate.getDate() + Number(inDaysMatch[1]))
        applyTime()
        return candidate.toISOString()
    }

    const isoDateMatch = value.match(/(\d{4})-(\d{2})-(\d{2})/)
    if (isoDateMatch) {
        const exact = new Date(`${isoDateMatch[1]}-${isoDateMatch[2]}-${isoDateMatch[3]}T09:00:00`)
        if (!Number.isNaN(exact.getTime())) {
            candidate.setTime(exact.getTime())
            applyTime()
            return candidate.toISOString()
        }
    }

    const slashDateMatch = value.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/)
    if (slashDateMatch) {
        const year = slashDateMatch[3] ? Number(slashDateMatch[3]) : now.getFullYear()
        const normalizedYear = year < 100 ? 2000 + year : year
        const exact = new Date(normalizedYear, Number(slashDateMatch[2]) - 1, Number(slashDateMatch[1]), 9, 0, 0, 0)
        if (!Number.isNaN(exact.getTime())) {
            candidate.setTime(exact.getTime())
            applyTime()
            return candidate.toISOString()
        }
    }

    const parsed = new Date(text)
    if (!Number.isNaN(parsed.getTime())) {
        if (!timeMatch) parsed.setHours(9, 0, 0, 0)
        return parsed.toISOString()
    }

    return null
}

function createMessage(sender, text, extras = {}) {
    return {
        id: createId(),
        sender,
        text,
        isAnimated: sender === 'bot',
        timestamp: new Date().toISOString(),
        ...extras,
    }
}

function createQuickReply(label, config = {}) {
    return {
        id: createId(),
        label,
        type: 'send_text',
        ...config,
    }
}

function buildIntroMessages(personaId, experimentBucket) {
    const persona = PERSONAS[personaId] || PERSONAS[DEFAULT_PERSONA_ID]
    const greeting = experimentBucket === 'A' ? persona.greetingA : persona.greetingB

    return [
        createMessage('system', `${persona.systemLabel} READY`, { isAnimated: false }),
        createMessage('bot', greeting),
        createMessage('bot', persona.prompt),
    ]
}

function buildDefaultQuickReplies(roleMode) {
    return (DEFAULT_QUICK_REPLIES[roleMode] || DEFAULT_QUICK_REPLIES.guest).map((quickReply) => ({
        ...quickReply,
        id: createId(),
    }))
}

function deriveSessionTitle(session) {
    const firstUserMessage = (session.messages || []).find((message) => message.sender === 'user')
    if (!firstUserMessage) return 'New Session'

    const words = firstUserMessage.text.split(/\s+/).slice(0, 5).join(' ')
    return words || 'New Session'
}

function normalizeRuntimeContext(runtimeContext = {}) {
    const pricing = runtimeContext.pricing || STATIC_PRICING
    const currentPath = runtimeContext.currentPath || '/'
    const currentSubject = detectSubjectFromPath(currentPath)

    return {
        ...runtimeContext,
        pricing,
        demoConfig: runtimeContext.demoConfig || DEMO_CONFIG,
        currentPath,
        currentSubject,
        roleMode: deriveRoleMode(runtimeContext),
        pageLabel: humanizePath(currentPath),
    }
}

function createEmptyMemory(runtimeContext, personaId) {
    return {
        shortTerm: {
            currentSubject: runtimeContext.currentSubject || null,
            currentChapter: null,
            lastIntent: null,
            lastConfidence: 0,
            lastEntities: {},
            recentIntents: [],
            recentTopics: [],
            unresolvedCount: 0,
        },
        preferences: {
            userName: runtimeContext.user?.name || runtimeContext.user?.username || null,
            preferredSubject: runtimeContext.currentSubject || null,
            preferredPersona: personaId,
            tone: 'adaptive',
        },
    }
}

export function createChatSession(runtimeContext = {}) {
    const context = normalizeRuntimeContext(runtimeContext)
    const personaId = context.roleMode === 'admin' ? 'student_support' : DEFAULT_PERSONA_ID
    const id = createId()
    const experimentBucket = getExperimentBucket(id)

    const session = {
        id,
        title: 'New Session',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        experimentBucket,
        activePersonaId: personaId,
        roleMode: context.roleMode,
        context: {
            currentPath: context.currentPath,
            pageLabel: context.pageLabel,
            currentSubject: context.currentSubject,
            isLoggedIn: Boolean(context.user),
        },
        memory: createEmptyMemory(context, personaId),
        workflows: {
            active: null,
            suspended: null,
            completed: [],
        },
        scheduledActions: [],
        analytics: {
            turns: 0,
            fallbacks: 0,
            clarifications: 0,
            workflowsStarted: 0,
            workflowsCompleted: 0,
            workflowDropoffs: 0,
            personaSwitches: 0,
            responseVariants: {},
            intentCounts: {},
        },
        ui: {
            quickReplies: buildDefaultQuickReplies(context.roleMode),
            suggestions: [],
            workflowNotice: null,
            workflowCard: null,
            lastAgentSummary: null,
            analyticsSummary: null,
        },
        messages: buildIntroMessages(personaId, experimentBucket),
    }

    session.title = deriveSessionTitle(session)
    mergeAnalyticsPatch({
        totalSessions: 1,
        bucketCounts: {
            [experimentBucket]: 1,
        },
    })

    return session
}

export function restoreChatSession(rawSession, runtimeContext = {}) {
    const context = normalizeRuntimeContext(runtimeContext)
    const session = deepClone(rawSession)

    session.experimentBucket = session.experimentBucket || getExperimentBucket(session.id || createId())
    session.activePersonaId = session.activePersonaId || DEFAULT_PERSONA_ID
    session.roleMode = context.roleMode
    session.context = {
        ...session.context,
        currentPath: context.currentPath,
        pageLabel: context.pageLabel,
        currentSubject: context.currentSubject || session.context?.currentSubject || null,
        isLoggedIn: Boolean(context.user),
    }
    session.memory = session.memory || createEmptyMemory(context, session.activePersonaId)
    session.memory.shortTerm = {
        currentSubject: context.currentSubject || session.memory.shortTerm?.currentSubject || null,
        currentChapter: session.memory.shortTerm?.currentChapter || null,
        lastIntent: session.memory.shortTerm?.lastIntent || null,
        lastConfidence: session.memory.shortTerm?.lastConfidence || 0,
        lastEntities: session.memory.shortTerm?.lastEntities || {},
        recentIntents: session.memory.shortTerm?.recentIntents || [],
        recentTopics: session.memory.shortTerm?.recentTopics || [],
        unresolvedCount: session.memory.shortTerm?.unresolvedCount || 0,
    }
    session.memory.preferences = {
        ...createEmptyMemory(context, session.activePersonaId).preferences,
        ...(session.memory.preferences || {}),
    }
    session.workflows = session.workflows || { active: null, suspended: null, completed: [] }
    session.scheduledActions = session.scheduledActions || []
    session.analytics = {
        turns: 0,
        fallbacks: 0,
        clarifications: 0,
        workflowsStarted: 0,
        workflowsCompleted: 0,
        workflowDropoffs: 0,
        personaSwitches: 0,
        responseVariants: {},
        intentCounts: {},
        ...(session.analytics || {}),
    }
    session.ui = {
        quickReplies: buildDefaultQuickReplies(context.roleMode),
        suggestions: [],
        workflowNotice: null,
        workflowCard: summarizeWorkflowProgress(session.workflows.active),
        lastAgentSummary: null,
        analyticsSummary: null,
        ...(session.ui || {}),
    }
    session.messages = session.messages || buildIntroMessages(session.activePersonaId, session.experimentBucket)
    session.title = session.title || deriveSessionTitle(session)
    return session
}

export function loadChatSessions(runtimeContext = {}) {
    const rawSessions = loadPersistedSessions()
    if (!rawSessions.length) return [createChatSession(runtimeContext)]

    return rawSessions
        .map((session) => restoreChatSession(session, runtimeContext))
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
}

export function persistChatSessions(sessions) {
    persistSessions(sessions)
}

function syncRuntimeContext(session, runtimeContext) {
    session.roleMode = runtimeContext.roleMode
    session.context.currentPath = runtimeContext.currentPath
    session.context.pageLabel = runtimeContext.pageLabel
    session.context.isLoggedIn = Boolean(runtimeContext.user)
    if (runtimeContext.currentSubject) {
        session.context.currentSubject = runtimeContext.currentSubject
        session.memory.shortTerm.currentSubject = runtimeContext.currentSubject
    }
    if (runtimeContext.user?.name || runtimeContext.user?.username) {
        session.memory.preferences.userName = runtimeContext.user.name || runtimeContext.user.username
    }
}

function subsequenceScore(source, query) {
    if (!query) return 0
    let sourceIndex = 0
    let score = 0

    for (const character of query) {
        const nextIndex = source.indexOf(character, sourceIndex)
        if (nextIndex === -1) return score
        score += nextIndex === sourceIndex ? 1.4 : 0.7
        sourceIndex = nextIndex + 1
    }

    return score
}

function buildKnowledgeBase(runtimeContext) {
    const pricing = runtimeContext.pricing || STATIC_PRICING

    const subjectEntries = SUBJECTS.flatMap((subject) => {
        const pricingInfo = pricing[subject.id]
        const demoChapterIds = runtimeContext.demoConfig?.[subject.id]?.chapterIds || []

        return [
            {
                id: `${subject.id}-pricing`,
                title: `${subject.label} pricing`,
                tags: ['pricing', 'plan', subject.id, subject.label.toLowerCase()],
                body: `${subject.label} can be unlocked as a full module for ₹${pricingInfo.fullPrice} or by chapter for ₹${pricingInfo.chapterPrice} each.`,
                faq: true,
                quickReplies: [
                    createQuickReply(`Compare ${subject.label}`, { type: 'start_workflow', workflowId: 'pricing_selector' }),
                    createQuickReply(`Open ${subject.label} demo`, { type: 'navigate', to: subject.demoRoute }),
                ],
            },
            {
                id: `${subject.id}-demo`,
                title: `${subject.label} demo`,
                tags: ['demo', 'free', subject.id, subject.label.toLowerCase()],
                body: `${subject.label} demo access is available through ${subject.demoRoute} and currently highlights chapter ${demoChapterIds.join(', ') || 'selected demo chapters'}.`,
                faq: true,
                quickReplies: [
                    createQuickReply(`Try ${subject.label} demo`, { type: 'navigate', to: subject.demoRoute }),
                    createQuickReply(`Explain ${subject.label}`, { type: 'send_text', text: `Explain ${subject.label}` }),
                ],
            },
        ]
    })

    const sharedEntries = [
        {
            id: 'access-restricted',
            title: 'Locked chapter support',
            tags: ['locked', 'restricted', 'access', 'chapter'],
            body: 'When a chapter is locked, the fastest checks are: are you on a demo route, are you logged in, and does your plan include that subject or chapter?',
            faq: true,
            quickReplies: [
                createQuickReply('Run support triage', { type: 'start_workflow', workflowId: 'support_triage' }),
                createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
            ],
        },
        {
            id: 'login-support',
            title: 'Login troubleshooting',
            tags: ['login', 'username', 'password', 'sign in', 'auth'],
            body: 'Login issues are usually narrowed down by checking the username, password, and whether the user expected demo access or signed-in access.',
            faq: true,
            quickReplies: [
                createQuickReply('Login help', { type: 'send_text', text: 'I cannot log in' }),
                createQuickReply('Support workflow', { type: 'start_workflow', workflowId: 'support_triage' }),
            ],
        },
        {
            id: 'study-planning',
            title: 'Study planning workflow',
            tags: ['study', 'revision', 'plan', 'workflow', 'exam'],
            body: 'The study planner works best when it captures subject, goal, chapter or topic, and available time before producing a practical plan.',
            faq: true,
            quickReplies: [
                createQuickReply('Start study planner', { type: 'start_workflow', workflowId: 'study_planner' }),
                createQuickReply('Set a reminder', { type: 'start_workflow', workflowId: 'reminder_setup' }),
            ],
        },
        {
            id: 'navigation-help',
            title: 'Route guidance',
            tags: ['route', 'navigation', 'page', 'where', 'path'],
            body: `You are currently on ${runtimeContext.pageLabel}. Route-specific guidance can point you to demo pages, subject modules, or the subscription page based on your goal.`,
            faq: false,
            quickReplies: [
                createQuickReply('Guide this page', { type: 'send_text', text: 'Guide me on this page' }),
                createQuickReply('Show demo routes', { type: 'navigate', to: '/demo' }),
            ],
        },
    ]

    if (runtimeContext.roleMode === 'admin') {
        sharedEntries.push({
            id: 'admin-analytics',
            title: 'Admin analytics',
            tags: ['admin', 'analytics', 'pricing dashboard', 'users'],
            body: 'Admins can use the chatbot analytics snapshot to review persona mix, intent mix, workflow usage, and fallback patterns.',
            faq: false,
            quickReplies: [
                createQuickReply('Toggle analytics', { type: 'toggle_analytics' }),
                createQuickReply('Pricing workflow', { type: 'start_workflow', workflowId: 'pricing_selector' }),
            ],
        })
    }

    return [...subjectEntries, ...sharedEntries]
}

function scoreIntent(intent, lowerInput, tokens, entities, runtimeContext) {
    let score = 0

    for (const keyword of intent.keywords) {
        if (lowerInput.includes(keyword)) {
            score += keyword.includes(' ') ? 3.2 : 2
        }
    }

    if (intent.roleMode && intent.roleMode === runtimeContext.roleMode) {
        score += 1.5
    }

    if (intent.id === 'concept_explain' && entities.subject) {
        score += 1.4
    }

    if (intent.id === 'study_plan' && (entities.goal || lowerInput.includes('plan'))) {
        score += 1.8
    }

    if (intent.id === 'locked_issue' && entities.issueType === 'locked') {
        score += 2.6
    }

    if (intent.id === 'login_issue' && entities.issueType === 'login') {
        score += 2.6
    }

    if (intent.id === 'pricing_compare' && entities.amount) {
        score += 1
    }

    if (runtimeContext.currentSubject && ['concept_explain', 'study_plan'].includes(intent.id)) {
        score += 0.6
    }

    if (tokens.includes('resume') && intent.id === 'session_history') {
        score += 1
    }

    return score
}

function extractEntities(inputText, session, runtimeContext) {
    const text = inputText || ''
    const lower = text.toLowerCase()

    const subjectMatch = SUBJECTS.find((subject) => {
        const aliases = [subject.id, subject.label.toLowerCase(), subject.label.toLowerCase().replace('mathematics', 'maths'), 'math']
        return aliases.some((alias) => lower.includes(alias))
    })

    const chapterMatch = lower.match(/(?:chapter|ch)\s*(\d{1,2})/)
    const amountMatch = lower.match(/(?:₹|rs\.?|rupees?)\s*(\d+(?:\.\d+)?)/) || lower.match(/\b(\d{3,5})\b/)
    const issueType = lower.includes('login') || lower.includes('password')
        ? 'login'
        : lower.includes('locked') || lower.includes('restricted')
            ? 'locked'
            : lower.includes('price') || lower.includes('pricing')
                ? 'pricing'
                : lower.includes('where') || lower.includes('route') || lower.includes('navigate')
                    ? 'navigation'
                    : null

    const goal = lower.includes('exam')
        ? 'exam'
        : lower.includes('revise') || lower.includes('revision')
            ? 'revision'
            : lower.includes('understand') || lower.includes('concept') || lower.includes('explain')
                ? 'concept'
                : null

    const accessType = lower.includes('full module') || lower.includes('full access')
        ? 'full'
        : lower.includes('chapter') || lower.includes('few chapters')
            ? 'chapters'
            : lower.includes('demo')
                ? 'demo'
                : null

    const nameMatch = lower.match(/(?:my name is|i am|i'm)\s+([a-z][a-z\s]+)/)
    const date = parseNaturalDate(text)

    return {
        subject: subjectMatch?.id || session.memory.shortTerm.currentSubject || runtimeContext.currentSubject || null,
        subjectLabel: subjectMatch?.label || SUBJECTS.find((subject) => subject.id === session.memory.shortTerm.currentSubject)?.label || null,
        chapterNumber: chapterMatch ? Number(chapterMatch[1]) : session.memory.shortTerm.currentChapter || null,
        amount: amountMatch ? Number(amountMatch[1]) : null,
        date,
        issueType,
        goal,
        accessType,
        name: nameMatch ? nameMatch[1].trim().replace(/\b\w/g, (character) => character.toUpperCase()) : null,
        topic: text.length > 3 ? text : null,
    }
}

function detectIntents(inputText, entities, runtimeContext) {
    const lowerInput = (inputText || '').toLowerCase()
    const tokens = tokenize(lowerInput)

    const scored = INTENTS
        .map((intent) => ({
            ...intent,
            score: scoreIntent(intent, lowerInput, tokens, entities, runtimeContext),
        }))
        .filter((intent) => intent.score > 0)
        .sort((left, right) => right.score - left.score)

    const top = scored[0] || {
        id: 'navigation_help',
        personaId: DEFAULT_PERSONA_ID,
        score: 1,
        workflowId: null,
    }

    const second = scored[1]
    const confidence = Math.min(0.98, top.score / 10 + (second ? Math.max(0, (top.score - second.score) / 20) : 0.1))

    return {
        primary: top.id,
        primaryPersonaId: top.personaId,
        confidence,
        scores: scored.slice(0, 4),
        secondary: scored.slice(1, 3).map((intent) => intent.id),
        multiIntent: second && second.score >= top.score * 0.75 ? [top.id, second.id] : [top.id],
        workflowId: top.workflowId || null,
    }
}

function searchKnowledge(inputText, entities, runtimeContext) {
    const knowledgeBase = buildKnowledgeBase(runtimeContext)
    const tokens = tokenize(inputText || '')
    const lowerInput = (inputText || '').toLowerCase()

    return knowledgeBase
        .map((entry) => {
            let score = 0

            for (const tag of entry.tags) {
                if (lowerInput.includes(tag)) {
                    score += tag.includes(' ') ? 2.5 : 1.2
                }
            }

            if (entities.subject && entry.tags.includes(entities.subject)) {
                score += 1.4
            }

            const fuzzy = subsequenceScore(`${entry.title} ${entry.body}`.toLowerCase(), lowerInput.replace(/\s+/g, ''))
            score += fuzzy * 0.08

            for (const token of tokens) {
                if (entry.body.toLowerCase().includes(token)) score += 0.3
            }

            return {
                ...entry,
                score,
            }
        })
        .filter((entry) => entry.score > 0.6)
        .sort((left, right) => right.score - left.score)
        .slice(0, 4)
}

function getWorkflowStepDefinition(workflow) {
    if (!workflow) return null
    const definition = WORKFLOWS[workflow.id]
    return definition?.steps[workflow.stepIndex] || null
}

function buildWorkflowQuickReplies(workflow) {
    const step = getWorkflowStepDefinition(workflow)
    if (!step || step.type !== 'choice') return []

    return step.options.map((option) => createQuickReply(option.label, {
        type: 'workflow_choice',
        workflowId: workflow.id,
        stepId: step.id,
        value: option.value,
    }))
}

function startWorkflow(session, workflowId, seedData = {}, sourceIntent = null) {
    const definition = WORKFLOWS[workflowId]
    if (!definition) return { session, message: null }

    const workflow = {
        id: workflowId,
        sourceIntent,
        status: 'in_progress',
        startedAt: new Date().toISOString(),
        stepIndex: 0,
        data: {
            ...seedData,
        },
    }

    const firstIncompleteStep = definition.steps.findIndex((step) => {
        const value = workflow.data[step.id]
        if (value === undefined || value === null || value === '') return true
        return !step.validate(value)
    })

    workflow.stepIndex = firstIncompleteStep === -1 ? definition.steps.length - 1 : firstIncompleteStep
    session.workflows.active = workflow
    session.ui.workflowNotice = `${definition.title} in progress`
    session.ui.workflowCard = summarizeWorkflowProgress(workflow)
    session.ui.quickReplies = buildWorkflowQuickReplies(workflow)
    session.analytics.workflowsStarted += 1

    const step = getWorkflowStepDefinition(workflow)
    const intro = step
        ? `Starting ${definition.title}. ${step.label}`
        : `Starting ${definition.title}.`

    return {
        session,
        message: intro,
    }
}

function completeWorkflow(session, workflow, runtimeContext) {
    const definition = WORKFLOWS[workflow.id]
    if (!definition) return { session, reply: 'Workflow completed.', quickReplies: buildDefaultQuickReplies(session.roleMode), effects: [] }

    session.workflows.completed = [
        {
            id: workflow.id,
            completedAt: new Date().toISOString(),
            data: workflow.data,
        },
        ...session.workflows.completed,
    ].slice(0, 12)

    session.workflows.active = null
    session.ui.workflowNotice = null
    session.ui.workflowCard = null
    session.analytics.workflowsCompleted += 1

    let reply = `${definition.title} completed.`
    let quickReplies = buildDefaultQuickReplies(session.roleMode)
    const effects = []

    if (workflow.id === 'study_planner') {
        const subject = SUBJECTS.find((item) => item.id === workflow.data.subject)
        const goalLabel = {
            concept: 'concept clarity',
            revision: 'revision speed',
            exam: 'exam prep',
        }[workflow.data.goal] || 'learning'
        const timeLabel = workflow.data.time ? `${workflow.data.time} minutes` : 'a flexible block'
        const chapterText = workflow.data.chapter ? ` around ${workflow.data.chapter}` : ''

        reply = `Here is a practical ${subject?.label || 'subject'} plan focused on ${goalLabel}${chapterText}. Spend the first third of ${timeLabel} understanding the core idea, the middle block practicing one or two examples, and the final block recapping mistakes and key takeaways.`
        quickReplies = [
            createQuickReply('Set a reminder for this', { type: 'start_workflow', workflowId: 'reminder_setup' }),
            createQuickReply('Plan another subject', { type: 'start_workflow', workflowId: 'study_planner' }),
            createQuickReply(`Open ${subject?.label || 'demo'} route`, { type: 'navigate', to: subject?.demoRoute || '/demo' }),
        ]
        session.memory.preferences.preferredSubject = workflow.data.subject
    }

    if (workflow.id === 'pricing_selector') {
        const pricingInfo = runtimeContext.pricing[workflow.data.subject]
        const subject = SUBJECTS.find((item) => item.id === workflow.data.subject)
        const budget = workflow.data.budget ? Number(workflow.data.budget) : null

        if (workflow.data.accessType === 'demo') {
            reply = `${subject?.label || 'This subject'} is a great fit for a demo-first path. Start with the demo route, validate the experience, and then decide whether you want full module access or just selected chapters.`
            quickReplies = [
                createQuickReply(`Open ${subject?.label || 'demo'}`, { type: 'navigate', to: subject?.demoRoute || '/demo' }),
                createQuickReply('Compare full module later', { type: 'send_text', text: `Compare full module pricing for ${subject?.label || 'this subject'}` }),
            ]
        } else if (workflow.data.accessType === 'chapters') {
            const affordableChapters = budget ? Math.max(1, Math.floor(budget / pricingInfo.chapterPrice)) : null
            reply = budget && affordableChapters
                ? `For ${subject?.label || 'this subject'}, a chapter-first path fits your budget. At ₹${pricingInfo.chapterPrice} per chapter, you can start with about ${affordableChapters} chapter${affordableChapters > 1 ? 's' : ''} and scale later.`
                : `For ${subject?.label || 'this subject'}, chapter access is the lighter entry point at ₹${pricingInfo.chapterPrice} per chapter. That is the best path when you only need a focused subset.`
            quickReplies = [
                createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
                createQuickReply('Set a purchase reminder', { type: 'start_workflow', workflowId: 'reminder_setup' }),
                createQuickReply('Compare full module', { type: 'send_text', text: `Should I buy the full ${subject?.label || 'subject'} module?` }),
            ]
        } else {
            reply = `For ${subject?.label || 'this subject'}, full module access is ₹${pricingInfo.fullPrice}. If you know you will cover most chapters, that usually beats buying multiple chapters one by one.`
            quickReplies = [
                createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
                createQuickReply('Try the demo first', { type: 'navigate', to: subject?.demoRoute || '/demo' }),
                createQuickReply('Set a purchase reminder', { type: 'start_workflow', workflowId: 'reminder_setup' }),
            ]
        }
    }

    if (workflow.id === 'support_triage') {
        const issueType = workflow.data.issueType
        const subject = SUBJECTS.find((item) => item.id === workflow.data.subject)
        const detail = workflow.data.detail

        if (issueType === 'login') {
            reply = `This looks like a login support case. First confirm the username and password you expected to use, then retry on the login page. If the problem continues, use the detail "${detail}" when escalating so support can reproduce it faster.`
            quickReplies = [
                createQuickReply('Open login page', { type: 'navigate', to: '/login' }),
                createQuickReply('Escalate to admin', { type: 'open_url', url: `https://wa.me/${ADMIN_PHONE}` }),
            ]
        } else if (issueType === 'locked') {
            reply = subject
                ? `${subject.label} looks like the affected subject. The quickest check is whether you are on a demo route or a full route, and whether your current access includes that chapter. If it stays locked, the safest next step is the subscription page or an admin check.`
                : 'This looks like a locked-content case. Check whether you are in demo mode or full access mode first, then verify whether your plan includes the chapter you expect.'
            quickReplies = [
                createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
                createQuickReply('Guide the right route', { type: 'send_text', text: 'Show me the right route for this subject' }),
            ]
        } else if (issueType === 'pricing') {
            reply = 'This is really a pricing and unlock decision. I can shift you directly into the pricing advisor so the next step is cleaner.'
            quickReplies = [
                createQuickReply('Start pricing advisor', { type: 'start_workflow', workflowId: 'pricing_selector' }),
                createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
            ]
        } else {
            reply = `This sounds like a navigation support case. The detail "${detail}" suggests the fastest fix is a route-by-route walkthrough of the page you are on.`
            quickReplies = [
                createQuickReply('Guide this page', { type: 'send_text', text: 'Guide me on this page' }),
                createQuickReply('Show demo routes', { type: 'navigate', to: '/demo' }),
            ]
        }
    }

    if (workflow.id === 'reminder_setup') {
        const dueAt = parseNaturalDate(workflow.data.dueDate)
        const reminder = {
            id: createId(),
            label: workflow.data.topic,
            dueAt,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            notifiedAt: null,
        }

        session.scheduledActions.unshift(reminder)
        reply = `Reminder created for ${formatDateTime(reminder.dueAt)}: ${reminder.label}. It will show up inside the chatbot as a scheduled action the next time it becomes due.`
        quickReplies = [
            createQuickReply('View reminders', { type: 'send_text', text: 'Show my reminders' }),
            createQuickReply('Plan a study session', { type: 'start_workflow', workflowId: 'study_planner' }),
        ]
    }

    return { session, reply, quickReplies, effects }
}

function validateWorkflowValue(step, value) {
    if ((value === undefined || value === null || value === '') && step.optional) return true
    return step.validate(value)
}

function advanceWorkflow(session, inputValue, payload = {}, runtimeContext) {
    const workflow = session.workflows.active
    if (!workflow) {
        return {
            session,
            handled: false,
        }
    }

    const definition = WORKFLOWS[workflow.id]
    const step = getWorkflowStepDefinition(workflow)
    if (!definition || !step) {
        session.workflows.active = null
        return { session, handled: false }
    }

    const candidateValue = payload[step.id] ?? payload.value ?? inputValue

    if (!validateWorkflowValue(step, candidateValue)) {
        return {
            session,
            handled: true,
            clarification: `I need a valid answer for "${step.label}".`,
            quickReplies: buildWorkflowQuickReplies(workflow),
        }
    }

    workflow.data[step.id] = candidateValue
    workflow.stepIndex += 1

    if (workflow.stepIndex >= definition.steps.length) {
        const completion = completeWorkflow(session, workflow, runtimeContext)
        return {
            session: completion.session,
            handled: true,
            reply: completion.reply,
            quickReplies: completion.quickReplies,
            effects: completion.effects,
        }
    }

    const nextStep = getWorkflowStepDefinition(workflow)
    session.ui.workflowCard = summarizeWorkflowProgress(workflow)
    session.ui.quickReplies = buildWorkflowQuickReplies(workflow)

    return {
        session,
        handled: true,
        reply: nextStep.label,
        quickReplies: session.ui.quickReplies,
    }
}

function summarizeWorkflowProgress(workflow) {
    if (!workflow) return null
    const definition = WORKFLOWS[workflow.id]
    return {
        id: workflow.id,
        title: definition?.title || workflow.id,
        stepIndex: workflow.stepIndex,
        totalSteps: definition?.steps.length || 0,
        step: getWorkflowStepDefinition(workflow),
        data: workflow.data,
    }
}

function shouldInterruptWorkflow(session, intent) {
    const workflow = session.workflows.active
    if (!workflow) return false
    if (!intent.workflowId) return false
    return intent.workflowId !== workflow.id && intent.confidence >= 0.72
}

function buildClarificationCandidate(intent, session) {
    const workflowResume = session.workflows.suspended
        ? [createQuickReply('Resume previous workflow', { type: 'resume_workflow' })]
        : []

    return {
        id: 'clarify',
        score: 9,
        text: 'I can take this in a few directions. Do you want concept help, pricing guidance, support triage, or a reminder workflow?',
        quickReplies: [
            createQuickReply('Concept help', { type: 'start_workflow', workflowId: 'study_planner' }),
            createQuickReply('Pricing guidance', { type: 'start_workflow', workflowId: 'pricing_selector' }),
            createQuickReply('Support triage', { type: 'start_workflow', workflowId: 'support_triage' }),
            createQuickReply('Set reminder', { type: 'start_workflow', workflowId: 'reminder_setup' }),
            ...workflowResume,
        ],
        variant: 'clarify',
    }
}

function buildWorkflowPromptCandidate(session) {
    const workflow = session.workflows.active
    const step = getWorkflowStepDefinition(workflow)
    const quickReplies = buildWorkflowQuickReplies(workflow)

    return {
        id: `workflow-${workflow.id}`,
        score: 9.4,
        text: step ? step.label : 'Continue the current workflow.',
        quickReplies: [
            ...quickReplies,
            createQuickReply('Cancel workflow', { type: 'cancel_workflow' }),
        ],
        variant: 'workflow_prompt',
    }
}

function buildKnowledgeCandidate(persona, knowledge, session, runtimeContext) {
    const top = knowledge[0]
    if (!top) return null

    const conciseText = `${top.body} Tell me if you want the next step for this page.`
    const guidedText = `${top.body} I can also turn this into a guided path with the next best click or workflow.`
    const prefersGuided = session.experimentBucket === 'B'

    return {
        id: `knowledge-${prefersGuided ? 'guided' : 'concise'}`,
        score: 6.4 + top.score + (prefersGuided ? 0.25 : 0),
        text: prefersGuided ? guidedText : conciseText,
        quickReplies: top.quickReplies?.length
            ? top.quickReplies
            : buildDefaultQuickReplies(runtimeContext.roleMode),
        variant: prefersGuided ? 'knowledge_guided' : 'knowledge_concise',
    }
}

function buildPersonaCandidates(persona, intent, entities, session, runtimeContext) {
    const subjectLabel = SUBJECTS.find((subject) => subject.id === entities.subject)?.label || runtimeContext.pageLabel
    const currentSubject = subjectLabel || 'this area'

    const conciseMap = {
        acemedic_guide: `Let us focus on ${currentSubject}. I can explain the concept directly or build a short study workflow around it.`,
        salesman: `For ${currentSubject}, I can compare demo, chapter, and full-module paths and keep the recommendation practical.`,
        student_support: `For ${currentSubject}, I can narrow this down into the next support step quickly.`,
    }

    const guidedMap = {
        acemedic_guide: `I can teach this in layers: concept first, then chapter focus, then a study plan if you want to act on it.`,
        salesman: `I can map this by value: demo first if you want proof, chapters if you want a lighter start, or full module if you need broader coverage.`,
        student_support: `I can diagnose this by route, login state, and access level so the next move is clearer.`,
    }

    const baseQuickReplies = buildDefaultQuickReplies(runtimeContext.roleMode)

    return [
        {
            id: `${persona.id}-concise`,
            score: 5.8 + intent.confidence + (session.experimentBucket === 'A' ? 0.25 : 0),
            text: conciseMap[persona.id],
            quickReplies: baseQuickReplies,
            variant: 'persona_concise',
        },
        {
            id: `${persona.id}-guided`,
            score: 5.6 + intent.confidence + (session.experimentBucket === 'B' ? 0.35 : 0),
            text: guidedMap[persona.id],
            quickReplies: baseQuickReplies,
            variant: 'persona_guided',
        },
    ]
}

function buildEscalationCandidate() {
    return {
        id: 'escalation',
        score: 8.7,
        text: `This looks like a case where a human follow-up may be faster. If you want, I can push you toward admin contact or the subscription path next.`,
        quickReplies: [
            createQuickReply('Open admin contact', { type: 'open_url', url: `https://wa.me/${ADMIN_PHONE}` }),
            createQuickReply('Open subscription page', { type: 'navigate', to: '/subscription' }),
            createQuickReply('Run support triage', { type: 'start_workflow', workflowId: 'support_triage' }),
        ],
        variant: 'escalation',
    }
}

function buildFallbackCandidate(session, runtimeContext) {
    const currentSubject = runtimeContext.currentSubject
    const subject = SUBJECTS.find((item) => item.id === currentSubject)

    return {
        id: 'fallback',
        score: 3,
        text: subject
            ? `I can help on the ${subject.label} route from a few angles: explain the concept, troubleshoot access, compare unlock options, or set a reminder.`
            : 'I can help with learning workflows, pricing guidance, support triage, reminders, or route help.',
        quickReplies: buildDefaultQuickReplies(runtimeContext.roleMode),
        variant: 'fallback',
    }
}

function buildSessionSummary(session) {
    return {
        id: session.id,
        title: session.title,
        updatedAt: session.updatedAt,
        personaId: session.activePersonaId,
        roleMode: session.roleMode,
        turns: session.analytics.turns,
    }
}

export function getAnalyticsDashboardData(sessions) {
    const globalAnalytics = loadChatAnalytics()
    const activeWorkflows = sessions.filter((session) => session.workflows.active).length
    const dueReminders = sessions.flatMap((session) => session.scheduledActions).filter((action) => action.status === 'scheduled').length

    return {
        totalSessions: globalAnalytics.totalSessions,
        totalTurns: globalAnalytics.totalTurns,
        workflowStarts: globalAnalytics.workflowStarts,
        workflowCompletions: globalAnalytics.workflowCompletions,
        workflowDropoffs: globalAnalytics.workflowDropoffs,
        clarificationCount: globalAnalytics.clarificationCount,
        fallbackCount: globalAnalytics.fallbackCount,
        activeWorkflows,
        dueReminders,
        intentCounts: globalAnalytics.intentCounts,
        personaCounts: globalAnalytics.personaCounts,
        responseVariants: globalAnalytics.responseVariants,
    }
}

export function buildAutocompleteSuggestions(session, inputValue, runtimeContext = {}) {
    if (!inputValue?.trim()) {
        return (session.ui?.quickReplies || []).slice(0, 4)
    }

    const text = inputValue.toLowerCase()
    const knowledge = buildKnowledgeBase(normalizeRuntimeContext(runtimeContext))

    const knowledgeSuggestions = knowledge
        .filter((entry) => entry.title.toLowerCase().includes(text) || entry.tags.some((tag) => tag.includes(text)))
        .slice(0, 4)
        .map((entry) => createQuickReply(entry.title, { type: 'send_text', text: entry.title }))

    const workflow = session.workflows.active
    if (workflow) {
        const step = getWorkflowStepDefinition(workflow)
        if (step?.type === 'choice') {
            return step.options
                .filter((option) => option.label.toLowerCase().includes(text))
                .slice(0, 4)
                .map((option) => createQuickReply(option.label, {
                    type: 'workflow_choice',
                    workflowId: workflow.id,
                    stepId: step.id,
                    value: option.value,
                }))
        }
    }

    return knowledgeSuggestions.length
        ? knowledgeSuggestions
        : buildDefaultQuickReplies(session.roleMode).slice(0, 4)
}

function updateLongTermProfile(session, entities) {
    const profile = loadLongTermProfile()

    const nextProfile = {
        ...profile,
        lastSeenAt: new Date().toISOString(),
        preferences: {
            ...profile.preferences,
            preferredSubject: session.memory.preferences.preferredSubject || profile.preferences.preferredSubject || null,
            preferredPersona: session.memory.preferences.preferredPersona || profile.preferences.preferredPersona || null,
            userName: entities.name || session.memory.preferences.userName || profile.preferences.userName || null,
        },
        memoryFacts: {
            ...profile.memoryFacts,
            lastSubject: entities.subject || session.memory.shortTerm.currentSubject || profile.memoryFacts.lastSubject || null,
            lastIntent: session.memory.shortTerm.lastIntent || profile.memoryFacts.lastIntent || null,
        },
    }

    persistLongTermProfile(nextProfile)
}

function appendAgentLog(context, name, status = 'COMPLETE', score = null) {
    context.agentLog.push({
        name,
        status,
        score,
    })
}

function processUserMessage(session, inputText, runtimeContext) {
    const context = {
        runtimeContext,
        workingText: inputText,
        entities: {},
        intent: null,
        knowledge: [],
        persona: PERSONAS[session.activePersonaId],
        notes: [],
        agentLog: [],
        effects: [],
        quickReplies: [],
        candidate: null,
        requiresClarification: false,
        shouldEscalate: false,
    }

    appendAgentLog(context, 'RUNTIME_CONTEXT')
    syncRuntimeContext(session, runtimeContext)

    context.entities = extractEntities(inputText, session, runtimeContext)
    appendAgentLog(context, 'ENTITY_EXTRACTOR', 'COMPLETE', Object.keys(context.entities).filter((key) => context.entities[key]).length)

    context.intent = detectIntents(inputText, context.entities, runtimeContext)
    appendAgentLog(context, 'INTENT_CLASSIFIER', 'COMPLETE', context.intent.confidence.toFixed(2))

    const nextPersonaId = context.intent.primaryPersonaId || session.activePersonaId
    if (nextPersonaId !== session.activePersonaId) {
        session.activePersonaId = nextPersonaId
        session.memory.preferences.preferredPersona = nextPersonaId
        session.analytics.personaSwitches += 1
        session.messages.push(createMessage('system', `PERSONA SHIFT -> ${PERSONAS[nextPersonaId].label.toUpperCase()}`, { isAnimated: false }))
    }
    context.persona = PERSONAS[session.activePersonaId]
    appendAgentLog(context, 'PERSONA_ROUTER', 'COMPLETE', context.persona.id)

    session.memory.shortTerm.lastIntent = context.intent.primary
    session.memory.shortTerm.lastConfidence = context.intent.confidence
    session.memory.shortTerm.lastEntities = context.entities
    session.memory.shortTerm.recentIntents = [context.intent.primary, ...session.memory.shortTerm.recentIntents.filter((intent) => intent !== context.intent.primary)].slice(0, 6)
    if (context.entities.subject) {
        session.memory.shortTerm.currentSubject = context.entities.subject
        session.memory.preferences.preferredSubject = context.entities.subject
    }
    if (context.entities.chapterNumber) {
        session.memory.shortTerm.currentChapter = context.entities.chapterNumber
    }
    if (context.entities.topic) {
        session.memory.shortTerm.recentTopics = [context.entities.topic, ...session.memory.shortTerm.recentTopics.filter((topic) => topic !== context.entities.topic)].slice(0, 6)
    }
    appendAgentLog(context, 'MEMORY_MANAGER')

    context.knowledge = searchKnowledge(inputText, context.entities, runtimeContext)
    appendAgentLog(context, 'KNOWLEDGE_RETRIEVER', 'COMPLETE', context.knowledge[0]?.score?.toFixed(2) || '0')

    if (shouldInterruptWorkflow(session, context.intent)) {
        session.workflows.suspended = session.workflows.active
        session.workflows.active = null
        session.messages.push(createMessage('system', `WORKFLOW PAUSED -> ${WORKFLOWS[session.workflows.suspended.id].title.toUpperCase()}`, { isAnimated: false }))
        session.ui.workflowCard = null
        context.notes.push('workflow_interrupted')
    }

    if (context.intent.confidence < 0.42) {
        context.requiresClarification = true
        session.analytics.clarifications += 1
        session.memory.shortTerm.unresolvedCount += 1
    } else {
        session.memory.shortTerm.unresolvedCount = Math.max(0, session.memory.shortTerm.unresolvedCount - 1)
    }

    if (session.memory.shortTerm.unresolvedCount >= 2 && ['support_issue', 'login_issue', 'locked_issue'].includes(context.intent.primary)) {
        context.shouldEscalate = true
    }
    appendAgentLog(context, 'DECISION_ENGINE')

    const candidates = []

    if (context.requiresClarification) {
        candidates.push(buildClarificationCandidate(context.intent, session))
    } else if (session.workflows.active) {
        candidates.push(buildWorkflowPromptCandidate(session))
    }

    const workflowSeedData = {
        subject: context.entities.subject || undefined,
        goal: context.entities.goal || undefined,
        chapter: context.entities.chapterNumber ? `Chapter ${context.entities.chapterNumber}` : undefined,
        accessType: context.entities.accessType || undefined,
        budget: context.entities.amount || undefined,
        issueType: context.entities.issueType || undefined,
        detail: context.entities.topic || undefined,
        topic: context.entities.topic || undefined,
        dueDate: context.entities.date || undefined,
    }

    if (!context.requiresClarification && !session.workflows.active && context.intent.workflowId) {
        const workflowIntro = startWorkflow(session, context.intent.workflowId, workflowSeedData, context.intent.primary)
        if (workflowIntro.message) {
            candidates.push({
                id: `workflow-start-${context.intent.workflowId}`,
                score: 8.9,
                text: workflowIntro.message,
                quickReplies: session.ui.quickReplies,
                variant: 'workflow_start',
            })
        }
    }

    const knowledgeCandidate = buildKnowledgeCandidate(context.persona, context.knowledge, session, runtimeContext)
    if (knowledgeCandidate) {
        candidates.push(knowledgeCandidate)
    }

    candidates.push(...buildPersonaCandidates(context.persona, context.intent, context.entities, session, runtimeContext))

    if (context.shouldEscalate) {
        candidates.push(buildEscalationCandidate(session))
    }

    candidates.push(buildFallbackCandidate(session, runtimeContext))

    candidates.sort((left, right) => right.score - left.score)
    context.candidate = candidates[0]
    appendAgentLog(context, 'RESPONSE_RANKER', 'COMPLETE', context.candidate.variant)

    session.analytics.turns += 1
    session.analytics.intentCounts[context.intent.primary] = (session.analytics.intentCounts[context.intent.primary] || 0) + 1
    session.analytics.responseVariants[context.candidate.variant] = (session.analytics.responseVariants[context.candidate.variant] || 0) + 1

    session.ui.quickReplies = context.candidate.quickReplies || buildDefaultQuickReplies(session.roleMode)
    session.ui.suggestions = buildAutocompleteSuggestions(session, '', runtimeContext)
    session.ui.lastAgentSummary = {
        intent: context.intent.primary,
        confidence: context.intent.confidence,
        personaId: context.persona.id,
        entities: context.entities,
        knowledgeHits: context.knowledge.map((entry) => entry.title),
    }

    session.messages.push(createMessage('system', `[${context.agentLog.length} AGENTS] turn #${session.analytics.turns} | persona: ${context.persona.label} | intent: ${context.intent.primary} (${Math.round(context.intent.confidence * 100)}%)`, { isAnimated: false }))
    session.messages.push(createMessage('bot', context.candidate.text))

    if (context.candidate.variant === 'fallback') {
        session.analytics.fallbacks += 1
    }

    updateLongTermProfile(session, context.entities)

    mergeAnalyticsPatch({
        totalTurns: 1,
        workflowStarts: context.candidate.variant === 'workflow_start' ? 1 : 0,
        clarificationCount: context.requiresClarification ? 1 : 0,
        fallbackCount: context.candidate.variant === 'fallback' ? 1 : 0,
        intentCounts: {
            [context.intent.primary]: 1,
        },
        personaCounts: {
            [context.persona.id]: 1,
        },
        responseVariants: {
            [context.candidate.variant]: 1,
        },
    })

    return {
        session,
        agentLog: context.agentLog,
    }
}

function handleSystemTrigger(session, payload, runtimeContext) {
    const trigger = payload.trigger
    const previousPath = payload.fromPath || session.context.currentPath
    const effects = []
    const notifications = []

    if (trigger === 'route_changed') {
        if (previousPath !== runtimeContext.currentPath) {
            syncRuntimeContext(session, runtimeContext)
            const subject = runtimeContext.currentSubject ? SUBJECTS.find((item) => item.id === runtimeContext.currentSubject)?.label : null
            session.messages.push(createMessage('system', `CONTEXT -> ${runtimeContext.pageLabel.toUpperCase()}`, { isAnimated: false }))
            session.messages.push(createMessage('bot', subject
                ? `You are now on the ${subject} route. I can explain the subject, guide access, compare unlock options, or build a study plan from here.`
                : `You are now on ${runtimeContext.pageLabel}. I can guide this page, compare paths, or start a workflow from here.`))
            session.ui.quickReplies = buildDefaultQuickReplies(session.roleMode)
            notifications.push('route_changed')
        }
    }

    if (trigger === 'due_check') {
        const dueItems = session.scheduledActions.filter((action) => action.status === 'scheduled' && new Date(action.dueAt).getTime() <= Date.now())
        for (const action of dueItems) {
            action.status = 'due'
            action.notifiedAt = new Date().toISOString()
            session.messages.push(createMessage('system', `REMINDER DUE -> ${action.label.toUpperCase()}`, { isAnimated: false }))
            session.messages.push(createMessage('bot', `Reminder: ${action.label}. This was scheduled for ${formatDateTime(action.dueAt)}.`))
        }
        if (dueItems.length) {
            session.ui.quickReplies = [
                createQuickReply('Plan follow-up study', { type: 'start_workflow', workflowId: 'study_planner' }),
                createQuickReply('Set another reminder', { type: 'start_workflow', workflowId: 'reminder_setup' }),
            ]
            notifications.push('reminders_due')
        }
    }

    return { session, effects, notifications }
}

export function markSessionDropped(session) {
    if (session.workflows.active) {
        session.analytics.workflowDropoffs += 1
        mergeAnalyticsPatch({
            workflowDropoffs: 1,
        })
    }

    return session
}

export function deleteChatSession(sessions, sessionId, runtimeContext = {}) {
    const remaining = sessions.filter((session) => session.id !== sessionId)
    return remaining.length ? remaining : [createChatSession(runtimeContext)]
}

export function runPipeline({
    session,
    inputText = '',
    action = 'user_message',
    payload = {},
    runtimeContext = {},
}) {
    const context = normalizeRuntimeContext(runtimeContext)
    const nextSession = restoreChatSession(session, context)
    syncRuntimeContext(nextSession, context)

    if (action === 'system_trigger') {
        const systemResult = handleSystemTrigger(nextSession, payload, context)
        nextSession.updatedAt = new Date().toISOString()
        nextSession.title = deriveSessionTitle(nextSession)
        return {
            session: nextSession,
            agentLog: [
                { name: 'SYSTEM_TRIGGER', status: 'COMPLETE', score: payload.trigger },
            ],
            meta: {
                persona: PERSONAS[nextSession.activePersonaId],
                intent: nextSession.memory.shortTerm.lastIntent,
                workflow: summarizeWorkflowProgress(nextSession.workflows.active),
                notifications: systemResult.notifications,
            },
            effects: systemResult.effects,
        }
    }

    if (action === 'resume_workflow' && nextSession.workflows.suspended) {
        nextSession.workflows.active = nextSession.workflows.suspended
        nextSession.workflows.suspended = null
        nextSession.messages.push(createMessage('system', `WORKFLOW RESUMED -> ${WORKFLOWS[nextSession.workflows.active.id].title.toUpperCase()}`, { isAnimated: false }))
        nextSession.ui.workflowCard = summarizeWorkflowProgress(nextSession.workflows.active)
        nextSession.ui.quickReplies = buildWorkflowQuickReplies(nextSession.workflows.active)
        nextSession.messages.push(createMessage('bot', getWorkflowStepDefinition(nextSession.workflows.active)?.label || 'Continue the workflow.'))
        nextSession.updatedAt = new Date().toISOString()
        return {
            session: nextSession,
            agentLog: [{ name: 'WORKFLOW_RESUME', status: 'COMPLETE', score: nextSession.workflows.active.id }],
            meta: {
                persona: PERSONAS[nextSession.activePersonaId],
                intent: nextSession.memory.shortTerm.lastIntent,
                workflow: summarizeWorkflowProgress(nextSession.workflows.active),
            },
            effects: [],
        }
    }

    if (action === 'cancel_workflow' && nextSession.workflows.active) {
        nextSession.messages.push(createMessage('system', `WORKFLOW CANCELED -> ${WORKFLOWS[nextSession.workflows.active.id].title.toUpperCase()}`, { isAnimated: false }))
        nextSession.workflows.active = null
        nextSession.ui.workflowCard = null
        nextSession.ui.quickReplies = buildDefaultQuickReplies(nextSession.roleMode)
        nextSession.updatedAt = new Date().toISOString()
        return {
            session: nextSession,
            agentLog: [{ name: 'WORKFLOW_CANCEL', status: 'COMPLETE', score: null }],
            meta: {
                persona: PERSONAS[nextSession.activePersonaId],
                intent: nextSession.memory.shortTerm.lastIntent,
                workflow: null,
            },
            effects: [],
        }
    }

    if (action === 'start_workflow' && payload.workflowId) {
        const workflowStart = startWorkflow(nextSession, payload.workflowId, {}, payload.workflowId)
        if (workflowStart.message) {
            nextSession.messages.push(createMessage('system', `WORKFLOW START -> ${WORKFLOWS[payload.workflowId].title.toUpperCase()}`, { isAnimated: false }))
            nextSession.messages.push(createMessage('bot', workflowStart.message))
        }
        nextSession.updatedAt = new Date().toISOString()
        return {
            session: nextSession,
            agentLog: [{ name: 'WORKFLOW_START', status: 'COMPLETE', score: payload.workflowId }],
            meta: {
                persona: PERSONAS[nextSession.activePersonaId],
                intent: nextSession.memory.shortTerm.lastIntent,
                workflow: summarizeWorkflowProgress(nextSession.workflows.active),
            },
            effects: [],
        }
    }

    const userVisibleText = payload.label || inputText
    if (userVisibleText) {
        nextSession.messages.push(createMessage('user', userVisibleText, { isAnimated: false }))
    }

    if (nextSession.workflows.active && ['workflow_choice', 'workflow_submit'].includes(action)) {
        const workflowAdvance = advanceWorkflow(nextSession, inputText, payload, context)
        nextSession.updatedAt = new Date().toISOString()
        if (workflowAdvance.reply) {
            nextSession.messages.push(createMessage('bot', workflowAdvance.reply))
        } else if (workflowAdvance.clarification) {
            nextSession.messages.push(createMessage('bot', workflowAdvance.clarification))
        }
        nextSession.ui.quickReplies = workflowAdvance.quickReplies || nextSession.ui.quickReplies
        nextSession.ui.workflowCard = summarizeWorkflowProgress(nextSession.workflows.active)
        return {
            session: nextSession,
            agentLog: [{ name: 'WORKFLOW_CONTROLLER', status: 'COMPLETE', score: nextSession.workflows.active?.id || 'completed' }],
            meta: {
                persona: PERSONAS[nextSession.activePersonaId],
                intent: nextSession.memory.shortTerm.lastIntent,
                workflow: summarizeWorkflowProgress(nextSession.workflows.active),
            },
            effects: workflowAdvance.effects || [],
        }
    }

    const userResult = processUserMessage(nextSession, inputText, context)
    nextSession.title = deriveSessionTitle(nextSession)
    nextSession.updatedAt = new Date().toISOString()
    nextSession.ui.analyticsSummary = buildSessionSummary(nextSession)

    return {
        session: nextSession,
        agentLog: userResult.agentLog,
        meta: {
            persona: PERSONAS[nextSession.activePersonaId],
            intent: nextSession.memory.shortTerm.lastIntent,
            workflow: summarizeWorkflowProgress(nextSession.workflows.active),
        },
        effects: [],
    }
}

export const AGENTS = [
    { name: 'RUNTIME_CONTEXT' },
    { name: 'ENTITY_EXTRACTOR' },
    { name: 'INTENT_CLASSIFIER' },
    { name: 'PERSONA_ROUTER' },
    { name: 'MEMORY_MANAGER' },
    { name: 'KNOWLEDGE_RETRIEVER' },
    { name: 'DECISION_ENGINE' },
    { name: 'RESPONSE_RANKER' },
]

export function getSessionSidebarItems(sessions) {
    return sessions.map((session) => ({
        id: session.id,
        title: session.title,
        personaId: session.activePersonaId,
        updatedAt: session.updatedAt,
    }))
}
