import React, { useState } from 'react';

const GovernorH = () => {
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
      Types: ''
    },
    image: ''
  });

  const [locations, setLocations] = useState([]); // Stores all historical locations
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Tags: {
        ...prevData.Tags,
        [name]: value
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
      const response = await fetch('http://localhost:8000/createhistoricalLocation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Location "${result.Name}" created successfully!`);
        setLocations((prevLocations) => [...prevLocations, result]); // Add new location to the list

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
            Types: ''
          },
          image: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the historical location.');
      console.error(error);
    }
  };

  const handleGetHistoricalLocation = async (e, name) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/gethistoricalLocation?Name=${name}`, {
        method: 'GET',
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(result);
        setSuccessMessage(`Location "${result.Name}" retrieved successfully!`);
        setViewData(result);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to retrieve historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while retrieving the historical location.');
      console.error(error);
    }
  };

  const handleDeleteHistoricalLocation = async (e, name) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/deletehistoricalLocation?Name=${name}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccessMessage(`Location "${name}" deleted successfully!`);
        setViewData(null);
        setLocations((prevLocations) => prevLocations.filter((loc) => loc.Name !== name)); // Remove location from the list
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the historical location.');
      console.error(error);
    }
  };

  const handleUpdateClick = (e, location) => {
    e.preventDefault();
    setIsUpdating(true); // Set update mode to true
    setFormData(location); // Pre-fill the form with the data of the location to update
    setSuccessMessage(`Editing location "${location.Name}"`);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/updatehistoricalLocation`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedLocation = await response.json();
        setSuccessMessage(`Location "${updatedLocation.Name}" updated successfully!`);
        setLocations((prevLocations) =>
          prevLocations.map((loc) => (loc.Name === updatedLocation.Name ? updatedLocation : loc))
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
            Types: ''
          },
          image: ''
        });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the historical location.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Historical Location Form</h1>

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
          <label>Tags (Type):</label>
          <select
            name="Types"
            value={formData.Tags.Types}
            onChange={handleTagsChange}
            required
          >
            <option value="">Select a type</option>
            <option value="Monuments">Monuments</option>
            <option value="Religious Sites">Religious Sites</option>
            <option value="Palaces">Palaces</option>
            <option value="Castles">Castles</option>
          </select>
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
          {isUpdating ? 'Update Location' : 'Create Location'}
        </button>
      </form>

      <div>
        <h2>All Historical Locations</h2>
        {locations.length > 0 ? (
          locations.map((location) => (
            <div key={location.Name}>
              <h3>{location.Name}</h3>
              <button onClick={(e) => handleGetHistoricalLocation(e, location.Name)}>View</button>
              <button onClick={(e) => handleUpdateClick(e, location)}>Update</button>
              <button onClick={(e) => handleDeleteHistoricalLocation(e, location.Name)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No historical locations found.</p>
        )}
      </div>

      {viewData && (
        <div>
          <h2>Viewing Historical Location: {viewData.Name}</h2>
          <p><b>Description:</b> {viewData.Description}</p>
          <p><b>Location:</b> {viewData.Location}</p>
          <p><b>Opening Hours:</b> {viewData.OpeningHours}</p>
          <p><b>Ticket Prices:</b></p>
          <p><b>Foreigner:</b> {viewData.TicketPrices.Foreigner}</p>
          <p><b>Student:</b> {viewData.TicketPrices.Student}</p>
          <p><b>Native:</b> {viewData.TicketPrices.Native}</p>
          <p><b>Tags (Type):</b> {viewData.Tags.Types}</p>
          <p><b>Image URL:</b> {viewData.image}</p>
        </div>
      )}
    </div>
  );
};

export default GovernorH;
