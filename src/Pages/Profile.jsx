import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      // ALWAYS fetch fresh data from API, don't rely on localStorage
      // This ensures we show the correct user data for the currently logged-in user
      const response = await axios.get(
        "http://localhost:5000/auth/v1/profile",
        {
          withCredentials: true, // Important for cookie-based auth
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile Data:", response.data);

      if (response.data.success) {
        setUser(response.data.user);
        // Update localStorage with fresh data from API
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (err) {
      console.error("Profile Error:", err);

      if (err.response && err.response.status === 401) {
        // Unauthorized - redirect to login
        setError("Please login to access your profile");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout API to clear HTTP-only cookies on server
      await axios.post(
        "http://localhost:5000/auth/v1/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Logout successful - cookies cleared on server");
    } catch (err) {
      console.error("Logout error:", err);
      // Continue with logout even if API fails
    } finally {
      // Clear ALL local storage data
      localStorage.clear();

      // Clear any client-side cookies (non-HTTP-only ones)
      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });

      // Force page reload to clear all cached data and redirect to login
      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-12 text-center">
            <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-green-600">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{user?.name}</h1>
            <p className="text-green-100">{user?.email}</p>
          </div>

          {/* Profile Details */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Full Name
                </p>
                <p className="text-lg text-gray-900">{user?.name}</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Email Address
                </p>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Location
                </p>
                <p className="text-lg text-gray-900">{user?.location}</p>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Phone Number
                </p>
                <p className="text-lg text-gray-900">{user?.phone}</p>
              </div>

              {/* Land Size */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Land Size
                </p>
                <p className="text-lg text-gray-900">{user?.land_size} acres</p>
              </div>

              {/* Main Crop */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-600 mb-1">
                  Main Crop
                </p>
                <p className="text-lg text-gray-900">{user?.main_crop}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/home")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Back to Home
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* User ID Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">
            Account Details
          </h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600 mb-1">User ID</p>
            <p className="text-sm text-gray-900 font-mono break-all">
              {user?.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
