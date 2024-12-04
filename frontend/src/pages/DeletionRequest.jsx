import React, { useEffect, useState } from 'react';

const DeletionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:8000/getPendingDeletionRequests');
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/acceptDeletionRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      });
      const result = await response.json();
      alert(result.message);
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch('http://localhost:8000/rejectDeletionRequest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: id }),
      });
      const result = await response.json();
      alert(result.message);
      setRequests(requests.filter(request => request._id !== id));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const styles = {
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0F5132',
      marginBottom: '20px',
    },
    noRequestsMessage: {
      fontSize: '18px',
      color: '#555',
      textAlign: 'center',
    },
    requestsList: {
      listStyleType: 'none',
      padding: 0,
      margin: 0,
    },
    requestItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px',
      borderBottom: '1px solid #ddd',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    requestDetails: {
      flex: '1',
      paddingRight: '20px',
    },
    detail: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '5px',
    },
    buttonsContainer: {
      display: 'flex',
      gap: '10px',
    },
    acceptButton: {
      padding: '10px 15px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    rejectButton: {
      padding: '10px 15px',
      backgroundColor: '#FF4D4D',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  return (
    <div>
      <h2 style={styles.heading}>Pending Account Deletion Requests</h2>
      {requests.length === 0 ? (
        <p style={styles.noRequestsMessage}>No pending requests.</p>
      ) : (
        <ul style={styles.requestsList}>
          {requests.map((request) => (
            <li key={request._id} style={styles.requestItem}>
              <div style={styles.requestDetails}>
                <p style={styles.detail}>
                  <strong>Username:</strong> {request.Username}
                </p>
                <p style={styles.detail}>
                  <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
                </p>
                <p style={styles.detail}>
                  <strong>Status:</strong> {request.status}
                </p>
              </div>
              <div style={styles.buttonsContainer}>
                <button
                  onClick={() => handleAccept(request._id)}
                  style={styles.acceptButton}
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request._id)}
                  style={styles.rejectButton}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeletionRequests;
