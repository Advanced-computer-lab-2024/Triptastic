import React, { useState , useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';


const SellerProfile = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Name:'',
    Description:''
  });
  const navigate = useNavigate();

  const fetchSellerInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getSeller?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSellerInfo(data);
            setFormData(data); // Pre-fill the form with current data
            setErrorMessage('');
          } else {
            setErrorMessage('No seller information found.');
          }
        } else {
          throw new Error('Failed to fetch seller information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching seller information');
        console.error(error);
      }
    } else {
      setErrorMessage('No seller information found.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSellerInfo();
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
      const response = await fetch('http://localhost:8000/updateSeller', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedSeller = await response.json();
        setSellerInfo(updatedSeller);
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update seller information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating seller information');
      console.error(error);
    }
    setUpdating(false);
  };

  return (
    <div className="seller-profile-container">
      <div className="profile-content">
        <h2>Seller Profile</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading seller information...</p>
        ) : (
          sellerInfo && (
            <div>
              <div>
                <label><strong>Username:</strong></label>
                <p>{sellerInfo.Username}</p> {/* Display Username as text */}
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
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Description:</strong></label>
                <input
                  type="text" // Display DOB as a string
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </div>
              

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchSellerInfo}>Refresh My Information</button>
      </div>
       
       {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          
          <li onClick={() => navigate('/products')}>Products</li>
          
        </ul>
      </div>
      
    </div>
  );

};

export default SellerProfile;

