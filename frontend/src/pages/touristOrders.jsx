import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CurrencyContext } from '../pages/CurrencyContext';

const TouristOrders = () => {
  const { selectedCurrency, conversionRate, fetchConversionRate } = useContext(CurrencyContext);

  const [orders, setOrders] = useState([]); // Holds the orders of the tourist
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [productName, setProductName] = useState(''); // Product name to fetch
  const [selectedOrder, setSelectedOrder] = useState(null); // Holds the selected order for review submission

  const handleCurrencyChange = (event) => {
    fetchConversionRate(event.target.value);
  };

  // Fetch orders for a tourist (assumes tourist's username is stored in local storage or context)
  const fetchOrders = async () => {
    const touristUsername = localStorage.getItem('Username'); // Adjust according to your app's logic
    if (!touristUsername) {
      console.error('No tourist username found');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/getTouristOrders?tourist=${touristUsername}`);
      setOrders(response.data); // Update orders state with the fetched orders
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Submit review and rating for the selected product in the order
  const submitReview = async (productName) => {
    try {
      const response = await axios.patch('http://localhost:8000/addReviewToProduct', {
        productName,
        review,
        rating
      });
      if(response){
        alert("Review submitted!")

      }


      // Update the order with the new review and rating (you may need to update specific order in the state)

      setReview(''); // Clear review field
      setRating(0); // Clear rating field
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  // Trigger fetching orders when the component is mounted
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Your Orders</h2>
      <div>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderNumber}>
              <h3>Order #{order.orderNumber}</h3>
              <p>Status: {order.status}</p>
              <p>Total Price: {selectedCurrency} {(order.totalPrice * conversionRate).toFixed(2)}</p>
              <p>Shipping Address: {order.shippingAddress}</p>
              <div>
                <h4>Products in this Order</h4>
                {order.products.map((productName) => (
                  <div key={productName}>
                    <p>{productName}</p>
                    <button onClick={() => setProductName(productName)}>Leave a Review</button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {productName && (
        <div>
          <h3>Submit Review for {productName}</h3>
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
          <button onClick={() => submitReview(productName)}>Submit Review</button>
        </div>
      )}
    </div>
  );
};

export default TouristOrders;
