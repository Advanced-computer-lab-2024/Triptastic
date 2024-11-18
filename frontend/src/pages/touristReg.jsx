import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signuptest.module.css'; // Import CSS module

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false); // State to toggle forms
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
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    // Handle sign-in logic
    console.log('Sign-In Data:', signInFormData);
  };

  return (
    <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>
      {/* Half-Sliding Circle */}
      <div className={styles.halfCircle}></div>

  {/* Sign-Up Form */}
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

      {/* Sign-In Form */}
      <div className={`${styles.formContainer} ${styles.signIn} ${!isSignUp ? styles.active : ''}`}>
        <form onSubmit={handleSignInSubmit}>
          <h1>Sign In</h1>
          <input
            type="email"
            name="Email"
            placeholder="Email"
            value={signInFormData.Email}
            onChange={handleSignInChange}
            required
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={signInFormData.Password}
            onChange={handleSignInChange}
            required
          />
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Toggle Panels */}
      <div className={styles.toggleContainer}>
  {!isSignUp ? (
    <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
      <h1>Hello Friend!</h1>
      <button onClick={() => setIsSignUp(true)}>Sign Up</button>
    </div>
  ) : (
    <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
      <h1>Welcome Back!</h1>
      <button onClick={() => setIsSignUp(false)}>Sign In</button>
    </div>
  )}
</div>

    </div>
  );
}

export default AuthPage;
