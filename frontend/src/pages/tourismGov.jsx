import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

    const TourismGov = () => {
      const [formData, setFormData] = useState({
        Name: '',
        Description: '',
        Location: '',
        OpeningHours: '',
        image: '',
        Tags: {
          Types: '',
        },
        TicketPrices: {
          foreigner: '',
          student: '',
          native: ''
        }
      });
    
      const [errorMessage, setErrorMessage] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
      const navigate = useNavigate();

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };
    
      const handleTagChange = (e) => {
        setFormData((prevData) => ({
          ...prevData,
          Tags: { ...prevData.Tags, Types: e.target.value }
        }));
      };
    
      const handleTicketPriceChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          TicketPrices: { ...prevData.TicketPrices, [name]: value }
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:8000/createhistoricalLocation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (response.ok) {
            const result = await response.json();
            setSuccessMessage('Historical Location created successfully!');
            setFormData({
              Name: '',
              Description: '',
              Location: '',
              OpeningHours: '',
              image: '',
              Tags: {
                Types: '',
              },
              TicketPrices: {
                foreigner: '',
                student: '',
                native: ''
              }
            });
          } else {
            const errorData = await response.json();
            setErrorMessage(errorData.error || 'Failed to create location.');
          }
        } catch (error) {
          setErrorMessage('An error occurred while creating the location.');
        }
      };
    
      return (
        <div>
          <h2>Create Historical Location</h2>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name:</label>
              <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
            </div>
    
            <div>
              <label>Description:</label>
              <input type="text" name="Description" value={formData.Description} onChange={handleChange} required />
            </div>
    
            <div>
              <label>Location:</label>
              <input type="text" name="Location" value={formData.Location} onChange={handleChange} required />
            </div>
    
            <div>
              <label>Opening Hours:</label>
              <input type="text" name="OpeningHours" value={formData.OpeningHours} onChange={handleChange} required />
            </div>
    
            <div>
              <label>Image URL:</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} required />
            </div>
    
            <div>
              <label>Tag Type:</label>
              <select name="Tags.Types" value={formData.Tags.Types} onChange={handleTagChange} required>
                <option value="">Select...</option>
                <option value="Monuments">Monuments</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Palaces">Palaces</option>
                <option value="Castles">Castles</option>
              </select>
            </div>
    
            <div>
              <h3>Ticket Prices</h3>
              <label>Foreigner:</label>
              <input type="number" name="foreigner" value={formData.TicketPrices.foreigner} onChange={handleTicketPriceChange} required />
              
              <label>Student:</label>
              <input type="number" name="student" value={formData.TicketPrices.student} onChange={handleTicketPriceChange} required />
    
              <label>Native:</label>
              <input type="number" name="native" value={formData.TicketPrices.native} onChange={handleTicketPriceChange} required />
            </div>
    
            <button type="submit">Create Historical Location</button>
          </form>

          {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/historical-locations')}>Historical Locations</li>
          <li onClick={() => navigate('/museums')}>Museums</li>
          <li onClick={() => navigate('/activities')}>Activities</li>
          <li onClick={() => navigate('/itineraries')}>Itineraries</li>
        </ul>
      </div>

        </div>
      );
    };
    
   
    

export default TourismGov;