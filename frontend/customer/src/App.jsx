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

function App() {
    return (
        <div className="App">
            <Router>
                <IsNavBar>
                   <Navbar />
                </IsNavBar>
                
                <div className="pages">
                    <Routes>
                        <Route exact path="/" element={<LoginSignUpPage />} />
                        <Route exact path="/home" element={<Home />} />
                        <Route exact path="/ourstory" element={<OurStory />} />
                        <Route exact path="/ourproducts" element={<OurProducts />} />
                        <Route exact path="/contactus" element={<ContactUs />} />
                        <Route exact path="/ourproducts/:id" element={<ProductDetails />} />
                        <Route exact path="/order/:id" element={<OrderForm />} />
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
