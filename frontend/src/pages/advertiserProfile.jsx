import React, { useState, useEffect } from 'react';
import './advertiserProfile.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBell,FaUserCircle} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch} from "react-icons/fa";
  import LockResetIcon from '@mui/icons-material/LockReset';
  import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
  import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';





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
        alert('No tourists booked this activity yet.');
        const errorData = await response.json();
        //setErrorMessage(errorData.message || 'Failed to fetch report');
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


  const toggleModal = () => setShowModal(!showModal);
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);

  return (
    <div className="advertiser-profile">

    <div>
    {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Advertiser Profile</h1>
  <div style={styles.leftContainer}>
          <ManageAccountsIcon
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={toggleModal}
          />
     
       
          <LockResetIcon
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={togglePasswordModal}
          />
        </div>
</header>
   {/* Sidebar */}
   <div className="sidebar"style={styles.sidebar}>
      
        <ul>
          <li onClick={() => navigate('/advertiser-Activities')}>MY Activities</li>
        </ul>
        <ul>
          <li onClick={() => navigate('/createTransportation')}>Create Transportation</li>
        </ul>
       
      </div>

     
      


      {/* Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalContentH2}>Edit Profile</h2>

            <div style={styles.infoHeader}>
              {Logo && (
                <img
                  src={`http://localhost:8000/${Logo.replace(/\\/g, '/')}`}
                  alt="Advertiser Logo"
                  className="logo"
                  style={styles.logo}
                />
              )}
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

            <label style={styles.modalContentLabel}>Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
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



            <label style={styles.modalContentLabel}>Logo:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={styles.modalContentInput}
            />

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

     

      
      
{/* Filter Activities by Month */}
<div className="filter-section" style={{ marginTop: '40px' }}>

  <label htmlFor="monthFilter" >Filter by Month:</label>
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
  <button onClick={()=>navigate('/AdvertiserReport')} style={{marginLeft:'20px'}}>View Report</button>
</div>
     {/* Activities Section */}
<h3 className="activities-title"> Activity Reports</h3>
{filteredActivities.length > 0 ? (
  <div className="activities-grid">
    {filteredActivities.map((activity) => (
      <div key={activity._id} className="activity-card">
        <div className="activity-info">
          <h4 className="activity-name">{activity.name}</h4>
          <p className="activity-detail"><strong>Category:</strong> {activity.Category}</p>
          <p className="activity-detail"><strong>Date:</strong> {new Date(activity.date).toLocaleDateString()}</p>
          <p className="activity-detail"><strong>Budget:</strong> ${activity.budget}</p>
          <p className="activity-detail">
            <strong>Flagged:</strong> 
            <span className={activity.FlagInappropriate ? 'flag-yes' : 'flag-no'}>
              {activity.FlagInappropriate ? "Yes" : "No"}
            </span>
          </p>
        </div>

        <button
          className="toggle-report-button"
          onClick={() => handleViewReport(activity._id)}
        >
          {activityReports[activity._id]?.visible ? 'Hide Report' : 'View Report'}
        </button>

        {/* Collapsible Report Section */}
       {/* Collapsible Report Section */}
{activityReports[activity._id]?.visible && (
  <div className="report-section">
    <h5 className="report-title">Activity Report</h5>
    <table className="report-table">
      <thead>
        <tr>
          <th>Total Tourists</th>
          <th colSpan="2">{activityReports[activity._id].totalTourists}</th>
        </tr>
        <tr>
          <th>#</th>
          <th>Tourist Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {activityReports[activity._id].tourists.length > 0 ? (
          activityReports[activity._id].tourists.map((tourist, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{tourist.Username}</td>
              <td>{tourist.Email}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="no-tourists">No tourists booked this activity yet.</td>
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
  <p className="no-activities">No activities found.</p>
)}



   

    </div>
    </div>

  );
  
};

const styles = {
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    marginLeft:'60px'
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
};

export default AdvertiserProfile;
