import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, removeToken, getCurrentUser, setCurrentUser } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.login(email, password);
      const { token, user: userData } = res.data;
      setToken(token);
      setCurrentUser(userData);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.register(userData);
      const { token, user: newUser } = res.data;
      setToken(token);
      setCurrentUser(newUser);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setCurrentUser(null);
    setUser(null);
  };

  // 1-Click Demo Login Helper for Rapid Role Evaluation
  const loginDemo = async (role = 'patient') => {
    const creds = {
      patient: { email: 'patient@health.com', password: 'password123' },
      doctor: { email: 'doctor.sarah@health.com', password: 'password123' },
      admin: { email: 'admin@health.com', password: 'password123' }
    };
    const target = creds[role] || creds.patient;
    return await login(target.email, target.password);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || 'guest',
      isAuthenticated: !!user,
      loading,
      error,
      login,
      register,
      logout,
      loginDemo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
