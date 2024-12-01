import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Modal component for Terms and Conditions
const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3>Terms and Conditions</h3>
        <p>
          {/* Add your terms and conditions text here */}
          These are the terms and conditions for registering as an advertiser. Please read them carefully.
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

function AdvertiserReg() {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Id: null, // To hold the file for ID
    TaxationRegistryCard: null, // To hold the file for Taxation Registry Card
  });
  const [acceptTerms, setAcceptTerms] = useState(false); // State for terms acceptance
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  }); // State for login form
  const navigate = useNavigate();

  // Handle input changes for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0] // Store the first selected file
    }));
  };

  // Handle checkbox change
  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  // Handle login form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
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
    data.append('TaxationRegistryCard', formData.TaxationRegistryCard);

    try {
      const response = await fetch('http://localhost:8000/addAdvertiser', {
        method: 'POST',
        body: data // Send FormData
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('Username', formData.Username);
        localStorage.setItem('Email', formData.Email);
        localStorage.setItem('Password', formData.Password);
        setSuccessMessage('Advertiser registered successfully!');
        setErrorMessage('');
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          Id: null,
          TaxationRegistryCard: null,
        });
        navigate('/advertiser-profile');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  // Handle login form submission
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/loginAdvertiser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Email: loginData.email,
          Password: loginData.password,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        localStorage.setItem('token', responseData.token);
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        navigate('/advertiser-profile'); // Redirect to dashboard or another page
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Advertiser Registration</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>ID:</label>
          <input
            type="file"
            name="Id"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <label>Taxation Registry Card:</label>
          <input
            type="file"
            name="TaxationRegistryCard"
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={handleTermsChange}
            required
          />
          <label>
            I accept the terms and conditions
            <button type="button" onClick={() => setIsModalOpen(true)}>
              Read Terms
            </button>
          </label>
        </div>
        <button type="submit">Register as Advertiser</button>
      </form>

      {/* Modal for Terms and Conditions */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Login Form */}
      <h2>Advertiser Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdvertiserReg;
