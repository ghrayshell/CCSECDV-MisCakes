import React, { useState } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Lock, User, ArrowRight, Github, Twitter } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const formVariants = { 
  hidden: { opacity: 0, x: -30 }, 
  visible: { opacity: 1, x: 0 }, 
}; 

const InputField = ({ icon: Icon, placeholder, type, value, onChange }) => (
  <div className="flex items-center bg-gray-100 p-3 rounded-lg">
    <Icon className="text-gray-500 mr-3" size={20} />
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="bg-transparent outline-none flex-1 text-gray-800"
    />
  </div>
);

const LoginSignUpPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const toggleMode = () => setIsLogin(!isLogin);

    const handleLogin = async (e) => {
      e.preventDefault();
      setError(''); // Clear any existing error

      try {
        const res = await axios.post("http://localhost:4000/login", { email, password }, { withCredentials: true });
        if (res.data.redirectTo) {
          // Use React Router's navigate function to redirect without reloading the page
          // setIsAuthenticated(true); 
          navigate(res.data.redirectTo);  // This will navigate to /home
        }
      } catch (error) {
        const message = error.response?.data || "Something went wrong";
        console.log("Login error:", message);
        setError(typeof message === 'string' ? message : message.message);
      }
    }

    return (
        <div className="flex flex-col md:flex-row h-screen">
          <div className="w-full bg-white flex items-center justify-center p-8 md:p-16">
            <div className="w-full max-w-md">
            
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={formVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
                    {isLogin ? 'Welcome to MIS\'CAKES!' : 'Create account'}
                  </h1>

                  {/* Show error message if exists */}
                  {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    {!isLogin && (
                      <InputField 
                        icon={User} 
                        placeholder="Full Name" 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                      />
                    )}
                    <InputField 
                      icon={Mail} 
                      placeholder="Email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                    <InputField 
                      icon={Lock} 
                      placeholder="Password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    <Link to="/home">
                      <button
                        onClick={handleLogin}
                        className={`text-white px-6 py-3 rounded-lg w-full flex items-center justify-center hover:bg-orange-700 hover:cursor-pointer ${isLogin ? 'bg-orange-600' : 'bg-green-600'}`}
                      >
                        {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2" size={20} />
                      </button>
                    </Link>
                    <div className="text-center">Don't have an account yet? <Link to="/signup" className="text-orange-600 font-bold">Sign up</Link></div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
    );
}

export default LoginSignUpPage;