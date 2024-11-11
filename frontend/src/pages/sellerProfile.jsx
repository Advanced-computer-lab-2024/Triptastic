import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
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
      const logoURL = URL.createObjectURL(file);
      setLogo(logoURL); // Display the selected logo immediately
      setFormData((prevData) => ({
        ...prevData,
        Logo: file, // Store the file for uploading
      }));
    }
  };

 useEffect(() => {
  
  fetchSellerInfo();
}, []);

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


  const handleCurrentPasswordChange = (e) => setCurrentPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);
  return (
    <div className="seller-profile-container">
      <div className="profile-content">
        <h2>Seller Profile</h2>
        <div>
  <h3>Change Password</h3>
  {passwordMessage && <p style={{ color: passwordMessage.includes('successfully') ? 'green' : 'red' }}>{passwordMessage}</p>}
  <div>
    <label>Current Password:</label>
    <input
      type="password"
      value={currentPassword}
      onChange={handleCurrentPasswordChange}
    />
  </div>
  <div>
    <label>New Password:</label>
    <input
      type="password"
      value={newPassword}
      onChange={handleNewPasswordChange}
    />
  </div>
  <button onClick={handlePasswordChange} disabled={changingPassword}>
    {changingPassword ? 'Changing Password...' : 'Change Password'}
  </button>
</div>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading seller information...</p>
        ) : (
          sellerInfo && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              {logo && <img src={`http://localhost:8000/${logo.replace(/\\/g, '/')}`} alt="Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} />}
                <label><strong>Username:</strong></label>
                <p> {sellerInfo.Username}</p> {/* Display Username with logo */}
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
                  type="password" // Visible password
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label><strong>Description:</strong></label>
                <input
                  type="text"
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </div>

              {/* New Logo Upload Section */}
              <div>
                <label><strong>Upload Logo:</strong></label>
                <input
                  type="file"
                  accept="image/*" // This allows any image type
                  onChange={handleLogoChange}
                />
              </div>

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchSellerInfo}>Refresh Profile</button>

        {/* Button to Show Add Product Form */}
{!addingProduct && (
  <button onClick={() => setAddingProduct(true)}>Add Product</button>
)}

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

{/* Product Form */}
{addingProduct && (
  <form onSubmit={handleProductSubmit}>
    <h3>Add Product</h3>
    <div>
      <label><strong>Product Name:</strong></label>
      <input
        type="text"
        name="productName"
        value={productFormData.productName}
        onChange={handleProductInputChange}
        required
      />
    </div>
    <div>
      <label><strong>Description:</strong></label>
      <input
        type="text"
        name="description"
        value={productFormData.description}
        onChange={handleProductInputChange}
        required
      />
    </div>
    <div>
      <label><strong>Price:</strong></label>
      <input
        type="number"
        name="price"
        value={productFormData.price}
        onChange={handleProductInputChange}
        required
      />
    </div>
    <div>
      <label><strong>Rating:</strong></label>
      <input
        type="number"
        name="rating"
        value={productFormData.rating}
        onChange={handleProductInputChange}
        required
      />
    </div>
    <div>
      <label><strong>Stock:</strong></label>
      <input
        type="number"
        name="stock"
        value={productFormData.stock}
        onChange={handleProductInputChange}
        required
      />
    </div>
    <div>
      <label><strong>Image:</strong></label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        required
      />
    </div>
    {imagePreview && <img src={imagePreview} alt="Product Preview" style={{ width: '100px', height: '100px' }} />}
    
    {/* Submit Button */}
    <button type="submit">Submit Product</button>
  </form>
)}
        
        {waiting && <p>Waiting for deletion request...</p>}
        <button onClick={handleDeleteRequest} disabled={waiting}>
          Request Account Deletion
        </button>
      </div>
      <div className="sidebar">
        <h3>Explore</h3>
        <ul>
          <li onClick={() => navigate('/products')}>Products</li>
        </ul>
      </div>
    </div>
  );
  
};

export default SellerProfile;
