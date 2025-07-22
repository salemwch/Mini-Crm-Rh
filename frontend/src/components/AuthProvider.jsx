import React, { createContext, useState, useEffect } from 'react';
import { getMe, refreshToken } from '../service/auth';
import {Login,Logout} from '../service/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      setLoading(true);
      try {
        await refreshToken();
        const currentUser = await getMe();
        setUser(currentUser);
console.log('Current user:', currentUser);

      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await Login(credentials);
      setUser(response.user);
      return response.user;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Logout();
    } catch (error) {
      console.error("Server logout failed, but logging out on client.", error);
    } finally {
      setUser(null);
    }
  };
  const value = { user, setUser, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


