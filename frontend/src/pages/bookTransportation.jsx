import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaBus, FaPlane,FaCar,FaShip, FaTrain, FaMoneyBillWave, FaMapMarkerAlt, FaLocationArrow, FaClock ,FaDollarSign, FaArrowCircleLeft,FaUserCircle,FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from 'react-icons/fa'; // Icons for transport types
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai'; // Icons for messages
import logo from '../images/image.png';
import bus from '../images/transportation.webp';
import MuseumIcon from '@mui/icons-material/Museum';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NearMeIcon from '@mui/icons-material/NearMe';
import DepartureBoardIcon from '@mui/icons-material/DepartureBoard';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
const BookTransportation = () => {
  const navigate = useNavigate(); // For navigation
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const [transportations, setTransportations] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch transportations on component mount
  useEffect(() => {
    const fetchTransportations = async () => {
      try {
        const response = await fetch('http://localhost:8000/getTransportation');
        if (!response.ok) {
          throw new Error('Failed to load transportations');
        }
        const data = await response.json();
        setTransportations(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      }
    };

    fetchTransportations();
  }, []);

  // Handle the book button click
  const handleBook = () => {
    if(localStorage.getItem('context') === 'guest') {
      alert('Please login to book transportation');
      return;
    }
    setSuccessMessage('Transportation has been booked successfully!');
  };

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };
  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } 
    else if (context === 'guest') {
        navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };

  return (
    <div style={styles.container2}>
    {/* Background Section */}
    <div style={styles.background}>
      <h1 style={styles.searchFormHeading}>Seamless Journeys, Anytime, Anywhere!</h1>
    </div>
  
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} /> {/* Add your logo here */}
        <h1 style={styles.title}>Book Your Transportation</h1>
<div>

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
        <div style={styles.item} onClick={() => navigate('/tourist-profile')}>
          <FaUserCircle style={styles.icon} />
          <span className="label" style={styles.label}>
             Home Page
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
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
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
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
          <FaHotel style={styles.icon} />
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
       
      </div>
      {/* Error and Success Messages */}
      {error && (
        <div style={styles.errorMessage}>
          <AiOutlineWarning style={styles.icon} /> {error}
        </div>
      )}
      {successMessage && (
        <div style={styles.successMessage}>
          <AiOutlineCheckCircle style={styles.icon} /> {successMessage}
        </div>
      )}

 {/* Transportations List */}
<div style={styles.transportList}>
  {transportations.map((transportation) => (
    <div
      key={transportation._id}
      style={{
        ...styles.transportCard,
        position: 'relative',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '15px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.3s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.03)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.borderColor = '#0F5132';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = '#ddd';
      }}
    >
      {/* Card Header */}
      <div style={styles.cardHeader}>
        {transportation.type === 'Bus' && <FaBus style={styles.cardIcon} />}
        {transportation.type === 'Train' && <FaTrain style={styles.cardIcon} />}
        {transportation.type === 'Taxi' && <FaCar style={styles.cardIcon} />}
        {transportation.type === 'Boat' && <FaShip style={styles.cardIcon} />}
        <h3 style={styles.cardTitle}>
          {transportation.type} - {transportation.company.name}
        </h3>
      </div>

      <div style={styles.cardContent}>
  <p style={styles.cardText}>
    <NearMeIcon style={styles.cardInfoIcon} />
    <span>
      <span style={styles.cardBoldText}>Origin:</span>
      <span style={styles.cardValueText}>{transportation.origin}</span>
    </span>
  </p>
  <p style={styles.cardText}>
    <LocationOnIcon style={styles.cardInfoIcon} />
    <span>
      <span style={styles.cardBoldText}>Destination:</span>
      <span style={styles.cardValueText}>{transportation.destination}</span>
    </span>
  </p>
  <p style={styles.cardText}>
    <DepartureBoardIcon style={styles.cardInfoIcon} />
    <span>
      <span style={styles.cardBoldText}>Departure:</span>
      <span style={styles.cardValueText}>
        {new Date(transportation.departureTime).toLocaleString()}
      </span>
    </span>
  </p>
  <p style={styles.cardText}>
    <AccessTimeIcon style={styles.cardInfoIcon} />
    <span>
      <span style={styles.cardBoldText}>Arrival:</span>
      <span style={styles.cardValueText}>
        {new Date(transportation.arrivalTime).toLocaleString()}
      </span>
    </span>
  </p>
  <p style={styles.cardText}>
    <FaDollarSign style={styles.cardInfoIcon} />
    <span>
      <span style={styles.cardBoldText}>Price:</span>
      <span style={styles.cardValueText}>
        {selectedCurrency} {(transportation.price * conversionRate).toFixed(2)}
      </span>
    </span>
  </p>
</div>



      {/* Book Button */}
      <button onClick={handleBook} style={styles.bookButton}>Book Now</button>
    </div>
  ))}
</div>



    </div>
    </div>

  );
};

export default BookTransportation;

// Inline Styles
const styles = {
  searchFormHeading: {
    fontSize: '35px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '15px',
    textAlign: 'center',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',

  },
  container2: {
    marginTop:'60px',
    fontFamily: 'Arial, sans-serif',
  },
  background: {
    position: 'relative',
    backgroundImage: `url(${bus})`, // Replace with your image path
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '400px', // Adjust height as needed
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    zIndex: 1, // Ensure content is above the overlay
    overflow: 'hidden', // To ensure content doesn’t spill out
  },
  item: {
 
    padding: '10px 0',
    
  },
  container: {

    maxWidth: '1000px',
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
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
 
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  transportList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  transportCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
  },
  transportCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '10px',
  },
  cardIcon: {
    fontSize: '24px',
    color: '#0F5132',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  cardContent: {
    padding: '10px 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Consistent spacing between rows
  },
  cardText: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Gap between icon and text
    fontSize: '14px', // Balanced font size
    lineHeight: '1.6', // Improved line spacing
    color: '#2C3E50', // Neutral dark gray for readability
  },
  cardInfoIcon: {
    color: '#0F5132', // Consistent green for icons
    fontSize: '16px', // Slightly smaller icons
    flexShrink: 0, // Prevent shrinking
  },
  cardBoldText: {
    fontWeight: 'bold', // Medium weight for labels
    color: '#333', // Calm dark green
    marginRight: '10px', // Space between label and value
  },
  cardValueText: {
    fontWeight: 'bold', // Medium weight for labels

    color: '#0F5132', // Slightly muted gray-blue for a soothing effect
    textTransform: 'none', // Natural casing (no forced uppercase)
    fontSize: '16px', // Same size as label
  },
  bookButton: {
    marginTop: '15px',
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  bookButtonHover: {
    backgroundColor: '#084B24',
  },
  errorMessage: {
    color: 'red',
    backgroundColor: '#fdecea',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    backgroundColor: '#e6f9e6',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
  },
  cicon: {
    marginRight: '5px',
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
};
