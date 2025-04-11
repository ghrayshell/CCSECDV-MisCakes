// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthProvider';

// const ProtectedRoute = ({ children, requiredRole }) => {
//   const { isAuthenticated, userRole, setUserRole } = useAuth();

//   fetch('http://localhost:4000/status', {
//     method: 'GET',
//     credentials: 'include',
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       if (data.role) {
//          // Check if the user is authenticated and has the required role
//         console.log('USER: ', data.role);
//         if (!isAuthenticated) {
//           return <Navigate to="/" replace  />; // Redirect to login page if not authenticated
//         }

//         console.log('REQ: ', requiredRole);

//         if (requiredRole && data.role !== requiredRole) {
//           return <Navigate to="/unauthorized" replace  />; // Redirect to unauthorized if role doesn't match
//         }
//       }
//     })
//     .catch(() => {
//       setUserRole(null);  // Handle errors if role fetch fails
//     });

  

 

//   return children; // Render the protected route if authorization is successful
// };

// export default ProtectedRoute;

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/status', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.role) {
          setUserRole(data.role);
        }
      })
      .catch(() => {
        setUserRole(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div>Loading...</div>; // or a spinner
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
