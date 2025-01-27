import React, { useState } from 'react';
import { GiMusicSpell } from "react-icons/gi";
import { IoHomeOutline,IoPersonCircleOutline,IoSettings } from "react-icons/io5";
import { LiaBookReaderSolid } from "react-icons/lia";
import { AiOutlineLogout } from "react-icons/ai";
import { FcServices } from "react-icons/fc";

const Navbar = ({ isAuthenticated, handleLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
      {/* Logo on the left */}
      <div className="text-2xl font-semibold">
        <a href="/"><GiMusicSpell size={28}/></a>
      </div>

      {/* Conditionally render based on authentication */}
      <div className="flex space-x-6">
        {!isAuthenticated ? (
          <>
            {/* Links for login/register if not authenticated */}
            <a href="/" className="hover:text-gray-400">Login</a>
            <a href="/" className="hover:text-gray-400">Register</a>
          </>
        ) : (
          <>
            {/* Links for authenticated users */}
            <a href="/" className="hover:text-gray-400"><IoHomeOutline size={28}/></a>
            <a href="/about" className="hover:text-gray-400"><LiaBookReaderSolid size={28}/></a>
            <a href="/services" className="hover:text-gray-400"><FcServices size={28}/></a>

            {/* User profile dropdown */}
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:text-gray-400"
                onClick={toggleDropdown}
              >
                <span><IoPersonCircleOutline size={28}/></span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transform transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg">
                  <ul>
                    <li>
                      <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-200"><IoPersonCircleOutline size={28}/></a>
                    </li>
                    <li>
                      <a href="/setting" className="block px-4 py-2 text-sm hover:bg-gray-200"><IoSettings size={28}/></a>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="px-4 py-2 text-sm hover:bg-gray-200"><AiOutlineLogout size={28}/></button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
