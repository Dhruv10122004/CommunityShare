import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import api from "../api";

function EditItem() {

    const { id } = useParams();
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        api.get(`/api/items/${id}`).then(res => setFormData(res.data));
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        await api.put(`/api/items/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        navigate('/my-listings');
    };
    
    if(!formData) {
        return <p>No form data.</p>
    }

    return (
    <div className="p-4 max-w-3xl mx-auto bg-[#F3F4E8] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#4e5d58]">Edit Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow border border-[#D4DBC1]">
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border border-[#A7C3AD] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#819A91]"
          placeholder="Title"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-[#A7C3AD] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#819A91]"
          placeholder="Description"
        />
        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full border border-[#A7C3AD] p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#819A91]"
          placeholder="Location"
        />
        <div className="text-right">
          <button
            type="submit"
            className="bg-[#A7C3AD] hover:bg-[#90b69d] text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 shadow"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditItem;