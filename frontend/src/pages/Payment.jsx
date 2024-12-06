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
  const userEmail = localStorage.getItem('Email');
  console.log(Username);
  console.log(userEmail);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Default to credit card
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); // Store discount amount
  const [discountedAmount, setDiscountedAmount] = useState(amount); // Store updated amount after discount
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    // Save the previous page (from) in localStorage
    const fromPage = location.state?.from || '/';
    localStorage.setItem('previousPage', fromPage);
    console.log('Stored previous page:', fromPage); // Debugging log
  }, [location]);

  // Handle promo code change
  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
    console.log(promoCode);
  };

  // Apply promo code
  const applyPromoCode = async () => {
    try {
      const response = await fetch('http://localhost:8000/applyPromoCode', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: amount, code: promoCode }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const discount = data.discount;
        setDiscount(discount);
        const newAmount = amount - discount;
        setDiscountedAmount(newAmount);
  
        // Update the URL with the new amount
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('amount', newAmount); // Update the amount in the query params
        window.history.pushState({}, '', newUrl); // Update the browser URL
  
        alert(`Promo code applied! You saved $${(discount / 100).toFixed(2)}`);
      } else {
        alert('Invalid promo code');
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      alert('Error applying promo code');
    }
  };
  
  const clearCart = async () => { 
    const username = localStorage.getItem("Username");
    if (!username) {
      console.error("No username found");
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/clearCart?username=${username}`, {
        method: "PATCH", // Use PATCH as defined in the backend
      });
  
      if (!response.ok) {
        throw new Error("Failed to clear the cart");
      }
  
      const data = await response.json();
      console.log("Cart cleared:", data.message);
    } catch (error) {
      console.error("Error clearing cart:", error.message);
    }
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error
    if (!stripe || !elements) return; // Stripe.js not loaded yet

    setLoading(true);

    try {
      let paymentSuccess = false;

      if (paymentMethod === 'credit_card') {
        // Call the backend to create a payment intent with the discounted amount
        const { data } = await axios.post(`http://localhost:8000/create-payment-intent?amount=${discountedAmount}&payment_method=${paymentMethod}`);
        const { clientSecret } = data;

        // Confirm the payment using Stripe.js
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: Username,
              email: userEmail,
            },
          },
        });

        if (result.error) {
          setError(`Payment failed: ${result.error.message}`);
        } else if (result.paymentIntent.status === 'succeeded') {
          await clearCart();
          paymentSuccess = true;
        }
      } else if (paymentMethod === 'wallet') {
        // Handle wallet payment with the discounted amount
        const { data } = await axios.patch('http://localhost:8000/payWithWallet', {
          username: Username,
          amount: discountedAmount,
        });

        if (data) {
          paymentSuccess = true;
        } else {
          setError('Wallet payment failed. Please try again.');
        }
      }

      if (paymentSuccess) {
        await clearCart();

        alert('Payment succeeded! Thank you for your purchase.');

        const previousPage = localStorage.getItem('previousPage');
        navigate(previousPage || '/');
        await axios.post('http://localhost:8000/sendPaymentEmail', {
          email: userEmail,
          amount: discountedAmount,
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
          <strong>Amount:</strong> ${(discountedAmount / 100).toFixed(2)}
        </p>
        <p style={styles.summaryText}>
          <strong>Description:</strong> Service Purchase
        </p>
        <p style={styles.summaryText}>
          <strong>User:</strong> {Username}
        </p>
      </div>

      {/* Promo Code */}
      <div style={styles.promoCodeSection}>
        <input
          type="text"
          value={promoCode}
          onChange={handlePromoCodeChange}
          placeholder="Enter promo code"
          style={styles.promoCodeInput}
        />
        <button
          onClick={applyPromoCode}
          style={styles.button}
        >
          Apply Promo Code
        </button>
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
            {loading ? 'Processing...' : `Pay $${(discountedAmount / 100).toFixed(2)}`}
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
    color: '#0F5132',
  },
  summaryText: {
    fontSize: '14px',
    color: '#555',
  },
  promoCodeSection: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  promoCodeInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  selectedButton: {
    padding: '10px 20px',
    backgroundColor: '#2b8a3e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  paymentMethodSelector: {
    display: 'flex',
    justifyContent: 'space-evenly',
    width: '100%',
    maxWidth: '400px',
    marginBottom: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  },
  icon: {
    fontSize: '28px',
    marginRight: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  cardElementContainer: {
    padding: '10px',
    backgroundColor: '#f1f1f1',
    borderRadius: '6px',
  },
};

const cardStyle = {
  style: {
    base: {
      fontSize: '16px',
      color: '#333',
      '::placeholder': {
        color: '#aaa',
      },
    },
  },
};

export default PaymentPage;
