import React, { useEffect, useState } from 'react';
import { VscPreview } from "react-icons/vsc";
import { RiCloseLargeFill } from "react-icons/ri";
import api from '../services/api';

const Modal = ({ isOpen, onClose, artist }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Artist Details</h2>
                <div className="w-full mb-6 flex justify-center">
                    <img
                    className="w-full max-w-xs h-auto object-cover rounded-lg shadow-md"
                    src={`http://localhost:8000${artist.image}`}
                    alt="Song cover"
                    />
                </div>
                <p><strong>Name:</strong> {artist.name}</p>
                <p><strong>Songs:</strong> {artist.songs}</p>
                <p><strong>Genre:</strong> {artist.genre}</p>
                <p><strong>Debut Year:</strong> {artist.debutYear}</p>
                <button
                    className="mt-4 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                    onClick={onClose}
                >
                    <RiCloseLargeFill/>
                </button>
            </div>
        </div>
    );
};

export default function Album() {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);

    useEffect(() => {
        const fetchAlbumData = async () => {
            try {
                const response = await api.get('/album');
                setAlbums(response.data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchAlbumData();
    }, []);

    const openModal = (artist) => {
        setSelectedArtist(artist);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedArtist(null);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div className="flex justify-center items-center w-full py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 p-4 w-full">
                {albums.map((album) => {
                    const artist = { 
                        name: album.artist,
                        songs: album.no_of_songs,
                        image: album.image,
                        genre: album.genre,
                        debutYear: album.year,
                    };

                    return (
                        <div
                            key={album.id}
                            className="flex justify-center items-center flex-col bg-white rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
                        >
                            <div className="w-full">
                                <img
                                    className="w-full h-48 object-cover rounded-t-lg"
                                    src={`http://127.0.0.1:8000${album.image}`}
                                    alt={album.title}
                                />
                            </div>
                            <div className="px-4 py-3 w-full text-center">
                                <h2 className="text-xl font-bold text-gray-900">{album.title}</h2>
                                <p className="text-sm text-gray-600">{album.artist}</p>
                                <p className="text-sm text-gray-600">{album.year} - {album.genre}</p>
                                <div className="mt-2">
                                    <button
                                        className="text-indigo-600 underline hover:text-indigo-800"
                                        onClick={() => openModal(artist)} // Open modal with artist info
                                    >
                                        <VscPreview/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} artist={selectedArtist} />
        </div>
    );
}
