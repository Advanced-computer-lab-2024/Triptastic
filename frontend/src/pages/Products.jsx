import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';

const Products = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [minPrice, setMinPrice] = useState(''); // State for minimum price
  const [maxPrice, setMaxPrice] = useState(''); // State for maximum price

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

  useEffect(() => {
    fetchProducts(); // Fetch all products on page load
  }, []);

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
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

  // Call fetchProducts initially to load all products when the component mounts
  useEffect(() => {
    fetchProducts(); // Fetch all products on page load
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page
    fetchProducts(minPrice, maxPrice); // Fetch products based on the entered price range
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Products Page</h1>

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
      {/* Display products */}
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {products.map((product) => (
            <li key={product.productName} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h2>{product.productName}</h2> {/* Display product name */}
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {selectedCurrency} {(product.price * conversionRate).toFixed(2)}</p>
              <p><strong>Rating:</strong> {product.rating}</p>
              <p><strong>Seller:</strong> {product.seller}</p>
              <p><strong>Review:</strong> {product.review}</p>
              <p><strong>Stock:</strong> {product.stock}</p>
              {product.image && <img src={`http://localhost:8000/${product.image.replace(/\\/g, '/')}`} alt={product.productName} style={{ width: '400px', height: '300px' }}/>

            } {/* Display product image */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
