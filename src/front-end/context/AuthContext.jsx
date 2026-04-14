import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { getMeRequest } from '../api/auth.api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem(STORAGE_KEYS.TOKEN) || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      if (savedToken) {
        try {
          const data = await getMeRequest();
          setUser(data.user);
        } catch (err) {
          setUser(null);
          setToken(null);
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = useCallback((userData, userToken) => {
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
  };

  if (loading) {
    return (
      <div style={loaderStyles.container}>
        <div style={loaderStyles.spinner} />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

const loaderStyles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #334155',
    borderTop: '3px solid #6366f1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
};

const styleSheet = document.createElement('style');
styleSheet.innerText = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleSheet);