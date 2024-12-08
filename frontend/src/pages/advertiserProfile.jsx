import React, { useState, useEffect } from 'react';
import './advertiserProfile.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBell,FaUserCircle} from 'react-icons/fa';
import { FaCalendarDay, FaUniversity, FaCalendarAlt,FaTags, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch} from "react-icons/fa";
  import LockResetIcon from '@mui/icons-material/LockReset';
  import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
  import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
  import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
  import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
  import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
  import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

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
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [activityDetails, setActivityDetails] = useState({}); // Tracks visibility of details for each activity
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredD, setFilteredD] = useState(false); // For filtering by date
  const [filterA, setFilterA] = useState(null); // Selected activity in the dropdown menu
  const [dates, setDates] = useState([]); // Dates of the chosen activity
  const [count, setCount] = useState(0); // Count of the chosen activity
  const [filteredA, setFilteredA] = useState(false); // Indicates if activities are filtered
  const [isLoading, setIsLoading] = useState(false);
const [totalSales, setTotalSales] = useState(0);
const [refresh, setRefresh] = useState(false);
const [mostSold, setMostSold] = useState();
const [leastSold, setLeastSold] = useState();
const [date, setDate] = useState('');


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

  useEffect(() => {
    calculateTotalSales(activities);
    findMostSold(activities);
    findLeastSold(activities);
  }, [filteredActivities]);
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
        alert('No tourists booked this activity yet.');
        const errorData = await response.json();
        //setErrorMessage(errorData.message || 'Failed to fetch report');
      }
    } catch (error) {
      console.error('An error occurred while fetching the report:', error);
      setErrorMessage('An error occurred while fetching the report');
    }
  };
  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      // Proceed with logout, navigate to '/Guest'
      navigate('/Guest');
    } else {
      // Do nothing if the user cancels the logout
      console.log("Logout cancelled");
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
        togglePasswordModal();
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
  
  const fetchFilteredActivities = async (selectedDate) => {
    const Username = localStorage.getItem('Username');
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/getFilteredActivities?Username=${Username}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        setFilteredActivities(data);
        setIsLoading(false);
      } else {
        console.error('Failed to fetch activities');
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };
  
  const filterByActivity = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:8000/filterByActivity?activityId=${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setDates(data);
        setCount(data.length);
      } else {
        console.error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const calculateTotalSales = (activities) => {
    const total = activities.reduce((sum, activity) => sum + activity.sales, 0);
    setTotalSales(total);
  };
  
  const findMostSold = (activities) => {
    if (activities.length > 0) {
      const mostSoldActivity = activities.reduce((max, activity) => (activity.sales > max.sales ? activity : max), activities[0]);
      setMostSold(mostSoldActivity);
    }
  };
  
  const findLeastSold = (activities) => {
    if (activities.length > 0) {
      const leastSoldActivity = activities.reduce((min, activity) => (activity.sales < min.sales ? activity : min), activities[0]);
      setLeastSold(leastSoldActivity);
    }
  };
  
  const handleFilterD = () => {
    if (!filteredD) {
      fetchFilteredActivities(date);
      setFilteredD(true);
      findMostSold(activities);
      findLeastSold(activities);
    } else {
      setFilteredActivities(activities);

      fetchActivities();
      setFilteredD(false);
      findMostSold(activities);
      findLeastSold(activities);
    }
  };
  
  const handleFilterChange = (event) => {
    const selectedActivity = activities.find(activity => activity._id === event.target.value);
    if (selectedActivity) {
      setFilteredActivities([selectedActivity]);
      setFilterA(selectedActivity);
    } else {
      setFilteredActivities(activities);
      setFilterA(null);
    }
  };
  


  const toggleModal = () => setShowModal(!showModal);
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);

  return (
    <div className="advertiser-profile">

<div style={styles.container}>
{/* Header Section */}
<header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Advertiser Profile</h1>
  <div style={styles.manageSettingsContainer}>
    <ManageAccountsIcon
      alt="Manage Settings"
      style={styles.profileIcon}
      onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown visibility
    />
      
     <LogoutOutlinedIcon
      style={{marginLeft:"20", cursor: 'pointer' }} // You can adjust your styles here
      onClick={handleLogout}
    />
    {showDropdown && (
      <div style={styles.dropdownMenu}>
        <div
          style={styles.dropdownItem}
          onClick={() => {
            setShowDropdown(false); // Close dropdown
            toggleModal(); // Open Edit Profile modal
          }}
        >
          Edit Profile
        </div>
        <div
          style={styles.dropdownItem}
          onClick={() => {
            setShowDropdown(false); // Close dropdown
            togglePasswordModal(); // Open Change Password modal
          }}
        >
          Change Password
        </div>
      </div>
    )}
  </div>
</header>

      {/* Sidebar */}
      <div
        style={styles.sidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = '200px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '1')
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >
         <div className="profile" style={styles.item} onClick={() => navigate('/advertiser-profile')}>
            <FaUserCircle style={styles.icon} />
            <span className="label" style={styles.label}>
              Profile
            </span>
          </div>
        <div  class="activities" style={styles.item} onClick={() => navigate('/advertiser-Activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            My Activities
          </span>
        </div>
        <div  class="transportation" style={styles.item} onClick={() => navigate('/createTransportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
            Transportation
          </span>
        </div>
      
      
     
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalContentH2}>Edit Profile</h2>

            <div style={styles.photoSection}>
              {Logo && (
                <img
                  src={`http://localhost:8000/${Logo.replace(/\\/g, '/')}`}
                  alt="Advertiser Logo"
                  className="logo"
                  style={styles.profilePhoto}
                />
              )}
              <label style={styles.photoLabel}>
                  Update Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={styles.fileInput}
                  />
                </label>
              <h3>{advertiserInfo.Username}</h3>
            </div>

            <label style={styles.modalContentLabel}>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleInputChange}
              style={styles.modalContentInput}
            />

            <label style={styles.modalContentLabel}>Website Link:</label>
            <input
              type="text"
              name="Website_Link"
              value={formData.Website_Link}
              onChange={handleInputChange}
              style={styles.modalContentInput}
            />

            <label style={styles.modalContentLabel}>Hotline:</label>
            <input
              type="text"
              name="Hotline"
              value={formData.Hotline}
              onChange={handleInputChange}
              style={styles.modalContentInput}
            />

            <label style={styles.modalContentLabel}>Company Profile:</label>
            <textarea
              name="Company_Profile"
              value={formData.Company_Profile}
              onChange={handleInputChange}
              style={styles.modalContentTextarea}
            ></textarea>
            <div style={styles.modalButtonsContainer}>
              <button
                onClick={handleUpdate}
                disabled={updating}
                style={{
                  ...styles.modalContentButton,
                  ...(updating ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                }}
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>

              <button
                onClick={handleDeleteRequest}
                disabled={waiting || requestSent}
                style={{
                  ...styles.modalContentButton,
                  backgroundColor: '#dc3545',
                  ...(waiting || requestSent
                    ? { opacity: 0.6, cursor: 'not-allowed' }
                    : {}),
                }}
              >
                {waiting ? 'Waiting...' : requestSent ? 'Request Sent' : 'Delete Account'}
              </button>
            </div>


            
            <HighlightOffOutlinedIcon
              onClick={toggleModal}
              style={styles.cancelIcon}
           
            />
          </div>
        </div>
      )}

       {/* Password Modal */}
       {showPasswordModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalContentH2}>Change Password</h2>

            <label style={styles.modalContentLabel}>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.modalContentInput}
            />

            <label style={styles.modalContentLabel}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.modalContentInput}
            />

            <div style={styles.modalButtonsContainer}>
              <button
                onClick={handlePasswordChange}
                style={{
                  ...styles.modalContentButton,
                  backgroundColor: '#0F5132',
                }}
              >
                Change Password
              </button>
           
              <HighlightOffOutlinedIcon
                onClick={togglePasswordModal}
                style={{
                  ...styles.cancelpasswordIcon,
                }}
              
                
              />
            </div>
          </div>
        </div>
      )}
 


