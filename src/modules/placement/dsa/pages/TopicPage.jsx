import s from './TopicPage.module.css';

export default function TopicPage({ tabs, active, setActive, accent = 'var(--cyan)' }) {
  const Tab = tabs.find(t => t.id === active)?.component;
  return (
    <div className={s.page}>
      <div className={s.tabBar}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`${s.tab} ${active === t.id ? s.activeTab : ''}`}
            style={active === t.id ? { '--accent': accent, color: accent } : {}}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className={s.body}>
        {Tab && <Tab />}
      </div>
    </div>
  );
}
