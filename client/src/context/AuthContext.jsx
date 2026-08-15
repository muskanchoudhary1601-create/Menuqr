import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

// Provides the current user/restaurant + auth actions to the whole app.
// On mount, it checks /api/auth/me to see if the HTTP-only cookie is still valid,
// so a page refresh doesn't log the user out.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setRestaurant(data.restaurant);
    } catch (error) {
      setUser(null);
      setRestaurant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    setUser(data.user);
    setRestaurant(data.restaurant);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setRestaurant(data.restaurant);
    return data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setRestaurant(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, restaurant, loading, register, login, logout, setRestaurant }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming auth state/actions anywhere in the app.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
