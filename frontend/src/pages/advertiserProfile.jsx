import React, { useState, useEffect } from 'react';
import './advertiserProfile.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const AdvertiserProfile = () => {
  const [advertiserInfo, setAdvertiserInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
const [filteredActivities, setFilteredActivities] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [Logo, setLogo] = useState(null);
  const [activityReports, setActivityReports] = useState({});
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
    
    if (formData.Username) form.append('Username', formData.Username);
    if (formData.Email) form.append('Email', formData.Email);
    if (formData.Password) form.append('Password', formData.Password);
    if (formData.Hotline) form.append('Hotline', formData.Hotline);
    if (formData.Company_Profile) form.append('Company_Profile', formData.Company_Profile);
    if (formData.Website_Link) form.append('Website_Link', formData.Website_Link);
    
    if (formData.Logo) {
      form.append('Logo', formData.Logo); // Only add Logo if it’s present
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
        
        // Set Logo directly if it's already a URL
        if (typeof updatedData.Logo === 'string') {
          setLogo(updatedData.Logo);
          localStorage.setItem('logo', updatedData.Logo);
        } else {
          // Use URL.createObjectURL if Logo is a File or Blob
          const logoURL = URL.createObjectURL(updatedData.Logo);
          setLogo(logoURL);
          localStorage.setItem('logo', logoURL);
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
  
  const handleViewReport = async (activityId) => {
    // If the report is already visible, toggle it off
    if (activityReports[activityId]?.visible) {
      setActivityReports((prevReports) => ({
        ...prevReports,
        [activityId]: {
          ...prevReports[activityId],
          visible: false,
        },
      }));
      return;
    }
  
    // Otherwise, fetch the report or toggle it on
    const advertiserUsername = localStorage.getItem('Username');
  
    try {
      const response = await fetch(
        `http://localhost:8000/getTouristReportForActivity/${activityId}?advertiserUsername=${advertiserUsername}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setActivityReports((prevReports) => ({
          ...prevReports,
          [activityId]: {
            ...data.report, // Add the report data
            visible: true,  // Set visibility to true
          },
        }));
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('An error occurred while fetching the report:', error);
      setErrorMessage('An error occurred while fetching the report');
    }
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
          setFilteredActivities(data);
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

  const handleFilterMonth = async (e) => {
    const selectedMonth = e.target.value;
    setFilterMonth(selectedMonth);
  
    const Username = localStorage.getItem("Username");
  
    if (!selectedMonth) {
      // If no month is selected, fetch all activities
      fetchActivities();
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/filterActivitiesByMonth?Username=${Username}&month=${selectedMonth}`
      );
  
      if (response.ok) {
        const data = await response.json();
        setFilteredActivities(data); // Set the filtered activities
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setFilteredActivities([]); // Clear activities on error
        setErrorMessage(errorData.error);
      }
    } catch (error) {
      console.error("Error filtering activities:", error);
      setFilteredActivities([]); // Clear activities on error
      setErrorMessage("An error occurred while filtering activities.");
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
    <div className="advertiser-profile">
      <h2 className="profile-title">Advertiser Profile</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* Advertiser Information */}
      {loading ? (
        <p className="loading">Loading advertiser information...</p>
      ) : (
        advertiserInfo && (
          <div className="info-section">
            <div className="info-header">
              {Logo && <img src={`http://localhost:8000/${Logo.replace(/\\/g, '/')}`} alt="Advertiser Logo" className="logo" />}
              <h3>{advertiserInfo.Username}</h3>
            </div>
            <div className="info-content">
              <label>Website Link:</label>
              <input type="text" name="Website_Link" value={formData.Website_Link} onChange={handleInputChange} />
              <label>Password:</label>
              <input type="password" name="Password" value={formData.Password} onChange={handleInputChange} />
              <label>Hotline:</label>
              <input type="text" name="Hotline" value={formData.Hotline} onChange={handleInputChange} />
              <label>Company Profile:</label>
              <input type="text" name="Company_Profile" value={formData.Company_Profile} onChange={handleInputChange} />
              <label>Logo:</label>
              <input type="file" accept="image/*" onChange={handleLogoChange} />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="update-button">
              {updating ? 'Updating...' : 'Update Information'}
            </button>
            <button onClick={handleDeleteRequest} disabled={waiting || requestSent} className="delete-button">
              {waiting ? 'Waiting...' : requestSent ? 'Request Sent' : 'Delete Account'}
            </button>
          </div>
        )
      )}

      
      {/* Password Change Section */}
      <div className="password-section">
        <h3>Change Password</h3>
        <label>Current Password:</label>
        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <label>New Password:</label>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button onClick={handlePasswordChange} className="password-button">Change Password</button>
      </div>
{/* Filter Activities by Month */}
<div className="filter-section">
  <label htmlFor="monthFilter">Filter by Month:</label>
  <select
    id="monthFilter"
    value={filterMonth}
    onChange={handleFilterMonth}
  >
    <option value="">All Months</option>
    <option value="1">January</option>
    <option value="2">February</option>
    <option value="3">March</option>
    <option value="4">April</option>
    <option value="5">May</option>
    <option value="6">June</option>
    <option value="7">July</option>
    <option value="8">August</option>
    <option value="9">September</option>
    <option value="10">October</option>
    <option value="11">November</option>
    <option value="12">December</option>
  </select>
</div>
      {/* Activities Section */}
      <h3 className="activities-title">Your Activities</h3>
{filteredActivities.length > 0 ? (
  <div className="activities-container">
    {filteredActivities.map((activity) => (
      <div key={activity._id} className="activity-card">
        <p><strong>Name:</strong> {activity.name}</p>
        <p><strong>Category:</strong> {activity.Category}</p>
        <p><strong>Date:</strong> {activity.date}</p>
        <p><strong>Budget:</strong> {activity.budget}</p>
        <button
          className="view-report-button"
          onClick={() => handleViewReport(activity._id)}
        >
          {activityReports[activity._id]?.visible ? 'Hide Report' : 'View Report'}
        </button>

        {/* Display the report for this activity if visible */}
        {activityReports[activity._id]?.visible && (
          <div className="report-section">
            <h4>Report</h4>
            <p><strong>Total Tourists:</strong> {activityReports[activity._id].totalTourists}</p>
            {activityReports[activity._id].tourists.length > 0 ? (
              <div>
                <h5>Tourists:</h5>
                <ul>
                  {activityReports[activity._id].tourists.map((tourist, index) => (
                    <li key={index}>
                      {tourist.Username} - {tourist.Email}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No tourists booked this activity yet.</p>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
) : (
  <p>No activities found.</p>
)}


      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/advertiser-Activities')}>MY Activities</li>
        </ul>
      </div>

      {/* Transportation Creation */}
      <h3>Create Transportation</h3>
      <div className="transportation-form">
        <label>Type:</label>
        <select name="type" value={transportFormData.type} onChange={handleTransportInputChange}>
          <option value="Bus">Bus</option>
          <option value="Taxi">Taxi</option>
          <option value="Train">Train</option>
          <option value="Boat">Boat</option>
        </select>
        <label>Company Name:</label>
        <input type="text" name="company.name" value={transportFormData.company.name} onChange={handleTransportInputChange} />
        <label>Company Contact Phone:</label>
        <input type="text" name="company.contact.phone" value={transportFormData.company.contact.phone} onChange={handleTransportInputChange} />
        <label>Company Contact Email:</label>
        <input type="email" name="company.contact.email" value={transportFormData.company.contact.email} onChange={handleTransportInputChange} />
        <label>Origin:</label>
        <input type="text" name="origin" value={transportFormData.origin} onChange={handleTransportInputChange} />
        <label>Destination:</label>
        <input type="text" name="destination" value={transportFormData.destination} onChange={handleTransportInputChange} />
        <label>Departure Time:</label>
        <input type="datetime-local" name="departureTime" value={transportFormData.departureTime} onChange={handleTransportInputChange} />
        <label>Arrival Time:</label>
        <input type="datetime-local" name="arrivalTime" value={transportFormData.arrivalTime} onChange={handleTransportInputChange} />
        <label>Price:</label>
        <input type="number" name="price" value={transportFormData.price} onChange={handleTransportInputChange} />
        <label>Seats Available:</label>
        <input type="number" name="seatsAvailable" value={transportFormData.seatsAvailable} onChange={handleTransportInputChange} />
        <button onClick={handleCreateTransportation} className="create-transport-button">Create Transportation</button>
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
