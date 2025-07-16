"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useNavigate } from "react-router-dom"
import api from "../api"

function ItemDetails() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [endDate, setEndDate] = useState(null)
  const [totalAmount, setTotalAmount] = useState(null)
  const today = new Date()

  const calculateAmount = (start, end, rate) => {
    const diffTime = Math.abs(end - start)
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return days * Number.parseFloat(rate)
  }

  const onEndDateChange = (date) => {
    setEndDate(date)
    if (date) {
      const amount = calculateAmount(today, date, item.price_per_day)
      setTotalAmount(amount.toFixed(2))
    } else {
      setTotalAmount(0)
    }
  }

  const handleBorrow = async () => {
    if (!endDate) {
      alert("Please select an end date.")
      return
    }
    const today = new Date()
    try {
      const res = await api.post("/api/bookings", {
        item_id: item.id,
        borrower_id: user.id,
        owner_id: item.owner_id,
        start_date: today.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        total_amount: calculateAmount(today, endDate, item.price_per_day),
        notes: "",
      })
      alert("Booking successful!")
      navigate("/")
    } catch (err) {
      console.error("Error creating booking:", err.response?.data || err.message)
      alert("Failed to book item.")
    }
  }

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/items/${id}`)
        setItem(res.data)
      } catch (err) {
        console.log("Error fetching item details", err)
      }
    }
    fetchItem()
  }, [id])

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-slate-700 font-medium">Loading item details...</span>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-slate-200 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/home")}
            className="inline-flex items-center text-slate-600 hover:text-slate-800 font-medium transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Items
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
            {/* Image Section */}
            <div className="relative h-64 lg:h-full">
              <img src={
                item.image_url
                  ? `${import.meta.env.VITE_API_BASE_URL}${item.image_url}`
                  : "/placeholder.png"
              } alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 right-4">
                {item.availability_status === "available" ? (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200 shadow-sm">
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200 shadow-sm">
                    Borrowed
                  </span>
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Title and Description */}
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{item.title}</h1>
                  <p className="text-slate-600 leading-relaxed text-lg">{item.description}</p>
                </div>

                {/* Price */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-800">₹{item.price_per_day}</span>
                    <span className="text-slate-500 font-medium">per day</span>
                  </div>
                </div>

                {/* Item Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-800 mb-1">Condition</p>
                    <p className="text-blue-700 capitalize">{item.condition}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-800 mb-1">Location</p>
                    <p className="text-purple-700">{item.location}</p>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="mt-8 space-y-6">
                {/* Owner Message */}
                {user && item && user?.id === item.owner_id && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                    <p className="text-amber-800 font-medium">You are the owner of this item</p>
                  </div>
                )}

                {/* User Actions */}
                {user && item && user?.id !== item.owner_id && (
                  <div className="space-y-4">
                    {/* Contact Owner Button */}
                    <Link
                      to={`/messages/${item.owner_id}`}
                      className="block w-full text-center bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Contact Owner
                    </Link>

                    {/* Booking Section */}
                    {item.availability_status === "available" ? (
                      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Book this item</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                              Select return date
                            </label>
                            <DatePicker
                              selected={endDate}
                              onChange={onEndDateChange}
                              minDate={today}
                              placeholderText="Choose end date"
                              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                          </div>

                          {endDate && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <p className="text-blue-800 font-semibold text-lg">Total Amount: ₹{totalAmount}</p>
                              <p className="text-blue-600 text-sm mt-1">
                                {Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))} days
                              </p>
                            </div>
                          )}

                          <button
                            onClick={handleBorrow}
                            disabled={!endDate}
                            className={`w-full py-4 rounded-xl font-semibold shadow-lg transition-all duration-200 ${endDate
                                ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white hover:shadow-xl"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                              }`}
                          >
                            {endDate ? "Confirm Booking" : "Select Date to Book"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-800 font-semibold mb-2">Currently Not Available</p>
                        <p className="text-red-600 text-sm">This item is currently borrowed by another user</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Login Prompt for Non-Users */}
                {!user && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4">
                    <p className="text-blue-800 font-medium">Sign in to contact the owner or book this item</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="px-6 py-2 border-2 border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-all duration-200"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ItemDetails
