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
    { label: "Home", icon: <Home size={25} />, path: "/" },
    { label: "Browse", icon: <Search size={25} />, path: "/search" },
    { label: "Playlists", icon: <Search size={25} />, path: "/playlists" },
    { label: "Library", icon: <Music size={25} />, path: "/library" },
    { label: "Profile", icon: <User size={25} />, path: "/profile" },
  ];

  return (
    <div className='flex h-screen'>
      <div className={`hidden md:flex flex-col transition-all duration-300 ${isCollapsed ? "w-16" : "w-60"} bg-gray-100 p-4`}>
        <div className='flex items-center justify-between mb-6'>
          {!isCollapsed && <h1 className='flex justify-between text-lg font-bold'><Music/> Musicify</h1>}
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
                `flex items-center gap-2 p-2 px-2 rounded w-full hover:bg-gray-200 relative group ${
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
        </nav>
        <Navbar isCollapsed={isCollapsed} handleLogout={handleLogout} toggleSidebar={() => setIsCollapsed(!isCollapsed)} />
      </div>
      
      <div className='flex-1 mt-16 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
}
