import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { apiUrl } from '../../services/api';
import Loading from '../../layouts/Loading';
import axios from 'axios';

const token = sessionStorage.getItem('token')

const ArtistUpdateDelete = () => {
    const { id } = useParams();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalUpdateOpen, setIsUpdateModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const [artistDetails, setArtistDetails] = useState({
        name: '',
        genre: '',
        birth_date: '',
        nationality: '',
        biography: '',
        image: null,
        image_url: null,
    });

    useEffect(() => {
        const fetchArtistDetail = async () => {
            try {
                const response = await axios.get(`${apiUrl}/artists/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`
                    }
                });
                setArtist(response.data);
                setArtistDetails({
                    name: response.data.name,
                    genre: response.data.genre,
                    birth_date: response.data.birth_date,
                    nationality: response.data.nationality,
                    biography: response.data.biography,
                    image: response.data.image,
                    image_url: response.data.image_url,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchArtistDetail();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setArtistDetails((prevDetails) => ({
                ...prevDetails,
                [name]: files[0],
            }));
        } else {
            setArtistDetails((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    // ... Your existing update and delete handlers (handleUpdateartist, handleDelete)

    const handleUpdateartist = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('name', artistDetails.name);
            formData.append('genre', artistDetails.genre);
            formData.append('birth_date', artistDetails.birth_date);
            formData.append('nationality', artistDetails.nationality);
            formData.append('biography', artistDetails.biography);

            if (artistDetails.image && artistDetails.image instanceof File) {
                formData.append('image', artistDetails.image);
            }

            if (artistDetails.image_url && typeof artistDetails.image_url === 'string') {
                formData.append('image_url', artistDetails.image_url);
            }

            const response = await axios.put(`${apiUrl}/artists/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setArtist(response.data);
            alert('Artist updated successfully!');
            closeUpdateModal();
        } catch (error) {
            console.error('Error updating artist:', error);
            alert('Failed to update artist.');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${apiUrl}/artists/${id}/`);
            alert('Artist deleted successfully!');
            setArtist(null);
            closeDeleteModal();
            navigate(-1);
        } catch (error) {
            console.error('Error deleting artist:', error);
            alert('Failed to delete artist.');
        }
    };


    const openUpdateModal = () => setIsUpdateModalOpen(true);
    const closeUpdateModal = () => setIsUpdateModalOpen(false);
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    if (loading) return <Loading />;
    if (error) return <p className="text-red-500 text-center mt-6">Error: {error}</p>;

    return (
        <>
            <div className="p-4 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-block mb-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                    &larr; Back to Artists
                </button>

                <div className="bg-gray-900 rounded-xl shadow-xl p-6 md:flex md:space-x-6 items-center">
                    <div className="flex-shrink-0 mb-6 md:mb-0">
                        <img
                            src={artist?.image_url ? artist.image_url : artist.image}
                            alt={artist.name}
                            className="w-48 h-48 object-cover rounded-full border-4 border-green-600 shadow-lg"
                            loading="lazy"
                        />
                    </div>
                    <div className="text-gray-100 flex-grow">
                        <h1 className="text-4xl font-extrabold mb-3">{artist.name}</h1>
                        <div className="space-y-2 text-lg">
                            <p><span className="font-semibold text-green-400">Genre:</span> {artist?.genre || "N/A"}</p>
                            <p><span className="font-semibold text-green-400">Birth Date:</span> {artist.birth_date || "N/A"}</p>
                            <p><span className="font-semibold text-green-400">Nationality:</span> {artist.nationality || "N/A"}</p>
                            <p>
                                <span className="font-semibold text-green-400">Biography:</span><br />
                                <span className="block mt-1 text-gray-300 whitespace-pre-wrap max-h-40 overflow-auto">{artist.bio || "No biography available."}</span>
                            </p>

                            <ul className="flex space-x-4 mt-3">
                                {Object.entries(artist.social_media).map(([platform, url]) => (
                                    <li key={platform}>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-400 hover:text-green-600 transition-colors duration-200 font-semibold"
                                        >
                                            {platform}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6 flex space-x-4">
                            <button
                                onClick={openUpdateModal}
                                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow-md transition"
                                aria-label="Edit Artist"
                            >
                                <FaRegEdit size={20} />
                                <span>Edit</span>
                            </button>

                            <button
                                onClick={openDeleteModal}
                                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md shadow-md transition"
                                aria-label="Delete Artist"
                            >
                                <FaTrash size={20} />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Update Modal */}
            {isModalUpdateOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4">
                    <div className="bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-4 relative">
                        <button
                            onClick={closeUpdateModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold focus:outline-none"
                            aria-label="Close Update Modal"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold text-green-400 mb-2 text-center">Update Artist</h2>
                        <form
                            onSubmit={handleUpdateartist}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200"
                        >
                            <label className="block">
                                <span className="text-green-400 font-semibold block">Name</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={artistDetails.name}
                                    onChange={handleInputChange}
                                    className="w-full p-1 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </label>

                            <label className="block">
                                <span className="text-green-400 font-semibold block">Genre</span>
                                <input
                                    type="text"
                                    name="genre"
                                    value={artistDetails.genre}
                                    onChange={handleInputChange}
                                    className="w-full p-1 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>

                            <label className="block">
                                <span className="text-green-400 font-semibold block">Birth Date</span>
                                <input
                                    type="date"
                                    name="birth_date"
                                    value={artistDetails.birth_date}
                                    onChange={handleInputChange}
                                    className="w-full p-1 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>

                            <label className="block">
                                <span className="text-green-400 font-semibold block">Nationality</span>
                                <input
                                    type="text"
                                    name="nationality"
                                    value={artistDetails.nationality}
                                    onChange={handleInputChange}
                                    className="w-full p-1 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="text-green-400 font-semibold block">Biography</span>
                                <textarea
                                    name="biography"
                                    value={artistDetails.biography}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="text-green-400 font-semibold block">Artist Image (File Upload)</span>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    className="w-full text-gray-300"
                                />
                            </label>

                            <label className="block md:col-span-2">
                                <span className="text-green-400 font-semibold block">Artist Image URL</span>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={artistDetails.image_url || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Paste image URL here"
                                />
                            </label>

                            <button
                                type="submit"
                                className="md:col-span-2 w-full py-3 bg-green-600 rounded-md hover:bg-green-700 transition font-semibold"
                            >
                                Update Artist
                            </button>
                        </form>

                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isModalDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative text-gray-100">
                        <button
                            onClick={closeDeleteModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-3xl font-bold focus:outline-none"
                            aria-label="Close Delete Modal"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-semibold mb-4 text-center text-red-500">
                            Confirm Delete
                        </h3>
                        <p className="mb-6 text-center text-gray-300">
                            Are you sure you want to delete <strong>{artist.name}</strong>?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-md transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArtistUpdateDelete;
