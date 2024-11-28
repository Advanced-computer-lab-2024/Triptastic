import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import { FaUserCircle,FaShoppingCart,FaRegFileAlt, FaDollarSign, FaStar, FaComments, FaWarehouse, FaChartBar,FaBars} from 'react-icons/fa';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel,
  FaClipboardList } from "react-icons/fa";
  import { FaHeart } from 'react-icons/fa';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddresses, setShowAddresses] = useState(false); // Track visibility of addresses
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  // Proceed to payment
  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }
    // Navigate to payment page or process order
    navigate('/Payment', { 
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
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}>Checkout</h1>
        <div style={styles.headerIcons}>
          {/* Profile Icon */}
          <FaUserCircle
            alt="Profile Icon"
            style={styles.profileIcon}
            onClick={handleProfileRedirect} // Navigate to profile
          />
        </div>
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
        <div style={styles.item} onClick={() => navigate('/historical-locations')}>
          <FaLandmark style={styles.icon} />
          <span className="label" style={styles.label}>
            Historical Loc
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/museums')}>
          <FaUniversity style={styles.icon} />
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
          <FaHotel style={styles.icon} />
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
        <div style={styles.item} onClick={() => navigate('/tourist-orders')}>
          <FaClipboardList style={styles.icon} />
          <span className="label" style={styles.label}>
            Past Orders
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/AttendedActivitiesPage')}>
          <FaStar style={styles.icon} />
          <span className="label" style={styles.label}>
            Review Activities
          </span>
        </div>
      </div>
  
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
  
        <button
          style={styles.addButton}
          onClick={() => setShowAddresses((prev) => !prev)} // Toggle addresses visibility
        >
          {showAddresses ? 'Hide Addresses' : 'Select Address'}
        </button>
  
        {isLoading && <p style={styles.emptyMessage}>Loading addresses...</p>}
  
        {showAddresses && !isLoading && addresses.length > 0 && (
          <div>
            {addresses.map((address, index) => (
              <button
                key={index}
                style={{
                  ...styles.addressButton, // Use addressButton style
                  ...(selectedAddress?.id === address.id ? styles.selectedAddressButton : {}),
                }}
                onClick={() => handleAddressSelect(address)} // Select the address
              >
                {address.addressLine1}, {address.city}, {address.country}
                {address.isPrimary && (
                  <span style={{ color: '#0F5132', fontWeight: 'bold' }}>
                    {' '}
                    (Primary Address)
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
  
        {/* Display the selected address with a label */}
        {selectedAddress && (
          <div style={styles.selectedAddressContainer}>
            <p style={styles.selectedAddressLabel}>Selected Address:</p>
            <p style={styles.selectedAddress}>
              {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.country}
              {selectedAddress.isPrimary && (
                <span style={{ color: '#0F5132', fontWeight: 'bold' }}>
                  {' '}
                  (Primary Address)
                </span>
              )}
            </p>
          </div>
        )}
  
        <button
          style={styles.addButton}
          onClick={() => (window.location.href = '/touristsettings#target-section')}
        >
          Add Address
        </button>
  
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
    </div>
  );
}

export default Checkout;
