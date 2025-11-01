import React, { useState } from "react";
import Navbar from "../Pages/NavBar";

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const apiKey = "72c5515dfff5433e83141947251907";

  const getWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name!");
      setWeather(null);
      return;
    }

    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        setError("City not found!");
        setWeather(null);
      } else {
        setWeather(data);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Something went wrong. Please try again later.");
      setWeather(null);
    }
  };

  const forecast = [
    { day: "Tomorrow", temp: "26°C", icon: "🌧" },
    { day: "Sun", temp: "27°C", icon: "🌦" },
    { day: "Mon", temp: "28°C", icon: "☁" },
    { day: "Tue", temp: "32°C", icon: "☀" },
  ];

  return (
    <>
      <div className="flex">

        {/* LEFT NAVBAR */}
        <Navbar />

        {/* RIGHT MAIN PAGE */}
        <section className="ml-[300px] w-full min-h-screen bg-lime-50 px-6 py-10 font-sans text-center rounded-xl">

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather & Climate</h1>
          <p className="text-gray-500 mb-6">Get real-time weather details below.</p>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter city name..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md w-3/5 mr-3"
            />
            <button
              onClick={getWeather}
              className="px-4 py-2 rounded-md bg-green-600 text-white cursor-pointer"
            >
              Get Weather
            </button>
          </div>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          {weather && (
            <>
              {/* Weather Card */}
              <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
                <div className="mb-5">
                  <h3 className="font-semibold text-lg">
                    {weather.location.name}, {weather.location.country}
                  </h3>
                  <p className="text-2xl font-bold my-2 flex items-center justify-center gap-2">
                    {weather.current.temp_c}°C - {weather.current.condition.text}
                    <img src={`https:${weather.current.condition.icon}`} alt="icon" />
                  </p>
                  <p>Local time: <strong>{weather.location.localtime}</strong></p>
                  <p>Feels Like: <strong>{weather.current.feelslike_c}°C</strong></p>
                </div>

                {/* Forecast */}
                <div className="mt-4">
                  <h4 className="font-medium">Upcoming Days</h4>
                  <div className="flex gap-4 mt-3">
                    {forecast.map((f, index) => (
                      <div key={index} className="bg-gray-100 p-3 rounded-lg flex-1 text-sm text-center">
                        <span>{f.day}</span><br />
                        <span>{f.icon}</span><br />
                        <span>{f.temp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Info */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-semibold text-lg">Today's Details</h3>
                <ul className="mt-3">
                  <li className="mb-2 text-gray-800">Humidity: <strong>{weather.current.humidity}%</strong></li>
                  <li className="mb-2 text-gray-800">Wind Speed: <strong>{weather.current.wind_kph} km/h</strong></li>
                  <li className="mb-2 text-gray-800">Wind Direction: <strong>{weather.current.wind_dir}</strong></li>
                  <li className="mb-2 text-gray-800">Precipitation: <strong>{weather.current.precip_mm} mm</strong></li>
                  <li className="mb-2 text-gray-800">Pressure: <strong>{weather.current.pressure_mb} mb</strong></li>
                  <li className="mb-2 text-gray-800">UV Index: <strong>{weather.current.uv}</strong></li>
                  <li className="mb-2 text-gray-800">Latitude: <strong>{weather.location.lat}</strong> | Longitude: <strong>{weather.location.lon}</strong></li>
                  <li className="mb-2 text-gray-800">Timezone: <strong>{weather.location.tz_id}</strong></li>
                </ul>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
