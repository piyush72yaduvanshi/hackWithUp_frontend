import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./Pages/Home";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Profile from "./Pages/Profile";
import Weather from "./Pages/Weather";
import Navbar from "./Pages/NavBar";
import Advisory from "./Pages/Advisory";
import Benefits from "./Pages/Benefits";
import Prices from "./Pages/Prices";
import Chat from "./Pages/Chat";
import Voice from "./Pages/Voice";

function App() {
  return (
    <BrowserRouter>
      {/* keep content below navbar */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/advisory" element={<Advisory />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/prices" element={<Prices />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/voice" element={<Voice />} />


        {/* more routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
