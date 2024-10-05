import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: ''
  });

  const [categoryName, setCategoryName] = useState('');
  const [usernameToDelete, setUsernameToDelete] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productFormData, setProductFormData] = useState({
    productName: '',
    description: '',
    price: '',
    rating: '',
    seller: '', // This will be auto-filled with the admin's username
    review: '',
    stock: '',
    image: ''
  });
  
  // State for Tourism Governor
  const [tourismGovData, setTourismGovData] = useState({
    Username: '',
    Password: ''
  });

  const navigate = useNavigate();

  // Handle input changes for admin creation form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to create a new admin
  const createAdmin = async () => {
    const { Username, Password } = formData;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Password })
      });

      if (response.ok) {
        alert('Admin created successfully!');
        setFormData({ Username: '', Password: '' });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create admin.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating admin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion based on user type
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
        setUsernameToDelete('');
        setUserType('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || `Failed to delete ${userType}.`);
      }
    } catch (error) {
      setErrorMessage(`An error occurred while deleting the ${userType}.`);
      console.error(error);
    }
  };

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to auto-fill seller field with admin's username
  const handleAddProduct = () => {
    setProductFormData((prevData) => ({
      ...prevData,
      seller: formData.Username // Use the admin's username for the seller field
    }));
    setAddingProduct(true);
  };

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Ensure the seller field is set to the admin's username
    const productData = {
      ...productFormData,
      seller: formData.Username // Explicitly set the seller field to the admin's username
    };

    try {
      const response = await fetch('http://localhost:8000/createProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData), // Use updated productData here
      });

      if (response.ok) {
        const newProduct = await response.json();
        alert('Product added successfully!');
        setProductFormData({
          productName: '',
          description: '',
          price: '',
          rating: '',
          seller: formData.Username, // Reset to admin's username
          review: '',
          stock: '',
          image: ''
        });
        setErrorMessage('');
        setAddingProduct(false);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the product');
      console.error(error);
    }
  };

  // Function to create a new category
  const createCategory = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name: categoryName }) // Send category name
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Category "${data.Name}" created successfully!`);
        setCategoryName(''); // Clear the input field
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to create category.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to add a Tourism Governor
  const addTourismGov = async (e) => {
    e.preventDefault();
    const { Username, Password } = tourismGovData;

    try {
      const response = await fetch('http://localhost:8000/addTourismGov', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Password })
      });

      if (response.ok) {
        alert('Tourism Governor added successfully!');
        setTourismGovData({ Username: '', Password: '' }); // Clear the form
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to add Tourism Governor.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the Tourism Governor.');
      console.error(error);
    }
  };

  // Handle input changes for Tourism Governor form
  const handleTourismGovChange = (e) => {
    const { name, value } = e.target;
    setTourismGovData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Admin Page</h1>

      {/* Create Admin Form */}
      <h2>Create Admin</h2>
      <form onSubmit={createAdmin}>
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
        <button type="submit" disabled={loading}>Create Admin</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>

      {/* Add Tourism Governor */}
      <h2>Add Tourism Governor</h2>
      <form onSubmit={addTourismGov}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="Username"
            value={tourismGovData.Username}
            onChange={handleTourismGovChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="Password"
            value={tourismGovData.Password}
            onChange={handleTourismGovChange}
            required
          />
        </div>
        <button type="submit">Add Tourism Governor</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>

      {/* Add Product Form */}
      <h2>Add Product</h2>
      {addingProduct && (
        <form onSubmit={handleProductSubmit}>
          <div>
            <label>Product Name:</label>
            <input
              type="text"
              name="productName"
              value={productFormData.productName}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={productFormData.description}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={productFormData.price}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label>Rating:</label>
            <input
              type="number"
              name="rating"
              value={productFormData.rating}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label>Review:</label>
            <input
              type="text"
              name="review"
              value={productFormData.review}
              onChange={handleProductInputChange}
            />
          </div>
          <div>
            <label>Stock:</label>
            <input
              type="number"
              name="stock"
              value={productFormData.stock}
              onChange={handleProductInputChange}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={productFormData.image}
              onChange={handleProductInputChange}
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      )}
      <button onClick={handleAddProduct}>Prepare to Add Product</button>

      {/* Create Category */}
      <h2>Create Category</h2>
      <form onSubmit={createCategory}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Create Category</button>
      </form>

      {/* Delete User */}
      <h2>Delete User</h2>
      <div>
        <input
          type="text"
          value={usernameToDelete}
          onChange={(e) => setUsernameToDelete(e.target.value)}
          placeholder="Username to delete"
        />
        <select onChange={(e) => setUserType(e.target.value)}>
          <option value="">Select User Type</option>
          <option value="Admin">Admin</option>
          <option value="Tourism Governor">Tourism Governor</option>
        </select>
        <button onClick={handleDeleteUser}>Delete User</button>
      </div>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default AdminPage;
