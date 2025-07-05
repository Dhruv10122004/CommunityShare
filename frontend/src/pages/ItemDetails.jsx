import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`/api/items/${id}`);
                setItem(res.data);
            } catch (err) {
                console.log('Error fetching item details', err);
            }
        };
        fetchItem();
    }, [id]);

    if (!item)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
                Loading item details...
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden w-full max-w-6xl h-[80vh] flex flex-col md:flex-row">
                {/* Image */}
                <div className="w-full md:w-1/2 h-64 md:h-full">
                    <img
                        src={item.image_url || '/placeholder.png'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Details */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">{item.title}</h1>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {item.description}
                        </p>

                        <div className="mb-3">
                            <span className="text-xl font-semibold text-blue-700">
                                ₹{item.price_per_day}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">per day</span>
                        </div>

                        <p className="text-sm text-gray-700 mb-1">
                            <strong>Condition:</strong> {item.condition}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                            <strong>Location:</strong> {item.location}
                        </p>

                        {item.availability_status === 'available' && (
                            <p className="text-green-600 font-medium mt-2">
                                ✔ Available to borrow
                            </p>
                        )}
                    </div>

                    {user && item && user?.user?.id !== item.owner_id
 && (
                        <Link
                            to={`/messages/${item.owner_id}`}
                            className="mt-6 inline-block text-center bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                        >
                            Contact Owner
                        </Link>
                    )}

                </div>
            </div>
        </div>
    );

}

export default ItemDetails;
