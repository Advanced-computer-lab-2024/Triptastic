import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FaLock, FaDollarSign, FaCreditCard } from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = parseInt(queryParams.get('amount'), 10); // Amount in cents

  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return; // Stripe.js not loaded yet

    setLoading(true);

    try {
      // 1. Call the backend to create a payment intent
      const { data } = await axios.post('http://localhost:8000/create-payment-intent', {
        amount: amount,
      });

      // 2. Confirm the payment using Stripe.js
      const { clientSecret } = data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: 'John Doe', // Dynamically update based on logged-in user
          },
        },
      });

      if (result.error) {
        alert(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert('Payment succeeded! Thank you for your purchase.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during the payment process.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          <FaLock style={styles.lockIcon} /> Secure Payment Portal
        </h2>
      </div>

      {/* Progress Indicator */}
      <div style={styles.progress}>
        Step 2 of 3: Payment
      </div>

      {/* Payment Summary */}
      <div style={styles.summary}>
        <h3 style={styles.summaryTitle}>
          <FaDollarSign style={styles.icon} /> Payment Summary
        </h3>
        <p style={styles.summaryText}>
          <strong>Amount:</strong> ${(amount / 100).toFixed(2)}
        </p>
        <p style={styles.summaryText}>
          <strong>Description:</strong> Service Purchase
        </p>
        <p style={styles.summaryText}>
          <strong>User:</strong> John Doe
        </p>
      </div>

      {/* Payment Form */}
      <div style={styles.card}>
        <h1 style={styles.title}>
          <FaCreditCard style={styles.icon} /> Enter Your Card Details
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.cardElementContainer}>
            <CardElement options={cardStyle} />
          </div>
          <button
            type="submit"
            disabled={loading || !stripe}
            style={{
              ...styles.button,
              backgroundColor: loading || !stripe ? '#ccc' : '#0F5132',
            }}
            onMouseEnter={(e) => {
              if (!loading && stripe) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = '#0F5132';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && stripe) {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#0F5132';
              }
            }}
          >
            {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  header: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px',
    backgroundColor: '#0F5132',
    padding: '20px',
    borderRadius: '6px',
    color: '#fff',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  lockIcon: {
    fontSize: '24px',
  },
  progress: {
    margin: '10px 0',
    padding: '10px',
    fontSize: '14px',
    color: '#555',
    backgroundColor: '#f1f1f1',
    borderRadius: '6px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
  },
  summary: {
    padding: '15px',
    marginBottom: '20px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '6px',
    width: '100%',
    maxWidth: '400px',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  summaryText: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
  },
  icon: {
    fontSize: '18px',
    color: '#333',
  },
  card: {
    width: '90%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  cardElementContainer: {
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '10px',
    backgroundColor: '#f8f8f8',
  },
  button: {
    padding: '12px',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};

// Stripe Card Element Styling
const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#333',
      '::placeholder': {
        color: '#888',
      },
    },
    invalid: {
      color: '#e5424d',
    },
  },
};

export default PaymentPage;
