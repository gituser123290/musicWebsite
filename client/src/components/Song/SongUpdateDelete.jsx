import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaRegEdit, FaTrash, FaPlay, FaArrowLeft, FaMusic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { apiUrl } from "../../services/api";
import Loading from "../../layouts/Loading";
import axios from "axios";

export default function SongUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [songDetails, setSongDetails] = useState({
    title: "",
    song_cover: null,
    artist_id: "",
    audio: null,
    duration: "",
    genre: "Pop",
  });
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    const fetchArtists = async () => {
      try {
        const response = await axios.get(apiUrl + "/artists", {
          headers: { Authorization: `Token ${token}` },
        });
        setArtists(response.data);
      } catch {
        setError("Failed to load artists");
      }
    };

    const fetchSongDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/songs/${id}/`, {
          headers: { Authorization: `Token ${token}` },
        });
        setSong(response.data);
        setSongDetails({
          title: response.data.title,
          song_cover: response.data.song_cover,
          artist_id: response.data.artist_id,
          audio: response.data.audio,
          duration: response.data.duration,
          genre: response.data.genre,
        });
      } catch {
        setError("Failed to load song");
      }
    };

    fetchArtists();
    fetchSongDetails();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongDetails((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setSongDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    for (let key in songDetails) {
      formData.append(key, songDetails[key]);
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.put(`${apiUrl}/songs/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      navigate(`/songs/${id}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePlaySong = () => navigate(`/song/${id}/play`);

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-black to-gray-900">
        <p className="text-red-500 font-semibold text-xl">{error}</p>
      </div>
    );

  if (!song) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black p-8 flex flex-col items-center">
      <motion.button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-green-500 hover:text-green-400 transition"
        aria-label="Go Back"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaArrowLeft size={24} />
        <span className="font-semibold text-lg select-none">Back</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-8 bg-gray-900 bg-opacity-70 backdrop-blur-lg rounded-3xl shadow-lg p-8 max-w-md w-full"
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Album cover */}
          {song.song_cover_url || song.song_cover ? (
            <img
              src={
                song.song_cover_url
                  ? song.song_cover_url.startsWith("http")
                    ? song.song_cover_url
                    : `${song.song_cover_url}`
                  : song.song_cover.startsWith("http")
                  ? song.song_cover
                  : `${song.song_cover}`
              }
              alt={song.title}
              className="w-48 h-48 rounded-full object-cover shadow-2xl border-4 border-green-500 hover:scale-105 transition-transform duration-300"
              draggable={false}
            />
          ) : (
            <div className="w-48 h-48 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-6xl">
              <FaMusic />
            </div>
          )}

          {/* Song info */}
          <div className="text-center text-white space-y-1">
            <h1 className="text-3xl font-bold truncate">{song.title}</h1>
            <p className="text-green-400 text-lg truncate">
              Artist: {song.artist?.name || "Unknown"}
            </p>
            <p className="text-gray-400">Genre: {song.genre || "N/A"}</p>
            <p className="text-gray-400">Duration: {song.duration || "--:--"}</p>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-6 mt-4">
            <motion.button
              onClick={openModal}
              aria-label="Edit Song"
              className="p-3 rounded-full bg-green-600 hover:bg-green-500 shadow-lg text-white text-xl flex items-center justify-center relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaRegEdit />
              <motion.div
                className="absolute -top-1 -right-1 text-green-300"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <FaMusic />
              </motion.div>
            </motion.button>

            <motion.button
              // onClick={deleteSong} // Uncomment and implement as needed
              aria-label="Delete Song"
              className="p-3 rounded-full bg-red-600 hover:bg-red-500 shadow-lg text-white text-xl flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTrash />
            </motion.button>

            <motion.button
              onClick={handlePlaySong}
              aria-label="Play Song"
              className="p-3 rounded-full bg-orange-500 hover:bg-orange-400 shadow-lg text-white text-xl flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaPlay />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal"
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-gray-900 bg-opacity-90 rounded-2xl shadow-xl p-8 max-w-lg w-full relative"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white text-2xl font-bold mb-6 text-center">
                Update Song
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="relative">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={songDetails.title}
                    onChange={handleInputChange}
                    required
                    className="peer w-full bg-transparent border-b-2 border-green-500 focus:border-green-400 outline-none text-white py-2 placeholder-transparent"
                    placeholder="Song Title"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="title"
                    className="absolute left-0 -top-5 text-green-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-green-400 cursor-text"
                  >
                    Song Title
                  </label>
                </div>

                {/* Song Cover */}
                <div>
                  <label className="text-green-400 block mb-1">Song Cover</label>
                  <input
                    type="file"
                    name="song_cover"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="w-full text-white"
                  />
                  {songDetails.song_cover && !songDetails.song_cover.name && (
                    <p className="text-gray-400 mt-1 truncate">
                      {song.song_cover.split("/").pop()}
                    </p>
                  )}
                </div>

                {/* Artist Select */}
                <div className="relative">
                  <select
                    name="artist_id"
                    value={songDetails.artist_id || ""}
                    onChange={handleInputChange}
                    required
                    className="peer w-full bg-transparent border-b-2 border-green-500 focus:border-green-400 outline-none text-white py-2 appearance-none"
                  >
                    <option value="" disabled>
                      Select Artist
                    </option>
                    {artists.map((artist) => (
                      <option key={artist.id} value={artist.id}>
                        {artist.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Audio File */}
                <div>
                  <label className="text-green-400 block mb-1">Audio File</label>
                  <input
                    type="file"
                    name="audio"
                    accept="audio/*"
                    onChange={handleInputChange}
                    className="w-full text-white"
                  />
                  {songDetails.audio && !songDetails.audio.name && (
                    <p className="text-gray-400 mt-1 truncate">{song.audio.split("/").pop()}</p>
                  )}
                </div>

                {/* Duration */}
                <div className="relative">
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    value={songDetails.duration}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-b-2 border-green-500 focus:border-green-400 outline-none text-white py-2 placeholder-transparent"
                    placeholder="Duration"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="duration"
                    className="absolute left-0 -top-5 text-green-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-green-400 cursor-text"
                  >
                    Duration
                  </label>
                </div>

                {/* Genre */}
                <div className="relative">
                  <input
                    type="text"
                    name="genre"
                    id="genre"
                    value={songDetails.genre}
                    onChange={handleInputChange}
                    className="peer w-full bg-transparent border-b-2 border-green-500 focus:border-green-400 outline-none text-white py-2 placeholder-transparent"
                    placeholder="Genre"
                    autoComplete="off"
                  />
                  <label
                    htmlFor="genre"
                    className="absolute left-0 -top-5 text-green-400 text-sm transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:-top-5 peer-focus:text-green-400 cursor-text"
                  >
                    Genre
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold mt-6 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Song"}
                </button>
              </form>

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-green-400 hover:text-green-300 focus:outline-none"
                aria-label="Close Modal"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
