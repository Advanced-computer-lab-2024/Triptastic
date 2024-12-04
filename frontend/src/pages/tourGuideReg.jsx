import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signuptest.module.css'; // Import CSS module


// Modal component for Terms and Conditions
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3>Terms and Conditions</h3>
        <p>
          {/* Add your terms and conditions text here */}
          These are the terms and conditions for registering as a tour guide. Please read them carefully.
          <br />
          1. You must be over 18 years of age.
          <br />
          2. You agree to follow all local laws and regulations.
          <br />
          3. Your information will be kept confidential.
          <br />
          4. Violation of any terms may result in the cancellation of your registration.
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '5px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
};

function TourGuideReg() {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Id: null, // To hold the file for ID
    Certificate: null, // To hold the file for Certificate
  });
  const [acceptTerms, setAcceptTerms] = useState(false); // State for terms acceptance
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [loginData, setLoginData] = useState({
    Email: '',
    Password: '',
  });
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle forms
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Track OTP sent status
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignIn, setShowSignIn] = useState(true); // Toggle for Sign-In form visibility
  const [emailForOTP, setEmailForOTP] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false); // Whether to show OTP form
  const [otp, setOTP] = useState(''); // OTP input value
  const [otpFormData, setOtpFormData] = useState({
    Email: '',
    otp: '',
    newPassword: '',
  });
  const navigate = useNavigate();

  // Handle input changes for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the first selected file
    }));
  };

  // Handle checkbox change
  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handleOTPChange = (e) => {
    const { name, value } = e.target;
    setOtpFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/requestOTPTG', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email: emailForOTP }),
      });
  
      if (response.ok) {
        setOtpSent(true); // Mark OTP as sent
        setErrorMessage('');
        setSuccessMessage('OTP sent successfully!');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to send OTP');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      setSuccessMessage('');
    }
  };
  
  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    // Ensure that the email is included in the reset request
    const resetData = { 
      Email: otpFormData.emailForReset,  // Add emailForReset to the request data
      otp: otpFormData.otp,
      newPassword: otpFormData.newPassword,
    };
  
    try {
      const response = await fetch('http://localhost:8000/resetPasswordTG', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resetData), // Send the email along with OTP and newPassword
      });
  
      if (response.ok) {
        setSuccessMessage('Password reset successful!');
        setErrorMessage('');
        setOtpFormData({ Email: '', otp: '', newPassword: '', emailForReset: '' }); // Reset form data
        setIsForgotPassword(false); // Optionally, you can redirect back to login or homepage
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to reset password');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  // Handle form submission for registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if terms and conditions are accepted
    if (!acceptTerms) {
      setErrorMessage('You must accept the terms and conditions to register.');
      setSuccessMessage('');
      return;
    }

    const data = new FormData();
    data.append('Username', formData.Username);
    data.append('Email', formData.Email);
    data.append('Password', formData.Password);
    data.append('Id', formData.Id);
    data.append('Certificate', formData.Certificate);

    try {
      const response = await fetch('http://localhost:8000/addTourGuide', {
        method: 'POST',
        body: data, // Send FormData
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('Username', formData.Username);
        localStorage.setItem('Email', formData.Email);
        localStorage.setItem('Password', formData.Password);
        setSuccessMessage('Tour guide registered successfully!');
        setErrorMessage('');
        // Optionally, reset form data
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          Id: null,
          Certificate: null,
        });
        navigate('/tour-guide-profile');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  // Handle form submission for login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/loginTourGuide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('token', responseData.token); // Save the JWT token
        navigate('/tour-guide-profile'); // Redirect to dashboard after successful login
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>
    {/* Half-Sliding Circle */}
    <div className={styles.halfCircle}></div>

    {/* Main Content */}
    {/* Sign-Up Form */}
    {isSignUp && (
  <div
    className={`${styles.formContainer2} ${styles.signUp} ${
      isSignUp ? styles.active : ''
    }`}
    style={{
      width: '50%', // Set width for the form
      maxWidth: '400px',
      margin: '0 auto', // Center horizontally
      padding: '5px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      position: 'relative',
      left: '25%', // Move the form to the left
    }}
  >
    <h2>Create Account</h2>
    {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
    <form onSubmit={handleSubmit}>
      {/* User Details Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>Username:</label>
        <input
          type="text"
          name="Username"
          value={formData.Username}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        <label>Email:</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        <label>Password:</label>
        <input
          type="password"
          name="Password"
          value={formData.Password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* File Upload Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <label>ID:</label>
        <input
          type="file"
          name="Id"
          onChange={handleFileChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        <label>Certificate:</label>
        <input
          type="file"
          name="Certificate"
          onChange={handleFileChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      {/* Terms Section */}
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '10px', // Adjust spacing
  }}
>
  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
    <span style={{ fontSize: '14px', marginRight: '5px' }}>
      I accept the terms and conditions
    </span>
    <button
      type="button"
      style={{
        background: 'none',
        color: '#0F5132',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
      }}
      onClick={() => setIsModalOpen(true)}
    >
      Read Terms
    </button>
  </label>
  <input
    type="checkbox"
    checked={acceptTerms}
    onChange={handleTermsChange}
    required
    style={{
      width: '18px', // Adjust checkbox size if needed
      height: '18px',
      marginLeft: '5px',
    }}
  />
</div>
      {/* Submit Button */}
      <button
        type="submit"
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#0F5132',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Register as Tour Guide
      </button>
    </form>
  </div>
)}


      {/* Modal for Terms and Conditions */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

       {/* Sign-In Form */}
{showSignIn && !isSignUp && (
  <div
    className={`${styles.formContainer2} ${styles.signIn}`}
    style={{
      width: '50%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      right:'55%'
    }}
  >
    <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h2>
    <form
      onSubmit={handleLoginSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
    >
      <div>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Email:</label>
        <input
          type="email"
          name="Email"
          value={loginData.Email}
          onChange={handleLoginChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
      </div>
      <div>
        <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Password:</label>
        <input
          type="password"
          name="Password"
          value={loginData.Password}
          onChange={handleLoginChange}
          required
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '14px',
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: '50%',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#0F5132',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop:'10px'
        }}
      >
        Login
      </button>
    </form>
    <button
      onClick={() => setShowOTPForm(true)}
      style={{
        background: 'none',
        color: '#0F5132',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '10px',
      }}
    >
      Forgot Password?
    </button>

    {/* OTP Form */}
    {showOTPForm && (
      <div
        className={`${styles.otpResetForm}`}
        style={{
          marginTop: '20px',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
     
        {errorMessage && (
          <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p style={{ color: 'green', fontSize: '14px', textAlign: 'center' }}>{successMessage}</p>
        )}

        {/* OTP Request Form */}
        {!otpSent && (
          <form
            onSubmit={handleRequestOTP}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div>
              <label
                htmlFor="emailForOTP"
                style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
              >
                Enter Email:
              </label>
              <input
                type="email"
                id="emailForOTP"
                value={emailForOTP}
                onChange={(e) => setEmailForOTP(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '50%',
                padding: '10px',
                borderRadius: '15px',
                border: 'none',
                backgroundColor: '#0F5132',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Request OTP
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {otpSent && (
          <form
            onSubmit={handleResetPassword}
            style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <div>
              <label
                htmlFor="emailForReset"
                style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
              >
                Email:
              </label>
              <input
                type="email"
                id="emailForReset"
                name="emailForReset"
                value={otpFormData.emailForReset}
                onChange={handleOTPChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="otpCode"
                style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
              >
                OTP:
              </label>
              <input
                type="text"
                id="otpCode"
                name="otp"
                value={otpFormData.otp}
                onChange={handleOTPChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
              >
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={otpFormData.newPassword}
                onChange={handleOTPChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '14px',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: '50%',
                padding: '10px',
                borderRadius: '15px',
                border: 'none',
                backgroundColor: '#0F5132',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Reset Password
            </button>
          </form>
        )}
        <button
          onClick={() => setShowOTPForm(false)}
          style={{
            marginTop: '10px',
            background: 'none',
            color: '#0F5132',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          Back to Sign In
        </button>
      </div>
    )}
  </div>
)}


    {/* Toggle Panels */}
    <div className={styles.toggleContainer}>
      {!isSignUp ? (
        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
       <h2>New to our website?</h2>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        </div>
      ) : (
        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
          <h2>Already have an account?</h2>
          <button onClick={() => setIsSignUp(false)}>Sign In</button>
        </div>
      )}
    </div>
  </div>
  );
}
const styles2 = {
  formContainer2: {
    position: 'absolute',
    top: '0',
    right: '0', // Positioned on the right side
    height: '100%',
    width: '20%', // Adjust the width of the form container
    transition: 'transform 0.6s ease-in-out, opacity 0.6s ease-in-out',
    zIndex: 2,
    opacity: 0,
    visibility: 'hidden', // Hidden by default
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Background color
  },
  formContainer2Visible: {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateX(0)',
  },
  formWrapper: {
    background: '#fff',
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '80%', // Adjusted width to keep it responsive
    maxWidth: '400px',
  },
  signupForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Space between form elements
  },
  formSection2: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  termsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  readTermsButton: {
    background: 'none',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '0',
    marginLeft: '5px',
  },
  submitButton: {
    background: '#28a745',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  submitButtonHover: {
    background: '#218838',
  },
};

   

export default TourGuideReg;
