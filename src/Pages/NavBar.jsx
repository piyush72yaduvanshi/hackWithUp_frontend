import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="">
      
      <div
        className="fixed top-4 left-4 text-3xl cursor-pointer z-[1000] text-gray-800 hover:text-green-600 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        &#9776;
      </div>

      <div
        className={`fixed top-0 left-0 h-screen bg-[#f8f9fa] shadow-md border-r border-[#e9ecef] transition-transform duration-300 z-[999]
        w-full sm:w-[300px] ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center border-b border-[#e9ecef] p-5 mb-5">
          <img src={logo} alt="KrishiSakhi Logo" className="w-10 h-10 ml-7 lg:ml-0" />
          <h2 className="text-[22px] font-bold text-[#2c5f2d] ml-3">Krishi Sakhi</h2>
        </div>

        <ul className="w-full">
          {[
            { to: "/home", label: "Home" },
            { to: "/profile", label: "Profile" },
            { to: "/weather", label: "Weather & Climate" },
            { to: "/advisory", label: "Crop & Advisory" },
            { to: "/landInfo", label: "Land Information" },
            { to: "/calendar", label: "Calendar" },
            { to: "/prices", label: "Price & Market Trends" },
            { to: "/chat", label: "Chat / Voice Assistant" },
            { to: "/benefits", label: "Government Benefits" },
          ].map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setIsOpen(false)}
                className="block text-left text-[16px] text-[#333] py-4 px-6 hover:bg-[#b0e293] hover:font-bold rounded-lg"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}