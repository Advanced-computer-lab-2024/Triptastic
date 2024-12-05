import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';
import { FaUserCircle, FaBell,FaSearch, FaBox, FaLandmark, FaUniversity, FaMap, FaRunning, FaPlane, FaHotel, FaClipboardList, FaStar, FaBus } from 'react-icons/fa';
import { MdNotificationImportant } from 'react-icons/md';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Tooltip } from 'react-tooltip'; // Updated import

const SellerProfile = () => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [error, setError] = useState('');
  const [seller, setSeller] = useState(localStorage.getItem('Username') || '');
  console.log(localStorage.getItem('Username')); // Default to logged-in user
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [productNameToSearch, setProductNameToSearch] = useState('');
  const [productSearchResult, setProductSearchResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [productNameToArchive, setProductNameToArchive] = useState(''); // New state variable
  const [logo, setLogo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLogoPreview, setModalLogoPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [editProductId, setEditProductId] = useState(null);
  const [editProductData, setEditProductData] = useState({
    productName: '',
    description: '',
    price: '',
    stock: '',
    rating: ''
  });
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
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({
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
    fetchSellerProducts();

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

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
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

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSubmit = new FormData(); // Create FormData object
    for (const key in productFormData) {
      formDataToSubmit.append(key, productFormData[key]); // Append each field
    }

    try {
      const response = await fetch('http://localhost:8000/createProductSeller', {
        method: 'POST',
        body: formDataToSubmit, // Send the FormData
      });

      if (response.ok) {
        const newProduct = await response.json();
        alert('Product added successfully!');
        setProductFormData({
          productName: '',
          description: '',
          price: '',
          rating: '',
          seller: sellerInfo.Username,
          review: '',
          stock: '',
          image: null // Reset image after successful submission
        });
        setErrorMessage('');
        setAddingProduct(false);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the product');
      console.error(error);
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

  const fetchSellerProducts = async () => {
    if (!seller) {
      setError('Seller username is required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8000/viewMyProducts?seller=${seller}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const products = await response.json();
      setSellerProducts(products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }
  
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
const handleSaveProduct = async (productId) => {
  // Save the updated product data to the server...
  // After saving, update the sellerProducts state and reset editProductId
  try {
    const response = await fetch(`http://localhost:8000/updateProduct?productId=${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editProductData),
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      setSellerProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId ? updatedProduct : product
        )
      );
      setEditProductId(null);
    } else {
      console.error('Failed to update product');
    }
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

const togglePasswordModal = () => setShowPasswordModal(!showPasswordModal);
  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  const handleProductEdit = (productId) => {
    const product = sellerProducts.find((product) => product._id === productId);
    setEditProductId(productId);
    setEditProductData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating
    });
  };
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>




        <h1 style={styles.title}>Seller Profile</h1>
  
        {/* Products Icon */}
        <FaBox title=" View Products"
          size={22}
          style={{ cursor: 'pointer', color: 'white', marginRight: '-490px' }}
          onClick={() => navigate('/products')} // Navigate to Products page
        />
  
        {/* Notification Bell */}
        <FaBell title="Notifications"
          size={22}
          style={{ cursor: 'pointer', color: 'white', marginRight: '-490px' }}
          onClick={handleNotificationClick}
        />
         <LockResetIcon title="Change Password"
            alt="Profile Icon"
            style={{cursor: 'pointer', color: 'white', marginRight: '-490px' }}
            onClick={togglePasswordModal}
          />
        
  
        {/* Profile Icon */}
        <ManageAccountsIcon title="Edit Profile"

          style={styles.profileIcon}
          onClick={toggleModal} // Open modal on click
        />
      </header>
  
    {/* Notification Bell Icon */}
 

      {/* Notification Count */}
      {notifications && notifications.length > 0 && (
        <span
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
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
                  fontSize: '14px',
                }}
              >
                <MdNotificationImportant
                  size={20}
                  style={{ marginRight: '10px', color: '#ff9800' }}
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

   {/* Add Product Section */}
   <div style={styles.card}>
    <h3 style={styles.cardTitle}>Add Product <Inventory2Icon/></h3>
    <form onSubmit={handleProductSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Product Name"
        name="productName"
        value={productFormData.productName}
        onChange={handleProductInputChange}
        required
        style={styles.input}
      />
      <textarea
        placeholder="Description"
        name="description"
        value={productFormData.description}
        onChange={handleProductInputChange}
        required
        style={styles.textarea}
      />
      <input
        type="number"
        placeholder="Price"
        name="price"
        value={productFormData.price}
        onChange={handleProductInputChange}
        required
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Stock"
        name="stock"
        value={productFormData.stock}
        onChange={handleProductInputChange}
        required
        style={styles.input}
      />
    <div style={styles.fileUploadContainer}>
  <label style={styles.fileLabel} htmlFor="file-upload">
    <strong
      style={{
        color: '#0F5132',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        cursor: 'pointer',
      }}
    >
      Upload Product Image
      <AddPhotoAlternateIcon style={styles.iconButton} />
    </strong>
  </label>

  <input
    id="file-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    required
    style={styles.fileInput}
  />

  {imagePreview && (
    <img
      src={imagePreview}
      alt="Product Preview"
      style={styles.imagePreview}
    />
  )}
</div>
      <button type="submit" style={styles.submitButton}>
        Submit Product
      </button>

    </form>
  </div>
  <div style={styles.card}>
  <h1 style={styles.cardTitle}>My Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}
      {sellerProducts.length === 0 && !loading ? (
        <p>No products found.</p>
      ) : (
        <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Product Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Rating</th>
            <th style={styles.th}></th> {/* Add a column for buttons */}
          </tr>
        </thead>
        <tbody>
          {sellerProducts.map((product) => (
            <tr key={product._id} style={styles.tr}>
              <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="productName"
                      value={editProductData.productName}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.productName
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="description"
                      value={editProductData.description}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.description
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editProductData.price}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="stock"
                      value={editProductData.stock}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="rating"
                      value={editProductData.rating}
                      onChange={handleInputChange2}
                    />
                  ) : (
                    product.rating
                  )}
                </td>
                <td style={styles.td}>
                  {editProductId === product._id ? (
                    <button
                      style={styles.button}
                      onClick={() => handleSaveProduct(product._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      style={styles.button}
                      onClick={() => handleProductEdit(product._id)}
                    >
                      Edit
                    </button>
                  )}
                </td>
            </tr>
          ))}
        </tbody>
      </table>
      
     
      )}
  </div>

  {/* Search Product Section */}
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>Search Product to Archive</h3>
    <form onSubmit={getProductByName} style={styles.formSearch}>
      <input
        type="text"
        placeholder="Enter Product Name"
        value={productNameToSearch}
        onChange={(e) => setProductNameToSearch(e.target.value)}
        required
        style={styles.input}
      />
      <button type="submit" style={styles.searchButton} disabled={loading}>
        <FaSearch style={{ marginRight: '5px' }} />
        Search
      </button>
    </form>
    <button onClick={()=>navigate('/sellerReport')} >Sales report</button>
    {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
    {successMessage && (
      <p style={styles.successMessage}>{successMessage}</p>
    )}
    {productSearchResult && (
      <div style={styles.searchResult}>
        <h4 style={styles.resultTitle}>Product Details</h4>
        <p><strong>Name:</strong> {productSearchResult.productName}</p>
        <p><strong>Description:</strong> {productSearchResult.description}</p>
        <p><strong>Price:</strong> {productSearchResult.price}</p>
        <p><strong>Rating:</strong> {productSearchResult.rating}</p>
        <p><strong>Seller:</strong> {productSearchResult.seller}</p>
        <p>
          <strong>Archived:</strong>{' '}
          {productSearchResult.archived !== undefined
            ? productSearchResult.archived.toString()
            : 'N/A'}
        </p>
        <button
          onClick={archiveProduct}
          disabled={loading}
          style={styles.archiveButton}
        >
          Archive Product
        </button>
        <button
          onClick={unarchiveProduct}
          disabled={loading || !productSearchResult.archived}
          style={styles.unarchiveButton}
        >
          Unarchive Product
        </button>
      </div>
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
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
    display: 'flex', alignItems: 'center', gap: '5px',
    color: '#0F5132',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '80%', // Maintain consistent form width
    alignItems: 'center', // Center-align the form
    margin: '0 auto', // Center the form on the page
  },
  input: {
    width: '100%', // Ensure inputs span the full width of the form
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
  },
  textarea: {
    width: '100%', // Ensure the textarea matches input width
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    resize: 'none',
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  fileLabel: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    //backgroundColor: '#0F5132',
    color: '#0F5132',
    //borderRadius: '50%',
    //padding: '10px',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  fileInput: {
    display: 'none', // Hides the native file input
  },
  imagePreview: {
    marginTop: '10px',
    width: '150px',
    height: '150px',
    objectFit: 'cover',
    border: '1px solid #ddd',
    borderRadius: '5px',
  },
  submitButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    bottom:'50px'
  },
  formSearch: {
    position: 'relative', // Set the parent element's position
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '40%', // Maintain consistent form width
    alignItems: 'center', // Center-align the form
    marginLeft: '60px', // Center the form on the page
  },
  searchButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    position: 'absolute', // Make the button positioned relative to the parent
right:'-100px' ,   display: 'flex',
bottom:'-17px',
    alignItems: 'center',
    marginBottom:'20px'
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
  archiveButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  unarchiveButton: {
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    textAlign: 'left',
    backgroundColor: '#0F5132',
    color: 'white',
    padding: '10px',
    border: '1px solid #ddd',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'left',
  },
  tr: {
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};



export default SellerProfile;
