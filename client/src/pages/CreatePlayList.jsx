import React, { useState } from "react";
import { apiUrl } from "../services/api";
import Loading from "../layouts/Loading";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreatePlayList() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createPlaylist = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      alert("You need to login first");
      setLoading(false);
      return;
    }
    try {
      await axios.post(
        apiUrl + "/playlist/create/",
        { name, is_public: isPublic },
        { headers: { Authorization: `Token ${token}` } }
      );
      alert("Playlist created successfully!");
      navigate("/playlists");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
    setLoading(false);
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500 text-center mt-6">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 flex items-center justify-center px-4">
      <form
        onSubmit={createPlaylist}
        className="bg-gray-900 bg-opacity-90 backdrop-blur-sm max-w-md w-full p-8 rounded-3xl shadow-xl text-white"
      >
        <h2 className="text-4xl font-bold mb-6 text-center tracking-wide drop-shadow-lg">
          Create New Playlist
        </h2>

        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-lg font-semibold mb-2 text-indigo-300"
          >
            Playlist Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="My Awesome Playlist"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-indigo-800 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>

        <div className="mb-6 flex items-center space-x-4">
          <label
            htmlFor="isPublic"
            className="text-lg font-semibold text-indigo-300"
          >
            Public Playlist?
          </label>
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-6 h-6 rounded-md cursor-pointer accent-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold text-white shadow-lg transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-400"
        >
          Create Playlist
        </button>
      </form>
    </div>
  );
}
