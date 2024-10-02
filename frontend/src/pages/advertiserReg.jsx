import React, { useState } from 'react';

function AdvertiserReg() {
  const [formData, setFormData] = useState({
    Username:'',
    Email:'',
    Password:'',
    website_Link:'',
    Hotline:'',
    Company_Profile:'',
      
    
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const response = await fetch('http://localhost:8000/addAdvertiser', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Advertiser registered successfully!');
        setErrorMessage('');
        // Optionally, reset form data
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          website_Link:'',
          Hotline:'',
          Company_Profile:''
        });
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
          <label>website_Link:</label>
          <input
            type="text"
            name="website_Link"
            value={formData.website_Link}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Hotline:</label>
          <input
            type="text"
            name="Hotline"
            value={formData.Hotline}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Company_Profile:</label>
          <input
            type="text"
            name="Company_Profile"
            value={formData.Company_Profile}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register as Advertiser</button>
      </form>
    </div>
  );
}

export default AdvertiserReg;
