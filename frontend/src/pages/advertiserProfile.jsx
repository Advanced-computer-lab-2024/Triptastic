import React, { useState, useEffect } from 'react';
import './advertiserProfile.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const AdvertiserProfile = () => {
  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [logo, setLogo] = useState(null);
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Website_Link: '',
    Hotline: '',
    Company_Profile: '',
    Logo:''
  });
  const [transportFormData, setTransportFormData] = useState({
    type: 'Bus', // Default value from enum options
    company: {
      name: '',
      contact: {
        phone: '',
        email: '',
      },
    },
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    availability: true,
    seatsAvailable: '',
  });
   // State for the logo file
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const logoURL = URL.createObjectURL(file);
      setLogo(logoURL); // Display the selected logo immediately
      setFormData((prevData) => ({
        ...prevData,
        Logo: file, // Store the file for uploading
      }));
    }
  };

  useEffect(() => {
  
    fetchAdvertiserInfo();
    fetchActivities();
  }, []);

  const fetchAdvertiserInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');

    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getAdvertiser?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setAdvertiserInfo(data);
            setErrorMessage('');
            setFormData({
              Username: data.Username,
              Email: data.Email,
              Password: data.Password,
              Website_Link: data.Website_Link,
              Hotline: data.Hotline,
              Company_Profile: data.Company_Profile,
              Logo: data.Logo,
            });

            // Set logo URL if available and save it to local storage
            if (data.Logo) {
            const logoURL = data.Logo;
            setLogo(logoURL);
            localStorage.setItem('logo', logoURL); // Store logo URL in local storage
            }
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

  const handleUpdate = async () => {
    setUpdating(true);
    const form = new FormData();
    
    form.append('Username', formData.Username);
    form.append('Email', formData.Email);
    form.append('Password', formData.Password);
    form.append('Hotline', formData.Hotline);
    form.append('Company_Profile', formData.Company_Profile);
    form.append('Website_Link', formData.Website_Link);
  
    if (formData.Logo) {
      form.append('Logo', formData.Logo);
    }

    try {
      const response = await fetch(`http://localhost:8000/updateAdvertiser`, {
        method: 'PATCH',
        body: form, // Send FormData
      });

      if (response.ok) {
        const updatedData = await response.json();
        setAdvertiserInfo(updatedData);
        setErrorMessage('');
        alert('Information updated successfully!');
        
        // Update logo in local storage if it has changed
        if (updatedData.Logo) {
          const logoURL = URL.createObjectURL(updatedData.Logo);
          setLogo(logoURL);
          localStorage.setItem('logo', logoURL); // Update logo URL in local storage
        }
      } else {
        throw new Error('Failed to update advertiser profile');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating your profile.');
      console.error(error);
    }

    setUpdating(false);
  };

  const fetchActivities = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/getActivity?Advertiser=${Username}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length === 0) {
          setErrorMessage('No activities found for this advertiser.');
        } else {
          setActivities(data);
          setErrorMessage('');
        }
      } else {
        throw new Error('Failed to fetch activities');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching activities');
      console.error(error);
    }
  };


  const handlePasswordChange = async () => {
    const Username = localStorage.getItem('Username');
  
    try {
      const response = await fetch(`http://localhost:8000/changePasswordAdvertiser`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username,
          currentPassword,
          newPassword,
        }),
      });
  
      if (response.ok) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to change password');
      }
    } catch (error) {
      setErrorMessage('An error occurred while changing the password');
      console.error(error);
    }
  };
  
  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem('Username');
    setWaiting(true);
    setRequestSent(false);
    try {
      const response = await fetch(`http://localhost:8000/requestAccountDeletionAdvertiser?Username=${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setRequestSent(true);
        alert('Your account deletion request has been submitted and is pending approval.');
      } else {
        setRequestSent(false);
        alert(data.msg);
      }
    } catch (error) {
      alert('Error deleting account');
    } finally {
      setWaiting(false);
    }
  };
  const handleTransportInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith("company.contact.")) {
      // Handle nested company contact fields
      const contactField = name.split(".")[2];
      setTransportFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          contact: {
            ...prevData.company.contact,
            [contactField]: value,
          },
        },
      }));
    } else if (name.startsWith("company.")) {
      // Handle company name field
      const companyField = name.split(".")[1];
      setTransportFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          [companyField]: value,
        },
      }));
    } else {
      // Handle other fields
      setTransportFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreateTransportation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/createTransportation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transportFormData),
      });

      if (response.ok) {
        alert('Transportation created successfully!');
        setTransportFormData({
          type: 'Bus',
          company: {
            name: '',
            contact: {
              phone: '',
              email: '',
            },
          },
          origin: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          availability: true,
          seatsAvailable: '',
        });
      } else {
        throw new Error('Failed to create transportation');
      }
    } catch (error) {
      console.error('An error occurred while creating transportation:', error);
    }
  };

  return (
    <div>
      <h2>Advertiser Profile</h2>
      <div>
        <h3>Change Password</h3>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button onClick={handlePasswordChange}>Change Password</button>
      </div>
  
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {loading ? (
        <p>Loading advertiser information...</p>
      ) : (
        advertiserInfo && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {logo && (
                <img
                  src={`http://localhost:8000/${logo.replace(/\\/g, '/')}`}
                  alt="Advertiser Logo"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
              )}
              <label><strong>Username:</strong></label>
              <p>{advertiserInfo.Username}</p>
            </div>
            <div>
              <label><strong>Website Link:</strong></label>
              <input
                type="text"
                name="Website_Link"
                value={formData.Website_Link}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label><strong>Password:</strong></label>
              <input
                type="password"
                name="Password"
                value={formData.Password}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label><strong>Hotline:</strong></label>
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
            <div>
              <label><strong>Logo:</strong></label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            <button onClick={handleUpdate} disabled={updating}>
              {updating ? 'Updating...' : 'Update Information'}
            </button>
            <button onClick={handleDeleteRequest} disabled={waiting || requestSent}>
              {waiting ? 'Waiting to be deleted...' : requestSent ? 'Request Sent' : 'Delete Account'}
            </button>
          </div>
        )
      )}
      <button onClick={fetchAdvertiserInfo}>Refresh My Information</button>
  
      {/* Section for Activities */}
      <h3>Your Activities</h3>
      {activities.length > 0 ? (
        <div style={styles.activitiesContainer}>
          {activities.map((activity) => (
            <div key={activity._id} style={styles.activityCard}>
              <div style={styles.activityRow}>
                <p><strong>Name:</strong> {activity.name}</p>
                <p><strong>Category:</strong> {activity.Category}</p>
              </div>
              <div style={styles.activityRow}>
                <p><strong>Date:</strong> {activity.date}</p>
                <p><strong>Budget:</strong> {activity.budget}</p>
              </div>
              <div>
                <strong>More Info:</strong>
                <ul>
                  <li><a href="/some-link">Link 1</a></li>
                  <li><a href="/some-link">Link 2</a></li>
                  <li><a href="/some-link">Link 3</a></li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No activities found.</p>
      )}
      
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/advertiser-Activities')}>MY Activities</li>
        </ul>
      </div>
  
      {/* Transportation Creation Form */}
      <h3>Create Transportation</h3>
      <div>
      <label>Type:</label>
        <select
          name="type"
          value={transportFormData.type}
          onChange={handleTransportInputChange}
        >
          <option value="Bus">Bus</option>
          <option value="Taxi">Taxi</option>
          <option value="Train">Train</option>
          <option value="Boat">Boat</option>
        </select>
  
        <label>Company Name:</label>
        <input
          type="text"
          name="company.name"
          value={transportFormData.company.name}
          onChange={handleTransportInputChange}
        />

        <label>Company Contact Phone:</label>
        <input
          type="text"
          name="company.contact.phone"
          value={transportFormData.company.contact.phone}
          onChange={handleTransportInputChange}
        />
        <label>Company Contact Email:</label>
        <input
          type="email"
          name="company.contact.email"
          value={transportFormData.company.contact.email}
          onChange={handleTransportInputChange}
        />
  
        <label>Origin:</label>
        <input
          type="text"
          name="origin"
          value={transportFormData.origin}
          onChange={handleTransportInputChange}
        />
  
        <label>Destination:</label>
        <input
          type="text"
          name="destination"
          value={transportFormData.destination}
          onChange={handleTransportInputChange}
        />
  
        <label>Departure Time:</label>
        <input
          type="datetime-local"
          name="departureTime"
          value={transportFormData.departureTime}
          onChange={handleTransportInputChange}
        />
  
        <label>Arrival Time:</label>
        <input
          type="datetime-local"
          name="arrivalTime"
          value={transportFormData.arrivalTime}
          onChange={handleTransportInputChange}
        />
  
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={transportFormData.price}
          onChange={handleTransportInputChange}
        />
  
        <label>Seats Available:</label>
        <input
          type="number"
          name="seatsAvailable"
          value={transportFormData.seatsAvailable}
          onChange={handleTransportInputChange}
        />
  
        <button onClick={handleCreateTransportation}>Create Transportation</button>
      </div>
    </div>
  );
  
};

const styles = {
  activitiesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  activityCard: {
    border: '1px solid #ccc',
    padding: '10px',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  activityRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

export default AdvertiserProfile;
