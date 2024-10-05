import React, { useState } from 'react';

const HistoricalLocationForm = () => {
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

  const [isUpdate, setIsUpdate] = useState(false); // Track whether you're updating or creating
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form input change for simple fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle nested Tags object change
  const handleTagsChange = (e) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      Tags: {
        Types: value
      }
    }));
  };

  // Handle nested TicketPrices object change
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

  // Handle form submission for creation
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
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the historical location.');
      console.error(error);
    }
  };

  // Handle form submission for update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/updatehistoricalLocation`, {
        method: 'PATCH', // or PATCH
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Location "${result.Name}" updated successfully!`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update historical location.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the historical location.');
      console.error(error);
    }
  };

  // Function to toggle between Create and Update mode
  const toggleUpdateMode = () => {
    if (!isUpdate && formData.Name.trim() === '') {
      setErrorMessage('Please enter a name before switching to update mode.');
      return;
    }
    setIsUpdate(!isUpdate);
  };

  return (
    <div>
      <h1>{isUpdate ? 'Update Historical Location' : 'Create Historical Location'}</h1>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={isUpdate ? handleUpdate : handleCreate}>
        <div>
          <label>Name (Required for Update):</label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleInputChange}
            required={isUpdate} // Required only when updating
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
          <label style={{ fontWeight: 'bold' }}>Ticket Prices:</label>
          <div>
            <label>Foreigner:</label>
            <input
              type="number"
              name="Foreigner"
              value={formData.TicketPrices.Foreigner}
              onChange={handleTicketPricesChange}
            />
          </div>
          <div>
            <label>Student:</label>
            <input
              type="number"
              name="Student"
              value={formData.TicketPrices.Student}
              onChange={handleTicketPricesChange}
            />
          </div>
          <div>
            <label>Native:</label>
            <input
              type="number"
              name="Native"
              value={formData.TicketPrices.Native}
              onChange={handleTicketPricesChange}
            />
          </div>
        </div>

        <div>
          <label>Tags (Type):</label>
          <select
            name="Types"
            value={formData.Tags.Types}
            onChange={handleTagsChange}
          >
            <option value="">Select Type</option>
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
          {isUpdate ? 'Update Location' : 'Create Location'}
        </button>
      </form>

      {/* Button to toggle between create and update */}
      <button onClick={toggleUpdateMode}>
        {isUpdate ? 'Switch to Create' : 'Switch to Update'}
      </button>
    </div>
  );
};

export default HistoricalLocationForm;
