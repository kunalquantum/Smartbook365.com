import TopicSection from './TopicSection'
import BranchBadge from '../ui/BranchBadge'
import { SIMULATORS } from '../../simulators'

const BRANCH_COLOR = {
    Physical: '#EF9F27', Inorganic: '#1D9E75',
    Organic: '#7F77DD', Analytical: '#D85A30',
    Nuclear: '#378ADD', Applied: '#EF9F27',
}

export default function ChapterPage({ chapter, done, onToggle }) {
    const bColor = BRANCH_COLOR[chapter.branch] || 'var(--gold)'
    const doneCount = chapter.topics.filter((_, i) => done.has(`${chapter.id}-${i}`)).length
    const pct = Math.round((doneCount / chapter.topics.length) * 100)

    return (
        <div style={{ padding: '26px 28px 60px' }}>
            {/* Chapter header */}
            <div style={{ marginBottom: 28, paddingBottom: 22, borderBottom: '1px solid var(--border)' }}>
                <BranchBadge branch={chapter.branch} />
                <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', margin: '10px 0 8px' }}>
                    Chapter {chapter.id}: {chapter.title}
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 600, lineHeight: 1.7, margin: '0 0 14px' }}>
                    {chapter.desc}
                </p>
                {/* Progress */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1, maxWidth: 300, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: bColor, transition: 'width 0.4s', borderRadius: 2 }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--text3)' }}>
                        {doneCount}/{chapter.topics.length} topics done
                    </span>
                </div>
            </div>

            {/* Topic sections */}
            {chapter.topics.map((topic, i) => {
                const key = `ch${String(chapter.id).padStart(2, '0')}_t${i}`
                const Simulator = SIMULATORS[key] || null
                return (
                    <TopicSection
                        key={i}
                        topic={topic}
                        index={i}
                        chId={chapter.id}
                        branch={chapter.branch}
                        isDone={done.has(`${chapter.id}-${i}`)}
                        onToggle={onToggle}
                        Simulator={Simulator}
                    />
                )
            })}
        </div>
    )
}