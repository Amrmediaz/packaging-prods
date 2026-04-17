import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getMeRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(STORAGE_KEYS.TOKEN) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (savedToken) {
        try {
          const data = await getMeRequest();
          // DEBUG: Verify what the backend is sending
          console.log("Auth Verify User Data:", data.user);
          setUser(data.user);
        } catch (err) {
          console.error("Token verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const can = useCallback((module, action) => {
    if (!user) return false;
    
    // 1. Super Admin Bypass
    if (user.role === 'Super Admin') return true;

    // 2. Permission Check
    // Using !! to force a boolean return
    const hasPermission = !!user.permissions?.[module]?.[action];
    
    // DEBUG: Only uncomment if you need to trace the failure
    // console.log(`Checking ${module}.${action}:`, hasPermission);
    
    return hasPermission;
  }, [user]);

  const login = useCallback((userData, userToken) => {
    console.log("Login UserData Received:", userData); // Check for permissions here
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, userToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }, []);

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading,
    can,
  };

  if (loading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.spinner} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// Keeping your Pack'n style colors for the loader
const loaderStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc', // Light Pack'n Background
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTop: '3px solid #00a3e0', // Pack'n Blue
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};