import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaPlaneDeparture, FaPlaneArrival,FaSearch,FaUser,FaCalendarAlt, FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaClipboardList, FaStar, FaUserCircle } from 'react-icons/fa';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import flight from '../images/flight.jpg'; // Adjust the path as necessary

import { useNavigate } from 'react-router-dom';
const BookFlights = () => {
  const [flightDetails, setFlightDetails] = useState({
    origin: '',
    destination: '',
    date: '',
    adults: 1,
  });
  const [flights, setFlights] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedFlightId, setBookedFlightId] = useState(null);
  const navigate = useNavigate();
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({
      ...flightDetails,
      [name]: value,
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const mockSearchFlights = () => {
    const mockFlights = [
      {
        id: 'F001',
        price: { total: 250 },
        itineraries: [
          {
            segments: [
              {
                departure: { iataCode: 'JFK', time: '09:00 AM' },
                arrival: { iataCode: 'LAX', time: '02:45 PM' },
                duration: '5h 45m',
              },
            ],
          },
        ],
      },
      {
        id: 'F002',
        price: { total: 450 },
        itineraries: [
          {
            segments: [
              {
                departure: { iataCode: 'LAX', time: '10:30 AM' },
                arrival: { iataCode: 'ORD', time: '03:50 PM' },
                duration: '4h 20m',
              },
            ],
          },
        ],
      },
    ];
    setFlights(mockFlights);
    setLoading(false);
  };
  const getToken = async () => {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const API_SECRET = process.env.REACT_APP_API_SECRET;

    try {
      const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': API_KEY,
          'client_secret': API_SECRET,
        }),
      });

      const data = await res.json();
      if (data.access_token) {
        return data.access_token;
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };


  const searchFlights = async (token) => {
    const API_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
    const { origin, destination, date, adults } = flightDetails;

    const formattedDate = formatDate(date);

    try {
      const res = await fetch(`${API_URL}?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${formattedDate}&adults=${adults}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error('Failed to fetch flight data');
      }

      const data = await res.json();
      setFlights(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBookedFlightId(null);

    // Simulate API call with mock data
    setTimeout(() => {
      mockSearchFlights();
    }, 1500);

    const token = await getToken();

    if (token) {
      await searchFlights(token);
    } else {
      setError('Could not get access token.');
      setLoading(false);
    }
  };

  const handleBooking = (flightId) => {
    setBookedFlightId(flightId);
  };
  
  const formatDuration = (isoDuration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = isoDuration.match(regex);
  
    if (!match) return isoDuration; // Return as is if not a valid format
  
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? ` ${match[2]}m` : '';
    return `${hours}${minutes}`.trim();
  };
  
  const formatTime = (timeString) => {
  if (!timeString) return 'N/A';
  try {
    const date = new Date(timeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = String(minutes).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch {
    return 'Invalid Time';
  }
};


  const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    paddingTop: '100px', // Avoid overlap with the header
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
  },
  form: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
 
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  flightsContainer: {
    marginTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  flightHeader: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  flightRoute: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  },
  flightPoint: {
    textAlign: 'center',
  },
  iataCode: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  flightTime: {
    fontSize: '14px',
    color: '#555',
  },
  flightDuration: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  flightPrice: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  bookButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  bookedStatus: {
    color: '#0F5132',
    fontWeight: 'bold',
    fontSize: '16px',
    textAlign: 'center',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
  },
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '60px',
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 0',
    overflowY: 'auto',
    transition: 'width 0.3s ease',
    zIndex: 1000,
    boxSizing: 'border-box',  // Include padding in width/height calculation
  },
  
  sidebarExpanded: {
    width: '200px',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    width: '100%',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
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
 
  item: {
    padding: '10px 0',
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  searchField: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
  },
  input: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '14px',
    width: '150px',
  },
  searchButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  flightsContainer: {
    marginTop: '20px',
    display: 'grid',
    gap: '20px',
  },
  flightCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
};

  

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>Book Flights</h1>
        <FaUserCircle
          style={styles.profileIcon}
          onClick={() => navigate('/touristSettings')}
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
      
      {/* Search Form */}
 <div style={styles.searchFormContainer}>
 <form onSubmit={handleSubmit} style={styles.searchForm}>
 <div style={styles.searchField}>
      <FaPlaneDeparture style={styles.icon} />
      <select
        name="origin"
        value={flightDetails.origin}
        onChange={handleInputChange}
        style={styles.input}
        required
      >
        <option value="" disabled>Select Origin</option>
        {/* Add options for the origin */}
        <option value="JFK">John F. Kennedy International Airport (JFK)</option>
        <option value="LHR">London Heathrow Airport (LHR)</option>
        <option value="DXB">Dubai International Airport (DXB)</option>
        <option value="ATL">Hartsfield-Jackson Atlanta International Airport (ATL)</option>
        <option value="ORD">O'Hare International Airport (ORD)</option>
        <option value="LAX">Los Angeles International Airport (LAX)</option>
        <option value="LHR">London Heathrow Airport (LHR)</option>
        <option value="CDG">Charles de Gaulle Airport (CDG)</option>
        {/* Add more options as needed */}
      </select>
    </div>

    {/* To: Dropdown */}
    <div style={styles.searchField}>
      <FaPlaneArrival style={styles.icon} />
      <select
        name="destination"
        value={flightDetails.destination}
        onChange={handleInputChange}
        style={styles.input}
        required
      >
        <option value="" disabled>Select Destination</option>
        {/* Add options for the destination */}
        <option value="LAX">Los Angeles International Airport (LAX)</option>
        <option value="FCO">Fiumicino Airport (FCO)</option>
        <option value="LHR">London Heathrow Airport (LHR)</option>
        <option value="DXB">Dubai International Airport (DXB)</option>
        <option value="JFK">John F. Kennedy International Airport (JFK)</option>
        <option value="SYD">Sydney Kingsford Smith Airport (SYD)</option>
        <option value="CDG">Charles de Gaulle Airport (CDG)</option>
        <option value="BKK">Suvarnabhumi Airport (BKK)</option>
        <option value="ICN">Incheon International Airport (ICN)</option>
        <option value="SIN">Singapore Changi Airport (SIN)</option>
        <option value="ORD">O'Hare International Airport (ORD)</option>
        {/* Add more options as needed */}
      </select>
    </div>

    {/* Date Input */}
    <div style={styles.searchField}>
      <FaCalendarAlt style={styles.icon} />
      <input
        type="date"
        name="date"
        value={flightDetails.date}
        onChange={handleInputChange}
        style={styles.input}
        required
      />
    </div>

    {/* Adults Input */}
    <div style={styles.searchField}>
      <FaUser style={styles.icon} />
      <input
        type="number"
        name="adults"
        value={flightDetails.adults}
        onChange={handleInputChange}
        placeholder="1 Traveler"
        min="1"
        max="10"
        style={styles.input}
        required
      />
    </div>
   <button type="submit" disabled={loading} style={styles.searchButton}>
          {loading ? 'Searching...' : 'Search Flights'}
          <FaSearch /> Search
        </button>
      </form>
</div>
       

      {flights.length > 0 && (
  <div style={styles.flightsContainer}>
    {flights.map((flight, index) => (
      <div key={index} style={styles.flightCard}>
        <div style={styles.flightHeader}>Flight #{flight.id}</div>
        
        <div style={styles.flightRoute}>
          <div style={styles.flightPoint}>
            <FaPlaneDeparture style={styles.icon2} />
            <span style={styles.iataCode}>{flight.itineraries[0].segments[0].departure.iataCode}</span>
            <span style={styles.flightTime}>
              {formatTime(flight.itineraries[0].segments[0].departure.at)}
            </span>
          </div>
          <div style={styles.connectionLine}>
  <span style={styles.connectionIcon}>✈</span>
</div>
          <div style={styles.flightPoint}>
            <FaPlaneArrival style={styles.icon2} />
            <span style={styles.iataCode}>{flight.itineraries[0].segments[0].arrival.iataCode}</span>
            <span style={styles.flightTime}>
              {formatTime(flight.itineraries[0].segments[0].arrival.at)}
            </span>
          </div>
        </div>
        <p style={styles.flightDuration}>
  Duration: {formatDuration(flight.itineraries[0].segments[0].duration)}
</p>
        <p style={styles.flightPrice}>
          Price: {selectedCurrency} {(flight.price.total * conversionRate).toFixed(2)}
        </p>
        {bookedFlightId === flight.id ? (
          <p style={styles.bookedStatus}>Booked!</p>
        ) : (
          <button onClick={() => handleBooking(flight.id)} style={styles.bookButton}>
            Book Now
          </button>
        )}
      </div>
    ))}
  </div>
)}


      {error && <p style={styles.errorMessage}>Error: {error}</p>}
    </div>
  );
};




export default BookFlights;
