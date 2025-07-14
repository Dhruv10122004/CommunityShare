import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import api from "../api";


function ItemDetails() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [endDate, setEndDate] = useState(null);
    const [totalAmount, setTotalAmount] = useState(null);
    const today = new Date();

    const calculateAmount = (start, end, rate) => {
        const diffTime = Math.abs(end - start);
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // console.log(days * parseFloat(rate));
        return days * parseFloat(rate);
    };

    const onEndDateChange = (date) => {
        setEndDate(date);
        if (date) {
            const amount = calculateAmount(today, date, item.price_per_day);
            setTotalAmount(amount.toFixed(2));
        } else {
            setTotalAmount(0);
        }
    };

    const handleBorrow = async () => {
        if (!endDate) {
            alert('Please select an end date.');
            return;
        }

        const today = new Date();
        try {
            const res = await api.post('/api/bookings', {
                item_id: item.id,
                borrower_id: user.id,
                owner_id: item.owner_id,
                start_date: today.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                total_amount: calculateAmount(today, endDate, item.price_per_day),
                notes: '',
            });

            alert('Booking successful!');
            navigate('/');
        } catch (err) {
            console.error('Error creating booking:', err.response?.data || err.message);
            alert('Failed to book item.');
        }
    }

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/api/items/${id}`);
                setItem(res.data);
            } catch (err) {
                console.log('Error fetching item details', err);
            }
        };
        fetchItem();
    }, [id]);

    if (!item)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F3F4E8] text-[#667c75]">
                Loading item details...
            </div>
        );

    return (
        <div className="min-h-screen bg-[#F3F4E8] flex items-center justify-center px-4 py-10">
            <div className="bg-white border border-[#D4DBC1] shadow-lg rounded-2xl overflow-hidden w-full max-w-6xl h-auto md:h-[80vh] flex flex-col md:flex-row transition-all">
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
                        <h1 className="text-3xl font-bold text-[#4e5d58] mb-3">{item.title}</h1>
                        <p className="text-[#667c75] mb-4 text-sm leading-relaxed">
                            {item.description}
                        </p>

                        <div className="mb-3">
                            <span className="text-xl font-semibold text-[#819A91]">
                                ₹{item.price_per_day}
                            </span>
                            <span className="text-sm text-[#667c75] ml-1">per day</span>
                        </div>

                        <p className="text-sm text-[#4e5d58] mb-1">
                            <strong>Condition:</strong> {item.condition}
                        </p>
                        <p className="text-sm text-[#4e5d58] mb-2">
                            <strong>Location:</strong> {item.location}
                        </p>

                        {item.availability_status === 'available' ? (
                            <p className="text-green-700 font-medium mt-2">
                                ✓ Available to borrow
                            </p>
                        ) : (
                            <p className="text-red-500 font-bold">Borrowed</p>
                        )}
                    </div>

                    {user && item && user?.id === item.owner_id && (
                        <p className="mt-6 text-center text-[#819A91] font-medium">
                            You are the owner of this item.
                        </p>
                    )}

                    {user && item && user?.id !== item.owner_id && (
                        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                            <Link
                                to={`/messages/${item.owner_id}`}
                                className="text-center bg-[#819A91] text-white px-6 py-3 rounded-xl hover:bg-[#6d857f] transition"
                            >
                                Contact Owner
                            </Link>

                            {item.availability_status === 'available' ? (
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={onEndDateChange}
                                        minDate={today}
                                        placeholderText="Select end date"
                                        className="border border-gray-300 rounded px-3 py-2"
                                    />

                                    {endDate && (
                                        <p className="text-[#4e5d58] font-medium">
                                            Total Amount: ₹{totalAmount}
                                        </p>
                                    )}

                                    <button
                                        onClick={handleBorrow}
                                        disabled={!endDate}
                                        className={`px-6 py-3 rounded-xl text-white transition ${endDate
                                            ? 'bg-[#A7C3AD] hover:bg-[#90af9a]'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Borrow
                                    </button>
                                </div>
                            ) : (
                                <button
                                    disabled
                                    className="bg-gray-400 text-white px-6 py-3 rounded-xl cursor-not-allowed"
                                >
                                    Not Available
                                </button>
                            )}
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default ItemDetails;
