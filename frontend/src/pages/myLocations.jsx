import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const MyLocations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null); // State for selecting a location for viewing/editing
  const [viewOnly, setViewOnly] = useState(false); // State to control view vs. edit mode
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: { Foreigner: '', Student: '', Native: '' },
    Tags: { Types: '' }
  });

  // Fetch locations on component mount
  useEffect(() => {
    const fetchMyLocations = async () => {
      const tourismGovernor = localStorage.getItem('Username'); // Get Tourism Governor from local storage

      try {
        const response = await fetch(`http://localhost:8000/viewMyLocations?TourismGovernor=${tourismGovernor}`);

        if (response.ok) {
          const data = await response.json();
          setLocations(data);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error || 'Failed to fetch locations.');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching locations.');
        console.error(error);
      }
    };

    fetchMyLocations();
  }, []);

  const handleView = async (name) => {
    setViewOnly(true); // Set view mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for viewing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleEdit = async (name) => {
    setViewOnly(false); // Set edit mode
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedLocation(data);
        setFormData({
          Name: data.Name,
          Description: data.Description,
          Location: data.Location,
          OpeningHours: data.OpeningHours,
          TicketPrices: data.TicketPrices,
          Tags: data.Tags
        });
      } else {
        setErrorMessage('Failed to fetch location details for editing.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching location details.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/updatehistoricalLocation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setLocations((prevLocations) =>
          prevLocations.map((location) =>
            location.Name === updatedLocation.Name ? updatedLocation : location
          )
        );
        setSelectedLocation(null); // Clear form after update
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the location.');
    }
  };

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`http://localhost:8000/deletehistoricalLocation?Name=${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setLocations((prevLocations) => prevLocations.filter((location) => location.Name !== name));
      } else {
        setErrorMessage('Failed to delete the location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the location.');
    }
  };

  return (
    <div>
      <h1>My Historical Locations</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {locations.length === 0 ? (
        <p>No locations found.</p>
      ) : (
        <ul>
          {locations.map((location) => (
            <li key={location.Name}>
              <strong>{location.Name}</strong>: {location.Description} ({location.Location})
              <button onClick={() => handleView(location.Name)}>View</button>
              <button onClick={() => handleEdit(location.Name)}>Edit</button>
              <button onClick={() => handleDelete(location.Name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}

      {selectedLocation && (
        <form onSubmit={handleUpdate}>
          <h2>{viewOnly ? "View Historical Location" : "Edit Historical Location"}</h2>
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
            value={formData.Tags.Types}
            onChange={(e) => setFormData({ ...formData, Tags: { Types: e.target.value } })}
            disabled={viewOnly}
          />
          {!viewOnly && <button type="submit">Update Location</button>}
        </form>
      )}

      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/gov-historical')}>Create other Historical Locations</li>
        </ul>
      </div>
    </div>
  );
};

export default MyLocations;
