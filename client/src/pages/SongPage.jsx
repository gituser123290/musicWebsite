import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SongPage() {
  const [error, setError] = useState(null);

  const [songData, setSongData] = useState({
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
    genre: 'Pop',
    track_number: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongData((prevDetails) => ({
        ...prevDetails,
        song_cover: files[0],
        audio_file:files[0]
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
    const formData = new FormData();

    for (let key in songData) {
      formData.append(key, songData[key]);
    }

    try {
      const response = await api.post('/song/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSongData(response.data)
      console.log('Song submitted successfully:', response.data);
      navigate('/')
    } catch (error) {
      setError(error)
      console.error('Error submitting the song:', error);
    }
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-full flex items-center justify-center mt-4 mb-20">
      <div className="bg-cyan-800 p-6 rounded-md shadow-lg w-1/3 columns-2">
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
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Album</label>
            <input
              type="number"
              name="album"
              value={songData.album}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Artist</label>
            <input
              type="number"
              name="artist"
              value={songData.artist}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">No of Listners</label>
            <input
              type="number"
              name="no_of_listeners"
              value={songData.no_of_listeners}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Streams</label>
            <input
              type="number"
              name="streams"
              value={songData.streams}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Radio Air Play</label>
            <input
              type="number"
              name="radio_airplay"
              value={songData.radio_airplay}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Downloads</label>
            <input
              type="number"
              name="downloads"
              value={songData.downloads}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Social Media Metions</label>
            <input
              type="number"
              name="social_media_mentions"
              value={songData.social_media_mentions}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Duration</label>
            <input
              type="text"
              name="duration"
              value={songData.duration}
              onChange={handleInputChange}
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Genre</label>
            <select name="genre" value={songData.genre} onChange={handleInputChange}>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="Jazz">Jazz</option>
            <option value="Electronic">Electronic</option>
            <option value="Mixed">Mixed</option>
            <option value="Other">Other</option>
          </select>
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Track Number</label>
            <input
              type="number"
              name="track_number"
              value={songData.track_number}
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
          <div className="mb-2">
            <label className="block text-gray-700">Song Cover</label>
            <input
              type="file"
              name="song_cover"
              accept="image/*"
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
      </div>
    </div>
  );
}
