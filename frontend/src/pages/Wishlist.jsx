import React, { useState, useEffect } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const username = localStorage.getItem('Username'); // Retrieve username from local storage

  // Fetch wishlist items
  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000/getWishlist?Username=${username}`);
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      const data = await response.json();
      setWishlist(data.wishlist || []); // Assuming 'wishlist' contains product objects
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove an item from the wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8000/removeProductFromWishlist`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, productId }),
      });

      if (response.ok) {
        alert('Product removed from wishlist successfully!');
        setWishlist((prev) => prev.filter((item) => item._id !== productId)); // Update wishlist state
      } else {
        throw new Error('Failed to remove product from wishlist');
      }
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      alert('Failed to remove product from wishlist');
    }
  };

  // Fetch wishlist on component mount
  useEffect(() => {
    fetchWishlist();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {wishlist.map((product) => (
            <li key={product._id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
              <h2>{product.productName}</h2>
              <p><strong>Description:</strong> {product.description}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <button onClick={() => handleRemoveFromWishlist(product._id)}>Remove from Wishlist</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
