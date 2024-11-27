import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaBus, FaPlane, FaTrain, FaMoneyBillWave, FaMapMarkerAlt, FaLocationArrow, FaClock ,FaDollarSign, FaArrowCircleLeft,FaUserCircle,FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from 'react-icons/fa'; // Icons for transport types
import { AiOutlineCheckCircle, AiOutlineWarning } from 'react-icons/ai'; // Icons for messages
import logo from '../images/image.png';

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
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <FaArrowCircleLeft
          style={styles.backIcon}
          onClick={handleProfileRedirect}

        />
        <img src={logo} alt="Logo" style={styles.logo} /> {/* Add your logo here */}
        <h1 style={styles.title}>Book Your Transportation</h1>
        <FaUserCircle style={styles.profileIcon} onClick={handleProfileRedirect} />

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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <FaUniversity style={styles.icon} />
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

      {/* Currency Selector */}
      <div style={styles.currencySelector}>
        <label htmlFor="currency" style={styles.clabel}>
          <FaMoneyBillWave style={styles.cicon} /> Select Currency:
        </label>
        <select id="currency" onChange={handleCurrencyChange} style={styles.select}>
        <option value="EGP">EGP</option>

          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
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
          <div key={transportation._id} style={styles.transportCard}>
            {/* Dynamic Icon for Transportation Type */}
            <div style={styles.cardHeader}>
              {transportation.type === 'Bus' && <FaBus style={styles.cardIcon} />}
              {transportation.type === 'Plane' && <FaPlane style={styles.cardIcon} />}
              {transportation.type === 'Train' && <FaTrain style={styles.cardIcon} />}
              <h2 style={styles.cardTitle}>
                {transportation.type} - {transportation.company.name}
              </h2>
            </div>
            <p><strong><FaMapMarkerAlt /> Origin:</strong> {transportation.origin}</p>
            <p><strong><FaLocationArrow /> Destination:</strong> {transportation.destination}</p>
            <p><strong><FaClock /> Departure Time:</strong> {new Date(transportation.departureTime).toLocaleString()}</p>
            <p><strong><FaClock /> Arrival Time:</strong> {new Date(transportation.arrivalTime).toLocaleString()}</p>
            <p>
              <strong><FaDollarSign /> Price:</strong> {selectedCurrency} {(transportation.price * conversionRate).toFixed(2)}
            </p>
            <button onClick={handleBook} style={styles.bookButton}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookTransportation;

// Inline Styles
const styles = {
  container: {
    marginTop:'60px',
    fontFamily: 'Montserrat, sans-serif',
    fontSize:"15px",
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    padding: '20px',
    color: '#333',
    margin:'100px'
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
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  backIcon: {
    fontSize: '24px',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
  },
 
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  currencySelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: '20px 0',
  },
  clabel: {
    fontWeight: 'bold',
    marginRight: '10px',
  },
  select: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  transportList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  transportCard: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardIcon: {
    fontSize: '24px',
    marginRight: '10px',
    color: '#0F5132',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  bookButton: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
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
    top: '90px',
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
