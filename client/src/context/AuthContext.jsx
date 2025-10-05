// client/src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the context structure
const AuthContext = createContext();

// Constants for localStorage keys
const USER_KEY = 'currentUser';
const TOKEN_KEY = 'authToken';

// Custom hook to use the authentication context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

// -------------------------------------------------------------------------
// Auth Provider Component
// -------------------------------------------------------------------------

export const AuthProvider = ({ children }) => {
  // State to hold user data (excluding token) and the token itself
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Tracks initial load check

  // 1. Initial Load Check (Runs only once on mount)
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // 2. Login Function
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, authToken);
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // Context value object
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  // Prevent rendering children until the initial loading check is complete
  if (isLoading) {
    return <div>Loading application...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};