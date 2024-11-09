import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';
const TouristOrders = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const [product, setProduct] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [productName, setProductName] = useState(''); // Product name to fetch
  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };

  // Fetch product data by name
  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/getProductTourist?productName=${productName}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // Submit review and ratting
  const submitReview = async () => {
    try {
      const response = await axios.patch
      
      ('http://localhost:8000/addReviewToProduct', {
        productName,
        review,
        rating
      });
      setProduct(response.data); // Update product with the new review and rating
      setReview(''); // Clear review field
      setRating(0); // Clear rating field
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  useEffect(() => {
    if (productName) fetchProduct();
  }, [productName]);

  return (
    <div>
      <h2>Product Review</h2>
      <input
        type="text"
        placeholder="Enter product name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <button onClick={fetchProduct}>Fetch Product</button>

      {product && (
        <div>
          <h3>{product.productName}</h3>
          <p>{product.description}</p>
          <p>
    Price: {selectedCurrency} {(product.price * conversionRate).toFixed(2)}
  </p>
          <p>Average Rating: {product.rating}</p>
          <p>Stock: {product.stock}</p>
          <img src={product.image} alt={product.productName} />

          <h4>Submit a Review</h4>
          <textarea
            placeholder="Your review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />
          <input
            type="number"
            placeholder="Rating (0-5)"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="0"
            max="5"
          />
          <button onClick={submitReview}>Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default TouristOrders;
