import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false); // Track visibility of addresses
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // Define styles object
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '20px auto',
      backgroundColor: '#f4f4f4',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    header: {
      height: '90px',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      backgroundColor: '#0F5132', // Dark Green
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: '1000',
    },
    button: {
      backgroundColor: '#0F5132', // Dark Green
      color: 'white',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      textAlign: 'center',
      border: 'none',
      margin: '5px 0',
    },
    buttonSelected: {
      backgroundColor: '#0F5132', // Dark Green
      color: 'white',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      textAlign: 'center',
      border: 'none',
      margin: '5px 0',
      opacity: 0.7, // Apply a "selected" effect to indicate the selection
    },
    addressList: {
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginTop: '10px',
    },
    addressItem: {
      padding: '10px',
      backgroundColor: 'white', // Dark Green for background
      color: 'white', // White text
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '5px',
    //   boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'background-color 0.2s',
    },
    addressItemSelected: {
      backgroundColor: '#0F5132', // Slightly lighter green for selected state
    },
    cartContent: {
      padding: '20px',
    },
    cartList: {
      listStyle: 'none',
      paddingLeft: '0',
    },
    cartItem: {
      padding: '15px',
      margin: '10px 0',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    productName: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    removeButton: {
      backgroundColor: '#FF4D4D',
      color: 'white',
      padding: '8px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      border: 'none',
    },
    emptyMessage: {
      fontSize: '1.2rem',
      color: '#333',
    },
    loading: {
      fontSize: '1.2rem',
      color: '#999',
    },
  };

  // Fetch cart items
  const fetchCart = async () => {
    const username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getCart?Username=${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      const data = await response.json();
      setCartItems(data.products || []);
    } catch (error) {
      console.error('Cart fetch error:', error);
    }
  };

  // Fetch user addresses
  const fetchAddresses = async () => {
    const username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getAddresses?username=${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching addresses');
      console.error(error);
    }
  };

  // Handle address selection
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowAddresses(false); // Hide address dropdown after selection
  };

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    // Navigate to payment page or process order
    navigate('/payment', { 
      state: { 
        cartItems, 
        selectedAddress 
      } 
    });
  };

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.cartContent}>Checkout</h1>

      {/* Cart Items Section */}
      <div style={styles.cartContent}>
        {cartItems.length === 0 ? (
          <p style={styles.emptyMessage}>Your cart is empty</p>
        ) : (
          <ul style={styles.cartList}>
            {cartItems.map((item, index) => (
              <li key={index} style={styles.cartItem}>
                <h2 style={styles.productName}>{item.productName}</h2>
                <p>
                  <strong>Price:</strong> {item.price}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Address Selection */}
      <div style={styles.cartContent}>
        <h3 style={styles.productName}>Choose Address</h3>
        {selectedAddress ? (
          <div style={styles.button}>
            <p>{selectedAddress.street}</p>
            <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
            <button 
              onClick={() => setShowAddresses(true)}
              style={styles.button}
            >
              Change Address
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAddresses((prev) => !prev)} // Toggle visibility of addresses
            style={styles.button}
          >
            View Addresses
          </button>
        )}
      </div>

      {/* Address Dropdown */}
      {showAddresses && (
        <div style={styles.addressList}>
          <h3 style={styles.productName}>Select an Address</h3>
          {addresses.length === 0 ? (
            <p style={styles.emptyMessage}>No addresses found. Please add an address.</p>
          ) : (
            <ul>
              {addresses.map((address, index) => (
                <li 
                  key={index}
                  onClick={() => handleAddressSelect(address)} 
                  style={{
                    ...styles.addressItem,
                    ...(selectedAddress?.id === address.id ? styles.addressItemSelected : {}),
                  }}
                >
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Proceed to Payment Button */}
      <div style={styles.cartContent}>
        <button 
          onClick={handleProceedToPayment}
          style={styles.button}
          disabled={cartItems.length === 0 || !selectedAddress}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
