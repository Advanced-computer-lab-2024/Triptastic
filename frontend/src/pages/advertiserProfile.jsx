import React, { useState, useEffect } from 'react';
import './advertiserProfile.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
const AdvertiserProfile = () => {


  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Website_Link: '',
    Hotline: '',
    Company_Profile: '',
   
  });
  const navigate = useNavigate();


  const fetchAdvertiserInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username'); // Get the username from local storage

    if (Username) {
      try {
     
        const response = await fetch(`http://localhost:8000/getAdvertiser?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
       

        if (response.ok) {
          const data = await response.json();
         
          if (data) {
            setAdvertiserInfo(data); // Set the fetched information
            setErrorMessage('');
          } else {
            setErrorMessage('No advertiser information found.');
          }
        } else {
          throw new Error('Failed to fetch advertiser information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching advertiser information');
        console.error(error);
      }
    } else {
      setErrorMessage('No advertiser information found.');
    }
    setLoading(false);
  };



  useEffect(() => {
    fetchAdvertiserInfo();
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
   // const Username = localStorage.getItem('Username'); // Get the username from local storage

    try {
      const response = await fetch(`http://localhost:8000/updateAdvertiser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAdvertiserInfo(updatedData); // Update the UI with new information
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update advertiser profile');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile.');
      console.error(error);
    }

    setUpdating(false);
  };

  return (
    <div>
      <h2>Advertiser Profile</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading advertiser information...</p>
      ) : (
        advertiserInfo && (
          <div>
            <div>
              <label><strong>Username:</strong></label>
              <p>{advertiserInfo.Username}</p> {/* Display Username as text */}
            </div>
            <div>
              <label><strong>Website Link:</strong></label>
              <input
                 type="text"
                  name="website_Link"
                value={formData.website_Link}
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
           <label> <strong>Hotline:</strong></label>
                  <input
                    type="text"
                    name="Hotline"
                value={formData.Hotline}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label><strong>Company Profile:</strong></label>
              <input
                type="text" 
                name="Company_Profile"
                value={formData.Company_Profile}
                onChange={handleInputChange}
              />
            </div>
           
           

            <button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Update Information'}
            </button>
          </div>
        )
      )}
      <button onClick={fetchAdvertiserInfo}>Refresh My Information</button>
       {/* Sidebar */}
       <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/Activities')}>My Activities</li>
          
        </ul>
      </div>
    </div>
    
  );
};


export default AdvertiserProfile;
