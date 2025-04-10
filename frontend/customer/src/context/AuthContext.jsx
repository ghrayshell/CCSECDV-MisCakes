import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to access authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider will wrap your app and provide authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);  // Store the current authenticated user

  // Function to check authentication status when app loads
  const checkAuthentication = async () => {
    try {
      const response = await axios.get('http://localhost:4000/current_user', { withCredentials: true });
      // console.log('Check Auth Response: ', response );
      if (response.data.user) {
        setUser(response.data.user);  // Set user if authenticated
      } else {
        setUser(null);  // No user authenticated
      }
    } catch (err) {
      setUser(null);  // Error occurred, clear user state
    }
  };

  // Check authentication on initial load
  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuthentication }}>
      {children}
    </AuthContext.Provider>
  );
};