/* eslint-disable no-unused-vars */
import Loading from '../../layouts/Loading';
import { apiUrl } from '../../services/api';
import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
import { FaPlay, FaPause, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

export default function Playlist() {
  const [playlists, setPlaylists] = useState(null);
  const [error, setError] = useState(null);
  const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  // Fetch playlists
  useEffect(() => {
    const getPlaylist = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(apiUrl + '/playlists', {
          headers: { Authorization: `Token ${token}` },
        });
        setPlaylists(response.data);
      } catch (error) {
        setError(error);
      }
    };
    getPlaylist();
  }, [navigate]);

  // Play/pause audio on state change
  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [currentSongIndex, isPlaying]);

  // Auto navigate to create playlist if none
  useEffect(() => {
    if (playlists && playlists.length === 0) {
      navigate('/createplaylist');
    }
  }, [playlists, navigate]);

  if (error) {
    return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;
  }
  if (!playlists) return <Loading />;

  const currentPlaylist = playlists[currentPlaylistIndex];
  if (!currentPlaylist || !currentPlaylist.songs || currentPlaylist.songs.length === 0) {
    return <div className="text-center text-gray-400 mt-20">No songs in this playlist.</div>;
  }
  const currentSong = currentPlaylist.songs[currentSongIndex];

  // Navigate to song details
  const handleClick = (songId) => {
    navigate(`/songs/${songId}/`);
  };

  // Playback controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentSongIndex((currentSongIndex + 1) % currentPlaylist.songs.length);
    setIsPlaying(true);
  };

  const handlePrevious = () => {
    setCurrentSongIndex((currentSongIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length);
    setIsPlaying(true);
  };

  // Delete song from playlist
  const deleteSongToPlaylist = async (playlistId, songId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${apiUrl}/playlists/${playlistId}/songs/${songId}`, {
        headers: { Authorization: `Token ${token}` },
      });
      alert("Song deleted from playlist");
      setPlaylists((prev) =>
        prev.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
            : playlist
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  // Delete entire playlist
  const deletePlaylist = async (playlistId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.delete(`${apiUrl}/playlist/${playlistId}/delete`, {
        headers: { Authorization: `Token ${token}` },
      });
      alert(`Playlist Deleted Successfully 👍`);
      setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
      if (currentPlaylistIndex > 0) setCurrentPlaylistIndex(currentPlaylistIndex - 1);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative flex flex-col">
      {/* Hero Banner with Blurred Background */}
      <div
        className="relative h-96 w-full overflow-hidden rounded-b-3xl shadow-2xl"
        style={{
          backgroundImage: `url(${currentPlaylist.songs[currentSongIndex]?.song_cover_url || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4)',
          // eslint-disable-next-line no-dupe-keys
          filter: 'blur(8px)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      ></div>

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-96 px-6 space-y-4">
        <img
          src={currentPlaylist.songs[currentSongIndex]?.song_cover_url || 'https://via.placeholder.com/300'}
          alt={currentSong.title}
          className="rounded-3xl shadow-2xl w-56 h-56 object-cover border-4 border-indigo-600"
        />
        <h1 className="text-4xl font-extrabold drop-shadow-lg">{currentPlaylist.name}</h1>
        <p className="text-indigo-400 text-lg tracking-wide max-w-xl text-center opacity-90">
          {currentPlaylist.description || "Your personal playlist collection, curated just for you."}
        </p>
        <button
          onClick={() => deletePlaylist(currentPlaylist.id)}
          className="absolute top-6 right-8 text-red-600 hover:text-red-800 transition-colors duration-300 text-2xl"
          title="Delete Playlist"
          aria-label="Delete Playlist"
        >
          <FaTrash />
        </button>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-8 text-gray-300 hover:text-white transition-colors duration-300 text-2xl"
          title="Go Back"
          aria-label="Go Back"
        >
          <FaArrowLeft />
        </button>
      </div>

      {/* Song list horizontal scroll */}
      <div className="mt-4 px-6 flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900 no-scrollbar">
        {currentPlaylist.songs.map((song, index) => (
          <motion.div
            key={song.id}
            className={`min-w-[180px] cursor-pointer rounded-2xl shadow-lg overflow-hidden border-2 ${
              index === currentSongIndex
                ? 'border-indigo-500 scale-105 shadow-indigo-500'
                : 'border-transparent hover:scale-105 hover:shadow-indigo-400 transition-transform duration-300'
            }`}
            onClick={() => setCurrentSongIndex(index)}
            whileHover={{ scale: 1.1 }}
            layout
            role="button"
            aria-pressed={index === currentSongIndex}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setCurrentSongIndex(index)}
          >
            <img
              src={song.song_cover_url.startsWith('http') ? song.song_cover_url : song.song_cover_url}
              alt={song.title}
              className="w-full h-44 object-cover"
            />
            <div className="p-3 bg-gray-900">
              <h3 className="font-semibold text-lg truncate">{song.title}</h3>
              <p className="text-indigo-400 text-sm truncate">{song.artist?.name}</p>
              <div
                className="text-red-500 hover:text-red-700 cursor-pointer mt-1"
                title="Delete Song from Playlist"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSongToPlaylist(currentPlaylist.id, song.id);
                }}
              >
                <FaTrash size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Audio Player Controls - floating glassmorphic */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl bg-black bg-opacity-50 backdrop-blur-md rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-indigo-700/50"
        role="region"
        aria-label="Audio Player Controls"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevious}
            className="text-indigo-400 hover:text-indigo-600 transition-colors"
            aria-label="Previous Track"
          >
            <TbPlayerTrackPrevFilled size={34} />
          </button>
          <button
            onClick={handlePlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="text-indigo-500 hover:text-indigo-700 transition-colors"
          >
            {isPlaying ? <FaPause size={40} /> : <FaPlay size={40} />}
          </button>
          <button
            onClick={handleNext}
            className="text-indigo-400 hover:text-indigo-600 transition-colors"
            aria-label="Next Track"
          >
            <TbPlayerTrackNextFilled size={34} />
          </button>
        </div>

        <div className="flex flex-col ml-6 max-w-xs overflow-hidden">
          <h2 className="text-white font-bold truncate">{currentSong.title}</h2>
          <p className="text-indigo-300 truncate">{currentSong.artist?.name}</p>
          <audio
            ref={audioRef}
            src={`http://localhost:8000${currentSong.audio}`}
            onEnded={handleNext}
            preload="auto"
          />
        </div>
      </motion.div>
    </div>
  );
}

// Playlist.js
/* eslint-disable no-unused-vars */
// import Loading from '../../layouts/Loading';
// import { apiUrl } from '../../services/api';
// import { TbPlayerTrackPrevFilled, TbPlayerTrackNextFilled } from "react-icons/tb";
// import { FaPlay, FaPause, FaTrash, FaArrowLeft } from "react-icons/fa";
// import { useEffect, useState, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// export default function Playlist() {
//   const [playlists, setPlaylists] = useState(null);
//   const [error, setError] = useState(null);
//   const [currentPlaylistIndex, setCurrentPlaylistIndex] = useState(0);
//   const [currentSongIndex, setCurrentSongIndex] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch playlists
//   useEffect(() => {
//     const getPlaylist = async () => {
//       const token = sessionStorage.getItem('token');
//       if (!token) {
//         navigate('/login');
//         return;
//       }
//       try {
//         const response = await axios.get(apiUrl + '/playlists', {
//           headers: { Authorization: `Token ${token}` },
//         });

//         // Normalize songs to top-level playlist
//         const normalizedPlaylists = response.data.map((playlist) => {
//           const nestedSongs = playlist.owner?.playlists?.find(p => p.id === playlist.id)?.songs || [];
//           return {
//             ...playlist,
//             songs: nestedSongs
//           };
//         });

//         setPlaylists(normalizedPlaylists);
//       } catch (error) {
//         setError(error);
//       }
//     };
//     getPlaylist();
//   }, [navigate]);

//   useEffect(() => {
//     if (audioRef.current) {
//       isPlaying ? audioRef.current.play() : audioRef.current.pause();
//     }
//   }, [currentSongIndex, isPlaying]);

//   useEffect(() => {
//     if (playlists && playlists.length === 0) {
//       navigate('/createplaylist');
//     }
//   }, [playlists, navigate]);

//   if (error) {
//     return <div className="text-red-400 text-center mt-10">Error: {error.message}</div>;
//   }
//   if (!playlists) return <Loading />;

//   const currentPlaylist = playlists[currentPlaylistIndex];
//   if (!currentPlaylist || !currentPlaylist.songs || currentPlaylist.songs.length === 0) {
//     return <div className="text-center text-gray-400 mt-20">No songs in this playlist.</div>;
//   }
//   const currentSong = currentPlaylist.songs[currentSongIndex];

//   const handleClick = (songId) => {
//     navigate(`/songs/${songId}/`);
//   };

//   const handlePlayPause = () => {
//     setIsPlaying(!isPlaying);
//   };

//   const handleNext = () => {
//     setCurrentSongIndex((currentSongIndex + 1) % currentPlaylist.songs.length);
//     setIsPlaying(true);
//   };

//   const handlePrevious = () => {
//     setCurrentSongIndex((currentSongIndex - 1 + currentPlaylist.songs.length) % currentPlaylist.songs.length);
//     setIsPlaying(true);
//   };

//   const deleteSongToPlaylist = async (playlistId, songId) => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     try {
//       await axios.delete(`${apiUrl}/playlists/${playlistId}/songs/${songId}`, {
//         headers: { Authorization: `Token ${token}` },
//       });
//       alert("Song deleted from playlist");
//       setPlaylists((prev) =>
//         prev.map((playlist) =>
//           playlist.id === playlistId
//             ? { ...playlist, songs: playlist.songs.filter((song) => song.id !== songId) }
//             : playlist
//         )
//       );
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   const deletePlaylist = async (playlistId) => {
//     const token = sessionStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
//     try {
//       await axios.delete(`${apiUrl}/playlist/${playlistId}/delete`, {
//         headers: { Authorization: `Token ${token}` },
//       });
//       alert(`Playlist Deleted Successfully 👍`);
//       setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
//       if (currentPlaylistIndex > 0) setCurrentPlaylistIndex(currentPlaylistIndex - 1);
//     } catch (error) {
//       setError(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white relative flex flex-col">
//       <div
//         className="relative h-96 w-full overflow-hidden rounded-b-3xl shadow-2xl"
//         style={{
//           backgroundImage: `url(${currentPlaylist.songs[currentSongIndex]?.song_cover_url || ''})`,
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           filter: 'blur(8px)',
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           zIndex: 0,
//         }}
//       ></div>

//       <div className="relative z-10 flex flex-col items-center justify-center h-96 px-6 space-y-4">
//         <img
//           src={currentPlaylist.songs[currentSongIndex]?.song_cover_url || 'https://via.placeholder.com/300'}
//           alt={currentSong.title}
//           className="rounded-3xl shadow-2xl w-56 h-56 object-cover border-4 border-indigo-600"
//         />
//         <h1 className="text-4xl font-extrabold drop-shadow-lg">{currentPlaylist.name}</h1>
//         <p className="text-indigo-400 text-lg tracking-wide max-w-xl text-center opacity-90">
//           {currentPlaylist.description || "Your personal playlist collection, curated just for you."}
//         </p>
//         <button
//           onClick={() => deletePlaylist(currentPlaylist.id)}
//           className="absolute top-6 right-8 text-red-600 hover:text-red-800 transition-colors duration-300 text-2xl"
//           title="Delete Playlist"
//           aria-label="Delete Playlist"
//         >
//           <FaTrash />
//         </button>
//         <button
//           onClick={() => navigate(-1)}
//           className="absolute top-6 left-8 text-gray-300 hover:text-white transition-colors duration-300 text-2xl"
//           title="Go Back"
//           aria-label="Go Back"
//         >
//           <FaArrowLeft />
//         </button>
//       </div>

//       <div className="mt-4 px-6 flex overflow-x-auto space-x-6 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900 no-scrollbar">
//         {currentPlaylist.songs.map((song, index) => (
//           <motion.div
//             key={song.id}
//             className={`min-w-[180px] cursor-pointer rounded-2xl shadow-lg overflow-hidden border-2 ${
//               index === currentSongIndex
//                 ? 'border-indigo-500 scale-105 shadow-indigo-500'
//                 : 'border-transparent hover:scale-105 hover:shadow-indigo-400 transition-transform duration-300'
//             }`}
//             onClick={() => setCurrentSongIndex(index)}
//             whileHover={{ scale: 1.1 }}
//             layout
//             role="button"
//             aria-pressed={index === currentSongIndex}
//             tabIndex={0}
//             onKeyDown={(e) => e.key === 'Enter' && setCurrentSongIndex(index)}
//           >
//             <img
//               src={song.song_cover_url.startsWith('http') ? song.song_cover_url : song.song_cover_url}
//               alt={song.title}
//               className="w-full h-44 object-cover"
//             />
//             <div className="p-3 bg-gray-900">
//               <h3 className="font-semibold text-lg truncate">{song.title}</h3>
//               <p className="text-indigo-400 text-sm truncate">{song.artist?.name}</p>
//               <div
//                 className="text-red-500 hover:text-red-700 cursor-pointer mt-1"
//                 title="Delete Song from Playlist"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   deleteSongToPlaylist(currentPlaylist.id, song.id);
//                 }}
//               >
//                 <FaTrash size={16} />
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </div>

//       <motion.div
//         initial={{ y: 100, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ type: 'spring', stiffness: 100, damping: 20 }}
//         className="fixed bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] max-w-xl bg-black bg-opacity-50 backdrop-blur-md rounded-3xl p-6 flex items-center justify-between shadow-lg shadow-indigo-700/50"
//         role="region"
//         aria-label="Audio Player Controls"
//       >
//         <div className="flex items-center space-x-4">
//           <button onClick={handlePrevious} className="text-indigo-400 hover:text-indigo-600 transition-colors">
//             <TbPlayerTrackPrevFilled size={34} />
//           </button>
//           <button
//             onClick={handlePlayPause}
//             className="text-indigo-500 hover:text-indigo-700 transition-colors"
//             aria-label={isPlaying ? "Pause" : "Play"}
//           >
//             {isPlaying ? <FaPause size={40} /> : <FaPlay size={40} />}
//           </button>
//           <button onClick={handleNext} className="text-indigo-400 hover:text-indigo-600 transition-colors">
//             <TbPlayerTrackNextFilled size={34} />
//           </button>
//         </div>

//         <div className="flex flex-col ml-6 max-w-xs overflow-hidden">
//           <h2 className="text-white font-bold truncate">{currentSong.title}</h2>
//           <p className="text-indigo-300 truncate">{currentSong.artist?.name}</p>
//           <audio
//             ref={audioRef}
//             src={`http://localhost:8000${currentSong.audio}`}
//             onEnded={handleNext}
//             preload="auto"
//           />
//         </div>
//       </motion.div>
//     </div>
//   );
// }
