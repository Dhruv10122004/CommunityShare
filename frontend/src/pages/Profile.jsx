import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/me/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile info', err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;

    try {
      await axios.delete('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      logout(); // Clears context + localStorage
      window.location.href = '/register';
    } catch (err) {
      console.error('Failed to delete account', err.response?.data || err.message);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#F3F4E8] flex items-center justify-center">
        <p className="text-[#4e5d58] text-lg">Unable to fetch profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4E8] py-10 px-4">
      <div className="max-w-xl mx-auto bg-white border border-[#D4DBC1] rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold text-[#4e5d58] mb-4 text-center">My Profile</h1>

        <div className="space-y-3 text-[#4e5d58]">
          <p><span className="font-semibold">Name:</span> {profile.name}</p>
          <p><span className="font-semibold">Email:</span> {profile.email}</p>
          <p><span className="font-semibold">Last Login:</span> {new Date(profile.lastLogin).toLocaleString()}</p>
          <p><span className="font-semibold">Total Bookings Made:</span> {profile.totalBookings}</p>
          <p><span className="font-semibold">Items Currently Borrowed:</span> {profile.currentlyBorrowed}</p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={deleteAccount}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
