import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    AGENTS,
    DEFAULT_PERSONA_ID,
    PERSONAS,
    buildAutocompleteSuggestions,
    createChatSession,
    deleteChatSession,
    getAnalyticsDashboardData,
    getSessionSidebarItems,
    loadChatSessions,
    markSessionDropped,
    persistChatSessions,
    restoreChatSession,
    runPipeline,
} from '../agents/AgentPipeline'
import { DEMO_CONFIG } from '../config/demoConfig'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo-removebg-preview.png'

const TypewriterResponse = ({ text, animate }) => {
    const [index, setIndex] = useState(animate ? 0 : text.length)

    useEffect(() => {
        if (!animate) return undefined
        if (index >= text.length) return undefined

        const timer = setTimeout(() => {
            setIndex((previous) => previous + 1)
        }, 16)

        return () => clearTimeout(timer)
    }, [animate, index, text])

    const displayedText = animate ? text.slice(0, index) : text

    return (
        <>
            {displayedText}
            {animate && <span className="cursor-blink">|</span>}
        </>
    )
}

function formatSessionTime(updatedAt) {
    try {
        return new Intl.DateTimeFormat('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            day: 'numeric',
            month: 'short',
        }).format(new Date(updatedAt))
    } catch {
        return updatedAt
    }
}

