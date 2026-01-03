import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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

  // Check for stored user on mount and refresh if tier is missing
  useEffect(() => {
    const initializeUser = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // If membershipTier is missing, fetch fresh data
          if (!parsedUser.membershipTier && parsedUser.phone) {
            console.log('Tier missing, fetching fresh user data...');
            try {
              const response = await fetch(`${API_URL}/users/profile/${parsedUser.phone}`);
              const data = await response.json();
              if (data.success && data.user) {
                const freshUser = { ...parsedUser, ...data.user };
                setUser(freshUser);
                localStorage.setItem('user', JSON.stringify(freshUser));
                console.log('User data refreshed with tier:', data.user.membershipTier);
              } else {
                setUser(parsedUser);
              }
            } catch (error) {
              console.error('Error fetching fresh user data:', error);
              setUser(parsedUser);
            }
          } else {
            setUser(parsedUser);
          }
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    initializeUser();
  }, []);

  // Login function
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Check if user is logged in
  const isAuthenticated = () => {
    return user !== null && user.status === 'approved';
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
