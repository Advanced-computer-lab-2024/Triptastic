import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBell,FaUserCircle} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, FaDollarSign,FaSearch} from "react-icons/fa";
  import LockResetIcon from '@mui/icons-material/LockReset';
  import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
const CreateTransportation = () => {
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

  const toggleModal = () => setShowModal(!showModal);
  const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);

  return (
    <div    style={styles.background} >

    <div>
    {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Advertiser Profile</h1>
  <div style={styles.leftContainer}>
          <FaUserCircle
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={() => navigate('/advertiser-profile')}          />
     
       
          
        </div>
</header>
  




      {errorMessage && <p className="error-message">{errorMessage}</p>}

     



   
     
      {/* Transportation Creation */}
    
      <div className="transportation-form"   style={{ marginTop: '66px' }}
 >
      <h3>Create Transportation</h3>
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

    </div>

  );
  
};

const styles = {
  background: {
  backgroundColor: '#f9f9f9', // Correct property name
},

transportform: {
  marginTop: '120px', // Increase margin top for better spacing
  maxWidth: '500px', // Reduce the width
  margin: '0 auto', // Center the form horizontally
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},

  sidebar:{
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

export default CreateTransportation;
