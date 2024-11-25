import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';

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
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#0F5132',
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
    label: {
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    input: {
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '6px',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0F5132',
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
    routeIcon: {
      fontSize: '24px',
      color: '#0F5132',
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
    button: {
      backgroundColor: '#0F5132', // Updated color
      color: 'white',
      padding: '12px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    bookButton: {
      backgroundColor: '#0F5132', // Updated color
      color: 'white',
      padding: '10px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#064824', // A slightly darker shade for hover effect
    },
    bookedStatus: {
      color: '#0F5132', // Updated color
      fontWeight: 'bold',
      fontSize: '16px',
      textAlign: 'center',
    },
  
    errorMessage: {
      color: 'red',
      textAlign: 'center',
    },
      // Add this style for the icons
  icon: {
    fontSize: '18px', // Adjust the size of the icons
    color: '#0F5132', // Same color as the route icon
    marginRight: '8px', // Spacing between icon and text
  },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Book Your Flight</h2>
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Origin (IATA Code):</label>
          <input
            type="text"
            name="origin"
            value={flightDetails.origin}
            onChange={handleInputChange}
            required
            placeholder="e.g., JFK"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Destination (IATA Code):</label>
          <input
            type="text"
            name="destination"
            value={flightDetails.destination}
            onChange={handleInputChange}
            required
            placeholder="e.g., LAX"
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Departure Date:</label>
          <input
            type="date"
            name="date"
            value={flightDetails.date}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Adults:</label>
          <input
            type="number"
            name="adults"
            value={flightDetails.adults}
            onChange={handleInputChange}
            required
            min="1"
            max="10"
            style={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {flights.length > 0 && (
  <div style={styles.flightsContainer}>
    {flights.map((flight, index) => (
      <div key={index} style={styles.flightCard}>
        <div style={styles.flightHeader}>Flight #{flight.id}</div>
        <div style={styles.flightRoute}>
          <div style={styles.flightPoint}>
            <FaPlaneDeparture style={styles.icon} />
            <span style={styles.iataCode}>{flight.itineraries[0].segments[0].departure.iataCode}</span>
            <span style={styles.flightTime}>{flight.itineraries[0].segments[0].departure.time}</span>
          </div>
      
          <div style={styles.flightPoint}>
            <FaPlaneArrival style={styles.icon} />
            <span style={styles.iataCode}>{flight.itineraries[0].segments[0].arrival.iataCode}</span>
            <span style={styles.flightTime}>{flight.itineraries[0].segments[0].arrival.time}</span>
          </div>
        </div>
        <p style={styles.flightDuration}>
          Duration: {flight.itineraries[0].segments[0].duration}
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
