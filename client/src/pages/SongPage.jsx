import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SongPage() {
  const [error, setError] = useState(null);

  const [songDetails, setSongDetails] = useState({
    title: "",
    album: "",
    song_cover: null,
    artist: "",
    audio_file: null,
    no_of_listeners: "",
    streams: "",
    radio_airplay: "",
    downloads: "",
    social_media_mentions: "",
    duration: "",
    genre: "",
    track_number: "",
    popularity: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        song_cover: files[0],
      }));
    } else {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSong = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", songDetails.title);
      formData.append("album", songDetails.album);
      formData.append("artist", songDetails.artist);
      formData.append("no_of_listeners", songDetails.no_of_listeners);
      formData.append("streams", songDetails.streams);
      formData.append("radio_airplay", songDetails.radio_airplay);
      formData.append("downloads", songDetails.downloads);
      formData.append(
        "social_media_mentions",
        songDetails.social_media_mentions
      );
      formData.append("duration", songDetails.duration);
      formData.append("genre", songDetails.genre);
      formData.append("track_number", songDetails.track_number);
      formData.append("popularity", songDetails.popularity);

      if (songDetails.song_cover) {
        formData.append("song_cover", songDetails.song_cover);
      } else {
        formData.append("song_cover", null);
      }

      if (songDetails.audio_file) {
        formData.append("audio_file", songDetails.audio_file);
      } else {
        formData.append("audio_file", null);
      }

      const response = await api.post("/song/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSongDetails(response.data);
      navigate('/')
      console.log(response.data);
    } catch (error) {
      setError(error)
      alert(error.message);
    }
  };
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full h-full flex items-center justify-center mt-4 mb-20">
      <div className="bg-cyan-800 p-6 rounded-md shadow-lg w-1/3 columns-2">
        <h2 className="text-xl mb-4">Create Song</h2>
        <form onSubmit={handleSong}>
          <div className="mb-2">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Album</label>
            <input
              type="text"
              name="album"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Song Cover</label>
            <input
              type="file"
              name="song_cover"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Artist</label>
            <input
              type="text"
              name="artist"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Audio File</label>
            <input
              type="file"
              name="audio_file"
              accept="audio/*"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">No of Listners</label>
            <input
              type="number"
              name="no_of_listeners"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Streams</label>
            <input
              type="number"
              name="streams"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Radio Air Play</label>
            <input
              type="number"
              name="radio_airplay"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Downloads</label>
            <input
              type="number"
              name="downloads"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Social Media Metions</label>
            <input
              type="number"
              name="social_media_mentions"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Duration</label>
            <input
              type="text"
              name="duration"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Track Number</label>
            <input
              type="number"
              name="track_number"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Popularity</label>
            <input
              type="number"
              name="popularity"
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </form>
        <button className="absolute top-4 right-4 text-white text-2xl">
          &times;
        </button>
      </div>
    </div>
  );
}
