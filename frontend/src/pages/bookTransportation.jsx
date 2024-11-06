import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';

const BookTransportation = () => {
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

  return (
    <div>
      <h1>Available Transportations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        {transportations.map((transportation) => (
          <div key={transportation._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h2>{transportation.type} - {transportation.company.name}</h2>
            <p>Origin: {transportation.origin}</p>
            <p>Destination: {transportation.destination}</p>
            <p>Departure Time: {new Date(transportation.departureTime).toLocaleString()}</p>
            <p>Arrival Time: {new Date(transportation.arrivalTime).toLocaleString()}</p>
            <p>
    <strong>Price:</strong> {selectedCurrency} {(transportation.price * conversionRate).toFixed(2)}
  </p>
            <button onClick={handleBook}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookTransportation;
