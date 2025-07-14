import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../api";

function PostItem() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category_id: '',
        price_per_day: '',
        is_free: true,
        condition: 'good',
        location: '',
        image_url: ''
    });

    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get('/api/categories');
                setCategories(res.data);
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/items', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            navigate('/');
        } catch (err) {
            console.error('Item submission failed', err);
        }
    };

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Post a New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2" required />
                <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" required />
                <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full border p-2"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <input name="price_per_day" placeholder="Price per day (₹)" onChange={handleChange} className="w-full border p-2" />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="availability_status"
                        checked={formData.availability_status === 'available'}
                        onChange={(e) =>
                            setFormData(prev => ({
                                ...prev,
                                availability_status: e.target.checked ? 'available' : 'unavailable'
                            }))
                        }
                    /> Free to borrow

                </label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border p-2">
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>
                <input name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2" required />
                <input name="image_url" placeholder="Image URL" onChange={handleChange} className="w-full border p-2" />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit</button>
            </form>
        </div>
    );
}

export default PostItem;