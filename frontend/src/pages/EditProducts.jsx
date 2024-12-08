import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaBox, FaUserShield, FaTasks, FaArchive } from 'react-icons/fa';
import { FaUsersCog, FaTag, FaUser, FaExclamationCircle, FaHeart, FaFileAlt, FaTrashAlt, FaThList, FaPlus, FaFlag,FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";

const EditProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [productSearchResult, setProductSearchResult] = useState(null);
  const [productNameToSearch, setProductNameToSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [editProductId, setEditProductId] = useState(null);
  const [productNameToArchive, setProductNameToArchive] = useState(''); // New state variable

  const [editProductData, setEditProductData] = useState({
    productName: '',
    description: '',
    price: '',
    stock: '',
    rating: '',
  });

  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4; // Number of products per page
  const indexOfLastProduct = currentPage * resultsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - resultsPerPage;
  const currentProducts = myProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/updateProduct?productId=${productId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editProductData),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setMyProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? updatedProduct : product
          )
        );
        setEditProductId(null);
      } else {
        setError('Failed to update product');
      }
    } catch (err) {
      setError('An error occurred while updating the product');
      console.error(err);
    }
  };

  const handleProductEdit = (productId) => {
    const product = myProducts.find((product) => product._id === productId);
    setEditProductId(productId);
    setEditProductData({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      rating: product.rating,
    });
  };
  
  const getProductByName = async (e) => {
    e.preventDefault();
    console.log("Search function triggered");
  
  
    setLoading(true);
    setError('');
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
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Product not found.');
      }
    } catch (error) {
      setError('An error occurred while searching for the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };const archiveProduct = async (productName) => {
    if (!productName) {
      setError('No product selected to archive.');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      const response = await fetch(`http://localhost:8000/archiveProduct/${productName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Product "${productName}" archived successfully.`);
        console.log(`Archived product: ${productName}`);
  
        // Update product list state to reflect the archive
        setMyProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productName === productName
              ? { ...product, archived: true }
              : product
          )
        );
  
        // Reset search result to null after archiving
        setProductSearchResult(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to archive product.');
      }
    } catch (error) {
      setError('An error occurred while archiving the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const unarchiveProduct = async (productName) => {
    if (!productName) {
      setError('No product selected to unarchive.');
      return;
    }
  
    setLoading(true);
    setError('');
    setSuccessMessage('');
  
    try {
      const response = await fetch(`http://localhost:8000/unarchiveProduct/${productName}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(`Product "${productName}" unarchived successfully.`);
        console.log(`Unarchived product: ${productName}`);
  
        // Update product list state to reflect the unarchive
        setMyProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productName === productName
              ? { ...product, archived: false }
              : product
          )
        );
  
        // Reset search result to null after unarchiving
        setProductSearchResult(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to unarchive product.');
      }
    } catch (error) {
      setError('An error occurred while unarchiving the product.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchMyProducts = async () => {
    const Username = localStorage.getItem('Username');
    try {
      const response = await fetch(
        `http://localhost:8000/getMyProducts?Username=${Username}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyProducts(data);
      } else {
        setError('Failed to fetch products');
      }
    } catch (err) {
      setError('An error occurred while fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const renderPagination = () => {
    const totalPages = Math.ceil(myProducts.length / resultsPerPage);
    return (
      <div style={styles.paginationContainer}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Previous
        </button>
        <p style={styles.paginationText}>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>
        <h1 style={styles.title2}>Edit Products</h1>
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
          e.currentTarget.style.width = '60px';
          Array.from(e.currentTarget.querySelectorAll('.label')).forEach(
            (label) => (label.style.opacity = '0')
          );
        }}
      >

<div style={styles.item} onClick={() => navigate('/adminPage')}>
          <FaUser style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Profile
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/manage')}>
          <FaUserShield style={styles.icon} />
          <span className="label" style={styles.label}>
          Admin Panel
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/admincontrol')}>
          <FaUsersCog   style={styles.icon} />
          <span className="label" style={styles.label}>
           Admin Control
          </span>   
        </div>
        
        
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>

        <div style={styles.item} onClick={() => navigate('/adminReport')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            Sales Report
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/DeletionRequest')}>
          <FaTrashAlt  style={styles.icon} />
          <span className="label" style={styles.label}>
            Deletion Requests
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/EditProducts')}>
          <FaEdit   style={styles.icon} />
          <span className="label" style={styles.label}>
            Edit Products
          </span>   
        </div>

        <div style={styles.item} onClick={() => navigate('/flagged')}>
          <FaFlag   style={styles.icon} />
          <span className="label" style={styles.label}>
            Flag Events
          </span>   
        </div>
        <div style={styles.item} onClick={() => navigate('/products_admin')}>
          <FaBox  style={styles.icon} />
          <span className="label" style={styles.label}>
            View Products
          </span>   
        </div>
      </div>
    
  
      <h1 style={styles.heading}>
        <FaTasks style={styles.headingIcon} /> Manage My Products
      </h1>
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
    {error && <p style={styles.errorMessage}>{error}</p>}
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
      onClick={() => archiveProduct(productSearchResult.productName)}
      disabled={loading || productSearchResult.unarchived}
      style={styles.archiveButton}
    >
      <FaArchive style={{ marginRight: '5px' }} />
      Archive Product
    </button>

    {/* Unarchive Product Button */}
    <button
      onClick={() => unarchiveProduct(productSearchResult.productName)}
      disabled={loading || !productSearchResult.archived}
      style={styles.unarchiveButton}
    >
      <HiOutlineArchiveBoxXMark style={{ marginRight: '5px' }} />
      Unarchive Product
    </button>
      </div>
    )}
  </div>
      {/* Pagination at the top */}
      <div style={styles.paginationWrapper}>
        {renderPagination()}
      </div>
  
      {loading ? (
        <p style={styles.loading}>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : myProducts.length === 0 ? (
        <p style={styles.noProducts}>No products found.</p>
      ) : (
        <>
          <div style={styles.cardGrid}>
            {currentProducts.map((product) => (
              <div key={product._id} style={styles.card}>
                {editProductId === product._id ? (
                  <div style={styles.editForm}>
                    <input
                      type="text"
                      name="productName"
                      value={editProductData.productName}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Product Name"
                    />
                    <textarea
                      name="description"
                      value={editProductData.description}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editProductData.price}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      name="stock"
                      value={editProductData.stock}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Stock"
                    />
                    <input
                      type="number"
                      name="rating"
                      value={editProductData.rating}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Rating"
                    />
                    
                    <button
                      style={styles.buttonSave}
                      onClick={() => handleSaveProduct(product._id)}
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                ) : (
                  <>
<h3 style={styles.productName}>
  <FaBox style={styles.productIcon} /> {product.productName}
</h3>
<p style={styles.productDescription}>{product.description}</p>
<div style={styles.productDetailsContainer}>
<p style={styles.productDetail}>
  <strong>Price:</strong> <span style={styles.price}>${product.price}</span>
</p>

  <p style={styles.productDetail}>
    <strong>Stock:</strong> {product.stock}
  </p>
  <p style={styles.productDetail}>
    <strong>Rating:</strong> {product.rating}
  </p>
</div>
<button
  style={styles.archiveButton}
  onClick={() => archiveProduct(product.productName)}
  disabled={product.archived} // Disable if already archived
>
  <FaArchive /> Archive
</button>
<button
  style={styles.unarchiveButton}
  onClick={() => unarchiveProduct(product.productName)}
  disabled={!product.archived} // Disable if not archived
>
  <HiOutlineArchiveBoxXMark /> Unarchive
</button>

                  </>
                    
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
  
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '20px auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '90px', // Push content down to account for the 

  },
  heading: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0F5132',
  },
  headingIcon: {
    marginRight: '10px',
    color: '#0F5132',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '14px',
  },
  

  card: {
    backgroundColor: '#fff',
    padding: '8px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  productName: {

    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  productIcon: {
    marginRight: '5px',
    color: '#0F5132',
  },
  input: {
    
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  textarea: {
    
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    minHeight: '80px',
  },
  buttonEdit: {
    padding: '10px',
    fontSize: '14px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonSave: {
    padding: '10px',
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 15px',
    fontSize: '14px',
    backgroundColor: '#0F5132',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '0 10px',
    transition: 'background-color 0.3s ease',
  },
  productName: {
    fontFamily: "'Roboto', sans-serif", // Example: Roboto font
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#0F5132',
    marginBottom: '10px',
  },
  productDescription: {
    fontFamily: "'Roboto', sans-serif", // Example: Roboto font
    fontSize: '20px',
    marginBottom: '10px',
  },

  productDetailsContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack the details vertically
    alignItems: 'flex-start', // Align items to the left
    gap: '0px', // Add space between each detail
    marginTop: '5px',
  },
  productDetail: {
    fontFamily: "'Roboto', sans-serif", // Example: Roboto font
    fontSize: '20px',
    color: '#333',
    lineHeight: '1.2', // Ensures consistent spacing between lines
  },
  price: {
    fontFamily:  "'Roboto', sans-serif", // Example: Roboto font
    marginLeft: '5px', // Ensure small consistent spacing

  },
  paginationWrapper: {
    marginBottom: '20px', // Add space between pagination and cards
  },
  paginationText: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
  noProducts: {
    textAlign: 'center',
    color: '#555',
  },

//header
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
  marginBottom: '10px', // Space between the logo and the title
},
logo: {
  height: '60px',
  width: '70px',
  borderRadius: '10px',
},
title2: {
  fontSize: '24px',
  fontWeight: 'bold',
  color: 'white',
  position: 'absolute', // Position the title independently
  top: '50%', // Center vertically
  left: '50%', // Center horizontally
  transform: 'translate(-50%, -50%)', // Adjust for element's size
  margin: '0',
},
          //sidebar
          sidebar: {
            position: 'fixed',
            top: '60px',
            left: 0,
            height: '100vh',
            width: '50px', // Default width when collapsed
            backgroundColor: 'rgba(15, 81, 50, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Ensure alignment starts from the left
            padding: '10px 0',
            overflowX: 'hidden',
            transition: 'width 0.3s ease',
            zIndex: 1000,
          },
          item: {
            padding: '10px 0',
          },
          sidebarExpanded: {
            width: '200px', // Width when expanded
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
          icon: {
            fontSize: '24px',
            marginLeft: '15px', // Move icons slightly to the right
            color: '#fff', // Icons are always white
          },
      
};

export default EditProducts;
