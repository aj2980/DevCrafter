import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-500">
            AI Website Builder
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-blue-400 transition">Home</Link>
            <Link to="/tutorial" className="hover:text-blue-400 transition">Tutorial</Link>
            <Link to="/about" className="hover:text-blue-400 transition">About</Link>
            <Link to="/faqs" className="hover:text-blue-400 transition">FAQs</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          <Link to="/" className="block py-2 hover:text-blue-400">Home</Link>
          <Link to="/tutorial" className="block py-2 hover:text-blue-400">Tutorial</Link>
          <Link to="/about" className="block py-2 hover:text-blue-400">About</Link>
          <Link to="/faqs" className="block py-2 hover:text-blue-400">FAQs</Link>
        </div>
      )}
    </nav>
  );
}
