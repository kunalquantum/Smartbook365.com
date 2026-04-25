/**
 * Smartbook 365 — Multi-Agent Response Pipeline
 * 
 * Architecture:
 *   User Input → IntentAgent → KnowledgeAgent → ToneAgent → SalesCloser → Response
 * 
 * Each agent processes and enriches a shared context object.
 * Sessions track conversation state to prevent repetition.
 */

// ─── SESSION MANAGER ─────────────────────────────────────────────────
class ChatSession {
    constructor() {
        this.id = Date.now().toString(36);
        this.startedAt = new Date();
        this.usedFacts = {};       // { domain: [usedIndices] }
        this.topicsDiscussed = []; // track covered topics
        this.turnCount = 0;
        this.isActive = true;
    }

    markFactUsed(domain, index) {
        if (!this.usedFacts[domain]) this.usedFacts[domain] = [];
        this.usedFacts[domain].push(index);
    }

    getUnusedFactIndex(domain, totalFacts) {
        const used = this.usedFacts[domain] || [];
        const available = [];
        for (let i = 0; i < totalFacts; i++) {
            if (!used.includes(i)) available.push(i);
        }
        if (available.length === 0) {
            // All facts used — reset and pick first
            this.usedFacts[domain] = [];
            return 0;
        }
        return available[Math.floor(Math.random() * available.length)];
    }

    recordTopic(topic) {
        if (!this.topicsDiscussed.includes(topic)) {
            this.topicsDiscussed.push(topic);
        }
    }

    isTopicCovered(topic) {
        return this.topicsDiscussed.includes(topic);
    }

    endSession() {
        this.isActive = false;
        this.endedAt = new Date();
    }

    incrementTurn() {
        this.turnCount++;
    }
}

