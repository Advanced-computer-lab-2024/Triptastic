import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';
import { FaUserCircle, FaBell,FaSearch, FaBox, FaPlus, FaUniversity, FaMap, FaRunning, FaPlane, FaHotel, FaClipboardList, FaStar, FaBus } from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Tooltip } from 'react-tooltip'; // Updated import
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';

const SellerProfile = () => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(localStorage.getItem('Username') || '');
  console.log(localStorage.getItem('Username')); // Default to logged-in user
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
 
  const [logo, setLogo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLogoPreview, setModalLogoPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [editProductId, setEditProductId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);


  const [productFormData, setProductFormData] = useState({
    productName: '',
    description: '',
    price: '',
    rating: '',
    seller: '',
    review: '',
    stock: '',
    image: null // Change to null to store the file
  });

  
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Name: '',
    Description: '',
    Logo:''
  });
 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
 

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const logoPreviewURL = URL.createObjectURL(file);
      setModalLogoPreview(logoPreviewURL); // Update the modal-specific preview
      setFormData((prevData) => ({
        ...prevData,
        Logo: file, // Store the file for uploading
      }));
    }
  };
  
  const addNotification = (message) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id: Date.now(), message },
    ]);
  };
  useEffect(() => {
    fetchSellerInfo();
    checkoutOfStock(); // Automatically call checkoutOfStock when profile is opened
    fetchNotifications();

  }, []);
  const fetchNotifications = async () => {
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch(`http://localhost:8000/getNotificationsForSeller?Username=${Username}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []); // Fallback to an empty array if undefined
      } else {
        console.error('Failed to fetch notifications');
        setNotifications([]); // Set to an empty array on error
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]); // Set to an empty array on error
    }
  };
  

  const handleNotificationClick = async () => {
    const Username = localStorage.getItem('Username');
  
    setShowNotifications((prev) => !prev);
  
    if (!showNotifications) {
      try {
        const response = await fetch(`http://localhost:8000/getNotificationsForSeller?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
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
    try {
      const response = await fetch('http://localhost:8000/checkAndNotifyOutOfStockSeller', {
        method: 'GET', // Use GET or any other appropriate method
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Update notifications state with unique notifications
        const newNotifications = data.notifications.filter(
          (notification) => !notifications.some((n) => n.message === notification.message)
        );
  
        if (newNotifications.length > 0) {
          setNotifications((prev) => [...prev, ...newNotifications]);
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
  


const fetchSellerInfo = async () => {
  setLoading(true);
  const Username = localStorage.getItem('Username');
  if (Username) {
    try {
      const response = await fetch(`http://localhost:8000/getSeller?Username=${Username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSellerInfo(data);
          setFormData(data);
          setProductFormData((prevData) => ({
            ...prevData,
            seller: data.Username,
          }));
          setErrorMessage('');

          // Set and persist the logo URL
          if (data.Logo) {
            const logoURL = data.Logo; // or data.logo, depending on what the backend returns
            setLogo(logoURL);
            localStorage.setItem('logo', logoURL); // Persist logo in local storage
          }
          
        } else {
          setErrorMessage('No seller information found.');
        }
      } else {
        throw new Error('Failed to fetch seller information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while fetching seller information');
      console.error(error);
    }
  } else {
    setErrorMessage('No seller information found.');
  }
  setLoading(false);
};

const handleUpdate = async () => {
  setUpdating(true);

  const formDataToSubmit = new FormData();
  formDataToSubmit.append('Username', formData.Username);
  formDataToSubmit.append('Email', formData.Email);
  formDataToSubmit.append('Password', formData.Password);
  formDataToSubmit.append('Name', formData.Name);
  formDataToSubmit.append('Description', formData.Description);

  if (formData.Logo) {
    formDataToSubmit.append('Logo', formData.Logo);
  }

  try {
    const response = await fetch('http://localhost:8000/updateSeller', {
      method: 'PATCH',
      body: formDataToSubmit,
    });

    if (response.ok) {
      const updatedSeller = await response.json();
      setSellerInfo(updatedSeller);
      setErrorMessage('');
      alert('Information updated successfully!');

      // Update and persist the logo URL
      if (updatedSeller.logo) {
        const logoURL = updatedSeller.logo;
        setLogo(logoURL);
        localStorage.setItem('logo', logoURL);
      }
    } else {
      throw new Error('Failed to update seller information');
    }
  } catch (error) {
    setErrorMessage('An error occurred while updating seller information');
    console.error(error);
  }
  setUpdating(false);
};

  

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setProductFormData((prevData) => ({
            ...prevData,
            image: file // Store the file object instead of URL
        }));

        // Create a local URL for the image and set it to the imagePreview state
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
    }
};

  
  const handleDeleteRequest = async () => {
    const Username = localStorage.getItem('Username');
    setWaiting(true);
    setRequestSent(false);
    try {
      const response = await fetch(`http://localhost:8000/requestAccountDeletionSeller?Username=${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequestSent(true);
        alert('Your account deletion request has been submitted and is pending approval.');
      } else {
        setRequestSent(false);
        alert(data.msg);
      }
    } catch (error) {
      alert('Error deleting account');
    }
    finally {
      setWaiting(false);
    }


  };
  
  const handlePasswordChange = async () => {
    setChangingPassword(true);
    const Username = localStorage.getItem('Username');

    try {
      const response = await fetch('http://localhost:8000/changePasswordSeller', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Username,
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setPasswordMessage('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        const data = await response.json();
        setPasswordMessage(data.error || 'Failed to change password');
      }
    } catch (error) {
      setPasswordMessage('An error occurred while changing the password');
      console.error(error);
    }
    setChangingPassword(false);
  };
const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  

  const [Products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [mostSold, setMostSold] = useState();
  const [leastSold, setLeastSold] = useState();
  const [DatesQuant, setDatesQuant] = useState([]);
  const [filteredD,setFilteredD]=useState(false);
  const [filterP, setFilterP] = useState(null); //product chosen in drop down menu
  const [date, setDate] = useState(''); // dates of the chosen product
  const [count,setCount]=useState(0);// count of the chosen product
  const [filteredP, setFilteredP] = useState(false); //is it filtered by product
  const [productQuantity, setProductQuantity] = useState([]);
  
    const fetchProducts= async () => {
      const Username = localStorage.getItem('Username');
      setIsLoading(true);
      if (Username) {
        try {
          const response = await fetch(`http://localhost:8000/viewMyProducts?seller=${Username}`);
          if (response.ok) {
            const data = await response.json();
            setProducts(data);
            setIsLoading(false);
          } else {
            throw new Error('Failed to fetch products');
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };
    const filterByProduct = async (productName) => { //returns object {date}
      try{
        const response = await fetch(`http://localhost:8000/filterByProduct?productName=${productName}`);
        if (response.ok) {
          const data = await response.json();
          setDatesQuant(data);
          //fucntion to add all the quantities
          console.log(data);
        }
        else {
          console.error('Failed to fetch data');
        }
      }
        catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      const fetchFilteredProducts = async (date) => {// returns array of products}
          const Username = localStorage.getItem('Username');
          setIsLoading(true);
          try{
          const response = await fetch(`http://localhost:8000/getFilteredProducts?Username=${Username}&date=${date}`);
          if (response.ok) {
              const data = await response.json();
              setProductQuantity(data);
              setIsLoading(false);
          } else {
              console.error('Failed to fetch products');
          }
          } catch (error) {
              console.error('Error fetching products:', error);
          }
      };
      const calculateTotalSales = (x) => {
          const products = x.map((item) => {
              return item.product ? item.product : item;
            });
          const total = products.reduce((sum, product) => sum + product.sales, 0);
          setTotalSales(total);
        };
        const findMostSold = (x) => {
          const products = x.map((item) => {
              return item.product ? item.product : item;
            });
          if (products.length > 0) {
            const mostSoldProduct = products.reduce((max, product) => (product.sales > max.sales ? product : max), products[0]);
            setMostSold(mostSoldProduct);
          }
        };
      
        const findLeastSold = (x) => {
          const products = x.map((item) => {
              return item.product ? item.product : item;
            });
          if (products.length > 0) {
            const leastSoldPRoduct = products.reduce((min, product) => (product.sales < min.sales ? product : min), products[0]);
            setLeastSold(leastSoldPRoduct);
          }
        };
        const handleFilterD = () => {
          if(!filteredD){
              fetchFilteredProducts(date);
              setFilteredD(true);
              findMostSold(productQuantity);
              findLeastSold(productQuantity);
          }else{
              fetchProducts();
              setFilteredD(false);
              findMostSold(Products);
              findLeastSold(Products);
          }
          };
          useEffect(() => {
              fetchProducts()
              calculateTotalSales(Products);
              findMostSold(Products);
              findLeastSold(Products);
            }, [refresh]);
          const handleFilterChange = (event) => {
              const selectedProduct = Products.find(product => product._id === event.target.value);
              if (selectedProduct) {
                filterByProduct(selectedProduct.productName);
                setFilteredP(true);
                setFilterP(selectedProduct);
              }
              else {
                setFilteredP(false);
              }
            };
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
  <div style={styles.logoContainer}>
    <img src={image} alt="Logo" style={styles.logo} />
  </div>

  <h1 style={styles.title}>Seller Profile</h1>

  {/* Icons Container */}
  <div style={styles.iconContainer}>
   
   
    {/* Notification Bell */}
    <FaBell
      title="Notifications"
      size={22}
      style={styles.icon}
      onClick={handleNotificationClick}
    />

    {/* Profile Icon */}
    <ManageAccountsIcon
      title="Edit Profile"
      style={styles.profileIcon}
      onClick={() => setShowDropdown((prev) => !prev)} // Toggle dropdown
      />

    {/* Logout Icon */}
    <LogoutOutlinedIcon
      style={styles.logoutIcon}
      onClick={() => navigate('/Guest')}
    />

{showDropdown && (
    <div style={styles.dropdownMenu}>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          toggleModal(); // Open Edit Profile modal
        }}
      >
        Edit Profile
      </div>
      <div
        style={styles.dropdownItem}
        onClick={() => {
          setShowDropdown(false); // Close dropdown
          togglePasswordModal(); // Open Change Password modal
        }}
      >
        Change Password
      </div>
    </div>
  )}
  </div>


      
  
    {/* Notification Bell Icon */}
 

      {/* Notification Count */}
      {notifications && notifications.length > 0 && (
        <span
        style={{
          position: 'absolute',
          top: 0,
          right: 150,
          backgroundColor: '#ff4d4d',
          color: 'white',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
            top: '50px',
            right: '70px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden',
            zIndex: 1000,
          }}
        >
          <div style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>
            Notifications
          </div>
          <ul style={{ listStyle: 'none', padding: '0', margin: '0',  flexDirection: 'column', // Stack items vertically
    gap: '10px' }}>
            {notifications && notifications.map((notification) => (
              <li
                key={notification.id}
                style={{
                  
                  display: 'flex',
                  flexDirection: 'row', // Align icon and text horizontally
                  alignItems: 'flex-start', // Align icon with the top of the text
                  backgroundColor: '#f9f9f9', // Light background for each item
                  border: '1px solid #ddd', // Add subtle border
                  borderRadius: '5px', // Rounded corners
                  padding: '10px', // Add padding inside each item
                  borderBottom: '1px solid #f0f0f0',
                  padding: '10px',
                  fontSize: '10px',
                }}
              >
                <MdNotificationImportant
                  size={20}
                  style={{marginRight: '10px', color: '#ff9800' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>{notification.message}</p>
                  <p style={{ margin: '5px 0 0', fontSize: '12px', color: '#888' }}>
                    {new Date(notification.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}{' '}
                    at{' '}
                    {new Date(notification.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {!notifications || notifications.length === 0 ? (
            <div
              style={{
                padding: '20px',
                textAlign: 'center',
                color: '#888',
                fontSize: '14px',
              }}
            >
              No new notifications
            </div>
          ) : null}
        </div>
      )}
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
            <div className="profile" style={styles.item} onClick={() => navigate('/seller-profile')}>
            <FaUserCircle style={styles.iconn} />
            <span className="label" style={styles.label}>
              Profile
            </span>
          </div>
          <div className="products" style={styles.item} onClick={() => navigate('/products_seller')}>
            <FaBox style={styles.iconn} />
            <span className="label" style={styles.label}>
              All Products
            </span>
          </div>
          <div className="my products" style={styles.item} onClick={() => navigate('/sellerProduct')}>
            <FaPlus style={styles.iconn} />
            <span className="label" style={styles.label}>
              My Products
            </span>
          </div>
         
        </div>
       <div>
       <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        <button onClick={() => handleFilterD()}>
            {filteredD ? 'Clear filter' : 'Filter'}
          </button>
          <div>
              <label htmlFor="productDropdown">Filter by Product:</label>
              <select
                id="productDropdown"
                value={filterP ? filterP._id : ''}
                onChange={handleFilterChange}
                style={{ marginLeft: '10px' }}
              >
                <option value="">Select an product</option>
                {Products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.productName}
                  </option>
                ))}
              </select>
            </div>
          {!filteredP && !filteredD && (<h2>Total profit from sales: {totalSales}</h2>)}
          {!filteredP && !filteredD && (<h3>Most sold product</h3>)}
          {!filteredP && !filteredD && !isLoading && mostSold && (
            <div>
              <p>Product: {mostSold.productName}</p>
              <p>Price: {mostSold.price}</p>
              <p>Sales: {mostSold.sales}</p>
              <p>
                Times purchased: {mostSold.sales === 0 ? 0 : mostSold.sales / mostSold.price}
              </p>
            </div>
          )}
         {!filteredP && !filteredD && ( <h3>Least sold product</h3>)}
          {!filteredP && !filteredD && !isLoading && leastSold && (
            <div>
              <p>Product: {leastSold.productName}</p>
              <p>Price: {leastSold.price}</p>
              <p>Sales: {leastSold.sales}</p>
              <p>
                Times purchased: {leastSold.sales === 0 ? 0 : leastSold.sales / leastSold.price}
              </p>
            </div>
          )}
        </div>
        <div>
        {filteredP && (
  <div>
    <h2>Selected product</h2>
    <p>Name: {filterP.productName}</p>
    <p>Price: {filterP.price}</p>
    <p>Sales: {filterP.sales}</p>

    {/* Render purchase dates */}
    <ul>
      {DatesQuant.map((dateQuant, index) => (
        <li key={index}>
          {/* Accessing the `createdAt` field to display */}
          <p>Purchased on: {new Date(dateQuant.createdAt).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>

  


  </div>
)}

        </div>
        <div>
         { !filteredP && (<h3>All products</h3>)}
          {isLoading && <p>Loading...</p>}
          {filteredD &&(
            <div>
                <h3>Filtered products</h3>
                <ul>
             {productQuantity.map((product, index) => (
                 <li key={index}>
               <h2>Product: {product}</h2>
                          </li>
               ))}
                 </ul>

           </div>

          )}
          {!filteredP && !filteredD && !isLoading && Products.length > 0 ? (
            Products.map((Product) => (
              <div key={Product._id}>
                <p>Product: {Product.productName}</p>
                <p>Price: {Product.price}</p>
                <p>Sales: {Product.sales}</p>
                <p>
                  Times purchased: {Product.sales === 0 ? 0 : Product.sales / Product.price}
                </p>
              </div>
            ))
          ) :!filteredP && !filteredD && (
            <p>No products found.</p>
          )}
        </div>

      
      {/* Modal for Editing Profile */}
      {modalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
          <h2 style={styles.modalContentH2}>Edit Profile</h2>
          <HighlightOffOutlinedIcon
          onClick={toggleModal}
          style={styles.cancelIcon} // Apply cancel icon style
        />
      
          <div style={styles.photoSection}>
            
              {logo && (
                <img
                  src={`http://localhost:8000/${logo.replace(/\\/g, '/')}`}
                  alt="Seller Logo"
                  className="logo"
                  style={styles.profilePhoto}
                />
              )}
              <label style={styles.photoLabel}>
                  Update Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={styles.fileInput}
                  />
                </label>
              <h3>{sellerInfo.Username}</h3>
        </div>
            
              <label style={styles.modalContentLabel}>Email</label>
              <input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleInputChange}
                style={styles.modalContentTextarea}              />
            
           
              <label style={styles.modalContentLabel}>Name</label>
              <input
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleInputChange}
                style={styles.modalContentTextarea}              />
           

              <label style={styles.modalContentLabel}>Description</label>
              <textarea
                name="Description"
                value={formData.Description}
                onChange={handleInputChange}
                style={styles.modalContentInput}
                />
          
            
            <div style={styles.modalButtonsContainer}>
              <button
                onClick={handleUpdate}
                disabled={updating}
                style={{
                  ...styles.modalContentButton,
                  ...(updating ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                }}
              >
                {updating ? 'Updating...' : 'Save Changes'}
              </button>

              <button
                onClick={handleDeleteRequest}
                disabled={waiting || requestSent}
                style={{
                  ...styles.modalContentButton,
                  backgroundColor: '#dc3545',
                  ...(waiting || requestSent
                    ? { opacity: 0.6, cursor: 'not-allowed' }
                    : {}),
                }}
              >
                {waiting ? 'Waiting...' : requestSent ? 'Request Sent' : 'Delete Account'}
              </button>
            </div>


            
           
          </div>
        </div>
      )}


       {/* Password Modal */}
       {showPasswordModal && (
        
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalContentH2}>Change Password</h2>
            <HighlightOffOutlinedIcon
          onClick={togglePasswordModal}
          style={styles.cancelpasswordIcon} />
            {passwordMessage && (
        <p
          style={{
            color: passwordMessage.includes('successfully') ? 'green' : 'red',
            marginBottom: '15px', // Add spacing below the message
          }}
        >
          {passwordMessage}
        </p>
      )}
                  <input
              type="password"
              placeholder='Enter Current Password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.modalContentInput}
            />
            <input
              type="password"
              placeholder='Enter New Password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.modalContentInput}
            />

            <div style={styles.modalButtonsContainer}>
              <button
                onClick={handlePasswordChange}
                style={{
                  ...styles.modalContentButton,
                  backgroundColor: '#0F5132',
                }}
              >
                Change Password
              </button>
               

            </div>
          </div>
        </div>
      )}
             <Tooltip id="amenities-tooltip" place="top" />

    </div>

  );
  
  
  
};

const styles = {
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
  fileInput: {
    display: "none", // Hides the native file input
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
  dropdownMenu: {
    position: "absolute",
    top: "40px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    zIndex: 1000,
    minWidth: "150px",
    overflow: "hidden",
  },
  dropdownItem: {
    padding: "10px 15px",
    fontSize: "14px",
    color: "#333",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  dropdownItemHover: {
    backgroundColor: "#f5f5f5",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: '50px',
    width: 'auto',
  },
  title: {
    flex: 2,
    textAlign: 'center',
    fontSize: '24px',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '20px', // Consistent spacing between icons
  },
  icon: {
    cursor: 'pointer',
    color: 'white',
  },
  profileIcon: {
    cursor: 'pointer',
    color: 'white',
  },
  logoutIcon: {
    cursor: 'pointer',
    color: 'white',
  },
  photoSection : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  profilePhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  photoLabel: {
    cursor: 'pointer',
    color: '#0F5132',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
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
    marginLeft:'90px'
  },
  profileIcon: {
    fontSize: '30px',
    color: 'white',
    cursor: 'pointer',
  },
  logoutIcon: {
    cursor:'pointer'
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
  },
  modalContentLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'flex', alignItems: 'center', gap: '5px',
    color: '#555',
  },
  modalContentInput: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
  },
  modalContentTextarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    resize: 'vertical',
  },
  modalContentButton: {
    padding: '10px 20px',
    border: 'none',
    background: '#0F5132',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  passwordSection: {
    borderTop: '1px solid #ddd',
    marginTop: '20px',
    paddingTop: '15px',
  },
  cancelIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '500px', // Adjust placement
    top: '100px', // Adjust placement
  },
  cancelpasswordIcon: {
    color: '#0F5132', // Set the color of the icon
    fontSize: '30px', // Adjust the size as needed
    cursor: 'pointer', // Ensure it acts as a button
    position: 'absolute', // Position it correctly in the modal
    right: '490px', // Adjust placement
    top: '280px', // Adjust placement
  },
 
  
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  successMessage: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  searchResult: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
  },
  resultTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  
  error: {
    color: 'red',
    textAlign: 'center',
  },
};



export default SellerProfile;
