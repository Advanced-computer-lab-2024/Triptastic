import React, { useState, useEffect } from 'react';

const BookHotels = () => {
  const [hotelDetails, setHotelDetails] = useState({
    cityCode: '',
    checkInDate: '',
    checkOutDate: '',
  });
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [bookedHotels, setBookedHotels] = useState([]); // Track booked status for each hotel

  // Fetch access token from Amadeus API when component mounts
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
            'grant_type': 'client_credentials',
            'client_id': API_KEY,
            'client_secret': API_SECRET,
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

  // Update form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelDetails({
      ...hotelDetails,
      [name]: value,
    });
  };

  // Fetch hotel IDs by city code and limit to 20 IDs
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
      return data.data.slice(0, 20).map((hotel) => hotel.hotelId); // Limit to 20 hotels
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Fetch hotel offers for the first 20 hotel IDs
  const fetchHotelOffers = async (hotelIds) => {
    const { checkInDate, checkOutDate } = hotelDetails;

    // Join hotel IDs as a single comma-separated string
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
        console.error("Error from Amadeus API:", errorData);
        throw new Error(errorData.message || 'Failed to fetch hotel offers');
      }
      const data = await res.json();
      
      // Set hotels state with the fetched offers and reset booked status
      setHotels(data.data);
      setBookedHotels(new Array(data.data.length).fill(false)); // Initialize booked status array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission and search for hotels
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

  // Handle booking a hotel
  const handleBooking = (index) => {
    const updatedBookings = [...bookedHotels];
    updatedBookings[index] = true; // Mark the specific hotel as booked
    setBookedHotels(updatedBookings);
  };

  return (
    <div>
      <h2>Search Hotels</h2>
      <form onSubmit={handleSubmit}>
        <label>
          City Code (IATA Code):
          <input
            type="text"
            name="cityCode"
            value={hotelDetails.cityCode}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Check-In Date:
          <input
            type="date"
            name="checkInDate"
            value={hotelDetails.checkInDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Check-Out Date:
          <input
            type="date"
            name="checkOutDate"
            value={hotelDetails.checkOutDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </form>

      {hotels.length > 0 && (
        <div>
          <h3>Hotel Offers</h3>
          {hotels.map((hotel, index) => (
            <div key={index} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px', position: 'relative' }}>
              <p><strong>Hotel ID:</strong> {hotel.hotel.hotelId}</p>
              <p><strong>Name:</strong> {hotel.hotel.name}</p>
              <p><strong>Rating:</strong> {hotel.hotel.rating}</p>

              {bookedHotels[index] ? (
                <p style={{ color: 'green', fontWeight: 'bold', position: 'absolute', top: '10px', right: '10px' }}>Booked!</p>
              ) : (
                <button
                  onClick={() => handleBooking(index)} // Pass the index to mark this hotel as booked
                  style={{ marginTop: '8px', backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
                >
                  Book
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default BookHotels;
