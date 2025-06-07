import React, { useState } from 'react';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(50);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleNotifications = () => setNotifications(!notifications);

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-gray-900 to-black text-white' : 'bg-gradient-to-br from-white to-gray-100 text-gray-900'} min-h-screen transition-colors duration-500 p-8`}>
      <div className="max-w-xl mx-auto space-y-8 bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold text-center">🎛️ Settings</h1>
        <div className="flex justify-between items-center">
          <label htmlFor="dark-mode" className="text-lg font-medium">🌗 Dark Mode</label>
          <input
            type="checkbox"
            id="dark-mode"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="toggle-checkbox w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="volume" className="text-lg font-medium block mb-2">🔊 Volume</label>
          <input
            type="range"
            id="volume"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            min="0"
            max="100"
            className="w-full accent-orange-500"
          />
          <p className="text-sm mt-1 text-gray-400">{volume}%</p>
        </div>
        <div className="flex justify-between items-center">
          <label htmlFor="notifications" className="text-lg font-medium">🔔 Notifications</label>
          <input
            type="checkbox"
            id="notifications"
            checked={notifications}
            onChange={toggleNotifications}
            className="toggle-checkbox w-10 h-5 rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
          />
        </div>
        <button
          onClick={() => alert('Settings saved!')}
          className="w-full bg-orange-500 hover:bg-orange-600 transition-all text-white p-3 rounded-xl text-lg font-semibold shadow-md"
        >
          💾 Save Settings
        </button>
      </div>
    </div>
  );
}
