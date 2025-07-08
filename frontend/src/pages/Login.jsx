import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#A7C3AD] to-[#F3F4E8] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col items-center"
      >
        <div className="mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#D4DBC1] flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-[#819A91]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-[#819A91] mb-1">Welcome Back</h2>
          <p className="text-[#667c75] text-sm">Please login to your account</p>
        </div>
        {error && <p className="text-red-500 text-sm mb-4 w-full text-center">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-[#A7C3AD] focus:ring-2 focus:ring-[#819A91] rounded px-4 py-2 mb-4 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-[#A7C3AD] focus:ring-2 focus:ring-[#819A91] rounded px-4 py-2 mb-6 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-[#819A91] hover:bg-[#6d857f] text-white font-semibold py-2 rounded shadow transition"
        >
          Login
        </button>
        <p className="mt-6 text-[#667c75] text-xs text-center">
          Don&apos;t have an account? <a href="/register" className="text-[#819A91] hover:underline">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
