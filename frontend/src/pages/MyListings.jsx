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

  return (
    <div className="min-h-screen bg-[#F3F4E8] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#4e5d58] mb-8 text-center">
          My Listed Items
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-[#819A91] text-lg">No items listed yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="border border-[#D4DBC1] rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px] flex flex-col relative"
              >
                <img
                  src={item.image_url || '/placeholder.png'}
                  alt={item.title}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-bold text-[#4e5d58] mb-1">{item.title}</h2>
                <p className="text-sm text-[#667c75] mb-2">
                  {item.description?.slice(0, 80)}...
                </p>
                <p className="text-[#819A91] font-semibold text-sm mb-2">
                  {item.is_free ? 'Free' : `₹${item.price_per_day} / day`}
                </p>

                <div className="mt-auto flex justify-between items-center pt-4">
                  <Link
                    to={`/items/${item.id}`}
                    className="px-4 py-1 text-sm bg-[#819A91] text-white rounded hover:bg-[#6d857f] transition"
                  >
                    View Item
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdown(openDropdown === idx ? null : idx)
                      }
                      className="p-2 rounded-full hover:bg-[#F3F4E8] transition"
                    >
                      <MoreVertical className="h-5 w-5 text-[#4e5d58]" />
                    </button>

                    {openDropdown === idx && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border border-[#D4DBC1] rounded-md shadow-md z-10">
                        <Link
                          to={`/items/${item.id}/edit`}
                          className="block px-4 py-2 text-sm text-[#4e5d58] hover:bg-[#F3F4E8]"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#F3F4E8]"
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
