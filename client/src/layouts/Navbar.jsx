/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Navbar({ isCollapsed, toggleSidebar }) {
  const location = useLocation();
  const isSearchPage = location.pathname === '/search';

  const pageTitle = location.pathname === '/' ? 'Home' : location.pathname.slice(1).replaceAll('-', ' ');

  return (
    <header
      className={`h-16 w-full bg-zinc-950 text-white flex items-center justify-between px-6 fixed top-0 transition-all duration-300 z-30 border-b border-zinc-800 ${
        isCollapsed ? 'left-20' : 'left-64'
      } right-0`}
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-zinc-800">
          {isCollapsed ? '' : ''}
        </button>
        <h2 className="text-xl font-semibold capitalize">{pageTitle}</h2>
      </div>

      {isSearchPage && (
        <input
          type="text"
          placeholder="Search for tracks, artists..."
          className="bg-zinc-800 text-white px-4 py-2 rounded-md w-1/3 focus:outline-none focus:ring-2 ring-zinc-600"
        />
      )}

      <div className="flex items-center gap-4">
        <Settings className="w-5 h-5 cursor-pointer hover:text-zinc-400" />
        <User className="w-5 h-5 cursor-pointer hover:text-zinc-400" />
      </div>
    </header>
  );
}
