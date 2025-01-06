import React, { useState, useContext, createContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(sessionStorage.getItem('token'));

  const login = async (username, password) => {
    const response = await api.post('/account/login/', {
      username,
      password,
    });
    sessionStorage.setItem('token', response.data.token);
    setToken(response.data.token);
    setUser(username);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
