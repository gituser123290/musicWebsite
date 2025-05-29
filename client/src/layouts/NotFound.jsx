import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-6">
        <div className="text-7xl animate-pulse text-red-500">🚫</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          404 - Page Not Found
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved. Let’s get you back on track.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
        >
          🔙 Back to Home
        </Link>
      </div>
    </div>
  );
}
