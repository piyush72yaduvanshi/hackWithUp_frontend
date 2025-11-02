import { useState, useEffect } from "react";
import axios from "axios";

export default function Advisory() {
  const [advisoryData, setAdvisoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdvisoryData();
  }, []);

  const fetchAdvisoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5000/auth/v1/advisoryThroughAi",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json"
          },
          timeout: 30000
        }
      );

      console.log("Advisory Response:", response.data);
      setAdvisoryData(response.data.data);
      
    } catch (err) {
      console.error("Error fetching advisory data:", err);
      
      if (err.code === 'ECONNABORTED') {
        setError("Request timeout. AI processing takes time, please try again.");
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
        setError("Failed to fetch advisory data. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-green-50 min-h-screen py-16 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-800 mb-3">
        🌾 Global Market Prices
      </h1>

      <p className="text-gray-600 text-lg mb-10 max-w-2xl text-center">
        Live mandi updates powered by KrishiSakhi's AI market intelligence.
      </p>

      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg p-8">
        <div className="mb-6 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-1">
            📈 Market Prices (per Quintal)
          </h3>
          <p className="text-sm text-gray-500">
            Updated daily with national averages.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading market prices...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-10">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-2">⚠️ Error Loading Data</p>
              <p className="text-red-500 text-sm mb-4">{error}</p>
              <button
                onClick={fetchPriceData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : marketData.length === 0 ? (
          // Empty State
          <div className="text-center py-10">
            <p className="text-gray-500">No market data available at the moment.</p>
            <button
              onClick={fetchPriceData}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Refresh
            </button>
          </div>
        ) : (
          // Data Table
          <>
            <div className="mb-4 text-right">
              <button
                onClick={fetchPriceData}
                className="text-green-700 hover:text-green-900 text-sm font-semibold flex items-center ml-auto"
              >
                🔄 Refresh Data
              </button>
            </div>
            
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-green-700 text-white rounded-lg">
                  <th className="py-3 px-2">Crop</th>
                  <th className="py-3 px-2">Market</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Change</th>
                </tr>
              </thead>
              <tbody>
                {marketData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-green-100 transition"
                  >
                    <td className="py-3">{item.crop}</td>
                    <td className="py-3">{item.market}</td>
                    <td className="py-3 font-semibold">{item.price}</td>
                    <td
                      className={`py-3 font-bold ${
                        item.change.includes("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </section>
  );
}
