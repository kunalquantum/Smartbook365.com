import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

import { PRICING as STATIC_PRICING } from '../data/pricing';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default subscriptions for users who don't have them in DB yet
  const DEFAULT_SUBSCRIPTIONS = {
    physics: [1, 2, 3, 4], // Accessible chapter IDs
    chemistry: [1],
    maths: []
  };

  const [pricing, setPricing] = useState(STATIC_PRICING);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('smartbook_settings')
        .select('*')
        .eq('key', 'pricing')
        .single();
      
      if (!error && data?.value) {
        setPricing(data.value);
        return;
      }
    } catch (err) {
      console.log('Supabase unreachable for pricing');
    }
    // Fallback: localStorage
    try { const local = localStorage.getItem('sb_pricing'); if (local) setPricing(JSON.parse(local)); } catch { /* use static */ }
  };

  const updatePricing = async (newPricing) => {
    if (user?.role !== 'admin') return;
    localStorage.setItem('sb_pricing', JSON.stringify(newPricing));
    setPricing(newPricing);
    try {
      const { error } = await supabase
        .from('smartbook_settings')
        .upsert({ key: 'pricing', value: newPricing });
      if (error) throw error;
      return true;
    } catch (err) {
      console.log('Supabase unreachable — pricing saved to localStorage');
      return true;
    }
  };

  const [moduleVisibility, setModuleVisibility] = useState(null);
  const [demoConfig, setDemoConfig] = useState(null);

  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('sb_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        
        // Live Role Verification: Ensure admin role is still valid/detected
        try {
          const { data, error } = await supabase
            .from('Smartbook365Users')
            .select('role, subscriptions')
            .eq('id', parsed.id)
            .single();
          
          if (!error && data) {
            const updated = { 
              ...parsed, 
              role: data.role || (parsed.username === 'admin' ? 'admin' : 'user'),
              subscriptions: data.subscriptions || parsed.subscriptions
            };
            setUser(updated);
            localStorage.setItem('sb_user', JSON.stringify(updated));
          }
        } catch (e) { /* fallback to saved session if offline */ }
      }
      
      // Load global access settings
      const vis = await fetchModuleVisibility();
      const demo = await fetchDemoConfig();
      if (vis) setModuleVisibility(vis);
      if (demo) setDemoConfig(demo);
      
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // Query the Smartbook365Users table for matching username and password
      const { data: users, error } = await supabase
        .from('Smartbook365Users')
        .select('*')
        .eq('username', username)
        .eq('password', password);

      if (error || !users || users.length === 0) {
        throw new Error('Invalid username or password');
      }

      const data = users[0];

      const isAdmin = data.role === 'admin' || data.username === 'admin' || data.email === 'admin@smartbook.com';

      // Prepare user object with subscriptions
      const userProfile = {
        id: data.id,
        name: data.username,
        username: data.username,
        email: data.email || `${data.username}@smartbook.com`,
        role: isAdmin ? 'admin' : (data.role || 'user'),
        subscriptions: data.subscriptions || (isAdmin ? {
          physics: 'all',
          chemistry: 'all',
          maths: 'all'
        } : DEFAULT_SUBSCRIPTIONS)
      };

      setUser(userProfile);
      localStorage.setItem('sb_user', JSON.stringify(userProfile));
      return userProfile;
    } catch (err) {
      console.error('Login error:', err.message);
      throw err.message;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sb_user');
  };

  /**
   * Unified Access Check (The "Access Layer")
   * @param {string} subject - physics, chemistry, etc.
   * @param {string|number} chapterId - specific chapter ID
   * @param {boolean} isDemoRoute - whether we are on a /demo/ path
   */
  const checkAccess = (subject, chapterId = null, isDemoRoute = false) => {
    // 1. Admin Bypass - Absolute override
    if (user?.role === 'admin') return true;

    // 2. Demo Route Override
    // If we are specifically on a demo route, we only check if the chapter is in demo config
    if (isDemoRoute) {
      const demoChapters = demoConfig?.[subject]?.chapterIds || [];
      return demoChapters.includes(Number(chapterId)) || demoChapters.includes(String(chapterId));
    }

    // 3. Subscription Check
    if (!user) return false;
    const sub = user.subscriptions?.[subject];
    if (!sub) return false;
    if (sub === 'all') return true;
    
    // Check specific chapter ID if provided
    if (chapterId !== null) {
      const hasSub = Array.isArray(sub) && (sub.includes(Number(chapterId)) || sub.includes(String(chapterId)));
      if (hasSub) return true;
      
      // Also check if this is a demo chapter (even in standard mode, demo chapters are free)
      const demoChapters = demoConfig?.[subject]?.chapterIds || [];
      return demoChapters.includes(Number(chapterId)) || demoChapters.includes(String(chapterId));
    }

    return Array.isArray(sub) && sub.length > 0;
  };

  const hasAccess = (subject, chapterId = null) => checkAccess(subject, chapterId);

  const fetchUsers = async () => {
    if (user?.role !== 'admin') return [];
    try {
      const { data, error } = await supabase
        .from('Smartbook365Users')
        .select('*');
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching users:', err.message);
      return [];
    }
  };

  const updateSubscriptions = async (userId, newSubs) => {
    if (user?.role !== 'admin') return;
    try {
      const { error } = await supabase
        .from('Smartbook365Users')
        .update({ subscriptions: newSubs })
        .eq('id', userId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating subscriptions:', err.message);
      return false;
    }
  };

  const addNewUser = async (newUserData) => {
    if (user?.role !== 'admin') return;
    try {
      const { error } = await supabase
        .from('Smartbook365Users')
        .insert([{
          ...newUserData,
          subscriptions: newUserData.subscriptions || DEFAULT_SUBSCRIPTIONS
        }]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error adding user:', err.message);
      return false;
    }
  };

  const deleteUser = async (userId) => {
    if (user?.role !== 'admin') return false;
    try {
      const { error } = await supabase
        .from('Smartbook365Users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting user:', err.message);
      return false;
    }
  };

  const fetchModuleVisibility = async () => {
    try {
      const { data, error } = await supabase
        .from('smartbook_settings')
        .select('*')
        .eq('key', 'module_visibility')
        .single();
      if (!error && data?.value) return data.value;
    } catch { /* supabase unreachable */ }
    // Fallback: localStorage
    try { const local = localStorage.getItem('sb_module_visibility'); return local ? JSON.parse(local) : null; } catch { return null; }
  };

  const updateModuleVisibility = async (config) => {
    if (user?.role !== 'admin') return false;
    // Update local state for immediate feedback
    setModuleVisibility(config);
    // Always save to localStorage as fallback
    localStorage.setItem('sb_module_visibility', JSON.stringify(config));
    try {
      const { error } = await supabase
        .from('smartbook_settings')
        .upsert({ key: 'module_visibility', value: config });
      if (error) throw error;
      return true;
    } catch (err) {
      console.log('Supabase unreachable — saved to localStorage instead');
      return true; // still succeeds via localStorage
    }
  };

  const fetchDemoConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('smartbook_settings')
        .select('*')
        .eq('key', 'demo_config')
        .single();
      if (!error && data?.value) return data.value;
    } catch { /* supabase unreachable */ }
    // Fallback: localStorage
    try { const local = localStorage.getItem('sb_demo_config'); return local ? JSON.parse(local) : null; } catch { return null; }
  };

  const updateDemoConfig = async (config) => {
    if (user?.role !== 'admin') return false;
    // Update local state for immediate feedback
    setDemoConfig(config);
    // Always save to localStorage as fallback
    localStorage.setItem('sb_demo_config', JSON.stringify(config));
    try {
      const { error } = await supabase
        .from('smartbook_settings')
        .upsert({ key: 'demo_config', value: config });
      if (error) throw error;
      return true;
    } catch (err) {
      console.log('Supabase unreachable — saved to localStorage instead');
      return true; // still succeeds via localStorage
    }
  };

  const fetchChatbotKnowledge = async () => {
    try {
      const { data, error } = await supabase
        .from('smartbook_chatbot_knowledge')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      console.log('Supabase unreachable for chatbot knowledge');
      return [];
    }
  };

  const addChatbotKnowledge = async (entry) => {
    if (user?.role !== 'admin') return false;
    try {
      const { error } = await supabase
        .from('smartbook_chatbot_knowledge')
        .insert([entry]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error adding knowledge:', err.message);
      return false;
    }
  };

  const updateChatbotKnowledge = async (id, updates) => {
    if (user?.role !== 'admin') return false;
    try {
      const { error } = await supabase
        .from('smartbook_chatbot_knowledge')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error updating knowledge:', err.message);
      return false;
    }
  };

  const deleteChatbotKnowledge = async (id) => {
    if (user?.role !== 'admin') return false;
    try {
      const { error } = await supabase
        .from('smartbook_chatbot_knowledge')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting knowledge:', err.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      hasAccess, 
      checkAccess,
      loading, 
      fetchUsers, 
      updateSubscriptions,
      addNewUser,
      deleteUser,
      pricing,
      updatePricing,
      moduleVisibility,
      fetchModuleVisibility,
      updateModuleVisibility,
      demoConfig,
      fetchDemoConfig,
      updateDemoConfig,
      fetchChatbotKnowledge,
      addChatbotKnowledge,
      updateChatbotKnowledge,
      deleteChatbotKnowledge,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