// ─── KNOWLEDGE BASE ──────────────────────────────────────────────────
const KNOWLEDGE = {
    demo: {
        topics: ['demo', 'try', 'free', 'test', 'sample', 'example', 'preview', 'experience', 'cost', 'money', 'free of cost', 'subscription', 'no subscription'],
        facts: [
            "We have a full DEMO package available right now! You can explore curated chapters from Chemistry, Physics, and Maths completely free of cost — no subscription or credit card required.",
            "Want to see the magic before you commit? Our DEMO mode lets you experience our high-fidelity 3D visualizations live. Just click the 'TRY DEMO' button on the home page.",
            "Good news: you can access our most popular interactive chapters (like Structure of Atom or Newton's Laws) for free. It's the perfect way to see how Smartbook transforms learning.",
            "No account needed for the demo! Just pick a subject and start exploring. If you love it (and we think you will), you can unlock all 48 chapters later with a premium plan.",
        ],
        depth: "The demo isn't just a video — it's the full interactive engine. You get same 3D controls as our paid members for the selected chapters.",
        cta: "Skip the login and jump into the demo right now! Shall I show you where to click?"
    },
    pricing: {
        topics: ['price', 'pricing', 'cost', 'pay', 'subscription', 'plan', 'free', 'premium', 'buy', 'purchase', 'trial', 'money', 'afford', 'cheap', 'expensive', 'worth', 'value'],
        facts: [
            "Smartbook offers a completely free DEMO mode — no subscription required! You can try curated chapters from every subject for $0 across all your devices.",
            "For full access to all 48 chapters and advanced simulations, our plans start at just $9/month. But honestly, start with the free demo first to see the value!",
            "Every plan starts with a 14-day free trial, and we also have the permanent 'Free Demo' mode for quick exploration without an account.",
            "Cost should never be a barrier to quality education. That's why we kept the demo mode free forever and offer volume discounts for schools.",
        ],
        depth: "Think of it this way: one month of Smartbook costs less than a single textbook, but gives you an entire interactive lab.",
        cta: "Want to try the demo first or jump straight into a 14-day full access trial?"
    },
    chemistry: {
        topics: ['chemistry', 'atom', 'molecule', 'bond', 'reaction', 'element', 'compound', 'periodic', 'organic', 'inorganic', 'quantum'],
        facts: [
            "Students using our Chemistry module scored 40% higher on molecular structure exams. You can try our 'Structure of Atom' chapter right now for free in Demo Mode!",
            "Imagine building a molecule with your hands — dragging atoms, forming bonds, and watching a reaction simulate in real-time. That's what 12,000+ students experience weekly on Smartbook.",
            "Our Chemistry lab is used by 3 top-50 universities for their virtual practicals. No goggles needed — just pure, interactive learning from anywhere.",
            "From periodic table deep-dives to quantum orbital visualizations — every concept clicks when you can rotate, zoom, and interact with it in 3D.",
        ],
        depth: "Students tell us Chemistry went from their hardest subject to their favorite after using Smartbook. The visual difference is that powerful.",
        cta: "Check out the Chemistry demo — it's completely free and requires no account."
    },
    physics: {
        topics: ['physics', 'gravity', 'force', 'motion', 'newton', 'einstein', 'relativity', 'wave', 'energy', 'momentum', 'velocity', 'acceleration'],
        facts: [
            "Our Physics engine doesn't just show you formulas — it lets you bend spacetime and launch projectiles. The 'Laws of Motion' chapter is available for free in Demo Mode today!",
            "Teachers have replaced 30% of their lecture time with Smartbook Physics simulations because students grasp concepts faster when they can interact with them.",
            "Picture this: you adjust the mass of a planet and watch the entire orbital system recalculate live. That's the power you get with our n-body gravitational simulator.",
            "From Newton's apple to Einstein's curvature — every physics milestone is a hands-on experience here, not a paragraph to memorize.",
        ],
        depth: "Physics is where Smartbook truly shines — our engine was originally built for physics simulations, and it shows.",
        cta: "Ready to explore the free Physics demo? No subscription needed."
    },
    mathematics: {
        topics: ['math', 'mathematics', 'geometry', 'algebra', 'calculus', 'equation', 'graph', 'function', 'topology', 'fractal', 'coordinate'],
        facts: [
            "Struggling with calculus? Our students say watching derivatives animate in 3D was their 'aha moment.' Try our Trigonometry demo free to see the unit circle in 3D!",
            "We've turned geometry from flat textbook pages into explorable 3D manifolds. Over 8,000 students improved their spatial reasoning scores within the first month.",
            "Our interactive graphing engine lets you drag equations, morph functions, and see every transformation unfold — it's like having a personal math tutor in 3D.",
            "Fractals, topology, coordinate systems — we cover everything from pre-algebra to university-level mathematics, all with interactive 3D visualizations.",
        ],
        depth: "Math anxiety drops significantly when concepts are visual and interactive. That's the Smartbook difference.",
        cta: "Start the Math demo for free — you'll understand why students call it a game-changer."
    },
    platform: {
        topics: ['smartbook', 'platform', 'app', 'website', 'how', 'work', 'what', 'feature', 'about', 'engine', '3d', 'visual', 'learn', 'study', 'why', 'different', 'special'],
        facts: [
            "Smartbook 365 is trusted by 25,000+ students and 150+ institutions worldwide. It transforms abstract science into tangible, interactive 3D experiences — right in your browser.",
            "Unlike static videos or PDFs, Smartbook lets you interact with every concept. Rotate molecules, launch projectiles, graph equations — all at 60fps with zero installs.",
            "Our proprietary engine was purpose-built for education. It delivers medical-grade simulation accuracy with consumer-friendly ease. No downloads, no plugins — just open and learn.",
            "Students using Smartbook spend 2.5x more time studying voluntarily because the experience is engaging, not exhausting. Learning should feel like discovery, not homework.",
        ],
        depth: "We're not another ed-tech app. We're the platform that makes students actually want to study.",
        cta: "See the difference yourself — explore our free demo today."
    },

    support: {
        topics: ['help', 'support', 'issue', 'bug', 'error', 'problem', 'contact', 'email', 'phone', 'fix', 'broken', 'crash'],
        facts: [
            "I'm sorry you're having trouble — let me help fix that right away. You can reach our team 24/7 at support@smartbook365.com and we typically respond within 30 minutes.",
            "Most issues resolve instantly with a browser refresh or cache clear. If that doesn't work, our engineering team is on Discord daily and loves solving tricky ones.",
            "Your experience matters to us. For urgent issues, our priority support line responds within 15 minutes. We won't rest until you're back to learning.",
            "We also have a comprehensive Help Center with step-by-step guides for every feature. But honestly, just message us — we're faster than documentation.",
        ],
        depth: "Our support team includes the engineers who built the platform. You're not talking to a script — you're talking to people who care.",
        cta: "Want me to connect you directly with our support team right now?"
    },
    greeting: {
        topics: ['hi', 'hello', 'hey', 'greetings', 'yo', 'sup', 'good morning', 'good evening', 'howdy', 'what\'s up'],
        facts: [
            "Welcome! I'm your Smartbook advisor. Whether you're a student, teacher, or just curious — I'm here to help you find the perfect learning experience.",
            "Hey there! Great to see you. I can walk you through our Chemistry, Physics, or Math modules, help with pricing, or answer any questions you have.",
            "Hello! Thousands of students are exploring science in 3D right now on Smartbook. Want me to show you what makes us different?",
        ],
        depth: null,
        cta: null
    },
    farewell: {
        topics: ['bye', 'goodbye', 'see you', 'later', 'thanks', 'thank you', 'exit', 'close', 'quit'],
        facts: [
            "Thanks for chatting! Remember — your 14-day free trial is waiting whenever you're ready. No pressure, just great learning.",
            "It was great talking to you! If you change your mind or have questions later, I'm here 24/7. Happy learning!",
            "Glad I could help! Before you go — our free trial gives you full access with no commitment. Just something to think about. Take care!",
        ],
        depth: null,
        cta: null
    }
};

