import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaCartArrowDown,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaBoxes, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList } from "react-icons/fa";
  import MuseumIcon from '@mui/icons-material/Museum';
import HotelIcon from '@mui/icons-material/Hotel';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
  import { FaHeart } from 'react-icons/fa';
const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false); // Track visibility of addresses
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [total,setTotal]=useState(0);

  const handleAddressSelect = (address) => {
    setSelectedAddress(address); // Set the selected address
    setShowAddresses(false); // Optionally hide the address list after selection
  };
  // Example styles
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '20px auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }, iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align items to the left
      padding: '10px',
      width: '100%', // Take full width of the sidebar
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    iconContainerHover: {
      backgroundColor: '#084B24', // Background on hover
    },
    icon: {
      fontSize: '24px',
      marginLeft: '15px', // Move icons slightly to the right
      color: '#fff', // Icons are always white
    },header: {
      height:'60px',
    position: 'fixed', // Make the header fixed
    top: '0', // Stick to the top of the viewport
    left: '0',
    width: '100%', // Make it span the full width of the viewport
    backgroundColor: '#0F5132',
    color: 'white', // White text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    zIndex: '1000', // Ensure it appears above other content
  },logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  }, profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
   // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  label: {
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0, // Initially hidden
    whiteSpace: 'nowrap', // Prevent label text from wrapping
    transition: 'opacity 0.3s ease',
  },
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
    cartContent: {
      marginBottom: '20px',
    },
    sidebarExpanded: {
      width: '200px', // Width when expanded
    },
    sidebar: {
      position: 'fixed',
      top: '60px',
      left: 0,
      height: '100vh',
      width: '50px', // Default width when collapsed
      backgroundColor: 'rgba(15, 81, 50, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', // Ensure alignment starts from the left
      padding: '10px 0',
      overflowX: 'hidden',
      transition: 'width 0.3s ease',
      zIndex: 1000,
    },
    cartList: {
      listStyleType: 'none',
      padding: 0,
    },
    cartItem: {
      marginBottom: '10px',
    },
    productName: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    addButton: {
      padding: '10px 20px',
      backgroundColor: '#0F5132', // Changed to the specified green
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginBottom: '10px',
    },
    item:{
      padding: "10px 0",
    },
    addressButton: {
      display: 'block',
      width: '100%',
      padding: '10px',
      marginBottom: '10px',
      border: '1px solid #0F5132', // Changed to match green border
      borderRadius: '5px',
      backgroundColor: '#0F5132',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.2s, border-color 0.2s',
    },
    selectedAddressButton: {
      backgroundColor: '#0F5132', // Light green for selected address
      borderColor: '#0F5132', // Dark green border for selected address
      fontWeight: 'bold',
    },
    emptyMessage: {
      color: '#888',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0F5132', // Changed to your green color
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }, iconContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align items to the left
      padding: '10px',
      width: '100%', // Take full width of the sidebar
      color: '#fff',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    // Added styles for selected address
    selectedAddressContainer: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: '#d4edda',
      borderRadius: '5px',
      border: '1px solid #28a745',
    },
    selectedAddressLabel: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#28a745',
    },
    selectedAddress: {
      fontSize: '16px',
      color: '#333',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      position: 'absolute', // Make it position-relative to the container
      left: '50%', // Position the title to the center horizontally
      transform: 'translateX(-50%)', // Offset it back by 50% of its width to center
      margin: 0,
      top: '50%', // Optional: if vertical centering within the container is required
      transform: 'translate(-50%, -50%)', // Combine horizontal and vertical centering
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
        // console.log(data);
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

  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'seller') {
      navigate('/seller-profile');
    } else if (context === 'admin') {
      navigate('/adminPage');
     } else if (context === 'guest') {
        navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };
  const formatAddress = (address) => {
    return `${address.addressLine1}, ${address.addressLine2 ? address.addressLine2 + ', ' : ''}${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };
  // Proceed to payment
  const handleProceedToPayment = async () => {
    if (!selectedAddress) {
      alert('Please select an address');
      return;
    }
  
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
    const touristUsername = localStorage.getItem('Username'); // Assuming the tourist username is stored in localStorage
  
    try {
      const response = await fetch('http://localhost:8000/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          touristUsername: touristUsername, // Send the username instead of touristId
          products: cartItems.map(item => item.productName), // Send the product names instead of IDs
          shippingAddress: formatAddress(selectedAddress), // Send a formatted address string
          totalPrice: total,
        }),
      });
  
      // Log the response body to the console
      const responseData = await response.json();
      console.log("Response Data:", responseData);
  
      if (response.ok) {
        // Order created successfully, proceed to payment
        navigate(`/Payment?amount=${total}`, {
          state: { from: '/Checkout', cartItems, selectedAddress }
        });
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage(responseData.message || 'Failed to create order');
      }
    } catch (error) {
      setErrorMessage('Error creating order');
      console.error("Error creating order:", error);
    }
  };
  
  const clearCart = async () => { 
    const username = localStorage.getItem("Username");
    if (!username) {
      console.error("No username found");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/clearCart?username=${username}`, {
        method: "PATCH", // Use PATCH as defined in the backend
      });
  
      if (!response.ok) {
        throw new Error("Failed to clear the cart");
      }
  
      const data = await response.json();
      console.log("Cart cleared:", data.message);
    } catch (error) {
      console.error("Error clearing cart:", error.message);
    }
  };
  
  const handleCashOnDelivery = async () => {
    if (!selectedAddress) {
      alert('Please select an address');
      return;
    }
  
    const total = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
    const touristUsername = localStorage.getItem('Username'); // Assuming the tourist username is stored in localStorage
    console.log(cartItems.map(item => item.productName))

    try {
      const response = await fetch('http://localhost:8000/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          touristUsername, // Send the username instead of touristId
          products: cartItems.map(item => item.productName), // Send the product names instead of IDs
          shippingAddress: formatAddress(selectedAddress),
          totalPrice:total
          // Set payment method as 'cashOnDelivery'
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Order created successfully, show order confirmation or navigate
        alert('Order created successfully with COD!');
        await clearCart();

        navigate('/tourist-orders');
        setErrorMessage(''); // Clear any previous error messages
      } else {
        setErrorMessage(data.message || 'Failed to create order');
      }
    } catch (error) {
      setErrorMessage('Error creating order');
      console.error(error);
    }
  };
  
  
  

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);
  return (
    <div style={styles.container}>
      <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Checkout</h1>
  <button
    style={{
      padding: '12px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: '#0F5132',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}
    onClick={() => navigate('/Cart', { state: { from: '/products' } })}
  >
    <ShoppingCartOutlinedIcon style={{ fontSize: '20px', color: '#fff' }} />
    Back to Cart
  </button>
</header>
  
      {/* Sidebar */}
      <div
        style={styles.sidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = '200px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '1')
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >
         <div style={styles.item} onClick={() => navigate('/tourist-profile')}>

          <FaUserCircle  style={styles.icon} />
          <span className="label" style={styles.label}>
            Home Page
          </span>
        </div>
        
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          
          <FaUniversity style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Sites
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <MuseumIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Museums
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/products')}>
          <FaBox style={styles.icon} />
          <span className="label" style={styles.label}>
            Products
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/itineraries')}>
          <FaMap style={styles.icon} />
          <span className="label" style={styles.label}>
            Itineraries
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/activities')}>
          <FaRunning style={styles.icon} />
          <span className="label" style={styles.label}>
            Activities
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-flights')}>
          <FaPlane style={styles.icon} />
          <span className="label" style={styles.label}>
            Book Flights
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-hotels')}>
          <HotelIcon style={styles.icon} />
          <span className="label" style={styles.label}>
            Book a Hotel
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/book-transportation')}>
          <FaBus style={styles.icon} />
          <span className="label" style={styles.label}>
           Transportation
          </span>
        </div>
      </div>
  
      <div style={styles.container}>
        <h3>{errorMessage}</h3>
{/* Cart Items Section */}
<div style={{ padding: '20px' }}>
  {cartItems.length === 0 ? (
    <p style={{ textAlign: 'center', fontSize: '16px', color: '#555' }}>
      Your cart is empty
    </p>
  ) : (
    <div>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {cartItems.map((item, index) => (
          <li
            key={index}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#0F5132',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FaCartArrowDown style={{ fontSize: '16px' }} /> {item.productName}
            </h3>
            <p
              style={{
                fontSize: '14px',
                margin: 0,
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaDollarSign style={{ fontSize: '14px', color: '#0F5132' }} />
              <strong>Price:</strong> {item.price}
            </p>
            <p
              style={{
                fontSize: '14px',
                margin: 0,
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <FaBoxes style={{ fontSize: '14px', color: '#0F5132' }} />
              <strong>Quantity:</strong> {item.quantity}
            </p>
          </li>
        ))}
      </ul>

      {/* Total Price */}
<div
  style={{
    marginTop: '15px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    justifyContent: 'center', // Center aligns the text
    alignItems: 'center',
    gap: '10px', // Adds spacing between the text and the price
  }}
>
  <p
    style={{
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0,
    }}
  >
    Total Price: 
  </p>
  <p
    style={{
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#0F5132',
      margin: 0,
    }}
  >
    {cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )}
  </p>
</div>
    </div>
  )}

  {/* Select Address */}
  <button 
    style={{
      padding: '10px 20px',
      backgroundColor: '#f9f9f9',
      color: 'black',
      fontSize: '14px',
      fontWeight: 'bold',
      border: '1px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    }}
    onClick={() => setShowAddresses((prev) => !prev)}
  >
    <HomeOutlinedIcon style={{ fontSize: '18px', color: 'black' }}/>{showAddresses ? 'Hide Addresses' : 'Select Address'}
  </button>

  {isLoading && (
    <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
      Loading addresses...
    </p>
  )}

  {showAddresses && !isLoading && (
    <div style={{ marginTop: '10px' }}>
      {addresses.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '14px', color: '#555' }}>
          No addresses available.
        </p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0,cursor:'pointer' }}>
          {addresses.map((address, index) => (
            <li
              key={index}
              style={{
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: selectedAddress?.id === address.id
                  ? '#eef9f0'
                  : '#f9f9f9',
                color: '#333',
                fontSize: '14px',
              }}
              onClick={() => handleAddressSelect(address)}
            >
              {address.addressLine1}, {address.city}, {address.country}{' '}
              {address.isPrimary && (
                <span style={{ color: '#0F5132', fontWeight: 'bold' }}>
                  (Primary)
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )}

  {selectedAddress && (
    <div style={{ marginTop: '15px', padding: '10px' }}>
      <p style={{ fontSize: '16px', color: '#0F5132', fontWeight: 'bold' }}>
        Selected Address:
      </p>
      <p style={{ fontSize: '14px', color: '#333' }}>
        {selectedAddress.addressLine1}, {selectedAddress.city},{' '}
        {selectedAddress.country}
        {selectedAddress.isPrimary && (
          <span style={{ color: '#0F5132', fontWeight: 'bold' }}> (Primary)</span>
        )}
      </p>
    </div>
  )}

  {/* Add Address */}
  <button
    style={{
      padding: '10px 20px',
      backgroundColor: '#f9f9f9',
      color: 'black',
      fontSize: '14px',
      fontWeight: 'bold',
      border: '1px solid #ddd',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    }}
    onClick={() => (window.location.href = '/tourist-profile#viewAddressesSection')}
  >
    <AddBoxOutlinedIcon style={{ fontSize: '18px', color: 'black' }}/>Add Address
  </button>

  {/* Proceed to Payment and Cash on Delivery */}
  <div
    style={{
      marginTop: '20px',
      display: 'flex',
      justifyContent: 'space-between',
    }}
  >
    <button
      onClick={handleProceedToPayment}
      style={{
        padding: '10px 20px',
        backgroundColor: '#0F5132',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
      }}
      disabled={cartItems.length === 0 || !selectedAddress}
    >
      <PaymentOutlinedIcon style={{ fontSize: '18px', color: '#fff' }} />
      Proceed to Payment
    </button>
    <button
  onClick={handleCashOnDelivery}
  style={{
    padding: '10px 20px',
    backgroundColor: '#0F5312',
    color: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  }}
  
>
  <AttachMoneyOutlinedIcon style={{ fontSize: '18px', color: 'white' }} />
  Cash on Delivery
</button>
  </div>
</div>

  </div>

    </div>
  );
}

export default Checkout;
