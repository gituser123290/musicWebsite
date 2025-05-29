import React, { useState } from 'react';
import { GiMusicSpell } from "react-icons/gi";
import { IoHomeOutline,IoPersonCircleOutline,IoSettings } from "react-icons/io5";
import { LiaBookReaderSolid } from "react-icons/lia";
import { AiOutlineLogout } from "react-icons/ai";
import { FcServices } from "react-icons/fc";

export default function Navbar({ isAuthenticated, handleLogout }){
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
      <div className="text-2xl font-semibold">
        <a href="/"><GiMusicSpell size={28}/></a>
      </div>
      <div className="flex space-x-6">
        {!isAuthenticated ? (
          <>
            <a href="/login" className="hover:text-black">Login</a>
            <a href="/register" className="hover:text-black">Register</a>
          </>
        ) : (
          <>
            <a href="/" className="hover:text-black"><IoHomeOutline size={28}/></a>
            <a href="/about" className="hover:text-black"><LiaBookReaderSolid size={28}/></a>
            <a href="/services" className="hover:text-black"><FcServices size={28}/></a>
            <div className="relative">
              <button
                className="flex items-center space-x-2 hover:text-black"
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
                <div className="absolute right-0 mt-2 w-48 bg-green-600 text-black rounded-md shadow-lg z-50">
                  <ul>
                    <li>
                      <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-800"><IoPersonCircleOutline size={28}/></a>
                    </li>
                    <li>
                      <a href="/setting" className="block px-4 py-2 text-sm hover:bg-gray-800"><IoSettings size={28}/></a>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="px-4 w-full py-2 text-sm hover:bg-gray-800"><AiOutlineLogout size={28}/></button>
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
