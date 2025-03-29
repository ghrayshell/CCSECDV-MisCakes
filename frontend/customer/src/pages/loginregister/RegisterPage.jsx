import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Lock, User, ArrowRight, Github, Twitter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Children } from 'react';
import axios from 'axios';

const formVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const InputField = ({ icon: Icon, placeholder, type, value, onChange, error, errorMessage }) => (
  <div classname={""}>
    
    <div className={`flex items-center bg-gray-100 p-3 rounded-lg ${error ? 'border border-red-500' : ''}`}>
      <Icon className="text-gray-500 mr-3" size={20} /> 
      <input 
        type={type} 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange} 
        className="bg-transparent outline-none flex-1 text-gray-800"
      />
      
    </div>
    <div className="text-sm h-2 text-red-500">{error ? errorMessage : ""}</div>
  </div>
  
); 

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const passwordsDoNotMatch = password && confirmpassword && password !== confirmpassword;
    const isFormValid = name && email && password && confirmpassword && !passwordsDoNotMatch;
    

    const handleRegister = async (e) => {
      e.preventDefault();

      if (isFormValid) {
        setSuccess(true); 
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }

      try{
        const res = await axios.post("http://localhost:4000/register", { name, email, password });
        console.log(res.data.message);
      } catch(error){
        console.log(error.response?.data?.message || "Something went wrong");
      }
    }

    return (
        
        <div className="flex flex-col md:flex-row h-screen">
          <div className="w-md bg-white flex items-center justify-center p-8 md:p-16">
            <div className="w-full max-w-md">
            
              <AnimatePresence mode="wait">
                <motion.div
                  key={'signup'}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={formVariants}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
                    {'Create account'}
                  </h1>
              
                    
                  <div className="text-green-600 h-10 text-lg font-semibold text-center">
                    {success ? "Registration Successful!": ""}
                  </div>
               
                  <div className="space-y-4">
                  
                    <InputField 
                      icon={User} 
                      placeholder="Name" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      error={false}
                    />
              
                    <InputField 
                      icon={Mail} 
                      placeholder="Email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      error={false}
                    />
                    <InputField 
                      icon={Lock} 
                      placeholder="Password" 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      error={false}
                    />
                    <InputField 
                      icon={Lock} 
                      placeholder="Confirm Password" 
                      type="password" 
                      value={confirmpassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      error={passwordsDoNotMatch}
                      errorMessage="Passwords do not match"
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                  <button 
                    onClick={handleRegister}
                    disabled={!isFormValid}
                    className={`text-white px-6 py-3 rounded-lg w-full flex items-center justify-center 
                      ${isFormValid ? "bg-orange-600 hover:bg-orange-700 cursor-pointer" : "bg-gray-300 cursor-default"}
                    `}
                  >
                    {'Sign Up'} <ArrowRight className="ml-2" size={20} />
                  </button>

                    <div className="text-center">Already have an account? <Link to="/" className="text-orange-600 font-bold">Sign in</Link></div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
        </div>
    );
}

export default RegisterPage;

