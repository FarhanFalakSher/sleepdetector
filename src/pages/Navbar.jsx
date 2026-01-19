import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full z-50 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 cursor-pointer">
              SleepDetector
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#dashboard" className="hover:text-yellow-400">Dashboard</a>
            <a href="#analytics" className="hover:text-yellow-400">Analytics</a>
            <a href="#alerts" className="hover:text-yellow-400">Alerts</a>
            <a href="#profile" className="hover:text-yellow-400">Profile</a>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <a href="#dashboard" className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">
          Dashboard
        </a>
        <a href="#analytics" className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">
          Analytics
        </a>
        <a href="#alerts" className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">
          Alerts
        </a>
        <a href="#profile" className="block px-4 py-2 hover:bg-gray-700 hover:text-yellow-400">
          Profile
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
