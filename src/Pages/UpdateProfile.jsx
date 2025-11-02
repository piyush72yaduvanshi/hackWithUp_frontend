// UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    land_size: "",
    main_crop: "",
    phone: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch user details on page load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/v1/profile",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const userData = response.data.user || response.data;
        
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          location: userData.location || "",
          land_size: userData.land_size || userData.landSize || "",
          main_crop: userData.main_crop || userData.mainCrop || "",
          phone: userData.phone || "",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        "http://localhost:5000/auth/v1/updateProfile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("Profile updated successfully ✅");
      
      // Update localStorage with new data
      localStorage.setItem("user", JSON.stringify(response.data.user || formData));
      
      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.response?.data?.message || "Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">Update Profile</h2>
            <p className="text-sm text-gray-600">
              Modify your farming information
            </p>
          </div>

          {/* Success/Error Messages */}
          {message && (
            <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6 text-center font-semibold">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-center font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Row 2: Phone & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="9876543210"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="City, State"
                  required
                />
              </div>
            </div>

            {/* Row 3: Land Size & Main Crop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Land Size (Acres)
                </label>
                <input
                  type="text"
                  name="land_size"
                  value={formData.land_size}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="10"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-sm font-semibold text-gray-800 mb-2">
                  Main Crop
                </label>
                <input
                  type="text"
                  name="main_crop"
                  value={formData.main_crop}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                  placeholder="Wheat, Rice, etc."
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
