import { useState, useEffect } from 'react';
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
  const { user, logout } = useAuth(); // <- Get logout function
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
      const res = await axios.post('/api/categories', newCat);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 relative">

      {/* 🔒 Logout button when user is logged in */}
      {user && (
        <div className="absolute top-6 right-6">
          <button
            onClick={() => navigate('/my-listings')}
            className="ml-2 px-4 py-2 rounded border border-purple-600 text-purple-600 font-semibold bg-white hover:bg-purple-50 shadow transition-all duration-200 mr-2"
          >
            My Listings
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-4 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition-colors duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 whitespace-nowrap">
              Browse by Category
            </h1>
            <select
              className="ml-4 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCatModal(true)}
              className="ml-3 px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 font-medium bg-white hover:bg-emerald-50 transition-colors duration-200 shadow-sm"
            >
              + Create Category
            </button>
            <button
              onClick={() => navigate('/post-item')}
              className="ml-3 px-4 py-2 rounded-lg border border-blue-300 text-blue-700 font-medium bg-white hover:bg-blue-50 transition-colors duration-200 shadow-sm"
            >
              + Add New Item
            </button>
          </div>

          {!user && (
            <div className="flex gap-3 mt-6 sm:mt-0">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors duration-200 shadow-sm"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 shadow-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Modal for creating category */}
        {showCatModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <form
              onSubmit={handleCreateCategory}
              className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-5 border border-slate-200"
            >
              <h2 className="text-2xl font-bold mb-2 text-slate-800 text-center">Create New Category</h2>
              {catError && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{catError}</p>}
              <input
                type="text"
                placeholder="Category Name"
                className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-20 shadow-sm"
                value={newCat.description}
                onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                required
              />
              <div className="flex gap-3 mt-3 justify-center">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  onClick={() => setShowCatModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-8 text-slate-700 text-center">
          {selectedCategory
            ? `Items in "${categories.find((c) => String(c.id) === String(selectedCategory))?.name || ''}"`
            : 'All Community Items'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-xl p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 flex flex-col hover:translate-y-[-2px]">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-bold mt-2 text-slate-800">{item.title}</h2>
              <p className="text-sm text-slate-600 flex-1 mt-2">
                {item.description?.slice(0, 80)}...
              </p>
              <div className="mb-4 mt-3">
                <span className="text-xl font-bold text-slate-800">
                  ₹{item.price_per_day}
                </span>
                <span className="text-sm text-slate-500 ml-1">per day</span>
              </div>
              {item.availability_status === 'available' && (
                <p className="text-green-700 font-medium mt-2 text-sm">
                  ✓ Available to borrow
                </p>
              )}
              <Link
                to={`/items/${item.id}`}
                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center shadow-sm"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-slate-500 mt-12 text-lg">No items found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Home;