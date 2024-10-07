import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: ''
  });

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

  //new
  const [productNameToSearch, setProductNameToSearch] = useState('');
  const [productSearchResult, setProductSearchResult] = useState(null);
  
 
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    const { Username, Password } = formData;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:8000/createAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Username, Password })
      });

      if (response.ok) {
        alert('Admin created successfully!');
        setFormData({ Username: '', Password: '' });
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
    setProductFormData((prevData) => ({
      ...prevData,
      seller: formData.Username
    }));
    setAddingProduct(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...productFormData,
      seller: formData.Username
    };

    try {
      const response = await fetch('http://localhost:8000/createProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
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
          image: ''
        });
        setAddingProduct(false);
      } else {
        throw new Error('Failed to create product');
      }
    } catch (error) {
      setErrorMessage('An error occurred while creating the product');
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
      setProductSearchResult(product);
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


  return (
    <div>
      <h1>Admin Page</h1>

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
        <button type="submit" disabled={loading}>Create Admin</button>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
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
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={productFormData.image}
            onChange={handleProductInputChange}
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

export default AdminPage;
