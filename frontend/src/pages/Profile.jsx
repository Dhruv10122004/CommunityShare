"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { User, Mail, Calendar, BookOpen, Trash2 } from "lucide-react"
import api from "../api";

function Profile() {
  const { token, logout } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile")
        setProfile(res.data)
      } catch (err) {
        console.error("Error fetching profile info", err.response?.data || err.message)
      }
    }
    fetchProfile()
  }, [token])

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) return
    try {
      await api.delete("/api/me")
      logout()
      window.location.href = "/register"
    } catch (err) {
      console.error("Failed to delete account", err.response?.data || err.message)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-md">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-100 rounded-lg w-3/4 mx-auto"></div>
            <div className="space-y-3">
              <div className="h-4 bg-slate-100 rounded w-full"></div>
              <div className="h-4 bg-slate-100 rounded w-5/6"></div>
              <div className="h-4 bg-slate-100 rounded w-4/6"></div>
              <div className="h-4 bg-slate-100 rounded w-3/6"></div>
            </div>
          </div>
          <p className="text-slate-700 text-center mt-6 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-400 to-slate-500 px-8 py-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-10 h-10 text-slate-700" />
          </div>
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-white/80 text-sm mt-1">Account Information</p>
        </div>

        {/* Profile Information */}
        <div className="px-8 py-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Full Name</p>
                <p className="text-lg font-semibold text-slate-700">{profile.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-500">Email Address</p>
                <p className="text-lg font-semibold text-slate-700">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Calendar className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Total Bookings</p>
                  <p className="text-xl font-bold text-slate-700">{profile.totalBookings}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Currently Borrowed</p>
                  <p className="text-xl font-bold text-slate-700">{profile.currentlyBorrowed}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-500 mb-4">
                Need to delete your account? This action cannot be undone.
              </p>
              <button
                onClick={deleteAccount}
                className="inline-flex items-center space-x-2 bg-red-800 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;
