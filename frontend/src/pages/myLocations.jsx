import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png';

import { FaBell, FaUserCircle ,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,FaSearch,
  FaStar, } from "react-icons/fa";
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';

import LockResetIcon from '@mui/icons-material/LockReset';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const MyLocations = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selecting a location for viewing/editing
  const [viewOnly, setViewOnly] = useState(false); // State to control view vs. edit mode
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: { Foreigner: '', Student: '', Native: '' },
    Tags: { Types: '' }
  });

  // Navigation handlers
  const handleCreateHistoricalLocation = () => navigate('/gov-historical');
  const handleCreateMuseum = () => navigate('/gov-museum');
  const handleMyLocations = () => navigate('/my-locations');
  const handleMyMuseums = () => navigate('/my-museums');
  // Fetch locations on component mount
  useEffect(() => {
    const fetchMyLocations = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyLocations?TourismGovernor=${tourismGovernor}`);

        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch locations.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching locations.');
        console.error(error);
      }
    };

    fetchMyLocations();
  }, []);
   // Change Password handler
   const handleChangePassword = async () => {
    const Username = localStorage.getItem('Username');

    try {
      console.log("Username:", Username); // Log username when the component mounts

      const response = await fetch(`http://localhost:8000/changePasswordTourismGov`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleView = async (name) => {
    setViewOnly(true); // Set view mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for viewing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleEdit = async (name) => {
    setViewOnly(false); // Set edit mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for editing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/updatehistoricalLocation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations((prevLocations) =>
          prevLocations.map((location) =>
            location.Name === updatedLocation.Name ? updatedLocation : location
          )
        );
        setSelectedLocation(null); // Clear form after update
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the location.');
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:8000/deletehistoricalLocation?Name=${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLocations((prevLocations) => prevLocations.filter((location) => location.Name !== name));
      } else {
        setErrorMessage('Failed to delete the location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the location.');
    }
  };
  
  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div
        style={styles.sidebar2}
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
        <div   style={styles.item}    onClick={handleMyLocations} >
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div  style={styles.item}  onClick={handleMyMuseums}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
       
      </div>

      {/* Header */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Tourism Governor Profile</h1>
        <div style={styles.headerIcons}>
          <LockResetIcon
            style={styles.lockIcon}
            onClick={() => setIsModalOpen(true)}
          />
              <LogoutOutlinedIcon
      style={styles.logoutIcon}
      onClick={() => navigate('/Guest')}
    />
                  </div>
      </header>
       {/* Change Password Modal */}
    {isModalOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <HighlightOffOutlinedIcon
            style={styles.cancelpasswordIcon}
            onClick={() => setIsModalOpen(false)}
          />
          <h2 style={styles.modalContentH2}>Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <button
            onClick={handleChangePassword}
            style={styles.modalContentButton}
          >
            Change Password
          </button>

          {/* Success/Error Messages */}
          {successMessage && (
            <p style={styles.successMessage}>{successMessage}</p>
          )}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
      </div>
    )}
 
      <div>
      <h1>My Historical Locations</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul>
          {locations.map((location) => (
            <li key={location.Name}>
              <strong>{location.Name}</strong>: {location.Description} ({location.Location})
              <button onClick={() => handleView(location.Name)}>View</button>
              <button onClick={() => handleEdit(location.Name)}>Edit</button>
              <button onClick={() => handleDelete(location.Name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <form onSubmit={handleUpdate}>
          <h2>{viewOnly ? "View Historical Location" : "Edit Historical Location"}</h2>
          <label>Name:</label>
          <input
            type="text"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            disabled
          />
          <label>Description:</label>
          <input
            type="text"
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            disabled={viewOnly}
          />
          <label>Location:</label>
          <input
            type="text"
            value={formData.Location}
            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
            disabled={viewOnly}
          />
          <label>Opening Hours:</label>
          <input
            type="text"
            value={formData.OpeningHours}
            onChange={(e) => setFormData({ ...formData, OpeningHours: e.target.value })}
            disabled={viewOnly}
          />
          <label>Ticket Prices:</label>
          <input
            type="text"
            value={formData.TicketPrices.Foreigner}
            placeholder="Foreigner"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Foreigner: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <input
            type="text"
            value={formData.TicketPrices.Student}
            placeholder="Student"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Student: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <input
            type="text"
            value={formData.TicketPrices.Native}
            placeholder="Native"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Native: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <label>Tags:</label>
          <input
            type="text"
            value={formData.Tags.Types}
            onChange={(e) => setFormData({ ...formData, Tags: { Types: e.target.value } })}
            disabled={viewOnly}
          />
          {!viewOnly && <button type="submit">Update Location</button>}
        </form>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/gov-historical')}>Create other Historical Locations</li>
        </ul>
      </div>
    </div>
      
       
    </div>
  );
};

const styles = {
  sidebar2: {
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
  container: {
    margin: '90px auto',
    maxWidth: '1000px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    position: 'fixed',
    height: '60px',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 1000,
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
  title: {
    fontSize: '24px',
    margin: 0,
    fontWeight: 'bold',
    marginLeft:'20px'
  },
  profileIcon: {
    fontSize: '40px',
    color: '#fff',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  logoutIcon: {
    cursor: 'pointer',
    color: 'white',
  },
  buttonHover: {
    backgroundColor: '#084B24',
  },
  passwordSection: {
    marginTop: '30px',
  },
  subTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  sidebar  :{
    marginTop: '20px',
  display: 'flex',       // Enables flexbox layout
  justifyContent: 'center', // Horizontally centers the content
  alignItems: 'center',  // Vertically centers the content
  textAlign: 'center',
  },
  sidebarList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#0F5132",
    borderRadius: "5px",
    transition: "background-color 0.3s",
  },
  sidebarItemHover: {
    backgroundColor: "#084B24", // Darker green on hover
  },
  sidebarIcon: {
    marginRight: "10px",
    fontSize: "18px",
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
  }, modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '280px', // Adjust placement
  },modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  lockIcon: {
    fontSize: '30px',
    color: '#fff',
    cursor: 'pointer',
    marginRight:'20',
    marginTop:'10'

  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  successMessage: {
    color: '#0F5132',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  errorMessage: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

  


export default MyLocations;
