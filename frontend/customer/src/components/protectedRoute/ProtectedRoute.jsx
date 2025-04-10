import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, isAuthenticated }) => {
  console.log('IsAuth: ', isAuthenticated);
  if (!isAuthenticated) {
    // Redirect the user to the login page if not authenticated
    return <Navigate to="/" />;
  }

  return element; // Render the protected route element if authenticated
};

export default ProtectedRoute;