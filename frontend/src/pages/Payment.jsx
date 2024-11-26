import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = parseInt(queryParams.get('amount'), 10); // Get the amount from the URL (in cents)

  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;  // Stripe.js has not yet loaded
    }

    setLoading(true);

    try {
      // 1. Call the backend to create a payment intent
      const { data } = await axios.post('http://localhost:8000/create-payment-intent', {
        amount: amount,
      });

      // 2. Use Stripe.js to handle the payment confirmation
      const { clientSecret } = data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'User Name', // This can be dynamically updated based on the logged-in user
          },
        },
      });

      if (result.error) {
        alert('Payment failed: ' + result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          alert('Payment succeeded!');
        }
      }
    } catch (error) {
      console.error(error);
      alert('Error during payment process');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <p>Amount: ${amount / 100}</p> {/* Display the amount in dollars */}
      <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={loading || !stripe}>Pay ${amount / 100}</button>
      </form>
    </div>
  );
};

export default PaymentPage;
