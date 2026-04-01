export default function ChapterList({ chapters, chapterDone }) {
    return (
        <div style={{ padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, opacity: 0.1, marginBottom: 12 }}>⚛</div>
            <div style={{ fontSize: 16, color: 'var(--text3)' }}>
                Select a chapter from the sidebar to begin
            </div>
        </div>
    )
}