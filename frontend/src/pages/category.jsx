import React, { useState } from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import image from '../images/image.png';
import {FaTag,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';


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
      alert(`Category "${data.Name}" created successfully!`); // Success alert
      setCreateCategoryName(''); // Reset form field
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Failed to create category.'}`); // Error alert
    }
  } catch (error) {
    alert('An error occurred while creating the category.'); // General error alert
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleGetCategory = async () => {
  setLoading(true);

  try {
    const response = await fetch(`http://localhost:8000/getCategory?Name=${searchCategoryName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      alert(`Category "${data.Name}" was found!`); // Success alert
      setSearchCategoryName(''); // Clear the search input
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Category not found.'}`); // Error alert
    }
  } catch (error) {
    alert('An error occurred while fetching the category.'); // General error alert
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  
const handleUpdateCategory = async (e) => {
  e.preventDefault();
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
      alert(`Category "${data.Name}" updated successfully!`); // Success alert
      setUpdateCategoryData({ currentName: '', newName: '' }); // Clear input fields
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Failed to update category.'}`); // Error alert
    }
  } catch (error) {
    alert('An error occurred while updating the category.'); // General error alert
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  


const deleteCategory = async (e) => {
  e.preventDefault();
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
      alert(data.msg || `Category "${deleteCategoryName}" deleted successfully!`); // Success alert
      setDeleteCategoryName(''); // Clear the input field
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error || 'Failed to delete category.'}`); // Error alert
    }
  } catch (error) {
    alert('An error occurred while deleting the category.'); // General error alert
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={styles.container}>
    {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title2}>Category Management</h1>
    </header>

    {/* Sidebar */}
    <div
        style={styles.sidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = '200px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '1')
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >

<div style={styles.item} onClick={() => navigate('/adminPage')}>
          <FaUser style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Profile
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/PromoCodeForm')}>
          <FaTag style={styles.icon} />
          <span className="label" style={styles.label}>
            Promo Codes
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/preftags')}>
          <FaHeart style={styles.icon} />
          <span className="label" style={styles.label}>
           Preference Tags
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/category')}>
          <FaThList style={styles.icon} />
          <span className="label" style={styles.label}>
           Categories
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/adminReport')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            Sales Report
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/DeletionRequest')}>
          <FaTrashAlt  style={styles.icon} />
          <span className="label" style={styles.label}>
            Deletion Requests
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/AddProduct')}>
          <FaPlus  style={styles.icon} />
          <span className="label" style={styles.label}>
            Add Product
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/EditProducts')}>
          <FaEdit   style={styles.icon} />
          <span className="label" style={styles.label}>
            Edit Products
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/flagged')}>
          <FaFlag   style={styles.icon} />
          <span className="label" style={styles.label}>
            Flag Events
          </span>   
        </div>
      </div>

      <div style={styles.cardsContainer}>
  {/* Create Category Section */}
  <div className="complaint-card" style={styles.card}>
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
  </div>
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
    marginTop: '80px',
  },
  heading: {
    fontSize: '24px',
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
  /////
  
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '70px',
  },
      
  header: {
    height:'60px',
    position: 'fixed', // Make the header fixed
    top: '0', // Stick to the top of the viewport
    left: '0',
    width: '100%', // Make it span the full width of the viewport
    backgroundColor: '#0F5132', // Green background
    color: 'white', // White text
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth
    zIndex: '1000', // Ensure it appears above other content
  },
  logoContainer: {
    marginBottom: '10px', // Space between the logo and the title
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  
  },
  title2: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute', // Position the title independently
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Adjust for element's size
    margin: '0',
  },
  profileIcon: {
    fontSize: '40px',
    color: 'white',
    cursor: 'pointer',
  },
//header
    heading: {
fontSize: '24px',
fontWeight: 'bold',
marginBottom: '20px',
color: '#0F5132', // Green theme
textAlign: 'center',
},
form: {
display: 'flex',
flexDirection: 'column',
gap: '15px',
maxWidth: '700px',
margin: '0 auto',
backgroundColor: '#f9f9f9',
padding: '20px',
borderRadius: '10px',
boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
},
formGroup: {
display: 'flex',
flexDirection: 'column',
gap: '5px',
},
item: {
padding: '10px 0',
},
label: {
fontSize: '16px',
fontWeight: 'bold',
color: '#555',
},
input: {
padding: '10px',
border: '1px solid #ccc',
borderRadius: '5px',
fontSize: '14px',
},
button: {
padding: '12px',
fontSize: '16px',
backgroundColor: '#0F5132',
color: '#fff',
border: 'none',
borderRadius: '5px',
cursor: 'pointer',
transition: 'background-color 0.3s ease',
},
buttonHover: {
backgroundColor: '#155724', // Darker green on hover
},
icon: {
  fontSize: '24px',
  marginLeft: '15px', // Move icons slightly to the right
  color: '#fff', // Icons are always white
},
cardsContainer: {
  display: 'flex',
  flexDirection: 'column', // Stack the cards vertically
  gap: '10px', // Add spacing between the cards
  marginTop: '20px', // Add spacing from the heading
},
//header
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: '10px',
  },
  productList: {
    listStyleType: 'none',
    padding: 0,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  productName: {
    fontSize: '20px',
    color: '#4CAF50',
  },
  productImage: {
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
  },
  imagePreview: {
    maxWidth: '100%',
    borderRadius: '10px',
    marginTop: '10px',
  },
  addButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
    //sidebar
    sidebar: {
      position: 'fixed',
      top: '60px',
      left: 0,
      height: '100vh',
      width: '50px', // Default width when collapsed
      backgroundColor: 'rgba(15, 81, 50, 0.85)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start', // Ensure alignment starts from the left
      padding: '10px 0',
      overflowX: 'hidden',
      transition: 'width 0.3s ease',
      zIndex: 1000,
    },
    item: {
      padding: '10px 0',
    },
    sidebarExpanded: {
      width: '200px', // Width when expanded
    },

    label: {
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      color: '#fff',
      opacity: 0, // Initially hidden
      whiteSpace: 'nowrap', // Prevent label text from wrapping
      transition: 'opacity 0.3s ease',
    },
    //
};

export default Category;
