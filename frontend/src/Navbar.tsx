import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            AI Website Builder
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-400 transition duration-300 ease-in-out">Home</Link>
            <Link to="/tutorial" className="hover:text-blue-400 transition duration-300 ease-in-out">Tutorial</Link>
            <Link to="/about" className="hover:text-blue-400 transition duration-300 ease-in-out">About</Link>
            <Link to="/faqs" className="hover:text-blue-400 transition duration-300 ease-in-out">FAQs</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6 text-blue-400" /> : <Menu className="w-6 h-6 text-blue-400" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-2">
          <Link to="/" className="block py-2 hover:text-blue-400 transition duration-300 ease-in-out">Home</Link>
          <Link to="/tutorial" className="block py-2 hover:text-blue-400 transition duration-300 ease-in-out">Tutorial</Link>
          <Link to="/about" className="block py-2 hover:text-blue-400 transition duration-300 ease-in-out">About</Link>
          <Link to="/faqs" className="block py-2 hover:text-blue-400 transition duration-300 ease-in-out">FAQs</Link>
        </div>
      )}
    </nav>
  );
}