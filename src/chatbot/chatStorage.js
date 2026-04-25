const STORAGE_KEYS = {
    sessions: 'sb_chatbot_sessions_v3',
    profile: 'sb_chatbot_profile_v3',
    analytics: 'sb_chatbot_analytics_v3',
}

const MAX_STORED_MESSAGES = 60
const MAX_STORED_QUICK_REPLIES = 8
const MAX_STORED_SUGGESTIONS = 8

function canUseStorage() {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readJSON(key, fallback) {
    if (!canUseStorage()) return fallback

    try {
        const value = window.localStorage.getItem(key)
        return value ? JSON.parse(value) : fallback
    } catch (error) {
        console.warn('Chat storage read failed:', error)
        return fallback
    }
}

function writeJSON(key, value) {
    if (!canUseStorage()) return

    try {
        window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        console.warn('Chat storage write failed:', error)
    }
}

function trimSession(session) {
    return {
        ...session,
        messages: (session.messages || []).slice(-MAX_STORED_MESSAGES),
        ui: {
            ...session.ui,
            quickReplies: (session.ui?.quickReplies || []).slice(0, MAX_STORED_QUICK_REPLIES),
            suggestions: (session.ui?.suggestions || []).slice(0, MAX_STORED_SUGGESTIONS),
        },
    }
}

export function loadPersistedSessions() {
    return readJSON(STORAGE_KEYS.sessions, [])
}

export function persistSessions(sessions) {
    writeJSON(STORAGE_KEYS.sessions, sessions.map(trimSession))
}

export function loadLongTermProfile() {
    return readJSON(STORAGE_KEYS.profile, {
        preferences: {},
        memoryFacts: {},
        remindersSeen: [],
        lastSeenAt: null,
    })
}

export function persistLongTermProfile(profile) {
    writeJSON(STORAGE_KEYS.profile, profile)
}

export function loadChatAnalytics() {
    return readJSON(STORAGE_KEYS.analytics, {
        totalSessions: 0,
        totalTurns: 0,
        intentCounts: {},
        personaCounts: {},
        workflowStarts: 0,
        workflowCompletions: 0,
        workflowDropoffs: 0,
        clarificationCount: 0,
        fallbackCount: 0,
        responseVariants: {},
        bucketCounts: {},
        lastUpdatedAt: null,
    })
}

export function persistChatAnalytics(analytics) {
    writeJSON(STORAGE_KEYS.analytics, analytics)
}

export function mergeAnalyticsPatch(patch) {
    const analytics = loadChatAnalytics()

    const merged = {
        ...analytics,
        totalSessions: analytics.totalSessions + (patch.totalSessions || 0),
        totalTurns: analytics.totalTurns + (patch.totalTurns || 0),
        workflowStarts: analytics.workflowStarts + (patch.workflowStarts || 0),
        workflowCompletions: analytics.workflowCompletions + (patch.workflowCompletions || 0),
        workflowDropoffs: analytics.workflowDropoffs + (patch.workflowDropoffs || 0),
        clarificationCount: analytics.clarificationCount + (patch.clarificationCount || 0),
        fallbackCount: analytics.fallbackCount + (patch.fallbackCount || 0),
        lastUpdatedAt: new Date().toISOString(),
        intentCounts: {
            ...analytics.intentCounts,
        },
        personaCounts: {
            ...analytics.personaCounts,
        },
        responseVariants: {
            ...analytics.responseVariants,
        },
        bucketCounts: {
            ...analytics.bucketCounts,
        },
    }

    for (const [key, value] of Object.entries(patch.intentCounts || {})) {
        merged.intentCounts[key] = (merged.intentCounts[key] || 0) + value
    }

    for (const [key, value] of Object.entries(patch.personaCounts || {})) {
        merged.personaCounts[key] = (merged.personaCounts[key] || 0) + value
    }

    for (const [key, value] of Object.entries(patch.responseVariants || {})) {
        merged.responseVariants[key] = (merged.responseVariants[key] || 0) + value
    }

    for (const [key, value] of Object.entries(patch.bucketCounts || {})) {
        merged.bucketCounts[key] = (merged.bucketCounts[key] || 0) + value
    }

    persistChatAnalytics(merged)
    return merged
}
