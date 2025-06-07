import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaMusic, FaList, FaHeadphones, FaArrowUp, FaSun, FaMoon, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import heroVideo from '../assets/images/video2.mp4';

export default function HomePage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef();

  const recentlyPlayed = [
    { title: "Dawn", artist: "Sunthware", image: "/assets/dawn.jpg" },
    { title: "Lost in the", artist: "Echoes", image: "/assets/lost.jpg" },
    { title: "Rock", artist: "Nechims", image: "/assets/rock.jpg" },
    { title: "Classical", artist: "", image: "/assets/classical.jpg" },
  ];

  const featuredPlaylists = [
    { title: "Chill Vibes", image: "/assets/chill.jpg" },
    { title: "Retro Wave", image: "/assets/retro.jpg" },
    { title: "Indic Sleep", image: "/assets/indic.jpg" },
    { title: "Acoustic Moods", image: "/assets/acoustic.jpg" },
  ];

  const advancedSections = [
    {
      title: "Top Albums",
      data: [
        { title: "Echo Vibes", artist: "Nova", image: "/assets/echo.jpg" },
        { title: "Rhythm Nation", artist: "Kane", image: "/assets/rhythm.jpg" },
        { title: "Chillscape", artist: "Lofi", image: "/assets/chillscape.jpg" },
        { title: "Zen Beats", artist: "Shanti", image: "/assets/zen.jpg" },
      ],
    },
    {
      title: "Trending Now",
      data: [
        { title: "Vibe High", artist: "DJ Storm", image: "/assets/trending1.jpg" },
        { title: "Electro Pulse", artist: "Nova Beat", image: "/assets/trending2.jpg" },
        { title: "Urban Nights", artist: "Lil Synth", image: "/assets/trending3.jpg" },
        { title: "Future Bass", artist: "Skyloop", image: "/assets/trending4.jpg" },
      ],
    },
  ];

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.body.className = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black';
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  return (
    <div ref={containerRef} className="font-sans transition-all">
      <section className="relative h-screen overflow-hidden">
        <video className="absolute top-0 left-0 w-full h-full object-cover z-0" src={heroVideo} autoPlay loop muted />
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-6">
          <h1 className="text-5xl lg:text-6xl font-extrabold mb-6">Stream Music That Moves You</h1>
          <p className="text-lg lg:text-xl mb-8 max-w-2xl">Explore, create, and vibe with millions of songs and playlists. No limits, just music.</p>
          <button onClick={() => navigate('/songs')} className="bg-yellow-400 hover:bg-yellow-500 text-black py-3 px-8 rounded-full text-lg font-semibold shadow-lg transition">Get Started</button>
        </div>
      </section>
      <div className="flex justify-between items-center px-6 py-4 sticky top-0 z-50 bg-inherit backdrop-blur-lg border-b border-gray-700">
        <h2 className="text-xl font-bold">Welcome Back</h2>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} className="px-3 py-1 rounded bg-gray-700 text-white placeholder-gray-300" />
          <button onClick={toggleTheme}>{theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-700" />}</button>
        </div>
      </div>

      <section className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Recently Played</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {recentlyPlayed
            .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
            .map((item, idx) => (
              <motion.div key={idx} className="bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700 transition" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <img src={item.image} alt={item.title} className="rounded mb-3 object-cover w-full h-32" />
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-400">{item.artist}</p>
              </motion.div>
            ))}
        </div>
      </section>
      <section className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Featured Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredPlaylists
            .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
            .map((item, idx) => (
              <motion.div key={idx} className="bg-zinc-800 p-3 rounded-lg hover:bg-zinc-700 transition" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
                <img src={item.image} alt={item.title} className="rounded mb-3 object-cover w-full h-32" />
                <p className="font-medium">{item.title}</p>
              </motion.div>
            ))}
        </div>
      </section>
      {advancedSections.map((section, i) => (
        <section className="p-6" key={i}>
          <h3 className="text-2xl font-semibold mb-4">{section.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {section.data
              .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
              .map((item, idx) => (
                <motion.div key={idx} className="bg-zinc-800 p-4 rounded-lg hover:bg-zinc-700 transition" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}>
                  <img src={item.image} alt={item.title} className="rounded mb-3 object-cover w-full h-32" />
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-400">{item.artist}</p>
                </motion.div>
              ))}
          </div>
        </section>
      ))}
      <section className="py-20 bg-gray-900" id="how-it-works">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div onClick={() => navigate('/songs')} className="p-8 bg-blue-700 rounded-xl hover:bg-blue-300 cursor-pointer transition">
              <FaMusic size={32} className="text-blue-900 mb-4" />
              <h3 className="text-xl font-semibold text-blue-900">1. Discover Music</h3>
              <p className="text-gray-800 mt-2">Browse millions of tracks, trending albums, and top artists tailored to your taste.</p>
            </div>
            <div className="p-8 bg-green-500 rounded-xl hover:bg-green-800 transition">
              <FaList size={32} className="text-green-500 mb-4" />
              <h3 className="text-xl font-semibold text-green-900">2. Create Playlists</h3>
              <p className="text-gray-700 mt-2">Build your vibe. <a className="text-orange-900 hover:underline" href="/playlists">View</a> or <a className="text-orange-600 hover:underline" href="/createplaylist">Create</a> a playlist in seconds.</p>
            </div>
            <div onClick={() => navigate('/allsongs')} className="p-8 bg-yellow-50 rounded-xl hover:bg-yellow-100 cursor-pointer transition">
              <FaHeadphones size={32} className="text-yellow-900 mb-4" />
              <h3 className="text-xl font-semibold text-yellow-900">3. Enjoy Seamless Playback</h3>
              <p className="text-gray-900 mt-2">Hit play and let the rhythm flow—no ads, no interruptions, just pure sound.</p>
            </div>
          </div>
        </div>
      </section>

      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 rounded-full bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 transition">
          <FaArrowUp />
        </button>
      )}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-lg mb-4">© 2025 MusicStream. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm mb-4">
            <Link to="/about" className="hover:text-yellow-400">About</Link>
            <Link to="/setting" className="hover:text-yellow-400">Privacy Policy</Link>
            <Link to="/about" className="hover:text-yellow-400">Contact</Link>
          </div>
          <div className="flex justify-center space-x-4">
            <Link to="#"><FaFacebook /></Link>
            <Link to="#"><FaTwitter /></Link>
            <Link to="#"><FaInstagram /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
