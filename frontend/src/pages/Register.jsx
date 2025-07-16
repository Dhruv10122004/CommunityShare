import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '',
    phone: '', address: '', city: '', state: '', zip_code: '', profile_image: ''
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
      navigate('/home');
    } catch {
      setError('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-slate-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg flex flex-col gap-3"
      >
        <div className="mb-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-brand-secondary flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-brand-primary mb-1">Create Account</h2>
          <p className="text-brand-text text-sm">Join our community to share and borrow resources!</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['username', 'email', 'password', 'profile_image', 'first_name', 'last_name', 'phone', 'address', 'city', 'state', 'zip_code'].map((field, i) => (
            <input
              key={i}
              name={field}
              type={field === 'email' ? 'email' : field === 'password' ? 'password' : 'text'}
              placeholder={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              className="border border-brand-secondary p-2 rounded focus:ring-2 focus:ring-brand-primary"
              onChange={handleChange}
              required={['username', 'email', 'password', 'first_name', 'last_name'].includes(field)}
            />
          ))}
        </div>
        <button type="submit" className="w-full bg-blue-700 hover:bg-slate-500 text-white font-semibold py-2 rounded shadow transition mt-4">
          Register
        </button>
        <p className="mt-4 text-brand-text text-xs text-center">
          Already have an account? <a href="/login" className="text-brand-primary hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
