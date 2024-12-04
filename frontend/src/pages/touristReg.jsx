import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signuptest.module.css'; // Import CSS module

function AuthPage() {
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

  // Separate state for Sign-Up form
  const [signUpFormData, setSignUpFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
  });

  const [signInFormData, setSignInFormData] = useState({
    Email: '',
    Password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes for Sign-Up form
  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle input changes for Sign-In form
  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleOTPChange = (e) => {
    const { name, value } = e.target;
    setOtpFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  // Handle Sign-Up form submission
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/addTourist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signUpFormData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('context', 'tourist');
        localStorage.setItem('Username', signUpFormData.Username);
        localStorage.setItem('Email', signUpFormData.Email);
        localStorage.setItem('Password', signUpFormData.Password);
        localStorage.setItem('Nationality', signUpFormData.Nationality);
        localStorage.setItem('DOB', signUpFormData.DOB);
        localStorage.setItem('Occupation', signUpFormData.Occupation);
        setSuccessMessage('Tourist registered successfully!');
        setErrorMessage('');
        setSignUpFormData({
          Username: '',
          Email: '',
          Password: '',
          Nationality: '',
          DOB: '',
          Occupation: '',
        });
        navigate('/tourist-profile');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  // Handle Sign-In form submission
// Handle Sign-In form submission
const handleSignInSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://localhost:8000/loginTourist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(signInFormData),
    });

    if (response.ok) {
      const data = await response.json();

      // Store the token and user details in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('Username', data.user.Username);
      localStorage.setItem('Email', data.user.Email);
      localStorage.setItem('Nationality', data.user.Nationality);
      localStorage.setItem('DOB', data.user.DOB);
      localStorage.setItem('Occupation', data.user.Occupation);
      localStorage.setItem('context', 'tourist');
      // Show success message and navigate to the profile page
      setSuccessMessage('Login successful!');
      setErrorMessage('');
      navigate('/tourist-profile');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'Login failed. Please check your credentials.');
      setSuccessMessage('');
    }
  } catch (error) {
    setErrorMessage('Something went wrong. Please try again later.');
  }
};

const handleRequestOTP = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:8000/requestOTP', {
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
    const response = await fetch('http://localhost:8000/resetPassword', {
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

return (
  <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>
    {/* Half-Sliding Circle */}
    <div className={styles.halfCircle}></div>

    {/* Main Content */}
    {/* Sign-Up Form */}
    {isSignUp && (
      <div className={`${styles.formContainer} ${styles.signUp} ${isSignUp ? styles.active : ''}`}>
        <h1>Create Account</h1>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        <form onSubmit={handleSignUpSubmit}>
          <div>
            <label htmlFor="signUpUsername">Username:</label>
            <input
              type="text"
              id="signUpUsername"
              name="Username"
              value={signUpFormData.Username}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpEmail">Email:</label>
            <input
              type="email"
              id="signUpEmail"
              name="Email"
              value={signUpFormData.Email}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpPassword">Password:</label>
            <input
              type="password"
              id="signUpPassword"
              name="Password"
              value={signUpFormData.Password}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpNationality">Nationality:</label>
            <input
              type="text"
              id="signUpNationality"
              name="Nationality"
              value={signUpFormData.Nationality}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpDOB">Date of Birth:</label>
            <input
              type="date"
              id="signUpDOB"
              name="DOB"
              value={signUpFormData.DOB}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpOccupation">Occupation:</label>
            <input
              type="text"
              id="signUpOccupation"
              name="Occupation"
              value={signUpFormData.Occupation}
              onChange={handleSignUpChange}
              required
            />
          </div>
          <button type="submit">Register as Tourist</button>
        </form>
      </div>
    )}

   
      {/* Sign-In Form */}
     
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
        
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h1>
                  <form onSubmit={handleSignInSubmit}      style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                  >
                            <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Email:</label>

  <input
    type="email"
     name="Email"
    placeholder="Email"
    value={signInFormData.Email}
    onChange={handleSignInChange}
    required
    style={{
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '14px',
    }}
  />
          <label style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}>Password:</label>

  <input
  type="password"
  name="Password"
  placeholder="Password"
  value={signInFormData.Password}
  onChange={handleSignInChange}
  required
  style={{
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  }}

  />
  <button type="submit"  style={{
          width: '35%',
          padding: '10px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#0F5132',
          color: '#fff',
          fontSize: '16px',
          cursor: 'pointer',
          marginTop:'10px'
        }}>Sign In</button>
</form>


          <button onClick={() => setShowOTPForm(true)} style={{
        background: 'none',
        color: '#0F5132',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '10px',
      }}>Forgot Password?</button>

          {/* OTP Form */}
          {showOTPForm && (
            <div className={`${styles.otpResetForm}`}  style={{
              marginTop: '20px',
              padding: '20px',
              borderRadius: '10px',
            }}>
              {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

              {/* OTP Request Form */}
              {!otpSent && (
                <form onSubmit={handleRequestOTP}  style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <label htmlFor="emailForOTP">Enter Email:</label>
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
                  <button type="submit"  style={{
                width: '50%',
                padding: '10px',
                borderRadius: '15px',
                border: 'none',
                backgroundColor: '#0F5132',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
              }}>Request OTP</button>
                </form>
              )}

              {/* Reset Password Form */}
              {otpSent && (
                <form onSubmit={handleResetPassword}             style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
>
                  <div>
      <label htmlFor="emailForReset"                 style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
      >Email:</label>
      <input
        type="email"
        id="emailForReset"
        name="emailForReset"
        value={otpFormData.emailForReset} // New state for email field
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
                    <label htmlFor="otpCode"                 style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                    >OTP:</label>

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
                    <label htmlFor="newPassword"                 style={{ fontSize: '14px', marginBottom: '5px', display: 'block' }}
                    >New Password:</label>
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
                  <button type="submit"  style={{
                width: '50%',
                padding: '10px',
                borderRadius: '15px',
                border: 'none',
                backgroundColor: '#0F5132',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
              }}>Reset Password</button>
                </form>
              )}
              <button onClick={() => setShowOTPForm(false)}  style={{
            marginTop: '10px',
            background: 'none',
            color: '#0F5132',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
          }}>Back to Sign In</button>
            </div>
          )}
        </div>
      )}


    {/* Toggle Panels */}
    <div className={styles.toggleContainer}>
      {!isSignUp ? (
        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
          <h1>New to our website?</h1>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        </div>
      ) : (
        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
          <h1>Already have an account?</h1>
          <button onClick={() => setIsSignUp(false)}>Sign In</button>
        </div>
      )}
    </div>
  </div>
);
}

export default AuthPage;
