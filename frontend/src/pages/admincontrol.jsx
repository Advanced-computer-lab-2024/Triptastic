import React, { useEffect, useState } from 'react';
import {FaUsersCog,FaUser,FaBox, FaExclamationCircle, FaHeart, FaFileAlt,FaTrashAlt ,FaThList,FaPlus,FaEdit ,FaFlag,FaUserShield} from 'react-icons/fa';
import image from '../images/image.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


const Adminn = () => {
    const [addTourismGovError, setAddTourismGovError] = useState('');
    const [tourismGovData, setTourismGovData] = useState({
        Username: '',
        Password: ''
      });
      const [addTourismGovSuccess, setAddTourismGovSuccess] = useState('');
      const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        Email:''
      });
      useEffect(() => {
        // Reset form data when the component loads
        setFormData({ Username: '', Password: '', Email: '' });
        setTourismGovData({ Username: '', Password: '' });
      }, []);
    
      const [loading, setLoading] = useState(false);
      const [createAdminSuccess, setCreateAdminSuccess] = useState('');
      const [createAdminError, setCreateAdminError] = useState('');
      const [deleteUserError, setDeleteUserError] = useState('');
      const [userType, setUserType] = useState('');
      const [deleteUserSuccess, setDeleteUserSuccess] = useState('');
      const [usernameToDelete, setUsernameToDelete] = useState('');


  const navigate = useNavigate();

  const createAdmin = async (e) => {
    e.preventDefault();
    const { Username, Password, Email } = formData;

    try {
      const response = await fetch('http://localhost:8000/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, Password, Email }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.Username) {
            alert(`Admin "${data.Username}" created successfully!`);
          } else {
            alert('Admin created successfully!');
          }
        
        setFormData({ Username: '', Password: '', Email: '' }); // Reset the form state
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to create admin.');
      }
    } catch (error) {
      alert('An error occurred while creating the admin.');
      console.error(error);
    }
  };

