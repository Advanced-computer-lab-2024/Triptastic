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
          These are the terms and conditions for registering as a seller. Please read them carefully.
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

function SellerReg() {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Id: null, // For file upload
    TaxationRegistryCard: null, // For file upload
  });
  const [acceptTerms, setAcceptTerms] = useState(false); // State for terms acceptance
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Store the first file selected
    }));
  };

  // Handle checkbox change
  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
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

    // Create FormData to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('Username', formData.Username);
    formDataToSend.append('Email', formData.Email);
    formDataToSend.append('Password', formData.Password);
    formDataToSend.append('Id', formData.Id); // Add file
    formDataToSend.append('TaxationRegistryCard', formData.TaxationRegistryCard); // Add file

    try {
      const response = await fetch('http://localhost:8000/createSeller', {
        method: 'POST',
        body: formDataToSend, // Send FormData
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('Username', formData.Username);
        localStorage.setItem('Email', formData.Email);
        localStorage.setItem('Password', formData.Password);
        setSuccessMessage('Seller registered successfully!');
        setErrorMessage('');
        // Optionally, reset form data
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          Id: null,
          TaxationRegistryCard: null,
        });
        navigate('/seller-profile');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Registration failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Seller Registration</h2>
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
        <button type="submit">Register as Seller</button>
      </form>

      {/* Modal for Terms and Conditions */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default SellerReg;
