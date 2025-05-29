import React, { useEffect, useState } from 'react';
import { VscPreview } from "react-icons/vsc";
import { FiX } from "react-icons/fi";
import { apiUrl } from '../../services/api';
import Loading from '../../layouts/Loading';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSpotify } from 'react-icons/fa';

export default function Album() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbumData = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axios.get(apiUrl + '/albums', {
          headers: {
            Authorization: `Token ${token}`,
          }
        });
        setAlbums(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchAlbumData();
  }, [navigate]);

  const handleClick = (id) => {
    navigate(`/albums/${id}/`)
  }

  const openModal = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedArtist(null);
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-600 mt-10">Error: {error.message}</p>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {albums && albums.length > 0 ? (
          albums.map((album) => {
            const artist = {
              name: album.artist.name,
              image: album.artist.image_url,
              songs: album.songs.length,
              date: album.release_date,
              social_media: album.artist.social_media.spotify,
            };

            return (
              <div
                key={album.id}
                className="relative group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleClick(album.id)}
              >
                <img
                  src={album.cover_image_url}
                  alt={album.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">{album.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">Artist: {album.artist.name}</p>
                  <p className="text-sm flex items-center text-green-600 mt-1">
                    <FaSpotify className="mr-1" /> {album.artist.social_media.spotify}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Release Date: {album.release_date}</p>
                  <p className="text-sm text-gray-400 mt-1">Songs: {album.songs.length}</p>
                </div>
                {/* Preview Button on hover */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent navigating when clicking preview
                    openModal(artist);
                  }}
                  className="absolute top-3 right-3 bg-white bg-opacity-90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-indigo-600 hover:text-white"
                  aria-label="Preview Artist"
                >
                  <VscPreview size={20} />
                </button>
              </div>
            );
          })
        ) : (
          <p className='text-center text-red-600 text-xl col-span-full'>No albums found.</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} artist={selectedArtist} />
    </div>
  );
}

const Modal = ({ isOpen, onClose, artist }) => {
  if (!isOpen || !artist) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal close on click inside
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 transition"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>
        <div className="p-6 text-center">
          <img
            src={artist.image}
            alt={artist.name}
            className="mx-auto mb-4 w-40 h-40 rounded-full object-cover shadow-lg"
          />
          <h2 className="text-3xl font-bold mb-2">{artist.name}</h2>
          <p className="text-gray-600 mb-1"><strong>Total Songs:</strong> {artist.songs}</p>
          <p className="text-gray-600 mb-1">
            <strong>Spotify:</strong>{' '}
            <a
              href={artist.social_media}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              Listen on Spotify
            </a>
          </p>
          <p className="text-gray-600"><strong>Release Date:</strong> {artist.date}</p>
        </div>
      </div>
    </div>
  );
};
