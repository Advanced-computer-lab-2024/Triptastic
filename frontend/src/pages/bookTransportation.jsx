import React, { useState, useEffect, useContext } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
import { FaBus, FaPlane, FaTrain, FaMoneyBillWave, FaMapMarkerAlt, FaLocationArrow, FaClock ,FaDollarSign, FaArrowCircleLeft } from 'react-icons/fa'; // Icons for transport types
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

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <FaArrowCircleLeft
          style={styles.backIcon}
          onClick={() => navigate('/tourist-profile')}
        />
        <img src={logo} alt="Logo" style={styles.logo} /> {/* Add your logo here */}
        <h1 style={styles.title}>Book Your Transportation</h1>
      </header>

      {/* Currency Selector */}
      <div style={styles.currencySelector}>
        <label htmlFor="currency" style={styles.label}>
          <FaMoneyBillWave style={styles.icon} /> Select Currency:
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
    fontFamily: 'Montserrat, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    padding: '20px',
    color: '#333',
  },
  header: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  backIcon: {
    fontSize: '24px',
    color: '#fff',
    cursor: 'pointer',
    marginRight: '10px',
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
    textAlign: 'center',
    flex: 1,
  },
  currencySelector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: '20px 0',
  },
  label: {
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
    padding: '10px 20px',
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
  icon: {
    marginRight: '5px',
  },
};