{/* Notification Dropdown */}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
      
      
      <div style={styles.filterContainer}>
  <div style={styles.filterGroup}>
    <label htmlFor="monthFilter" style={styles.filterLabel}>
      <DisplaySettingsIcon style={styles.iconn} /> Filter Month:
    </label>
    <select
      id="monthFilter"
      value={filterMonth}
      onChange={handleFilterMonth}
      style={styles.dropdown}
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
</div>

<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
  <h2
    style={{
      fontSize: '20px',
      fontWeight: '700',
      color: '#0F5132',
      textAlign: 'center',
      letterSpacing: '1px',
      borderBottom: '2px solid #0F5132',
      paddingBottom: '10px',
      marginBottom: '20px',
    }}
  >
    Reports
  </h2>

  {filteredActivities.length > 0 ? (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}
    >
      {filteredActivities.map((activity) => (
        <div
          key={activity._id}
          style={{
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#f9f9f9',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.03)';
            e.currentTarget.style.borderColor = '#0F5132';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = '#ddd';
          }}
        >
          {/* Activity Info */}
          <div style={{ marginBottom: '10px' }}>
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#0F5132',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaRunning
                style={{
                  marginRight: '8px',
                  color: '#0F5132',
                  fontSize: '18px',
                }}
              />
              {activity.name}
            </h4>
            <p
              style={{
                fontSize: '14px',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaTags
                style={{
                  marginRight: '8px',
                  color: '#0F5132',
                  fontSize: '16px',
                }}
              />
              <strong>Category:</strong> {activity.Category}
            </p>
            <p
              style={{
                fontSize: '14px',
                marginBottom: '5px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FaCalendarAlt
                style={{
                  marginRight: '8px',
                  color: '#0F5132',
                  fontSize: '16px',
                }}
              />
              <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
            </p>
          </div>

          {/* Toggle Report Button */}
          <div style={{ position: 'relative', textAlign: 'center', marginTop: '10px' }}>
            <button
              style={{
                padding: '8px 12px',
                backgroundColor: '#0F5132',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background-color 0.3s ease',
              }}
              onClick={() => handleViewReport(activity._id)}
            >
              {activityReports[activity._id]?.visible ? 'Hide Report' : 'View Report'}
            </button>
          </div>

          {/* Collapsible Report Section */}
          {activityReports[activity._id]?.visible && (
            <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '14px',
                }}
              >
                <thead>
                  <tr>
                    <th style={{ borderBottom: '2px solid #0F5132', padding: '5px' }}>
                      Total Tourists
                    </th>
                    <th
                      colSpan="2"
                      style={{
                        borderBottom: '2px solid #0F5132',
                        padding: '5px',
                        textAlign: 'center',
                      }}
                    >
                      {activityReports[activity._id].totalTourists}
                    </th>
                  </tr>
                  <tr>
                    <th style={{ borderBottom: '1px solid #ddd', padding: '5px' }}>Tourist</th>
                    <th style={{ borderBottom: '1px solid #ddd', padding: '5px' }}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {activityReports[activity._id].tourists.length > 0 ? (
                    activityReports[activity._id].tourists.map((tourist, index) => (
                      <tr key={index}>
                        <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                          {tourist.Username}
                        </td>
                        <td style={{ padding: '5px', borderBottom: '1px solid #ddd' }}>
                          {tourist.Email}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          textAlign: 'center',
                          padding: '10px',
                          fontStyle: 'italic',
                          color: '#d9534f',
                        }}
                      >
                        No tourists booked this activity yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p
      style={{
        fontSize: '14px',
        color: '#d9534f',
        textAlign: 'center',
        marginTop: '20px',
      }}
    >
      No activities found.
    </p>
  )}
</div>


  {/* Statistics Section */}
<div
  style={{
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  }}
>
  <div
    style={{
      textAlign: 'center',
      marginBottom: '20px',
    }}
  >
    <h2
      style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#0F5132',
        letterSpacing: '1px',
        borderBottom: '2px solid #0F5132',
        paddingBottom: '10px',
        margin: '0 auto',
        maxWidth: '300px',
      }}
    >
      Total Sales: ${totalSales}
    </h2>
  </div>

  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px',
      alignItems: 'stretch',
    }}
  >
    {mostSold && (
      <div
        style={{
          flex: 1,
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.borderColor = '#0F5132';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = '#ddd';
        }}
      >
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0F5132',
            marginBottom: '15px',
            textAlign: 'center',
            borderBottom: '2px solid #0F5132',
            paddingBottom: '10px',
            letterSpacing: '1px',
          }}
        >
          <TrendingUpOutlinedIcon
            style={{
              color: '#0F5132',
              marginRight: '8px',
              verticalAlign: 'middle',
              fontSize: '18px',
            }}
          />
          Most Sold Activity
        </h4>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong>Name:</strong>&nbsp; {mostSold.name}
        </p>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong>Sales:</strong>&nbsp; ${mostSold.sales}
        </p>
      </div>
    )}

    {leastSold && (
      <div
        style={{
          flex: 1,
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.borderColor = '#0F5132';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.borderColor = '#ddd';
        }}
      >
        <h4
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#0F5132',
            marginBottom: '15px',
            textAlign: 'center',
            borderBottom: '2px solid #0F5132',
            paddingBottom: '10px',
            letterSpacing: '1px',
          }}
        >
          <TrendingDownOutlinedIcon
            style={{
              color: '#d9534f',
              marginRight: '8px',
              verticalAlign: 'middle',
              fontSize: '18px',
            }}
          />
          Least Sold Activity
        </h4>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong>Name:</strong>&nbsp; {leastSold.name}
        </p>
        <p
          style={{
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <strong>Sales:</strong>&nbsp; ${leastSold.sales}
        </p>
      </div>
    )}
  </div>
</div>

  {/* Filters Section */}
  <div style={styles.filterContainerr}>
  <div style={styles.salesTitle}>
   
  </div>
        <div style={styles.filterGroup}>
          <label htmlFor="activityFilter" style={styles.filterLabel}>
            <DisplaySettingsIcon style={styles.iconn} /> Activity:
          </label>
          <select
            id="activityFilter"
            value={filterA ? filterA._id : ""}
            onChange={handleFilterChange}
            style={styles.dropdown}
          >
            <option value="">All Activities</option>
            {activities.map((activity) => (
              <option key={activity._id} value={activity._id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label htmlFor="dateFilter" style={styles.filterLabel}>
            <FaCalendarDay style={styles.iconn} /> Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
          />
          <button style={styles.filterButton} onClick={handleFilterD}>
            {filteredD ? "Clear" : "Filter Date"}
          </button>
        </div>
      </div>
{/* Activities List */}
<div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  }}
>
  {filteredActivities.map((activity) => (
    <div
      key={activity._id}
      style={{
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.borderColor = '#0F5132';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      <h4
        style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#0F5132',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '10px',
        }}
      >
        <FaRunning style={{ fontSize: '18px', color: '#0F5132' }} />
        {activity.name}
      </h4>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          color: '#333',
        }}
      >
        <FaCalendarAlt
          style={{ marginRight: '8px', color: '#0F5132', fontSize: '16px' }}
        />
        <strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}
      </p>
      <p
        style={{
          fontSize: '14px',
          marginBottom: '5px',
          display: 'flex',
          alignItems: 'center',
          color: '#333',
        }}
      >
        <FaDollarSign
          style={{ marginRight: '8px', color: '#0F5132', fontSize: '16px' }}
        />
        <strong>Sales:</strong> ${activity.sales}
      </p>
    </div>
  ))}
</div>





   

    </div>
    </div>

  );
  
};

