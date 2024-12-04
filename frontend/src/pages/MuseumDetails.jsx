import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaMapMarkerAlt, FaClock, FaUserTie, FaTag, FaTicketAlt, FaArrowLeft } from 'react-icons/fa';
import romanImage from '../images/roman.jpg';
import museumHistoryImage from '../images/museumhistory.jpg';
import museummImage from '../images/museumm.jpg';
import buckinghamImage from '../images/buckingham.jpg';
import fasImage from '../images/fas.jpg';
import pyramidsImage from '../images/pyramids.jpg';

const MuseumDetail = () => {
  const { Name } = useParams();
  const navigate = useNavigate(); // Initialize navigate for navigation
  const [museum, setMuseum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchMuseum = async () => {
      try {
        const response = await fetch(`http://localhost:8000/getMuseumDetails/${encodeURIComponent(Name)}`);
        if (!response.ok) {
          throw new Error('Museum not found');
        }
        const data = await response.json();
        setMuseum(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMuseum();
  }, [Name]);

  if (loading) return <p style={styles.loading}>Loading museum details...</p>;
  if (errorMessage) return <p style={styles.error}>{errorMessage}</p>;
  if (!museum) return <p style={styles.noMuseum}>No museum found.</p>;

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
  <FaArrowLeft
    style={styles.backButton}
    onClick={() => navigate('/museums')} // Navigate back to Museums page
    title="Back to Museums"
  />
  <h1 style={styles.title}>{museum.Name}</h1>
</div>


      <div style={styles.imageContainer}>
        {museum.image && (
          <img
            src={
              museum.Name === "Roman Museum"
                ? romanImage
                : museum.Name === "National Museum of History"
                ? museumHistoryImage
                : museum.Name === "museum"
                ? museummImage
                : museum.Name === "buckingham palace"
                ? buckinghamImage
                : museum.Name === "fas"
                ? fasImage
                : museum.Name === "pyramids"
                ? pyramidsImage
                : museum.mainImage || "defaultFallbackImage.jpg"
            }
            alt={museum.Name}
            style={styles.image}
          />
        )}
      </div>

      <div style={styles.content}>
        <p style={styles.description}>{museum.Description}</p>

        <div style={styles.details}>
          <div style={styles.detailItem}>
            <FaMapMarkerAlt style={styles.icon} />
            <span style={styles.detailLabel}>Location:</span>
            <span style={styles.detailValue}>{museum.Location}</span>
          </div>
          <div style={styles.detailItem}>
            <FaClock style={styles.icon} />
            <span style={styles.detailLabel}>Opening Hours:</span>
            <span style={styles.detailValue}>{museum.OpeningHours}</span>
          </div>
          <div style={styles.detailItem}>
            <FaUserTie style={styles.icon} />
            <span style={styles.detailLabel}>Tourism Governor:</span>
            <span style={styles.detailValue}>{museum.TourismGovernor}</span>
          </div>
        </div>

        {/* Divider Line */}
        <hr style={styles.divider} />

        <div style={styles.ticketPrices}>
          <h3 style={styles.sectionTitle}>
            <FaTicketAlt style={styles.sectionIcon} /> Ticket Prices
          </h3>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Foreigner:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Foreigner}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Native:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Native}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Student:</span>
            <span style={styles.detailValue}>${museum.TicketPrices?.Student}</span>
          </div>
        </div>

        {/* Divider Line */}
        <hr style={styles.divider} />

        <div style={styles.tags}>
          <h3 style={styles.sectionTitle}>
            <FaTag style={styles.sectionIcon} /> Tags
          </h3>
          <p style={styles.detail}>
            <span style={styles.detailLabel}>Historical Period:</span> {museum.Tags?.HistoricalPeriod || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '750px',
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
    justifyContent: 'center', // Center content in the header
    marginBottom: '15px',
    padding: '8px 0',
    backgroundColor: '#0F5132',
    color: 'white',
    borderRadius: '10px',
    width: '100%',
    position: 'relative', // Required for absolute positioning of the back button
  },
  backButton: {
    position: 'absolute',
    left: '20px', // Position the button to the left of the header
    fontSize: '24px',
    color: 'white',
    cursor: 'pointer',
  },
  title: {
    fontSize: '22px',
    fontWeight: 'bold',
    margin: '0',
    textAlign: 'center',
    flexGrow: 1, // Ensures the title stays centered
  },
  imageContainer: {
    width: '100%',
    textAlign: 'center',
    marginBottom: '15px',
  },
  image: {
    width: '70%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
  },
  content: {
    textAlign: 'left',
    width: '100%',
  },
  description: {
    fontSize: '14px',
    color: '#333',
    lineHeight: '1.4',
    marginBottom: '15px',
  },
  details: {
    marginBottom: '15px',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    color: '#333',
  },
  icon: {
    fontSize: '18px',
    color: '#0F5132',
  },
  ticketPrices: {
    marginBottom: '15px',
  },
  tags: {
    marginBottom: '15px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sectionIcon: {
    fontSize: '18px',
    color: '#0F5132',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #ddd',
    margin: '20px 0',
  },
  loading: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#555',
    marginTop: '15px',
  },
  error: {
    textAlign: 'center',
    fontSize: '16px',
    color: 'red',
    marginTop: '15px',
  },
  noMuseum: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#888',
    marginTop: '15px',
  },
};

export default MuseumDetail;
