import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './touristReg.css'; // Import the CSS file

function TouristReg() {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/addTourist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('Username', formData.Username);
        localStorage.setItem('Email', formData.Email);
        localStorage.setItem('Password', formData.Password);
        localStorage.setItem('Nationality', formData.Nationality);
        localStorage.setItem('DOB', formData.DOB);
        localStorage.setItem('Occupation', formData.Occupation);

        setSuccessMessage('Tourist registered successfully!');
        setErrorMessage('');
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          Nationality: '',
          DOB: '',
          Occupation: ''
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

  return (
    <div className="container">
      <h2>Tourist Registration</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
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
          <label>Nationality:</label>
          <input
            type="text"
            name="Nationality"
            value={formData.Nationality}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="DOB"
            value={formData.DOB}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Occupation:</label>
          <input
            type="text"
            name="Occupation"
            value={formData.Occupation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register as Tourist</button>
      </form>
    </div>
  );
}

export default TouristReg;
