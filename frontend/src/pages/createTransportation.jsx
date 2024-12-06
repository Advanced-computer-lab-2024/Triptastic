import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/image.png';
import { FaBus, FaUserCircle,FaRunning,FaChair,FaClipboardList,FaPhoneAlt,FaEnvelope, FaMapMarkerAlt, FaDollarSign, FaClock, FaBuilding } from 'react-icons/fa';

const CreateTransportation = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [transportFormData, setTransportFormData] = useState({
    type: 'Bus',
    company: {
      name: '',
      contact: {
        phone: '',
        email: '',
      },
    },
    origin: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    seatsAvailable: '',
  });

  const navigate = useNavigate();

  const handleTransportInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('company.contact.')) {
      const contactField = name.split('.')[2];
      setTransportFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          contact: {
            ...prevData.company.contact,
            [contactField]: value,
          },
        },
      }));
    } else if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setTransportFormData((prevData) => ({
        ...prevData,
        company: {
          ...prevData.company,
          [companyField]: value,
        },
      }));
    } else {
      setTransportFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCreateTransportation = async () => {
    try {
      const response = await fetch(`http://localhost:8000/createTransportation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transportFormData),
      });

      if (response.ok) {
        alert('Transportation created successfully!');
        setTransportFormData({
          type: 'Bus',
          company: {
            name: '',
            contact: {
              phone: '',
              email: '',
            },
          },
          origin: '',
          destination: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          seatsAvailable: '',
        });
      } else {
        throw new Error('Failed to create transportation');
      }
    } catch (error) {
      console.error('An error occurred while creating transportation:', error);
    }
  };

  return (
    <div style={styles.background}>
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title}> Transportation</h1>
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
            e.currentTarget.style.width = '50px';
            Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
              (label) => (label.style.opacity = '0')
            );
          }}
        >
            <div className="profile" style={styles.item} onClick={() => navigate('/advertiser-profile')}>
            <FaUserCircle style={styles.iconn} />
            <span className="label" style={styles.label}>
              Profile
            </span>
          </div>
          <div className="activities" style={styles.item} onClick={() => navigate('/advertiser-Activities')}>
            <FaRunning style={styles.iconn} />
            <span className="label" style={styles.label}>
              My Activities
            </span>
          </div>
          <div className="transportation" style={styles.item} onClick={() => navigate('/createTransportation')}>
            <FaBus style={styles.iconn} />
            <span className="label" style={styles.label}>
              Transportation
            </span>
          </div>
         
        </div>
    
        <div className="transportation-form" style={styles.transportForm}>
  <h3 style={styles.formTitle}>Create Transportation</h3>
  <form onSubmit={handleCreateTransportation} style={styles.form}>
    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaBus style={styles.inputIcon} /> Type:
      </label>
      <select
        name="type"
        value={transportFormData.type}
        onChange={handleTransportInputChange}
        style={styles.select}
      >
        <option value="Bus">Bus</option>
        <option value="Taxi">Taxi</option>
        <option value="Train">Train</option>
        <option value="Boat">Boat</option>
      </select>
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaClipboardList style={styles.inputIcon} /> Company Name:
      </label>
      <input
        type="text"
        name="company.name"
        placeholder="Enter company name"
        value={transportFormData.company.name}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaPhoneAlt style={styles.inputIcon} /> Contact Phone:
      </label>
      <input
        type="text"
        name="company.contact.phone"
        placeholder="Enter contact phone"
        value={transportFormData.company.contact.phone}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaEnvelope style={styles.inputIcon} /> Contact Email:
      </label>
      <input
        type="email"
        name="company.contact.email"
        placeholder="Enter contact email"
        value={transportFormData.company.contact.email}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaMapMarkerAlt style={styles.inputIcon} /> Origin:
      </label>
      <input
        type="text"
        name="origin"
        placeholder="Enter origin location"
        value={transportFormData.origin}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaMapMarkerAlt style={styles.inputIcon} /> Destination:
      </label>
      <input
        type="text"
        name="destination"
        placeholder="Enter destination location"
        value={transportFormData.destination}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaClock style={styles.inputIcon} /> Departure Time:
      </label>
      <input
        type="datetime-local"
        name="departureTime"
        value={transportFormData.departureTime}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaClock style={styles.inputIcon} /> Arrival Time:
      </label>
      <input
        type="datetime-local"
        name="arrivalTime"
        value={transportFormData.arrivalTime}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaDollarSign style={styles.inputIcon} /> Price:
      </label>
      <input
        type="number"
        name="price"
        placeholder="Enter price"
        value={transportFormData.price}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <div style={styles.inputGroup}>
      <label style={styles.inputLabel}>
        <FaChair style={styles.inputIcon} /> Seats Available:
      </label>
      <input
        type="number"
        name="seatsAvailable"
        placeholder="Enter number of seats"
        value={transportFormData.seatsAvailable}
        onChange={handleTransportInputChange}
        style={styles.input}
      />
    </div>

    <button type="submit" style={styles.submitButton}>
      Create Transportation
    </button>
  </form>
</div>

    </div>
  );
};

const styles = {
  background: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
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
    color: 'white',
    fontSize: '24px',
    marginRight:'650px'
  },
  container: {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop:'40px'
  },
  transportForm: {
    margin: '0 auto',
    padding: '20px',
    maxWidth: '500px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  formTitle: {
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
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    flex: '1',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  header: {
    height: '60px',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    backgroundColor: '#0F5132',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: '1000',
  },
  input: {
    flex: '2',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  select: {
    flex: '2',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  submitButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#0F5132',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
  },
  inputIcon: {
    color: '#0F5132',
    fontSize: '16px',
  },
  sidebar: {
    position: 'fixed',
    top: '60px',
    left: 0,
    height: '100vh',
    width: '50px', // Default width when collapsed
    backgroundColor: 'rgba(15, 81, 50, 0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '10px 0',
    overflowX: 'hidden',
    transition: 'width 0.3s ease',
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: '200px', // Width when expanded
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '10px',
    width: '100%', // Full width of the sidebar
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  iconContainerHover: {
    backgroundColor: '#084B24', // Background on hover
  },
  iconn: {
    fontSize: '24px',
    marginLeft: '15px', // Move icons slightly to the right
    color: '#fff', // Icons are always white
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
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  item: {
    padding: '10px 0',
  },
};

export default CreateTransportation;
