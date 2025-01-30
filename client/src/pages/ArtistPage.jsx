import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ArtistPage() {
    const [error, setError] = useState(null);
    const [artistData, setArtistData] = useState({
        name: "",
        bio: "",
        image_url: "",
        website: "",
        social_media: "",
        nationality: "",
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setArtistData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handleArtist = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const formData = new FormData();
        for (let key in artistData) {
            if (key === 'social_media') {
                try {
                    // You can structure social_media as JSON here, if required
                    formData.append(key, JSON.stringify(artistData[key]));
                } catch (error) {
                    console.log("Error in parsing social media JSON", error);
                }
            } else {
                formData.append(key, artistData[key]);
            }
        }
        try {
            const response = await api.post('/artist/create/', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Token ${token}`,
                },
            });
            setArtistData(response.data);
            navigate('/artist');
        } catch (error) {
            setError(error);
            console.log(error.message);
        }
    };

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className="flex w-full min-h-screen justify-center items-center p-4 bg-slate-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mb-20">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Artist Information
                </h2>
                <form onSubmit={handleArtist}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-lg text-gray-700 mb-2">
                                Artist Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter Artist name"
                                value={artistData.name}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="bio" className="block text-lg text-gray-700 mb-2">
                                Bio
                            </label>
                            <input
                                type="text"
                                name="bio"
                                id="bio"
                                placeholder="Enter Bio"
                                value={artistData.bio}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="image_url" className="block text-lg text-gray-700 mb-2">
                                Image URL
                            </label>
                            <input
                                type="text"
                                name="image_url"
                                id="image_url"
                                placeholder="Enter Image URL"
                                value={artistData.image_url}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="website" className="block text-lg text-gray-700 mb-2">
                                Website
                            </label>
                            <input
                                type="text"
                                name="website"
                                id="website"
                                placeholder="Enter Website URL"
                                value={artistData.website}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="social_media" className="block text-lg text-gray-700 mb-2">
                                Social Media (JSON format)
                            </label>
                            <input
                                type="text"
                                name="social_media"
                                id="social_media"
                                placeholder='{"twitter": "url", "instagram": "url"}'
                                value={artistData.social_media}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="nationality" className="block text-lg text-gray-700 mb-2">
                                Nationality
                            </label>
                            <input
                                type="text"
                                name="nationality"
                                id="nationality"
                                value={artistData.nationality}
                                placeholder="Nationality Name"
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
