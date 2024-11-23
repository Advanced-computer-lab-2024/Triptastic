import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Email:''
  });
  const [requests, setRequests] = useState([]);
  const [createCategoryName, setCreateCategoryName] = useState('');
  const [searchCategoryName, setSearchCategoryName] = useState('');
  const [categorySearchResult, setCategorySearchResult] = useState(null);
  const [usernameToDelete, setUsernameToDelete] = useState('');
  const [userType, setUserType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState('');
  const [prefTagName, setPrefTagName] = useState('');
  const [createPrefTagMessage, setCreatePrefTagMessage] = useState('');
  const [prefTag, setPrefTag] = useState(null);
  const [error, setError] = useState('');
  const [newPrefTagName, setNewPrefTagName] = useState('');
  const [message, setMessage] = useState('');
  const [Itineraries,setItineraries]= useState('');
  const [touristItineraries,setTouristItineraries]= useState('');
  const [Activities,setActivities]= useState('');
  const [showingItineraries,setShowingItineraries]=useState(false);
  const [showingTouristItineraries,setShowingTouristItineraries]=useState(false);
  const [showingActivities,setShowingActivities]=useState(false);
  const [productNameToSearch, setProductNameToSearch] = useState('');
  const [productSearchResult, setProductSearchResult] = useState(null);
  const [productNameToArchive, setProductNameToArchive] = useState(''); // New state variable

  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [showStats, setShowStats] = useState(false); // State to toggle visibility

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
  
  
 
  const [productFormData, setProductFormData] = useState({
    productName: '',
    description: '',
    price: '',
    rating: '',
    seller: '',
    review: '',
    stock: '',
    image: ''
  });

  const [tourismGovData, setTourismGovData] = useState({
    Username: '',
    Password: ''
  });
  const [updateCategoryData, setUpdateCategoryData] = useState({
    currentName: '',
    newName: ''
  });

  const navigate = useNavigate();

  const handleViewItineraries=()=>{
    setShowingItineraries( prev=>!prev);
  }
  const handleViewActivities=()=>{
    setShowingActivities( prev=>!prev);
  }
  const handleViewTouristItineraries=()=>{
    setShowingTouristItineraries( prev=>!prev);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  useEffect(() => {
    getItineraries();
    getTouristItineraries();
    getActivities();
    checkoutOfStock();
  }, []);
  const checkoutOfStock = async () => {
    try {
      const response = await fetch('http://localhost:8000/checkAndNotifyOutOfStock', {
        method: 'GET', // Use GET or any other appropriate method
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Handle the data response accordingly
        console.log('Out of stock products checked:', data);
      } else {
        console.error('Failed to check out of stock products');
      }
    } catch (error) {
      console.error('Error occurred while checking out of stock:', error);
    }
  };
  const handleFlagActivity= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagActivity/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleFlagItinerary= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
  const handleFlagTouristItinerary= async(id)=>{
    try{
      const response = await fetch(`http://localhost:8000/flagTouristItinerary/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data.msg); 
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
      }
    }
    catch (error) {
      console.log(error);
    }
  }
const getItineraries= async ()=>{
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
const getTouristItineraries= async ()=>{
  try{
    const response = await fetch(`http://localhost:8000/getAllTouristItineraries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setTouristItineraries(data);
    }
  }
  catch (error) {
    console.error(error);
  }
}
const getActivities= async ()=>{
  try{
    const response = await fetch(`http://localhost:8000/getAllActivities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setActivities(data);
    }
  }
  catch (error) {
    console.error(error);
  }
}
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

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
const handleAddProduct = () => {
  
  const seller = formData.Username || ''; // Fallback to empty string if undefined
  setProductFormData((prevData) => ({
    ...prevData,
    seller: seller // Assign the seller here
  }));
  setAddingProduct(true);
};

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    handleAddProduct();
    const formData = new FormData();
    for (const key in productFormData) {
      formData.append(key, productFormData[key]);
    }
  
    try {
      const response = await fetch('http://localhost:8000/createProduct', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Product added successfully!');
        setProductFormData({
          productName: '',
          description: '',
          price: '',
          rating: '',
          seller: formData.Username,
          review: '',
          stock: '',
          image: null // Reset image after submission
        });
        setAddingProduct(false);
      } else {
        const errorData = await response.json(); // Get error data from response
        throw new Error(`Failed to create product: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      setErrorMessage(`An error occurred while creating the product: ${error.message}`);
      console.error(error);
    }
  };


  const fetchPrefTag = async () => {
    try {
        const response = await fetch(`http://localhost:8000/getPrefTag?PrefTagName=${prefTagName}`);
        if (!response.ok) {
            throw new Error('Failed to fetch preference tag');
        }
        const data = await response.json();
        setPrefTag(data.PrefTagName);
    } catch (err) {
        setError(err.message);
    }
};

const deletePrefTag = async () => {
  try {
      const response = await fetch('http://localhost:8000/deletePreftag', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ PrefTagName: prefTagName }),
      });

      if (!response.ok) {
          throw new Error('Failed to delete preference tag');
      }
      const data = await response.json();
      setMessage(data.msg); // Set success message
      setError('');
  } catch (err) {
      setError(err.message); // Set error message
      setMessage('');
  }
};
const updatePrefTag = async () => {
  try {
      const response = await fetch('http://localhost:8000/updatePreftag', {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ PrefTagName: prefTagName, newPrefTagName }),
      });

      if (!response.ok) {
          throw new Error('Failed to update preference tag');
      }
      const data = await response.json();
      setMessage(`Preference tag updated: ${JSON.stringify(data.PrefTagName)}`);
      setError('');
  } catch (err) {
      setError(err.message);
      setMessage('');
  }
};