const styles = {
  photoSection : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  profilePhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  photoLabel: {
    cursor: 'pointer',
    color: '#0F5132',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  fileInput: {
    display: 'none',
  },
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '100px', // Adjust placement
  },
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '240px', // Adjust placement
  },
  sidebar  :{
    marginTop: '60px',

  },
  statisticsContainer: {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  
  totalSales: {
    textAlign: "center",
    marginBottom: "20px",
  },

  totalSalesText: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0F5132",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  statisticsCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  cardTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  cardDetail: {
    fontSize: "14px",
    color: "#555",
  },

  activitiesContainer: {
    marginTop: "20px",
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
  },

  activityCard: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    width: "calc(33.333% - 10px)", // Responsive card width
  },

  iconSmall: {
    fontSize: "14px",
    color: "#0F5132",
  },

  iconBig: {
    fontSize: "20px",
    color: "#0F5132",
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  salesTitle: {
    flex: "0 0 15%", // Adjust width for the title
    textAlign: "left",
  },

  salesHeading: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0F5132",
    margin: 0,
    marginRight:"450px"
  },
  container: {
    maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontSize:'14px'
  },
  header: {
    height:'60px',
    position: 'fixed', // Make the header fixed
    top: '0', // Stick to the top of the viewport
    left: '0',
    width: '100%', // Make it span the full width of the viewport
    backgroundColor: '#0F5132', // Green background
    color: 'white', // White text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    zIndex: '1000', // Ensure it appears above other content
  },
  headerIconsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Spacing between the icons
  },
  leftContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px', // Adjust spacing between icons
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  manageSettingsContainer: {
    position: "relative",
    display: "inline-block",
  },
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "10px 15px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  toggleReportButton: {
    position: "absolute", // Position it relative to its container
    top: "-50px", // Move it to the top
    right: "10px", // Move it to the right
    padding: "5px 10px", // Smaller padding for a compact size
    backgroundColor: "#0F5132", // Consistent color
    color: "#fff",
    fontSize: "14px", // Smaller font size
    border: "none",
    borderRadius: "5px", // Rounded corners
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow for depth
    zIndex: 10, // Ensure it sits on top
    transition: "background-color 0.3s ease",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0F5132", 
    marginBottom: "15px",
    textAlign: "center",
    borderBottom: "2px solid #0F5132", 
    paddingBottom: "10px",
    letterSpacing: "1px", 
    textTransform: "uppercase", 
  },
 
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContentH2: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  },
  modalContentLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalContentTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
  },
  modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  passwordSection: {
    borderTop: '1px solid #ddd',
    marginTop: '20px',
    paddingTop: '15px',
  },
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '50px', // Default width when collapsed
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', // Ensure alignment starts from the left
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align items to the left
    padding: '10px',
    width: '100%', // Take full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  icon: {
    fontSize: '24px',
    marginLeft: '15px', // Move icons slightly to the right
    color: '#fff', // Icons are always white
  },
  label: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0, // Initially hidden
    whiteSpace: 'nowrap', // Prevent label text from wrapping
    transition: 'opacity 0.3s ease',
  },
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  item: {
 
    padding: '10px 0',
  },
  filterContainer: {
    marginTop: "50px",
    marginBottom:"-30px",
    padding: "15px",
    backgroundColor: "#f9f9f9",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "250px",
    marginLeft: "900px", // Center-align the filter container
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  filterContainerr: {
    display: "flex",
    justifyContent: "flex-end", // Align filters to the right
    alignItems: "center", // Center align items vertically
    gap: "10px", // Space between filters
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },

  // Individual filter group (label + input/button)
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  // Label for the filters
  filterLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  // Input for date filter
  dateInput: {
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },

  // Button for applying/clearing filters
  filterButton: {
    padding: "5px 10px",
    borderRadius: "4px",
    border: "none",
    backgroundColor: "#0F5132",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    marginBottom:'15px'
  },

  // Hover effect for the button
  filterButtonHover: {
    backgroundColor: "#084B24",
  },

  salesContainer: {
    marginTop: "40px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },

  filterTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#0F5132",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "10px",
  },

  filterGroup: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  filterLabel: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  dropdown: {
    padding: "6px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: "1",
  },

  viewReportButton: {
    backgroundColor: "#0F5132",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
  },

  iconn: {
    fontSize: "18px",
    color: "#0F5132",
  },
};

export default AdvertiserProfile;
