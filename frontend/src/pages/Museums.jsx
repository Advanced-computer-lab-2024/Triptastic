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
          setCopySuccess((prev) => ({ ...prev, [museumName]: 'Link copied to clipboard!' })); // Set success message for the specific museum
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
    <div style={styles.container}>
      {/* Header Section */}
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Museums</h1>  <FaUserCircle
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={handleProfileRedirect} // Navigate to profile
  />

</header>
      
      <button onClick={handleViewAllMuseums} style={styles.buttonsearch}>
        View All Museums
      </button>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search museums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button onClick={handleSearchMuseums} disabled={!searchTerm} style={styles.button}>
          Search
        </button>
      </div>

      {viewMuseums && (
        <>
          <button
            onClick={() => setFilterVisible((prev) => !prev)}
            style={{ ...styles.button, marginBottom: '20px' }}
          >
            Filter Museums
          </button>

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
);
  
};
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
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
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '70px',
    width: '80px',
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
