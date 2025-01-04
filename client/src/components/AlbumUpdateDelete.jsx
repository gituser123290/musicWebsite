import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { FaRegEdit, FaTrash } from "react-icons/fa";
import api from '../services/api';

const AlbumUpdateDelete = () => {
    const { id } = useParams();
    const [song, setSong] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const [songDetails, setSongDetails] = useState({
        title: '',
        album: '',
        song_cover: null,
        artist: '',
        no_of_listeners: '',
        streams: '',
        radio_airplay: '',
        downloads: '',
        social_media_mentions: '',
        duration: '',
        genre: '',
        track_number: '',
        popularity: '',
    });

    useEffect(() => {
        const fetchSongDetail = async () => {
            try {
                const response = await api.get(`/song/${id}/`);
                setSong(response.data);
                setSongDetails({
                    title: response.data.title,
                    album: response.data.album_detail.id,
                    song_cover: response.data.song_cover,
                    artist: response.data.artist_detail.id,
                    no_of_listeners: response.data.no_of_listeners,
                    streams: response.data.streams,
                    radio_airplay: response.data.radio_airplay,
                    downloads: response.data.downloads,
                    social_media_mentions: response.data.social_media_mentions,
                    duration: response.data.duration,
                    genre: response.data.genre,
                    track_number: response.data.track_number,
                    popularity: response.data.popularity,
                });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchSongDetail();
    }, [id]);

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

    const handleUpdateSong = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', songDetails.title);
            formData.append('album', songDetails.album);
            formData.append('artist', songDetails.artist);
            formData.append('no_of_listeners', songDetails.no_of_listeners);
            formData.append('streams', songDetails.streams);
            formData.append('radio_airplay', songDetails.radio_airplay);
            formData.append('downloads', songDetails.downloads);
            formData.append('social_media_mentions', songDetails.social_media_mentions);
            formData.append('duration', songDetails.duration);
            formData.append('genre', songDetails.genre);
            formData.append('track_number', songDetails.track_number);
            formData.append('popularity', songDetails.popularity);

            if (songDetails.song_cover) {
                formData.append('song_cover', songDetails.song_cover); // Append the image if present
            }

            const response = await api.put(`/song/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSong(response.data);
            closeCommentModal();
        } catch (error) {
            console.error('Error updating song:', error);
            alert('Failed to update song.');
        }
    };

    const deleteSong = async () => {
        try {
            await api.delete(`/song/${id}/`);
            setSong(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const openCommentModal = () => {
        setIsModalOpen(true);
    };

    const closeCommentModal = () => {
        setIsModalOpen(false);
    };

    if (loading) return <p>Loading song details...</p>;
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
                                    src={`http://localhost:8000${song.song_cover}`}
                                    alt="Song cover"
                                />
                            </div>
                            <hr />
                            <div className="p-2 columns-2 gap-20">
                                <h2 className="text-white text-2xl">{song.title}</h2>
                                <p className="text-white">Artist: {song.artist_detail.name}</p>
                                <p className="text-white">Album: {song.album_detail.title.substring(0, 10)}...</p>
                                <p className="text-white">Listners: {song.no_of_listeners}</p>
                                <p className="text-white">Streams: {song.streams}</p>
                                <p className="text-white">Radio Play: {song.radio_airplay}</p>
                                <p className="text-white">Downloads: {song.downloads}</p>
                                <p className="text-white">Mentions: {song.social_media_mentions}</p>
                                <p className="text-white">Length: {song.duration}</p>
                                <p className="text-white">Genre: {song.genre}</p>
                                <p className="text-white">Tracks: {song.track_number}</p>
                                <p className="text-white">Popularity: {song.popularity}</p>
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
                        <p>No song found!</p>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg w-1/3 columns-2">
                        <h2 className="text-xl mb-4">Update Song</h2>
                        <form onSubmit={handleUpdateSong}>
                            <div className="mb-2">
                                <label className="block text-gray-700">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={songDetails.title}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Album</label>
                                <input
                                    type="text"
                                    name="album"
                                    value={songDetails.album}
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
                                    value={songDetails.artist}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">No of Listners</label>
                                <input
                                    type="number"
                                    name="no_of_listeners"
                                    value={songDetails.no_of_listeners}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Streams</label>
                                <input
                                    type="number"
                                    name="streams"
                                    value={songDetails.streams}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Radio Air Play</label>
                                <input
                                    type="number"
                                    name="radio_airplay"
                                    value={songDetails.radio_airplay}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Downloads</label>
                                <input
                                    type="number"
                                    name="downloads"
                                    value={songDetails.downloads}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Social Media Metions</label>
                                <input
                                    type="number"
                                    name="social_media_mentions"
                                    value={songDetails.social_media_mentions}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
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
                            <div className="mb-2">
                                <label className="block text-gray-700">Track Number</label>
                                <input
                                    type="number"
                                    name="track_number"
                                    value={songDetails.track_number}
                                    onChange={handleInputChange}
                                    className="w-full p-1 border rounded-md"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-gray-700">Popularity</label>
                                <input
                                    type="number"
                                    name="popularity"
                                    value={songDetails.popularity}
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
export default AlbumUpdateDelete;
