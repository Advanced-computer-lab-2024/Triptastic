import React, { useState, useEffect, useContext } from 'react';
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image.png'; // Logo image
import { FaUserCircle ,FaMoneyBillWave,FaRegFileAlt, FaDollarSign,FaBoxes} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaLandmark, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
  FaClipboardList,
  FaStar, } from "react-icons/fa";

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
  const updateCartQuantity = async (productName, newQuantity) => {
    const username = localStorage.getItem('Username');
  
    try {
      const response = await fetch(`http://localhost:8000/updateProductQuantityInCart`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName,
          newQuantity,
          Username: username,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update cart quantity');
      }
  
      // Refresh the cart items after updating
      fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error.message);
    }
  };
  
  const handleQuantityChange = (productName, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(productName, newQuantity);
    } else {
      alert('Quantity cannot be less than 1.');
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
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
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
          onClick={handleProfileRedirect}
        >
          <FaUserCircle alt="Profile" style={styles.profileIcon} />
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
      {/* Currency Dropdown for All Products */}
      <div style={styles.dropdownContainer}>
        <label style={styles.dropdownLabel}><FaMoneyBillWave/>Select Currency:</label>
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
                  <strong><FaDollarSign/>Price:</strong> {selectedCurrency}{' '}
                  {(item.price * conversionRate).toFixed(2)}
                </p>
                <p>
                  <strong><FaBoxes/>Quantity:</strong> {item.quantity}{' '}
                  <button
                    style={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.productName, item.quantity, -1)}
                  >
                    -
                  </button>
                  <button
                    style={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.productName, item.quantity, 1)}
                  >
                    +
                  </button>
                </p>
                <p>
                  <strong><FaRegFileAlt/>Description:</strong> {item.description}
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
      <div style={styles.checkoutContainer}>
            <button style={styles.checkoutButton} onClick={() => navigate('/Checkout')}>
              Proceed to Checkout
            </button>
          </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop:'150px',
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    height:'90px',
  position: 'fixed', // Make the header fixed
  top: '0', // Stick to the top of the viewport
  left: '0',
  width: '100%', // Make it span the full width of the viewport
  backgroundColor: '#0F5132', // Green background
  color: 'white', // White text
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 20px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
  zIndex: '1000', // Ensure it appears above other content
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  cartIcon: {
    width: '50px',
    height: '50px',
    color:'#0F5132',
    cursor: 'pointer',
    marginLeft:'700px'
  },
  quantityButton: {
    margin: '0 5px',
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  dropdownContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  },
  dropdownLabel: {
    marginTop:'60px',

    marginRight: '10px',
    fontWeight: 'bold',
  },
  currencyDropdown: {
    marginTop:'60px',
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
    color: '#0F5132',
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
  sidebar: {
    position: 'fixed',
    top: '90px',
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
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
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
};

export default Cart;