const handleDeleteUser = async () => {
    if (!usernameToDelete) {
      alert('Please enter a username to delete.');
      return;
    }
  
    try {
      const response = await fetch(
        `http://localhost:8000/delete${userType}?Username=${usernameToDelete}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.ok) {
        const data = await response.json();
        alert(data.msg || 'User deleted successfully.');
        setUsernameToDelete('');
        setUserType('');
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Failed to delete ${userType}.`);
      }
    } catch (error) {
      alert(`An error occurred while deleting the ${userType}.`);
      console.error(error);
    }
  };
  
  const addTourismGov = async (e) => {
    e.preventDefault();
    const { Username, Password } = tourismGovData;
  
    try {
      const response = await fetch('http://localhost:8000/addTourismGov', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username, Password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Tourism Governor added successfully!');
        setTourismGovData({ Username: '', Password: '' });
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to add Tourism Governor.');
      }
    } catch (error) {
      alert('An error occurred while adding the Tourism Governor.');
      console.error(error);
    }
  };
  

  const styles = {

    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#0F5132',
      textAlign: 'center',
      marginBottom: '20px',
    },
    paginationContainer: {
      display: 'flex',
      justifyContent: 'center',
      margin: '20px 0',
    },
    paginationButton: {
      padding: '10px 20px',
      margin: '0 10px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#0F5132',
      color: '#fff',
      cursor: 'pointer',
      fontSize: '14px',
    },
    searchInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    requestsList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    },
    requestItem: {
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
    },
    detail: {
      fontSize: '16px',
      color: '#333',
      marginBottom: '5px',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
    },
    acceptButton: {
      padding: '10px 15px',
      fontSize: '13px',
      backgroundColor: '#0F5132',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    rejectButton: {
      padding: '10px 15px',
      backgroundColor: '#FF4D4D',
      fontSize: '13px',

      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
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
  fontWeight: 'bold',
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
      container2: {
        maxWidth: '800px',
        margin: '100px auto', // Adjusted margin to prevent overlap
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px', // Slightly smaller border radius
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
      },
      form2: {
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      input2: {
        marginBottom: '10px',
        padding: '10px',
        width: '100%',
        border: '1px solid #ccc',
        borderRadius: '5px',
      },
      label2: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '5px',
        display: 'block',
      },
      button2: {
        padding: '10px 20px',
        backgroundColor: '#0F5132',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      },
      success2: {
        color: 'green',
        textAlign: 'center',
      },
      error2: {
        color: 'red',
        textAlign: 'center',
      },
      heading2: {
        fontSize: '18px',
        marginBottom: '20px',
        color: '#0F5132',
      },
  };

  return (
    <div style={styles.container}>
          {/* Header */}
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={image} alt="Logo" style={styles.logo} />
      </div>
      <h1 style={styles.title2}>Admin Control</h1>
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
      </div>



  <div style={styles.container2}>


  {/* Create Admin Form */}
  <form style={styles.form2} onSubmit={createAdmin}>
    <h3>Create Admin</h3>
    <label style={styles.label2}>Username:</label>
    <input
      type="text"
      placeholder="Enter username"
      value={formData.Username}
      onChange={(e) => setFormData({ ...formData, Username: e.target.value })}
      style={styles.input2}
      required
    />
    <label style={styles.label2}>Email:</label>
    <input
      type="email"
      placeholder="Enter email"
      value={formData.Email}
      onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
      style={styles.input2}
      required
    />
    <label style={styles.label2}>Password:</label>
    <input
      type="password"
      placeholder="Enter password"
      value={formData.Password}
      onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
      style={styles.input2}
      required
    />
    <button type="submit" style={styles.button2}>
      Create Admin
    </button>
    {createAdminSuccess && (
      <div className="alert alert-success" role="alert">
        {createAdminSuccess}
      </div>
    )}
    {createAdminError && (
      <div className="alert alert-danger" role="alert">
        {createAdminError}
      </div>
    )}
  </form>

  {/* Delete User Form */}
  <form style={styles.form2} onSubmit={handleDeleteUser}>
    <h3>Delete User</h3>
    <label style={styles.label2}>Username:</label>
    <input
      type="text"
      placeholder="Enter username to delete"
      value={usernameToDelete}
      onChange={(e) => setUsernameToDelete(e.target.value)}
      style={styles.input2}
      required
    />
    <label style={styles.label2}>User Type:</label>
    <select
      value={userType}
      onChange={(e) => setUserType(e.target.value)}
      style={styles.input2}
      required
    >
      <option value="">Select Type</option>
      <option value="Admin">Admin</option>
      <option value="TourismGov">Tourism Governor</option>
      <option value="Tourist">Tourist</option>
      <option value="Advertiser">Advertiser</option>
      <option value="Seller">Seller</option>
      <option value="TourGuide">Tour Guide</option>
    </select>
    <button type="submit" style={styles.button2}>
      Delete User
    </button>
    {deleteUserSuccess && (
      <div className="alert alert-success" role="alert">
        {deleteUserSuccess}
      </div>
    )}
    {deleteUserError && (
      <div className="alert alert-danger" role="alert">
        {deleteUserError}
      </div>
    )}
  </form>

  {/* Add Tourism Governor Form */}
  <form style={styles.form2} onSubmit={addTourismGov}>
    <h3>Add Tourism Governor</h3>
    <label style={styles.label2}>Username:</label>
    <input
      type="text"
      placeholder="Enter username"
      value={tourismGovData.Username}
      onChange={(e) => setTourismGovData({ ...tourismGovData, Username: e.target.value })}
      style={styles.input2}
      required
    />
    <label style={styles.label2}>Password:</label>
    <input
      type="password"
      placeholder="Enter password"
      value={tourismGovData.Password}
      onChange={(e) => setTourismGovData({ ...tourismGovData, Password: e.target.value })}
      style={styles.input2}
      required
    />
    <button type="submit" style={styles.button2}>
      Add Tourism Governor
    </button>
    {addTourismGovSuccess && (
      <div className="alert alert-success" role="alert">
        {addTourismGovSuccess}
      </div>
    )}
    {addTourismGovError && (
      <div className="alert alert-danger" role="alert">
        {addTourismGovError}
      </div>
    )}
  </form>
</div>

</div>
  );
};

export default Adminn;
