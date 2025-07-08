import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyListings() {
  const [items, setItems] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMyItems = async () => {
      if (!token) return;
      try {
        const res = await axios.get('/api/items/my-listings');
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching your items', err.response?.data || err.message);
      }
    };
    fetchMyItems();
  }, [token]);

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
            {items.map(item => (
              <div
                key={item.id}
                className="border border-[#D4DBC1] rounded-xl p-5 bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
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
                <Link
                  to={`/items/${item.id}`}
                  className="inline-block text-sm text-[#819A91] hover:underline mt-2"
                >
                  View Item
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;
