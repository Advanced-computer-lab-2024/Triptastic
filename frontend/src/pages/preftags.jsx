import React, { useState } from 'react';
import {FaUserShield} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import image from '../images/image.png';
import {FaUsersCog,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag} from 'react-icons/fa';



const Preftags = () => {
  const [createPrefTagMessage, setCreatePrefTagMessage] = useState('');
  const [createPrefTagName, setCreatePrefTagName] = useState('');
  const [getPrefTagName, setGetPrefTagName] = useState('');
  const [prefTag, setPrefTag] = useState(null);
  const [updatePrefTagOldName, setUpdatePrefTagOldName] = useState('');
  const [newPrefTagName, setNewPrefTagName] = useState('');
  const [message, setMessage] = useState('');
  const [getError, setGetError] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPrefTag = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCreatePrefTagMessage('');

    try {
      const response = await fetch('http://localhost:8000/createPrefTag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PrefTagName: createPrefTagName }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Preference Tag "${data.PrefTagName}" created successfully!`);
        setCreatePrefTagName('');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`); // Alert the error message
      }
    } catch (error) {
      alert('An error occurred while creating the preference tag.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPrefTag = async () => {
    try {
      const response = await fetch(`http://localhost:8000/getPrefTag?PrefTagName=${getPrefTagName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch preference tag');
      }
      const data = await response.json();
      setPrefTag(data.PrefTagName); // Show fetched details
      alert(`Preference Tag: "${data.PrefTagName}" fetched successfully!`); // Show alert
      setPrefTag(null); // Reset the details after the alert
      setGetPrefTagName(''); // Clear the input field
    } catch (err) {
      alert(`Error: ${err.message}`); // Error alert
    }
  };
  
  

  const updatePrefTag = async (e) => {
    e.preventDefault();
    setMessage('');
    setUpdateError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/updatePrefTag', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PrefTagName: updatePrefTagOldName, newPrefTagName }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Preference Tag updated successfully: ${data.PrefTagName}`); // Success alert
        setUpdatePrefTagOldName(''); // Clear the input field
        setNewPrefTagName(''); // Clear the input field
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to update preference tag.'}`); // Error alert
      }
    } catch (err) {
      alert('An error occurred while updating the preference tag.'); // General error alert
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
      <h1 style={styles.title2}>Preference Tag Management</h1>
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

        <div style={styles.item} onClick={() => navigate('/manage')}>
          <FaUserShield style={styles.icon} />
          <span className="label" style={styles.label}>
          Admin Panel
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/admincontrol')}>
          <FaUsersCog   style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Control
          </span>   
        </div>
        
        
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
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
        <div style={styles.item} onClick={() => navigate('/products_admin')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            View Products
          </span>   
        </div>
      </div>

      {/* Create Preference Tag Section */}
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>Create Preference Tag</h3>
        <form onSubmit={createPrefTag} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Preference Tag Name:</label>
            <input
              type="text"
              value={createPrefTagName}
              onChange={(e) => setCreatePrefTagName(e.target.value)}
              required
              placeholder="Enter a new preference tag name" // Added placeholder here
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating...' : 'Create Preference Tag'}
          </button>
          {createPrefTagMessage && <p style={styles.message}>{createPrefTagMessage}</p>}
        </form>
      </div>
{/* Get Preference Tag Section */}
<div style={styles.card}>
  <h3 style={styles.cardHeading}>Get Preference Tag</h3>
  <div style={styles.formGroup}>
    <label style={styles.label}>Preference Tag Name:</label>
    <input
      type="text"
      value={getPrefTagName} // Controlled by state
      onChange={(e) => setGetPrefTagName(e.target.value)}
      placeholder="Enter Preference Tag Name"
      style={styles.input}
    />
  </div>
  <button
    onClick={fetchPrefTag}
    disabled={loading || !getPrefTagName.trim()}
    style={{
      ...styles.button,
      backgroundColor: loading ? '#ccc' : '#0F5132',
    }}
  >
    {loading ? 'Fetching...' : 'Fetch Preference Tag'}
  </button>
  {getError && <p style={styles.error}>{getError}</p>}
  {prefTag && (
    <div style={styles.result}>
      <h4 style={styles.resultTitle}>Preference Tag Details:</h4>
      <pre style={styles.resultContent}>{JSON.stringify(prefTag, null, 2)}</pre>
    </div>
  )}
</div>


      {/* Update Preference Tag Section */}
      <div style={styles.card}>
        <h3 style={styles.cardHeading}>Update Preference Tag</h3>
        <form onSubmit={updatePrefTag} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Preference Tag Name:</label>
            <input
              type="text"
              value={updatePrefTagOldName}
              onChange={(e) => setUpdatePrefTagOldName(e.target.value)}
              placeholder="Enter Current Preference Tag Name"
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Preference Tag Name:</label>
            <input
              type="text"
              value={newPrefTagName}
              onChange={(e) => setNewPrefTagName(e.target.value)}
              placeholder="Enter New Preference Tag Name"
              style={styles.input}
              required
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Updating...' : 'Update Preference Tag'}
          </button>
          {updateError && <p style={styles.error}>{updateError}</p>}
          {message && <p style={styles.success}>{message}</p>}
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
  button: {
    padding: '12px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  result: {
    marginTop: '15px',
    backgroundColor: '#f1f1f1',
    padding: '15px',
    borderRadius: '5px',
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
    marginBottom: '10px',
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
    textAlign: 'center',
  },
  buttonHover: {
    backgroundColor: '#0C3E27',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
    textAlign: 'center',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  //
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f4f4f4',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '80px', // Push content down to account for the header
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

export default Preftags;
