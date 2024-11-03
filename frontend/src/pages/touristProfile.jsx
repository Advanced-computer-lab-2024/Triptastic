import React, { useState, useEffect } from 'react';
import './TouristProfile.css'; // Assuming you create a CSS file for styling
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const TouristProfile = () => {

  const [touristInfo, setTouristInfo] = useState(null);
  const [complaints, setComplaints] = useState([]); // New state for complaints
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false); // Track update status
  const [Itineraries,setItineraries]= useState('');
  const [showingItineraries,setShowingItineraries]=useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);//new
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Nationality: '',
    DOB: '',
    Occupation: '',
    Wallet: '',
    title: '', 
    body: '',  
    date: ''  
  });
  const navigate = useNavigate();
  useEffect(() => {
    fetchItineraries();
      }, []);
  const handleViewItineraries=()=>{
    setShowingItineraries( prev=>!prev);
  }

  const fetchTouristInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getTourist?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setTouristInfo(data);
            setFormData(data); // Pre-fill the form with current data
            setErrorMessage('');
          } else {
            setErrorMessage('No tourist information found.');
          }
        } else {
          throw new Error('Failed to fetch tourist information');
        }
      } catch (error) {
        setErrorMessage('An error occurred while fetching tourist information');
        console.error(error);
      }
    } else {
      setErrorMessage('No tourist information found.');
    }
    setLoading(false);
  };
  const fetchItineraries= async ()=>{
    try{
      const response = await fetch(`http://localhost:8000/getAllItineraries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItineraries(data);
      }
    }
    catch (error) {
      console.error(error);
    }
  }
  // New function to fetch complaints
  const fetchComplaints = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(`http://localhost:8000/getComplaintsByTourist?username=${Username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data); // Set complaints state
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch complaints');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching complaints');
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTouristInfo();
    fetchComplaints(); // Fetch complaints when the component loads
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const response = await fetch('http://localhost:8000/updateTourist', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedTourist = await response.json();
        setTouristInfo(updatedTourist);
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update tourist information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating tourist information');
      console.error(error);
    }
    setUpdating(false);
  };

  // Function to fetch a product by name
  const fetchProductByName = async (productName) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/getProductTourist?productName=${productName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const product = await response.json();
        setFetchedProduct(product); // Store the fetched product
        setErrorMessage('');
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching the product');
      console.error(error);
    }
    setLoading(false);
  };

  const handleFetchProduct = () => {
    const productName = formData.productName; // Assuming there's an input for productName
    fetchProductByName(productName);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      const username = localStorage.getItem('Username'); // Retrieve username from localStorage

      if (!username) {
        setErrorMessage('Username not found in localStorage. Please log in again.');
        return; // Exit the function if username is not found
      }

      const complaintData = {
        title: formData.title,
        body: formData.body,
        date: formData.date,
      };

      // Construct the URL with the username as a query parameter
      const response = await fetch(`http://localhost:8000/fileComplaint?username=${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintData), // Send form data
      });

      if (response.ok) {
        alert('Complaint filed successfully!');
        setErrorMessage('');
        setFormData((prev) => ({ ...prev, ...complaintData, title: '', body: '', date: '' }));
        fetchComplaints(); // Refresh complaints after filing a new one
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to file complaint');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="tourist-profile-container">
      <div className="profile-content">
        <h2>Tourist Profile</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading tourist information...</p>
        ) : (
          touristInfo && (
            <div>
              <div>
                <label><strong>Username:</strong></label>
                <p>{touristInfo.Username}</p> {/* Display Username as text */}
              </div>
              <div>
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Password:</strong></label>
                <input
                  type="text" // Visible password
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Nationality:</strong></label>
                <input
                  type="text"
                  name="Nationality"
                  value={formData.Nationality}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Date of Birth:</strong></label>
                <input
                  type="text" // Display DOB as a string
                  name="DOB"
                  value={formData.DOB}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Occupation:</strong></label>
                <input
                  type="text"
                  name="Occupation"
                  value={formData.Occupation}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Wallet:</strong></label>
                <p>{touristInfo.Wallet}</p> {/* Display Wallet as text */}
              </div>

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchTouristInfo}>Refresh My Information</button>
      </div>

      {/* Fetch Product by Name */}
      <div>
        <h3>Fetch Product by Name</h3>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
        />
        <button onClick={handleFetchProduct}>Fetch Product</button>

        {fetchedProduct && (
          <div>
            <h4>Product Details</h4>
            <p><strong>Name:</strong> {fetchedProduct.productName}</p>
            <p><strong>Description:</strong> {fetchedProduct.description}</p>
            <p><strong>Price:</strong> {fetchedProduct.price}</p>
            <p><strong>Stock:</strong> {fetchedProduct.stock}</p>
          </div>
        )}
      </div>
      <div>
        <button onClick={handleViewItineraries}> {showingItineraries ? 'Hide itineraries' : 'Show itineraries'}</button>
        { showingItineraries && (
            <div>
            {Itineraries.length > 0 ? ( // Use 'itineraries' state variable for mapping
              Itineraries.map((itinerary) => (
                <div key={itinerary._id}>
                  <h4>Activities: {itinerary.Activities.join(', ')}</h4>
                  <p>Locations: {itinerary.Locations.join(', ')}</p>
                </div>
              ))
            ) : (
              <p>No itineraries found.</p>
            )}
          </div>
        )}
      </div>
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/historical-locations')}>Historical Locations</li>
          <li onClick={() => navigate('/museums')}>Museums</li>
          <li onClick={() => navigate('/products')}>Products</li>
          <li onClick={() => navigate('/itineraries')}>Itineraries</li>
          <li onClick={() => navigate('/activities')}>Activities</li>
          <li onClick={() => navigate('/book-flights')}>Book Flights</li>
          <li onClick={() => navigate('/book-hotels')}>Book a Hotel</li>
          <li onClick={() => navigate('/book-transportation')}>Book Transportation</li>
          <li onClick={() => navigate('/tourist-orders')}>Past Orders</li>

        </ul>
      </div>

      {/* File Complaint Form */}
      <div>
        <h3>File a Complaint</h3>
        <form onSubmit={handleSubmitComplaint}>
          <div>
            <label><strong>Title:</strong></label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label><strong>Body:</strong></label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label><strong>Date:</strong></label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">File Complaint</button>
        </form>
      </div>

      {/* Display Complaints */}
      <div>
        <h3>Your Complaints</h3>
        {complaints.length === 0 ? (
          <p>No complaints filed yet.</p>
        ) : (
          <ul>
            {complaints.map((complaint) => (
              <li key={complaint._id}>
                <p><strong>Title:</strong> {complaint.title}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <p><strong>Date:</strong> {new Date(complaint.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TouristProfile;
