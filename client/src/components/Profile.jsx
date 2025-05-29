import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../services/api';
import Loading from '../layouts/Loading';
import moment from 'moment';
import { FaTwitter, FaGithub, FaLinkedin, FaEnvelope, FaPenSquare, FaSpotify } from 'react-icons/fa';
import { PiPlaylistFill } from "react-icons/pi";
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get(apiUrl + '/account/user/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUser(response.data);
        setEditData({
          first_name: response.data.first_name || '',
          last_name: response.data.last_name || '',
          bio: response.data.bio || '',
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const browseSongs = (e) => {
    e.preventDefault();
    navigate("/allsongs");
  };

  const browsePlaylist = (e) => {
    e.preventDefault();
    navigate("/playlists");
  };

  // Modal controls
  const openModal = () => setIsEditModalOpen(true);
  const closeModal = () => setIsEditModalOpen(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      await axios.put(
        apiUrl + "/account/user/update/",
        editData,
        { headers: { Authorization: `Token ${token}` } }
      );
      setUser((prev) => ({ ...prev, ...editData }));
      closeModal();
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!user) return null;

  return (
    <>

      <div className="max-w-sm mx-auto w-full h-auto bg-gray-900 rounded-xl mt-10 shadow-lg overflow-hidden md:max-w-3xl hover:scale-[0.98] transition-transform duration-300">
        <div className="md:flex m-10 text-white">
          <div className="md:flex-shrink-0 flex justify-center md:justify-start">
            <motion.img
              className="w-28 h-28 rounded-full border-4 border-indigo-600 object-cover shadow-lg cursor-pointer"
              src={user.user_picture || "https://via.placeholder.com/150"}
              alt={user.username}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(99,102,241,0.8)" }}
              onClick={() => alert("This could open profile pic preview or editor!")}
            />
          </div>

          <div className="p-6 space-y-6 flex-1">
            <h2 className="text-2xl font-semibold">{user?.username} joined {moment(user?.date_joined).fromNow()}</h2>
            <h3 className="text-xl font-semibold">
              {user?.first_name} {user?.last_name}{" "}
              <span className="text-sm text-gray-400 ml-2">last login {moment(user?.last_login).fromNow()}</span>
            </h3>
            <p className="text-gray-300">{user?.bio || "No bio available"}</p>

            <p
              className="text-sm font-semibold text-indigo-400 cursor-pointer hover:text-indigo-600 transition-colors duration-300"
              onClick={browsePlaylist}
            >
              Playlist: {user?.playlists?.[0]?.name || "No playlists"} have total {user?.playlists?.[0]?.songs?.length || 0} Songs
            </p>
            <div className="mt-4 flex flex-wrap gap-6 items-center">
              <button
                onClick={openModal}
                aria-label="Edit Profile"
                className="text-gray-400 hover:text-indigo-500 transition-colors duration-300"
                title="Edit Profile"
              >
                <FaPenSquare size={26} />
              </button>

              <a href="https://open.spotify.com/collection/tracks" target="_blank" rel="noopener noreferrer" title="Spotify">
                <FaSpotify size={26} className="text-green-600 hover:text-green-400 transition-colors duration-300" />
              </a>

              <a href="https://x.com/Naurangi23" target="_blank" rel="noopener noreferrer" title="Twitter">
                <FaTwitter size={26} className="text-blue-500 hover:text-blue-700 transition-colors duration-300" />
              </a>

              <a href="https://github.com/Naurangi123" target="_blank" rel="noopener noreferrer" title="GitHub">
                <FaGithub size={26} className="text-gray-400 hover:text-white transition-colors duration-300" />
              </a>

              <a href="https://www.linkedin.com/in/naurangi-lal-aa3175228/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <FaLinkedin size={26} className="text-blue-600 hover:text-blue-800 transition-colors duration-300" />
              </a>

              <a href={`mailto:${user?.email}`} target="_blank" rel="noopener noreferrer" title="Email">
                <FaEnvelope size={26} className="text-red-500 hover:text-red-700 transition-colors duration-300" />
              </a>

              <button
                onClick={browseSongs}
                title="Browse Songs"
                className="text-red-500 hover:text-red-700 transition-colors duration-300 cursor-pointer"
                aria-label="Browse Songs"
              >
                <PiPlaylistFill size={26} />
              </button>
            </div>

            <div className="mt-10">
              <h3 className="text-2xl font-semibold text-indigo-400 mb-4">Your Playlists</h3>
              {user.playlists?.length > 0 ? (
                <div className="flex space-x-6 overflow-x-auto scrollbar-thin">
                  {user.playlists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="min-w-32 bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-indigo-800 cursor-pointer transition-shadow duration-300"
                      onClick={() => navigate(`/playlists/${playlist.id}`)}
                    >
                      <h4 className="text-indigo-300 font-bold mb-2 truncate">{playlist.name}</h4>
                      <p className="text-gray-400 text-sm mb-3">{playlist.songs.length} Songs</p>
                      <div className="flex space-x-2 overflow-x-auto">
                        {playlist.songs.slice(0, 5).map((song) => (
                          <img
                            key={song.id}
                            src={song.song_cover_url}
                            alt={song.title}
                            title={song.title}
                            className="w-12 h-12 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">No playlists found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-96 shadow-lg max-w-full mx-4">
            <h3 className="text-white text-2xl mb-4 font-semibold">Edit Profile</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input
                type="text"
                name="first_name"
                value={editData.first_name}
                onChange={handleEditChange}
                placeholder="First Name"
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                name="last_name"
                value={editData.last_name}
                onChange={handleEditChange}
                placeholder="Last Name"
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="bio"
                value={editData.bio}
                onChange={handleEditChange}
                placeholder="Bio"
                rows="4"
                className="w-full p-2 rounded bg-gray-800 text-white outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
