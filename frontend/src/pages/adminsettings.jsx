import React, { useState } from 'react';

const AdminSettings = () => {


const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        Email:''
      });

const [loading, setLoading] = useState(false);


  const [changePasswordData, setChangePasswordData] = useState({
    Username: '',
    currentPassword: '',
    newPassword: ''
  });
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');
  const [complaintIdToSearch, setComplaintIdToSearch] = useState('');
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState('');
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('pending');
  const [updateStatusMessage, setUpdateStatusMessage] = useState('');
  const [updateStatusError, setUpdateStatusError] = useState('');
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordLoading(true);
    setChangePasswordSuccess('');
    setChangePasswordError('');
  
    try {
      const response = await fetch('http://localhost:8000/changePasswordAdmin', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changePasswordData),
      });
  
      if (response.ok) {
        const data = await response.json();
        setChangePasswordSuccess(data.message);
        setChangePasswordData({
          Username: '',
          Email: '', // Reset Email field after successful change
          currentPassword: '',
          newPassword: '',
        });
      } else {
        const errorData = await response.json();
        setChangePasswordError(errorData.error || 'Failed to change password.');
      }
    } catch (error) {
      setChangePasswordError('An error occurred while changing the password.');
      console.error(error);
    } finally {
      setChangePasswordLoading(false);
    }
  };
  
  const fetchComplaintDetails = async (e) => {
    e.preventDefault();
    setComplaintLoading(true);
    setComplaintError('');
    setComplaintDetails(null);
  
    try {
      const response = await fetch(`http://localhost:8000/getComplaintDetails/${complaintIdToSearch.trim()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setComplaintDetails(data); // Store the fetched complaint details
      } else {
        const errorData = await response.json();
        setComplaintError(errorData.error || 'Complaint not found.');
      }
    } catch (error) {
      setComplaintError('An error occurred while fetching the complaint details.');
      console.error(error);
    } finally {
      setComplaintLoading(false);
    }
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    const { Username, Password ,Email} = formData;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Password ,Email})
      });

      if (response.ok) {
        alert('Admin created successfully!');
        setFormData({ Username: '', Password: '' ,Email:''});
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

return (
  <div style={styles.container}>
    <h2 style={styles.heading}>Admin Settings</h2>

 {/* Change Password Section */}
<div style={styles.section}>
  <div style={styles.card}>
    <h3 style={styles.sectionHeading}>Change Admin Password</h3>
    <form onSubmit={handleChangePassword} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Username:</label>
        <input
          type="text"
          name="Username"
          value={changePasswordData.Username}
          onChange={(e) =>
            setChangePasswordData((prevData) => ({
              ...prevData,
              Username: e.target.value,
            }))
          }
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email:</label> {/* New Email field */}
        <input
          type="email"
          name="Email"
          value={changePasswordData.Email}
          onChange={(e) =>
            setChangePasswordData((prevData) => ({
              ...prevData,
              Email: e.target.value,
            }))
          }
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Current Password:</label>
        <input
          type="password"
          name="currentPassword"
          value={changePasswordData.currentPassword}
          onChange={(e) =>
            setChangePasswordData((prevData) => ({
              ...prevData,
              currentPassword: e.target.value,
            }))
          }
          required
          style={styles.input}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>New Password:</label>
        <input
          type="password"
          name="newPassword"
          value={changePasswordData.newPassword}
          onChange={(e) =>
            setChangePasswordData((prevData) => ({
              ...prevData,
              newPassword: e.target.value,
            }))
          }
          required
          style={styles.input}
        />
      </div>
      <button
        type="submit"
        disabled={changePasswordLoading}
        style={styles.button}
      >
        {changePasswordLoading ? 'Changing...' : 'Change Password'}
      </button>
      {changePasswordSuccess && (
        <p style={styles.success}>{changePasswordSuccess}</p>
      )}
      {changePasswordError && (
        <p style={styles.error}>{changePasswordError}</p>
      )}
    </form>
  </div>
</div>

      {/* Create Admin Section */}
      <div style={styles.card}>
        <h3 style={styles.sectionHeading}>Create Admin</h3>
        <form onSubmit={createAdmin} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="text"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Creating...' : 'Create Admin'}
          </button>
          {errorMessage && <p style={styles.error}>{errorMessage}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
        </form>
        </div>
      

    {/* View Complaint Details Section */}
    <div style={styles.section}>
      <div style={styles.card}>
        <h3 style={styles.sectionHeading}>View Complaint Details</h3>
        <form onSubmit={fetchComplaintDetails} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Complaint ID:</label>
            <input
              type="text"
              value={complaintIdToSearch}
              onChange={(e) => setComplaintIdToSearch(e.target.value)}
              required
              placeholder="Enter Complaint ID"
              style={styles.input}
            />
          </div>
          <button
            type="submit"
            disabled={complaintLoading}
            style={{
              ...styles.button,
              backgroundColor: complaintLoading ? '#ccc' : '#0F5132',
            }}
          >
            {complaintLoading ? 'Searching...' : 'Get Complaint Details'}
          </button>
          {complaintError && <p style={styles.error}>{complaintError}</p>}
        </form>

        {complaintDetails && (
          <div style={styles.detailsCard}>
            <h3 style={styles.detailsHeading}>Complaint Details</h3>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Title:</span>
              <span style={styles.detailValue}>{complaintDetails.title}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Body:</span>
              <p style={styles.detailDescription}>{complaintDetails.body}</p>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Date:</span>
              <span style={styles.detailValue}>
                {new Date(complaintDetails.date).toLocaleDateString()}
              </span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Username:</span>
              <span style={styles.detailValue}>{complaintDetails.username}</span>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Status:</span>
              <span
                style={{
                  ...styles.detailValue,
                  color:
                    complaintDetails.status === 'pending'
                      ? '#FFA500'
                      : '#0F5132', // Orange for pending, green for resolved
                }}
              >
                {complaintDetails.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

};

// Styling for the component
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
  buttonHover: {
    backgroundColor: '#0C3E27',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginTop: '10px',
  },
  /////
  detailsCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif',
  },
  detailsHeading: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#0F5132',
    textAlign: 'center',
    marginBottom: '20px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  detailLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
    flex: '0 0 30%', // Label takes up 30% width
    textAlign: 'left',
  },
  detailValue: {
    fontSize: '16px',
    color: '#333',
    flex: '0 0 65%', // Value takes up 65% width
    textAlign: 'right',
  },
  detailDescription: {
    fontSize: '16px',
    color: '#333',
    lineHeight: '1.6',
    flex: '0 0 65%', // Description spans across 65% width
    marginLeft: '5px',
    textAlign: 'left', // Align text for multiline content
  },
  //
  section: {
    marginBottom: '30px', // Add space between sections
  },
  sectionHeading: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    textAlign: 'center', // Center the section heading
  },
  sectionCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
    marginBottom: '20px', // Separate cards visually
  },
};

export default AdminSettings;
