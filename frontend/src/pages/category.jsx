import React, { useState } from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


const Category = () => {
    const [createCategoryName, setCreateCategoryName] = useState('');
    const [searchCategoryName, setSearchCategoryName] = useState('');
    const [categorySearchResult, setCategorySearchResult] = useState(null);
    const [deleteCategoryName, setDeleteCategoryName] = useState('');
    const [updateCategoryData, setUpdateCategoryData] = useState({
        currentName: '',
        newName: ''
      });
const [loading, setLoading] = useState(false);
const [createCategorySuccess, setCreateCategorySuccess] = useState(''); // State for success message
const [createCategoryError, setCreateCategoryError] = useState(''); 
const [getCategoryError, setGetCategoryError] = useState('');
const [getCategorySuccess, setGetCategorySuccess] = useState('');

const [updateCategoryError, setUpdateCategoryError] = useState('');
const [updateCategorySuccess, setUpdateCategorySuccess] = useState('');
const navigate = useNavigate(); // Initialize useNavigate for navigation


const [deleteCategoryError, setDeleteCategoryError] = useState('');
const [deleteCategorySuccess, setDeleteCategorySuccess] = useState('');

const createCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Clear previous messages
    setCreateCategoryError('');
    setCreateCategorySuccess('');
  
    try {
      const response = await fetch('http://localhost:8000/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: createCategoryName }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setCreateCategorySuccess(`Category "${data.Name}" created successfully!`);
        setCreateCategoryName(''); // Reset form field
      } else {
        const errorData = await response.json();
        setCreateCategoryError(errorData.error || 'Failed to create category.');
      }
    } catch (error) {
      setCreateCategoryError('An error occurred while creating the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleGetCategory = async () => {
    setLoading(true);
  
    // Clear previous messages and results
    setGetCategoryError('');
    setGetCategorySuccess('');
    setCategorySearchResult(null);
  
    try {
      const response = await fetch(`http://localhost:8000/getCategory?Name=${searchCategoryName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCategorySearchResult(data.Name); // Only store the category name
        setGetCategorySuccess(`Category "${data.Name}" was found!`);
      } else {
        const errorData = await response.json();
        setGetCategoryError(errorData.error || 'Category not found.');
      }
    } catch (error) {
      setGetCategoryError('An error occurred while fetching the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
  
    // Clear previous messages and show loading state
    setUpdateCategoryError('');
    setUpdateCategorySuccess('');
    setLoading(true);
  
    const { currentName, newName } = updateCategoryData;
  
    try {
      const response = await fetch('http://localhost:8000/updateCategory', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: currentName, newName }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUpdateCategorySuccess(`Category "${data.Name}" updated successfully!`);
        setUpdateCategoryData({ currentName: '', newName: '' });
      } else {
        const errorData = await response.json();
        setUpdateCategoryError(errorData.error || 'Failed to update category.');
      }
    } catch (error) {
      setUpdateCategoryError('An error occurred while updating the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  


  const deleteCategory = async (e) => {
    e.preventDefault();

    // Clear previous messages and set loading state
    setDeleteCategoryError('');
    setDeleteCategorySuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/deleteCategory', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Name: deleteCategoryName }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeleteCategorySuccess(data.msg || `Category "${deleteCategoryName}" deleted successfully!`);
        setDeleteCategoryName('');
      } else {
        const errorData = await response.json();
        setDeleteCategoryError(errorData.error || 'Failed to delete category.');
      }
    } catch (error) {
      setDeleteCategoryError('An error occurred while deleting the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={styles.container}>
                    <FaArrowLeft 
    onClick={() => navigate('/adminPage')}
    style={{
      cursor: 'pointer', 
      fontSize: '24px', 
      color: '#0F5132' // Match your theme
    }} 
  />
      <h2 style={styles.heading}>Category Management</h2>
      <div className="complaint-card">
  <h3 style={styles.cardHeading}>Create Category</h3>
  <form onSubmit={createCategory} style={styles.form}>
    <div style={styles.formGroup}>
      <label style={styles.label}>Category Name:</label>
      <input
        type="text"
        value={createCategoryName}
        onChange={(e) => setCreateCategoryName(e.target.value)}
        required
        style={styles.input}
      />
    </div>
    <button type="submit" disabled={loading} style={styles.button}>
      {loading ? 'Creating...' : 'Create Category'}
    </button>
    {/* Display messages */}
    {createCategoryError && <p style={styles.error}>{createCategoryError}</p>}
    {createCategorySuccess && <p style={styles.success}>{createCategorySuccess}</p>}
  </form>

  
</div>

{/* Get Category Section */}
<div style={styles.card}>
        <h3 style={styles.cardHeading}>Get Category</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Category Name:</label>
          <input
            type="text"
            value={searchCategoryName}
            onChange={(e) => setSearchCategoryName(e.target.value)}
            placeholder="Enter category name"
            style={styles.input}
          />
        </div>
        <button
          onClick={handleGetCategory}
          disabled={loading || !searchCategoryName.trim()}
          style={styles.button}
        >
          {loading ? 'Searching...' : 'Search Category'}
        </button>
        {/* Display messages */}
        {getCategoryError && <p style={styles.error}>{getCategoryError}</p>}
        {getCategorySuccess && <p style={styles.success}>{getCategorySuccess}</p>}
 
      </div>

      <div style={styles.card}>
  <h3 style={styles.cardHeading}>Update Category</h3>
  <form onSubmit={handleUpdateCategory} style={styles.form}>
    <div style={styles.formGroup}>
      <label style={styles.label}>Current Category Name:</label>
      <input
        type="text"
        value={updateCategoryData.currentName}
        onChange={(e) =>
          setUpdateCategoryData((prev) => ({
            ...prev,
            currentName: e.target.value,
          }))
        }
        placeholder="Enter current category name"
        style={styles.input}
        required
      />
    </div>
    <div style={styles.formGroup}>
      <label style={styles.label}>New Category Name:</label>
      <input
        type="text"
        value={updateCategoryData.newName}
        onChange={(e) =>
          setUpdateCategoryData((prev) => ({
            ...prev,
            newName: e.target.value,
          }))
        }
        placeholder="Enter new category name"
        style={styles.input}
        required
      />
    </div>
    <button type="submit" disabled={loading} style={styles.button}>
      {loading ? 'Updating...' : 'Update Category'}
    </button>
    {updateCategoryError && <p style={styles.error}>{updateCategoryError}</p>}
    {updateCategorySuccess && (
      <p style={styles.success}>{updateCategorySuccess}</p>
    )}
  </form>

  
</div>
<div style={styles.card}>
        <h3 style={styles.cardHeading}>Delete Category</h3>
        <form onSubmit={deleteCategory} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Category Name:</label>
            <input
              type="text"
              value={deleteCategoryName}
              onChange={(e) => setDeleteCategoryName(e.target.value)}
              placeholder="Enter category name to delete"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Deleting...' : 'Delete Category'}
          </button>
          {deleteCategoryError && <p style={styles.error}>{deleteCategoryError}</p>}
          {deleteCategorySuccess && (
            <p style={styles.success}>{deleteCategorySuccess}</p>
          )}
        </form>
    </div>
    </div>
  );
};

// Styles for the component
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#0F5132',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  cardHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  message: {
    fontSize: '14px',
    marginTop: '10px',
    color: '#0F5132',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  resultContent: {
    fontSize: '14px',
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
  },
  cardHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0F5132',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
  },
  result: {
    marginTop: '15px',
    backgroundColor: '#f1f1f1',
    padding: '15px',
    borderRadius: '5px',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  resultContent: {
    fontSize: '14px',
    color: '#333',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
};

export default Category;