// ─── AGENT 1: INTENT CLASSIFIER ─────────────────────────────────────
const IntentAgent = {
    name: "INTENT_CLASSIFIER",
    process(input, context) {
        const lower = input.toLowerCase().trim();
        const words = lower.split(/\s+/);
        
        // Score each domain
        const scores = {};
        for (const [domain, data] of Object.entries(KNOWLEDGE)) {
            let score = 0;
            for (const topic of data.topics) {
                if (lower.includes(topic)) {
                    // Exact word match scores higher
                    score += words.includes(topic) ? 3 : 1;
                }
            }
            if (score > 0) scores[domain] = score;
        }

        // Determine primary intent
        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        const primaryIntent = sorted.length > 0 ? sorted[0][0] : 'platform'; // Default to platform
        const secondaryIntents = sorted.slice(1, 3).map(s => s[0]);
        const confidence = sorted.length > 0 ? Math.min(sorted[0][1] / 5, 1) : 0.2;

        // Detect question type
        const isQuestion = /\?|what|how|why|when|where|who|can|does|is|are|will|could|should/.test(lower);
        const isComparison = /vs|versus|compare|difference|better|which/.test(lower);

        context.intent = {
            primary: primaryIntent,
            secondary: secondaryIntents,
            confidence,
            isQuestion,
            isComparison,
            rawInput: lower
        };

        return context;
    }
};

// ─── AGENT 2: KNOWLEDGE RETRIEVER ───────────────────────────────────
const KnowledgeAgent = {
    name: "KNOWLEDGE_RETRIEVER",
    process(input, context) {
        const { primary, secondary, confidence } = context.intent;
        const domain = KNOWLEDGE[primary];
        const session = context.session;

        // Pick an unused fact for this domain
        const factIndex = session 
            ? session.getUnusedFactIndex(primary, domain.facts.length)
            : (context.conversationLength || 0) % domain.facts.length;
        
        const primaryFact = domain.facts[factIndex];

        // Mark as used in session
        if (session) {
            session.markFactUsed(primary, factIndex);
            session.recordTopic(primary);
        }

        // If confidence is low, add platform context
        const supplementary = confidence < 0.5 && primary !== 'platform'
            ? KNOWLEDGE.platform.facts[Math.floor(Math.random() * KNOWLEDGE.platform.facts.length)]
            : null;

        // Cross-reference secondary intents for richer responses
        const crossRef = secondary.length > 0 && KNOWLEDGE[secondary[0]]
            ? KNOWLEDGE[secondary[0]].facts[0]
            : null;

        // Suggest topics not yet discussed
        const uncoveredTopics = session 
            ? ['chemistry', 'physics', 'mathematics', 'pricing', 'platform']
                .filter(t => !session.isTopicCovered(t) && t !== primary)
            : [];

        context.knowledge = {
            primaryFact,
            supplementary,
            crossRef,
            depth: domain.depth,
            cta: domain.cta,
            domain: primary,
            uncoveredTopics
        };

        return context;
    }
};

