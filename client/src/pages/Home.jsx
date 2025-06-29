/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AutoColorCycle from '../components/ColorCycle';
import Artists from '../components/Artist/Artists'
import {
  FaMusic, FaList, FaHeadphones,
  FaArrowUp, FaSun, FaMoon,
  FaFacebook, FaTwitter, FaInstagram
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { recentPlayed, featuredPlaylist, getTopAlbum } from '../services/apiServices';

export default function HomePage() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState('dark');
  const [search, setSearch] = useState('');
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [topAlbum, setTopAlbum] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef();

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const handleScroll = () => setShowScrollTop(window.scrollY > 300);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const didFetch = useRef(false);


  const fetchRecent = useCallback(async () => {
    try {
      const data = await recentPlayed();
      setRecentlyPlayed(data);
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  const fetchFeaturedPlaylist = useCallback(async () => {
    try {
      const data = await featuredPlaylist();
      setFeaturedPlaylists(data);
    } catch (error) {
      console.log("Error", error);
    }
  }, []);

  const fetchTopAlbum = useCallback(async () => {
    try {
      const data = await getTopAlbum();
      setTopAlbum(data);
    } catch (error) {
      console.log("Error", error);
    }
  }, []);



  useEffect(() => {
    if (didFetch.current) return; // skip if already fetched
    didFetch.current = true;

    fetchTopAlbum();
    fetchFeaturedPlaylist();
    fetchRecent();
  }, [fetchFeaturedPlaylist,fetchTopAlbum,fetchRecent]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    document.body.className = theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-gray' : 'bg-gray-500 text-black';
    return () => window.removeEventListener("scroll", handleScroll);
  }, [theme]);

  const Card = ({ image, title, subtitle, gradient }) => (
    <motion.div
      className={`bg-gradient-to-br ${gradient} p-3 rounded-xl hover:shadow-xl hover:scale-105 transform transition-all duration-300`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <img src={image} alt={title} className="rounded-xl mb-3 object-cover w-full h-32 shadow" />
      <p className="font-semibold text-white truncate">{title}</p>
      {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
    </motion.div>
  );

  return (
    <div ref={containerRef} className="font-sans transition-all bg-gradient-to-r from-violet-200 to-indigo-200">
      <AutoColorCycle/>
      <section className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Recently Played</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(recentlyPlayed || [])
            .filter(item => (item?.title || "").toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <Card
                key={item.id}
                image={item.image_url}
                title={item.song_title}
                subtitle={item.artist_name}
                gradient="bg-gradient-to-br from-cyan-400 to-fuchsia-500 "
              />
            ))}
        </div>
      </section>


      <section className="p-6">
        <h3 className="text-2xl font-semibold mb-4">Featured Playlists</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(featuredPlaylists || [])
            .filter(item => (item?.title || "").toLowerCase().includes(search.toLowerCase()))
            .map((item) => (
              <Card
                key={item.id}
                image={`http://localhost:8000${item.cover_image}`}
                title={item.title}
                gradient="bg-gradient-to-br from-fuchsia-600 to-violet-900"
              />
            ))}
        </div>
      </section>
      {topAlbum.map((section) => (
        <section className="p-6" key={section.id}>
          <h3 className="text-2xl font-semibold mb-4">{section.name}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(section.songs || [])
              .filter(item => (item?.title || "").toLowerCase().includes(search.toLowerCase()))
              .map((item) => (
                <Card
                  key={item.id}
                  image={item.cover_image_url}
                  title={item.title}
                  subtitle={item.artist?.name}
                  gradient="bg-gradient-to-br from-purple-700 to-rose-600 "
                />
              ))}
          </div>
        </section>
      ))}
      <Artists />
      <div className="container mx-auto text-center p-6">
        <div className="grid md:grid-cols-3 gap-10 text-left">
          <div onClick={() => navigate('/songs')} className="p-8 bg-blue-700 rounded-xl hover:bg-blue-300 cursor-pointer transition">
            <FaMusic size={32} className="text-blue-900 mb-4" />
            <h3 className="text-xl font-semibold text-blue-900">1. Discover Music</h3>
            <p className="text-gray-800 mt-2">Browse millions of tracks, trending albums, and top artists tailored to your taste.</p>
          </div>
          <div className="p-8 bg-green-500 rounded-xl hover:bg-green-800 transition">
            <FaList size={32} className="text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-900">2. Create Playlists</h3>
            <p className="text-gray-700 mt-2">
              Build your vibe. <a className="text-orange-900 hover:underline" href="/playlists">View</a> or <a className="text-orange-600 hover:underline" href="/createplaylist">Create</a> a playlist in seconds.
            </p>
          </div>
          <div onClick={() => navigate('/allsongs')} className="p-8 bg-yellow-50 rounded-xl hover:bg-yellow-100 cursor-pointer transition">
            <FaHeadphones size={32} className="text-yellow-900 mb-4" />
            <h3 className="text-xl font-semibold text-yellow-900">3. Enjoy Seamless Playback</h3>
            <p className="text-gray-900 mt-2">Hit play and let the rhythm flow—no ads, no interruptions, just pure sound.</p>
          </div>
        </div>
      </div>
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-3 rounded-full bg-yellow-400 text-black shadow-lg hover:bg-yellow-500 transition">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}

