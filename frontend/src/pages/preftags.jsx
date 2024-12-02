import React, { useState } from 'react';
import {FaArrowLeft} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation


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
        setCreatePrefTagMessage(`Preference Tag "${data.PrefTagName}" created successfully!`);
        setCreatePrefTagName('');
      } else {
        const errorData = await response.json();
        setCreatePrefTagMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setCreatePrefTagMessage('An error occurred while creating the preference tag.');
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
      setPrefTag(data.PrefTagName);
      setGetError(''); // Clear error if successful
    } catch (err) {
      setGetError(err.message);
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
        setMessage(`Preference Tag updated: ${data.PrefTagName}`);
      } else {
        const errorData = await response.json();
        setUpdateError(errorData.error || 'Failed to update preference tag.');
      }
    } catch (err) {
      setUpdateError('An error occurred while updating the preference tag.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
              <FaArrowLeft 
    onClick={() =>  navigate('/adminPage')}
    style={{
      cursor: 'pointer', 
      fontSize: '24px', 
      color: '#0F5132' // Match your theme
    }} 
  />
      <h2 style={styles.heading}>Preference Tag Management</h2>

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
            value={getPrefTagName}
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
  button: {
    padding: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
};

export default Preftags;
