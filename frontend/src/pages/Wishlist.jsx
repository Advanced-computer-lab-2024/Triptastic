import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image_green_background.png'; // Replace with your logo path
import { FaUserCircle ,FaCartPlus} from 'react-icons/fa';
import cartIcon from '../images/cart.png';
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('Username'); // Retrieve username from local storage
  const navigate = useNavigate();
  // Fetch wishlist items
  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/getWishlist?Username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data.wishlist || []); // Assuming 'wishlist' contains product objects
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove an item from the wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/removeProductFromWishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, productId }),
      });

      if (response.ok) {
        alert('Product removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId)); // Update wishlist state
      } else {
        throw new Error('Failed to remove product from wishlist');
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      alert('Failed to remove product from wishlist');
    }
  };

  // Add an item from the wishlist to the cart
  const handleAddToCartFromWishlist = async (productName, productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/addToCartAndRemoveFromWishlist?Username=${username}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productName, quantity: 1 }),
        }
      );

      if (response.ok) {
        alert('Product added to cart and removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId)); // Update wishlist state
      } else {
        throw new Error('Failed to add product to cart and remove from wishlist');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <div style={styles.loading}>Loading wishlist...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img
            src={logo}
            alt="Logo"
            style={styles.logo}

          />
        </div>
        <h1 style={styles.title}>My Wishlist</h1>
        <FaUserCircle
          alt="Profile Icon"
          style={styles.profileIcon}
          onClick={() => navigate('/tourist-profile')} // Navigate to profile
        />
        
      </header>
      <FaCartPlus
          alt="Profile Icon"
          style={styles.cartIcon}
          onClick={() => navigate('/Cart')} // Navigate to profile
        />
      <div style={styles.wishlistContent}>
        {wishlist.length === 0 ? (
          <p style={styles.emptyMessage}>Your wishlist is empty.</p>
        ) : (
          <ul style={styles.wishlistList}>
            {wishlist.map((product) => (
              <li key={product._id} style={styles.wishlistItem}>
                <h2 style={styles.productName}>{product.productName}</h2>
                <p>
                  <strong>Description:</strong> {product.description}
                </p>
                <p>
                  <strong>Price:</strong> {product.price}
                </p>
                <button
                  style={styles.addToCartButton}
                  onClick={() =>
                    handleAddToCartFromWishlist(product.productName, product._id)
                  }
                >
                  Add to Cart
                </button>
                <button
                  style={styles.removeButton}
                  onClick={() => handleRemoveFromWishlist(product._id)}
                >
                  Remove from Wishlist
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
    marginBottom: '20px',
    backgroundColor: '#4CAF50',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
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
    color:'#4CAF50',
    cursor: 'pointer',
    marginLeft:'700px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
  },
  wishlistContent: {
    marginTop: '20px',
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  wishlistList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  wishlistItem: {
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
    backgroundColor: '#ff4d4d',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
};

export default Wishlist;
