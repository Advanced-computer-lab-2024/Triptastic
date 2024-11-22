import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

import { CurrencyContext } from '../pages/CurrencyContext';

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
    <div>
      <h1>Products Page</h1>
      <button onClick={handleViewWishlist} style={{ position: 'absolute', top: '10px', right: '10px' }}>View Wishlist</button>

      {/* Filter Form */}
      <form onSubmit={handleFilterSubmit}>
        <div>
          <label>Min Price: </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)} // Update state when input changes
            placeholder="Enter minimum price"
          />
        </div>
        <div>
          <label>Max Price: </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)} // Update state when input changes
            placeholder="Enter maximum price"
          />
        </div>
        <button type="submit">Filter</button>
      </form>
      <button onClick={fetchProductsByRating}>Sort by Rating</button>

      {/* Display Products */}
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {products.map((product) => (
            <li key={product.productName} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h2>{product.productName}</h2>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {selectedCurrency} {(product.price * conversionRate).toFixed(2)}</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Seller:</strong> {product.seller}</p>
              <p><strong>Review:</strong> {product.review}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              <p><strong>Sales:</strong> {product.sales}</p>

              {product.image && (
                <img
                  src={`http://localhost:8000/${product.image.replace(/\\/g, '/')}`}
                  alt={product.productName}
                  style={{ width: '400px', height: '300px' }}
                />
              )}
              <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
              <button onClick={() => handleAddToWishlist(product)}>Add to Wishlist</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
