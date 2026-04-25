import React, { useState, useEffect, useRef, useCallback } from 'react';
import { runPipeline, AGENTS, ChatSession } from '../agents/AgentPipeline';
import logoImg from '../assets/logo-removebg-preview.png';

const TypewriterResponse = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + text.charAt(index));
                setIndex(index + 1);
            }, 18);
            return () => clearTimeout(timer);
        } else {
            if (onComplete) onComplete();
        }
    }, [index, text, onComplete]);

    return <>{displayedText}<span className="cursor-blink">|</span></>;
};

const INITIAL_MESSAGES = [
    { id: 1, text: "SESSION STARTED", sender: 'system' },
    { id: 2, text: "Hey! I'm your Smartbook advisor. Whether you're a student, teacher, or just curious \u2014 I'm here to find the perfect plan for you.", sender: 'bot', isAnimated: true },
    { id: 3, text: "Can I help u?", sender: 'bot', isAnimated: true }
];

const Chatbot = ({ isOpen, onClose }) => {
    const [session, setSession] = useState(() => new ChatSession());
    const [messages, setMessages] = useState([...INITIAL_MESSAGES]);
    const [inputValue, setInputValue] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);
    const [activeAgents, setActiveAgents] = useState([]);
    const [agentLog, setAgentLog] = useState(null);
    const messagesEndRef = useRef(null);

    const startNewSession = () => {
        if (session) session.endSession();
        const newSess = new ChatSession();
        setSession(newSess);
        setMessages([
            { id: Date.now(), text: `SESSION ${session.id.toUpperCase()} ENDED`, sender: 'system' },
            { id: Date.now() + 1, text: `NEW SESSION ${newSess.id.toUpperCase()} STARTED`, sender: 'system' },
            { id: Date.now() + 2, text: "Fresh start! How can I help you explore Smartbook today?", sender: 'bot', isAnimated: true }
        ]);
    };

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isBotTyping, activeAgents, scrollToBottom]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isBotTyping) return;

        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        
        const input = inputValue;
        setInputValue('');
        setIsBotTyping(true);
        setAgentLog(null);

        // Simulate agent-by-agent processing with visual feedback
        const agentNames = AGENTS.map(a => a.name);
        for (let i = 0; i < agentNames.length; i++) {
            setActiveAgents(agentNames.slice(0, i + 1));
            await new Promise(r => setTimeout(r, 400 + Math.random() * 300));
        }

        // Run the actual pipeline with session
        const result = await runPipeline(input, messages, session);

        setActiveAgents([]);
        setAgentLog(result.agentLog);

        // Add system log message
        const logMsg = {
            id: Date.now() + 1,
            text: `[${result.agentLog.length} AGENTS] turn #${session.turnCount} — intent: ${result.intent.primary} (${(result.intent.confidence * 100).toFixed(0)}%)`,
            sender: 'system'
        };
        setMessages(prev => [...prev, logMsg]);

        // Bot response with typewriter
        await new Promise(r => setTimeout(r, 300));
        const botMsg = { id: Date.now() + 2, text: result.response, sender: 'bot', isAnimated: true };
        setIsBotTyping(false);
        setMessages(prev => [...prev, botMsg]);
    };

    if (!isOpen) return null;

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="status-indicator"></div>
                <img src={logoImg} alt="Smartbook Logo" className="chat-header-logo" />
                <span>SB-365 PROTOCOL</span>
                <button className="new-session-btn" onClick={startNewSession} title="Start New Session">↻</button>
                <button className="close-btn" onClick={() => { session.endSession(); onClose(); }}>&times;</button>
            </div>

            {/* Agent Activity Bar */}
            {isBotTyping && activeAgents.length > 0 && (
                <div className="agent-activity-bar">
                    {AGENTS.map(agent => (
                        <div 
                            key={agent.name} 
                            className={`agent-chip ${activeAgents.includes(agent.name) ? 'active' : ''}`}
                        >
                            <span className="agent-dot"></span>
                            {agent.name.replace('_', ' ')}
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.sender === 'bot' && msg.isAnimated ? (
                                <TypewriterResponse text={msg.text} />
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {isBotTyping && activeAgents.length === 0 && (
                    <div className="message bot typing">
                        <div className="typing-indicator">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="chat-input" onSubmit={handleSend}>
                <input 
                    type="text" 
                    placeholder="ENTER QUERY..." 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isBotTyping}
                />
                <button type="submit" disabled={isBotTyping}>SEND</button>
            </form>
        </div>
    );
};

export default Chatbot;
