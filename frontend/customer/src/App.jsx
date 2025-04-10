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

// layout components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import IsNavBar from './components/navbar/IsNavBar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const checkAuthentication = async () => {
    try {
      const response = await axios.get('http://localhost:4000/current_user', { withCredentials: true });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  const publicRoutes = ['/', '/signup'];

  useEffect(() => {
    // Skip authentication check for public routes
    if (publicRoutes.includes(location.pathname)) {
      return;
    }

    // Check the current user
    fetch('http://localhost:4000/current_user', { 
      method: 'GET',
      credentials: 'include' // Ensure credentials (cookies) are included
    })
      .then((res) => {
        if (res.status === 401) {
          // If not authenticated, redirect to login page
          navigate('/');
        }
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        navigate('/');
      });
  }, [navigate]);

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
          <Route path="/home" element={<ProtectedRoute element={<Home />} isAuthenticated={checkAuthentication} />} />
          <Route path="/ourstory" element={<ProtectedRoute element={<OurStory />} isAuthenticated={checkAuthentication} />} />
          <Route path="/ourproducts" element={<ProtectedRoute element={<OurProducts />} isAuthenticated={checkAuthentication} />} />
          <Route path="/contactus" element={<ProtectedRoute element={<ContactUs />} isAuthenticated={checkAuthentication} />} />
          <Route path="/ourproducts/:id" element={<ProtectedRoute element={<ProductDetails />} isAuthenticated={checkAuthentication} />} />
          <Route path="/order/:id" element={<ProtectedRoute element={<OrderForm />} isAuthenticated={checkAuthentication} />} />
          <Route path="/admin" element={<Admin />} />
          {/* Testing */}
          <Route path="/customerinfo" element={<CustomerInfo />} />
          <Route path="/orderdetails" element={<OrderDetails />} />
          <Route path="/deliverydetails" element={<DeliveryDetails />} />
          <Route path="/redbutton" element={<RedButton />} />
        </Routes>
      </div>
      {shouldShowNavbar && (
        <Footer></Footer>
      )}
    </div>
  );
}

export default App;
