import React, { useState, useEffect } from "react";
import Navbar from "./NavBar";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState("2025-09-09");
  const [activities, setActivities] = useState({
    "2025-09-09": [{ title: "Irrigation", details: "Start water pump for 1 hour" }],
    "2025-09-13": [{ title: "Fertilizer", details: "Apply Urea 20 kg" }],
  });
  const [newActivity, setNewActivity] = useState("");
  const [showModal, setShowModal] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // Save activity to backend
  const handleLogActivity = async () => {
    if (!newActivity.trim()) return;

    const activityData = {
      date: selectedDate,
      title: "Task",
      details: newActivity,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/activities/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });

      if (response.ok) {
        // Update local state
        setActivities((prev) => ({
          ...prev,
          [selectedDate]: [
            ...(prev[selectedDate] || []),
            { title: "Task", details: newActivity },
          ],
        }));
        setNewActivity("");
        setShowModal(false);
      }
    } catch (err) {
      console.error("Failed to log activity:", err);
    }
  };

  // Fetch activities from backend on mount
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/activities/`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          const grouped = {};
          data.forEach((act) => {
            if (!grouped[act.date]) grouped[act.date] = [];
            grouped[act.date].push(act);
          });
          setActivities(grouped);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div>
      <Navbar />
    <div className="ml-0 lg:ml-[300px] h-[100vh] min-h-screen bg-green-50 p-8">
      <div className=" gap-8 max-w-6xl mx-auto flex">
        
        {/* Calendar Section */}
        <div className="flex-1 bg-white p-6 border border-gray-200 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">🌾 Crop Calendar</h2>

          {/* Month Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button className="bg-none border-none text-xl cursor-pointer hover:text-green-600 transition">
              ◀
            </button>
            <span className="font-semibold text-lg text-gray-700">September 2025</span>
            <button className="bg-none border-none text-xl cursor-pointer hover:text-green-600 transition">
              ▶
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-2 mb-3 text-center font-semibold text-gray-600">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, idx) => (
              <span key={idx} className="py-2">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const dateKey = `2025-09-${String(day).padStart(2, "0")}`;
              const isSelected = selectedDate === dateKey;
              const hasActivity = activities[dateKey];

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(dateKey)}
                  className={`py-2 px-1 rounded-lg transition-all duration-200 cursor-pointer text-center font-medium ${
                    isSelected
                      ? "bg-green-700 text-white font-bold"
                      : hasActivity
                      ? "bg-yellow-300 text-gray-800 hover:bg-yellow-400"
                      : "bg-gray-100 text-gray-700 hover:bg-green-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activities Section */}
        <div className="flex-1 bg-white p-6 border border-gray-200 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            📋 Activities
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Log and view your daily farming tasks.
          </p>

          {/* Activity Cards */}
          <div className="space-y-3 mb-6">
            {activities[selectedDate] ? (
              activities[selectedDate].map((act, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition"
                >
                  <span className="text-2xl">💧</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{act.title}</p>
                    <p className="text-sm text-gray-600">{act.details}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">
                No activities for this day.
              </p>
            )}
          </div>

          {/* Log Activity Button */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            + Log Activity
          </button>
        </div>
      </div>

      {/* Modal for Adding Activity */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Log New Activity</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Details
              </label>
              <textarea
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Enter activity details..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogActivity}
                className="flex-1 bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive adjustment */}
      <style jsx>{`
        @media (max-width: 768px) {
          .flex {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
    </div>
  );
}
