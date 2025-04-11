import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Book } from 'lucide-react';
import bcrypt from 'bcryptjs';

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
  inputClass,
  disabled = false, 
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
        disabled={disabled}
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

const ChangePasswordPopup = ({
  resetQuestion,
  resetAnswer: correctResetAnswer,
  passwordHistory = [],
  passwordDate = null,
  onClose
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetAnswerInput, setResetAnswerInput] = useState('');
  const [isReusedPassword, setIsReusedPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [tooSoonToChange, setTooSoonToChange] = useState(false);
  const [timeLeftMessage, setTimeLeftMessage] = useState('');

  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const passwordsDoNotMatch = newPassword && confirmPassword && newPassword !== confirmPassword;
  const isFormValid =
    (newPassword === confirmPassword) &&
    !isReusedPassword &&
    (resetAnswerInput.trim().toLowerCase() === correctResetAnswer.trim().toLowerCase());

    useEffect(() => {
      if (passwordDate) {
        const lastChanged = new Date(passwordDate);
        const now = new Date();
        const diffInMs = now - lastChanged;
        const oneDayInMs = 24 * 60 * 60 * 1000;
    
        if (diffInMs < oneDayInMs) {
          setTooSoonToChange(true);
    
          const msLeft = oneDayInMs - diffInMs;
          const hours = Math.floor(msLeft / (60 * 60 * 1000));
          const minutes = Math.floor((msLeft % (60 * 60 * 1000)) / (60 * 1000));
    
          setTimeLeftMessage(`Please wait ${hours} hour(s) and ${minutes} minute(s) to be able to change your password.`);
        } else {
          setTooSoonToChange(false);
          setTimeLeftMessage('');
        }
      }
    }, [passwordDate]);    

    useEffect(() => {
      const checkReusedPassword = async () => {
        if (!newPassword || passwordHistory.length === 0) {
          setIsReusedPassword(false);
          return;
        }
    
        for (let i = 0; i < passwordHistory.length; i++) {
          const match = await bcrypt.compare(newPassword, passwordHistory[i]);
          if (match) {
            setIsReusedPassword(true);
            return;
          }
        }
    
        setIsReusedPassword(false); // no matches found
      };
    
      checkReusedPassword();
    }, [newPassword, passwordHistory]);    

  useEffect(() => {
    setPasswordValidations({
      length: newPassword.length >= 10,
      uppercase: /[A-Z]/.test(newPassword),
      number: /\d/.test(newPassword),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const passwordIsStrong =
  newPassword &&
  !isReusedPassword &&
  passwordValidations.length &&
  passwordValidations.uppercase &&
  passwordValidations.number &&
  passwordValidations.specialChar;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (
      !newPassword || !confirmPassword ||
      passwordsDoNotMatch ||
      !passwordIsStrong ||
      resetAnswerInput.trim().toLowerCase() !== correctResetAnswer.trim().toLowerCase()
    ) {
      setMessage("Please complete the form correctly.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/change-password", {
        newPassword,
        resetAnswer: resetAnswerInput
      }, { withCredentials: true });
    
      console.log('Password change response:', res.data);

      setMessage("✅ Password updated successfully!");

      setTimeout(() => {
        setMessage('');
        onClose(); // Close modal after showing message
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }    
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 text-orange-600 text-center">Change Password</h2>

        <div className="space-y-4">
          <InputField
            icon={Lock}
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={isReusedPassword}
            errorMessage="Old password can not be reused!"
            success={
              newPassword &&
              !isReusedPassword &&
              passwordValidations.length &&
              passwordValidations.uppercase &&
              passwordValidations.number &&
              passwordValidations.specialChar
            }
            successMessage="Password satisfies all complexity rules!"
            inputClass=""
          />

          {newPassword && !(passwordValidations.length && passwordValidations.uppercase && passwordValidations.number && passwordValidations.specialChar) && (
            <div className="mt-2 space-y-2">
              <label className={`flex items-center text-sm ${passwordValidations.length ? 'text-green-600' : 'text-red-500'}`}>
                <input type="checkbox" disabled checked={passwordValidations.length} className={`mr-2 ${passwordValidations.length ? 'accent-green-600' : 'accent-red-500'}`} />
                <span>Password must be at least 10 characters</span>
              </label>
              <label className={`flex items-center text-sm ${passwordValidations.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                <input type="checkbox" disabled checked={passwordValidations.uppercase} className={`mr-2 ${passwordValidations.uppercase ? 'accent-green-600' : 'accent-red-500'}`} />
                <span>Password must contain at least one uppercase letter</span>
              </label>
              <label className={`flex items-center text-sm ${passwordValidations.number ? 'text-green-600' : 'text-red-500'}`}>
                <input type="checkbox" disabled checked={passwordValidations.number} className={`mr-2 ${passwordValidations.number ? 'accent-green-600' : 'accent-red-500'}`} />
                <span>Password must contain at least one number</span>
              </label>
              <label className={`flex items-center text-sm ${passwordValidations.specialChar ? 'text-green-600' : 'text-red-500'}`}>
                <input type="checkbox" disabled checked={passwordValidations.specialChar} className={`mr-2 ${passwordValidations.specialChar ? 'accent-green-600' : 'accent-red-500'}`} />
                <span>Password must contain at least one special character</span>
              </label>
            </div>
          )}

          <InputField
            icon={Lock}
            placeholder="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={passwordsDoNotMatch}
            errorMessage="Passwords do not match"
            success={confirmPassword && confirmPassword === newPassword}
            successMessage="Passwords match!"
            disabled={!passwordIsStrong} 
            inputClass=""
          />

          <div className="p-1 rounded-lg text-sm text-orange-600">
            <strong>Security Question:</strong> {resetQuestion || 'No question on file.'}
          </div>

          <InputField
            icon={Book}
            placeholder="Answer to password reset question"
            type="text"
            value={resetAnswerInput}
            onChange={(e) => setResetAnswerInput(e.target.value)}
            error={resetAnswerInput.trim().toLowerCase() && resetAnswerInput.trim().toLowerCase() !== correctResetAnswer.trim().toLowerCase()} // Show error only when input doesn't match
            errorMessage="Wrong security answer!"
            success={resetAnswerInput.trim().toLowerCase() && resetAnswerInput.trim().toLowerCase() === correctResetAnswer.trim().toLowerCase()} // Optional: show green when correct
            successMessage="Correct security answer!"
            disabled={!passwordIsStrong} 
            inputClass=""
          />

        </div>

        <div className="mt-6">
          <button 
            onClick={handleSubmit}
            disabled={!isFormValid || tooSoonToChange}
            className={`text-white px-6 py-3 rounded-lg w-full flex items-center justify-center 
                ${isFormValid? "bg-orange-600 hover:bg-orange-700 cursor-pointer" : "bg-gray-300 cursor-default"}
              `}> {'Update Password'}
            </button>

            {message && (
              <div className="text-green-600 text-sm mt-3 text-center">
                {message}
              </div>
            )}

            {tooSoonToChange && (
              <div className="text-red-500 text-sm text-center mt-5">
                ❌ Password must be at least one day old for this feature ❌
                <br />
                {timeLeftMessage}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPopup;
