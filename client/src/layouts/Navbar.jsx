import { useState, useRef, useEffect } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import {
  User,
  Settings,
  ChevronDown,
  Bell,
  Search,
  LogOut,
} from 'lucide-react';

export default function Navbar({ isCollapsed, handleLogout, toggleSidebar }) {
  const location = useLocation();
  const pageTitle = location.pathname === '/' ? 'Home' : location.pathname.slice(1).replaceAll('-', ' ');
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate=useNavigate()

  // Handle outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const settings=()=>{
    navigate('/setting')
  }

  const profile=()=>{
    navigate('/profile')
  }


  return (
    <header
      className={`h-16 bg-gradient-to-l from-gray-200 via-fuchsia-200 to-stone-100 shadow-[4px_2px_17px_3px_rgba(72,_92,_178,_0.36)] text-white flex items-center justify-between px-6 fixed top-0 transition-all duration-300 z-30 border-b border-zinc-800 ${isCollapsed ? 'left-16' : 'left-60'
        } right-0`}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-xl text-black font-semibold capitalize">{pageTitle}</h2>
      </div>

      <div className="relative w-1/4 max-w-md hidden md:block">
        <input
          type="text"
          placeholder="Search for tracks, artists..."
          className="w-full bg-white text-black px-10 py-2 rounded-lg shadow focus:outline-none focus:ring-2 ring-zinc-600"
        />
        <Search className="absolute left-3 top-2.5 text-zinc-900" size={18} />
      </div>
      <div className="flex items-center gap-6">
        <div className="relative" ref={notifRef}>
          <div
            onClick={() => setNotificationOpen(!isNotificationOpen)}
            className="relative cursor-pointer group"
          >
            <Bell className="text-black hover:text-zinc-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping group-hover:animate-none"></span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white text-black rounded-lg shadow-lg z-50 p-4">
              <h4 className="text-lg font-semibold mb-2">Notifications</h4>
              <ul className="text-sm max-h-52 overflow-auto">
                <li className="py-2 border-b border-gray-200">🎵 New song added to your playlist</li>
                <li className="py-2 border-b border-gray-200">👤 User John followed you</li>
                <li className="py-2">🔔 System maintenance at 10 PM</li>
              </ul>
            </div>
          )}
        </div>
        <Settings onClick={()=>navigate('/settings')} className="text-black hover:text-zinc-600 cursor-pointer" />
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="User"
              className="w-8 h-8 rounded-full border border-gray-300 object-cover"
              onError={(e) => (e.target.src = 'https://placehold.co/40x40')}
            />
            <ChevronDown className="text-black" size={18} />
          </div>

          {isProfileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md py-2 z-50">
              <div onClick={()=>navigate('/profile')} className="px-4 py-2 hover:bg-zinc-100 cursor-pointer flex items-center gap-2">
                <User size={16} /> Profile
              </div>
              <div onClick={()=>navigate('/podcasts')} className="px-4 py-2 hover:bg-zinc-100 cursor-pointer flex items-center gap-2">
                <Settings size={16} /> Podcasts
              </div>
              <div onClick={()=>navigate('/services')} className="px-4 py-2 hover:bg-zinc-100 cursor-pointer flex items-center gap-2">
                <Settings size={16} /> Services
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <div
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-zinc-100 cursor-pointer flex items-center gap-2">
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
