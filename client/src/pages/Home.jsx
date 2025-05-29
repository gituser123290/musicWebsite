import React from 'react';
import { useNavigate,Link } from 'react-router-dom';
import heroVideo from '../assets/images/video2.mp4'; // Use a relevant music-themed video or image
import grass from '../assets/images/img.jpg';
import pic from '../assets/images/img.jpg';
import img from '../assets/images/img.jpg';
import { FaMusic, FaList, FaHeadphones, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-900">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={heroVideo}
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Stream Music That Moves You</h1>
          <p className="text-lg lg:text-xl mb-8 max-w-2xl">
            Explore, create, and vibe with millions of songs and playlists. No limits, just music.
          </p>
          <button
            onClick={() => navigate('/songs')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition"
          >
            Get Started
          </button>
        </div>
      </section>

      <section className="py-20 bg-gray-900" id="features">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-12">Featured Tracks & Albums</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[{ img: grass, title: 'Echo Vibes' }, { img: pic, title: 'Rhythm Nation' }, { img: img, title: 'Chillscape' }].map((track, index) => (
              <div
                key={index}
                className="bg-green-900 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden transform hover:-translate-y-1"
              >
                <img src={track.img} alt={track.title} className="w-full h-60 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{track.title}</h3>
                  <p className="text-gray-600">Artist Name</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900" id="how-it-works">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div
              onClick={() => navigate('/songs')}
              className="p-8 bg-blue-700 rounded-xl shadow-md hover:bg-blue-300 cursor-pointer transition"
            >
              <FaMusic size={32} className="text-blue-900 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900">1. Discover Music</h3>
              <p className="text-gray-800 mt-2">
                Browse millions of tracks, trending albums, and top artists tailored to your taste.
              </p>
            </div>
            <div className="p-8 bg-green-500 rounded-xl shadow-md hover:bg-green-800 transition">
              <FaList size={32} className="text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-green-900">2. Create Playlists</h3>
              <p className="text-gray-700 mt-2">
                Build your vibe. <a className="text-orange-900 hover:underline" href="/playlists">View</a> or{' '}
                <a className="text-orange-600 hover:underline" href="/createplaylist">Create</a> a playlist in seconds.
              </p>
            </div>
            <div
              onClick={() => navigate('/allsongs')}
              className="p-8 bg-yellow-50 rounded-xl shadow-md hover:bg-yellow-100 cursor-pointer transition"
            >
              <FaHeadphones size={32} className="text-yellow-900 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-900">3. Enjoy Seamless Playback</h3>
              <p className="text-gray-900 mt-2">
                Hit play and let the rhythm flow—no ads, no interruptions, just pure sound.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-4">© 2025 MusicStream. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm mb-4">
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/setting" className="hover:text-yellow-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-yellow-400">Contact</Link>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="#" aria-label="Facebook" className="text-white hover:text-blue-500"><FaFacebook size={20} /></Link>
            <Link to="#" aria-label="Twitter" className="text-white hover:text-blue-400"><FaTwitter size={20} /></Link>
            <Link to="#" aria-label="Instagram" className="text-white hover:text-pink-500"><FaInstagram size={20} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
