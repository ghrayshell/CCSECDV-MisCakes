import './global.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// pages
import { Home } from './pages/home/Home';
import OurStory from './pages/ourstory/OurStory';
import OurProducts from './pages/ourproducts/OurProducts';
import ContactUs from './pages/contactus/ContactUs';

import ProductDetails from './pages/productdetails/ProductDetails';

// components
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import OrderForm from './pages/ourproducts/orderform/OrderForm';

//test components
import CustomerInfo from './pages/ourproducts/orderform/components/CustomerInfo';
import OrderDetails from './pages/ourproducts/orderform/components/OrderDetails';
import DeliveryDetails from './pages/ourproducts/orderform/components/DeliveryDetails';
import RedButton from './red_button';
import LoginSignUpPage from './pages/loginregister/LoginPage';
import IsNavBar from './components/navbar/IsNavBar';
import RegisterPage from './pages/loginregister/RegisterPage'
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Authenticate User
    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            const response = await axios.get('http://localhost:4000/current_user', { withCredentials: true });

            console.log(response);
    
            if (response.status === 200) {
              setIsAuthenticated(true);
              console.log('HELLO');
            //   setUser(response.data.user); // Store the user data if authenticated
            } else {
              setIsAuthenticated(false);
              // setUser(null); // Clear user data if not authenticated
            }
          } catch (error) {
            console.log('Error: ', error); // Handle errors (e.g., no session or expired token)
            setIsAuthenticated(false);
            // setUser(null);
          }
        };
    
        // Check authentication immediately
        checkAuthentication();
    
        // Set up a polling mechanism to check authentication every 5 seconds (5000ms)
        const intervalId = setInterval(checkAuthentication, 5000);
    
        // Clean up interval when the component unmounts to prevent memory leaks
        return () => clearInterval(intervalId);
    
      }, []); 

    return (
        <div className="App">
            <Router>
                <IsNavBar>
                   <Navbar />
                </IsNavBar>
                
                <div className="pages">
                    <Routes>
                        <Route exact path="/" element={<LoginSignUpPage />} />
                        <Route
                            path="/home"
                            element={<ProtectedRoute element={<Home />} isAuthenticated={isAuthenticated} />}
                        />
                        {/* <Route exact path ="/home" element={Home}></Route> */}
                        <Route exact path="/ourstory" element={<ProtectedRoute element={<OurStory />} isAuthenticated={isAuthenticated}></ProtectedRoute>} />
                        <Route exact path="/ourproducts" element={<ProtectedRoute element={<OurProducts></OurProducts>} isAuthenticated={isAuthenticated}></ProtectedRoute>} />
                        <Route exact path="/contactus" element={<ProtectedRoute element={<ContactUs></ContactUs>} isAuthenticated={isAuthenticated}></ProtectedRoute>} />
                        <Route exact path="/ourproducts/:id" element={<ProtectedRoute element={<ProductDetails />} isAuthenticated={isAuthenticated}></ProtectedRoute>} />
                        <Route exact path="/order/:id" element={<ProtectedRoute element={<OrderForm />} isAuthenticated={isAuthenticated}></ProtectedRoute>} />
                        <Route exact path="/signup" element={<RegisterPage />} />
                        
                        {/* For testing components only */}
                        <Route exact path="/customerinfo" element={<CustomerInfo />} />
                        <Route exact path="/orderdetails" element={<OrderDetails />} />
                        <Route exact path="/deliverydetails" element={<DeliveryDetails />} />
                        <Route exact path="/redbutton" element={<RedButton />} />

                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

export default App;
