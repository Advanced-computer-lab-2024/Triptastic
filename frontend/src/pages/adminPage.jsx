import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: ''
  });

  const [usernameToDelete, setUsernameToDelete] = useState(''); // State for username to delete
  const [userType, setUserType] = useState(''); // State for user type to delete
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to create a new admin
  const createAdmin = async () => {
    const { Username, Password } = formData; // Get username and password from state
    setLoading(true);
    setErrorMessage(''); // Clear previous error messages

    try {
      // Call your existing function to create an admin
      const response = await fetch('http://localhost:8000/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Password }) // Send username and password
      });

      if (response.ok) {
        // If creation is successful, show an alert
        alert('Admin created successfully!');
        // Optionally, you can reset the form here
        setFormData({ Username: '', Password: '' }); // Reset the form fields
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create admin.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating admin.');
      console.error(error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // Function to handle deletion based on user type
  const handleDeleteUser = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!usernameToDelete) {
      setErrorMessage('Please enter a username to delete.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/delete${userType}?Username=${usernameToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.msg);
        setUsernameToDelete(''); // Clear input after successful deletion
        setUserType(''); // Reset the user type
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || `Failed to delete ${userType}.`);
      }
    } catch (error) {
      setErrorMessage(`An error occurred while deleting the ${userType}.`);
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard! Here you can manage users and view statistics.</p>

      <h2>Create Admin</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <form onSubmit={(e) => { e.preventDefault(); createAdmin(); }}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={formData.Username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Admin'}
        </button>
      </form>

      <h2>Delete User</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <div>
        <label>Select User Type:</label>
        <select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="">Select...</option>
          <option value="Advertiser">Advertiser</option>
          <option value="Seller">Seller</option>
          <option value="TourGuide">Tour Guide</option>
          <option value="Tourist">Tourist</option>
          <option value="TourismGov">Tourism Governor</option>
        </select>
      </div>

      {userType && (
        <div>
          <input
            type="text"
            placeholder="Enter Username to delete"
            value={usernameToDelete}
            onChange={(e) => setUsernameToDelete(e.target.value)}
            required
          />
          <button onClick={handleDeleteUser}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
