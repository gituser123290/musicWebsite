import React from 'react';
import { useNavigate } from 'react-router-dom';
import grass from '../assets/images/img.jpg'
import pic from '../assets/images/img.jpg'
import img from '../assets/images/img.jpg'

export default function HomePage(){

    const navigate = useNavigate();

    function songs(){
        navigate('/songs');
    }

    function playlists(){
        navigate('/playlists');
    }
    function browseSongs(){
        navigate('/allsongs');
    }
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-5xl font-extrabold mb-4">Listen to Your Favorite Music Anytime, Anywhere</h1>
          <p className="text-xl mb-6">Explore endless music, create personalized playlists, and enjoy seamless streaming.</p>
          <a
            href="/songs"
            className="inline-block bg-yellow-500 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Get Started
          </a>
        </div>
      </section>
      <section className="py-16 bg-gray-100" id="features">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-12">Featured Tracks & Playlists</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={grass}
                alt="Track 1"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">Track Title 1</h3>
              <p className="text-gray-600">Artist Name</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={pic}
                alt="Track 2"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">Track Title 2</h3>
              <p className="text-gray-600">Artist Name</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <img
                src={img}
                alt="Track 3"
                className="w-full h-56 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-800">Track Title 3</h3>
              <p className="text-gray-600">Artist Name</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white" id="how-it-works">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div onClick={songs} className="p-6 bg-blue-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Discover Music</h3>
              <p className="text-gray-600 mt-2">
                Browse through our extensive library of songs, albums, and playlists.
              </p>
            </div>
            <div onClick={playlists} className="p-6 bg-green-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Create Playlists</h3>
              <p className="text-gray-600 mt-2">
                Curate your own playlists and share them with your friends.
              </p>
            </div>
            <div onClick={browseSongs} className="p-6 bg-yellow-100 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">Enjoy Seamless Playback</h3>
              <p className="text-gray-600 mt-2">
                Listen to your music anytime, anywhere, with no interruptions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-white py-2">
        <div className="container mx-auto text-center px-6">
          <p className="text-lg mb-4">© 2025 MusicStream. All rights reserved.</p>
          <div className="flex justify-center space-x-8">
            <a href="/about" className="hover:text-yellow-500">About</a>
            <a href="/setting" className="hover:text-yellow-500">Privacy Policy</a>
            <a href="/about" className="hover:text-yellow-500">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

