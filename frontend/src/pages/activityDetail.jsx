import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaDollarSign, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';
import defaultBackground from '../images/activity2.jpg'; // Replace with the actual path of the image

const ActivityDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getActivityToShare/${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error('Activity not found');
        }
        const data = await response.json();
        setActivity(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [name]);

  if (loading) return <p style={styles.loading}>Loading activity details...</p>;
  if (errorMessage) return <p style={styles.error}>{errorMessage}</p>;
  if (!activity) return <p style={styles.noActivity}>No activity found.</p>;

  return (
    <div style={styles.container}>
      {/* Hero Section with Background */}
      <div style={styles.hero}>
        <FaArrowLeft
          style={styles.backButton}
          onClick={() => navigate('/activities')}
          title="Back to Activities"
        />
        <h1 style={styles.heroTitle}>{activity.name}</h1>
      </div>

      {/* Content Section */}
      <div style={styles.content}>
        <div style={styles.details}>
          <p style={styles.description}>{activity.description}</p>

          <div style={styles.detailItem}>
            <FaDollarSign style={styles.icon} />
            <span style={styles.detailLabel}>Price:</span>
            <span style={styles.detailValue}>${activity.price}</span>
          </div>
          <div style={styles.detailItem}>
            <FaClock style={styles.icon} />
            <span style={styles.detailLabel}>Duration:</span>
            <span style={styles.detailValue}>{activity.duration} hours</span>
          </div>
          <div style={styles.detailItem}>
            <FaLayerGroup style={styles.icon} />
            <span style={styles.detailLabel}>Category:</span>
            <span style={styles.detailValue}>{activity.Category}</span>
          </div>
          <div style={styles.detailItem}>
            <FaCalendarAlt style={styles.icon} />
            <span style={styles.detailLabel}>Date:</span>
            <span style={styles.detailValue}>{new Date(activity.date).toLocaleDateString()}</span>
          </div>
          <div style={styles.detailItem}>
            <FaMapMarkerAlt style={styles.icon} />
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{activity.location}</span>
          </div>
          <div style={styles.detailItem}>
            <FaTag style={styles.icon} />
            <span style={styles.detailLabel}>Tags:</span>
            <span style={styles.detailValue}>{activity.tags ? activity.tags.join(', ') : 'No tags available'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    position: 'relative',
  },
  hero: {
    position: 'relative',
    backgroundImage: `url(${defaultBackground})`, // Default background image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    top: '20px',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'white',
  },
  heroTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  description: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#333',
    flex: '1',
  },
  detailValue: {
    color: '#555',
    flex: '2',
  },
  icon: {
    fontSize: '20px',
    color: '#0F5132',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
  },
  noActivity: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#888',
  },
};

export default ActivityDetail;
