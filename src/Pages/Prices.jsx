import React, { useState } from "react";
import axios from "axios";

export default function Prices() {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setPriceData(null);

      const response = await axios.post(
        "http://localhost:5000/auth/v1/priceThroughAi",
        {}, // Backend uses user's profile data (location & main_crop), no need to send crop/city
        {
          withCredentials: true, // ✅ IMPORTANT: Send authentication cookie
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      );
      
      console.log("Price Response:", response.data);
      console.log("Price Info:", response.data.data?.priceInfo);

      if (response.data.success) {
        setPriceData(response.data.data);
      } else {
        setError("Failed to fetch price data");
      }
    } catch (err) {
      console.error("Error fetching price:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (err.response) {
        if (err.response.status === 401) {
          setError("Please login first to access this feature. Redirecting to login...");
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          setError(`Server error: ${err.response.status}. ${err.response.data?.message || 'Please check backend'}`);
        }
      } else if (err.request) {
        setError("No response from server. Check if backend is running on port 5000.");
      } else {
        setError("Failed to fetch price data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ crop: "", city: "" });
    setPriceData(null);
    setError(null);
  };

  return (
    <section className="bg-green-50 min-h-screen py-16 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-800 mb-3">
        🌾 Live Market Prices
      </h1>

      <p className="text-gray-600 text-lg mb-10 max-w-2xl text-center">
        Get real-time mandi updates powered by KrishiSakhi's AI market intelligence.
      </p>

      {/* Input Form */}
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          📊 Get Your Crop Price
        </h3>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            ℹ️ <strong>Note:</strong> This feature uses your profile data (location and main crop) to fetch real-time mandi prices using AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Submit Button */}
          <div className="flex gap-4 justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-semibold transition ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md'
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching Price...
                </span>
              ) : (
                '🤖 Get AI Price for My Crop'
              )}
            </button>

            {priceData && (
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-700 font-medium">❌ {error}</p>
          </div>
        )}
      </div>

      {/* Result Display */}
      {priceData && (
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-semibold text-gray-800 mb-1">
              📈 Market Price Information
            </h3>
            <p className="text-sm text-gray-500">
              Live data from national mandis
            </p>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Crop</p>
                <p className="text-xl font-bold text-green-800">{priceData.crop}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p className="text-xl font-bold text-green-800">{priceData.city}</p>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-5 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                💰 Price Details
              </h4>
              <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {priceData.priceInfo}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-green-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-green-200 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-green-200 rounded w-2/3 mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">🔍 Analyzing market data...</p>
        </div>
      )}
    </section>
  );
}
