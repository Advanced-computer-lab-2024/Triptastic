import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { CurrencyContext } from '../pages/CurrencyContext';
import logo from '../images/image_green_background.png'; // Replace with your logo path
import profile from '../images/profile.jpg'; // Replace with your profile icon path
import cartIcon from '../images/cart.png';
const Products = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minPrice, setMinPrice] = useState(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(''); // State for maximum price
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const username = localStorage.getItem('Username'); // Retrieve username from local storage

  const fetchProductsByRating = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/sortProductsByRatingTourist'); // Fetch sorted products
      if (!response.ok) {
        throw new Error('Failed to fetch sorted products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (minPrice = '', maxPrice = '') => {
    setLoading(true);
    setError('');

    try {
      let url = 'http://localhost:8000/viewProductsTourist'; // Default URL to fetch all products
      
      // If price filters are applied, modify the URL
      if (minPrice || maxPrice) {
        url = `http://localhost:8000/filterProductsByPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}`;
      }

      const response = await fetch(url); // Fetch either all or filtered products based on the URL
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(`http://localhost:8000/addProductToCart?Username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.productName,
          quantity: 1, // Default quantity, can be changed
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`${product.productName} added to cart successfully!`);
        setCart([...cart, { ...product, quantity: 1 }]); // Update cart state if needed
      } else {
        throw new Error('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Failed to add product to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    try {
      const response = await fetch(`http://localhost:8000/addProductToWishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, productId: product._id }),
      });

      if (response.ok) {
        alert(`${product.productName} added to wishlist successfully!`);
        setWishlist((prev) => [...prev, product._id]); // Update wishlist state
      } else {
        throw new Error('Failed to add product to wishlist');
      }
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      alert('Failed to add product to wishlist');
    }
  };
  const handleViewWishlist = () => {
    navigate('/Wishlist'); // Navigate to Wishlist page
  };
  const handleFilterSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    fetchProducts(minPrice, maxPrice); // Fetch products based on the entered price range
  };

  // Initial fetches on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img
            src={logo}
            alt="Logo"
            style={{
              height: '70px',
              width: '70px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              objectFit: 'cover',
              marginRight: '420px',
            }}
          />
          <h1 style={styles.title}>Products Page</h1>
        </div>
        <img
          src={profile}
          alt="Profile Icon"
          style={styles.profileIcon}
          onClick={handleProfileRedirect}
        />
      </header>

      <div style={styles.actionButtons}>
      <img
          src={cartIcon}
          alt="Cart Icon"
          style={styles.cartIcon}
          onClick={() => navigate('/Cart')}
        />
        <button onClick={handleViewWishlist} style={styles.wishlistButton}>
          View My Wishlist
        </button>
      </div>

      <form onSubmit={handleFilterSubmit} style={styles.filterForm}>
        <div>
          <label>Min Price: </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Enter minimum price"
          />
        </div>
        <div>
          <label>Max Price: </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Enter maximum price"
          />
        </div>
        <button type="submit" style={styles.filterButton}>
          Filter
        </button>
      </form>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul style={styles.productList}>
          {products.map((product) => (
            <li key={product.productName} style={styles.productItem}>
              <h2 style={styles.productName}>{product.productName}</h2>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
              <p>
                <strong>Price:</strong> {selectedCurrency}{' '}
                {(product.price * conversionRate).toFixed(2)}
              </p>
              <p>
                <strong>Rating:</strong> {product.rating}
              </p>
              <p><strong>Review:</strong> {product.review}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Sales:</strong> {product.sales}</p>
              {product.image && (
                <img
                  src={`http://localhost:8000/${product.image.replace(/\\/g, '/')}`}
                  alt={product.productName}
                  style={styles.productImage}
                />
              )}
              <button onClick={() => handleAddToCart(product)} style={styles.addButton}>
                Add to Cart
              </button>
              <button onClick={() => handleAddToWishlist(product)} style={styles.addButton}>
                Add to Wishlist
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  profileIcon: {
    height: '50px',
    width: '50px',
    borderRadius: '50%',
    cursor: 'pointer',
    borderRadius: '30px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  wishlistButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
  },
  cartIcon: {
    width: '50px',
    height: '50px',
    cursor: 'pointer',
    
  },
  filterForm: {
    margin: '20px 0',
  },
  filterButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '20px',
    color: '#4CAF50',
  },
  productImage: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Products;
