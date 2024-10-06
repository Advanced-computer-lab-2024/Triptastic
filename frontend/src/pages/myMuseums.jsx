import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; 

const MyMuseums = () => {
    const navigate = useNavigate();
  const [museums, setMuseums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedMuseum, setSelectedMuseum] = useState(null); // State for selecting a museum for viewing/editing
  const [viewOnly, setViewOnly] = useState(false); // State to control view vs. edit mode
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: { Foreigner: '', Student: '', Native: '' },
    Tags: { HistoricalPeriod: '' }
  });

  // Fetch museums on component mount
  useEffect(() => {
    const fetchMyMuseums = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyMuseums?TourismGovernor=${tourismGovernor}`);

        if (response.ok) {
          const data = await response.json();
          setMuseums(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch museums.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching museums.');
        console.error(error);
      }
    };

    fetchMyMuseums();
  }, []);

  const handleView = async (name) => {
    setViewOnly(true); // Set view mode
    try {
      const response = await fetch(`http://localhost:8000/getMuseum?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMuseum(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch museum details for viewing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching museum details.');
    }
  };

  const handleEdit = async (name) => {
    setViewOnly(false); // Set edit mode
    try {
      const response = await fetch(`http://localhost:8000/getMuseum?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedMuseum(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch museum details for editing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching museum details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/updateMuseum', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedMuseum = await response.json();
        setMuseums((prevMuseums) =>
          prevMuseums.map((museum) =>
            museum.Name === updatedMuseum.Name ? updatedMuseum : museum
          )
        );
        setSelectedMuseum(null); // Clear form after update
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the museum.');
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:8000/deleteMuseum?Name=${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMuseums((prevMuseums) => prevMuseums.filter((museum) => museum.Name !== name));
      } else {
        setErrorMessage('Failed to delete the museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the museum.');
    }
  };

  return (
    <div>
      <h1>My Museums</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {museums.length === 0 ? (
        <p>No museums found.</p>
      ) : (
        <ul>
          {museums.map((museum) => (
            <li key={museum.Name}>
              <strong>{museum.Name}</strong>: {museum.Description} ({museum.Location})
              <button onClick={() => handleView(museum.Name)}>View</button>
              <button onClick={() => handleEdit(museum.Name)}>Edit</button>
              <button onClick={() => handleDelete(museum.Name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedMuseum && (
        <form onSubmit={handleUpdate}>
          <h2>{viewOnly ? "View Museum" : "Edit Museum"}</h2>
          <label>Name:</label>
          <input
            type="text"
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            disabled
          />
          <label>Description:</label>
          <input
            type="text"
            value={formData.Description}
            onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
            disabled={viewOnly}
          />
          <label>Location:</label>
          <input
            type="text"
            value={formData.Location}
            onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
            disabled={viewOnly}
          />
          <label>Opening Hours:</label>
          <input
            type="text"
            value={formData.OpeningHours}
            onChange={(e) => setFormData({ ...formData, OpeningHours: e.target.value })}
            disabled={viewOnly}
          />
          <label>Ticket Prices:</label>
          <input
            type="text"
            value={formData.TicketPrices.Foreigner}
            placeholder="Foreigner"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Foreigner: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <input
            type="text"
            value={formData.TicketPrices.Student}
            placeholder="Student"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Student: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <input
            type="text"
            value={formData.TicketPrices.Native}
            placeholder="Native"
            onChange={(e) =>
              setFormData({
                ...formData,
                TicketPrices: { ...formData.TicketPrices, Native: e.target.value }
              })
            }
            disabled={viewOnly}
          />
          <label>Tags:</label>
          <input
            type="text"
            value={formData.Tags}
            onChange={(e) => setFormData({ ...formData, Tags:  e.target.value  })}
            disabled={viewOnly}
          />
          {!viewOnly && <button type="submit">Update Museum</button>}
        </form>
      )}
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/gov-museum')}>Create other Museums</li>
        </ul>
      </div>
    </div>
  );
};

export default MyMuseums;
