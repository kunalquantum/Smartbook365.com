import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CHAPTERS as PHYSICS_CHAPTERS } from '../modules/physics/data/physics';
import { CHAPTERS as CHEMISTRY_CHAPTERS } from '../modules/chemistry/data/chapters';
import { chapters as MATHS_CHAPTERS } from '../modules/maths/data/chapters';
import { DOMAIN_CATALOG } from '../data/learningCatalog';
import { DEMO_CONFIG as STATIC_DEMO } from '../config/demoConfig';
import '../styles/admin.css';

const TABS = [
  { id: 'overview', label: 'Overview', icon: '◈' },
  { id: 'users', label: 'Users & Access', icon: '⬡' },
  { id: 'pricing', label: 'Pricing', icon: '◆' },
  { id: 'visibility', label: 'Modules', icon: '◉' },
  { id: 'demo', label: 'Demo Config', icon: '▣' },
  { id: 'chatbot', label: 'Chatbot Knowledge', icon: '🧠' },
];

const SUBJECTS = [
  { id: 'physics', name: 'Physics', icon: '⚛️', chapters: PHYSICS_CHAPTERS },
  { id: 'chemistry', name: 'Chemistry', icon: '🧪', chapters: CHEMISTRY_CHAPTERS },
  { id: 'maths', name: 'Mathematics', icon: '📐', chapters: MATHS_CHAPTERS },
];

const Toggle = ({ checked, onChange }) => (
  <label className="admin-toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <div className="admin-toggle-track" />
    <div className="admin-toggle-thumb" />
  </label>
);

