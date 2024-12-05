import React, { useState, useEffect } from 'react'; 
import museumHistoryImage from '../images/museumhistory.jpg'; // Adjust the path as needed
import IosShareIcon from '@mui/icons-material/IosShare';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { FiCopy } from 'react-icons/fi'; // Import a copy icon
import romanImage from '../images/roman.jpg'; // Adjust the path as needed
import museummImage from '../images/museumm.jpg'; // Adjust the path as needed 
import buckinghamImage from '../images/buckingham.jpg'; // Adjust the path as needed
import fasImage from '../images/fas.jpg'; // Adjust the path as needed
import pyramidsImage from '../images/pyramids.jpg'; // Adjust the path as needed
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaBars, FaTimes,FaHome, FaUser, FaMapMarkerAlt } from "react-icons/fa"; // For menu icons
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";
import { FaPercentage, FaCalendarAlt, FaTag ,FaUserCircle} from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import { FaBell ,FaCalendar,FaDollarSign ,FaClock,FaTags,FaPercent} from 'react-icons/fa'; // Import icons
import { FaSearch,
  } from "react-icons/fa";
  import museum from '../images/museum.jpg'; 
  import HotelIcon from '@mui/icons-material/Hotel';
import MuseumIcon from '@mui/icons-material/Museum';





