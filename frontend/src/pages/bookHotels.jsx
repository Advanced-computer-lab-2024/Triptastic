import React, { useState, useEffect } from 'react';

const BookHotels = () => {
  const [hotelDetails, setHotelDetails] = useState({
    cityCode: '',
    radius: '', // Optional
    radiusUnit: 'KM', // Default to KM
    amenities: '', // Optional (comma-separated string)
    ratings: '', // Optional (comma-separated string)
  });
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedHotels, setBookedHotels] = useState([]); // Array to track booked status for each hotel

  // Update form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelDetails({
      ...hotelDetails,
      [name]: value,
    });
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

  // Fetch hotel offers from Amadeus API using the access token
  const searchHotels = async (token) => {
    const API_URL = 'https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city';
    const { cityCode, radius, radiusUnit, amenities, ratings } = hotelDetails;

    // Construct URL with only the available parameters
    let url = `${API_URL}?cityCode=${cityCode}`;

    if (radius) url += `&radius=${radius}`;
    if (radiusUnit) url += `&radiusUnit=${radiusUnit}`;
    if (amenities) url += `&amenities=${amenities.split(',').join(',')}`;
    if (ratings) url += `&ratings=${ratings.split(',').join(',')}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error('Failed to fetch hotel data');
      }

      const data = await res.json();
      setHotels(data.data); // Assuming response contains a 'data' array with hotel offers
      setBookedHotels(new Array(data.data.length).fill(false)); // Initialize booked status array with false
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

    const token = await getToken();

    if (token) {
      await searchHotels(token);
    } else {
      setError('Could not get access token.');
      setLoading(false);
    }
  };

  // Handle booking button (mark the flight as booked)
  const handleBooking = (index) => {
    const updatedBookings = [...bookedHotels];
    updatedBookings[index] = true; // Set the specific hotel as booked
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
          Radius (optional):
          <input
            type="number"
            name="radius"
            value={hotelDetails.radius}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Radius Unit:
          <select name="radiusUnit" value={hotelDetails.radiusUnit} onChange={handleInputChange}>
            <option value="KM">KM</option>
            <option value="MILE">MILE</option>
          </select>
        </label>
        <label>
          Amenities (optional, comma-separated):
          <input
            type="text"
            name="amenities"
            value={hotelDetails.amenities}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Ratings (optional, comma-separated):
          <input
            type="text"
            name="ratings"
            value={hotelDetails.ratings}
            onChange={handleInputChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Hotels'}
        </button>
      </form>

      {hotels.length > 0 && (
        <div>
          <h3>Hotel Offers</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {hotels.map((hotel, index) => (
              <div key={index} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', position: 'relative' }}>
                <p><strong>Hotel ID:</strong> {hotel.id}</p>
                <p><strong>Name:</strong> {hotel.name}</p>
                <p><strong>Rating:</strong> {hotel.rating}</p>

                {bookedHotels[index] ? (
                  <p style={{ color: 'green', fontWeight: 'bold', position: 'absolute', top: '10px', right: '10px' }}>Booked!</p>
                ) : (
                  <button
                    onClick={() => handleBooking(index)} // Pass the index to track the specific hotel
                    style={{ marginTop: '8px', backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: '4px' }}
                  >
                    Book
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default BookHotels;
