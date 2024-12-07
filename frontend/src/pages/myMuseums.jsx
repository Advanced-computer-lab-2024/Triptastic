import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import logo from '../images/image.png';

import { FaBell, FaUserCircle ,FaCalendar,FaDollarSign ,FaMapMarkerAlt,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import { FaLandmark, FaPlus, FaEdit,FaEye,FaTrash, FaUniversity, FaBox,FaTag, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,FaSearch,
  FaStar, } from "react-icons/fa";
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';
import { FaImage } from 'react-icons/fa';
import { Tooltip as ReactTooltip } from 'react-tooltip';


import LockResetIcon from '@mui/icons-material/LockReset';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';


const MyMuseums = () => {
    const navigate = useNavigate();
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMuseum, setSelectedMuseum] = useState(null); // State for selecting a museum for viewing/editing
  const [viewOnly, setViewOnly] = useState(false); // State to control view vs. edit mode
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: { Foreigner: '', Student: '', Native: '' },
    Tags: { HistoricalPeriod: '' }
  });
  const [isCreateModalOpen, setIsCreateModalOpen
  ] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const handleMyLocations = () => navigate('/tourism-gov');
  const handleMyMuseums = () => navigate('/my-museums');
  // Fetch museums on component mount
  useEffect(() => {
    const fetchMyMuseums = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyMuseums?TourismGovernor=${tourismGovernor}`);

        if (response.ok) {
          const data = await response.json();
          setMuseums(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch museums.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching museums.');
        console.error(error);
      }
    };

    fetchMyMuseums();
  }, []);

  const handleView = async (name) => {
    setViewOnly(true); // Set view mode
    try {
      const response = await fetch(`http://localhost:8000/getMuseum?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMuseum(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch museum details for viewing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching museum details.');
    }
  };

  const handleEdit = async (name) => {
    setViewOnly(false); // Set edit mode
    try {
      const response = await fetch(`http://localhost:8000/getMuseum?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMuseum(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch museum details for editing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching museum details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/updateMuseum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedMuseum = await response.json();
        setMuseums((prevMuseums) =>
          prevMuseums.map((museum) =>
            museum.Name === updatedMuseum.Name ? updatedMuseum : museum
          )
        );
        setSelectedMuseum(null); // Clear form after update
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the museum.');
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:8000/deleteMuseum?Name=${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMuseums((prevMuseums) => prevMuseums.filter((museum) => museum.Name !== name));
      } else {
        setErrorMessage('Failed to delete the museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the museum.');
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
 <button style={styles.createButton} onClick={() => setIsCreateModalOpen(true)} data-tooltip-id="create-location-tooltip"
data-tooltip-content="Create Historical Location"  >
   <FaPlus style={styles.createIcon} /> 
   
 </button>
 <ReactTooltip id="create-location-tooltip" />
 <LockResetIcon
   style={styles.lockIcon}
   onClick={() => setIsModalOpen(true)}
 />
 <LogoutOutlinedIcon
   style={styles.logoutIcon}
   onClick={() => navigate('/Guest')}
 />
</div>
</header>      <h1>My Museums</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {museums.length === 0 ? (
        <p>No museums found.</p>
      ) : (
        <ul>
          {museums.map((museum) => (
            <li key={museum.Name}>
              <strong>{museum.Name}</strong>: {museum.Description} ({museum.Location})
              <button onClick={() => handleView(museum.Name)}>View</button>
              <button onClick={() => handleEdit(museum.Name)}>Edit</button>
              <button onClick={() => handleDelete(museum.Name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedMuseum && (
        <form onSubmit={handleUpdate}>
          <h2>{viewOnly ? "View Museum" : "Edit Museum"}</h2>
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
            value={formData.Tags}
            onChange={(e) => setFormData({ ...formData, Tags:  e.target.value  })}
            disabled={viewOnly}
          />
          {!viewOnly && <button type="submit">Update Museum</button>}
        </form>
      )}
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/gov-museum')}>Create other Museums</li>
        </ul>
      </div>
    </div>
  );
};
const styles = {
  list: {
    padding: 0,
    listStyle: "none",
  },
  listItem: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  container: {
    maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontSize:'14px',
        marginTop:'50px'
  },



  headerIcons: {
    display: "flex",
    alignItems: "center",
    gap: "15px", // Space between icons and button
  },


  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0F5132",
    marginBottom: "15px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  inputIcon: {
    fontSize: "16px",
    color: "#0F5132",
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
    width: "120px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  checkboxGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    margin: 0,
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#333",
  },
  submitButton: {
    padding: "5px 10px",
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    position: "relative", // Allows adjustment using top
    top: "-5px", // Moves the button up
    left: "50%", // Moves the button to the center horizontally
    transform: "translateX(-50%)", // Ensures it's perfectly centered
    display: "inline-block", // Ensures proper alignment
    textAlign: "center",
    marginTop:'20px'
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0F5132", // Matches the theme
    marginBottom: "15px",
    textAlign: "center", // Center-align the title
    borderBottom: "2px solid #0F5132", // Adds a subtle underline
    paddingBottom: "10px", // Adds spacing below the text
    letterSpacing: "1px", // Slightly spaced-out letters for readability
    textTransform: "uppercase", // Capitalizes all letters for emphasis
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
  },
  activityItem: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
 
  activityText: {
    fontWeight: 'bold',

    margin: 0,
    fontSize: '14px',
    color: '#grey',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  detailsIcon: {
    fontSize: '16px',
    color: '#0F5132',
  },
  detailSection: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width:'800px'
  },
  detailText: {
    fontSize: '14px',
    color: '#333',
    margin: '5px 0',
  },
  ticketPricesList: {
    listStyleType: 'none',
    paddingLeft: '10px',
  },
  actionButtons: {
    marginLeft:'-800px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  button: {
    padding: '8px 12px',
    fontSize: '14px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    justifyContent: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  viewButton: {
    padding: "5px 10px", // Smaller padding
    borderRadius: "5px", // Smaller border radius
    cursor: "pointer",
    fontSize: "14px", // Smaller font size
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: '#fff',
    color: '#0F5132',
    marginRight:'800px'
  },
  editButton: {
    padding: "4px 10px",
    backgroundColor: "#0F5132",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  deleteButton: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    border: "1px solid #dc3545", // Red border
    borderRadius: "5px",
    padding: "5px 10px",
    backgroundColor: "#dc3545", // Red background
    color: "white", // White text
    cursor: "pointer",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
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
    display: 'flex', alignItems: 'center', gap: '5px',
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
  modalCloseIcon: {
    color: "#0F5132",
    fontSize: "30px",
    cursor: "pointer",
    position: "absolute",
    right: "15px",
    top: "15px",
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
 
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '100px', // Adjust placement
  },
  cancel2Icon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '90px', // Adjust placement
  },
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    top:'-10px'
  },
  
  createButtonHover: {
    backgroundColor: "#084B24", // Darker green on hover
  },
  
  createIcon: {
    marginBottom:'8px',
    fontSize: "20px",
  },
  inputRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0F5132",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  
  popup: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    width: "300px",
  },
  
  popupText: {
    fontSize: "16px",
    marginBottom: "20px",
    color: "#333",
  },
  
  popupButtons: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px",
    fontSize: "14px",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
 






  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
  },
  activityItem: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
  },
  activityInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  activityText2: {
    fontWeight: 'bold',

    margin: 0,
    fontSize: '17px',
    color: '#grey',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  activityText: {
    fontWeight: 'bold',

    margin: 0,
    fontSize: '14px',
    color: '#grey',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  detailsIcon: {
    fontSize: '16px',
    color: '#0F5132',
  },
 
  detailText: {
    fontSize: '14px',
    color: '#333',
    margin: '5px 0',
  },
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
    marginTop:'3'

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
export default MyMuseums;
