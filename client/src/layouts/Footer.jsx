import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center px-6">
          <p className="text-lg mb-4">© 2025 MusicStream. All rights reserved.</p>
          <div className="flex justify-center space-x-8">
            <a href="/" className="hover:text-yellow-500">About</a>
            <a href="/" className="hover:text-yellow-500">Privacy Policy</a>
            <a href="/" className="hover:text-yellow-500">Contact</a>
          </div>
        </div>
      </footer>
  );
}