// ─── AGENT 3: TONE ANALYZER ─────────────────────────────────────────
const ToneAgent = {
    name: "TONE_ANALYZER",
    process(input, context) {
        const lower = input.toLowerCase();

        // Detect emotional signals
        const urgency = /urgent|asap|immediately|now|quick|fast|hurry/.test(lower) ? 'urgent' : 'normal';
        const politeness = /please|thank|appreciate|kindly|could you/.test(lower) ? 'polite' : 'neutral';
        const frustration = /not working|broken|terrible|awful|hate|sucks|worst|angry|frustrated|disappointed/.test(lower) ? 'frustrated' : 'calm';
        const curiosity = /how|why|what if|wonder|curious|interesting|tell me more|explain/.test(lower) ? 'curious' : 'direct';

        // Sales-specific signals
        const buyingIntent = /buy|purchase|sign up|get started|start|try|subscribe|join|ready|interested|want/.test(lower) ? 'high' : 'browsing';
        const hesitation = /not sure|maybe|later|think about|expensive|too much|don't know|comparing|alternative/.test(lower) ? true : false;
        const comparison = /vs|versus|compare|khan|coursera|udemy|better|different|special|unique/.test(lower) ? true : false;

        context.tone = {
            urgency,
            politeness,
            frustration,
            curiosity,
            buyingIntent,
            hesitation,
            comparison,
            shouldEmpathize: frustration === 'frustrated',
            shouldElaborate: curiosity === 'curious',
            shouldClose: buyingIntent === 'high',
            shouldOvercomeObjection: hesitation
        };

        return context;
    }
};

// ─── AGENT 4: RESPONSE CURATOR ───────────────────────────────────────
const CuratorAgent = {
    name: "SALES_CLOSER",
    process(input, context) {
        const { knowledge, tone, intent } = context;
        let parts = [];

        // Empathy-first for frustrated users (retain trust before selling)
        if (tone.shouldEmpathize) {
            parts.push("I completely understand your frustration, and fixing this is my top priority right now.");
        }

        // Handle hesitation with objection-busting
        if (tone.shouldOvercomeObjection) {
            parts.push("I totally get the hesitation — choosing the right tool matters.");
        }

        // Core value-driven response
        parts.push(knowledge.primaryFact);

        // Elaborate with social proof for curious browsers
        if (tone.shouldElaborate && knowledge.depth) {
            parts.push(knowledge.depth);
        }

        // Handle competitor comparisons
        if (tone.comparison) {
            parts.push("Unlike passive video platforms, Smartbook is fully interactive — you don't watch science, you do it. That's why our retention rates are 3x higher than traditional e-learning.");
        }

        // Cross-reference for multi-topic queries
        if (knowledge.crossRef && intent.secondary.length > 0) {
            parts.push(`You might also like this — ${knowledge.crossRef}`);
        }

        // Supplementary context for low-confidence matches
        if (knowledge.supplementary) {
            parts.push(knowledge.supplementary);
        }

        // Objection handling closer
        if (tone.shouldOvercomeObjection) {
            parts.push("And remember — there's zero risk. Our 14-day trial is completely free, no credit card needed. You can explore everything before deciding.");
        }

        // CTA — always steer toward conversion
        const cta = knowledge.cta || KNOWLEDGE[knowledge.domain]?.cta;
        if (cta) {
            parts.push(cta);
        } else if (tone.shouldClose) {
            parts.push("I can help you get set up right now — it takes less than a minute to start your free trial!");
        } else if (!tone.shouldEmpathize && knowledge.domain !== 'greeting' && knowledge.domain !== 'farewell') {
            parts.push("By the way — you can try all of this free for 14 days. Shall I walk you through getting started?");
        }

        context.response = parts.join(" ");
        context.agentsUsed = [
            IntentAgent.name,
            KnowledgeAgent.name,
            ToneAgent.name,
            CuratorAgent.name
        ];

        return context;
    }
};

// ─── PIPELINE ORCHESTRATOR ───────────────────────────────────────────
const AGENTS = [IntentAgent, KnowledgeAgent, ToneAgent, CuratorAgent];

export async function runPipeline(userInput, conversationHistory = [], session = null) {
    const context = {
        conversationLength: conversationHistory.length,
        timestamp: Date.now(),
        session
    };

    if (session) session.incrementTurn();

    const agentLog = [];

    for (const agent of AGENTS) {
        const start = performance.now();
        agent.process(userInput, context);
        const duration = performance.now() - start;

        agentLog.push({
            name: agent.name,
            duration: duration.toFixed(1),
            status: 'COMPLETE'
        });
    }

    return {
        response: context.response,
        intent: context.intent,
        tone: context.tone,
        agentLog,
        processingTime: agentLog.reduce((sum, a) => sum + parseFloat(a.duration), 0).toFixed(1)
    };
}

export { AGENTS, ChatSession };