const Toast = ({ message, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className={`admin-toast ${type === 'error' ? 'error' : ''}`}>{message}</div>;
};

const AdminDashboard = () => {
  const {
    user, fetchUsers, updateSubscriptions, addNewUser, deleteUser,
    pricing, updatePricing,
    fetchModuleVisibility, updateModuleVisibility,
    fetchDemoConfig, updateDemoConfig,
    fetchChatbotKnowledge, addChatbotKnowledge, updateChatbotKnowledge, deleteChatbotKnowledge,
    loading: authLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selUser, setSelUser] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editPricing, setEditPricing] = useState(pricing);
  const [toast, setToast] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Chatbot Knowledge State
  const [knowledge, setKnowledge] = useState([]);
  const [editKnowledge, setEditKnowledge] = useState(null);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

  // Module visibility state
  const [visibility, setVisibility] = useState(() => {
    const init = {};
    DOMAIN_CATALOG.forEach(d => { init[d.id] = { visible: true, status: d.status }; });
    return init;
  });

  // Demo config state
  const [demoConf, setDemoConf] = useState(STATIC_DEMO);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadAll();
  }, [user, authLoading]);

  useEffect(() => { setEditPricing(pricing); }, [pricing]);

  const loadAll = async () => {
    setLoading(true);
    const [userData, visData, demoData, knowData] = await Promise.all([
      fetchUsers(),
      fetchModuleVisibility(),
      fetchDemoConfig(),
      fetchChatbotKnowledge(),
    ]);
    setUsers(userData || []);
    if (visData) setVisibility(visData);
    if (demoData) setDemoConf(demoData);
    setKnowledge(knowData || []);
    setLoading(false);
  };

  // ── User Handlers ──
  const handleSelectUser = u => setSelUser(u);

  const handleToggleAccess = (subId, chId) => {
    if (!selUser) return;
    const subs = { ...selUser.subscriptions };
    let s = subs[subId] || [];
    if (s === 'all') return;
    subs[subId] = s.includes(chId) ? s.filter(i => i !== chId) : [...s, chId];
    setSelUser({ ...selUser, subscriptions: subs });
  };

  const handleToggleFull = subId => {
    if (!selUser) return;
    const subs = { ...selUser.subscriptions };
    subs[subId] = subs[subId] === 'all' ? [] : 'all';
    setSelUser({ ...selUser, subscriptions: subs });
  };

  const saveAccess = async () => {
    setBusy(true);
    const ok = await updateSubscriptions(selUser.id, selUser.subscriptions);
    showToast(ok ? 'Access updated' : 'Failed to update', ok ? 'success' : 'error');
    if (ok) loadAll();
    setBusy(false);
  };

  const handleAddUser = async e => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    const ok = await addNewUser(newUser);
    showToast(ok ? 'User created' : 'Failed to create user', ok ? 'success' : 'error');
    if (ok) { setShowAddModal(false); setNewUser({ username: '', password: '' }); loadAll(); }
  };

  const handleDeleteUser = async userId => {
    if (!window.confirm('Delete this user permanently?')) return;
    setBusy(true);
    const ok = await deleteUser(userId);
    showToast(ok ? 'User deleted' : 'Failed to delete', ok ? 'success' : 'error');
    if (ok) { setSelUser(null); loadAll(); }
    setBusy(false);
  };

  // ── Pricing Handlers ──
  const savePricing = async () => {
    setBusy(true);
    const ok = await updatePricing(editPricing);
    showToast(ok ? 'Pricing saved' : 'Failed — ensure smartbook_settings table exists', ok ? 'success' : 'error');
    setBusy(false);
  };

  // ── Visibility Handlers ──
  const saveVisibility = async () => {
    setBusy(true);
    const ok = await updateModuleVisibility(visibility);
    showToast(ok ? 'Module visibility saved' : 'Failed to save', ok ? 'success' : 'error');
    setBusy(false);
  };

  // ── Demo Handlers ──
  const toggleDemoChapter = (subId, chId) => {
    setDemoConf(prev => {
      const current = prev[subId]?.chapterIds || [];
      const next = current.includes(chId) ? current.filter(i => i !== chId) : [...current, chId];
      return { ...prev, [subId]: { ...prev[subId], chapterIds: next } };
    });
  };

  const saveDemo = async () => {
    setBusy(true);
    const ok = await updateDemoConfig(demoConf);
    showToast(ok ? 'Demo config saved' : 'Failed to save', ok ? 'success' : 'error');
    setBusy(false);
  };

  // ── Chatbot Knowledge Handlers ──
  const handleSaveKnowledge = async (e) => {
    e.preventDefault();
    setBusy(true);
    let ok = false;
    if (editKnowledge.id) {
      ok = await updateChatbotKnowledge(editKnowledge.id, editKnowledge);
    } else {
      ok = await addChatbotKnowledge(editKnowledge);
    }
    showToast(ok ? 'Knowledge saved' : 'Failed to save', ok ? 'success' : 'error');
    if (ok) {
      setShowKnowledgeModal(false);
      loadAll();
    }
    setBusy(false);
  };

  const handleDeleteKnowledge = async (id) => {
    if (!window.confirm('Delete this knowledge entry permanently?')) return;
    setBusy(true);
    const ok = await deleteChatbotKnowledge(id);
    showToast(ok ? 'Knowledge deleted' : 'Failed to delete', ok ? 'success' : 'error');
    if (ok) loadAll();
    setBusy(false);
  };

  const filtered = users.filter(u => 
    u.username?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalModules = DOMAIN_CATALOG.length;
  const liveModules = Object.values(visibility).filter(v => v.visible).length;

  // ── Loading ──
  if (authLoading || (loading && !users.length)) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b0b0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#00ffff' }}>
          <div style={{ width: 48, height: 48, border: '2px solid rgba(0,255,255,0.1)', borderTopColor: '#00ffff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto 20px' }} />
          <div style={{ fontFamily: 'Michroma', fontSize: '0.75rem', letterSpacing: '0.15em' }}>VERIFYING CREDENTIALS</div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Mobile toggle */}
      <button className="admin-mobile-toggle" onClick={() => setMobileOpen(o => !o)}>☰</button>
      <div className={`admin-mobile-overlay ${mobileOpen ? 'show' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <h2>Smartbook</h2>
          <span>Admin Console</span>
        </div>
        <nav className="admin-sidebar-nav">
          {TABS.map(t => (
            <button key={t.id} className={`admin-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setMobileOpen(false); }}>
              <span className="admin-nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-logout-btn" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>← BACK TO SITE</Link>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ════ OVERVIEW ════ */}
        {tab === 'overview' && (
          <>
            <div className="admin-page-header">
              <h1>Overview</h1>
              <p>Platform status at a glance</p>
            </div>
            <div className="admin-stats-grid">
              <div className="admin-stat-card" style={{ '--stat-accent': '#00ffff', '--stat-glow': 'rgba(0,255,255,0.15)' }}>
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{users.length}</div>
                <div className="stat-sub">Registered accounts</div>
              </div>
              <div className="admin-stat-card" style={{ '--stat-accent': '#10b981', '--stat-glow': 'rgba(16,185,129,0.15)' }}>
                <div className="stat-label">Live Modules</div>
                <div className="stat-value">{liveModules}/{totalModules}</div>
                <div className="stat-sub">Domains active</div>
              </div>
              <div className="admin-stat-card" style={{ '--stat-accent': '#f59e0b', '--stat-glow': 'rgba(245,158,11,0.15)' }}>
                <div className="stat-label">Subjects</div>
                <div className="stat-value">{SUBJECTS.length}</div>
                <div className="stat-sub">Physics, Chemistry, Maths</div>
              </div>
              <div className="admin-stat-card" style={{ '--stat-accent': '#a78bfa', '--stat-glow': 'rgba(167,139,250,0.15)' }}>
                <div className="stat-label">Demo Chapters</div>
                <div className="stat-value">{Object.values(demoConf).reduce((s, c) => s + (c.chapterIds?.length || 0), 0)}</div>
                <div className="stat-sub">Free access chapters</div>
              </div>
            </div>
            <div className="admin-card">
              <div className="admin-card-header"><h3>Quick Actions</h3></div>
              <div className="admin-card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="admin-btn" onClick={() => setTab('users')}>Manage Users</button>
                <button className="admin-btn" onClick={() => setTab('pricing')}>Edit Pricing</button>
                <button className="admin-btn" onClick={() => setTab('visibility')}>Module Controls</button>
                <button className="admin-btn" onClick={() => setTab('demo')}>Demo Settings</button>
              </div>
            </div>
          </>
        )}

        {/* ════ USERS & ACCESS ════ */}
        {tab === 'users' && (
          <>
            <div className="admin-page-header">
              <h1>Users & Access</h1>
              <p>Manage student accounts and chapter-level access control</p>
            </div>
            <div className="admin-split">
              {/* User List */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <h3>Students</h3>
                  <button className="admin-btn small" onClick={() => setShowAddModal(true)}>+ New</button>
                </div>
                <div className="admin-card-body">
                  <input className="admin-input" placeholder="Search username..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16 }} />
                  <div className="admin-user-list">
                    {filtered.map(u => {
                      const isOwner = u.username === 'admin' || u.email === 'admin@smartbook.com';
                      return (
                        <div key={u.id} className={`admin-user-item ${selUser?.id === u.id ? 'active' : ''}`} onClick={() => handleSelectUser(u)}>
                          <div style={{ flex: 1 }}>
                            <div className="user-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              {u.username}
                              {isOwner && <span style={{ fontSize: '0.6rem', background: 'var(--primary)', color: '#000', padding: '1px 4px', borderRadius: 2 }}>OWNER</span>}
                            </div>
                            <div className="user-meta">{u.email || `${u.username}@smartbook.com`}</div>
                          </div>
                          <span className="user-role-badge" style={{ 
                            color: u.role === 'admin' ? '#00ffff' : '#888', 
                            borderColor: u.role === 'admin' ? 'rgba(0,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                            fontSize: '0.65rem'
                          }}>
                            {(u.role || 'user').toUpperCase()}
                          </span>
                        </div>
                      );
                    })}
                    {filtered.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--adm-text3)', fontSize: '0.8rem' }}>No users found</div>}
                  </div>
                </div>
              </div>

              {/* User Detail */}
              <div className="admin-card">
                {selUser ? (
                  <>
                    <div className="admin-card-header">
                      <div>
                        <h3 style={{ marginBottom: 4 }}>Managing: {selUser.username}</h3>
                        <span style={{ fontSize: '0.65rem', color: 'var(--adm-text3)' }}>Assign modules and chapters</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="admin-btn danger small" onClick={() => handleDeleteUser(selUser.id)} disabled={busy}>Delete</button>
                        <button className="admin-btn success small" onClick={saveAccess} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
                      </div>
                    </div>
                    <div className="admin-card-body">
                      {SUBJECTS.map(sub => {
                        const isFull = selUser.subscriptions?.[sub.id] === 'all';
                        const active = Array.isArray(selUser.subscriptions?.[sub.id]) ? selUser.subscriptions[sub.id] : [];
                        return (
                          <div key={sub.id} className="admin-subject-block">
                            <div className="admin-subject-head">
                              <div className="admin-subject-title">
                                <span className="icon">{sub.icon}</span>
                                <h4>{sub.name}</h4>
                              </div>
                              <button className={`admin-btn small ${isFull ? 'success' : ''}`} onClick={() => handleToggleFull(sub.id)} style={isFull ? { background: 'var(--adm-green)', color: '#fff' } : {}}>
                                {isFull ? '✓ FULL ACCESS' : 'GRANT FULL'}
                              </button>
                            </div>
                            <div className="admin-chapter-grid" style={{ opacity: isFull ? 0.4 : 1, pointerEvents: isFull ? 'none' : 'auto' }}>
                              {sub.chapters.map(ch => {
                                const has = active.includes(ch.id);
                                return (
                                  <div key={ch.id} className={`admin-chapter-item ${has ? 'checked' : ''}`} onClick={() => handleToggleAccess(sub.id, ch.id)}>
                                    <div className="admin-check-box">{has && '✓'}</div>
                                    <span>Ch {ch.id}: {ch.title}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="admin-card-body" style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
                    <span style={{ fontSize: '3rem', opacity: 0.3 }}>⬡</span>
                    <p style={{ color: 'var(--adm-text3)', fontSize: '0.82rem' }}>Select a student to manage access</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ════ PRICING ════ */}
        {tab === 'pricing' && (
          <>
            <div className="admin-page-header">
              <h1>Pricing Control</h1>
              <p>Set global costs for modules and individual chapters</p>
            </div>
            <div className="admin-card" style={{ maxWidth: 800 }}>
              <div className="admin-card-header">
                <h3>Module Pricing</h3>
                <button className="admin-btn primary small" onClick={savePricing} disabled={busy}>{busy ? 'Saving…' : 'Save Pricing'}</button>
              </div>
              <div className="admin-card-body">
                {SUBJECTS.map(sub => (
                  <div key={sub.id} className="admin-subject-block">
                    <div className="admin-subject-title" style={{ marginBottom: 16 }}>
                      <span className="icon">{sub.icon}</span>
                      <h4>{sub.name}</h4>
                    </div>
                    <div className="admin-pricing-grid">
                      <div>
                        <label className="admin-label">Full Module Cost (₹)</label>
                        <input className="admin-input" type="number" value={editPricing?.[sub.id]?.fullPrice || 0}
                          onChange={e => setEditPricing({ ...editPricing, [sub.id]: { ...editPricing[sub.id], fullPrice: Number(e.target.value) } })} />
                      </div>
                      <div>
                        <label className="admin-label">Per Chapter Cost (₹)</label>
                        <input className="admin-input" type="number" value={editPricing?.[sub.id]?.chapterPrice || 0}
                          onChange={e => setEditPricing({ ...editPricing, [sub.id]: { ...editPricing[sub.id], chapterPrice: Number(e.target.value) } })} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ════ MODULE VISIBILITY ════ */}
        {tab === 'visibility' && (
          <>
            <div className="admin-page-header">
              <h1>Module Visibility</h1>
              <p>Control which domains appear on the landing page and their status labels</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="admin-btn primary small" onClick={saveVisibility} disabled={busy}>{busy ? 'Saving…' : 'Save Changes'}</button>
            </div>
            <div className="admin-module-grid">
              {DOMAIN_CATALOG.map(domain => {
                const vis = visibility[domain.id] || { visible: true, status: domain.status };
                return (
                  <div key={domain.id} className="admin-module-card" style={{ '--mod-accent': domain.accent, '--mod-glow': domain.glow, opacity: vis.visible ? 1 : 0.5 }}>
                    <div className="admin-module-card-head">
                      <div>
                        <span className="admin-status-badge" style={{ marginBottom: 8, display: 'inline-flex', color: domain.accent, borderColor: domain.accent + '40' }}>
                          {domain.code}
                        </span>
                        <h4>{domain.title}</h4>
                      </div>
                      <Toggle checked={vis.visible} onChange={() => setVisibility(p => ({ ...p, [domain.id]: { ...vis, visible: !vis.visible } }))} />
                    </div>
                    <p>{domain.summary}</p>
                    <div className="admin-status-input">
                      <label className="admin-label">Status Label</label>
                      <input className="admin-input" value={vis.status || ''} onChange={e => setVisibility(p => ({ ...p, [domain.id]: { ...vis, status: e.target.value } }))} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ════ DEMO CONFIG ════ */}
        {tab === 'demo' && (
          <>
            <div className="admin-page-header">
              <h1>Demo Configuration</h1>
              <p>Select which chapters are freely accessible without login</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="admin-btn primary small" onClick={saveDemo} disabled={busy}>{busy ? 'Saving…' : 'Save Demo Config'}</button>
            </div>
            <div className="admin-card">
              <div className="admin-card-body">
                {SUBJECTS.map(sub => {
                  const ids = demoConf[sub.id]?.chapterIds || [];
                  return (
                    <div key={sub.id} className="admin-subject-block">
                      <div className="admin-subject-head">
                        <div className="admin-subject-title">
                          <span className="icon">{sub.icon}</span>
                          <h4>{sub.name}</h4>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--adm-text3)' }}>{ids.length} chapter{ids.length !== 1 ? 's' : ''} free</span>
                      </div>
                      <div className="admin-chapter-grid">
                        {sub.chapters.map(ch => {
                          const isFree = ids.includes(ch.id);
                          return (
                            <div key={ch.id} className={`admin-chapter-item ${isFree ? 'checked' : ''}`} onClick={() => toggleDemoChapter(sub.id, ch.id)}>
                              <div className="admin-check-box">{isFree && '✓'}</div>
                              <span>Ch {ch.id}: {ch.title}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ════ CHATBOT KNOWLEDGE ════ */}
        {tab === 'chatbot' && (
          <>
            <div className="admin-page-header">
              <h1>Chatbot Knowledge Base</h1>
              <p>Manage FAQs, topics, and custom responses for the AI assistant</p>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
              <button className="admin-btn primary small" onClick={() => { setEditKnowledge({ title: '', body: '', tags: [], faq: false, quick_replies: [] }); setShowKnowledgeModal(true); }}>+ Add Entry</button>
            </div>
            <div className="admin-card">
              <div className="admin-card-body">
                {knowledge.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--adm-text3)' }}>No knowledge entries found.</div>
                ) : (
                  <div className="admin-user-list">
                    {knowledge.map(entry => (
                      <div key={entry.id} className="admin-user-item" style={{ cursor: 'default', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div className="user-name" style={{ marginBottom: 4 }}>
                            {entry.title} {entry.faq && <span className="admin-status-badge" style={{ marginLeft: 8, fontSize: '0.6rem' }}>FAQ</span>}
                          </div>
                          <div className="user-meta" style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {entry.tags?.map((tag, i) => (
                              <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>#{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="admin-btn small" onClick={() => { setEditKnowledge(entry); setShowKnowledgeModal(true); }}>Edit</button>
                          <button className="admin-btn small danger" onClick={() => handleDeleteKnowledge(entry.id)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Knowledge Modal */}
      {showKnowledgeModal && (
        <div className="admin-modal-overlay" onClick={() => setShowKnowledgeModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <h2>{editKnowledge?.id ? 'Edit Entry' : 'Add Knowledge Entry'}</h2>
            <form onSubmit={handleSaveKnowledge}>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Title / Query</label>
                <input required className="admin-input" value={editKnowledge?.title || ''} onChange={e => setEditKnowledge({ ...editKnowledge, title: e.target.value })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Response Body (Markdown supported)</label>
                <textarea required className="admin-input" rows={4} value={editKnowledge?.body || ''} onChange={e => setEditKnowledge({ ...editKnowledge, body: e.target.value })} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="admin-label">Tags (comma separated)</label>
                <input className="admin-input" placeholder="e.g. pricing, login, help" value={(editKnowledge?.tags || []).join(', ')} onChange={e => setEditKnowledge({ ...editKnowledge, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={editKnowledge?.faq || false} onChange={e => setEditKnowledge({ ...editKnowledge, faq: e.target.checked })} />
                  Show as Suggested FAQ
                </label>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setShowKnowledgeModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn primary" disabled={busy} style={{ flex: 1 }}>{busy ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="admin-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Student</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: 20 }}>
                <label className="admin-label">Username</label>
                <input className="admin-input" type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
              </div>
              <div style={{ marginBottom: 8 }}>
                <label className="admin-label">Password</label>
                <input className="admin-input" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn" onClick={() => setShowAddModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="admin-btn primary" style={{ flex: 1 }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
};

export default AdminDashboard;
