/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  Home, Search, Music, User, ChevronLeft, ChevronRight,
} from "lucide-react";
import Navbar from "./Navbar";

export default function Sidebar({ handleLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { label: "Home", icon: <Home size={20} />, path: "/" },
    { label: "Browse", icon: <Search size={20} />, path: "/search" },
    { label: "Playlists", icon: <Search size={20} />, path: "/playlists" },
    { label: "Library", icon: <Music size={20} />, path: "/library" },
    { label: "Profile", icon: <User size={20} />, path: "/profile" },
  ];

  return (
    <div className='flex h-screen'>
      <div className={`hidden md:flex flex-col transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"} bg-gray-100 p-4`}>
        <div className='flex items-center justify-between mb-6'>
          {!isCollapsed && <h1 className='text-lg font-bold'>🎵 Musicify</h1>}
          <button onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <nav className='space-y-2'>
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded w-full hover:bg-gray-200 relative group ${
                  isActive ? "bg-gray-300 font-semibold" : ""
                }`
              }
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
              {isCollapsed && (
                <span className="absolute left-full ml-2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className='text-red-500 mt-6 hover:underline'
            >
              Logout
            </button>
          )}
        </nav>
        <Navbar isCollapsed={isCollapsed} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      </div>
      
      <div className='flex-1 mt-16 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}
