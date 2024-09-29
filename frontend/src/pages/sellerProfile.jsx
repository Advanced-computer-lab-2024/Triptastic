import React, { useState, useEffect } from 'react';

function SellerProfile() {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Name: '', // Additional fields
    Description: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch seller information on component mount
  useEffect(() => {
    fetchSellerInfo(); // Fetch initially if needed
  }, []);

  // Function to fetch seller information
  const fetchSellerInfo = async () => {
    console.log("Fetching seller information..."); // Debugging log
    try {
      const response = await fetch('http://localhost:8000/getSeller');
      
      console.log("Response Status:", response.status); // Debugging log
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched Data:", data); // Debugging log
        
        setFormData({
          Username: data.Username || '',
          Email: data.Email || '',
          Password: data.Password || '',
          Name: data.Name || '',
          Description: data.Description || ''
        });
        setSuccessMessage('Seller information fetched successfully!');
        setErrorMessage('');
      } else {
        console.error("Error fetching seller information:", response.status); // Debugging log
        setErrorMessage('Failed to fetch seller information.');
      }
    } catch (error) {
      console.error("Fetch error:", error); // Debugging log
      setErrorMessage('Something went wrong while fetching seller information.');
    }
  };
  

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission for updating seller information
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/updateSeller', {
        method: 'PATCH', // Use PATCH for partial updates
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccessMessage('Seller information updated successfully!');
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Update failed');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong while updating seller information.');
    }
  };

  return (
    <div>
      <h2>Seller Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      {/* Button to fetch and display seller information */}
      <button onClick={fetchSellerInfo}>View My Information</button>

      <form onSubmit={handleUpdate}>
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
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Seller Information</button>
      </form>
    </div>
  );
}

export default SellerProfile;
