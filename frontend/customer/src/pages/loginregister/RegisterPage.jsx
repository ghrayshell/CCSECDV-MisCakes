import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const formVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const InputField = ({ icon: Icon, placeholder, type, value, onChange, error, errorMessage, inputClass }) => (
  <div>
    <div className={`flex items-center bg-gray-100 p-3 rounded-lg ${error ? 'border border-red-500' : inputClass}`}>
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
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [emailValid, setEmailValid] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const navigate = useNavigate();

  const passwordsDoNotMatch = password && confirmpassword && password !== confirmpassword;

  // Check if password satisfies all conditions
  useEffect(() => {
    setPasswordValidations({
      length: password.length >= 10,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // Email validation
  useEffect(() => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setEmailValid(emailRegex.test(email));

    // Simulate email exists check
    const existingEmails = ['existing@example.com', 'test@example.com'];
    setEmailExists(existingEmails.includes(email));
  }, [email]);

  const isFormValid = emailValid && !emailExists && password && confirmpassword && !passwordsDoNotMatch &&
    passwordValidations.length && passwordValidations.uppercase && passwordValidations.number && passwordValidations.specialChar;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (isFormValid) {
      setSuccess(true); 
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }

    try {
      const res = await axios.post("http://localhost:4000/register", { name, email, password });
      console.log(res.data.message);
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

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
                {success ? "Registration Successful!" : ""}
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
                  error={(email && !emailValid) || emailExists}
                  errorMessage={emailExists ? "Email already exists" : "Invalid email format"}
                />
                <InputField 
                  icon={Lock} 
                  placeholder="Password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  error={false}
                  inputClass={passwordValidations.length && passwordValidations.uppercase && passwordValidations.number && passwordValidations.specialChar ? 'border border-green-500' : 'border border-red-500'}
                />
                
                {/* Password Complexity Checkboxes */}
                <div className="mt-2 space-y-2">
                  {!passwordValidations.length && password && (
                    <label className="flex items-center text-sm">
                      <input type="checkbox" disabled checked={passwordValidations.length} />
                      <span className="ml-2">Password must be at least 10 characters</span>
                    </label>
                  )}
                  {!passwordValidations.uppercase && password && (
                    <label className="flex items-center text-sm">
                      <input type="checkbox" disabled checked={passwordValidations.uppercase} />
                      <span className="ml-2">Password must contain at least one uppercase letter</span>
                    </label>
                  )}
                  {!passwordValidations.number && password && (
                    <label className="flex items-center text-sm">
                      <input type="checkbox" disabled checked={passwordValidations.number} />
                      <span className="ml-2">Password must contain at least one number</span>
                    </label>
                  )}
                  {!passwordValidations.specialChar && password && (
                    <label className="flex items-center text-sm">
                      <input type="checkbox" disabled checked={passwordValidations.specialChar} />
                      <span className="ml-2">Password must contain at least one special character</span>
                    </label>
                  )}
                </div>

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
                  disabled={!isFormValid || !name}
                  className={`text-white px-6 py-3 rounded-lg w-full flex items-center justify-center 
                    ${isFormValid && name ? "bg-orange-600 hover:bg-orange-700 cursor-pointer" : "bg-gray-300 cursor-default"}
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
