"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api"

function Home() {
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showCatModal, setShowCatModal] = useState(false)
  const [newCat, setNewCat] = useState({ name: "", description: "" })
  const [catError, setCatError] = useState("")
  const { user, logout, token } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const timeoutRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories")
        setCategories(res.data)
      } catch (err) {
        console.error("Error fetching categories:", err)
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = selectedCategory ? `/api/items?categoryId=${selectedCategory}` : "/api/items"
        const res = await api.get(url)
        setItems(res.data)
      } catch (err) {
        console.error("Error fetching items:", err)
      }
    }
    fetchItems()
  }, [selectedCategory])

  const handleCreateCategory = async (e) => {
    e.preventDefault()
    setCatError("")
    if (categories.some((cat) => cat.name.toLowerCase() === newCat.name.trim().toLowerCase())) {
      setCatError("Category already exists.")
      return
    }
    try {
      const res = await api.post("/api/categories", newCat, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories([...categories, res.data])
      setShowCatModal(false)
      setNewCat({ name: "", description: "" })
    } catch (err) {
      if (err.response?.status === 401) {
        setCatError("You are not authorized. Please log in to create a category.")
      } else if (err.response?.status === 409) {
        setCatError("Category already exists.")
      } else {
        setCatError("Failed to create category")
      }
    }
  }
  console.log("Base URL:", import.meta.env.VITE_API_BASE_URL);

  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, item.title);
    console.log(`Image URL:`, item.image_url);
    console.log(`Full URL: ${import.meta.env.VITE_API_BASE_URL}${item.image_url}`);
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Simple Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Community Marketplace</h1>
            <p className="text-slate-600 text-sm mt-1">Discover and borrow items from our community</p>
          </div>

          {!user && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 rounded-lg border-2 border-blue-200 text-blue-700 font-medium hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white text-sm"
              >
                Register
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200 text-sm"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* Compact Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-700">Filter by:</span>
                <select
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory("")}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Clear filter
                </button>
              )}
            </div>

            {user && (
              <button
                onClick={() => setShowCatModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-lg hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all duration-200"
              >
                + Add Category
              </button>
            )}
          </div>
        </div>

        {/* Category Modal */}
        {showCatModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
              <form onSubmit={handleCreateCategory} className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-slate-800 text-center">Create New Category</h2>

                {catError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 text-sm text-center font-medium">{catError}</p>
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      placeholder="Enter category name"
                      className="w-full border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-slate-700"
                      value={newCat.name}
                      onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea
                      placeholder="Enter category description"
                      className="w-full border border-slate-300 p-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24 transition-all duration-200 text-slate-700 resize-none"
                      value={newCat.description}
                      onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Create Category
                  </button>
                  <button
                    type="button"
                    className="flex-1 border-2 border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 bg-white"
                    onClick={() => setShowCatModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Items Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 mb-1">
            {selectedCategory
              ? `${categories.find((c) => String(c.id) === String(selectedCategory))?.name || ""} Items`
              : "All Items"}
          </h2>
          <p className="text-slate-600 text-sm">
            {items.length} {items.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-slate-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    item.image_url
                      ? `${import.meta.env.VITE_API_BASE_URL}${item.image_url}`
                      : "/placeholder.png"
                  }
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  {item.availability_status === "available" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                      Borrowed
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">{item.title}</h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {item.description?.slice(0, 80)}...
                </p>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-slate-800">₹{item.price_per_day}</span>
                    <span className="text-sm text-slate-500 font-medium">per day</span>
                  </div>
                </div>

                <Link
                  to={`/items/${item.id}`}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Items Message */}
        {items.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-slate-300 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
              <p className="text-slate-600">
                {selectedCategory
                  ? "No items found in this category. Try selecting a different category."
                  : "No items available at the moment. Check back later."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
