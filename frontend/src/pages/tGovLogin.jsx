import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function TourismGovLogin() {
  const [formData, setFormData] = useState({
    Username: '', 
    Password: ''   
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

      const response = await fetch('http://localhost:8000/tourismGovLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
        
      if (response.ok) {

        const data = await response.json();
        setSuccessMessage(' logged in successfully!');
        setErrorMessage('');
        navigate('/tourism-gov');

      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something wrong. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Tourism Governor Login</h2>
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
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default TourismGovLogin;
