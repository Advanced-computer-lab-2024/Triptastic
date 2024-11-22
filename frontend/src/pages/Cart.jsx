import React, { useState, useEffect, useContext } from 'react';
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image_green_background.png'; // Logo image
import profile from '../images/profile.jpg'; // Profile icon
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    const username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/getCart?Username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();

      if (data.products && data.products.length > 0) {
        setCartItems(data.products);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(error.message);
      setError('Failed to fetch cart.');
    } finally {
      setLoading(false);
    }
  };

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value); // Update conversion rate for all products
  };

  const removeFromCart = async (productName, quantity) => {
    const username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/removeProductFromCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          quantity,
          Username: username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      alert(data.message); // Notify user about the successful removal
      fetchCart(); // Refresh the cart items
    } catch (error) {
      console.error(error.message);
      alert('Error removing item from cart.');
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>My Cart</h1>
        <button
          style={styles.profileButton}
          onClick={() => navigate('/tourist-profile')}
        >
          <img src={profile} alt="Profile" style={styles.profileIcon} />
        </button>
      </header>

      {/* Currency Dropdown for All Products */}
      <div style={styles.dropdownContainer}>
        <label style={styles.dropdownLabel}>Select Currency:</label>
        <select
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          style={styles.currencyDropdown}
        >
          <option value="EGP">Egyptian Pound (EGP)</option>
          <option value="USD">US Dollar (USD)</option>
          <option value="EUR">Euro (EUR)</option>
          <option value="GBP">British Pound (GBP)</option>
        </select>
      </div>

      <div style={styles.cartContent}>
        {loading ? (
          <p style={styles.loading}>Loading cart...</p>
        ) : error ? (
          <p style={styles.emptyMessage}>{error}</p>
        ) : cartItems.length === 0 ? (
          <p style={styles.emptyMessage}>Your cart is empty.</p>
        ) : (
          <ul style={styles.cartList}>
            {cartItems.map((item, index) => (
              <li key={index} style={styles.cartItem}>
                <h2 style={styles.productName}>{item.productName}</h2>
                <p>
                  <strong>Price:</strong> {selectedCurrency}{' '}
                  {(item.price * conversionRate).toFixed(2)}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Description:</strong> {item.description}
                </p>
                <button
                  style={styles.removeButton}
                  onClick={() => removeFromCart(item.productName, item.quantity)}
                >
                  Remove from Cart
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    backgroundColor: 'white',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
    margin: 0,
  },
  profileButton: {
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    padding: 0,
  },
  profileIcon: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  dropdownLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  currencyDropdown: {
    padding: '5px 10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  cartContent: {
    marginTop: '20px',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  cartList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  cartItem: {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '20px',
    color: '#4CAF50',
    marginBottom: '10px',
  },
  removeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
};

export default Cart;
