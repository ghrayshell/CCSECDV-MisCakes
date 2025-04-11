import React, { createContext, useContext, useState, useEffect } from 'react';

// Context to store the auth state and user role
const AuthContext = createContext();

// Provider component to wrap the entire app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const publicRoutes = ['/', '/signup'];

  useEffect(() => {
    // Fetch authentication status first
    if (publicRoutes.includes(window.location.pathname)) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:4000/current_user', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticated(true);

          fetch('http://localhost:4000/status', {
            method: 'GET',
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.role) {
                setUserRole(data.role);
                console.log('ROLEROLE: ', userRole);
              }
            })
            .catch(() => {
              setUserRole(null);  // Handle errors if role fetch fails
            });
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserRole(null);
      })
      .finally(() => {
        setLoading(false); // Set loading to false once the auth check is complete
      });
  }, []);

  // Wait until the authentication check is done before rendering the children
  if (loading) {
    return <div>Loading...</div>; // You can show a loading spinner or something else here
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to access auth state and functions
export const useAuth = () => {
  return useContext(AuthContext);
};
