import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CHAPTERS as PHYSICS_CHAPTERS } from '../modules/physics/data/physics';
import { CHAPTERS as CHEMISTRY_CHAPTERS } from '../modules/chemistry/data/chapters';
import { chapters as MATHS_CHAPTERS } from '../modules/maths/data/chapters';

const AdminDashboard = () => {
  const { user, fetchUsers, updateSubscriptions, addNewUser, pricing, updatePricing, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'pricing'
  const [editingPricing, setEditingPricing] = useState(pricing);

  const subjects = [
    { id: 'physics', name: 'Physics', icon: '⚛️', chapters: PHYSICS_CHAPTERS },
    { id: 'chemistry', name: 'Chemistry', icon: '🧪', chapters: CHEMISTRY_CHAPTERS },
    { id: 'maths', name: 'Mathematics', icon: '📐', chapters: MATHS_CHAPTERS }
  ];

  useEffect(() => {
    if (authLoading) return;
    
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, authLoading]);

  useEffect(() => {
    setEditingPricing(pricing);
  }, [pricing]);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleToggleAccess = (subject, chapterId) => {
    if (!selectedUser) return;
    const currentSubs = { ...selectedUser.subscriptions };
    let sub = currentSubs[subject] || [];
    if (sub === 'all') return;
    
    let newSub;
    if (sub.includes(chapterId)) {
      newSub = sub.filter(id => id !== chapterId);
    } else {
      newSub = [...sub, chapterId];
    }
    setSelectedUser({ ...selectedUser, subscriptions: { ...currentSubs, [subject]: newSub } });
  };

  const handleToggleFullModule = (subject) => {
    if (!selectedUser) return;
    const currentSubs = { ...selectedUser.subscriptions };
    const isFull = currentSubs[subject] === 'all';
    setSelectedUser({ ...selectedUser, subscriptions: { ...currentSubs, [subject]: isFull ? [] : 'all' } });
  };

  const saveAccessChanges = async () => {
    setIsUpdating(true);
    const success = await updateSubscriptions(selectedUser.id, selectedUser.subscriptions);
    if (success) {
      alert('Access updated successfully!');
      loadData();
    }
    setIsUpdating(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    const success = await addNewUser(newUser);
    if (success) {
      alert('User added successfully!');
      setShowAddUserModal(false);
      setNewUser({ username: '', password: '' });
      loadData();
    }
  };

  const handleSavePricing = async () => {
    setIsUpdating(true);
    const success = await updatePricing(editingPricing);
    if (success) {
      alert('Pricing updated successfully!');
    } else {
      alert('Failed to update pricing. Ensure the "smartbook_settings" table exists in your Supabase DB.');
    }
    setIsUpdating(false);
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));

  if (authLoading || (loading && !users.length)) {
    return <div style={{ 
      minHeight: '100vh', 
      background: '#0f172a', 
      color: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'var(--sans)' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '10px' }}>🔐 Verifying Credentials...</div>
        <div style={{ color: '#94a3b8' }}>Please wait while we access the administrative console.</div>
      </div>
    </div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1f5f9', fontFamily: 'var(--sans)', padding: '40px' }}>
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Portal Management</h1>
          <p style={{ color: '#94a3b8', marginTop: '4px' }}>Administrative Control Center for Smartbook365</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('users')}
            style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'users' ? '#334155' : 'transparent', color: '#fff', border: '1px solid #334155', cursor: 'pointer' }}
          >
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('pricing')}
            style={{ padding: '10px 20px', borderRadius: '10px', background: activeTab === 'pricing' ? '#334155' : 'transparent', color: '#fff', border: '1px solid #334155', cursor: 'pointer' }}
          >
            Pricing Configuration
          </button>
        </div>
      </header>

      {activeTab === 'users' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
          <div style={{ background: '#1e293b', borderRadius: '24px', padding: '24px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Students</h3>
              <button onClick={() => setShowAddUserModal(true)} style={{ color: 'var(--amber)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600' }}>+ New</button>
            </div>
            <input 
              type="text" placeholder="Search username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff', marginBottom: '20px' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
              {filteredUsers.map(u => (
                <div key={u.id} onClick={() => setSelectedUser(u)}
                  style={{ padding: '16px', background: selectedUser?.id === u.id ? '#334155' : 'transparent', borderRadius: '12px', cursor: 'pointer', border: selectedUser?.id === u.id ? '1px solid var(--amber)' : '1px solid transparent' }}
                >
                  <div style={{ fontWeight: '600' }}>{u.username}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {String(u.id).substring(0, 8)}...</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: '#1e293b', borderRadius: '24px', padding: '40px', border: '1px solid #334155' }}>
            {selectedUser ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                  <div>
                    <h2 style={{ margin: 0 }}>Managing: {selectedUser.username}</h2>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Assign modules and chapters to this student</p>
                  </div>
                  <button onClick={saveAccessChanges} disabled={isUpdating}
                    style={{ padding: '14px 28px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {isUpdating ? 'Saving...' : 'Save All Changes'}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {subjects.map(sub => {
                    const isFull = selectedUser.subscriptions[sub.id] === 'all';
                    const activeChapters = Array.isArray(selectedUser.subscriptions[sub.id]) ? selectedUser.subscriptions[sub.id] : [];
                    return (
                      <div key={sub.id} style={{ borderBottom: '1px solid #334155', paddingBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '24px' }}>{sub.icon}</span><h4 style={{ margin: 0, fontSize: '18px' }}>{sub.name}</h4></div>
                          <button onClick={() => handleToggleFullModule(sub.id)}
                            style={{ padding: '6px 12px', background: isFull ? '#10b981' : 'transparent', color: isFull ? '#fff' : '#10b981', border: '1px solid #10b981', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                          >
                            {isFull ? '✓ FULL MODULE' : 'GRANT FULL ACCESS'}
                          </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', opacity: isFull ? 0.5 : 1, pointerEvents: isFull ? 'none' : 'auto' }}>
                          {sub.chapters.map(ch => {
                            const hasAccess = activeChapters.includes(ch.id);
                            return (
                              <div key={ch.id} onClick={() => handleToggleAccess(sub.id, ch.id)}
                                style={{ padding: '12px 16px', background: hasAccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${hasAccess ? '#10b981' : '#334155'}`, borderRadius: '12px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}
                              >
                                <div style={{ width: '16px', height: '16px', border: '2px solid #10b981', borderRadius: '4px', background: hasAccess ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px' }}>{hasAccess && '✓'}</div>
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
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>👤</div>
                <p>Select a student from the sidebar to manage their access rights.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Pricing Tab */
        <div style={{ background: '#1e293b', borderRadius: '32px', padding: '48px', border: '1px solid #334155', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h2 style={{ margin: 0 }}>Pricing Configuration</h2>
              <p style={{ color: '#94a3b8', marginTop: '4px' }}>Set global costs for modules and individual chapters</p>
            </div>
            <button onClick={handleSavePricing} disabled={isUpdating}
              style={{ padding: '14px 28px', background: 'var(--amber)', color: '#000', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isUpdating ? 'Updating...' : 'Save Pricing'}
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {subjects.map(sub => (
              <div key={sub.id} style={{ background: '#0f172a', padding: '24px', borderRadius: '20px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '24px' }}>{sub.icon}</span>
                  <h4 style={{ margin: 0, fontSize: '18px' }}>{sub.name} Module</h4>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>FULL MODULE COST (₹)</label>
                    <input 
                      type="number" value={editingPricing[sub.id].fullPrice} 
                      onChange={e => setEditingPricing({...editingPricing, [sub.id]: {...editingPricing[sub.id], fullPrice: Number(e.target.value)}})}
                      style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>CHAPTER COST (₹)</label>
                    <input 
                      type="number" value={editingPricing[sub.id].chapterPrice} 
                      onChange={e => setEditingPricing({...editingPricing, [sub.id]: {...editingPricing[sub.id], chapterPrice: Number(e.target.value)}})}
                      style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '24px', width: '400px', border: '1px solid #334155' }}>
            <h2 style={{ marginBottom: '24px' }}>Add New Student</h2>
            <form onSubmit={handleAddUser}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>USERNAME</label>
                <input type="text" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
              </div>
              <div style={{ marginBottom: '32px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>PASSWORD</label>
                <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                  style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setShowAddUserModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #334155', borderRadius: '12px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '12px', background: 'var(--amber)', border: 'none', borderRadius: '12px', color: '#000', fontWeight: '700', cursor: 'pointer' }}>Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
