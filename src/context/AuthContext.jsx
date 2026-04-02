import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
      const { data, error } = await supabase
        .from('Smartbook365Users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid username or password');
      }

      // Prepare user object with subscriptions
      // We assume data might have a 'subscriptions' column (jsonb)
      // If not, we use the default ones
      const userProfile = {
        id: data.id,
        name: data.username,
        username: data.username,
        email: `${data.username}@smartbook.com`, // Fallback for email-based UI
        role: data.username === 'admin' ? 'admin' : 'user',
        subscriptions: data.subscriptions || (data.username === 'admin' ? {
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

  return (
    <AuthContext.Provider value={{ user, login, logout, hasAccess, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
