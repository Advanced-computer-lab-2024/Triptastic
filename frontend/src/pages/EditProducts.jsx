import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaBox, FaDollarSign, FaTasks } from 'react-icons/fa';
import { FaArrowLeft, FaTag, FaUser, FaExclamationCircle, FaHeart, FaFileAlt, FaTrashAlt, FaThList, FaPlus, FaFlag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import image from '../images/image.png';

const EditProducts = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myProducts, setMyProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
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

        <div style={styles.item} onClick={() => navigate('/PromoCodeForm')}>
          <FaTag style={styles.icon} />
          <span className="label" style={styles.label}>
            Promo Codes
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/Complaints')}>
          <FaExclamationCircle style={styles.icon} />
          <span className="label" style={styles.label}>
           Complaints
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/preftags')}>
          <FaHeart style={styles.icon} />
          <span className="label" style={styles.label}>
           Preference Tags
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/docs')}>
          <FaFileAlt style={styles.icon} />
          <span className="label" style={styles.label}>
            Documents
          </span>
        </div>
        <div style={styles.item} onClick={() => navigate('/category')}>
          <FaThList style={styles.icon} />
          <span className="label" style={styles.label}>
           Categories
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
        <div style={styles.item} onClick={() => navigate('/AddProduct')}>
          <FaPlus  style={styles.icon} />
          <span className="label" style={styles.label}>
            Add Product
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
      </div>
    
  
      <h1 style={styles.heading}>
        <FaTasks style={styles.headingIcon} /> Manage My Products
      </h1>
  
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
                      style={styles.buttonEdit}
                      onClick={() => handleProductEdit(product._id)}
                    >
                      <FaEdit /> Edit
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
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
  productDetailsContainer: {
    display: 'flex',
    flexDirection: 'column', // Stack the details vertically
    alignItems: 'flex-start', // Align items to the left
    gap: '5px', // Add space between each detail
    marginTop: '10px',
  },
  productDetail: {
    fontFamily: "'Courier New', monospace",
    fontSize: '20px',
    color: '#333',
    lineHeight: '1.5', // Ensures consistent spacing between lines
  },
  price: {
    fontFamily: "'Courier New', monospace",
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
