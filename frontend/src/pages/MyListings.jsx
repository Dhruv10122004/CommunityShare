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
        const res = await axios.get('/api/items/my-listings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setItems(res.data); // ✅ Corrected here
      } catch (err) {
        console.error('Error fetching your items', err.response?.data || err.message);
      }
    };

    fetchMyItems();
  }, [token]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Listed Items</h1>
      {items.length === 0 ? (
        <p>No items listed yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map(item => (
            <div key={item.id} className="border rounded p-4 shadow bg-white">
              <img
                src={item.image_url || '/placeholder.png'}
                alt={item.title}
                className="w-full h-32 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-2">{item.title}</h2>
              <p className="text-gray-500 text-sm">{item.description.slice(0, 60)}...</p>
              <p className="text-blue-600 font-bold mt-2">
                {item.is_free ? 'Free' : `₹${item.price_per_day}/day`}
              </p>
              <Link
                to={`/items/${item.id}`}
                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
              >
                View Item
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListings;