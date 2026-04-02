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
      
      if (data && data.value) {
        setPricing(data.value);
      }
    } catch (err) {
      console.log('Using static pricing (dynamic table not ready)');
    }
  };

  const updatePricing = async (newPricing) => {
    if (user?.role !== 'admin') return;
    try {
      const { error } = await supabase
        .from('smartbook_settings')
        .upsert({ key: 'pricing', value: newPricing });
      
      if (error) throw error;
      setPricing(newPricing);
      return true;
    } catch (err) {
      console.error('Error updating pricing:', err.message);
      return false;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('sb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
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

      // Prepare user object with subscriptions
      // We assume data might have a 'subscriptions' column (jsonb)
      // If not, we use the default ones
      const userProfile = {
        id: data.id,
        name: data.username,
        username: data.username,
        email: `${data.username}@smartbook.com`, // Fallback for email-based UI
        role: data.role || (data.username === 'admin' ? 'admin' : 'user'),
        subscriptions: data.subscriptions || ( (data.role === 'admin' || data.username === 'admin') ? {
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

  const hasAccess = (subject, chapterId = null) => {
    if (!user) return false;
    const sub = user.subscriptions[subject];
    if (!sub) return false;
    if (sub === 'all') return true;
    if (chapterId === null) return sub.length > 0;
    return sub.includes(Number(chapterId));
  };

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

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      hasAccess, 
      loading, 
      fetchUsers, 
      updateSubscriptions,
      addNewUser,
      pricing,
      updatePricing
    }}>
      {children}
    </AuthContext.Provider>
  );
};
