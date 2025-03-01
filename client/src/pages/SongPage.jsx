import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import axios from 'axios';

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
        const response = await axios.get(apiUrl+"/artists", {
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
      await axios.post(apiUrl+"/songs/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      alert('Successfully created Song:')
      navigate("/songs");
    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="w-full flex items-center justify-center mt-4 mb-20">
      <div className="bg-cyan-800 p-6 rounded-md shadow-lg w-1/3">
        <h2 className="text-xl mb-4">Create Song</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-2">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={songData.title}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              value={songData.genre}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Artist</label>
            <select
              name="artist_id"
              value={songData.artist_id}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
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

          <div className="mb-2">
            <label className="block text-gray-700">Audio File</label>
            <input
              type="file"
              name="audio"
              accept="audio/*"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-gray-700">Song Cover URL</label>
            <input
              type="text"
              name="song_cover_url"
              value={songData.song_cover_url}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
