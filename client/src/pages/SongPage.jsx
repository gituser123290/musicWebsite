import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import axios from "axios";

export default function SongPage() {
  const [error, setError] = useState(null);
  const [songData, setSongData] = useState({
    title: "",
    song_cover_url: "",
    artist_id: "",
    audio: null,
    genre: "Pop",
  });
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(apiUrl + "/artists", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setArtists(response.data);
      } catch (error) {
        setError("Failed to load artists: " + error.message);
      }
    };

    fetchArtists();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongData((prevDetails) => ({
        ...prevDetails,
        [name]: files[0],
      }));
    } else {
      setSongData((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    for (let key in songData) {
      formData.append(key, songData[key]);
    }

    try {
      await axios.post(apiUrl + "/songs/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      alert("Successfully created Song:");
      navigate("/songs");
    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (error)
    return (
      <p className="text-red-500 font-semibold text-center mt-4">Error: {error}</p>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="bg-gray-950 p-8 rounded-xl shadow-2xl w-full max-w-xl">
        <h2 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
          🎵 Upload a New Song
        </h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input
              type="text"
              name="title"
              value={songData.title}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Song title"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Genre</label>
            <input
              type="text"
              name="genre"
              value={songData.genre}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Pop, Rock, Jazz"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Artist</label>
            <select
              name="artist_id"
              value={songData.artist_id}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Artist</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Audio File</label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-400">Cover Image URL</label>
            <input
              type="text"
              name="song_cover_url"
              value={songData.song_cover_url}
              onChange={handleInputChange}
              className="w-full mt-1 p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white font-bold transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Song"}
          </button>
        </form>
      </div>
    </div>
  );
}