//getproduct
const getProductByName = async (e) => {
  e.preventDefault();
  console.log("Search function triggered");


  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');
  setProductSearchResult(null);

  try {
    const response = await fetch(`http://localhost:8000/getProduct?productName=${productNameToSearch}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const product = await response.json();
      console.log(productSearchResult);
      setProductSearchResult(product);
      setProductNameToArchive(product.productName); // Store product name for archiving
      setSuccessMessage(`Product found successfully!: ${JSON.stringify(product.productName)}`);
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'Product not found.');
    }
  } catch (error) {
    setErrorMessage('An error occurred while searching for the product.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const archiveProduct = async () => {
  if (!productNameToArchive) {
    setErrorMessage('No product selected to archive.');
    return;
  }

  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const response = await fetch(`http://localhost:8000/archiveProduct/${productNameToArchive}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      setSuccessMessage(`Product "${productNameToArchive}" archived successfully.`);

      // Update the productSearchResult state to reflect the new archived status
      setProductSearchResult(prevProduct => ({
        ...prevProduct,
        archived: result.product.archived, // Ensure this matches the response structure
      }));
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'Failed to archive product.');
    }
  } catch (error) {
    setErrorMessage('An error occurred while archiving the product.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};
const unarchiveProduct = async () => {
  if (!productNameToArchive) {
    setErrorMessage('No product selected to unarchive.');
    return;
  }

  setLoading(true);
  setErrorMessage('');
  setSuccessMessage('');

  try {
    const response = await fetch(`http://localhost:8000/unarchiveProduct/${productNameToArchive}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const result = await response.json();
      setSuccessMessage(`Product "${productNameToArchive}" unarchived successfully.`);

      // Update the productSearchResult state to reflect the new archived status
      setProductSearchResult(prevProduct => ({
        ...prevProduct,
        archived: result.product.archived, // Ensure this matches the response structure
      }));
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.error || 'Failed to unarchive product.');
    }
  } catch (error) {
    setErrorMessage('An error occurred while unarchiving the product.');
    console.error(error);
  } finally {
    setLoading(false);
  }
};



  const createCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('http://localhost:8000/createCategory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Name: createCategoryName })
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Category "${data.Name}" created successfully!`);
        setCreateCategoryName('');
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

  const handleGetCategory = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
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
        setCategorySearchResult(data);
        setSuccessMessage(`Category ${data.Name} found!`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Category not found.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        setTourismGovData({ Username: '', Password: '' });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to add Tourism Governor.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while adding the Tourism Governor.');
      console.error(error);
    }
  };

  const handleTourismGovChange = (e) => {
    const { name, value } = e.target;
    setTourismGovData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  // Function to handle updating the category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
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
        setSuccessMessage(`Category "${data.Name}" updated successfully!`);
        setUpdateCategoryData({ currentName: '', newName: '' });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to update category.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategoryChange = (e) => {
    const { name, value } = e.target;
    setUpdateCategoryData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const deleteCategory = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

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
        setSuccessMessage(data.msg);
        setDeleteCategoryName('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to delete category.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while deleting the category.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
        body: JSON.stringify({ PrefTagName: prefTagName }),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatePrefTagMessage(`Preference Tag "${data.PrefTagName}" created successfully!`);
        setPrefTagName(''); // Reset the input field after successful creation
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
        body: JSON.stringify(changePasswordData)
      });
  
      if (response.ok) {
        const data = await response.json();
        setChangePasswordSuccess(data.message);
        setChangePasswordData({ Username: '', currentPassword: '', newPassword: '' });
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
  
  const updateComplaintStatus = async (e) => {
    e.preventDefault();
    setUpdateStatusLoading(true);
    setUpdateStatusError('');
    setUpdateStatusMessage('');
  
    try {
      const response = await fetch(`http://localhost:8000/updateComplaintStatus/${complaintIdToUpdate.trim()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: complaintStatus }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUpdateStatusMessage(data.message || 'Complaint status updated successfully.');
      } else {
        const errorData = await response.json();
        setUpdateStatusError(errorData.error || 'Failed to update complaint status.');
      }
    } catch (error) {
      setUpdateStatusError('An error occurred while updating the complaint status.');
      console.error(error);
    } finally {
      setUpdateStatusLoading(false);
    }
  };
 
    
  const fetchStatistics = async () => {
    setStatsLoading(true);
    setStatsError("");
    setStatistics(null); // Clear previous data

    try {
      const response = await fetch("http://localhost:8000/getUserStatistics");
      if (!response.ok) {
        throw new Error("Failed to fetch statistics");
      }
      const data = await response.json();
      setStatistics(data); // Set statistics data
      setShowStats(true); // Show statistics after fetching
    } catch (error) {
      setStatsError("An error occurred while fetching statistics.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleHideStatistics = () => {
    setShowStats(false); // Hide statistics
    setStatistics(null); // Clear statistics data
  };
  
    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetch('http://localhost:8000/getPendingDeletionRequests');
          const data = await response.json();
          setRequests(data);
        } catch (error) {
          console.error('Error fetching requests:', error);
        }
      };
  
      fetchRequests();
    }, []);
  
    const handleAccept = async (id) => {
      try {
        const response = await fetch('http://localhost:8000/acceptDeletionRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: id }),
        });
        const result = await response.json();
        alert(result.message);
        setRequests(requests.filter(request => request._id !== id));
      } catch (error) {
        console.error('Error accepting request:', error);
      }
    };
  
    const handleReject = async (id) => {
      try {
        const response = await fetch('http://localhost:8000/rejectDeletionRequest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: id }),
        });
        const result = await response.json();
        alert(result.message);
        setRequests(requests.filter(request => request._id !== id));
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    };
  
  return (
    <div>

      <h1>Admin Page</h1>
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
        <li onClick={() => navigate('/PromoCodeForm')}>Promo Codes</li>
          <li onClick={() => navigate('/products')}>Products</li>
        </ul>
      </div>
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
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Create Admin</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
      

      
      <h2>Users Statistics</h2>
      {!showStats ? (
        <button onClick={fetchStatistics} disabled={statsLoading}>
          {statsLoading ? "Loading..." : "View Users Statistics"}
        </button>
      ) : (
        <button onClick={handleHideStatistics}>
          Hide Users Statistics
        </button>
      )}
      {statsError && <p style={{ color: "red" }}>{statsError}</p>}
      {showStats && statistics && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Total Users:</strong> {statistics.totalUsers}</p>
          <h3>New Users per Month:</h3>
          {statistics.monthlyUsers && Object.keys(statistics.monthlyUsers).length > 0 ? (
            <table border="1" style={{ width: "50%", margin: "auto" }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>New Users</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(statistics.monthlyUsers).map(([month, count]) => (
                  <tr key={month}>
                    <td>{month}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No new users recorded this month.</p>
          )}
        </div>
      )}

      <h2>Change Admin Password</h2>
<form onSubmit={handleChangePassword}>
  <div>
    <label>Username:</label>
    <input
      type="text"
      name="Username"
      value={changePasswordData.Username}
      onChange={(e) =>
        setChangePasswordData((prevData) => ({
          ...prevData,
          Username: e.target.value
        }))
      }
      required
    />
  </div>
  <div>
    <label>Current Password:</label>
    <input
      type="password"
      name="currentPassword"
      value={changePasswordData.currentPassword}
      onChange={(e) =>
        setChangePasswordData((prevData) => ({
          ...prevData,
          currentPassword: e.target.value
        }))
      }
      required
    />
  </div>
  <div>
    <label>New Password:</label>
    <input
      type="password"
      name="newPassword"
      value={changePasswordData.newPassword}
      onChange={(e) =>
        setChangePasswordData((prevData) => ({
          ...prevData,
          newPassword: e.target.value
        }))
      }
      required
    />
  </div>
  <button type="submit" disabled={changePasswordLoading}>
    {changePasswordLoading ? 'Changing...' : 'Change Password'}
  </button>
  {changePasswordSuccess && <p style={{ color: 'green' }}>{changePasswordSuccess}</p>}
  {changePasswordError && <p style={{ color: 'red' }}>{changePasswordError}</p>}
</form>

<h2>View Complaint Details</h2>
<form onSubmit={fetchComplaintDetails}>
  <div>
    <label>Complaint ID:</label>
    <input
      type="text"
      value={complaintIdToSearch}
      onChange={(e) => setComplaintIdToSearch(e.target.value)}
      required
    />
  </div>
  <button type="submit" disabled={complaintLoading}>
    {complaintLoading ? 'Searching...' : 'Get Complaint Details'}
  </button>
  {complaintError && <p style={{ color: 'red' }}>{complaintError}</p>}
</form>

{complaintDetails && (
  <div>
    <h3>Complaint Details</h3>
    <p><strong>Title:</strong> {complaintDetails.title}</p>
    <p><strong>Body:</strong> {complaintDetails.body}</p>
    <p><strong>Date:</strong> {new Date(complaintDetails.date).toLocaleDateString()}</p>
    <p><strong>Username:</strong> {complaintDetails.username}</p>
    <p><strong>Status:</strong> {complaintDetails.status}</p>
  </div>
)}

<h2>Update Complaint Status</h2>
<form onSubmit={updateComplaintStatus}>
  <div>
    <label>Complaint ID:</label>
    <input
      type="text"
      value={complaintIdToUpdate}
      onChange={(e) => setComplaintIdToUpdate(e.target.value)}
      required
    />
  </div>
  <div>
    <label>Status:</label>
    <select
      value={complaintStatus}
      onChange={(e) => setComplaintStatus(e.target.value)}
      required
    >
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
    </select>
  </div>
  <button type="submit" disabled={updateStatusLoading}>
    {updateStatusLoading ? 'Updating...' : 'Update Status'}
  </button>
  {updateStatusError && <p style={{ color: 'red' }}>{updateStatusError}</p>}
  {updateStatusMessage && <p style={{ color: 'green' }}>{updateStatusMessage}</p>}
</form>

      <h2>Add Product</h2>
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
  <label>Image:</label>
  <input
    type="file"
    name="image"
    accept="image/*" // Allow only image files
    onChange={(e) => setProductFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0] // Store the selected file
    }))}
    required
  />
</div>
        <button type="submit">Add Product</button>
      </form>

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
      <h2>Get Preference Tag</h2>
            <input 
                type="text" 
                value={prefTagName} 
                onChange={(e) => setPrefTagName(e.target.value)} 
                placeholder="Enter Preference Tag Name" 
            />
            <button onClick={fetchPrefTag}>Fetch Preference Tag</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {prefTag && <div>{JSON.stringify(prefTag)}</div>}

            <h2>Delete Preference Tag</h2>
            <input 
                type="text" 
                value={prefTagName} 
                onChange={(e) => setPrefTagName(e.target.value)} 
                placeholder="Preference Tag Name" 
            />
            <button onClick={deletePrefTag}>Delete Preference Tag</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}

      <h2>Delete User</h2>
      <div>
        <label>Username to delete:</label>
        <input
          type="text"
          value={usernameToDelete}
          onChange={(e) => setUsernameToDelete(e.target.value)}
          required
        />
        <div>
          <label>Select User Type:</label>
          <select value={userType} onChange={(e) => setUserType(e.target.value)} required>
            <option value="">Select Type</option>
            <option value="Admin">Admin</option>
            <option value="TourismGov">Tourism Governor</option>
            <option value="Tourist">Tourist</option>
            <option value="Advertiser">Advertiser</option>
            <option value="Seller">Seller</option>
            <option value="TourGuide">tourGuide</option>

          </select>
        </div>
        <button onClick={handleDeleteUser} disabled={!usernameToDelete || !userType}>Delete User</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>

      <h2>Create Category</h2>
      <form onSubmit={createCategory}>
        <div>
          <label>Category Name:</label>
          <input
            type="text"
            value={createCategoryName}
            onChange={(e) => setCreateCategoryName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Create Category</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <h2>Update Preference Tag</h2>
            <input 
                type="text" 
                value={prefTagName} 
                onChange={(e) => setPrefTagName(e.target.value)} 
                placeholder="Current Preference Tag Name" 
            />
            <input 
                type="text" 
                value={newPrefTagName} 
                onChange={(e) => setNewPrefTagName(e.target.value)} 
                placeholder="New Preference Tag Name" 
            />
            <button onClick={updatePrefTag}>Update Preference Tag</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
      
      <h2>Update Category</h2>
      <form onSubmit={handleUpdateCategory}>
        <div>
          <label>Current Category Name:</label>
          <input
            type="text"
            name="currentName"
            value={updateCategoryData.currentName}
            onChange={handleUpdateCategoryChange}
            required
          />
        </div>
        <div>
          <label>New Category Name:</label>
          <input
            type="text"
            name="newName"
            value={updateCategoryData.newName}
            onChange={handleUpdateCategoryChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Update Category</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </form>
        {/* Create Preference Tag Section */}
        <h2>Create Preference Tag</h2>
      <form onSubmit={createPrefTag}>
        <div>
          <label>Preference Tag Name:</label>
          <input
            type="text"
            value={prefTagName}
            onChange={(e) => setPrefTagName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Create Preference Tag</button>
      </form>
      {createPrefTagMessage && <p>{createPrefTagMessage}</p>}

        {/* Delete Category Section */}
        <h2>Delete Category</h2>
      <form onSubmit={deleteCategory}>
        <div>
          <label>Category Name to Delete:</label>
          <input
            type="text"
            value={deleteCategoryName}
            onChange={(e) => setDeleteCategoryName(e.target.value)}
            required
          />
        </div>



              {/* Get Product by Name Section */}





        <button type="submit" disabled={loading}>Delete Category</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <h2>Search Product by Name</h2>
      <form onSubmit={getProductByName}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productNameToSearch}
            onChange={(e) => setProductNameToSearch(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Search Product</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {productSearchResult && (
        <div>
          <h3>Product Details</h3>
          <p>Name: {productSearchResult.productName}</p>
          <p>Description: {productSearchResult.description}</p>
          <p>Price: {productSearchResult.price}</p>
          <p>Rating: {productSearchResult.rating}</p>
          <p>Seller: {productSearchResult.seller}</p>
          <p>Archived: {productSearchResult.archived !== undefined ? productSearchResult.archived.toString() : 'N/A'}</p>
          <button onClick={archiveProduct} disabled={loading}>Archive Product</button>
          <button onClick={unarchiveProduct} disabled={loading || !productSearchResult.archived}>Unarchive Product</button>

          {/* Add more product details as needed */}
        </div>
      )}

      <h2>Search Category</h2>
      <div>
        <label>Category Name:</label>
        <input
          type="text"
          value={searchCategoryName}
          onChange={(e) => setSearchCategoryName(e.target.value)}
          required
        />
        <button onClick={handleGetCategory} disabled={loading}>Search Category</button>
        {categorySearchResult && <p>Category Found: {categorySearchResult.Name}</p>}
      </div>
      <div>
        <button onClick={handleViewItineraries}> {showingItineraries ? 'Hide Itineraries' : 'Show Itineraries'}</button>
        { showingItineraries && (
           <div>
           {Itineraries.length > 0 ? (
             Itineraries.map((itinerary) => (
               <div key={itinerary._id}>
                 <h4>Locations: {itinerary.Locations.join(', ')}</h4>
                 <p>Dates: {itinerary.DatesTimes}</p>
                 <button onClick={() => handleFlagItinerary(itinerary._id)}>Flag itinerary</button>
               </div>
             ))
           ) : (
             <p>No itineraries found.</p>
           )}
         </div>
        )}
      </div>
      <div>
        <button onClick={handleViewActivities}> {showingActivities ? 'Hide activities' : 'Show activities'}</button>
        { showingActivities && (
           <div>
           {Activities.length > 0 ? (
             Activities.map((activity) => (
               <div key={activity._id}>
                 <h4>Name: {activity.Name}</h4>
                 <p>Category: {activity.Category}</p>
                 <button onClick={() => handleFlagActivity(activity._id)}>Flag activity</button>
               </div>
             ))
           ) : (
             <p>No activities found.</p>
           )}
         </div>
        )}
      </div>
      <div>
        <button onClick={handleViewTouristItineraries}> {showingTouristItineraries ? 'Hide tourist itineraries' : 'Show tourist itineraries'}</button>
        { showingTouristItineraries && (
           <div>
           {touristItineraries.length > 0 ? (
             touristItineraries.map((touristItinerary) => (
               <div key={touristItinerary._id}>
                 <h4>Activities: {touristItinerary.Activities.join(', ')}</h4>
                 <p>Locations: {touristItinerary.Locations.join(', ')}</p>
                 <button onClick={() => handleFlagTouristItinerary(touristItinerary._id)}>Flag tourist itinerary</button>
               </div>
             ))
           ) : (
             <p>No tourist itineraries found.</p>
           )}
         </div>
        )}
      </div>
      <div>
      <h2>Pending Account Deletion Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              <p>Username: {request.Username}</p>
              <p>Request Date: {new Date(request.requestDate).toLocaleDateString()}</p>
              <p>Status: {request.status}</p>
              <button onClick={() => handleAccept(request._id)}>Accept</button>
              <button onClick={() => handleReject(request._id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
      <div>
      <button onClick={() => navigate('/Complaints')}>Go to complaints</button>
      </div>
      <div>
      <button onClick={() => navigate('/docs')}>See unsettled docs</button>
      </div>
      
     
    </div>
  );
};

export default AdminPage;
