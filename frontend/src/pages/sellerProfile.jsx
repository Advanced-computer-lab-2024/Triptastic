import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SellerProfile = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false); // Track product form status

  const [fetchedProduct, setFetchedProduct] = useState(null);//new

  const [productFormData, setProductFormData] = useState({
    productName: '',
    description: '',
    price: '',
    rating: '',
    seller: '', // This will be auto-filled with the username later
    review: '',
    stock: '',
    image: ''
  });
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    Name: '',
    Description: ''
  });
  const navigate = useNavigate();

  const fetchSellerInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem('Username');
    if (Username) {
      try {
        const response = await fetch(`http://localhost:8000/getSeller?Username=${Username}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSellerInfo(data);
            setFormData(data); // Pre-fill the form with current data
            // Automatically set the seller username in the product form
            setProductFormData((prevData) => ({
              ...prevData,
              seller: data.Username // Set the seller field in the product form
            }));
            setErrorMessage('');
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

  useEffect(() => {
    fetchSellerInfo();
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
      const response = await fetch('http://localhost:8000/updateSeller', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedSeller = await response.json();
        setSellerInfo(updatedSeller);
        setErrorMessage('');
        alert('Information updated successfully!');
      } else {
        throw new Error('Failed to update seller information');
      }
    } catch (error) {
      setErrorMessage('An error occurred while updating seller information');
      console.error(error);
    }
    setUpdating(false);
  };

  // Handle product form input changes
  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle product submission
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/createProductSeller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productFormData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        alert('Product added successfully!');
        setProductFormData({
          productName: '',
          description: '',
          price: '',
          rating: '',
          seller: sellerInfo.Username, // Reset to seller's username
          review: '',
          stock: '',
          image: ''
        });
        setErrorMessage('');
        setAddingProduct(false); // Close the product form
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the product');
      console.error(error);
    }
  };

    // New function to fetch a product by name
    const fetchProductByName = async (productName) => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/getProductSeller?productName=${productName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const product = await response.json();
          setFetchedProduct(product);
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
  
    // Call this function based on user action (e.g., button click)
    const handleFetchProduct = () => {
      const productName = productFormData.productName; // Assuming you use the productFormData to search
      fetchProductByName(productName);
    };

  return (
    <div className="seller-profile-container">
      <div className="profile-content">
        <h2>Seller Profile</h2>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {loading ? (
          <p>Loading seller information...</p>
        ) : (
          sellerInfo && (
            <div>
              <div>
                <label><strong>Username:</strong></label>
                <p>{sellerInfo.Username}</p> {/* Display Username as text */}
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

              <button onClick={handleUpdate} disabled={updating}>
                {updating ? 'Updating...' : 'Update Information'}
              </button>
            </div>
          )
        )}
        <button onClick={fetchSellerInfo}>Refresh My Information</button>

        {/* Button to toggle product form */}
        <button onClick={() => setAddingProduct(!addingProduct)}>
          {addingProduct ? 'Cancel' : 'Add Product'}
        </button>

        {/* Add Product Form */}
        {addingProduct && (
          <form onSubmit={handleProductSubmit}>
            <h3>Add a Product</h3>
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
              <label>Image URL:</label>
              <input
                type="text"
                name="image"
                value={productFormData.image}
                onChange={handleProductInputChange}
                required
              />
            </div>

            <button type="submit">Submit Product</button>
          </form>
        )}
      </div>


 {/* Fetch Product by Name */}
 <div>
          <h3>Fetch Product by Name</h3>
          <input
            type="text"
            name="productName"
            value={productFormData.productName}
            onChange={(e) => setProductFormData({ ...productFormData, productName: e.target.value })}
          />
          <button onClick={handleFetchProduct}>Fetch Product</button>

          {fetchedProduct && (
            <div>
              <h4>Product Details</h4>
              <p><strong>Name:</strong> {fetchedProduct.productName}</p>
              <p><strong>Description:</strong> {fetchedProduct.description}</p>
              <p><strong>Price:</strong> {fetchedProduct.price}</p>
              <p><strong>Stock:</strong> {fetchedProduct.stock}</p>
              {/* You can display more product details here */}
            </div>
          )}
        </div>

        
      {/* Sidebar */}
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
