import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import api from "../../services/api";
import Loading from "../../layouts/Loading";
import { FaArrowLeft } from "react-icons/fa";

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

  // const deleteSong = async () => {
  //   const token = sessionStorage.getItem('token')
  //   if (!token) {
  //     Navigate('/login')
  //     return;
  //   }
  //   try {
  //     await api.delete(`/songs/${id}/`, {
  //       headers: {
  //         Authorization: `Token ${token}`
  //       },
  //     });
  //     navigate(`/`);
  //   } catch (error) {
  //     setError(error.response?.data?.detail || "An error occurred");
  //   }
  // }

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
    <div className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-600 flex-col w-full">
      <div className="w-full sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-gray-800 p-6 rounded-lg shadow-xl m-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(-1)}
              className="text-white text-sm font-semibold flex items-center space-x-2 px-4 py-2 rounded-lg bg-orange-400 hover:bg-orange-500 transition duration-200"
            >
              <FaArrowLeft className="text-xl" />
              <span>Back</span>
            </button>
          </div>
        </div>
        {song ? (
          <div className="flex flex-col items-center mt-2 space-y-2">
            <div className="w-full h-auto max-w-xs">
                {song?.song_cover_url ? (
                  <img
                    className="w-full object-cover rounded-lg shadow-md"
                    src={song.song_cover_url.startsWith("http") ? song.song_cover_url : `${song.song_cover_url}`}
                    alt="Song cover"
                  />
                ) : song?.song_cover ? (
                  <img
                    className="w-full object-cover rounded-lg shadow-md"
                    src={song.song_cover.startsWith("http") ? song.song_cover : `${song.song_cover}`}
                    alt="Song cover"
                  />
                ) : null}
              </div>
            <div className="w-full text-white">
              <h2 className="text-2xl font-semibold">{song.title}</h2>
              <p className="mt-2 text-lg">Artist: {song.artist?.name}</p>
              <p className="text-lg">Genre: {song.genre}</p>
              <p className="text-lg">Duration: {song.duration}</p>
            </div>

            <div className="flex justify-center items-center space-x-6 mt-4">
              <button
                onClick={openCommentModal}
                className="text-white text-xl py-2 px-4 rounded-lg hover:bg-sky-500 transition duration-200"
                aria-label="Edit Comments"
              >
                <FaRegEdit />
              </button>

              <button
                // onClick={deleteSong}
                className="text-white text-xl py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
                aria-label="Delete Song"
              >
                <FaTrash />
              </button>

              <button
                onClick={() => handlePlaySong(song.id)}
                className="text-white text-xl py-2 px-4 rounded-lg hover:bg-orange-400 transition duration-200"
                aria-label="Play Song"
              >
                <FaPlay />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-white text-xl">No song found!</div>
        )}
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
      )
      }
    </div>
  );
};
