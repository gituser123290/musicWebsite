import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../layouts/Loading';
import { apiUrl } from '../../services/api';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BsMusicNoteBeamed } from 'react-icons/bs';

export default function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSong = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(apiUrl + '/songs', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setSongs(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchSong();
  }, [navigate]);

  const handleClick = (id) => {
    navigate(`/songs/${id}`);
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <p className="text-center text-red-500 mt-8 font-semibold">
        Error: {error.message}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {songs.map((song) => (
          <motion.div
            key={song.id}
            onClick={() => handleClick(song.id)}
            role="button"
            tabIndex={0}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer bg-gradient-to-tr from-gray-800/80 via-gray-900/80 to-black/90 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center shadow-xl transition-shadow duration-300 hover:shadow-green-500/70 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            {/* Surprise animated music note */}
            <motion.div
              className="absolute top-4 right-4 text-green-400"
              initial={{ y: 0, opacity: 0 }}
              whileHover={{ y: [-2, 2, -2], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              title="Music vibes!"
            >
              <BsMusicNoteBeamed size={24} />
            </motion.div>

            {/* Album cover */}
            <img
              src={
                song.song_cover_url.startsWith('http')
                  ? song.song_cover_url
                  : `${song.song_cover_url}`
              }
              alt={song.title}
              className="w-36 h-36 rounded-full object-cover shadow-2xl mb-4 border-4 border-green-500 transition-transform duration-300 hover:scale-110"
              draggable={false}
            />

            {/* Song details */}
            <div className="text-center">
              <h3 className="text-white text-lg font-bold truncate max-w-[144px]">
                {song.title}
              </h3>
              <p className="text-green-400 text-sm mt-1 truncate max-w-[144px]">
                {song.artist?.name || 'Unknown Artist'}
              </p>
              <p className="text-gray-400 text-xs mt-1 truncate max-w-[144px]">
                Genre: {song.genre || 'N/A'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
