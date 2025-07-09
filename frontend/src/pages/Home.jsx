import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', description: '' });
  const [catError, setCatError] = useState('');
  const { user, logout, token } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = selectedCategory
          ? `/api/items?categoryId=${selectedCategory}`
          : '/api/items';
        const res = await axios.get(url);
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    fetchItems();
  }, [selectedCategory]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatError('');
    if (categories.some(cat => cat.name.toLowerCase() === newCat.name.trim().toLowerCase())) {
      setCatError('Category already exists.');
      return;
    }
    try {
      const res = await axios.post('/api/categories', newCat, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories([...categories, res.data]);
      setShowCatModal(false);
      setNewCat({ name: '', description: '' });
    } catch (err) {
      if (err.response?.status === 401) {
        setCatError('You are not authorized. Please log in to create a category.');
      } else if (err.response?.status === 409) {
        setCatError('Category already exists.');
      } else {
        setCatError('Failed to create category');
      }
    }
  };

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#F3F4E8] py-8 relative">
      {user && (
        <div
          className="absolute top-6 right-6"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative">
            <button
              className="w-10 h-10 bg-[#A7C3AD] text-white rounded-full flex items-center justify-center font-semibold shadow-md hover:bg-[#819A91] transition"
            >
              {user.username?.charAt(0).toUpperCase() + user.username?.charAt(1).toUpperCase() || 'U'}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D4DBC1] rounded-lg shadow-lg z-50">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/my-listings')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  My Listings
                </button>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => navigate('/post-item')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  Add New Item
                </button>
                <button
                  onClick={() => setShowCatModal(true)}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  Create Category
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="block w-full text-left px-4 py-2 text-[#d9534f] hover:bg-[#f8d7da]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#4e5d58] whitespace-nowrap">
              Browse by Category
            </h1>
            <select
              className="ml-4 px-4 py-2 rounded-lg border border-[#A7C3AD] bg-white text-[#4e5d58] font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-[#819A91]"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {!user && (
            <div className="flex gap-3 mt-6 sm:mt-0">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-lg bg-[#A7C3AD] text-white font-medium hover:bg-[#90b69d] transition-colors duration-200 shadow-sm"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 rounded-lg bg-[#819A91] text-white font-medium hover:bg-[#6d857f] transition-colors duration-200 shadow-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {showCatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleCreateCategory}
              className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5 border border-[#D4DBC1]"
            >
              <h2 className="text-2xl font-bold mb-2 text-[#4e5d58] text-center">Create New Category</h2>
              {catError && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{catError}</p>}
              <input
                type="text"
                placeholder="Category Name"
                className="border border-[#A7C3AD] p-3 rounded-lg focus:ring-2 focus:ring-[#819A91] shadow-sm"
                value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="border border-[#A7C3AD] p-3 rounded-lg focus:ring-2 focus:ring-[#819A91] min-h-20 shadow-sm"
                value={newCat.description}
                onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                required
              />
              <div className="flex gap-3 mt-3 justify-center">
                <button
                  type="submit"
                  className="bg-[#A7C3AD] hover:bg-[#90b69d] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-[#D4DBC1] hover:bg-[#c2c9b0] text-[#4e5d58] px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setShowCatModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-8 text-[#4e5d58] text-center">
          {selectedCategory
            ? `Items in "${categories.find((c) => String(c.id) === String(selectedCategory))?.name || ''}"`
            : 'All Community Items'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="border border-[#D4DBC1] rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col hover:translate-y-[-2px]">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mt-2 text-[#4e5d58]">{item.title}</h2>
              <p className="text-sm text-[#667c75] flex-1 mt-2">
                {item.description?.slice(0, 80)}...
              </p>
              <div className="mb-4 mt-3">
                <span className="text-xl font-bold text-[#4e5d58]">
                  ₹{item.price_per_day}
                </span>
                <span className="text-sm text-[#819A91] ml-1">per day</span>
              </div>
              {item.availability_status === 'available' && (
                <p className="text-green-700 font-medium mt-2 text-sm">
                  ✓ Available to borrow
                </p>
              )}
              <Link
                to={`/items/${item.id}`}
                className="inline-block mt-4 px-4 py-2 bg-[#819A91] text-white text-sm rounded-lg hover:bg-[#6d857f] transition-colors duration-200 text-center shadow-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-[#819A91] mt-12 text-lg">No items found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
