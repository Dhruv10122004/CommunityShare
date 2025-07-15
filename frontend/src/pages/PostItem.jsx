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
        availability_status: 'available'
    });
    const [imageFile, setImageFile] = useState(null);
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

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const submissionData = new FormData();
            Object.keys(formData).forEach(key => {
                submissionData.append(key, formData[key]);
            });

            if (imageFile) {
                submissionData.append('image', imageFile); // name should match Multer's `.single('image')`
            }

            await axios.post('/api/items', submissionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
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
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
                        name="is_free"
                        checked={formData.is_free}
                        onChange={handleChange}
                    />
                    Free to borrow
                </label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border p-2">
                    <option value="new">New</option>
                    <option value="like_new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                </select>
                <input name="location" placeholder="Location" onChange={handleChange} className="w-full border p-2" required />

                {/* Image Upload */}
                <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border p-2" />

                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PostItem;
