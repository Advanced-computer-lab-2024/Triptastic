import React, { useState } from 'react';

const GovernorM = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Description: '',
    Location: '',
    OpeningHours: '',
    TicketPrices: {
      Foreigner: '',
      Student: '',
      Native: ''
    },
    Tags: {
      HistoricalPeriod: ''
    },
    image: ''
  });

  const [locations, setLocations] = useState([]); // Stores all museums
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [viewData, setViewData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); // Tracks whether we are in update mode

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Tags: {
        ...prevData.Tags,
        HistoricalPeriod: value // Update only the HistoricalPeriod field inside Tags
      }
    }));
  };

  const handleTicketPricesChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      TicketPrices: {
        ...prevData.TicketPrices,
        [name]: value
      }
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/createmuseum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Museum "${result.Name}" created successfully!`);
        setLocations((prevLocations) => [...prevLocations, result]); // Add new museum to the list

        // Reset form after successful creation
        setFormData({
          Name: '',
          Description: '',
          Location: '',
          OpeningHours: '',
          TicketPrices: {
            Foreigner: '',
            Student: '',
            Native: ''
          },
          Tags: {
            HistoricalPeriod: ''
          },
          image: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the museum.');
      console.error(error);
    }
  };

  const handleGetMuseum = async (e, name) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/getmuseum?Name=${name}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(result);
        setSuccessMessage(`Museum "${result.Name}" retrieved successfully!`);
        setViewData(result);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to retrieve museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while retrieving the museum.');
      console.error(error);
    }
  };

  const handleDeleteMuseum = async (e, name) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/deletemuseum?Name=${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(`Museum "${name}" deleted successfully!`);
        setViewData(null);
        setLocations((prevLocations) => prevLocations.filter((loc) => loc.Name !== name)); // Remove museum from the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the museum.');
      console.error(error);
    }
  };

  const handleUpdateClick = (e, location) => {
    e.preventDefault();
    setIsUpdating(true); // Set update mode to true
    setFormData(location); // Pre-fill the form with the data of the museum to update
    setSuccessMessage(`Editing museum "${location.Name}"`);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/updatemuseum`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedMuseum = await response.json();
        setSuccessMessage(`Museum "${updatedMuseum.Name}" updated successfully!`);
        setLocations((prevLocations) =>
          prevLocations.map((loc) => (loc.Name === updatedMuseum.Name ? updatedMuseum : loc))
        );
        setIsUpdating(false); // Exit update mode
        setFormData({
          Name: '',
          Description: '',
          Location: '',
          OpeningHours: '',
          TicketPrices: {
            Foreigner: '',
            Student: '',
            Native: ''
          },
          Tags: {
            HistoricalPeriod: ''
          },
          image: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update museum.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the museum.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Museum Form</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={isUpdating ? handleUpdate : handleCreate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            required
            disabled={isUpdating} // Disable name field during update
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            name="Description"
            value={formData.Description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="Location"
            value={formData.Location}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Opening Hours:</label>
          <input
            type="text"
            name="OpeningHours"
            value={formData.OpeningHours}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Ticket Prices:</label>
          <div>
            <label><b>Foreigner:</b></label>
            <input
              type="number"
              name="Foreigner"
              value={formData.TicketPrices.Foreigner}
              onChange={handleTicketPricesChange}
              required
            />
          </div>
          <div>
            <label><b>Student:</b></label>
            <input
              type="number"
              name="Student"
              value={formData.TicketPrices.Student}
              onChange={handleTicketPricesChange}
              required
            />
          </div>
          <div>
            <label><b>Native:</b></label>
            <input
              type="number"
              name="Native"
              value={formData.TicketPrices.Native}
              onChange={handleTicketPricesChange}
              required
            />
          </div>
        </div>

        <div>
          <label>Tags (HistoricalPeriod):</label>
          <input
            type="text"
            name="HistoricalPeriod"
            value={formData.Tags.HistoricalPeriod}
            onChange={handleTagsChange}
            required
          />
        </div>

        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit">
          {isUpdating ? 'Update Museum' : 'Create Museum'}
        </button>
      </form>

      <div>
        <h2>All Museums</h2>
        {locations.length > 0 ? (
          locations.map((location) => (
            <div key={location.Name}>
              <h3>{location.Name}</h3>
              <button onClick={(e) => handleGetMuseum(e, location.Name)}>View</button>
              <button onClick={(e) => handleUpdateClick(e, location)}>Update</button>
              <button onClick={(e) => handleDeleteMuseum(e, location.Name)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No museums available.</p>
        )}
      </div>

      {viewData && (
        <div>
          <h2>Museum Details</h2>
          <p><b>Name:</b> {viewData.Name}</p>
          <p><b>Description:</b> {viewData.Description}</p>
          <p><b>Location:</b> {viewData.Location}</p>
          <p><b>Opening Hours:</b> {viewData.OpeningHours}</p>
          <p><b>Ticket Prices:</b> {`Foreigner: ${viewData.TicketPrices.Foreigner}, Student: ${viewData.TicketPrices.Student}, Native: ${viewData.TicketPrices.Native}`}</p>
          <p><b>Tags (HistoricalPeriod):</b> {viewData.Tags.HistoricalPeriod}</p>
          <p><b>Image:</b> {viewData.image}</p>
        </div>
      )}
    </div>
  );
};

export default GovernorM;
