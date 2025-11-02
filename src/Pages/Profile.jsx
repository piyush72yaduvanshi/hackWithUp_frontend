import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "./NavBar";

const BACKEND_URL = 'https://hackwithupbackend-main-production.up.railway.app';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cropAdvisory, setCropAdvisory] = useState([]);
  const [cropPriceData, setCropPriceData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchCropAdvisory();
    fetchCropPriceData();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/auth/v1/profile`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Profile Data:", response.data);

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Profile Error:", err);

      if (err.response && err.response.status === 401) {
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

  const fetchCropAdvisory = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/crop-advisory`,
        {
          withCredentials: true,
        }
      );
      setCropAdvisory(response.data || []);
    } catch (err) {
      console.error("Crop Advisory Error:", err);
      // Set default advisory if API fails
      setCropAdvisory([
        {
          title: "Irrigation Schedule",
          description: "Water your crop every 3-4 days during summer",
          icon: "💧",
        },
        {
          title: "Fertilizer Application",
          description: "Apply NPK fertilizer at recommended intervals",
          icon: "🌱",
        },
        {
          title: "Pest Management",
          description: "Monitor for common pests and apply preventive measures",
          icon: "🐛",
        },
      ]);
    }
  };

  const fetchCropPriceData = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/crop-prices`,
        {
          withCredentials: true,
        }
      );
      setCropPriceData(response.data || []);
    } catch (err) {
      console.error("Crop Price Error:", err);
      // Set default price data if API fails
      setCropPriceData([
        { month: "Jan", price: 2500 },
        { month: "Feb", price: 2650 },
        { month: "Mar", price: 2800 },
        { month: "Apr", price: 2700 },
        { month: "May", price: 2900 },
        { month: "Jun", price: 3100 },
      ]);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/auth/v1/logout`,
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
    } finally {
      localStorage.clear();

      document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
      });

      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Navbar />
        <div className="ml-[300px] p-5 flex gap-5 bg-red-50 rounded-xl w-full h-screen flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">{error}</h2>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-[14px] font-semibold"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Please Login
      </div>
    );
  }

  // Simple bar chart renderer
  const maxPrice = Math.max(...cropPriceData.map((d) => d.price), 0);

  return (
    <div className="flex">
      <Navbar />

      <div className="ml-[300px] p-5 bg-[#f0fff0] w-full min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[28px] text-[#2c5f2d] font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-[#666] text-[14px]">
            Welcome back, {user?.name}!
          </p>
        </div>

        {/* Three Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Card 1: Farmer Information */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-[18px] text-[#2c5f2d] mb-4 font-semibold border-b-2 border-[#2c5f2d] pb-2">
              👨‍🌾 Farmer Info
            </h2>

            {/* Avatar Section */}
            <div className="flex justify-center mb-4">
              <img
                src={
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/219/219969.png"
                }
                className="w-[80px] h-[80px] rounded-full border-[3px] border-[#2c5f2d]"
                alt="avatar"
              />
            </div>

            {/* Profile Information */}
            <div className="space-y-2 text-[13px] text-[#444]">
              <p>
                <strong>Name:</strong> {user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phone || "N/A"}
              </p>
              <p>
                <strong>Location:</strong> {user?.location || "N/A"}
              </p>
              <p>
                <strong>Land Size:</strong> {user?.landSize || user?.land_size || "N/A"}
              </p>
              <p>
                <strong>Main Crop:</strong>{" "}
                {user?.mainCrop || user?.main_crop || "N/A"}
              </p>
              <p>
                <strong>Soil Type:</strong>{" "}
                {user?.soilType || user?.soil_type || "N/A"}
              </p>
              <p>
                <strong>Irrigation:</strong> {user?.irrigation || "N/A"}
              </p>
              <p>
                <strong>Experience:</strong> {user?.experience || "N/A"} Years
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to="/updateProfile"
                className="w-full block text-center bg-[#2c5f2d] hover:bg-[#244d24] text-white px-3 py-2 rounded-md text-[13px] font-semibold transition-all"
              >
                Update Profile
              </Link>
            </div>
          </div>

          {/* Card 2: Crop Advisory */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-[18px] text-[#2c5f2d] mb-4 font-semibold border-b-2 border-[#2c5f2d] pb-2">
              🌾 Crop Advisory
            </h2>

            <div className="space-y-3">
              {cropAdvisory.length > 0 ? (
                cropAdvisory.map((advisory, idx) => (
                  <div
                    key={idx}
                    className="bg-green-50 p-3 rounded-lg border border-green-200 hover:bg-green-100 transition"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xl">{advisory.icon || "💡"}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-[13px] text-[#2c5f2d]">
                          {advisory.title}
                        </p>
                        <p className="text-[12px] text-[#666] mt-1">
                          {advisory.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-[#999]">
                  No advisories available
                </p>
              )}
            </div>

            {/* Advisory Button */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-[13px] font-semibold transition-all">
                View More
              </button>
            </div>
          </div>

          {/* Card 3: Crop Price Graph */}
          <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-[18px] text-[#2c5f2d] mb-4 font-semibold border-b-2 border-[#2c5f2d] pb-2">
              📊 Crop Price Trend
            </h2>

            {/* Simple Bar Chart */}
            <div className="space-y-2">
              {cropPriceData.length > 0 ? (
                cropPriceData.map((data, idx) => (
                  <div key={idx} className="flex items-end gap-2">
                    <span className="text-[12px] font-semibold text-[#666] w-8">
                      {data.month}
                    </span>
                    <div className="flex-1 bg-green-200 rounded-sm relative group">
                      <div
                        className="h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-sm transition-all hover:from-green-600 hover:to-green-700"
                        style={{
                          width: `${(data.price / maxPrice) * 100}%`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 text-[11px] font-bold text-[#2c5f2d] opacity-0 group-hover:opacity-100 transition-opacity">
                          ₹{data.price}
                        </span>
                      </div>
                    </div>
                    <span className="text-[12px] font-semibold text-[#2c5f2d] w-12">
                      ₹{data.price}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-[13px] text-[#999]">
                  No price data available
                </p>
              )}
            </div>

            {/* Price Info */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-center text-[12px]">
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-[#666]">Avg Price</p>
                  <p className="font-bold text-[#2c5f2d]">
                    ₹
                    {cropPriceData.length > 0
                      ? Math.round(
                          cropPriceData.reduce((a, b) => a + b.price, 0) /
                            cropPriceData.length
                        )
                      : 0}
                  </p>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <p className="text-[#666]">Max Price</p>
                  <p className="font-bold text-[#2c5f2d]">
                    ₹{maxPrice || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-3 justify-end mb-8">
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-[14px] font-semibold transition-all"
          >
            Back Home
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md text-[14px] font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
