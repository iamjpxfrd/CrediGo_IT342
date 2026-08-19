// src/pages/WishlistPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getWishlist, removeFromWishlist } from '../services/api';
import { formatCurrency } from '../utils/formatters';

function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch wishlist items on component mount
  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await getWishlist();
      setWishlistItems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load your wishlist. Please try again later.');
      console.error('Error fetching wishlist:', err);
      toast.error('Could not load wishlist items');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      // Update local state to reflect the removal
      setWishlistItems(prevItems => prevItems.filter(item => item.productId !== productId));
      toast.success('Item removed from wishlist');
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      toast.error('Failed to remove item from wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-credigo-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative my-4" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-credigo-light">
        <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
        <div className="bg-credigo-input-bg border border-gray-700 rounded-lg p-8 text-center">
          <h2 className="text-xl mb-4">Your wishlist is empty</h2>
          <p className="text-gray-400 mb-6">Browse our products and add some items to your wishlist!</p>
          <Link to="/products" className="bg-credigo-button text-credigo-dark py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-credigo-light">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.productId} className="bg-credigo-input-bg border border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-400/30 transition-all">
            <div className="relative pb-[56.25%]">
              <img
                src={item.productImageUrl || '/placeholder-product.jpg'}
                alt={item.productName}
                className="absolute h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold">{item.productName}</h3>
                <span className="bg-credigo-dark border border-gray-700 text-gray-300 px-2 py-1 text-xs rounded-full">
                  {item.platformName}
                </span>
              </div>
              <p className="text-credigo-accent font-bold text-lg my-2">
                {formatCurrency(item.productPrice)}
              </p>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {item.productDescription}
              </p>
              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-gray-500">
                  Added {new Date(item.addedAt).toLocaleDateString()}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Remove
                  </button>
                  <Link
                    to={`/products/${item.productId}`}
                    className="bg-credigo-button text-credigo-dark py-1 px-4 rounded text-sm hover:bg-opacity-90 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
