import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from '../services/api';

export default function ArtistPage() {
    const [error, setError] = useState(null);
    const [artists, setArtists] = useState([]);
    const [songData, setSongData] = useState({
        name: "",
        artist_id: "",
        release_date: "",
        cover_image: null,
    });

    const navigate = useNavigate();

    const token=sessionStorage.getItem('token')

    useEffect(() => {
        const fetchArtists = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login'); 
                return;
            }
            try {
                const response = await api.get("/artists/", {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                });
                setArtists(response.data);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load artists");
            }
        };

        fetchArtists();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setSongData((prevDetails) => ({
                ...prevDetails,
                [name]: files[0],
            }));
        } else {
            setSongData((prevDetails) => ({
                ...prevDetails,
                [name]: value,
            }));
        }
    };

    const handleArtist = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", songData.name);
            formData.append("artist_id", songData.artist_id);
            formData.append("release_date", songData.release_date);

            if (songData.cover_image) {
                formData.append("cover_image", songData.cover_image);
            } else {
                formData.append("cover_image", null);
            }

            const token = sessionStorage.getItem("token");
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await api.post('/albums/create/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSongData(response.data);
            navigate('/album');
        } catch (error) {
            setError(error.response?.data?.message || error.message || "Failed to create album")
        }
    };

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="flex w-full min-h-screen justify-center items-center p-4 bg-slate-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mb-20">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Album Information {token}</h2>
                <form onSubmit={handleArtist}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">Album Name</label>
                            <input
                                type="text"
                                name="name" 
                                id="name"
                                onChange={handleInputChange}
                                placeholder="Enter Album name"
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700">Artist</label>
                            <select
                                name="artist_id"
                                value={songData.artist_id}
                                onChange={handleInputChange}
                                className="w-full p-3 border rounded-md"
                                required
                            >
                                <option value="">Select Artist</option>
                                {artists.map((artist) => (
                                    <option key={artist.id} value={artist.id}>{artist.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="release_date" className="block text-lg text-gray-700 mb-2">Release Date</label>
                            <input
                                type="date"
                                name="release_date"
                                id="release_date"
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="cover_image" className="block text-lg text-gray-700 mb-2">Image</label>
                            <input
                                type="file"
                                name="cover_image"
                                id="cover_image"
                                accept="image/*"
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:ring-4 focus:ring-green-500 focus:outline-none"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
