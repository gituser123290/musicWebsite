import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import api from "../../services/api";
import Loading from "../../layouts/Loading";

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
  const [song, setSong] = useState([])
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch artists and song details on component mount
  useEffect(() => {
    const fetchArtists = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) {
        Navigate('/login')
        return;
      }
      try {
        const response = await api.get("/artists/", {
          headers: { Authorization: `Token ${token}` },
        });
        setArtists(response.data);
      } catch (error) {
        setError("Failed to load artists");
      }
    };

    const fetchSongDetails = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) {
        Navigate('/login')
        return;
      }
      try {
        const response = await api.get(`/songs/${id}/`, {
          headers: { 
            Authorization: `Token ${token}` 
          },
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
      } catch (error) {
        setError("Failed to load song", error.message);
      }
    };

    fetchArtists();
    fetchSongDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        [name]: files[0],
      }));
    } else {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (let key in songDetails) {
      formData.append(key, songDetails[key]);
    }
    const token = sessionStorage.getItem('token')
    if (!token) {
      Navigate('/login')
      return;
    }
    try {
      await api.put(`/songs/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${token}`,
        },
      });
      navigate(`/songs/${id}`);
    } catch (error) {
      setError(error.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  };

  const deleteSong = async () => {
    const token = sessionStorage.getItem('token')
    if (!token) {
      Navigate('/login')
      return;
    }
    try {
      await api.delete(`/songs/${id}/`, {
        headers: {
          Authorization: `Token ${token}`
        },
      });
      navigate(`/`);
    } catch (error) {
      setError(error.response?.data?.detail || "An error occurred");
    }
  }

  const openCommentModal = () => {
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsModalOpen(false);
  };

  const handlePlaySong = (id) => {
    navigate(`/song/${id}/play`);
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (loading) return <Loading />;


  return (
    <>
      <div className="w-1/6 items-center pl-10 p-4 m-1 bg-orange-500 rounded-md hover:bg-orange-600 shadow-xl transition-colors duration-200 cursor-pointer">
        <button onClick={() => navigate(-1)} className="text-white">
          Back to Posts
        </button>
      </div>
      <div className="flex flex-col min-h-screen bg-gray-200">
        <div className="flex items-center justify-center w-full flex-1 bg-gray-200 pt-4 pb-16">
          <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-gray-800 p-2 rounded-md shadow-lg">
            <h1 className="text-center text-cyan-600 text-2xl mb-2">
              Song Detail
            </h1>
            {song ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="mb-2">
                  <img
                    className="w-full h-auto object-cover rounded-md"
                    src={song.song_cover}
                    alt="Song cover"
                  />
                </div>
                <hr />
                <div className="p-2 columns-2 gap-20">
                  <h2 className="text-white text-2xl">{song.title}</h2>
                  <p className="text-white">Artist: {song.artist?.name}</p>
                  <p className="text-white">Length: {song.duration}</p>
                  <p className="text-white">Genre: {song.genre}</p>
                  <div className="flex justify-center space-x-10">
                    <button
                      onClick={openCommentModal}
                      className="mt-2 text-xl text-white py-2 rounded-md hover:text-sky-400"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={deleteSong}
                      className="mt-2 text-xl text-white py-2 rounded-md hover:text-red-600"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handlePlaySong(song.id)}
                      className="mt-2 text-xl text-white py-2 rounded-md hover:text-orange-400"
                    >
                      <FaPlay />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p>No song found!</p>
            )}
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg w-1/3 columns-2">
              <h2 className="text-xl mb-4">Update Song</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block text-gray-700">Song Name</label>
                  <input
                    type="text"
                    name="title"
                    value={songDetails.title}
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
                  {songDetails.song_cover && !songDetails.song_cover.name && (
                    <p className="text-gray-600 mt-2">
                      {song.song_cover.split("/").pop()}
                    </p>
                  )}
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Artist</label>
                  <select
                    name="artist_id"
                    value={songDetails.artist}
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
                  />
                  {songDetails.audio && !songDetails.audio && (
                    <p className="text-gray-600 mt-2">
                      {song.audio.split("/").pop()}{" "}
                    </p>
                  )}
                </div>

                <div className="mb-2">
                  <label className="block text-gray-700">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={songDetails.duration}
                    onChange={handleInputChange}
                    className="w-full p-1 border rounded-md"
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-gray-700">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={songDetails.genre}
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
              <button
                onClick={closeCommentModal}
                className="absolute top-4 right-4 text-white text-2xl"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
