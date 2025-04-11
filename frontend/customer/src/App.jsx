import './global.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

// pages
import { Home } from './pages/home/Home';
import OurStory from './pages/ourstory/OurStory';
import OurProducts from './pages/ourproducts/OurProducts';
import ContactUs from './pages/contactus/ContactUs';
import ProductDetails from './pages/productdetails/ProductDetails';
import OrderForm from './pages/ourproducts/orderform/OrderForm';

// test components
import CustomerInfo from './pages/ourproducts/orderform/components/CustomerInfo';
import OrderDetails from './pages/ourproducts/orderform/components/OrderDetails';
import DeliveryDetails from './pages/ourproducts/orderform/components/DeliveryDetails';
import RedButton from './red_button';

// auth
import LoginSignUpPage from './pages/loginregister/LoginPage';
import RegisterPage from './pages/loginregister/RegisterPage';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Admin from './pages/admin/Admin';
import UnauthorizedPage from './components/unauthorizedPage/UnauthorizedPage';
import { AuthProvider } from './context/AuthProvider';

// layout components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import IsNavBar from './components/navbar/IsNavBar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // const checkAuthentication = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:4000/current_user', { withCredentials: true });
  //     return response.status === 200;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  // const publicRoutes = ['/', '/signup'];

  // useEffect(() => {
  //   // Skip authentication check for public routes
  //   if (publicRoutes.includes(location.pathname)) {
  //     return;
  //   }

  //   // Check the current user
  //   fetch('http://localhost:4000/current_user', { 
  //     method: 'GET',
  //     credentials: 'include' // Ensure credentials (cookies) are included
  //   })
  //     .then((res) => {
  //       if (res.status === 401) {
  //         // If not authenticated, redirect to login page
  //         navigate('/');
  //       }
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching user:', err);
  //       navigate('/');
  //     });
  // }, [navigate]);

  // useEffect(() => {
  //   // Fetch the user's session info from the backend
  //   fetch('http://localhost:4000/status', {
  //     method: 'GET',
  //     credentials: 'include' // Ensure credentials (cookies) are included
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.role) {
  //         setUserRole(data.role);  // Set the user role
  //       } else {
  //         setIsAuthenticated(false);
  //       }
  //     })
  //     .catch(() => {
  //       setIsAuthenticated(false);
  //     });
  // }, []);

  const showNavbarRoutes = [
    '/home',
    '/ourstory',
    '/ourproducts',
    '/contactus',
    '/order/:id',
    '/customerinfo',
    '/orderdetails',
    '/deliverydetails'
  ];

  // Use pattern matching for dynamic routes if needed
  const shouldShowNavbar = showNavbarRoutes.some((route) => {
    if (route.includes(':')) {
      const base = route.split('/:')[0];
      return location.pathname.startsWith(base);
    }
    return route === location.pathname;
  });

  return (
    <AuthProvider>
      <div className="App">
        {shouldShowNavbar && (
          <IsNavBar>
            <Navbar />
          </IsNavBar>
        )}

        <div className="pages">
          <Routes>
            <Route path="/" element={<LoginSignUpPage />} />
            <Route path="/signup" element={<RegisterPage />} />

            <Route
              path="/home"
              element={<ProtectedRoute requiredRole="customer"><Home /></ProtectedRoute>}
            />
            
            <Route
              path="/ourstory"
              element={<ProtectedRoute requiredRole="customer"><OurStory /></ProtectedRoute>}
            />

            <Route
              path="/ourproducts"
              element={<ProtectedRoute requiredRole="customer"><OurProducts /></ProtectedRoute>}
            />

            <Route
              path="/contactus"
              element={<ProtectedRoute requiredRole="customer"><ContactUs /></ProtectedRoute>}
            />
            
            <Route
              path="/ourproducts/:id"
              element={<ProtectedRoute requiredRole="customer"><ProductDetails /></ProtectedRoute>}
            />
            

            <Route path="/order/:id" element={<ProtectedRoute element={<OrderForm />} requiredRole="customer" />} />
            <Route
              path="/order/:id"
              element={<ProtectedRoute requiredRole="customer"><OrderForm /></ProtectedRoute>}
            />

            {/* <Route path="/admin" element={<ProtectedRoute element={<Admin />} requiredRole="admin" />} /> */}
            <Route
              path="/admin"
              element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>}
            />

            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            {/* Testing */}
            <Route path="/customerinfo" element={<CustomerInfo />} />
            <Route path="/orderdetails" element={<OrderDetails />} />
            <Route path="/deliverydetails" element={<DeliveryDetails />} />
            <Route path="/redbutton" element={<RedButton />} />
          </Routes>
        </div>
        {shouldShowNavbar && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
