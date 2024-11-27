import React, { useState, useEffect } from 'react';
import {
  FaLandmark,
  FaUniversity,
  FaBox,
  FaMap,
  FaRunning,
  FaBus,
  FaPlane,
  FaHotel,
  FaClipboardList,
  FaStar,
  FaUserCircle,
  FaWifi,
  FaCoffee,
  FaCar

} from 'react-icons/fa';
import logo from '../images/image.png'; // Adjust the path as necessary
import hotel from '../images/hotel.jpg'; // Adjust the path as necessary

import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip'; // Updated import
const BookHotels = () => {
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState({
    cityCode: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [bookedHotels, setBookedHotels] = useState([]);

  useEffect(() => {
    const fetchToken = async () => {
      const API_KEY = process.env.REACT_APP_API_KEY;
      const API_SECRET = process.env.REACT_APP_API_SECRET;

      try {
        const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: API_KEY,
            client_secret: API_SECRET,
          }),
        });

        const data = await res.json();
        if (data.access_token) {
          setToken(data.access_token);
        } else {
          throw new Error('Failed to obtain access token');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchToken();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelDetails({
      ...hotelDetails,
      [name]: value,
    });
  };

  const fetchHotelIds = async () => {
    const API_URL = 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city';
    const { cityCode } = hotelDetails;

    try {
      const res = await fetch(`${API_URL}?cityCode=${cityCode}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch hotel IDs');

      const data = await res.json();
      return data.data.slice(0, 20).map((hotel) => hotel.hotelId);
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const fetchHotelOffers = async (hotelIds) => {
    const { checkInDate, checkOutDate } = hotelDetails;
    const hotelIdsString = hotelIds.join(',');
    const url = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelIdsString}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=1`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error from Amadeus API:', errorData);
        throw new Error(errorData.message || 'Failed to fetch hotel offers');
      }

      const data = await res.json();
      setHotels(data.data);
      setBookedHotels(new Array(data.data.length).fill(false));
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

    if (!token) {
      setError('Authorization token is not available.');
      setLoading(false);
      return;
    }

    const hotelIds = await fetchHotelIds();
    if (hotelIds.length > 0) {
      await fetchHotelOffers(hotelIds);
    } else {
      setError('No hotels found for the specified city.');
      setLoading(false);
    }
  };

  const handleBooking = (index) => {
    const updatedBookings = [...bookedHotels];
    updatedBookings[index] = true;
    setBookedHotels(updatedBookings);
  };

  const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    maxWidth: '500px', // Smaller width for the form container
    margin: '150px auto', // Center form horizontally and give space from the top
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    height: 'auto', // Ensures that the container height adjusts based on the content
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
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
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
  sidebar: {
    position: 'fixed',
    top: '90px',
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
    marginLeft: '15px',
    color: '#fff',
  },
  label: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0,
    whiteSpace: 'nowrap',
    transition: 'opacity 0.3s ease',
  },
  container2: {
    marginTop:'90px',
    fontFamily: 'Arial, sans-serif',
  },
  background: {
    position: 'relative',
    backgroundImage:  `url(${hotel})`, // Replace with your image path
    height: '400px', // Keeps the container size the same
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
  },
  title2: {
    fontSize: '2.0rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
};
  return (
    <div>
    <div style={styles.container2}>
      {/* Background Section */}
      <div style={styles.background}>
        <h1 style={styles.title2}>Latest reviews. Lowest prices.</h1>
        <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '900px',
          margin: '0 auto',
          border: '1px solid rgba(0, 0, 0, 0.2)', // Soft border
          borderRadius: '55px',
          backgroundColor: 'white', // White background for search bar
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow for elevation
        }}
      >
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span>City Code (IATA):</span>
          <input
            type="text"
            name="cityCode"
             placeholder="City Code"
            value={hotelDetails.cityCode}
            onChange={handleInputChange}
            required
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '30px',
              marginRight: '0px',
              marginLeft: '18px',

              backgroundColor: '#f4f4f4', // Slightly gray background for inputs
              outline: 'none',
              fontSize: '16px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span>Check-In Date:</span>
          <input
            type="date"
            name="checkInDate"
            value={hotelDetails.checkInDate}
            onChange={handleInputChange}
            required
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '30px',
              marginRight: '10px',
              backgroundColor: '#f4f4f4',
              outline: 'none',
              fontSize: '16px',
            }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '10px' }}>
          <span>Check-Out Date:</span>
          <input
            type="date"
            name="checkOutDate"
            value={hotelDetails.checkOutDate}
            onChange={handleInputChange}
            required
            style={{
              flex: 1,
              padding: '12px 20px',
              border: 'none',
              borderRadius: '30px',
              marginRight: '10px',
              backgroundColor: '#f4f4f4',
              outline: 'none',
              fontSize: '16px',
            }}
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          style={{
            flex: 'none',
            padding: '12px 30px',
            backgroundColor: '#0F5132',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
            marginRight: '20px',
            marginLeft: '0px',
          }}
        >
          {loading ? 'Searching...' : 'Find Hotels'}
        </button>
      </form>

  
      </div>
  
     
  
    </div>
    
    <div>
    {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title}>Book Hotels</h1>
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

      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      

      {error && (
        <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
          Error: {error}
        </p>
      )}

{hotels.length > 0 && (
  <div style={{ maxWidth: '800px', margin: '20px auto' }}>
    <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Available Offers</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
      }}
    >
      {hotels.map((hotel, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease',
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
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
              {hotel.hotel.name}
            </h3>
            <p style={{ fontSize: '14px', color: '#555', marginBottom: '8px' }}>
              <strong>Hotel ID:</strong> {hotel.hotel.hotelId}
            </p>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#555' }}>
  <strong>Amenities:</strong> {hotel.hotel.amenities ? hotel.hotel.amenities.join(', ') : 'Standard'}
</div>

<p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0F5132', marginTop: '10px' }}>
  {hotel.offers && hotel.offers[0]?.price?.total
    ? `Price: $${hotel.offers[0].price.total}`
    : 'Price: Contact for details'}
</p>
<div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
  <FaWifi

   title="Free Wi-Fi" style={{ color: '#0F5132', fontSize: '20px' }} />
  <FaCoffee title="Breakfast Included" style={{ color: '#FFD700', fontSize: '20px' }} />
  <FaCar title="Parking Available" style={{ color: '#007bff', fontSize: '20px' }} />
</div>


<div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
  <FaStar style={{ color: '#FFD700' }} />
  <span style={{ fontSize: '14px', color: '#555' }}>
    {hotel.hotel.userRating ? `${hotel.hotel.userRating} / 5` : 'No ratings available'}
  </span>
</div>
          </div>
          {bookedHotels[index] ? (
            <p
              style={{
                color: '#0F5132',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              Booked!
            </p>
          ) : (
            <button
              onClick={() => handleBooking(index)}
              style={{
                marginTop: '10px',
                backgroundColor: '#0F5132',
                color: '#fff',
                padding: '10px 16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                alignSelf: 'center',
              }}
            >
              Book
            </button>
          )}
        </div>
      ))}
       <Tooltip id="amenities-tooltip" place="top" />
    </div>
  </div>
)}

    </div>
    </div>
    </div>

  );
};

export default BookHotels;
