import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png';
import LockResetIcon from '@mui/icons-material/LockReset';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';


const TourismGov = () => {
  const navigate = useNavigate();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Navigation handlers
  const handleCreateHistoricalLocation = () => navigate('/gov-historical');
  const handleCreateMuseum = () => navigate('/gov-museum');
  const handleMyLocations = () => navigate('/my-locations');
  const handleMyMuseums = () => navigate('/my-museums');

  // Change Password handler
  const handleChangePassword = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/changePasswordTourismGov`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.error);
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <img src={logo} alt="Logo" style={styles.logo} />
        <h1 style={styles.title}>Tourism Governor Profile</h1>
        <div style={styles.headerIcons}>
          <LockResetIcon
            style={styles.lockIcon}
            onClick={() => setIsModalOpen(true)}
          />
                  </div>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.buttonContainer}>
          <button onClick={handleCreateHistoricalLocation} style={styles.button}>
            Create Historical Location
          </button>
          <button onClick={handleCreateMuseum} style={styles.button}>
            Create Museum
          </button>
          <button onClick={handleMyLocations} style={styles.button}>
            View My Historical Locations
          </button>
          <button onClick={handleMyMuseums} style={styles.button}>
            View My Museums
          </button>
        </div>
      </div>

       {/* Change Password Modal */}
    {isModalOpen && (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <HighlightOffOutlinedIcon
            style={styles.cancelpasswordIcon}
            onClick={() => setIsModalOpen(false)}
          />
          <h2 style={styles.modalContentH2}>Change Password</h2>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.modalContentInput}
          />
          <button
            onClick={handleChangePassword}
            style={styles.modalContentButton}
          >
            Change Password
          </button>

          {/* Success/Error Messages */}
          {successMessage && (
            <p style={styles.successMessage}>{successMessage}</p>
          )}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        </div>
      </div>
    )}
    </div>
  );
};

const styles = {
  container: {
    margin: '90px auto',
    maxWidth: '1000px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    position: 'fixed',
    height: '60px',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    zIndex: 1000,
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '60px',
    width: '70px',
    borderRadius: '10px',
  },
  title: {
    fontSize: '24px',
    margin: 0,
    fontWeight: 'bold',
    marginLeft:'20px'
  },
  profileIcon: {
    fontSize: '40px',
    color: '#fff',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  buttonHover: {
    backgroundColor: '#084B24',
  },
  passwordSection: {
    marginTop: '30px',
  },
  subTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
 
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContentH2: {
    fontSize: '22px',
    textAlign: 'center',
    color: '#333',
  }, modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '280px', // Adjust placement
  },modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  lockIcon: {
    fontSize: '30px',
    color: '#fff',
    cursor: 'pointer',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '30px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
  successMessage: {
    color: '#0F5132',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  errorMessage: {
    color: '#dc3545',
    fontWeight: 'bold',
    marginTop: '10px',
  },
};

export default TourismGov;
