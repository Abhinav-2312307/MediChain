import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar({ locoScrollRef }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleScrollTo = (target) => {
    setIsOpen(false); // Close mobile menu on click

    // If the scroll instance isn't ready yet (or the ref is null),
    // just return and do nothing. This prevents the crash.
    if (!locoScrollRef.current) {
      console.warn("Locomotive Scroll not yet initialized.");
      return;
    }

    locoScrollRef.current.scrollTo(target);
  };

  return (
    <nav
      data-scroll-sticky
      data-scroll-target="#main-scroll-container"
      className="bg-white/70 backdrop-blur-lg shadow-sm top-0 left-0 right-0 relative z-50"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-600"
          onClick={() => handleScrollTo("#")}
        >
          <ShieldCheck className="w-6 h-6" />
          <span>MediChain</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a
            onClick={() => handleScrollTo("#features")}
            className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Features
          </a>
          <a
            onClick={() => handleScrollTo("#how-it-works")}
            className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            How it Works
          </a>
          <a
            onClick={() => handleScrollTo("#security")}
            className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Security
          </a>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            SignUp
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 py-4">
          <a
            onClick={() => handleScrollTo("#features")}
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Features
          </a>
          <a
            onClick={() => handleScrollTo("#how-it-works")}
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            How it Works
          </a>
          <a
            onClick={() => handleScrollTo("#security")}
            className="block px-6 py-2 text-gray-700 hover:bg-gray-100"
          >
            Security
          </a>
          <Link
            to="/login"
            className="block w-full text-left px-6 py-3 mt-2 bg-blue-50 text-blue-600 font-semibold"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="block w-full text-left px-6 py-3 mt-2 bg-blue-50 text-blue-600 font-semibold"
          >
            SignUp
          </Link>
        </div>
      )}
    </nav>
  );
}
