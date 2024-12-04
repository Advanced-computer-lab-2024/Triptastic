import React, { useState } from 'react';
import { FaTag, FaInfoCircle, FaDollarSign, FaBox, FaImage } from 'react-icons/fa';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory2Icon from '@mui/icons-material/Inventory2';

const AddProduct = () => {

    const [imagePreview, setImagePreview] = useState(null);
    const [addingProduct, setAddingProduct] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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

      const handleAddProduct = () => {
  
        const seller = formData.Username || ''; // Fallback to empty string if undefined
        setProductFormData((prevData) => ({
          ...prevData,
          seller: seller // Assign the seller here
        }));
        setAddingProduct(true);
      };
      
      const [formData, setFormData] = useState({
        Username: '',
        Password: '',
        Email:''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value
        }));
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
        setProductFormData((prevData) => ({
          ...prevData,
          image: file,
        }));
        setImagePreview(file ? URL.createObjectURL(file) : null);
      };
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
    
      
  return (
    <div style={styles.container2}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          Add Product <Inventory2Icon style={styles.icon} />
        </h3>
        <form onSubmit={handleProductSubmit} style={styles.form}>
          {/* Product Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaTag style={styles.icon} /> Product Name:
            </label>
            <input
              type="text"
              name="productName"
              value={productFormData.productName}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaInfoCircle style={styles.icon} /> Description:
            </label>
            <textarea
              name="description"
              value={productFormData.description}
              onChange={handleProductInputChange}
              required
              style={styles.textarea}
              placeholder="Enter product description"
            />
          </div>

          {/* Price */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaDollarSign style={styles.icon} /> Price:
            </label>
            <input
              type="number"
              name="price"
              value={productFormData.price}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product price"
            />
          </div>

          {/* Stock */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaBox style={styles.icon} /> Stock:
            </label>
            <input
              type="number"
              name="stock"
              value={productFormData.stock}
              onChange={handleProductInputChange}
              required
              style={styles.input}
              placeholder="Enter product stock"
            />
          </div>

         {/* Image Upload */}
         <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaImage style={styles.icon} /> Image:
            </label>
            <div style={styles.fileUploadContainer}>
              <strong style={styles.uploadLabel}>
                Upload Product Image <AddPhotoAlternateIcon />
              </strong>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={styles.fileInput}
              />
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Product Preview"
              style={styles.imagePreview}
            />
          )}
          
          {/* Submit Button */}
          <button type="submit" style={styles.submitButton}>
            Add Product
          </button>
        </form>

        {/* Success and Error Messages */}
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}
      </div>
    </div>


  );
};

const styles = {
    container2: {
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '10px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      card: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      cardTitle: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#0F5132',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
      },
      label: {
        display: 'block',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '5px',
      },
      
      fileUploadContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
      imagePreview: {
        maxWidth: '100%',
        borderRadius: '10px',
        marginTop: '10px',
      },
      fileInput: {
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '5px',
      },
      textarea: {
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        minHeight: '80px',
      },
      fileUploadContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      },
      uploadLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        color: '#0F5132',
        fontWeight: 'bold',
      },
      input: {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '14px',
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
      icon: {
        marginRight: '5px',
        color: '#0F5132',
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
};

export default AddProduct;
