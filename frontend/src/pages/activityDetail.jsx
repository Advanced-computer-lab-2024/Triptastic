import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaClock, FaDollarSign, FaLayerGroup, FaArrowLeft } from 'react-icons/fa';

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
      {/* Header Section */}
      <div style={styles.header}>
        <FaArrowLeft
          style={styles.backButton}
          onClick={() => navigate('/activities')}
          title="Back to Activities"
        />
        <h1 style={styles.title}>{activity.name}</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.description}>{activity.description}</p>
        <div style={styles.details}>
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
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F5132',
    padding: '10px',
    borderRadius: '10px',
    color: 'white',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: '20px',
    fontSize: '24px',
    cursor: 'pointer',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  content: {
    marginTop: '20px',
  },
  description: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '20px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#0F5132',
    flex: '1',
  },
  detailValue: {
    color: '#333',
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
