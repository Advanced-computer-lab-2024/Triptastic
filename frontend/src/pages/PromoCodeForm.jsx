import React, { useState, useEffect } from 'react';
import './promoCodeForm.css';
import { FaPercentage, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { MdDiscount } from 'react-icons/md';

const PromoCodeForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    isPercentage: false,
    expirationDate: '',
    maxUsage: 1,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [promoCodes, setPromoCodes] = useState([]); // State to store fetched promo codes
  const [loading, setLoading] = useState(false); // State to handle loading spinner

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/createPromoCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setFormData({
          code: '',
          discount: '',
          isPercentage: false,
          expirationDate: '',
          maxUsage: 1,
        });
        fetchPromoCodes(); // Refresh promo codes after creation
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create promo code');
      }
    } catch (err) {
      setError('An error occurred while creating the promo code');
    }
  };

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/getPromoCodes'); // Adjust the endpoint as needed
      if (response.ok) {
        const data = await response.json();
        setPromoCodes(data); // Update the promoCodes state with fetched data
      } else {
        setError('Failed to fetch promo codes');
      }
    } catch (err) {
      setError('An error occurred while fetching promo codes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes(); // Fetch promo codes on component mount
  }, []);

  return (
    <div className="promo-container">
      <h2 className="promo-title">Promo Code Management</h2>

      {/* Create Promo Code Section */}
      <div className="promo-section">
        <h3 className="promo-subtitle">Create Promo Code</h3>
        <form onSubmit={handleSubmit} className="promo-form">
          <div className="form-group">
            <label><FaTag /> Promo Code:</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="Enter promo code"
            />
          </div>
          <div className="form-group">
            <label><MdDiscount /> Discount:</label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              required
              placeholder="Enter discount amount"
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isPercentage"
                checked={formData.isPercentage}
                onChange={handleChange}
              />
              <FaPercentage /> Is Percentage?
            </label>
          </div>
          <div className="form-group">
            <label><FaCalendarAlt /> Expiration Date:</label>
            <input
              type="date"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Maximum Usage:</label>
            <input
              type="number"
              name="maxUsage"
              value={formData.maxUsage}
              onChange={handleChange}
              required
              placeholder="Enter max usage"
            />
          </div>
          <button type="submit" className="btn-submit">
            Create Promo Code
          </button>
        </form>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* View Promo Codes Section */}
      <div className="promo-section">
        <h3 className="promo-subtitle">Available Promo Codes</h3>
        {loading ? (
          <p className="loading-message">Loading...</p>
        ) : promoCodes.length > 0 ? (
          <table className="promo-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Type</th>
                <th>Expiration Date</th>
                <th>Max Usage</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo, index) => (
                <tr key={index}>
                  <td>{promo.code}</td>
                  <td>{promo.discount}</td>
                  <td>{promo.isPercentage ? 'Percentage' : 'Flat'}</td>
                  <td>{new Date(promo.expirationDate).toLocaleDateString()}</td>
                  <td>{promo.maxUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data-message">No promo codes available.</p>
        )}
      </div>
    </div>
  );
};

export default PromoCodeForm;
