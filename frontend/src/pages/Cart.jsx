import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';

const Cart = ({ username }) => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch the cart from the backend
  const fetchCart = async () => {
    const username = localStorage.getItem('Username'); 

    try {
      const response = await fetch(`http://localhost:8000/getCart?Username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCartItems(data.products); // Assuming the products are under 'products' in the response
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };

  useEffect(() => {
    fetchCart(); // Fetch cart data on component mount
  }, [username]);

  if (loading) {
    return <div>Loading cart...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {cartItems.map((item, index) => (
            <li key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h2>{item.productName}</h2>
              <p>
    <strong>Price:</strong> {selectedCurrency} {(item.price * conversionRate).toFixed(2)}
  </p>
              <p><strong>Quantity:</strong> {item.quantity}</p> {/* Display actual quantity from cart */}
              <p><strong>Description:</strong> {item.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Cart;

