import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaRegEdit, FaTrash } from "react-icons/fa";
import api from '../../services/api';
import Loading from '../../layouts/Loading';

export default function AlbumUpdateDelete () {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const [songDetails, setSongDetails] = useState({
        name: '',
        artist: '',
        cover_image: null,
        songs: null,
        release_date: '',
    });

    useEffect(() => {
        const fetchAlbumDetail = async () => {
            const token = localStorage.getItem('token');
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

                const response = await api.get(`/albums/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data) {
                    setSong(response.data);
                    setSongDetails({
                        name: response.data.name || '',
                        artist_id: response.data.artist ? response.data.artist_id : '',
                        release_date: response.data.release_date || '',
                        cover_image: response.data.song_cover || '',
                        songs: response.data.songs ? response.data.songs.id : '',
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
    }, [id,navigate]);

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
        const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
        }
        try {
            const formData = new FormData();
            formData.append('name', songDetails.name);
            formData.append('artist', songDetails.artist);
            formData.append('release_date', songDetails.release_date);
            formData.append('songs', songDetails.songs);

            if (songDetails.cover_image) {
                formData.append('cover_image', songDetails.cover_image);
            }

            const response = await api.put(`/albums/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSong(response.data);
            closeCommentModal();
        } catch (error) {
            alert(`Failed to update song.${error.message}`);
        }
    };

    const deleteSong = async () => {
        const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
        try {
            await api.delete(`/albums/${id}/`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSong(null);
        } catch (error) {
            alert(`Unauthorised ${error.message}`)
            navigate(`/albums/${id}/`)
        }
    };

    const openCommentModal = () => {
        setIsModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <div><Loading /></div>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <div className="p-4 bg-orange-500 rounded-md hover:bg-orange-600 shadow-xl transition-colors duration-200 cursor-pointer">
                <button onClick={() => navigate(-1)} className="back-btn">Back to Posts</button>
            </div>
            <div className="flex flex-col min-h-screen bg-gray-200">
                <div className="flex items-center justify-center w-full flex-1 bg-gray-200 pt-4 pb-16">
                    <div className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-gray-800 p-2 rounded-md shadow-lg">
                        <h1 className="text-center text-cyan-600 text-2xl mb-2">Song Detail</h1>
                        {song ? (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="mb-2">
                                    <img
                                        className="w-full h-auto object-cover rounded-md"
                                        src={song.cover_image}
                                        alt="Song cover"
                                    />
                                </div>
                                <hr />
                                <div className="p-2 columns-2 gap-20">
                                    <h2 className="text-white text-2xl">{song.name}</h2>
                                    <p className="text-white">Artist: {song.artist?.name}</p>
                                    <p className="text-white">song Name: {song.title}</p>
                                    <p className="text-white">Duration: {song.duration}</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={openCommentModal}
                                            className="mt-2 text-3xl text-white px-4 py-2 rounded-md hover:text-sky-400"
                                        >
                                            <FaRegEdit />
                                        </button>
                                        <button
                                            onClick={deleteSong}
                                            className="mt-2 text-3xl text-white px-4 py-2 rounded-md hover:text-red-600"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No Album found!</p>
                        )}
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-md shadow-lg w-1/3 columns-2">
                            <h2 className="text-xl mb-4">Update Album</h2>
                            <form onSubmit={handleUpdateSong}>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={songDetails.name}
                                        onChange={handleInputChange}
                                        className="w-full p-1 border rounded-md"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Artist</label>
                                    <input
                                        type="text"
                                        name="artist"
                                        value={songDetails.artist}
                                        onChange={handleInputChange}
                                        className="w-full p-1 border rounded-md"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Song Cover</label>
                                    <input
                                        type="file"
                                        name="cover_image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Song</label>
                                    <input
                                        type="file"
                                        name="songs"
                                        value={songDetails.songs}
                                        onChange={handleInputChange}
                                        className="w-full p-1 border rounded-md"
                                    />
                                </div>
                                <div className="mb-2">
                                    <label className="block text-gray-700">Release Date</label>
                                    <input
                                        type="date"
                                        name="release_date"
                                        value={songDetails.release_date}
                                        onChange={handleInputChange}
                                        className="w-full p-1 border rounded-md"
                                    />
                                </div>
                                <div className="mb-2">
                                    <button
                                        type="submit"
                                        className="w-full p-2 bg-blue-500 text-white rounded-md"
                                    >
                                        Submit
                                    </button>
                                </div>
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
}
