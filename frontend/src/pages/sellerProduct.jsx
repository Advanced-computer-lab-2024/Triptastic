import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import image from "../images/image.png";
import {
  FaUserCircle,
  FaInfoCircle,
  FaSearch,
  FaBox,
  FaPlus,
  FaDollarSign,
  FaMap,
  FaRunning,
  FaPlane,
  FaHotel,
  FaClipboardList,
  FaStar,
  FaBus,
  FaArchive,
} from "react-icons/fa";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";

import { MdNotificationImportant } from "react-icons/md";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Tooltip } from "react-tooltip"; // Updated import
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

const SellerProduct = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [error, setError] = useState("");
  const [seller, setSeller] = useState(localStorage.getItem("Username") || "");
  console.log(localStorage.getItem("Username")); // Default to logged-in user
  const [sellerInfo, setSellerInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [fetchedProduct, setFetchedProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [productNameToSearch, setProductNameToSearch] = useState("");
  const [productSearchResult, setProductSearchResult] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [productNameToArchive, setProductNameToArchive] = useState(""); // New state variable
  const [logo, setLogo] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLogoPreview, setModalLogoPreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [notifications, setNotifications] = useState([]); // Initialize as an empty array
  const [showNotifications, setShowNotifications] = useState(false); // Toggle notification dropdown
  const [editProductId, setEditProductId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [editProductData, setEditProductData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    rating: "",
  });
  const [productFormData, setProductFormData] = useState({
    productName: "",
    description: "",
    price: "",
    rating: "",
    seller: "",
    review: "",
    stock: "",
    image: null, // Change to null to store the file
  });

  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
    Name: "",
    Description: "",
    Logo: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    const Username = localStorage.getItem("Username");

    try {
      const response = await fetch(
        `http://localhost:8000/getNotificationsForSeller?Username=${Username}`
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []); // Fallback to an empty array if undefined
      } else {
        console.error("Failed to fetch notifications");
        setNotifications([]); // Set to an empty array on error
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]); // Set to an empty array on error
    }
  };

  const handleNotificationClick = async () => {
    const Username = localStorage.getItem("Username");

    setShowNotifications((prev) => !prev);

    if (!showNotifications) {
      try {
        const response = await fetch(
          `http://localhost:8000/getNotificationsForSeller?Username=${Username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          // Filter and append unique notifications
          const uniqueNotifications = data.notifications.filter(
            (newNotification) =>
              !notifications.some(
                (existingNotification) =>
                  existingNotification.message === newNotification.message
              )
          );

          setNotifications((prev) => [...prev, ...uniqueNotifications]);
        } else {
          console.error("Failed to fetch notifications");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  const checkoutOfStock = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/checkAndNotifyOutOfStockSeller",
        {
          method: "GET", // Use GET or any other appropriate method
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Update notifications state with unique notifications
        const newNotifications = data.notifications.filter(
          (notification) =>
            !notifications.some((n) => n.message === notification.message)
        );

        if (newNotifications.length > 0) {
          setNotifications((prev) => [...prev, ...newNotifications]);
          console.log("New notifications added:", newNotifications);
        } else {
          console.log("No new notifications to add");
        }
      } else {
        console.error("Failed to check out-of-stock products");
      }
    } catch (error) {
      console.error("Error occurred while checking out-of-stock:", error);
    }
  };

  const fetchSellerInfo = async () => {
    setLoading(true);
    const Username = localStorage.getItem("Username");
    if (Username) {
      try {
        const response = await fetch(
          `http://localhost:8000/getSeller?Username=${Username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setSellerInfo(data);
            setFormData(data);
            setProductFormData((prevData) => ({
              ...prevData,
              seller: data.Username,
            }));
            setErrorMessage("");

            // Set and persist the logo URL
            if (data.Logo) {
              const logoURL = data.Logo; // or data.logo, depending on what the backend returns
              setLogo(logoURL);
              localStorage.setItem("logo", logoURL); // Persist logo in local storage
            }
          } else {
            setErrorMessage("No seller information found.");
          }
        } else {
          throw new Error("Failed to fetch seller information");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching seller information");
        console.error(error);
      }
    } else {
      setErrorMessage("No seller information found.");
    }
    setLoading(false);
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
        image: file, // Store the file object instead of URL
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
      const response = await fetch(
        "http://localhost:8000/createProductSeller",
        {
          method: "POST",
          body: formDataToSubmit, // Send the FormData
        }
      );

      if (response.ok) {
        const newProduct = await response.json();
        alert("Product added successfully!");
        setProductFormData({
          productName: "",
          description: "",
          price: "",
          rating: "",
          seller: sellerInfo.Username,
          review: "",
          stock: "",
          image: null, // Reset image after successful submission
        });
        setErrorMessage("");
        setAddingProduct(false);
      } else {
        throw new Error("Failed to create product");
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the product");
      console.error(error);
    }
  };

  const getProductByName = async (e) => {
    e.preventDefault();
    console.log("Search function triggered");

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setProductSearchResult(null); // Clear previous search results

    try {
      const response = await fetch(
        `http://localhost:8000/getProductSeller?productName=${productNameToSearch}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const product = await response.json();
        console.log(product); // Log the fetched product
        setProductSearchResult(product); // Set the product in state
        setProductNameToArchive(product.productName); // Store product name for archiving
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Product not found.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while searching for the product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    if (!seller) {
      setError("Seller username is required.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/viewMyProducts?seller=${seller}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
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
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  const archiveProduct = async (productName) => {
    if (!productName) {
      setError("No product selected to archive.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://localhost:8000/archiveProduct/${productName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Update the sellerProducts array to reflect the change
        setSellerProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productName === productName
              ? { ...product, archived: true }
              : product
          )
        );

        // Reset productSearchResult to null after action
        setProductSearchResult(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to archive product.");
      }
    } catch (error) {
      setError("An error occurred while archiving the product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveProduct = async (productName) => {
    if (!productName) {
      setError("No product selected to unarchive.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `http://localhost:8000/unarchiveProduct/${productName}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Update the sellerProducts array to reflect the change
        setSellerProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.productName === productName
              ? { ...product, archived: false }
              : product
          )
        );

        // Reset productSearchResult to null after action
        setProductSearchResult(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to unarchive product.");
      }
    } catch (error) {
      setError("An error occurred while unarchiving the product.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productId) => {
    // Save the updated product data to the server...
    // After saving, update the sellerProducts state and reset editProductId
    try {
      const response = await fetch(
        `http://localhost:8000/updateProduct?productId=${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editProductData),
        }
      );

      if (response.ok) {
        const updatedProduct = await response.json();
        setSellerProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? updatedProduct : product
          )
        );
        setEditProductId(null);
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
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
      rating: product.rating,
    });
  };
  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={image} alt="Logo" style={styles.logo} />
        </div>

        <h1 style={styles.title}>Seller Products</h1>

        {/* Icons Container */}
        <div style={styles.iconContainer}>
          <button
            style={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus style={styles.createIcon} /> Add Product
          </button>

          {/* Logout Icon */}
          <LogoutOutlinedIcon
            style={styles.logoutIcon}
            onClick={() => navigate("/Guest")}
          />
        </div>
      </header>
      {/* Sidebar */}
      <div
        style={styles.sidebar}
        onMouseEnter={(e) => {
          e.currentTarget.style.width = "200px";
          Array.from(e.currentTarget.querySelectorAll(".label")).forEach(
            (label) => (label.style.opacity = "1")
          );
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.width = "50px";
          Array.from(e.currentTarget.querySelectorAll(".label")).forEach(
            (label) => (label.style.opacity = "0")
          );
        }}
      >
        <div
          className="profile"
          style={styles.item}
          onClick={() => navigate("/seller-profile")}
        >
          <FaUserCircle style={styles.iconn} />
          <span className="label" style={styles.label}>
            Profile
          </span>
        </div>
        <div
          className="products"
          style={styles.item}
          onClick={() => navigate("/products_seller")}
        >
          <FaBox style={styles.iconn} />
          <span className="label" style={styles.label}>
            All Products
          </span>
        </div>
        <div
          className="my products"
          style={styles.item}
          onClick={() => navigate("/sellerProduct")}
        >
          <FaPlus style={styles.iconn} />
          <span className="label" style={styles.label}>
            My Products
          </span>
        </div>
      </div>

     {/* Add Product Modal */}
{showCreateModal && (
  <div style={addProductStyles.modalOverlay}>
    <div style={addProductStyles.modalContent}>
      <div style={addProductStyles.header}>
        <h3 style={addProductStyles.modalTitle}>
          <Inventory2Icon style={addProductStyles.titleIcon} /> Add Product
        </h3>
        <HighlightOffOutlinedIcon
          onClick={() => setShowCreateModal(false)}
          style={addProductStyles.closeIcon}
        />
      </div>
      <form onSubmit={handleProductSubmit} style={addProductStyles.form}>
        <div style={addProductStyles.inputGroup}>
          <input
            type="text"
            placeholder="Product Name"
            name="productName"
            value={productFormData.productName}
            onChange={handleProductInputChange}
            required
            style={addProductStyles.input}
          />
        </div>
        <div style={addProductStyles.inputGroup}>
          <textarea
            placeholder="Description"
            name="description"
            value={productFormData.description}
            onChange={handleProductInputChange}
            required
            style={addProductStyles.textarea}
          />
        </div>
        <div style={addProductStyles.inputGroup}>
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={productFormData.price}
            onChange={handleProductInputChange}
            required
            style={addProductStyles.input}
          />
        </div>
        <div style={addProductStyles.inputGroup}>
          <input
            type="number"
            placeholder="Stock"
            name="stock"
            value={productFormData.stock}
            onChange={handleProductInputChange}
            required
            style={addProductStyles.input}
          />
        </div>
        <div style={addProductStyles.fileUploadContainer}>
          <label style={addProductStyles.fileLabel} htmlFor="file-upload">
            <AddPhotoAlternateIcon style={addProductStyles.uploadIcon} />
            <strong
                    style={{
                      color: "#0F5132",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      cursor: "pointer",
                    }}
                  >
            Upload Product Image</strong>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            style={addProductStyles.fileInput}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product Preview"
              style={addProductStyles.imagePreview}
            />
          )}
        </div>
        <button type="submit" style={addProductStyles.submitButton}>
          Submit Product
        </button>
      </form>
    </div>
  </div>
)}

      <div style={styles.card}>
      <h2 style={styles.sectionTitle}>Your Products</h2>
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
            <FaSearch style={{ marginRight: "5px" }} />
            Search
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p style={styles.error}>{error}</p>}
          {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
          {successMessage && (
            <p style={styles.successMessage}>{successMessage}</p>
          )}

{productSearchResult && (
  <div
    style={{
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6',
    }}
  >
    <h4
      style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#0F5132',
        marginBottom: '15px',
        textAlign: 'center',
        borderBottom: '2px solid #0F5132',
        paddingBottom: '10px',
        letterSpacing: '1px',
      }}
    >
      Product Details
    </h4>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaBox style={{ marginRight: '8px', color: '#0F5132', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Name:</strong> {productSearchResult.productName}
    </p>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaInfoCircle style={{ marginRight: '8px', color: '#0F5132', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Description:</strong> {productSearchResult.description}
    </p>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaDollarSign style={{ marginRight: '8px', color: '#0F5132', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Price:</strong> ${productSearchResult.price}
    </p>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaStar style={{ marginRight: '8px', color: '#FFD700', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Rating:</strong> {productSearchResult.rating}
    </p>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaUserCircle style={{ marginRight: '8px', color: '#0F5132', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Seller:</strong> {productSearchResult.seller}
    </p>
    <p style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <FaArchive style={{ marginRight: '8px', color: productSearchResult.archived ? '#0F5132' : '#d9534f', fontSize: '18px' }} />
      <strong style={{ marginRight: '5px' }}>Archived:</strong> {productSearchResult.archived !== undefined ? productSearchResult.archived.toString() : 'N/A'}
    </p>
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
      <button
        type="button"
        onClick={() => archiveProduct(productSearchResult.productName)}
        disabled={loading || productSearchResult.unarchived}
        style={{
          padding: '8px 15px',
          backgroundColor: '#d9534f',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <FaArchive />
        Archive
      </button>
      <button
        type="button"
        onClick={() => unarchiveProduct(productSearchResult.productName)}
        disabled={loading || !productSearchResult.archived}
        style={{
          padding: '8px 15px',
          backgroundColor: '#0F5132',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <HiOutlineArchiveBoxXMark />
        Unarchive
      </button>
    </div>
  </div>
)}
        {sellerProducts.length === 0 && !loading ? (
          <p>No products found.</p>
        ) : (
          <div style={styles.cardContainer}>
            {sellerProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  ...styles.card,
                  position: "relative",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.3s ease",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 12px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.borderColor = "#0F5132";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 6px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              >
                <h4 style={styles.cardTitle}>
                <strong>Name:</strong>{" "}

                  {editProductId === product._id ? (
                    <input
                      type="text"
                      name="productName"
                      value={editProductData.productName}
                      onChange={handleInputChange2}
                      style={styles.input}
                    />
                  ) : (
                    product.productName
                  )}
                </h4>
                <p style={styles.cardDescription}>
                <strong>Description:</strong>{" "}

                  {editProductId === product._id ? (
                    <textarea
                      name="description"
                      value={editProductData.description}
                      onChange={handleInputChange2}
                      style={styles.textarea}
                    />
                  ) : (
                    product.description
                  )}
                </p>
                <p style={styles.cardDetails}>
                  <strong>Price:</strong>{" "}
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="price"
                      value={editProductData.price}
                      onChange={handleInputChange2}
                      style={styles.input}
                    />
                  ) : (
                    `$${product.price}`
                  )}
                </p>
                <p style={styles.cardDetails}>
                  <strong>Stock:</strong>{" "}
                  {editProductId === product._id ? (
                    <input
                      type="number"
                      name="stock"
                      value={editProductData.stock}
                      onChange={handleInputChange2}
                      style={styles.input}
                    />
                  ) : (
                    product.stock
                  )}
                </p>
                <p style={styles.cardDetails}>
                  <strong>Rating:</strong> {product.rating}
                </p>
                <p style={styles.cardDetails}>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      color: product.archived ? "green" : "red",
                      fontWeight: "500",
                    }}
                  >
                    {product.archived ? "Archived" : "Unarchived"}
                  </span>
                </p>
                <div style={styles.buttonContainer}>
                  {editProductId === product._id ? (
                    <button
                      style={styles.saveButton}
                      onClick={() => handleSaveProduct(product._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      style={styles.editButton}
                      onClick={() => handleProductEdit(product._id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      product.archived
                        ? unarchiveProduct(product.productName)
                        : archiveProduct(product.productName)
                    }
                    style={styles.archiveToggleButton}
                  >
                    {product.archived ? "Unarchive" : "Archive"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Tooltip id="amenities-tooltip" place="top" />
    </div>
  );
};

const styles = {
  createButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    marginTop: "-1px",
  },

  createButtonHover: {
    backgroundColor: "#084B24", // Darker green on hover
  },

  createIcon: {
    fontSize: "20px",
  },
  sidebar: {
    position: "fixed",
    top: "60px",
    left: 0,
    height: "100vh",
    width: "50px", // Default width when collapsed
    backgroundColor: "rgba(15, 81, 50, 0.85)",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "10px 0",
    overflowX: "hidden",
    transition: "width 0.3s ease",
    zIndex: 1000,
  },
  sidebarExpanded: {
    width: "200px", // Width when expanded
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "10px",
    width: "100%", // Full width of the sidebar
    color: "#fff",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  iconContainerHover: {
    backgroundColor: "#084B24", // Background on hover
  },
  iconn: {
    fontSize: "24px",
    marginLeft: "15px", // Move icons slightly to the right
    color: "#fff", // Icons are always white
  },
  label: {
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#fff",
    opacity: 0, // Initially hidden
    whiteSpace: "nowrap", // Prevent label text from wrapping
    transition: "opacity 0.3s ease",
  },
  labelVisible: {
    opacity: 1, // Fully visible when expanded
  },
  item: {
    padding: "10px 0",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#333",
    color: "white",
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    height: "50px",
    width: "auto",
  },
  title: {
    flex: 2,
    textAlign: "center",
    fontSize: "24px",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "20px", // Consistent spacing between icons
  },
  icon: {
    cursor: "pointer",
    color: "white",
  },
  profileIcon: {
    cursor: "pointer",
    color: "white",
  },
  logoutIcon: {
    cursor: "pointer",
    color: "white",
  },
  photoSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  profilePhoto: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  photoLabel: {
    cursor: "pointer",
    color: "#0F5132",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
  },
  container: {
    margin: "90px auto",
    maxWidth: "1200px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    position: "fixed",
    height: "60px",
    top: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#0F5132",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 20px",
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    height: "60px",
    width: "70px",
    borderRadius: "10px",
  },
  title: {
    fontSize: "24px",
    margin: 0,
    fontWeight: "bold",
    marginLeft: "150px",
  },
  profileIcon: {
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  },
  logoutIcon: {
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    width: "50%",
    maxWidth: "600px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  modalContentH2: {
    fontSize: "22px",
    textAlign: "center",
    color: "#333",
  },
  modalContentLabel: {
    fontWeight: "bold",
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#555",
  },
  modalContentInput: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  modalContentTextarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    resize: "vertical",
  },
  modalContentButton: {
    padding: "10px 20px",
    border: "none",
    background: "#0F5132",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  passwordSection: {
    borderTop: "1px solid #ddd",
    marginTop: "20px",
    paddingTop: "15px",
  },
  cancelIcon: {
    color: "#0F5132", // Set the color of the icon
    fontSize: "30px", // Adjust the size as needed
    cursor: "pointer", // Ensure it acts as a button
    position: "absolute", // Position it correctly in the modal
    right: "500px", // Adjust placement
    top: "190px", // Adjust placement
  },
  cancelpasswordIcon: {
    color: "#0F5132", // Set the color of the icon
    fontSize: "30px", // Adjust the size as needed
    cursor: "pointer", // Ensure it acts as a button
    position: "absolute", // Position it correctly in the modal
    right: "490px", // Adjust placement
    top: "280px", // Adjust placement
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0F5132", 
    marginBottom: "15px",
    textAlign: "center",
    borderBottom: "2px solid #0F5132", 
    paddingBottom: "10px",
    letterSpacing: "1px", 
    textTransform: "uppercase", 
  },
  cardTitle: {
    fontSize: "18px", // Smaller font size for professional appearance
    fontWeight: "600", // Slightly bold for prominence
    color: "#0F5132",
    lineHeight: "1.4", // Good readability
  },
  cardDescription: {
    fontSize: "14px", // Smaller font for compact look
    color: "#555",
    marginBottom: "10px",
    lineHeight: "1.4",
  },
  cardDetails: {
    fontSize: "14px", // Maintain uniform font size for details
    color: "#444",
    marginBottom: "5px",
    lineHeight: "1.4",
  },
  input: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    width: "100%",
  },
  textarea: {
    padding: "4px 8px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "18px",
    width: "100%",
    resize: "vertical",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%", // Maintain consistent form width
    alignItems: "center", // Center-align the form
    margin: "0 auto", // Center the form on the page
  },

  fileUploadContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "20px",
  },
  fileLabel: {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    //backgroundColor: '#0F5132',
    color: "#0F5132",
    //borderRadius: '50%',
    //padding: '10px',
    fontSize: "24px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  fileInput: {
    display: "none", // Hides the native file input
  },
  imagePreview: {
    marginTop: "10px",
    width: "150px",
    height: "150px",
    objectFit: "cover",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
  submitButton: {
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    bottom: "50px",
  },
  formSearch: {
    position: "relative", // Set the parent element's position
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "30%", // Maintain consistent form width
    alignItems: "center", // Center-align the form
    marginLeft: "370px", // Center the form on the page
    marginTop:'10px',
    marginBottom:'10px',

  },
  searchButton: {
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px 10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    position: "absolute", // Make the button positioned relative to the parent
    right: "-100px",
    display: "flex",
    bottom: "-17px",
    alignItems: "center",
    marginBottom: "15px",
  },

  errorMessage: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
  successMessage: {
    color: "green",
    fontWeight: "bold",
    marginTop: "10px",
  },
  searchResult: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#f0f0f0",
    borderRadius: "10px",
  },
  resultTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  cardContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    padding: "20px",
  },
  card: {
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s ease",
  },

  buttonContainer: {
    display: "flex",
    gap: "8px",
    marginTop: "10px",
  },
  editButton: {
    backgroundColor: "#0F5132",
    color: "#fff",
    padding: "5px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  saveButton: {
    backgroundColor: "#0F5132",
    color: "#fff",
    padding: "5px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  archiveToggleButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    padding: "5px 8px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    textAlign: "left",
    backgroundColor: "#0F5132",
    color: "white",
    padding: "10px",
    border: "1px solid #ddd",
  },
  td: {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
  },
  tr: {
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
};
const addProductStyles = {
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      padding: "30px",
      maxWidth: "600px",
      width: "100%",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    modalTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#0F5132",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    titleIcon: {
      color: "#0F5132",
      fontSize: "24px",
    },
    closeIcon: {
      fontSize: "27px",
      cursor: "pointer",
      color: "#0F5132",
      transition: "color 0.3s",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "14px",
      width: "100%",
    },
    textarea: {
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      fontSize: "14px",
      width: "100%",
      minHeight: "100px",
    },
    fileUploadContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      },
      fileLabel: {
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    
    uploadIcon: {
    color: "#0F5132",
    fontSize: "24px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    },
    fileInput: {
        display: "none", // Hides the native file input
      },
      imagePreview: {
        marginTop: "10px",
        width: "150px",
        height: "150px",
        objectFit: "cover",
        border: "1px solid #ddd",
        borderRadius: "5px",
      },
 
    submitButton: {
      padding: "10px 20px",
      backgroundColor: "#0F5132",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: "16px",
      transition: "background-color 0.3s",
    },
  };
  
export default SellerProduct;
