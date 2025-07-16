import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../api";
import { MoreVertical } from 'lucide-react';

function MyListings() {
  const [items, setItems] = useState([]);
  const { token } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!token) return;
      try {
        const res = await api.get('/api/items/my-listings');
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching your items', err.response?.data || err.message);
      }
    };
    fetchMyItems();
  }, [token]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/api/items/${id}`);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item', err.response?.data || err.message);
    }
  };
  console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);

  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item.title);
    console.log(`Image URL:`, item.image_url);
    console.log(`Full URL: ${import.meta.env.VITE_API_BASE_URL}${item.image_url}`);
  });
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-700 mb-8 text-center">
          My Listed Items
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-green-700 text-lg">No items listed yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col relative"
              >
                <img src={
                item.image_url
                  ? `${import.meta.env.VITE_API_BASE_URL}${item.image_url}`
                  : "/placeholder.png"
              } alt={item.title} className="w-full h-full object-cover" />
                <h2 className="text-lg font-bold text-slate-700 mb-1">{item.title}</h2>
                <p className="text-sm text-slate-600 mb-2">
                  {item.description?.slice(0, 80)}...
                </p>
                <p className="text-green-700 font-semibold text-sm mb-2">
                  {item.is_free ? 'Free' : `₹${item.price_per_day} / day`}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4">
                  <Link
                    to={`/items/${item.id}`}
                    className="px-4 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition"
                  >
                    View Item
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? null : idx)
                      }
                      className="p-2 rounded-full hover:bg-slate-50 transition"
                    >
                      <MoreVertical className="h-5 w-5 text-slate-700" />
                    </button>

                    {openDropdown === idx && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-md shadow-md z-10">
                        <Link
                          to={`/items/${item.id}/edit`}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-800 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;
