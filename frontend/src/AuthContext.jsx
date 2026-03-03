import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  const fetchMe = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        credentials: 'include'
      });
      if (!res.ok) {
        setUser(null);
        localStorage.removeItem('user');
        return;
      }
      const data = await res.json();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (err) {
      console.error('fetchMe error', err);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    if (!user) fetchMe();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('logout error', err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
