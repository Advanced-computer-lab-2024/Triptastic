import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell,FaPlus,FaChartBar,FaBox  } from 'react-icons/fa'; // Importing bell icon
import { FaUserCircle} from 'react-icons/fa';
import logo from '../images/image.png'; // Adjust the path based on your folder structure
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';


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
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [statistics, setStatistics] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [showStats, setShowStats] = useState(false); // State to toggle visibility
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  


  const [complaintIdToSearch, setComplaintIdToSearch] = useState('');
  const [complaintDetails, setComplaintDetails] = useState(null);
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [complaintError, setComplaintError] = useState('');
  const [complaintIdToUpdate, setComplaintIdToUpdate] = useState('');
  const [complaintStatus, setComplaintStatus] = useState('pending');
  const [updateStatusMessage, setUpdateStatusMessage] = useState('');
  const [updateStatusError, setUpdateStatusError] = useState('');
  const [updateStatusLoading, setUpdateStatusLoading] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null); 

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  

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
    fetchNotifications();
    fetchStatistics();

  }, []);
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };
 
  const fetchNotifications = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/getNotificationsForAdmin?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications); // Assuming the response contains a "notifications" array
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
 

  
    
  
  const handleNotificationClick = async () => {
    const Username = localStorage.getItem('Username');
  
    setShowNotifications((prev) => !prev);
  
    if (!showNotifications) {
      try {
        const response = await fetch(`http://localhost:8000/getNotificationsForAdmin?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          if (!data.notifications || data.notifications.length === 0) {
            console.log('No new notifications found.');
            return;
          }
          // Filter and append unique notifications
          const uniqueNotifications = data.notifications.filter(
            (newNotification) =>
              !notifications.some((existingNotification) =>
                existingNotification.message === newNotification.message
              )
          );
  
          setNotifications((prev) => [...prev, ...uniqueNotifications]);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
  };
  const checkoutOfStock = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/checkAndNotifyOutOfStockAdmin?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Validate and merge notifications
        const newNotifications = data.notifications.filter(
          (notification) =>
            !notifications.some((n) => n.message === notification.message)
        );
  
        if (newNotifications.length > 0) {
          setNotifications((prev) => [...(prev || []), ...newNotifications]);
          console.log('New notifications added:', newNotifications);
        } else {
          console.log('No new notifications to add');
        }
      } else {
        console.error('Failed to check out-of-stock products');
      }
    } catch (error) {
      console.error('Error occurred while checking out-of-stock:', error);
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
  const [changePasswordData, setChangePasswordData] = useState({
    Username: '',
    currentPassword: '',
    newPassword: ''
  });
  
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState('');
  const [changePasswordError, setChangePasswordError] = useState('');


const [createAdminSuccess, setCreateAdminSuccess] = useState('');
const [createAdminError, setCreateAdminError] = useState('');

const createAdmin = async (e) => {
  e.preventDefault(); // Prevent the default form submission
  const { Username, Password, Email } = formData;

  setLoading(true);
  setCreateAdminSuccess(''); // Clear previous success message
  setCreateAdminError(''); // Clear previous error message

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
      setCreateAdminSuccess(`Admin "${data.Username}" created successfully!`);
      setFormData({ Username: '', Password: '', Email: '' }); // Reset the form
    } else {
      const errorData = await response.json();
      setCreateAdminError(errorData.error || 'Failed to create admin.');
    }
  } catch (error) {
    setCreateAdminError('An error occurred while creating the admin.');
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

  const toggleModal = (content = null) => {
    setModalOpen((prev) => !prev);
    setModalContent(content);
  
    // Reset the messages when the modal is closed
    if (!modalOpen) {
      setCreateAdminSuccess('');
      setCreateAdminError('');
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
    const Username = localStorage.getItem('Username'); // Assuming the Username is stored in local storage

    e.preventDefault();
    handleAddProduct();
    const formData = new FormData();
    for (const key in productFormData) {
      formData.append(key, productFormData[key]);
    }
  
    try {
      const response = await fetch(`http://localhost:8000/createProduct?Username=${Username}`, {
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
  


    const styles = {
      container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#0F5132',
        borderRadius: '12px',
        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        paddingTop: '100px', // Avoid overlap with the header
      },
      heading: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#0F5132", // Green theme
        marginBottom: "20px",
        textAlign: "center",
      },
      noRequestsMessage: {
        fontSize: "16px",
        color: "#555",
        textAlign: "center",
        marginTop: "20px",
      },
      requestsList: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
      },
      requestItem: {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        marginBottom: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      requestDetails: {
        flex: 1,
      },
      detail: {
        fontSize: "16px",
        margin: "5px 0",
        color: "#333",
      },
      buttonsContainer: {
        display: "flex",
        gap: "10px",
      },
      acceptButton: {
        padding: "10px 20px",
        backgroundColor: "#0F5132",
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
      rejectButton: {
        padding: "10px 20px",
        backgroundColor: "#C82333", // Red theme for reject
        color: "#fff",
        fontSize: "14px",
        fontWeight: "bold",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
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
        fontWeight: 'bold',
        color: 'white',
      },
      profileIcon: {
        fontSize: '40px',
        color: 'white',
        cursor: 'pointer',
      },
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
  error: {
    color: 'red',
    fontSize: '14px',
    textAlign: 'center',
  },
  success: {
    color: 'green',
    fontSize: '14px',
    textAlign: 'center',
  },
//statsitics 
  heading: {
    textAlign: 'center',
    fontSize: '24px',
    textAlign: 'left', // Change from 'center' to 'left'
    color: '#0F5132',
    marginBottom: '20px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loadingText: {
    textAlign: 'center',
    color: '#555',
  },
  statisticsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    alignItems: 'flex-start',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },

  tableContainer: {
    flex: '2',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tableHeading: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '10px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  tableHeader: {
    backgroundColor: '#0F5132',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    color: '#333',
  },
  noDataText: {
    fontSize: '14px',
    color: '#555',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFD700', // Bright gold color for emphasis
  },
  statCard: {
    backgroundColor: '#0F5132', // A sleek green card background
    color: '#fff', // White text for contrast
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  statTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#FFF', // Golden color for the title
  },
  statValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFF', // White text for the value
  },
  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Space between the icon and text
  },
  statisticsIcon: {
    color: "black", // Black color for the icon
    fontSize: "24px", // Size of the icon
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    color: "#0F5132", // Green theme for text
  },
  openModalButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
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
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    width: '50%',
    maxWidth: '600px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    maxHeight: '80vh', // Limit modal height
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // Ensure no overflow outside modal container
  },
  modalBody: {
    flex: 1,
    overflowY: 'auto', // Make modal scrollable
    paddingRight: '10px', // Add space for scroll bar
  },
  cancelIcon: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    color: '#dc3545',
    cursor: 'pointer',
  },
 
  modalContentH2: {
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
    marginBottom: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  iconContainer: {
    display: 'flex', // Enable flexbox
    alignItems: 'center', // Vertically align items
    justifyContent: 'space-between', // Even spacing between icons
    gap: '20px', // Space between each icon
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
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
  
  return (
  <div>
    <h1>Admin Page</h1>
    <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={logo} alt="Logo" style={styles.logo} />
  </div>
  <h1 style={styles.title}>Admin Profile</h1>
  <div style={styles.headerIconsContainer}>
    {/* Notification Bell */}
    <div
      style={styles.notificationButton}
      onClick={handleNotificationClick}
    >
    </div>
    <div style={styles.iconContainer}>
  {/* Products Icon */}
  <FaBox
    size={22}
    style={styles.profileIcon}
    onClick={() => navigate('/products')} // Navigate to Products page
  />

  {/* Edit Profile Icon */}
  <ManageAccountsIcon
    style={styles.profileIcon}
    title="Edit Profile"
    onClick={toggleModal} // Open modal on click
  />

  {/* Admin Settings Icon */}
  <FaUserCircle
    alt="Profile Icon"
    style={styles.profileIcon}
    onClick={() => navigate('/adminsettings')}
  />
</div>

    
  </div>
</header>
      <div className="sidebar">
        <ul>
        <li onClick={() => navigate('/PromoCodeForm')}>Promo Codes</li>
        <li onClick={() => navigate('/Complaints')}>Complaints</li>
        <li onClick={() => navigate('/preftags')}>Preference Tags</li>
        <li onClick={() => navigate('/docs')}>Docs</li>
  
      
        
        <div style={{ position: 'relative', textAlign: 'right', padding: '10px' }}>
      {/* Notification Bell Icon */}
      <FaBell
        size={24}
        style={{ cursor: 'pointer' }}
        onClick={handleNotificationClick}
      />

      {/* Notification Count */}
      {notifications && notifications.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 10,
            backgroundColor: 'red',
            color: 'white',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {notifications.length}
        </span>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '10px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '4px',
            width: '300px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 10,
          }}
        >
          <ul style={{ listStyle: 'none', padding: '10px', margin: 0 }}>
            {notifications && notifications.map((notification) => (
              <li
                key={notification.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  padding: '10px 0',
                  fontSize: '14px',
                }}
              >
                <p style={{ margin: 0, fontWeight: 'bold' }}>{notification.message}</p>
                <p style={{ margin: 0, fontSize: '12px', color: 'gray' }}>
                  {new Date(notification.date).toLocaleDateString()}{' '}
                  {new Date(notification.date).toLocaleTimeString()}
                </p>
              </li>
            ))}
          </ul>
          {!notifications || notifications.length === 0 && (
            <p style={{ padding: '10px', textAlign: 'center' }}>
              No notifications
            </p>
          )}
        </div>
      )}
    </div>
        </ul>
      </div>

      <div style={styles.headerContainer}>
  
      <h2 style={styles.heading}>Users Statistics</h2>
      <FaChartBar style={styles.statisticsIcon} />
    </div>
{statsError && <p style={styles.error}>{statsError}</p>}
{statistics ? (
 <div style={styles.statisticsContainer}>
 <div style={styles.statCard}>
   <p style={styles.statTitle}>Total Users</p>
   <p style={styles.statValue}>{statistics.totalUsers}</p>
 </div>
 <div style={styles.tableContainer}>
   <h3 style={styles.tableHeading}>New Users per Month</h3>
   {statistics.monthlyUsers && Object.keys(statistics.monthlyUsers).length > 0 ? (
     <table style={styles.table}>
       <thead>
         <tr>
           <th style={styles.tableHeader}>Month</th>
           <th style={styles.tableHeader}>New Users</th>
         </tr>
       </thead>
       <tbody>
         {Object.entries(statistics.monthlyUsers).map(([month, count]) => (
           <tr key={month}>
             <td style={styles.tableCell}>{month}</td>
             <td style={styles.tableCell}>{count}</td>
           </tr>
         ))}
       </tbody>
     </table>
   ) : (
     <p style={styles.noDataText}>No new users recorded this month.</p>
   )}
 </div>
</div>

) : (
  <p style={styles.loadingText}>Fetching statistics...</p>
)}


  
{/* Modal for Admin Settings */}
{modalOpen && (
  <div style={styles.modalOverlay}>
    <div style={styles.modalContent}>
      <h2 style={styles.modalContentH2}>Admin Settings</h2>
      <HighlightOffOutlinedIcon
        onClick={toggleModal}
        style={styles.cancelIcon} // Apply cancel icon style
      />

      <div style={styles.modalBody}>
        {/* Create Admin Form */}
        <form style={styles.form} onSubmit={createAdmin}>
          <h3 style={styles.modalContentH2}>Create Admin</h3>
          {/* Username Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Username: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Email Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Email: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Password Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  Password: e.target.value,
                }))
              }
              style={styles.input}
              required
            />
          </div>

          {/* Display Success or Error Message */}
          {createAdminSuccess && (
            <p style={{ color: 'green', textAlign: 'center' }}>
              {createAdminSuccess}
            </p>
          )}
          {createAdminError && (
            <p style={{ color: 'red', textAlign: 'center' }}>
              {createAdminError}
            </p>
          )}

          {/* Create Admin Button */}
          <button type="submit" style={styles.submitButton}>
            Create Admin
          </button>
        </form>

        <hr style={{ margin: '20px 0' }} />

        {/* Delete User Form */}
        <form style={styles.form} onSubmit={(e) => { e.preventDefault(); handleDeleteUser(); }}>
          <h3 style={styles.modalContentH2}>Delete User</h3>
          {/* Username Input */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Username to Delete:</label>
            <input
              type="text"
              value={usernameToDelete}
              onChange={(e) => setUsernameToDelete(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {/* User Type Dropdown */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Select User Type:</label>
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={styles.input}
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
          </div>

          {/* Display Success or Error Message */}
          {successMessage && (
            <p style={{ color: 'green', textAlign: 'center' }}>
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p style={{ color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </p>
          )}

          {/* Delete User Button */}
          <button type="submit" style={styles.deleteButton}>
            Delete User
          </button>
        </form>
      </div>
    </div>
  </div>
)}



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
      <h2 style={styles.heading}>Pending Account Deletion Requests</h2>
{requests.length === 0 ? (
  <p style={styles.noRequestsMessage}>No pending requests.</p>
) : (
  <ul style={styles.requestsList}>
    {requests.map((request) => (
      <li key={request._id} style={styles.requestItem}>
        <div style={styles.requestDetails}>
          <p style={styles.detail}>
            <strong>Username:</strong> {request.Username}
          </p>
          <p style={styles.detail}>
            <strong>Request Date:</strong> {new Date(request.requestDate).toLocaleDateString()}
          </p>
          <p style={styles.detail}>
            <strong>Status:</strong> {request.status}
          </p>
        </div>
        <div style={styles.buttonsContainer}>
          <button
            onClick={() => handleAccept(request._id)}
            style={styles.acceptButton}
          >
            Accept
          </button>
          <button
            onClick={() => handleReject(request._id)}
            style={styles.rejectButton}
          >
            Reject
          </button>
        </div>
      </li>
    ))}
  </ul>
)}

     
    </div>
  );
};

export default AdminPage;
