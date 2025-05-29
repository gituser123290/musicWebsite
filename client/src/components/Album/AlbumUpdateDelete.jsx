import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { apiUrl } from '../../services/api';
import Loading from '../../layouts/Loading';
import axios from 'axios';

export default function AlbumUpdateDelete() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // for animation
  const [buttonClicked, setButtonClicked] = useState(false); // for button press effect

  const navigate = useNavigate();

  const [songDetails, setSongDetails] = useState({
    name: '',
    artist_id: '',
    cover_image: null,
    release_date: '',
  });

  useEffect(() => {
    const fetchAlbumDetail = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        if (!id) {
          setError('Album ID is missing!');
          setLoading(false);
          return;
        }

        const artistsResponse = await axios.get(apiUrl + '/artists/', {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setArtists(artistsResponse.data);

        const response = await axios.get(`${apiUrl}/albums/${id}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (response.data) {
          setAlbum(response.data);
          setSongDetails({
            name: response.data.name || '',
            artist_id: response.data.artist ? response.data.artist.id : '',
            release_date: response.data.release_date || '',
            cover_image: null,
          });
          setLoading(false);
        } else {
          setError('Album data not found!');
          setLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        cover_image: files[0],
      }));
    } else {
      setSongDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
  };

  const handleUpdateSong = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', songDetails.name);
    formData.append('artist_id', songDetails.artist_id);
    formData.append('release_date', songDetails.release_date);
    if (songDetails.cover_image) {
      formData.append('cover_image', songDetails.cover_image);
    }

    try {
      const response = await axios.put(`${apiUrl}/albums/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`,
        },
      });
      setAlbum(response.data);
      closeCommentModal();
    } catch (error) {
      alert(`Failed to update album: ${error.message}`);
    }
  };

  const deleteSong = async () => {
    if (!window.confirm("Are you sure you want to delete this album?")) return;

    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.delete(`${apiUrl}/albums/delete/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      navigate('/albums');
    } catch (error) {
      alert(`Unauthorized or error occurred: ${error.message}`);
      navigate(`/albums/${id}/`);
    }
  };

  // Open modal and trigger animation
  const openCommentModal = () => {
    setIsModalOpen(true);
    setTimeout(() => setModalVisible(true), 10); // small delay to trigger CSS transition
  };

  // Close modal with animation
  const closeCommentModal = () => {
    setModalVisible(false);
    setTimeout(() => setIsModalOpen(false), 300); // match transition duration
  };

  // Button click animation helper
  const handleButtonClick = (callback) => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      callback();
    }, 150); // duration of press effect
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <>
      <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10 px-4">
        <button
          onClick={() => navigate(-1)}
          className={`self-start mb-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-5 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-orange-400 transition transform ${
            buttonClicked ? 'scale-95' : 'scale-100'
          }`}
          aria-label="Go back"
          onMouseDown={() => setButtonClicked(true)}
          onMouseUp={() => setButtonClicked(false)}
          onMouseLeave={() => setButtonClicked(false)}
        >
          Back to Albums
        </button>

        <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-xl p-6">
          <h1 className="text-center text-cyan-400 text-3xl font-bold mb-6">Album Details</h1>
          {album ? (
            <div className="flex flex-col items-center space-y-6">
              <img
                className="w-56 h-56 rounded-lg object-cover shadow-lg"
                src={album.cover_image_url}
                alt={`${album.name} cover`}
              />
              <div className="w-full space-y-2 text-gray-100">
                <h2 className="text-2xl font-semibold truncate">{album.name}</h2>
                <p><span className="font-semibold">Artist:</span> {album.artist?.name}</p>
                <p><span className="font-semibold">Total Songs:</span> {album.songs.length}</p>
                <p><span className="font-semibold">Release Date:</span> {album.release_date}</p>
              </div>
              <div className="flex space-x-6">
                <button
                  onClick={() => handleButtonClick(openCommentModal)}
                  aria-label="Edit Album"
                  className={`text-cyan-400 hover:text-cyan-600 text-3xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition transform ${
                    buttonClicked ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <FaRegEdit />
                </button>
                <button
                  onClick={() => handleButtonClick(deleteSong)}
                  aria-label="Delete Album"
                  className={`text-red-600 hover:text-red-800 text-3xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600 transition transform ${
                    buttonClicked ? 'scale-90' : 'scale-100'
                  }`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-red-400">No Album found!</p>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Modal
            visible={modalVisible}
            songDetails={songDetails}
            handleInputChange={handleInputChange}
            handleUpdateSong={handleUpdateSong}
            artists={artists}
            onClose={closeCommentModal}
          />
        )}
      </div>
    </>
  );
}

function Modal({ visible, songDetails, handleInputChange, handleUpdateSong, artists, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-6 relative transform transition-all duration-300 ease-in-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close update form"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-3xl focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
        >
          &times;
        </button>
        <h2
          id="modal-title"
          className="text-2xl font-bold mb-6 text-cyan-400 text-center"
        >
          Update Album
        </h2>
        <form onSubmit={handleUpdateSong} className="space-y-4 text-gray-300">
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={songDetails.name}
              onChange={handleInputChange}
              className="w-full rounded-md bg-gray-800 p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <div>
            <label htmlFor="artist_id" className="block mb-1 font-semibold">
              Artist
            </label>
            <select
              id="artist_id"
              name="artist_id"
              value={songDetails.artist_id}
              onChange={handleInputChange}
              className="w-full rounded-md bg-gray-800 p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
            <label htmlFor="cover_image" className="block mb-1 font-semibold">
              Cover Image
            </label>
            <input
              id="cover_image"
              name="cover_image"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full rounded-md bg-gray-800 p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <div>
            <label htmlFor="release_date" className="block mb-1 font-semibold">
              Release Date
            </label>
            <input
              id="release_date"
              name="release_date"
              type="date"
              value={songDetails.release_date}
              onChange={handleInputChange}
              className="w-full rounded-md bg-gray-800 p-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 transition transform active:scale-95"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
