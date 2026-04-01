import TopicSection from '../book/TopicSection'
import { SIMULATORS } from '../../simulators'

export default function ChapterView({ chapter }) {
    return (
        <div style={{ padding: '28px 28px 60px' }}>
            {/* Chapter header */}
            <div style={{ marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
                <div style={{
                    fontFamily: 'var(--mono)', fontSize: 10,
                    color: 'var(--teal)', letterSpacing: 2, marginBottom: 6,
                }}>
                    {chapter.unit}
                </div>
                <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text1)', marginBottom: 8 }}>
                    Chapter {chapter.id}: {chapter.title}
                </h1>
                <p style={{ fontSize: 15, color: 'var(--text2)', maxWidth: 600, lineHeight: 1.7 }}>
                    {chapter.desc}
                </p>
            </div>

            {/* Topic sections — each has concept + formula + simulator */}
            {chapter.topics.map((topic, i) => {
                const key = `ch${String(chapter.id).padStart(2, '0')}_t${i}`
                const Simulator = SIMULATORS[key] || null
                return (
                    <TopicSection key={i} topic={topic} Simulator={Simulator} />
                )
            })}
        </div>
    )
}