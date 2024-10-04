import React, { useState, useEffect } from 'react';
import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';


const TouristProfile = () => {

  const [touristInfo, setTouristInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
    Wallet: '' // Read-only Wallet attribute
  });
  const navigate = useNavigate();

  const fetchTouristInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getTourist?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTouristInfo(data);
            setFormData(data); // Pre-fill the form with current data
            setErrorMessage('');
          } else {
            setErrorMessage('No tourist information found.');
          }
        } else {
          throw new Error('Failed to fetch tourist information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching tourist information');
        console.error(error);
      }
    } else {
      setErrorMessage('No tourist information found.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTouristInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/updateTourist', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTourist = await response.json();
        setTouristInfo(updatedTourist);
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update tourist information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating tourist information');
      console.error(error);
    }
    setUpdating(false);
  };

  return (
    <div className="tourist-profile-container">
      <div className="profile-content">
        <h2>Tourist Profile</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading tourist information...</p>
        ) : (
          touristInfo && (
            <div>
              <div>
                <label><strong>Username:</strong></label>
                <p>{touristInfo.Username}</p> {/* Display Username as text */}
              </div>
              <div>
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Password:</strong></label>
                <input
                  type="text" // Visible password
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Nationality:</strong></label>
                <input
                  type="text"
                  name="Nationality"
                  value={formData.Nationality}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Date of Birth:</strong></label>
                <input
                  type="text" // Display DOB as a string
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Occupation:</strong></label>
                <input
                  type="text"
                  name="Occupation"
                  value={formData.Occupation}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Wallet:</strong></label>
                <p>{touristInfo.Wallet}</p> {/* Display Wallet as text */}
              </div>

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchTouristInfo}>Refresh My Information</button>
      </div>

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/historical-locations')}>Historical Locations</li>
          <li onClick={() => navigate('/museums')}>Museums</li>
          <li onClick={() => navigate('/products')}>Products</li>
          <li onClick={() => navigate('/itineraries')}>Itineraries</li>
        </ul>
      </div>
    </div>
  );
};

export default TouristProfile;
