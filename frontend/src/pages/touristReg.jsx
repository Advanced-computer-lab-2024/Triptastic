import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './signuptest.module.css'; // Import CSS module
import background from '../images/back.webp'; // Replace with the path to your image
import logo2 from "../images/image_transparent.png";

function AuthPage() {
  const [selectedRole, setSelectedRole] = useState(""); // Track the selected role
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
  const [animatedText, setAnimatedText] = useState('');
  const fullText = 'Trriptastic'; // The full word to display
  
  const navigate = useNavigate();
  const [acceptTerms, setAcceptTerms] = useState(false); // Add this line
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    Id: null,
    Certificate: null,
    TaxationRegistryCard: null,
  });


 



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
    Username: '',
    Password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');



  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length-1) {
        setAnimatedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 200); // Delay for each letter (200ms)
    return () => clearInterval(interval);
  }, []);

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
  // Handle input changes for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
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
const handleLoginSubmit = async (e) => {
  e.preventDefault();

  // Prepare the login data for the request
  const loginDataList = [
    { url: 'http://localhost:8000/loginTourist', data: { Username: signInFormData.Username, Password: signInFormData.Password } },
    { url: 'http://localhost:8000/loginAdvertiser', data: { Username: signInFormData.Username, Password: signInFormData.Password } },
    { url: 'http://localhost:8000/loginSeller', data: { Username: signInFormData.Username, Password: signInFormData.Password } },
    { url: 'http://localhost:8000/loginTourGuide', data: { Username: signInFormData.Username, Password: signInFormData.Password } },
    { url: 'http://localhost:8000/AdminLogin', data: signInFormData },
    { url: 'http://localhost:8000/tourismGovLogin', data: signInFormData }, // Added tourismGovLogin here
  ];

  // Iterate over all login endpoints and try each one
  for (let i = 0; i < loginDataList.length; i++) {
    try {
      const response = await fetch(loginDataList[i].url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginDataList[i].data),
      });

      if (response.ok) {
        const data = await response.json();
        // Store user details based on the login type (context is set differently for each type)
        if (loginDataList[i].url === 'http://localhost:8000/loginTourist') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('context', 'tourist');
          localStorage.setItem('Username', data.user.Username);
          localStorage.setItem('Email', data.user.Email);
          localStorage.setItem('Nationality', data.user.Nationality);
          localStorage.setItem('DOB', data.user.DOB);
          localStorage.setItem('Occupation', data.user.Occupation);

          navigate('/tourist-profile');
        } else if (loginDataList[i].url === 'http://localhost:8000/loginAdvertiser') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('context', 'advertiser');
          localStorage.setItem('Username', data.user.Username);
          localStorage.setItem('Email', data.user.Email);
          localStorage.setItem('Nationality', data.user.Nationality);
          localStorage.setItem('DOB', data.user.DOB);
          localStorage.setItem('Occupation', data.user.Occupation);
          navigate('/advertiser-profile');
        } else if (loginDataList[i].url === 'http://localhost:8000/loginSeller') {
          localStorage.setItem('context', 'seller');
          localStorage.setItem('Username', data.user.Username);
          localStorage.setItem('Email', data.user.Email);
          localStorage.setItem('Nationality', data.user.Nationality);
          localStorage.setItem('DOB', data.user.DOB);
          localStorage.setItem('Occupation', data.user.Occupation);
          navigate('/seller-profile');
        } else if (loginDataList[i].url === 'http://localhost:8000/loginTourGuide') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('Username', data.user.Username);
          localStorage.setItem('Email', data.user.Email);
          localStorage.setItem('Nationality', data.user.Nationality);
          localStorage.setItem('DOB', data.user.DOB);
          localStorage.setItem('Occupation', data.user.Occupation);
          navigate('/tour-guide-profile');
        } else if (loginDataList[i].url === 'http://localhost:8000/AdminLogin') {
          localStorage.setItem('Username', formData.Username);
          localStorage.setItem('context', 'admin');
          navigate('/AdminPage');
        } else if (loginDataList[i].url === 'http://localhost:8000/tourismGovLogin') {
          localStorage.setItem('Username', formData.Username);
          localStorage.setItem('context', 'tourismGov');
          navigate('/tourism-gov');
        }

        // Set success message and break the loop if login is successful
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        return;
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  }

  // If none of the login attempts succeed, show a generic error message
  setSuccessMessage('');
  setErrorMessage('Login failed for all attempts. Please check your credentials.');
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate input fields
  if (!formData.Username || !formData.Email || !formData.Password) {
    setErrorMessage("Please fill all required fields.");
    return;
  }

  // Define endpoint and payload based on role
  let endpoint = "";
  let payload;
  let headers = {};

  switch (selectedRole) {
    case "tourGuide":
      endpoint = "http://localhost:8000/addTourGuide";
      payload = new FormData();
      payload.append("Username", formData.Username);
      payload.append("Email", formData.Email);
      payload.append("Password", formData.Password);
      payload.append("Id", formData.Id);
      payload.append("Certificate", formData.Certificate);
      break;

    case "seller":
      endpoint = "http://localhost:8000/createSeller";
      payload = new FormData();
      payload.append("Username", formData.Username);
      payload.append("Email", formData.Email);
      payload.append("Password", formData.Password);
      payload.append("Id", formData.Id);
      payload.append("TaxationRegistryCard", formData.TaxationRegistryCard);
      break;

    case "advertiser":
      endpoint = "http://localhost:8000/addAdvertiser";
      payload = new FormData();
      payload.append("Username", formData.Username);
      payload.append("Email", formData.Email);
      payload.append("Password", formData.Password);
      payload.append("Id", formData.Id);
      payload.append("TaxationRegistryCard", formData.TaxationRegistryCard);
      break;

    case "tourist":
      endpoint = "http://localhost:8000/addTourist";
      payload = JSON.stringify({
        Username: formData.Username,
        Email: formData.Email,
        Password: formData.Password,
        Nationality: formData.Nationality,
        DOB: formData.DOB,
        Occupation: formData.Occupation,
      });
      headers = { "Content-Type": "application/json" };
      break;

    default:
      setErrorMessage("Please select a valid role.");
      return;
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: payload,
    });

    if (response.ok) {
      const responseData = await response.json();

      // Store user data in localStorage
      localStorage.setItem("context", selectedRole);
      localStorage.setItem("Username", formData.Username);
      localStorage.setItem("Email", formData.Email);
      localStorage.setItem("Password", formData.Password);

      if (selectedRole === "tourist") {
        localStorage.setItem("Nationality", formData.Nationality);
        localStorage.setItem("DOB", formData.DOB);
        localStorage.setItem("Occupation", formData.Occupation);
      }

      setSuccessMessage(`${selectedRole} registered successfully!`);
      setErrorMessage("");

      // Reset form data
      setFormData({
        Username: "",
        Email: "",
        Password: "",
        Id: null,
        Certificate: null,
        TaxationRegistryCard: null,
        Nationality: "",
        DOB: "",
        Occupation: "",
      });

      // Redirect to role-specific profile page
      const redirectPath =
        selectedRole === "tourGuide"
          ? "/tour-guide-profile"
          : selectedRole === "seller"
          ? "/seller-profile"
          : selectedRole === "advertiser"
          ? "/advertiser-profile"
          : "/tourist-profile";

      navigate(redirectPath);
    } else {
      const errorData = await response.json();
      if (errorData.error === "Username already exists.") {
        alert("Username is already taken. Please choose another one.");
      } else {
        setErrorMessage(errorData.error || "Registration failed");
      }
      setSuccessMessage("");
    }
  } catch (error) {
    console.error("Error:", error);
    setErrorMessage("Something went wrong. Please try again later.");
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
  <div style={styles2.container}>
       <div style={styles2.overlay}></div>
       <header style={styles2.header}>
        {/* Animated Welcome Message */}
<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
  <div style={styles2.logoContainer}>
    <img src={logo2} alt="Logo" style={styles2.logo} />
  </div>
  <h1 style={styles2.title}>
    Welcome to <span style={styles2.highlight}>{animatedText}</span>
  </h1>
</div>
        

         
         
         <div className={`${styles.container} ${isSignUp ? styles.active : ''}`}>
    {/* Half-Sliding Circle */}
    <div className={styles.halfCircle}></div>

    {/* Main Content */}
    {/* Sign-Up Form */}
    {isSignUp && (
      <div className={`${styles.formContainer} ${styles.signUp} ${isSignUp ? styles.active : ''}`}>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        {/* Role Slider */}
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
      <label htmlFor="roleSlider" style={{ fontSize: "16px", fontWeight: "bold" }}>
        Select Your Role:
      </label>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "7px",
          marginTop: "10px",
        }}
      >
        <button
          onClick={() => setSelectedRole("tourist")}
          style={{
            padding: "3px 8px",
            borderRadius: "15px",
            border: selectedRole === "tourist" ? "2px solid #0F5132" : "1px solid #ccc",
            backgroundColor: selectedRole === "tourist" ? "#0F5132" : "#fff",
            color: selectedRole === "tourist" ? "#fff" : "#0F5132",
            cursor: "pointer",
          }}
        >
          Tourist
        </button>
        <button
          onClick={() => setSelectedRole("tourGuide")}
          style={{
            padding: "5px 10px",
            borderRadius: "15px",
            border: selectedRole === "tourGuide" ? "2px solid #0F5132" : "1px solid #ccc",
            backgroundColor: selectedRole === "tourGuide" ? "#0F5132" : "#fff",
            color: selectedRole === "tourGuide" ? "#fff" : "#0F5132",
            cursor: "pointer",
          }}
        >
          Tour Guide
        </button>
        <button
          onClick={() => setSelectedRole("seller")}
          style={{
            padding: "3px 8px",
            borderRadius: "15px",
            border: selectedRole === "seller" ? "2px solid #0F5132" : "1px solid #ccc",
            backgroundColor: selectedRole === "seller" ? "#0F5132" : "#fff",
            color: selectedRole === "seller" ? "#fff" : "#0F5132",
            cursor: "pointer",
          }}
        >
          Seller
        </button>
        <button
      onClick={() => setSelectedRole("advertiser")}
      style={{
        padding: "3px 10px",
        borderRadius: "15px",
        border: selectedRole === "advertiser" ? "2px solid #0F5132" : "1px solid #ccc",
        backgroundColor: selectedRole === "advertiser" ? "#0F5132" : "#fff",
        color: selectedRole === "advertiser" ? "#fff" : "#0F5132",
        cursor: "pointer",
      }}
    >
      Advertiser
    </button>
      </div>
    </div>
        <form onSubmit={handleSubmit}>          <div>
            <label htmlFor="signUpUsername">Username:</label>
            <input
              type="text"
              id="signUpUsername"
              name="Username"
              value={formData.Username}
              onChange={(e) => setFormData({ ...formData, Username: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="signUpEmail">Email:</label>
            <input
              type="email"
              id="signUpEmail"
              name="Email"
              value={formData.Email}
          onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
          required
            />
          </div>
          <div>
            <label htmlFor="signUpPassword">Password:</label>
            <input
              type="password"
              id="signUpPassword"
              name="Password"
              value={formData.Password}
              onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
              required
            />
          </div>
          {selectedRole === "tourist" && (
    <>     
         <div>
  <label htmlFor="signUpNationality">Nationality:</label>
  <input
    type="text"
    id="signUpNationality"
    name="Nationality"
    value={formData.Nationality}
    onChange={(e) => setFormData({ ...formData, Nationality: e.target.value })}
    required
  />
</div>
<div>
  <label htmlFor="signUpDOB">Date of Birth:</label>
  <input
    type="date"
    id="signUpDOB"
    name="DOB"
    value={formData.DOB}
    onChange={(e) => setFormData({ ...formData, DOB: e.target.value })}
    required
  />
</div>
<div>
  <label htmlFor="signUpOccupation">Occupation:</label>
  <input
    type="text"
    id="signUpOccupation"
    name="Occupation"
    value={formData.Occupation}
    onChange={(e) => setFormData({ ...formData, Occupation: e.target.value })}
    required
  />
</div>
</>


            )}
           {/* Role-specific fields */}
  {selectedRole === "tourGuide" && (
    <>
      <div>
        <label>ID:</label>
        <input
          type="file"
          name="Id"
          onChange={(e) =>
            setFormData({ ...formData, Id: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
        <label>Certificate:</label>
        <input
          type="file"
          name="Certificate"
          onChange={(e) =>
            setFormData({ ...formData, Certificate: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
    <input
      type="checkbox"
      checked={acceptTerms}
      onChange={(e) => setAcceptTerms(e.target.checked)}
      required
    />
    <label>I accept the terms and conditions</label>
  </div>
    </>
  )}

  {selectedRole === "seller" && (
    <>
      <div>
        <label>ID:</label>
        <input
          type="file"
          name="Id"
          onChange={(e) =>
            setFormData({ ...formData, Id: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
        <label>Taxation Registry Card:</label>
        <input
          type="file"
          name="TaxationRegistryCard"
          onChange={(e) =>
            setFormData({ ...formData, TaxationRegistryCard: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
    <input
      type="checkbox"
      checked={acceptTerms}
      onChange={(e) => setAcceptTerms(e.target.checked)}
      required
    />
    <label>I accept the terms and conditions</label>
  </div>
    </>
  )}
   {selectedRole === "advertiser" && (
    <>
      <div>
        <label>ID:</label>
        <input
          type="file"
          name="Id"
          onChange={(e) =>
            setFormData({ ...formData, Id: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
        <label>Taxation Registry Card:</label>
        <input
          type="file"
          name="TaxationRegistryCard"
          onChange={(e) =>
            setFormData({ ...formData, TaxationRegistryCard: e.target.files[0] })
          }
          required
        />
      </div>
      <div>
    <input
      type="checkbox"
      checked={acceptTerms}
      onChange={(e) => setAcceptTerms(e.target.checked)}
      required
    />
    <label>I accept the terms and conditions</label>
  </div>
    </>
  )}


 

  <button type="submit"  style={{
          width: '35%',
          padding: '2px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#0F5132',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '5px',
        }}>Register</button>
</form>
          
      </div>
    )}

       
   {/* Sign-In Form */}
{showSignIn && !isSignUp && !showOTPForm && (
  <div
    className={`${styles.formContainer2} ${styles.signIn}`}
    style={{
      width: '50%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      right: '55%',
    }}
  >
    <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Sign In</h1>
    <form
      onSubmit={handleLoginSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <label style={{ fontSize: '14px', marginBottom: '2px', display: 'block' }}>
        Username:
      </label>
      <input
        type="text"
        name="Username"
        placeholder="Username"
        value={signInFormData.Username}
        onChange={handleSignInChange}
        required
        style={{
          width: '100%',
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      <label style={{ fontSize: '14px', marginBottom: '2px', display: 'block' }}>
        Password:
      </label>
      <input
        type="password"
        name="Password"
        placeholder="Password"
        value={signInFormData.Password}
        onChange={handleSignInChange}
        required
        style={{
          width: '100%',
          padding: '5px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          fontSize: '14px',
        }}
      />
      <button
        type="submit"
        style={{
          width: '35%',
          padding: '2px',
          borderRadius: '15px',
          border: 'none',
          backgroundColor: '#0F5132',
          color: '#fff',
          fontSize: '14px',
          cursor: 'pointer',
          marginTop: '5px',
        }}
      >
        Sign In
      </button>
    </form>

    <button
      onClick={() => {
        setShowSignIn(false);
        setShowOTPForm(true);
      }}
      style={{
        background: 'none',
        color: '#0F5132',
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '14px',
        marginTop: '3px',
      }}
    >
      Forgot Password?
    </button>
  </div>
)}

{/* OTP Form */}
{showOTPForm && (
  <div
    className={`${styles.otpResetForm}`}
    style={{
      width: '50%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: 'transparent',
      borderRadius: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      right: '25%',  
    }}
  >
    {/* OTP Request Form */}
    {!otpSent && (
      <form
        onSubmit={handleRequestOTP}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
      >
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
              padding: '5px',
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
            fontSize: '12px',
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
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          right: '55%',
        }}
      >
        <div>
          <label htmlFor="otpCode">OTP:</label>
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
          <label htmlFor="newPassword">New Password:</label>
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
            fontSize: '12px',
            cursor: 'pointer',
          }}
        >
          Reset Password
        </button>
      </form>
    )}
    <button
      onClick={() => {
        setShowOTPForm(false);
        setShowSignIn(true);
      }}
      style={{
        marginTop: '4px',
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



    {/* Toggle Panels */}
    <div className={styles.toggleContainer}>
      {!isSignUp ? (
        <div className={`${styles.togglePanel} ${styles.toggleRight}`}>
          <h1 style={{
           
           fontSize: '32px',
         
         }}>New to our website?</h1>
          <button onClick={() => setIsSignUp(true)}>Sign Up</button>
        </div>
      ) : (
        <div className={`${styles.togglePanel} ${styles.toggleLeft}`}>
          <h1  style={{
           
            fontSize: '32px',
          
          }}>Already have an account?</h1>
          <button onClick={() => setIsSignUp(false)}>Sign In</button>
        </div>
      )}
    </div>
  </div>
         
         
         
         
         {/* Continue as Guest */}
<div style={{ marginTop: "20px", textAlign: "center" }}>
  <button
    onClick={() => navigate("/Guest")}
    style={{
      padding: "10px 20px",
      borderRadius: "15px",
      border: "2px solid #0F5132",
      backgroundColor: "transparent",
      color: "white",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    Continue as Guest
  </button>
</div>
         
         
         
       
      </header>
    </div>
 
);
}
const styles2 = {
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom:'70px',
  },
  logo: {
    height: '40px',
    width: '50px',
    borderRadius: '10px',
  },
    container: {
      position: 'relative',
      width: '100%',
      height: '100vh',
      backgroundImage: `url(${background})`, // Replace with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Dark overlay for contrast
      zIndex: 1,
    },
    header: {
      position: 'relative',
      zIndex: 2,
      textAlign: 'center',
      color: '#fff',
      marginBottom: '10px', // Add spacing below the title
    },
    title: {
      fontSize: '3rem',
      fontWeight: 'bold',
      marginBottom: '80px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
    },
    highlight: {
      color: '#197B4D',
    },
    formContainer: {
      position: 'relative',
      zIndex: 2,
      width: '80%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)', // Make it slightly transparent
      borderRadius: '15px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    },
    content: {
      marginTop: '5px',
      textAlign: 'center',
    },
    description: {
      color: 'white',
      fontSize: '1.2rem',
      marginBottom: '10px',
    },
    dropdown: {
      padding: '10px',
      fontSize: '16px',
      borderRadius: '5px',
      marginBottom: '20px',
      border: '1px solid #ccc',
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      color: '#fff',
      backgroundColor: '#197B4D',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s',
    },
  
};

export default AuthPage;
