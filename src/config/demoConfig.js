/**
 * Smartbook 365 — Demo Access Configuration
 * 
 * Defines which chapters and topics are freely accessible
 * without login or subscription. One chapter per subject.
 */

export const DEMO_CONFIG = {
    chemistry: {
        chapterIds: [4],  // Structure of Atom
        label: 'Chemistry',
        description: 'Explore atomic models, quantum numbers & electronic configuration in full 3D.',
        accent: '#00FFFF',
    },
    physics: {
        chapterIds: [4],  // Laws of Motion
        label: 'Physics',
        description: "Experience Newton's laws, friction & circular motion with interactive simulations.",
        accent: '#FF6B6B',
    },
    maths: {
        chapterIds: ['2'],  // Trigonometry-1
        label: 'Mathematics',
        description: 'Visualize the unit circle, trig functions & identities with live plotters.',
        accent: '#FFD93D',
    }
};

/**
 * Check if a chapter is available in demo mode
 */
export function isDemoChapter(subject, chapterId) {
    const config = DEMO_CONFIG[subject];
    if (!config) return false;
    return config.chapterIds.includes(chapterId);
}

/**
 * Get the total number of free demo topics
 */
export function getDemoTopicCount() {
    return Object.values(DEMO_CONFIG).reduce(
        (sum, cfg) => sum + cfg.chapterIds.length, 0
    );
}
