import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Mail, Lock, User, ArrowRight, MailQuestion, Info, Book } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const formVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0 },
};

const InputField = ({
  icon: Icon,
  placeholder,
  type,
  value,
  onChange,
  error,
  errorMessage,
  success,
  successMessage,
  inputClass
}) => (
  <div>
    <div className={`flex items-center bg-gray-100 p-3 rounded-lg 
      ${error ? 'border border-red-500' : success ? 'border border-green-500' : inputClass}`}>
      <Icon className="text-gray-500 mr-3" size={20} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent outline-none flex-1 text-gray-800"
      />
    </div>
    <div className="text-sm h-2">
      {error ? (
        <span className="text-red-500">{errorMessage}</span>
      ) : success ? (
        <span className="text-green-600">{successMessage}</span>
      ) : (
        ""
      )}
    </div>
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
  const [error, setError] = useState('');
  const [resetQuestion, setResetQuestion] = useState('');
  const [resetAnswer, setResetAnswer] = useState('');
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
    const checkEmail = async () => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValidFormat = emailRegex.test(email);
      setEmailValid(isValidFormat);
  
      if (!email || !isValidFormat) {
        setEmailExists(false);
        return;
      }
  
      try {
        const res = await axios.post("http://localhost:4000/check-email", { email });
        console.log("EMAIL CHECK RESPONSE:", res.data); // 👉 add this!
        setEmailExists(res.data.exists);
      } catch (error) {
        console.error("Error checking email:", error);
        setEmailExists(false);
      }
    };
  
    checkEmail();
  }, [email]);  
  

  const isFormValid = emailValid && !emailExists &&
    password && confirmpassword &&
    !passwordsDoNotMatch &&
    passwordValidations.length &&
    passwordValidations.uppercase &&
    passwordValidations.number &&
    passwordValidations.specialChar &&
    resetQuestion && resetAnswer;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    console.log("HANDLE REGISTER CLICKED");

    console.log("Form State Check:", {
      emailValid,
      emailExists,
      password,
      confirmpassword,
      passwordsDoNotMatch,
      passwordValidations,
      isFormValid
    });

    if (!isFormValid) {
      setError("Please fill in all required fields correctly.");
      return;
    }

    if (emailExists) {
      setError("Email already exists.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/register", {
        name,
        email,
        password,
        resetQuestion: resetQuestion,
        resetAnswer: resetAnswer
      });

      console.log("Registration response:", res.data);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error.response?.data?.message || error.message);
      setError("Something went wrong. Please try again.");
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
              <h1 className="text-3xl md:text-4xl mb-5 font-bold text-gray-800 text-center">
                {'Create account'}
              </h1>
              {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">
                  Registration Successful!
                </div>
              )}


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
                  success={
                    password &&
                    passwordValidations.length &&
                    passwordValidations.uppercase &&
                    passwordValidations.number &&
                    passwordValidations.specialChar
                  }
                  successMessage="Password satisfies all complexity rules!"
                  inputClass=""
                />
                
                {/* Password Complexity Checkboxes */}
                {password && !(
                    passwordValidations.length &&
                    passwordValidations.uppercase &&
                    passwordValidations.number &&
                    passwordValidations.specialChar
                  ) && (
                    <div className="mt-2 space-y-2">
                      <label className={`flex items-center text-sm ${passwordValidations.length ? 'text-green-600' : 'text-red-500'}`}>
                        <input
                          type="checkbox"
                          disabled
                          checked={passwordValidations.length}
                          className={`mr-2 ${passwordValidations.length ? 'accent-green-600' : 'accent-red-500'}`}
                        />
                        <span>Password must be at least 10 characters</span>
                      </label>

                      <label className={`flex items-center text-sm ${passwordValidations.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                        <input
                          type="checkbox"
                          disabled
                          checked={passwordValidations.uppercase}
                          className={`mr-2 ${passwordValidations.uppercase ? 'accent-green-600' : 'accent-red-500'}`}
                        />
                        <span>Password must contain at least one uppercase letter</span>
                      </label>

                      <label className={`flex items-center text-sm ${passwordValidations.number ? 'text-green-600' : 'text-red-500'}`}>
                        <input
                          type="checkbox"
                          disabled
                          checked={passwordValidations.number}
                          className={`mr-2 ${passwordValidations.number ? 'accent-green-600' : 'accent-red-500'}`}
                        />
                        <span>Password must contain at least one number</span>
                      </label>

                      <label className={`flex items-center text-sm ${passwordValidations.specialChar ? 'text-green-600' : 'text-red-500'}`}>
                        <input
                          type="checkbox"
                          disabled
                          checked={passwordValidations.specialChar}
                          className={`mr-2 ${passwordValidations.specialChar ? 'accent-green-600' : 'accent-red-500'}`}
                        />
                        <span>Password must contain at least one special character</span>
                      </label>
                    </div>
                  )
                }

                <InputField 
                  icon={Lock} 
                  placeholder="Confirm Password" 
                  type="password" 
                  value={confirmpassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  error={passwordsDoNotMatch}
                  errorMessage="Passwords do not match"
                  success={confirmpassword && confirmpassword === password}
                  successMessage="Passwords match!"
                  inputClass=""
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select a password reset question</label>
                  <select
                    value={resetQuestion}
                    onChange={(e) => setResetQuestion(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded-lg text-gray-800 outline-none"
                  >
                    <option value="">-- Choose a question --</option>
                    <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                    <option value="What is the name of your first pet?">What is the name of your first pet?</option>
                    <option value="What's your grandmother's first name?">What's your grandmother's first name?</option>
                    <option value="What city were you born in?">What city were you born in?</option>
                    <option value="In what city or town did your parents meet?">In what city or town did your parents meet?</option>
                    <option value="What was the first concert you attended?">What was the first concert you attended?</option>
                  </select>
                </div>

                <InputField
                  icon={Book}
                  placeholder="Answer to password reset question"
                  type="text"
                  value={resetAnswer}
                  onChange={(e) => setResetAnswer(e.target.value)}
                  error={!resetAnswer && resetQuestion} // error if question selected but no answer
                  errorMessage="Please provide an answer"
                  inputClass=""
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