const Museums = () => {
  const [museums, setMuseums] = useState([]);
  const [historicalPeriods, setHistoricalPeriods] = useState([]); 
  const [selectedPeriod, setSelectedPeriod] = useState(''); 
  const [viewMuseums, setViewMuseums] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const [shareableLink, setShareableLink] = useState('');
  const [copySuccess, setCopySuccess] = useState({});
  const [email, setEmail] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [museumToShare, setMuseumToShare] = useState(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  
  const navigate = useNavigate();

  // Fetch museums from the backend
  const handleViewAllMuseums = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/viewAllMuseumsTourist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error fetching museums:', error);
    } finally {
      setLoading(false);
      setViewMuseums(true); 
    }
  };

  // Fetch unique historical periods from the backend
  const fetchHistoricalPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8000/getUniqueHistoricalPeriods', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setHistoricalPeriods(data); 
    } catch (error) {
      console.error('Error fetching historical periods:', error);
    }
  };

  // Handle filtering museums by historical period
  const handleFilterMuseums = async () => {
    if (!selectedPeriod) return; 

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/filterMuseumsByTagsTourist?Tags=${selectedPeriod}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); 
    } catch (error) {
      console.error('Error filtering museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // New function to search for museums
  const handleSearchMuseums = async () => {
    if (!searchTerm) return; // Do nothing if search term is empty

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/searchMuseums?name=${searchTerm}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setMuseums(data); // Update museums based on the search results
    } catch (error) {
      console.error('Error searching museums:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use effect to fetch historical periods when the component mounts
  useEffect(() => {
    handleViewAllMuseums();

    fetchHistoricalPeriods();
  }, []);
  const handleShare = async (museumName, shareMethod) => {
    try {
      const response = await fetch(`http://localhost:8000/shareMuseum/${encodeURIComponent(museumName)}`, {
        method: 'POST', // Use POST to match the backend's expectations
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: shareMethod === 'email' ? email : '' // Only include email if method is 'email'
        })
      });
      const data = await response.json();
  
      if (response.ok) {
        setShareableLink(data.link); // Set the link to state
  
        if (shareMethod === 'copy') {

          await navigator.clipboard.writeText(data.link); // Copy link to clipboard

          setCopySuccess((prev) => ({ ...prev, [museumName]: 'Link copied to clipboard!' })); 
          alert('Link copied to clipboard!');

        } else if (shareMethod === 'email') {
      
          alert('Link sent to the specified email!');
        }
      } else {
        console.error('Failed to generate shareable link');
      }
    } catch (error) {
      console.error("Error generating shareable link:", error);
    }
  };
  const handleEmailInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShareMode = (museum) => {
    setMuseumToShare(museum);
    setIsEmailMode(!isEmailMode);
    setShowEmailInput(true);
  };
  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');
  
    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'guest') {
      navigate('/Guest');
    }  else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };
  return (
    <div style={styles.container2}>
    {/* Background Section */}
    <div style={styles.background}>
      {/* Search Section */}
      <div style={styles.searchSection}>
      <input
        type="text"
        placeholder="Search museums..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.searchForm1}
      />
      <select
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)} // Update selected historical period
        style={styles.searchSelect} // Rounded dropdown style
      >
        <option value="" disabled>
          Select a historical period
        </option>
        {historicalPeriods.map((period) => (
          <option key={period.name} value={period.name}>
            {period.name}
          </option>
        ))}
      </select>
        
    
      <button
      onClick={() => {
        if (searchTerm) {
          handleSearchMuseums(searchTerm); // Call search logic
        } else if (selectedPeriod) {
          handleFilterMuseums(selectedPeriod); // Call filter logic
        }
      }}
        disabled={!searchTerm && !selectedPeriod} // Enable if either input is filled
        style={styles.searchButton}
      >
        <FaSearch style={styles.searchIcon} />
      </button>

    
  {viewMuseums && (
        <>
          

          {filterVisible && (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <label htmlFor="period-select" style={{ marginRight: '10px' }}>
                Filter by Historical Period:
              </label>
              <select
                id="period-select"
                onChange={(e) => setSelectedPeriod(e.target.value)}
                value={selectedPeriod}
                style={styles.dropdown}
              >
                <option value="" disabled>
                  Select a historical period
                </option>
                {historicalPeriods.map((period) => (
                  <option key={period.name} value={period.name}>
                    {period.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleFilterMuseums}
                disabled={!selectedPeriod}
                style={styles.button}
              >
                Apply Filter
              </button>
            </div>
          )}
        </>
      )}

</div>

    </div>

   


    <div style={styles.container}>
      {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={{fontSize:'24px',margintop:'20px'}}>Museums</h1>  <FaUserCircle
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={handleProfileRedirect} // Navigate to profile
  />

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
        <div   style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div  style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <HotelIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/tourist-orders')}>
          <FaClipboardList style={styles.icon} />
          <span className="label" style={styles.label}>
            Past Orders
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/AttendedActivitiesPage')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Review Activities
          </span>
        </div>
      </div>
      
     

     

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading...</p>
      ) : (
        <div style={styles.cardContainer}>
          {museums.map((museum) => (
            <div key={museum._id} style={styles.card}>
              <img
        src={
          museum.Name === "Roman Museum"
            ? romanImage
            : museum.Name === "National Museum of History"
            ? museumHistoryImage
            : museum.Name === "museum"
            ? museummImage
            : museum.Name === "buckingham palace"
            ? buckinghamImage 
            :museum.Name === "fas"
            ? fasImage
            :museum.Name === "pyramids"
            ? pyramidsImage
            : museum.mainImage
        }
        alt={museum.Name}
        style={styles.image}
      />
              <div style={styles.details}>
                <h2 style={styles.museumName}>{museum.Name}</h2>
                <p style={styles.description}>{museum.Description}</p>

                <div style={{ position: 'relative', display: 'inline-block' }}>
  <button
    onClick={() => handleShareMode(museum)}
    style={styles.shareButton}
  >
    <IosShareIcon />
  </button>
  <button
          onClick={() => handleShareMode(museum)}
          style={styles.shareOption}
        >
          <i className="fas fa-share-alt" style={styles.shareOptionIcon}></i>
        
        </button>
        {/* Dropdown */}
        {isEmailMode && museumToShare && museumToShare._id === museum._id && (
          <div style={styles.shareDropdown}>
            <button
              onClick={() => handleShare(museum.Name, "copy")}
              style={styles.shareOption}
            >
              <FiCopy style={styles.shareOptionIcon} /> Copy Link
            </button>
            <button
              onClick={() => setIsEmailMode(false)}
              style={styles.shareOption}
            >
              <MailOutlineIcon style={styles.shareOptionIcon} /> Share via Email
            </button>
            {/* Email Input Field */}
            {showEmailInput && museumToShare && museumToShare._id === museum._id && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="email"
                  placeholder="Enter recipient's email"
                  value={email}
                  onChange={handleEmailInputChange}
                  style={styles.emailInput}
                />
                <button
                  onClick={() => handleShare(museum.Name, "email")}
                  style={{ ...styles.button, marginTop: "10px" }}
                >
                  Send Email
                </button>
              </div>
            )}
                    </div>
                  )}
              </div>

              
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
    </div>

);
  
};
const styles = {
  container2: {
    marginTop:'60px',
    fontFamily: 'Arial, sans-serif',
  },
  background: {
    position: 'relative',
    backgroundImage:  `url(${museum})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', // Adjust height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  searchSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px', // Add spacing between elements
    marginTop: '20px',
  },
  searchForm: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '50px', // Make the input rounded
    border: '1px solid #ccc',
    outline: 'none',
    width: '500px', // Adjust width
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
  },
  searchForm1: {
    padding: '12px 20px',
    fontSize: '16px',
    height:'50px',
    borderRadius: '50px', // Make the input rounded
    border: '1px solid #ccc',
    outline: 'none',
    width: '500px', // Adjust width
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
  },
  searchSelect: {
    padding: '12px 20px',
    fontSize: '14px',
    borderRadius: '50px', // Make the dropdown rounded
    border: '1px solid #ccc',
    outline: 'none',
    backgroundColor: '#fff', // Ensure consistent background
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a soft shadow
    width:'250px'
  },
  searchButton: {
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '50px', // Make the button rounded
    border: 'none',
    backgroundColor: 'transparent', // Set a vibrant green color
    color: '#fff', // White text color
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: '25px', // Adjust icon size
  },
  
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
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
  item: {
 
    padding: '10px 0',
    
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
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  profileIcon:{
    fontSize: '40px',
    cursor: 'pointer',

  },
  title: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  button: {
    color:'#0F5132',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  buttonsearch: {
    marginTop:'90px',
    color:'#0F5132',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '10px',
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '300px',
    marginRight: '10px',

    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  dropdown: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-between',
  },
  

  emailInput: {
    padding: '10px',
    width: '100%',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },

  
    card: {
      display: 'flex',
      flexDirection: 'column', // Change to column for better layout
      alignItems: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      width: '100%',
      maxWidth: "350px", // Adjust the width
      padding: "10px", // Reduce padding for a shorter container
      height: "450px",
      backgroundColor: '#fff',
      marginBottom: '20px',
    },
    image: {
      width: '100%', // Make the image take the full width of the card
      height: '380px', // Adjust the height for better visibility
      objectFit: 'full', // Ensure the image scales correctly
    },
    details: {
      position: "relative", // Ensure the dropdown is positioned relative to this container
      padding: "20px",
      textAlign: "center",
    },
    museumName: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      margin: '0 0 10px',
    },
    description: {
      fontSize: '1rem',
      color: '#555',
      marginBottom: '20px',
    },
  
    shareButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '1.5rem',
      color: 'black',
      cursor: 'pointer',
      marginTop: '10px',
    },
    shareDropdown: {
      position: "absolute", // Position relative to parent
      top: "-230px", // Distance from the button (adjust as needed)
      left: "25%", // Center align with the button
      transform: "translateX(-50%)", // Center alignment adjustment
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: "1000",
      padding: "10px",
      width: "200px", // Fixed width
    },
    
    
    shareOption: {
      display: "flex",
      alignItems: "center", // Align icon and text vertically
      justifyContent: "flex-start", // Align icon and text to the left
      width: "100%",
      padding: "10px",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      color: "black", // Icon and text color
      textDecoration: "none",
    },
    shareOptionIcon: {
      marginRight: "8px", // Space between the icon and text
      fontSize: "1.0rem", // Ensure both icons are the same size
    },
    };
    
  
  



export default Museums;
