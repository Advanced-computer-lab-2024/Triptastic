import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import './bookflights.css'; // Import the external CSS file

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

  return (
    <div className="book-flights-container">
      <h2>Book Your Flight</h2>
      <form className="flight-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Origin (IATA Code):</label>
          <input
            type="text"
            name="origin"
            value={flightDetails.origin}
            onChange={handleInputChange}
            required
            placeholder="e.g., JFK"
          />
        </div>
        <div className="form-group">
          <label>Destination (IATA Code):</label>
          <input
            type="text"
            name="destination"
            value={flightDetails.destination}
            onChange={handleInputChange}
            required
            placeholder="e.g., LAX"
          />
        </div>
        <div className="form-group">
          <label>Departure Date:</label>
          <input
            type="date"
            name="date"
            value={flightDetails.date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Adults:</label>
          <input
            type="number"
            name="adults"
            value={flightDetails.adults}
            onChange={handleInputChange}
            required
            min="1"
            max="10"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {flights.length > 0 && (
        <div className="flights-container">
          {flights.map((flight, index) => (
            <div key={index} className="flight-card">
              <div className="flight-info">
                <div className="flight-header">
                  <h3>Flight #{flight.id}</h3>
                </div>
                <div className="flight-route">
                  <div className="flight-point">
                    <span className="iata-code">{flight.itineraries[0].segments[0].departure.iataCode}</span>
                    <span className="flight-time">{flight.itineraries[0].segments[0].departure.time}</span>
                  </div>
                  <span className="route-icon">✈️</span>
                  <div className="flight-point">
                    <span className="iata-code">{flight.itineraries[0].segments[0].arrival.iataCode}</span>
                    <span className="flight-time">{flight.itineraries[0].segments[0].arrival.time}</span>
                  </div>
                </div>
                <p className="flight-duration">
                  Duration: {flight.itineraries[0].segments[0].duration}
                </p>
                <p className="flight-price">
                  Price: {selectedCurrency} {(flight.price.total * conversionRate).toFixed(2)}
                </p>
              </div>
              {bookedFlightId === flight.id ? (
                <p className="booked-status">Booked!</p>
              ) : (
                <button onClick={() => handleBooking(flight.id)} className="book-button">
                  Book Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="error-message">Error: {error}</p>}
    </div>
  );
};

export default BookFlights;
