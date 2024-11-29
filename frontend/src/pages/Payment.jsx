import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { FaLock, FaDollarSign, FaCreditCard, FaWallet } from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = parseInt(queryParams.get('amount'), 10); // Amount in cents
  console.log(amount); // Debugging step to ensure amount is being sent correctly
  const Username = localStorage.getItem('Username');
  const userEmail=localStorage.getItem('Email')
  console.log(Username);
  console.log(userEmail);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default to credit card
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    // Save the previous page (from) in localStorage
    const fromPage = location.state?.from || '/';
    localStorage.setItem('previousPage', fromPage);
    console.log('Stored previous page:', fromPage); // Debugging log
  }, [location]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error
    if (!stripe || !elements) return; // Stripe.js not loaded yet
  
    setLoading(true);
  
    try {
      let paymentSuccess = false;
  
      if (paymentMethod === 'credit_card') {
        // 1. Call the backend to create a payment intent for Stripe
        const { data } = await axios.post(`http://localhost:8000/create-payment-intent?amount=${amount}&payment_method=${paymentMethod}`);
        const { clientSecret } = data;
  
        // 2. Confirm the payment using Stripe.js
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: Username, // Dynamically update based on logged-in user
              email: userEmail, // Including user's email in the billing details
            },
          },
        });
  
        if (result.error) {
          setError(`Payment failed: ${result.error.message}`);
        } else if (result.paymentIntent.status === 'succeeded') {
          paymentSuccess = true;
        }
      } else if (paymentMethod === 'wallet') {
        const { data } = await axios.patch('http://localhost:8000/payWithWallet', {
          username: Username,
          amount: amount,
        });
        console.log(data);
  
        if (data) {
          paymentSuccess = true;
        } else {
          setError('Wallet payment failed. Please try again.');
        }
      }
  
      if (paymentSuccess) {
        // Trigger email sending after payment success
        alert('Payment succeeded using wallet! Thank you for your purchase.');

        const previousPage = localStorage.getItem('previousPage');
        navigate(previousPage || '/');
        const response = await axios.post('http://localhost:8000/sendPaymentEmail', {
          email: userEmail,
          amount: amount,
        });

  

      }
    } catch (error) {
      console.error(error);
      setError('An error occurred during the payment process.');
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
      <div style={styles.progress}>Step 2 of 2: Payment</div>

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
          <strong>User:</strong> {Username}
        </p>
      </div>

      {/* Payment Method Selector */}
      <div style={styles.paymentMethodSelector}>
        <button
          onClick={() => setPaymentMethod('credit_card')}
          style={paymentMethod === 'credit_card' ? styles.selectedButton : styles.button}
        >
          <FaCreditCard /> Credit Card
        </button>
        <button
          onClick={() => setPaymentMethod('wallet')}
          style={paymentMethod === 'wallet' ? styles.selectedButton : styles.button}
        >
          <FaWallet /> Wallet
        </button>
      </div>

      {/* Payment Form */}
      <div style={styles.card}>
        <h1 style={styles.title}>
          {paymentMethod === 'credit_card' ? (
            <FaCreditCard style={styles.icon} />
          ) : (
            <FaWallet style={styles.icon} />
          )}
          {paymentMethod === 'credit_card' ? 'Enter Your Card Details' : 'Proceed with Wallet'}
        </h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          {paymentMethod === 'credit_card' && (
            <div style={styles.cardElementContainer}>
              <CardElement options={cardStyle} />
            </div>
          )}
          <button
            type="submit"
            disabled={loading || (!stripe && paymentMethod === 'credit_card')}
            style={{
              ...styles.button,
              backgroundColor: loading || (!stripe && paymentMethod === 'credit_card') ? '#ccc' : '#0F5132',
            }}
          >
            {loading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
    transition: 'background-color 0.3s',
    marginTop: '20px',
  },
  selectedButton: {
    backgroundColor: '#0F5132',
  },
  paymentMethodSelector: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
};

const cardStyle = {
  style: {
    base: {
      iconColor: '#6a6a6a',
      color: '#6a6a6a',
      lineHeight: '24px',
      fontWeight: 400,
      fontFamily: 'Arial, sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: '#a3a3a3',
      },
    },
  },
};

export default PaymentPage;