const Chatbot = ({ isOpen, onClose }) => {
    const { user, pricing } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const initialContextRef = useRef(null)

    if (!initialContextRef.current) {
        initialContextRef.current = {
            currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
            demoConfig: DEMO_CONFIG,
        }
    }

    const sessionSeedRef = useRef(loadChatSessions(initialContextRef.current))
    const [sessions, setSessions] = useState(sessionSeedRef.current)
    const [activeSessionId, setActiveSessionId] = useState(sessionSeedRef.current[0]?.id || null)
    const [inputValue, setInputValue] = useState('')
    const [workflowValue, setWorkflowValue] = useState('')
    const [isBotTyping, setIsBotTyping] = useState(false)
    const [activeAgents, setActiveAgents] = useState([])
    const [showAnalytics, setShowAnalytics] = useState(false)
    const messagesEndRef = useRef(null)
    const activeSessionRef = useRef(null)
    const previousPathRef = useRef(location.pathname)

    const runtimeContext = useMemo(() => ({
        user,
        pricing,
        demoConfig: DEMO_CONFIG,
        currentPath: location.pathname,
        customKnowledge: [], // Fetched from context
    }), [location.pathname, pricing, user])

    // Load custom knowledge
    const { fetchChatbotKnowledge } = useAuth()
    useEffect(() => {
        const loadK = async () => {
            if (fetchChatbotKnowledge) {
                const k = await fetchChatbotKnowledge()
                runtimeContext.customKnowledge = k || []
            }
        }
        loadK()
    }, [fetchChatbotKnowledge, runtimeContext])

    const activeSession = sessions.find((session) => session.id === activeSessionId) || sessions[0]
    activeSessionRef.current = activeSession || null

    const activePersonaId = activeSession?.activePersonaId || DEFAULT_PERSONA_ID
    const activePersona = PERSONAS[activePersonaId]
    const workflowCard = activeSession?.ui?.workflowCard || null
    const currentStep = workflowCard?.step || null
    const sessionItems = getSessionSidebarItems(sessions)
    const analyticsData = showAnalytics ? getAnalyticsDashboardData(sessions) : null
    const autocompleteSuggestions = activeSession
        ? buildAutocompleteSuggestions(activeSession, inputValue, runtimeContext)
        : []
    const lastBotMessageId = [...(activeSession?.messages || [])].reverse().find((message) => message.sender === 'bot')?.id

    const personaTheme = {
        '--chat-accent': activePersona.theme.accent,
        '--chat-accent-strong': activePersona.theme.accentStrong,
        '--chat-accent-glow': activePersona.theme.accentGlow,
        '--chat-accent-glow-strong': activePersona.theme.accentGlowStrong,
        '--chat-surface': activePersona.theme.surface,
        '--chat-surface-soft': activePersona.theme.surfaceSoft,
        '--chat-user-ink': activePersona.theme.userInk,
        '--chat-muted': activePersona.theme.muted,
        '--chat-shadow': activePersona.theme.shadow,
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeSession?.messages, activeSession?.ui?.quickReplies, isBotTyping])

    useEffect(() => {
        persistChatSessions(sessions)
    }, [sessions])

    useEffect(() => {
        setSessions((previous) => previous.map((session) => restoreChatSession(session, runtimeContext)))
    }, [runtimeContext])

    useEffect(() => {
        if (!workflowCard?.step?.id) {
            setWorkflowValue('')
            return
        }

        const existingValue = workflowCard.data?.[workflowCard.step.id]
        setWorkflowValue(existingValue ? String(existingValue) : '')
    }, [workflowCard?.id, workflowCard?.step?.id, workflowCard?.data])

    useEffect(() => {
        const previousPath = previousPathRef.current
        if (previousPath === location.pathname) return
        previousPathRef.current = location.pathname

        if (!activeSession) {
            setSessions((previous) => previous.map((session) => restoreChatSession(session, runtimeContext)))
            return
        }

        if (!isOpen) {
            setSessions((previous) => previous.map((session) => restoreChatSession(session, runtimeContext)))
            return
        }

        const result = runPipeline({
            session: activeSession,
            action: 'system_trigger',
            payload: {
                trigger: 'route_changed',
                fromPath: previousPath,
            },
            runtimeContext,
        })

        setSessions((previous) => previous.map((session) => (
            session.id === result.session.id ? result.session : restoreChatSession(session, runtimeContext)
        )))
    }, [activeSession, isOpen, location.pathname, runtimeContext])

    useEffect(() => {
        if (!isOpen) return undefined

        const interval = setInterval(() => {
            const session = activeSessionRef.current
            if (!session) return

            const result = runPipeline({
                session,
                action: 'system_trigger',
                payload: { trigger: 'due_check' },
                runtimeContext,
            })

            if (result.meta.notifications?.length) {
                setSessions((previous) => previous.map((item) => (item.id === result.session.id ? result.session : item)))
            }
        }, 30000)

        return () => clearInterval(interval)
    }, [isOpen, runtimeContext])

    const replaceSession = (nextSession) => {
        setSessions((previous) => previous.map((session) => (session.id === nextSession.id ? nextSession : session)))
    }

    const performTurn = async ({ action = 'user_message', inputText = '', payload = {}, showTyping = true }) => {
        const session = activeSessionRef.current
        if (!session) return

        if (showTyping) {
            setIsBotTyping(true)
            const agentNames = AGENTS.map((agent) => agent.name)
            for (let index = 0; index < agentNames.length; index += 1) {
                setActiveAgents(agentNames.slice(0, index + 1))
                // Short staged pulse keeps the multi-agent feel without slowing the chat too much.
                // The real engine is synchronous, so this is purely UI feedback.
                // We only do this for user-driven turns.
                await new Promise((resolve) => setTimeout(resolve, 90))
            }
        }

        try {
            const result = runPipeline({
                session,
                inputText,
                action,
                payload,
                runtimeContext,
            })

            replaceSession(result.session)
            setInputValue('')
        } catch (error) {
            console.error('Chatbot turn failed:', error)
        } finally {
            setActiveAgents([])
            setIsBotTyping(false)
        }
    }

    const handleSend = async (event) => {
        event.preventDefault()
        const trimmed = inputValue.trim()
        if (!trimmed || isBotTyping) return

        await performTurn({
            action: 'user_message',
            inputText: trimmed,
        })
    }

    const handleWorkflowSubmit = async (event) => {
        event.preventDefault()
        if (!currentStep || !workflowCard) return

        const normalizedValue = currentStep.type === 'number'
            ? (workflowValue === '' ? '' : Number(workflowValue))
            : workflowValue.trim()
        if (!normalizedValue && !currentStep.optional) return

        await performTurn({
            action: 'workflow_submit',
            inputText: String(normalizedValue),
            payload: {
                [currentStep.id]: normalizedValue,
                label: String(normalizedValue),
            },
        })
    }

    const handleQuickReply = async (quickReply) => {
        if (!quickReply) return

        if (quickReply.type === 'navigate' && quickReply.to) {
            navigate(quickReply.to)
            return
        }

        if (quickReply.type === 'open_url' && quickReply.url) {
            window.open(quickReply.url, '_blank', 'noopener,noreferrer')
            return
        }

        if (quickReply.type === 'toggle_analytics') {
            setShowAnalytics((previous) => !previous)
            return
        }

        if (quickReply.type === 'start_workflow') {
            await performTurn({
                action: 'start_workflow',
                payload: quickReply,
                showTyping: false,
            })
            return
        }

        if (quickReply.type === 'resume_workflow') {
            await performTurn({
                action: 'resume_workflow',
                showTyping: false,
            })
            return
        }

        if (quickReply.type === 'cancel_workflow') {
            await performTurn({
                action: 'cancel_workflow',
                showTyping: false,
            })
            return
        }

        if (quickReply.type === 'workflow_choice') {
            await performTurn({
                action: 'workflow_choice',
                inputText: String(quickReply.value),
                payload: {
                    ...quickReply,
                    label: quickReply.label,
                },
                showTyping: false,
            })
            return
        }

        await performTurn({
            action: 'user_message',
            inputText: quickReply.text || quickReply.label,
            payload: {
                label: quickReply.label,
            },
        })
    }

    const handleCreateSession = () => {
        const nextSession = createChatSession(runtimeContext)
        setSessions((previous) => [nextSession, ...previous])
        setActiveSessionId(nextSession.id)
        setInputValue('')
        setWorkflowValue('')
        setShowAnalytics(false)
    }

    const handleDeleteSession = (sessionId) => {
        const nextSessions = deleteChatSession(sessions, sessionId, runtimeContext)
        setSessions(nextSessions)
        setActiveSessionId(activeSessionId === sessionId ? nextSessions[0].id : activeSessionId)
    }

    const handleClose = () => {
        if (activeSession) {
            replaceSession(markSessionDropped(activeSession))
        }
        onClose()
    }

    if (!isOpen || !activeSession) return null

    return (
        <div className="chat-window" style={personaTheme} data-persona={activePersonaId}>
            <div className="chat-header">
                <div className="status-indicator"></div>
                <img src={logoImg} alt="Smartbook Logo" className="chat-header-logo" />

                <div className="chat-header-copy">
                    <strong>{activePersona.headerTitle}</strong>
                    <small>{activePersona.headerSubtitle}</small>
                </div>

                {user?.role === 'admin' && (
                    <button type="button" className="chat-header-mini" onClick={() => setShowAnalytics((previous) => !previous)}>
                        Stats
                    </button>
                )}

                <button type="button" className="chat-header-mini" onClick={handleCreateSession}>
                    New
                </button>

                <button type="button" className="close-btn" onClick={handleClose}>
                    &times;
                </button>
            </div>

            <div className="chat-session-rail">
                {sessionItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`chat-session-pill ${item.id === activeSession.id ? 'active' : ''}`}
                        onClick={() => setActiveSessionId(item.id)}
                    >
                        <span>{item.title}</span>
                        <small>{formatSessionTime(item.updatedAt)}</small>
                        {sessions.length > 1 && (
                            <em
                                className="chat-session-delete"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleDeleteSession(item.id)
                                }}
                            >
                                ×
                            </em>
                        )}
                    </button>
                ))}
            </div>

            <div className="persona-banner">
                <div className="persona-banner-top">
                    <span className="persona-pill">{activePersona.role}</span>
                    <span className="persona-pill subtle">{activeSession.roleMode}</span>
                    <span className="persona-pill subtle">Bucket {activeSession.experimentBucket}</span>
                </div>
                <p>{activePersona.helper}</p>
            </div>

            {showAnalytics && user?.role === 'admin' && analyticsData && (
                <div className="chat-analytics-panel">
                    <div className="analytics-grid">
                        <div>
                            <strong>{analyticsData.totalSessions}</strong>
                            <span>Sessions</span>
                        </div>
                        <div>
                            <strong>{analyticsData.totalTurns}</strong>
                            <span>Turns</span>
                        </div>
                        <div>
                            <strong>{analyticsData.workflowStarts}</strong>
                            <span>Workflow Starts</span>
                        </div>
                        <div>
                            <strong>{analyticsData.workflowCompletions}</strong>
                            <span>Workflow Completions</span>
                        </div>
                        <div>
                            <strong>{analyticsData.workflowDropoffs}</strong>
                            <span>Drop-offs</span>
                        </div>
                        <div>
                            <strong>{analyticsData.fallbackCount}</strong>
                            <span>Fallbacks</span>
                        </div>
                    </div>
                </div>
            )}

            {workflowCard && (
                <div className="workflow-card">
                    <div className="workflow-card-head">
                        <div>
                            <strong>{workflowCard.title}</strong>
                            <small>
                                Step {Math.min(workflowCard.stepIndex + 1, workflowCard.totalSteps)} of {workflowCard.totalSteps}
                            </small>
                        </div>
                        <div className="workflow-progress-track">
                            <div
                                className="workflow-progress-fill"
                                style={{ width: `${(Math.min(workflowCard.stepIndex + 1, workflowCard.totalSteps) / workflowCard.totalSteps) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {currentStep && (
                        <div className="workflow-card-body">
                            <label>{currentStep.label}</label>
                            {currentStep.type !== 'choice' && (
                                <form onSubmit={handleWorkflowSubmit} className="workflow-inline-form">
                                    <input
                                        type={currentStep.type === 'number' ? 'number' : 'text'}
                                        value={workflowValue}
                                        onChange={(event) => setWorkflowValue(event.target.value)}
                                        placeholder={currentStep.placeholder || currentStep.label}
                                        disabled={isBotTyping}
                                    />
                                    <button type="submit" disabled={isBotTyping}>Submit</button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            )}

            {isBotTyping && activeAgents.length > 0 && (
                <div className="agent-activity-bar">
                    {AGENTS.map((agent) => (
                        <div key={agent.name} className={`agent-chip ${activeAgents.includes(agent.name) ? 'active' : ''}`}>
                            <span className="agent-dot"></span>
                            {agent.name.replaceAll('_', ' ')}
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-messages">
                {activeSession.messages.map((message) => (
                    <div key={message.id} className={`message ${message.sender}`}>
                        <div className="message-content">
                            {message.sender === 'bot' ? (
                                <TypewriterResponse text={message.text} animate={message.id === lastBotMessageId} />
                            ) : (
                                message.text
                            )}
                        </div>
                    </div>
                ))}

                {isBotTyping && (
                    <div className="message bot typing">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="quick-reply-row">
                {(activeSession.ui.quickReplies || []).slice(0, 6).map((quickReply) => (
                    <button type="button" key={quickReply.id} className="quick-reply-chip" onClick={() => handleQuickReply(quickReply)}>
                        {quickReply.label}
                    </button>
                ))}
            </div>

            {!!inputValue.trim() && (
                <div className="smart-suggestions">
                    {autocompleteSuggestions.slice(0, 4).map((suggestion) => (
                        <button
                            type="button"
                            key={suggestion.id}
                            className="smart-suggestion-chip"
                            onClick={() => {
                                if (suggestion.type === 'send_text') {
                                    setInputValue(suggestion.text || suggestion.label)
                                    return
                                }
                                handleQuickReply(suggestion)
                            }}
                        >
                            {suggestion.label}
                        </button>
                    ))}
                </div>
            )}

            <form className="chat-input" onSubmit={handleSend}>
                <input
                    type="text"
                    placeholder={activePersona.placeholder}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    disabled={isBotTyping}
                />
                <button type="submit" disabled={isBotTyping}>
                    Send
                </button>
            </form>
        </div>
    )
}

export default Chatbot
