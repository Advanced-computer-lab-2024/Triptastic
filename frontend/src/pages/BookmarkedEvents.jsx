import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const BookmarkedEvents = () => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/getBookmarkedEvents', {
          params: { Username: localStorage.getItem('Username') },
        });
        setBookmarkedEvents(response.data.bookmarkedEvents);
      } catch (error) {
        console.error('Error fetching bookmarked events:', error);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  const handleRemoveBookmark = async (eventId) => {
    try {
      await axios.post(
        'http://localhost:8000/removeBookmark',
        { eventId },
        { params: { Username: localStorage.getItem('Username') } }
      );

      // Update the UI by removing the unbookmarked event
      setBookmarkedEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error('Error removing bookmark:', error);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  const handleProfileRedirect = () => {
    const context = localStorage.getItem('context');

    if (context === 'tourist') {
      navigate('/tourist-profile');
    } else if (context === 'guest') {
      navigate('/Guest');
    } else {
      console.error('Unknown context');
      navigate('/'); // Fallback to home
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h2 style={styles.title}>Bookmarked Events</h2>
        <FaUserCircle style={styles.profileIcon} onClick={handleProfileRedirect} />
      </header>

      {/* Bookmarked Events */}
      <div style={styles.content}>
      
        {bookmarkedEvents.length > 0 ? (
          bookmarkedEvents.map((event) => (
            <div key={event._id} style={styles.eventCard}>
              <h3 style={styles.eventTitle}>{event.name}</h3>
              <p style={styles.eventDescription}>{event.description}</p>
              <p style={styles.eventDetails}>
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p style={styles.eventDetails}>
                <strong>Location:</strong> {event.location}
              </p>
              {/* Remove Bookmark Button */}
              <button
                style={styles.removeBookmarkButton}
                onClick={() => handleRemoveBookmark(event._id)}
              >
                Remove Bookmark
              </button>
            </div>
          ))
        ) : (
          <p style={styles.noEvents}>You have no bookmarked events.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: '#0F5132',
    padding: '10px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    height: '70px',
    width: '80px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '24px',
    color: 'white',
  },
  content: {
    marginTop: '20px',
  },
  pageTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  eventTitle: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#0F5132',
  },
  eventDescription: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#555',
  },
  eventDetails: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  removeBookmarkButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#FF4D4D', // Red color for removing
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease',
  },
  noEvents: {
    fontSize: '18px',
    color: '#777',
    textAlign: 'center',
    marginTop: '20px',
  },
};

export default BookmarkedEvents;











 