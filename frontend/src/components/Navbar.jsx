import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef, useState } from 'react';

function Navbar() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  // ✅ Hide navbar on landing page ("/")
  if (location.pathname === "/") return null;

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
    <header className="bg-gradient-to-br from-blue-300 to-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold text-slate-700">
          CommunityShare
        </Link>

        {token && user && (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center font-semibold shadow-md hover:bg-green-700 transition">
              {(user.username?.[0]?.toUpperCase() || 'U') +
                (user.username?.[1]?.toUpperCase() || '')}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                <button
                  onClick={() => navigate('/profile')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/my-listings')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  My Listings
                </button>
                <button
                  onClick={() => navigate('/my-bookings')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => navigate('/messages')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Messages Inbox
                </button>
                <button
                  onClick={() => navigate('/post-item')}
                  className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Add New Item
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-800 hover:bg-red-100"
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
