// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

function Navbar() {
  const { token, logout, user } = useAuth(); // Make sure user is exposed in context
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-[#4e5d58]">
          CommunityShare
        </Link>

        {token && user && (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="w-10 h-10 bg-[#A7C3AD] text-white rounded-full flex items-center justify-center font-semibold shadow-md hover:bg-[#819A91] transition">
              {(user.username?.[0]?.toUpperCase() || 'U') +
                (user.username?.[1]?.toUpperCase() || '')}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#D4DBC1] rounded-lg shadow-lg z-50">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/my-listings')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  My Listings
                </button>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => navigate('/post-item')}
                  className="block w-full text-left px-4 py-2 text-[#4e5d58] hover:bg-[#F3F4E8]"
                >
                  Add New Item
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-[#d9534f] hover:bg-[#f8d7da]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
