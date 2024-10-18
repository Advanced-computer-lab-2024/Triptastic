import React, { useState } from 'react';

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

  // Update form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({
      ...flightDetails,
      [name]: value,
    });
  };

  // Ensure date is in YYYY-MM-DD format
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(d.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
  };

  // Fetch access token from Amadeus API
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
      console.log('Token:', data.access_token);
      if (data.access_token) {
        return data.access_token;  // Return the access token
      } else {
        throw new Error('Failed to obtain access token');
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Fetch flight offers from Amadeus API using the access token
  const searchFlights = async (token) => {
    const API_URL = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
    const { origin, destination, date, adults } = flightDetails;

    const formattedDate = formatDate(date); // Ensure the date is in YYYY-MM-DD format

    try {
      const res = await fetch(`${API_URL}?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${formattedDate}&adults=${adults}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json(); // Parse the response to check for error details
        console.log('Error Response:', data);
        throw new Error('Failed to fetch flight data');
      }

      const data = await res.json();
      console.log('Response Data:', data);  // Log the response to inspect it
      setFlights(data.data);  // Assuming the response contains a 'data' array with flight offers
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission and search for flights
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Clear any previous errors

    // Get the access token
    const token = await getToken();

    if (token) {
      // Search for flights using the token
      await searchFlights(token);
    } else {
      setError('Could not get access token.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Flights</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Origin (IATA Code):
          <input
            type="text"
            name="origin"
            value={flightDetails.origin}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Destination (IATA Code):
          <input
            type="text"
            name="destination"
            value={flightDetails.destination}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Departure Date:
          <input
            type="date"
            name="date"
            value={flightDetails.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Adults:
          <input
            type="number"
            name="adults"
            value={flightDetails.adults}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {flights.length > 0 && (
        <div>
          <h3>Flight Offers</h3>
          {flights.map((flight, index) => (
            <div key={index}>
              <p>Flight ID: {flight.id}</p>
              <p>Price: {flight.price.total} {flight.price.currency}</p>
              <p>Departure: {flight.itineraries[0].segments[0].departure.iataCode}</p>
              <p>Arrival: {flight.itineraries[0].segments[0].arrival.iataCode}</p>
            </div>
          ))}
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default BookFlights;



