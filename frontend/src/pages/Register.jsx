import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    profile_image: ''
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-3"
      >
        <div className="mb-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-green-700 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Join our community to share and borrow resources!</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="username" placeholder="Username" className="border p-2 rounded" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" className="border p-2 rounded" onChange={handleChange} required />
          <input name="profile_image" placeholder="Profile Image URL (optional)" className="border p-2 rounded" onChange={handleChange} />
          <input name="first_name" placeholder="First Name" className="border p-2 rounded" onChange={handleChange} required />
          <input name="last_name" placeholder="Last Name" className="border p-2 rounded" onChange={handleChange} required />
          <input name="phone" placeholder="Phone (optional)" className="border p-2 rounded" onChange={handleChange} />
          <input name="address" placeholder="Address (optional)" className="border p-2 rounded" onChange={handleChange} />
          <input name="city" placeholder="City (optional)" className="border p-2 rounded" onChange={handleChange} />
          <input name="state" placeholder="State (optional)" className="border p-2 rounded" onChange={handleChange} />
          <input name="zip_code" placeholder="Zip Code (optional)" className="border p-2 rounded" onChange={handleChange} />
        </div>
        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow transition mt-4">
          Register
        </button>
        <p className="mt-4 text-gray-500 text-xs text-center">
          Already have an account? <a href="/login" className="text-green-600 hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;