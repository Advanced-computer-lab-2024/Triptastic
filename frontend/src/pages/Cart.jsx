import React, { useState, useEffect, useContext } from 'react';
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image.png'; // Logo image
import { FaUserCircle ,FaCartArrowDown,FaRegFileAlt, FaDollarSign,FaBoxes} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MuseumIcon from '@mui/icons-material/Museum';
import HotelIcon from '@mui/icons-material/Hotel';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { FaTrash, FaUniversity, FaBox, FaMap, FaRunning, FaBus, FaPlane, FaHotel, FaShoppingCart,
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
    onClick={() => navigate('/Checkout', { state: { from: '/products' } })}
  >
    <ShoppingCartCheckoutIcon style={{ fontSize: '20px', color: '#fff' }} />
    Proceed to Checkout
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
     

{/* Cart Items */}
<div style={{ padding: '20px',marginTop:'20' }}>
  {cartItems.map((item, index) => (
    <div
      key={index}
      style={{
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#0F5132';
        e.currentTarget.style.transform = 'scale(1.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#ddd';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {/* Product Details */}
      <div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FaCartArrowDown style={{ fontSize: '18px', color: '#0F5132' }} />{' '}
          {item.productName}
        </h2>
        <p
          style={{
            fontSize: '14px',
            marginBottom: '8px',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaDollarSign style={{ fontSize: '14px', color: '#0F5132' }} />
          <strong>Price:</strong> {selectedCurrency}{' '}
          {(item.price * conversionRate).toFixed(2)}
        </p>
        <p
          style={{
            fontSize: '14px',
            marginBottom: '8px',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaBoxes style={{ fontSize: '14px', color: '#0F5132' }} />
          <strong>Quantity:</strong>{' '}
          <button
            style={{
              padding: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#0F5312',
              color: '#fff',
              cursor: 'pointer',
              margin: '0 5px',
            }}
            onClick={() =>
              handleQuantityChange(item.productName, item.quantity, -1)
            }
          >
            -
          </button>
          {item.quantity}
          <button
            style={{
              padding: '5px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              backgroundColor: '#0F5312',
              color: '#fff',
              cursor: 'pointer',
              margin: '0 5px',
            }}
            onClick={() =>
              handleQuantityChange(item.productName, item.quantity, 1)
            }
          >
            +
          </button>
        </p>
        <p
          style={{
            fontSize: '14px',
            marginBottom: '8px',
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FaRegFileAlt style={{ fontSize: '14px', color: '#0F5132' }} />
          <strong>Description:</strong> {item.description}
        </p>
      </div>

      {/* Remove Button */}
      <button
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '5px 10px',
          border: '1px solid #dc3545',
          borderRadius: '5px',
          backgroundColor: '#dc3545',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '12px',
          cursor: 'pointer',
        }}
        onClick={() => removeFromCart(item.productName, item.quantity)}
      >
       <FaTrash/> Remove from cart
      </button>
    </div>
  ))}
</div>


</div>



  );
};

const styles = {
  container: {
    marginTop:'100px',
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    height: "60px",
    position: "fixed", // Make the header fixed
    top: "0", // Stick to the top of the viewport
    left: "0",
    width: "100%", // Make it span the full width of the viewport
    backgroundColor: "#0F5132", // Green background
    color: "white", // White text
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for depth
    zIndex: "1000", // Ensure it appears above other content
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "60px",
    width: "70px",
    borderRadius: "10px",
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
  },
  cartContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cartList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  productImageContainer: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  productImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  productName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  productInfo: {
    fontSize: '14px',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  icon: {
    fontSize: '14px',
    color: '#0F5132',
  },
  quantityButton: {
    marginLeft: '5px',
    marginRight: '5px',
    padding: '5px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f1f1f1',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  removeButton: {
    padding: '8px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    cursor: 'pointer',
    alignSelf: 'center',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  removeButtonHover: {
    backgroundColor: '#c82333',
  },
  checkoutContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  checkoutButton: {
    padding: '12px 20px',
    backgroundColor: '#0F5132',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  checkoutButtonHover: {
    backgroundColor: '#084B24',
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
  item:{
    padding: "10px 0",
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
    top: "60px",
    top: "60px",
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
