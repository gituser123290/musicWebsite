import React, { useState } from 'react';
export default function Settings(){
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen p-6`}>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <div className="flex items-center space-x-4">
          <label htmlFor="dark-mode" className="text-lg">Dark Mode</label>
          <input
            type="checkbox"
            id="dark-mode"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="toggle"
          />
        </div>
        <div>
          <label htmlFor="volume" className="text-lg">Volume</label>
          <input
            type="range"
            id="volume"
            min="0"
            max="100"
            className="w-full mt-2"
          />
          <p className="text-sm mt-1">Volume: %</p>
        </div>

        <div className="flex items-center space-x-4">
          <label htmlFor="notifications" className="text-lg">Notifications</label>
          <input
            type="checkbox"
            id="notifications"
            className="toggle"
          />
        </div>

        <button
          onClick={() => alert('Settings saved!')}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};


