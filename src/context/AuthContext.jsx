import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageAdapter } from '../services/storageAdapter';
import { DEMO_USERS } from '../data/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fb_active_user_v1');
      if (saved) return JSON.parse(saved);
      // Default to Donor for immediate exploration
      return DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fb_active_user_v1', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('fb_active_user_v1');
    }
  }, [currentUser]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const users = storageAdapter.getUsers();
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase().trim()
      );

      if (!user) {
        throw new Error('User not found. Try one of the 1-click demo accounts.');
      }

      // In demo mode we check simple password or allow password123
      if (user.password && user.password !== password && password !== 'password123') {
        throw new Error('Invalid credentials.');
      }

      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login switcher
  const switchDemoRole = (role) => {
    const demoUser = DEMO_USERS.find(u => u.role === role);
    if (demoUser) {
      // Refresh user record from storage in case points were updated
      const users = storageAdapter.getUsers();
      const freshUser = users.find(u => u.id === demoUser.id) || demoUser;
      setCurrentUser(freshUser);
      return freshUser;
    }
  };

  // Register Handler
  const register = async ({ name, email, password, role, organization, phone, address, donorType, ngoType, vehicleType }) => {
    setLoading(true);
    try {
      // CRITICAL SECURITY ENFORCEMENT: Never allow registration as 'admin' directly!
      if (role === 'admin') {
        throw new Error('Unauthorized role selection: Administrator accounts cannot be created via public registration. Only existing Platform Admins can delegate administrative rights.');
      }

      const users = storageAdapter.getUsers();
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase().trim(),
        password,
        role,
        organization: organization || name,
        phone: phone || '+1 (555) 000-0000',
        address: address || 'Metro City Area',
        lat: 40.7150 + (Math.random() - 0.5) * 0.04,
        lng: -74.0020 + (Math.random() - 0.5) * 0.04,
        verified: role === 'ngo' ? false : true, // NGOs start unverified until admin review!
        verificationStatus: role === 'ngo' ? 'pending' : 'approved',
        impactPoints: 0,
        badges: [],
        joinedDate: new Date().toISOString().split('T')[0],
        donorType: donorType || null,
        ngoType: ngoType || null,
        vehicleType: vehicleType || null,
        isDemo: true,
      };

      storageAdapter.saveUser(newUser);
      setCurrentUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    storageAdapter.saveUser(updated);
    setCurrentUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        switchDemoRole,
        updateProfile,
        isDemoMode: storageAdapter.isDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
