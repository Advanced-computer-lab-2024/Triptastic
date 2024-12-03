import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png'; // Replace with your logo path
import { FaUserCircle, FaShoppingCart, FaTrash, FaCartPlus } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('Username'); // Retrieve username from local storage
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/getWishlist?Username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data.wishlist || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
      } else {
        throw new Error('Failed to remove product from wishlist');
      }
    } catch (error) {
      alert('Failed to remove product from wishlist');
    }
  };

  const handleAddToCartFromWishlist = async (productName, productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/addToCartAndRemoveFromWishlist?Username=${username}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productName, quantity: 1 }),
        }
      );

      if (response.ok) {
        alert('Product added to cart and removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId));
      } else {
        throw new Error('Failed to add product to cart and remove from wishlist');
      }
    } catch (error) {
      alert('Failed to add product to cart');
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <div style={styles.loading}>Loading wishlist...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>My Wishlist</h1>
        <div style={styles.iconGroup}>
          <FaShoppingCart
            style={styles.icon}
            onClick={() => navigate('/Cart')}
            title="Cart"
          />
          <FaUserCircle
            style={styles.icon}
            onClick={() => navigate('/tourist-profile')}
            title="Profile"
          />
        </div>
      </header>
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
                  <strong>Price:</strong> ${product.price}
                </p>
                <div style={styles.actionButtons}>
                  <button
                    style={styles.addToCartButton}
                    onClick={() =>
                      handleAddToCartFromWishlist(product.productName, product._id)
                    }
                  >
                    <FaCartPlus style={styles.buttonIcon} /> Add to Cart
                  </button>
                  <button
                    style={styles.removeButton}
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    <FaTrash style={styles.buttonIcon} /> Remove
                  </button>
                </div>
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
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#0F5132',
    padding: '10px 20px',
    borderRadius: '10px',
  },
  logo: {
    height: '50px',
    width: '50px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  iconGroup: {
    display: 'flex',
    gap: '15px',
  },
  icon: {
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
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
  },
  wishlistItem: {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '18px',
    color: '#0F5132',
    marginBottom: '10px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  addToCartButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: '5px',
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
