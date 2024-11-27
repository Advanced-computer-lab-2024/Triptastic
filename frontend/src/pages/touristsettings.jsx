import React, { useState, useEffect, useContext } from 'react';
import './touristsettings.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa"; // For menu icons
import { FaPercentage, FaCalendarAlt, FaTag } from 'react-icons/fa';

const TouristSettings = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [touristInfo, setTouristInfo] = useState(null);
  const [complaints, setComplaints] = useState([]); // New state for complaints
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [successMessage, setSuccessMessage] = useState(''); // Initialize successMessage
  const [requestSent, setRequestSent] = useState(false); // Track if request was successfully sent
  const [waiting, setWaiting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordChangeMessage, setPasswordChangeMessage] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
const [showAddresses, setShowAddresses] = useState(false);
const [showAddressForm, setShowAddressForm] = useState(false);
const [addresses, setAddresses] = useState([]);

const [newAddress, setNewAddress] = useState({
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phoneNumber: '',
  isPrimary: false
});
  localStorage.setItem('context', 'tourist');
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
 
  const [formData, setFormData] = useState({
    Username: '',
    points:'',
    badge:'',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
    Wallet: '',
    title: '', 
    body: '',  
    date: ''  
  });
  
  const navigate = useNavigate();

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError('New passwords do not match.');
      return;
    }
  
    setChangingPassword(true);
    setPasswordChangeError('');
    setPasswordChangeMessage('');
  
    try {
      const username = localStorage.getItem('Username'); // Assuming the username is saved in localStorage
      const response = await axios.patch('http://localhost:8000/changePasswordTourist', {
        Username: username,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
  
      if (response.status === 200) {
        setPasswordChangeMessage('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setPasswordChangeError('Failed to change password.');
      }
    } catch (error) {
      setPasswordChangeError(error.response?.data?.error || 'An error occurred.');
    } finally {
      setChangingPassword(false);
    }
  };

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
            // Apply currency conversion to Wallet balance
            data.Wallet = (data.Wallet * conversionRate).toFixed(2);
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

  // New function to fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getComplaintsByTourist?username=${Username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data); // Set complaints state
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch complaints');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching complaints');
      console.error(error);
    }
    setLoading(false);
  };
  const fetchAddresses = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getAddresses?username=${Username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching addresses');
      console.error(error);
    }
  };
  
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/addAddress?username=${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAddress)
      });
  
      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses);
        setShowAddressForm(false);
        setNewAddress({
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          phoneNumber: '',
          isPrimary: false
        });
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add address');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error(error);
    }
  };
  
  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  useEffect(() => {
    fetchTouristInfo();
    fetchComplaints(); // Fetch complaints when the component loads
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

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      const username = localStorage.getItem('Username'); // Retrieve username from localStorage

      if (!username) {
        setErrorMessage('Username not found in localStorage. Please log in again.');
        return; // Exit the function if username is not found
      }

      const complaintData = {
        title: formData.title,
        body: formData.body,
        date: formData.date,
      };

      // Construct the URL with the username as a query parameter
      const response = await fetch(`http://localhost:8000/fileComplaint?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData), // Send form data
      });

      if (response.ok) {
        alert('Complaint filed successfully!');
        setErrorMessage('');
        setFormData((prev) => ({ ...prev, ...complaintData, title: '', body: '', date: '' }));
        fetchComplaints(); // Refresh complaints after filing a new one
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to file complaint');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem('Username');
    setWaiting(true);
    setRequestSent(false); // Reset request sent state when initiating new request
    try {
      const response = await fetch(`http://localhost:8000/requestAccountDeletionTourist?Username=${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequestSent(true); // Set to true when the request is successfully sent
        alert('Your account deletion request has been submitted and is pending approval.');
      } else {
        setRequestSent(false); // Reset to allow another deletion request
        alert(data.msg); // Show the rejection message
      }
    } catch (error) {
      alert('Error deleting account');
    } finally {
      setWaiting(false); // Stop waiting regardless of outcome
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="tourist-profile-container">
      <div className="profile-content">
        <header style={styles.header}>
          <div style={styles.logoContainer}>
          <div style={{ ...styles.logoContainer, marginLeft: '30px' }}>
            <img
              src={logo}
              alt="Logo"
              style={styles.logo}
  
            />
             </div>
          </div>
          <h1 style={styles.title}>Tourist Profile</h1>
          <FaUserCircle
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={() => navigate('/tourist-profile')} // Navigate to profile
          />
          
        </header>
      

  
  
        
        <button onClick={handleDeleteRequest} disabled={waiting || requestSent}>
              {waiting ? 'Waiting to be deleted...' : requestSent ? 'Request Sent' : 'Delete Account'}
            </button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading tourist information...</p>
        ) : (
          touristInfo && (
            <div>
              <div>
                <label><strong>Username:</strong></label>
                <p>{touristInfo.Username}</p>
              </div>
              <div>
                <label><strong>Points:</strong></label>
                <p>{touristInfo.points}</p> 
              </div>
              <div>
                <label><strong>Badge:</strong></label>
                <p>{touristInfo.badge}</p> 
              </div>
              <div>
                <label><strong>Wallet Balance:</strong></label>
                <p>{touristInfo.Wallet} {selectedCurrency}</p> 
              </div>
              <div>
  <label><strong>My Preferences:</strong></label>
  <ul>
    {touristInfo.preferences && touristInfo.preferences.length > 0 ? (
      touristInfo.preferences.map((preference, index) => (
        <li key={index}>{preference}</li>
      ))
    ) : (
      <p>No preferences available.</p>
    )}
  </ul>
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
  <label><strong>Select Currency:</strong></label>
  <select value={selectedCurrency} onChange={handleCurrencyChange}>
    <option value="EGP">Egyptian Pound (EGP)</option>
    <option value="USD">US Dollar (USD)</option>
    <option value="EUR">Euro (EUR)</option>
    <option value="GBP">British Pound (GBP)</option>
    {/* Add more currency options as needed */}
  </select>
  </div>
  <p>Price: {(touristInfo.Wallet * conversionRate).toFixed(2)} {selectedCurrency}</p>
              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchTouristInfo}>Refresh My Information</button>
      </div>
      <div className="change-password-section">
  <h3>Change Password</h3>
  <form onSubmit={handlePasswordChange}>
    <div>
      <label>Current Password:</label>
      <input
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
    </div>
    <div>
      <label>New Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
    </div>
    <div>
      <label>Confirm New Password:</label>
      <input
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        required
      />
    </div>
    <button type="submit" disabled={changingPassword}>
      {changingPassword ? 'Changing Password...' : 'Change Password'}
    </button>
  </form>
  {passwordChangeMessage && <p style={{ color: 'green' }}>{passwordChangeMessage}</p>}
  {passwordChangeError && <p style={{ color: 'red' }}>{passwordChangeError}</p>}
  </div>
  
     
  
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      
  {/* Fetch Product by Name */}
  <div>
 
  
  
  </div>
  
      <div>
        
      </div>
      {/* Sidebar */}
      
  
      {/* File Complaint Form */}
      <div>
        <h3>File a Complaint</h3>
        <form onSubmit={handleSubmitComplaint}>
          <div>
            <label><strong>Title:</strong></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label><strong>Body:</strong></label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label><strong>Date:</strong></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">File Complaint</button>
        </form>
      </div>
  
    {/* Display Complaints */}
  <div>
  <h3>Your Complaints</h3>
  {complaints.length === 0 ? (
    <p>No complaints filed yet.</p>
  ) : (
    <ul>
      {complaints.map((complaint) => (
        <li key={complaint._id}>
          <p><strong>Title:</strong> {complaint.title}</p>
          <p><strong>Status:</strong> {complaint.status}</p>
          <p><strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}</p>
  
          {/* Display replies if they exist */}
          {complaint.replies && complaint.replies.length > 0 ? (
            <div className="replies-section">
              <h4>Replies:</h4>
              <ul>
                {complaint.replies.map((reply, index) => (
                  <li key={index}>
                    <p><strong>Reply:</strong> {reply.content}</p>
                    <p><strong>Date:</strong> {new Date(reply.date).toLocaleDateString()}</p>
                    {reply.replier && <p><strong>Replier:</strong> {reply.replier}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p><em>No replies yet.</em></p>
          )}
        </li>
      ))}
    </ul>
  )}
  </div>
  <div>
      <div>
        <h2>My Addresses</h2>
      </div>

      <button
        style={styles.addButton}
        onClick={() => setShowAddresses((prev) => !prev)} // Toggle addresses visibility
      >
        {showAddresses ? 'Hide Addresses' : 'View Addresses'}
      </button>

      {showAddresses && (
        <div>
          {addresses.map((address, index) => (
            <div key={index} style={styles.productItem}>
              <p style={styles.productName}>{address.addressLine1}</p>
              <p>{address.city}, {address.country}</p>
              {address.isPrimary && <span style={{color: '#0F5132', fontWeight: 'bold'}}>Primary Address</span>}
            </div>
          ))}
          <button
        style={styles.addButton}
        onClick={() => setShowAddressForm((prev) => !prev)} // Toggle form visibility independently
      >
        {showAddressForm ? 'Cancel' : 'Add New Address'} {/* Dynamic Button Text */}
      </button>

        </div>
      )}

      {showAddressForm && (
     <form onSubmit={handleAddAddress} style={styles.container}>
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="addressLine1"
       value={newAddress.addressLine1}
       onChange={handleAddressInputChange}
       placeholder="Address Line 1"
       required
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="addressLine2"
       value={newAddress.addressLine2}
       onChange={handleAddressInputChange}
       placeholder="Address Line 2"
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="city"
       value={newAddress.city}
       onChange={handleAddressInputChange}
       placeholder="City"
       required
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="state"
       value={newAddress.state}
       onChange={handleAddressInputChange}
       placeholder="State"
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="postalCode"
       value={newAddress.postalCode}
       onChange={handleAddressInputChange}
       placeholder="Postal Code"
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="country"
       value={newAddress.country}
       onChange={handleAddressInputChange}
       placeholder="Country"
       required
     />
     
     <input
       style={{
         width: '100%',
         padding: '10px',
         marginBottom: '10px',
         borderRadius: '5px',
         border: '1px solid #ddd'
       }}
       name="phoneNumber"
       value={newAddress.phoneNumber}
       onChange={handleAddressInputChange}
       placeholder="Phone Number"
     />
     
     <div style={{ display: 'flex', alignItems: 'center' }}>
       <label style={{ marginRight: '10px' }}>Is Primary</label>
       <input
         type="checkbox"
         name="isPrimary"
         checked={newAddress.isPrimary}
         onChange={handleAddressInputChange}
       />
     </div>
          <div style={{
            display: 'flex', 
            justifyContent: 'space-between'
          }}>
            <button 
              type="submit" 
              style={styles.addButton}
            >
              Submit Address
            </button>
            <button 
              type="button" 
              style={{
                ...styles.filterButton, 
                backgroundColor: '#dc3545'
              }}
              onClick={() => setShowAddressForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {errorMessage && (
        <div style={{
          color: 'red', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '5px', 
          marginTop: '10px'
        }}>
          {errorMessage}
        </div>
      )}
    </div>
     
      {successMessage && <div className="success">{successMessage}</div>}
   
  
      
    </div>
    
  );
  };
  const styles = {
    container: {
      maxWidth: '800px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
  
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      backgroundColor: '#0F5132',
      padding: '10px 20px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    logo: {
      height: '70px',
      width: '80px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
    },
    profileIcon: {
      fontSize: '40px',
      color: 'white',
      cursor: 'pointer',
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    actionButtons: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      marginTop: '10px',
    },
    wishlistButton: {
      backgroundColor: '#0F5132',
      color: '#fff',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '10px',
    },title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: 0,
    },
    
    cartIcon: {
      width: '50px',
      height: '50px',
      cursor: 'pointer',
      
    },
    filterForm: {
      margin: '20px 0',
    },
    filterButton: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    productList: {
      listStyleType: 'none',
      padding: 0,
    },
    productItem: {
      backgroundColor: '#fff',
      padding: '20px',
      marginBottom: '10px',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    productName: {
      fontSize: '20px',
      color: '#0F5132',
    },
    productImage: {
      width: '100%',
      maxWidth: '400px',
      height: '300px',
      objectFit: 'cover',
      borderRadius: '10px',
    },
    addButton: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
  };

export default TouristSettings;
