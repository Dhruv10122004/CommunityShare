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
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch categories on mount
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

  // Fetch items when selectedCategory changes
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

  // Handle create category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatError('');
    // Check for duplicate (case-insensitive)
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
      if (err.response && err.response.status === 401) {
        setCatError('You are not authorized. Please log in to create a category.');
      } else if (err.response && err.response.status === 409) {
        setCatError('Category already exists.');
      } else {
        setCatError('Failed to create category');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-blue-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 drop-shadow whitespace-nowrap">
              Browse by Category
            </h1>
            <select
              className="ml-2 px-4 py-2 rounded border border-blue-300 bg-white text-blue-700 font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowCatModal(true)}
              className="ml-2 px-4 py-2 rounded border border-green-600 text-green-600 font-semibold bg-white hover:bg-green-50 shadow transition-all duration-200"
            >
              + Create Category
            </button>
          </div>
          {!user && (
            <div className="flex gap-2 mt-4 sm:mt-0">
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-blue-600 shadow"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-green-600 shadow"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Modal for creating category */}
        {showCatModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
            <form
              onSubmit={handleCreateCategory}
              className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col gap-4 border"
            >
              <h2 className="text-2xl font-bold mb-2 text-green-700 text-center">Create New Category</h2>
              {catError && <p className="text-red-500 text-sm text-center">{catError}</p>}
              <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                value={newCat.name}
                onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded focus:ring-2 focus:ring-green-200"
                value={newCat.description}
                onChange={e => setNewCat({ ...newCat, description: e.target.value })}
                required
              />
              <div className="flex gap-2 mt-2 justify-center">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded font-semibold"
                  onClick={() => setShowCatModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">
          {selectedCategory
            ? `Items in "${categories.find((c) => String(c.id) === String(selectedCategory))?.name || ''}"`
            : 'All Community Items'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-2xl p-4 bg-white shadow-lg hover:shadow-2xl transition-all duration-200 flex flex-col">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.title}
                className="w-full h-40 object-cover rounded-xl mb-2"
              />
              <h2 className="text-xl font-semibold mt-2 text-blue-900">{item.title}</h2>
              <p className="text-sm text-gray-600 flex-1">
                {item.description?.slice(0, 80)}...
              </p>
              <div className="mb-3">
                <span className="text-xl font-semibold text-blue-700">
                  ₹{item.price_per_day}
                </span>
                <span className="text-sm text-gray-500 ml-1">per day</span>
              </div>
              {item.availability_status === 'available' && (
                <p className="text-green-600 font-medium mt-2">
                  ✔ Available to borrow
                </p>
              )}
              <Link
                to={`/items/${item.id}`}
                className="inline-block mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No items found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default Home;