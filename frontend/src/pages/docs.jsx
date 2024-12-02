import React, { useState, useEffect } from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


const Docs = () => {
  const [activeSection, setActiveSection] = useState('');
  const [sellers, setSellers] = useState([]);
  const [tourGuides, setTourGuides] = useState([]);
  const [advertisers, setAdvertisers] = useState([]);
  const [viewingDocsId, setViewingDocsId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation


  const fetchData = async (endpoint, setter, errorMsg) => {
    try {
      const response = await fetch(`http://localhost:8000/${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setter(data);
        setErrorMessage('');
      } else {
        throw new Error(errorMsg);
      }
    } catch (error) {
      setErrorMessage(errorMsg);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData('getPendingSellers', setSellers, 'Failed to fetch sellers');
    fetchData('getPendingTourGuides', setTourGuides, 'Failed to fetch tour guides');
    fetchData('getPendingAdvertisers', setAdvertisers, 'Failed to fetch advertisers');
  }, []);

  const handleAction = async (endpoint, username, action, refresh) => {
    try {
      const response = await fetch(`http://localhost:8000/${endpoint}?Username=${username}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docsApproved: action }),
      });

      if (response.ok) {
        alert(`${username} ${action === 'accepted' ? 'approved' : 'rejected'}`);
        refresh();
      } else {
        throw new Error('Action failed');
      }
    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} ${username}:`, error);
    }
  };

  const renderDocs = (docs) =>
    docs.map((doc, index) => (
      <img
        key={index}
        src={`http://localhost:8000/${doc.replace(/\\/g, '/')}`}
        alt={`Document ${index + 1}`}
        style={{
          width: '300px',
          height: '200px',
          margin: '10px',
          borderRadius: '8px',
          border: '1px solid #ccc',
        }}
      />
    ));

  const Section = ({ title, items, itemType, refresh }) => (
    <div style={{ marginBottom: '40px' }}>
      <h2 style={{ color: '#0F5132', marginBottom: '20px', fontSize: '1.5em', borderBottom: '2px solid #ddd', paddingBottom: '5px' }}>
        {title}
      </h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item) => (
          <li
            key={item._id}
            style={{
              background: '#f9f9f9',
              margin: '20px 0',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            }}
          >
            <p><strong>Name:</strong> {item.Name || 'N/A'}</p>
            <p><strong>Username:</strong> {item.Username}</p>
            <p><strong>Email:</strong> {item.Email || 'N/A'}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                onClick={() => setViewingDocsId(viewingDocsId === item._id ? null : item._id)}
                style={{
                  backgroundColor: viewingDocsId === item._id ? '#0F5132' : '#0F5132',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                {viewingDocsId === item._id ? 'Hide Docs' : 'View Docs'}
              </button>
              <button
                onClick={() =>
                  handleAction(
                    `settleDocs${itemType}`,
                    item.Username,
                    'accepted',
                    refresh
                  )
                }
                style={{
                  backgroundColor: '#0F5132',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  marginRight: '10px',
                  cursor: 'pointer',
                }}
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleAction(
                    `settleDocs${itemType}`,
                    item.Username,
                    'rejected',
                    refresh
                  )
                }
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Reject
              </button>
            </div>
            {viewingDocsId === item._id && (
              <div style={{ marginTop: '20px' }}>
                {renderDocs([item.Id, item.TaxationRegistryCard || item.Certificate])}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

{/* Header */}
<header
  style={{
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '30px',
    display: 'flex', // Use flexbox
    alignItems: 'center', // Vertically align items
    justifyContent: 'space-between', // Distribute space
  }}
>
  <FaArrowLeft
    onClick={() => navigate('/adminPage')}
    style={{
      cursor: 'pointer',
      fontSize: '24px',
      color: '#FFF', // Match your theme
    }}
  />

  <h1 style={{ margin: 0, fontSize: '2em', textAlign: 'center', flex: 1 }}>
    Document Approval Dashboard
  </h1>
</header>


      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveSection('sellers')}
          style={{
            backgroundColor: activeSection === 'sellers' ? '#0F5132' : '#0F5132',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '0 10px',
            cursor: 'pointer',
          }}
        >
          View Sellers
        </button>
        <button
          onClick={() => setActiveSection('tourGuides')}
          style={{
            backgroundColor: activeSection === 'tourGuides' ? '#0F5132' : '#0F5132',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '0 10px',
            cursor: 'pointer',
          }}
        >
          View Tour Guides
        </button>
        <button
          onClick={() => setActiveSection('advertisers')}
          style={{
            backgroundColor: activeSection === 'advertisers' ? '#0F5132' : '#0F5132',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '0 10px',
            cursor: 'pointer',
          }}
        >
          View Advertisers
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && <p style={{ color: '#dc3545', textAlign: 'center' }}>{errorMessage}</p>}

      {/* Sections */}
      {activeSection === 'sellers' && (
        <Section
          title="Pending Sellers"
          items={sellers}
          itemType="Seller"
          refresh={() => fetchData('getPendingSellers', setSellers, 'Failed to fetch sellers')}
        />
      )}
      {activeSection === 'tourGuides' && (
        <Section
          title="Pending Tour Guides"
          items={tourGuides}
          itemType="TourGuide"
          refresh={() => fetchData('getPendingTourGuides', setTourGuides, 'Failed to fetch tour guides')}
        />
      )}
      {activeSection === 'advertisers' && (
        <Section
          title="Pending Advertisers"
          items={advertisers}
          itemType="Advertiser"
          refresh={() => fetchData('getPendingAdvertisers', setAdvertisers, 'Failed to fetch advertisers')}
        />
      )}
    </div>
  );
};

export default Docs;
